import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Activity } from 'lucide-react';

export const LiveBiometricChart = ({ telemetryHistory = [] }) => {
  return (
    <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Activity size={16} className="text-cyan-400" />
          <span>Real-Time Autonomic Bio-Telemetry Stream (HRV & Heart Rate)</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Live 2Hz Stream
        </span>
      </div>

      <div className="h-[220px] w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={telemetryHistory.length > 0 ? telemetryHistory : [
            { time: '0s', hr: 72, rmssd: 38 },
            { time: '5s', hr: 75, rmssd: 36 },
            { time: '10s', hr: 79, rmssd: 31 },
            { time: '15s', hr: 83, rmssd: 26 },
            { time: '20s', hr: 80, rmssd: 32 },
            { time: '25s', hr: 74, rmssd: 40 }
          ]}>
            <defs>
              <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="rmssdGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '12px',
                fontSize: '11px'
              }}
            />
            <Area
              type="monotone"
              dataKey="hr"
              stroke="#f43f5e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#hrGrad)"
              name="Heart Rate (BPM)"
            />
            <Area
              type="monotone"
              dataKey="rmssd"
              stroke="#06b6d4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#rmssdGrad)"
              name="HRV RMSSD (ms)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
