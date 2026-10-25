/**
 * Utility functions for formatting physiological metrics and status displays.
 */

export const formatBpm = (val) => {
  if (val === undefined || val === null) return "--";
  return `${Math.round(val)} BPM`;
};

export const formatHrv = (val) => {
  if (val === undefined || val === null) return "--";
  return `${Number(val).toFixed(1)} ms`;
};

export const formatEda = (val) => {
  if (val === undefined || val === null) return "--";
  return `${Number(val).toFixed(2)} µS`;
};

export const formatTemperature = (val, unit = 'C') => {
  if (val === undefined || val === null) return "--";
  if (unit === 'F') {
    const fahrenheit = (val * 9/5) + 32;
    return `${fahrenheit.toFixed(1)} °F`;
  }
  return `${Number(val).toFixed(1)} °C`;
};

export const getClinicalStatusDetails = (status) => {
  switch (status) {
    case 'DR_CONSULTANT_REQUIRED':
    case 'DOCTOR_CONSULTATION_REQUIRED':
      return {
        key: 'DR_CONSULTANT_REQUIRED',
        label: 'Dr. Consultant Required',
        badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30',
        cardBg: 'bg-rose-950/20 border-rose-500/30 text-rose-300',
        accentColor: '#f43f5e',
        tag: 'Clinical Action Required',
        summary: 'Elevated Autonomic Vulnerability & Severe Cognitive Strain',
        recommendation: 'Immediate consultation with neurologist or clinical specialist recommended for comprehensive neuro-cognitive battery (MoCA/MMSE) and 24-hr autonomic monitoring.'
      };
    case 'GOOD':
      return {
        key: 'GOOD',
        label: 'Good Resilience',
        badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
        cardBg: 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300',
        accentColor: '#10b981',
        tag: 'Optimal Performance',
        summary: 'Robust Cognitive Flexibility & Superior Vagal Recovery',
        recommendation: 'Optimal cognitive-autonomic health confirmed. Patient maintains high prefrontal executive control under stress.'
      };
    case 'NORMAL':
      return {
        key: 'NORMAL',
        label: 'Normal Adaptive Response',
        badgeClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30',
        cardBg: 'bg-indigo-950/30 border-indigo-500/30 text-indigo-200',
        accentColor: '#0284c7',
        tag: 'Standard Healthy',
        summary: 'Normal Autonomic Cognitive Stress Resilience',
        recommendation: 'Healthy physiological adaptation to cognitive load. Autonomic recovery matches expected age-adjusted baseline.'
      };
    case 'BASELINE':
    default:
      return {
        key: 'BASELINE',
        label: 'Baseline Calibrated',
        badgeClass: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30',
        cardBg: 'bg-slate-900/40 border-slate-700/60 text-slate-300',
        accentColor: '#64748b',
        tag: 'Resting State',
        summary: 'Resting Autonomic Homeostasis & Calibrated Equilibrium',
        recommendation: 'Patient is at resting baseline with calm parasympathetic tone and nominal physiological metrics.'
      };
  }
};

export const getStressLevelColor = (level) => {
  switch (level) {
    case 'BASELINE':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-500 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
        label: 'Baseline (Relaxed)'
      };
    case 'GOOD':
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-600 dark:text-emerald-300',
        border: 'border-emerald-500/40',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
        label: 'Good Resilience'
      };
    case 'NORMAL':
    case 'LOW_STRESS':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-500 dark:text-amber-400',
        border: 'border-amber-500/30',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
        label: level === 'NORMAL' ? 'Normal Adaptive' : 'Mild Stress'
      };
    case 'DR_CONSULTANT_REQUIRED':
    case 'DOCTOR_CONSULTATION_REQUIRED':
      return {
        bg: 'bg-rose-500/20',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-500/50',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.35)]',
        label: 'Dr. Consultant Required'
      };
    case 'HIGH_STRESS':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-500 dark:text-rose-400',
        border: 'border-rose-500/30',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
        label: 'High Stress'
      };
    case 'RECOVERY':
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-500 dark:text-blue-400',
        border: 'border-blue-500/30',
        glow: 'shadow-[0_0_15px_rgba(59,130,246,0.25)]',
        label: 'Recovery Phase'
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-500 dark:text-slate-400',
        border: 'border-slate-500/30',
        glow: '',
        label: 'Awaiting Signal'
      };
  }
};

