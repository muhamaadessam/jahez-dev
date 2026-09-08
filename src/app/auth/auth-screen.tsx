"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth, useSignIn, useSignUp, useUser } from "@clerk/react";

import { localeFromPathname, type Locale } from "../../i18n";

export const PENDING_USERNAME_KEY = "jahezdev-pending-username";

export function validateUsername(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length < 3) return "short";
  if (trimmed.length > 32) return "long";
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return "charset";
  return null;
}

function errorMessage(error: unknown, fallback: string): string {
  const first = (error as { errors?: Array<{ longMessage?: string; message?: string }> } | null)?.errors?.[0];
  return first?.longMessage || first?.message || fallback;
}

type Copy = Record<string, string>;

const copy: Record<Locale, Copy> = {
  ar: {
    brand: "JahezDev",
    signUpEyebrow: "إنشاء حساب جديد",
    signUpTitle: "أنشئ حسابك في JahezDev",
    signUpLead: "اختر اسم مستخدم، ثم أكمل بأي طريقة تناسبك. كل التصميم هنا من الموقع نفسه.",
    username: "اسم المستخدم",
    usernamePlaceholder: "مثال: ahmed_dev",
    usernameHint: "من ٣ إلى ٣٢ حرفًا، أحرف إنجليزية وأرقام وشرطة سفلية فقط. سيظهر بجانب مساهماتك.",
    usernameRequiredForGoogle: "اكتب اسم المستخدم أولًا، ثم اضغط المتابعة باستخدام Google.",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    passwordHint: "٨ أحرف على الأقل.",
    google: "المتابعة باستخدام Google",
    createAccount: "إنشاء الحساب",
    loading: "جاري التحميل…",
    or: "أو",
    verifyTitle: "تأكيد البريد الإلكتروني",
    verifyHint: "أرسلنا رمز تحقق إلى بريدك. اكتبه هنا لإتمام إنشاء الحساب.",
    code: "رمز التحقق",
    confirm: "تأكيد",
    completeProfileTitle: "اختر اسم المستخدم",
    completeProfileHint: "حساب Google تم ربطه بنجاح. بقي خطوة واحدة: اختر اسم المستخدم الذي سيظهر بجانب مساهماتك.",
    saveUsername: "حفظ اسم المستخدم والمتابعة",
    signedInAs: "مسجل الدخول",
    continue: "المتابعة إلى الموقع",
    haveAccount: "لديك حساب بالفعل؟ تسجيل الدخول",
    noAccount: "ليس لديك حساب؟ إنشاء حساب",
    signInTitle: "تسجيل الدخول",
    signInLead: "مرحبًا بعودتك. سجل الدخول بأي طريقة.",
    signInSubmit: "دخول",
    failed: "تعذر إكمال العملية. حاول مرة أخرى.",
    usernameShort: "اسم المستخدم قصير. استخدم ٣ أحرف على الأقل.",
    usernameLong: "اسم المستخدم طويل. الحد الأقصى ٣٢ حرفًا.",
    usernameCharset: "استخدم أحرفًا إنجليزية وأرقامًا وشرطة سفلية فقط.",
    backHome: "العودة إلى الرئيسية",
  },
  en: {
    brand: "JahezDev",
    signUpEyebrow: "Create a new account",
    signUpTitle: "Create your JahezDev account",
    signUpLead: "Pick a username first, then finish with any method. All styling here is JahezDev's own.",
    username: "Username",
    usernamePlaceholder: "e.g. ahmed_dev",
    usernameHint: "3–32 characters, Latin letters, numbers and underscores only. Shown next to your contributions.",
    usernameRequiredForGoogle: "Type your username first, then continue with Google.",
    email: "Email address",
    password: "Password",
    passwordHint: "At least 8 characters.",
    google: "Continue with Google",
    createAccount: "Create account",
    loading: "Loading…",
    or: "or",
    verifyTitle: "Confirm your email",
    verifyHint: "We sent a verification code to your email. Enter it to finish creating your account.",
    code: "Verification code",
    confirm: "Confirm",
    completeProfileTitle: "Choose your username",
    completeProfileHint: "Your Google account was linked. One last step: pick the username shown next to your contributions.",
    saveUsername: "Save username and continue",
    signedInAs: "Signed in",
    continue: "Continue to the site",
    haveAccount: "Already have an account? Sign in",
    noAccount: "New here? Create an account",
    signInTitle: "Sign in",
    signInLead: "Welcome back. Sign in with any method.",
    signInSubmit: "Sign in",
    failed: "We couldn't complete that. Try again.",
    usernameShort: "Username is too short. Use at least 3 characters.",
    usernameLong: "Username is too long. Maximum 32 characters.",
    usernameCharset: "Use Latin letters, numbers and underscores only.",
    backHome: "Back to home",
  },
};

