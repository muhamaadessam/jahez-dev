import { TrackLogo } from "./track-logos";

export function BrandLogo({ trackId }: { trackId?: string | null } = {}) {
  return (
    <span className="brand-logo" aria-hidden="true">
      <TrackLogo trackId={trackId} size={24} />
    </span>
  );
}
