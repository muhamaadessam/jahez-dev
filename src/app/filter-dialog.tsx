"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { messages, type Locale } from "../i18n";

type FilterDialogProps = {
  locale: Locale;
  title: string;
  summary: string;
  activeCount: number;
  children: (controls: { close: () => void }) => ReactNode;
  onClear?: () => void;
};

export function FilterDialog({ locale, title, summary, activeCount, children, onClear }: FilterDialogProps) {
  const copy = messages[locale];
  const [open, setOpen] = useState(false);
  const headingId = useId();
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    requestAnimationFrame(() => heading.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return <>
    <button className="filter-trigger" type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M4 6h16M7 12h10M10 18h4" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span>{copy.filters}</span>
      <span className="filter-trigger-summary">{summary}</span>
      {activeCount > 0 && <span className="filter-trigger-count" aria-label={`${activeCount} ${copy.activeFilters}`}>{activeCount}</span>}
    </button>

    {open && <div className="filter-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section className="filter-dialog" role="dialog" aria-modal="true" aria-labelledby={headingId} dir={locale === "ar" ? "rtl" : "ltr"}>
        <header className="filter-dialog-header">
          <div>
            <h2 id={headingId} ref={heading} tabIndex={-1}>{title}</h2>
          </div>
          <button className="filter-dialog-close" type="button" onClick={close} aria-label={copy.close}>×</button>
        </header>
        <div className="filter-dialog-body">{children({ close })}</div>
        <footer className="filter-dialog-actions">
          {onClear && <button className="button" type="button" onClick={onClear}>{copy.clearFilters}</button>}
          <button className="button primary" type="button" onClick={close}>{copy.saveFilters}</button>
        </footer>
      </section>
    </div>}
  </>;
}
