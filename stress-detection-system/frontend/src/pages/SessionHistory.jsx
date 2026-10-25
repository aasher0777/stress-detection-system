import React from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle, ShieldCheck, Download } from 'lucide-react';
import { getStressLevelColor } from '../utils/signalFormatting';

export const SessionHistory = ({ history = [] }) => {
  // Mock history with all 4 clinical patient examination tiers if empty
  const displayHistory = history.length > 0 ? history : [
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      subject_id: 'PATIENT-101 (Arthur Pendelton)',
      stress_level: 'DR_CONSULTANT_REQUIRED',
      confidence: 0.96,
      classifier_used: 'Random Forest (SWELL-KW)',
      alert_triggered: true,
      score: '14 / 26 correct (53.8%)',
      recommendation: 'Dr. Consultant Required: High autonomic vulnerability, suppressed HRV (RMSSD 18ms), candidate for neuro-cognitive follow-up.'
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      subject_id: 'PATIENT-104 (Eleanor Vance)',
      stress_level: 'NORMAL',
      confidence: 0.91,
      classifier_used: 'Random Forest (SWELL-KW)',
      alert_triggered: false,
      score: '19 / 26 correct (73.1%)',
      recommendation: 'Normal: Healthy autonomic adaptation to cognitive challenge; age-appropriate resilience.'
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      subject_id: 'PATIENT-108 (Marcus Chen)',
      stress_level: 'GOOD',
      confidence: 0.95,
      classifier_used: 'Random Forest (SWELL-KW)',
      alert_triggered: false,
      score: '24 / 26 correct (92.3%)',
      recommendation: 'Good: High cognitive accuracy, robust parasympathetic vagal recovery (RMSSD > 45ms).'
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      subject_id: 'PATIENT-112 (Sarah Jenkins)',
      stress_level: 'BASELINE',
      confidence: 0.98,
      classifier_used: 'SVM (RBF Kernel)',
      alert_triggered: false,
      score: 'Baseline Calibrated (0 Errors)',
      recommendation: 'Baseline: Calibrated resting parasympathetic equilibrium and nominal vitals.'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Patient Examination Log & Diagnostics</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Temporal audit log of patient cognitive tests, clinical tier evaluations (Dr. Consultant Required, Good, Normal, Baseline), and bio-telemetry.
          </p>
        </div>

        <button
          onClick={() => alert("Exporting Patient Clinical Examination CSV data...")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-200 border border-dark-600 text-xs font-medium transition-all shadow-sm"
        >
          <Download size={14} />
          <span>Export Clinical CSV</span>
        </button>
      </div>

      {/* Historical Table */}
      <div className="bg-dark-800/80 border border-dark-700/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-900/60 border-b border-dark-700/60 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Patient / Subject</th>
                <th className="py-3.5 px-4">Clinical Diagnosis</th>
                <th className="py-3.5 px-4">Performance</th>
                <th className="py-3.5 px-4">Confidence</th>
                <th className="py-3.5 px-4">Model Engine</th>
                <th className="py-3.5 px-4">Alert Status</th>
                <th className="py-3.5 px-4">Physician Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700/40 text-slate-300">
              {displayHistory.map((item, index) => {
                const badge = getStressLevelColor(item.clinical_status || item.stress_level);
                return (
                  <tr key={index} className="hover:bg-dark-700/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {item.patient_name ? `${item.patient_name} (${item.subject_id})` : item.subject_id || 'SUBJ-001'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold ${badge.bg} ${badge.text} border ${badge.border}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {item.score || '--'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {((item.confidence || 0.9) * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 capitalize">
                      {item.classifier_used?.replace('_', ' ') || 'Random Forest'}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.alert_triggered ? (
                        <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                          <AlertTriangle size={13} /> High Alert
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <CheckCircle size={13} /> Clear
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-sm truncate" title={item.recommendation}>
                      {item.recommendation || "Nominal baseline parameters."}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
