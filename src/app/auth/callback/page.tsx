"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/react";

export default function AuthCallbackPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  return (
    <section className="container auth-page" style={{ display: "grid", justifyItems: "center", paddingBlock: "3rem" }}>
      <div className="auth-page-card" aria-busy="true">
        <span className="eyebrow">JahezDev</span>
        <h1>…</h1>
        <p className="auth-page-lead">…</p>
        <div className="loading-placeholder" aria-hidden="true">
          <span className="loading-skeleton loading-skeleton-wide" />
          <span className="loading-skeleton loading-skeleton-medium" />
        </div>
        <AuthenticateWithRedirectCallback
          signInUrl="/auth/sign-in"
          signUpUrl="/auth/sign-up"
          continueSignUpUrl="/auth/sign-up"
          signInForceRedirectUrl="/"
          signUpForceRedirectUrl="/"
        />
      </div>
    </section>
  );
}
