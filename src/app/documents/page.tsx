import React from 'react';
import { connection } from 'next/server';
import { getAllDocuments } from '@/lib/db/repository';
import { ShieldCheck } from 'lucide-react';
import DocumentsLibraryClient from '@/components/documents/DocumentsLibraryClient';

export const metadata = {
  title: 'Download Project Documents & Layouts · MKM Properties | Trichy',
  description:
    'Official repository of layout drawings, DTCP approvals, legal checklists, and promoter price sheets for residential layouts in Trichy.'
};

export const instant = false;

export default async function DocumentsPage() {
  await connection();
  const documents = await getAllDocuments();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)] py-12 sm:py-16">
      <div className="container-x space-y-10">
        {/* Header */}
        <div className="border-b border-[var(--line-strong)] pb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--forest)]/20 bg-white/60 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--forest)] mb-4">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span>Official Document &amp; Layout Library</span>
          </div>

          <h1 className="f-display text-3xl sm:text-5xl font-extrabold text-[var(--ink)] leading-tight">
            Download Project <em className="text-[var(--forest)] font-serif">Documents &amp; Layouts</em>
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-[var(--ink-soft)] leading-relaxed">
            Access official layout drawings, DTCP approval copies, legal due-diligence checklists, and direct promoter price sheets. All documents are digitally verified and available for your review.
          </p>
        </div>

        {/* Client Interactive Component for Filtering & Categorization */}
        <DocumentsLibraryClient initialDocuments={documents} />
      </div>
    </div>
  );
}
