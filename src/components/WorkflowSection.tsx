import React from 'react';
import { Sliders, Cpu, HardDrive, Music, Check, Film, ArrowRight } from 'lucide-react';
import { SpotlightCard } from './reactbits/SpotlightCard';

export const WorkflowSection: React.FC<{ onContactClick: () => void }> = ({ onContactClick }) => {
  const steps = [
    {
      step: '01',
      title: 'Ingest & Assembly',
      desc: 'RAW camera format decoding (ARRI LogC, REDCODE, Sony S-Log3), audio dual-system sync, scene logging, and assembly cut against script or creative brief.',
      tag: 'TURNOVER 24-48H'
    },
    {
      step: '02',
      title: 'Rhythmic Pacing & Lock',
      desc: 'Precision cuts down to the individual frame. Musical beats, sub-textual eye traces, and seamless match cuts to sculpt tension and viewer engagement.',
      tag: 'DIRECTOR CUT'
    },
    {
      step: '03',
      title: 'Sound Design & Foley',
      desc: 'Deep multi-track audio architecture: visceral impacts, subtle room tones, frequency sculpting, and transient alignment with music instrumentation.',
      tag: '5.1 & STEREO'
    },
    {
      step: '04',
      title: 'Finishing & Delivery',
      desc: 'ACES color conformity, 35mm optical grain texture, cinema title typography, and high-bitrate master encoding for cinema, broadcast, and social.',
      tag: 'PRORES 4444'
    },
  ];

  const gear = [
    { name: 'Color Reference Monitor', spec: 'Flanders Scientific DM240 10-bit Calibrated' },
    { name: 'NLE Hardware', spec: 'Apple Mac Studio M2 Ultra (128GB Unified Memory)' },
    { name: 'Control Surfaces', spec: 'DaVinci Resolve Mini Panel & Tangent Ripple' },
    { name: 'Storage & Network', spec: '120TB 10GbE NVMe Fast Scratch RAID' },
    { name: 'Review Ecosystem', spec: 'Frame.io Pro C2C & Vimeo Enterprise Review' },
    { name: 'Monitoring Acoustics', spec: 'Genelec 8330A Smart Active Studio Monitors' },
  ];

  return (
    <section id="workflow" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-neutral-800/60">
      {/* Header */}
      <div className="max-w-3xl mb-14">
        <div className="flex items-center gap-2 mb-2 font-mono text-xs text-neutral-400">
          <Sliders className="h-3.5 w-3.5 text-white" />
          <span>METHODOLOGY & HARDWARE SPECIFICATIONS</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase">
          Post-Production Pipeline
        </h2>
        <p className="text-neutral-400 text-sm mt-2 font-mono leading-relaxed">
          From first script review to locked master turnover. An airtight workflow designed for high-pressure commercial deadlines and meticulous narrative cinema.
        </p>
      </div>

      {/* 4 Pipeline Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {steps.map((item) => (
          <SpotlightCard
            key={item.step}
            className="p-6 flex flex-col justify-between border-neutral-800 bg-neutral-950/80 hover:border-neutral-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between font-mono mb-4">
                <span className="text-2xl font-extrabold text-white">{item.step}</span>
                <span className="text-[10px] rounded border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-neutral-400">
                  {item.tag}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-white uppercase tracking-tight mb-2">
                {item.title}
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-sans">
                {item.desc}
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-neutral-800/80 flex items-center gap-1 font-mono text-[10px] text-neutral-500">
              <Check className="h-3 w-3 text-white" /> STAGE VERIFIED
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Editing Suite Hardware & Specs Bento */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800/80">
          <div>
            <span className="font-mono text-xs text-neutral-400 block">STUDIO ENVIRONMENT //</span>
            <h3 className="font-display text-xl font-bold text-white uppercase">
              The Editorial Suite & Conform Tech
            </h3>
          </div>
          <button
            onClick={onContactClick}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-mono text-xs font-bold text-black hover:bg-neutral-200 transition-colors self-start md:self-auto"
          >
            <span>INQUIRE FOR YOUR PROJECT</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
          {gear.map((g, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/40">
              <span className="font-mono text-[11px] text-neutral-500 block uppercase">
                {g.name}
              </span>
              <span className="font-display font-medium text-white text-sm mt-1 block">
                {g.spec}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
