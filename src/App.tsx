import React, { useState } from 'react';
import { Project } from './types';
import { INITIAL_PROJECTS } from './data/projects';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectGrid } from './components/ProjectGrid';
import { ContactFooter } from './components/ContactFooter';
import { VideoPlayerModal } from './components/VideoPlayerModal';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const heroVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

  const handleScrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenDirectReel = () => {
    const heroProject: Project = {
      id: 'showreel-master',
      title: 'DIRECTOR\'S SHOWREEL 2026',
      client: 'Selected Global Brands',
      category: 'Long Form',
      year: '2026',
      aspectRatio: '2.39:1',
      duration: '01:50',
      timecode: '00:01:50:00',
      videoUrl: heroVideo,
      posterUrl: projects[0].posterUrl,
      description: 'Comprehensive compilation of rhythm cuts, micro-timing pacing, dynamic speed curves, and high-contrast monochrome cinematography.',
      role: 'Lead Editor, Sound Designer & Finisher',
      tools: ['DaVinci Resolve Studio 19', 'Adobe Premiere Pro', 'Soundly', 'iZotope RX'],
      awards: ['Cannes Lions Bronze', 'Vimeo Staff Pick', 'Clio Shortlist'],
      stats: {
        views: '2.4M',
        cuts: 84,
        timelineBpm: '138 BPM',
      },
    };
    setSelectedProject(heroProject);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#f4f4f5] selection:bg-white selection:text-black">
      {/* Navigation */}
      <Navbar
        onScrollTo={handleScrollTo}
        onOpenDirectReel={handleOpenDirectReel}
      />

      <main>
        {/* Cinematic Hero */}
        <Hero
          heroVideoUrl={heroVideo}
          onOpenReelModal={handleOpenDirectReel}
          onScrollToProjects={() => handleScrollTo('projects')}
        />

        {/* Selected Projects Grid (Long Form & Short Form Tabs) */}
        <ProjectGrid
          projects={projects}
          onSelectProject={(project) => setSelectedProject(project)}
        />
      </main>

      {/* Footer & Direct Inquiry Booking */}
      <ContactFooter />

      {/* Interactive Video Player Modal with Frame-by-frame & Aspect Ratio Sim */}
      {selectedProject && (
        <VideoPlayerModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
