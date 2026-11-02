import React from 'react';
import Link from 'next/link';
import { FileCheck2, BadgePercent, Car, Award, ArrowUpRight } from 'lucide-react';

const promises = [
  {
    icon: FileCheck2,
    title: 'Verified Legal Titles',
    text: 'Prior parent title deeds, 30-year Encumbrance Certificates (EC), and DTCP approvals are thoroughly verified before any listing is offered.'
  },
  {
    icon: BadgePercent,
    title: 'Direct Promoter Rates',
    text: 'Zero middleman commissions and zero hidden administrative costs. Transparent pricing based strictly on verified market valuations.'
  },
  {
    icon: Car,
    title: 'Free Site Visit Cab',
    text: 'We arrange private round-trip cab pickup anywhere in Trichy so you and your family can inspect plots with complete peace of mind.'
  },
  {
    icon: Award,
    title: 'Bank Loans & Registration',
    text: 'End-to-end guidance including bank loan approval assistance, physical boundary stone demarcation, and registration support.'
  }
];

const verifiedCorridors = [
  {
    name: 'Near SIT College, Ariyamangalam',
    highlight: 'Tanjore Main Road Corridor',
    description: 'Centrally positioned near Seshasayee Institute of Technology (SIT), Ariyamangalam with immediate city connectivity and rapid appreciation.',
    projectLink: '/#site-visit',
    projectName: 'Ariyamangalam Prime Plots'
  },
  {
    name: 'Near MIET College, Trichy',
    highlight: 'Trichy–Pudukkottai Highway Axis',
    description: 'Prominent educational and residential axis near MIET Institutions with wide road connectivity, sweet groundwater, and serene surroundings.',
    projectLink: '/#site-visit',
    projectName: 'MIET Corridor Enclave'
  },
  {
    name: 'Trichy–Madurai National Highway',
    highlight: 'Near Panjappur Integrated Bus Terminal',
    description: 'High-momentum investment zone situated along the Madurai NH, moments from the mega Panjappur Bus Terminal and Olympic Sports City.',
    projectLink: '/#site-visit',
    projectName: 'Panjappur Highway Plots'
  },
  {
    name: 'NRC for Banana (Othakkadai)',
    highlight: 'Podhavur / Othakkadai Belt',
    description: 'Lush agricultural and residential green zone adjacent to National Research Centre for Banana, offering fresh air, copious water, and peaceful living.',
    projectLink: '/#site-visit',
    projectName: 'Othakkadai Green Acres'
  },
  {
    name: 'Commercial Land near Samayapuram',
    highlight: '18,000 sq. ft. Highway Commercial Property',
    description: 'High-visibility 18,000 sq.ft commercial asset right off NH-45 Highway near Samayapuram, ideal for institutions, warehouses, commercial complexes, or investments.',
    projectLink: '/#site-visit',
    projectName: '18,000 Sq.Ft Commercial Property'
  },
  {
    name: 'Near Thiran Nagar',
    highlight: 'Trichy–Dindigul National Highway',
    description: 'Prime fast-growing residential corridor along the Trichy–Dindigul 4-lane highway with seamless transit to central Trichy and upcoming infra.',
    projectLink: '/#site-visit',
    projectName: 'Thiran Nagar Highway Plots'
  }
];

export default function WhyChooseSection() {
  return (
    <section id="why-us" className="relative py-20 sm:py-28">
      <div className="container-x space-y-24 sm:space-y-32">
        {/* ---------- Promises ---------- */}
        <div>
          <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="eyebrow">03 · Our Promise</span>
              <h2 className="h-section mt-5">
                Why buyers &amp; investors choose <em>MKM Properties</em>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-10">
              <p className="tamil text-base font-medium text-[var(--forest)]">
                நம்பகமான மனைத் தேர்வுக்கான உறுதியான வழிகாட்டுதல்
              </p>
              <p className="mt-3 text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
                We prioritize complete documentation clarity and direct promoter rates, avoiding artificial markups or pushy sales pressure.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="border-t-2 border-[var(--ink)] pt-6">
                <div className="flex items-start justify-between">
                  <span className="f-display text-5xl font-light leading-none text-[var(--gold)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Icon className="h-6 w-6 text-[var(--forest)]" strokeWidth={1.5} />
                </div>
                <h3 className="f-display mt-8 text-2xl font-medium leading-tight tracking-[-0.01em]">{title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-soft)]">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Corridor index ---------- */}
        <div>
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="eyebrow">Strategic Growth Corridors</span>
              <h3 className="h-section mt-5 !text-[clamp(1.9rem,3.8vw,3rem)]">
                Prime residential <em>locations</em> in Trichy
              </h3>
              <p className="mt-4 max-w-xl text-base text-[var(--ink-soft)]">
                Explore high-growth corridors where our verified residential layouts are situated.
              </p>
            </div>
            <Link href="/projects" className="btn btn-outline shrink-0 self-start md:self-auto">
              <span>Explore all corridors</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <ol className="border-b border-[var(--line-strong)]">
            {verifiedCorridors.map((corridor, idx) => (
              <li
                key={corridor.name}
                className="group grid grid-cols-12 items-baseline gap-x-6 gap-y-3 border-t border-[var(--line-strong)] px-1 py-7 transition-colors hover:bg-[var(--paper-2)] sm:px-3"
              >
                <span className="f-mono col-span-2 text-xs text-[var(--gold)] sm:col-span-1">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <div className="col-span-10 sm:col-span-4">
                  <h4 className="f-display text-[1.65rem] font-medium leading-tight tracking-[-0.015em]">{corridor.name}</h4>
                  <span className="f-mono mt-1.5 block text-[10.5px] uppercase tracking-[0.14em] text-[var(--forest)]">
                    {corridor.highlight}
                  </span>
                </div>

                <p className="col-span-12 text-[15px] leading-relaxed text-[var(--ink-soft)] sm:col-span-4 sm:col-start-6 lg:col-span-4">
                  {corridor.description}
                </p>

                <Link
                  href={corridor.projectLink}
                  className="col-span-12 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--forest)] sm:col-span-3 sm:justify-end lg:col-span-3"
                >
                  <span className="border-b border-transparent transition-colors group-hover:border-[var(--forest)]">
                    {corridor.projectName}
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
