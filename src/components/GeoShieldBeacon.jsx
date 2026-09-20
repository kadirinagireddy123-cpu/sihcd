import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  BatteryCharging, 
  Sun, 
  Volume2, 
  VolumeX, 
  Wifi, 
  WifiOff, 
  Cpu, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  Globe, 
  Layers 
} from 'lucide-react';

export default function GeoShieldBeacon({ emergencyAlertActive, toggleEmergencyAlert }) {
  const [activeTabLanguage, setActiveTabLanguage] = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [meshPingTime, setMeshPingTime] = useState(12);
  const [meshNodesConnected, setMeshNodesConnected] = useState(6);

  // Simulated Voice Broadcast Messages for NER Villages
  const voiceAlerts = {
    en: "ATTENTION ALL RESIDENTS: High landslide risk detected on North Ridge Slope! Evacuate immediately via SafePath Route B to Community Stadium Shelter.",
    hi: "सभी निवासियों का ध्यान दें: उत्तर पहाड़ी ढलान पर भूस्खलन का उच्च जोखिम पाया गया है! कृपया तुरंत सुरक्षित मार्ग B से सामुदायिक स्टेडियम आश्रय की ओर निकलें।",
    as: "সকলো ৰাইজলৈ সৱধানবাণী: উত্তৰ পাহাৰৰ ঢালত ভূমিস্খলনৰ তীব্ৰ আশংকা কৰা হৈছে! ছেফপাথ পথ B ৰে সমবায় ষ্টেডিয়াম আশ্ৰয় শিবিৰলৈ যাওক।",
    bn: "সকল অধিবাসীদের দৃষ্টি আকর্ষণ করা হচ্ছে: উত্তর পাহাড়ের ঢালে ধসের প্রবল ঝুঁকি দেখা দিয়েছে! অবিলম্বে নিরাপদ পথ B দিয়ে কমিউনিটি স্টেডিয়াম আশ্রয়ে যান।",
    naga: "GET PREPARED: High landslide danger detected on hill slope! All village members head to central safe shelter now via marked safe path."
  };

  // Play browser SpeechSynthesis if available
  const triggerVoiceSpeech = (langKey) => {
    const msgText = voiceAlerts[langKey];
    setIsSpeaking(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(msgText);
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 4000);
    }
  };

  const stopVoiceSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-emerald-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
            <h2 className="text-xl font-bold text-white font-heading">
              GeoShield IoT Beacon & LoRa Offline Mesh Node
            </h2>
            <span className="badge badge-safe">Hardware Active</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Low-cost, solar-powered ESP32 microcontroller with LoRa last-mile RF communication. Operational even during 100% cellular & power grid failures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge badge-cyan text-xs py-1.5 px-3">
            <Wifi className="w-3.5 h-3.5" /> 868 MHz LoRa Radio: OK
          </span>
          <span className="badge badge-safe text-xs py-1.5 px-3">
            <Sun className="w-3.5 h-3.5 text-amber-400" /> Solar Charging (4.2V)
          </span>
        </div>
      </div>

      {/* Grid: Hardware Component Visualizer + Control Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Hardware Visualizer Box */}
        <div className="glass-panel p-6 space-y-5 border border-white/10 relative overflow-hidden">
          
          {/* Top Panel LED Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white text-sm font-heading">ESP32 Hardware Enclosure Unit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">STATUS:</span>
              <span className={`w-3 h-3 rounded-full ${emergencyAlertActive ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`}></span>
            </div>
          </div>

          {/* Circuit / Sensor Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-white/5 space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Power System</span>
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg font-bold text-emerald-400 font-mono">98% / 4.15V</div>
              <div className="text-[10px] text-slate-500">LiFePO4 Solar Battery + Regulator</div>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-white/5 space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>LoRa Radio Transmission</span>
                <Wifi className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-lg font-bold text-cyan-400 font-mono">-78 dBm (RSSI)</div>
              <div className="text-[10px] text-slate-500">Sub-GHz Long Range (Up to 15km)</div>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-white/5 space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Rain Gauge Telemetry</span>
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-lg font-bold text-blue-400 font-mono">14.2 mm/hr</div>
              <div className="text-[10px] text-slate-500">Tipping Bucket Pulse Counter</div>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-white/5 space-y-1">
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Capacitive Soil Probe</span>
                <Radio className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-lg font-bold text-amber-400 font-mono">84% Volumetric</div>
              <div className="text-[10px] text-slate-500">Subsurface Moisture Sensor</div>
            </div>

          </div>

          {/* Visual Siren Light Indicator */}
          <div className={`p-4 rounded-xl border text-center transition-all ${
            emergencyAlertActive
              ? 'bg-red-950/80 border-red-500 pulse-critical text-red-200'
              : 'bg-slate-900/60 border-white/10 text-slate-300'
          }`}>
            <div className="flex items-center justify-center gap-3">
              <span className={`w-4 h-4 rounded-full ${emergencyAlertActive ? 'bg-red-500 animate-bounce' : 'bg-slate-600'}`}></span>
              <span className="font-bold text-sm uppercase tracking-wider">
                {emergencyAlertActive ? '🚨 SIREN STROBE & VOICE ALARM ACTIVE' : 'Siren Standby Mode (Silent)'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {emergencyAlertActive ? 'High decibel piezo horn emitting 110dB warning tone.' : 'Automatic trigger occurs when AI risk score exceeds 75%.'}
            </p>
          </div>

          {/* Test Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={toggleEmergencyAlert}
              className={`flex-1 ${emergencyAlertActive ? 'btn-danger' : 'btn-primary'}`}
            >
              <ShieldAlert className="w-4 h-4" />
              {emergencyAlertActive ? 'STOP SIREN HORN' : 'TEST HARDWARE SIREN'}
            </button>
          </div>

        </div>

        {/* Multi-Lingual Local Voice Alert Speaker Simulator */}
        <div className="glass-panel p-6 space-y-5 flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-sm font-heading">Multi-Lingual Voice Siren Broadcast</h3>
              </div>
              <span className="badge badge-cyan text-[10px]">Local Audio Synthesizer</span>
            </div>

            <p className="text-xs text-slate-300 mt-3">
              GeoShield Beacon features an integrated DFPlayer Mini audio module and loudspeaker to announce localized audio warnings in regional North-Eastern languages during emergencies.
            </p>

            {/* Language Selection Tabs */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {[
                { id: 'en', label: 'English' },
                { id: 'hi', label: 'Hindi (हिंदी)' },
                { id: 'as', label: 'Assamese (অসমীয়া)' },
                { id: 'bn', label: 'Bengali (বাংলা)' },
                { id: 'naga', label: 'Nagamese' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setActiveTabLanguage(lang.id)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                    activeTabLanguage === lang.id
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Selected Language Message Preview */}
            <div className="mt-4 p-4 bg-slate-900/90 rounded-xl border border-white/10 font-mono text-xs text-indigo-200 leading-relaxed min-h-[90px] flex items-center justify-center text-center">
              {voiceAlerts[activeTabLanguage]}
            </div>
          </div>

          {/* Speech Control */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              {!isSpeaking ? (
                <button
                  onClick={() => triggerVoiceSpeech(activeTabLanguage)}
                  className="btn-primary w-full justify-center"
                >
                  <Volume2 className="w-4 h-4" /> PLAY LOCAL VOICE BROADCAST
                </button>
              ) : (
                <button
                  onClick={stopVoiceSpeech}
                  className="btn-danger w-full justify-center"
                >
                  <VolumeX className="w-4 h-4 animate-bounce" /> STOP VOICE BROADCAST
                </button>
              )}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
              <span>Relay Hops: <strong className="text-cyan-400">Node #1 → Node #4</strong></span>
              <span>Mesh Latency: <strong className="text-emerald-400">{meshPingTime} ms</strong></span>
            </div>
          </div>

        </div>

      </div>

      {/* LoRa Mesh Topology Status */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
            <Layers className="w-4 h-4 text-cyan-400" /> Regional LoRa Mesh Network Topology (Offline Last-Mile)
          </h3>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> 6/6 Nodes Synchronized
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-1">
          {['Node #01 (Ridge)', 'Node #02 (Slope)', 'Node #03 (Burtuk)', 'Node #04 (River)', 'Node #05 (Market)', 'Node #06 (Shelter)'].map((node, i) => (
            <div key={i} className="bg-slate-900/80 p-3 rounded-xl border border-white/5 text-center space-y-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mx-auto pulse-safe"></div>
              <div className="text-xs font-bold text-white">{node}</div>
              <div className="text-[10px] text-slate-400 font-mono">RSSI: -76 dBm</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
