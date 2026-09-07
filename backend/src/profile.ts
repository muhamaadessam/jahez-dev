import { fetchUpstream } from "./upstream.ts";

export type AccountProfile = { username: string | null };
export type ProfileStore = {
  get: (userId: string) => Promise<AccountProfile>;
  save: (userId: string, username: unknown) => Promise<AccountProfile>;
};

export class ProfileError extends Error {
  readonly code: string;
  readonly status: number;
  constructor(code: string, status = 503) { super(code); this.name = "ProfileError"; this.code = code; this.status = status; }
}

export function normalizeUsername(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !/^[a-z0-9_]{3,30}$/.test(value.trim().toLowerCase())) throw new ProfileError("username_invalid", 400);
  return value.trim().toLowerCase();
}

export function createSupabaseProfileStore({ url, serviceRoleKey, fetchImpl = fetch }: { url: string; serviceRoleKey: string; fetchImpl?: typeof fetch }): ProfileStore {
  const base = url.replace(/\/$/, "");
  const request = async (path: string, init: RequestInit = {}) => {
    const response = await fetchUpstream(fetchImpl, `${base}${path}`, { ...init, headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, "Content-Type": "application/json", ...(init.headers ?? {}) } });
    if (!response.ok) {
      const body = await response.json().catch(() => ({})) as { message?: unknown };
      const code = typeof body.message === "string" && ["username_invalid", "username_taken"].includes(body.message) ? body.message : "profile_unavailable";
      throw new ProfileError(code, code === "username_invalid" ? 400 : code === "username_taken" ? 409 : 503);
    }
    return response;
  };
  return {
    async get(userId) {
      const rows = await (await request(`/rest/v1/account_roles?select=username&user_id=eq.${encodeURIComponent(userId)}&limit=1`)).json() as Array<{ username?: unknown }>;
      return { username: typeof rows[0]?.username === "string" ? rows[0].username : null };
    },
    async save(userId, value) {
      const username = normalizeUsername(value);
      await request("/rest/v1/rpc/set_account_username", { method: "POST", body: JSON.stringify({ p_user_id: userId, p_username: username }) });
      return { username };
    },
  };
}
