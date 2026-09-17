import React, { useState } from 'react';
import { Project } from './types';
import { INITIAL_PROJECTS } from './data/projects';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectGrid } from './components/ProjectGrid';
import { ContactFooter } from './components/ContactFooter';
import { VideoPlayerModal } from './components/VideoPlayerModal';

export default function App() {
  const [projects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Use the prominent long-form master as the cinematic hero video
  // Use "Who is the GC for Your Financial House?" as the featured hero video
  const heroVideo = '/Longform/Who%20is%20the%20GC%20for%20financial%20house.mp4';

  const handleScrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenDirectReel = () => {
    const heroProject = projects.find((p) => p.id === 'lf-gc-financial-house') || projects[0];
    setSelectedProject(heroProject);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#f4f4f5] selection:bg-white selection:text-black font-sans antialiased">
      {/* Navigation */}
      <Navbar
        onScrollTo={handleScrollTo}
        onOpenDirectReel={handleOpenDirectReel}
      />

      <main>
        {/* Cinematic Hero Showreel */}
        <Hero
          heroVideoUrl={heroVideo}
          onOpenReelModal={handleOpenDirectReel}
          onScrollToProjects={() => handleScrollTo('projects')}
        />

        {/* Selected Projects Grid with Short-Form (9:16) & Long-Form (16:9) */}
        <ProjectGrid
          projects={projects}
          onSelectProject={(project) => setSelectedProject(project)}
        />
      </main>

      {/* Footer & Direct Inquiry Booking */}
      <ContactFooter />

      {/* Interactive Video Player Modal with Safe-Zone & Aspect Ratio Sim */}
      {selectedProject && (
        <VideoPlayerModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
