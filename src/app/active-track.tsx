"use client";

import { useAuth } from "@clerk/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { tracks } from "../content/questions";
import { localeFromPathname, localizedHref, messages, type Locale } from "../i18n";
import { isTrackScopedPath, resolveActiveTrack, withTrack } from "../tracks/active-track";
import { loadPublicTracks, loadTrackPreferences, type TrackPreferenceState } from "../tracks/preferences";
import { LoadingPlaceholder } from "./loading-placeholder";
import { TrackLogo } from "./track-logos";
import { FilterDialog } from "./filter-dialog";

type Phase = "loading" | "ready" | "error";
type ActiveTrackValue = {
  phase: Phase;
  authenticated: boolean;
  activeTrack: (typeof tracks)[number] | null;
  selectableTracks: typeof tracks;
  invalidTrack: boolean;
  setActiveTrack: (trackId: string) => void;
  trackOnlyHref: (path: string) => string;
  retry: () => void;
};

const ActiveTrackContext = createContext<ActiveTrackValue | null>(null);

export function AnonymousActiveTrackProvider({ children }: { children: ReactNode }) {
  return <ActiveTrackProvider authenticated={false}>{children}</ActiveTrackProvider>;
}

export function AuthenticatedActiveTrackProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  return <ActiveTrackProvider authenticated={Boolean(isLoaded && isSignedIn)} loading={!isLoaded} userId={userId} getToken={getToken}>{children}</ActiveTrackProvider>;
}

function ActiveTrackProvider({ children, authenticated, loading = false, userId, getToken }: {
  children: ReactNode;
  authenticated: boolean;
  loading?: boolean;
  userId?: string | null;
  getToken?: ReturnType<typeof useAuth>["getToken"];
}) {
  const pathname = usePathname() ?? "/";
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
  const carriesTrackContext = isTrackScopedPath(normalizedPathname);
  const locale = localeFromPathname(pathname);
  const [query, setQuery] = useState("");
  const [urlReady, setUrlReady] = useState(false);
  const requestedTrack = useMemo(() => new URLSearchParams(query).get("track"), [query]);
  const [preferences, setPreferences] = useState<TrackPreferenceState | null>(null);
  const [publicTracks, setPublicTracks] = useState<typeof tracks>(tracks);
  const [phase, setPhase] = useState<Phase>(loading || authenticated ? "loading" : "ready");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const sync = () => { setQuery(window.location.search); setUrlReady(true); };
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("urlchange", sync);
    return () => { window.removeEventListener("popstate", sync); window.removeEventListener("urlchange", sync); };
  }, [pathname]);

  useEffect(() => {
    if (loading) { setPhase("loading"); return; }
    if (!authenticated || !userId || !getToken) { setPreferences(null); setPhase("ready"); return; }
    let current = true;
    setPhase("loading");
    loadTrackPreferences({ locale, getToken })
      .then((state) => { if (current) { setPreferences(state); setPhase("ready"); } })
      .catch(() => { if (current) setPhase("error"); });
    return () => { current = false; };
  }, [authenticated, getToken, loading, locale, reload, userId]);

  useEffect(() => {
    if (loading || authenticated) return;
    let current = true;
    loadPublicTracks({ locale }).then((options) => {
      if (!current) return;
      const dynamicTracks = options.flatMap((option) => option.slug ? [{ id: option.id, slug: option.slug, name: option.name }] : []);
      setPublicTracks(dynamicTracks);
    }).catch(() => { if (current) setPublicTracks(tracks); });
    return () => { current = false; };
  }, [authenticated, loading, locale]);

  useEffect(() => {
    const retry = () => setReload((value) => value + 1);
    window.addEventListener("track-preferences-changed", retry);
    return () => window.removeEventListener("track-preferences-changed", retry);
  }, []);

  const catalogueTracks = useMemo(() => {
    const source = authenticated && preferences ? preferences.tracks : publicTracks;
    return source.flatMap((track) => {
      const slug = track.slug ?? publicTracks.find(({ id }) => id === track.id)?.slug ?? track.id;
      return slug ? [{ id: track.id, slug, name: track.name }] : [];
    });
  }, [authenticated, preferences, publicTracks]);

  const resolution = resolveActiveTrack({
    requestedTrack,
    tracks: catalogueTracks,
    activeTrackIds: authenticated ? (preferences?.tracks.map(({ id }) => id) ?? []) : catalogueTracks.map(({ id }) => id),
    preferenceTrackIds: preferences?.preferences.map(({ trackId }) => trackId) ?? [],
    defaultTrackId: preferences?.preferences.find(({ isDefault }) => isDefault)?.trackId ?? null,
    authenticated,
  });
  useEffect(() => {
    if (!carriesTrackContext) {
      delete document.documentElement.dataset.track;
      return;
    }
    const slug = resolution.activeTrack?.slug ?? resolution.activeTrack?.id;
    if (slug) {
      document.documentElement.dataset.track = slug;
      try {
        localStorage.setItem("selected-track", slug);
      } catch {
        // Storage unavailable
      }
    } else {
      delete document.documentElement.dataset.track;
    }
  }, [carriesTrackContext, resolution.activeTrack]);

  const setActiveTrack = useCallback((trackId: string) => {
    const track = resolution.selectableTracks.find(({ id, slug }) => id === trackId || slug === trackId);
    if (!track) return;
    const params = new URLSearchParams(window.location.search);
    params.set("track", track.slug);
    params.delete("topic");
    params.delete("topics");
    params.delete("started");
    const cleanPathname = window.location.pathname.replace(/\/+$/, "") || "/";
    window.history.replaceState(null, "", `${cleanPathname}?${params}`);
    window.dispatchEvent(new Event("urlchange"));
  }, [resolution.selectableTracks]);
  const value = useMemo<ActiveTrackValue>(() => {
    const effectivePhase = !urlReady || (authenticated && !preferences && phase === "ready") ? "loading" : phase;
    return {
      phase: effectivePhase,
      authenticated,
      ...resolution,
      activeTrack: effectivePhase === "loading" && !requestedTrack ? null : resolution.activeTrack,
      setActiveTrack,
      trackOnlyHref: (path) => withTrack(path, resolution.activeTrack?.slug ?? ""),
      retry: () => setReload((current) => current + 1),
    };
  }, [authenticated, phase, preferences, query, requestedTrack, resolution, setActiveTrack, urlReady]);
  return <ActiveTrackContext.Provider value={value}>{children}</ActiveTrackContext.Provider>;
}

