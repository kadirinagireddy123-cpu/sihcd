import React, { useState } from 'react';
import { useTelemetry } from './hooks/useTelemetry';
import Navbar from './components/Navbar';
import AlertTicker from './components/AlertTicker';
import InteractiveMap from './components/InteractiveMap';
import AIRiskEngine from './components/AIRiskEngine';
import GeoShieldBeacon from './components/GeoShieldBeacon';
import SafePathNavigator from './components/SafePathNavigator';
import DroneYoloDetector from './components/DroneYoloDetector';
import DataSourcesPanel from './components/DataSourcesPanel';
import SIHInfoModal from './components/SIHInfoModal';
import FieldReporter from './components/FieldReporter';
import RoadConnectivity from './components/RoadConnectivity';
import WeatherForecast from './components/WeatherForecast';

import { 
  ShieldAlert, 
  Activity, 
  Radio, 
  MapPin, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Users, 
  Droplets, 
  ArrowUpRight 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [emergencyAlertActive, setEmergencyAlertActive] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSIHModalOpen, setIsSIHModalOpen] = useState(false);

  // 🔌 Live telemetry from Node.js WebSocket (ws://localhost:5000/ws)
  const { telemetry, connected: wsConnected } = useTelemetry();

  const toggleEmergencyAlert = () => {
    setEmergencyAlertActive((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0e17] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        emergencyAlertActive={emergencyAlertActive}
        toggleEmergencyAlert={toggleEmergencyAlert}
        openSIHModal={() => setIsSIHModalOpen(true)}
      />

      {/* Live Broadcast Marquee Bar */}
      <AlertTicker emergencyAlertActive={emergencyAlertActive} rssi={telemetry.rssi} meshPing={telemetry.meshPing} />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* VIEW 1: COMMAND CENTER (DASHBOARD) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">

            {/* ★ BREAKING: Nepal-Tibet Glacier Collapse Flash Flood Alert */}
            <div className="glass-panel border border-red-500/60 bg-red-950/30 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden">
              {/* Pulsing glow background */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-transparent pointer-events-none" />
              <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/50">
                <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 bg-red-500/20 border border-red-500/40 px-2 py-0.5 rounded-full">🔴 Breaking — Aug 26, 2026</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">International Disaster Alert</span>
                </div>
                <p className="text-sm font-bold text-red-100 leading-snug">
                  Nepal-Tibet Border Glacier Collapse — Devastating Flash Floods
                </p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  A glacier collapse on the Nepal-Tibet border triggered a massive flash flood wave of water, ice, and debris down the <span className="text-cyan-300 font-semibold">Bhote Koshi River</span> valley. At least <span className="text-red-300 font-bold">626 people killed</span> in Nepal with <span className="text-amber-300 font-bold">~2,000 reported missing</span>. Villages, the <span className="text-cyan-300 font-semibold">Gyirong Port</span> trade link, and critical infrastructure across <span className="text-amber-200 font-semibold">Rasuwa &amp; Nuwakot Districts</span> have been destroyed.
                </p>
              </div>
              <div className="shrink-0 text-right hidden lg:block">
                <div className="text-[10px] text-slate-400 font-mono">CROSS-BORDER RISK</div>
                <div className="text-lg font-extrabold text-red-400 font-mono">CRITICAL</div>
                <div className="text-[10px] text-slate-500 font-mono">Monitor NE Border Zones</div>
              </div>
            </div>

            {/* Top KPI Cards Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="glass-panel p-4 flex items-center gap-3.5 glass-panel-interactive border-l-4 border-l-cyan-400">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Radio className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active LoRa Mesh Nodes</div>
                  <div className="text-xl font-extrabold text-white font-mono flex items-center gap-1.5 mt-0.5">
                    4 / 4 ONLINE
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> 100% Signal Coverage
                  </div>
                </div>
              </div>

              <div className="glass-panel p-4 flex items-center gap-3.5 glass-panel-interactive border-l-4 border-l-red-500">
                <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">High Risk Villages</div>
                  <div className="text-xl font-extrabold text-white font-mono flex items-center gap-1.5 mt-0.5">
                    2 Zones Critical
                  </div>
                  <div className="text-[10px] text-red-400 flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-3 h-3" /> Gangtok Sector A & Tadong
                  </div>
                </div>
              </div>

              <div className="glass-panel p-4 flex items-center gap-3.5 glass-panel-interactive border-l-4 border-l-blue-400">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Droplets className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">24h Monsoonal Rain</div>
                  <div className="text-xl font-extrabold text-white font-mono flex items-center gap-1.5 mt-0.5">
                    {telemetry.rainfall} mm
                  </div>
                  <div className="text-[10px] text-amber-300 flex items-center gap-1 mt-0.5">
                    <ArrowUpRight className="w-3 h-3" /> Soil Moisture Saturation {telemetry.soilMoisture}%
                  </div>
                </div>
              </div>

              <div className="glass-panel p-4 flex items-center gap-3.5 glass-panel-interactive border-l-4 border-l-emerald-400">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Evacuation Readiness</div>
                  <div className="text-xl font-extrabold text-white font-mono flex items-center gap-1.5 mt-0.5">
                    2 Shelters Ready
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Cap: 2,350 Villagers
                  </div>
                </div>
              </div>

            </div>

            {/* Middle Section: GIS Map (Left) + Live Telemetry & SDRF Dispatch Panel (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
              
              {/* GIS Interactive Map (Takes 2 Columns) */}
              <div className="lg:col-span-2 flex flex-col space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                    <Activity className="w-4 h-4 text-cyan-400" /> Live GIS Landslide Risk & Telemetry Map
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">
                    Region: North Eastern Slopes (Gangtok Sector)
                  </span>
                </div>

                <div className="flex-1 min-h-[440px]">
                  <InteractiveMap 
                    selectedNode={selectedNode} 
                    setSelectedNode={setSelectedNode} 
                  />
                </div>
              </div>

              {/* Right Side Console */}
              <div className="glass-panel p-5 space-y-5 flex flex-col justify-between">
                
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="font-bold text-white text-sm font-heading">Node Telemetry Inspector</h3>
                    <span className="badge badge-cyan text-[10px]">Real-Time Polling</span>
                  </div>

                  {selectedNode ? (
                    <div className="space-y-4 mt-4 text-xs">
                      <div className="p-3 bg-slate-900/90 rounded-xl border border-cyan-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{selectedNode.name}</span>
                          <span className={`badge ${
                            selectedNode.riskLevel === 'CRITICAL' ? 'badge-critical' : selectedNode.riskLevel === 'HIGH' ? 'badge-warning' : 'badge-safe'
                          }`}>
                            {selectedNode.riskLevel}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">Location: {selectedNode.village}</p>
                      </div>

                      <div className="space-y-2 font-mono">
                        <div className="flex justify-between bg-slate-900/50 p-2.5 rounded-lg">
                          <span className="text-slate-400">Landslide Risk Score:</span>
                          <span className="font-bold text-red-400">{selectedNode.score}%</span>
                        </div>
                        <div className="flex justify-between bg-slate-900/50 p-2.5 rounded-lg">
                          <span className="text-slate-400">Soil Moisture Probe:</span>
                          <span className="font-bold text-amber-300">{selectedNode.soilMoisture}</span>
                        </div>
                        <div className="flex justify-between bg-slate-900/50 p-2.5 rounded-lg">
                          <span className="text-slate-400">Slope Gradient:</span>
                          <span className="font-bold text-cyan-300">{selectedNode.slope}</span>
                        </div>
                        <div className="flex justify-between bg-slate-900/50 p-2.5 rounded-lg">
                          <span className="text-slate-400">24h Downpour:</span>
                          <span className="font-bold text-blue-400">{selectedNode.rainfall} mm</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center space-y-2 text-slate-400 text-xs mt-4">
                      <Activity className="w-8 h-8 text-cyan-400/50 mx-auto animate-pulse" />
                      <p>Click any IoT node or Hazard polygon on the map to inspect live geotechnical telemetry.</p>
                    </div>
                  )}
                </div>

                {/* SDRF Emergency Broadcast Dispatch */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-400" /> Disaster Collector Quick Action
                  </div>

                  <button
                    onClick={toggleEmergencyAlert}
                    className={`w-full text-xs py-2.5 rounded-xl font-bold transition-all ${
                      emergencyAlertActive 
                        ? 'btn-danger pulse-critical' 
                        : 'btn-primary'
                    }`}
                  >
                    {emergencyAlertActive ? '🔴 SIREN & VOICE ALARM ACTIVE' : '🚨 BROADCAST EMERGENCY ALARM'}
                  </button>
                </div>

              </div>

            </div>

            {/* Bottom Section: Satellite & Government Data Sources */}
            <DataSourcesPanel />

          </div>
        )}

        {/* VIEW 2: AI RISK ENGINE */}
        {activeTab === 'risk-engine' && (
          <AIRiskEngine onRiskScoreChange={(score) => {
            if (score >= 75) setEmergencyAlertActive(true);
          }} />
        )}

        {/* VIEW 3: GEOSHIELD BEACONS */}
        {activeTab === 'beacons' && (
          <GeoShieldBeacon
            emergencyAlertActive={emergencyAlertActive}
            toggleEmergencyAlert={toggleEmergencyAlert}
          />
        )}

        {/* VIEW 4: SAFEPATH EVACUATION NAVIGATOR */}
        {activeTab === 'safepath' && (
          <SafePathNavigator />
        )}

        {/* VIEW 5: DRONE RESCUE AI */}
        {activeTab === 'drone-yolo' && (
          <DroneYoloDetector />
        )}

        {/* VIEW 6: FIELD REPORTER */}
        {activeTab === 'field-reporter' && (
          <FieldReporter />
        )}

        {/* VIEW 7: ROAD CONNECTIVITY */}
        {activeTab === 'road' && (
          <RoadConnectivity />
        )}

        {/* VIEW 8: WEATHER FORECAST */}
        {activeTab === 'weather' && (
          <WeatherForecast />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#0a0e17] border-t border-white/10 py-4 px-6 text-xs text-slate-500 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            GeoShield AI © 2026 — Smart India Hackathon Submission (SIH26001). Disaster Management Theme.
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono">
            <span>Terminal ID: 21712</span>
            <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${
              wsConnected
                ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                : 'text-amber-400 border-amber-500/30 bg-amber-500/10'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {wsConnected ? 'WS LIVE' : 'WS Polling'}
            </span>
            <span className="text-cyan-400">LoRa RSSI: {telemetry.rssi} dBm</span>
            <span className="text-emerald-400">Mesh Ping: {telemetry.meshPing} ms</span>
          </div>
        </div>
      </footer>

      {/* SIH presentation modal */}
      <SIHInfoModal
        isOpen={isSIHModalOpen}
        onClose={() => setIsSIHModalOpen(false)}
      />

    </div>
  );
}
