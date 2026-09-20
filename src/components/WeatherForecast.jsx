import React, { useState, useEffect } from 'react';
import {
  Cloud, Droplets, Wind, Thermometer, Eye, AlertTriangle, 
  TrendingUp, Sun, CloudRain, Zap, Snowflake, Activity,
  CheckCircle2, Clock, MapPin, Waves, RefreshCw, ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';

const DISTRICTS = [
  {
    id: 'gangtok', name: 'Gangtok', state: 'Sikkim',
    temp: 18, humidity: 94, rainfall72h: 312, windSpeed: 28, visibility: 2.1,
    condition: 'Severe Thunderstorm', icon: 'storm',
    landslideRisk: 87, floodRisk: 72, forecast72h: 'Continue heavy rain. IMD Red Alert issued.',
    alert: 'RED', imdAlert: 'Extremely Heavy Rain Alert (IMD)',
  },
  {
    id: 'tadong', name: 'Tadong Sector', state: 'Sikkim',
    temp: 17, humidity: 96, rainfall72h: 287, windSpeed: 32, visibility: 1.4,
    condition: 'Heavy Rain + Fog', icon: 'heavy-rain',
    landslideRisk: 92, floodRisk: 68, forecast72h: 'Intensifying rainfall. High slope instability risk.',
    alert: 'RED', imdAlert: 'Red Alert – Landslide Threat',
  },
  {
    id: 'mangan', name: 'Mangan', state: 'North Sikkim',
    temp: 14, humidity: 88, rainfall72h: 198, windSpeed: 18, visibility: 3.5,
    condition: 'Moderate Rain', icon: 'rain',
    landslideRisk: 54, floodRisk: 38, forecast72h: 'Moderate rain through weekend. Monitor river banks.',
    alert: 'ORANGE', imdAlert: 'Orange Alert – Heavy Rain Warning',
  },
  {
    id: 'jorethang', name: 'Jorethang', state: 'South Sikkim',
    temp: 22, humidity: 82, rainfall72h: 156, windSpeed: 14, visibility: 5.2,
    condition: 'Overcast / Drizzle', icon: 'drizzle',
    landslideRisk: 35, floodRisk: 28, forecast72h: 'Light to moderate rain. Road conditions improving.',
    alert: 'YELLOW', imdAlert: 'Yellow Alert – Watch',
  },
  {
    id: 'guwahati', name: 'Guwahati', state: 'Assam',
    temp: 27, humidity: 78, rainfall72h: 124, windSpeed: 22, visibility: 6.8,
    condition: 'Partly Cloudy', icon: 'cloudy',
    landslideRisk: 22, floodRisk: 45, forecast72h: 'Brahmaputra continues at high levels. Flood watch active.',
    alert: 'YELLOW', imdAlert: 'Yellow Alert – Flood Watch',
  },
  {
    id: 'kohima', name: 'Kohima', state: 'Nagaland',
    temp: 20, humidity: 71, rainfall72h: 89, windSpeed: 11, visibility: 8.4,
    condition: 'Partly Cloudy', icon: 'cloudy',
    landslideRisk: 18, floodRisk: 12, forecast72h: 'Clearing skies expected. Low risk period.',
    alert: 'GREEN', imdAlert: 'Green – No Alert',
  },
];

const HOURLY_FORECAST = [
  { hour: 'Now', rain: 14.2, temp: 18, risk: 87 },
  { hour: '+3h', rain: 16.8, temp: 17, risk: 89 },
  { hour: '+6h', rain: 19.4, temp: 16, risk: 91 },
  { hour: '+9h', rain: 22.1, temp: 16, risk: 94 },
  { hour: '+12h', rain: 18.5, temp: 17, risk: 90 },
  { hour: '+15h', rain: 12.3, temp: 18, risk: 82 },
  { hour: '+18h', rain: 8.7, temp: 19, risk: 74 },
  { hour: '+21h', rain: 5.2, temp: 20, risk: 65 },
  { hour: '+24h', rain: 11.4, temp: 18, risk: 72 },
];

const SEVEN_DAY = [
  { day: 'Today', icon: 'storm', high: 19, low: 14, rain: 38, risk: 91 },
  { day: 'Fri', icon: 'heavy-rain', high: 18, low: 13, rain: 42, risk: 88 },
  { day: 'Sat', icon: 'rain', high: 20, low: 15, rain: 29, risk: 76 },
  { day: 'Sun', icon: 'rain', high: 22, low: 16, rain: 18, risk: 61 },
  { day: 'Mon', icon: 'drizzle', high: 23, low: 17, rain: 8, risk: 45 },
  { day: 'Tue', icon: 'cloudy', high: 25, low: 18, rain: 4, risk: 32 },
  { day: 'Wed', icon: 'sunny', high: 27, low: 19, rain: 0, risk: 18 },
];

const ALERT_CONFIG = {
  RED: { label: 'RED ALERT', bg: 'bg-red-950/80', border: 'border-red-500/50', text: 'text-red-300', dot: 'bg-red-500', pulse: 'pulse-critical' },
  ORANGE: { label: 'ORANGE ALERT', bg: 'bg-orange-950/60', border: 'border-orange-500/40', text: 'text-orange-300', dot: 'bg-orange-500', pulse: '' },
  YELLOW: { label: 'YELLOW WATCH', bg: 'bg-yellow-950/40', border: 'border-yellow-500/30', text: 'text-yellow-300', dot: 'bg-yellow-400', pulse: '' },
  GREEN: { label: 'GREEN – CLEAR', bg: 'bg-emerald-950/40', border: 'border-emerald-500/20', text: 'text-emerald-300', dot: 'bg-emerald-400', pulse: '' },
};

const WEATHER_ICONS = {
  'storm': '⛈️',
  'heavy-rain': '🌧️',
  'rain': '🌦️',
  'drizzle': '🌂',
  'cloudy': '☁️',
  'sunny': '☀️',
};

function WeatherIcon({ type, size = 'text-2xl' }) {
  return <span className={size}>{WEATHER_ICONS[type] || '🌡️'}</span>;
}

function RiskBar({ value, color }) {
  const getColor = (v) => v >= 75 ? '#ff3b5c' : v >= 50 ? '#ff9f1c' : v >= 30 ? '#ffd166' : '#06d6a0';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: getColor(value) }}
        />
      </div>
      <span className="text-xs font-bold font-mono w-10 text-right" style={{ color: getColor(value) }}>{value}%</span>
    </div>
  );
}

