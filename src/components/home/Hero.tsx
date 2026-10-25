'use client';

import React, { useState } from 'react';
import { ArrowRight, Play, Phone } from 'lucide-react';
import VideoModal from '@/components/projects/VideoModal';

interface HeroProps {
  featuredVideoUrl?: string | null;
  featuredProjectName?: string;
  featuredProjectLocation?: string;
  layoutCount?: number;
}

export default function Hero({
  featuredVideoUrl = null,
  featuredProjectName = 'Sterling Avenue',
  featuredProjectLocation,
  layoutCount = 6
}: HeroProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const hasVideo = Boolean(featuredVideoUrl && featuredVideoUrl.trim() !== '');

  const stats = [
    { value: String(layoutCount), label: 'Verified layouts' },
    { value: 'DTCP', label: 'Clear title deeds' },
    { value: 'Zero', label: 'Brokerage' },
    { value: 'Free', label: 'Cab site visit' }
  ];

  return (
    <>
      <section className="on-dark relative isolate overflow-hidden bg-[var(--forest-deep)] text-[#f6f0dc]">
        {/* Texture + glow */}
        <div aria-hidden="true" className="bg-contours-light absolute inset-0 -z-10" />
        <div
          aria-hidden="true"
          className="absolute -right-[10%] -top-40 -z-10 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgba(220,174,66,0.2),transparent)]"
        />

        <div className="container-x pb-0 pt-14 sm:pt-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* ---------- Copy ---------- */}
            <div className="lg:col-span-7">
              <span className="eyebrow rise">MKM Properties · Tiruchirappalli</span>

              <p className="tamil rise d1 mt-6 max-w-xl text-lg font-medium text-[var(--gold-soft)] sm:text-xl">
                திருச்சியில் உங்கள் தேவைக்கு ஏற்ற மனையைத் தேர்வு செய்யுங்கள்!
              </p>

              <h1 className="display on-dark rise d2 mt-4 text-[clamp(2.9rem,7vw,5.8rem)] text-white">
                Find Your <em>Ideal Plot</em> in Trichy
              </h1>

              <p className="rise d3 mt-7 max-w-lg text-base leading-relaxed text-[#bcc8bf] sm:text-lg">
                Explore residential plots, project videos, location details, and brochures to make an informed property decision.
              </p>

              <div className="rise d4 mt-9 flex flex-wrap items-center gap-3">
                <a href="#projects" className="btn btn-gold">
                  <span>Explore Projects</span>
                  <ArrowRight className="h-4 w-4" />
                </a>

                {hasVideo && (
                  <button type="button" onClick={() => setIsVideoModalOpen(true)} className="btn btn-outline-light">
                    <Play className="h-4 w-4 fill-current" />
                    <span>Watch Project Video</span>
                  </button>
                )}
              </div>

              <div className="rise d4 mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/15 pt-6">
                <span className="f-mono text-[11px] uppercase tracking-[0.18em] text-[#8fa196]">Direct consultation</span>
                <a
                  href="tel:9629048171"
                  className="f-mono flex items-center gap-2 text-[15px] font-medium text-white transition-colors hover:text-[var(--gold-bright)]"
                >
                  <Phone className="h-4 w-4 text-[var(--gold-bright)]" />
                  <span>PRATHAP · 96290 48171</span>
                </a>
              </div>
            </div>

            {/* ---------- Visual ---------- */}
            <div className="rise d2 relative lg:col-span-5">
              <div className="corners corners-out group relative aspect-[4/5] overflow-hidden bg-black/40 sm:aspect-[5/6] lg:aspect-[4/5]">
                <img
                  src="/images/hero.jpg"
                  alt="MKM Properties Trichy layout overview"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--forest-deep)] via-[rgba(7,29,22,0.15)] to-transparent" />

                <span className="f-mono absolute left-4 top-4 bg-[var(--paper)] px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--ink)]">
                  Layout Plan · Trichy
                </span>

                {hasVideo && (
                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(true)}
                    className="absolute inset-0 z-[4] flex items-center justify-center cursor-pointer focus:outline-none"
                    aria-label="Play site video"
                  >
                    <span className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border border-[var(--gold-bright)] bg-[rgba(7,29,22,0.55)] text-[var(--gold-bright)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-1 h-7 w-7 fill-current" />
                    </span>
                  </button>
                )}

                <div className="absolute inset-x-5 bottom-5">
                  <span className="f-mono block text-[10px] uppercase tracking-[0.2em] text-[var(--gold-bright)]">
                    Featured layout
                  </span>
                  <span className="f-display mt-1 block text-2xl leading-tight text-white">{featuredProjectName}</span>
                  {featuredProjectLocation && (
                    <span className="mt-0.5 block text-sm text-[#bcc8bf]">{featuredProjectLocation}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Stat strip ---------- */}
          <dl className="mt-16 grid grid-cols-2 border-t border-white/15 sm:mt-20 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`py-7 pr-4 ${i > 0 ? 'lg:border-l lg:border-white/15 lg:pl-8' : ''} ${
                  i % 2 === 1 ? 'border-l border-white/15 pl-6 lg:pl-8' : ''
                } ${i >= 2 ? 'border-t border-white/15 lg:border-t-0' : ''}`}
              >
                <dt className="f-display text-4xl font-medium leading-none text-[var(--gold-bright)] sm:text-5xl">
                  {s.value}
                </dt>
                <dd className="f-mono mt-3 text-[11px] uppercase tracking-[0.16em] text-[#9fb0a5]">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Video walkthrough modal */}
      {hasVideo && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={featuredVideoUrl as string}
          title={`${featuredProjectName} – Site Walkthrough Tour`}
        />
      )}
    </>
  );
}
