import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize2, SkipBack, SkipForward, 
  Film, Sliders, Award, Layers, Clock, Info, CheckCircle2
} from 'lucide-react';
import { Project } from '../types';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [aspectRatioOverride, setAspectRatioOverride] = useState<'default' | '2.39:1' | '16:9' | '4:3' | '9:16'>('default');
  const [colorGradeMode, setColorGradeMode] = useState<'finished' | 'bw-noir' | 'flat-log' | 'vintage'>('finished');
  const [activeTab, setActiveTab] = useState<'player' | 'breakdown' | 'specs'>('player');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepFrame(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepFrame(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  // 1 frame at 24fps ≈ 0.0416 seconds
  const stepFrame = (frames: number) => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + (frames * 0.0416)));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTimecode = (seconds: number) => {
    const totalFrames = Math.floor(seconds * 24);
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const frames = totalFrames % 24;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
  };

  if (!project) return null;

  const currentVideoSrc = customVideoUrl || project.videoUrl;

  // Filter styles for color grading comparison
  const filterStyles: Record<string, string> = {
    'finished': 'grayscale(100%) contrast(115%) brightness(95%)',
    'bw-noir': 'grayscale(100%) contrast(145%) brightness(88%)',
    'flat-log': 'grayscale(80%) contrast(75%) brightness(110%) saturate(40%)',
    'vintage': 'grayscale(100%) contrast(120%) sepia(20%) brightness(92%)',
  };

  return (
    <AnimatePresence>
      <motion.div
        id="video-player-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 md:p-6 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          id="video-player-modal-container"
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative flex flex-col w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-xl border border-neutral-800 bg-[#0c0c0e] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 px-4 py-3 bg-[#0a0a0c]">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-neutral-400 tracking-wider">PROJECT MASTER //</span>
                <h3 className="font-display text-sm font-semibold tracking-wide text-white uppercase">
                  {project.title}
                </h3>
              </div>
              <span className="hidden sm:inline-block rounded border border-neutral-800 px-2 py-0.5 font-mono text-[10px] text-neutral-400">
                {project.category}
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
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-black flex flex-col">
            {activeTab === 'player' && (
              <div className="relative w-full flex flex-col items-center justify-center bg-black min-h-[340px] md:min-h-[500px]">
                {/* Simulated Aspect Ratio Letterbox Container */}
                <div 
                  className={`relative w-full transition-all duration-300 flex items-center justify-center overflow-hidden bg-neutral-950 ${
                    aspectRatioOverride === '2.39:1' 
                      ? 'aspect-[2.39/1] max-w-5xl' 
                      : aspectRatioOverride === '4:3'
                      ? 'aspect-[4/3] max-w-2xl'
                      : aspectRatioOverride === '9:16'
                      ? 'aspect-[9/16] max-w-[340px]'
                      : 'aspect-video max-w-5xl'
                  }`}
                >
                  <video
                    ref={videoRef}
                    src={currentVideoSrc}
                    poster={project.posterUrl}
                    playsInline
                    loop
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={togglePlay}
                    style={{ filter: filterStyles[colorGradeMode] }}
                    className="h-full w-full object-cover cursor-pointer"
                  />

                  {/* Cinema Letterbox Bars if 2.39:1 scope is simulated over 16:9 screen */}
                  {aspectRatioOverride === '2.39:1' && (
                    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                      <div className="h-[8%] w-full bg-black/90 border-b border-neutral-900" />
                      <div className="h-[8%] w-full bg-black/90 border-t border-neutral-900" />
                    </div>
                  )}

                  {/* On-screen timecode & HUD overlay */}
                  <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 rounded bg-black/80 px-2.5 py-1 font-mono text-xs text-white/90 backdrop-blur-sm border border-neutral-800">
                    <Clock className="h-3 w-3 text-neutral-400" />
                    <span>TC: {formatTimecode(currentTime)}</span>
                  </div>

                  <div className="pointer-events-none absolute top-4 right-4 flex items-center gap-2 rounded bg-black/80 px-2.5 py-1 font-mono text-[11px] text-white/80 backdrop-blur-sm border border-neutral-800">
                    <span>FPS: 24.00</span>
                    <span className="text-neutral-500">•</span>
                    <span>LUT: {colorGradeMode.toUpperCase()}</span>
                  </div>

                  {/* Big Play Pause Center Splash on Pause */}
                  {!isPlaying && (
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-2xl transition-transform hover:scale-110"
                    >
                      <Play className="h-7 w-7 fill-current ml-1" />
                    </button>
                  )}
                </div>

                {/* Video Transport Controls */}
                <div className="w-full bg-[#0e0e11] border-t border-neutral-800 px-4 py-3">
                  {/* Scrubber Bar */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs text-neutral-400 w-24">
                      {formatTimecode(currentTime)}
                    </span>
                    <div className="relative flex-1 group">
                      <input
                        id="video-timeline-scrubber"
                        type="range"
                        min="0"
                        max={duration || 100}
                        step="0.04"
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
                      />
                    </div>
                    <span className="font-mono text-xs text-neutral-500 w-24 text-right">
                      {formatTimecode(duration)}
                    </span>
                  </div>

                  {/* Secondary Transport & Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    {/* Playback Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        id="step-frame-back-btn"
                        onClick={() => stepFrame(-1)}
                        className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
                        title="Step Back 1 Frame (Left Arrow)"
                      >
                        <SkipBack className="h-3.5 w-3.5" />
                      </button>

                      <button
                        id="play-pause-btn"
                        onClick={togglePlay}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-black font-semibold hover:bg-neutral-200 transition-colors"
                      >
                        {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                        <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                      </button>

                      <button
                        id="step-frame-forward-btn"
                        onClick={() => stepFrame(1)}
                        className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
                        title="Step Forward 1 Frame (Right Arrow)"
                      >
                        <SkipForward className="h-3.5 w-3.5" />
                      </button>

                      <button
                        id="audio-mute-btn"
                        onClick={toggleMute}
                        className="p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 ml-1"
                        title="Mute / Unmute"
                      >
                        {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>

                    {/* Format / Aspect Ratio Simulator */}
                    <div className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded border border-neutral-800">
                      <span className="font-mono text-[10px] text-neutral-500 px-1.5">MATTE:</span>
                      {(['default', '2.39:1', '16:9', '9:16'] as const).map((ratio) => (
                        <button
                          key={ratio}
                          onClick={() => setAspectRatioOverride(ratio)}
                          className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase transition-colors ${
                            aspectRatioOverride === ratio
                              ? 'bg-neutral-700 text-white font-bold'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          {ratio === 'default' ? 'ORIGINAL' : ratio}
                        </button>
                      ))}
                    </div>

                    {/* Color Profile Simulation */}
                    <div className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded border border-neutral-800">
                      <span className="font-mono text-[10px] text-neutral-500 px-1.5">COLOR:</span>
                      {(['finished', 'bw-noir', 'flat-log'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setColorGradeMode(mode)}
                          className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase transition-colors ${
                            colorGradeMode === mode
                              ? 'bg-neutral-700 text-white font-bold'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          {mode === 'finished' ? 'REC.709' : mode === 'bw-noir' ? 'NOIR' : 'LOG FLAT'}
                        </button>
                      ))}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
                  <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                    <span className="font-mono text-[11px] text-neutral-500 block">CLIENT / PRODUCER</span>
                    <span className="font-medium text-white text-sm mt-1 block">{project.client}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                    <span className="font-mono text-[11px] text-neutral-500 block">PRIMARY ROLE</span>
                    <span className="font-medium text-white text-sm mt-1 block">{project.role}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                    <span className="font-mono text-[11px] text-neutral-500 block">METRICS & CUT COUNT</span>
                    <span className="font-medium text-white text-sm mt-1 block">
                      {project.stats?.cuts || 64} Cuts • {project.stats?.views || '1M+'} Views
                    </span>
                  </div>
                </div>

                {project.awards && project.awards.length > 0 && (
                  <div className="p-4 rounded-lg bg-neutral-900/30 border border-neutral-800">
                    <span className="font-mono text-[11px] text-neutral-400 flex items-center gap-1.5 mb-2">
                      <Award className="h-3.5 w-3.5 text-neutral-300" /> RECOGNITION & SELECTIONS
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {project.awards.map((award, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded border border-neutral-700 bg-neutral-800/80 px-2.5 py-1 text-xs text-white">
                          <CheckCircle2 className="h-3 w-3 text-neutral-300" /> {award}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: NLE & Tech Specs */}
            {activeTab === 'specs' && (
              <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6">
                <div>
                  <span className="font-mono text-xs text-neutral-400">TECHNICAL CONFORM & TURNOVER //</span>
                  <h4 className="font-display text-xl font-bold text-white mt-1">Post-Production Technical Stack</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
                    <span className="font-mono text-[11px] text-neutral-500">POST SOFTWARE SUITE</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.tools.map((tool, idx) => (
                        <span key={idx} className="rounded bg-neutral-800 px-2 py-1 font-mono text-xs text-neutral-200">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
                    <span className="font-mono text-[11px] text-neutral-500">MASTER DELIVERY FORMAT</span>
                    <p className="font-mono text-xs text-neutral-300 mt-2">
                      ProRes 4444 XQ • Rec.709 / ACEScct • 24.00 fps • 48kHz 24-bit 5.1 Surround & Stereo Mix
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
                    <span className="font-mono text-[11px] text-neutral-500">COLOR SPACE PIPELINE</span>
                    <p className="font-mono text-xs text-neutral-300 mt-2">
                      ACES 1.3 Color Science • Custom film density curves • Kodak 5219 / 2383 Print Stock Emulation
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-900/60 border border-neutral-800">
                    <span className="font-mono text-[11px] text-neutral-500">TIMELINE CADENCE</span>
                    <p className="font-mono text-xs text-neutral-300 mt-2">
                      {project.stats?.timelineBpm || '120 BPM'} Rhythm grid sync • Frame-locked Foley & Impact sub-bass
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom quick action bar */}
          <div className="border-t border-neutral-800 bg-[#0c0c0e] px-4 py-2.5 flex items-center justify-between text-xs text-neutral-400">
            <span className="font-mono text-[11px]">
              Keyboard Shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200">Space</kbd> Play/Pause • <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200">→</kbd> Frame Step
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
