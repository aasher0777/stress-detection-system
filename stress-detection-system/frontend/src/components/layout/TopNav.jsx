import React from 'react';
import { Wifi, WifiOff, User, Radio, Play, Pause, Flame } from 'lucide-react';

export const TopNav = ({
  subjectId,
  isConnected,
  isSimulating,
  onToggleSimulation,
  stressBias,
  onStressBiasChange
}) => {
  return (
    <header className="h-16 bg-dark-900/80 backdrop-blur-md border-b border-dark-700/60 px-6 flex items-center justify-between z-10 shrink-0">
      {/* Subject badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-700/80 text-xs">
          <User size={14} className="text-indigo-400" />
          <span className="text-slate-400">Subject:</span>
          <span className="font-semibold text-white font-mono">{subjectId}</span>
        </div>

        {/* Live Stream Indicator */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
          isConnected
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
        }`}>
          {isConnected ? <Wifi size={12} className="animate-pulse" /> : <WifiOff size={12} />}
          <span>{isConnected ? 'Telemetry Online' : 'Disconnected'}</span>
        </div>
      </div>

      {/* Simulator Stress Injector Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-dark-800/80 border border-dark-700/60 px-3 py-1 rounded-xl">
          <Flame size={14} className={stressBias > 0.5 ? 'text-rose-400 animate-bounce' : 'text-slate-400'} />
          <span className="text-xs text-slate-300 font-medium">Inject Stress:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={stressBias}
            onChange={(e) => onStressBiasChange(parseFloat(e.target.value))}
            className="w-24 h-1.5 bg-dark-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="text-xs font-mono text-indigo-400 w-7 text-right">
            {(stressBias * 100).toFixed(0)}%
          </span>
        </div>

        <button
          onClick={onToggleSimulation}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
            isSimulating
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
              : 'bg-indigo-600/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30'
          }`}
        >
          {isSimulating ? <Pause size={13} /> : <Play size={13} />}
          <span>{isSimulating ? 'Pause Stream' : 'Resume'}</span>
        </button>
      </div>
    </header>
  );
};
