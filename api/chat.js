export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured on server' });

    try {
        const { message } = req.body;
        if (!message || typeof message !== 'string' || message.trim().length === 0)
            return res.status(400).json({ error: 'Message is required' });
        if (message.length > 500)
            return res.status(400).json({ error: 'Message too long (max 500 characters)' });

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'Sen MIGRON platformunun yapay zeka asistanısın. Avustralya göçmenlik hukuku, vize süreçleri ve yasal prosedürler konusunda uzmanlaşmış, profesyonel ve kısa yanıtlar veren bir hukuki asistansın. Türkçe veya İngilizce soruları anlayıp Türkçe yanıt ver.'
                    },
                    { role: 'user', content: message }
                ],
                max_tokens: 800,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Groq API error:', JSON.stringify(data));
            return res.status(502).json({ error: `AI service error: ${data?.error?.message || 'unknown'}` });
        }

        const aiText = data.choices?.[0]?.message?.content || 'Yanıt alınamadı.';
        return res.status(200).json({ text: aiText });

    } catch (error) {
        console.error('Proxy error:', error.message);
        return res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
}
