"use client";

import { SignIn } from "@clerk/react";

export default function SignInPage() {
  return <section className="container" style={{ display: "grid", justifyItems: "center", paddingBlock: "3rem" }}>
    <h1>JahezDev</h1>
    {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && <SignIn routing="hash" signUpUrl="/auth/sign-up" forceRedirectUrl="/" signUpForceRedirectUrl="/" appearance={{ elements: { headerSubtitle: { display: "none" } } }} />}
  </section>;
}
