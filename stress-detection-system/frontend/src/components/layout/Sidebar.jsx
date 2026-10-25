import React from 'react';
import { Activity, History, Sliders, ShieldCheck, HeartPulse, BrainCircuit, Award, Brain } from 'lucide-react';
import { logoImg } from '../../assets';

export const Sidebar = ({ activeTab, onTabChange, activeClassifier, onClassifierChange }) => {
  const navItems = [
    { id: 'realtime', label: 'Live Monitoring', icon: Activity },
    { id: 'tests', label: 'Patient Testing', icon: Brain },
    { id: 'history', label: 'Session History', icon: History },
    { id: 'benchmarks', label: 'Clinical Benchmark', icon: Award },
  ];

  return (
    <aside className="w-64 bg-dark-900 border-r border-dark-700/60 flex flex-col justify-between p-5 select-none shrink-0">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 py-3 mb-8">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/30 p-0.5 shadow-lg shadow-cyan-500/20 bg-dark-800">
            <img src={logoImg} alt="Brand Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              NeuroPulse
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">ML</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Stress Detection Sys</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800/60'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Model Switcher */}
        <div className="mt-8 pt-6 border-t border-dark-700/60">
          <div className="flex items-center gap-2 px-2 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <BrainCircuit size={14} />
            <span>Classifier Model</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 bg-dark-800 p-1 rounded-xl border border-dark-700/60 text-xs">
            <button
              onClick={() => onClassifierChange('random_forest')}
              className={`py-1.5 px-2 rounded-lg font-medium transition-all ${
                activeClassifier === 'random_forest'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Random Forest
            </button>
            <button
              onClick={() => onClassifierChange('svm')}
              className={`py-1.5 px-2 rounded-lg font-medium transition-all ${
                activeClassifier === 'svm'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SVM (RBF)
            </button>
          </div>
        </div>
      </div>

      {/* Footer Status */}
      <div className="bg-dark-800/40 border border-dark-700/40 rounded-xl p-3 flex items-center gap-2.5">
        <ShieldCheck className="text-emerald-400 shrink-0" size={18} />
        <div>
          <div className="text-[11px] font-semibold text-slate-300">Signal Integrity</div>
          <div className="text-[10px] text-emerald-400 font-medium">SMOTE Balanced • 64Hz</div>
        </div>
      </div>
    </aside>
  );
};
