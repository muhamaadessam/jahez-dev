"use client";

import { useAuth, useSignIn, useSignUp, useUser } from "@clerk/react";
import { useState, type FormEvent } from "react";

export type AuthFlowMode = "signIn" | "signUp" | "verify";

export type AuthFlowCopy = {
  failed: string;
  usernameShort: string;
  usernameLong: string;
  usernameCharset: string;
};

export type UsernameCompletionMode = "signUp" | "user" | null;

export function usernameCompletionMode({ mode, isSignedIn, hasUser, hasUsername, signUpStatus }: {
  mode: AuthFlowMode;
  isSignedIn: boolean;
  hasUser: boolean;
  hasUsername: boolean;
  signUpStatus: string | null;
}): UsernameCompletionMode {
  if (mode !== "signUp") return null;
  if (isSignedIn && hasUser && !hasUsername) return "user";
  if (signUpStatus === "missing_requirements") return "signUp";
  return null;
}

export function validateUsername(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length < 4) return "short";
  if (trimmed.length > 64) return "long";
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return "charset";
  return null;
}

export function usernameError(value: string, copy: AuthFlowCopy): string {
  const problem = validateUsername(value);
  if (problem === "short") return copy.usernameShort;
  if (problem === "long") return copy.usernameLong;
  if (problem === "charset") return copy.usernameCharset;
  return "";
}

export function errorMessage(error: unknown, fallback: string): string {
  const first = (error as { errors?: Array<{ longMessage?: string; message?: string }> } | null)?.errors?.[0];
  if (first?.longMessage || first?.message) return first.longMessage || first.message || fallback;
  const message = (error as { message?: unknown } | null)?.message;
  return typeof message === "string" && message.trim() ? message : fallback;
}

type UsernameUpdateUser = {
  username?: string | null;
  update: (params: { username: string }) => Promise<unknown>;
  reload: () => Promise<unknown>;
};

export async function saveUsernameWithRecovery(user: UsernameUpdateUser, username: string): Promise<void> {
  try {
    await user.update({ username });
    return;
  } catch (error) {
    if (!errorMessage(error, "").includes("Unexpected end of JSON input")) throw error;

    let refreshed: unknown;
    try {
      refreshed = await user.reload();
    } catch {
      throw error;
    }

    const reloadedUsername =
      refreshed && typeof refreshed === "object" && "username" in refreshed
        ? (refreshed as { username?: unknown }).username
        : undefined;
    const currentUsername = typeof reloadedUsername === "string" ? reloadedUsername : user.username;
    if (currentUsername !== username) throw error;
  }
}

export function useAuthFlow({ initialMode, redirectPath, copy }: { initialMode: AuthFlowMode; redirectPath: string; copy: AuthFlowCopy }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { user } = useUser();
  const [mode, setMode] = useState<AuthFlowMode>(initialMode);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function usernameValidationError(): string {
    return usernameError(username, copy);
  }

  async function google() {
    if (!isLoaded) return;
    setBusy(true);
    setError("");
    try {
      const flow = mode === "signUp" ? signUp : signIn;
      const redirectUrl = `${window.location.origin}${mode === "signUp" ? "/auth/sign-up" : redirectPath}`;
      const redirectCallbackUrl = `${window.location.origin}/auth/callback`;
      const { error: resultError } = await flow.sso({ strategy: "oauth_google", redirectUrl, redirectCallbackUrl });
      if (resultError) throw resultError;
    } catch (caught) {
      setBusy(false);
      setError(errorMessage(caught, copy.failed));
    }
  }

  async function finalize(resource: "signIn" | "signUp") {
    const target = resource === "signIn" ? signIn : signUp;
    await target.finalize({
      navigate: ({ decorateUrl }) => {
        window.location.href = decorateUrl(redirectPath);
      },
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded) return;
    if (mode === "signUp" && usernameValidationError()) {
      setError(usernameValidationError());
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (mode === "signIn") {
        const { error: resultError } = await signIn.password({ identifier: email, password });
        if (resultError) throw resultError;
        if (signIn.status === "complete") await finalize("signIn");
        else setError(copy.failed);
      } else if (mode === "signUp") {
        const { error: resultError } = await signUp.password({ emailAddress: email, password, username: username.trim() });
        if (resultError) throw resultError;
        if (signUp.status === "missing_requirements" && signUp.unverifiedFields.includes("email_address")) {
          const { error: verificationError } = await signUp.verifications.sendEmailCode();
          if (verificationError) throw verificationError;
          setMode("verify");
        } else if (signUp.status === "complete") {
          await finalize("signUp");
        } else {
          setError(copy.failed);
        }
      } else {
        const { error: verificationError } = await signUp.verifications.verifyEmailCode({ code });
        if (verificationError) throw verificationError;
        if (signUp.status === "complete") await finalize("signUp");
        else setError(copy.failed);
      }
    } catch (caught) {
      setError(errorMessage(caught, copy.failed));
    } finally {
      setBusy(false);
    }
  }

  async function saveMissingUsername(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded) return;
    if (usernameValidationError()) {
      setError(usernameValidationError());
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { error: resultError } = await signUp.update({ username: username.trim() });
      if (resultError) throw resultError;
      if (signUp.status === "complete") await finalize("signUp");
      else setError(copy.failed);
    } catch (caught) {
      setError(errorMessage(caught, copy.failed));
    } finally {
      setBusy(false);
    }
  }

  async function savePostOAuthUsername(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    if (usernameValidationError()) {
      setError(usernameValidationError());
      return;
    }
    setBusy(true);
    setError("");
    try {
      await saveUsernameWithRecovery(user, username.trim());
      window.location.href = redirectPath;
    } catch (caught) {
      setError(errorMessage(caught, copy.failed));
    } finally {
      setBusy(false);
    }
  }

  return {
    isLoaded,
    isSignedIn,
    user,
    signUp,
    mode,
    setMode,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    code,
    setCode,
    error,
    busy,
    usernameError: usernameValidationError,
    google,
    submit,
    saveMissingUsername,
    savePostOAuthUsername,
    setError,
  };
}
