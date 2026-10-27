'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, CalendarCheck } from 'lucide-react';

const WHATSAPP_URL =
  'https://wa.me/919629048171?text=Hello%20PRATHAP,%20I%20would%20like%20to%20know%20more%20about%20residential%20plots%20in%20Trichy.';

export default function StickyMobileBar() {
  const handleAnalyticsClick = (action: string) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('trackCustom', 'MobileContactClick', { action });
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden">
      <div className="grid grid-cols-3 divide-x divide-slate-100 p-1.5">
        {/* Direct Call */}
        <a
          href="tel:9629048171"
          onClick={() => handleAnalyticsClick('call')}
          className="flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold text-slate-800 active:bg-slate-100 rounded-lg transition-colors"
          title="Direct Call to Advisor PRATHAP"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#0B271F]">
            <Phone className="h-4 w-4" />
          </div>
          <span>Call Advisor</span>
        </a>

        {/* WhatsApp Consultation */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleAnalyticsClick('whatsapp')}
          className="flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-semibold text-emerald-800 active:bg-emerald-50 rounded-lg transition-colors"
          title="WhatsApp Chat with PRATHAP"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
            <MessageSquare className="h-4 w-4" />
          </div>
          <span>WhatsApp</span>
        </a>

        {/* Book Site Visit */}
        <a
          href="/#site-visit"
          onClick={() => handleAnalyticsClick('site_visit')}
          className="flex flex-col items-center justify-center gap-1 py-2 text-[11px] font-bold text-white bg-[#0B271F] active:bg-[#071B15] rounded-lg transition-colors shadow-xs"
          title="Book Free Site Visit"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#D9A838]">
            <CalendarCheck className="h-4 w-4" />
          </div>
          <span>Site Visit</span>
        </a>
      </div>
    </div>
  );
}
