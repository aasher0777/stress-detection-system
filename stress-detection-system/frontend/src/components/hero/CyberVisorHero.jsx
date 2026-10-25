import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Brain, Activity, Sparkles, ShieldCheck } from 'lucide-react';
import { cyberVisorHeroImg } from '../../assets';

/**
 * High-Key Cyber Visor Hero Experience (Light Color Palette)
 * - Pure luminous white/off-white background with subtle warm ambient amber radiance
 * - High-resolution cybernetic figure with glowing amber-orange visor as the centerpiece
 * - Interactive 3D parallax mouse tracking & real-time dynamic visor lens flare
 * - High-contrast obsidian geometric typography with Golden Ratio balance
 * - Radiant amber-orange pill CTA with interactive liquid glow physics
 */
export const CyberVisorHero = ({
  onStartJourney,
  onOpenDashboard,
  onOpenTests,
  onOpenVision,
  onScrollExplore,
  activeStressState
}) => {
  const [isLoaded, setIsLoaded] = useState(true);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth entrance sequence on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 120);
    return () => clearTimeout(timer);
  }, []);

  // Smooth 3D parallax mouse listener
  useEffect(() => {
    let animId;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      targetY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    };

    const loop = () => {
      // Smooth 60fps lerp interpolation
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setMouseOffset({ x: currentX, y: currentY });
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen min-h-[640px] max-h-[920px] overflow-hidden bg-[#ffffff] text-[#0a0d14] flex flex-col justify-between p-6 sm:p-10 lg:p-14 select-none transition-colors duration-700">
      {/* =========================================================================
          1. LIGHT BACKGROUND & AMBIENT VISOR RADIANCE
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft, warm ambient amber radiance matching the visor's orange glow */}
        <div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] rounded-full pointer-events-none transition-transform duration-700 ease-out"
          style={{
            transform: `translate(calc(-50% + ${mouseOffset.x * 30}px), calc(-50% + ${mouseOffset.y * 30}px))`,
            background: 'radial-gradient(circle, rgba(255, 106, 0, 0.12) 0%, rgba(255, 140, 0, 0.05) 45%, transparent 75%)',
            filter: 'blur(70px)'
          }}
        />

        {/* Subtle geometric light-gray grid backdrop lines */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      {/* =========================================================================
          2. THE SUBJECT ASSET: CYBER FIGURE WITH GLOWING ORANGE VISOR
          ========================================================================= */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-all duration-1000 ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          transform: `translate(${mouseOffset.x * -20}px, ${mouseOffset.y * -15}px)`
        }}
      >
        <div
          className="relative w-[340px] sm:w-[460px] lg:w-[580px] xl:w-[640px] max-h-[88vh] aspect-[736/977] flex items-center justify-center cursor-pointer pointer-events-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Cyber Visor Image with feathered edge to blend seamlessly into white */}
          <img
            src={cyberVisorHeroImg}
            alt="Cybernetic Cognition Subject"
            className="w-full h-full object-contain filter contrast-[1.04] brightness-100 drop-shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-out"
            style={{
              maskImage: 'radial-gradient(ellipse 80% 85% at 50% 50%, black 65%, transparent 98%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 85% at 50% 50%, black 65%, transparent 98%)'
            }}
          />

          {/* 
            Interactive Visor Optical Flare:
            Dynamically shifts across the visor based on real-time cursor X coordinates
          */}
          <div
            className={`absolute top-[26.5%] left-[24%] right-[24%] h-12 pointer-events-none rounded-full transition-all duration-300 ${
              isHovered ? 'opacity-90 scale-y-125' : 'opacity-70'
            }`}
            style={{
              background: `linear-gradient(90deg, transparent 0%, rgba(255, 120, 0, 0.4) 40%, rgba(255, 220, 150, 0.9) ${50 + mouseOffset.x * 35}%, rgba(255, 120, 0, 0.4) 60%, transparent 100%)`,
              filter: 'blur(6px)',
              boxShadow: isHovered
                ? '0 0 35px rgba(255, 106, 0, 0.8), 0 0 70px rgba(255, 140, 0, 0.5)'
                : '0 0 25px rgba(255, 106, 0, 0.5)'
            }}
          />
        </div>
      </div>

      {/* =========================================================================
          3. TOP NAVIGATION (Minimalist Light Theme)
          ========================================================================= */}
      <header
        className={`relative z-20 w-full flex items-center justify-between pointer-events-auto transition-all duration-700 delay-200 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        {/* Left: Glowing Amber Dot + Dashboard Link */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border border-black/15 flex items-center justify-center bg-white shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] shadow-[0_0_8px_#ff6a00] animate-pulse" />
          </div>
          <button
            onClick={onOpenDashboard}
            className="hidden sm:inline-block text-[11px] tracking-[0.2em] font-bold text-slate-600 hover:text-[#ff6a00] uppercase transition-colors"
          >
            DASHBOARD
          </button>
        </div>

        {/* Center: Brand Typography */}
        <div className="text-center">
          <span className="text-xs sm:text-[13px] tracking-[0.45em] font-medium text-slate-900 uppercase">
            AMATERASU
          </span>
        </div>

        {/* Right: Screening + Vision */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenTests}
            className="hidden sm:inline-block text-[11px] tracking-[0.2em] font-bold text-slate-600 hover:text-[#ff6a00] uppercase transition-colors"
          >
            SCREENING
          </button>

          <button
            onClick={onOpenVision}
            className="group flex items-center gap-2.5 text-xs tracking-[0.25em] font-medium text-slate-800 hover:text-[#ff6a00] uppercase transition-colors"
          >
            <span>VISION</span>
            {/* 3x3 Minimalist Dot-Grid Menu Icon */}
            <div className="grid grid-cols-3 gap-1 w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 bg-slate-800 rounded-full group-hover:bg-[#ff6a00] transition-colors" />
              ))}
            </div>
          </button>
        </div>
      </header>

      {/* =========================================================================
          4. MAIN HEADLINE & GLOWING AMBER-ORANGE CTA (Center-Left) + CONTEXT (Right)
          ========================================================================= */}
      <div className="relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto pointer-events-none">
        {/* Left Column: High-Contrast Geometric Typography in Obsidian Black */}
        <div
          className={`lg:col-span-6 xl:col-span-5 space-y-8 pointer-events-auto transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transform: `translate(${mouseOffset.x * 8}px, ${mouseOffset.y * 6}px)`
          }}
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/25 text-[#d95200] text-[11px] font-bold tracking-widest uppercase mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] animate-pulse" />
              <span>Bio-Resilience Lab</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.3rem] font-light text-[#0a0d14] tracking-[-0.035em] leading-[1.05]">
              Empower<br />
              <span className="font-semibold text-[#0a0d14]">your mental</span><br />
              <span className="font-light text-slate-500">health journey</span>
            </h1>
          </div>

          {/* 
            Vibrant Amber-Orange Pill CTA Button:
            Matches the radiant glow of the cybernetic visor
          */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={onStartJourney}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#ff5e00] via-[#ff7700] to-[#ff9100] hover:from-[#e55400] hover:to-[#ff7b00] text-white font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_10px_35px_rgba(255,106,0,0.45)] hover:shadow-[0_12px_45px_rgba(255,106,0,0.65)] active:scale-95 overflow-hidden"
            >
              {/* Internal specular shimmer on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              
              {/* Left-Aligned Glowing White Dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] group-hover:scale-125 transition-transform" />

              <span>START YOUR JOURNEY</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-white/90" />
            </button>

            <button
              onClick={onOpenTests}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-800 font-semibold text-xs tracking-wider uppercase transition-all active:scale-95"
            >
              <Brain size={15} className="text-[#ff6a00]" />
              <span>Cognitive Tests</span>
            </button>
          </div>
        </div>

        {/* Center Space to preserve the cyber figure */}
        <div className="hidden lg:block lg:col-span-3 xl:col-span-4" />

        {/* Middle-Right Context Paragraph & Real-Time Bio-Resilience Badge */}
        <div
          className={`lg:col-span-3 space-y-4 pointer-events-auto self-center text-left lg:text-right transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transform: `translate(${mouseOffset.x * -8}px, ${mouseOffset.y * -6}px)`
          }}
        >
          <p className="text-slate-600 text-xs sm:text-[13px] font-normal leading-relaxed tracking-wide max-w-xs ml-auto">
            Amaterasu is a physics cognition lab working at the intersection of technology and nature to transform mental health.
          </p>

          {/* Clean Real-Time Autonomic Badge in light glass */}
          <div className="p-3.5 rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-lg space-y-2 max-w-xs ml-auto text-left">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Activity size={12} className="text-[#ff6a00]" />
                <span>Autonomic State:</span>
              </span>
              <span className="font-bold font-mono text-[#ff6a00]">
                {activeStressState?.stress_level || 'BASELINE'}
              </span>
            </div>

            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff6a00] to-[#ffa200] transition-all duration-500"
                style={{ width: `${Math.round((activeStressState?.confidence || 0.94) * 100)}%` }}
              />
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>SWELL-KW Validated</span>
              <span className="font-mono text-slate-600 font-semibold">
                {((activeStressState?.confidence || 0.94) * 100).toFixed(0)}% Conf
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. FOOTER (Bottom-Left: "SCROLL TO EXPLORE ↓", Bottom-Right: Page Indicator)
          ========================================================================= */}
      <footer
        className={`relative z-20 w-full flex items-center justify-between pointer-events-auto transition-all duration-700 delay-300 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <button
          onClick={onScrollExplore}
          className="group flex items-center gap-2.5 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown
            size={13}
            className="text-[#ff6a00] group-hover:translate-y-1 transition-transform animate-bounce"
          />
        </button>

        <button
          onClick={onStartJourney}
          className="w-9 h-9 rounded-full border border-slate-300 hover:border-[#ff6a00] bg-white hover:bg-[#ff6a00]/10 flex items-center justify-center text-slate-500 hover:text-[#ff6a00] transition-all shadow-sm"
          title="Open Dashboard"
        >
          <div className="w-3.5 h-0.5 bg-slate-500 group-hover:bg-[#ff6a00] transition-colors" />
        </button>
      </footer>
    </div>
  );
};
