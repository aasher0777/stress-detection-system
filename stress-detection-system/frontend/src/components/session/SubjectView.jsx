import React from 'react';
import { Heart, Activity, Wind, Sparkles, User, LogOut } from 'lucide-react';

export const SubjectView = ({ telemetry, currentUser, onLogout, onSwitchToResearcher }) => {
  const hr = telemetry?.heart_rate ? Math.round(telemetry.heart_rate) : 72;
  const rmssd = telemetry?.rmssd ? Number(telemetry.rmssd).toFixed(1) : '38.2';

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Subject Status Bar */}
      <div className="w-full flex items-center justify-between p-3.5 px-5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-[10px]">
            {currentUser?.name ? currentUser.name[0] : 'S'}
          </div>
          <span>Participant: <strong>{currentUser?.name || 'Subject Cohort'}</strong></span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
            SUBJECT ROLE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchToResearcher}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-semibold"
          >
            Switch to Researcher View
          </button>
          <button
            onClick={onLogout}
            className="text-slate-400 hover:text-white"
            title="Log Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Guided Breathing Sphere */}
      <div className="relative flex items-center justify-center">
        <div className="w-52 h-52 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-500/30 to-emerald-500/20 flex items-center justify-center border-2 border-cyan-400/40 shadow-[0_0_60px_rgba(6,182,212,0.35)] animate-pulse">
          <div className="text-center space-y-1">
            <Wind className="w-8 h-8 text-cyan-300 mx-auto animate-spin-slow opacity-80" />
            <div className="text-lg font-black font-mono tracking-widest text-white">BREATHE</div>
            <div className="text-[10px] text-cyan-300 uppercase tracking-widest font-semibold">4s In • 4s Out</div>
          </div>
        </div>
      </div>

      {/* Calming Guidance Text */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">Screening Session in Progress</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Please sit back comfortably and maintain slow, natural breathing. Your physiological signals are being monitored non-invasively for autonomic resilience calibration.
        </p>
      </div>

      {/* Minimal Biomarkers Tile */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Pulse</span>
            <div className="text-xl font-black font-mono text-emerald-400 mt-0.5">{hr} BPM</div>
          </div>
          <Heart size={22} className="text-emerald-400 animate-pulse" />
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Stability</span>
            <div className="text-xl font-black font-mono text-cyan-400 mt-0.5">{rmssd} ms</div>
          </div>
          <Activity size={22} className="text-cyan-400" />
        </div>
      </div>

      <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Connected to Safe Bio-Sensor Telemetry</span>
      </div>
    </div>
  );
};
