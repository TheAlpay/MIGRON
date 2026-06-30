import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Navigation, AlertTriangle, Info, MapPin } from 'lucide-react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import SEOHead from '../seo/SEOHead';
import { env } from '../../lib/env.ts';

const GOOGLE_MAPS_API_KEY = env.VITE_GOOGLE_MAPS_API_KEY || '';

const CITIES = [
  { id: 'sydney',    name: 'Sydney',    state: 'NSW', lat: -33.868, lng: 151.209, zoom: 12 },
  { id: 'melbourne', name: 'Melbourne', state: 'VIC', lat: -37.813, lng: 144.963, zoom: 12 },
  { id: 'brisbane',  name: 'Brisbane',  state: 'QLD', lat: -27.470, lng: 153.021, zoom: 12 },
  { id: 'perth',     name: 'Perth',     state: 'WA',  lat: -31.953, lng: 115.857, zoom: 12 },
  { id: 'adelaide',  name: 'Adelaide',  state: 'SA',  lat: -34.928, lng: 138.600, zoom: 12 },
  { id: 'canberra',  name: 'Canberra',  state: 'ACT', lat: -35.282, lng: 149.128, zoom: 12 },
  { id: 'goldcoast', name: 'Gold Coast',state: 'QLD', lat: -28.016, lng: 153.400, zoom: 12 },
  { id: 'darwin',    name: 'Darwin',    state: 'NT',  lat: -12.462, lng: 130.842, zoom: 12 },
  { id: 'hobart',    name: 'Hobart',    state: 'TAS', lat: -42.882, lng: 147.327, zoom: 12 },
];

const TRAFFIC_LEGEND = [
  { color: '#00c853', label: 'Free flowing' },
  { color: '#ffca28', label: 'Slow traffic' },
  { color: '#f44336', label: 'Heavy traffic' },
  { color: '#b71c1c', label: 'Stop & go' },
];

const DRIVING_TIPS = [
  { icon: '🛣️', title: 'Drive on the LEFT', body: 'Australia drives on the left-hand side. Give way to the right at unmarked intersections.' },
  { icon: '🚦', title: 'Speed Limits', body: 'Default urban: 50 km/h. School zones: 40 km/h. Open road: 100–110 km/h (state-specific). Always check signs.' },
  { icon: '📱', title: 'Phones Banned', body: 'Using a handheld mobile while driving is illegal in all states. Fines are severe — use hands-free only.' },
  { icon: '🚗', title: 'P-Plates', body: 'Overseas licences can typically be used for 3–6 months. After that you must get an Australian licence.' },
  { icon: '🦘', title: 'Wildlife Hazard', body: 'Dawn and dusk are high-risk times for kangaroos on roads, especially in rural areas. Slow down.' },
  { icon: '⛽', title: 'Fuel Types', body: 'Most cars use Unleaded 91 or E10. Premium: 95/98 RON. Diesel for trucks/4WDs. Check before filling.' },
  { icon: '🅿️', title: 'Parking Rules', body: 'Read signs carefully — time limits, clearway zones and clearway times vary by suburb and day of week.' },
  { icon: '🚨', title: 'Speed Cameras', body: 'Fixed and mobile speed cameras operate state-wide. Demerit points apply on overseas licences too.' },
];

function TrafficLayerOverlay() {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google?.maps?.TrafficLayer) return;
    const trafficLayer = new window.google.maps.TrafficLayer();
    trafficLayer.setMap(map);
    return () => trafficLayer.setMap(null);
  }, [map]);

  return null;
}

const MapView = ({ city }) => (
  <div style={{ width: '100%', height: '500px' }}>
    <Map
      defaultCenter={{ lat: city.lat, lng: city.lng }}
      defaultZoom={city.zoom}
      mapId={env.VITE_GOOGLE_MAPS_MAP_ID || undefined}
      gestureHandling="greedy"
      disableDefaultUI={false}
      mapTypeId="roadmap"
      colorScheme="DARK"
    >
      <TrafficLayerOverlay />
    </Map>
  </div>
);