export default function WeatherForecast() {
  const [selectedDistrict, setSelectedDistrict] = useState(DISTRICTS[0]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 8000);
    return () => clearInterval(id);
  }, []);

  const alertCfg = ALERT_CONFIG[selectedDistrict.alert];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="glass-panel p-6 border-l-4 border-l-blue-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cloud className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white font-heading">
              IMD Weather-Linked Risk Forecast
            </h2>
            <span className="badge badge-cyan">Requirement (f)</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Real-time weather intelligence linked to landslide risk prediction — powered by IMD API + Sentinel satellite feeds across North Eastern Region.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${tick % 2 === 0 ? 'animate-spin' : ''}`} />
          IMD Feed last sync: {new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
        </div>
      </div>

      {/* IMD Alert Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DISTRICTS.filter(d => d.alert === 'RED' || d.alert === 'ORANGE').map(d => {
          const cfg = ALERT_CONFIG[d.alert];
          return (
            <div
              key={d.id}
              onClick={() => setSelectedDistrict(d)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${cfg.bg} ${cfg.border} ${d.alert === 'RED' ? 'panel-glow-critical' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot} ${cfg.pulse}`} />
                <span className={`text-xs font-bold ${cfg.text}`}>{cfg.label}</span>
              </div>
              <div className="text-white font-semibold text-sm mt-1">{d.name}, {d.state}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{d.imdAlert}</div>
            </div>
          );
        })}
        <div className="p-3 rounded-xl border bg-yellow-950/30 border-yellow-500/20 cursor-pointer hover:border-yellow-500/40 transition-all">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
            <span className="text-xs font-bold text-yellow-300">YELLOW WATCH</span>
          </div>
          <div className="text-white font-semibold text-sm mt-1">Guwahati + Jorethang</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Monitor — Elevated flood potential</div>
        </div>
        <div className="p-3 rounded-xl border bg-emerald-950/20 border-emerald-500/15">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="text-xs font-bold text-emerald-300">GREEN – CLEAR</span>
          </div>
          <div className="text-white font-semibold text-sm mt-1">Kohima + Aizawl</div>
          <div className="text-[11px] text-slate-400 mt-0.5">No active alerts</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* District Selector Column */}
        <div className="glass-panel p-5 space-y-3">
          <h3 className="text-sm font-bold text-white font-heading flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" /> NER District Weather
          </h3>
          <div className="space-y-2">
            {DISTRICTS.map(d => {
              const cfg = ALERT_CONFIG[d.alert];
              const isSelected = selectedDistrict.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedDistrict(d)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                    isSelected
                      ? `${cfg.bg} ${cfg.border}`
                      : 'bg-slate-900/50 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <WeatherIcon type={d.icon} size="text-xl" />
                    <div>
                      <div className="text-sm font-bold text-white">{d.name}</div>
                      <div className="text-[10px] text-slate-400">{d.state}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-white font-mono">{d.temp}°C</div>
                      <div className={`text-[10px] font-bold ${cfg.text}`}>{d.alert}</div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-all ${isSelected ? 'text-blue-400 rotate-90' : 'text-slate-600 group-hover:text-slate-400'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Weather Detail + Charts */}
        <div className="lg:col-span-2 space-y-5">

          {/* Primary Weather Card */}
          <div className={`glass-panel p-6 border ${alertCfg.border} ${selectedDistrict.alert === 'RED' ? 'panel-glow-critical' : ''}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <WeatherIcon type={selectedDistrict.icon} size="text-5xl" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white font-heading">
                      {selectedDistrict.name}, {selectedDistrict.state}
                    </h3>
                    <span className={`badge text-[10px] ${alertCfg.text} ${alertCfg.bg} border ${alertCfg.border}`}>
                      {alertCfg.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mt-0.5">{selectedDistrict.condition}</p>
                  <p className="text-xs text-slate-400 mt-1 italic">{selectedDistrict.imdAlert}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-extrabold text-white font-mono">{selectedDistrict.temp}°</div>
                <div className="text-xs text-slate-400">Feels like {selectedDistrict.temp - 2}°C</div>
              </div>
            </div>

            {/* Weather Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              <div className="bg-slate-900/80 p-3 rounded-xl text-center space-y-1">
                <Droplets className="w-4 h-4 text-blue-400 mx-auto" />
                <div className="text-sm font-bold text-blue-300 font-mono">{selectedDistrict.humidity}%</div>
                <div className="text-[10px] text-slate-400">Humidity</div>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl text-center space-y-1">
                <CloudRain className="w-4 h-4 text-cyan-400 mx-auto" />
                <div className="text-sm font-bold text-cyan-300 font-mono">{selectedDistrict.rainfall72h} mm</div>
                <div className="text-[10px] text-slate-400">72h Rainfall</div>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl text-center space-y-1">
                <Wind className="w-4 h-4 text-indigo-400 mx-auto" />
                <div className="text-sm font-bold text-indigo-300 font-mono">{selectedDistrict.windSpeed} km/h</div>
                <div className="text-[10px] text-slate-400">Wind Speed</div>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl text-center space-y-1">
                <Eye className="w-4 h-4 text-slate-400 mx-auto" />
                <div className="text-sm font-bold text-slate-300 font-mono">{selectedDistrict.visibility} km</div>
                <div className="text-[10px] text-slate-400">Visibility</div>
              </div>
            </div>

            {/* Linked Risk Scores */}
            <div className="mt-4 space-y-2">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Weather-Linked Risk Index</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 w-36 shrink-0">Landslide Risk</span>
                  <RiskBar value={selectedDistrict.landslideRisk} />
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 w-36 shrink-0">Flash Flood Risk</span>
                  <RiskBar value={selectedDistrict.floodRisk} />
                </div>
              </div>
            </div>

            {/* 72h Outlook */}
            <div className={`mt-4 p-3 rounded-xl ${alertCfg.bg} border ${alertCfg.border} text-xs`}>
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className={`w-3.5 h-3.5 ${alertCfg.text}`} />
                <span className={`font-bold ${alertCfg.text}`}>72-Hour IMD Forecast Outlook</span>
              </div>
              <p className="text-slate-300">{selectedDistrict.forecast72h}</p>
            </div>
          </div>

          {/* Hourly Risk + Rain Chart */}
          <div className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> 24-Hour Rainfall vs Landslide Risk Forecast
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Source: IMD + AI Engine</span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HOURLY_FORECAST}>
                  <defs>
                    <linearGradient id="riskForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff3b5c" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#ff3b5c" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="rainForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#00b4d8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="hour" stroke="#9ca3af" fontSize={10} />
                  <YAxis stroke="#9ca3af" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="risk" stroke="#ff3b5c" strokeWidth={2.5} fillOpacity={1} fill="url(#riskForecast)" name="Landslide Risk (%)" />
                  <Area type="monotone" dataKey="rain" stroke="#00b4d8" strokeWidth={2} fillOpacity={1} fill="url(#rainForecast)" name="Rainfall (mm/hr)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="glass-panel p-5 space-y-4">
            <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
              <Cloud className="w-4 h-4 text-blue-400" /> 7-Day Risk Forecast
            </h4>
            <div className="grid grid-cols-7 gap-2">
              {SEVEN_DAY.map((day, i) => {
                const riskColor = day.risk >= 75 ? 'text-red-400' : day.risk >= 50 ? 'text-amber-400' : day.risk >= 30 ? 'text-yellow-400' : 'text-emerald-400';
                const bgColor = day.risk >= 75 ? 'bg-red-500/10 border-red-500/30' : day.risk >= 50 ? 'bg-amber-500/10 border-amber-500/20' : day.risk >= 30 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-emerald-500/10 border-emerald-500/20';
                return (
                  <div key={i} className={`p-2.5 rounded-xl border text-center space-y-1.5 ${i === 0 ? bgColor + ' ring-1 ring-inset ring-white/10' : 'bg-slate-900/50 border-white/5'}`}>
                    <div className="text-[10px] font-bold text-slate-400">{day.day}</div>
                    <WeatherIcon type={day.icon} size="text-lg" />
                    <div className="text-[10px] text-slate-300">{day.high}° / {day.low}°</div>
                    <div className="text-[9px] font-mono text-blue-400">{day.rain}mm</div>
                    <div className={`text-[10px] font-bold ${riskColor}`}>{day.risk}%</div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 text-[10px] text-slate-500 justify-end">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> ≥75% Risk</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> ≥50%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> &lt;30% Safe</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
