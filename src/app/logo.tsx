import type { ReactElement } from "react";

type BrandLogoProps = {
  size?: number;
  className?: string;
  trackId?: string | null;
};

export function BrandLogo({ size = 36, className = "" }: BrandLogoProps = {}): ReactElement {
  return (
    <span className={`brand-logo ${className}`} aria-hidden="true">
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="JahezDev"
      >
        <rect
          width="44"
          height="44"
          rx="12"
          fill="url(#jahez-bg)"
          stroke="url(#jahez-border)"
          strokeWidth="1.5"
        />
        {/* Subtle emerald glow */}
        <circle cx="22" cy="22" r="14" fill="#10B981" fillOpacity="0.14" />

        {/* Left chevron `<` */}
        <path
          d="M12 16L6 22L12 28"
          stroke="#38BDF8"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center checkmark `✓` */}
        <path
          d="M16.5 22.5L21.5 27.5L31.5 14.5"
          stroke="#10B981"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right chevron `>` */}
        <path
          d="M32 16L38 22L32 28"
          stroke="#38BDF8"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <defs>
          <linearGradient id="jahez-bg" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0E172A" />
            <stop offset="1" stopColor="#030712" />
          </linearGradient>
          <linearGradient id="jahez-border" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" stopOpacity="0.65" />
            <stop offset="1" stopColor="#10B981" stopOpacity="0.65" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}
