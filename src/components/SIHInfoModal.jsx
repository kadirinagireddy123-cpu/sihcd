import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  ShieldCheck, 
  Globe, 
  Zap, 
  Flame, 
  Waves, 
  Activity, 
  Radio, 
  ChevronRight 
} from 'lucide-react';

export default function SIHInfoModal({ isOpen, onClose }) {
  const [activeSlideTab, setActiveSlideTab] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0f172a] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-heading">
                  Smart India Hackathon 2026 Pitch Deck
                </h2>
                <span className="badge badge-cyan text-[10px]">SIH26001</span>
              </div>
              <p className="text-xs text-slate-400">
                Problem Statement Title: AI-Based early warning and landslide Risk Monitoring System in NER
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presentation Slide Switcher */}
        <div className="flex items-center gap-1 px-6 py-3 bg-slate-950/60 border-b border-white/5 overflow-x-auto text-xs">
          {[
            { id: 1, label: 'Slide 1: Problem' },
            { id: 2, label: 'Slide 2: Proposed Solution' },
            { id: 3, label: 'Slide 3: Technical Workflow' },
            { id: 4, label: 'Slide 4: Feasibility & Viability' },
            { id: 5, label: 'Slide 5: Impact & Benefits' },
            { id: 6, label: 'Slide 6: Roadmap & Sources' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSlideTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                activeSlideTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Slide Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {/* SLIDE 1: Title & Problem Statement */}
          {activeSlideTab === 1 && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/30 text-center space-y-3">
                <span className="badge badge-cyan text-xs">SMART INDIA HACKATHON 2026</span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight">
                  GeoShield AI
                </h1>
                <p className="text-sm text-cyan-300 font-mono font-semibold">
                  Predict • Alert • Evacuate • Rescue
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10 space-y-2">
                  <div className="text-slate-400 font-mono uppercase text-[10px]">Problem Statement ID</div>
                  <div className="text-sm font-bold text-white">SIH26001</div>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10 space-y-2">
                  <div className="text-slate-400 font-mono uppercase text-[10px]">Theme & Category</div>
                  <div className="text-sm font-bold text-white">Disaster Management (Software)</div>
                </div>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-xl border border-white/10 space-y-2 text-xs">
                <h3 className="font-bold text-white text-sm">Problem Summary:</h3>
                <p className="text-slate-300 leading-relaxed">
                  The North Eastern Region (NER) of India suffers recurring, devastating landslides triggered by monsoonal downpours, steep topography, and cellular/power outages. Traditional disaster management is reactive and fails last-mile communication in remote villages.
                </p>
              </div>
            </div>
          )}

          {/* SLIDE 2: Solution Overview */}
          {activeSlideTab === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white font-heading">GeoShield AI Architecture</h3>
                <p className="text-xs text-slate-300">
                  GeoShield AI combines satellite intelligence, AI risk prediction, local IoT sensor validation, and offline LoRa alerts to provide real-time landslide risk monitoring and emergency response for vulnerable NER villages.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-blue-500/30 space-y-2">
                  <div className="badge badge-cyan">1. Data Integration</div>
                  <div className="text-xs text-slate-300">Satellite + IMD + ISRO Data (Rainfall, DEM, Soil, Weather).</div>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-purple-500/30 space-y-2">
                  <div className="badge badge-cyan">2. AI Risk Engine</div>
                  <div className="text-xs text-slate-300">LSTM + XGBoost machine learning model calculating Risk Score (0-100%).</div>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-emerald-500/30 space-y-2">
                  <div className="badge badge-safe">3. GeoShield Beacon</div>
                  <div className="text-xs text-slate-300">Siren + Multi-lingual Voice Alert + Flash LED + LoRa mesh transmission.</div>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-amber-500/30 space-y-2">
                  <div className="badge badge-warning">4. SafePath AI & Govt Dashboard</div>
                  <div className="text-xs text-slate-300">Offline Evacuation Routes + District Collector & SDRF command console.</div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: Technical Workflow & Stack */}
          {activeSlideTab === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white font-heading">5-Step Technical Workflow</h3>
                <div className="space-y-2 text-xs">
                  {[
                    '1. Collect Satellite + Sensor Data (IMD, Bhuvan DEM, Soil probes)',
                    '2. AI Predicts Landslide Probability (LSTM & XGBoost)',
                    '3. Verify Using Soil/Rain Sensors (ESP32 node telemetry)',
                    '4. Trigger GeoShield Beacon & Govt Dashboard (LoRa Siren & SDRF dispatch)',
                    '5. Safe Evacuation + Drone Verification (SafePath AI & YOLOv11 aerial view)'
                  ].map((step, i) => (
                    <div key={i} className="p-3 bg-slate-900/80 rounded-xl border border-white/5 flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">
                        {i+1}
                      </span>
                      <span className="text-slate-200">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 space-y-3 border-t border-white/10">
                <h3 className="text-base font-bold text-white font-heading">Technology Stack</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-white/10">
                    <div className="text-slate-400 font-mono text-[10px]">AI / ML</div>
                    <div className="font-bold text-cyan-300 mt-1">LSTM, XGBoost, Random Forest, YOLOv11</div>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-white/10">
                    <div className="text-slate-400 font-mono text-[10px]">GIS mapping</div>
                    <div className="font-bold text-emerald-300 mt-1">Google Earth Engine, ISRO Bhuvan, Leaflet</div>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-white/10">
                    <div className="text-slate-400 font-mono text-[10px]">Backend & Web</div>
                    <div className="font-bold text-indigo-300 mt-1">FastAPI, React, Supabase, Vite</div>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-white/10">
                    <div className="text-slate-400 font-mono text-[10px]">Hardware IoT</div>
                    <div className="font-bold text-amber-300 mt-1">ESP32, LoRa (868MHz), Solar, Rain Gauge</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: Feasibility & Viability */}
          {activeSlideTab === 4 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white font-heading">Feasibility & Viability Matrix</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10 space-y-1">
                  <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" /> 🛰 DATA FEASIBILITY
                  </h4>
                  <p className="text-slate-300">Public & freely available datasets from IMD, ISRO Bhuvan DEM, GSI Bhukosh, and Sentinel-1/2 SAR.</p>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10 space-y-1">
                  <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" /> 💻 TECHNOLOGY FEASIBILITY
                  </h4>
                  <p className="text-slate-300">Open-source & modular deployable stack in Python, ML, GIS, FastAPI, React.</p>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10 space-y-1">
                  <h4 className="font-bold text-purple-300 flex items-center gap-1.5">
                    <Radio className="w-4 h-4" /> 📡 CONNECTIVITY FEASIBILITY
                  </h4>
                  <p className="text-slate-300">Designed specifically for remote villages with LoRa offline mesh alerts & local voice beacons.</p>
                </div>
                <div className="bg-slate-900/80 p-4 rounded-xl border border-white/10 space-y-1">
                  <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> 🔋 FIELD FEASIBILITY
                  </h4>
                  <p className="text-slate-300">Low-cost hardware deployment using ESP32 microcontrollers, Solar panels & Battery backup.</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: Impact & Benefits */}
          {activeSlideTab === 5 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white font-heading">Impact & Key Benefits</h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-900/80 rounded-xl border border-white/10 space-y-1">
                  <strong className="text-emerald-400 font-bold text-sm block">🛡 Improved Community Safety</strong>
                  <p className="text-slate-300">Delivers early risk awareness directly to vulnerable NER villages, even in areas without internet connection.</p>
                </div>
                <div className="p-4 bg-slate-900/80 rounded-xl border border-white/10 space-y-1">
                  <strong className="text-cyan-400 font-bold text-sm block">📡 Reliable Last-Mile Communication</strong>
                  <p className="text-slate-300">LoRa-based beacon network provides an uninterrupted emergency channel when mobile towers collapse.</p>
                </div>
                <div className="p-4 bg-slate-900/80 rounded-xl border border-white/10 space-y-1">
                  <strong className="text-purple-400 font-bold text-sm block">🗺 Safer Evacuation Decisions</strong>
                  <p className="text-slate-300">SafePath AI bypasses high landslide risk zones to guide villagers directly to secure relief shelters.</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6: Roadmap & Sources */}
          {activeSlideTab === 6 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-white font-heading">Research Sources</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {['IMD Rainfall Dataset', 'ISRO Bhuvan DEM', 'GSI/Bhukosh Inventory', 'Sentinel-1 & Sentinel-2', 'Google Earth Engine'].map((src, i) => (
                    <div key={i} className="p-2.5 bg-slate-900/80 rounded-lg border border-white/5 text-slate-300 font-mono text-center">
                      {src}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-3">
                <h3 className="text-base font-bold text-white font-heading">Multi-Hazard Future Roadmap</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs text-center">
                  <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl space-y-1">
                    <span className="text-lg">🌋</span>
                    <div className="font-bold text-red-300">Landslides</div>
                    <div className="text-[10px] text-slate-400">Current Scope</div>
                  </div>
                  <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl space-y-1">
                    <span className="text-lg">🌊</span>
                    <div className="font-bold text-blue-300">Flash Flood</div>
                    <div className="text-[10px] text-slate-400">Phase 2</div>
                  </div>
                  <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl space-y-1">
                    <span className="text-lg">🌍</span>
                    <div className="font-bold text-amber-300">Earthquake</div>
                    <div className="text-[10px] text-slate-400">Phase 3</div>
                  </div>
                  <div className="p-3 bg-orange-950/40 border border-orange-500/30 rounded-xl space-y-1">
                    <span className="text-lg">🔥</span>
                    <div className="font-bold text-orange-300">Forest Fire</div>
                    <div className="text-[10px] text-slate-400">Phase 4</div>
                  </div>
                  <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl space-y-1">
                    <span className="text-lg">🚁</span>
                    <div className="font-bold text-purple-300">Drone Rescue</div>
                    <div className="text-[10px] text-slate-400">YOLOv11 Active</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-slate-400">SIH 2026 Terminal ID: 21712</span>
          <button
            onClick={onClose}
            className="btn-primary py-1.5 px-4 text-xs"
          >
            CLOSE DECK
          </button>
        </div>

      </div>
    </div>
  );
}
