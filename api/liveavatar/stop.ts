import { LIVEAVATAR_BASE_URL, getApiKey, readJson } from "./_config.js";

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
    const session_id = body?.session_id;
    const session_token = body?.session_token;

    if (typeof session_id !== "string" || !session_id.trim()) {
      return res.status(400).json({
        ok: false,
        error: "Invalid request data",
        details: "session_id is required",
      });
    }
    if (typeof session_token !== "string" || !session_token.trim()) {
      return res.status(400).json({
        ok: false,
        error: "Invalid request data",
        details: "session_token is required",
      });
    }

    const response = await fetch(`${LIVEAVATAR_BASE_URL}/sessions/stop`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${session_token}`,
      },
      body: JSON.stringify({ session_id }),
    });

    const text = await response.text();
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ ok: false, error: "Session stop failed", details: text });
    }

    return res.status(200).json(JSON.parse(text));
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      error: "Session stop failed",
      details: error?.message || String(error),
    });
  }
}
