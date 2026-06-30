/**
 * api/bom.js
 * Vercel Serverless Function — BOM (Bureau of Meteorology) API Proxy
 *
 * Avoids client-side CORS issues by proxying requests to:
 *   https://api.weather.bom.gov.au/v1
 *
 * No API key required. User-Agent header is mandatory per BOM policy.
 *
 * Query params:
 *   suburb  — suburb name (from Google Places)
 *   state   — state code (NSW, VIC, QLD, SA, WA, TAS, NT, ACT)
 *   lat     — fallback latitude  (used if suburb/state search yields no results)
 *   lng     — fallback longitude
 */

const BOM_BASE = 'https://api.weather.bom.gov.au/v1';
const USER_AGENT = 'MIGRON/1.0 migron.mtive.tech';
const FETCH_TIMEOUT_MS = 8000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Fetch with an AbortController timeout.
 * Throws on network error or timeout; the caller decides how to handle it.
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Parse a Response body as JSON safely.
 * Returns null if the body is not valid JSON or the response is not OK.
 */
async function safeJson(res) {
  if (!res || !res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Set CORS + cache headers on a success response.
 */
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function setCacheHeaders(res) {
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=600');
}

// ---------------------------------------------------------------------------
// Shape helpers — extract only the fields consumers need
// ---------------------------------------------------------------------------

/**
 * Map a BOM daily forecast item to our schema.
 * Fields that are absent in the BOM response are set to null rather than
 * throwing, so a partial day never breaks the whole response.
 */
function shapeForecastDay(day) {
  if (!day) return null;
  return {
    date: day.date ?? null,
    temp_max: day.temp_max ?? null,
    temp_min: day.temp_min ?? null,
    extended_text: day.extended_text ?? null,
    icon_descriptor: day.icon_descriptor ?? null,
    rain: {
      chance: day.rain?.chance ?? null,
      amount: day.rain?.amount ?? null,
    },
    uv: {
      max_index: day.uv?.max_index ?? null,
      category: day.uv?.category ?? null,
    },
  };
}

/**
 * Extract today's UV snapshot from the UV endpoint response.
 */
function shapeUv(uvData) {
  if (!uvData) return null;
  // BOM UV response: { data: { max_index, category, start_time, end_time, ... } }
  const d = uvData.data ?? uvData;
  return {
    max_index: d.max_index ?? null,
    category: d.category ?? null,
    start_time: d.start_time ?? null,
    end_time: d.end_time ?? null,
  };
}

/**
 * Extract current conditions from the observations endpoint response.
 */
function shapeObservations(obsData) {
  if (!obsData) return null;
  // BOM observations: { data: { temp, feels_like, humidity, wind, rain_since_9am, ... } }
  const d = obsData.data ?? obsData;
  return {
    temp: d.temp ?? null,
    feels_like: d.feels_like ?? null,
    humidity: d.humidity ?? null,
    wind_speed_kilometre: d.wind?.speed_kilometre ?? d.wind_speed_kilometre ?? null,
    wind_direction: d.wind?.direction ?? d.wind_direction ?? null,
    rain_since_9am: d.rain_since_9am ?? null,
  };
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

export default async function handler(req, res) {
  // --- CORS preflight --------------------------------------------------
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // --- Input validation ------------------------------------------------
  const { suburb, state, lat, lng } = req.query ?? {};

  const hasSuburbState = suburb && state;
  const hasLatLng = lat && lng;

  if (!hasSuburbState && !hasLatLng) {
    res.status(400).json({
      error: 'Missing params. Provide suburb+state or lat+lng.',
    });
    return;
  }

  // --- Step 1: Location search ----------------------------------------
  // Build search query: prefer suburb+state, fall back to lat,lng string
  const searchQuery = hasSuburbState
    ? `${suburb} ${state}`
    : `${lat},${lng}`;

  const locationUrl = `${BOM_BASE}/locations?search=${encodeURIComponent(searchQuery)}`;

  let locationRes;
  try {
    locationRes = await fetchWithTimeout(locationUrl);
  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    res.status(502).json({
      error: isTimeout
        ? 'BOM location search timed out.'
        : 'Network error reaching BOM API.',
      detail: err.message,
    });
    return;
  }

  const locationBody = await safeJson(locationRes);

  // BOM wraps results in { data: [...] }
  const locations = locationBody?.data ?? locationBody;

  if (!Array.isArray(locations) || locations.length === 0) {
    res.status(404).json({
      error: `No BOM location found for "${searchQuery}".`,
    });
    return;
  }

  const firstLocation = locations[0];
  const geohash = firstLocation.geohash;
  const locationName = firstLocation.name ?? firstLocation.id ?? searchQuery;

  if (!geohash) {
    res.status(502).json({
      error: 'BOM returned a location without a geohash.',
      raw: firstLocation,
    });
    return;
  }

  // --- Step 2: Parallel data fetches ----------------------------------
  const forecastUrl = `${BOM_BASE}/locations/${geohash}/forecasts/daily`;
  const uvUrl = `${BOM_BASE}/locations/${geohash}/uv`;
  const obsUrl = `${BOM_BASE}/locations/${geohash}/observations`;

  const [forecastResult, uvResult, obsResult] = await Promise.allSettled([
    fetchWithTimeout(forecastUrl).then(safeJson),
    fetchWithTimeout(uvUrl).then(safeJson),
    fetchWithTimeout(obsUrl).then(safeJson),
  ]);

  // Extract values — individual failures produce null, not a crash
  const forecastRaw =
    forecastResult.status === 'fulfilled' ? forecastResult.value : null;
  const uvRaw =
    uvResult.status === 'fulfilled' ? uvResult.value : null;
  const obsRaw =
    obsResult.status === 'fulfilled' ? obsResult.value : null;

  // BOM daily forecast: { data: [ { date, temp_max, ... }, ... ] }
  const forecastDays = forecastRaw?.data ?? (Array.isArray(forecastRaw) ? forecastRaw : null);
  const forecastArray = Array.isArray(forecastDays)
    ? forecastDays.slice(0, 7).map(shapeForecastDay).filter(Boolean)
    : [];

  // --- Step 3: Build combined response ---------------------------------
  const payload = {
    location: locationName,
    geohash,
    forecast: forecastArray,
    uv: shapeUv(uvRaw?.data ?? uvRaw),
    observations: shapeObservations(obsRaw?.data ?? obsRaw),
  };

  setCacheHeaders(res);
  res.status(200).json(payload);
}
