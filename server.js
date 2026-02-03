import express from "express";

const app = express();
app.use(express.json());

const DIFY_API_KEY = process.env.DIFY_API_KEY;
const DIFY_BASE_URL = process.env.DIFY_BASE_URL || "https://api.dify.ai";
const DIFY_USER_ID = process.env.DIFY_USER_ID || "review-ui-user";

if (!DIFY_API_KEY) {
  console.error("DIFY_API_KEY がありません。環境変数を設定してください。");
  process.exit(1);
}

app.post("/api/review", async (req, res) => {
  try {
    const { text, conversation_id } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "text が必要です" });
    }

    const payload = {
      inputs: {},
      query: text,
      response_mode: "blocking",
      conversation_id: conversation_id || "",
      user: DIFY_USER_ID
    };

    const r = await fetch(`${DIFY_BASE_URL}/v1/chat-messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DIFY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      return res.status(r.status).json({ error: "Dify API error", detail: data });
    }

    return res.json({
      conversation_id: data.conversation_id ?? conversation_id ?? "",
      answer: data.answer ?? "",
      raw: data
    });
  } catch (e) {
    return res.status(500).json({ error: "server error", detail: String(e) });
  }
});

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("OK: http://localhost:3000 を開いてください");
});
