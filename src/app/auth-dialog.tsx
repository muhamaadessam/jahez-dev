"use client";

import { useAuth, useClerk, useUser } from "@clerk/react";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { messages, type Locale } from "../i18n";
import { nodeRequest } from "../backend/api.ts";
import { errorMessage, useAuthFlow, usernameCompletionMode } from "./auth/auth-flow";
import { GoogleIcon } from "./auth/auth-screen";

export function AuthDialogTrigger({ locale, children, className = "button primary", mode = "signIn" }: { locale: Locale; children?: ReactNode; className?: string; mode?: "signIn" | "signUp" }) {
  const copy = messages[locale];
  const [open, setOpen] = useState(false);
  return <>
    <button className={className} type="button" onClick={() => setOpen(true)}>{children ?? (mode === "signIn" ? copy.signIn : copy.signUp)}</button>
    {open && <AuthDialog locale={locale} initialMode={mode} onClose={() => setOpen(false)} />}
  </>;
}

function AuthDialog({ locale, initialMode, onClose }: { locale: Locale; initialMode: "signIn" | "signUp"; onClose: () => void }) {
  const copy = messages[locale];
  const heading = useRef<HTMLHeadingElement>(null);
  const redirectPath = typeof window === "undefined" ? "/" : `${window.location.pathname}${window.location.search}`;

  const text = locale === "ar"
    ? { signIn: "تسجيل الدخول", signUp: "إنشاء حساب", completeProfile: "اختر اسم المستخدم", saveUsername: "حفظ اسم المستخدم والمتابعة", username: "اسم المستخدم", usernamePlaceholder: "مثال: ahmed_dev", usernameHint: "من ٤ إلى ٦٤ حرفًا، أحرف إنجليزية وأرقام وشرطة سفلية فقط.", email: "البريد الإلكتروني", password: "كلمة المرور", google: "المتابعة باستخدام Google", submitIn: "دخول", submitUp: "إنشاء الحساب", verify: "تأكيد البريد الإلكتروني", verifyHint: "اكتب الرمز الذي وصلك على بريدك الإلكتروني.", code: "رمز التحقق", confirm: "تأكيد", switchUp: "ليس لديك حساب؟ إنشاء حساب", switchIn: "لديك حساب بالفعل؟ تسجيل الدخول", loading: "جاري التحميل…", failed: "تعذر إكمال العملية. حاول مرة أخرى.", usernameShort: "اسم المستخدم قصير. استخدم ٤ أحرف على الأقل.", usernameLong: "اسم المستخدم طويل. الحد الأقصى ٦٤ حرفًا.", usernameCharset: "استخدم أحرفًا إنجليزية وأرقامًا وشرطة سفلية فقط." }
    : { signIn: "Sign in", signUp: "Create account", completeProfile: "Choose your username", saveUsername: "Save username and continue", username: "Username", usernamePlaceholder: "e.g. ahmed_dev", usernameHint: "4–64 characters, Latin letters, numbers and underscores only.", email: "Email address", password: "Password", google: "Continue with Google", submitIn: "Sign in", submitUp: "Create account", verify: "Confirm your email", verifyHint: "Enter the code sent to your email.", code: "Verification code", confirm: "Confirm", switchUp: "New here? Create an account", switchIn: "Already have an account? Sign in", loading: "Loading…", failed: "We couldn't complete that. Try again.", usernameShort: "Username is too short. Use at least 4 characters.", usernameLong: "Username is too long. Maximum 64 characters.", usernameCharset: "Use Latin letters, numbers and underscores only." };

  const {
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
    submit,
    google,
    saveMissingUsername,
    savePostOAuthUsername,
    setError,
  } = useAuthFlow({ initialMode, redirectPath, copy: text });

  useEffect(() => { heading.current?.focus(); }, [mode]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [onClose]);

  const completionMode = usernameCompletionMode({ mode, isSignedIn: Boolean(isSignedIn), hasUser: Boolean(user), hasUsername: Boolean(user?.username), signUpId: signUp.id, signUpStatus: signUp.status });
  const needsUsername = completionMode === "signUp";
  const needsPostOAuthUsername = completionMode === "user";
  const title = needsUsername || needsPostOAuthUsername ? text.completeProfile : mode === "verify" ? text.verify : mode === "signIn" ? text.signIn : text.signUp;
  const overlay = (
    <div className="auth-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-dialog-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="auth-dialog" onMouseDown={(event) => event.stopPropagation()}>
        <button className="auth-dialog-close" type="button" onClick={onClose} aria-label={copy.close}>×</button>
        <span className="eyebrow">{copy.brandName}</span>
        <h2 id="auth-dialog-title" ref={heading} tabIndex={-1}>{title}</h2>
        {!needsUsername && !needsPostOAuthUsername && mode !== "verify" && <>
          <button className="auth-google-button" type="button" onClick={() => void google()} disabled={busy}><GoogleIcon />{text.google}</button>
          <div className="auth-separator" aria-hidden="true"><span>{locale === "ar" ? "أو" : "or"}</span></div>
        </>}
        {needsUsername || needsPostOAuthUsername ? (
          <form onSubmit={(event) => void (needsUsername ? saveMissingUsername(event) : savePostOAuthUsername(event))}>
            <label>{text.username}<input dir="ltr" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder={text.usernamePlaceholder} minLength={4} maxLength={64} required /></label>
            <p className="field-hint">{text.usernameHint}</p>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button primary auth-submit" type="submit" disabled={busy || !isLoaded}>{busy ? text.loading : text.saveUsername}</button>
          </form>
        ) : (
          <form onSubmit={(event) => void submit(event)}>
            {mode !== "verify" ? <>
              {mode === "signUp" && <><label>{text.username}<input dir="ltr" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} placeholder={text.usernamePlaceholder} minLength={4} maxLength={64} required /></label><p className="field-hint">{text.usernameHint}</p></>}
              <label>{text.email}<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
              <label>{text.password}<input type="password" autoComplete={mode === "signIn" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /></label>
            </> : <><p className="field-hint">{text.verifyHint}</p><label>{text.code}<input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value)} required /></label></>}
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button primary auth-submit" type="submit" disabled={busy || !isLoaded}>{busy ? text.loading : mode === "verify" ? text.confirm : mode === "signIn" ? text.submitIn : text.submitUp}</button>
          </form>
        )}
        <div id="clerk-captcha" />
        {!needsUsername && !needsPostOAuthUsername && mode !== "verify" && <button className="auth-switch" type="button" onClick={() => { setError(""); setMode((current) => current === "signIn" ? "signUp" : "signIn"); }}>{mode === "signIn" ? text.switchUp : text.switchIn}</button>}
      </section>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(overlay, document.body);
}

