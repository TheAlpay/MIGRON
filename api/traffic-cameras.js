// api/traffic-cameras.js
// Server-side proxy for Australian traffic camera APIs
// NSW requires auth header; QLD/WA are public but proxied to avoid CORS

const NSW_API   = 'https://api.transport.nsw.gov.au/v1/live/traffic/camera';
const QLD_API   = 'https://api.qldtraffic.qld.gov.au/v1/webcams';
const WA_ARCGIS = 'https://services.arcgis.com/p3UBboyClTYTtxfJ/arcgis/rest/services/Traffic_Cameras/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson&resultRecordCount=300';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // Cache 2 minutes — camera image URLs don't change that often
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET')    return res.status(405).json({ error: 'Method not allowed' });

    const [nswResult, qldResult, waResult] = await Promise.allSettled([
        fetchNSW(),
        fetchQLD(),
        fetchWA(),
    ]);

    const cameras = [
        ...(nswResult.status === 'fulfilled' ? nswResult.value : []),
        ...(qldResult.status === 'fulfilled' ? qldResult.value : []),
        ...(waResult.status === 'fulfilled'  ? waResult.value  : []),
    ];

    const errors = [];
    if (nswResult.status === 'rejected') errors.push({ state: 'NSW', error: nswResult.reason?.message });
    if (qldResult.status === 'rejected') errors.push({ state: 'QLD', error: qldResult.reason?.message });
    if (waResult.status  === 'rejected') errors.push({ state: 'WA',  error: waResult.reason?.message  });

    return res.status(200).json({
        cameras,
        count: cameras.length,
        fetchedAt: new Date().toISOString(),
        ...(errors.length ? { errors } : {}),
    });
}

// ── NSW Transport — requires apikey header ──────────────────────────────────
async function fetchNSW() {
    const key = process.env.NSW_TRANSPORT_API_KEY;
    if (!key) {
        console.warn('[traffic-cameras] NSW_TRANSPORT_API_KEY not set — skipping NSW');
        return [];
    }

    const res = await fetch(NSW_API, {
        headers: {
            'Authorization': `apikey ${key}`,
            'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(9000),
    });

    if (!res.ok) throw new Error(`NSW HTTP ${res.status} ${res.statusText}`);

    const data = await res.json();
    if (!data?.features?.length) return [];

    return data.features
        .filter(f => f.properties?.href)
        .slice(0, 80)
        .map(f => ({
            id:       `nsw-${f.properties.id ?? Math.random().toString(36).slice(2)}`,
            name:     f.properties.view || 'NSW Traffic Camera',
            imageUrl: f.properties.href,
            lat:      f.geometry?.coordinates?.[1] ?? null,
            lon:      f.geometry?.coordinates?.[0] ?? null,
            state:    'NSW',
            city:     inferNSWCity(f.properties.view),
        }));
}

// ── Queensland Traffic — public, no key ─────────────────────────────────────
async function fetchQLD() {
    const res = await fetch(QLD_API, {
        headers: {
            'Accept':     'application/json',
            'User-Agent': 'Migron-Traffic-Hub/1.0',
        },
        signal: AbortSignal.timeout(9000),
    });

    if (!res.ok) throw new Error(`QLD HTTP ${res.status} ${res.statusText}`);

    const data = await res.json();
    if (!data?.features?.length) return [];

    return data.features
        .filter(f => f.properties?.image_url || f.properties?.url)
        .slice(0, 80)
        .map(f => ({
            id:       `qld-${f.properties.id ?? f.properties.name ?? Math.random().toString(36).slice(2)}`,
            name:     f.properties.description || f.properties.name || 'QLD Traffic Camera',
            imageUrl: f.properties.image_url || f.properties.url,
            lat:      f.geometry?.coordinates?.[1] ?? null,
            lon:      f.geometry?.coordinates?.[0] ?? null,
            state:    'QLD',
            city:     inferQLDCity(f.geometry?.coordinates, f.properties),
        }));
}

// ── Western Australia — ArcGIS open data ─────────────────────────────────────
async function fetchWA() {
    const res = await fetch(WA_ARCGIS, {
        headers: { 'User-Agent': 'Migron-Traffic-Hub/1.0' },
        signal: AbortSignal.timeout(9000),
    });

    if (!res.ok) throw new Error(`WA HTTP ${res.status} ${res.statusText}`);

    const data = await res.json();
    if (!data?.features?.length) return [];

    return data.features
        .filter(f => {
            const p = f.properties;
            return p?.CAMERA_URL || p?.IMAGE_URL || p?.image_url || p?.URL || p?.url;
        })
        .slice(0, 60)
        .map(f => {
            const p = f.properties;
            return {
                id:       `wa-${p.OBJECTID ?? Math.random().toString(36).slice(2)}`,
                name:     p.CAMERA_NAME || p.NAME || p.ROAD_NAME || p.LOCATION || 'WA Traffic Camera',
                imageUrl: p.CAMERA_URL || p.IMAGE_URL || p.image_url || p.URL || p.url,
                lat:      f.geometry?.coordinates?.[1] ?? null,
                lon:      f.geometry?.coordinates?.[0] ?? null,
                state:    'WA',
                city:     inferWACity(f.geometry?.coordinates, p),
            };
        });
}

// ── City inference helpers ───────────────────────────────────────────────────
function inferNSWCity(view) {
    if (!view) return 'Sydney';
    const v = view.toUpperCase();
    if (/NEWCASTLE|HUNTER|MAITLAND/.test(v))              return 'Newcastle';
    if (/WOLLONGONG|ILLAWARRA|DAPTO|SHELLHARBOUR/.test(v)) return 'Wollongong';
    if (/CANBERRA|QUEANBEYAN|TUGGERANONG/.test(v))         return 'Canberra';
    if (/CENTRAL COAST|GOSFORD|WYONG/.test(v))             return 'Central Coast';
    if (/ALBURY|WODONGA/.test(v))                          return 'Albury';
    if (/ORANGE|BATHURST/.test(v))                         return 'Orange';
    return 'Sydney';
}

function inferQLDCity(coords, props) {
    const name = (props?.description || props?.name || '').toUpperCase();
    if (/GOLD COAST|SURFERS|BROADBEACH|BURLEIGH|SOUTHPORT|COOMERA/.test(name)) return 'Gold Coast';
    if (/SUNSHINE COAST|MAROOCHYDORE|NOOSA|CALOUNDRA|SIPPY/.test(name))        return 'Sunshine Coast';
    if (/CAIRNS/.test(name))      return 'Cairns';
    if (/TOWNSVILLE/.test(name))  return 'Townsville';
    if (/TOOWOOMBA/.test(name))   return 'Toowoomba';
    if (/MACKAY/.test(name))      return 'Mackay';
    if (/ROCKHAMPTON/.test(name)) return 'Rockhampton';
    // Coordinate-based fallback
    if (coords) {
        const [lon, lat] = coords;
        if (lat > -28.2 && lat < -27.3 && lon > 153.1) return 'Gold Coast';
        if (lat > -27.0 && lat < -26.2 && lon > 152.7) return 'Sunshine Coast';
    }
    return 'Brisbane';
}

function inferWACity(coords, props) {
    const name = (props?.CAMERA_NAME || props?.NAME || props?.ROAD_NAME || '').toUpperCase();
    if (/MANDURAH|PEEL/.test(name))          return 'Mandurah';
    if (/FREMANTLE|FREO/.test(name))         return 'Fremantle';
    if (/JOONDALUP|WANNEROO/.test(name))     return 'Joondalup';
    if (/ROCKINGHAM/.test(name))             return 'Rockingham';
    return 'Perth';
}
