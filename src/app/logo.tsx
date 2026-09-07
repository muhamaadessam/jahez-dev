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
          fill="#0F172A"
          stroke="url(#jahez-border)"
          strokeWidth="1.5"
        />
        {/* Center circle disc */}
        <circle cx="22" cy="22" r="14" fill="#10B981" fillOpacity={0.14} />

        {/* Left chevron `<` */}
        <path
          d="M11 16L5 22L11 28"
          stroke="#60A5FA"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bold checkmark `✓` */}
        <path
          d="M16 22.5L21 27.5L31 14.5"
          stroke="#34D399"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right chevron `>` */}
        <path
          d="M33 16L39 22L33 28"
          stroke="#60A5FA"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <defs>
          <linearGradient id="jahez-border" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A5FA" stopOpacity="0.6" />
            <stop offset="1" stopColor="#34D399" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}
