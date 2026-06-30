/**
 * api/abs-suburb.js
 *
 * Fetches ABS Census 2021 demographics for a suburb identified by lat/lng.
 *
 * STEP 1: Resolve lat/lng → SA2 code via ABS ArcGIS REST service (no auth needed).
 * STEP 2: Fetch ABS Regional Statistics SDMX-JSON for that SA2 code.
 *         Falls back to Census G01 table if primary endpoint fails.
 *
 * Query params:
 *   ?lat=<decimal>&lng=<decimal>
 *
 * Response:
 *   { sa2Code, sa2Name, demographics: { ... }, source }
 *
 * Errors:
 *   404 — could not resolve SA2 from the given lat/lng
 *   400 — missing or invalid lat/lng params
 *   5xx — upstream failures
 */

const TIMEOUT_MS = 10_000;
const ARCGIS_URL =
  'https://geo.abs.gov.au/arcgis/rest/services/ASGS2021/ASGS_Ed_Base_2021/MapServer/3/query';
const ABS_PRIMARY_URL =
  'https://api.data.abs.gov.au/data/ABS_REGIONAL_SA2/POPULATION+AREA_SQKM+ERP.{sa2Code}/AUS?startPeriod=2021&endPeriod=2021&format=jsondata';
const ABS_FALLBACK_URL =
  'https://api.data.abs.gov.au/data/C21_G01_SA2/{sa2Code}?startPeriod=2021&endPeriod=2021&format=jsondata';

// -------------------------------------------------------------------
// Utility: fetch with AbortController timeout
// -------------------------------------------------------------------
function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

// -------------------------------------------------------------------
// SDMX-JSON parser
//
// ABS SDMX-JSON shape:
//   data.dataSets[0].series  → { "d0:d1:d2:...": { observations: { "t": [value] } } }
//   data.structure.dimensions.series → array of dimension descriptors
//
// Returns a flat map: { measureId → value }
// where measureId is the `id` field from the MEASURE dimension's values array.
// -------------------------------------------------------------------
function parseSdmxJson(json) {
  const result = {};

  try {
    const structure = json?.data?.structure ?? json?.structure;
    const dataSets = json?.data?.dataSets ?? json?.dataSets;

    if (!structure || !dataSets || !dataSets.length) return result;

    const seriesDims = structure?.dimensions?.series ?? [];

    // Find the index of the MEASURE dimension so we can resolve measure codes.
    const measureDimIdx = seriesDims.findIndex(
      (d) => d.id === 'MEASURE' || d.id === 'INDICATOR' || d.id === 'STAT_VAR'
    );

    const series = dataSets[0]?.series ?? {};

    for (const [key, seriesObj] of Object.entries(series)) {
      const dimIndices = key.split(':').map(Number);

      // Resolve the measure label for this series key.
      let measureCode = null;
      if (measureDimIdx >= 0 && seriesDims[measureDimIdx]) {
        const measureDim = seriesDims[measureDimIdx];
        const valueIndex = dimIndices[measureDimIdx];
        measureCode = measureDim.values?.[valueIndex]?.id ?? null;
      }

      // Pull the first observation value (time period 0).
      const observations = seriesObj?.observations ?? {};
      const firstObs = observations['0'] ?? Object.values(observations)[0];
      const value = Array.isArray(firstObs) ? firstObs[0] : firstObs;

      if (measureCode !== null && value !== null && value !== undefined) {
        result[measureCode] = typeof value === 'number' ? value : parseFloat(value);
      }

      // Also store by raw key index if measure code resolution failed.
      if (measureCode === null && value !== null && value !== undefined) {
        result[`_series_${key}`] = typeof value === 'number' ? value : parseFloat(value);
      }
    }
  } catch {
    // Return whatever we managed to collect.
  }

  return result;
}

// -------------------------------------------------------------------
// Map parsed SDMX measures onto our demographics schema.
//
// ABS_REGIONAL_SA2 measure codes used in the primary endpoint:
//   POPULATION — estimated resident population
//   AREA_SQKM  — area in sq km
//   ERP        — estimated resident population (alternative code)
//
// Census G01 codes (fallback) are structured differently; we do best-effort.
// -------------------------------------------------------------------
function buildDemographics(measures) {
  function pick(...codes) {
    for (const code of codes) {
      const v = measures[code];
      if (v !== undefined && !isNaN(v)) return v;
    }
    return null;
  }

  return {
    // Population / ERP
    population: pick(
      'POPULATION',
      'ERP',
      'Tot_P_P',         // G01
      'ESTIMATED_RESIDENT_POPULATION'
    ),
    // Area
    area_sqkm: pick('AREA_SQKM', 'AREA'),
    // Median age — present in G01 as Med_age_persons or MEDIAN_AGE_PERSONS
    median_age: pick(
      'MEDIAN_AGE_PERSONS',
      'Med_age_persons',
      'MEDIAN_AGE',
      'MED_AGE_PERSONS'
    ),
    // Median weekly household income
    median_weekly_household_income: pick(
      'MEDIAN_WEEKLY_HOUSEHOLD_INCOME',
      'Med_rent_weekly',
      'MEDIAN_HHOLD_WEEKLY_INCOME',
      'Med_HH_weekly_incme'
    ),
    // Renters (% of dwellings rented)
    pct_renters: pick(
      'PCT_RENTERS',
      'Rent_priv_tot',
      'RENTING_DWELLINGS_PERC'
    ),
    // Owners (% of dwellings owned outright or with mortgage)
    pct_owners: pick(
      'PCT_OWNERS',
      'O_OR_Mtge_tot',
      'OWNER_OCCUPIED_DWELLINGS_PERC'
    ),
    // Born overseas
    pct_born_overseas: pick(
      'PCT_BORN_OVERSEAS',
      'OS_born_P',
      'BORN_OVERSEAS_PERC'
    ),
    // Total dwellings
    dwellings: pick(
      'DWELLINGS',
      'Tot_dwell',
      'TOTAL_DWELLINGS'
    ),
  };
}

