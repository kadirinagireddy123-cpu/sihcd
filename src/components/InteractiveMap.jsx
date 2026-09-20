import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Layers, 
  AlertTriangle, 
  ShieldCheck, 
  Navigation, 
  Radio, 
  Globe, 
  ZoomIn, 
  Maximize2 
} from 'lucide-react';

// Custom SVG Icons for Leaflet Markers
const createCustomIcon = (color, label, pulse = false) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="2"/>
      <circle cx="12" cy="12" r="5" fill="${color}"/>
      ${pulse ? `<circle cx="12" cy="12" r="10" fill="none" stroke="${color}" stroke-width="1.5">
        <animate attributeName="r" values="6;11;6" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite"/>
      </circle>` : ''}
    </svg>
  `;
  return L.divIcon({
    html: svgString,
    className: 'custom-leaflet-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const iconRed = createCustomIcon('#ff3b5c', 'CRITICAL', true);
const iconOrange = createCustomIcon('#ff9f1c', 'HIGH', true);
const iconGreen = createCustomIcon('#06d6a0', 'SAFE', false);

// Custom Label Marker Creator
const createLabelIcon = (text, type = 'country') => {
  const isOcean = type === 'ocean';
  const styleClass = isOcean ? 'text-blue-900 font-bold uppercase tracking-widest text-[11px] opacity-80' : 'text-slate-900 font-semibold text-[10px] drop-shadow-sm';
  return L.divIcon({
    html: `<div style="white-space: nowrap; pointer-events: none;" class="${styleClass}">${text}</div>`,
    className: 'custom-text-label-icon',
    iconSize: [100, 20],
    iconAnchor: [50, 10],
  });
};

// Component to dynamically re-center map & update zoom
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveMap({ selectedNode, setSelectedNode }) {
  const [mapTile, setMapTile] = useState('cyan-mint');
  const [viewMode, setViewMode] = useState('world'); // 'world' or 'regional'
  const [showHazardZones, setShowHazardZones] = useState(true);
  const [showBeacons, setShowBeacons] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showEvacuationRoutes, setShowEvacuationRoutes] = useState(true);
  const [showWorldLabels, setShowWorldLabels] = useState(true);

  // Region locations:
  const regionalCenter = [27.3314, 88.6138]; // Gangtok & Sikkim GIS
  const worldCenter = [22.0, 10.0]; // Global View (Matches user reference image)

  const currentCenter = selectedNode 
    ? [selectedNode.lat, selectedNode.lng] 
    : (viewMode === 'world' ? worldCenter : regionalCenter);
  
  const currentZoom = selectedNode ? 13 : (viewMode === 'world' ? 2 : 13);

  // Tile layer sources (100% Free & Reliable OpenStreetMap Tiles)
  const tileUrls = {
    'cyan-mint': 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
  };

  // World Ocean Labels
  const oceanLabels = [
    { name: 'North Pacific Ocean', pos: [28, -150] },
    { name: 'South Pacific Ocean', pos: [-22, -135] },
    { name: 'North Atlantic Ocean', pos: [26, -38] },
    { name: 'South Atlantic Ocean', pos: [-24, -18] },
    { name: 'Indian Ocean', pos: [-22, 78] },
  ];

  // World Country Labels (Matching uploaded reference image)
  const countryLabels = [
    { name: 'Greenland', pos: [72, -40] },
    { name: 'Iceland', pos: [64.9, -18.5] },
    { name: 'Finland', pos: [64, 26] },
    { name: 'Sweden', pos: [62, 15] },
    { name: 'Norway', pos: [61, 8] },
    { name: 'United Kingdom', pos: [54, -2.5] },
    { name: 'Poland', pos: [52, 19] },
    { name: 'Germany', pos: [51, 10] },
    { name: 'Ukraine', pos: [49, 31] },
    { name: 'France', pos: [46.5, 2.5] },
    { name: 'Italy', pos: [42.5, 12.5] },
    { name: 'Spain', pos: [40, -4] },
    { name: 'Kazakhstan', pos: [48, 67] },
    { name: 'Mongolia', pos: [46.8, 103.8] },
    { name: 'Russia', pos: [61.5, 95] },
    { name: 'China', pos: [35, 104] },
    { name: 'Japan', pos: [36.2, 138.2] },
    { name: 'South Korea', pos: [36, 127.8] },
    { name: 'Türkiye', pos: [39, 35] },
    { name: 'Afghanistan', pos: [33, 65] },
    { name: 'Pakistan', pos: [30, 69] },
    { name: 'Iran', pos: [32, 53] },
    { name: 'Iraq', pos: [33, 44] },
    { name: 'Algeria', pos: [28, 3] },
    { name: 'Libya', pos: [27, 17] },
    { name: 'Egypt', pos: [26, 30] },
    { name: 'Saudi Arabia', pos: [24, 45] },
    { name: 'Sudan', pos: [16, 30] },
    { name: 'Chad', pos: [15, 19] },
    { name: 'Niger', pos: [17, 8] },
    { name: 'Mali', pos: [17, -4] },
    { name: 'Nigeria', pos: [9.5, 8] },
    { name: 'Ethiopia', pos: [9, 40] },
    { name: 'Kenya', pos: [1, 38] },
    { name: 'Tanzania', pos: [-6, 35] },
    { name: 'DRC', pos: [-4, 21.7] },
    { name: 'Angola', pos: [-12.5, 18.5] },
    { name: 'Namibia', pos: [-22, 17] },
    { name: 'Botswana', pos: [-22, 24] },
    { name: 'Madagascar', pos: [-19, 46.5] },
    { name: 'South Africa', pos: [-30.5, 25] },
    { name: 'India', pos: [20.5, 78.9] },
    { name: 'Thailand', pos: [15.8, 101] },
    { name: 'Indonesia', pos: [-0.78, 113.9] },
    { name: 'Papua New Guinea', pos: [-6.3, 143.9] },
    { name: 'Australia', pos: [-25.2, 133.7] },
    { name: 'New Zealand', pos: [-40.9, 174.8] },
    { name: 'Canada', pos: [56, -106] },
    { name: 'United States', pos: [37, -95.7] },
    { name: 'Mexico', pos: [23.6, -102.5] },
    { name: 'Colombia', pos: [4, -73] },
    { name: 'Venezuela', pos: [6.4, -66.5] },
    { name: 'Peru', pos: [-9.1, -75] },
    { name: 'Brazil', pos: [-14.2, -51.9] },
    { name: 'Bolivia', pos: [-16.2, -63.5] },
    { name: 'Chile', pos: [-35.6, -71.5] },
    { name: 'Argentina', pos: [-38.4, -63.6] },
  ];

  // Longitudinal meridian grid lines for world view matching reference image
  const meridianLines = [-180, -120, -60, 0, 60, 120, 180].map(lng => [
    [-80, lng],
    [80, lng]
  ]);

  const equatorLine = [
    [0, -180],
    [0, 180]
  ];

  // Sample Beacons & Sensors Data
  const beacons = [
    {
      id: 'BEACON-01',
      name: 'Gangtok Ridge Station #01',
      lat: 27.335,
      lng: 88.618,
      riskLevel: 'CRITICAL',
      score: 87,
      rainfall: 168.4,
      soilMoisture: '92%',
      slope: '38°',
      loRaStatus: 'ONLINE',
      battery: '94% (Solar)',
      village: 'Upper Gangtok Sector A'
    },
    {
      id: 'BEACON-02',
      name: 'Deorali Slope Station #02',
      lat: 27.321,
      lng: 88.605,
      riskLevel: 'HIGH',
      score: 72,
      rainfall: 122.1,
      soilMoisture: '79%',
      slope: '31°',
      loRaStatus: 'ONLINE',
      battery: '88% (Solar)',
      village: 'Deorali Valley'
    },
    {
      id: 'BEACON-03',
      name: 'Burtuk Safe Hill Station #03',
      lat: 27.350,
      lng: 88.628,
      riskLevel: 'SAFE',
      score: 18,
      rainfall: 42.0,
      soilMoisture: '45%',
      slope: '14°',
      loRaStatus: 'ONLINE',
      battery: '99% (Solar)',
      village: 'Burtuk Relief Base'
    },
    {
      id: 'BEACON-04',
      name: 'Tadong Riverbank Station #04',
      lat: 27.308,
      lng: 88.599,
      riskLevel: 'HIGH',
      score: 68,
      rainfall: 110.5,
      soilMoisture: '81%',
      slope: '28°',
      loRaStatus: 'ONLINE',
      battery: '91% (Solar)',
      village: 'Tadong Basti'
    }
  ];

  // Emergency Shelters
  const shelters = [
    { id: 'SH-01', name: 'Community Stadium Safe Shelter', lat: 27.342, lng: 88.625, capacity: '850 Persons', status: 'READY' },
    { id: 'SH-02', name: 'Army Camp Disaster Relief Base', lat: 27.355, lng: 88.632, capacity: '1,500 Persons', status: 'READY' },
  ];

  // High Hazard Zone Polygons (Landslide Danger Areas)
  const hazardPolygonRed = [
    [27.332, 88.612],
    [27.339, 88.615],
    [27.337, 88.622],
    [27.330, 88.618]
  ];

  const hazardPolygonOrange = [
    [27.318, 88.601],
    [27.325, 88.608],
    [27.322, 88.614],
    [27.314, 88.606]
  ];

  // SafePath Evacuation Line
  const safePathPolyline = [
    [27.335, 88.618],
    [27.338, 88.621],
    [27.342, 88.625]
  ];

  return (
    <div className={`w-full h-full flex flex-col relative rounded-xl overflow-hidden border border-white/10 glass-panel ${
      mapTile === 'cyan-mint' ? 'cyan-mint-container' : ''
    }`}>
      
      {/* SVG Color Filter Definition for Cyan Ocean (#3EC1D3) + Mint Land (#CCECD6) */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="cyan-mint-filter" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="
              -0.35  0.30  0.75  0  0.15
               0.10  0.75  0.10  0  0.72
               0.05  0.25  0.65  0  0.78
               0     0     0     1  0
            "/>
          </filter>
        </defs>
      </svg>

      {/* Map Control Bar Overlay */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap items-center gap-2 bg-slate-900/90 p-2 rounded-xl backdrop-blur-md border border-white/10 shadow-2xl">
        
        {/* View Mode Toggle (World View vs Regional GIS) */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-2">
          <button
            onClick={() => {
              setViewMode('world');
              setMapTile('cyan-mint');
              setSelectedNode(null);
            }}
            className={`px-3 py-1 text-xs rounded-lg flex items-center gap-1.5 font-bold transition-all ${
              viewMode === 'world' 
                ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20' 
                : 'text-slate-300 hover:text-white bg-slate-800/80'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Cyan-Mint World Map
          </button>

          <button
            onClick={() => {
              setViewMode('regional');
            }}
            className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'regional' 
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
            Regional GIS Zoom
          </button>
        </div>

        {/* Tile Style Selector */}
        <div className="flex items-center gap-1 border-r border-white/10 pr-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <button
            onClick={() => setMapTile('cyan-mint')}
            className={`px-2 py-1 text-xs rounded-lg transition-all ${
              mapTile === 'cyan-mint' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mint Cyan
          </button>
          <button
            onClick={() => setMapTile('dark')}
            className={`px-2 py-1 text-xs rounded-lg transition-all ${
              mapTile === 'dark' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Street Map
          </button>
          <button
            onClick={() => setMapTile('satellite')}
            className={`px-2 py-1 text-xs rounded-lg transition-all ${
              mapTile === 'satellite' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setMapTile('topo')}
            className={`px-2 py-1 text-xs rounded-lg transition-all ${
              mapTile === 'topo' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            DEM
          </button>
        </div>

        {/* Overlay Toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowHazardZones(!showHazardZones)}
            className={`px-2 py-1 text-xs rounded-lg flex items-center gap-1 border transition-all ${
              showHazardZones 
                ? 'bg-red-500/20 text-red-300 border-red-500/40' 
                : 'bg-slate-800 text-slate-400 border-transparent opacity-60'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-red-400" />
            Hazard Polygons
          </button>

          <button
            onClick={() => setShowBeacons(!showBeacons)}
            className={`px-2 py-1 text-xs rounded-lg flex items-center gap-1 border transition-all ${
              showBeacons 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-slate-800 text-slate-400 border-transparent opacity-60'
            }`}
          >
            <Radio className="w-3 h-3 text-cyan-400" />
            IoT Nodes
          </button>

          <button
            onClick={() => setShowWorldLabels(!showWorldLabels)}
            className={`px-2 py-1 text-xs rounded-lg flex items-center gap-1 border transition-all ${
              showWorldLabels 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-slate-800 text-slate-400 border-transparent opacity-60'
            }`}
          >
            Country Labels
          </button>
        </div>

      </div>

      {/* Map Legend & Style Banner */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-slate-900/90 p-3 rounded-xl backdrop-blur-md border border-white/10 shadow-2xl text-xs space-y-1.5 hidden md:block">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-1 mb-1">
          <span className="font-bold text-cyan-300 text-[11px] uppercase tracking-wider">Map Style: Cyan-Mint World</span>
          <span className="badge badge-safe text-[9px]">ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
          <span className="text-slate-300">Ocean: Vibrant Aqua Cyan (#3EC1D3)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-300"></span>
          <span className="text-slate-300">Landmass: Mint Green (#CCECD6)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 pulse-critical"></span>
          <span className="text-slate-300">IoT Critical Node / Landslide Danger</span>
        </div>
      </div>

      {/* Leaflet Map Render */}
      <div className="w-full h-full min-h-[450px]">
        <MapContainer 
          center={currentCenter} 
          zoom={currentZoom} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%', backgroundColor: mapTile === 'cyan-mint' ? '#3ec1d3' : '#0d131f' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={tileUrls[mapTile]}
            className={mapTile === 'cyan-mint' ? 'cyan-mint-tiles' : ''}
          />

          <MapRecenter center={currentCenter} zoom={currentZoom} />

          {/* Meridian Grid Lines (World View) */}
          {viewMode === 'world' && meridianLines.map((line, idx) => (
            <Polyline
              key={`meridian-${idx}`}
              positions={line}
              pathOptions={{ color: 'rgba(15, 23, 42, 0.4)', weight: 1.2, dashArray: '4, 4' }}
            />
          ))}

          {/* Equator Line */}
          {viewMode === 'world' && (
            <Polyline
              positions={equatorLine}
              pathOptions={{ color: 'rgba(15, 23, 42, 0.3)', weight: 1, dashArray: '6, 6' }}
            />
          )}

          {/* World Ocean Labels */}
          {viewMode === 'world' && showWorldLabels && oceanLabels.map((ocean, idx) => (
            <Marker
              key={`ocean-${idx}`}
              position={ocean.pos}
              icon={createLabelIcon(ocean.name, 'ocean')}
            />
          ))}

          {/* World Country Labels (Matches reference image) */}
          {viewMode === 'world' && showWorldLabels && countryLabels.map((country, idx) => (
            <Marker
              key={`country-${idx}`}
              position={country.pos}
              icon={createLabelIcon(country.name, 'country')}
            />
          ))}

          {/* Landslide Hazard Risk Polygons */}
          {showHazardZones && (
            <>
              <Polygon 
                positions={hazardPolygonRed} 
                pathOptions={{ color: '#ff3b5c', fillColor: '#ff3b5c', fillOpacity: 0.4, weight: 2, dashArray: '4' }} 
              >
                <Popup>
                  <div className="p-1 space-y-1">
                    <span className="badge badge-critical">CRITICAL LANDSLIDE ZONE #1</span>
                    <p className="text-xs text-slate-300">High soil moisture saturation & steep slope. Active mudslide probability 87%.</p>
                  </div>
                </Popup>
              </Polygon>

              <Polygon 
                positions={hazardPolygonOrange} 
                pathOptions={{ color: '#ff9f1c', fillColor: '#ff9f1c', fillOpacity: 0.3, weight: 2 }} 
              >
                <Popup>
                  <div className="p-1 space-y-1">
                    <span className="badge badge-warning">HIGH HAZARD SLOPE ZONE #2</span>
                    <p className="text-xs text-slate-300">Rainfall saturation index elevated. Monitoring via LoRa Beacon #02.</p>
                  </div>
                </Popup>
              </Polygon>
            </>
          )}

          {/* SafePath Line */}
          {showEvacuationRoutes && (
            <Polyline
              positions={safePathPolyline}
              pathOptions={{ color: '#06d6a0', weight: 4, opacity: 0.85, dashArray: '8, 8' }}
            >
              <Popup>
                <div className="p-1">
                  <span className="badge badge-safe">SAFEPATH AI ACTIVE ROUTE</span>
                  <p className="text-xs text-slate-300 mt-1">Calculated safe corridor avoiding critical landslide zone #1.</p>
                </div>
              </Popup>
            </Polyline>
          )}

          {/* IoT Beacons Markers */}
          {showBeacons && beacons.map((beacon) => {
            const icon = beacon.riskLevel === 'CRITICAL' ? iconRed : beacon.riskLevel === 'HIGH' ? iconOrange : iconGreen;
            return (
              <Marker 
                key={beacon.id} 
                position={[beacon.lat, beacon.lng]} 
                icon={icon}
                eventHandlers={{
                  click: () => {
                    setSelectedNode(beacon);
                    setViewMode('regional');
                  }
                }}
              >
                <Popup>
                  <div className="p-2 space-y-2 min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white font-heading">{beacon.name}</span>
                      <span className={`badge ${
                        beacon.riskLevel === 'CRITICAL' ? 'badge-critical' : beacon.riskLevel === 'HIGH' ? 'badge-warning' : 'badge-safe'
                      }`}>
                        {beacon.riskLevel}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-300 border-t border-b border-white/10 py-1.5">
                      <div className="flex justify-between">
                        <span>AI Risk Score:</span>
                        <span className="font-bold text-cyan-300">{beacon.score}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>24h Rainfall:</span>
                        <span className="font-bold">{beacon.rainfall} mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Soil Saturation:</span>
                        <span className="font-bold text-amber-300">{beacon.soilMoisture}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Slope Incline:</span>
                        <span className="font-bold">{beacon.slope}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>Mesh Status: <strong className="text-emerald-400">{beacon.loRaStatus}</strong></span>
                      <span>Power: {beacon.battery}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Shelters Markers */}
          {showShelters && shelters.map((shelter) => (
            <CircleMarker 
              key={shelter.id}
              center={[shelter.lat, shelter.lng]}
              radius={8}
              pathOptions={{ fillColor: '#3b82f6', color: '#60a5fa', weight: 2, fillOpacity: 0.9 }}
            >
              <Popup>
                <div className="p-1 space-y-1">
                  <span className="badge badge-cyan flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> EMERGENCY SHELTER
                  </span>
                  <div className="font-bold text-white text-sm mt-1">{shelter.name}</div>
                  <div className="text-xs text-slate-300">Capacity: {shelter.capacity}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        </MapContainer>
      </div>

    </div>
  );
}
