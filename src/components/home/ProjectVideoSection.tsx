'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Phone } from 'lucide-react';
import ProjectVideo from '@/components/projects/ProjectVideo';
import type { ProjectRecord } from '@/lib/db/repository';

interface ProjectVideoSectionProps {
  projects: ProjectRecord[];
}

export default function ProjectVideoSection({ projects }: ProjectVideoSectionProps) {
  // Filter projects with video
  const projectsWithVideo = projects.filter((p) => p.videoUrl && p.videoUrl.trim() !== '');

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projectsWithVideo[0]?.id || projects[0]?.id || ''
  );

  const activeProject =
    projects.find((p) => p.id === selectedProjectId) || projectsWithVideo[0] || projects[0];

  if (!activeProject) return null;

  return (
    <section
      id="video"
      className="on-dark relative isolate overflow-hidden bg-[var(--forest-deep)] py-20 text-[#f3ecd6] sm:py-28"
    >
      <div aria-hidden="true" className="bg-contours-light absolute inset-0 -z-10 opacity-80" />

      <div className="container-x">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <span className="eyebrow">02 · On Site</span>
          <h2 className="h-section mt-5 text-white">
            Watch our <em>projects</em>
          </h2>
          <p className="tamil mt-4 text-base font-medium text-[var(--gold-soft)]">
            வீடியோவில் எங்கள் மனைத் திட்டங்களைப் பாருங்கள்
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#b3c0b7] sm:text-lg">
            Inspect real road widths, boundary demarcations, and neighbourhood connectivity directly through HD video walkthroughs before booking your site visit.
          </p>
        </div>

        {/* Tabs */}
        {projectsWithVideo.length > 1 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            {projectsWithVideo.map((p) => {
              const isSelected = p.id === activeProject.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`f-mono inline-flex items-center gap-2 border px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[var(--gold-bright)] bg-[var(--gold-bright)] text-[var(--forest-deep)]'
                      : 'border-white/25 text-white/75 hover:border-white/60 hover:text-white'
                  }`}
                >
                  <Play className={`h-3 w-3 ${isSelected ? 'fill-current' : ''}`} />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Player + details */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="corners corners-out corners-gold">
              <ProjectVideo
                videoUrl={activeProject.videoUrl}
                title={`${activeProject.name} – Site Walkthrough Tour`}
                thumbnailUrl={activeProject.coverImageUrl}
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <span className="f-mono text-[11px] uppercase tracking-[0.2em] text-[var(--gold-bright)]">
              Now playing
            </span>
            <h3 className="f-display mt-3 text-4xl font-medium leading-[1.05] tracking-[-0.02em] text-white">
              {activeProject.name}
            </h3>
            <p className="f-mono mt-2 text-xs uppercase tracking-[0.14em] text-[#9fb0a5]">{activeProject.location}</p>

            <p className="mt-5 text-[15px] leading-relaxed text-[#b3c0b7]">{activeProject.description}</p>

            <dl className="mt-7 border-t border-white/15 text-sm">
              <div className="flex justify-between gap-4 border-b border-white/15 py-3.5">
                <dt className="f-mono text-[11px] uppercase tracking-[0.16em] text-[#8fa196]">Approval</dt>
                <dd className="text-right font-medium text-white">{activeProject.approvalStatus || 'Verified'}</dd>
              </div>
              {activeProject.priceLabel && (
                <div className="flex justify-between gap-4 border-b border-white/15 py-3.5">
                  <dt className="f-mono text-[11px] uppercase tracking-[0.16em] text-[#8fa196]">Pricing</dt>
                  <dd className="text-right font-medium text-[var(--gold-bright)]">{activeProject.priceLabel}</dd>
                </div>
              )}
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={`/projects/${activeProject.slug}`} className="btn btn-gold">
                <span>Full Project Details</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:9629048171" className="btn btn-outline-light">
                <Phone className="h-4 w-4" />
                <span>9629048171</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
