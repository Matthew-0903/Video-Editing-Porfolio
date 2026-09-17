import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Grid, LayoutGrid, List, Smartphone, Film, Award, Clock, Maximize2 } from 'lucide-react';
import { Project } from '../types';
import { SpotlightCard } from './reactbits/SpotlightCard';
import { parseVideoUrl } from '../utils/video';

interface ProjectGridProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

interface ProjectCardMediaProps {
  project: Project;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  onOpenModal: () => void;
  aspectClass?: string;
  forceVertical?: boolean;
}

const ProjectCardMedia: React.FC<ProjectCardMediaProps> = ({
  project,
  isHovered,
  onHoverChange,
  onOpenModal,
  aspectClass = 'aspect-video',
  forceVertical = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const [isMutedInline, setIsMutedInline] = useState(true);

  const isVertical = project.aspectRatio === '9:16';
  const videoUrl = project.videoUrl;
  const parsedVideo = parseVideoUrl(videoUrl);
  const isDirectMp4 = parsedVideo.type === 'mp4';

  const shouldStreamVideo = isDirectMp4 && (isHovered || isPlayingInline);

  // Stream video only when user hovers or explicitly plays inline (for direct MP4s)
  useEffect(() => {
    if (shouldStreamVideo && videoRef.current) {
      if (videoRef.current.currentTime === 0) {
        videoRef.current.currentTime = 0.001;
      }
      videoRef.current.play().then(() => {
        setIsPlayingInline(true);
      }).catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMutedInline(true);
          videoRef.current.play().catch(() => {});
        }
      });
    } else if (!shouldStreamVideo && videoRef.current) {
      videoRef.current.pause();
    }
  }, [shouldStreamVideo]);

  const toggleInlinePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDirectMp4) {
      onOpenModal();
      return;
    }
    if (isPlayingInline) {
      setIsPlayingInline(false);
      if (videoRef.current) videoRef.current.pause();
    } else {
      setIsPlayingInline(true);
    }
  };


  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMutedInline;
    setIsMutedInline(!isMutedInline);
  };

  const handleOpenMasterModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenModal();
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0a0a0c] select-none ${aspectClass}`}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onClick={onOpenModal}
    >
      {/* Dynamic Viewport: Lightweight WebP Poster by default, Video on hover/play */}
      {isVertical && !forceVertical && aspectClass === 'aspect-video' ? (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#070709]">
          {/* Ambient blurred backdrop */}
          <img
            src={project.posterUrl}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover blur-2xl opacity-35 scale-125 pointer-events-none"
          />

          {/* Sharp Foreground: Image or Active Streaming Video */}
          {shouldStreamVideo ? (
            <video
              ref={videoRef}
              src={videoUrl}
              muted={isMutedInline}
              playsInline
              loop
              preload="metadata"
              className="relative h-full aspect-[9/16] object-contain z-10 filter contrast-110"
            />
          ) : (
            <img
              src={project.posterUrl}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="relative h-full aspect-[9/16] object-contain z-10 filter contrast-110"
            />
          )}
        </div>
      ) : (
        <>
          {shouldStreamVideo ? (
            <video
              ref={videoRef}
              src={videoUrl}
              muted={isMutedInline}
              playsInline
              loop
              preload="metadata"
              className="h-full w-full object-cover filter contrast-105 group-hover:contrast-115 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <img
              src={project.posterUrl}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover filter contrast-105 group-hover:contrast-115 transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </>
      )}

      {/* Top Format & Duration Badges */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 font-mono text-[10px] pointer-events-none">
        <span className="rounded bg-black/85 backdrop-blur-md px-2 py-0.5 text-white border border-neutral-700">
          {project.aspectRatio}
        </span>
        <span className="rounded bg-black/85 backdrop-blur-md px-2 py-0.5 text-neutral-300 border border-neutral-800">
          {project.duration}
        </span>
      </div>

      <div className="absolute top-3 right-3 z-20 font-mono text-[10px] text-neutral-200 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded border border-neutral-800 pointer-events-none">
        {project.category}
      </div>

      {/* Center Play/Pause Controller Button */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <button
          type="button"
          onClick={toggleInlinePlay}
          className={`pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-2xl transition-all duration-300 transform hover:scale-110 hover:bg-white ${
            isPlayingInline ? 'opacity-0 group-hover:opacity-100' : 'opacity-85 group-hover:opacity-100'
          }`}
          title={isPlayingInline ? 'Pause Preview' : 'Play Preview'}
        >
          {isPlayingInline ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="h-5 w-5 fill-current ml-0.5" />
          )}
        </button>
      </div>

      {/* Bottom HUD Bar & Controls */}
      <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between font-mono text-[10px] text-white/90 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-neutral-800 transition-opacity duration-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleInlinePlay}
            className="text-neutral-300 hover:text-white flex items-center gap-1"
          >
            {isPlayingInline ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
            <span>{isPlayingInline ? 'PLAYING' : 'PREVIEW'}</span>
          </button>

          {isPlayingInline && (
            <button
              type="button"
              onClick={toggleMute}
              className="text-neutral-400 hover:text-white ml-1 p-0.5"
              title={isMutedInline ? 'Unmute' : 'Mute'}
            >
              {isMutedInline ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleOpenMasterModal}
          className="flex items-center gap-1 text-white hover:text-neutral-300 bg-neutral-900/90 border border-neutral-700/80 px-2 py-0.5 rounded transition-colors"
          title="Open Full Mastering Monitor"
        >
          <Maximize2 className="h-3 w-3" />
          <span>FULL MONITOR</span>
        </button>
      </div>
    </div>
  );
};

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [layoutMode, setLayoutMode] = useState<'grid-2' | 'bento-3' | 'reels' | 'list'>('grid-2');
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const categories = ['All', 'Short Form', 'Long Form'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const shortFormCount = projects.filter((p) => p.category === 'Short Form').length;
  const longFormCount = projects.filter((p) => p.category === 'Long Form').length;

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'Short Form' && layoutMode !== 'list') {
      setLayoutMode('reels');
    } else if (cat === 'Long Form' && layoutMode === 'reels') {
      setLayoutMode('grid-2');
    }
  };

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-neutral-800/60">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-xs text-neutral-400">
            <Film className="h-3.5 w-3.5 text-white" />
            <span>SELECTED EDITORIAL ARCHIVE // 14 MASTER WORKS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase">
            Curated Portfolio
          </h2>
          <p className="text-neutral-400 text-sm mt-1 max-w-xl font-mono">
            Click any project to open the master monitor or play inline previews directly on the cards.
          </p>
        </div>

        {/* View Toggle Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-1">
            <button
              onClick={() => setLayoutMode('grid-2')}
              className={`p-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
                layoutMode === 'grid-2' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
              title="2-Column Cinematic Layout"
            >
              <Grid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">CINEMATIC</span>
            </button>
            <button
              onClick={() => setLayoutMode('bento-3')}
              className={`p-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
                layoutMode === 'bento-3' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
              title="3-Column Bento Grid"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">BENTO</span>
            </button>
            <button
              onClick={() => setLayoutMode('reels')}
              className={`p-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
                layoutMode === 'reels' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Vertical 9:16 Reels Showcase"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">9:16 REELS</span>
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
                layoutMode === 'list' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
              title="NLE Cut Sheet / Timeline List"
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">CUT LIST</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-neutral-800/80">
        {categories.map((cat) => {
          const count = cat === 'All' ? projects.length : cat === 'Short Form' ? shortFormCount : longFormCount;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 font-mono text-xs tracking-wider transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow'
                  : 'border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-white'
              }`}
            >
              {cat.toUpperCase()} ({count})
            </button>
          );
        })}
      </div>

      {/* 2-Column Cinematic Layout */}
      {layoutMode === 'grid-2' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <SpotlightCard
              key={project.id}
              id={`project-card-${project.id}`}
              onClick={() => onSelectProject(project)}
              className="cursor-pointer group flex flex-col justify-between border-neutral-800 hover:border-neutral-600 transition-all duration-300"
            >
              <ProjectCardMedia
                project={project}
                isHovered={hoveredProjectId === project.id}
                onHoverChange={(h) => setHoveredProjectId(h ? project.id : null)}
                onOpenModal={() => onSelectProject(project)}
                aspectClass="aspect-video"
              />

              {/* Card Metadata */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-neutral-500 font-mono text-xs mb-1.5">
                    <span>{project.client}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-neutral-200 transition-colors uppercase tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed font-sans">
                    {project.description}
                  </p>
                </div>

                {/* Software & Duration */}
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="font-mono text-[10px] rounded bg-neutral-900 border border-neutral-800 px-2.5 py-0.5 text-neutral-300">
                    Adobe Premiere Pro
                  </span>
                  <span className="font-mono text-[11px] text-neutral-500">
                    {project.duration}
                  </span>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* 3-Column Bento Grid */}
      {layoutMode === 'bento-3' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <SpotlightCard
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="cursor-pointer group flex flex-col border-neutral-800 hover:border-neutral-600 transition-all duration-300"
            >
              <ProjectCardMedia
                project={project}
                isHovered={hoveredProjectId === project.id}
                onHoverChange={(h) => setHoveredProjectId(h ? project.id : null)}
                onOpenModal={() => onSelectProject(project)}
                aspectClass="aspect-video"
              />

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[11px] text-neutral-500 block mb-1">
                    {project.client}
                  </span>
                  <h4 className="font-display text-base font-bold text-white uppercase group-hover:text-neutral-200">
                    {project.title}
                  </h4>
                  <p className="text-neutral-400 text-xs mt-1.5 line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-neutral-400 font-mono text-[10px]">
                  <span className="text-neutral-300">Adobe Premiere Pro</span>
                  <span className="text-white font-semibold">{project.duration}</span>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* Vertical 9:16 Reels Showcase */}
      {layoutMode === 'reels' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <SpotlightCard
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="cursor-pointer group flex flex-col border-neutral-800 hover:border-neutral-600 transition-all duration-300 rounded-2xl overflow-hidden"
            >
              {/* Vertical Phone Screen Media */}
              <ProjectCardMedia
                project={project}
                isHovered={hoveredProjectId === project.id}
                onHoverChange={(h) => setHoveredProjectId(h ? project.id : null)}
                onOpenModal={() => onSelectProject(project)}
                aspectClass="aspect-[9/16]"
                forceVertical={true}
              />

              <div className="p-4 bg-neutral-950 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-1">
                    <span>{project.client}</span>
                    <span>{project.duration}</span>
                  </div>
                  <h4 className="font-display text-sm font-bold text-white uppercase group-hover:text-neutral-200 line-clamp-2">
                    {project.title}
                  </h4>
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span className="text-neutral-300">Adobe Premiere Pro</span>
                  <span>{project.category}</span>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* NLE Cut Sheet List View */}
      {layoutMode === 'list' && (
        <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950">
          <div className="grid grid-cols-12 bg-neutral-900 px-4 py-3 font-mono text-[11px] text-neutral-400 border-b border-neutral-800">
            <span className="col-span-1">ROLL</span>
            <span className="col-span-4">PROJECT & CLIENT</span>
            <span className="col-span-2 hidden md:block">CATEGORY</span>
            <span className="col-span-2 hidden sm:block">SOFTWARE</span>
            <span className="col-span-2">DURATION / TC</span>
            <span className="col-span-3 sm:col-span-1 text-right">MONITOR</span>
          </div>

          <div className="divide-y divide-neutral-800/70">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="grid grid-cols-12 px-4 py-3.5 items-center hover:bg-neutral-900/60 cursor-pointer transition-colors group text-xs font-mono"
              >
                <span className="col-span-1 text-neutral-500">
                  #{String(idx + 1).padStart(2, '0')}
                </span>

                <div className="col-span-4 pr-2">
                  <span className="font-display font-bold text-white text-sm block group-hover:underline uppercase">
                    {project.title}
                  </span>
                  <span className="text-neutral-500 text-[11px] block">
                    {project.client} • {project.year}
                  </span>
                </div>

                <span className="col-span-2 text-neutral-400 hidden md:block">
                  {project.category}
                </span>

                <div className="col-span-2 hidden sm:block text-neutral-300">
                  <span>Adobe Premiere Pro</span>
                </div>

                <div className="col-span-2 text-neutral-300">
                  <span className="block font-semibold">{project.duration}</span>
                  <span className="text-[10px] text-neutral-500">{project.timecode}</span>
                </div>

                <div className="col-span-3 sm:col-span-1 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(project);
                    }}
                    className="inline-flex items-center gap-1 rounded bg-white text-black px-2.5 py-1 text-[11px] font-bold hover:bg-neutral-200 transition-colors"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>CUT</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
