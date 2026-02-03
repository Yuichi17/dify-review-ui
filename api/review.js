export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, conversation_id } = req.body;

  try {
    const response = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DIFY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {},
        query: text,
        response_mode: 'blocking',
        conversation_id: conversation_id || '',
        user: 'user'
      })
    });

    const data = await response.json();
    res.status(200).json({
      answer: data.answer,
      conversation_id: data.conversation_id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}