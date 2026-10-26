import React, { Suspense } from 'react';
import Link from 'next/link';
import {
  Car,
  Phone,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Compass,
  MessageSquare,
  Home,
  Building2,
  Hammer,
  Sparkles,
  BadgePercent,
  Mail,
  Clock
} from 'lucide-react';
import SiteVisitForm from '@/components/enquiry/SiteVisitForm';

export const metadata = {
  title: 'MKM Properties – Trichy | Premium Residential Plots & Property Guidance',
  description:
    'Find premium residential plots in Trichy. On-road properties, DTCP & RERA approved projects, bank-approved layouts, and ready-to-build plots with zero brokerage. Consult PRATHAP (+91 96290 48171).'
};

const WHATSAPP_URL =
  'https://wa.me/919629048171?text=Hello%20PRATHAP,%20I%20would%20like%20to%20know%20more%20about%20residential%20plots%20in%20Trichy%20and%20book%20a%20site%20visit.';

// 7 Key Property Offerings per Prompt
const PROPERTY_OFFERINGS = [
  {
    icon: Home,
    title: 'Premium Residential Plots',
    tamilTitle: 'பிரீமியம் வீட்டு மனைகள்',
    description: 'Carefully selected residential plots suitable for home construction and long-term investment.',
    badge: 'Curated Locations',
    details: 'Hand-picked layouts in active residential belts with clear title ownership, demarcated boundary stones, and peaceful surroundings.'
  },
  {
    icon: Compass,
    title: 'On-Road Properties',
    tamilTitle: 'சாலை வசதியுடன் கூடிய மனைகள்',
    description: 'Properties with good road connectivity and accessibility.',
    badge: 'Prime Connectivity',
    details: 'Direct access to main arterial roads, with minimum 30ft to 40ft wide blacktop interior avenues for seamless vehicle movement.'
  },
  {
    icon: ShieldCheck,
    title: 'DTCP / RERA Approved Projects',
    tamilTitle: 'DTCP / RERA அங்கீகரிக்கப்பட்ட மனைகள்',
    description: 'Projects with applicable DTCP and RERA approvals. Display approval details project-wise only when verified.',
    badge: 'Legal Clearance',
    details: 'Directorate of Town and Country Planning (DTCP) sanctions and statutory clearances. Approval numbers and sanctioned blueprints verified project-wise.'
  },
  {
    icon: Building2,
    title: 'Bank-Approved Projects',
    tamilTitle: 'வங்கி கடன் வசதி கொண்ட மனைகள்',
    description: "Projects eligible for financing from applicable banks, subject to the bank's terms and customer eligibility.",
    badge: 'Financing Support',
    details: 'Layouts eligible for plot purchase and home construction loans with leading nationalized and private banks, subject to bank terms and applicant eligibility.'
  },
  {
    icon: Hammer,
    title: 'Ready-to-Build Plots',
    tamilTitle: 'உடனடி வீடு கட்ட ஏற்ற மனைகள்',
    description: 'Plots suitable for customers who are planning to construct their own home.',
    badge: 'Construction Ready',
    details: 'Levelled ground, potable sweet groundwater table, immediate electricity supply, and established residential neighborhoods for quick construction.'
  },
  {
    icon: Sparkles,
    title: 'வீடு கட்டவும், முதலீடு செய்யவும் ஏற்ற மனைகள்',
    tamilTitle: 'Suitable for Home Construction & Long-Term Investment',
    description: 'Properties suitable for both building a home and making a long-term investment.',
    badge: 'Dual Purpose',
    details: 'Balanced residential layouts positioned along Trichy’s key growth corridors, ideal for immediate family residence or disciplined wealth preservation.'
  },
  {
    icon: BadgePercent,
    title: 'முகவர் கட்டணம் முற்றிலும் இலவசம்',
    tamilTitle: 'No Brokerage / Agent Fee for Customers',
    description: 'No brokerage / agent fee for customers.',
    badge: '100% Free Service',
    details: 'Completely direct consultative guidance. Customers pay verified direct promoter rates with zero brokerage, zero agent commission, and no hidden charges.'
  }
];

