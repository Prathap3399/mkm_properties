import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, CalendarCheck } from 'lucide-react';

export default function ClosingContactSection() {
  return (
    <section
      id="contact"
      className="on-dark relative isolate overflow-hidden bg-[var(--forest)] py-24 text-[#f3ecd6] sm:py-32"
    >
      <div aria-hidden="true" className="bg-contours-light absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="absolute -left-24 bottom-[-12rem] -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,rgba(220,174,66,0.22),transparent)]"
      />

      <div className="container-x">
        <div className="max-w-4xl">
          <span className="eyebrow">Direct Assistance</span>

          <h2 className="display on-dark mt-6 text-[clamp(2.6rem,6.4vw,5.2rem)] text-white">
            Looking for a plot <em>in Trichy?</em>
          </h2>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-[#c3cfc6] sm:text-lg">
            Share your requirements. We will help you explore suitable property options with verified documentation and direct promoter pricing.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <a href="tel:9629048171" className="btn btn-gold">
              <Phone className="h-4 w-4" />
              <span>Call PRATHAP</span>
            </a>

            <a
              href="https://wa.me/919629048171?text=Hello%20PRATHAP,%20I%20am%20looking%20for%20a%20plot%20in%20Trichy.%20Please%20guide%20me."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
            >
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp Us</span>
            </a>

            <Link href="/enquiry" className="btn btn-outline-light">
              <CalendarCheck className="h-4 w-4" />
              <span>Request a Site Visit</span>
            </Link>
          </div>

          <p className="f-mono mt-10 border-t border-white/15 pt-6 text-[12px] uppercase tracking-[0.14em] text-[#9fb0a5]">
            Phone{' '}
            <a href="tel:9629048171" className="text-white underline decoration-[var(--gold-bright)] underline-offset-4">
              9629048171
            </a>{' '}
            · Tiruchirappalli, Tamil Nadu
          </p>
        </div>
      </div>
    </section>
  );
}
