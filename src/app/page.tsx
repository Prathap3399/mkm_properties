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
  BadgePercent,
  Mail,
  Clock,
  Sparkles
} from 'lucide-react';
import SiteVisitForm from '@/components/enquiry/SiteVisitForm';

export const metadata = {
  title: 'MKM Properties – Trichy | Premium Residential Plots & Property Guidance',
  description:
    'Find premium residential plots in Trichy with direct road connectivity, DTCP & RERA approved projects, bank-approved layouts, and ready-to-build plots with zero brokerage. Consult PRATHAP (+91 96290 48171).'
};

const WHATSAPP_URL =
  'https://wa.me/919629048171?text=Hello%20PRATHAP,%20I%20would%20like%20to%20know%20more%20about%20residential%20plots%20in%20Trichy%20and%20book%20a%20site%20visit.';

// 7 Property Offerings per user specification
const PROPERTY_OFFERINGS = [
  {
    icon: Home,
    badge: 'Curated Locations',
    title: 'Premium Residential Plots',
    subtitle: 'பிரீமியம் வீட்டு மனைகள்',
    lead: 'Carefully selected residential plots suitable for home construction and long-term investment.',
    description:
      'Hand-picked layouts in active residential belts with clear title ownership, demarcated boundary stones, and peaceful surroundings.',
    tamilPrimary: false
  },
  {
    icon: Compass,
    badge: 'Prime Connectivity',
    title: 'On-Road Properties',
    subtitle: 'சாலை வசதியுடன் கூடிய மனைகள்',
    lead: 'Properties with good road connectivity and accessibility.',
    description:
      'Direct access to main arterial roads, with minimum 30ft to 40ft wide blacktop interior avenues for seamless vehicle movement.',
    tamilPrimary: false
  },
  {
    icon: ShieldCheck,
    badge: 'Legal Clearance',
    title: 'DTCP / RERA Approved Projects',
    subtitle: 'DTCP / RERA அங்கீகரிக்கப்பட்ட மனைகள்',
    lead: 'Projects with applicable DTCP and RERA approvals. Display approval details project-wise only when verified.',
    description:
      'Directorate of Town and Country Planning (DTCP) sanctions and statutory clearances. Approval numbers and sanctioned blueprints verified project-wise.',
    tamilPrimary: false
  },
  {
    icon: Building2,
    badge: 'Financing Support',
    title: 'Bank-Approved Projects',
    subtitle: 'வங்கி கடன் வசதி கொண்ட மனைகள்',
    lead: "Projects eligible for financing from applicable banks, subject to the bank's terms and customer eligibility.",
    description:
      'Layouts eligible for plot purchase and home construction loans with leading nationalized and private banks, subject to bank terms and applicant eligibility.',
    tamilPrimary: false
  },
  {
    icon: Hammer,
    badge: 'Construction Ready',
    title: 'Ready-to-Build Plots',
    subtitle: 'உடனடி வீடு கட்ட ஏற்ற மனைகள்',
    lead: 'Plots suitable for customers who are planning to construct their own home.',
    description:
      'Levelled ground, potable sweet groundwater table, immediate electricity supply, and established residential neighborhoods for quick construction.',
    tamilPrimary: false
  },
  {
    icon: Sparkles,
    badge: 'Dual Purpose',
    title: 'வீடு கட்டவும், முதலீடு செய்யவும் ஏற்ற மனைகள்',
    subtitle: 'Suitable for Home Construction & Long-Term Investment',
    lead: 'Properties suitable for both building a home and making a long-term investment.',
    description:
      "Balanced residential layouts positioned along Trichy's key growth corridors, ideal for immediate family residence or disciplined wealth preservation.",
    tamilPrimary: true
  },
  {
    icon: BadgePercent,
    badge: '100% Free Service',
    title: 'முகவர் கட்டணம் முற்றிலும் இலவசம்',
    subtitle: 'No Brokerage / Agent Fee for Customers',
    lead: 'No brokerage / agent fee for customers.',
    description:
      'Completely direct consultative guidance. Customers pay verified promoter rates with zero brokerage, zero agent commission, and no hidden charges.',
    tamilPrimary: true
  }
];

