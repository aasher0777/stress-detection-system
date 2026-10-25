import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { heroFacePng } from '../../assets';

/**
 * Award-Winning Cinematic Hero Section strictly replicating Amaterasu.ai
 * - Dark atmospheric background blending deep oceanic teal and black
 * - Centered soft volumetric spotlight (cyan/emerald glow) illuminating the central silhouette from behind
 * - Woman in profile tilting her head upwards with closed eyes
 * - Headline center-left: "Empower your mental health journey"
 * - Translucent deep-purple pill CTA with liquid expansion physics on hover: "• START YOUR JOURNEY"
 * - Top navigation: Solitary dot (left), "AMATERASU" (center), "VISION" + 3x3 dot-grid (right)
 * - Middle-right: Right-aligned light-cyan paragraph
 * - Bottom-left: "SCROLL TO EXPLORE ↓"
 * - Mouse parallax shifting lighting and depth
 * - Cinematic entrance sequence
 */
export const AmaterasuHero = ({
  onStartJourney,
  onOpenDashboard,
  onOpenTests,
  onOpenVision,
  onScrollExplore
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Cinematic Entrance Sequence on Mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // 3D Parallax Mouse Tracking (Physics-based lighting shift)
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen min-h-[720px] overflow-hidden bg-[#02070a] text-slate-100 flex flex-col justify-between p-6 sm:p-10 lg:p-16 select-none"
    >
      {/* =========================================================================
          1. BACKGROUND & VOLUMETRIC LIGHTING (Deep Oceanic Teal & Cyan Volumetric Spotlight)
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Base oceanic deep gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#02070a] via-[#041920] to-[#010507]" />

        {/* 
          Central Cinematic Volumetric Spotlight (Glowing Cyan / Green)
          Smoothly expands on page load via isLoaded transition and responds to mouse coordinates
        */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out ${
            isLoaded
              ? 'w-[750px] sm:w-[900px] lg:w-[1100px] h-[750px] sm:h-[900px] lg:h-[1100px] opacity-100 scale-100'
              : 'w-0 h-0 opacity-0 scale-50'
          }`}
          style={{
            transform: `translate(calc(-50% + ${mouseOffset.x * 35}px), calc(-50% + ${mouseOffset.y * 35}px))`,
            background: 'radial-gradient(circle, rgba(16,185,195,0.45) 0%, rgba(6,112,128,0.3) 35%, rgba(4,48,58,0.15) 60%, rgba(2,7,10,0) 80%)',
            filter: 'blur(55px)'
          }}
        />

        {/* Secondary soft aqua rim light accent behind head */}
        <div
          className="absolute right-[20%] top-[30%] w-[500px] h-[500px] rounded-full opacity-60 pointer-events-none transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mouseOffset.x * -25}px, ${mouseOffset.y * -25}px)`,
            background: 'radial-gradient(circle, rgba(45,212,191,0.25) 0%, rgba(6,78,92,0.15) 50%, transparent 75%)',
            filter: 'blur(70px)'
          }}
        />

        {/* Subtle vignette border */}
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-80" />
      </div>

      {/* =========================================================================
          2. CENTRAL SUBJECT ASSET (Woman in Profile Tilting Upwards with Closed Eyes)
          ========================================================================= */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-all duration-1000 ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          transform: `translate(${mouseOffset.x * -18}px, ${mouseOffset.y * -14}px)`
        }}
      >
        <div className="relative w-[380px] sm:w-[500px] lg:w-[620px] xl:w-[700px] max-h-[85vh] aspect-[447/559] flex items-center justify-center">
          <img
            src={heroFacePng}
            alt="Amaterasu Mind Profile"
            className="w-full h-full object-contain filter contrast-[1.08] brightness-100 drop-shadow-[0_0_50px_rgba(6,182,212,0.3)]"
          />
          {/* Bottom blend into deep ocean floor */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#02070a] via-[#02070a]/80 to-transparent" />
        </div>
      </div>

      {/* =========================================================================
          3. TOP NAVIGATION (Solitary Dot, "AMATERASU", "VISION" + 3x3 Dot-Grid)
          ========================================================================= */}
      <header
        className={`relative z-20 w-full flex items-center justify-between pointer-events-auto transition-all duration-700 delay-200 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        {/* Left: Solitary Floating Dot Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#67e8f9] animate-pulse" />
          </div>
          {/* Subtle direct link to Interactive Dashboard */}
          <button
            onClick={onOpenDashboard}
            className="hidden sm:inline-block text-[10px] tracking-[0.2em] font-semibold text-slate-400 hover:text-cyan-300 uppercase transition-colors"
          >
            DASHBOARD
          </button>
        </div>

        {/* Center: "AMATERASU" in Small Tracked-Out Typography */}
        <div className="text-center">
          <span className="text-xs sm:text-[13px] tracking-[0.45em] font-light text-slate-200 uppercase transition-colors">
            AMATERASU
          </span>
        </div>

        {/* Right: "VISION" paired with Minimalist 3x3 Dot-Grid Menu Icon */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenTests}
            className="hidden sm:inline-block text-[10px] tracking-[0.2em] font-semibold text-slate-400 hover:text-cyan-300 uppercase transition-colors"
          >
            SCREENING
          </button>

          <button
            onClick={onOpenVision}
            className="group flex items-center gap-3 text-xs tracking-[0.3em] font-light text-slate-300 hover:text-white uppercase transition-colors"
          >
            <span>VISION</span>
            {/* 3x3 Minimalist Dot-Grid Menu Icon (9 dots) */}
            <div className="grid grid-cols-3 gap-1 w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 bg-white rounded-full group-hover:bg-cyan-300 transition-colors" />
              ))}
            </div>
          </button>
        </div>
      </header>

      {/* =========================================================================
          4. MAIN HEADLINE & CALL-TO-ACTION (Center-Left) + CONTEXTUAL COPY (Right)
          ========================================================================= */}
      <div className="relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto pointer-events-none">
        
        {/* Left Column (Center-Left): Main Headline and Glowing Deep-Purple CTA */}
        <div
          className={`lg:col-span-6 xl:col-span-5 space-y-8 pointer-events-auto transition-all duration-1000 delay-300 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transform: `translate(${mouseOffset.x * 10}px, ${mouseOffset.y * 8}px)`
          }}
        >
          {/* Main Headline (Crisp white geometric typography) */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] font-light text-white tracking-[-0.035em] leading-[1.05] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            Empower<br />
            <span className="font-normal text-slate-100">your mental</span><br />
            <span className="font-extralight text-slate-300">health journey</span>
          </h1>

          {/* 
            Call-to-Action (CTA):
            Pill-shaped button with glowing translucent deep-purple background.
            Left-aligned dot alongside text "START YOUR JOURNEY" in widely tracked micro-typography.
            Includes subtle liquid-like gradient expansion when hovered.
          */}
          <div className="pt-2">
            <button
              onClick={onStartJourney}
              className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#2c154f]/85 hover:bg-[#3b1c6b] border border-[#7c4dff]/50 hover:border-[#a855f7] text-white transition-all duration-300 shadow-[0_0_35px_rgba(124,77,255,0.4)] hover:shadow-[0_0_55px_rgba(168,85,247,0.65)] active:scale-95 overflow-hidden"
            >
              {/* Liquid-like gradient expansion glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#9b6bf7]/0 via-[#ec4899]/20 to-[#9b6bf7]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              
              {/* Small Left-Aligned Glowing Dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff] group-hover:scale-125 transition-transform" />

              {/* Widely Tracked Micro-Typography */}
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-white/95">
                START YOUR JOURNEY
              </span>
            </button>
          </div>
        </div>

        {/* Center Gap: Preserves the majestic silhouette of the face */}
        <div className="hidden lg:block lg:col-span-3 xl:col-span-4" />

        {/* Middle-Right: Contextual Copy (Light-cyan, right-aligned) */}
        <div
          className={`lg:col-span-3 space-y-4 pointer-events-auto self-center text-left lg:text-right transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transform: `translate(${mouseOffset.x * -8}px, ${mouseOffset.y * -6}px)`
          }}
        >
          <p className="text-[#a5f3fc]/90 text-xs sm:text-[13px] font-light leading-relaxed tracking-wide drop-shadow-md max-w-xs ml-auto">
            Amaterasu is a physics cognition lab working at the intersection of technology and nature to transform mental health.
          </p>
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
        {/* Footer (Bottom Left): "SCROLL TO EXPLORE" paired with a delicate downward arrow */}
        <button
          onClick={onScrollExplore}
          className="group flex items-center gap-2.5 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium text-slate-400 hover:text-white transition-colors"
        >
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown
            size={13}
            className="text-cyan-400 group-hover:translate-y-1 transition-transform animate-bounce"
          />
        </button>

        {/* Bottom Right: Minimalist Circle Page Indicator from Amaterasu Reference */}
        <button
          onClick={onStartJourney}
          className="w-9 h-9 rounded-full border border-white/20 hover:border-cyan-400/50 bg-white/5 hover:bg-cyan-500/10 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-md"
          title="Open Dashboard"
        >
          <div className="w-3.5 h-0.5 bg-slate-400 group-hover:bg-cyan-300 transition-colors" />
        </button>
      </footer>
    </div>
  );
};
