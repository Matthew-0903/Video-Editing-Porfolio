import React from 'react';
import { Quote, Star, Award, CheckCircle2, Play, MessageSquare } from 'lucide-react';
import { Testimonial, Project } from '../types';
import { SpotlightCard } from './reactbits/SpotlightCard';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  projects: Project[];
  onSelectProjectById: (projectId: string) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  projects,
  onSelectProjectById,
}) => {
  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-neutral-800/60">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase">
          Client & Creator Testimonials
        </h2>
        <p className="text-neutral-400 text-sm mt-2 font-mono leading-relaxed">
          Feedback from brand creators, documentary directors, and channels on pacing, retention, and delivery speed.
        </p>
      </div>

      {/* Testimonials 2-Column Minimalist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {testimonials.map((t) => (
          <SpotlightCard
            key={t.id}
            id={`testimonial-card-${t.id}`}
            className="p-7 flex flex-col justify-between border-neutral-800 hover:border-neutral-700 transition-all bg-neutral-950/90"
          >
            {/* Top Quote Icon & Rating */}
            <div className="flex items-center justify-between mb-4">
              <Quote className="h-6 w-6 text-neutral-600 fill-current" />
              <div className="flex items-center gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-white fill-white" />
                ))}
              </div>
            </div>

            {/* Quotation Body */}
            <blockquote className="text-neutral-200 text-sm sm:text-base leading-relaxed font-sans mb-6">
              "{t.quote}"
            </blockquote>

            {/* Author & Project Association */}
            <div className="pt-4 border-t border-neutral-800/80 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={t.avatarUrl}
                  alt={t.author}
                  className="h-11 w-11 rounded-full object-cover filter grayscale contrast-125 border border-neutral-700"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-white text-sm">
                      {t.author}
                    </span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-neutral-400" />
                  </div>
                  <span className="font-mono text-xs text-neutral-400 block">
                    {t.title} • {t.company}
                  </span>
                </div>
              </div>

              {/* Referenced Project & Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs font-mono">
                {t.projectId && (
                  <button
                    onClick={() => onSelectProjectById(t.projectId!)}
                    className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors group"
                  >
                    <Play className="h-3 w-3 fill-current text-white" />
                    <span className="underline underline-offset-4 group-hover:text-white">
                      {t.projectTitle || 'View Referenced Edit'}
                    </span>
                  </button>
                )}

                {t.badge && (
                  <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-[10px] text-neutral-300 flex items-center gap-1">
                    <Award className="h-3 w-3 text-neutral-400" /> {t.badge}
                  </span>
                )}
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Trust Ticker / Brands Banner */}
      <div className="mt-16 pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-neutral-500 font-mono text-xs">
        <span className="tracking-widest uppercase text-neutral-400">
          SELECTED CLIENTS & LABELS:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-neutral-300 font-semibold tracking-wider">
          <span>AUDI AG</span>
          <span>•</span>
          <span>ATLANTIC RECORDS</span>
          <span>•</span>
          <span>LEICA CAMERA</span>
          <span>•</span>
          <span>BALENCIAGA</span>
          <span>•</span>
          <span>SUNDANCE LABS</span>
        </div>
      </div>
    </section>
  );
};
