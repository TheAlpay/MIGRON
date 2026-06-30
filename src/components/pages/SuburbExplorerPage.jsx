import { useState, useRef, useEffect, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Search, MapPin, Wifi, Building2, Train, ShoppingCart, Mail, Stethoscope, Hospital, School, ExternalLink, ChevronRight, AlertCircle } from 'lucide-react';
import { env } from '../../lib/env.ts';
import SEOHead from '../seo/SEOHead';

// ─── Haversine distance ───────────────────────────────────────────────────────
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── NBN tech config ──────────────────────────────────────────────────────────
const NBN_TECH = {
  FTTP: { label: 'Fibre to the Premises', speed: 'Up to 1 Gbps', color: '#ccff00', text: '#000' },
  FTTC: { label: 'Fibre to the Curb', speed: 'Up to 250 Mbps', color: '#00d4ff', text: '#000' },
  FTTN: { label: 'Fibre to the Node', speed: 'Up to 100 Mbps', color: '#f59e0b', text: '#000' },
  FTTB: { label: 'Fibre to the Building', speed: 'Up to 100 Mbps', color: '#f59e0b', text: '#000' },
  HFC:  { label: 'Hybrid Fibre-Coaxial', speed: 'Up to 250 Mbps', color: '#00d4ff', text: '#000' },
  FIXED_WIRELESS: { label: 'Fixed Wireless', speed: 'Up to 75 Mbps', color: '#ff6b6b', text: '#fff' },
  SKY_MUSTER:     { label: 'Satellite (Sky Muster)', speed: 'Up to 25 Mbps', color: '#a78bfa', text: '#fff' },
};

// ─── Nearby service categories ────────────────────────────────────────────────
const SERVICE_TABS = [
  { key: 'hospital',         label: 'Hospitals',  icon: Hospital,      color: '#ff6b6b', markerColor: '#ef4444', type: 'hospital',         radius: 5000 },
  { key: 'doctor',           label: 'GPs',        icon: Stethoscope,   color: '#60a5fa', markerColor: '#3b82f6', type: 'doctor',           radius: 3000 },
  { key: 'school',           label: 'Schools',    icon: School,        color: '#fbbf24', markerColor: '#f59e0b', type: 'school',           radius: 3000 },
  { key: 'transit_station',  label: 'Transport',  icon: Train,         color: '#a78bfa', markerColor: '#8b5cf6', type: 'transit_station',  radius: 2000 },
  { key: 'supermarket',      label: 'Shops',      icon: ShoppingCart,  color: '#34d399', markerColor: '#10b981', type: 'supermarket',      radius: 2000 },
  { key: 'post_office',      label: 'Post',       icon: Mail,          color: '#2dd4bf', markerColor: '#14b8a6', type: 'post_office',      radius: 3000 },
];

// ─── State minimum wage map ───────────────────────────────────────────────────
const STATE_MIN_WAGE = {
  NSW: { rate: '$24.10/hr', note: 'NSW follows the National Minimum Wage' },
  VIC: { rate: '$24.10/hr', note: 'VIC follows the National Minimum Wage' },
  QLD: { rate: '$24.10/hr', note: 'QLD follows the National Minimum Wage' },
  SA:  { rate: '$24.10/hr', note: 'SA follows the National Minimum Wage' },
  WA:  { rate: '$24.10/hr', note: 'WA has its own State Industrial Relations system' },
  TAS: { rate: '$24.10/hr', note: 'TAS follows the National Minimum Wage' },
  NT:  { rate: '$24.10/hr', note: 'NT follows the National Minimum Wage' },
  ACT: { rate: '$24.10/hr', note: 'ACT follows the National Minimum Wage' },
};

// ─── Autocomplete styles (injected once) ─────────────────────────────────────
const PAC_STYLES = `
.pac-container {
  background: #0a0a0a;
  border: 1px solid rgba(255,255,255,0.15);
  border-top: none;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.8);
  font-family: inherit;
  z-index: 9999;
}
.pac-item {
  color: #e0e0e0;
  border-top: 1px solid rgba(255,255,255,0.05);
  padding: 10px 14px;
  cursor: pointer;
  font-size: 13px;
  line-height: 1.4;
}
.pac-item:hover, .pac-item:focus {
  background: rgba(204,255,0,0.08);
}
.pac-item-query {
  color: #ccff00;
  font-size: 13px;
}
.pac-icon { filter: brightness(0.4); }
.pac-matched { font-weight: 600; }
`;

