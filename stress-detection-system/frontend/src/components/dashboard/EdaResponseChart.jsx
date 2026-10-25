import React from 'react';
import { Zap } from 'lucide-react';

export const EdaResponseChart = ({ dataPoints = [], currentEda = 3.5, scl = 2.8, scrPeaks = 2 }) => {
  // SVG sparkline drawing
  const width = 300;
  const height = 90;
  const padding = 6;

  const points = dataPoints.slice(-25);
  const minVal = Math.min(...points, 0.5);
  const maxVal = Math.max(...points, 8.0);
  const range = maxVal - minVal || 1;

  const polylinePoints = points.map((val, idx) => {
    const x = padding + (idx / Math.max(1, points.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((val - minVal) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-3">
      {/* Live Value banner */}
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold font-mono tracking-tight text-cyan-400">
            {currentEda.toFixed(2)}
          </span>
          <span className="text-xs font-semibold text-slate-400">µS (Skin Conductance)</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <Zap size={12} />
          <span>{scrPeaks} Phasic Peaks</span>
        </div>
      </div>

      {/* SVG Waveform Chart */}
      <div className="w-full bg-dark-900/60 rounded-xl p-2 border border-dark-700/50 overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
          <defs>
            <linearGradient id="edaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="#374151" strokeDasharray="3 3" opacity="0.4" />
          <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="#374151" strokeDasharray="3 3" opacity="0.4" />
          <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="#374151" strokeDasharray="3 3" opacity="0.4" />

          {/* Area fill */}
          {points.length > 1 && (
            <polygon
              points={`${polylinePoints} ${width - padding},${height} ${padding},${height}`}
              fill="url(#edaGrad)"
            />
          )}

          {/* Polyline line graph */}
          {points.length > 1 && (
            <polyline
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePoints}
            />
          )}
        </svg>
      </div>

      {/* Tonic / SCL breakdown */}
      <div className="flex justify-between text-xs text-slate-400 pt-1">
        <span>Tonic Baseline (SCL): <strong className="text-slate-200 font-mono">{scl.toFixed(2)} µS</strong></span>
        <span>Phasic Reactivity: <strong className="text-slate-200 font-mono">{(currentEda - scl).toFixed(2)} µS</strong></span>
      </div>
    </div>
  );
};
