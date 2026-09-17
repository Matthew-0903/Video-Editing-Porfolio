import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Maximize2, Film, Clock, Heart,
  MessageCircle, Bookmark, Share2, Music2, ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { Project } from '../types';
import { parseVideoUrl } from '../utils/video';

interface VideoPlayerModalProps {
  project: Project | null;
  onClose: () => void;
  customVideoUrl?: string;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  project,
  onClose,
  customVideoUrl
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [aspectRatioOverride, setAspectRatioOverride] = useState<'default' | '2.39:1' | '16:9' | '4:3' | '9:16'>('default');
  const [activeTab, setActiveTab] = useState<'player' | 'breakdown' | 'specs'>('player');
  const [showSafeZone, setShowSafeZone] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  if (!project) return null;

  const currentVideoSrc = customVideoUrl || project.videoUrl;
  const parsedVideo = parseVideoUrl(currentVideoSrc);

  const effectiveAspect = aspectRatioOverride !== 'default' 
    ? aspectRatioOverride 
    : project.aspectRatio === '9:16' ? '9:16' : '16:9';

  return (
    <AnimatePresence>
      <motion.div
        id="video-player-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 sm:p-4 md:p-6"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative flex flex-col w-full max-w-6xl max-h-[95vh] rounded-2xl overflow-hidden border border-neutral-800 bg-[#08080a] shadow-2xl"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 px-4 py-3 bg-[#0a0a0c]">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-neutral-400 tracking-wider hidden sm:inline">MASTER MONITOR //</span>
                <h3 className="font-display text-sm sm:text-base font-semibold tracking-wide text-white uppercase truncate max-w-xs md:max-w-md">
                  {project.title}
                </h3>
              </div>
              <span className="hidden sm:inline-block rounded border border-neutral-800 px-2 py-0.5 font-mono text-[10px] text-neutral-400">
                {project.category}
              </span>
              <span className="hidden md:inline-block rounded bg-neutral-900 border border-neutral-700 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                ● YOUTUBE EMBED
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center bg-neutral-900 rounded-lg p-0.5 border border-neutral-800">
                <button
                  id="tab-btn-player"
                  onClick={() => setActiveTab('player')}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                    activeTab === 'player' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  MONITOR
                </button>
                <button
                  id="tab-btn-breakdown"
                  onClick={() => setActiveTab('breakdown')}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                    activeTab === 'breakdown' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  CUT NOTES
                </button>
                <button
                  id="tab-btn-specs"
                  onClick={() => setActiveTab('specs')}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                    activeTab === 'specs' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  NLE SPECS
                </button>
              </div>

              <button
                id="close-modal-btn"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 transition-colors hover:bg-white hover:text-black"
                title="Close (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Main Video Viewport & Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-black flex flex-col justify-center">
            {activeTab === 'player' && (
              <div className="relative w-full flex flex-col items-center justify-center bg-black min-h-[360px] md:min-h-[520px] p-2 md:p-4">
                {/* Simulated Aspect Ratio Container */}
                <div 
                  ref={containerRef}
                  className={`relative w-full transition-all duration-300 flex items-center justify-center overflow-hidden bg-neutral-950 rounded-lg ${
                    effectiveAspect === '2.39:1' 
                      ? 'aspect-[2.39/1] max-w-5xl' 
                      : effectiveAspect === '4:3'
                      ? 'aspect-[4/3] max-w-2xl'
                      : effectiveAspect === '9:16'
                      ? 'aspect-[9/16] max-w-[340px] md:max-w-[380px] max-h-[68vh]'
                      : 'aspect-video max-w-5xl'
                  }`}
                >
                  <iframe
                    key={parsedVideo.embedUrl}
                    src={parsedVideo.embedUrl}
                    title={project.title}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />

                  {/* TikTok / Instagram Reels UI Safe Zone Simulator */}
                  {showSafeZone && effectiveAspect === '9:16' && (
                    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-4 bg-transparent select-none">
                      <div className="flex items-center justify-center gap-4 text-xs font-semibold text-white/70 drop-shadow">
                        <span className="opacity-50">Following</span>
                        <span className="border-b-2 border-white pb-0.5">For You</span>
                      </div>

                      <div className="absolute right-3 bottom-20 flex flex-col items-center gap-4 text-white/90 drop-shadow">
                        <div className="flex flex-col items-center gap-1">
                          <div className="h-9 w-9 rounded-full bg-neutral-800/80 border border-white/40 flex items-center justify-center">
                            <Heart className="h-5 w-5 fill-white" />
                          </div>
                          <span className="text-[10px] font-mono">142K</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="h-9 w-9 rounded-full bg-neutral-800/80 border border-white/40 flex items-center justify-center">
                            <MessageCircle className="h-5 w-5 fill-white" />
                          </div>
                          <span className="text-[10px] font-mono">2.4K</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="h-9 w-9 rounded-full bg-neutral-800/80 border border-white/40 flex items-center justify-center">
                            <Bookmark className="h-5 w-5 fill-white" />
                          </div>
                          <span className="text-[10px] font-mono">38K</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="h-9 w-9 rounded-full bg-neutral-800/80 border border-white/40 flex items-center justify-center">
                            <Share2 className="h-5 w-5" />
                          </div>
                          <span className="text-[10px] font-mono">Share</span>
                        </div>
                      </div>

                      <div className="max-w-[75%] space-y-1 text-white/90 drop-shadow">
                        <div className="text-xs font-bold font-mono">@matthewross_edits • Master</div>
                        <p className="text-[11px] line-clamp-2 text-white/80">{project.description}</p>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-white/70">
                          <Music2 className="h-3 w-3 animate-spin" />
                          <span>Original Sound • Master Mix (Stereo)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Transport Controls */}
                <div className="w-full max-w-5xl bg-[#0e0e11] border border-neutral-800 rounded-xl px-4 py-3 mt-3">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-xs text-neutral-300">
                        STREAMING VIA YOUTUBE HIGH-PERFORMANCE EMBED
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Format / Aspect Ratio Simulator */}
                      <div className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded border border-neutral-800">
                        <span className="font-mono text-[10px] text-neutral-500 px-1">FRAME:</span>
                        {(['default', '16:9', '9:16', '2.39:1'] as const).map((ratio) => (
                          <button
                            key={ratio}
                            onClick={() => setAspectRatioOverride(ratio)}
                            className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase transition-colors ${
                              aspectRatioOverride === ratio
                                ? 'bg-white text-black font-bold'
                                : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            {ratio === 'default' ? 'AUTO' : ratio}
                          </button>
                        ))}
                      </div>

                      {/* Safe Zone Toggle (for 9:16) */}
                      {effectiveAspect === '9:16' && (
                        <button
                          onClick={() => setShowSafeZone(!showSafeZone)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded font-mono text-[10px] border transition-colors ${
                            showSafeZone 
                              ? 'bg-blue-600 text-white border-blue-500 font-bold' 
                              : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:text-white'
                          }`}
                          title="Toggle TikTok / Reels Safe Margins Overlay"
                        >
                          <ShieldCheck className="h-3 w-3" />
                          <span>REELS HUD</span>
                        </button>
                      )}

                      {/* Open external video button */}
                      {parsedVideo.videoId && (
                        <a
                          href={`https://www.youtube.com/watch?v=${parsedVideo.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs border border-neutral-800 transition-colors"
                        >
                          <span>OPEN ON YOUTUBE</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}

                      {/* Fullscreen */}
                      <button
                        onClick={toggleFullscreen}
                        className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
                        title="Fullscreen"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Breakdown & Editorial Notes */}
            {activeTab === 'breakdown' && (
              <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
                <div>
                  <span className="font-mono text-xs text-neutral-400">EDITORIAL SYNOPSIS //</span>
                  <h4 className="font-display text-2xl font-bold text-white mt-1">{project.title}</h4>
                  <p className="text-neutral-300 text-sm md:text-base leading-relaxed mt-3">
                    {project.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
                  <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                    <span className="font-mono text-[11px] text-neutral-500 block">CLIENT / CREATIVE</span>
                    <span className="font-medium text-white text-sm mt-1 block">{project.client}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                    <span className="font-mono text-[11px] text-neutral-500 block">PRIMARY ROLE</span>
                    <span className="font-medium text-white text-sm mt-1 block">{project.role}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                    <span className="font-mono text-[11px] text-neutral-500 block">EDITORIAL SOFTWARE</span>
                    <span className="font-medium text-white text-sm mt-1 block">Adobe Premiere Pro</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: NLE & Tech Specs */}
            {activeTab === 'specs' && (
              <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
                <div>
                  <span className="font-mono text-xs text-neutral-400">TECHNICAL CONFORM & TURNOVER //</span>
                  <h4 className="font-display text-xl font-bold text-white mt-1">Post-Production Technical Stack</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
                    <span className="font-mono text-[11px] text-neutral-500">POST SOFTWARE</span>
                    <p className="font-mono text-xs text-neutral-200 mt-2 font-semibold">
                      Adobe Premiere Pro
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
                    <span className="font-mono text-[11px] text-neutral-500">MASTER DELIVERY FORMAT</span>
                    <p className="font-mono text-xs text-neutral-300 mt-2">
                      H.264 / ProRes • Rec.709 Color • 24.00 fps • 48kHz Stereo Master
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
                    <span className="font-mono text-[11px] text-neutral-500">ASPECT RATIO & TIMECODE</span>
                    <p className="font-mono text-xs text-neutral-300 mt-2">
                      Native {project.aspectRatio} • Runtime {project.duration} • Header TC {project.timecode}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom quick action bar */}
          <div className="border-t border-neutral-800 bg-[#0c0c0e] px-4 py-2.5 flex items-center justify-between text-xs text-neutral-400">
            <span className="font-mono text-[11px]">
              Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200">Esc</kbd> to Close
            </span>
            <button
              onClick={() => setActiveTab(activeTab === 'player' ? 'breakdown' : 'player')}
              className="text-white hover:underline font-mono text-[11px]"
            >
              {activeTab === 'player' ? 'View Cut Notes →' : '← Back to Monitor'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
