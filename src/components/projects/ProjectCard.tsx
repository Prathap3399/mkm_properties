'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, ArrowUpRight, Play, Download } from 'lucide-react';
import type { ProjectRecord } from '@/lib/db/repository';
import VideoModal from './VideoModal';

export default function ProjectCard({ project }: { project: ProjectRecord }) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const isAvailable = project.availabilityStatus === 'Available';
  const isComingSoon = project.availabilityStatus === 'Coming Soon';
  const hasVideo = Boolean(project.videoUrl && project.videoUrl.trim() !== '');
  const hasBrochure = Boolean(project.brochureUrl && project.brochureUrl.trim() !== '');

  const descriptiveFileName = `MKM-${project.name.replace(/\s+/g, '-')}-Trichy-Brochure.pdf`;

  const dotColor = isAvailable ? 'bg-[#1c9d52]' : isComingSoon ? 'bg-[var(--gold-bright)]' : 'bg-[#8a8f8b]';

  return (
    <>
      <article className="group plan-card flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[var(--forest)] hover:shadow-[8px_8px_0_rgba(15,61,46,0.12)]">
        {/* Image */}
        <Link
          href={`/projects/${project.slug}`}
          className="corners corners-reveal relative block aspect-[4/3] overflow-hidden bg-[var(--forest-deep)]"
          aria-label={`View ${project.name}`}
        >
          <img
            src={project.coverImageUrl}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          {/* Status */}
          <span className="f-mono absolute left-3 top-3 z-[4] inline-flex items-center gap-2 bg-[var(--paper)] px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
            <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
            {project.availabilityStatus}
          </span>

          {/* Approval */}
          {project.approvalStatus && (
            <span className="f-mono absolute right-3 top-3 z-[4] inline-flex items-center gap-1.5 bg-[var(--forest)] px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--gold-soft)]">
              <ShieldCheck className="h-3 w-3 text-[var(--gold-bright)]" />
              {project.approvalStatus}
            </span>
          )}

          {/* Price */}
          {project.priceLabel && (
            <span className="f-mono absolute bottom-3 left-3 z-[4] bg-[var(--gold-bright)] px-2.5 py-1.5 text-[11px] font-medium tracking-[0.04em] text-[var(--forest-deep)]">
              {project.priceLabel}
            </span>
          )}
        </Link>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="f-mono flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[var(--ink-soft)]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--gold)]" />
            <span className="truncate">{project.location}</span>
          </p>

          <h3 className="f-display mt-3 text-[1.75rem] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--ink)]">
            <Link href={`/projects/${project.slug}`} className="transition-colors group-hover:text-[var(--forest)]">
              {project.name}
            </Link>
          </h3>

          <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-[var(--ink-soft)]">{project.description}</p>

          {/* Actions */}
          <div className="mt-auto space-y-2.5 pt-6">
            <Link href={`/projects/${project.slug}`} className="btn btn-primary w-full">
              <span>View Details</span>
              <ArrowUpRight className="h-4 w-4 text-[var(--gold-bright)]" />
            </Link>

            <div className="grid grid-cols-2 gap-2.5">
              {hasVideo ? (
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="btn btn-outline btn-sm"
                  title="Watch project site video"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Watch Video</span>
                </button>
              ) : (
                <Link href={`/enquiry?project=${encodeURIComponent(project.slug)}`} className="btn btn-outline btn-sm !border-[var(--line-strong)] !text-[var(--ink-soft)]">
                  <span>Request Video</span>
                </Link>
              )}

              {hasBrochure ? (
                <a
                  href={project.brochureUrl!}
                  download={descriptiveFileName}
                  className="btn btn-outline btn-sm"
                  title="Download PDF brochure"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Brochure</span>
                </a>
              ) : (
                <Link href={`/enquiry?project=${encodeURIComponent(project.slug)}`} className="btn btn-outline btn-sm !border-[var(--line-strong)] !text-[var(--ink-soft)]">
                  <span>Request Plan</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Video walkthrough modal */}
      {hasVideo && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={project.videoUrl}
          title={`${project.name} – Trichy Site Tour`}
        />
      )}
    </>
  );
}
