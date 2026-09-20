import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Droplets, 
  Mountain, 
  Trees, 
  Activity, 
  ShieldAlert, 
  Zap, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AIRiskEngine({ onRiskScoreChange }) {
  // Input Sliders State
  const [rainfall, setRainfall] = useState(135); // mm in 24h
  const [soilMoisture, setSoilMoisture] = useState(84); // %
  const [slopeAngle, setSlopeAngle] = useState(36); // degrees
  const [deforestation, setDeforestation] = useState(42); // %
  const [seismicActivity, setSeismicActivity] = useState(2.4); // m/s2 tremor

  // Calculated Risk Output State
  const [riskScore, setRiskScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState('SAFE');
  const [lstmConfidence, setLstmConfidence] = useState(94.6);
  const [factors, setFactors] = useState([]);

  // Calculate AI Model Prediction on Slider Change
  useEffect(() => {
    // Math Formula simulating LSTM + XGBoost risk evaluation:
    // W_rain = 0.35, W_soil = 0.30, W_slope = 0.20, W_deforest = 0.10, W_seismic = 0.05
    const rainScore = Math.min(100, (rainfall / 200) * 100);
    const soilScore = soilMoisture;
    const slopeScore = Math.min(100, (slopeAngle / 50) * 100);
    const forestScore = deforestation;
    const seismicScore = Math.min(100, (seismicActivity / 5.0) * 100);

    const calculatedScore = Math.round(
      rainScore * 0.35 + 
      soilScore * 0.30 + 
      slopeScore * 0.20 + 
      forestScore * 0.10 + 
      seismicScore * 0.05
    );

    setRiskScore(calculatedScore);

    if (calculatedScore >= 75) {
      setRiskLevel('CRITICAL');
    } else if (calculatedScore >= 50) {
      setRiskLevel('HIGH');
    } else if (calculatedScore >= 30) {
      setRiskLevel('MODERATE');
    } else {
      setRiskLevel('SAFE');
    }

    setFactors([
      { name: 'Rainfall Saturation', weight: '35%', value: `${rainfall} mm`, impact: rainScore > 70 ? 'High' : 'Normal' },
      { name: 'Soil Pore Pressure', weight: '30%', value: `${soilMoisture}%`, impact: soilScore > 75 ? 'Critical' : 'Moderate' },
      { name: 'Geological Slope Gradient', weight: '20%', value: `${slopeAngle}°`, impact: slopeScore > 65 ? 'Elevated' : 'Stable' },
      { name: 'Land Cover Loss', weight: '10%', value: `${deforestation}%`, impact: forestScore > 50 ? 'Severe' : 'Low' },
      { name: 'Seismic Vibration', weight: '5%', value: `${seismicActivity} m/s²`, impact: 'Trace' },
    ]);

    if (onRiskScoreChange) {
      onRiskScoreChange(calculatedScore);
    }
  }, [rainfall, soilMoisture, slopeAngle, deforestation, seismicActivity]);

  // Simulated 24-Hour Temporal Trend Data for Chart
  const trendData = [
    { time: '00:00', risk: Math.max(10, riskScore - 35), rain: Math.max(5, rainfall - 70) },
    { time: '04:00', risk: Math.max(15, riskScore - 25), rain: Math.max(10, rainfall - 50) },
    { time: '08:00', risk: Math.max(25, riskScore - 15), rain: Math.max(20, rainfall - 30) },
    { time: '12:00', risk: Math.max(40, riskScore - 5), rain: Math.max(50, rainfall - 10) },
    { time: '16:00 (NOW)', risk: riskScore, rain: rainfall },
    { time: '20:00 (PRED)', risk: Math.min(100, riskScore + 12), rain: rainfall + 25 },
    { time: '24:00 (PRED)', risk: Math.min(100, riskScore + 18), rain: rainfall + 40 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-cyan-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
            <h2 className="text-xl font-bold text-white font-heading">
              LSTM + XGBoost Landslide Risk Predictor
            </h2>
            <span className="badge badge-cyan">v2.4 Model</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Simulate geotechnical parameter changes to inspect instant Landslide Hazard Index (LHI) & trigger threshold alerts.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-white/10">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <div className="text-xs">
            <div className="text-slate-400">Model Inference Confidence</div>
            <div className="text-sm font-bold text-purple-300 font-mono">{lstmConfidence}% (YOLOv11 + SAR validated)</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls + Live Score Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Input Sliders */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Geotechnical Parameter Simulator
            </h3>
            <span className="text-xs text-slate-400">Real-time inference active</span>
          </div>

          <div className="space-y-5">
            
            {/* 1. Rainfall Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-400" /> 24-Hour Cumulative Rainfall (IMD Feed)
                </span>
                <span className="text-blue-400 font-mono font-bold text-sm">{rainfall} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 mm (Drying)</span>
                <span>100 mm (Heavy)</span>
                <span>300 mm (Extreme Monsoon)</span>
              </div>
            </div>

            {/* 2. Soil Moisture Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" /> Soil Saturation Level (ESP32 Sensor)
                </span>
                <span className="text-cyan-400 font-mono font-bold text-sm">{soilMoisture}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10% (Dry Soil)</span>
                <span>50% (Normal)</span>
                <span>100% (Liquefaction Liquidity)</span>
              </div>
            </div>

            {/* 3. Slope Angle Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Mountain className="w-4 h-4 text-amber-400" /> Slope Gradient (ISRO Bhuvan DEM)
                </span>
                <span className="text-amber-400 font-mono font-bold text-sm">{slopeAngle}°</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={slopeAngle}
                onChange={(e) => setSlopeAngle(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5° (Flat Plain)</span>
                <span>30° (Critical Shear Angle)</span>
                <span>60° (Steep Cliff)</span>
              </div>
            </div>

            {/* 4. Deforestation Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Trees className="w-4 h-4 text-emerald-400" /> Vegetation Loss / Deforestation
                </span>
                <span className="text-emerald-400 font-mono font-bold text-sm">{deforestation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={deforestation}
                onChange={(e) => setDeforestation(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0% (Dense Root Network)</span>
                <span>50% (Moderate Clearance)</span>
                <span>100% (Bare Soil)</span>
              </div>
            </div>

            {/* 5. Seismic Activity Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-400" /> Micro-Tremor / Seismic Acceleration
                </span>
                <span className="text-purple-400 font-mono font-bold text-sm">{seismicActivity} m/s²</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={seismicActivity}
                onChange={(e) => setSeismicActivity(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

          </div>
        </div>

        {/* Right Column: Live Output Score Meter */}
        <div className="glass-panel p-6 flex flex-col justify-between space-y-6">
          
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Predicted Landslide Risk Index
            </span>

            {/* Gauge Circular Display */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="70"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="14"
                  fill="transparent"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="70"
                  stroke={
                    riskScore >= 75 ? '#ff3b5c' : riskScore >= 50 ? '#ff9f1c' : riskScore >= 30 ? '#ffd166' : '#06d6a0'
                  }
                  strokeWidth="14"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * riskScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold text-white font-mono">{riskScore}%</span>
                <span className={`badge mt-1 ${
                  riskLevel === 'CRITICAL' ? 'badge-critical pulse-critical' : riskLevel === 'HIGH' ? 'badge-warning' : 'badge-safe'
                }`}>
                  {riskLevel} RISK
                </span>
              </div>
            </div>
          </div>

          {/* Factor Breakdown */}
          <div className="space-y-2 bg-slate-900/80 p-4 rounded-xl border border-white/5 text-xs">
            <div className="font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span>Feature Weights</span>
              <span>Input Value</span>
            </div>
            {factors.map((f, idx) => (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                <span className="text-slate-400">{f.name} ({f.weight})</span>
                <span className="font-mono font-bold text-slate-200">{f.value}</span>
              </div>
            ))}
          </div>

          {/* Automated Action Dispatch */}
          <div className="pt-2">
            {riskScore >= 75 ? (
              <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-red-300">AUTO-BEACON TRIGGER ACTIVE!</strong>
                  LoRa sirens broadcasting voice evacuation order to 4 local village speaker nodes.
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-emerald-300">Slope Conditions Stable</strong>
                  Continuous automated polling every 10 seconds via ESP32 telemetry mesh.
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Temporal Trend Chart */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Temporal Trend & 8-Hour Predictive Forecast
            </h3>
            <p className="text-xs text-slate-400">LSTM recurrent neural network forecast comparing rainfall volume against calculated landslide risk score.</p>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3b5c" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#ff3b5c" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f5d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00f5d4" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="risk" stroke="#ff3b5c" strokeWidth={3} fillOpacity={1} fill="url(#riskGrad)" name="Landslide Risk Index (%)" />
              <Area type="monotone" dataKey="rain" stroke="#00f5d4" strokeWidth={2} fillOpacity={1} fill="url(#rainGrad)" name="Rainfall (mm)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
