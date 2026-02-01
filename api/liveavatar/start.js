import { LIVEAVATAR_BASE_URL, getApiKey, readJson } from "./_config.js";

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
    const session_token = body?.session_token;

    if (typeof session_token !== "string" || !session_token.trim()) {
      return res.status(400).json({
        ok: false,
        error: "Invalid request data",
        details: "session_token is required",
      });
    }

    const response = await fetch(`${LIVEAVATAR_BASE_URL}/sessions/start`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({ session_token }),
    });

    const text = await response.text();
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ ok: false, error: "Session start failed", details: text });
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
      error: "Session start failed",
      details: error?.message || String(error),
    });
  }
}
