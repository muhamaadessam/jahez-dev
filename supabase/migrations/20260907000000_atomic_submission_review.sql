-- Keep every Submission state change and publication graph in one transaction.

create or replace function public.create_submission_for_account(
  p_account_id text,
  p_track_id text,
  p_topic_ids jsonb,
  p_difficulty public.difficulty_level,
  p_payload jsonb,
  p_idempotency_key text,
  p_duplicate_of uuid,
  p_display_name text
)
returns table (submission_id uuid, submission_status text, duplicate_advisory boolean)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  existing public.submissions%rowtype;
  slot_reason text;
  created_id uuid;
begin
  if nullif(btrim(p_account_id), '') is null then raise exception 'unauthenticated'; end if;

  select * into existing
  from public.submissions
  where submitted_by = p_account_id and idempotency_key = p_idempotency_key
  for update;

  if found then
    return query select existing.id, existing.status::text, existing.duplicate_advisory;
    return;
  end if;

  if exists (select 1 from public.account_roles where user_id = p_account_id and suspended) then
    raise exception 'submission_suspended';
  end if;
  if not exists (
    select 1
    from public.account_track_preferences preference
    join public.tracks track on track.id = preference.track_id and track.is_active
    where preference.user_id = p_account_id and preference.track_id = p_track_id
  ) then raise exception 'track_preference_required'; end if;
  if jsonb_typeof(p_topic_ids) <> 'array' or exists (
    select 1
    from jsonb_array_elements_text(p_topic_ids) topic_id
    left join public.topics topic on topic.id = topic_id
    where topic.id is null or topic.track_id <> p_track_id
  ) then raise exception 'taxonomy_invalid'; end if;

  slot_reason := public.claim_submission_slot_reason(p_account_id);
  if slot_reason <> 'allowed' then raise exception '%', slot_reason; end if;

  insert into public.submissions (
    submitted_by, status, track_id, topic_ids, difficulty, payload,
    idempotency_key, duplicate_advisory, duplicate_of, display_name, license_consent
  ) values (
    p_account_id, 'pending', p_track_id, p_topic_ids, p_difficulty, p_payload,
    p_idempotency_key, p_duplicate_of is not null, p_duplicate_of, p_display_name, true
  ) returning id into created_id;

  insert into public.submission_revisions (
    submission_id, revision_number, submitted_by, track_id, topic_ids, difficulty, payload
  ) values (created_id, 1, p_account_id, p_track_id, p_topic_ids, p_difficulty, p_payload);

  insert into public.moderation_audit_events (
    actor_user_id, action, target_type, target_id, metadata
  ) values (
    'user:' || encode(digest(p_account_id, 'sha256'), 'hex'),
    'submission_created', 'submission', created_id::text,
    jsonb_build_object('duplicate_advisory', p_duplicate_of is not null)
  );

  return query select created_id, 'pending'::text, p_duplicate_of is not null;
end;
$$;

