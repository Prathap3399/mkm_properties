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
  Award,
  Building2,
  MapPin,
  MessageSquare
} from 'lucide-react';

export const metadata = {
  title: 'Who We Are · MKM Properties | Trichy Real Estate Advisors',
  description:
    'Learn about MKM Properties, our transparent property guidance approach, and our commitment to helping buyers make confident real estate decisions in Trichy.'
};

const WHATSAPP_URL =
  'https://wa.me/919629048171?text=Hello%20PRATHAP,%20I%20would%20like%20to%20know%20more%20about%20MKM%20Properties%20and%20schedule%20a%20consultation.';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFB] text-slate-900">
      {/* Hero */}
      <section className="border-b border-slate-200/80 bg-gradient-to-b from-white via-[#F8FAFB] to-[#F1F5F4] py-16 sm:py-20">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow">Who We Are</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mt-3">
              A Consultative Approach to <br />
              <span className="text-[#0B271F]">Residential Land in Trichy</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
              MKM Properties was founded on a simple conviction: buying a residential plot should never feel like a high-pressure sales transaction. It should be an unhurried, transparent, and legally verified evaluation.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section: We Do Not Sell First */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 bg-white">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="eyebrow">Our Core Principle</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                We Do Not Sell First. <br />
                We Build Trust, Provide Clarity, and Inspect on the Ground.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Most property portals overwhelm visitors with hundreds of uncontrolled listings, unverified claims, and relentless promotional calls.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                At MKM Properties, we deliberately take the opposite approach. We curate a hand-picked portfolio of approved residential layouts across Trichy’s key growth corridors. We encourage you to walk the land, inspect the road width, taste the groundwater, and review the government approvals before discussing any purchase.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link href="/#site-visit" className="btn btn-primary">
                  <Car className="h-4 w-4 text-[#D9A838]" />
                  <span>Book Free Site Visit Cab</span>
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-slate-200/80 bg-slate-50/60 p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C2922E] font-bold block">
                    Our Core Offerings
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Why Choose MKM Properties?
                  </h3>
                </div>
                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Premium Residential Plots:</strong> Carefully selected plots in high-growth corridors suitable for home construction and investment.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">On-Road Properties:</strong> Direct connectivity to main roads with 30ft–40ft wide blacktop avenues.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">DTCP / RERA Approved Projects:</strong> Statutory clearances and approval blueprints verified project-wise.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Bank-Approved Projects:</strong> Eligible for financing from applicable banks, subject to bank terms and customer eligibility.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Ready-to-Build Plots:</strong> Demarcated boundary stones, sweet drinking water, and immediate power connectivity.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">வீடு கட்டவும், முதலீடு செய்யவும் ஏற்ற மனைகள்:</strong> Suitable for both family home construction and disciplined long-term investment.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">முகவர் கட்டணம் முற்றிலும் இலவசம்:</strong> Zero brokerage and zero agent fees for customers. Direct promoter pricing.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advisory Leadership */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 bg-[#F8FAFB]">
        <div className="container-x">
          <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-md text-center">
            <span className="eyebrow">Direct Accountability</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Meet Your Property Advisor
            </h2>

            <div className="mt-6 mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0B271F] to-[#04100C] text-[#D9A838] flex items-center justify-center font-bold text-3xl shadow-lg ring-4 ring-slate-100">
              PR
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mt-4">
              PRATHAP
            </h3>
            <p className="text-xs font-mono uppercase tracking-widest text-[#C2922E] mt-1 font-semibold">
              Senior Property Advisor &amp; Founder · MKM Properties
            </p>

            <p className="mt-5 text-sm text-slate-600 leading-relaxed max-w-xl mx-auto italic bg-slate-50 p-5 rounded-2xl border border-slate-100">
              "Over the past years in Tiruchirappalli, I have seen buyers struggle with ambiguous approvals and hidden costs. My pledge to you is straightforward: genuine facts, verified documents, and honest advice so your hard-earned savings create lasting family wealth."
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a href="tel:9629048171" className="btn btn-outline btn-sm font-mono text-xs">
                <Phone className="h-3.5 w-3.5 text-[#0B271F]" />
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