// 6 Customer-Focused Pillars per prompt
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
    title: 'No Brokerage for Customers',
    description: 'முகவர் கட்டணம் முற்றிலும் இலவசம். Zero commission and zero agent fees for buyers. You purchase directly at verified promoter rates.'
  }
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFB] text-slate-900">
      {/* ====================================================================
          1. HERO SECTION — MAJOR REDESIGN (Prompt Section 6 & 7)
          - Strong visual composition with high-quality real-estate visual
          - Clear eyebrow, main headline, supporting text, primary & secondary CTAs
          - Floating trust indicators
          ==================================================================== */}
      <section className="relative isolate overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white via-[#F8FAFB] to-[#F1F5F4] pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-16 lg:pb-28">
        {/* Subtle architectural background texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(#0F172A_1px,transparent_1px)] [background-size:28px_28px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-10 h-80 w-80 rounded-full bg-amber-100/30 blur-3xl"
        />

        <div className="container-x relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Copy & Conversions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-50/80 px-4 py-1.5 text-xs font-mono font-semibold uppercase tracking-widest text-[#0B271F] shadow-xs">
                <Compass className="h-3.5 w-3.5 text-[#C2922E]" />
                <span>PREMIUM RESIDENTIAL PLOTS • TIRUCHIRAPPALLI</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
                Find a Place to Build <br className="hidden sm:inline" />
                <span className="text-[#0B271F]">Your Future.</span>
                <span className="block text-xl sm:text-2xl lg:text-3xl font-medium text-[#C2922E] mt-3 italic font-serif">
                  Visit the Site. Understand the Property. Then Decide.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl">
                Premium residential plots with excellent connectivity, verified project details, and professional property guidance. We help you evaluate on-ground truth before taking any decision.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <a
                  href="#site-visit"
                  className="btn btn-primary btn-lg shadow-md flex items-center justify-center gap-2.5"
                >
                  <Car className="h-5 w-5 text-[#D9A838]" />
                  <span>Book a Site Visit</span>
                </a>

                <a
                  href="tel:9629048171"
                  className="btn btn-outline btn-lg flex items-center justify-center gap-2.5 text-slate-800"
                >
                  <Phone className="h-4 w-4 text-[#0B271F]" />
                  <span>Talk to a Property Advisor</span>
                </a>
              </div>

              {/* Fast Trust Bar under CTAs */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-900">Zero Brokerage</span>
                  <span>(முகவர் கட்டணம் இல்லை)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-900">Free Round-Trip Cab</span>
                  <span>for Inspections</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-900">DTCP &amp; RERA</span>
                  <span>Verified Project-Wise</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Treatment (Prompt Section 7) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Container */}
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-900 shadow-2xl aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src="/images/hero.jpg"
                    alt="Aerial view of premium residential layout in Trichy with blacktop roads and green plots"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                  {/* Overlaid Location Badge */}
                  <div className="absolute top-4 left-4 rounded-xl bg-white/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-slate-900 shadow-sm border border-white/60">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                    Trichy Prime Growth Corridors
                  </div>

                  {/* Overlaid Bottom Details */}
                  <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-white">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#D9A838] block font-bold">
                        Curated Gated Enclaves
                      </span>
                      <span className="text-sm font-bold block">
                        30ft – 40ft Wide Blacktop Avenues
                      </span>
                    </div>
                    <span className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                      Ready to Build
                    </span>
                  </div>
                </div>

                {/* Floating Metric Card: Direct Promoter Rates */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 rounded-2xl bg-white p-4 shadow-xl border border-slate-200/80 max-w-[220px] hidden sm:block animate-fadeIn">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                        Transparency
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        100% Clear Titles
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Metric Card: Free Site Cab */}
                <div className="absolute -top-5 -right-4 sm:-right-6 rounded-2xl bg-white p-3.5 shadow-xl border border-slate-200/80 max-w-[210px] hidden sm:block animate-fadeIn">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#C2922E] flex items-center justify-center font-bold">
                      <Car className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                        On-Site Visit
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Free Cab Pickup
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. TRUST STRIP (Prompt Section 8)
          - Immediately below the hero
          - Clean product feature strip, not a colorful banner
          ==================================================================== */}
      <section className="border-b border-slate-200/80 bg-white py-6">
        <div className="container-x">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="flex flex-col items-center text-center px-2 py-2">
              <Home className="h-5 w-5 text-[#0B271F] mb-1.5" />
              <span className="text-xs font-bold text-slate-900">Premium Plots</span>
              <span className="text-[11px] text-slate-500">Curated locations</span>
            </div>

            <div className="flex flex-col items-center text-center px-2 py-2 pt-3 sm:pt-2">
              <Compass className="h-5 w-5 text-[#0B271F] mb-1.5" />
              <span className="text-xs font-bold text-slate-900">On-Road Properties</span>
              <span className="text-[11px] text-slate-500">30ft–40ft Wide Roads</span>
            </div>

            <div className="flex flex-col items-center text-center px-2 py-2 pt-3 sm:pt-2">
              <ShieldCheck className="h-5 w-5 text-[#0B271F] mb-1.5" />
              <span className="text-xs font-bold text-slate-900">DTCP / RERA</span>
              <span className="text-[11px] text-slate-500">Verified project-wise</span>
            </div>

            <div className="flex flex-col items-center text-center px-2 py-2 pt-3 sm:pt-2">
              <Building2 className="h-5 w-5 text-[#0B271F] mb-1.5" />
              <span className="text-xs font-bold text-slate-900">Bank-Approved</span>
              <span className="text-[11px] text-slate-500">Nationalized &amp; Pvt</span>
            </div>

            <div className="flex flex-col items-center text-center px-2 py-2 pt-3 sm:pt-2">
              <Hammer className="h-5 w-5 text-[#0B271F] mb-1.5" />
              <span className="text-xs font-bold text-slate-900">Ready-to-Build</span>
              <span className="text-[11px] text-slate-500">Water, power &amp; stones</span>
            </div>

            <div className="flex flex-col items-center text-center px-2 py-2 pt-3 sm:pt-2">
              <BadgePercent className="h-5 w-5 text-emerald-700 mb-1.5" />
              <span className="text-xs font-bold text-emerald-800">No Brokerage</span>
              <span className="text-[11px] text-slate-500">100% Free Service</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. OUR PROPERTY OFFERINGS — "Why Choose Our Properties?"
          ==================================================================== */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 bg-[#F8FAFB]">
        <div className="container-x">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="eyebrow">Our Property Offerings</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Why Choose Our Properties?
            </h2>
            <p className="mt-3.5 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Every residential plot we present is selected with high standards of legal verification, physical road accessibility, and authentic construction readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {PROPERTY_OFFERINGS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200/90 bg-white p-7 sm:p-8 flex flex-col justify-between shadow-sm transition-all hover:shadow-md hover:border-emerald-700/30"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="w-11 h-11 rounded-xl bg-slate-100/90 text-[#0B271F] flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="inline-flex items-center rounded-full border border-emerald-600/30 bg-emerald-50/70 px-3 py-1 text-[11px] font-semibold text-emerald-800">
                        {item.badge}
                      </span>
                    </div>

                    {item.tamilPrimary ? (
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug tamil">
                          {item.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 mt-1">
                          {item.subtitle}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 mt-1 tamil">
                          {item.subtitle}
                        </p>
                      </div>
                    )}

                    <p className="mt-4 text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                      {item.lead}
                    </p>
                    <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-slate-500">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Verified on-ground</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. WHY CHOOSE MKM PROPERTIES — 6 CUSTOMER-FOCUSED PILLARS
          ==================================================================== */}
      <section id="why-us" className="py-16 sm:py-24 border-b border-slate-200/80 bg-white">
        <div className="container-x">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="eyebrow">Our Consultative Standard</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Why Customers Trust MKM Properties
            </h2>
            <p className="mt-3.5 text-base text-slate-600 leading-relaxed">
              We do not treat property transactions as rushed sales. Our step-by-step guidance guarantees full clarity before any financial commitment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CUSTOMER_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="pro-card p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-2xl font-black text-[#C2922E]">
                    {pillar.number}
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-900 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Standard Practice</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. SITE VISIT FORM — PRIMARY CONVERSION (Prompt Section 11)
          - Left: Checklist & Personal Advisor card
          - Right: High-UX Multi-field Form
          ==================================================================== */}
      <section id="site-visit" className="py-16 sm:py-24 border-b border-slate-200/80 bg-[#F8FAFB]">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Heading, Supporting Text, and Checklist */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
              <div>
                <span className="eyebrow">Free On-Ground Inspection</span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Plan Your Site Visit
                </h2>
                <p className="mt-3.5 text-base text-slate-600 leading-relaxed">
                  Tell us what you're looking for. Our property advisor will help you identify suitable options and arrange a convenient site visit.
                </p>
              </div>

              {/* What We Cover Checklist */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#0B271F] font-bold">
                  What We Cover During the Visit:
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  {[
                    'Plot Availability & Exact Boundary Markers',
                    'Road Width & Direct Blacktop Highway Access',
                    'Surrounding Residential Neighborhood Inspection',
                    'Groundwater Level & Soil Suitability Check',
                    'DTCP & RERA Sanction Documents Inspection',
                    'Direct Promoter Pricing with Zero Brokerage'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Advisor Quick Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0B271F] font-bold">
                    PR
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                      Senior Property Advisor
                    </span>
                    <span className="text-base font-bold text-slate-900 block leading-tight">
                      PRATHAP
                    </span>
                    <a
                      href="tel:9629048171"
                      className="text-xs font-mono font-bold text-emerald-700 hover:underline block"
                    >
                      +91 96290 48171
                    </a>
                  </div>
                </div>

                <a
                  href="tel:9629048171"
                  className="btn btn-outline btn-sm font-mono text-xs shrink-0"
                >
                  <Phone className="h-3.5 w-3.5 text-[#0B271F]" />
                  <span>Call Directly</span>
                </a>
              </div>
            </div>

            {/* Right Column: Site Visit Form */}
            <div className="lg:col-span-7">
              <Suspense
                fallback={
                  <div className="p-8 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-200">
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
          9. CONTACT US (Prompt Section 21)
          - Phone, WhatsApp, Email, Office, Working Hours
          ==================================================================== */}
      <section id="contact" className="py-16 sm:py-24 bg-white">
        <div className="container-x">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="eyebrow">Direct Contact &amp; Advisory</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Get in Touch with Our Advisors
            </h2>
            <p className="mt-3.5 text-base text-slate-600 leading-relaxed">
              Have questions about residential plot locations, legal approvals, or want to schedule an in-person site visit? We are available 7 days a week.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Direct Phone */}
            <div className="pro-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B271F] flex items-center justify-center mb-4">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                  Direct Phone
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  +91 96290 48171
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Call PRATHAP directly for one-on-one plot consultation and site visit coordination.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <a href="tel:9629048171" className="btn btn-outline btn-sm w-full font-mono text-xs">
                  <Phone className="h-3.5 w-3.5 text-[#0B271F]" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="pro-card p-6 flex flex-col justify-between border-emerald-200 bg-emerald-50/30">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 block font-bold">
                  WhatsApp Consultation
                </span>
                <h3 className="text-lg font-bold text-emerald-950 mt-1">
                  Instant Chat
                </h3>
                <p className="text-xs text-emerald-900 mt-2 leading-relaxed">
                  Send your preferred location, plot size, or budget to receive prompt guidance.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-100">
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

            {/* Official Email */}
            <div className="pro-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B271F] flex items-center justify-center mb-4">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                  Official Email
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1 truncate">
                  advisor@mkmproperties.com
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Send your detailed requirements or request verification documents.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <a
                  href="mailto:advisor@mkmproperties.com"
                  className="btn btn-outline btn-sm w-full font-mono text-xs"
                >
                  <Mail className="h-3.5 w-3.5 text-[#0B271F]" />
                  <span>Send Email</span>
                </a>
              </div>
            </div>

            {/* Office Location */}
            <div className="pro-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B271F] flex items-center justify-center mb-4">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                  Office Location
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Tiruchirappalli
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  No. 14, Royal Tower, Cantonment / K.K. Nagar Road, Trichy – 620001, Tamil Nadu
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link href="/contact" className="btn btn-outline btn-sm w-full font-mono text-xs">
                  <MapPin className="h-3.5 w-3.5 text-[#0B271F]" />
                  <span>View Map &amp; Hours</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Consultation Hours banner */}
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#0B271F] shrink-0" />
              <div>
                <strong className="text-slate-900">Consultation &amp; Site Visit Hours:</strong> Monday – Sunday: 8:00 AM – 8:00 PM (Available 7 days a week for family site visit inspections).
              </div>
            </div>
            <a href="#site-visit" className="btn btn-primary btn-sm shrink-0 font-mono text-xs">
              <Car className="h-3.5 w-3.5 text-[#D9A838]" />
              <span>Book Your Visit Now</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