// ═══════════════════════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Search bar with Places Autocomplete ─────────────────────────────────────
function SuburbSearch({ onPlaceSelected }) {
  const placesLib = useMapsLibrary('places');
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;
    if (autocompleteRef.current) return;

    const ac = new placesLib.Autocomplete(inputRef.current, {
      types: ['(regions)', 'address'],
      componentRestrictions: { country: 'au' },
      fields: ['geometry', 'name', 'formatted_address', 'address_components'],
    });

    ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      if (!place?.geometry?.location) return;

      const components = place.address_components || [];
      const get = (type) =>
        components.find((c) => c.types.includes(type))?.short_name ?? '';

      onPlaceSelected({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        name: place.name || place.formatted_address,
        formatted_address: place.formatted_address,
        suburb: get('locality') || get('sublocality') || place.name,
        postcode: get('postal_code'),
        state: get('administrative_area_level_1'),
      });
    });

    autocompleteRef.current = ac;
  }, [placesLib, onPlaceSelected]);

  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: '#ccff00' }}
      />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search any Australian suburb or address…"
        style={{
          width: '100%',
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '6px',
          color: '#e0e0e0',
          padding: '14px 16px 14px 44px',
          fontSize: '15px',
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#ccff00')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
      />
    </div>
  );
}

// ─── NBN Coverage card ────────────────────────────────────────────────────────
function NbnCard({ address }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    setData(null);
    setError(null);

    fetch(`/api/nbn-check?address=${encodeURIComponent(address)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [address]);

  const tech = data?.technology ? NBN_TECH[data.technology] : null;
  const serviceable = data?.serviceStatus === 'SERVICEABLE';

  return (
    <div
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <Wifi size={16} style={{ color: '#ccff00' }} />
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#ccff00',
          }}
        >
          NBN Coverage
        </span>
      </div>

      {loading && (
        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          {[80, 120, 60].map((w, i) => (
            <div
              key={i}
              style={{
                height: '14px',
                width: `${w}%`,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(224,224,224,0.4)' }}>
          <AlertCircle size={14} />
          <span style={{ fontSize: '13px' }}>NBN status unavailable for this address</span>
        </div>
      )}

      {data && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tech ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: tech.color,
                    color: tech.text,
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {data.technology}
                </span>
                <span
                  style={{
                    background: serviceable ? 'rgba(204,255,0,0.12)' : 'rgba(255,255,255,0.06)',
                    color: serviceable ? '#ccff00' : 'rgba(224,224,224,0.4)',
                    border: serviceable ? '1px solid rgba(204,255,0,0.3)' : '1px solid rgba(255,255,255,0.08)',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {data.serviceStatus || 'Unknown'}
                </span>
              </div>
              <div>
                <div style={{ color: '#e0e0e0', fontSize: '14px', fontWeight: 500 }}>{tech.label}</div>
                <div style={{ color: 'rgba(224,224,224,0.5)', fontSize: '12px', marginTop: '2px' }}>{tech.speed}</div>
              </div>
            </>
          ) : (
            <div style={{ color: 'rgba(224,224,224,0.4)', fontSize: '13px' }}>
              Technology type: {data.technology || 'unknown'}
            </div>
          )}

          <a
            href="https://www.nbn.com.au/residential/service-check/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#ccff00',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textDecoration: 'none',
              marginTop: '4px',
            }}
          >
            Check on NBN.com.au
            <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Nearby Services card ─────────────────────────────────────────────────────
function NearbyServicesCard({ lat, lng, map }) {
  const placesLib = useMapsLibrary('places');
  const [activeTab, setActiveTab] = useState('hospital');
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState({});
  const attrRef = useRef(null);

  const fetchCategory = useCallback(
    (tab) => {
      if (!placesLib || !map || services[tab] !== undefined) return;

      setLoading((prev) => ({ ...prev, [tab]: true }));

      const service = new placesLib.PlacesService(attrRef.current);
      service.nearbySearch(
        { location: { lat, lng }, radius: tab.radius || 3000, type: tab.type },
        (results, status) => {
          const items =
            status === placesLib.PlacesServiceStatus.OK
              ? (results || []).slice(0, 5).map((p) => ({
                  place_id: p.place_id,
                  name: p.name,
                  rating: p.rating,
                  lat: p.geometry?.location?.lat(),
                  lng: p.geometry?.location?.lng(),
                  distance: p.geometry?.location
                    ? haversineKm(lat, lng, p.geometry.location.lat(), p.geometry.location.lng())
                    : null,
                }))
              : [];
          setServices((prev) => ({ ...prev, [tab.key]: items }));
          setLoading((prev) => ({ ...prev, [tab.key]: false }));
        }
      );
    },
    [placesLib, map, services, lat, lng]
  );

  // fetch active tab on mount / tab switch
  useEffect(() => {
    const tab = SERVICE_TABS.find((t) => t.key === activeTab);
    if (tab) fetchCategory(tab);
  }, [activeTab, fetchCategory]);

  const activeConf = SERVICE_TABS.find((t) => t.key === activeTab);
  const items = services[activeTab];
  const isLoading = loading[activeTab];

  return (
    <div
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* hidden attributions div required by PlacesService */}
      <div ref={attrRef} style={{ display: 'none' }} />

      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Building2 size={16} style={{ color: '#ccff00' }} />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#ccff00',
            }}
          >
            Nearby Services
          </span>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0',
            overflowX: 'auto',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            scrollbarWidth: 'none',
          }}
        >
          {SERVICE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '8px 12px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? `2px solid ${tab.color}` : '2px solid transparent',
                  color: isActive ? tab.color : 'rgba(224,224,224,0.4)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s',
                  marginBottom: '-1px',
                }}
              >
                <Icon size={12} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '16px 20px 20px' }}>
        {isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: '52px',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '6px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        )}

        {!isLoading && items && items.length === 0 && (
          <div style={{ color: 'rgba(224,224,224,0.35)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
            No {activeConf?.label?.toLowerCase()} found nearby
          </div>
        )}

        {!isLoading && items && items.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.map((place) => (
              <a
                key={place.place_id}
                href={`https://www.google.com/maps/place/?q=place_id:${place.place_id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s, background 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${activeConf?.color}40`;
                  e.currentTarget.style.background = `${activeConf?.color}08`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: '#e0e0e0',
                      fontSize: '13px',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {place.name}
                  </div>
                  {place.rating && (
                    <div style={{ color: 'rgba(224,224,224,0.4)', fontSize: '11px', marginTop: '2px' }}>
                      ★ {place.rating.toFixed(1)}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                  {place.distance !== null && (
                    <span
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        color: 'rgba(224,224,224,0.6)',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {place.distance < 1
                        ? `${Math.round(place.distance * 1000)}m`
                        : `${place.distance.toFixed(1)}km`}
                    </span>
                  )}
                  <ExternalLink size={12} style={{ color: 'rgba(224,224,224,0.25)' }} />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Service markers on the map ───────────────────────────────────────────────
function ServiceMarkers({ services, activeTab }) {
  const items = services[activeTab] || [];
  const conf = SERVICE_TABS.find((t) => t.key === activeTab);
  if (!conf) return null;

  return items.map((place) =>
    place.lat && place.lng ? (
      <AdvancedMarker key={place.place_id} position={{ lat: place.lat, lng: place.lng }}>
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: conf.markerColor,
            border: '2px solid #fff',
            boxShadow: `0 0 8px ${conf.markerColor}80`,
          }}
        />
      </AdvancedMarker>
    ) : null
  );
}

// ─── AQI helpers ─────────────────────────────────────────────────────────────
function aqiMeta(aqi) {
  if (aqi === null || aqi === undefined) return null;
  if (aqi <= 50)  return { label: 'Good',           color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   tip: 'Air quality is satisfactory.' };
  if (aqi <= 100) return { label: 'Moderate',        color: '#eab308', bg: 'rgba(234,179,8,0.08)',   tip: 'Acceptable for most people.' };
  if (aqi <= 150) return { label: 'Unhealthy*',      color: '#f97316', bg: 'rgba(249,115,22,0.08)',  tip: 'Sensitive groups should reduce outdoor activity.' };
  if (aqi <= 200) return { label: 'Unhealthy',       color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   tip: 'Everyone may begin to experience effects.' };
  if (aqi <= 300) return { label: 'Very Unhealthy',  color: '#a855f7', bg: 'rgba(168,85,247,0.08)',  tip: 'Health alert — avoid prolonged outdoor exertion.' };
  return           { label: 'Hazardous',             color: '#7f1d1d', bg: 'rgba(127,29,29,0.08)',   tip: 'Emergency conditions — stay indoors.' };
}

const POL_LABELS = { pm25: 'PM2.5', pm10: 'PM10', o3: 'Ozone', no2: 'NO₂', so2: 'SO₂', co: 'CO' };

// ─── Air Quality card ─────────────────────────────────────────────────────────
function AirQualityCard({ lat, lng }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = env.VITE_WAQI_TOKEN || env.VITE_WAQI_API_KEY;

  useEffect(() => {
    if (!lat || !lng || !token) return;
    setLoading(true);
    setData(null);
    fetch(`https://api.waqi.info/feed/geo:${lat};${lng}/?token=${token}`)
      .then(r => r.json())
      .then(d => { if (d.status === 'ok') setData(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lat, lng, token]);

  const meta = data ? aqiMeta(data.aqi) : null;
  const polKey = data?.dominentpol;
  const polVal = polKey && data?.iaqi?.[polKey]?.v !== undefined
    ? data.iaqi[polKey].v
    : null;

  if (!token) return null;

  return (
    <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <span style={{ fontSize: '16px' }}>🌿</span>
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#22c55e' }}>
          Air Quality Index
        </span>
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[70, 110, 55].map((w, i) => (
            <div key={i} style={{ height: '13px', width: `${w}%`, background: 'rgba(255,255,255,0.06)', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      )}

      {!loading && !data && token && (
        <div style={{ color: 'rgba(224,224,224,0.4)', fontSize: '13px' }}>Air quality data unavailable for this location.</div>
      )}

      {meta && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '42px', fontWeight: 900, color: meta.color, letterSpacing: '-2px', lineHeight: 1 }}>
              {data.aqi}
            </span>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'inline-block', background: meta.bg, border: `1px solid ${meta.color}40`, color: meta.color, padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {meta.label}
              </span>
              {polKey && (
                <div style={{ fontSize: '11px', color: 'rgba(224,224,224,0.4)', marginTop: '4px' }}>
                  Main pollutant: {POL_LABELS[polKey] || polKey.toUpperCase()}{polVal !== null ? ` (${polVal})` : ''}
                </div>
              )}
            </div>
          </div>

          {/* AQI scale bar */}
          <div style={{ position: 'relative', height: '6px', borderRadius: '3px', overflow: 'hidden', background: 'linear-gradient(to right, #22c55e 0%, #eab308 33%, #f97316 50%, #ef4444 67%, #a855f7 83%, #7f1d1d 100%)' }}>
            <div style={{ position: 'absolute', top: '-3px', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #fff', background: meta.color, left: `${Math.min((data.aqi / 300) * 100, 98)}%`, transform: 'translateX(-50%)', transition: 'left 0.4s ease' }} />
          </div>

          <p style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)', lineHeight: 1.5 }}>{meta.tip}</p>

          <a href="https://aqicn.org" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'rgba(224,224,224,0.3)', fontSize: '11px', textDecoration: 'none' }}>
            <ExternalLink size={10} /> Source: WAQI / aqicn.org
          </a>
        </div>
      )}
    </div>
  );
}

// ─── BOM Weather card ─────────────────────────────────────────────────────────
function BomForecastCard({ suburb, state, lat, lng }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!suburb && !lat) return;
    setLoading(true);
    setData(null);
    setError(null);
    const params = new URLSearchParams();
    if (suburb) params.set('suburb', suburb);
    if (state) params.set('state', state);
    if (lat != null) params.set('lat', lat);
    if (lng != null) params.set('lng', lng);
    fetch(`/api/bom?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [suburb, state]);

  const ICON_MAP = {
    sunny: '☀️', clear: '☀️', mostly_sunny: '🌤️', partly_cloudy: '⛅',
    cloudy: '☁️', overcast: '☁️', light_shower: '🌦️',
    shower: '🌧️', rain: '🌧️', heavy_rain: '🌧️',
    storm: '⛈️', thunderstorm: '⛈️', fog: '🌫️', wind: '💨', snow: '❄️', hail: '🌨️',
  };

  function weatherEmoji(descriptor) {
    if (!descriptor) return '🌡️';
    const key = descriptor.toLowerCase();
    for (const [k, v] of Object.entries(ICON_MAP)) {
      if (key.includes(k)) return v;
    }
    return '🌡️';
  }

  function uvMeta(uv) {
    if (uv == null) return null;
    if (uv <= 2)  return { label: 'Low',       color: '#22c55e' };
    if (uv <= 5)  return { label: 'Moderate',  color: '#eab308' };
    if (uv <= 7)  return { label: 'High',      color: '#f97316' };
    if (uv <= 10) return { label: 'Very High', color: '#ef4444' };
    return              { label: 'Extreme',    color: '#a855f7' };
  }

  function dayLabel(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-AU', { weekday: 'short' });
  }

  const skeletonRow = (w, h = '14px') => ({
    height: h, width: w, background: 'rgba(255,255,255,0.06)', borderRadius: '4px',
    animation: 'pulse 1.5s ease-in-out infinite',
  });

  return (
    <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '16px' }}>☁️</span>
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00d4ff' }}>
          Weather Forecast
        </span>
        {data?.location && (
          <span style={{ fontSize: '11px', color: 'rgba(224,224,224,0.35)', marginLeft: 'auto' }}>{data.location}</span>
        )}
      </div>

      {loading && (
        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
          <div style={skeletonRow('90%', '32px')} />
          <div style={skeletonRow('70%')} />
          <div style={skeletonRow('80%')} />
        </div>
      )}

      {error && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(224,224,224,0.4)' }}>
          <AlertCircle size={14} />
          <span style={{ fontSize: '13px' }}>Weather data unavailable</span>
        </div>
      )}

      {data && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.observations && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '42px', fontWeight: 700, color: '#e0e0e0', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {data.observations.temp != null ? `${Math.round(data.observations.temp)}°` : '—'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingBottom: '6px' }}>
                {data.observations.feels_like != null && (
                  <span style={{ fontSize: '12px', color: 'rgba(224,224,224,0.55)' }}>Feels like {Math.round(data.observations.feels_like)}°</span>
                )}
                {data.observations.humidity != null && (
                  <span style={{ fontSize: '12px', color: 'rgba(224,224,224,0.55)' }}>Humidity {data.observations.humidity}%</span>
                )}
                {data.observations.wind_speed_kilometre != null && (
                  <span style={{ fontSize: '12px', color: 'rgba(224,224,224,0.55)' }}>Wind {data.observations.wind_speed_kilometre} km/h</span>
                )}
              </div>
              {data.forecast?.[0]?.uv_max != null && (() => {
                const cat = uvMeta(data.forecast[0].uv_max);
                return (
                  <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: `1px solid ${cat.color}44`, borderRadius: '6px', padding: '8px 14px', minWidth: '64px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: cat.color, fontVariantNumeric: 'tabular-nums' }}>{data.forecast[0].uv_max}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: cat.color, marginTop: '2px' }}>UV {cat.label}</span>
                  </div>
                );
              })()}
            </div>
          )}

          {data.forecast?.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.forecast.length, 3)}, 1fr)`, gap: '8px' }}>
              {data.forecast.slice(0, 3).map((day, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(224,224,224,0.5)' }}>{dayLabel(day.date)}</span>
                  <span style={{ fontSize: '22px', lineHeight: 1 }}>{weatherEmoji(day.icon_descriptor)}</span>
                  <div style={{ display: 'flex', gap: '6px', fontVariantNumeric: 'tabular-nums', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#e0e0e0' }}>{day.temp_max != null ? `${Math.round(day.temp_max)}°` : '—'}</span>
                    <span style={{ fontSize: '11px', color: 'rgba(224,224,224,0.4)' }}>{day.temp_min != null ? `${Math.round(day.temp_min)}°` : '—'}</span>
                  </div>
                  {day.rain_chance != null && (
                    <span style={{ fontSize: '11px', color: '#00d4ff' }}>{day.rain_chance}% rain</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <a href="http://www.bom.gov.au" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'rgba(224,224,224,0.3)', fontSize: '11px', textDecoration: 'none' }}>
            <ExternalLink size={10} /> Source: Bureau of Meteorology (BOM)
          </a>
        </div>
      )}
    </div>
  );
}

// ─── ABS Demographics card ────────────────────────────────────────────────────
function SuburbDemographicsCard({ lat, lng }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lat == null || lng == null) return;
    setLoading(true);
    setData(null);
    setError(null);
    fetch(`/api/abs-suburb?lat=${lat}&lng=${lng}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [lat, lng]);

  const skeletonRow = (w, h = '14px') => ({
    height: h, width: w, background: 'rgba(255,255,255,0.06)', borderRadius: '4px',
    animation: 'pulse 1.5s ease-in-out infinite',
  });

  function fmt(val, prefix = '', suffix = '') {
    if (val == null) return '—';
    return `${prefix}${Number(val).toLocaleString('en-AU')}${suffix}`;
  }

  return (
    <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Building2 size={16} style={{ color: '#a78bfa' }} />
        <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a78bfa' }}>Demographics</span>
        <span style={{ fontSize: '10px', color: 'rgba(224,224,224,0.3)', marginLeft: 'auto' }}>ABS Census 2021</span>
      </div>

      {loading && (
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <div style={skeletonRow('55%', '18px')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={skeletonRow('100%', '48px')} />)}
          </div>
        </div>
      )}

      {error && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(224,224,224,0.4)' }}>
            <AlertCircle size={14} />
            <span style={{ fontSize: '13px' }}>Demographics unavailable for this area</span>
          </div>
          <a href="https://www.abs.gov.au/census" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#a78bfa', fontSize: '12px', textDecoration: 'none' }}>
            View on ABS <ExternalLink size={10} />
          </a>
        </div>
      )}

      {data && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {data.sa2Name && <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(224,224,224,0.7)' }}>{data.sa2Name}</div>}

          {data.demographics ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { emoji: '👥', label: 'Population',    value: fmt(data.demographics.population) },
                  { emoji: '📍', label: 'Area',          value: data.demographics.area_sqkm != null ? `${Number(data.demographics.area_sqkm).toFixed(1)} km²` : '—' },
                  { emoji: '📊', label: 'Median Age',    value: data.demographics.median_age != null ? `${data.demographics.median_age} yrs` : '—' },
                  { emoji: '💰', label: 'Median Income', value: data.demographics.median_weekly_household_income != null ? `$${Number(data.demographics.median_weekly_household_income).toLocaleString('en-AU')}/wk` : '—' },
                  { emoji: '🌏', label: 'Born Overseas', value: data.demographics.pct_born_overseas != null ? `${data.demographics.pct_born_overseas}%` : '—' },
                ].map((stat) => (
                  <div key={stat.label} style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.12)', borderRadius: '6px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '10px', color: 'rgba(224,224,224,0.45)', marginBottom: '4px', display: 'flex', gap: '5px', alignItems: 'center', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                      {stat.emoji} {stat.label}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#e0e0e0', fontVariantNumeric: 'tabular-nums' }}>{stat.value}</div>
                  </div>
                ))}

                {(data.demographics.pct_renters != null || data.demographics.pct_owners != null) && (() => {
                  const owners  = data.demographics.pct_owners  ?? (100 - (data.demographics.pct_renters ?? 0));
                  const renters = data.demographics.pct_renters ?? (100 - owners);
                  return (
                    <div style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.12)', borderRadius: '6px', padding: '10px 12px' }}>
                      <div style={{ fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(224,224,224,0.45)', marginBottom: '6px' }}>🏠 Tenure</div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', background: 'rgba(167,139,250,0.18)', color: '#a78bfa', borderRadius: '3px', padding: '2px 8px', fontWeight: 700 }}>Own {Math.round(owners)}%</span>
                        <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.06)', color: 'rgba(224,224,224,0.55)', borderRadius: '3px', padding: '2px 8px', fontWeight: 700 }}>Rent {Math.round(renters)}%</span>
                      </div>
                      <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.round(owners)}%`, background: '#a78bfa', borderRadius: '3px' }} />
                      </div>
                    </div>
                  );
                })()}
              </div>

              <a href="https://www.abs.gov.au/census" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'rgba(224,224,224,0.3)', fontSize: '11px', textDecoration: 'none' }}>
                <ExternalLink size={10} /> Australian Bureau of Statistics
              </a>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'rgba(224,224,224,0.4)' }}>Detailed stats not available for this area.</span>
              <a href="https://www.abs.gov.au/census" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#a78bfa', fontSize: '12px', textDecoration: 'none' }}>
                View on ABS <ExternalLink size={10} />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Quick Facts card ─────────────────────────────────────────────────────────
