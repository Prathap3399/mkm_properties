import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  Compass,
  Building,
  CheckCircle2,
  FileText,
  HelpCircle,
  Car,
  Phone,
  ArrowRight
} from 'lucide-react';

export const metadata = {
  title: 'Property Guidance & Due-Diligence Guide · MKM Properties | Trichy',
  description:
    'Comprehensive buyer guide on evaluating residential plots in Trichy. Understand DTCP vs Panchayath approval, RERA verification, parent documents, road widths, and registration process.'
};

const GUIDES = [
  {
    id: 'how-to-evaluate',
    title: '1. How to Evaluate a Residential Plot in Trichy',
    summary: 'A structured framework to assess orientation, topography, elevation during monsoons, and potable groundwater table before making any deposit.',
    bullets: [
      'Direction & Vastu: North and East facing plots command higher demand and resale velocity.',
      'Plot Dimensions & Frontage: Ensure adequate frontage (minimum 30ft width) for comfortable car parking and building facade design.',
      'Groundwater Depth: Check nearby open wells or borewells. In Trichy corridors like Manikandam and Navalpattu, sweet potable water is typically available at 80–120ft.',
      'Monsoon Waterlogging: Verify site elevation relative to road crown level to prevent storm runoff ingress.'
    ]
  },
  {
    id: 'dtcp-vs-panchayath',
    title: '2. Understanding DTCP Approval vs. Unapproved / Panchayath Layouts',
    summary: 'Why buying an unapproved or simple panchayath-signed plot carries high legal risk in Tamil Nadu.',
    bullets: [
      'What is DTCP? Directorate of Town and Country Planning (DTCP) approval ensures that layout roads, open spaces (OSR), and park reserves are legally dedicated to local bodies via gift deeds.',
      'Panchayath Approval Myth: Local village panchayath presidents do NOT have the statutory authority to approve layout subdivisions without DTCP sanction.',
      'Bank Loan Eligibility: Nationalized banks (SBI, Canara, HDFC) strictly disburse construction loans only for registered DTCP/RERA sanctioned plots.',
      'Building Plan Sanction: You cannot obtain municipal or panchayath building plan approval for a house without a valid DTCP layout sanction number.'
    ]
  },
  {
    id: 'rera-protection',
    title: '3. Understanding RERA Registration & Buyer Safeguards',
    summary: 'How TNRERA (Tamil Nadu Real Estate Regulatory Authority) shields buyers from promoter misrepresentation.',
    bullets: [
      'Layout Disclosure: Promoters must publish sanctioned drawing numbers, surveyed area extent, and boundary coordinates on the official TNRERA portal.',
      'Time-Bound Infrastructure: Developers are held accountable for completing tar roads, street lights, storm drains, and avenue plantation as promised.',
      'Verification Checklist: Always ask for the TNRERA registration certificate number and cross-verify on rera.tn.gov.in before signing agreements.'
    ]
  },
  {
    id: 'documents-checklist',
    title: '4. Essential 12 Legal Documents to Verify Before Purchase',
    summary: 'Complete due-diligence document checklist required for indisputable clear title ownership.',
    bullets: [
      '1. Parent Documents: Title deeds tracing chain of ownership for a minimum unbroken period of 30 years.',
      '2. Encumbrance Certificate (EC): Nil encumbrance certificate for 30 years from the Sub-Registrar Office (SRO).',
      '3. Revenue Patta: Computerized Patta issued in the name of the current promoter/owner.',
      '4. Chitta & Adangal extracts confirming land classification (Nanjai/Punjai conversion to non-agricultural residential use).',
      '5. DTCP Approval Order & Sanctioned Blueprint Drawing.',
      '6. Local Body Resolution / Gift Deed for Roads & OSR park areas.',
      '7. FMB (Field Measurement Book) sketch showing exact survey field boundaries.'
    ]
  },
  {
    id: 'road-access-connectivity',
    title: '5. Road Widths & Future Infrastructure Impact',
    summary: 'How road widths directly dictate building permissions and long-term resale appreciation.',
    bullets: [
      'Minimum 30ft Roads: Building rules in Tamil Nadu require minimum 30ft (9.14m) wide access roads for standard residential ground + 2 floor structures.',
      '40ft Main Spine Roads: Layouts with 40ft main arteries accommodate heavy vehicles, school buses, and allow seamless two-way vehicle movement.',
      'Future Connectivity: Check proximity to upcoming infrastructure (e.g. Panjappur New Bus Terminal, Semi-Ring Road corridor, Trichy Airport expansion).'
    ]
  },
  {
    id: 'registration-process',
    title: '6. Registration Process & Stamp Duty in Tamil Nadu (2026)',
    summary: 'Understanding government guideline values, stamp duty rates, and registration expenses.',
    bullets: [
      'Stamp Duty: 7% on the market value / guideline value of the property.',
      'Registration Fee: 2% (reduced under recent Tamil Nadu rationalization initiatives for direct land registrations).',
      'Guideline Value Check: Verify the government guideline value per square foot on the official TNREGINET portal to plan registration funds accurately.',
      'Spot Registration: Ensure the promoter provides spot registration with original sale deed collection on the same day at the SRO.'
    ]
  },
  {
    id: 'common-mistakes',
    title: '7. Top Common Mistakes Land Buyers Must Avoid',
    summary: 'Critical traps that cost unwary property buyers time, money, and emotional peace.',
    bullets: [
      'Rushing based on verbal promises: Never pay an advance without physically holding a copy of the DTCP approval order and 30-year EC.',
      'Ignoring boundary stones: Always verify that physical boundary markers match the exact survey numbers in the FMB sketch.',
      'Overlooking high-tension power lines or water channels: Ensure the plot has statutory clearances from electrical transformers and natural drainage channels.',
      'Trusting third-party middlemen: Deal directly with authorized promoters and verified advisors to avoid speculative broker markups.'
    ]
  }
];

