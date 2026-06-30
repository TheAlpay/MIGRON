export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { address } = req.query;

  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    return res.status(400).json({
      error: 'Missing or empty address query parameter',
      status: 'NOT_FOUND',
      technology: 'Unknown',
    });
  }

  const commonHeaders = {
    Referer: 'https://www.nbnco.com.au',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'application/json',
  };

  const TIMEOUT_MS = 8000;

  function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    return fetch(url, { ...options, signal: controller.signal }).finally(() =>
      clearTimeout(timer)
    );
  }

  // Step 1: Autocomplete to get location ID
  let suggestions;
  try {
    const autocompleteUrl = `https://places.nbnco.net.au/places/v1/autocomplete?query=${encodeURIComponent(address.trim())}&limit=5`;
    const autocompleteRes = await fetchWithTimeout(autocompleteUrl, {
      headers: commonHeaders,
    });

    if (!autocompleteRes.ok) {
      return res.status(502).json({
        error: `NBN autocomplete API returned ${autocompleteRes.status}`,
        status: 'NOT_FOUND',
        technology: 'Unknown',
      });
    }

    const autocompleteData = await autocompleteRes.json();
    suggestions = autocompleteData?.suggestions ?? [];
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({
        error: 'NBN autocomplete API timed out',
        status: 'NOT_FOUND',
        technology: 'Unknown',
      });
    }
    return res.status(502).json({
      error: 'Failed to reach NBN autocomplete API',
      status: 'NOT_FOUND',
      technology: 'Unknown',
    });
  }

  if (!suggestions || suggestions.length === 0) {
    return res.status(200).json({
      address: address.trim(),
      locid: null,
      technology: 'Unknown',
      status: 'NOT_FOUND',
      servingAreaName: null,
      upgradeAvailable: false,
    });
  }

  const firstSuggestion = suggestions[0];
  const locid = firstSuggestion?.id ?? null;
  const formattedAddress = firstSuggestion?.formattedAddress ?? firstSuggestion?.name ?? address.trim();

  if (!locid) {
    return res.status(200).json({
      address: formattedAddress,
      locid: null,
      technology: 'Unknown',
      status: 'NOT_FOUND',
      servingAreaName: null,
      upgradeAvailable: false,
    });
  }

  // Step 2: Building lookup using locid
  let buildingData;
  try {
    const buildingUrl = `https://api.nbnco.com.au/serve/v2/buildingLookup?id=${encodeURIComponent(locid)}`;
    const buildingRes = await fetchWithTimeout(buildingUrl, {
      headers: commonHeaders,
    });

    if (!buildingRes.ok) {
      // Return partial result if building lookup fails
      return res.status(200).json({
        address: formattedAddress,
        locid,
        technology: 'Unknown',
        status: 'NOT_FOUND',
        servingAreaName: null,
        upgradeAvailable: false,
      });
    }

    buildingData = await buildingRes.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(200).json({
        address: formattedAddress,
        locid,
        technology: 'Unknown',
        status: 'NOT_FOUND',
        servingAreaName: null,
        upgradeAvailable: false,
        error: 'NBN building lookup timed out',
      });
    }
    return res.status(200).json({
      address: formattedAddress,
      locid,
      technology: 'Unknown',
      status: 'NOT_FOUND',
      servingAreaName: null,
      upgradeAvailable: false,
      error: 'Failed to reach NBN building lookup API',
    });
  }

  // Parse building lookup response
  // NBN API nests data under serviceabilityClass, addressDetail, etc.
  const addressDetail = buildingData?.addressDetail ?? {};
  const servingArea = buildingData?.servingArea ?? addressDetail?.servingArea ?? {};

  const technology =
    addressDetail?.techType ??
    addressDetail?.technology ??
    buildingData?.techType ??
    'Unknown';

  const status =
    addressDetail?.serviceClass ??
    addressDetail?.status ??
    buildingData?.serviceClass ??
    'NOT_FOUND';

  const servingAreaName =
    servingArea?.description ??
    servingArea?.csaName ??
    buildingData?.servingAreaName ??
    null;

  const upgradeAvailable =
    addressDetail?.upgradeAvailable ??
    buildingData?.upgradeAvailable ??
    false;

  // Cache for 24 hours — NBN status rarely changes
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');

  return res.status(200).json({
    address: formattedAddress,
    locid,
    technology: normaliseTechnology(technology),
    status: status || 'NOT_FOUND',
    servingAreaName,
    upgradeAvailable: Boolean(upgradeAvailable),
  });
}

/**
 * Normalise technology string to one of the known NBN technology types.
 * The NBN API returns various short codes; map them to human-readable labels.
 */
function normaliseTechnology(raw) {
  if (!raw || raw === 'Unknown') return 'Unknown';

  const upper = String(raw).toUpperCase().replace(/[-_\s]/g, '_');

  const MAP = {
    FTTP: 'FTTP',
    FIBER_TO_THE_PREMISES: 'FTTP',
    FTTN: 'FTTN',
    FIBER_TO_THE_NODE: 'FTTN',
    FTTC: 'FTTC',
    FIBER_TO_THE_CURB: 'FTTC',
    FTTB: 'FTTB',
    FIBER_TO_THE_BUILDING: 'FTTB',
    HFC: 'HFC',
    HYBRID_FIBRE_COAXIAL: 'HFC',
    FIXED_WIRELESS: 'FIXED_WIRELESS',
    WIRELESS: 'FIXED_WIRELESS',
    FW: 'FIXED_WIRELESS',
    SKY_MUSTER: 'SKY_MUSTER',
    SKYMUSTER: 'SKY_MUSTER',
    SAT: 'SKY_MUSTER',
    SATELLITE: 'SKY_MUSTER',
    SKY_MUSTER_PLUS: 'SKY_MUSTER_PLUS',
    SKYMUSTER_PLUS: 'SKY_MUSTER_PLUS',
  };

  return MAP[upper] ?? raw;
}