export function useActiveTrack(): ActiveTrackValue {
  const value = useContext(ActiveTrackContext);
  if (!value) throw new Error("ActiveTrackProvider is required");
  return value;
}

export function ActiveTrackSelector({ locale, filterTitle, filterSummary, filterActiveCount = 0, onClear, filterContent, action }: {
  locale: Locale;
  filterTitle?: string;
  filterSummary?: string;
  filterActiveCount?: number;
  onClear?: () => void;
  filterContent?: (controls: { close: () => void }) => ReactNode;
  action?: ReactNode;
}) {
  const { phase, authenticated, activeTrack, selectableTracks, invalidTrack, setActiveTrack, retry } = useActiveTrack();
  const copy = messages[locale];
  if (phase === "loading") return <LoadingPlaceholder variant="track" />;
  if (phase === "error") return <div className="empty-state"><h2>{copy.activeTrackUnavailable}</h2><button className="button primary" type="button" onClick={retry}>{copy.tracksRetry}</button></div>;
  if (invalidTrack) return <ActiveTrackRecovery locale={locale} />;
  if (!activeTrack) return <div className="empty-state"><h2>{copy.emptyTrackTitle}</h2><p>{copy.emptyTrackDescription}</p>{authenticated && <Link className="button" href={localizedHref(locale, "/my-tracks")}>{copy.manageTrackPreferences}</Link>}</div>;
  return <div className="active-track-selector">
    <FilterDialog
      locale={locale}
      title={filterTitle ?? copy.activeTrack}
      subtitle={filterTitle ? copy.interviewSubtitle : undefined}
      summary={filterSummary ?? activeTrack.name}
      activeCount={1 + filterActiveCount}
      onClear={onClear}
    >
      {({ close }) => <>
        <section className="filter-dialog-section track-filter-section">
          <div className="filter-dialog-section-heading">
            <span className="section-title-label">{copy.activeTrack}</span>
            <span className="active-track-badge-pill" dir="ltr">{activeTrack.name}</span>
          </div>
          <div className="track-filter-options">
            {selectableTracks.map((track) => {
              const selected = track.id === activeTrack.id;
              return <button className={`track-filter-option${selected ? " selected" : ""}`} type="button" key={track.id} aria-pressed={selected} onClick={() => { setActiveTrack(track.id); close(); }}>
                <span className="track-filter-option-logo" aria-hidden="true"><TrackLogo trackId={track.id} size={28} /></span>
                <span className="track-filter-option-copy"><strong dir="ltr">{track.name}</strong></span>
                <span className="track-filter-check" aria-hidden="true">
                  <span className="track-filter-radio-dot" />
                </span>
              </button>;
            })}
          </div>
        </section>
        {filterContent?.({ close })}
      </>}
    </FilterDialog>
    {(authenticated || action) && <div className="active-track-selector-actions">
      {authenticated && <Link className="text-link" href={localizedHref(locale, "/my-tracks")}>{copy.manageTrackPreferences}</Link>}
      {action}
    </div>}
  </div>;
}

export function ActiveTrackRecovery({ locale, invalidTopic = false }: { locale: Locale; invalidTopic?: boolean }) {
  const { authenticated, selectableTracks, setActiveTrack } = useActiveTrack();
  const copy = messages[locale];
  return <div className="empty-state"><h2>{invalidTopic ? copy.invalidTrackTopicTitle : copy.invalidTrackTitle}</h2><p>{copy.invalidTrackDescription}</p><div className="actions">{selectableTracks.map((track) => <button className="button" key={track.id} type="button" onClick={() => setActiveTrack(track.id)}>{copy.changeTrackTo} {track.name}</button>)}{authenticated && <Link className="button" href={localizedHref(locale, "/my-tracks")}>{copy.manageTrackPreferences}</Link>}</div></div>;
}

export function ActiveTrackLink({ locale, path, className, children }: { locale: Locale; path: string; className?: string; children: ReactNode }) {
  const { trackOnlyHref } = useActiveTrack();
  return <Link className={className} href={localizedHref(locale, trackOnlyHref(path))}>{children}</Link>;
}

export function TrackContextGuard({ locale, trackId, children }: { locale: Locale; trackId: string; children: ReactNode }) {
  const { phase, activeTrack, invalidTrack } = useActiveTrack();
  if (phase !== "ready") return <section className="shell section"><ActiveTrackSelector locale={locale} /></section>;
  if (invalidTrack || !activeTrack || activeTrack.id !== trackId) return <section className="shell section"><ActiveTrackRecovery locale={locale} invalidTopic /></section>;
  return children;
}
