import { nodeRequest } from "../backend/api.ts";

export type AccountProfile = { username: string | null };

export async function loadProfile(getToken: () => Promise<string | null>): Promise<AccountProfile> {
  const token = await getToken();
  if (!token) throw new Error("unauthenticated");
  return nodeRequest<AccountProfile>({ path: "/me/profile", token });
}

export async function saveProfile(username: string, getToken: () => Promise<string | null>): Promise<AccountProfile> {
  const token = await getToken();
  if (!token) throw new Error("unauthenticated");
  return nodeRequest<AccountProfile>({ path: "/me/profile", token, init: { method: "PUT", body: JSON.stringify({ username }) } });
}