function usePageLocale(initial: Locale): [Locale, (next: Locale) => void] {
  const [locale, setLocale] = useState<Locale>(initial);
  useEffect(() => {
    try {
      setLocale(localeFromPathname(window.location.pathname));
    } catch {
      /* keep initial */
    }
  }, []);
  return [locale, setLocale];
}

function Shell({ locale, setLocale, eyebrow, title, lead, children }: { locale: Locale; setLocale: (next: Locale) => void; eyebrow: string; title: string; lead: string; children: React.ReactNode }) {
  return (
    <section className="container auth-page" style={{ display: "grid", justifyItems: "center", paddingBlock: "3rem" }}>
      <div className="auth-page-card">
        <div className="auth-page-top">
          <span className="eyebrow">{eyebrow}</span>
          <div className="auth-locale-toggle" role="group" aria-label="Language">
            <button type="button" className={locale === "ar" ? "active" : ""} onClick={() => setLocale("ar")}>العربية</button>
            <button type="button" className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")}>English</button>
          </div>
        </div>
        <h1>{title}</h1>
        <p className="auth-page-lead">{lead}</p>
        {children}
        <div id="clerk-captcha" />
      </div>
    </section>
  );
}

export function GoogleIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

function AuthUnavailableScreen({ initialLocale = "ar", mode }: { initialLocale?: Locale; mode: "signIn" | "signUp" }) {
  const [locale, setLocale] = usePageLocale(initialLocale);
  const t = copy[locale];
  return (
    <Shell locale={locale} setLocale={setLocale} eyebrow={t.brand} title={mode === "signIn" ? t.signInTitle : t.signUpTitle} lead={t.loading}>
      <div className="loading-placeholder" aria-hidden="true">
        <span className="loading-skeleton loading-skeleton-wide" />
        <span className="loading-skeleton loading-skeleton-medium" />
      </div>
    </Shell>
  );
}

export function SignUpScreen({ initialLocale = "ar" }: { initialLocale?: Locale }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <AuthUnavailableScreen initialLocale={initialLocale} mode="signUp" />;
  }
  return <EnabledSignUpScreen initialLocale={initialLocale} />;
}