const TrafficPage = () => {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Australia Live Traffic Map — All Capital Cities',
    description: 'Real-time traffic conditions for Sydney, Melbourne, Brisbane, Perth, Adelaide, Canberra, Gold Coast, Darwin and Hobart.',
    url: 'https://migron.mtive.tech/traffic',
    about: { '@type': 'Place', name: 'Australia' },
  };

  return (
    <>
      <SEOHead
        title="Australia Live Traffic Map — All Capital Cities"
        description="Real-time traffic conditions across Australia. Live traffic layer for Sydney, Melbourne, Brisbane, Perth, Adelaide, Canberra, Gold Coast, Darwin and Hobart."
        path="/traffic"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">

        {/* Header */}
        <section className="pt-8 pb-6 px-6 border-b border-white/10">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                <ArrowLeft size={14} /> Back to Home
              </Link>
              <span className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">SETTLEMENT — TRANSPORT</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="p-2.5 bg-[#ccff00]">
                <Navigation className="text-black" size={28} strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ccff00]">
                  LIVE TRAFFIC
                </h1>
                <p className="text-sm text-white/40 mt-1">Real-time traffic conditions — all Australian capital cities</p>
              </div>
            </div>

            {/* Traffic legend */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {TRAFFIC_LEGEND.map(l => (
                <span key={l.label} className="flex items-center gap-1.5 text-[10px] text-white/50">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
                  {l.label}
                </span>
              ))}
              <span className="ml-auto text-[9px] text-white/20 uppercase font-bold">Powered by Google Maps</span>
            </div>
          </div>
        </section>

        <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">

          {/* City selector */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ccff00] mb-4">SELECT CITY</p>
            <div className="flex flex-wrap gap-2">
              {CITIES.map(city => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-wider border transition-all ${
                    selectedCity.id === city.id
                      ? 'border-[#ccff00] bg-[#ccff00] text-black'
                      : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                  }`}
                >
                  <MapPin size={10} />
                  {city.name}
                  <span className={`text-[8px] ${selectedCity.id === city.id ? 'text-black/50' : 'text-white/20'}`}>
                    {city.state}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="border border-white/10 overflow-hidden">
            {GOOGLE_MAPS_API_KEY ? (
              <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                <MapView city={selectedCity} />
              </APIProvider>
            ) : (
              <div className="h-[500px] bg-[#111] flex flex-col items-center justify-center gap-3">
                <Navigation size={32} className="text-white/20" />
                <p className="text-white/40 text-sm font-bold">Google Maps API key not configured.</p>
                <p className="text-white/20 text-xs">Add VITE_GOOGLE_MAPS_API_KEY to your environment.</p>
              </div>
            )}
            <div className="bg-[#0a0a0a] border-t border-white/5 px-4 py-2.5 flex items-center justify-between">
              <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">{selectedCity.name}, {selectedCity.state}</span>
              <span className="text-[9px] text-white/20">Data: Google Maps Traffic Layer · Updated in real-time</span>
            </div>
          </div>

          {/* Info notice */}
          <div className="bg-[#111] border border-white/5 p-4 flex items-start gap-3">
            <Info size={14} className="text-[#ccff00] shrink-0 mt-0.5" />
            <p className="text-xs text-white/50 leading-relaxed">
              Traffic data is sourced from Google Maps in real-time. Colour overlay shows current road conditions.
              For detailed navigation or incident alerts, open <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-[#ccff00] hover:underline">Google Maps</a> or
              your state&apos;s official traffic site.
            </p>
          </div>

          {/* Official traffic links */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ccff00] mb-4">OFFICIAL TRAFFIC SITES</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { state: 'NSW', url: 'https://www.livetraffic.com', label: 'Live Traffic NSW' },
                { state: 'VIC', url: 'https://traffic.vicroads.vic.gov.au', label: 'VicRoads Traffic' },
                { state: 'QLD', url: 'https://131940.com.au', label: 'Transport for Qld' },
                { state: 'WA',  url: 'https://www.mainroads.wa.gov.au', label: 'Main Roads WA' },
                { state: 'SA',  url: 'https://dpti.sa.gov.au', label: 'DPTI South Australia' },
                { state: 'ACT', url: 'https://www.accesscanberra.act.gov.au', label: 'Access Canberra' },
                { state: 'NT',  url: 'https://nt.gov.au/driving', label: 'NT Transport' },
                { state: 'TAS', url: 'https://www.transport.tas.gov.au', label: 'Transport Tasmania' },
              ].map(({ state, url, label }) => (
                <a
                  key={state}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#111] border border-white/5 px-4 py-3 hover:border-[#ccff00]/30 hover:text-[#ccff00] transition-all group"
                >
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-1 group-hover:text-[#ccff00]/50">
                    {state}
                  </div>
                  <div className="text-xs font-bold text-white/60 group-hover:text-white">{label}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Driving tips for migrants */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="p-1.5 bg-[#ccff00]">
                <AlertTriangle size={14} className="text-black" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ccff00]">DRIVING IN AUSTRALIA — MIGRANT GUIDE</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {DRIVING_TIPS.map(tip => (
                <div key={tip.title} className="bg-[#111] border border-white/5 p-5 hover:border-white/10 transition-colors">
                  <div className="text-2xl mb-3">{tip.icon}</div>
                  <h3 className="text-[11px] font-black uppercase tracking-wider text-white mb-2">{tip.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{tip.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Licence info */}
          <div className="bg-[#111] border border-white/5 p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ccff00] mb-4">OVERSEAS LICENCE — HOW LONG CAN YOU DRIVE?</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-4 text-white/30 font-black uppercase tracking-wider">State</th>
                    <th className="text-left py-2 pr-4 text-white/30 font-black uppercase tracking-wider">Duration</th>
                    <th className="text-left py-2 text-white/30 font-black uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { state: 'NSW', duration: '3 months', notes: 'Must carry overseas licence + translation if not in English' },
                    { state: 'VIC', duration: '6 months', notes: 'After 6 months as a resident, must convert to Victorian licence' },
                    { state: 'QLD', duration: '3 months', notes: '3 months from arrival as a Queensland resident' },
                    { state: 'WA',  duration: '3 months', notes: 'After 3 months, must apply for WA licence' },
                    { state: 'SA',  duration: '3 months', notes: 'Translation required if licence not in English' },
                    { state: 'ACT', duration: '3 months', notes: 'Visit Access Canberra to convert your licence' },
                  ].map(row => (
                    <tr key={row.state} className="border-b border-white/5 hover:bg-white/2">
                      <td className="py-3 pr-4 font-black text-white/80">{row.state}</td>
                      <td className="py-3 pr-4 text-[#ccff00] font-bold">{row.duration}</td>
                      <td className="py-3 text-white/40">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrafficPage;
