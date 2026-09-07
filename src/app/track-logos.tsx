import type { ReactElement } from "react";

type TrackLogoProps = {
  trackId?: string | null;
  size?: number;
  className?: string;
};

export function TrackLogo({ trackId, size = 40, className = "" }: TrackLogoProps): ReactElement {
  const normId = (trackId ?? "").toLowerCase().trim();

  switch (normId) {
    case "flutter":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 40 40"
          role="img"
          aria-label="Flutter"
          fill="none"
        >
          <rect width="40" height="40" rx="10" fill="url(#flutter-bg)" />
          <defs>
            <linearGradient id="flutter-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#042B48" />
              <stop offset="1" stopColor="#021B30" />
            </linearGradient>
          </defs>
          <path d="M24.2 7.5L8.5 23.2l4.8 4.8L33.8 7.5H24.2z" fill="#54C5F8" />
          <path d="M24.2 23.3l-7.8 7.8 4.8 4.8 7.8-7.8-4.8-4.8z" fill="#02569B" />
          <path d="M19.4 35.9l4.8 4.8h9.6L24.2 31.1l-4.8 4.8z" fill="#014275" />
          <path d="M24.2 31.1l4.8-4.8 4.8 4.8-4.8 4.8-4.8-4.8z" fill="#29B6F6" />
        </svg>
      );

    case "android-native":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 40 40"
          role="img"
          aria-label="Android Native"
          fill="none"
        >
          <rect width="40" height="40" rx="10" fill="url(#android-bg)" />
          <defs>
            <linearGradient id="android-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#073021" />
              <stop offset="1" stopColor="#031A11" />
            </linearGradient>
          </defs>
          {/* Antennae */}
          <line x1="14" y1="12" x2="11" y2="7.5" stroke="#3DDC84" strokeWidth="2.4" strokeLinecap="round" />
          <line x1="26" y1="12" x2="29" y2="7.5" stroke="#3DDC84" strokeWidth="2.4" strokeLinecap="round" />
          {/* Head dome */}
          <path
            d="M10 24.5C10 18.15 14.48 13 20 13s10 5.15 10 11.5H10z"
            fill="#3DDC84"
          />
          {/* Eyes */}
          <circle cx="15.5" cy="19.5" r="1.5" fill="#073021" />
          <circle cx="24.5" cy="19.5" r="1.5" fill="#073021" />
          {/* Collar detail */}
          <rect x="10" y="27" width="20" height="2.5" rx="1.25" fill="#3DDC84" />
        </svg>
      );

    case "node":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 40 40"
          role="img"
          aria-label="Node.js"
          fill="none"
        >
          <rect width="40" height="40" rx="10" fill="url(#node-bg)" />
          <defs>
            <linearGradient id="node-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#122513" />
              <stop offset="1" stopColor="#09150A" />
            </linearGradient>
          </defs>
          {/* Hexagon shape */}
          <path
            d="M20 8l11.5 6.6v13.3L20 34.5 8.5 27.9V14.6L20 8z"
            fill="#5FA04E"
          />
          {/* Inner isometric facet lines */}
          <path
            d="M20 8v13.3l11.5 6.6M20 21.3L8.5 27.9"
            stroke="#3E7533"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* JS / Node text glyph */}
          <path
            d="M15 16.5v7l4.5 2.5v-7L15 16.5zm7 2.2l3 1.7v4.8l-3-1.7v-4.8z"
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
          viewBox="0 0 40 40"
          role="img"
          aria-label="PHP & Laravel"
          fill="none"
        >
          <rect width="40" height="40" rx="10" fill="url(#laravel-bg)" />
          <defs>
            <linearGradient id="laravel-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#300B09" />
              <stop offset="1" stopColor="#1B0403" />
            </linearGradient>
          </defs>
          {/* Laravel Isometric 3D faceted cube */}
          <path d="M20 7.5l11 6.3-11 6.3-11-6.3 11-6.3z" fill="#FF5245" />
          <path d="M9 13.8l11 6.3v12.4l-11-6.3V13.8z" fill="#E02424" />
          <path d="M20 20.1l11-6.3v12.4l-11 6.3V20.1z" fill="#B91C1C" />
          {/* Geometric inner slash */}
          <path d="M20 12.5l5.5 3.1-5.5 3.2-5.5-3.2 5.5-3.1z" fill="#FFFFFF" fillOpacity="0.85" />
        </svg>
      );

    case "dotnet":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 40 40"
          role="img"
          aria-label=".NET"
          fill="none"
        >
          <rect width="40" height="40" rx="10" fill="url(#dotnet-bg)" />
          <defs>
            <linearGradient id="dotnet-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#512BD4" />
              <stop offset="1" stopColor="#2D1482" />
            </linearGradient>
          </defs>
          {/* DotNet Wave Ribbon / Emblem */}
          <circle cx="12" cy="27" r="3.2" fill="#FFFFFF" />
          {/* Stylized .NET text / curve */}
          <path
            d="M17 27V13h3.5l5.5 9V13H29v14h-3.5l-5.5-9v9H17z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case "react":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 40 40"
          role="img"
          aria-label="React"
          fill="none"
        >
          <rect width="40" height="40" rx="10" fill="url(#react-bg)" />
          <defs>
            <linearGradient id="react-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0B2536" />
              <stop offset="1" stopColor="#051520" />
            </linearGradient>
          </defs>
          {/* React atom nucleus */}
          <circle cx="20" cy="20" r="2.8" fill="#58C4DC" />
          {/* Ellipse 1 (Horizontal) */}
          <ellipse cx="20" cy="20" rx="14" ry="5.2" stroke="#58C4DC" strokeWidth="1.8" />
          {/* Ellipse 2 (Rotated 60deg) */}
          <ellipse
            cx="20"
            cy="20"
            rx="14"
            ry="5.2"
            stroke="#58C4DC"
            strokeWidth="1.8"
            transform="rotate(60 20 20)"
          />
          {/* Ellipse 3 (Rotated 120deg) */}
          <ellipse
            cx="20"
            cy="20"
            rx="14"
            ry="5.2"
            stroke="#58C4DC"
            strokeWidth="1.8"
            transform="rotate(120 20 20)"
          />
        </svg>
      );

    case "react-native":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 40 40"
          role="img"
          aria-label="React Native"
          fill="none"
        >
          <rect width="40" height="40" rx="10" fill="url(#rn-bg)" />
          <defs>
            <linearGradient id="rn-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#082A45" />
              <stop offset="1" stopColor="#031625" />
            </linearGradient>
          </defs>
          {/* Phone device frame */}
          <rect x="9.5" y="6.5" width="21" height="27" rx="3.5" stroke="#38BDF8" strokeWidth="1.8" />
          <circle cx="20" cy="9" r="0.75" fill="#38BDF8" />
          <line x1="18" y1="31" x2="22" y2="31" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
          {/* Mini React atom inside screen */}
          <circle cx="20" cy="19.5" r="1.6" fill="#38BDF8" />
          <ellipse cx="20" cy="19.5" rx="6.5" ry="2.6" stroke="#38BDF8" strokeWidth="1.2" />
          <ellipse cx="20" cy="19.5" rx="6.5" ry="2.6" stroke="#38BDF8" strokeWidth="1.2" transform="rotate(60 20 19.5)" />
          <ellipse cx="20" cy="19.5" rx="6.5" ry="2.6" stroke="#38BDF8" strokeWidth="1.2" transform="rotate(120 20 19.5)" />
        </svg>
      );

    case "fundamentals":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 40 40"
          role="img"
          aria-label="Software Fundamentals"
          fill="none"
        >
          <rect width="40" height="40" rx="10" fill="url(#fund-bg)" />
          <defs>
            <linearGradient id="fund-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E1B4B" />
              <stop offset="1" stopColor="#0F0D29" />
            </linearGradient>
          </defs>
          {/* Microchip body */}
          <rect x="11.5" y="11.5" width="17" height="17" rx="3" stroke="#818CF8" strokeWidth="1.8" />
          {/* Pins top/bottom */}
          <line x1="16" y1="8" x2="16" y2="11.5" stroke="#818CF8" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="20" y1="8" x2="20" y2="11.5" stroke="#818CF8" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="24" y1="8" x2="24" y2="11.5" stroke="#818CF8" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="16" y1="28.5" x2="16" y2="32" stroke="#818CF8" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="20" y1="28.5" x2="20" y2="32" stroke="#818CF8" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="24" y1="28.5" x2="24" y2="32" stroke="#818CF8" strokeWidth="1.6" strokeLinecap="round" />
          {/* Pins left/right */}
          <line x1="8" y1="16" x2="11.5" y2="16" stroke="#818CF8" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="8" y1="20" x2="11.5" y2="20" stroke="#818CF8" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="8" y1="24" x2="11.5" y2="24" stroke="#818CF8" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="28.5" y1="16" x2="32" y2="16" stroke="#818CF8" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="28.5" y1="20" x2="32" y2="20" stroke="#818CF8" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="28.5" y1="24" x2="32" y2="24" stroke="#818CF8" strokeWidth="1.6" strokeLinecap="round" />
          {/* Code brackets inside chip */}
          <path
            d="M17 17.5L14.8 20l2.2 2.5M23 17.5l2.2 2.5-2.2 2.5"
            stroke="#A5B4FC"
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
          viewBox="0 0 40 40"
          role="img"
          aria-label="UI / UX Design"
          fill="none"
        >
          <rect width="40" height="40" rx="10" fill="url(#uiux-bg)" />
          <defs>
            <linearGradient id="uiux-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B0764" />
              <stop offset="1" stopColor="#1E0333" />
            </linearGradient>
          </defs>
          {/* Figma-style geometric color circles & shapes */}
          <rect x="12" y="9" width="8" height="8" rx="4" fill="#F24E1E" />
          <rect x="20" y="9" width="8" height="8" rx="4" fill="#FF7262" />
          <rect x="12" y="17" width="8" height="8" rx="4" fill="#A259FF" />
          <circle cx="24" cy="21" r="4" fill="#1ABCFE" />
          <path d="M12 25h4a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4 4 4 0 0 1-4-4v-4z" fill="#0ACF83" />
        </svg>
      );

    default:
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 40 40"
          role="img"
          aria-label="Tech Interview Prep"
          fill="none"
        >
          <rect width="40" height="40" rx="10" fill="url(#fallback-gradient)" />
          <defs>
            <linearGradient id="fallback-gradient" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--brand, #087ea4)" />
              <stop offset="1" stopColor="var(--brand-strong, #056585)" />
            </linearGradient>
          </defs>
          <path
            d="M12 16l4.5 4-4.5 4M28 16l-4.5 4 4.5 4"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M18.5 27h3" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
  }
}
