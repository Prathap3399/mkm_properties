import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Compass,
  CheckCircle2,
  FileCheck2,
  Car,
  Phone,
  ArrowRight,
  Eye,
  HeartHandshake,
  Award
} from 'lucide-react';

export const metadata = {
  title: 'Who We Are · MKM Properties | Trichy Real Estate Advisors',
  description:
    'Learn about MKM Properties, our transparent property guidance approach, and our commitment to helping buyers make confident real estate decisions in Trichy.'
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)]">
      {/* Hero */}
      <section className="border-b border-[var(--line-strong)] bg-gradient-to-b from-[var(--paper-2)] to-[var(--paper)] py-16 sm:py-20">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow">Who We Are</span>
            <h1 className="f-display mt-4 text-3xl sm:text-5xl font-extrabold text-[var(--ink)] leading-tight">
              A Consultative Approach to <br />
              <em className="text-[var(--forest)] font-serif">Residential Land in Trichy</em>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[var(--ink-soft)] leading-relaxed">
              MKM Properties was founded on a simple conviction: buying a residential plot should never feel like a high-pressure transaction. It should be a guided, transparent, and legally verified evaluation.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section: Do Not Sell First */}
      <section className="py-16 sm:py-20 border-b border-[var(--line)]">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="eyebrow">Our Core Principle</span>
              <h2 className="f-display text-2xl sm:text-3xl font-bold text-[var(--ink)]">
                We Do Not Sell First. <br />
                We Build Trust, Provide Clarity, and Inspect on the Ground.
              </h2>
              <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
                Most property portals overwhelm visitors with hundreds of uncontrolled listings, unverified claims, and relentless promotional calls.
              </p>
              <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
                At MKM Properties, we deliberately take the opposite approach. We curate a hand-picked portfolio of approved residential layouts across Trichy’s key growth corridors. We encourage you to walk the land, inspect the road width, taste the groundwater, and review the government approvals before discussing any purchase.
              </p>

              <div className="pt-2">
                <Link href="/#site-visit" className="btn btn-primary">
                  <Car className="h-4 w-4 text-[var(--gold-bright)]" />
                  <span>Book Free Site Visit Inspection</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--card)] p-8 shadow-sm space-y-6">
                <h3 className="f-display text-xl font-bold text-[var(--ink)]">
                  The MKM 5-Point Buyer Commitment
                </h3>
                <ul className="space-y-4 text-xs sm:text-sm text-[var(--ink)]">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[var(--forest)] shrink-0 mt-0.5" />
                    <span>
                      <strong>100% Verified Legal Documents:</strong> Every layout has clear DTCP/RERA approvals, encumbrance certificates (EC), and verified parent titles.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[var(--forest)] shrink-0 mt-0.5" />
                    <span>
                      <strong>Transparent Direct Promoter Pricing:</strong> No hidden commission, no inflated price tags. You pay the exact developer rate.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[var(--forest)] shrink-0 mt-0.5" />
                    <span>
                      <strong>Free Guided Site Visits:</strong> Private round-trip cab pickup anywhere in Trichy so you and your family can inspect comfortably.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[var(--forest)] shrink-0 mt-0.5" />
                    <span>
                      <strong>Potable Water &amp; Soil Check:</strong> We verify sweet water level and soil suitability for house construction.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[var(--forest)] shrink-0 mt-0.5" />
                    <span>
                      <strong>Controlled Access Protection:</strong> Full architectural layouts and price sheets are provided exclusively to authorized clients.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advisory Leadership */}
      <section className="py-16 sm:py-20 border-b border-[var(--line)] bg-[var(--paper-2)]">
        <div className="container-x">
          <div className="max-w-3xl mx-auto rounded-2xl border border-[var(--line-strong)] bg-white p-8 sm:p-10 shadow-sm text-center">
            <span className="eyebrow">Direct Accountability</span>
            <h2 className="f-display mt-2 text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              Meet Your Property Advisor
            </h2>
            <div className="mt-6 mx-auto w-20 h-20 rounded-full bg-[var(--paper-2)] border-2 border-[var(--forest)] flex items-center justify-center font-serif text-2xl font-bold text-[var(--forest)]">
              PR
            </div>
            <h3 className="f-display mt-4 text-2xl font-bold text-[var(--ink)]">
              PRATHAP
            </h3>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--gold)] mt-0.5">
              Senior Property Advisor &amp; Founder · MKM Properties
            </p>
            <p className="mt-4 text-sm text-[var(--ink-soft)] leading-relaxed max-w-xl mx-auto">
              "Over the past years in Tiruchirappalli, I have seen buyers struggle with ambiguous approvals and hidden costs. My pledge to you is straightforward: genuine facts, verified documents, and honest advice so your hard-earned savings create lasting family wealth."
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a href="tel:9629048171" className="btn btn-outline btn-sm font-mono text-xs">
                <Phone className="h-3.5 w-3.5 text-[var(--forest)]" />
                <span>Call Directly: +91 96290 48171</span>
              </a>
              <Link href="/contact" className="btn btn-primary btn-sm text-xs">
                <span>View Office &amp; Contact Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
