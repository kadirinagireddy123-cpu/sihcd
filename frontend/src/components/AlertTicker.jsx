import React from 'react';
import { AlertCircle, Zap, ShieldCheck, Radio } from 'lucide-react';

export default function AlertTicker({ emergencyAlertActive, rssi = -78, meshPing = 14 }) {
  return (
    <div className={`w-full text-xs py-2 px-4 border-b font-mono transition-colors ${
      emergencyAlertActive 
        ? 'bg-red-950/90 border-red-500/50 text-red-200' 
        : 'bg-slate-900/80 border-white/5 text-slate-300'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 shrink-0">
          <span className={`flex h-2.5 w-2.5 rounded-full ${
            emergencyAlertActive ? 'bg-red-500 animate-ping' : 'bg-emerald-400'
          }`}></span>
          <span className="font-semibold uppercase tracking-wider text-[11px] text-cyan-400">
            LIVE BROADCAST:
          </span>
        </div>

        <div className="overflow-hidden relative flex-1">
          <div className="whitespace-nowrap animate-marquee flex items-center gap-8">
            <span className="inline-flex items-center gap-2 bg-red-900/60 border border-red-500/50 px-3 py-0.5 rounded-full text-red-200 font-bold">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 animate-pulse inline" />
              🔴 BREAKING — AUG 26, 2026 | NEPAL-TIBET GLACIER COLLAPSE: Devastating flash floods triggered by glacier collapse on the Nepal-Tibet border have killed at least 626 people in Nepal, with nearly 2,000 reported missing. Massive water, ice &amp; debris wave traveled down the Bhote Koshi River valley, destroying villages, Gyirong Port trade link, and critical infrastructure across Rasuwa &amp; Nuwakot districts.
            </span>
            <span className="inline-flex items-center gap-1.5 text-amber-300">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 inline" />
              [IMD WARNING]: Heavy Monsoonal Downpour (145mm/24h) forecasted across Sikkim &amp; Meghalaya slopes.
            </span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
              [GEOSHIELD BEACON #4 - GANGTOK]: Soil saturation reached 88% — LoRa local sirens standby mode active.
            </span>
            <span className="inline-flex items-center gap-1.5 text-cyan-300">
              <Radio className="w-3.5 h-3.5 text-cyan-400 inline" />
              [SAFEPATH AI]: Route 3 (North Sector Highway) clear for emergency responder convoy.
            </span>
            <span className="inline-flex items-center gap-1.5 text-purple-300">
              <Zap className="w-3.5 h-3.5 text-purple-400 inline" />
              [YOLOv11 DRONE FLEET]: Patrol Drone #02 live thermal scanner active over slope coordinates 27.33°N, 88.61°E.
            </span>
          </div>
        </div>

        <div className="shrink-0 text-[10px] text-slate-400 hidden sm:block">
          SDRF MESH RSSI: <span className="text-emerald-400 font-bold">{rssi} dBm</span> | LATENCY: <span className="text-cyan-400 font-bold">{meshPing} ms</span>
        </div>

      </div>
    </div>
  );
}