// -------------------------------------------------------------------
// STEP 1 — Resolve lat/lng to SA2 via ArcGIS REST
// -------------------------------------------------------------------
async function resolveSa2(lat, lng) {
  const geometry = JSON.stringify({
    x: lng,
    y: lat,
    spatialReference: { wkid: 4326 },
  });

  const params = new URLSearchParams({
    geometry,
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: 'SA2_CODE21,SA2_NAME21,SA3_NAME21,SA4_NAME21',
    returnGeometry: 'false',
    f: 'json',
  });

  const url = `${ARCGIS_URL}?${params.toString()}`;

  const response = await fetchWithTimeout(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(
      `ArcGIS returned HTTP ${response.status} for SA2 resolution`
    );
  }

  const json = await response.json();

  const features = json?.features;
  if (!features || !features.length) {
    return null; // No SA2 found for this coordinate.
  }

  const attrs = features[0].attributes;
  return {
    sa2Code: String(attrs.SA2_CODE21 ?? '').trim(),
    sa2Name: String(attrs.SA2_NAME21 ?? '').trim(),
    sa3Name: String(attrs.SA3_NAME21 ?? '').trim(),
    sa4Name: String(attrs.SA4_NAME21 ?? '').trim(),
  };
}

// -------------------------------------------------------------------
// STEP 2 — Fetch ABS data for SA2 (primary then fallback)
// -------------------------------------------------------------------
async function fetchAbsData(sa2Code) {
  const primaryUrl = ABS_PRIMARY_URL.replace('{sa2Code}', encodeURIComponent(sa2Code));

  // Try primary endpoint.
  try {
    const res = await fetchWithTimeout(primaryUrl, {
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const json = await res.json();
      const measures = parseSdmxJson(json);
      if (Object.keys(measures).length > 0) {
        return buildDemographics(measures);
      }
    }
  } catch {
    // Primary failed — fall through to fallback.
  }

  // Try fallback Census G01 endpoint.
  const fallbackUrl = ABS_FALLBACK_URL.replace('{sa2Code}', encodeURIComponent(sa2Code));

  try {
    const res = await fetchWithTimeout(fallbackUrl, {
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const json = await res.json();
      const measures = parseSdmxJson(json);
      if (Object.keys(measures).length > 0) {
        return buildDemographics(measures);
      }
    }
  } catch {
    // Both endpoints failed.
  }

  return null; // Caller will return partial result.
}

// -------------------------------------------------------------------
// Main handler
// -------------------------------------------------------------------
export default async function handler(req, res) {
  // CORS headers.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight.
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Validate input.
  const { lat: latRaw, lng: lngRaw } = req.query;

  const lat = parseFloat(latRaw);
  const lng = parseFloat(lngRaw);

  if (!latRaw || !lngRaw || isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({
      error: 'Missing or invalid lat/lng query parameters. Provide numeric ?lat=&lng=',
    });
  }

  // Rough bounds check for Australia.
  if (lat < -44 || lat > -10 || lng < 112 || lng > 154) {
    return res.status(400).json({
      error: 'Coordinates appear to be outside Australia. lat must be −44 to −10, lng must be 112 to 154.',
    });
  }

  // STEP 1 — Resolve SA2.
  let sa2Info;
  try {
    sa2Info = await resolveSa2(lat, lng);
  } catch (err) {
    const isTimeout = err?.name === 'AbortError';
    return res.status(isTimeout ? 504 : 502).json({
      error: isTimeout
        ? 'ArcGIS SA2 lookup timed out'
        : `ArcGIS SA2 lookup failed: ${err?.message ?? 'unknown error'}`,
    });
  }

  if (!sa2Info || !sa2Info.sa2Code) {
    return res.status(404).json({
      error: 'No SA2 region found for the given coordinates. The point may be in ocean or outside ABS coverage.',
      lat,
      lng,
    });
  }

  const { sa2Code, sa2Name, sa3Name, sa4Name } = sa2Info;

  // STEP 2 — Fetch ABS demographics.
  // Never let a demographics failure crash the whole response.
  let demographics = null;
  try {
    demographics = await fetchAbsData(sa2Code);
  } catch {
    // demographics stays null; we return a partial result below.
  }

  // Census data is static — cache aggressively.
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');

  return res.status(200).json({
    sa2Code,
    sa2Name,
    sa3Name: sa3Name || null,
    sa4Name: sa4Name || null,
    demographics,
    source: 'ABS Census 2021',
  });
}
