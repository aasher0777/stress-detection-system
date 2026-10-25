import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar as CalendarIcon,
  Sliders,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Activity,
  Heart,
  Thermometer,
  ShieldCheck,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Users,
  Brain,
  Award
} from 'lucide-react';
import { LiveBiometricChart } from '../components/charts/LiveBiometricChart';
import { api } from '../services/api';
import { logoImg, heroFacePng, cyberVisorHeroImg } from '../assets';

/**
 * Luminous Light Theme recreation of the "Do It" Dashboard
 * Strictly matching the Cyber Visor Hero color palette & aesthetic:
 * - Pure white chassis (#ffffff) with delicate slate borders and soft ambient shadows
 * - Radiant amber-orange active pills (#ff5e00 to #ff9100)
 * - Obsidian black typography (#0a0d14) with slate metadata (#64748b)
 * - Cybernetic Visor avatar integration
 */
export const DoItDashboard = ({
  telemetry,
  features,
  stressState,
  activeClassifier,
  onNavigate,
  onOpenSettings,
  onOpenProfile,
  onOpenAuth,
  currentUser
}) => {
  const [selectedDay, setSelectedDay] = useState(19);

  // Interactive Patient Screening Tasks Checklist
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Patient #108 - Stroop Conflict Test', time: 'Today, 09:30 AM', done: true },
    { id: 2, title: 'Resting Baseline HRV Calibration', time: 'Today, 10:15 AM', done: true },
    { id: 3, title: 'Serial 7s Mental Subtraction', time: 'Today, 11:00 AM', done: false },
    { id: 4, title: 'Digit Span Working Memory Recall', time: 'Today, 02:30 PM', done: false },
    { id: 5, title: '4-7-8 Vagal Restoration Pacing', time: 'Today, 04:00 PM', done: false }
  ]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // Real-time telemetry history for Recharts live curve
  const [chartHistory, setChartHistory] = useState([]);
  React.useEffect(() => {
    if (telemetry?.heart_rate) {
      setChartHistory((prev) => [
        ...prev.slice(-30),
        {
          time: new Date().toLocaleTimeString().split(' ')[0],
          hr: Math.round(telemetry.heart_rate),
          rmssd: features?.rmssd ? Number(features.rmssd.toFixed(1)) : 38.4
        }
      ]);
    }
  }, [telemetry?.heart_rate, features?.rmssd]);

  const triggerStress = () => {
    api.setStressBias(0.85).catch(() => {});
  };

  const triggerBaseline = () => {
    api.setStressBias(0.0).catch(() => {});
  };

  const userDisplayName = currentUser ? currentUser.name.split(' ')[0] : 'Dr. Alex';

  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4 lg:p-6 select-none animate-fade-in">
      {/* 
        Master Outer Frame (Luminous Light Theme matching Hero)
      */}
      <div className="w-full max-w-[1360px] bg-white border border-slate-200/90 rounded-[36px] shadow-[0_20px_70px_rgba(0,0,0,0.06)] p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 relative overflow-hidden">
        
        {/* =========================================================================
            LEFT INTEGRATED SIDEBAR (lg:col-span-3 xl:col-span-2)
            ========================================================================= */}
        <aside className="lg:col-span-3 xl:col-span-2 flex flex-col justify-between space-y-8 pr-2 lg:border-r border-slate-200/80">
          <div className="space-y-7">
            {/* Brand Header */}
            <div className="flex items-center gap-3 pl-2">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#ff6a00]/40 p-0.5 shadow-[0_0_15px_rgba(255,106,0,0.25)] bg-white">
                <img src={logoImg} alt="Logo" className="w-full h-full object-cover rounded-lg" />
              </div>
              <h2 className="text-xl font-extrabold text-[#0a0d14] tracking-tight flex items-center gap-1.5">
                Do it
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/25">ML</span>
              </h2>
            </div>

            {/* Navigation Menu with Radiant Amber-Orange Active Pill */}
            <nav className="space-y-2 text-xs font-semibold">
              <button
                onClick={() => onNavigate('realtime')}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#ff5e00] to-[#ff9100] text-white shadow-lg shadow-orange-500/30 transition-all font-bold"
              >
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('tests')}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-600 hover:text-[#0a0d14] hover:bg-slate-100 transition-all"
              >
                <Brain size={17} />
                <span>Patient Tests</span>
              </button>

              <button
                onClick={() => onNavigate('benchmarks')}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-600 hover:text-[#0a0d14] hover:bg-slate-100 transition-all"
              >
                <Award size={17} />
                <span>Benchmarks</span>
              </button>

              <button
                onClick={() => onNavigate('history')}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-600 hover:text-[#0a0d14] hover:bg-slate-100 transition-all"
              >
                <CalendarIcon size={17} />
                <span>Sessions</span>
              </button>

              <button
                onClick={onOpenSettings}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-slate-600 hover:text-[#0a0d14] hover:bg-slate-100 transition-all"
              >
                <Sliders size={17} />
                <span>Settings</span>
              </button>
            </nav>
          </div>

          {/* Bottom Upgrade/Screening Box & Logout */}
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-orange-50/70 border border-orange-200/70 text-center space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-[#0a0d14] leading-tight">
                Early Dementia Clinical Protocol
              </h4>
              <p className="text-[11px] text-slate-500">
                Continuous SWELL-KW HRV validation
              </p>
              <button
                onClick={() => onNavigate('tests')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff5e00] to-[#ff9100] hover:from-[#e55400] hover:to-[#ff7b00] text-white font-bold text-[11px] tracking-wide transition-all shadow-md shadow-orange-500/25"
              >
                Start Screening &gt;
              </button>
            </div>

            <button
              onClick={onOpenAuth}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* =========================================================================
            CENTER & RIGHT MAIN WORKSPACE (lg:col-span-9 xl:col-span-10)
            ========================================================================= */}
        <main className="lg:col-span-9 xl:col-span-10 space-y-6">
          
          {/* TOP ROW: Welcome Hero Card (Left 65%) + Profile & Calendar (Right 35%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 1. Large Top Welcome Card with Cyber Visor Avatar */}
            <div className="lg:col-span-7 xl:col-span-8 rounded-3xl bg-gradient-to-r from-orange-50/80 via-amber-50/40 to-white border border-orange-200/70 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
              <div className="space-y-4 z-10 max-w-sm">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a0d14] tracking-tight">
                  Hello, {userDisplayName}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                  Real-time cognitive screening active. Dual Random Forest &amp; SVM models monitoring autonomic balance.
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => onNavigate('tests')}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff5e00] to-[#ff9100] hover:from-[#e55400] hover:to-[#ff7b00] text-white font-bold text-xs shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <span>Run Screening</span>
                    <Sparkles size={14} />
                  </button>

                  <button
                    onClick={triggerStress}
                    className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-rose-600 hover:text-rose-700 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Play size={13} />
                    <span>Simulate Stress</span>
                  </button>
                </div>
              </div>

              {/* 3D Cyber Visor Avatar Character */}
              <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#ff6a00]/25 via-orange-400/20 to-transparent rounded-full blur-2xl animate-pulse" />
                <img
                  src={cyberVisorHeroImg}
                  alt="Cybernetic Cognition Avatar"
                  className="w-36 h-36 object-contain rounded-2xl filter contrast-[1.08] brightness-100 drop-shadow-[0_8px_25px_rgba(255,106,0,0.35)] border border-[#ff6a00]/30"
                />
              </div>
            </div>

            {/* 2. Top Right: User Profile Header & Mini Calendar */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-4">
              {/* User Profile Bar */}
              <div
                onClick={onOpenProfile}
                className="p-3 px-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between cursor-pointer hover:border-[#ff6a00]/50 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ff6a00] p-0.5 bg-white shadow-sm">
                    <img src={logoImg} alt="User avatar" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0a0d14]">{currentUser?.name || 'Dr. Alex Vance'}</div>
                    <div className="text-[10px] text-slate-500 font-medium">Cognitive Neurologist</div>
                  </div>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </div>

              {/* Interactive Mini Calendar Card */}
              <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#0a0d14]">
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon size={14} className="text-[#ff6a00]" />
                    <span>August 2026</span>
                  </span>
                  <div className="flex items-center gap-2 text-slate-400">
                    <button className="p-1 hover:text-[#0a0d14] rounded-lg hover:bg-slate-100"><ChevronLeft size={14} /></button>
                    <button className="p-1 hover:text-[#0a0d14] rounded-lg hover:bg-slate-100"><ChevronRight size={14} /></button>
                  </div>
                </div>

                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>

                {/* Calendar Numbers Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                  {[26, 27, 28, 29, 30, 31, 1].map((d, i) => (
                    <span key={i} className="py-1 text-slate-300">{d}</span>
                  ))}
                  {[2, 3, 4, 5, 6, 7, 8].map((d) => (
                    <span
                      key={d}
                      className={`py-1 rounded-xl transition-all cursor-pointer ${
                        [2, 3, 4].includes(d)
                          ? 'bg-orange-100 text-[#ff6a00] border border-orange-300 font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {d}
                    </span>
                  ))}
                  {[9, 10, 11, 12, 13, 14, 15].map((d) => (
                    <span key={d} className="py-1 text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer">{d}</span>
                  ))}
                  {[16, 17, 18, 19, 20, 21, 22].map((d) => (
                    <span
                      key={d}
                      onClick={() => setSelectedDay(d)}
                      className={`py-1 rounded-xl transition-all cursor-pointer ${
                        selectedDay === d
                          ? 'bg-gradient-to-r from-[#ff5e00] to-[#ff9100] text-white font-bold shadow-md shadow-orange-500/30'
                          : [19, 20].includes(d)
                          ? 'bg-orange-100 text-[#ff6a00]'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Recharts Live Bio-Telemetry Streaming Curve */}
          <LiveBiometricChart telemetryHistory={chartHistory} />

          {/* =========================================================================
              BOTTOM ROW: Today's Task (Left) + Biomarker Progress (Center) + Upcoming Events (Right)
              ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            
            {/* 1. Today's Task Checklist */}
            <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-[#0a0d14]">Today's Screening</h3>
                <button
                  onClick={() => onNavigate('tests')}
                  className="text-[11px] font-semibold text-[#ff6a00] hover:text-[#d95200]"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2.5">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className={`text-xs font-semibold transition-colors ${
                        t.done ? 'line-through text-slate-400' : 'text-slate-800 group-hover:text-[#0a0d14]'
                      }`}>
                        {t.title}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{t.time}</div>
                    </div>

                    {/* Circular Checkmark Button */}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      t.done
                        ? 'bg-[#ff6a00] text-white shadow-[0_0_10px_rgba(255,106,0,0.4)]'
                        : 'border-2 border-slate-300 group-hover:border-[#ff6a00]'
                    }`}>
                      {t.done && <CheckCircle2 size={13} className="fill-[#ff6a00] text-white" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Biomarker Progress Multi-Color Bars */}
            <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-[#0a0d14]">Biomarker Progress</h3>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  {stressState?.stress_level || 'BASELINE'}
                </span>
              </div>

              <div className="space-y-4 pt-1">
                {/* 1. RMSSD (Vagal HRV) - Radiant Amber Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">HRV Vagal Tone (RMSSD)</span>
                    <span className="font-mono text-xs font-bold text-[#ff6a00]">{features?.rmssd?.toFixed(1) || '38.4'} ms</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#ff5e00] to-[#ff9100] transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, ((features?.rmssd || 38.4) / 60) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* 2. EDA SCL - Cyan Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Electrodermal Level (SCL)</span>
                    <span className="font-mono text-xs font-bold text-cyan-600">{telemetry?.eda?.toFixed(2) || '2.92'} µS</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, ((telemetry?.eda || 2.92) / 10) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* 3. Skin Temperature - Yellow / Amber Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Vasomotor Skin Temp</span>
                    <span className="font-mono text-xs font-bold text-amber-600">{telemetry?.temperature?.toFixed(1) || '33.8'} °C</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, (((telemetry?.temperature || 33.8) - 30) / 7) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* 4. Spectral Ratio - Mint Green Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Spectral Sympathovagal (LF/HF)</span>
                    <span className="font-mono text-xs font-bold text-emerald-600">{features?.lf_hf_ratio?.toFixed(2) || '1.42'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, ((features?.lf_hf_ratio || 1.42) / 4) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Upcoming Clinical Sessions */}
            <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-[#0a0d14]">Upcoming Sessions</h3>
                <span className="text-[11px] text-slate-400 font-medium">Tomorrow</span>
              </div>

              <div className="space-y-3">
                {/* Event 1: Amber-Orange Accent Left Bar */}
                <div className="p-3.5 rounded-2xl bg-orange-50/50 border-l-4 border-l-[#ff6a00] border border-t-0 border-r-0 border-b-0 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-[#0a0d14]">Dementia Diagnostic Review</div>
                    <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#ff6a00] flex items-center justify-center">
                      <Brain size={14} />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                    <Clock size={11} />
                    <span>09:00 AM – 10:00 AM</span>
                  </div>
                </div>

                {/* Event 2: Cyan Accent Left Bar */}
                <div className="p-3.5 rounded-2xl bg-cyan-50/50 border-l-4 border-l-cyan-500 border border-t-0 border-r-0 border-b-0 space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-[#0a0d14]">Vagal Biofeedback Debrief</div>
                    <div className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                      <Heart size={14} />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                    <Clock size={11} />
                    <span>11:00 AM – 11:45 AM</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};
