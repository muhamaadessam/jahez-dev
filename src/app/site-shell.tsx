"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { localeDirection, localeFromLanguageTag, localeStorageKey, localizedHref, messages, type Locale } from "../i18n";
import { isTrackScopedPath } from "../tracks/active-track";
import { repositoryUrl } from "./site-config";
import { ThemeToggle } from "./theme-toggle";
import { BrandLogo } from "./logo";
import { ClerkControls } from "./clerk-controls";
import { ModeratorNavLink } from "./moderator-nav-link";
import { useActiveTrack } from "./active-track";

const cataloguePaths = [["topics", "/topics"], ["questions", "/questions"], ["interview", "/interview"]] as const;
const activityPaths = [["progress", "/progress"], ["submit", "/submissions"]] as const;
const genericPaths = ["/privacy", "/terms", "/sign-in", "/sign-up", "/auth"] as const;

function unprefixedPath(pathname: string): string {
  return pathname === "/en" || pathname === "/ar" ? "/" : pathname.replace(/^\/(?:en|ar)(?=\/)/, "") || "/";
}

function isGenericPath(pathname: string): boolean {
  return genericPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function SiteShell({ children }: { children: ReactNode }) {
  const routePathname = usePathname() ?? "/";
  const [pathname, setPathname] = useState(routePathname);
  const [query, setQuery] = useState("");
  const [locale, setLocale] = useState<Locale>(() => routePathname.startsWith("/en") ? "en" : "ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const initialRouteLocale = routePathname.match(/^\/(ar|en)(?=\/|$)/)?.[1] as Locale | undefined;
  const localeRedirected = useRef(false);
  const menu = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { activeTrack, trackOnlyHref } = useActiveTrack();

  useEffect(() => {
    const sync = () => {
      setPathname(window.location.pathname);
      setQuery(window.location.search);
      const match = window.location.pathname.match(/^\/(ar|en)(?=\/|$)/);
      let nextLocale: Locale = match?.[1] === "en" ? "en" : "ar";
      try {
        const stored = localStorage.getItem(localeStorageKey);
        nextLocale = match?.[1] ? nextLocale : stored === "en" || stored === "ar" ? stored : localeFromLanguageTag(navigator.language);
        localStorage.setItem(localeStorageKey, nextLocale);
      } catch {
        // Storage unavailable
      }
      if (!match && nextLocale === "en" && initialRouteLocale !== "en" && !localeRedirected.current && !/^\/(?:auth(?:\/|$)|sign-in$|sign-up$)/.test(window.location.pathname)) {
        localeRedirected.current = true;
        window.location.replace(`${localizedHref(nextLocale, unprefixedPath(window.location.pathname))}${window.location.search}${window.location.hash}`);
        return;
      }
      setLocale(nextLocale);
      document.documentElement.lang = nextLocale;
      document.documentElement.dir = localeDirection(nextLocale);
      document.documentElement.removeAttribute("data-locale-pending");
      if (match) {
        const cleanPath = window.location.pathname.replace(/^\/(?:ar|en)(?=\/|$)/, "") || "/";
        window.history.replaceState(null, "", `${cleanPath}${window.location.search}${window.location.hash}`);
      }
    };
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("urlchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("urlchange", sync);
    };
  }, []);

  useEffect(() => {
    setPathname(routePathname);
    setQuery(window.location.search);
    const match = window.location.pathname.match(/^\/(ar|en)(?=\/|$)/);
    if (match) {
      const cleanPath = window.location.pathname.replace(/^\/(?:ar|en)(?=\/|$)/, "") || "/";
      window.history.replaceState(null, "", `${cleanPath}${window.location.search}${window.location.hash}`);
    }
  }, [routePathname]);

  const copy = messages[locale];
  const targetLocale: Locale = locale === "ar" ? "en" : "ar";
  const switchHref = `${localizedHref(targetLocale, unprefixedPath(pathname))}${query}`;
  const currentPath = unprefixedPath(pathname);
  const isHome = currentPath === "/";
  const isUnknownRoute = !isHome && !isTrackScopedPath(currentPath) && !isGenericPath(currentPath);
  const href = (path: string) => {
    const nextHref = localizedHref(locale, path === "/" || isUnknownRoute ? path : trackOnlyHref(path));
    if (unprefixedPath(pathname) !== "/topics" || path !== "/questions") return nextHref;
    const topic = new URLSearchParams(query).get("topic");
    return topic ? `${nextHref}&topic=${encodeURIComponent(topic)}` : nextHref;
  };
  const selectLocale = (nextLocale: Locale) => {
    try { localStorage.setItem(localeStorageKey, nextLocale); } catch { /* Storage unavailable */ }
    setLocale(nextLocale);
    document.documentElement.lang = nextLocale;
    document.documentElement.dir = localeDirection(nextLocale);
  };
  const desktopLinks = (
    <>
      {cataloguePaths.map(([key, path]) => (
        <Link key={path} href={href(path)} prefetch={false}>
          {copy[key]}
        </Link>
      ))}
      <span className="nav-divider" aria-hidden="true" />
      {activityPaths.map(([key, path]) => (
        <Link key={path} href={href(path)} prefetch={false}>
          {copy[key]}
        </Link>
      ))}
      <ModeratorNavLink locale={locale} href={href("/moderator")} />
    </>
  );

  function openMenu() {
    menu.current?.showModal();
    setMenuOpen(true);
  }

  const bottomNavItems = [
    { key: "home", path: "/", label: copy.home, icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg> },
    { key: "topics", path: "/topics", label: copy.topics, icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg> },
    { key: "questions", path: "/questions", label: copy.questions, icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" /></svg> },
    { key: "interview", path: "/interview", label: copy.interview, icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg> },
    { key: "progress", path: "/progress", label: copy.progress, icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg> },
  ];

  return (
    <>
      <a className="skip-link" href="#main-content">{copy.skip}</a>
      <div className="site-frame">
        <header className="site-header">
          <nav className="shell nav" aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
            <Link className="brand" href={href("/")} prefetch={false} aria-label={`${copy.brandName} — ${copy.home}`}>
              <BrandLogo trackId={activeTrack?.id} />
              <span className="brand-name" dir={locale === "ar" ? "rtl" : "ltr"}>{copy.brandName}</span>
              {activeTrack && !isHome && !isUnknownRoute && (
                <span className="brand-track-badge" title={activeTrack.name}>
                  {activeTrack.name}
                </span>
              )}
            </Link>
            <div className="desktop-navigation">
              <div className="nav-links">{desktopLinks}</div>
              <div className="nav-actions">
                <ClerkControls locale={locale} myTracksHref={href("/my-tracks")} moderatorHref={href("/moderator")} />
                <Link className="locale-switcher icon-control" href={switchHref} prefetch={false} aria-label={copy.language} title={copy.language} onClick={() => selectLocale(targetLocale)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5h7M7.5 5v2.2a8.3 8.3 0 0 1-4.1 7.1M5 10.8c1.5 1.8 3.4 3.1 5.8 3.9M14 4l-4 10m2.2-4h7.3M16 13.5l3.5 6.5M12.7 16h6.6" /></svg>
                  <span className="sr-only">{copy.language}</span>
                </Link>
                <ThemeToggle locale={locale} />
              </div>
            </div>

            <div className="mobile-header-actions">
              <Link className="locale-switcher icon-control mobile-quick-toggle" href={switchHref} prefetch={false} aria-label={copy.language} title={copy.language} onClick={() => selectLocale(targetLocale)}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 5h7M7.5 5v2.2a8.3 8.3 0 0 1-4.1 7.1M5 10.8c1.5 1.8 3.4 3.1 5.8 3.9M14 4l-4 10m2.2-4h7.3M16 13.5l3.5 6.5M12.7 16h6.6" /></svg>
                <span className="sr-only">{copy.language}</span>
              </Link>
              <div className="mobile-quick-toggle">
                <ThemeToggle locale={locale} />
              </div>
              <button
                ref={menuButton}
                className={`mobile-menu-button${menuOpen ? " is-active" : ""}`}
                type="button"
                aria-haspopup="dialog"
                aria-controls="mobile-navigation"
                aria-expanded={menuOpen}
                aria-label={copy.menu}
                onClick={openMenu}
              >
                <span className="hamburger-box" aria-hidden="true">
                  <span className="hamburger-bar hamburger-bar-1" />
                  <span className="hamburger-bar hamburger-bar-2" />
                  <span className="hamburger-bar hamburger-bar-3" />
                </span>
                <span className="sr-only">{copy.menu}</span>
              </button>
            </div>

            <dialog
              ref={menu}
              id="mobile-navigation"
              className="mobile-navigation"
              aria-labelledby="mobile-navigation-title"
              onClick={(e) => {
                if (e.target === menu.current) {
                  menu.current?.close();
                }
              }}
              onClose={() => {
                setMenuOpen(false);
                menuButton.current?.focus();
              }}
            >
              <div className="mobile-navigation-header">
                <div className="mobile-drawer-brand">
                  <BrandLogo trackId={activeTrack?.id} />
                  <div className="mobile-drawer-brand-text">
                    <span className="drawer-brand-name">{copy.brandName}</span>
                    {activeTrack && !isHome && !isUnknownRoute && (
                      <span className="brand-track-badge drawer-track-badge" title={activeTrack.name}>
                        {activeTrack.name}
                      </span>
                    )}
                  </div>
                </div>
                <strong id="mobile-navigation-title" className="sr-only">{copy.menu}</strong>
                <button
                  className="mobile-menu-close"
                  type="button"
                  autoFocus
                  aria-label={copy.close}
                  onClick={() => menu.current?.close()}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span className="sr-only">{copy.close}</span>
                </button>
              </div>

              <div className="mobile-navigation-links">
                <div className="drawer-group">
                  <span className="drawer-group-title">{locale === "ar" ? "المحتوى والتدريب" : "Learning & Practice"}</span>
                  {cataloguePaths.map(([key, path]) => {
                    const active = currentPath === path || currentPath.startsWith(`${path}/`);
                    return (
                      <Link
                        key={path}
                        href={href(path)}
                        prefetch={false}
                        className={`drawer-link${active ? " is-active" : ""}`}
                        onClick={() => menu.current?.close()}
                      >
                        <span className="drawer-link-icon" aria-hidden="true">
                          {key === "topics" && (
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                          )}
                          {key === "questions" && (
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" /></svg>
                          )}
                          {key === "interview" && (
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                          )}
                        </span>
                        <span className="drawer-link-text">{copy[key]}</span>
                        <span className="drawer-link-arrow" aria-hidden="true">{locale === "ar" ? "←" : "→"}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="drawer-divider" aria-hidden="true" />

                <div className="drawer-group">
                  <span className="drawer-group-title">{locale === "ar" ? "النشاط والمساهمة" : "Activity & Contribution"}</span>
                  {activityPaths.map(([key, path]) => {
                    const active = currentPath === path || currentPath.startsWith(`${path}/`);
                    return (
                      <Link
                        key={path}
                        href={href(path)}
                        prefetch={false}
                        className={`drawer-link${active ? " is-active" : ""}`}
                        onClick={() => menu.current?.close()}
                      >
                        <span className="drawer-link-icon" aria-hidden="true">
                          {key === "progress" && (
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                          )}
                          {key === "submit" && (
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                          )}
                        </span>
                        <span className="drawer-link-text">{copy[key]}</span>
                        <span className="drawer-link-arrow" aria-hidden="true">{locale === "ar" ? "←" : "→"}</span>
                      </Link>
                    );
                  })}
                  <ModeratorNavLink locale={locale} href={href("/moderator")} onClick={() => menu.current?.close()} />
                </div>
              </div>

              <div className="mobile-navigation-actions">
                <div className="drawer-auth-container">
                  <ClerkControls locale={locale} myTracksHref={href("/my-tracks")} moderatorHref={href("/moderator")} />
                </div>
                <div className="drawer-settings-row">
                  <Link
                    className="drawer-setting-pill locale-switcher"
                    href={switchHref}
                    prefetch={false}
                    aria-label={copy.language}
                    title={copy.language}
                    onClick={() => {
                      selectLocale(targetLocale);
                      menu.current?.close();
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M4 5h7M7.5 5v2.2a8.3 8.3 0 0 1-4.1 7.1M5 10.8c1.5 1.8 3.4 3.1 5.8 3.9M14 4l-4 10m2.2-4h7.3M16 13.5l3.5 6.5M12.7 16h6.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span>{copy.language}</span>
                  </Link>
                  <div className="drawer-theme-pill">
                    <ThemeToggle locale={locale} />
                  </div>
                </div>
              </div>
            </dialog>
          </nav>
        </header>

        <main id="main-content">{children}</main>

        <nav className="mobile-bottom-bar" aria-label={locale === "ar" ? "التنقل السفلي السريع" : "Quick bottom navigation"}>
          {bottomNavItems.map((item) => {
            const isActive = item.path === "/" ? isHome : currentPath === item.path || currentPath.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.key}
                href={href(item.path)}
                prefetch={false}
                className={`bottom-bar-link${isActive ? " is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="bottom-bar-icon" aria-hidden="true">{item.icon}</span>
                <span className="bottom-bar-label">{item.label}</span>
                {isActive && <span className="bottom-bar-indicator" aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>
        <footer className="site-footer">
          <div className="shell footer-inner">
            <div className="footer-grid">
              <div className="footer-brand">
                <strong dir="ltr">JahezDev</strong>
                <p>{copy.footer}</p>
              </div>
              <nav className="footer-links" aria-label={locale === "ar" ? "روابط الموقع" : "Site links"}>
                <div className="footer-group">
                  <p className="footer-heading">{copy.footerExplore}</p>
                  <Link aria-label={locale === "ar" ? `استكشف ${copy.topics}` : `Browse ${copy.topics}`} href={href("/topics")} prefetch={false}>{copy.topics}</Link>
                  <Link aria-label={locale === "ar" ? "تصفح الأسئلة" : "Browse questions"} href={href("/questions")} prefetch={false}>{copy.questions}</Link>
                  <Link aria-label={locale === "ar" ? `تدرّب: ${copy.interview}` : `Practice: ${copy.interview}`} href={href("/interview")} prefetch={false}>{copy.interview}</Link>
                </div>
                <div className="footer-group">
                  <p className="footer-heading">{copy.footerPractice}</p>
                  <Link aria-label={locale === "ar" ? `راجع ${copy.progress}` : `Review ${copy.progress}`} href={href("/progress")} prefetch={false}>{copy.progress}</Link>
                  <Link aria-label={locale === "ar" ? "فتح المسارات المحفوظة" : "Open saved routes"} href={href("/my-tracks")} prefetch={false}>{copy.myTracks}</Link>
                  <Link aria-label={locale === "ar" ? `ساهم: ${copy.submit}` : `Contribute: ${copy.submit}`} href={href("/submissions")} prefetch={false}>{copy.submit}</Link>
                </div>
                <div className="footer-group">
                  <p className="footer-heading">{copy.footerPolicies}</p>
                  <Link href={localizedHref(locale, "/privacy")} prefetch={false}>{copy.privacyPolicy}</Link>
                  <Link href={localizedHref(locale, "/terms")} prefetch={false}>{copy.termsOfUse}</Link>
                  <a href={repositoryUrl} target="_blank" rel="noreferrer">{copy.sourceCode}<span className="sr-only"> (GitHub)</span></a>
                </div>
              </nav>
            </div>
            <div className="footer-bottom">
              <span>{copy.footerRights}</span>
              <span>{copy.footerNote}</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
