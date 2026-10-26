import React from 'react';
import type { Metadata } from 'next';
import { connection } from 'next/server';
import { getAllProjects } from '@/lib/db/repository';
import ProjectsCatalogClient from '@/components/projects/ProjectsCatalogClient';
import { Phone, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Residential Layouts & Projects Portfolio · MKM Properties | Trichy',
  description:
    'Explore verified residential layouts, DTCP approvals, exact plot dimensions, and direct promoter pricing in Trichy.'
};

export const instant = false;

export default async function ProjectsPage() {
  await connection();
  const projects = await getAllProjects({ publishedOnly: true });

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-[var(--line)] py-14 sm:py-20 bg-gradient-to-b from-[var(--paper-2)] to-[var(--paper)]">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--forest)]/20 bg-white/60 px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--forest)] mb-4">
                <Compass className="h-3.5 w-3.5 text-[var(--gold)]" />
                <span>VERIFIED RESIDENTIAL LAYOUTS • TRICHY</span>
              </div>
              <h1 className="f-display text-3xl sm:text-5xl font-extrabold text-[var(--ink)] leading-tight">
                Residential Layouts &amp; <em className="text-[var(--forest)] font-serif">Plots Portfolio</em>
              </h1>
              <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-[var(--ink-soft)]">
                Compare verified plot dimensions, road connectivity, approval sanction numbers, and direct promoter pricing. All layouts are available for physical on-site inspection.
              </p>
            </div>

            <a href="tel:9629048171" className="btn btn-primary shrink-0 self-start md:self-auto">
              <Phone className="h-4 w-4 text-[var(--gold-bright)]" />
              <span>Advisor Call: 96290 48171</span>
            </a>
          </div>
        </div>
      </section>

      {/* Projects Catalog */}
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <ProjectsCatalogClient initialProjects={projects} />
        </div>
      </section>
    </div>
  );
}
