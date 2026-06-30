import React, { useState, useEffect, useCallback } from 'react';
import {
  APIProvider, Map, AdvancedMarker,
} from '@vis.gl/react-google-maps';
import { Cloud, Thermometer, Wind, Droplets, Briefcase, Home, DollarSign, X, MapPin, Leaf } from 'lucide-react';
import { env } from '../../lib/env.ts';

const GOOGLE_MAPS_API_KEY = env.VITE_GOOGLE_MAPS_API_KEY || '';

// ── City data ─────────────────────────────────────────────────────────────────
const CITIES = [
  {
    id: 'sydney', name: 'Sydney', state: 'NSW',
    lat: -33.868, lng: 151.209, color: '#ccff00',
    population: '5.3M', avgRent: '$2,400/mo', avgSalary: '$2,150/wk',
    costIndex: 'High',
    occupations: [
      { title: 'Software Developer', demand: 98 },
      { title: 'Registered Nurse', demand: 96 },
      { title: 'Civil Engineer', demand: 93 },
      { title: 'Accountant', demand: 89 },
      { title: 'Teacher', demand: 87 },
    ],
    desc: "Australia's largest city. Finance and tech hub, highest wages — but highest cost of living too.",
  },
  {
    id: 'melbourne', name: 'Melbourne', state: 'VIC',
    lat: -37.813, lng: 144.963, color: '#00d4ff',
    population: '5.1M', avgRent: '$1,900/mo', avgSalary: '$2,000/wk',
    costIndex: 'Mod-High',
    occupations: [
      { title: 'Engineer', demand: 96 },
      { title: 'Nurse', demand: 94 },
      { title: 'Teacher', demand: 90 },
      { title: 'Data Analyst', demand: 87 },
      { title: 'Architect', demand: 80 },
    ],
    desc: 'Culture, arts and education hub. Second largest city, slightly lower cost than Sydney.',
  },
  {
    id: 'brisbane', name: 'Brisbane', state: 'QLD',
    lat: -27.469, lng: 153.025, color: '#f59e0b',
    population: '2.5M', avgRent: '$2,000/mo', avgSalary: '$1,950/wk',
    costIndex: 'Moderate',
    occupations: [
      { title: 'Construction Engineer', demand: 97 },
      { title: 'Nurse', demand: 95 },
      { title: 'Software Developer', demand: 91 },
      { title: 'Electrician', demand: 90 },
      { title: 'Teacher', demand: 86 },
    ],
    desc: 'Growing fast with the 2032 Olympics. Lower rent than Sydney/Melbourne, strong construction sector.',
  },
  {
    id: 'perth', name: 'Perth', state: 'WA',
    lat: -31.950, lng: 115.860, color: '#ff6b6b',
    population: '2.1M', avgRent: '$1,750/mo', avgSalary: '$2,050/wk',
    costIndex: 'Moderate',
    occupations: [
      { title: 'Mining Engineer', demand: 99 },
      { title: 'Geologist', demand: 96 },
      { title: 'Mechanical Engineer', demand: 92 },
      { title: 'Welder', demand: 88 },
      { title: 'Nurse', demand: 87 },
    ],
    desc: 'Mining capital of Australia. Highest salaries in trades — isolated but sunny.',
  },
  {
    id: 'adelaide', name: 'Adelaide', state: 'SA',
    lat: -34.928, lng: 138.600, color: '#a78bfa',
    population: '1.4M', avgRent: '$1,500/mo', avgSalary: '$1,800/wk',
    costIndex: 'Low-Mod',
    occupations: [
      { title: 'Defence Industry', demand: 95 },
      { title: 'Nurse', demand: 92 },
      { title: 'Software Developer', demand: 86 },
      { title: 'Teacher', demand: 83 },
      { title: 'Food Technologist', demand: 78 },
    ],
    desc: 'Best quality of life per dollar. Strong defence and food tech sectors.',
  },
  {
    id: 'canberra', name: 'Canberra', state: 'ACT',
    lat: -35.280, lng: 149.130, color: '#ec4899',
    population: '460K', avgRent: '$1,900/mo', avgSalary: '$2,300/wk',
    costIndex: 'Mod-High',
    occupations: [
      { title: 'Civil Servant', demand: 99 },
      { title: 'IT Specialist', demand: 95 },
      { title: 'Policy Analyst', demand: 90 },
      { title: 'Engineer', demand: 85 },
      { title: 'Researcher', demand: 82 },
    ],
    desc: "Australia's capital. Highest average salary, government-dominated economy.",
  },
  {
    id: 'darwin', name: 'Darwin', state: 'NT',
    lat: -12.462, lng: 130.841, color: '#10b981',
    population: '150K', avgRent: '$1,600/mo', avgSalary: '$2,200/wk',
    costIndex: 'Moderate',
    occupations: [
      { title: 'Healthcare Worker', demand: 98 },
      { title: 'Construction Specialist', demand: 94 },
      { title: 'Teacher', demand: 90 },
      { title: 'Engineer', demand: 87 },
      { title: 'Social Services', demand: 85 },
    ],
    desc: 'Remote area bonuses add 20–30% to salaries. Ideal for the 491 regional visa.',
  },
  {
    id: 'goldcoast', name: 'Gold Coast', state: 'QLD',
    lat: -28.016, lng: 153.399, color: '#fbbf24',
    population: '700K', avgRent: '$1,900/mo', avgSalary: '$1,800/wk',
    costIndex: 'Moderate',
    occupations: [
      { title: 'Hospitality Manager', demand: 96 },
      { title: 'Construction Worker', demand: 93 },
      { title: 'Nurse', demand: 91 },
      { title: 'Tourism Professional', demand: 88 },
      { title: 'Real Estate Agent', demand: 83 },
    ],
    desc: "Australia's tourism capital. Booming real estate and hospitality sector.",
  },
];

