import {
  LIVEAVATAR_BASE_URL,
  LIVEAVATAR_AVATAR_ID,
  LIVEAVATAR_VOICE_ID,
  LIVEAVATAR_CONTEXT_ID,
  getApiKey,
  readJson,
} from "./_config";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = await readJson(req);
    const language =
      typeof body?.language === "string" && body.language.trim()
        ? body.language.trim()
        : "ru";

    const payload = {
      avatar_id: LIVEAVATAR_AVATAR_ID,
      language,
      voice: {
        voice_id: LIVEAVATAR_VOICE_ID,
        context_id: LIVEAVATAR_CONTEXT_ID,
      },
    };

    const response = await fetch(`${LIVEAVATAR_BASE_URL}/sessions/token`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "X-API-KEY": getApiKey(),
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Token generation failed", details: text });
    }

    return res.status(200).json(JSON.parse(text));
  } catch (error: any) {
    return res.status(500).json({
      error: "Token generation failed",
      details: error?.message || String(error),
    });
  }
}
