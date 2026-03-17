// api/openmhz.js
// Proxies OpenMHz public API (no API key required)
// GET /api/openmhz?shortName=nsw-grn

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { shortName } = req.query;
    if (!shortName) return res.status(400).json({ error: 'shortName required' });

    try {
        const r = await fetch(`https://api.openmhz.com/${shortName}/calls/latest`, {
            headers: {
                'Accept':     'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; Migron-Radio-Bot/1.0)',
            },
            signal: AbortSignal.timeout(8000),
        });

        const data = await r.json();

        if (!r.ok) {
            console.error(`[openmhz] HTTP ${r.status} for shortName=${shortName}`);
            return res.status(r.status).json({ error: `Upstream HTTP ${r.status}`, success: false });
        }

        return res.status(200).json(data);
    } catch (err) {
        console.error(`[openmhz] Fetch error for shortName=${shortName}:`, err.message);
        return res.status(502).json({ error: err.message, success: false });
    }
}