// ── AQI helpers ───────────────────────────────────────────────────────────────
function aqiMeta(aqi) {
  if (aqi === null || aqi === undefined) return null;
  if (aqi <= 50)  return { label: 'Good',        color: '#22c55e', bg: 'rgba(34,197,94,0.12)' };
  if (aqi <= 100) return { label: 'Moderate',     color: '#eab308', bg: 'rgba(234,179,8,0.12)' };
  if (aqi <= 150) return { label: 'Unhealthy*',   color: '#f97316', bg: 'rgba(249,115,22,0.12)' };
  if (aqi <= 200) return { label: 'Unhealthy',    color: '#ef4444', bg: 'rgba(239,68,68,0.12)' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#a855f7', bg: 'rgba(168,85,247,0.12)' };
  return           { label: 'Hazardous',          color: '#7f1d1d', bg: 'rgba(127,29,29,0.12)' };
}

// ── AQI hook ──────────────────────────────────────────────────────────────────
const useAirQuality = (lat, lng) => {
  const [aqi, setAqi] = useState(null);
  const token = env.VITE_WAQI_TOKEN || env.VITE_WAQI_API_KEY;

  useEffect(() => {
    if (!lat || !lng || !token) return;
    setAqi(null);
    fetch(`https://api.waqi.info/feed/geo:${lat};${lng}/?token=${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'ok' && d.data?.aqi !== undefined) {
          setAqi({ value: d.data.aqi, pol: d.data.dominentpol || '' });
        }
      })
      .catch(() => {});
  }, [lat, lng, token]);

  return aqi;
};

// ── Weather hook ──────────────────────────────────────────────────────────────
const useWeather = (cityId) => {
  const [weather, setWeather] = useState(null);
  const apiKey = env.VITE_OPENWEATHER_API_KEY;

  const cityCoords = {
    sydney:     { lat: -33.868, lon: 151.209 },
    melbourne:  { lat: -37.813, lon: 144.963 },
    brisbane:   { lat: -27.469, lon: 153.025 },
    perth:      { lat: -31.950, lon: 115.860 },
    adelaide:   { lat: -34.928, lon: 138.600 },
    canberra:   { lat: -35.280, lon: 149.130 },
    darwin:     { lat: -12.462, lon: 130.841 },
    goldcoast:  { lat: -28.016, lon: 153.399 },
  };

  useEffect(() => {
    if (!cityId || !apiKey) return;
    const coords = cityCoords[cityId];
    if (!coords) return;

    setWeather(null);
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`)
      .then(r => r.json())
      .then(d => {
        if (d.main) {
          setWeather({
            temp: Math.round(d.main.temp),
            feels: Math.round(d.main.feels_like),
            humidity: d.main.humidity,
            wind: Math.round(d.wind.speed * 3.6),
            desc: d.weather[0]?.description,
            icon: d.weather[0]?.icon,
          });
        }
      })
      .catch(() => {});
  }, [cityId, apiKey]);

  return weather;
};

// ── City info panel ───────────────────────────────────────────────────────────
const CityPanel = ({ city, onClose }) => {
  const weather = useWeather(city?.id);
  const aqi     = useAirQuality(city?.lat, city?.lng);
  const aqiInfo = aqi ? aqiMeta(aqi.value) : null;

  if (!city) return null;

  return (
    <div className="absolute top-4 right-4 w-80 bg-[#0a0a0a]/95 backdrop-blur-md border border-white/10 z-10 shadow-2xl overflow-hidden"
      style={{ borderTop: `3px solid ${city.color}` }}>
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={12} style={{ color: city.color }} />
            <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: city.color }}>{city.state}</span>
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">{city.name}</h3>
          <p className="text-xs text-white/40 mt-0.5">{city.population} residents</p>
        </div>
        <button onClick={onClose} className="p-1 text-white/30 hover:text-white transition-colors mt-0.5">
          <X size={16} />
        </button>
      </div>

      {/* Weather */}
      {weather && (
        <div className="px-4 py-3 bg-white/3 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {weather.icon && (
                <img src={`https://openweathermap.org/img/wn/${weather.icon}.png`} alt="" className="w-8 h-8" />
              )}
              <div>
                <p className="text-2xl font-black text-white">{weather.temp}°C</p>
                <p className="text-xs text-white/40 capitalize">{weather.desc}</p>
              </div>
            </div>
            <div className="text-right text-xs text-white/40 space-y-0.5">
              <div className="flex items-center gap-1 justify-end">
                <Droplets size={10} /><span>{weather.humidity}% humidity</span>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <Wind size={10} /><span>{weather.wind} km/h</span>
              </div>
              <div className="flex items-center gap-1 justify-end">
                <Thermometer size={10} /><span>Feels {weather.feels}°C</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Air Quality */}
      {aqiInfo && (
        <div className="px-4 py-2.5 border-b border-white/5 flex items-center justify-between" style={{ background: aqiInfo.bg }}>
          <div className="flex items-center gap-2">
            <Leaf size={12} style={{ color: aqiInfo.color }} />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Air Quality Index</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black" style={{ color: aqiInfo.color }}>{aqi.value}</span>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ backgroundColor: aqiInfo.color, color: '#000' }}>{aqiInfo.label}</span>
            {aqi.pol && <span className="text-[9px] text-white/30 uppercase">{aqi.pol}</span>}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-white/5 border-b border-white/5">
        {[
          { icon: <Home size={11} />, label: 'Rent (1BR)', value: city.avgRent },
          { icon: <DollarSign size={11} />, label: 'Avg Salary', value: city.avgSalary },
          { icon: <Briefcase size={11} />, label: 'Cost', value: city.costIndex },
        ].map(s => (
          <div key={s.label} className="p-3 text-center">
            <div className="flex justify-center mb-1 text-white/30">{s.icon}</div>
            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-0.5">{s.label}</p>
            <p className="text-xs font-black text-white leading-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Occupations */}
      <div className="p-4 border-b border-white/5">
        <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2">Top In-Demand Occupations</p>
        <div className="space-y-1.5">
          {city.occupations.map((occ, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${occ.demand}%`, backgroundColor: city.color }} />
              </div>
              <span className="text-xs text-white/60 w-44 text-right">{occ.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-3">
        <p className="text-xs text-white/50 leading-relaxed">{city.desc}</p>
      </div>
    </div>
  );
};

// ── Map ID from env (optional — if missing, map loads without dark vector theme) ──
const GOOGLE_MAPS_MAP_ID = env.VITE_GOOGLE_MAPS_MAP_ID || undefined;

// ── Main map component ────────────────────────────────────────────────────────
const AustraliaMapGoogle = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const onAuthFailure = () => setMapError(true);
    window.addEventListener('gm-authfailure', onAuthFailure);
    return () => window.removeEventListener('gm-authfailure', onAuthFailure);
  }, []);

  const handleMarkerClick = useCallback((city) => {
    setSelectedCity(prev => prev?.id === city.id ? null : city);
  }, []);

  if (!GOOGLE_MAPS_API_KEY || mapError) {
    throw new Error('Google Maps unavailable');
  }

  const mapProps = {
    defaultCenter: { lat: -27, lng: 134 },
    defaultZoom: 4,
    disableDefaultUI: false,
    gestureHandling: 'cooperative',
    style: { width: '100%', height: '100%' },
    mapTypeId: 'roadmap',
    ...(GOOGLE_MAPS_MAP_ID ? { mapId: GOOGLE_MAPS_MAP_ID, colorScheme: 'DARK' } : {}),
  };

  return (
    <section className="py-16 px-4 bg-[#050505]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[#ccff00] text-xs font-black uppercase tracking-widest">Interactive Map</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mt-1">
              AUSTRALIA<br />
              <span className="text-[#ccff00] italic">CITIES</span>
            </h2>
          </div>
          <p className="text-white/30 text-sm max-w-xs text-right hidden md:block">
            Click a city marker — see live weather, rent, salary and top occupations.
          </p>
        </div>

        {/* Map */}
        <div className="relative w-full rounded-none overflow-hidden border border-white/10" style={{ height: '520px' }}>
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <Map {...mapProps}>
              {CITIES.map(city => (
                <AdvancedMarker
                  key={city.id}
                  position={{ lat: city.lat, lng: city.lng }}
                  onClick={() => handleMarkerClick(city)}
                  title={city.name}
                >
                  <div
                    className="flex flex-col items-center cursor-pointer group"
                    style={{ transform: selectedCity?.id === city.id ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.15s' }}
                  >
                    <div
                      className="w-3 h-3 rounded-full border-2 border-black shadow-lg"
                      style={{ backgroundColor: city.color }}
                    />
                    <span
                      className="text-[9px] font-black mt-0.5 px-1 bg-black/70 backdrop-blur-sm text-white whitespace-nowrap"
                    >
                      {city.name}
                    </span>
                  </div>
                </AdvancedMarker>
              ))}
            </Map>
          </APIProvider>

          {/* City panel overlay */}
          {selectedCity && (
            <CityPanel city={selectedCity} onClose={() => setSelectedCity(null)} />
          )}

          {/* Legend */}
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-2 text-[9px] text-white/40 font-bold uppercase tracking-wider">
            AUSTRALIA — {new Date().getFullYear()} DATA · Click a city
          </div>
        </div>
      </div>
    </section>
  );
};

export default AustraliaMapGoogle;
