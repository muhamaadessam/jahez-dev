import type { ReactElement } from "react";

type TrackLogoProps = {
  trackId?: string | null;
  size?: number;
  className?: string;
};

const TRACK_LOGOS: Record<string, { src: string; label: string }> = {
  flutter: { src: "/tracks/flutter.svg", label: "Flutter" },
  "android-native": { src: "/tracks/android.svg", label: "Android Native" },
  node: { src: "/tracks/node.svg", label: "Node.js" },
  php: { src: "/tracks/php.svg", label: "PHP & Laravel" },
  dotnet: { src: "/tracks/dotnet.svg", label: ".NET" },
  react: { src: "/tracks/react.svg", label: "React" },
  "react-native": { src: "/tracks/react-native.svg", label: "React Native" },
  fundamentals: { src: "/tracks/fundamentals.svg", label: "Software Fundamentals" },
  "ui-ux": { src: "/tracks/ui-ux.svg", label: "UI / UX Design" },
};

export function TrackLogo({ trackId, size = 32, className = "" }: TrackLogoProps): ReactElement {
  const meta = trackId ? TRACK_LOGOS[trackId] : undefined;

  if (!meta) {
    return (
      <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        role="img"
        aria-label="Tech Interview Prep"
        fill="none"
      >
        <path
          d="M8 7L3 12L8 17M16 7L21 12L16 17M13.5 5L10.5 19"
          stroke="var(--brand, #0284c7)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <img
      src={meta.src}
      alt={meta.label}
      width={size}
      height={size}
      className={className}
      loading="eager"
      decoding="async"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "inline-block",
        verticalAlign: "middle",
      }}
    />
  );
}
