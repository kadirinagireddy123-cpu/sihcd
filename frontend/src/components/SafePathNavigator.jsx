import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Footprints, 
  QrCode, 
  Download, 
  CheckCircle2, 
  ChevronRight, 
  Compass 
} from 'lucide-react';

export default function SafePathNavigator() {
  const [startVillage, setStartVillage] = useState('sector-a');
  const [targetShelter, setTargetShelter] = useState('stadium');
  const [routeGenerated, setRouteGenerated] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Village starting locations
  const villageLocations = {
    'sector-a': { name: 'Upper Gangtok Village (Sector A)', risk: 'HIGH (87%)', dist: '1.4 km', time: '18 min walk' },
    'deorali': { name: 'Deorali Valley Colony', risk: 'MODERATE (68%)', dist: '2.1 km', time: '26 min walk' },
    'burtuk': { name: 'Burtuk Hillside Basti', risk: 'LOW (18%)', dist: '0.8 km', time: '10 min walk' },
    'tadong': { name: 'Tadong Riverside Sector', risk: 'HIGH (72%)', dist: '3.2 km', time: '40 min walk' },
  };

  // Shelters
  const shelterLocations = {
    'stadium': { name: 'Community Stadium Relief Shelter (Shelter Alpha)', cap: '850 Persons', status: 'OPEN & SECURE' },
    'army': { name: 'Army Camp Disaster Relief Base (Shelter Beta)', cap: '1,500 Persons', status: 'OPEN & SECURE' },
  };

  // Calculated Safe Path Steps
  const routeSteps = [
    { step: 1, title: 'Depart Start Zone', desc: 'Exit Upper Sector A via North Ridge Footpath. DO NOT use Main Highway (Mudslide reported).', dist: '300m', type: 'SAFE' },
    { step: 2, title: 'Safe Bypass Junction #2', desc: 'Turn East onto Reinforced Concrete Staircase along Burtuk Ridge. Avoid steep dirt slopes.', dist: '550m', type: 'SAFE' },
    { step: 3, title: 'Emergency Checkpoint', desc: 'Pass SDRF Beacon Station #3. Local LoRa node confirming zero slope movement.', dist: '250m', type: 'CHECKPOINT' },
    { step: 4, title: 'Arrive at Relief Shelter', desc: 'Enter Community Stadium Relief Gate Alpha. Medical & food supplies available.', dist: '300m', type: 'SHELTER' },
  ];

  const handleDownloadQR = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-cyan-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-6 h-6 text-cyan-400 animate-pulse" />
            <h2 className="text-xl font-bold text-white font-heading">
              SafePath AI Offline Evacuation Router
            </h2>
            <span className="badge badge-cyan">Dynamic GIS Vector</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Calculates evacuation corridors avoiding high landslide probability zones, mudslide debris, and structural road blockages.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-white/10 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Offline Caching: <strong className="text-emerald-400">AVAILABLE FOR MOBILE</strong></span>
        </div>
      </div>

      {/* Grid: Route Selector + Route Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Origin & Destination Selector */}
        <div className="glass-panel p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" /> Route Configuration
            </h3>
          </div>

          <div className="space-y-4">
            
            {/* Start Village Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-400" /> Select Current Village Location:
              </label>
              <select
                value={startVillage}
                onChange={(e) => setStartVillage(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="sector-a">Upper Gangtok Village (Sector A) [High Risk]</option>
                <option value="deorali">Deorali Valley Colony [Moderate Risk]</option>
                <option value="burtuk">Burtuk Hillside Basti [Low Risk]</option>
                <option value="tadong">Tadong Riverside Sector [High Risk]</option>
              </select>
            </div>

            {/* Target Shelter Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Target Disaster Relief Shelter:
              </label>
              <select
                value={targetShelter}
                onChange={(e) => setTargetShelter(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="stadium">Community Stadium Relief Shelter (Cap: 850)</option>
                <option value="army">Army Camp Relief Base (Cap: 1,500)</option>
              </select>
            </div>

            {/* Selected Route KPI summary */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Hazard Index:</span>
                <span className="font-bold text-red-400">{villageLocations[startVillage].risk}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Walking Dist:</span>
                <span className="font-bold text-cyan-300">{villageLocations[startVillage].dist}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Est. Walk Time:</span>
                <span className="font-bold text-emerald-400">{villageLocations[startVillage].time}</span>
              </div>
            </div>

            {/* Offline QR Route Pass */}
            <div className="p-4 bg-slate-900/90 rounded-xl border border-white/10 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-200">
                <QrCode className="w-4 h-4 text-cyan-400" /> Offline Evacuation Mobile Card
              </div>
              <p className="text-[11px] text-slate-400">
                Download route vector to mobile device for offline GPS navigation without internet.
              </p>
              <button
                onClick={handleDownloadQR}
                className="btn-primary w-full justify-center text-xs py-2"
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-950" /> SAVED TO DEVICE!
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> DOWNLOAD ROUTE QR CARD
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Turn-by-Turn Safe Path Guidance */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                <Footprints className="w-4 h-4 text-emerald-400" /> Turn-by-Turn Safe Evacuation Guidance
              </h3>
              <p className="text-xs text-slate-400">
                SafePath AI dynamically bypasses 2 active landslide points & 1 blocked road segment.
              </p>
            </div>
            <span className="badge badge-safe">Route Verified Safe</span>
          </div>

          {/* Steps Timeline */}
          <div className="space-y-4">
            {routeSteps.map((step) => (
              <div 
                key={step.step} 
                className="bg-slate-900/80 p-4 rounded-xl border border-white/5 flex items-start gap-4 hover:border-cyan-500/30 transition-all"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  step.type === 'SHELTER'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : step.type === 'CHECKPOINT'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-800 text-slate-200 border border-white/10'
                }`}>
                  {step.step}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{step.title}</h4>
                    <span className="text-[11px] font-mono text-cyan-400">{step.dist}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Hazard Avoidance Warning Box */}
          <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-amber-300">AVOID: Main National Highway (NH-10) Sector B</strong>
              Local sensor telemetry indicates high mudflow accumulation across km 14. Keep strictly to the Burtuk Hillside elevated footpath route outlined above.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
