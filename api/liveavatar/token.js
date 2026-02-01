import {
  AVATAR_ID,
  CONTEXT_ID,
  LIVEAVATAR_BASE_URL,
  VOICE_ID,
  getApiKey,
  readJson,
} from "./_config.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: "Missing LIVEAVATAR_API_KEY" });
  }

  try {
    const body = await readJson(req);
    const language =
      typeof body?.language === "string" && body.language.trim()
        ? body.language.trim()
        : "ru";

    const payload = {
      avatar_id: AVATAR_ID,
      language,
      voice: {
        voice_id: VOICE_ID,
        context_id: CONTEXT_ID,
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
        .json({ ok: false, error: "Token generation failed", details: text });
    }

    try {
      return res.status(200).json(JSON.parse(text));
    } catch (error) {
      return res.status(502).json({
        ok: false,
        error: "Invalid response from LiveAvatar",
        details: error?.message || text,
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Token generation failed",
      details: error?.message || String(error),
    });
  }
}
