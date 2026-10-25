import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, Check, MapPin } from 'lucide-react';

const checklist = [
  'Verified DTCP & RERA Layouts',
  'Transparent Direct Promoter Rates',
  'Free On-Site Cab Inspection',
  'Bank Loan & Registration Guidance'
];

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden="true" className="bg-contours-dark absolute inset-0 -z-10" />

      <div className="container-x">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Story */}
          <div className="lg:col-span-7">
            <span className="eyebrow">05 · About MKM</span>
            <h2 className="h-section mt-5">
              Honest, ground-level property <em>guidance</em> in Trichy
            </h2>

            <p className="mt-7 max-w-2xl text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
              MKM Properties was founded to solve the biggest challenge property buyers face in Tiruchirappalli: navigating confusing approvals, unverified title deeds, and inflated broker pricing.
            </p>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
              Led personally by <strong className="font-semibold text-[var(--ink)]">PRATHAP</strong>, we assist families who want to construct their dream home and smart investors seeking high-potential land along Trichy’s fastest-growing corridors — including Panjappur, K.K. Nagar Extension, Samayapuram, Navalpattu IT Park, and Thiruverumbur.
            </p>

            <ul className="mt-9 grid grid-cols-1 gap-x-8 gap-y-3.5 border-t border-[var(--line-strong)] pt-8 sm:grid-cols-2">
              {checklist.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[15px] font-medium">
                  <span className="grid h-5 w-5 shrink-0 place-items-center bg-[var(--forest)]">
                    <Check className="h-3 w-3 text-[var(--gold-bright)]" strokeWidth={3} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="tel:9629048171" className="btn btn-primary">
                <Phone className="h-4 w-4 text-[var(--gold-bright)]" />
                <span>Speak with PRATHAP</span>
              </a>
              <Link href="/projects" className="btn btn-outline">
                <span>Browse all layouts</span>
              </Link>
            </div>
          </div>

          {/* Proprietor sheet */}
          <div className="lg:col-span-5">
            <div className="plan-card corners corners-out corners-forest relative p-8 shadow-[10px_10px_0_rgba(15,61,46,0.1)] sm:p-10">
              <span className="f-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--gold)]">
                Proprietor &amp; Property Advisor
              </span>
              <h3 className="f-display mt-3 text-5xl font-medium leading-none tracking-[-0.03em] text-[var(--forest)]">
                PRATHAP
              </h3>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">MKM Properties – Tiruchirappalli, Tamil Nadu</p>

              <dl className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
                <div className="flex items-start gap-4 py-4">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
                  <div>
                    <dt className="f-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">Direct phone</dt>
                    <dd className="mt-1">
                      <a href="tel:9629048171" className="f-mono text-[15px] font-medium text-[var(--forest)] hover:text-[var(--gold)]">
                        +91 96290 48171
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-4 py-4">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
                  <div>
                    <dt className="f-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">Service corridors</dt>
                    <dd className="mt-1 text-[15px] font-medium">Panjappur, K.K. Nagar, Samayapuram, Navalpattu</dd>
                  </div>
                </div>
                <div className="flex items-start gap-4 py-4">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
                  <div>
                    <dt className="f-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">Core commitment</dt>
                    <dd className="mt-1 text-[15px] font-medium">Authentic documents, verified survey stones, zero hidden fees</dd>
                  </div>
                </div>
              </dl>

              <blockquote className="f-display mt-8 text-[1.15rem] italic leading-snug text-[var(--ink)]">
                “Our goal is not just selling land, but helping you invest in a legally safe asset where your family can build and live peacefully.”
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
