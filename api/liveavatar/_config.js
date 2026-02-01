export const LIVEAVATAR_BASE_URL = "https://api.liveavatar.com/v1";

export const AVATAR_ID = "9650a758-1085-4d49-8bf3-f347565ec229";
export const VOICE_ID = "c23719ef-d070-42ee-9cd9-4b867c621671";
export const CONTEXT_ID = "ff6ea605-fd86-449c-8b22-ecb41bd4b27e";

export function getApiKey() {
  return process.env.LIVEAVATAR_API_KEY;
}

export async function readJson(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}
