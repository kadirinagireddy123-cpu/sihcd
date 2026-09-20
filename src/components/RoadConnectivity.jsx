import React, { useState, useEffect } from 'react';
import {
  Construction, CheckCircle2, AlertTriangle, XCircle, Clock,
  MapPin, Truck, Radio, TrendingUp, RefreshCw, ChevronRight,
  Navigation, Zap, Shield, Activity
} from 'lucide-react';

const ROAD_SEGMENTS = [
  {
    id: 'NH10-A', name: 'NH-10: Siliguri – Rangpo', length: '98 km', type: 'National Highway',
    status: 'BLOCKED', risk: 92, blockage: 'Landslide debris at km 34, 2m height, full blockage',
    lastUpdate: '22 mins ago', alternateRoute: 'Available via Kalimpong bypass', vehicles: 47,
    districts: ['East Sikkim'], priority: 'CRITICAL'
  },
  {
    id: 'NH717-B', name: 'NH-717: Gangtok Ring Road', length: '42 km', type: 'State Highway',
    status: 'CAUTION', risk: 58, blockage: 'Partial debris near Tadong Slope. 1 lane open.',
    lastUpdate: '1h ago', alternateRoute: 'None available', vehicles: 23,
    districts: ['Gangtok Urban'], priority: 'HIGH'
  },
  {
    id: 'SH1-C', name: 'SH-1: Gangtok – Mangan', length: '65 km', type: 'State Highway',
    status: 'CLEAR', risk: 28, blockage: 'No active blockage. Monitor landslide zone km 18.',
    lastUpdate: '5 mins ago', alternateRoute: 'N/A', vehicles: 12,
    districts: ['North Sikkim'], priority: 'MODERATE'
  },
  {
    id: 'MDR-Burtuk', name: 'MDR: Burtuk Village Road', length: '8 km', type: 'Village Access Road',
    status: 'BLOCKED', risk: 88, blockage: 'Flash flood washed road at river crossing. Completely severed.',
    lastUpdate: '45 mins ago', alternateRoute: 'No alternate. Village isolated.', vehicles: 0,
    districts: ['Burtuk Panchayat'], priority: 'CRITICAL'
  },
  {
    id: 'SH3-Singtam', name: 'SH-3: Singtam – Jorethang', length: '54 km', type: 'State Highway',
    status: 'CAUTION', risk: 45, blockage: 'Minor rockfall reported. Clearance underway.',
    lastUpdate: '30 mins ago', alternateRoute: 'Via Namchi diversion', vehicles: 8,
    districts: ['South Sikkim'], priority: 'HIGH'
  },
  {
    id: 'NH27-D', name: 'NH-27: Siliguri – Guwahati', length: '440 km', type: 'National Highway',
    status: 'CLEAR', risk: 18, blockage: 'No active blockage. Monsoon monitoring active.',
    lastUpdate: '10 mins ago', alternateRoute: 'N/A', vehicles: 156,
    districts: ['Assam', 'West Bengal'], priority: 'LOW'
  },
  {
    id: 'MDR-Ranipool', name: 'MDR: Ranipool – Khamdong', length: '22 km', type: 'Mountain District Road',
    status: 'BLOCKED', risk: 76, blockage: 'Tree falls + slope instability. Road team deployed.',
    lastUpdate: '18 mins ago', alternateRoute: 'Under evaluation', vehicles: 3,
    districts: ['East Sikkim'], priority: 'HIGH'
  },
  {
    id: 'SH5-Lachung', name: 'SH-5: Mangan – Lachung', length: '55 km', type: 'State Highway',
    status: 'CLEAR', risk: 22, blockage: 'No current blockage. Remote monitoring only.',
    lastUpdate: '2h ago', alternateRoute: 'N/A', vehicles: 5,
    districts: ['North Sikkim'], priority: 'LOW'
  },
];

