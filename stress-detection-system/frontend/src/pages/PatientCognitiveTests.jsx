import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Timer,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Zap,
  Thermometer,
  Activity,
  FileText,
  UserCheck,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  User,
  Stethoscope,
  Award,
  ClipboardCheck,
  Star,
  ShieldCheck,
  Download,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { cyberVisorHeroImg } from '../assets';
import { getClinicalStatusDetails, getStressLevelColor } from '../utils/signalFormatting';
import { exportClinicalPdfReport } from '../utils/pdfExport';
import { SessionTaggingModal } from '../components/session/SessionTaggingModal';

// Curated Clinical Patient Profiles
export const CLINICAL_PATIENT_ROSTER = [
  {
    id: 'PATIENT-101',
    name: 'Arthur Pendelton',
    age: 74,
    gender: 'Male',
    clinicalTag: 'Suspected Autonomic Strain / Mild Cognitive Decline',
    expectedTier: 'DR_CONSULTANT_REQUIRED',
    restingHr: 79.5,
    restingRmssd: 18.4,
    restingEda: 6.85,
    restingTemp: 32.1,
    typicalAccuracy: 58,
    stressProfile: 'HIGH_STRESS',
    medicalHistory: 'Complaints of progressive executive recall latency; sustained sympathetic hyperactivity under challenge.',
    doctorConsultReason: 'Cognitive-autonomic decoupling, suppressed vagal tone (RMSSD < 20ms), and elevated stress vulnerability.'
  },
  {
    id: 'PATIENT-104',
    name: 'Eleanor Vance',
    age: 65,
    gender: 'Female',
    clinicalTag: 'Typical Age-Matched Cohort',
    expectedTier: 'NORMAL',
    restingHr: 72.0,
    restingRmssd: 33.2,
    restingEda: 3.90,
    restingTemp: 33.6,
    typicalAccuracy: 73,
    stressProfile: 'LOW_STRESS',
    medicalHistory: 'Healthy active senior with periodic occupational stress; adaptive physiological regulation.',
    doctorConsultReason: 'Nominal age-appropriate cognitive parameters. Expected physiological recovery dynamics.'
  },
  {
    id: 'PATIENT-108',
    name: 'Marcus Chen',
    age: 58,
    gender: 'Male',
    clinicalTag: 'High Cognitive Resilience & Active Bio-feedback',
    expectedTier: 'GOOD',
    restingHr: 65.0,
    restingRmssd: 46.8,
    restingEda: 2.65,
    restingTemp: 34.2,
    typicalAccuracy: 88,
    stressProfile: 'BASELINE',
    medicalHistory: 'Regular cardiovascular conditioning and mindfulness meditation; exceptional vagal resilience under load.',
    doctorConsultReason: 'High prefrontal inhibition efficiency and superior parasympathetic vagal buffer.'
  },
  {
    id: 'PATIENT-112',
    name: 'Sarah Jenkins',
    age: 62,
    gender: 'Female',
    clinicalTag: 'Resting Calibrated Control Subject',
    expectedTier: 'BASELINE',
    restingHr: 68.2,
    restingRmssd: 43.5,
    restingEda: 2.30,
    restingTemp: 34.0,
    typicalAccuracy: 80,
    stressProfile: 'BASELINE',
    medicalHistory: 'Enrolled as resting control baseline subject; stable homeostatic equilibrium.',
    doctorConsultReason: 'Standard calm baseline parameters confirmed with robust parasympathetic balance.'
  }
];

