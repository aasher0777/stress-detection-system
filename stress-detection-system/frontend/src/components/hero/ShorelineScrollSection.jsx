import React, { useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Waves, HeartPulse, Brain } from 'lucide-react';
import { vagalVisorImg, dashboardPreviewImg } from '../../assets';

export const ShorelineScrollSection = ({ onLaunchDashboard, onLaunchTests }) => {
  const imageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Parallax depth calculation: smooth subtle transform on scroll
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const translateY = (progress - 0.5) * 35;
        const scale = 1 + progress * 0.05;
        imageRef.current.style.transform = `translateY(${translateY}px) scale(${scale})`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 py-20 z-10 space-y-16">
      {/* =========================================================================
          1. THE INTERACTION BOX (Featuring 700169073357549688.jpg)
          Golden Ratio layout: Left 58% Text & Actions | Right 42% Cyber Figure (Zero Overlap)
          ========================================================================= */}
      <div className="relative w-full min-h-[460px] md:min-h-[500px] rounded-[36px] overflow-hidden border border-slate-200/90 shadow-xl shadow-slate-200/40 bg-white flex flex-col md:flex-row items-center justify-between">
        
        {/* Left Side: Content & Actions (Clean, High-Contrast Obsidian & Amber) */}
        <div className="relative z-10 w-full md:w-7/12 p-8 sm:p-12 lg:p-14 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/25 text-[#d95200] text-xs font-bold uppercase tracking-widest">
            <Waves size={14} className="animate-pulse text-[#ff6a00]" />
            <span>Autonomic Vagal Restoration Protocol</span>
          </div>

          <div className="space-y-4 max-w-lg">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#0a0d14] tracking-tight leading-[1.1]">
              Calm the storm.<br />
              <span className="font-semibold text-[#ff6a00]">Rebalance the autonomic circuit.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              When acute stressors perturb parasympathetic vagal tone (RMSSD), natural biofeedback and guided vagal breathing paradigms restore sympathovagal balance within minutes.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3.5">
            <button
              onClick={onLaunchDashboard}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#ff5e00] to-[#ff9100] hover:from-[#e55400] hover:to-[#ff7b00] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/35 flex items-center gap-2 active:scale-95"
            >
              <HeartPulse size={15} />
              <span>Open Live Telemetry</span>
            </button>

            <button
              onClick={onLaunchTests}
              className="px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-800 font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-2 active:scale-95"
            >
              <Brain size={15} className="text-[#ff6a00]" />
              <span>Test Cognitive Resilience</span>
            </button>
          </div>
        </div>

        {/* Right Side: Cyber Visor Figure (700169073357549688.jpg) with Parallax Depth */}
        <div className="relative w-full md:w-5/12 h-[340px] md:h-[500px] flex items-center justify-center overflow-hidden bg-white">
          {/* Soft ambient orange glow behind figure */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 rounded-full bg-[#ff6a00]/15 blur-3xl" />
          </div>

          <div
            ref={imageRef}
            className="relative w-full h-full flex items-center justify-center p-4 transition-transform duration-150 ease-out will-change-transform"
          >
            <img
              src={vagalVisorImg}
              alt="Cyber Vagal Cognition Figure (700169073357549688)"
              className="w-full h-full object-contain filter contrast-[1.05] brightness-100 drop-shadow-[0_15px_40px_rgba(0,0,0,0.12)]"
            />
          </div>

          {/* Left subtle fade to blend with text area */}
          <div className="hidden md:block absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        </div>
      </div>

      {/* =========================================================================
          2. INTEGRATED DASHBOARD FEATURE SHOWCASE CARD (Light Theme)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 md:p-12 rounded-[36px] bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40">
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ff6a00]">
            <Sparkles size={14} />
            <span>Market-Ready Clinical Suite</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-light text-[#0a0d14] tracking-tight leading-tight">
            Designed for Dementia Screening &amp; High-Stakes Focus
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Our dual Random Forest and Support Vector Machine architecture continuously samples multi-channel photoplethysmography and electrodermal dynamics to detect stress signatures before cognitive impairment manifests.
          </p>

          <div className="pt-2">
            <button
              onClick={onLaunchDashboard}
              className="inline-flex items-center gap-2 text-[#ff6a00] hover:text-[#d95200] font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Explore full diagnostic telemetry</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div
            className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl shadow-slate-200/60 group cursor-pointer bg-white"
            onClick={onLaunchDashboard}
          >
            <img
              src={dashboardPreviewImg}
              alt="App Dashboard Interface Preview"
              className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-5">
              <span className="text-xs font-bold text-white tracking-wider uppercase bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                Interactive: Autonomic Telemetry Dashboard
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
