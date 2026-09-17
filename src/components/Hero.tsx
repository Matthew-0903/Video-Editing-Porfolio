import React, { useState, useRef } from 'react';
import { Play, Volume2, VolumeX, Maximize, Film, ArrowDown, Sparkles } from 'lucide-react';
import { DecryptedText } from './reactbits/DecryptedText';
import { MagneticButton } from './reactbits/MagneticButton';
import { BlurText } from './reactbits/BlurText';

interface HeroProps {
  heroVideoUrl: string;
  onOpenReelModal: () => void;
  onScrollToProjects: () => void;
  isCustomVideoActive?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  heroVideoUrl,
  onOpenReelModal,
  onScrollToProjects,
  isCustomVideoActive,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [aspectScope, setAspectScope] = useState<'2.39' | '16:9'>('2.39');
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section id="hero-showreel" className="relative pt-28 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Top Tagline & Decrypted Headline */}
      <div className="space-y-4 text-center max-w-4xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3.5 py-1 text-xs font-mono text-neutral-300">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          <span>MATTHEW ROSS SANOTA // SHORT-FORM & LONG-FORM VIDEO EDITING</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.05]">
          <DecryptedText
            text="EDITING IN MOTION"
            speed={35}
            maxIterations={8}
            animateOn="view"
            className="text-white"
            encryptedClassName="text-neutral-600"
          />
        </h1>

        <BlurText
          text="Short-Form Retention Hooks • Long-Form Narrative Pacing • Dynamic Sound Design"
          delay={40}
          className="text-neutral-400 font-mono text-xs sm:text-sm justify-center tracking-wide"
        />
      </div>

      {/* Cinematic Showreel Player Box */}
      <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
        {/* Film Slate Top Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 bg-[#09090b] px-4 py-2.5 font-mono text-[11px] text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-white font-bold uppercase tracking-wider">
              <Film className="h-3.5 w-3.5" /> WHO IS THE GC FOR YOUR FINANCIAL HOUSE?
            </span>
            {isCustomVideoActive && (
              <span className="rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 text-[10px] font-semibold">
                ● USER TEST FOOTAGE LOADED
              </span>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>PRORES 4444 XQ</span>
            <span>24.00 FPS</span>
            <div className="flex items-center gap-1 bg-neutral-900 rounded p-0.5 border border-neutral-800">
              <button
                onClick={() => setAspectScope('2.39')}
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  aspectScope === '2.39' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                2.39:1 SCOPE
              </button>
              <button
                onClick={() => setAspectScope('16:9')}
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  aspectScope === '16:9' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                16:9 FULL
              </button>
            </div>
          </div>
        </div>

        {/* Video Screen Container */}
        <div
          className={`relative w-full overflow-hidden bg-black transition-all duration-300 ${
            aspectScope === '2.39' ? 'aspect-[2.39/1]' : 'aspect-video'
          }`}
        >
          <video
            ref={videoRef}
            src={heroVideoUrl}
            poster="/thumbnails/lf-gc-financial-house.webp"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="h-full w-full object-cover filter grayscale contrast-125 brightness-95 transition-all duration-500 hover:grayscale-0"
          />

          {/* Film Matte Overlay (when 2.39:1 is active) */}
          {aspectScope === '2.39' && (
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
              <div className="h-[4%] w-full bg-black/80" />
              <div className="h-[4%] w-full bg-black/80" />
            </div>
          )}

          {/* Slate HUD Overlay */}
          <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] sm:text-xs text-neutral-300 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded border border-neutral-800">
            <span className="text-white font-bold">SCENE: 01</span> // TAKE: 04 // REC709 FINISH
          </div>

          {/* Quick Corner Controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              id="hero-sound-toggle-btn"
              onClick={toggleSound}
              className="flex items-center gap-1.5 rounded-lg bg-black/80 border border-neutral-800 px-3 py-1.5 font-mono text-xs text-white backdrop-blur-sm hover:bg-white hover:text-black transition-colors"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isMuted ? 'UNMUTE' : 'AUDIO ON'}</span>
            </button>

            <MagneticButton
              id="hero-full-modal-btn"
              onClick={onOpenReelModal}
              className="flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 font-mono text-xs font-bold text-black hover:bg-neutral-200 transition-colors shadow-lg"
            >
              <Maximize className="h-3.5 w-3.5" />
              <span>FULL MONITOR</span>
            </MagneticButton>
          </div>
        </div>

        {/* Bottom Slate Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 border-t border-neutral-800/80 bg-[#09090b] px-4 py-3 font-mono text-xs">
          <div className="border-r border-neutral-800/80 pr-2">
            <span className="text-neutral-500 text-[10px] block">EDITORIAL NLE</span>
            <span className="text-white font-semibold">ADOBE PREMIERE PRO</span>
          </div>
          <div className="border-r border-neutral-800/80 px-2">
            <span className="text-neutral-500 text-[10px] block">COLOR & AUDIO</span>
            <span className="text-white font-semibold">REC.709 / 48kHz STEREO</span>
          </div>
          <div className="pl-2 flex items-center justify-end">
            <button
              onClick={onScrollToProjects}
              className="inline-flex items-center gap-1 text-neutral-300 hover:text-white transition-colors text-[11px]"
            >
              <span>EXPLORE WORK</span>
              <ArrowDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
