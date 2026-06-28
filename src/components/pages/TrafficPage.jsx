import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, AlertTriangle, RefreshCw, MapPin, Clock, Wifi, WifiOff } from 'lucide-react';
import SEOHead from '../seo/SEOHead';
import { env } from '../../lib/env.ts';

const NSW_KEY = env.VITE_NSW_TRANSPORT_API_KEY;

const CAMERAS = [
  { id: 'cam-m1-00010', title: 'M1 — Cahill Expressway', suburb: 'Sydney CBD', lat: -33.862, lng: 151.213 },
  { id: 'cam-m2-00020', title: 'M2 Hills Motorway', suburb: 'Baulkham Hills', lat: -33.756, lng: 150.981 },
  { id: 'cam-m4-00030', title: 'M4 Western Motorway', suburb: 'Parramatta', lat: -33.812, lng: 151.002 },
  { id: 'cam-m5-00040', title: 'M5 South West Motorway', suburb: 'Revesby', lat: -33.956, lng: 151.014 },
  { id: 'cam-m7-00050', title: 'M7 Western Sydney Motorway', suburb: 'Liverpool', lat: -33.922, lng: 150.868 },
  { id: 'cam-a1-00060', title: 'Pacific Highway', suburb: 'North Sydney', lat: -33.838, lng: 151.207 },
];

const INCIDENT_TYPES = {
  ACCIDENT:       { color: '#ff6b6b', label: 'Accident' },
  ROADWORKS:      { color: '#f59e0b', label: 'Road Works' },
  CONGESTION:     { color: '#f97316', label: 'Congestion' },
  HAZARD:         { color: '#ef4444', label: 'Hazard' },
  POLICE_ACTIVITY:{ color: '#8b5cf6', label: 'Police Activity' },
  SPECIAL_EVENT:  { color: '#3b82f6', label: 'Special Event' },
};

const useNSWIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetch_incidents = useCallback(async () => {
    if (!NSW_KEY) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(
        'https://api.transport.nsw.gov.au/v1/traffic/hazards/incident?active=true',
        { headers: { Authorization: `apikey ${NSW_KEY}` } }
      );
      if (!resp.ok) throw new Error(`API ${resp.status}`);
      const data = await resp.json();
      const features = data?.features || [];
      const items = features
        .slice(0, 20)
        .map(f => ({
          id: f.id,
          type: f.properties?.mainCategory || 'HAZARD',
          headline: f.properties?.headline || 'Traffic Incident',
          start: f.properties?.start,
          roads: f.properties?.roads?.map(r => r.shortDescription).filter(Boolean).join(', '),
          impact: f.properties?.impact || '',
          advice: f.properties?.advice || '',
          lat: f.geometry?.coordinates?.[1],
          lng: f.geometry?.coordinates?.[0],
        }));
      setIncidents(items);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_incidents(); }, [fetch_incidents]);

  return { incidents, loading, error, lastUpdated, refetch: fetch_incidents };
};

