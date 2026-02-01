export const LIVEAVATAR_BASE_URL = "https://api.liveavatar.com/v1";

// Keep working defaults in code (as requested)
export const LIVEAVATAR_AVATAR_ID = process.env.LIVEAVATAR_AVATAR_ID || "9650a758-1085-4d49-8bf3-f347565ec229";
export const LIVEAVATAR_VOICE_ID = process.env.LIVEAVATAR_VOICE_ID || "c23719ef-d070-42ee-9cd9-4b867c621671";
export const LIVEAVATAR_CONTEXT_ID = process.env.LIVEAVATAR_CONTEXT_ID || "ff6ea605-fd86-449c-8b22-ecb41bd4b27e";

export function getApiKey() {
  const key = process.env.LIVEAVATAR_API_KEY;
  if (!key) throw new Error("Missing LIVEAVATAR_API_KEY in environment");
  return key;
}

export async function readJson(req: any) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
}