export const instant = false;

export default function PropertyGuidancePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)] py-12 sm:py-16">
      <div className="container-x space-y-12">
        {/* Header */}
        <div className="border-b border-[var(--line-strong)] pb-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--forest)]/20 bg-white/60 px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--forest)] mb-4">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span>Buyer Due Diligence · Trichy</span>
          </div>

          <h1 className="f-display text-3xl sm:text-5xl font-extrabold text-[var(--ink)] leading-tight">
            Residential Land <em className="text-[var(--forest)] font-serif">Buyer Guidance</em>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[var(--ink-soft)] leading-relaxed">
            Our consultative commitment to client clarity. We have documented everything you need to know about DTCP sanctions, legal due diligence, ground inspection, and Tamil Nadu registration laws.
          </p>
        </div>

        {/* Guidance Articles Grid */}
        <div className="space-y-8">
          {GUIDES.map((guide) => (
            <div
              key={guide.id}
              className="rounded-2xl border border-[var(--line-strong)] bg-[var(--card)] p-6 sm:p-8 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="f-display text-xl sm:text-2xl font-bold text-[var(--ink)] leading-snug">
                  {guide.title}
                </h2>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--gold)] shrink-0 mt-1">
                  Verified Guide
                </span>
              </div>

              <p className="text-sm font-medium text-[var(--forest)] leading-relaxed">
                {guide.summary}
              </p>

              <div className="border-t border-[var(--line)] pt-4">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[var(--ink)]">
                  {guide.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[var(--paper)]">
                      <CheckCircle2 className="h-4 w-4 text-[var(--forest)] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Consult Advisor CTA */}
        <div className="rounded-2xl border border-[var(--line-strong)] bg-white p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="f-display text-xl font-bold text-[var(--ink)]">
              Need personal clarification on legal documents?
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-soft)] mt-1">
              Speak directly with PRATHAP. We will review parent deeds, ECs, or sanction plans with you with total transparency.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a href="tel:9629048171" className="btn btn-primary btn-sm">
              <Phone className="h-3.5 w-3.5 text-[var(--gold-bright)]" />
              <span>Talk to Advisor: 96290 48171</span>
            </a>
            <Link href="/documents" className="btn btn-outline btn-sm">
              <FileCheck2 className="h-3.5 w-3.5 text-[var(--forest)]" />
              <span>Download Documents</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
