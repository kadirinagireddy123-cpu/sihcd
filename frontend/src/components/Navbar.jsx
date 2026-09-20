import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Radio, 
  MapPin, 
  Eye, 
  FileText, 
  Wifi, 
  Cpu, 
  AlertTriangle,
  Clock,
  Camera,
  Construction,
  Cloud
} from 'lucide-react';

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const istTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const hh = String(istTime.getHours()).padStart(2, '0');
  const mm = String(istTime.getMinutes()).padStart(2, '0');
  const ss = String(istTime.getSeconds()).padStart(2, '0');
  return (
    <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 text-xs font-mono">
      <Clock className="w-3.5 h-3.5 text-cyan-400" />
      <span className="text-cyan-300 font-bold">{hh}:{mm}:{ss}</span>
      <span className="text-slate-500">IST</span>
    </div>
  );
}

export default function Navbar({ activeTab, setActiveTab, emergencyAlertActive, toggleEmergencyAlert, openSIHModal }) {
  const tabs = [
    { id: 'dashboard', label: 'Command Center', icon: Activity },
    { id: 'risk-engine', label: 'AI Risk Engine', icon: Cpu },
    { id: 'beacons', label: 'GeoShield Beacons', icon: Radio },
    { id: 'safepath', label: 'SafePath Evacuation', icon: MapPin },
    { id: 'drone-yolo', label: 'Drone Rescue AI', icon: Eye },
    { id: 'field-reporter', label: 'Field Reporter', icon: Camera, badge: 'NEW' },
    { id: 'road', label: 'Road Connectivity', icon: Construction, badge: 'NEW' },
    { id: 'weather', label: 'IMD Forecast', icon: Cloud, badge: 'NEW' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0a0e17]/90 backdrop-blur-md border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & SIH Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <ShieldAlert className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight font-heading">
                GeoShield <span className="text-cyan-400">AI</span>
              </h1>
              <span className="badge badge-cyan text-[10px]">SIH26001</span>
              <span className="badge badge-safe text-[10px] flex items-center gap-1">
                <Wifi className="w-3 h-3 animate-pulse" /> LoRa Mesh Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Offline AI Landslide Early Warning & Risk Monitoring (North Eastern Region)
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-white/5 overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap relative ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {tab.label}
                {tab.badge && (
                  <span className="bg-purple-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full leading-none">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Live IST Clock */}
          <LiveClock />

          {/* SIH PPT Button */}
          <button
            onClick={openSIHModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-all"
            title="View SIH 2026 Presentation Details"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>SIH Deck</span>
          </button>

          {/* Emergency Alarm Siren Toggle */}
          <button
            onClick={toggleEmergencyAlert}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              emergencyAlertActive
                ? 'bg-red-600 text-white pulse-critical shadow-lg shadow-red-600/50'
                : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${emergencyAlertActive ? 'animate-bounce' : ''}`} />
            <span>{emergencyAlertActive ? 'SIREN TRIGGERED' : 'TEST SIREN'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