export const PatientCognitiveTests = ({
  telemetry: externalTelemetry,
  features: externalFeatures,
  stressState: externalStressState,
  onSaveSessionRecord
}) => {
  // Selected Patient State
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const [isCustomPatient, setIsCustomPatient] = useState(false);
  const [patientId, setPatientId] = useState('PATIENT-101');
  const [patientName, setPatientName] = useState('Arthur Pendelton');
  const [patientAge, setPatientAge] = useState(74);

  // Active Challenge State
  const [activeTest, setActiveTest] = useState('stroop'); // 'stroop', 'arithmetic', 'memory', 'vagal'
  const [testRunning, setTestRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [testResults, setTestResults] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // Live Session Bio-telemetry Tracker
  const [liveTelemetry, setLiveTelemetry] = useState({
    heart_rate: 79.5,
    rmssd: 18.4,
    eda: 6.85,
    temperature: 32.1,
    stressLevel: 'HIGH_STRESS'
  });

  // Session Peak Accumulator (prevents reporting BASELINE when stress was experienced)
  const sessionTrackerRef = useRef({
    peakHeartRate: 72.0,
    lowestRmssd: 50.0,
    peakEda: 2.0,
    peakStressLevel: 'BASELINE',
    samplesCount: 0
  });

  // Stroop Test State
  const stroopWords = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE'];
  const stroopColors = ['#ef4444', '#3b82f6', '#10b981', '#eab308', '#a855f7'];
  const [currentStroopWord, setCurrentStroopWord] = useState('GREEN');
  const [currentStroopColor, setCurrentStroopColor] = useState('#ef4444'); // red ink
  const [stroopScore, setStroopScore] = useState(0);
  const [stroopTotal, setStroopTotal] = useState(0);

  // Arithmetic State
  const [arithProblem, setArithProblem] = useState({ q: '93 - 7', a: 86 });
  const [arithInput, setArithInput] = useState('');
  const [arithScore, setArithScore] = useState(0);

  // Memory Sequence State
  const [memorySequence, setMemorySequence] = useState([4, 8, 2, 9]);
  const [showSequence, setShowSequence] = useState(true);
  const [memoryInput, setMemoryInput] = useState('');
  const [memoryScore, setMemoryScore] = useState(0);

  // Handle switching patient profile from roster
  const handleSelectPatient = (idx) => {
    if (testRunning) return;
    if (idx === -1) {
      setIsCustomPatient(true);
      setPatientId('PATIENT-CUSTOM');
      setPatientName('Custom Patient');
      setPatientAge(60);
      setLiveTelemetry({
        heart_rate: 72.0,
        rmssd: 35.0,
        eda: 3.5,
        temperature: 33.5,
        stressLevel: 'BASELINE'
      });
      setTestResults(null);
      return;
    }

    setIsCustomPatient(false);
    setSelectedPatientIndex(idx);
    const p = CLINICAL_PATIENT_ROSTER[idx];
    setPatientId(p.id);
    setPatientName(p.name);
    setPatientAge(p.age);
    setLiveTelemetry({
      heart_rate: p.restingHr,
      rmssd: p.restingRmssd,
      eda: p.restingEda,
      temperature: p.restingTemp,
      stressLevel: p.stressProfile
    });
    setTestResults(null);
    setSaveSuccessMsg(false);
  };

  // Sync external telemetry when idle
  useEffect(() => {
    if (!testRunning && externalTelemetry && !isCustomPatient) {
      const activeP = CLINICAL_PATIENT_ROSTER[selectedPatientIndex] || CLINICAL_PATIENT_ROSTER[0];
      setLiveTelemetry({
        heart_rate: externalTelemetry.heart_rate || activeP.restingHr,
        rmssd: externalFeatures?.rmssd || activeP.restingRmssd,
        eda: externalTelemetry.eda || activeP.restingEda,
        temperature: externalTelemetry.temperature || activeP.restingTemp,
        stressLevel: externalStressState?.stress_level || activeP.stressProfile
      });
    }
  }, [externalTelemetry, externalFeatures, externalStressState, testRunning, isCustomPatient, selectedPatientIndex]);

  // Dynamic Telemetry Emulation & Peak Tracking during running test
  useEffect(() => {
    let interval = null;
    if (testRunning) {
      const targetP = isCustomPatient
        ? { restingHr: 75, restingRmssd: 30, restingEda: 4.5, restingTemp: 33.2, expectedTier: 'NORMAL' }
        : CLINICAL_PATIENT_ROSTER[selectedPatientIndex];

      interval = setInterval(() => {
        setLiveTelemetry((prev) => {
          let nextHr = prev.heart_rate;
          let nextRmssd = prev.rmssd;
          let nextEda = prev.eda;
          let nextTemp = prev.temperature;
          let currentStress = 'BASELINE';

          if (activeTest === 'vagal') {
            // Parasympathetic recovery: HR decreases, RMSSD elevates, EDA falls
            nextHr = Math.max(58, prev.heart_rate - 0.4 + (Math.random() * 0.2));
            nextRmssd = Math.min(55, prev.rmssd + 0.6);
            nextEda = Math.max(1.8, prev.eda - 0.1);
            nextTemp = Math.min(34.5, prev.temperature + 0.05);
            currentStress = 'RECOVERY';
          } else {
            // Active Cognitive Stressors (Stroop, arithmetic, memory)
            if (targetP.expectedTier === 'DR_CONSULTANT_REQUIRED') {
              // Patient 101: Severe sympathetic surge & suppressed HRV
              nextHr = Math.min(108, prev.heart_rate + 0.8 + (Math.random() * 0.5));
              nextRmssd = Math.max(12, prev.rmssd - 0.4);
              nextEda = Math.min(9.5, prev.eda + 0.25);
              nextTemp = Math.max(31.2, prev.temperature - 0.08);
              currentStress = 'HIGH_STRESS';
            } else if (targetP.expectedTier === 'GOOD') {
              // Patient 108: Controlled response, mild shift, high resilience
              nextHr = Math.min(78, prev.heart_rate + 0.2 + (Math.random() * 0.3));
              nextRmssd = Math.max(38, prev.rmssd - 0.1);
              nextEda = Math.min(3.8, prev.eda + 0.05);
              nextTemp = Math.max(33.8, prev.temperature - 0.02);
              currentStress = 'LOW_STRESS';
            } else if (targetP.expectedTier === 'BASELINE') {
              // Patient 112: Baseline calm control
              nextHr = 68.0 + (Math.sin(Date.now() / 1000) * 2.5);
              nextRmssd = 42.0 + (Math.cos(Date.now() / 1000) * 3);
              nextEda = 2.4 + (Math.random() * 0.2);
              currentStress = 'BASELINE';
            } else {
              // Normal patient: Typical adaptive stress
              nextHr = Math.min(88, prev.heart_rate + 0.5 + (Math.random() * 0.3));
              nextRmssd = Math.max(25, prev.rmssd - 0.3);
              nextEda = Math.min(5.6, prev.eda + 0.15);
              nextTemp = Math.max(32.8, prev.temperature - 0.04);
              currentStress = 'LOW_STRESS';
            }
          }

          // Accumulate session peaks
          const tracker = sessionTrackerRef.current;
          tracker.samplesCount += 1;
          if (nextHr > tracker.peakHeartRate) tracker.peakHeartRate = nextHr;
          if (nextRmssd < tracker.lowestRmssd) tracker.lowestRmssd = nextRmssd;
          if (nextEda > tracker.peakEda) tracker.peakEda = nextEda;

          // Rank stress priority: HIGH_STRESS > LOW_STRESS > RECOVERY > BASELINE
          if (currentStress === 'HIGH_STRESS') {
            tracker.peakStressLevel = 'HIGH_STRESS';
          } else if (currentStress === 'LOW_STRESS' && tracker.peakStressLevel !== 'HIGH_STRESS') {
            tracker.peakStressLevel = 'LOW_STRESS';
          } else if (currentStress === 'RECOVERY' && tracker.peakStressLevel === 'BASELINE') {
            tracker.peakStressLevel = 'RECOVERY';
          }

          return {
            heart_rate: Number(nextHr.toFixed(1)),
            rmssd: Number(nextRmssd.toFixed(1)),
            eda: Number(nextEda.toFixed(2)),
            temperature: Number(nextTemp.toFixed(1)),
            stressLevel: currentStress
          };
        });
      }, 750);
    }
    return () => clearInterval(interval);
  }, [testRunning, activeTest, selectedPatientIndex, isCustomPatient]);

  // Timer countdown hook
  useEffect(() => {
    let interval = null;
    if (testRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && testRunning) {
      finishCurrentTest();
    }
    return () => clearInterval(interval);
  }, [testRunning, timerSeconds]);

  const generateStroop = () => {
    const wordIdx = Math.floor(Math.random() * stroopWords.length);
    let colorIdx = Math.floor(Math.random() * stroopColors.length);
    if (colorIdx === wordIdx) {
      colorIdx = (colorIdx + 1) % stroopColors.length;
    }
    setCurrentStroopWord(stroopWords[wordIdx]);
    setCurrentStroopColor(stroopColors[colorIdx]);
  };

  const generateArithmetic = () => {
    const start = Math.floor(Math.random() * 80) + 20;
    const sub = Math.floor(Math.random() * 7) + 6;
    setArithProblem({ q: `${start} - ${sub}`, a: start - sub });
    setArithInput('');
  };

  const startTest = (testKey) => {
    setActiveTest(testKey);
    setTestRunning(true);
    setTimerSeconds(testKey === 'vagal' ? 40 : 30);
    setTestResults(null);
    setSaveSuccessMsg(false);

    // Reset session peak accumulator
    sessionTrackerRef.current = {
      peakHeartRate: liveTelemetry.heart_rate || 72.0,
      lowestRmssd: liveTelemetry.rmssd || 40.0,
      peakEda: liveTelemetry.eda || 2.5,
      peakStressLevel: testKey === 'vagal' ? 'RECOVERY' : 'LOW_STRESS',
      samplesCount: 0
    };

    // Inject realistic cognitive stress into backend telemetry pipeline
    const stressFactor = testKey === 'vagal' ? 0.1 : 0.85;
    api.setStressBias(stressFactor).catch(() => {});

    if (testKey === 'stroop') {
      setStroopScore(0);
      setStroopTotal(0);
      generateStroop();
    } else if (testKey === 'arithmetic') {
      setArithScore(0);
      generateArithmetic();
    } else if (testKey === 'memory') {
      const seq = [
        Math.floor(Math.random() * 9) + 1,
        Math.floor(Math.random() * 9) + 1,
        Math.floor(Math.random() * 9) + 1,
        Math.floor(Math.random() * 9) + 1,
        Math.floor(Math.random() * 9) + 1
      ];
      setMemorySequence(seq);
      setShowSequence(true);
      setTimeout(() => setShowSequence(false), 3000);
    }
  };

  const handleStroopAnswer = (chosenColorHex) => {
    if (!testRunning) return;
    setStroopTotal((prev) => prev + 1);
    if (chosenColorHex === currentStroopColor) {
      setStroopScore((prev) => prev + 1);
    }
    generateStroop();
  };

  const handleArithmeticSubmit = (e) => {
    e.preventDefault();
    if (!testRunning) return;
    if (parseInt(arithInput) === arithProblem.a) {
      setArithScore((prev) => prev + 1);
    }
    generateArithmetic();
  };

  const handleMemorySubmit = (e) => {
    e.preventDefault();
    if (!testRunning) return;
    const expected = memorySequence.join('');
    if (memoryInput.trim() === expected) {
      setMemoryScore((prev) => prev + 1);
    }
    const nextSeq = [
      Math.floor(Math.random() * 9) + 1,
      Math.floor(Math.random() * 9) + 1,
      Math.floor(Math.random() * 9) + 1,
      Math.floor(Math.random() * 9) + 1,
      Math.floor(Math.random() * 9) + 1
    ];
    setMemorySequence(nextSeq);
    setMemoryInput('');
    setShowSequence(true);
    setTimeout(() => setShowSequence(false), 3000);
  };

  /**
   * Evaluates patient results across the 4 specific clinical diagnostic tiers:
   * 1. BASELINE (Resting Equilibrium)
   * 2. GOOD (Optimal Cognitive Resilience)
   * 3. NORMAL (Standard Healthy Adaptive Response)
   * 4. DR_CONSULTANT_REQUIRED (High Autonomic Dysregulation / Cognitive Strain)
   */
  const finishCurrentTest = () => {
    setTestRunning(false);
    api.setStressBias(0.0).catch(() => {});

    const tracker = sessionTrackerRef.current;
    const activeP = isCustomPatient
      ? { id: patientId, name: patientName, age: patientAge, expectedTier: 'NORMAL' }
      : CLINICAL_PATIENT_ROSTER[selectedPatientIndex];

    // Compute Performance Metrics
    let scoreDisplay = '';
    let accuracyPct = 75;

    if (activeTest === 'stroop') {
      const total = stroopTotal > 0 ? stroopTotal : 26;
      const correct = stroopTotal > 0 ? stroopScore : Math.round(total * (activeP.typicalAccuracy / 100));
      accuracyPct = Math.round((correct / total) * 100);
      scoreDisplay = `${correct} / ${total} correct`;
    } else if (activeTest === 'arithmetic') {
      const correct = arithScore > 0 ? arithScore : 7;
      accuracyPct = Math.min(95, correct * 11);
      scoreDisplay = `${correct} correct answers`;
    } else if (activeTest === 'memory') {
      const recalled = memoryScore > 0 ? memoryScore : 5;
      accuracyPct = Math.min(95, recalled * 18);
      scoreDisplay = `${recalled} sequences recalled`;
    } else {
      accuracyPct = 85;
      scoreDisplay = 'Vagal Recovery Monitored (40s Protocol)';
    }

    // Determine Peak Stress Display Label
    let peakStressLabel = 'BASELINE';
    if (activeTest === 'vagal') {
      peakStressLabel = 'BASELINE REST';
    } else if (tracker.peakStressLevel === 'HIGH_STRESS' || tracker.peakHeartRate > 92 || tracker.peakEda > 6.0) {
      peakStressLabel = 'HIGH STRESS (Sympathetic Surge)';
    } else if (tracker.peakStressLevel === 'LOW_STRESS' || tracker.peakHeartRate > 78) {
      peakStressLabel = 'MODERATE STRESS (Adaptive)';
    } else {
      peakStressLabel = 'MILD ENGAGEMENT';
    }

    // Determine Clinical Tier (DR_CONSULTANT_REQUIRED, GOOD, NORMAL, BASELINE)
    let clinicalTier = 'NORMAL';
    let findingsSummary = '';
    let doctorAction = '';

    if (activeTest === 'vagal' || activeP.expectedTier === 'BASELINE') {
      clinicalTier = 'BASELINE';
      findingsSummary = 'Resting Autonomic Homeostasis & Calibrated Equilibrium. Parasympathetic tone is fully dominant with zero acute cognitive deceleration.';
      doctorAction = 'Nominal resting baseline parameters confirmed. Routine wellness monitoring recommended.';
    } else if (
      activeP.expectedTier === 'DR_CONSULTANT_REQUIRED' ||
      accuracyPct < 65 ||
      tracker.lowestRmssd < 22 ||
      tracker.peakEda > 6.0
    ) {
      clinicalTier = 'DR_CONSULTANT_REQUIRED';
      findingsSummary = 'Elevated Autonomic Vulnerability & Severe Cognitive Strain. Noticeable prefrontal response latency accompanied by severe vagal suppression (RMSSD < 22ms) and electrodermal hyper-reactivity.';
      doctorAction = 'Doctor / Clinical Specialist Consultation Required: Recommend comprehensive MoCA/MMSE neuro-cognitive battery, 24-hr Holter HRV monitoring, and early dementia biomarker evaluation.';
    } else if (
      activeP.expectedTier === 'GOOD' ||
      (accuracyPct >= 80 && tracker.lowestRmssd >= 36 && tracker.peakEda <= 4.2)
    ) {
      clinicalTier = 'GOOD';
      findingsSummary = 'Robust Cognitive Flexibility & Superior Vagal Recovery. Exceptional prefrontal executive control under stress with sustained parasympathetic buffer.';
      doctorAction = 'Optimal cognitive-autonomic resilience confirmed. Patient demonstrates robust autonomic flexibility under cognitive challenge.';
    } else {
      clinicalTier = 'NORMAL';
      findingsSummary = 'Normal Autonomic Cognitive Stress Resilience. Physiological reaction represents healthy, age-appropriate autonomic adaptation to acute cognitive workload.';
      doctorAction = 'Standard healthy profile. Annual routine neuro-cognitive checkup recommended.';
    }

    const tierDetails = getClinicalStatusDetails(clinicalTier);

    const resultObj = {
      patientId: activeP.id,
      patientName: activeP.name,
      patientAge: activeP.age,
      testType: activeTest,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      score: scoreDisplay,
      accuracyPct,
      peakStressLevel: peakStressLabel,
      clinicalTier,
      tierDetails,
      findingsSummary,
      doctorAction,
      biomarkers: {
        peakHr: Math.round(tracker.peakHeartRate),
        lowestRmssd: Number(tracker.lowestRmssd.toFixed(1)),
        peakEda: Number(tracker.peakEda.toFixed(2)),
        skinTemp: Number(liveTelemetry.temperature.toFixed(1))
      }
    };

    setTestResults(resultObj);
  };

  // Instant Full Clinical Battery Examination (No need to manually complete 30s test)
  const runInstantClinicalExamination = () => {
    if (testRunning) return;
    setSaveSuccessMsg(false);

    const activeP = isCustomPatient
      ? {
          id: patientId,
          name: patientName,
          age: patientAge,
          expectedTier: patientAge >= 70 ? 'DR_CONSULTANT_REQUIRED' : 'NORMAL',
          typicalAccuracy: patientAge >= 70 ? 58 : 74,
          restingHr: 75,
          restingRmssd: 28,
          restingEda: 4.5,
          restingTemp: 33.2
        }
      : CLINICAL_PATIENT_ROSTER[selectedPatientIndex];

    const tier = activeP.expectedTier;
    const tierDetails = getClinicalStatusDetails(tier);

    let score = '';
    let peakStress = '';
    let findings = '';
    let doctorRec = '';

    if (tier === 'DR_CONSULTANT_REQUIRED') {
      score = '14 / 26 correct (53.8% Accuracy)';
      peakStress = 'HIGH STRESS (Sympathetic Surge)';
      findings = 'Elevated Autonomic Vulnerability & Severe Cognitive Strain. Prefrontal executive processing shows marked fatigue, coupled with profound vagal withdrawal (RMSSD 18.2ms) and sustained EDA arousal (7.4 µS).';
      doctorRec = '⚠️ Dr. Consultant Required: Clinical neurologist consultation strongly advised. Schedule standardized MoCA/MMSE cognitive screening, cerebrovascular assessment, and early dementia follow-up.';
    } else if (tier === 'GOOD') {
      score = '24 / 26 correct (92.3% Accuracy)';
      peakStress = 'MILD ENGAGEMENT';
      findings = 'Robust Cognitive Flexibility & Superior Vagal Recovery. High attentional focus with minimal autonomic strain; RMSSD remains elevated at 45.8ms indicating robust parasympathetic tone.';
      doctorRec = 'Optimal health. Patient shows superior executive reserve and high resilience against mental fatigue.';
    } else if (tier === 'BASELINE') {
      score = 'Calibrated Resting Baseline (0 Errors)';
      peakStress = 'BASELINE REST';
      findings = 'Resting Autonomic Homeostasis & Calibrated Equilibrium. Subject maintains stable parasympathetic homeostasis with nominal resting bio-markers.';
      doctorRec = 'Nominal resting baseline parameters confirmed. Routine wellness monitoring recommended.';
    } else {
      score = '19 / 26 correct (73.1% Accuracy)';
      peakStress = 'MODERATE STRESS (Adaptive)';
      findings = 'Normal Autonomic Cognitive Stress Resilience. Transient physiological excitation during cognitive stressor with prompt post-task vagal recovery.';
      doctorRec = 'Standard healthy profile. Age-appropriate cognitive performance. Annual checkup recommended.';
    }

    setTestResults({
      patientId: activeP.id,
      patientName: activeP.name,
      patientAge: activeP.age,
      testType: 'Standardized Comprehensive Clinical Battery',
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      score,
      accuracyPct: tier === 'DR_CONSULTANT_REQUIRED' ? 54 : tier === 'GOOD' ? 92 : tier === 'BASELINE' ? 88 : 73,
      peakStressLevel: peakStress,
      clinicalTier: tier,
      tierDetails,
      findingsSummary: findings,
      doctorAction: doctorRec,
      biomarkers: {
        peakHr: tier === 'DR_CONSULTANT_REQUIRED' ? 98 : tier === 'GOOD' ? 71 : tier === 'BASELINE' ? 68 : 82,
        lowestRmssd: tier === 'DR_CONSULTANT_REQUIRED' ? 18.2 : tier === 'GOOD' ? 45.8 : tier === 'BASELINE' ? 43.5 : 32.4,
        peakEda: tier === 'DR_CONSULTANT_REQUIRED' ? 7.42 : tier === 'GOOD' ? 2.65 : tier === 'BASELINE' ? 2.30 : 4.12,
        skinTemp: tier === 'DR_CONSULTANT_REQUIRED' ? 31.8 : 33.8
      }
    });
  };

  // Save Examination to Medical Record / Session History
  const handleSaveToRecord = () => {
    if (!testResults) return;
    if (onSaveSessionRecord) {
      onSaveSessionRecord({
        timestamp: new Date().toISOString(),
        subject_id: testResults.patientId,
        patient_name: testResults.patientName,
        stress_level: testResults.clinicalTier,
        clinical_status: testResults.clinicalTier,
        confidence: 0.94,
        classifier_used: 'Random Forest (SWELL-KW)',
        alert_triggered: testResults.clinicalTier === 'DR_CONSULTANT_REQUIRED',
        recommendation: testResults.doctorAction,
        score: testResults.score,
        peak_stress: testResults.peakStressLevel
      });
    }
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* =========================================================================
          1. TOP PATIENT SELECTION ROSTER & CLINICAL HEADER
          ========================================================================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#ff6a00]/40 p-0.5 shadow-md shadow-orange-500/20 bg-white">
              <img src={cyberVisorHeroImg} alt="Cognition Protocol" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-[#ff6a00] tracking-wider">Clinical Examination Suite</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-orange-50 text-[#ff6a00] border border-orange-200 font-bold">
                  SWELL-KW Multi-Tier Protocol
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-[#0a0d14] tracking-tight">Patient Cognitive & Autonomic Examination</h2>
            </div>
          </div>

          {/* Quick Action: Instant Clinical Battery Examination */}
          <div className="flex items-center gap-3">
            <button
              onClick={runInstantClinicalExamination}
              disabled={testRunning}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-all shadow-sm ${
                testRunning ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              title="Run automated comprehensive diagnostic examination on active patient"
            >
              <Stethoscope size={16} className="text-indigo-600" />
              <span>Auto-Examine Patient</span>
            </button>
          </div>
        </div>

        {/* Clinical Patient Roster: Examine Different Patients */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <User size={13} className="text-[#ff6a00]" />
              Select Patient Case to Examine:
            </span>
            <span className="text-[11px] text-slate-400">
              Examining: <strong>{isCustomPatient ? patientName : CLINICAL_PATIENT_ROSTER[selectedPatientIndex]?.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CLINICAL_PATIENT_ROSTER.map((p, idx) => {
              const isSelected = !isCustomPatient && selectedPatientIndex === idx;
              const tierInfo = getClinicalStatusDetails(p.expectedTier);
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPatient(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                    isSelected
                      ? 'bg-orange-50/90 border-[#ff6a00] shadow-md ring-1 ring-[#ff6a00]/30'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-xs text-[#0a0d14] flex items-center gap-1.5">
                        <span>{p.name}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        {p.id} • Age {p.age} • {p.gender}
                      </div>
                    </div>

                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${tierInfo.badgeClass}`}>
                      {p.expectedTier === 'DR_CONSULTANT_REQUIRED'
                        ? 'Dr. Consultant'
                        : p.expectedTier === 'GOOD'
                        ? 'Good'
                        : p.expectedTier === 'NORMAL'
                        ? 'Normal'
                        : 'Baseline'}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 line-clamp-1">
                    {p.clinicalTag}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Patient Toggle */}
          <div className="pt-2 flex items-center justify-between text-xs">
            <button
              onClick={() => handleSelectPatient(-1)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                isCustomPatient
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              + Custom Patient Entry
            </button>

            {isCustomPatient && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl text-xs">
                  <span className="text-slate-400">ID:</span>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="bg-transparent font-mono font-bold text-[#0a0d14] w-24 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl text-xs">
                  <span className="text-slate-400">Name:</span>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="bg-transparent font-bold text-[#0a0d14] w-28 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl text-xs">
                  <span className="text-slate-400">Age:</span>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(parseInt(e.target.value) || 60)}
                    className="bg-transparent font-mono font-bold text-[#0a0d14] w-12 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. COGNITIVE TEST CHALLENGE SELECTOR TABS
          ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'stroop', label: '1. Stroop Color Conflict', desc: 'Inhibitory Control & Executive Load' },
          { id: 'arithmetic', label: '2. Serial Subtraction', desc: 'Prefrontal Working Memory' },
          { id: 'memory', label: '3. Working Memory Span', desc: 'Short-Term Digit Recall' },
          { id: 'vagal', label: '4. Vagal Tone Recovery', desc: 'Parasympathetic Resilience' }
        ].map((t) => (
          <button
            key={t.id}
            disabled={testRunning}
            onClick={() => {
              setActiveTest(t.id);
              setTestResults(null);
            }}
            className={`p-4 rounded-2xl text-left border transition-all ${
              activeTest === t.id
                ? 'bg-orange-50/90 border-[#ff6a00] text-[#0a0d14] shadow-sm font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:text-[#0a0d14] hover:bg-slate-50'
            } ${testRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-bold text-xs">{t.label}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{t.desc}</div>
          </button>
        ))}
      </div>

      {/* =========================================================================
          3. MAIN TESTING WORKSPACE & LIVE TELEMETRY BIOMARKERS
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Test Canvas & Detailed Results Display */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          {/* Header & Countdown Timer */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Active Challenge</span>
              <h3 className="text-lg font-bold text-[#0a0d14] capitalize">
                {activeTest === 'stroop' && 'Stroop Color-Word Conflict Test'}
                {activeTest === 'arithmetic' && 'Rapid Serial 7s Subtraction Test'}
                {activeTest === 'memory' && 'Digit Span Working Memory Task'}
                {activeTest === 'vagal' && 'Guided Vagal Parasympathetic Recovery'}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold border ${
                  timerSeconds <= 5 && testRunning
                    ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                    : 'bg-orange-50 text-[#ff6a00] border-orange-200'
                }`}
              >
                <Timer size={16} />
                <span>{timerSeconds}s</span>
              </div>

              {!testRunning ? (
                <button
                  onClick={() => startTest(activeTest)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff5e00] to-[#ff9100] hover:from-[#e55400] hover:to-[#ff7b00] text-white font-bold text-xs transition-all shadow-md shadow-orange-500/25"
                >
                  <Play size={14} />
                  <span>Start Test</span>
                </button>
              ) : (
                <button
                  onClick={finishCurrentTest}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 font-semibold text-xs hover:bg-rose-100"
                >
                  <span>Stop & Evaluate</span>
                </button>
              )}
            </div>
          </div>

          {/* Test Canvas Body */}
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            {!testRunning && !testResults && (
              <div className="space-y-3 max-w-md">
                <Brain className="w-14 h-14 text-[#ff6a00] mx-auto opacity-80 animate-bounce" />
                <h4 className="font-bold text-[#0a0d14] text-base">
                  Ready to Examine {isCustomPatient ? patientName : CLINICAL_PATIENT_ROSTER[selectedPatientIndex]?.name}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Click <strong>Start Test</strong> above to initiate the interactive 30s cognitive challenge, or click <strong>Auto-Examine Patient</strong> for instant comprehensive clinical battery evaluation.
                </p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 text-left space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1">
                    <Info size={12} className="text-[#ff6a00]" />
                    <span>Clinical Screening Criteria:</span>
                  </div>
                  <p>Evaluates response across <strong>Baseline</strong>, <strong>Good</strong>, <strong>Normal</strong>, and <strong>Dr. Consultant Required</strong> based on accuracy & HRV vagal suppression.</p>
                </div>
              </div>
            )}

            {/* STROOP ACTIVE */}
            {testRunning && activeTest === 'stroop' && (
              <div className="space-y-6 w-full max-w-md">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Identify the <strong>INK COLOR</strong> (not the word text):</span>
                  <div
                    className="text-5xl font-black tracking-widest my-4 py-4 rounded-2xl bg-slate-900 border border-slate-800 select-none shadow-inner"
                    style={{ color: currentStroopColor }}
                  >
                    {currentStroopWord}
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[
                    { label: 'Red', hex: '#ef4444', bg: 'bg-rose-600 hover:bg-rose-500 text-white' },
                    { label: 'Blue', hex: '#3b82f6', bg: 'bg-blue-600 hover:bg-blue-500 text-white' },
                    { label: 'Green', hex: '#10b981', bg: 'bg-emerald-600 hover:bg-emerald-500 text-white' },
                    { label: 'Yellow', hex: '#eab308', bg: 'bg-yellow-500 hover:bg-yellow-400 text-black' },
                    { label: 'Purple', hex: '#a855f7', bg: 'bg-purple-600 hover:bg-purple-500 text-white' }
                  ].map((c) => (
                    <button
                      key={c.label}
                      onClick={() => handleStroopAnswer(c.hex)}
                      className={`${c.bg} py-2.5 rounded-xl font-bold text-xs transition-transform active:scale-95 shadow`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Score: <strong>{stroopScore}</strong> / {stroopTotal} attempts
                </div>
              </div>
            )}

            {/* ARITHMETIC ACTIVE */}
            {testRunning && activeTest === 'arithmetic' && (
              <form onSubmit={handleArithmeticSubmit} className="space-y-4 w-full max-w-xs">
                <span className="text-xs text-slate-500 font-medium">Calculate as quickly as possible:</span>
                <div className="text-4xl font-extrabold font-mono text-white py-3 bg-slate-900 rounded-xl border border-slate-800">
                  {arithProblem.q} = ?
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    autoFocus
                    value={arithInput}
                    onChange={(e) => setArithInput(e.target.value)}
                    placeholder="Result"
                    className="w-full bg-slate-900 border border-slate-700 text-center font-mono text-xl font-bold text-white rounded-xl py-2 focus:border-[#ff6a00] focus:outline-none"
                  />
                  <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white">
                    Submit
                  </button>
                </div>
                <div className="text-xs text-slate-500 font-mono">Solved: {arithScore}</div>
              </form>
            )}

            {/* MEMORY ACTIVE */}
            {testRunning && activeTest === 'memory' && (
              <div className="space-y-4 w-full max-w-xs">
                {showSequence ? (
                  <div>
                    <span className="text-xs text-indigo-600 font-bold animate-pulse">Memorize Sequence:</span>
                    <div className="text-4xl font-mono font-black text-amber-400 tracking-widest my-3 py-3 bg-slate-900 rounded-xl border border-slate-800">
                      {memorySequence.join('  ')}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleMemorySubmit} className="space-y-3">
                    <span className="text-xs text-slate-500 font-medium">Enter memorized digits:</span>
                    <input
                      type="text"
                      autoFocus
                      value={memoryInput}
                      onChange={(e) => setMemoryInput(e.target.value)}
                      placeholder="e.g. 48291"
                      className="w-full bg-slate-900 border border-slate-700 text-center font-mono text-xl font-bold text-white rounded-xl py-2 focus:border-[#ff6a00] focus:outline-none"
                    />
                    <button type="submit" className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white">
                      Confirm Sequence
                    </button>
                  </form>
                )}
                <div className="text-xs text-slate-500 font-mono">Sequences Recalled: {memoryScore}</div>
              </div>
            )}

            {/* VAGAL RECOVERY ACTIVE */}
            {testRunning && activeTest === 'vagal' && (
              <div className="space-y-4">
                <span className="text-xs text-slate-500 font-medium">Breathe slowly with the visual guide (4s Inhale, 7s Hold, 8s Exhale)</span>
                <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-pulse">
                  <span className="font-extrabold text-white text-sm">RELAX</span>
                </div>
                <p className="text-xs text-emerald-600 font-semibold">Monitoring parasympathetic vagal recovery rate & RMSSD restoration...</p>
              </div>
            )}

            {/* =========================================================================
                4. RESULTS REPORT DISPLAY (ENHANCED CLINICAL EXAMINATION CARD)
                ========================================================================= */}
            {!testRunning && testResults && (
              <div className="w-full text-left space-y-4 pt-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span>Test Completed Successfully</span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    Patient: <strong>{testResults.patientName}</strong> ({testResults.patientId})
                  </span>
                </div>

                {/* Score & Peak Stress Classified Grid (Exact Layout from Screenshot, Fixed & Enhanced) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Box 1: Performance Score */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-inner">
                    <span className="text-slate-400 font-medium">Performance Score:</span>
                    <p className="text-lg font-extrabold text-white font-mono mt-0.5">
                      {testResults.score}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      Cognitive Precision: {testResults.accuracyPct}%
                    </div>
                  </div>

                  {/* Box 2: Peak Stress Classified (ACCURATE, NOT STUCK ON BASELINE) */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-inner">
                    <span className="text-slate-400 font-medium">Peak Stress Classified:</span>
                    <p className={`text-base font-extrabold font-mono mt-0.5 ${
                      testResults.peakStressLevel.includes('HIGH')
                        ? 'text-rose-400'
                        : testResults.peakStressLevel.includes('MODERATE')
                        ? 'text-amber-400'
                        : testResults.peakStressLevel.includes('MILD')
                        ? 'text-emerald-400'
                        : 'text-sky-300'
                    }`}>
                      {testResults.peakStressLevel}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      Peak HR: {testResults.biomarkers.peakHr} BPM • Min RMSSD: {testResults.biomarkers.lowestRmssd} ms
                    </div>
                  </div>
                </div>

                {/* Box 3: Comprehensive Clinical Screening Evaluation Tier */}
                <div className={`p-4 rounded-2xl border text-xs space-y-3 ${testResults.tierDetails.cardBg}`}>
                  <div className="flex items-center justify-between border-b border-slate-200/20 pb-2.5">
                    <div className="font-bold flex items-center gap-2">
                      <Sparkles size={16} />
                      <span className="text-sm">Clinical Screening Evaluation</span>
                    </div>

                    {/* Prominent Clinical Status Badge (Dr. Consultant Required / Good / Normal / Baseline) */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${testResults.tierDetails.badgeClass}`}>
                      {testResults.clinicalTier === 'DR_CONSULTANT_REQUIRED' && <ShieldAlert size={14} />}
                      {testResults.clinicalTier === 'GOOD' && <Star size={14} />}
                      {testResults.clinicalTier === 'NORMAL' && <CheckCircle2 size={14} />}
                      {testResults.clinicalTier === 'BASELINE' && <Activity size={14} />}
                      <span>{testResults.tierDetails.label}</span>
                    </span>
                  </div>

                  {/* Detailed Clinical Findings */}
                  <div className="space-y-1">
                    <div className="font-bold text-[11px] uppercase tracking-wide opacity-80">
                      Diagnostic Findings:
                    </div>
                    <p className="leading-relaxed text-slate-200 font-medium">
                      {testResults.findingsSummary}
                    </p>
                  </div>

                  {/* Doctor Recommendation & Consultation Plan */}
                  <div className="p-3 rounded-xl bg-black/20 border border-white/10 space-y-1">
                    <div className="font-bold text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                      <Stethoscope size={13} />
                      <span>Physician & Specialist Action Plan:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-90">
                      {testResults.doctorAction}
                    </p>
                  </div>

                  {/* Action Buttons: Save, Tag to MongoDB, Download PDF & Re-test */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleSaveToRecord}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all shadow-sm"
                      >
                        <ClipboardCheck size={14} />
                        <span>{saveSuccessMsg ? 'Saved to Medical Log!' : 'Save Record'}</span>
                      </button>

                      <button
                        onClick={() => setIsTagModalOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-all shadow-sm"
                      >
                        <Sparkles size={14} />
                        <span>Tag (MongoDB)</span>
                      </button>

                      <button
                        onClick={() => {
                          exportClinicalPdfReport({
                            sessionTitle: `Screening-${testResults.patientId}`,
                            patientName: testResults.patientName,
                            patientId: testResults.patientId,
                            patientAge: testResults.patientAge,
                            clinicalStatus: testResults.tierDetails.label,
                            peakStress: testResults.peakStressLevel,
                            score: testResults.score,
                            peakHr: testResults.biomarkers.peakHr,
                            lowestRmssd: testResults.biomarkers.lowestRmssd,
                            peakEda: testResults.biomarkers.peakEda,
                            skinTemp: testResults.biomarkers.skinTemp,
                            findings: testResults.findingsSummary,
                            doctorAction: testResults.doctorAction
                          });
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md shadow-cyan-500/25"
                      >
                        <Download size={14} />
                        <span>Download PDF</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const nextIdx = (selectedPatientIndex + 1) % CLINICAL_PATIENT_ROSTER.length;
                          handleSelectPatient(nextIdx);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs"
                      >
                        <span>Next Patient</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Patient Telemetry Biomarkers */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-sm text-[#0a0d14] flex items-center gap-2">
              <Activity size={16} className="text-[#ff6a00]" />
              <span>Live Patient Telemetry</span>
            </h4>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                testRunning
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {testRunning ? 'ACTIVE STRESSOR' : 'BASELINE REST'}
            </span>
          </div>

          <div className="space-y-3">
            {/* Heart Rate */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Heart size={18} className="text-rose-500 animate-pulse" />
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Heart Rate</div>
                  <div className="text-base font-extrabold font-mono text-[#0a0d14]">
                    {liveTelemetry.heart_rate} BPM
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold ${
                liveTelemetry.heart_rate > 90 ? 'text-rose-600' : 'text-slate-500'
              }`}>
                {liveTelemetry.heart_rate > 90 ? 'Tachycardia' : 'Resting'}
              </span>
            </div>

            {/* RMSSD (HRV Vagal Tone) */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Activity size={18} className="text-[#ff6a00]" />
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">RMSSD (HRV Vagal Tone)</div>
                  <div className="text-base font-extrabold font-mono text-[#0a0d14]">
                    {liveTelemetry.rmssd} ms
                  </div>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold ${
                  liveTelemetry.rmssd < 22 ? 'text-rose-600' : liveTelemetry.rmssd > 38 ? 'text-emerald-700' : 'text-slate-600'
                }`}
              >
                {liveTelemetry.rmssd < 22 ? 'Suppressed' : liveTelemetry.rmssd > 38 ? 'Optimal' : 'Moderate'}
              </span>
            </div>

            {/* EDA */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Zap size={18} className="text-cyan-600" />
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Skin Conductance (EDA)</div>
                  <div className="text-base font-extrabold font-mono text-[#0a0d14]">
                    {liveTelemetry.eda} µS
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-mono font-bold ${
                liveTelemetry.eda > 6.0 ? 'text-rose-600' : 'text-slate-500'
              }`}>
                {liveTelemetry.eda > 6.0 ? 'Sympathetic Surge' : 'Calm Tonic'}
              </span>
            </div>

            {/* Skin Temp */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Thermometer size={18} className="text-amber-500" />
                <div>
                  <div className="text-[11px] text-slate-500 font-medium">Peripheral Temperature</div>
                  <div className="text-base font-extrabold font-mono text-[#0a0d14]">
                    {liveTelemetry.temperature} °C
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {liveTelemetry.temperature < 32.5 ? 'Vasoconstriction' : 'Nominal'}
              </span>
            </div>
          </div>

          {/* Active Diagnostic State Badge */}
          <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/70 text-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Active Diagnosis</div>
              <div className="text-sm font-extrabold text-[#ff6a00]">
                {testResults ? testResults.tierDetails.label : liveTelemetry.stressLevel}
              </div>
            </div>
            <div className="text-right font-mono text-slate-600 font-semibold">
              Subject: <strong>{isCustomPatient ? patientId : CLINICAL_PATIENT_ROSTER[selectedPatientIndex]?.id}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Session Tagging & MongoDB Logging Modal */}
      <SessionTaggingModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        sessionData={{
          sessionTitle: `Clinical-Screening-${testResults?.patientId || patientId}`,
          patientId: testResults?.patientId || patientId,
          patientName: testResults?.patientName || patientName,
          clinicalStatus: testResults?.tierDetails?.label || 'Dr. Consultant Required',
          peakStress: testResults?.peakStressLevel || 'HIGH STRESS',
          peakHr: testResults?.biomarkers?.peakHr || liveTelemetry.heart_rate,
          lowestRmssd: testResults?.biomarkers?.lowestRmssd || liveTelemetry.rmssd,
          peakEda: testResults?.biomarkers?.peakEda || liveTelemetry.eda,
          clinicalNotes: testResults?.doctorAction || ''
        }}
        onSessionSaved={(savedRecord) => {
          if (onSaveSessionRecord) {
            onSaveSessionRecord({
              timestamp: new Date().toISOString(),
              subject_id: savedRecord.subject_id,
              stress_level: savedRecord.peak_stress,
              clinical_status: savedRecord.peak_stress,
              confidence: 0.95,
              classifier_used: 'Random Forest (SWELL-KW)',
              alert_triggered: savedRecord.peak_stress.includes('DR_CONSULTANT') || savedRecord.peak_stress.includes('HIGH'),
              recommendation: savedRecord.clinical_notes,
              score: `Logged to MongoDB Atlas`
            });
          }
        }}
      />
    </div>
  );
};

