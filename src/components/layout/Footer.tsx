import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, ArrowUpRight, ShieldCheck, Lock, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[var(--forest-deep)] pb-28 pt-20 text-[#d9dfd6] md:pb-12">
      {/* Giant faint wordmark */}
      <span
        aria-hidden="true"
        className="f-display pointer-events-none absolute -bottom-10 right-[-2vw] -z-10 select-none text-[26vw] font-semibold leading-none tracking-[-0.06em] text-white/[0.035]"
      >
        MKM
      </span>

      <div className="container-x">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand & Advisory Positioning */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="logo-mark f-display">MKM</span>
              <span className="leading-none">
                <span className="f-display block text-2xl font-semibold tracking-[-0.015em] text-white">
                  MKM Properties
                </span>
                <span className="f-mono mt-1.5 block text-[9.5px] uppercase tracking-[0.22em] text-[var(--gold-bright)]">
                  Trichy · Trusted Property Advisors
                </span>
              </span>
            </div>

            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-[#b9c3bb]">
              We help prospective home builders and investors evaluate residential plots with clarity, verified title documentation, and on-ground site inspection before taking any decision.
            </p>

            <div className="f-mono mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[var(--gold-bright)]">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Controlled Access Portal · Verified DTCP Clearances</span>
            </div>
          </div>

          {/* Quick Links (Public) */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h4 className="f-mono mb-5 text-[11px] uppercase tracking-[0.2em] text-[var(--gold-bright)]">
              Navigation
            </h4>
            <ul className="space-y-3 text-[15px]">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Book a Site Visit
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  Who We Are
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="inline-flex items-center gap-1.5 text-[var(--gold-bright)] hover:underline">
                  <Lock className="h-3 w-3" />
                  <span>Approved Client Portal</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-white">
                  Privacy &amp; Data Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Advisor Contact */}
          <div className="lg:col-span-4">
            <h4 className="f-mono mb-5 text-[11px] uppercase tracking-[0.2em] text-[var(--gold-bright)]">
              Direct Advisory
            </h4>
            <div className="space-y-3.5 text-[14px]">
              <div>
                <span className="f-mono block text-[10px] uppercase tracking-[0.18em] text-[#8a978e]">
                  Senior Property Advisor
                </span>
                <span className="f-display text-2xl text-white">PRATHAP</span>
              </div>
              <a
                href="tel:9629048171"
                className="f-mono flex items-center gap-2.5 text-white transition-colors hover:text-[var(--gold-bright)]"
              >
                <Phone className="h-4 w-4 text-[var(--gold-bright)]" />
                <span>+91 96290 48171</span>
              </a>
              <div className="flex items-center gap-2.5 text-[#b9c3bb]">
                <Mail className="h-4 w-4 text-[var(--gold-bright)]" />
                <span>advisor@mkmproperties.com</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#b9c3bb]">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[var(--gold-bright)]" />
                <span>No. 14, Royal Tower, Cantonment / K.K. Nagar Road, Trichy - 620001, Tamil Nadu</span>
              </div>
              <div className="pt-2">
                <Link href="/" className="btn btn-gold btn-sm">
                  <span>Book Free Site Visit Cab</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Advisory principle note */}
        <div className="mt-14 border-t border-white/10 pt-6 text-[12px] leading-relaxed text-[#8a978e]">
          <p>
            <strong className="text-[#b9c3bb]">Advisory Notice:</strong> Complete project catalogs, plot dimensions, DTCP layout blueprints, and promoter price sheets are reserved exclusively for verified and approved clients to ensure privacy, accurate site coordination, and direct relationship integrity.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="f-mono mt-6 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.12em] text-[#6f7d74] sm:flex-row sm:items-center">
          <p>© 2026 MKM Properties · Tiruchirappalli</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="/login" className="transition-colors hover:text-white">Client Login</Link>
            <Link href="/admin/login" className="transition-colors hover:text-white">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
