import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, ShieldCheck, Mail, MessageSquare, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const WHATSAPP_URL =
  'https://wa.me/919629048171?text=Hello%20MKM%20Properties,%20I%20would%20like%20to%20know%20more%20about%20residential%20plots%20in%20Trichy.';

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#071B15] text-slate-300 pt-20 pb-28 md:pb-14 border-t border-emerald-950">
      {/* Background Texture & Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl"
      />

      <div className="container-x relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand & Value Statement */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B271F] to-[#04100C] text-[#D9A838] font-bold text-base ring-1 ring-amber-400/30">
                MKM
              </div>
              <div>
                <span className="block text-xl font-bold tracking-tight text-white leading-tight">
                  MKM Properties
                </span>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#D9A838]">
                  Tiruchirappalli • Trusted Advisors
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-300 max-w-sm">
              We guide prospective homebuyers and investors to evaluate residential plots in Trichy with transparency, statutory DTCP/RERA verification, and complimentary on-ground site visits.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-[#D9A838] font-medium">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#D9A838]" />
                <span>Verified DTCP &amp; RERA Sanctioned Layouts</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>முகவர் கட்டணம் முற்றிலும் இலவசம் • Zero Brokerage</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D9A838] mb-5">
              Platform
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/#site-visit" className="text-slate-300 hover:text-white transition-colors">
                  Book Site Visit
                </Link>
              </li>
              <li>
                <Link href="/#why-us" className="text-slate-300 hover:text-white transition-colors">
                  Why Choose Us
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                  About MKM
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Contact Advisor
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Prime Corridors */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D9A838] mb-5">
              Trichy Corridors
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A838]" />
                <span>Panjappur (New Bus Terminal Belt)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A838]" />
                <span>K.K. Nagar Extension / Manikandam</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A838]" />
                <span>Samayapuram / NH-45 Highway</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A838]" />
                <span>Navalpattu (ELCOT IT Park Road)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A838]" />
                <span>Thiruverumbur / BHEL Corridor</span>
              </li>
            </ul>
          </div>

          {/* Direct Advisor Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D9A838] mb-5">
              Direct Advisory
            </h4>
            <div className="space-y-3.5 text-sm">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Senior Property Advisor
                </span>
                <span className="text-lg font-bold text-white">PRATHAP</span>
              </div>

              <a
                href="tel:9629048171"
                className="flex items-center gap-2.5 text-white hover:text-[#D9A838] transition-colors font-mono font-semibold"
              >
                <Phone className="h-4 w-4 text-[#D9A838]" />
                <span>+91 96290 48171</span>
              </a>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span>Instant WhatsApp Chat</span>
              </a>

              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="h-4 w-4 text-[#D9A838] shrink-0" />
                <span className="text-xs">advisor@mkmproperties.com</span>
              </div>

              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="h-4 w-4 text-[#D9A838] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  No. 14, Royal Tower, Cantonment / K.K. Nagar Road, Trichy – 620001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-14 pt-8 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
          <p>
            <strong>Regulatory &amp; Legal Notice:</strong> MKM Properties provides property guidance and direct developer coordination in Tiruchirappalli. DTCP (Directorate of Town and Country Planning) and RERA (Real Estate Regulatory Authority) approval status, along with bank loan financing eligibility, are strictly verified and disclosed on a project-by-project basis. Customers pay zero brokerage.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <p>© 2026 MKM Properties. All rights reserved. Tiruchirappalli, Tamil Nadu.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/admin/login" className="hover:text-white transition-colors">
              Advisor Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
