import React, { useState, useRef, useEffect } from 'react';
import {
  Camera, MapPin, Upload, Send, CheckCircle2, AlertTriangle, Clock,
  Trash2, Eye, Image, Video, MessageSquare, ChevronDown, Globe, Loader,
  Mountain, Waves, TreePine, Construction, Users, Filter, RefreshCw
} from 'lucide-react';

const REPORT_TYPES = [
  { id: 'crack', label: 'Ground / Wall Crack', icon: Mountain, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { id: 'slope', label: 'Slope Movement', icon: Mountain, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { id: 'road_block', label: 'Road Blockage', icon: Construction, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { id: 'flood', label: 'Flash Flood / Water Logging', icon: Waves, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'tree_fall', label: 'Tree Fall / Debris', icon: TreePine, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'evacuation', label: 'Evacuation Help Needed', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
];

const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिंदी' },
  { id: 'as', label: 'অসমীয়া' },
  { id: 'bn', label: 'বাংলা' },
  { id: 'naga', label: 'Nagamese' },
];

const PLACEHOLDER_TEXTS = {
  en: 'Describe what you see — cracks, water flow, road damage, number of people stranded...',
  hi: 'जो आप देख रहे हैं उसका वर्णन करें — दरारें, पानी का बहाव, सड़क क्षति...',
  as: 'আপুনি কি দেখিছে সেয়া বৰ্ণনা কৰক — ফাট, পানীৰ প্ৰবাহ...',
  bn: 'আপনি যা দেখছেন তা বর্ণনা করুন — ফাটল, জলের প্রবাহ...',
  naga: 'Describe what you see — cracks, water, road damage, people stranded...',
};

// Simulated past community reports
const INITIAL_REPORTS = [
  {
    id: 'R001', type: 'slope', location: 'Tadong Ridge, Gangtok', coords: '27.3394°N, 88.6102°E',
    time: '14 mins ago', severity: 'CRITICAL', status: 'VERIFIED',
    description: 'Large slope movement visible. Soil moving downward near NH10. Approximately 50 residents near zone.',
    reporter: 'Field Officer Rajit Sharma', media: 'photo', upvotes: 12,
  },
  {
    id: 'R002', type: 'road_block', location: 'Ranipool – Singtam Highway', coords: '27.3099°N, 88.5498°E',
    time: '42 mins ago', severity: 'HIGH', status: 'DISPATCHED',
    description: 'Road completely blocked by debris. 3 vehicles stranded. Water flowing over debris pile.',
    reporter: 'Citizen: Priya Rai', media: 'video', upvotes: 8,
  },
  {
    id: 'R003', type: 'crack', location: 'Burtuk Village, Lower Hill Zone', coords: '27.3311°N, 88.5953°E',
    time: '1h 15m ago', severity: 'HIGH', status: 'UNDER REVIEW',
    description: 'New crack appeared on embankment wall near community hall. Crack width approx 8cm, length 4 meters.',
    reporter: 'Panchayat Member D. Gurung', media: 'photo', upvotes: 6,
  },
  {
    id: 'R004', type: 'flood', location: 'Rangpo River Bank', coords: '27.1771°N, 88.5299°E',
    time: '2h ago', severity: 'MODERATE', status: 'MONITORING',
    description: 'River bank overflowing. Water level rising rapidly. 2 households at immediate risk.',
    reporter: 'Citizen: Suman Tamang', media: 'photo', upvotes: 4,
  },
  {
    id: 'R005', type: 'tree_fall', location: 'Deorali Market Area', coords: '27.3476°N, 88.5953°E',
    time: '3h ago', severity: 'LOW', status: 'RESOLVED',
    description: 'Large tree fell across footpath. No casualties reported. Road access still available.',
    reporter: 'Citizen: Aman Lama', media: null, upvotes: 2,
  },
];

const SEVERITY_COLORS = {
  CRITICAL: 'badge-critical',
  HIGH: 'badge-warning',
  MODERATE: 'text-yellow-300 bg-yellow-500/10 border border-yellow-500/30',
  LOW: 'badge-safe',
};

const STATUS_COLORS = {
  VERIFIED: 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/30',
  DISPATCHED: 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/30',
  'UNDER REVIEW': 'text-amber-300 bg-amber-500/10 border border-amber-500/30',
  MONITORING: 'text-blue-300 bg-blue-500/10 border border-blue-500/30',
  RESOLVED: 'text-slate-400 bg-slate-500/10 border border-slate-500/30',
  PENDING: 'text-purple-300 bg-purple-500/10 border border-purple-500/30',
};

export default function FieldReporter() {
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('en');
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [activePanel, setActivePanel] = useState('report'); // 'report' | 'feed'
  const fileInputRef = useRef(null);

  // Simulate gps
  const handleGetLocation = () => {
    setLocating(true);
    setTimeout(() => {
      const lat = (27.30 + Math.random() * 0.08).toFixed(4);
      const lng = (88.55 + Math.random() * 0.08).toFixed(4);
      setCoords(`${lat}°N, ${lng}°E`);
      setLocation('Auto-detected via GPS (NER Sikkim Sector)');
      setLocating(false);
    }, 1800);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(f => ({
      name: f.name,
      type: f.type.startsWith('video') ? 'video' : 'photo',
      size: (f.size / 1024).toFixed(1) + ' KB',
      preview: URL.createObjectURL(f),
    }));
    setUploadedFiles(prev => [...prev, ...newFiles].slice(0, 3));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedType || !description) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const typeInfo = REPORT_TYPES.find(t => t.id === selectedType);
      const newReport = {
        id: `R00${reports.length + 1}`,
        type: selectedType,
        location: location || 'Location pending verification',
        coords: coords || 'Coords pending',
        time: 'Just now',
        severity: description.length > 100 ? 'HIGH' : 'MODERATE',
        status: 'PENDING',
        description,
        reporter: 'You (Field Reporter)',
        media: uploadedFiles.length > 0 ? uploadedFiles[0].type : null,
        upvotes: 0,
      };
      setReports(prev => [newReport, ...prev]);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setSelectedType(null);
      setDescription('');
      setLocation('');
      setCoords(null);
      setUploadedFiles([]);
      setTimeout(() => {
        setSubmitSuccess(false);
        setActivePanel('feed');
      }, 2500);
    }, 2000);
  };

  const filteredReports = reports.filter(r =>
    severityFilter === 'ALL' ? true : r.severity === severityFilter
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="glass-panel p-6 border-l-4 border-l-purple-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white font-heading">
              Citizen Field Reporter Portal
            </h2>
            <span className="badge badge-purple">Requirement (e)</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Upload geo-tagged photos & videos of slope movement, cracks, road blockages, or flood conditions directly to SDRF Command.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10">
            <div className="text-xl font-bold text-white font-mono">{reports.length}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Reports Today</div>
          </div>
          <div className="text-center px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10">
            <div className="text-xl font-bold text-red-400 font-mono">
              {reports.filter(r => r.severity === 'CRITICAL').length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Critical</div>
          </div>
          <div className="text-center px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10">
            <div className="text-xl font-bold text-emerald-400 font-mono">
              {reports.filter(r => r.status === 'RESOLVED').length}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Resolved</div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActivePanel('report')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activePanel === 'report'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Camera className="w-4 h-4" /> Submit New Report
        </button>
        <button
          onClick={() => setActivePanel('feed')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activePanel === 'feed'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Eye className="w-4 h-4" /> Community Report Feed
          <span className="ml-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {reports.filter(r => r.status === 'PENDING' || r.severity === 'CRITICAL').length}
          </span>
        </button>
      </div>

      {/* PANEL 1: SUBMIT REPORT FORM */}
      {activePanel === 'report' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left: Form */}
          <div className="glass-panel p-6 space-y-5">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Send className="w-4 h-4 text-purple-400" /> New Field Incident Report
            </h3>

            {/* Success State */}
            {submitSuccess && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 flex items-center gap-3 text-sm font-semibold">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div>Report submitted successfully!</div>
                  <div className="text-xs text-emerald-400 font-normal mt-0.5">Your report has been forwarded to SDRF Command Dashboard.</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Language Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" /> Report Language
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.map(l => (
                    <button key={l.id} type="button"
                      onClick={() => setLanguage(l.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        language === l.id
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Incident Type */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Incident Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  {REPORT_TYPES.map(t => {
                    const Icon = t.icon;
                    return (
                      <button key={t.id} type="button"
                        onClick={() => setSelectedType(t.id)}
                        className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                          selectedType === t.id
                            ? `${t.bg} ${t.border} ${t.color}`
                            : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${selectedType === t.id ? t.color : 'text-slate-500'}`} />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Description *</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={PLACEHOLDER_TEXTS[language]}
                  rows={4}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 p-3 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <div className="text-right text-[10px] text-slate-500">{description.length} / 500 chars</div>
              </div>

              {/* GPS Location */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" /> Geo-Location
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Village / Landmark name..."
                    className="flex-1 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 px-3 py-2.5 focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locating}
                    className="px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-cyan-400 hover:bg-slate-700 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {locating ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                    {locating ? 'Locating...' : 'GPS'}
                  </button>
                </div>
                {coords && (
                  <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Coordinates: {coords}
                  </div>
                )}
              </div>

              {/* Media Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5 text-amber-400" /> Photo / Video Evidence (max 3)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 hover:border-purple-500/40 rounded-xl p-5 text-center cursor-pointer transition-all group"
                >
                  <Upload className="w-7 h-7 text-slate-600 group-hover:text-purple-400 mx-auto transition-colors mb-2" />
                  <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                    Click to upload photos or videos
                  </p>
                  <p className="text-[10px] text-slate-600 mt-1">JPG, PNG, MP4 — Max 10MB each</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {uploadedFiles.length > 0 && (
                  <div className="space-y-1.5">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-900/80 rounded-lg px-3 py-2 text-xs border border-white/5">
                        {f.type === 'video' ? <Video className="w-3.5 h-3.5 text-blue-400" /> : <Image className="w-3.5 h-3.5 text-amber-400" />}
                        <span className="text-slate-300 flex-1 truncate">{f.name}</span>
                        <span className="text-slate-500">{f.size}</span>
                        <button type="button" onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}>
                          <Trash2 className="w-3.5 h-3.5 text-slate-600 hover:text-red-400 transition-colors" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!selectedType || !description || isSubmitting}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader className="w-4 h-4 animate-spin" /> Submitting Report...</>
                ) : (
                  <><Send className="w-4 h-4" /> Submit to SDRF Command</>
                )}
              </button>
            </form>
          </div>

          {/* Right: Info Cards */}
          <div className="space-y-4">
            {/* How it works */}
            <div className="glass-panel p-5 space-y-4">
              <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" /> How Field Reporting Works
              </h4>
              <div className="space-y-3">
                {[
                  { step: '1', text: 'Select incident type & describe what you see', color: 'bg-purple-500/20 text-purple-300' },
                  { step: '2', text: 'Auto-tag your GPS location or enter landmark name', color: 'bg-cyan-500/20 text-cyan-300' },
                  { step: '3', text: 'Upload geo-tagged photos or video evidence', color: 'bg-amber-500/20 text-amber-300' },
                  { step: '4', text: 'Report goes live to SDRF Dashboard & AI Engine', color: 'bg-emerald-500/20 text-emerald-300' },
                  { step: '5', text: 'SDRF team verifies and dispatches response team', color: 'bg-red-500/20 text-red-300' },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3 text-xs">
                    <span className={`w-6 h-6 rounded-lg ${s.color} font-bold flex items-center justify-center shrink-0 text-[11px]`}>{s.step}</span>
                    <span className="text-slate-300 pt-0.5">{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Offline capability notice */}
            <div className="glass-panel p-5 space-y-3">
              <h4 className="text-sm font-bold text-white font-heading">📶 Works Without Internet</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                GeoShield Field Reporter supports <strong className="text-cyan-300">offline sync</strong>. Reports are saved locally and automatically transmitted via LoRa mesh relay when connectivity is restored — even in zero-signal zones.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-lg p-2 text-center">
                  <div className="text-emerald-400 font-bold">LoRa Sync</div>
                  <div className="text-slate-500 text-[10px]">Active</div>
                </div>
                <div className="bg-cyan-950/40 border border-cyan-500/20 rounded-lg p-2 text-center">
                  <div className="text-cyan-400 font-bold">Offline Mode</div>
                  <div className="text-slate-500 text-[10px]">Supported</div>
                </div>
              </div>
            </div>

            {/* Emergency contact */}
            <div className="glass-panel p-5 border border-red-500/20 space-y-2">
              <h4 className="text-sm font-bold text-red-300 flex items-center gap-2 font-heading">
                <AlertTriangle className="w-4 h-4" /> Life-Threatening Emergency?
              </h4>
              <p className="text-xs text-slate-300">Call SDRF Helpline immediately:</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-red-950/40 border border-red-500/30 rounded-lg p-2 text-center">
                  <div className="text-red-300 font-bold text-sm">1070</div>
                  <div className="text-slate-500 text-[10px]">State Emergency</div>
                </div>
                <div className="flex-1 bg-red-950/40 border border-red-500/30 rounded-lg p-2 text-center">
                  <div className="text-red-300 font-bold text-sm">112</div>
                  <div className="text-slate-500 text-[10px]">National Emergency</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PANEL 2: COMMUNITY REPORT FEED */}
      {activePanel === 'feed' && (
        <div className="space-y-4">

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Filter:</span>
              {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map(s => (
                <button
                  key={s}
                  onClick={() => setSeverityFilter(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    severityFilter === s
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Feed
            </button>
          </div>

          {/* Report Cards */}
          <div className="space-y-3">
            {filteredReports.map(report => {
              const typeInfo = REPORT_TYPES.find(t => t.id === report.type);
              const Icon = typeInfo?.icon || Mountain;
              return (
                <div
                  key={report.id}
                  className={`glass-panel p-5 space-y-3 border transition-all ${
                    report.severity === 'CRITICAL' ? 'border-red-500/30 panel-glow-critical' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl ${typeInfo?.bg || 'bg-slate-800'} border ${typeInfo?.border || 'border-white/10'} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-4.5 h-4.5 ${typeInfo?.color || 'text-slate-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">{typeInfo?.label || 'Incident'}</span>
                          <span className={`badge text-[10px] ${SEVERITY_COLORS[report.severity] || 'badge-safe'}`}>
                            {report.severity}
                          </span>
                          <span className={`badge text-[10px] ${STATUS_COLORS[report.status] || 'badge-safe'}`}>
                            {report.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                          <MapPin className="w-3 h-3" />
                          <span>{report.location}</span>
                          <span className="font-mono text-slate-600">· {report.coords}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 shrink-0">
                      <Clock className="w-3 h-3" /> {report.time}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pl-12">{report.description}</p>

                  <div className="pl-12 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {report.reporter}
                      </span>
                      {report.media && (
                        <span className="flex items-center gap-1 text-amber-400">
                          {report.media === 'video' ? <Video className="w-3 h-3" /> : <Image className="w-3 h-3" />}
                          {report.media === 'video' ? 'Video attached' : 'Photo attached'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <span className="text-slate-400 font-bold">↑ {report.upvotes}</span>
                      <span>confirms</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-600 font-mono pl-12">Report ID: {report.id}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
