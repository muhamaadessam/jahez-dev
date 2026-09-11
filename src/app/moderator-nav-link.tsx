"use client";

import { useAuth } from "@clerk/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { messages, type Locale } from "../i18n";
import { hasModeratorAccess } from "../moderation/api";

const enabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export function ModeratorNavLink({ locale, href, onClick }: { locale: Locale; href: string; onClick?: () => void }) {
  if (!enabled) return null;
  return <EnabledModeratorNavLink locale={locale} href={href} onClick={onClick} />;
}

function EnabledModeratorNavLink({ locale, href, onClick }: { locale: Locale; href: string; onClick?: () => void }) {
  const copy = messages[locale];
  const { isSignedIn, userId, getToken } = useAuth();
  const [moderator, setModerator] = useState(false);

  useEffect(() => {
    let current = true;
    if (!isSignedIn || !userId) { setModerator(false); return; }
    hasModeratorAccess({ getToken }).then((allowed) => { if (current) setModerator(allowed); }).catch(() => { if (current) setModerator(false); });
    return () => { current = false; };
  }, [getToken, isSignedIn, userId]);

  if (!moderator) return null;

  return (
    <>
      <span className="nav-divider" aria-hidden="true" />
      <Link href={href} prefetch={false} onClick={onClick}>
        {copy.moderator}
      </Link>
    </>
  );
}