// 6 Customer-Focused Pillars
const CUSTOMER_PILLARS = [
  {
    number: '01',
    title: 'Customer-Focused Service',
    description: 'We listen first. We take time to understand your budget, family needs, and construction timeline before proposing suitable properties.'
  },
  {
    number: '02',
    title: 'Transparent Property Information',
    description: 'Ground-level reality with zero exaggeration: authentic road widths, drinking water table, soil suitability, and nearby civic developments.'
  },
  {
    number: '03',
    title: 'Site Visit Assistance',
    description: 'Complimentary private cab pickup across Trichy. Walk the land, inspect the neighborhood, and verify boundary stones comfortably with your family.'
  },
  {
    number: '04',
    title: 'Property Guidance',
    description: 'Step-by-step assistance through parent title deed verification (30 years unbroken), Encumbrance Certificates (EC), and registration formalities.'
  },
  {
    number: '05',
    title: 'Verified Project Information',
    description: 'Every layout detail is validated. DTCP/RERA approvals and bank clearance documents are verified project-wise before presentation.'
  },
  {
    number: '06',
    title: 'No Brokerage / Agent Fee',
    description: 'முகவர் கட்டணம் முற்றிலும் இலவசம். Zero commission and zero agent fees for buyers. You purchase directly at verified promoter rates.'
  }
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)]">
      {/* ====================================================================
          1. HERO SECTION
          - Headline: Premium Residential Plots for Your Future
          - Short supporting message
          - BOOK A SITE VISIT
          ==================================================================== */}
      <section className="relative isolate overflow-hidden border-b border-[var(--line-strong)] bg-gradient-to-b from-[var(--paper-2)] to-[var(--paper)] py-16 sm:py-24 lg:py-28">
        {/* Subtle grid pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#12211a_1px,transparent_1px)] [background-size:24px_24px]"
        />

        <div className="container-x relative">
          <div className="mx-auto max-w-4xl text-center">
            {/* Hero Small Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--forest)]/20 bg-white/70 px-4 py-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-[var(--forest)] shadow-xs">
              <Compass className="h-3.5 w-3.5 text-[var(--gold)]" />
              <span>PROPERTY GUIDANCE • SITE VISITS • TIRUCHIRAPPALLI</span>
            </div>

            {/* Headline per prompt */}
            <h1 className="f-display mt-6 text-3xl font-extrabold tracking-tight text-[var(--ink)] sm:text-5xl lg:text-6xl leading-[1.12]">
              Premium Residential Plots for Your Future
              <span className="block text-[var(--forest)] italic font-medium mt-2 text-2xl sm:text-3xl lg:text-4xl">
                Visit the Site. Understand the Property. Then Decide.
              </span>
            </h1>

            {/* Supporting message per prompt */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--ink-soft)] max-w-2xl mx-auto">
              We help customers identify suitable properties, understand the important details, visit the property and make an informed decision.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#site-visit"
                className="btn btn-primary w-full sm:w-auto px-9 py-3.5 text-base font-bold shadow-md cursor-pointer"
              >
                <Car className="h-4 w-4 text-[var(--gold-bright)]" />
                <span>BOOK A SITE VISIT</span>
              </a>

              <a
                href="tel:9629048171"
                className="btn btn-outline w-full sm:w-auto px-7 py-3.5 text-sm font-semibold cursor-pointer"
              >
                <Phone className="h-4 w-4 text-[var(--forest)]" />
                <span>Call Advisor PRATHAP: 96290 48171</span>
              </a>
            </div>

            {/* Key Trust Highlights Strip */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-[var(--line)] text-left">
              <div className="rounded-lg bg-white/60 border border-[var(--line)] p-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--gold)] font-bold block">
                  Service Charge
                </span>
                <span className="text-xs font-bold text-[var(--ink)] mt-0.5 block">
                  முகவர் கட்டணம் முற்றிலும் இலவசம்
                </span>
                <span className="text-[11px] text-[var(--ink-soft)] block">No brokerage for buyers</span>
              </div>

              <div className="rounded-lg bg-white/60 border border-[var(--line)] p-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--gold)] font-bold block">
                  On-Site Inspection
                </span>
                <span className="text-xs font-bold text-[var(--ink)] mt-0.5 block">
                  Free Guided Site Visits
                </span>
                <span className="text-[11px] text-[var(--ink-soft)] block">Private round-trip cab</span>
              </div>

              <div className="rounded-lg bg-white/60 border border-[var(--line)] p-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--gold)] font-bold block">
                  Approvals
                </span>
                <span className="text-xs font-bold text-[var(--ink)] mt-0.5 block">
                  DTCP &amp; RERA Sanctioned
                </span>
                <span className="text-[11px] text-[var(--ink-soft)] block">Verified project-wise</span>
              </div>

              <div className="rounded-lg bg-white/60 border border-[var(--line)] p-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--gold)] font-bold block">
                  Financing
                </span>
                <span className="text-xs font-bold text-[var(--ink)] mt-0.5 block">
                  Bank-Approved Projects
                </span>
                <span className="text-[11px] text-[var(--ink-soft)] block">Nationalized &amp; Pvt Banks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. KEY PROPERTY BENEFITS — "Why Choose Our Properties?"
          - Dedicated section below main Site Visit CTA
          - Displays all 7 benefits using clean icons/cards
          ==================================================================== */}
      <section id="offerings" className="py-16 sm:py-24 border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="container-x">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="eyebrow">Our Property Offerings</span>
            <h2 className="f-display mt-3 text-3xl sm:text-4xl font-extrabold text-[var(--ink)]">
              Why Choose Our Properties?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--ink-soft)] leading-relaxed">
              Every residential plot we present is selected with high standards of legal verification, physical road accessibility, and authentic construction readiness.
            </p>
          </div>

          {/* 7 Clean Benefit Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROPERTY_OFFERINGS.map((offering, idx) => {
              const Icon = offering.icon;
              const isHighlight = idx >= 5; // Highlight the 2 Tamil/Special cards
              return (
                <div
                  key={offering.title}
                  className={`relative rounded-2xl border bg-[var(--card)] p-6 sm:p-7 shadow-xs hover:border-[var(--forest)] transition-all duration-200 flex flex-col justify-between ${
                    isHighlight
                      ? 'border-[var(--forest)]/40 bg-gradient-to-br from-[var(--card)] to-white'
                      : 'border-[var(--line-strong)]'
                  } ${idx === 6 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  <div>
                    {/* Header: Icon + Badge */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--paper-2)] text-[var(--forest)] border border-[var(--line)]">
                        <Icon className="h-6 w-6 text-[var(--forest)]" />
                      </div>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-mono font-semibold text-emerald-800">
                        {offering.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="f-display mt-5 text-xl font-bold text-[var(--ink)] leading-snug">
                      {offering.title}
                    </h3>
                    {offering.tamilTitle && offering.tamilTitle !== offering.title && (
                      <span className="text-xs font-medium text-[var(--forest)] block mt-1">
                        {offering.tamilTitle}
                      </span>
                    )}

                    {/* Description per prompt */}
                    <p className="mt-3 text-xs sm:text-sm text-[var(--ink)] font-medium leading-relaxed">
                      {offering.description}
                    </p>

                    {/* Additional verified details */}
                    <p className="mt-2 text-xs text-[var(--ink-soft)] leading-relaxed">
                      {offering.details}
                    </p>
                  </div>

                  {/* Bottom Verification Note */}
                  <div className="mt-5 pt-4 border-t border-[var(--line)] flex items-center gap-2 text-[11px] font-mono text-[var(--forest)]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--forest)] shrink-0" />
                    <span>Verified on-ground</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. WHY CHOOSE US?
          - Customer-focused approach
          - 6 Pillars
          - Public vs Protected Portal transparency
          ==================================================================== */}
      <section id="why-us" className="py-16 sm:py-24 border-b border-[var(--line)] bg-[var(--paper-2)]">
        <div className="container-x">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="eyebrow">Our Consultative Approach</span>
            <h2 className="f-display mt-3 text-3xl sm:text-4xl font-extrabold text-[var(--ink)]">
              Why Choose MKM Properties?
            </h2>
            <blockquote className="mt-4 text-base sm:text-lg italic font-serif text-[var(--forest)] max-w-2xl mx-auto">
              “We help customers identify suitable properties, understand the important details, visit the property and make an informed decision.”
            </blockquote>
            <p className="mt-2 text-xs sm:text-sm text-[var(--ink-soft)]">
              We do not treat property transactions as rushed advertisements. Our consultative process gives you full clarity and ground truth before any commitment.
            </p>
          </div>

          {/* 6 Customer-Focused Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CUSTOMER_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-[var(--line-strong)] bg-white p-6 sm:p-7 shadow-xs hover:border-[var(--forest)] transition-colors"
              >
                <div className="f-mono text-2xl font-black text-[var(--gold)]">{pillar.number}</div>
                <h3 className="f-display mt-3 text-lg sm:text-xl font-bold text-[var(--ink)]">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-[var(--ink-soft)] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. SITE VISIT FORM
          - Book Your Free Site Visit
          - Checklist & Details
          ==================================================================== */}
      <section id="site-visit" className="py-16 sm:py-24 border-b border-[var(--line)] bg-[var(--paper-2)]">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Heading, Supporting Text, and Checklist */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <div>
                <span className="eyebrow">On-Site Inspection</span>
                <h2 className="f-display mt-3 text-3xl sm:text-4xl font-extrabold text-[var(--ink)] leading-tight">
                  Book Your Free Site Visit
                </h2>
                <p className="mt-3.5 text-sm text-[var(--ink-soft)] leading-relaxed">
                  Visit the property in person, understand the location and get your questions answered before making a decision.
                </p>
              </div>

              {/* Checklist */}
              <div className="rounded-xl border border-[var(--line-strong)] bg-[var(--card)] p-6 shadow-xs space-y-3.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--forest)] font-bold">
                  What We Cover During the Visit:
                </h4>
                <ul className="space-y-2.5 text-xs text-[var(--ink)]">
                  {[
                    'Project & Location Details',
                    'Plot Availability & Boundary Markers',
                    'Road & Connectivity Access',
                    'Surrounding Residential Development',
                    'Groundwater & Soil Suitability',
                    'Documents & Approvals Verification',
                    'Price & Payment Details (Direct Promoter Rates)'
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
              <Suspense
                fallback={
                  <div className="p-8 text-center text-sm text-[var(--ink-soft)] bg-white rounded-2xl border border-[var(--line)]">
                    Loading site visit form...
                  </div>
                }
              >
                <SiteVisitForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. CONTACT US
          - Phone / WhatsApp / Email / Location
          - Direct Advisory
          ==================================================================== */}
      <section id="contact" className="py-16 sm:py-24 border-b border-[var(--line)] bg-[var(--paper)]">
        <div className="container-x">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="eyebrow">Direct Contact &amp; Advisory</span>
            <h2 className="f-display mt-3 text-3xl sm:text-4xl font-extrabold text-[var(--ink)]">
              Contact Us
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--ink-soft)] leading-relaxed">
              Have questions about residential plot locations, legal approvals, or want to arrange an on-site visit? Connect with Senior Property Advisor PRATHAP directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone Card */}
            <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--card)] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--paper-2)] text-[var(--forest)] mb-4">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-soft)] block font-bold">
                  Direct Phone
                </span>
                <h3 className="f-display text-xl font-bold text-[var(--ink)] mt-1">
                  +91 96290 48171
                </h3>
                <p className="text-xs text-[var(--ink-soft)] mt-2 leading-relaxed">
                  Call PRATHAP directly for one-on-one plot consultation and site coordination.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--line)]">
                <a href="tel:9629048171" className="btn btn-outline btn-sm w-full font-mono text-xs">
                  <Phone className="h-3.5 w-3.5 text-[var(--forest)]" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/50 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-emerald-800 mb-4">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 block font-bold">
                  WhatsApp Consultation
                </span>
                <h3 className="f-display text-xl font-bold text-emerald-950 mt-1">
                  Instant Chat
                </h3>
                <p className="text-xs text-emerald-900 mt-2 leading-relaxed">
                  Send your preferred location, plot size, or budget to receive quick guidance.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-200">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa btn-sm w-full font-mono text-xs"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--card)] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--paper-2)] text-[var(--forest)] mb-4">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-soft)] block font-bold">
                  Official Email
                </span>
                <h3 className="f-display text-lg font-bold text-[var(--ink)] mt-1 truncate">
                  advisor@mkmproperties.com
                </h3>
                <p className="text-xs text-[var(--ink-soft)] mt-2 leading-relaxed">
                  Send your detailed requirements or request verification documents.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--line)]">
                <a
                  href="mailto:advisor@mkmproperties.com"
                  className="btn btn-outline btn-sm w-full font-mono text-xs"
                >
                  <Mail className="h-3.5 w-3.5 text-[var(--forest)]" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--card)] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--paper-2)] text-[var(--forest)] mb-4">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-soft)] block font-bold">
                  Office Location
                </span>
                <h3 className="f-display text-lg font-bold text-[var(--ink)] mt-1">
                  Tiruchirappalli
                </h3>
                <p className="text-xs text-[var(--ink-soft)] mt-2 leading-relaxed">
                  No. 14, Royal Tower, Cantonment / K.K. Nagar Road, Trichy – 620001, Tamil Nadu
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--line)]">
                <Link href="/contact" className="btn btn-outline btn-sm w-full font-mono text-xs">
                  <MapPin className="h-3.5 w-3.5 text-[var(--forest)]" />
                  <span>View Map &amp; Hours</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Consultation Hours banner */}
          <div className="mt-10 rounded-xl border border-[var(--line-strong)] bg-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-soft)]">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[var(--forest)] shrink-0" />
              <div>
                <strong className="text-[var(--ink)]">Consultation &amp; Site Visit Hours:</strong> Monday – Sunday: 8:00 AM – 8:00 PM (Open all weekends for family site visit inspections).
              </div>
            </div>
            <a href="#site-visit" className="btn btn-primary btn-sm shrink-0 font-mono text-xs">
              <Car className="h-3.5 w-3.5 text-[var(--gold-bright)]" />
              <span>Book Your Visit Now</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
