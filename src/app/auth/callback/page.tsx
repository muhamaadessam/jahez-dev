"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/react";

export default function AuthCallbackPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  return (
    <AuthenticateWithRedirectCallback
      signInUrl="/auth/sign-in"
      signUpUrl="/auth/sign-up"
      continueSignUpUrl="/auth/sign-up"
      signInForceRedirectUrl="/"
      signUpForceRedirectUrl="/"
    />
  );
}
