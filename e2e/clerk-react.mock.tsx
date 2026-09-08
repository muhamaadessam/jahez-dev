"use client";

import { useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => {};
const signedIn = () => typeof window !== "undefined" && localStorage.getItem("playwright-authenticated") === "true";
const useSignedIn = () => useSyncExternalStore(subscribe, signedIn, () => false);
const getToken = async () => "playwright-token";

export function ClerkProvider({ children }: { children: ReactNode }) { return children; }
export function useAuth() {
  const isSignedIn = useSignedIn();
  return { isLoaded: true, isSignedIn, userId: isSignedIn ? "user_playwright" : null, getToken };
}
export function useUser() {
  const verified = typeof window === "undefined" || localStorage.getItem("playwright-email-verified") !== "false";
  return { user: { username: null, update: async () => ({}), primaryEmailAddress: { emailAddress: "playwright@example.com", verification: { status: verified ? "verified" : "unverified" } } } };
}
export function Show({ when, children }: { when: "signed-in" | "signed-out"; children: ReactNode }) {
  const isSignedIn = useSignedIn();
  return (when === "signed-in") === isSignedIn ? children : null;
}
export function SignInButton({ children }: { children: ReactNode }) { return children; }
export function SignUpButton({ children }: { children: ReactNode }) { return children; }
export function UserButton() { return null; }
export function useClerk() { return { signOut: async () => { localStorage.removeItem("playwright-authenticated"); } }; }
export function useSignIn() {
  return { fetchStatus: "idle", signIn: { status: "complete", password: async () => ({ error: null }), sso: async () => ({ error: null }), finalize: async () => {} } };
}
export function useSignUp() {
  return { fetchStatus: "idle", signUp: { status: "needs_requirements", missingFields: [], unverifiedFields: [], username: null, password: async () => ({ error: null }), sso: async () => ({ error: null }), update: async () => ({ error: null }), verifications: { sendEmailCode: async () => ({ error: null }), verifyEmailCode: async () => ({ error: null }) }, finalize: async () => {} } };
}
export function AuthenticateWithRedirectCallback(props: Record<string, unknown>) { return <output data-testid="oauth-callback">{JSON.stringify(props)}</output>; }
export function SignUp(props: Record<string, unknown>) { return <output data-testid="signup-component">{JSON.stringify(props)}</output>; }
export function SignIn(props: Record<string, unknown>) { return <output data-testid="signin-component">{JSON.stringify(props)}</output>; }