const STATUS_CONFIG = {
  BLOCKED: {
    label: 'BLOCKED',
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/40',
    badgeClass: 'badge-critical',
    dot: 'bg-red-500',
    barColor: '#ff3b5c',
  },
  CAUTION: {
    label: 'CAUTION',
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    badgeClass: 'badge-warning',
    dot: 'bg-amber-500',
    barColor: '#ff9f1c',
  },
  CLEAR: {
    label: 'CLEAR',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    badgeClass: 'badge-safe',
    dot: 'bg-emerald-400',
    barColor: '#06d6a0',
  },
};

const DISPATCH_LOG = [
  { time: '18:47', action: 'SDRF team dispatched to NH-10 km 34 blockage. ETA 25 mins.', type: 'dispatch' },
  { time: '18:32', action: 'Alert SMS sent to 847 residents near MDR Burtuk Village road.', type: 'alert' },
  { time: '18:10', action: 'Traffic rerouted via Kalimpong bypass for NH-10 vehicles.', type: 'route' },
  { time: '17:55', action: 'NDRF clearance team requested for Ranipool MDR road.', type: 'dispatch' },
  { time: '17:40', action: 'Helicopter recon flight approved for isolated Burtuk village.', type: 'recon' },
  { time: '17:22', action: 'District Collector Gangtok briefed on NH-717 partial blockage.', type: 'brief' },
];

const LOG_COLORS = {
  dispatch: 'text-red-400 bg-red-500/10',
  alert: 'text-amber-400 bg-amber-500/10',
  route: 'text-blue-400 bg-blue-500/10',
  recon: 'text-purple-400 bg-purple-500/10',
  brief: 'text-cyan-400 bg-cyan-500/10',
};