export function AccountMenu({ locale, myTracksHref, moderatorHref, showModerator }: { locale: Locale; myTracksHref: string; moderatorHref: string; showModerator: boolean }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const email = user?.primaryEmailAddress?.emailAddress ?? user?.username ?? "";
  const displayName = user?.fullName || user?.username || email || "User";
  const initial = (displayName || "U").slice(0, 1).toUpperCase();
  const copy = messages[locale];
  return <div className="auth-account">
    <button className="auth-profile-trigger" type="button" aria-label={`${copy.account}: ${displayName}`} aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(true)}>
      <span className="auth-avatar" aria-hidden="true">{user?.imageUrl ? <img src={user.imageUrl} alt="" referrerPolicy="no-referrer" /> : initial}</span>
    </button>
    {open && <AccountDialog locale={locale} user={user} email={email} displayName={displayName} myTracksHref={myTracksHref} moderatorHref={moderatorHref} showModerator={showModerator} onClose={() => setOpen(false)} signOut={signOut} />}
  </div>;
}

function AccountDialog({ locale, user, email, displayName, myTracksHref, moderatorHref, showModerator, onClose, signOut }: { locale: Locale; user: ReturnType<typeof useUser>["user"]; email: string; displayName: string; myTracksHref: string; moderatorHref: string; showModerator: boolean; onClose: () => void; signOut: ReturnType<typeof useClerk>["signOut"] }) {
  const [tab, setTab] = useState<"profile" | "security">("profile");
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [handle, setHandle] = useState(user?.username ?? "");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const { getToken } = useAuth();
  const ar = locale === "ar";
  async function saveProfile(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!user) return; setBusy(true); setStatus(""); try { await user.update({ firstName: firstName || undefined, lastName: lastName || undefined, username: handle || undefined }); setStatus(ar ? "تم حفظ بيانات الحساب." : "Account details saved."); } catch (error) { setStatus(errorMessage(error, ar ? "تعذر حفظ البيانات." : "Could not save account details.")); } finally { setBusy(false); } }
  async function deleteAccount() { if (!window.confirm(ar ? "هل تريد حذف الحساب نهائيًا؟" : "Delete this account permanently?")) return; setBusy(true); setStatus(""); try { await nodeRequest({ path: "/me/account", token: (await getToken()) ?? undefined, init: { method: "DELETE" } }); await signOut(); } catch (error) { setStatus(errorMessage(error, ar ? "تعذر حذف الحساب." : "Could not delete the account.")); setBusy(false); } }
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, [onClose]);

  const overlay = (
    <div className="account-overlay" role="dialog" aria-modal="true" aria-labelledby="account-dialog-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="account-dialog" onMouseDown={(event) => event.stopPropagation()}>
        <header className="account-dialog-header">
          <div>
            <span className="eyebrow">{messages[locale].brandName}</span>
            <h2 id="account-dialog-title">{ar ? "إعدادات الحساب" : "Account settings"}</h2>
            <p>{ar ? "بياناتك وإعدادات الأمان في مكان واحد." : "Your profile and security settings in one place."}</p>
          </div>
          <button className="auth-dialog-close" type="button" onClick={onClose} aria-label={messages[locale].close}>×</button>
        </header>
        <div className="account-dialog-body">
          <nav className="account-tabs" aria-label={ar ? "أقسام الحساب" : "Account sections"}>
            <button className={tab === "profile" ? "active" : ""} type="button" onClick={() => setTab("profile")}>{ar ? "الملف الشخصي" : "Profile"}</button>
            <button className={tab === "security" ? "active" : ""} type="button" onClick={() => setTab("security")}>{ar ? "الأمان" : "Security"}</button>
          </nav>
          {tab === "profile" ? (
            <form className="account-form" onSubmit={(event) => void saveProfile(event)}>
              <div className="account-identity">
                <span className="auth-avatar account-avatar">{user?.imageUrl ? <img src={user.imageUrl} alt="" referrerPolicy="no-referrer" /> : displayName.slice(0, 1).toUpperCase()}</span>
                <div>
                  <strong>{displayName}</strong>
                  <span dir="ltr">{email}</span>
                </div>
              </div>
              <div className="account-fields">
                <label>{ar ? "الاسم الأول" : "First name"}<input value={firstName} onChange={(event) => setFirstName(event.target.value)} /></label>
                <label>{ar ? "اسم العائلة" : "Last name"}<input value={lastName} onChange={(event) => setLastName(event.target.value)} /></label>
              </div>
              <label>{ar ? "اسم المستخدم" : "Username"}<input dir="ltr" value={handle} onChange={(event) => setHandle(event.target.value)} placeholder={ar ? "اختياري" : "Optional"} /></label>
              {status && <p className="account-status" role="status">{status}</p>}
              <div className="actions">
                <button className="button primary" type="submit" disabled={busy}>{ar ? "حفظ التغييرات" : "Save changes"}</button>
                <Link className="button" href={myTracksHref} onClick={onClose}>{messages[locale].myTracks}</Link>
                {showModerator && <Link className="button" href={moderatorHref} onClick={onClose}>{messages[locale].moderator}</Link>}
              </div>
            </form>
          ) : (
            <div className="account-security">
              <div className="security-row">
                <span className="security-icon" aria-hidden="true">✓</span>
                <div>
                  <strong>{ar ? "حسابك محمي بتسجيل الدخول" : "Your account is protected by sign-in"}</strong>
                  <p>{ar ? "إدارة الجلسة تتم بأمان على هذا الجهاز." : "Your session is managed securely on this device."}</p>
                </div>
              </div>
              <div className="security-row">
                <span className="security-icon" aria-hidden="true">↗</span>
                <div>
                  <strong>{ar ? "هل تريد الخروج؟" : "Need to sign out?"}</strong>
                  <p>{ar ? "سيتم تسجيل خروجك من هذا الجهاز." : "Sign out from this device."}</p>
                  <button className="button" type="button" onClick={() => void signOut()}>{ar ? "تسجيل الخروج" : "Sign out"}</button>
                </div>
              </div>
              <div className="account-danger">
                <strong>{ar ? "منطقة خطرة" : "Danger zone"}</strong>
                <p>{ar ? "حذف الحساب يمسح بياناتك نهائيًا ولا يمكن التراجع عنه." : "Deleting your account permanently removes your data."}</p>
                <button className="button danger" type="button" onClick={() => void deleteAccount()} disabled={busy}>{ar ? "حذف الحساب" : "Delete account"}</button>
              </div>
              {status && <p className="account-status" role="alert">{status}</p>}
            </div>
          )}
        </div>
      </section>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(overlay, document.body);
}
