import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { getStressLevelColor } from '../../utils/signalFormatting';

export const StressLevelBadge = ({ stressLevel = 'BASELINE', confidence = 0.92, classifier = 'random_forest' }) => {
  const meta = getStressLevelColor(stressLevel);

  const getIcon = () => {
    switch (stressLevel) {
      case 'HIGH_STRESS':
        return <AlertTriangle size={18} className="animate-bounce" />;
      case 'LOW_STRESS':
        return <ShieldAlert size={18} />;
      case 'RECOVERY':
        return <Sparkles size={18} />;
      default:
        return <CheckCircle size={18} />;
    }
  };

  return (
    <div className={`p-4 rounded-2xl border ${meta.bg} ${meta.border} ${meta.glow} transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${meta.border} ${meta.text}`}>
            {getIcon()}
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Classified State</div>
            <div className={`text-xl font-extrabold tracking-tight ${meta.text}`}>
              {meta.label}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] font-semibold text-slate-400">Confidence</div>
          <div className="text-xl font-extrabold font-mono text-white">
            {(confidence * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <span>Inference Engine: <strong className="text-slate-200 capitalize font-mono">{classifier.replace('_', ' ')}</strong></span>
        <span>Decision: <strong className="text-slate-200">Real-time (30s window)</strong></span>
      </div>
    </div>
  );
};
