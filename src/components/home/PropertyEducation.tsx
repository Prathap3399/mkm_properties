'use client';

import React, { useState } from 'react';
import { Plus, Minus, Phone } from 'lucide-react';

interface GuideItem {
  id: string;
  title: string;
  tamilTitle: string;
  summary: string;
  detailedPoints: string[];
}

const guideTopics: GuideItem[] = [
  {
    id: 'dtcp',
    title: 'What is DTCP Approval?',
    tamilTitle: 'DTCP அங்கீகாரம் என்றால் என்ன?',
    summary:
      'Directorate of Town and Country Planning approval confirms that the layout follows government planning regulations.',
    detailedPoints: [
      'Ensures layout roads (minimum 30ft or 40ft) and Open Space Reservation (OSR) parks are legally gifted to the local body via registered gift deed.',
      'Mandatory for obtaining residential building plan permissions and municipal water/drainage connections in Trichy.',
      'Protects buyers against unapproved layout regularisation penalties or future road-widening acquisition risks.'
    ]
  },
  {
    id: 'rera',
    title: 'What is RERA Registration?',
    tamilTitle: 'RERA பதிவு ஏன் முக்கியம்?',
    summary:
      'Tamil Nadu Real Estate Regulatory Authority (TNRERA) registration protects property buyers against layout deviations.',
    detailedPoints: [
      'Applicable to residential layouts exceeding 8 plots or 500 sq. meters developed for public sale.',
      'Promoters must upload approved layout plans, title deeds, and development timelines to the official TNRERA portal.',
      'Guarantees that promoters cannot alter road dimensions, plot numbers, or layout boundaries after customer booking.'
    ]
  },
  {
    id: 'patta-chitta',
    title: 'What are Patta and Chitta?',
    tamilTitle: 'பட்டா & சிட்டா ஆவணங்களின் முக்கியத்துவம்',
    summary:
      'Official revenue department records proving lawful land ownership and government survey registration.',
    detailedPoints: [
      'Patta is the legal revenue document issued by the Tahsildar establishing the rightful owner of the land parcel.',
      'Chitta contains details of the land classification (e.g. Nanjai, Punjai, or Natham residential settlement) and property tax assessment.',
      'Before purchasing, verify that parent patta exists and that individual subdivision patta transfer will be executed upon registration.'
    ]
  },
  {
    id: 'guideline-value',
    title: 'Guideline Value vs. Market Price',
    tamilTitle: 'வழிகாட்டி மதிப்பு மற்றும் சந்தை விலை',
    summary:
      'Understanding the distinction between government valuation rates and realistic corridor market pricing.',
    detailedPoints: [
      'Guideline Value is the minimum rate determined by the Tamil Nadu Registration Department for calculating stamp duty and registration fees.',
      'Market Value reflects actual demand, surrounding infrastructure, arterial road frontage, proximity to bus terminals or IT hubs, and physical amenities.',
      'A fair transaction maintains transparent pricing without hidden brokerage fees or surprise development levies.'
    ]
  },
  {
    id: 'site-visit-checklist',
    title: 'What to Check During a Site Visit?',
    tamilTitle: 'மனையிடப் பார்வையில் கவனிக்க வேண்டியவை',
    summary:
      'Crucial on-ground physical parameters to inspect with your family before committing to a plot.',
    detailedPoints: [
      'Physical Road Width: Measure the approach road and internal layout lanes (30ft or 40ft) with a measuring tape.',
      'Boundary Demarcation: Confirm permanent survey stones with plot numbers are installed at all four corners.',
      'Groundwater Reality: Test neighboring borewells or wells for water taste, potability, and seasonal water table depth.',
      'High-Tension Power Lines & Drainage: Verify no overhead HT electrical cables cross the plot and that rainwater drains naturally.'
    ]
  }
];

export default function PropertyEducation() {
  const [expandedId, setExpandedId] = useState<string | null>('dtcp');

  const toggleItem = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="guide" className="relative border-y border-[var(--line)] bg-[var(--card)] py-20 sm:py-28">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: intro (sticky) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <span className="eyebrow">04 · Buyer’s Guide</span>
              <h2 className="h-section mt-5">
                How to safely buy a <em>plot</em> in Trichy
              </h2>
              <p className="tamil mt-4 text-base font-medium text-[var(--forest)]">
                திருச்சியில் நிலம் வாங்குமுன் கவனிக்க வேண்டிய சட்ட வழிகாட்டுதல்கள்
              </p>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--ink-soft)]">
                Every plot promoted by MKM Properties is backed by verified legal scrutiny. Here are the essential property principles every family should know.
              </p>

              {/* Doubt card */}
              <div className="on-dark relative mt-10 overflow-hidden bg-[var(--forest)] p-7 text-[#f3ecd6]">
                <div aria-hidden="true" className="bg-contours-light absolute inset-0 opacity-70" />
                <div className="relative">
                  <span className="f-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--gold-bright)]">
                    Personal verification
                  </span>
                  <h3 className="f-display mt-3 text-2xl font-medium leading-tight text-white">
                    Have a document doubt?
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#c3cfc6]">
                    Send your layout queries or schedule a free document inspection with PRATHAP. We review Encumbrance Certificates (EC), parent title chains, and layout approvals with total transparency.
                  </p>
                  <a href="tel:9629048171" className="btn btn-gold btn-sm mt-6">
                    <Phone className="h-4 w-4" />
                    <span>Call PRATHAP — 9629048171</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: accordion */}
          <div className="lg:col-span-7">
            <div className="border-t-2 border-[var(--ink)]">
              {guideTopics.map((topic, i) => {
                const isExpanded = expandedId === topic.id;
                return (
                  <div key={topic.id} className="border-b border-[var(--line-strong)]">
                    <button
                      type="button"
                      onClick={() => toggleItem(topic.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`guide-panel-${topic.id}`}
                      className="group flex w-full items-start gap-4 py-7 text-left cursor-pointer sm:gap-6"
                    >
                      <span className="f-mono w-7 shrink-0 pt-2 text-xs text-[var(--gold)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="tamil block text-xs font-medium text-[var(--gold)]">{topic.tamilTitle}</span>
                        <span className="f-display mt-1 block text-[1.55rem] font-medium leading-tight tracking-[-0.015em] sm:text-[1.8rem]">
                          {topic.title}
                        </span>
                        <span className="mt-2.5 block max-w-xl text-[15px] leading-relaxed text-[var(--ink-soft)]">
                          {topic.summary}
                        </span>
                      </span>

                      <span
                        className={`mt-1 grid h-9 w-9 shrink-0 place-items-center border transition-colors ${
                          isExpanded
                            ? 'border-[var(--forest)] bg-[var(--forest)] text-[var(--gold-soft)]'
                            : 'border-[var(--ink)] text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)]'
                        }`}
                      >
                        {isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </button>

                    {isExpanded && (
                      <ul
                        id={`guide-panel-${topic.id}`}
                        className="rise space-y-3.5 pb-8 pl-11 pr-2 sm:pl-[3.25rem]"
                      >
                        {topic.detailedPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3.5 text-[15px] leading-relaxed text-[var(--ink)]/85">
                            <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--gold)]" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
