'use client';

import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import type { ProjectRecord } from '@/lib/db/repository';

interface BrochuresSectionProps {
  projects: ProjectRecord[];
}

export default function BrochuresSection({ projects }: BrochuresSectionProps) {
  return (
    <section
      id="brochures"
      className="relative border-y border-[var(--line)] bg-[var(--paper-2)] py-20 sm:py-28"
    >
      <div className="container-x">
        {/* Header */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="eyebrow">Layout Plans &amp; Documents</span>
            <h2 className="h-section mt-5">
              Download brochures &amp; <em>master plans</em>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-10">
            <p className="tamil text-base font-medium text-[var(--forest)]">
              அனைத்து திட்டங்களின் அதிகாரப்பூர்வ வரைபடங்கள் &amp; விவரங்கள்
            </p>
            <p className="mt-3 text-base leading-relaxed text-[var(--ink-soft)]">
              Instant access to verified layout blueprints, internal road dimensions, and DTCP approval documents. No phone number or form submission required.
            </p>
          </div>
        </div>

        {/* Document index */}
        <ul className="border-t-2 border-[var(--ink)]">
          {projects.map((project, i) => {
            const hasBrochure = Boolean(project.brochureUrl && project.brochureUrl.trim() !== '');
            const descriptiveFileName = `MKM-${project.name.replace(/\s+/g, '-')}-Trichy-Brochure.pdf`;

            return (
              <li
                key={project.id}
                className="grid grid-cols-12 items-center gap-x-5 gap-y-4 border-b border-[var(--line-strong)] py-6 transition-colors hover:bg-[var(--paper)]/70"
              >
                <span className="f-mono col-span-2 text-xs text-[var(--gold)] sm:col-span-1">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="col-span-10 min-w-0 sm:col-span-5 lg:col-span-4">
                  <h3 className="f-display flex items-center gap-3 text-2xl font-medium leading-tight tracking-[-0.015em]">
                    <span className="truncate">{project.name}</span>
                    <span className="f-mono shrink-0 border border-[var(--forest)] px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em] text-[var(--forest)]">
                      PDF
                    </span>
                  </h3>
                  <p className="f-mono mt-1.5 truncate text-[11px] uppercase tracking-[0.12em] text-[var(--ink-soft)]">
                    {project.location}
                  </p>
                </div>

                <p className="col-span-12 hidden text-sm leading-relaxed text-[var(--ink-soft)] lg:col-span-4 lg:block">
                  Official layout drawing showing 30ft &amp; 40ft road widths, individual plot demarcation numbers, and legal clearances.
                </p>

                <div className="col-span-12 flex gap-2.5 sm:col-span-6 sm:justify-end lg:col-span-3">
                  {hasBrochure ? (
                    <>
                      <a
                        href={project.brochureUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm flex-1 sm:flex-none"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Preview</span>
                      </a>
                      <a
                        href={project.brochureUrl!}
                        download={descriptiveFileName}
                        className="btn btn-primary btn-sm flex-1 sm:flex-none"
                      >
                        <Download className="h-3.5 w-3.5 text-[var(--gold-bright)]" />
                        <span>Download</span>
                      </a>
                    </>
                  ) : (
                    <span className="f-mono text-[11px] uppercase tracking-[0.12em] text-[var(--ink-soft)]">
                      Brochure in preparation
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
