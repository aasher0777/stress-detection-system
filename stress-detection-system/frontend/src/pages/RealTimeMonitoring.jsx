import React from 'react';
import { Heart, Zap, Thermometer, Waves, ShieldAlert, Sparkles, Activity, Sliders, Play, RotateCcw } from 'lucide-react';
import { StatusCard } from '../components/common/StatusCard';
import { MetricWidget } from '../components/common/MetricWidget';
import { HeartRateVariabilityGauge } from '../components/dashboard/HeartRateVariabilityGauge';
import { EdaResponseChart } from '../components/dashboard/EdaResponseChart';
import { TemperatureMonitor } from '../components/dashboard/TemperatureMonitor';
import { StressLevelBadge } from '../components/dashboard/StressLevelBadge';
import { api } from '../services/api';

/**
 * Golden Ratio Telemetry Dashboard (61.8% Primary Stream / 38.2% Clinical Diagnostics)
 * - Strict typography hierarchy with generous whitespace to eliminate overlapping text
 * - Real-time biofeedback and acute autonomic stress monitoring
 */
export const RealTimeMonitoring = ({
  telemetry,
  features,
  stressState,
  edaHistory = [],
  activeClassifier
}) => {
  const triggerAcuteStress = () => {
    api.setStressBias(0.85).catch(() => {});
  };

  const triggerBaselineReset = () => {
    api.setStressBias(0.0).catch(() => {});
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Acute Bio-Alert Banner (Conditioned on Sympathetic Spike) */}
      {stressState?.alert_triggered && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between shadow-[0_0_25px_rgba(239,68,68,0.25)] animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <ShieldAlert size={22} className="animate-bounce" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Acute Sympathetic Surge Flagged</h4>
              <p className="text-xs text-rose-300 mt-0.5">
                {stressState.recommendation || "High electrodermal burst detected with rapid HRV contraction. Initiate vagal relaxation protocol."}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-rose-500/30 text-rose-200 uppercase tracking-wider">
            Clinical Trigger
          </span>
        </div>
      )}

      {/* Primary Golden Ratio Layout: 61.8% (Left Main Stream) / 38.2% (Right Diagnostic Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 61.8% Column (7 of 12 columns in lg grid) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Quick Metrics Bar: 4 Golden-Proportioned Metric Widgets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <MetricWidget
              label="Heart Rate"
              value={telemetry?.heart_rate ? Math.round(telemetry.heart_rate) : '--'}
              unit="BPM"
              icon={Heart}
              color="rose"
              change="Instantaneous"
            />
            <MetricWidget
              label="RMSSD (HRV)"
              value={features?.rmssd ? features.rmssd.toFixed(1) : '--'}
              unit="ms"
              icon={Activity}
              color="emerald"
              change="Vagal tone"
            />
            <MetricWidget
              label="EDA / GSR"
              value={telemetry?.eda ? telemetry.eda.toFixed(2) : '--'}
              unit="µS"
              icon={Zap}
              color="cyan"
              change="Conductance"
            />
            <MetricWidget
              label="Skin Temp"
              value={telemetry?.temperature ? telemetry.temperature.toFixed(1) : '--'}
              unit="°C"
              icon={Thermometer}
              color="amber"
              change="Perfusion"
            />
          </div>

          {/* Electrodermal Activity (EDA/GSR) Real-Time Response Chart */}
          <StatusCard
            title="Electrodermal Activity (EDA/GSR)"
            subtitle="Tonic Sympathetic Level (SCL) & Phasic Response Peaks (SCR)"
            icon={Zap}
          >
            <EdaResponseChart
              dataPoints={edaHistory}
              currentEda={telemetry?.eda || 3.4}
              scl={features?.eda_scl || 2.6}
              scrPeaks={features?.eda_scr_peaks || 2}
            />
          </StatusCard>

          {/* Spectral Sympathovagal Balance (LF/HF Ratio) Bar */}
          <div className="p-5 rounded-2xl bg-dark-800/80 border border-dark-700/60 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Waves size={16} className="text-indigo-400" />
                <h4 className="text-xs uppercase font-bold text-white tracking-wider">
                  Spectral Sympathovagal Balance (LF/HF Ratio)
                </h4>
              </div>
              <span className="font-mono text-sm font-bold text-indigo-400">
                {features?.lf_hf_ratio ? features.lf_hf_ratio.toFixed(2) : '1.45'}
              </span>
            </div>

            <div className="w-full h-2.5 bg-dark-900 rounded-full overflow-hidden p-0.5 border border-dark-700/60">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500"
                style={{
                  width: `${Math.min(100, Math.max(5, ((features?.lf_hf_ratio || 1.45) / 4.0) * 100))}%`
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Optimal Parasympathetic Zone (&lt;1.5)</span>
              <span>Sympathetic Dominance (&gt;2.5)</span>
            </div>
          </div>
        </div>

        {/* Right 38.2% Column (5 of 12 columns in lg grid) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Active Stress Classification State Badge */}
          <StressLevelBadge
            stressLevel={stressState?.stress_level || 'BASELINE'}
            confidence={stressState?.confidence || 0.94}
            classifier={activeClassifier}
          />

          {/* Heart Rate Variability Card */}
          <StatusCard
            title="Heart Rate Variability"
            subtitle="Time-Domain Vagal Assessment"
            icon={Heart}
          >
            <HeartRateVariabilityGauge
              rmssd={features?.rmssd || 36.2}
              sdnn={features?.sdnn || 44.5}
              meanHr={telemetry?.heart_rate || 72.0}
            />
          </StatusCard>

          {/* Peripheral Temperature & Perfusion Monitor */}
          <StatusCard
            title="Peripheral Temperature"
            subtitle="Vasomotor Sympathetic Reflex"
            icon={Thermometer}
          >
            <TemperatureMonitor
              temperature={telemetry?.temperature || 33.6}
              tempSlope={features?.temp_slope || -0.02}
            />
          </StatusCard>

          {/* Interactive Diagnostic Testing Controls */}
          <div className="p-4 rounded-2xl bg-dark-800/80 border border-dark-700/60 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Sliders size={14} className="text-cyan-400" />
              <span>Interactive Telemetry Controls</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={triggerAcuteStress}
                className="py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Play size={13} />
                <span>Inject Stress</span>
              </button>

              <button
                onClick={triggerBaselineReset}
                className="py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <RotateCcw size={13} />
                <span>Reset Baseline</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
