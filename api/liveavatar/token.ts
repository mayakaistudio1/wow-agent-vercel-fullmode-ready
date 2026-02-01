import {
  LIVEAVATAR_BASE_URL,
  AVATAR_ID,
  VOICE_ID,
  CONTEXT_ID,
  getApiKey,
  readJson,
} from "./_config.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return res
        .status(500)
        .json({ ok: false, error: "Missing LIVEAVATAR_API_KEY" });
    }

    const body = await readJson(req);
    const language =
      typeof body?.language === "string" && body.language.trim()
        ? body.language.trim()
        : "ru";

    const payload = {
      mode: "FULL",
      avatar_id: AVATAR_ID,
      avatar_persona: {
        voice_id: VOICE_ID,
        context_id: CONTEXT_ID,
        language,
      },
    };

    const response = await fetch(`${LIVEAVATAR_BASE_URL}/sessions/token`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    if (!response.ok) {
      return res
        .status(response.status)
        .json({
          ok: false,
          error: "Token generation failed",
          details: text,
        });
    }

    const json = JSON.parse(text);
    const session_id = json?.data?.session_id ?? json?.session_id;
    const session_token = json?.data?.session_token ?? json?.session_token;

    return res.status(200).json({
      ...json,
      session_id,
      session_token,
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      error: "Token generation failed",
      details: error?.message || String(error),
    });
  }
}
