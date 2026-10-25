'use client';

import React from 'react';
import { Download, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

interface BrochureViewerProps {
  brochureUrl?: string | null;
  projectName: string;
  fileSize?: string;
}

export default function BrochureViewer({
  brochureUrl,
  projectName,
  fileSize = '1.4 MB'
}: BrochureViewerProps) {
  if (!brochureUrl) {
    return (
      <div className="bg-white border border-[#e6eae7] rounded-2xl p-6 sm:p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#fbfbf9] text-[#57655d] flex items-center justify-center mx-auto mb-3 border border-[#e6eae7]">
          <FileText className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-[#141f19]">
          Brochure & Plan Preparation in Progress
        </h4>
        <p className="text-xs sm:text-sm text-[#57655d] max-w-md mx-auto mt-1 leading-relaxed">
          The verified layout sketch and master plan for {projectName} is being finalized. You can request copies directly on WhatsApp or inspect physical documents during a free site visit.
        </p>
        <div className="mt-4">
          <a
            href={`https://wa.me/919629048171?text=Hello%20PRATHAP,%20please%20send%20brochure%20and%20layout%20plan%20for%20${encodeURIComponent(
              projectName
            )}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f3d2e] hover:underline"
          >
            <span>Request Layout Plan on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  const descriptiveFileName = `MKM-${projectName.replace(/\s+/g, '-')}-Trichy-Brochure.pdf`;

  const handleDownloadTracking = () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('trackCustom', 'BrochureDownload', {
        projectName,
        brochureUrl
      });
    }
  };

  return (
    <div className="bg-white border border-[#e6eae7] rounded-2xl p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left side: Brochure cover preview & metadata */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
          {/* Brochure Cover Thumbnail */}
          <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl bg-[#f2f7f4] border border-[#c8ded4] flex flex-col items-center justify-center shrink-0 shadow-xs relative overflow-hidden group">
            <div className="absolute top-1.5 right-1.5 px-1 py-0.2 rounded text-[8px] font-bold bg-[#0f3d2e] text-[#faf5e6] uppercase">
              PDF
            </div>
            <FileText className="w-8 h-8 text-[#0f3d2e]" />
            <span className="text-[9px] font-bold text-[#0f3d2e] mt-1 text-center px-1 truncate w-full">
              MKM
            </span>
          </div>

          {/* Details */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#faf5e6] text-[#0f3d2e] border border-[#ecd9a2]/80 uppercase tracking-wide">
                Official Brochure
              </span>
              <span className="flex items-center gap-1 text-[11px] text-[#57655d]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#b38928]" />
                PDF Format • {fileSize}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#141f19]">
              {projectName} Layout Brochure & Master Plan
            </h3>
            <p className="text-xs sm:text-sm text-[#57655d] mt-0.5 max-w-xl">
              Includes master layout blueprint, internal road dimensions, plot demarcation numbers, and approval details.
            </p>
          </div>
        </div>

        {/* Right side: Action buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#e6eae7]">
          <a
            href={brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#0f3d2e] text-[#0f3d2e] hover:bg-[#f2f7f4] font-semibold text-xs sm:text-sm transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Brochure</span>
          </a>

          <a
            href={brochureUrl}
            download={descriptiveFileName}
            onClick={handleDownloadTracking}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f3d2e] text-[#faf5e6] hover:bg-[#0a291f] font-bold text-xs sm:text-sm shadow-xs transition-all hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4 text-[#ecd9a2]" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>
    </div>
  );
}
