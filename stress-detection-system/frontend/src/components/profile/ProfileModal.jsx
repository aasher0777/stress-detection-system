import React from 'react';
import { X, LogOut, CheckCircle2 } from 'lucide-react';
import { cyberVisorHeroImg } from '../../assets';

export const ProfileModal = ({ isOpen, onClose, user, onLogout }) => {
  if (!isOpen) return null;

  const activeUser = user || {
    name: 'Dr. Alex Vance, MD',
    email: 'alex.vance@neurocognition.lab',
    role: 'Cognitive Neurologist & Screening Director'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-[32px] p-8 shadow-[0_25px_70px_rgba(0,0,0,0.14)] text-[#0a0d14]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-[#0a0d14] rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Profile Avatar & Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#ff5e00] to-[#ff9100] p-1 shadow-xl shadow-orange-500/25 mb-3">
            <div className="w-full h-full bg-white rounded-[22px] overflow-hidden flex items-center justify-center">
              <img src={cyberVisorHeroImg} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
          </div>

          <h3 className="text-xl font-extrabold text-[#0a0d14] tracking-tight">{activeUser.name}</h3>
          <p className="text-xs text-[#ff6a00] font-semibold mt-0.5">{activeUser.role}</p>
          <span className="text-[11px] text-slate-500 font-mono mt-1">{activeUser.email}</span>
        </div>

        {/* Clinical Activity Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[10px] uppercase font-bold text-slate-500">Patients Tested</div>
            <div className="text-lg font-black text-[#0a0d14] font-mono mt-0.5">142</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[10px] uppercase font-bold text-slate-500">Model Precision</div>
            <div className="text-lg font-black text-emerald-600 font-mono mt-0.5">100%</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[10px] uppercase font-bold text-slate-500">Active Device</div>
            <div className="text-lg font-black text-cyan-600 font-mono mt-0.5">E4-SIM</div>
          </div>
        </div>

        {/* Institutional Credentials */}
        <div className="space-y-2.5 mb-6 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <span className="text-slate-600 font-medium">Cognitive Screening Protocol:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80 flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-600" /> SWELL-KW Verified
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <span className="text-slate-600 font-medium">Security Clearance:</span>
            <span className="font-bold text-[#0a0d14] bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              Level 3 Clinical Supervisor
            </span>
          </div>
        </div>

        {/* Logout / Switch User */}
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <LogOut size={14} />
          <span>Switch Account / Sign Out</span>
        </button>
      </div>
    </div>
  );
};
