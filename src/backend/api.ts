export function nodeApiUrl(): string | null {
  const value = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  return value || null;
}

export async function nodeRequest<T>({ path, token, fetchImpl = fetch, init }: { path: string; token?: string; fetchImpl?: typeof fetch; init?: RequestInit }): Promise<T> {
  const base = nodeApiUrl();
  if (!base) throw new Error("node_api_unavailable");
  const headers = new Headers(init?.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init?.body != null && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetchImpl(`${base}/v1${path}`, { ...init, headers });
  const body = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) throw Object.assign(new Error(typeof body.error === "string" ? body.error : "node_api_unavailable"), { status: response.status, code: typeof body.error === "string" ? body.error : "node_api_unavailable" });
  return body as T;
}