function EnabledSignUpScreen({ initialLocale = "ar" }: { initialLocale?: Locale }) {
  const [locale, setLocale] = usePageLocale(initialLocale);
  const t = copy[locale];
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp } = useSignUp();
  const { user } = useUser();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<"form" | "verify">("form");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const pending = sessionStorage.getItem(PENDING_USERNAME_KEY);
      if (pending && !username) setUsername(pending);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function usernameError(): string {
    const problem = validateUsername(username);
    if (problem === "short") return t.usernameShort;
    if (problem === "long") return t.usernameLong;
    if (problem === "charset") return t.usernameCharset;
    return "";
  }

  async function finalizeAndGoHome() {
    try {
      sessionStorage.removeItem(PENDING_USERNAME_KEY);
    } catch {
      /* ignore */
    }
    window.location.href = "/";
  }

  async function google() {
    if (!isLoaded) return;
    setBusy(true);
    setError("");
    try {
      const redirectUrl = `${window.location.origin}/auth/sign-up`;
      const redirectCallbackUrl = `${window.location.origin}/auth/callback`;
      const { error: resultError } = await signUp.sso({
        strategy: "oauth_google",
        redirectUrl,
        redirectCallbackUrl,
      });
      if (resultError) throw resultError;
    } catch (caught) {
      setBusy(false);
      setError(errorMessage(caught, t.failed));
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded) return;
    const problem = validateUsername(username);
    if (mode === "form" && problem) {
      setError(usernameError());
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (mode === "form") {
        const { error: resultError } = await signUp.password({
          emailAddress: email,
          password,
          username: username.trim(),
        });
        if (resultError) throw resultError;
        if (signUp.status === "missing_requirements" && signUp.unverifiedFields.includes("email_address")) {
          const { error: verificationError } = await signUp.verifications.sendEmailCode();
          if (verificationError) throw verificationError;
          setMode("verify");
        } else if (signUp.status === "complete") {
          await signUp.finalize({
            navigate: ({ decorateUrl }) => {
              window.location.href = decorateUrl("/");
            },
          });
          await finalizeAndGoHome();
        } else {
          setError(t.failed);
        }
      } else {
        const { error: verificationError } = await signUp.verifications.verifyEmailCode({ code });
        if (verificationError) throw verificationError;
        if (signUp.status === "complete") {
          await signUp.finalize({
            navigate: ({ decorateUrl }) => {
              window.location.href = decorateUrl("/");
            },
          });
          await finalizeAndGoHome();
        } else {
          setError(t.failed);
        }
      }
    } catch (caught) {
      setError(errorMessage(caught, t.failed));
    } finally {
      setBusy(false);
    }
  }

  async function saveMissingUsername(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded) return;
    const problem = validateUsername(username);
    if (problem) {
      setError(usernameError());
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { error: resultError } = await signUp.update({ username: username.trim() });
      if (resultError) throw resultError;
      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ decorateUrl }) => {
            window.location.href = decorateUrl("/");
          },
        });
        await finalizeAndGoHome();
      } else {
        setError(t.failed);
      }
    } catch (caught) {
      setError(errorMessage(caught, t.failed));
    } finally {
      setBusy(false);
    }
  }

  async function savePostOAuthUsername(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const problem = validateUsername(username);
    if (problem) {
      setError(usernameError());
      return;
    }
    setBusy(true);
    setError("");
    try {
      await user.update({ username: username.trim() });
      await finalizeAndGoHome();
    } catch (caught) {
      setError(errorMessage(caught, t.failed));
    } finally {
      setBusy(false);
    }
  }

  // Case 1: Clerk redirected back with missing requirements (e.g. username required for Google sign-up)
  if (isLoaded && signUp && signUp.status === "missing_requirements") {
    const needsUsername = signUp.missingFields.includes("username");
    return (
      <Shell locale={locale} setLocale={setLocale} eyebrow={t.brand} title={t.completeProfileTitle} lead={t.completeProfileHint}>
        <form className="auth-page-form" onSubmit={(event) => void saveMissingUsername(event)}>
          {needsUsername || true ? (
            <label>{t.username}
              <input dir="ltr" value={username} onChange={(event) => setUsername(event.target.value)} placeholder={t.usernamePlaceholder} autoComplete="username" required minLength={3} maxLength={32} />
            </label>
          ) : null}
          <p className="field-hint">{t.usernameHint}</p>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button primary auth-submit" type="submit" disabled={busy || !isLoaded}>{busy ? t.loading : t.saveUsername}</button>
        </form>
      </Shell>
    );
  }

  // Case 2: session already complete (Google OAuth finished) but user has no username yet
  if (isLoaded && isSignedIn && user && !user.username) {
    return (
      <Shell locale={locale} setLocale={setLocale} eyebrow={t.brand} title={t.completeProfileTitle} lead={t.completeProfileHint}>
        <form className="auth-page-form" onSubmit={(event) => void savePostOAuthUsername(event)}>
          <label>{t.username}
            <input dir="ltr" value={username} onChange={(event) => setUsername(event.target.value)} placeholder={t.usernamePlaceholder} autoComplete="username" required minLength={3} maxLength={32} />
          </label>
          <p className="field-hint">{t.usernameHint}</p>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button primary auth-submit" type="submit" disabled={busy}>{busy ? t.loading : t.saveUsername}</button>
        </form>
      </Shell>
    );
  }

  if (isLoaded && isSignedIn && user?.username) {
    return (
      <Shell locale={locale} setLocale={setLocale} eyebrow={t.brand} title={t.signUpTitle} lead={`${t.signedInAs}: ${user.username}`}>
        <Link className="button primary auth-submit" href="/">{t.continue}</Link>
      </Shell>
    );
  }

  return (
    <Shell locale={locale} setLocale={setLocale} eyebrow={t.signUpEyebrow} title={mode === "verify" ? t.verifyTitle : t.signUpTitle} lead={mode === "verify" ? t.verifyHint : t.signUpLead}>
      {mode === "form" && (
        <>
          <button className="auth-google-button" type="button" onClick={() => void google()} disabled={busy || !isLoaded}>
            <GoogleIcon />{t.google}
          </button>
          <div className="auth-separator" aria-hidden="true"><span>{t.or}</span></div>
        </>
      )}
      <form className="auth-page-form" onSubmit={(event) => void submit(event)}>
        {mode === "form" ? (
          <>
            <label>{t.username}
              <input dir="ltr" value={username} onChange={(event) => setUsername(event.target.value)} placeholder={t.usernamePlaceholder} autoComplete="username" required minLength={3} maxLength={32} />
            </label>
            <p className="field-hint">{t.usernameHint}</p>
            <label>{t.email}<input dir="ltr" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <label>{t.password}<input dir="ltr" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /></label>
            <p className="field-hint">{t.passwordHint}</p>
          </>
        ) : (
          <label>{t.code}<input dir="ltr" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value)} required /></label>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button primary auth-submit" type="submit" disabled={busy || !isLoaded}>
          {busy ? t.loading : mode === "verify" ? t.confirm : t.createAccount}
        </button>
      </form>
      <div className="auth-page-links">
        <Link href="/auth/sign-in">{t.haveAccount}</Link>
        <Link href="/">{t.backHome}</Link>
      </div>
    </Shell>
  );
}

