import React from 'react';
import { ArrowDown, ArrowRight, Brain, Activity } from 'lucide-react';
import { heroFacePng } from '../../assets';

/**
 * Minimalist Amaterasu Hero Section with Transparent Face PNG & Shoreline Teal Background
 * - Clean, slick, zero-overlap layout adhering strictly to Golden Ratio proportions (1 : 1.618).
 * - Background aura sampled directly from the sea-loving shoreline reference (#0e5264 / #082e38).
 * - Face PNG placed on the right, gazing toward the headline with seamless atmospheric blending.
 */
export const HeroSection = ({
  onStartJourney,
  onOpenPatientTests,
  onScrollClick,
  activeStressState
}) => {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between px-6 sm:px-12 lg:px-20 pt-28 pb-10 select-none z-10 overflow-hidden">
      {/* 
        Slick Shoreline Teal Atmospheric Lighting:
        Matches the PNG face lighting and the shoreline video reference palette.
      */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft volumetric cyan/teal radial aura behind the face */}
        <div className="absolute right-[8%] top-[12%] w-[680px] h-[680px] bg-gradient-to-tr from-cyan-600/30 via-teal-500/20 to-transparent rounded-full blur-[130px]" />
        {/* Ambient oceanic back-glow */}
        <div className="absolute right-[22%] top-[35%] w-[450px] h-[450px] bg-sky-500/15 rounded-full blur-[100px]" />
        {/* Vignette fading to seamless deep noir */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#02080c] via-transparent to-[#02080c]/60" />
      </div>

      {/* 
        Face PNG Centerpiece:
        Positioned cleanly in the right hemisphere (~60% width) with ample breathing space.
      */}
      <div className="absolute right-4 sm:right-12 lg:right-20 top-1/2 -translate-y-1/2 w-[340px] sm:w-[440px] lg:w-[540px] xl:w-[600px] pointer-events-none z-0 flex items-center justify-end">
        <div className="relative w-full aspect-[447/559]">
          <img
            src={heroFacePng}
            alt="Amaterasu Mind Silhouette"
            className="w-full h-full object-contain filter contrast-[1.08] brightness-100 drop-shadow-[0_0_40px_rgba(6,182,212,0.25)]"
          />
          {/* Subtle bottom gradient to blend the neck into the page backdrop */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#02080c] to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Top spacing */}
      <div />

      {/* Golden Ratio Typography Grid (38.2% Left Content / Negative Space for Face) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
        {/* Left Column (Golden ~38.2% section) - High-Contrast Sleek Typography */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-7 pointer-events-auto">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-semibold tracking-widest uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Physics Cognition Lab</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-light text-white tracking-[-0.035em] leading-[1.06] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
              Empower<br />
              <span className="font-normal text-slate-100">your mental</span><br />
              <span className="font-extralight text-slate-300">health journey</span>
            </h1>
          </div>

          {/* Interactive CTAs - Clean, No-Overlap Layout */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            {/* Glowing Violet/Indigo Pill Button (Exact match to reference) */}
            <button
              onClick={onStartJourney}
              className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-medium text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] active:scale-95"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>START YOUR JOURNEY</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenPatientTests}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/30 text-slate-200 hover:text-white font-medium text-xs tracking-wider uppercase transition-all backdrop-blur-md"
            >
              <Brain size={14} className="text-cyan-400" />
              <span>Cognitive Tests</span>
            </button>
          </div>
        </div>

        {/* Center Negative Space (Guarantees zero text collision with face) */}
        <div className="hidden lg:block lg:col-span-2 xl:col-span-3" />

        {/* Lower Right Info (Cleanly below facial features) */}
        <div className="lg:col-span-4 space-y-4 pointer-events-auto self-end pt-6 lg:pt-0">
          <p className="text-slate-300/90 text-xs sm:text-[13px] font-light leading-relaxed backdrop-blur-md bg-black/40 p-4 rounded-2xl border border-cyan-500/15 shadow-xl">
            Amaterasu is a physics cognition lab working at the intersection of technology and nature to transform mental health.
          </p>

          {/* Minimalist Telemetry Pill */}
          <div className="p-3.5 rounded-2xl bg-[#061219]/90 backdrop-blur-xl border border-cyan-500/25 shadow-2xl space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Activity size={12} className="text-cyan-400" />
                <span>Autonomic State:</span>
              </span>
              <span className="font-bold font-mono text-cyan-400">
                {activeStressState?.stress_level || 'BASELINE'}
              </span>
            </div>

            <div className="w-full h-1.5 bg-dark-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500"
                style={{ width: `${Math.round((activeStressState?.confidence || 0.94) * 100)}%` }}
              />
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>SWELL-KW Validated</span>
              <span className="font-mono text-slate-300">
                {((activeStressState?.confidence || 0.94) * 100).toFixed(0)}% Conf
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Scroll to Explore & Minimalist Nav */}
      <div className="relative z-10 flex items-center justify-between w-full pt-8 pointer-events-auto">
        <button
          onClick={onScrollClick}
          className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] font-medium text-slate-400 hover:text-white transition-colors"
        >
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown size={13} className="group-hover:translate-y-1 transition-transform text-cyan-400 animate-bounce" />
        </button>

        <button
          onClick={onStartJourney}
          className="w-10 h-10 rounded-full border border-white/20 hover:border-cyan-400/50 bg-white/5 hover:bg-cyan-500/10 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-lg"
          title="Open Dashboard"
        >
          <div className="w-4 h-0.5 bg-slate-400 group-hover:bg-cyan-300 transition-colors" />
        </button>
      </div>
    </section>
  );
};
