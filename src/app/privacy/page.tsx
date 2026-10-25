import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, Phone, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Consent Notice | MKM Properties Trichy',
  description:
    'Our privacy and data consent practices. How MKM Properties – Trichy collects, protects, and handles your contact details for property enquiries.'
};

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b4632] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs space-y-8 text-slate-700 leading-relaxed text-sm">
          <div className="border-b border-slate-200 pb-6 space-y-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#fef9c3] text-[#0b4632] border border-[#fef08a]">
              PRIVACY POLICY & DATA CONSENT NOTICE
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900">
              MKM Properties – Privacy Policy (Version 1.0)
            </h1>
            <p className="text-xs text-slate-500">
              Last updated: October 2026 | Effective for all website visitors & Meta / Instagram enquiry submissions
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Who We Are</h2>
            <p>
              <strong>MKM Properties – Trichy</strong> is a verified real estate property guidance and residential plot marketing firm located in Tiruchirappalli (Trichy), Tamil Nadu, India.
            </p>
            <p>
              <strong>Principal Contact:</strong> PRATHAP<br />
              <strong>Official Phone:</strong> +91 96290 48171<br />
              <strong>Primary Business:</strong> Residential Plots, DTCP-Approved Gated Layouts, and Land Documentation Guidance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Information We Collect</h2>
            <p>
              When you voluntarily submit an enquiry form or request a brochure/site visit through our website or social media ads (Meta / Facebook / Instagram), we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Contact Information:</strong> Full name, mobile phone number, and optional email address.</li>
              <li><strong>Property Requirements:</strong> Preferred layout project, purpose (home construction or investment), budget preference, and timeline.</li>
              <li><strong>Campaign Attribution:</strong> Anonymous UTM parameters (e.g. utm_source, utm_campaign) to gauge advertisement efficacy.</li>
              <li><strong>Consent Timestamp:</strong> Digital proof of consent and timestamp when you submit our contact form.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. How We Use Your Data</h2>
            <p>
              Your contact details are strictly utilized for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Contacting you via direct phone call or WhatsApp to share verified layout brochures, pricing details, and DTCP approval documents.</li>
              <li>Coordinating your requested free site visit cab within Trichy.</li>
              <li>Providing transparent legal guidance and answering specific land queries.</li>
            </ul>
            <p className="font-semibold text-slate-800">
              We DO NOT sell, rent, or lease your contact information to third-party telemarketers or external advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Meta Pixel & Analytics Tracking</h2>
            <p>
              This website employs Meta Pixel and Meta Conversions API (CAPI) to evaluate the effectiveness of our social media advertisements. When sending event data to Meta:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>All personal identifiers (phone numbers and emails) are cryptographically hashed using SHA-256 before transmission.</li>
              <li>Events are strictly limited to standard interaction metrics such as PageView and Lead.</li>
              <li>You may control cookies and tracking preferences through your browser settings or Meta Ad preferences.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Data Retention & Deletion Requests</h2>
            <p>
              Lead records are retained in our secure, encrypted database solely for active customer service and follow-up regarding your property enquiry.
            </p>
            <p>
              If at any point you wish to have your phone number or enquiry removed permanently from our system, you may contact PRATHAP at <strong>9629048171</strong> or request deletion via WhatsApp. All requested records will be purged within 48 business hours.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">6. Security Measures</h2>
            <p>
              We implement industry-standard HTTPS encryption, parameterized database queries, strict rate-limiting against automated spam bots, and password-authenticated admin controls to prevent unauthorized access to customer records.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">7. Contact the Grievance Officer</h2>
            <p>
              For any concerns regarding this privacy notice:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
              <strong>MKM Properties – Trichy</strong><br />
              Attn: PRATHAP<br />
              Mobile: +91 96290 48171<br />
              Tiruchirappalli, Tamil Nadu, India.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
