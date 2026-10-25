import React from 'react';

const corridors = [
  'Panjappur · New Bus Terminal',
  'K.K. Nagar Extension',
  'Samayapuram NH-45',
  'Navalpattu IT Park Road',
  'Thiruverumbur & BHEL'
];

export default function CorridorTicker() {
  return (
    <div
      className="marquee overflow-hidden bg-[var(--gold-bright)] py-3.5 text-[var(--forest-deep)]"
      aria-label="Trichy corridors we serve"
      role="region"
    >
      <div className="marquee-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {corridors.map((name) => (
              <li
                key={`${copy}-${name}`}
                className="f-mono flex items-center whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.2em]"
              >
                <span>{name}</span>
                <span className="mx-8 inline-block h-1.5 w-1.5 rotate-45 bg-current" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
