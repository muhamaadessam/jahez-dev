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
          viewBox="0 0 128 128"
          role="img"
          aria-label="Flutter"
          fill="none"
        >
          <path d="M12.3 64.2L76.3 0h39.4L32.1 83.6zM76.3 128h39.4L81.6 93.9l34.1-34.8H76.3L42.2 93.5z" fill="#47C5FB" />
          <path d="M81.6 93.9l-20-20-19.4 19.6 19.4 19.6z" fill="#02569B" />
          <path d="M115.7 128L81.6 93.9l-20 19.2L76.3 128z" fill="#01579B" />
          <path d="M61.6 113.1l30.8-8.4-10.8-10.8z" fill="#29B6F6" />
        </svg>
      );

    case "android-native":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          role="img"
          aria-label="Android Native"
          fill="none"
        >
          <path
            fill="#3DDC84"
            d="M17.523 15.341c-.551 0-.999-.448-.999-1s.448-1 .999-1c.551 0 .999.448.999 1 0 .552-.448 1-.999 1m-11.046 0c-.551 0-.999-.448-.999-1s.448-1 .999-1c.551 0 .999.448.999 1 0 .552-.448 1-.999 1m11.405-6.02l1.997-3.46a.416.416 0 00-.152-.567.416.416 0 00-.568.152l-2.022 3.503C15.59 8.411 13.853 8.081 12 8.081s-3.59.33-4.737.869L5.241 5.447a.416.416 0 00-.568-.152.416.416 0 00-.152.568l1.997 3.459C2.689 11.187.343 14.659 0 18.761h24c-.343-4.102-2.689-7.574-6.118-9.44"
          />
        </svg>
      );

    case "node":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 128 128"
          role="img"
          aria-label="Node.js"
          fill="none"
        >
          <path
            fill="#339933"
            d="M66.958.825a6.07 6.07 0 0 0-6.035 0L11.103 29.76c-1.895 1.072-2.96 3.095-2.96 5.24v57.988c0 2.143 1.183 4.167 2.958 5.24l49.82 28.934a6.07 6.07 0 0 0 6.036 0l49.82-28.935c1.894-1.072 2.958-3.096 2.958-5.24V35c0-2.144-1.183-4.167-2.958-5.24z"
          />
          <path
            fill="#5FA04E"
            d="M116.897 29.76L66.841.825A8.161 8.161 0 0 0 65.302.23L9.21 96.798a6.251 6.251 0 0 0 1.657 1.43l50.057 28.934c1.42.833 3.076 1.072 4.615.595l52.66-96.925a3.702 3.702 0 0 0-1.302-1.072z"
            opacity="0.85"
          />
          <path
            fill="#66CC33"
            d="M116.898 98.225c1.42-.833 2.485-2.262 2.958-3.81L65.066.108c-1.42-.238-2.959-.119-4.26.715L11.104 29.639l53.606 98.355c.71-.12 1.54-.358 2.25-.715z"
            opacity="0.65"
          />
          <path
            fill="#FFFFFF"
            d="M64 52c-7.2 0-12.8 4.2-12.8 11.2 0 7.8 6.4 9.8 12.8 11.2 5.2 1.1 8 2.5 8 5.6 0 3.8-3.6 5.8-8.2 5.8-6.1 0-9.8-3.2-10.4-7.8h-6.2c.8 8 7 13.4 16.6 13.4 8.5 0 14.6-4.6 14.6-12 0-8.2-6.6-10.4-13.4-11.8-4.9-1-7.4-2.2-7.4-5.1 0-3.2 2.8-5.1 7.2-5.1 5.2 0 8.2 2.4 9 6.4h6.1C79.1 56 73.1 52 64 52z"
          />
        </svg>
      );

    case "php":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 50 52"
          role="img"
          aria-label="PHP & Laravel"
        >
          <path
            fill="#FF2D20"
            fillRule="evenodd"
            d="M49.626 11.564a.809.809 0 0 1 .028.209v10.972a.8.8 0 0 1-.402.694l-9.209 5.302V39.25c0 .286-.152.55-.4.694L20.42 51.01c-.044.025-.092.041-.14.058-.018.006-.035.017-.054.022a.805.805 0 0 1-.41 0c-.022-.006-.042-.018-.063-.026-.044-.016-.09-.03-.132-.054L.402 39.944A.801.801 0 0 1 0 39.25V6.334c0-.072.01-.142.028-.21.006-.023.02-.044.028-.067.015-.042.029-.085.051-.124.015-.026.037-.047.055-.071.023-.032.044-.065.071-.093.023-.023.053-.04.079-.06.029-.024.055-.05.088-.069h.001l9.61-5.533a.802.802 0 0 1 .8 0l9.61 5.533h.002c.032.02.059.045.088.068.026.02.055.038.078.06.028.029.048.062.072.094.017.024.04.045.054.071.023.04.036.082.052.124.008.023.022.044.028.068a.809.809 0 0 1 .028.209v20.559l8.008-4.611v-10.51c0-.07.01-.141.028-.208.007-.024.02-.045.028-.068.016-.042.03-.085.052-.124.015-.026.037-.047.054-.071.024-.032.044-.065.072-.093.023-.023.052-.04.078-.06.03-.024.056-.05.088-.069h.001l9.611-5.533a.801.801 0 0 1 .8 0l9.61 5.533c.034.02.06.045.09.068.025.02.054.038.077.06.028.029.048.062.072.094.018.024.04.045.054.071.023.039.036.082.052.124.009.023.022.044.028.068zm-1.574 10.718v-9.124l-3.363 1.936-4.646 2.675v9.124l8.01-4.611zm-9.61 16.505v-9.13l-4.57 2.61-13.05 7.448v9.216l17.62-10.144zM1.602 7.719v31.068L19.22 48.93v-9.214l-9.204-5.209-.003-.002-.004-.002c-.031-.018-.057-.044-.086-.066-.025-.02-.054-.036-.076-.058l-.002-.003c-.026-.025-.044-.056-.066-.084-.02-.027-.044-.05-.06-.078l-.001-.003c-.018-.03-.029-.066-.042-.1-.013-.03-.03-.058-.038-.09v-.001c-.01-.038-.012-.078-.016-.117-.004-.03-.012-.06-.012-.09v-.002-21.481L4.965 9.654 1.602 7.72zm8.81-5.994L2.405 6.334l8.005 4.609 8.006-4.61-8.006-4.608zm4.164 28.764l4.645-2.674V7.719l-3.363 1.936-4.646 2.675v20.096l3.364-1.937zM39.243 7.164l-8.006 4.609 8.006 4.609 8.005-4.61-8.005-4.608zm-.801 10.605l-4.646-2.675-3.363-1.936v9.124l4.645 2.674 3.364 1.937v-9.124zM20.02 38.33l11.743-6.704 5.87-3.35-8-4.606-9.211 5.303-8.395 4.833 7.993 4.524z"
          />
        </svg>
      );

    case "dotnet":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 64 64"
          role="img"
          aria-label=".NET"
        >
          <circle cx="32" cy="32" r="32" fill="#512BD4" />
          <path
            fill="#FFFFFF"
            d="M7.4 37.25a1.35 1.35 0 0 1-1-.42 1.38 1.38 0 0 1-.41-1 1.4 1.4 0 0 1 .41-1 1.34 1.34 0 0 1 1-.43 1.37 1.37 0 0 1 1 .43 1.39 1.39 0 0 1 .42 1 1.37 1.37 0 0 1-.42 1 1.38 1.38 0 0 1-1 .42zM27.27 37H24.65L15.28 22.46a6 6 0 0 1-.58-1.14h-.08a18.72 18.72 0 0 1 .1 2.5V37H12.59V18.77h2.77l9.12 14.28q.57.89.74 1.22h.05a19.28 19.28 0 0 1-.13-2.68V18.77h2.13zM41.69 37H32V18.77h9.24V20.7H34.18v6.06h6.58v1.92H34.18V35h7.52zM56 20.7H50.7V37H48.57V20.7H43.33V18.77H56z"
          />
        </svg>
      );

    case "react":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="-11.5 -10.23174 23 20.46348"
          role="img"
          aria-label="React"
          fill="none"
        >
          <circle cx="0" cy="0" r="2.05" fill="#087EA4" />
          <g stroke="#087EA4" strokeWidth="1">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );

    case "react-native":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="-11.5 -10.23174 23 20.46348"
          role="img"
          aria-label="React Native"
          fill="none"
        >
          <circle cx="0" cy="0" r="2.2" fill="#0284C7" />
          <g stroke="#0284C7" strokeWidth="1.15">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );

    case "fundamentals":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          role="img"
          aria-label="Software Fundamentals"
          fill="none"
        >
          <rect x="2" y="3" width="20" height="18" rx="4" stroke="#6366F1" strokeWidth="2" />
          <path d="M7 8l4 4-4 4M13 16h4" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "ui-ux":
      return (
        <svg
          className={className}
          width={size}
          height={size}
          viewBox="0 0 38 57"
          role="img"
          aria-label="UI / UX Design"
        >
          <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
          <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
          <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
          <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
          <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
        </svg>
      );

    default:
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
}
