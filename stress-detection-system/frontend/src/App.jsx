import React, { useState, useEffect } from 'react';
import { SceneCanvas } from './components/3d/SceneCanvas';
import { CustomCursor } from './components/common/CustomCursor';
import { CyberVisorHero } from './components/hero/CyberVisorHero';
import { AmaterasuHero } from './components/hero/AmaterasuHero';
import { HeroHeader } from './components/hero/HeroHeader';
import { HeroSection } from './components/hero/HeroSection';
import { ShorelineScrollSection } from './components/hero/ShorelineScrollSection';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { RealTimeMonitoring } from './pages/RealTimeMonitoring';
import { DoItDashboard } from './pages/DoItDashboard';
import { PatientCognitiveTests } from './pages/PatientCognitiveTests';
import { SessionHistory } from './pages/SessionHistory';
import { ModelBenchmarks } from './pages/ModelBenchmarks';
import { AuthModal } from './components/auth/AuthModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { ProfileModal } from './components/profile/ProfileModal';
import { SubjectView } from './components/session/SubjectView';
import { Sparkles, Wifi } from 'lucide-react';
import { telemetryWs } from './services/websocketClient';
import { api } from './services/api';

export default function App() {
  const getInitialTab = () => {
    try {
      const hash = window.location.hash.replace('#', '');
      if (['realtime', 'dashboard'].includes(hash)) return 'realtime';
      if (['tests', 'history', 'benchmarks', 'hero'].includes(hash)) return hash;
    } catch (e) {}
    return 'hero';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab); // 'hero', 'realtime', 'tests', 'history', 'benchmarks'
  const [activeClassifier, setActiveClassifier] = useState('random_forest');
  const [windowDuration, setWindowDuration] = useState(60);
  const [subjectId, setSubjectId] = useState('SUBJ-001');
  const [isConnected, setIsConnected] = useState(true);
  const [isSimulating, setIsSimulating] = useState(true);
  const [stressBias, setStressBias] = useState(0.0);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(() => {
    try { return window.location.hash === '#login' || window.location.hash === '#signin'; } catch (e) { return false; }
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(() => {
    try { return window.location.hash === '#settings'; } catch (e) { return false; }
  });
  const [isProfileOpen, setIsProfileOpen] = useState(() => {
    try { return window.location.hash === '#profile'; } catch (e) { return false; }
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 3D Scene scroll & mouse interpolation state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Live telemetry state
  const [telemetry, setTelemetry] = useState({
    heart_rate: 72.4,
    eda: 3.12,
    temperature: 33.8,
    ibi: 828.7
  });

  // Extracted features state
  const [features, setFeatures] = useState({
    mean_hr: 72.4,
    rmssd: 38.6,
    sdnn: 46.2,
    lf_hf_ratio: 1.42,
    eda_mean: 3.12,
    eda_scl: 2.75,
    eda_scr_peaks: 2,
    temp_mean: 33.8,
    temp_slope: -0.01
  });

  // Classified acute stress state
  const [stressState, setStressState] = useState({
    subject_id: 'SUBJ-001',
    stress_level: 'BASELINE',
    confidence: 0.94,
    classifier_used: 'random_forest',
    alert_triggered: false,
    recommendation: null
  });

  const [edaHistory, setEdaHistory] = useState([2.8, 2.9, 3.1, 3.0, 3.2, 3.1, 3.3, 3.12]);
  const [sessionHistory, setSessionHistory] = useState([]);

  // Mouse move parallax listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['realtime', 'dashboard'].includes(hash)) setActiveTab('realtime');
      else if (['tests', 'history', 'benchmarks', 'hero'].includes(hash)) setActiveTab(hash);
      else if (hash === 'settings') setIsSettingsOpen(true);
      else if (hash === 'profile') setIsProfileOpen(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Connect to WebSocket client
  useEffect(() => {
    telemetryWs.connect();

    const unsubscribe = telemetryWs.subscribe((msg) => {
      if (msg.type === 'STRESS_UPDATE') {
        if (msg.telemetry) {
          setTelemetry(msg.telemetry);
          setEdaHistory((prev) => [...prev.slice(-30), msg.telemetry.eda]);
        }
        if (msg.features) {
          setFeatures(msg.features);
        }
        if (msg.state) {
          setStressState(msg.state);
          if (msg.state.stress_level !== 'BASELINE' || msg.state.alert_triggered) {
            setSessionHistory((prev) => [msg.state, ...prev.slice(0, 40)]);
          }
        }
      } else if (msg.type === 'TELEMETRY_FRAME' && msg.data) {
        setTelemetry(msg.data);
        setEdaHistory((prev) => [...prev.slice(-30), msg.data.eda]);
      }
    });

    return () => {
      unsubscribe();
      telemetryWs.disconnect();
    };
  }, []);

  const handleClassifierChange = async (classifier) => {
    setActiveClassifier(classifier);
    try {
      await api.selectClassifier(classifier);
    } catch (e) {
      console.warn('API model switch failed:', e);
    }
  };

  const handleWindowDurationChange = (sec) => {
    setWindowDuration(sec);
  };

  const handleStressBiasChange = async (val) => {
    setStressBias(val);
    try {
      await api.setStressBias(val);
    } catch (e) {
      console.warn('API stress bias update failed:', e);
    }
  };

  const handleToggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden bg-[#fbfbfd] text-[#0a0d14] selection:bg-[#ff6a00] selection:text-white">
      {/* 0. Custom Trailing Cursor with Lag and Interactive Expansion */}
      <CustomCursor />

      {/* 1. Persistent 3D WebGL Ambient Stardust Scene Canvas */}
      <SceneCanvas scrollProgress={scrollProgress} mousePos={mousePos} />

      {/* 2. Top Navigation Header (Shown on inner views or sticky) */}
      {activeTab !== 'hero' && (
        <HeroHeader
          onNavigate={setActiveTab}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          currentUser={currentUser}
          activeTab={activeTab}
        />
      )}

      {/* 3. Main Views Conditional Rendering */}
      {activeTab === 'hero' ? (
        <div className="relative z-10">
          {/* Master Cyber Visor Hero Experience (Light Palette Matching Visor Image) */}
          <CyberVisorHero
            onStartJourney={() => setActiveTab('realtime')}
            onOpenDashboard={() => setActiveTab('realtime')}
            onOpenTests={() => setActiveTab('tests')}
            onOpenVision={() => setActiveTab('benchmarks')}
            onScrollExplore={() => {
              const el = document.getElementById('shoreline-scroll-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            activeStressState={stressState}
          />

          {/* Shoreline Mindful Vagal Restoration Scroll Parallax Section */}
          <div id="shoreline-scroll-section">
            <ShorelineScrollSection
              onLaunchDashboard={() => setActiveTab('realtime')}
              onLaunchTests={() => setActiveTab('tests')}
            />
          </div>

          {/* Secondary Scrollable Live Telemetry Preview Section (Light Palette) */}
          <section id="live-preview-section" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-24">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#ff6a00]">Integrated Medical Telemetry</span>
              <h2 className="text-3xl sm:text-4xl font-light text-[#0a0d14] mt-2">
                Real-Time Autonomic Cognition Dashboard
              </h2>
              <p className="text-xs text-slate-500 mt-2">
                Multi-modal physiological screening powered by trained Random Forest and SVM classifiers with SMOTE class balancing.
              </p>
            </div>

            <DoItDashboard
              telemetry={telemetry}
              features={features}
              stressState={stressState}
              activeClassifier={activeClassifier}
              onNavigate={setActiveTab}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
              onOpenAuth={() => setIsAuthOpen(true)}
              currentUser={currentUser}
            />
          </section>
        </div>
      ) : currentUser?.role === 'subject' ? (
        <div className="relative z-10 min-h-screen pt-24 px-4 pb-12 overflow-x-hidden flex flex-col items-center bg-[#070c18] w-full">
          <SubjectView
            telemetry={telemetry}
            currentUser={currentUser}
            onLogout={() => setCurrentUser(null)}
            onSwitchToResearcher={() => {
              setCurrentUser({ ...currentUser, role: 'researcher' });
              showToast("Switched to Clinical Researcher Cockpit.");
            }}
          />
        </div>
      ) : (
        /* Workspace View with Sidebar & Content */
        <div className="relative z-10 min-h-screen pt-24 px-4 pb-12 overflow-x-hidden flex flex-col items-center bg-[#fbfbfd]">
          {activeTab === 'realtime' && (
            <DoItDashboard
              telemetry={telemetry}
              features={features}
              stressState={stressState}
              activeClassifier={activeClassifier}
              onNavigate={setActiveTab}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
              onOpenAuth={() => setIsAuthOpen(true)}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'tests' && (
            <div className="w-full max-w-7xl">
              <PatientCognitiveTests
                telemetry={telemetry}
                features={features}
                stressState={stressState}
                onSaveSessionRecord={(record) => {
                  setSessionHistory((prev) => [record, ...prev.slice(0, 49)]);
                }}
              />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="w-full max-w-7xl">
              <SessionHistory history={sessionHistory} />
            </div>
          )}

          {activeTab === 'benchmarks' && (
            <div className="w-full max-w-7xl">
              <ModelBenchmarks />
            </div>
          )}
        </div>
      )}

      {/* Non-intrusive Connection & Auth Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-cyan-500/40 text-cyan-300 px-4 py-3 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.35)] text-xs flex items-center gap-2 animate-bounce">
          <Sparkles size={15} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4. Interactive Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Logged in as ${user.name} (${user.role?.toUpperCase() || 'RESEARCHER'})`);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeClassifier={activeClassifier}
        onClassifierChange={handleClassifierChange}
        windowDuration={windowDuration}
        onWindowDurationChange={handleWindowDurationChange}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
      />
    </div>
  );
}