const IncidentCard = ({ incident }) => {
  const info = INCIDENT_TYPES[incident.type] || INCIDENT_TYPES.HAZARD;
  return (
    <div className="bg-[#111] border border-white/5 p-4 hover:border-white/10 transition-colors">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <AlertTriangle size={14} style={{ color: info.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5" style={{ backgroundColor: `${info.color}20`, color: info.color }}>
              {info.label}
            </span>
            {incident.start && (
              <span className="text-[9px] text-white/30 flex items-center gap-1">
                <Clock size={9} />
                {new Date(incident.start).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-white/80 leading-snug mb-1">{incident.headline}</p>
          {incident.roads && (
            <p className="text-xs text-white/40 flex items-center gap-1">
              <MapPin size={9} />{incident.roads}
            </p>
          )}
          {incident.advice && (
            <p className="text-xs text-white/30 mt-1 leading-relaxed">{incident.advice}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const CameraGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {CAMERAS.map(cam => (
      <div key={cam.id} className="bg-[#111] border border-white/5 overflow-hidden group hover:border-white/10 transition-colors">
        <div className="aspect-video bg-[#0a0a0a] relative flex items-center justify-center">
          <img
            src={`https://www.livetraffic.com/webcams/${cam.id}.jpg`}
            alt={cam.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
          <div className="absolute inset-0 hidden items-center justify-center flex-col gap-2 bg-[#0a0a0a]">
            <Camera size={24} className="text-white/20" />
            <span className="text-[9px] text-white/20 uppercase font-bold">Feed Unavailable</span>
          </div>
          <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff4444] animate-pulse" />
            <span className="text-[9px] text-white/60 font-bold uppercase">Live</span>
          </div>
        </div>
        <div className="p-3">
          <p className="text-xs font-black text-white/80 uppercase tracking-tight">{cam.title}</p>
          <p className="text-[10px] text-white/30 mt-0.5 flex items-center gap-1"><MapPin size={9} />{cam.suburb}</p>
        </div>
      </div>
    ))}
  </div>
);

const TrafficPage = () => {
  const { incidents, loading, error, lastUpdated, refetch } = useNSWIncidents();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'NSW Live Traffic — Sydney Road Incidents & Cameras',
    description: 'Live traffic conditions, incidents and speed camera feeds for NSW roads. Real-time data for new migrants navigating Sydney.',
    url: 'https://migron.mtive.tech/traffic',
    about: { '@type': 'Place', name: 'New South Wales, Australia' },
  };

  return (
    <>
      <SEOHead
        title="NSW Live Traffic — Sydney Road Incidents & Camera Feeds"
        description="Real-time NSW traffic incidents, road conditions and live camera feeds. Essential for new migrants navigating Sydney and NSW roads."
        path="/traffic"
        schema={jsonLd}
      />
      <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pt-20">
        {/* Header */}
        <section className="pt-8 pb-6 px-6 border-b border-white/10">
          <div className="max-w-[1100px] mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#ccff00] transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                <ArrowLeft size={14} /> Back to Home
              </Link>
              <span className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">SETTLEMENT — TRANSPORT</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2.5 bg-[#ff6b6b]">
                <Camera className="text-white" size={28} strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ff6b6b]">
                  NSW LIVE TRAFFIC
                </h1>
                <p className="text-sm text-white/40 mt-1">Real-time incidents and camera feeds for NSW roads</p>
              </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                {NSW_KEY ? <Wifi size={11} className="text-[#00ff88]" /> : <WifiOff size={11} className="text-[#ff6b6b]" />}
                <span>{NSW_KEY ? 'NSW Transport API Connected' : 'API Key Not Configured'}</span>
              </div>
              {lastUpdated && (
                <span className="text-[10px] text-white/30">
                  Updated {lastUpdated.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <button
                onClick={refetch}
                disabled={loading || !NSW_KEY}
                className="ml-auto flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white disabled:opacity-30 transition-colors"
              >
                <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </section>

        <div className="max-w-[1100px] mx-auto px-6 py-10 space-y-12">
          {/* Camera Feeds */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff6b6b]">LIVE CAMERA FEEDS</p>
              <a
                href="https://www.livetraffic.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-white/30 hover:text-[#ccff00] transition-colors uppercase font-bold"
              >
                Full LiveTraffic Map →
              </a>
            </div>
            <CameraGrid />
          </div>

          {/* Incidents */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff6b6b]">
                ACTIVE INCIDENTS
                {incidents.length > 0 && <span className="ml-2 text-white/30">({incidents.length})</span>}
              </p>
              <div className="flex items-center gap-3">
                {Object.entries(INCIDENT_TYPES).map(([key, val]) => (
                  <span key={key} className="hidden sm:flex items-center gap-1 text-[9px] uppercase font-bold" style={{ color: val.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: val.color }} />
                    {val.label}
                  </span>
                ))}
              </div>
            </div>

            {!NSW_KEY && (
              <div className="bg-[#111] border border-white/5 p-6 text-center">
                <WifiOff size={24} className="mx-auto mb-3 text-white/20" />
                <p className="text-sm font-bold text-white/40">NSW Transport API key not configured.</p>
                <p className="text-xs text-white/20 mt-1">Add VITE_NSW_TRANSPORT_API_KEY to your environment variables.</p>
              </div>
            )}

            {NSW_KEY && loading && (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-20 bg-white/3 animate-pulse" />
                ))}
              </div>
            )}

            {NSW_KEY && error && (
              <div className="bg-[#111] border border-[#ff6b6b]/20 p-6 text-center">
                <AlertTriangle size={20} className="mx-auto mb-2 text-[#ff6b6b]" />
                <p className="text-sm text-[#ff6b6b]/80">Could not load incidents: {error}</p>
                <button onClick={refetch} className="mt-3 text-xs text-white/40 hover:text-white uppercase font-bold">
                  Try again
                </button>
              </div>
            )}

            {NSW_KEY && !loading && !error && incidents.length === 0 && (
              <div className="bg-[#111] border border-white/5 p-6 text-center">
                <p className="text-sm text-white/40">No active incidents reported — roads are clear.</p>
              </div>
            )}

            {NSW_KEY && !loading && incidents.length > 0 && (
              <div className="space-y-2">
                {incidents.map(inc => <IncidentCard key={inc.id} incident={inc} />)}
              </div>
            )}
          </div>

          {/* Info box */}
          <div className="bg-[#111] border border-white/5 p-5 text-xs text-white/30 leading-relaxed">
            <strong className="text-white/50">Why traffic matters for new migrants:</strong> Understanding NSW road rules, toll roads (e-TAG required), speed camera zones, and school zones is essential. Speed limits in school zones drop to 40 km/h — fines start at $330 AUD.{' '}
            <a href="https://www.rms.nsw.gov.au" target="_blank" rel="noopener noreferrer" className="text-[#ccff00] hover:underline">Roads NSW →</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrafficPage;
