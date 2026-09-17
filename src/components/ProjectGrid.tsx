import React, { useState } from 'react';
import { Play, Filter, Grid, LayoutGrid, List, Clock, Film, ExternalLink, Award } from 'lucide-react';
import { Project } from '../types';
import { SpotlightCard } from './reactbits/SpotlightCard';
import { DecryptedText } from './reactbits/DecryptedText';

interface ProjectGridProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  onSelectProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [layoutMode, setLayoutMode] = useState<'grid-2' | 'bento-3' | 'list'>('grid-2');
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const categories = ['All', 'Long Form', 'Short Form'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-neutral-800/60">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2 font-mono text-xs text-neutral-400">
            <Film className="h-3.5 w-3.5 text-white" />
            <span>CURATED PORTFOLIO // 2025—2026</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase">
            Selected Editorial Works
          </h2>
          <p className="text-neutral-400 text-sm mt-1 max-w-lg font-mono">
            Hover cards to trigger live video timeline previews. Click any project to open the mastering player with frame-step precision.
          </p>
        </div>

        {/* View Toggle & Count */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-1">
            <button
              onClick={() => setLayoutMode('grid-2')}
              className={`p-1.5 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                layoutMode === 'grid-2' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
              title="2-Column Cinematic Layout"
            >
              <Grid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">CINEMATIC</span>
            </button>
            <button
              onClick={() => setLayoutMode('bento-3')}
              className={`p-1.5 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                layoutMode === 'bento-3' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
              title="3-Column Bento Grid"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">BENTO</span>
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                layoutMode === 'list' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
              title="NLE Cut List"
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">CUT LIST</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-neutral-800/80">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 font-mono text-xs tracking-wider transition-colors ${
              selectedCategory === cat
                ? 'bg-white text-black font-bold'
                : 'border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-white'
            }`}
          >
            {cat.toUpperCase()} {cat === 'All' ? `(${projects.length})` : ''}
          </button>
        ))}
      </div>

      {/* Grid Layouts */}
      {layoutMode === 'grid-2' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <SpotlightCard
              key={project.id}
              id={`project-card-${project.id}`}
              onClick={() => onSelectProject(project)}
              className="cursor-pointer group flex flex-col justify-between border-neutral-800 hover:border-neutral-600 transition-all duration-300"
            >
              {/* Media Viewport */}
              <div
                className="relative aspect-video w-full overflow-hidden bg-black"
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
              >
                {/* Fallback Poster Image */}
                <img
                  src={project.posterUrl}
                  alt={project.title}
                  className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale contrast-125 brightness-90 ${
                    hoveredProjectId === project.id ? 'opacity-0' : 'opacity-100'
                  }`}
                  loading="lazy"
                />

                {/* Hover Video Preview Loop */}
                {hoveredProjectId === project.id && (
                  <video
                    src={project.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover filter grayscale contrast-125 brightness-95"
                  />
                )}

                {/* Overlaid Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[10px]">
                  <span className="rounded bg-black/80 backdrop-blur-md px-2 py-0.5 text-white border border-neutral-700">
                    {project.aspectRatio}
                  </span>
                  <span className="rounded bg-black/80 backdrop-blur-md px-2 py-0.5 text-neutral-300 border border-neutral-800">
                    {project.duration}
                  </span>
                </div>

                <div className="absolute top-3 right-3 font-mono text-[10px] text-neutral-300 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-neutral-800">
                  {project.category}
                </div>

                {/* Center Hover Play Indicator */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="h-6 w-6 fill-current ml-1" />
                  </div>
                </div>

                {/* Bottom Timeline HUD on Hover */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm px-2 py-1 rounded">
                  <span>TC: {project.timecode}</span>
                  <span>CLICK TO MONITOR</span>
                </div>
              </div>

              {/* Card Meta & Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-neutral-500 font-mono text-xs mb-1">
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

                {/* Software Pills & Awards */}
                <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tools.slice(0, 3).map((tool, i) => (
                      <span key={i} className="font-mono text-[10px] rounded bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-neutral-400">
                        {tool}
                      </span>
                    ))}
                  </div>

                  {project.awards && project.awards[0] && (
                    <span className="font-mono text-[10px] text-neutral-300 flex items-center gap-1">
                      <Award className="h-3 w-3 text-neutral-400" />
                      <span className="truncate max-w-[140px]">{project.awards[0]}</span>
                    </span>
                  )}
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
              <div
                className="relative aspect-video w-full overflow-hidden bg-black"
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
              >
                <img
                  src={project.posterUrl}
                  alt={project.title}
                  className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale contrast-125 ${
                    hoveredProjectId === project.id ? 'opacity-0' : 'opacity-100'
                  }`}
                  loading="lazy"
                />

                {hoveredProjectId === project.id && (
                  <video
                    src={project.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover filter grayscale contrast-125"
                  />
                )}

                <div className="absolute top-2 left-2 flex gap-1 font-mono text-[10px]">
                  <span className="rounded bg-black/80 px-1.5 py-0.5 text-white border border-neutral-800">
                    {project.aspectRatio}
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center">
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

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
                  <span>{project.category}</span>
                  <span>{project.duration}</span>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* List / NLE Cut Sheet View */}
      {layoutMode === 'list' && (
        <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950">
          <div className="grid grid-cols-12 bg-neutral-900 px-4 py-2.5 font-mono text-[11px] text-neutral-400 border-b border-neutral-800">
            <span className="col-span-1">ROLL</span>
            <span className="col-span-4">PROJECT & CLIENT</span>
            <span className="col-span-2 hidden md:block">CATEGORY</span>
            <span className="col-span-2 hidden sm:block">ASPECT / BPM</span>
            <span className="col-span-2">TIMECODE</span>
            <span className="col-span-3 sm:col-span-1 text-right">ACTION</span>
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

                <div className="col-span-2 hidden sm:block text-neutral-400">
                  <span>{project.aspectRatio}</span>
                  <span className="text-neutral-600 mx-1">•</span>
                  <span>{project.stats?.timelineBpm || '24 fps'}</span>
                </div>

                <span className="col-span-2 text-neutral-300">
                  {project.timecode}
                </span>

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
