import React, { Suspense } from 'react';
import Link from 'next/link';
import {
  Car,
  FileCheck2,
  Phone,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Compass,
  MessageSquare
} from 'lucide-react';
import SiteVisitForm from '@/components/enquiry/SiteVisitForm';

export const metadata = {
  title: 'MKM Properties – Trichy | Property Guidance & Site Visits',
  description:
    'Find the right property in Trichy. Visit the site. Understand the property. Then decide. Transparent property guidance with PRATHAP (+91 96290 48171).'
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)]">
      {/* 1. HERO SECTION */}
      <section className="relative isolate overflow-hidden border-b border-[var(--line-strong)] bg-gradient-to-b from-[var(--paper-2)] to-[var(--paper)] py-16 sm:py-24 lg:py-28">
        {/* Subtle grid pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#12211a_1px,transparent_1px)] [background-size:24px_24px]"
        />

        <div className="container-x relative">
          <div className="mx-auto max-w-3xl text-center">
            {/* 2. Hero Small Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--forest)]/20 bg-white/70 px-4 py-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-[var(--forest)] shadow-xs">
              <Compass className="h-3.5 w-3.5 text-[var(--gold)]" />
              <span>PROPERTY GUIDANCE • SITE VISIT • TRICHY</span>
            </div>

            {/* 1. Headline */}
            <h1 className="f-display mt-6 text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-5xl lg:text-6xl leading-[1.12]">
              Find the Right Property in Trichy
              <span className="block text-[var(--forest)] italic font-medium mt-1">
                Visit the Site. Understand the Property. Then Decide.
              </span>
            </h1>

            {/* Supporting text */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--ink-soft)] max-w-2xl mx-auto">
              We help you explore residential plots in and around Trichy and make property decisions with better clarity.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex items-center justify-center">
              <a
                href="#site-visit"
                className="btn btn-primary w-full sm:w-auto px-9 py-3.5 text-base font-bold shadow-md cursor-pointer"
              >
                <Car className="h-4 w-4 text-[var(--gold-bright)]" />
                <span>BOOK A SITE VISIT</span>
              </a>
            </div>

            {/* Brand subtitle */}
            <div className="mt-12 border-t border-[var(--line)] pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[var(--ink-soft)] font-mono">
              <span className="font-bold text-[var(--forest)]">MKM PROPERTIES – TRICHY</span>
              <span className="hidden sm:inline">·</span>
              <span>PRATHAP: +91 96290 48171</span>
              <span className="hidden sm:inline">·</span>
              <span>Tiruchirappalli, Tamil Nadu</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. “How We Help You Make an Informed Decision” */}
      <section className="py-16 sm:py-20 border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="container-x">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="eyebrow">Our Approach</span>
            <h2 className="f-display mt-3 text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              How We Help You Make an Informed Decision
            </h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              A consultative process designed to give you clarity and confidence before any commitment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-[var(--line-strong)] bg-[var(--card)] p-6 shadow-xs hover:border-[var(--forest)] transition-colors">
              <div className="f-mono text-2xl font-black text-[var(--gold)]">01</div>
              <h3 className="f-display mt-3 text-base sm:text-lg font-bold text-[var(--ink)]">
                Understand Your Requirement
              </h3>
              <p className="mt-2 text-xs text-[var(--ink-soft)] leading-relaxed">
                House construction, investment, location preference and budget.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--line-strong)] bg-[var(--card)] p-6 shadow-xs hover:border-[var(--forest)] transition-colors">
              <div className="f-mono text-2xl font-black text-[var(--gold)]">02</div>
              <h3 className="f-display mt-3 text-base sm:text-lg font-bold text-[var(--ink)]">
                Shortlist the Right Location
              </h3>
              <p className="mt-2 text-xs text-[var(--ink-soft)] leading-relaxed">
                We help you compare locations based on connectivity, surroundings and your requirement.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--line-strong)] bg-[var(--card)] p-6 shadow-xs hover:border-[var(--forest)] transition-colors">
              <div className="f-mono text-2xl font-black text-[var(--gold)]">03</div>
              <h3 className="f-display mt-3 text-base sm:text-lg font-bold text-[var(--ink)]">
                Visit the Site
              </h3>
              <p className="mt-2 text-xs text-[var(--ink-soft)] leading-relaxed">
                See the location, roads, surroundings and development for yourself.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--line-strong)] bg-[var(--card)] p-6 shadow-xs hover:border-[var(--forest)] transition-colors">
              <div className="f-mono text-2xl font-black text-[var(--gold)]">04</div>
              <h3 className="f-display mt-3 text-base sm:text-lg font-bold text-[var(--ink)]">
                Make an Informed Decision
              </h3>
              <p className="mt-2 text-xs text-[var(--ink-soft)] leading-relaxed">
                Understand the property details before you decide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SITE VISIT SECTION */}
      <section id="site-visit" className="py-16 sm:py-24 border-b border-[var(--line)] bg-[var(--paper-2)]">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Heading, Supporting Text, and Checklist */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <div>
                <span className="eyebrow">On-Site Inspection</span>
                <h2 className="f-display mt-3 text-3xl sm:text-4xl font-extrabold text-[var(--ink)] leading-tight">
                  Arrange Your Guided Site Visit
                </h2>
                <p className="mt-3.5 text-sm text-[var(--ink-soft)] leading-relaxed">
                  Visit the property in person, understand the location and get your questions answered before making a decision.
                </p>
              </div>

              {/* Small Checklist per prompt */}
              <div className="rounded-xl border border-[var(--line-strong)] bg-[var(--card)] p-6 shadow-xs space-y-3.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--forest)] font-bold">
                  What We Cover During the Visit:
                </h4>
                <ul className="space-y-2.5 text-xs text-[var(--ink)]">
                  {[
                    'Project & Location Details',
                    'Plot Availability',
                    'Road & Connectivity',
                    'Surrounding Development',
                    'Documents & Approvals',
                    'Price & Payment Details'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-[var(--forest)] shrink-0" />
                      <span className="font-medium text-slate-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Personal Advisor Card */}
              <div className="rounded-xl border border-[var(--line-strong)] bg-white p-5 shadow-xs flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-soft)] block font-bold">
                    MKM PROPERTIES – TRICHY
                  </span>
                  <span className="f-display text-lg font-bold text-[var(--ink)] block mt-0.5">
                    PRATHAP
                  </span>
                  <a
                    href="tel:9629048171"
                    className="text-xs font-mono font-bold text-[var(--forest)] hover:underline block mt-0.5"
                  >
                    +91 96290 48171
                  </a>
                </div>
                <a
                  href="tel:9629048171"
                  className="btn btn-outline btn-sm font-mono text-xs shrink-0"
                >
                  <Phone className="h-3.5 w-3.5 text-[var(--forest)]" />
                  <span>Call Directly</span>
                </a>
              </div>
            </div>

            {/* Right Column: Site Visit Form */}
            <div className="lg:col-span-7">
              <Suspense fallback={<div className="p-8 text-center text-sm text-[var(--ink-soft)] bg-white rounded-2xl border border-[var(--line)]">Loading site visit form...</div>}>
                <SiteVisitForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* 7. “Why Customers Trust MKM Properties” */}
      <section className="py-16 sm:py-24 border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="container-x">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="eyebrow">Client Trust</span>
            <h2 className="f-display mt-3 text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              Why Customers Trust MKM Properties
            </h2>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Honest property guidance focused on customer clarity and transparent evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-[var(--line-strong)] bg-[var(--card)] p-7 shadow-xs space-y-3">
              <div className="f-mono text-2xl font-black text-[var(--gold)]">01</div>
              <h3 className="f-display text-lg sm:text-xl font-bold text-[var(--ink)]">
                Verified Legal Documents
              </h3>
              <p className="text-xs sm:text-sm text-[var(--ink-soft)] leading-relaxed">
                We help customers understand important property documents and approvals before making a decision.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--line-strong)] bg-[var(--card)] p-7 shadow-xs space-y-3">
              <div className="f-mono text-2xl font-black text-[var(--gold)]">02</div>
              <h3 className="f-display text-lg sm:text-xl font-bold text-[var(--ink)]">
                Strategic Guidance
              </h3>
              <p className="text-xs sm:text-sm text-[var(--ink-soft)] leading-relaxed">
                Understand the location, connectivity, development and property suitability based on your requirement.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--line-strong)] bg-[var(--card)] p-7 shadow-xs space-y-3">
              <div className="f-mono text-2xl font-black text-[var(--gold)]">03</div>
              <h3 className="f-display text-lg sm:text-xl font-bold text-[var(--ink)]">
                Protected Client Process
              </h3>
              <p className="text-xs sm:text-sm text-[var(--ink-soft)] leading-relaxed">
                Clear communication and guidance throughout your property enquiry and site visit.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