function QuickFactsCard({ place }) {
  const wage = STATE_MIN_WAGE[place.state] || { rate: '$24.10/hr', note: 'Follows the National Minimum Wage' };
  const mapsUrl = `https://www.google.com/maps/place/${encodeURIComponent(place.formatted_address)}`;

  return (
    <div
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <MapPin size={16} style={{ color: '#ccff00' }} />
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#ccff00',
          }}
        >
          Quick Facts
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <FactRow label="State" value={place.state || '—'} />
        {place.postcode && <FactRow label="Postcode" value={place.postcode} />}
        <FactRow label="Min. Wage" value={wage.rate} note={wage.note} />
        <FactRow
          label="Visa Pathways"
          value="TSS · 189 · 190 · 491 · Partner"
          note="Common pathways — check IMMI for eligibility"
        />

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#ccff00',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textDecoration: 'none',
            marginTop: '6px',
          }}
        >
          View on Google Maps
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

function FactRow({ label, value, note }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(224,224,224,0.4)',
            flexShrink: 0,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: '13px',
            color: '#e0e0e0',
            fontWeight: 500,
            textAlign: 'right',
          }}
        >
          {value}
        </span>
      </div>
      {note && (
        <div style={{ fontSize: '11px', color: 'rgba(224,224,224,0.3)', marginTop: '2px', lineHeight: 1.4 }}>
          {note}
        </div>
      )}
    </div>
  );
}

