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
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="JahezDev"
      >
        <defs>
          <filter id="jahez-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5.5" result="blur" />
          </filter>
          <radialGradient id="jahez-glow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--logo-check, #10B981)" stopOpacity="0.32" />
            <stop offset="60%" stopColor="var(--logo-check, #10B981)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--logo-check, #10B981)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="jahez-border" x1="1" y1="1" x2="47" y2="47" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--logo-chevron, #38BDF8)" stopOpacity="0.85" />
            <stop offset="1" stopColor="var(--logo-check, #10B981)" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Transparent squircle frame without solid background */}
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="12"
          fill="none"
          stroke="url(#jahez-border)"
          strokeWidth="1.6"
        />

        {/* Ambient blurry glow fading to transparent */}
        <circle cx="24" cy="24" r="14" fill="url(#jahez-glow-grad)" filter="url(#jahez-glow)" />

        {/* Left chevron `<` */}
        <path
          d="M15.5 17.5L10 24L15.5 30.5"
          stroke="var(--logo-chevron, #38BDF8)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Centered checkmark `✓` */}
        <path
          d="M19 23.5L23 28L29 17"
          stroke="var(--logo-check, #10B981)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right chevron `>` */}
        <path
          d="M32.5 17.5L38 24L32.5 30.5"
          stroke="var(--logo-chevron, #38BDF8)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
