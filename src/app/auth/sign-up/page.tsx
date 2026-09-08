"use client";

import { SignUp } from "@clerk/react";

export default function SignUpPage() {
  return <section className="container" style={{ display: "grid", justifyItems: "center", paddingBlock: "3rem" }}>
    <h1>JahezDev</h1>
    {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && <SignUp routing="hash" signInUrl="/auth/sign-in" forceRedirectUrl="/" signInForceRedirectUrl="/" appearance={{ elements: { headerSubtitle: { display: "none" } } }} />}
  </section>;
}