create or replace function public.publish_submission_for_moderator(
  p_actor_id text,
  p_submission_id uuid,
  p_imported jsonb default null
)
returns table (question_id text, question_slug text, submission_status text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  submission public.submissions%rowtype;
  imported jsonb;
  topic_ids text[];
  related_slugs text[];
  next_submission_revision integer;
  next_question_number integer;
  next_question_id text;
  next_slug text;
  question_revision_id uuid;
begin
  if nullif(btrim(p_actor_id), '') is null then raise exception 'unauthenticated'; end if;

  select * into submission from public.submissions where id = p_submission_id for update;
  if not found then raise exception 'not_found'; end if;

  if submission.status = 'published' then
    select question.id, question.slug into question_id, question_slug
    from public.interview_questions question
    where question.id = submission.published_question_id;
    return query select question_id, question_slug, 'published'::text;
    return;
  end if;

  if p_imported is not null then
    if submission.status not in ('pending', 'in_review', 'changes_requested', 'approved') then
      raise exception 'submission_not_reviewable';
    end if;
    if p_imported ->> 'trackId' <> submission.track_id then raise exception 'import_taxonomy_mismatch'; end if;
    imported := jsonb_set(p_imported, '{contributorUsername}', to_jsonb(coalesce(submission.display_name, 'Community contributor')), true);
    select array_agg(value order by position) into topic_ids
    from jsonb_array_elements_text(imported -> 'topicIds') with ordinality as topics(value, position);
    if coalesce(cardinality(topic_ids), 0) = 0 or cardinality(topic_ids) <> (select count(distinct topic_id) from unnest(topic_ids) topic_id) then
      raise exception 'import_topics_invalid';
    end if;
    if (select count(*) from public.topics topic where topic.id = any(topic_ids) and topic.track_id = submission.track_id) <> cardinality(topic_ids) then
      raise exception 'import_taxonomy_mismatch';
    end if;

    select coalesce(array_agg(value order by position), array[]::text[]) into related_slugs
    from jsonb_array_elements_text(coalesce(imported -> 'relatedQuestionSlugs', '[]'::jsonb)) with ordinality as related(value, position);
    if cardinality(related_slugs) <> (select count(distinct slug) from unnest(related_slugs) slug) then
      raise exception 'import_related_questions_invalid';
    end if;
    if (select count(*) from public.interview_questions question where question.slug = any(related_slugs) and question.track_id = submission.track_id and question.published_revision_id is not null) <> cardinality(related_slugs) then
      raise exception 'import_related_questions_invalid';
    end if;

    select coalesce(max(revision_number), 0) + 1 into next_submission_revision
    from public.submission_revisions where submission_id = submission.id;
    insert into public.submission_revisions (
      submission_id, revision_number, submitted_by, track_id, topic_ids, difficulty, payload
    ) values (
      submission.id, next_submission_revision, submission.submitted_by, submission.track_id,
      to_jsonb(topic_ids), (imported ->> 'difficulty')::public.difficulty_level, imported
    );
    update public.submissions
    set status = 'approved', topic_ids = to_jsonb(topic_ids), difficulty = (imported ->> 'difficulty')::public.difficulty_level,
      payload = imported, revision_number = next_submission_revision, review_notes = null,
      last_error = null, reviewed_by = p_actor_id, reviewed_at = now()
    where id = submission.id;
  else
    if submission.status <> 'approved' then raise exception 'submission_not_approved'; end if;
    imported := submission.payload;
    select array_agg(value order by position) into topic_ids
    from jsonb_array_elements_text(imported -> 'topicIds') with ordinality as topics(value, position);
    if coalesce(cardinality(topic_ids), 0) = 0 then raise exception 'import_topics_invalid'; end if;
    select coalesce(array_agg(value order by position), array[]::text[]) into related_slugs
    from jsonb_array_elements_text(coalesce(imported -> 'relatedQuestionSlugs', '[]'::jsonb)) with ordinality as related(value, position);
  end if;

  perform pg_advisory_xact_lock(hashtextextended('publish:' || submission.track_id, 0));
  select coalesce(max((substring(id from '([0-9]{3})$'))::integer), 0) + 1 into next_question_number
  from public.interview_questions where track_id = submission.track_id;
  if next_question_number > 999 then raise exception 'question_id_capacity_reached'; end if;
  next_question_id := regexp_replace(submission.track_id, '[^a-z0-9]', '', 'g') || '-' || lpad(next_question_number::text, 3, '0');
  next_slug := trim(both '-' from regexp_replace(lower(imported #>> '{translations,en,question}'), '[^a-z0-9]+', '-', 'g'));
  if length(next_slug) < 3 then next_slug := submission.track_id || '-' || next_question_id; end if;
  if exists (select 1 from public.interview_questions question where question.slug = next_slug) then next_slug := next_slug || '-' || next_question_id; end if;

  insert into public.interview_questions (id, slug, track_id, difficulty)
  values (next_question_id, next_slug, submission.track_id, (imported ->> 'difficulty')::public.difficulty_level);
  insert into public.question_revisions (question_id, revision_number, status, reviewed_at, created_by)
  values (next_question_id, 1, 'draft', current_date, p_actor_id)
  returning id into question_revision_id;
  insert into public.question_revision_locales (
    revision_id, locale, question, short_answer, explanation, code_example, common_mistakes, follow_up_questions, sources
  ) values
    (question_revision_id, 'ar', imported #>> '{translations,ar,question}', imported #>> '{translations,ar,shortAnswer}', imported #>> '{translations,ar,explanation}', imported #>> '{translations,ar,codeExample}', imported #> '{translations,ar,commonMistakes}', imported #> '{translations,ar,followUpQuestions}', imported #> '{translations,ar,sources}'),
    (question_revision_id, 'en', imported #>> '{translations,en,question}', imported #>> '{translations,en,shortAnswer}', imported #>> '{translations,en,explanation}', imported #>> '{translations,en,codeExample}', imported #> '{translations,en,commonMistakes}', imported #> '{translations,en,followUpQuestions}', imported #> '{translations,en,sources}');
  insert into public.question_topics (question_id, topic_id)
  select next_question_id, topic_id from unnest(topic_ids) topic_id;
  insert into public.question_follow_ups (source_revision_id, target_question_id, position)
  select question_revision_id, question.id, related.position
  from unnest(related_slugs) with ordinality as related(slug, position)
  join public.interview_questions question on question.slug = related.slug and question.track_id = submission.track_id;
  update public.question_revisions set status = 'published', published_at = now() where id = question_revision_id;
  update public.interview_questions
  set published_revision_id = question_revision_id, visibility = 'community', source_submission_id = submission.id,
    community_contributor_user_id = submission.submitted_by,
    community_contributor_username = coalesce(submission.display_name, 'Community contributor'),
    community_published_at = now()
  where id = next_question_id;
  update public.submissions
  set status = 'published', published_question_id = next_question_id, reviewed_by = p_actor_id,
    reviewed_at = now(), last_error = null
  where id = submission.id;
  insert into public.moderation_audit_events (actor_user_id, action, target_type, target_id, metadata)
  values (
    'user:' || encode(digest(p_actor_id, 'sha256'), 'hex'),
    case when p_imported is null then 'submission_published' else 'submission_imported_and_published' end,
    'question', next_question_id,
    jsonb_build_object('submission_id', submission.id, 'revision_id', question_revision_id)
  );

  return query select next_question_id, next_slug, 'published'::text;
end;
$$;

revoke all on function public.create_submission_for_account(text, text, jsonb, public.difficulty_level, jsonb, text, uuid, text) from public, anon, authenticated;
revoke all on function public.publish_submission_for_moderator(text, uuid, jsonb) from public, anon, authenticated;
grant execute on function public.create_submission_for_account(text, text, jsonb, public.difficulty_level, jsonb, text, uuid, text) to service_role;
grant execute on function public.publish_submission_for_moderator(text, uuid, jsonb) to service_role;
