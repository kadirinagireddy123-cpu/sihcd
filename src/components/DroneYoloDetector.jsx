import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Video, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Crosshair, 
  ShieldAlert, 
  Cpu,
  Wifi,
  Zap
} from 'lucide-react';

export default function DroneYoloDetector() {
  const [thermalMode, setThermalMode] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState(null);
  const [frameCount, setFrameCount] = useState(1480);
  const [scanPos, setScanPos] = useState(0);
  const [signalStrength, setSignalStrength] = useState(87);

  // Live frame counter — ticks at ~10fps
  useEffect(() => {
    const id = setInterval(() => {
      setFrameCount(f => f + 1);
      setScanPos(p => (p + 2) % 100);
      setSignalStrength(s => Math.max(78, Math.min(99, s + (Math.random() > 0.5 ? 1 : -1))));
    }, 100);
    return () => clearInterval(id);
  }, []);

  // Simulated YOLOv11 Detections
  const detections = [
    { id: 1, label: 'SOS SURVIVOR SIGNAL', confidence: '94.2%', box: { top: '35%', left: '42%', width: '14%', height: '18%' }, type: 'SURVIVOR', color: 'border-red-500 bg-red-500/20 text-red-300' },
    { id: 2, label: 'BLOCKED ROAD / DEBRIS', confidence: '98.6%', box: { top: '60%', left: '15%', width: '28%', height: '22%' }, type: 'DEBRIS', color: 'border-amber-500 bg-amber-500/20 text-amber-300' },
    { id: 3, label: 'HELICOPTER SAFE LZ', confidence: '91.8%', box: { top: '20%', left: '72%', width: '20%', height: '25%' }, type: 'SAFE_LZ', color: 'border-emerald-400 bg-emerald-400/20 text-emerald-300' },
    { id: 4, label: 'UNSTABLE STRUCTURE', confidence: '89.4%', box: { top: '15%', left: '18%', width: '16%', height: '20%' }, type: 'STRUCTURE', color: 'border-purple-400 bg-purple-400/20 text-purple-300' },
  ];

  const handleDispatchRescue = () => {
    setDispatchStatus('DISPATCHED');
    setTimeout(() => setDispatchStatus(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-purple-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-purple-400 animate-pulse" />
            <h2 className="text-xl font-bold text-white font-heading">
              YOLOv11 Aerial Drone Rescue Intelligence
            </h2>
            <span className="badge badge-cyan">Patrol Drone #02 Feed</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Real-time optical & thermal satellite/drone computer vision identifying survivors, debris blockages, and safe landing zones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setThermalMode(!thermalMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              thermalMode 
                ? 'bg-purple-500/30 text-purple-200 border-purple-400' 
                : 'bg-slate-800 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {thermalMode ? 'THERMAL INFRARED (ON)' : 'RGB OPTICAL MODE'}
          </button>
        </div>
      </div>

      {/* Grid: Video Scanner Feed + Detection Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Drone Feed Viewport */}
        <div className="lg:col-span-2 glass-panel p-4 space-y-3 relative overflow-hidden border border-white/10">
          
          {/* Top Camera Status Header */}
          <div className="flex items-center justify-between text-xs px-2 py-1 bg-slate-900/80 rounded-lg border border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="font-mono text-slate-300 font-bold">REC ● DRONE CAM 02</span>
            </div>
            <div className="text-slate-400 font-mono text-[11px] flex items-center gap-3">
              <span>ALT: <strong className="text-cyan-400">120m</strong></span>
              <span>SPD: <strong className="text-emerald-400">14 km/h</strong></span>
              <span>BAT: <strong className="text-amber-400">78%</strong></span>
              <span className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-cyan-400" />
                <strong className="text-cyan-400">{signalStrength}%</strong>
              </span>
            </div>
          </div>

          {/* Canvas Simulated Viewport */}
          <div className={`relative w-full h-[380px] rounded-xl overflow-hidden border border-white/10 transition-colors ${
            thermalMode ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-amber-950' : 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900'
          }`}>
            
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            {/* Animated Scan Line */}
            <div
              className="absolute left-0 right-0 h-[2px] pointer-events-none z-10 transition-none"
              style={{
                top: `${scanPos}%`,
                background: thermalMode
                  ? 'linear-gradient(90deg, transparent, rgba(251,191,36,0.6), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(0,245,212,0.5), transparent)',
                boxShadow: thermalMode ? '0 0 8px rgba(251,191,36,0.4)' : '0 0 8px rgba(0,245,212,0.3)',
              }}
            />

            {/* Simulated Mountain Debris & Terrain Graphics */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 800 400" className="w-full h-full">
                <path d="M50 350 Q 200 150 400 300 T 750 380" fill="none" stroke={thermalMode ? '#f43f5e' : '#334155'} strokeWidth="4" />
                <path d="M100 200 Q 300 80 500 220 T 700 250" fill="none" stroke={thermalMode ? '#fbbf24' : '#475569'} strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>

            {/* YOLOv11 Bounding Boxes Overlay */}
            {detections.map((det) => (
              <div
                key={det.id}
                style={{
                  top: det.box.top,
                  left: det.box.left,
                  width: det.box.width,
                  height: det.box.height,
                }}
                className={`absolute border-2 rounded-md ${det.color} transition-all duration-300 flex flex-col justify-between p-1.5 shadow-lg`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold bg-slate-950/80 px-1.5 py-0.5 rounded">
                  <span>{det.label}</span>
                  <span className="text-cyan-300">{det.confidence}</span>
                </div>
                <div className="text-[9px] font-mono text-slate-300 self-end bg-slate-950/60 px-1 rounded">
                  YOLOv11-CV
                </div>
              </div>
            ))}

            {/* HUD Target Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Crosshair className="w-16 h-16 text-cyan-400/40 animate-pulse" />
            </div>

            {/* Corner HUD brackets */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none rounded-tl" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none rounded-tr" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-cyan-400/60 pointer-events-none rounded-bl" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-cyan-400/60 pointer-events-none rounded-br" />

            {/* Bottom-left frame counter */}
            <div className="absolute bottom-3 left-10 text-[10px] font-mono text-cyan-400/70 pointer-events-none">
              FRAME #{frameCount} · {thermalMode ? 'LWIR 8-14µm' : 'RGB 4K'}
            </div>

            {/* Bottom-right GPS */}
            <div className="absolute bottom-3 right-10 text-[10px] font-mono text-cyan-400/70 pointer-events-none">
              27.335°N 88.618°E
            </div>
          </div>

          {/* Bottom Bar: Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 font-mono">
              4 Targets Detected · <span className="text-red-400 font-bold">1 Survivor Priority</span>
            </span>

            <button
              onClick={handleDispatchRescue}
              className={`btn-danger text-xs py-2 ${dispatchStatus ? 'bg-emerald-600 border-emerald-400' : ''}`}
            >
              {dispatchStatus ? (
                <><CheckCircle2 className="w-4 h-4" /> SDRF TEAM DISPATCHED!</>
              ) : (
                <><Send className="w-4 h-4" /> DISPATCH SDRF RESCUE TEAM</>
              )}
            </button>
          </div>

        </div>

        {/* AI Detection Log & Target Queue */}
        <div className="glass-panel p-6 space-y-5 flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2 font-heading">
                <Cpu className="w-4 h-4 text-purple-400" /> YOLOv11 Inspection Telemetry
              </h3>
              <span className="badge badge-purple text-[10px]">4 Targets Identified</span>
            </div>

            {/* List of Objects */}
            <div className="space-y-3 mt-4">
              {detections.map((d) => (
                <div key={d.id} className="bg-slate-900/80 p-3 rounded-xl border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      {d.type === 'SURVIVOR' && <ShieldAlert className="w-3.5 h-3.5 text-red-400" />}
                      {d.type === 'DEBRIS' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                      {d.type === 'SAFE_LZ' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {d.type === 'STRUCTURE' && <Eye className="w-3.5 h-3.5 text-purple-400" />}
                      {d.label}
                    </span>
                    <span className="font-mono text-cyan-300 font-bold">{d.confidence}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono flex justify-between">
                    <span>Priority: <strong className={d.type === 'SURVIVOR' ? 'text-red-400' : 'text-slate-300'}>{d.type === 'SURVIVOR' ? 'URGENT RESCUE' : 'MONITOR'}</strong></span>
                    <span>Frame #{frameCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SDRF Dispatch Status */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="text-xs text-slate-300 flex justify-between">
              <span>SDRF Unit 4 Readiness:</span>
              <span className="text-emerald-400 font-bold font-mono">STANDBY / READY</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Auto-sync with Govt District Collector Dashboard via FastAPI relay.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
