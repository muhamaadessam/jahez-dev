import type { ReactElement } from "react";

type TrackLogoProps = {
  trackId?: string | null;
  size?: number;
  className?: string;
};

export function TrackLogo({ trackId, size = 32, className = "" }: TrackLogoProps): ReactElement {
  const normId = (trackId ?? "").toLowerCase().trim();

  switch (normId) {
    case "flutter":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          role="img"
          aria-label="Flutter"
          fill="none"
        >
          <path d="M19.2 3.5L4.8 17.9l4.4 4.4L28 3.5h-8.8z" fill="#54C5F8" />
          <path d="M19.2 18.1l-7.2 7.2 4.4 4.4 7.2-7.2-4.4-4.4z" fill="#02569B" />
          <path d="M14.8 29.7l4.4 4.4h8.8l-8.8-8.8-4.4 4.4z" fill="#014275" />
          <path d="M19.2 25.3l4.4-4.4 4.4 4.4-4.4 4.4-4.4-4.4z" fill="#29B6F6" />
        </svg>
      );

    case "android-native":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          role="img"
          aria-label="Android Native"
          fill="none"
        >
          {/* Antennae */}
          <line x1="10" y1="10.5" x2="7.5" y2="6.5" stroke="var(--brand, #1a8738)" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="22" y1="10.5" x2="24.5" y2="6.5" stroke="var(--brand, #1a8738)" strokeWidth="2.2" strokeLinecap="round" />
          {/* Head dome */}
          <path
            d="M6 21.5C6 15.15 10.48 10 16 10s10 5.15 10 11.5H6z"
            fill="var(--brand, #1a8738)"
          />
          {/* Eyes */}
          <circle cx="11.5" cy="16.5" r="1.5" fill="var(--surface, #ffffff)" />
          <circle cx="20.5" cy="16.5" r="1.5" fill="var(--surface, #ffffff)" />
          {/* Collar detail */}
          <rect x="6" y="23.5" width="20" height="2.5" rx="1.25" fill="var(--brand, #1a8738)" />
        </svg>
      );

    case "node":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          role="img"
          aria-label="Node.js"
          fill="none"
        >
          {/* Hexagon shape */}
          <path
            d="M16 4.5l10.5 6v12L16 28.5 5.5 22.5v-12L16 4.5z"
            fill="var(--brand, #3c873a)"
          />
          {/* Inner isometric facet lines */}
          <path
            d="M16 4.5v12l10.5 6M16 16.5L5.5 22.5"
            stroke="color-mix(in srgb, var(--brand) 65%, #000000)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {/* Node text glyph */}
          <path
            d="M11.5 12.5v6.5l4 2.3v-6.5l-4-2.3zm6.5 2l2.8 1.6v4.4l-2.8-1.6v-4.4z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "php":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          role="img"
          aria-label="PHP & Laravel"
          fill="none"
        >
          {/* Laravel Isometric 3D faceted cube */}
          <path d="M16 4.5l10 5.8-10 5.7-10-5.7 10-5.8z" fill="#FF5245" />
          <path d="M6 10.3l10 5.7v11.5l-10-5.8V10.3z" fill="#E02424" />
          <path d="M16 16l10-5.7v11.5l-10 5.7V16z" fill="#B91C1C" />
          {/* Inner highlight */}
          <path d="M16 9l5 2.9-5 2.8-5-2.8 5-2.9z" fill="#FFFFFF" fillOpacity="0.88" />
        </svg>
      );

    case "dotnet":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          role="img"
          aria-label=".NET"
          fill="none"
        >
          {/* Purple circle badge */}
          <circle cx="16" cy="16" r="13" fill="var(--brand, #512bd4)" />
          {/* DotNet dot */}
          <circle cx="9.5" cy="21.5" r="2.2" fill="var(--on-brand, #FFFFFF)" />
          {/* .NET typography letter N */}
          <path
            d="M13.5 21.5V10.5h2.8l4.5 7.2v-7.2h2.5v11h-2.8l-4.5-7.2v7.2h-2.5z"
            fill="var(--on-brand, #FFFFFF)"
          />
        </svg>
      );

    case "react":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          role="img"
          aria-label="React"
          fill="none"
        >
          {/* React atom nucleus */}
          <circle cx="16" cy="16" r="2.5" fill="var(--brand, #087ea4)" />
          {/* Ellipse 1 (Horizontal) */}
          <ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="var(--brand, #087ea4)" strokeWidth="1.8" />
          {/* Ellipse 2 (Rotated 60deg) */}
          <ellipse
            cx="16"
            cy="16"
            rx="12"
            ry="4.5"
            stroke="var(--brand, #087ea4)"
            strokeWidth="1.8"
            transform="rotate(60 16 16)"
          />
          {/* Ellipse 3 (Rotated 120deg) */}
          <ellipse
            cx="16"
            cy="16"
            rx="12"
            ry="4.5"
            stroke="var(--brand, #087ea4)"
            strokeWidth="1.8"
            transform="rotate(120 16 16)"
          />
        </svg>
      );

    case "react-native":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          role="img"
          aria-label="React Native"
          fill="none"
        >
          {/* Phone device frame */}
          <rect x="7.5" y="4" width="17" height="24" rx="3.5" stroke="var(--brand, #0284c7)" strokeWidth="1.8" />
          <circle cx="16" cy="6.5" r="0.75" fill="var(--brand, #0284c7)" />
          <line x1="14.5" y1="25.5" x2="17.5" y2="25.5" stroke="var(--brand, #0284c7)" strokeWidth="1.4" strokeLinecap="round" />
          {/* Mini React atom inside screen */}
          <circle cx="16" cy="16" r="1.5" fill="var(--brand, #0284c7)" />
          <ellipse cx="16" cy="16" rx="5.5" ry="2.2" stroke="var(--brand, #0284c7)" strokeWidth="1.1" />
          <ellipse cx="16" cy="16" rx="5.5" ry="2.2" stroke="var(--brand, #0284c7)" strokeWidth="1.1" transform="rotate(60 16 16)" />
          <ellipse cx="16" cy="16" rx="5.5" ry="2.2" stroke="var(--brand, #0284c7)" strokeWidth="1.1" transform="rotate(120 16 16)" />
        </svg>
      );

    case "fundamentals":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          role="img"
          aria-label="Software Fundamentals"
          fill="none"
        >
          {/* Microchip body */}
          <rect x="8" y="8" width="16" height="16" rx="3" stroke="var(--brand, #4f46e5)" strokeWidth="1.8" />
          {/* Pins top/bottom */}
          <line x1="12" y1="4.5" x2="12" y2="8" stroke="var(--brand, #4f46e5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="4.5" x2="16" y2="8" stroke="var(--brand, #4f46e5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="4.5" x2="20" y2="8" stroke="var(--brand, #4f46e5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="24" x2="12" y2="27.5" stroke="var(--brand, #4f46e5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="24" x2="16" y2="27.5" stroke="var(--brand, #4f46e5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="24" x2="20" y2="27.5" stroke="var(--brand, #4f46e5)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Pins left/right */}
          <line x1="4.5" y1="12" x2="8" y2="12" stroke="var(--brand, #4f46e5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4.5" y1="16" x2="8" y2="16" stroke="var(--brand, #4f46e5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4.5" y1="20" x2="8" y2="20" stroke="var(--brand, #4f46e5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="24" y1="12" x2="27.5" y2="12" stroke="var(--brand, #4f46e5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="24" y1="16" x2="27.5" y2="16" stroke="var(--brand, #4f46e5)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="24" y1="20" x2="27.5" y2="20" stroke="var(--brand, #4f46e5)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Code brackets inside chip */}
          <path
            d="M13 13.5L10.8 16l2.2 2.5M19 13.5l2.2 2.5-2.2 2.5"
            stroke="var(--brand-strong, var(--brand, #4f46e5))"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "ui-ux":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          role="img"
          aria-label="UI / UX Design"
          fill="none"
        >
          {/* Figma-style geometric color shapes */}
          <rect x="9" y="6" width="7" height="7" rx="3.5" fill="#F24E1E" />
          <rect x="16" y="6" width="7" height="7" rx="3.5" fill="#FF7262" />
          <rect x="9" y="13" width="7" height="7" rx="3.5" fill="#A259FF" />
          <circle cx="19.5" cy="16.5" r="3.5" fill="#1ABCFE" />
          <path d="M9 20h3.5a3.5 3.5 0 0 1 3.5 3.5v0a3.5 3.5 0 0 1-3.5 3.5 3.5 3.5 0 0 1-3.5-3.5V20z" fill="#0ACF83" />
        </svg>
      );

    default:
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          role="img"
          aria-label="Tech Interview Prep"
          fill="none"
        >
          <path
            d="M9 12l4 4-4 4M23 12l-4 4 4 4"
            fill="none"
            stroke="var(--brand, #087ea4)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M14.5 22h3" stroke="var(--brand, #087ea4)" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
  }
}
