import React from 'react';
import { Heart, Activity } from 'lucide-react';

export const HeartRateVariabilityGauge = ({ rmssd = 35.0, sdnn = 42.0, meanHr = 72.0 }) => {
  // Gauge range: 0ms (severe stress) to 100ms (high vagal tone / deep relaxation)
  const clampedRmssd = Math.max(0, Math.min(100, rmssd));
  const normalized = clampedRmssd / 100;
  
  // SVG circular arc calculations
  const radius = 70;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Use a 240-degree arc
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - (normalized * arcLength);

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-44 h-36 flex items-center justify-center">
        <svg className="w-full h-full -rotate-120" viewBox="0 0 160 160">
          {/* Background track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#1f2937"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Active progress */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="url(#hrvGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
          <defs>
            <linearGradient id="hrvGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          <Heart size={20} className="text-rose-500 animate-pulse mb-1" />
          <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
            {rmssd.toFixed(1)}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">RMSSD (ms)</span>
        </div>
      </div>

      {/* Sub metrics */}
      <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-dark-700/60 text-center">
        <div>
          <span className="text-[11px] text-slate-400">Pulse (HR)</span>
          <p className="text-sm font-bold font-mono text-slate-200">{Math.round(meanHr)} BPM</p>
        </div>
        <div>
          <span className="text-[11px] text-slate-400">SDNN</span>
          <p className="text-sm font-bold font-mono text-slate-200">{sdnn.toFixed(1)} ms</p>
        </div>
      </div>
    </div>
  );
};
