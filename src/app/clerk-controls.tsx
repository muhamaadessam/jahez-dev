"use client";

import { useAuth } from "@clerk/react";
import { messages, type Locale } from "../i18n";
import { AccountMenu, AuthDialogTrigger } from "./auth-dialog";

const enabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export function ClerkControls({ locale, myTracksHref, moderatorHref }: { locale: Locale; myTracksHref: string; moderatorHref: string }) {
  if (!enabled) return null;
  return <EnabledClerkControls locale={locale} myTracksHref={myTracksHref} moderatorHref={moderatorHref} />;
}

function EnabledClerkControls({ locale, myTracksHref, moderatorHref }: { locale: Locale; myTracksHref: string; moderatorHref: string }) {
  const copy = messages[locale];
  const { isSignedIn } = useAuth();

  return (
    <div className="auth-controls">
      {!isSignedIn ? (
        <>
          <AuthDialogTrigger locale={locale} className="auth-button">{copy.signIn}</AuthDialogTrigger>
          <AuthDialogTrigger locale={locale} mode="signUp" className="auth-button auth-button-primary">{copy.signUp}</AuthDialogTrigger>
        </>
      ) : (
        <AccountMenu locale={locale} myTracksHref={myTracksHref} moderatorHref={moderatorHref} showModerator={false} />
      )}
    </div>
  );
}
