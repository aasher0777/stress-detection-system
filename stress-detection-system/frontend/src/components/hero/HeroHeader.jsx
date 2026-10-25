import React from 'react';
import { User, Sliders, Brain, Activity, Sparkles, LogIn } from 'lucide-react';
import { logoImg } from '../../assets';

export const HeroHeader = ({
  onNavigate,
  onOpenAuth,
  onOpenSettings,
  onOpenProfile,
  currentUser,
  activeTab
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between pointer-events-auto select-none transition-all">
      {/* Left Custom Logo & Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#ff6a00]/40 p-0.5 shadow-[0_0_12px_rgba(255,106,0,0.25)] bg-white">
          <img src={logoImg} alt="Logo" className="w-full h-full object-cover rounded-full" />
        </div>
        <button
          onClick={() => onNavigate('hero')}
          className="text-xs tracking-[0.35em] font-medium text-slate-800 hover:text-[#ff6a00] uppercase transition-colors"
        >
          AMATERASU
        </button>
      </div>

      {/* Center Nav: Direct Access to Dashboard, Tests, Settings, Profile */}
      <nav className="hidden md:flex items-center gap-1.5 bg-white/90 backdrop-blur-xl border border-slate-200/80 px-3 py-1.5 rounded-full shadow-lg shadow-slate-200/50">
        <button
          onClick={() => onNavigate('realtime')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'realtime'
              ? 'bg-gradient-to-r from-[#ff5e00] to-[#ff9100] text-white shadow-md shadow-orange-500/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Activity size={13} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate('tests')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'tests'
              ? 'bg-gradient-to-r from-[#ff5e00] to-[#ff9100] text-white shadow-md shadow-orange-500/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Brain size={13} />
          <span>Patient Tests</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
        >
          <Sliders size={13} />
          <span>Settings</span>
        </button>

        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
        >
          <User size={13} />
          <span>{currentUser ? currentUser.name.split(' ')[0] : 'Profile'}</span>
        </button>
      </nav>

      {/* Right Menu: Vision & Login / Sign Up */}
      <div className="flex items-center gap-4">
        {currentUser ? (
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/30 text-[#d95200] text-xs font-bold hover:bg-[#ff6a00]/20 transition-all shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-[#ff6a00] animate-pulse" />
            <span>{currentUser.name}</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0a0d14] hover:bg-[#1f242d] text-white text-xs font-bold tracking-wide transition-all shadow-md"
          >
            <LogIn size={13} />
            <span>Sign In</span>
          </button>
        )}

        <button
          onClick={() => onNavigate('benchmarks')}
          className="text-[11px] tracking-[0.25em] font-bold text-slate-700 hover:text-[#ff6a00] uppercase transition-colors flex items-center gap-2"
        >
          <span>VISION</span>
          {/* 9-dot grid icon */}
          <div className="grid grid-cols-3 gap-0.5 opacity-70">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-slate-800 rounded-full" />
            ))}
          </div>
        </button>
      </div>
    </header>
  );
};
