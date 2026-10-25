import React, { useState } from 'react';
import { X, Sliders, Cpu, Clock, Volume2, Save, Check } from 'lucide-react';

export const SettingsModal = ({
  isOpen,
  onClose,
  activeClassifier,
  onClassifierChange,
  windowDuration = 60,
  onWindowDurationChange
}) => {
  const [currentDuration, setCurrentDuration] = useState(windowDuration);
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [haptics, setHaptics] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onWindowDurationChange(currentDuration);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-[32px] p-8 shadow-[0_25px_70px_rgba(0,0,0,0.14)] text-[#0a0d14]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-[#0a0d14] rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200/80 text-[#ff6a00]">
            <Sliders size={22} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#0a0d14] tracking-tight">System &amp; Telemetry Settings</h3>
            <p className="text-xs text-slate-500">Configure physiological windowing and ML inference engine</p>
          </div>
        </div>

        <div className="space-y-5 text-xs">
          {/* Classifier Selection */}
          <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-3">
            <div className="flex items-center gap-2 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <Cpu size={14} className="text-[#ff6a00]" />
              <span>Active Inference Engine</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onClassifierChange('random_forest')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activeClassifier === 'random_forest'
                    ? 'bg-orange-50/90 border-[#ff6a00] text-[#0a0d14] shadow-sm font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-[#0a0d14] hover:bg-slate-100/50'
                }`}
              >
                <div className="font-bold text-xs">Random Forest</div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-normal">150 Trees • Non-linear Gini</div>
              </button>

              <button
                type="button"
                onClick={() => onClassifierChange('svm')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  activeClassifier === 'svm'
                    ? 'bg-orange-50/90 border-[#ff6a00] text-[#0a0d14] shadow-sm font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-[#0a0d14] hover:bg-slate-100/50'
                }`}
              >
                <div className="font-bold text-xs">SVM (RBF Kernel)</div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-normal">Platt Probability Scaling</div>
              </button>
            </div>
          </div>

          {/* Sliding Window Duration */}
          <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <Clock size={14} className="text-[#ff6a00]" />
                <span>Feature Window Duration</span>
              </div>
              <span className="font-mono text-xs font-bold text-[#ff6a00] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                {currentDuration} Seconds
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
              Sets the temporal sliding window for computing HRV (RMSSD/LF-HF) and EDA tonic SCL components.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { sec: 30, label: '30s (Rapid)' },
                { sec: 60, label: '60s (Standard)' },
                { sec: 300, label: '300s (Baseline)' }
              ].map((opt) => (
                <button
                  key={opt.sec}
                  type="button"
                  onClick={() => setCurrentDuration(opt.sec)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    currentDuration === opt.sec
                      ? 'bg-orange-50/90 border-[#ff6a00] text-[#ff6a00] shadow-sm font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-[#0a0d14] hover:bg-slate-100/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audio & Alert Preferences */}
          <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 space-y-3">
            <div className="flex items-center gap-2 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <Volume2 size={14} className="text-[#ff6a00]" />
              <span>Biofeedback Bio-Alerts</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Auditory Chime on Acute Stress Trigger</span>
              <input
                type="checkbox"
                checked={audioAlerts}
                onChange={(e) => setAudioAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#ff6a00] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-700 font-medium">Automatic 4-7-8 Breathing Guidance Pop-up</span>
              <input
                type="checkbox"
                checked={haptics}
                onChange={(e) => setHaptics(e.target.checked)}
                className="w-4 h-4 accent-[#ff6a00] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-7 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl text-slate-500 hover:text-[#0a0d14] font-semibold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#ff5e00] to-[#ff9100] hover:from-[#e55400] hover:to-[#ff7b00] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98]"
          >
            {savedSuccess ? <Check size={14} /> : <Save size={14} />}
            <span>{savedSuccess ? 'Settings Saved' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
