import React from 'react';
import { Thermometer, TrendingDown, TrendingUp, Minus } from 'lucide-react';

export const TemperatureMonitor = ({ temperature = 33.4, tempSlope = -0.04 }) => {
  // Vasoconstriction warning under acute stress drops finger temperature rapidly
  const isDropping = tempSlope < -0.05;
  const isRising = tempSlope > 0.05;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
            {temperature.toFixed(1)}°C
          </span>
          <span className="text-xs text-slate-400 font-medium">({((temperature * 9/5) + 32).toFixed(1)}°F)</span>
        </div>

        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
          isDropping
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            : isRising
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
        }`}>
          {isDropping ? <TrendingDown size={14} /> : isRising ? <TrendingUp size={14} /> : <Minus size={14} />}
          <span>{isDropping ? 'Vasoconstriction' : isRising ? 'Vasodilation' : 'Stable'}</span>
        </div>
      </div>

      {/* Thermometer scale bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>30.0°C (Cold/Stress)</span>
          <span>36.5°C (Warm/Calm)</span>
        </div>
        <div className="w-full h-2.5 bg-dark-900 rounded-full overflow-hidden p-0.5 border border-dark-700/60">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-400"
            style={{
              width: `${Math.min(100, Math.max(5, ((temperature - 30.0) / 6.5) * 100))}%`
            }}
          />
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-dark-900/50 border border-dark-700/40 text-xs text-slate-300">
        <p className="flex items-center gap-1.5 text-slate-400">
          Rate of Change: <strong className="font-mono text-white">{tempSlope.toFixed(3)} °C/min</strong>
        </p>
      </div>
    </div>
  );
};
