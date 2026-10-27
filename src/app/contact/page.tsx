import React from 'react';
import Link from 'next/link';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Car,
  ShieldCheck,
  Building2,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const metadata = {
  title: 'Contact Us · MKM Properties | Trichy Real Estate Advisors',
  description:
    'Contact MKM Properties and Senior Property Advisor PRATHAP in Trichy. Phone, WhatsApp, office address, and business hours.'
};

const WHATSAPP_URL =
  'https://wa.me/919629048171?text=Hello%20PRATHAP,%20I%20would%20like%20to%20discuss%20residential%20plots%20in%20Trichy.';

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFB] text-slate-900">
      {/* Header */}
      <section className="border-b border-slate-200/80 bg-gradient-to-b from-white via-[#F8FAFB] to-[#F1F5F4] py-16 sm:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <span className="eyebrow">Get in Touch</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight mt-3">
              Talk to Our Senior <br />
              <span className="text-[#0B271F]">Property Advisor</span>
            </h1>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Have questions about residential plot locations, legal approvals, or want to schedule an in-person site visit? We are available 7 days a week.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-24 border-b border-slate-200/80 bg-white">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Details Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-slate-200/80 bg-[#F8FAFB] p-8 shadow-sm space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C2922E] font-bold block">
                    Business Entity
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-1">
                    MKM Properties
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Trichy Residential Plots &amp; Property Advisory Services
                  </p>
                </div>

                <div className="border-t border-slate-200/80 pt-5 space-y-5 text-sm">
                  {/* Advisor */}
                  <div className="flex items-start gap-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-[#0B271F]">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-bold">
                        Contact Person
                      </span>
                      <span className="font-bold text-slate-900 text-base">
                        PRATHAP (Senior Property Advisor)
                      </span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-[#0B271F]">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-bold">
                        Direct Phone
                      </span>
                      <a
                        href="tel:9629048171"
                        className="font-mono font-bold text-emerald-800 hover:underline text-base"
                      >
                        +91 96290 48171
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-800">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 block font-bold">
                        WhatsApp Consultation
                      </span>
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-emerald-800 hover:underline"
                      >
                        +91 96290 48171 (Instant Chat)
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-[#0B271F]">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-bold">
                        Official Email
                      </span>
                      <a
                        href="mailto:advisor@mkmproperties.com"
                        className="font-medium text-slate-800 hover:text-[#0B271F]"
                      >
                        advisor@mkmproperties.com
                      </a>
                    </div>
                  </div>

                  {/* Office Address */}
                  <div className="flex items-start gap-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-[#0B271F]">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-bold">
                        Office Location
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        No. 14, Royal Tower, Cantonment / K.K. Nagar Road, Tiruchirappalli – 620001, Tamil Nadu, India
                      </p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start gap-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-[#0B271F]">
                      <Clock className="h-4 w-4" />
                    </span>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-bold">
                        Consultation &amp; Site Visit Hours
                      </span>
                      <p className="text-xs font-semibold text-slate-900 mt-0.5">
                        Monday – Sunday: 8:00 AM – 8:00 PM
                      </p>
                      <span className="text-[11px] text-slate-500 block">
                        (Open on weekends for family site visit inspections)
                      </span>
                    </div>
                  </div>

                  {/* Zero brokerage highlight */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-950">
                    <span className="font-bold block">முகவர் கட்டணம் முற்றிலும் இலவசம்</span>
                    <span className="text-[11px] text-emerald-900 block mt-0.5">
                      Zero brokerage and zero agent fees for all property enquiries and site visits.
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80">
                  <Link href="/#site-visit" className="btn btn-primary w-full justify-center">
                    <Car className="h-4 w-4 text-[#D9A838]" />
                    <span>Book Free Site Visit Cab</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Google Maps Embed & Location Context */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Tiruchirappalli Office Location
                    </h3>
                    <p className="text-xs text-slate-500">
                      Centrally located near Central Bus Stand and Cantonment area
                    </p>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Tiruchirappalli,Tamil+Nadu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm text-xs font-mono"
                  >
                    <span>Open in Maps</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>

                {/* Google Maps iFrame */}
                <div className="w-full h-[360px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 relative">
                  <iframe
                    title="MKM Properties Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125414.17387799516!2d78.61898748737227!3d10.790483329705463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baa149175ecb0ff%3A0x89ec3e37130f1d1!2sTiruchirappalli%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {/* Controlled access note */}
              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFB] p-5 text-xs text-slate-600 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-[#0B271F] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-slate-900">Privacy &amp; Controlled Access Policy:</strong> We respect your privacy. Plot survey sketches and pricing sheets are shared only with authorized and approved clients. We never disclose client phone numbers or enquiry details to third-party telemarketers.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