export function SignInScreen({ initialLocale = "ar" }: { initialLocale?: Locale }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <AuthUnavailableScreen initialLocale={initialLocale} mode="signIn" />;
  }
  return <EnabledSignInScreen initialLocale={initialLocale} />;
}

function EnabledSignInScreen({ initialLocale = "ar" }: { initialLocale?: Locale }) {
  const [locale, setLocale] = usePageLocale(initialLocale);
  const t = copy[locale];
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function google() {
    if (!isLoaded) return;
    setBusy(true);
    setError("");
    try {
      const redirectUrl = `${window.location.origin}/`;
      const redirectCallbackUrl = `${window.location.origin}/auth/callback`;
      const { error: resultError } = await signIn.sso({ strategy: "oauth_google", redirectUrl, redirectCallbackUrl });
      if (resultError) throw resultError;
    } catch (caught) {
      setBusy(false);
      setError(errorMessage(caught, t.failed));
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded) return;
    setBusy(true);
    setError("");
    try {
      const { error: resultError } = await signIn.password({ identifier: email, password });
      if (resultError) throw resultError;
      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            window.location.href = decorateUrl("/");
          },
        });
        window.location.href = "/";
      } else {
        setError(t.failed);
      }
    } catch (caught) {
      setError(errorMessage(caught, t.failed));
    } finally {
      setBusy(false);
    }
  }

  if (isLoaded && isSignedIn) {
    return (
      <Shell locale={locale} setLocale={setLocale} eyebrow={t.brand} title={t.signInTitle} lead={t.signInLead}>
        <Link className="button primary auth-submit" href="/">{t.continue}</Link>
      </Shell>
    );
  }

  return (
    <Shell locale={locale} setLocale={setLocale} eyebrow={t.brand} title={t.signInTitle} lead={t.signInLead}>
      <button className="auth-google-button" type="button" onClick={() => void google()} disabled={busy || !isLoaded}>
        <GoogleIcon />{t.google}
      </button>
      <div className="auth-separator" aria-hidden="true"><span>{t.or}</span></div>
      <form className="auth-page-form" onSubmit={(event) => void submit(event)}>
        <label>{t.email}<input dir="ltr" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>{t.password}<input dir="ltr" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button primary auth-submit" type="submit" disabled={busy || !isLoaded}>
          {busy ? t.loading : t.signInSubmit}
        </button>
      </form>
      <div className="auth-page-links">
        <Link href="/auth/sign-up">{t.noAccount}</Link>
        <Link href="/">{t.backHome}</Link>
      </div>
    </Shell>
  );
}