// ─── Inner component (needs map context) ─────────────────────────────────────
function SuburbExplorerInner() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [services, setServices] = useState({});
  const [activeTab, setActiveTab] = useState('hospital');

  const handlePlaceSelected = useCallback((place) => {
    setSelectedPlace(place);
    setServices({});
    setActiveTab('hospital');
  }, []);

  const mapId = env.VITE_GOOGLE_MAPS_MAP_ID || undefined;

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#e0e0e0' }}>
      {/* inject Autocomplete styles */}
      <style>{PAC_STYLES}</style>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      {/* ── Page header ── */}
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '48px 24px 40px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#ccff00',
            marginBottom: '10px',
          }}
        >
          Settlement Tool
        </div>
        <h1
          style={{
            fontSize: 'clamp(32px, 6vw, 64px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            lineHeight: 0.95,
            color: '#e0e0e0',
            marginBottom: '16px',
            textWrap: 'balance',
          }}
        >
          Suburb Explorer
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: 'rgba(224,224,224,0.5)',
            maxWidth: '480px',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}
        >
          Research any Australian suburb — internet coverage, nearby services, transport, schools, and settlement facts in one view.
        </p>

        {/* Search */}
        <div style={{ maxWidth: '600px' }}>
          <SuburbSearch onPlaceSelected={handlePlaceSelected} />
        </div>
      </div>

      {/* ── Empty state ── */}
      {!selectedPlace && (
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '80px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '1px solid rgba(204,255,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MapPin size={24} style={{ color: '#ccff00', opacity: 0.6 }} />
          </div>
          <div style={{ color: 'rgba(224,224,224,0.35)', fontSize: '14px', maxWidth: '320px', lineHeight: 1.6 }}>
            Type a suburb name or address above to explore your potential new neighbourhood.
          </div>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: '8px',
            }}
          >
            {['Bondi Beach, NSW', 'South Yarra, VIC', 'New Farm, QLD', 'Fremantle, WA'].map((ex) => (
              <span
                key={ex}
                style={{
                  padding: '4px 12px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: 'rgba(224,224,224,0.35)',
                  fontWeight: 500,
                }}
              >
                {ex}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Results layout ── */}
      {selectedPlace && (
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '32px 24px 64px',
          }}
        >
          {/* Suburb name + breadcrumb */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <ChevronRight size={14} style={{ color: 'rgba(224,224,224,0.3)' }} />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(224,224,224,0.35)',
                }}
              >
                {selectedPlace.formatted_address}
              </span>
            </div>
            <h2
              style={{
                fontSize: 'clamp(22px, 4vw, 36px)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: '#e0e0e0',
                marginTop: '6px',
                textWrap: 'balance',
              }}
            >
              {selectedPlace.suburb || selectedPlace.name}
              {selectedPlace.state && (
                <span style={{ color: '#ccff00', marginLeft: '10px' }}>{selectedPlace.state}</span>
              )}
            </h2>
          </div>

          {/* Main 2-col grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr)',
              gap: '24px',
            }}
            className="suburb-grid"
          >
            {/* Map column */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                  height: '300px',
                  position: 'sticky',
                  top: '24px',
                }}
                className="map-container"
              >
                <Map
                  defaultCenter={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                  defaultZoom={14}
                  center={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                  zoom={14}
                  {...(mapId ? { mapId } : {})}
                  onIdle={(e) => setMapInstance(e.map)}
                  style={{ width: '100%', height: '100%' }}
                >
                  {/* Center marker */}
                  <AdvancedMarker position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}>
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: '#ccff00',
                        border: '3px solid #050505',
                        boxShadow: '0 0 12px rgba(204,255,0,0.6)',
                      }}
                    />
                  </AdvancedMarker>

                  {/* Service markers */}
                  <ServiceMarkers services={services} activeTab={activeTab} />
                </Map>
              </div>
            </div>

            {/* Data panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <NbnCard address={selectedPlace.formatted_address} />
              <AirQualityCard lat={selectedPlace.lat} lng={selectedPlace.lng} />
              <BomForecastCard
                suburb={selectedPlace.suburb}
                state={selectedPlace.state}
                lat={selectedPlace.lat}
                lng={selectedPlace.lng}
              />
              <SuburbDemographicsCard lat={selectedPlace.lat} lng={selectedPlace.lng} />

              {mapInstance && (
                <NearbyServicesCard
                  lat={selectedPlace.lat}
                  lng={selectedPlace.lng}
                  map={mapInstance}
                />
              )}

              <QuickFactsCard place={selectedPlace} />
            </div>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 768px) {
          .suburb-grid {
            grid-template-columns: 55% 1fr !important;
          }
          .map-container {
            height: 500px !important;
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Root export — wraps everything in APIProvider
// ═══════════════════════════════════════════════════════════════════════════════
export default function SuburbExplorerPage() {
  return (
    <>
      <SEOHead
        title="Suburb Explorer — Research Any Australian Suburb"
        description="Research any Australian suburb: live weather forecast, air quality, NBN internet coverage, ABS demographics, nearby hospitals, schools, transport, shops and more."
        path="/suburb"
        lang="en"
      />
      <APIProvider apiKey={env.VITE_GOOGLE_MAPS_API_KEY}>
        <SuburbExplorerInner />
      </APIProvider>
    </>
  );
}
