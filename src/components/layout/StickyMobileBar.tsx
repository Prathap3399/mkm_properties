'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, CalendarCheck } from 'lucide-react';

export default function StickyMobileBar() {
  const handleAnalyticsClick = (action: string) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('trackCustom', 'MobileContactClick', { action });
    }
  };

  const base =
    'flex flex-col items-center justify-center gap-1 px-1 py-2.5 text-[11px] font-semibold tracking-tight transition-colors';

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line-strong)] bg-[var(--paper)] pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(18,33,26,0.08)] md:hidden">
      <div className="grid grid-cols-3 divide-x divide-[var(--line)]">
        <a
          href="tel:9629048171"
          onClick={() => handleAnalyticsClick('call')}
          className={`${base} bg-[var(--forest)] text-[#fbf5e1] hover:bg-[var(--forest-dark)]`}
          title="Direct Call to PRATHAP"
        >
          <Phone className="h-4 w-4 text-[var(--gold-bright)]" />
          <span>Call PRATHAP</span>
        </a>

        <a
          href="https://wa.me/919629048171?text=Hello%20PRATHAP,%20I%20am%20interested%20in%20residential%20plots%20in%20Trichy."
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleAnalyticsClick('whatsapp')}
          className={`${base} bg-[#1c9d52] text-white hover:bg-[#158643]`}
          title="WhatsApp Chat"
        >
          <MessageSquare className="h-4 w-4" />
          <span>WhatsApp</span>
        </a>

        <Link
          href="/#site-visit"
          className={`${base} bg-[var(--gold-bright)] text-[var(--forest-deep)] hover:bg-[#cfa13a]`}
          title="Book Free Site Visit"
        >
          <CalendarCheck className="h-4 w-4" />
          <span>Site Visit</span>
        </Link>
      </div>
    </div>
  );
}
