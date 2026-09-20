import React from 'react';
import { Database, Globe, Satellite, ShieldCheck, ExternalLink, Activity } from 'lucide-react';

export default function DataSourcesPanel() {
  const sources = [
    {
      title: 'IMD Rainfall Dataset',
      agency: 'India Meteorological Department',
      type: 'Real-Time Telemetry',
      detail: 'Gridded 24h precipitation rate & 7-day monsoonal downpour forecast.',
      status: 'SYNCED (10m ago)',
      color: 'border-blue-500/40 text-blue-300'
    },
    {
      title: 'ISRO Bhuvan DEM',
      agency: 'Indian Space Research Organisation',
      type: 'GIS Elevation Model',
      detail: '30m high-resolution elevation raster for shear strain slope calculations.',
      status: 'ACTIVE LAYER',
      color: 'border-emerald-500/40 text-emerald-300'
    },
    {
      title: 'GSI / Bhukosh Inventory',
      agency: 'Geological Survey of India',
      type: 'Historical Landslide Index',
      detail: 'Historical landslide hazard mapping & lithology fault line spatial database.',
      status: 'INDEXED',
      color: 'border-amber-500/40 text-amber-300'
    },
    {
      title: 'Sentinel-1 & Sentinel-2',
      agency: 'Copernicus / European Space Agency',
      type: 'SAR Radar Deformation',
      detail: 'C-band Synthetic Aperture Radar tracking millimeter ground displacement.',
      status: 'ORBIT PASS OK',
      color: 'border-cyan-500/40 text-cyan-300'
    },
  ];

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
            <Database className="w-4 h-4 text-cyan-400" /> Integrated Satellite & Data Sources (SIH Feasibility)
          </h3>
          <p className="text-xs text-slate-400">Open-source & government public datasets powering the GeoShield AI Risk Engine.</p>
        </div>
        <span className="badge badge-cyan">4 APIs Live</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sources.map((src, i) => (
          <div key={i} className={`bg-slate-900/80 p-4 rounded-xl border ${src.color} space-y-2`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">{src.agency}</span>
              <span className="badge badge-safe text-[9px] py-0.5">{src.status}</span>
            </div>
            <h4 className="font-bold text-white text-sm">{src.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{src.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
