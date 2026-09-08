import { fetchUpstream } from "./upstream.ts";

export type SiteStats = { users: number; visitors: number };

export class SiteStatsError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, status = 503) {
    super(code);
    this.name = "SiteStatsError";
    this.code = code;
    this.status = status;
  }
}

export type SiteStatsStore = { recordVisitor: (visitorId: string) => Promise<SiteStats> };

const visitorIdPattern = /^[A-Za-z0-9_-]{16,128}$/;

function parseCount(value: unknown): number | null {
  const count = typeof value === "number" || typeof value === "string" ? value : value && typeof value === "object" && !Array.isArray(value)
    ? (value as { count?: unknown; total_count?: unknown; totalCount?: unknown; register_site_visitor?: unknown }).count
      ?? (value as { total_count?: unknown }).total_count
      ?? (value as { totalCount?: unknown }).totalCount
      ?? (value as { register_site_visitor?: unknown }).register_site_visitor
    : Array.isArray(value) && value.length > 0
      ? parseCount(value[0])
      : null;
  const numericCount = typeof count === "string" && /^\d+$/.test(count) ? Number(count) : count;
  return typeof numericCount === "number" && Number.isSafeInteger(numericCount) && numericCount >= 0 ? numericCount : null;
}

async function hashVisitorId(visitorId: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(visitorId));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function createSiteStatsStore({ url, serviceRoleKey, clerkSecretKey, fetchImpl = fetch }: {
  url: string;
  serviceRoleKey: string;
  clerkSecretKey: string;
  fetchImpl?: typeof fetch;
}): SiteStatsStore {
  const base = url.replace(/\/$/, "");
  let cachedUsers: { value: number; expiresAt: number } | null = null;

  const userCount = async (): Promise<number> => {
    if (cachedUsers && cachedUsers.expiresAt > Date.now()) return cachedUsers.value;

    const response = await fetchUpstream(fetchImpl, "https://api.clerk.com/v1/users/count", {
      headers: { Authorization: `Bearer ${clerkSecretKey}`, Accept: "application/json" },
    });
    if (!response.ok) throw new SiteStatsError("site_stats_unavailable");
    const count = parseCount(await response.json().catch(() => null));
    if (count === null) throw new SiteStatsError("site_stats_unavailable");
    cachedUsers = { value: count, expiresAt: Date.now() + 60_000 };
    return count;
  };

  const registerVisitor = async (visitorHash: string): Promise<number> => {
    const response = await fetchUpstream(fetchImpl, `${base}/rest/v1/rpc/register_site_visitor`, {
      method: "POST",
      headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_visitor_hash: visitorHash }),
    });
    if (!response.ok) throw new SiteStatsError("site_stats_unavailable");
    const count = parseCount(await response.json().catch(() => null));
    if (count === null) throw new SiteStatsError("site_stats_unavailable");
    return count;
  };

  return {
    async recordVisitor(visitorId) {
      if (!visitorIdPattern.test(visitorId)) throw new SiteStatsError("invalid_visitor", 400);
      const [users, visitors] = await Promise.all([userCount(), hashVisitorId(visitorId).then(registerVisitor)]);
      return { users, visitors };
    },
  };
}