export default function RoadConnectivity() {
  const [selectedRoad, setSelectedRoad] = useState(ROAD_SEGMENTS[0]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  const blocked = ROAD_SEGMENTS.filter(r => r.status === 'BLOCKED').length;
  const caution = ROAD_SEGMENTS.filter(r => r.status === 'CAUTION').length;
  const clear = ROAD_SEGMENTS.filter(r => r.status === 'CLEAR').length;
  const totalVehicles = ROAD_SEGMENTS.reduce((sum, r) => sum + r.vehicles, 0);

  const filtered = filterStatus === 'ALL'
    ? ROAD_SEGMENTS
    : ROAD_SEGMENTS.filter(r => r.status === filterStatus);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="glass-panel p-6 border-l-4 border-l-orange-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Construction className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-bold text-white font-heading">
              Road Connectivity Status Dashboard
            </h2>
            <span className="badge badge-warning">Requirement (f)</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Live road network monitoring across NER — blockages, alternate routes, stranded vehicles & SDRF dispatch log.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${tick % 2 === 0 ? 'animate-spin' : ''}`} />
          Polling: 30s interval
        </div>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 text-center space-y-1 border border-red-500/20">
          <div className="text-3xl font-extrabold text-red-400 font-mono">{blocked}</div>
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Roads Blocked</div>
          <div className="text-[10px] text-red-400 flex items-center justify-center gap-1">
            <XCircle className="w-3 h-3" /> Full Blockage
          </div>
        </div>
        <div className="glass-panel p-4 text-center space-y-1 border border-amber-500/20">
          <div className="text-3xl font-extrabold text-amber-400 font-mono">{caution}</div>
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Caution Zones</div>
          <div className="text-[10px] text-amber-400 flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Partial / Slow
          </div>
        </div>
        <div className="glass-panel p-4 text-center space-y-1 border border-emerald-500/20">
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">{clear}</div>
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Roads Clear</div>
          <div className="text-[10px] text-emerald-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Normal Flow
          </div>
        </div>
        <div className="glass-panel p-4 text-center space-y-1 border border-cyan-500/20">
          <div className="text-3xl font-extrabold text-cyan-400 font-mono">{totalVehicles}</div>
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Vehicles Tracked</div>
          <div className="text-[10px] text-cyan-400 flex items-center justify-center gap-1">
            <Truck className="w-3 h-3" /> In Zone
          </div>
        </div>
      </div>

      {/* Main Grid: Road List + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Road Segments List */}
        <div className="lg:col-span-2 glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <Navigation className="w-4 h-4 text-orange-400" /> NER Road Network Status
            </h3>
            <div className="flex gap-1.5">
              {['ALL', 'BLOCKED', 'CAUTION', 'CLEAR'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    filterStatus === s
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filtered.map(road => {
              const cfg = STATUS_CONFIG[road.status];
              const StatusIcon = cfg.icon;
              const isSelected = selectedRoad?.id === road.id;
              return (
                <div
                  key={road.id}
                  onClick={() => setSelectedRoad(road)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? `${cfg.bg} ${cfg.border}`
                      : 'bg-slate-900/50 border-white/5 hover:border-white/15 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${cfg.dot} ${road.status === 'BLOCKED' ? 'animate-pulse' : ''}`} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white">{road.name}</span>
                          <span className={`badge text-[10px] ${cfg.badgeClass}`}>{road.status}</span>
                          {road.priority === 'CRITICAL' && (
                            <span className="badge badge-critical text-[10px] pulse-critical">PRIORITY</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{road.type} · {road.length}</div>
                        <div className="text-[11px] text-slate-300 mt-1">{road.blockage}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <div className={`text-sm font-bold font-mono ${cfg.color}`}>{road.risk}%</div>
                      <div className="text-[10px] text-slate-500">risk</div>
                    </div>
                  </div>

                  {/* Risk bar */}
                  <div className="mt-3 ml-5">
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${road.risk}%`, backgroundColor: cfg.barColor }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 ml-5 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> {road.vehicles} vehicles</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {road.lastUpdate}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90 text-orange-400' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Detail + Dispatch Log */}
        <div className="space-y-4">

          {/* Road Detail Card */}
          {selectedRoad && (() => {
            const cfg = STATUS_CONFIG[selectedRoad.status];
            const StatusIcon = cfg.icon;
            return (
              <div className={`glass-panel p-5 space-y-4 border ${cfg.border}`}>
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-5 h-5 ${cfg.color}`} />
                  <h4 className="text-sm font-bold text-white font-heading">Road Detail Inspector</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Road Segment</div>
                    <div className="text-white font-bold">{selectedRoad.name}</div>
                    <div className="text-slate-400">{selectedRoad.type}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900/80 p-2.5 rounded-lg">
                      <div className="text-slate-500 text-[10px]">Length</div>
                      <div className="text-white font-bold font-mono">{selectedRoad.length}</div>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-lg">
                      <div className="text-slate-500 text-[10px]">Risk Score</div>
                      <div className={`font-bold font-mono ${cfg.color}`}>{selectedRoad.risk}%</div>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-lg">
                      <div className="text-slate-500 text-[10px]">Vehicles in Zone</div>
                      <div className="text-cyan-300 font-bold font-mono">{selectedRoad.vehicles}</div>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-lg">
                      <div className="text-slate-500 text-[10px]">Last Updated</div>
                      <div className="text-slate-300 font-mono">{selectedRoad.lastUpdate}</div>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-lg space-y-1">
                    <div className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Incident Detail</div>
                    <p className="text-slate-200 leading-relaxed">{selectedRoad.blockage}</p>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-lg space-y-1">
                    <div className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Alternate Route</div>
                    <p className={`font-semibold ${selectedRoad.alternateRoute.includes('None') || selectedRoad.alternateRoute.includes('No') ? 'text-red-400' : 'text-emerald-300'}`}>
                      {selectedRoad.alternateRoute}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-lg space-y-1">
                    <div className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Districts Affected</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedRoad.districts.map(d => (
                        <span key={d} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[10px] border border-indigo-500/20">{d}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="btn-primary w-full justify-center text-xs py-2.5">
                  <Radio className="w-4 h-4" /> Dispatch SDRF to This Road
                </button>
              </div>
            );
          })()}

          {/* SDRF Action Log */}
          <div className="glass-panel p-5 space-y-3">
            <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> SDRF Action Log
            </h4>
            <div className="space-y-2">
              {DISPATCH_LOG.map((log, i) => (
                <div key={i} className="flex items-start gap-2.5 text-[11px]">
                  <span className="font-mono text-slate-500 shrink-0 pt-0.5">{log.time}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 mt-0.5 ${LOG_COLORS[log.type]}`}>
                    {log.type}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{log.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
