import React from 'react';
import Link from 'next/link';
import { requireApprovedUser } from '@/lib/auth/session';
import { getUserById, getEnquiryById, getFollowUps } from '@/lib/db/repository';
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Car,
  FileCheck2,
  LogOut,
  Building2,
  CheckCircle2
} from 'lucide-react';

export const metadata = {
  title: 'Client Profile · MKM Properties | Account Details',
  description: 'View your account credentials, site visit inspection status, and dedicated advisor contacts.'
};

export const instant = false;

export default async function ProfilePage() {
  const session = await requireApprovedUser('/login?unauthorized=true&from=/profile');
  const user = await getUserById(session.id);

  let linkedEnquiry = null;
  let followUps: any[] = [];
  if (user?.enquiryId) {
    linkedEnquiry = await getEnquiryById(user.enquiryId);
    followUps = await getFollowUps(user.enquiryId);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)] py-12 sm:py-16">
      <div className="container-x max-w-4xl space-y-10">
        {/* Profile Header */}
        <div className="rounded-2xl border border-[var(--line-strong)] bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[var(--paper-2)] border-2 border-[var(--forest)] text-[var(--forest)] font-serif text-2xl font-bold">
              {session.name ? session.name.slice(0, 2).toUpperCase() : 'CL'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="f-display text-2xl font-bold text-[var(--ink)]">
                  {session.name}
                </h1>
                <span className="badge badge-sm bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded text-[11px]">
                  APPROVED CLIENT
                </span>
              </div>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                Authorized for proprietary layout blueprints, DTCP approvals &amp; price sheets
              </p>
            </div>
          </div>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="btn btn-outline btn-sm font-mono text-xs cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>

        {/* Account Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--card)] p-6 shadow-xs space-y-4">
            <h3 className="f-display text-lg font-bold text-[var(--ink)] border-b border-[var(--line)] pb-3">
              Account Information
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-soft)] block">
                  Registered Email
                </span>
                <span className="font-semibold text-[var(--ink)] text-sm">{session.email}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-soft)] block">
                  Mobile Number
                </span>
                <span className="font-semibold text-[var(--ink)] text-sm">{session.phone || 'Recorded on enquiry'}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-soft)] block">
                  Access Level
                </span>
                <span className="font-semibold text-emerald-800">
                  Full Customer Portal (Projects, Documents &amp; Guidance)
                </span>
              </div>
            </div>
          </div>

          {/* Dedicated Advisor Card */}
          <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--card)] p-6 shadow-xs space-y-4">
            <h3 className="f-display text-lg font-bold text-[var(--ink)] border-b border-[var(--line)] pb-3">
              Your Senior Property Advisor
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-soft)] block">
                  Assigned Advisor
                </span>
                <span className="font-bold text-[var(--ink)] text-sm">PRATHAP</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-soft)] block">
                  Direct Contact
                </span>
                <a
                  href="tel:9629048171"
                  className="font-mono font-bold text-[var(--forest)] hover:underline text-sm block mt-0.5"
                >
                  +91 96290 48171
                </a>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-soft)] block">
                  WhatsApp Support
                </span>
                <a
                  href="https://wa.me/919629048171"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-emerald-800 hover:underline"
                >
                  Chat with PRATHAP on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Site Visit Enquiry Status */}
        {linkedEnquiry ? (
          <div className="rounded-2xl border border-[var(--line-strong)] bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--gold)] font-bold">
                  Site Visit Request
                </span>
                <h3 className="f-display text-xl font-bold text-[var(--ink)] mt-0.5">
                  Your Enquiry #{linkedEnquiry.id.slice(0, 8)}
                </h3>
              </div>
              <span className="badge badge-sm bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded">
                STATUS: {linkedEnquiry.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-soft)] block">
                  Preferred Location
                </span>
                <span className="font-bold text-[var(--ink)]">{linkedEnquiry.preferredLocation || 'Any Trichy Corridor'}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-soft)] block">
                  Purpose
                </span>
                <span className="font-bold text-[var(--ink)]">{linkedEnquiry.purpose}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-soft)] block">
                  Preferred Date
                </span>
                <span className="font-bold text-[var(--ink)]">{linkedEnquiry.preferredVisitDate || 'Coordinated via Call'}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-soft)] block">
                  Target Budget
                </span>
                <span className="font-bold text-[var(--ink)]">{linkedEnquiry.budget || 'Standard Range'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--line-strong)] bg-white p-6 shadow-xs flex items-center justify-between gap-4">
            <div>
              <h4 className="f-display text-base font-bold text-[var(--ink)]">
                Ready to coordinate your on-ground plot inspection?
              </h4>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                Book a free round-trip cab to evaluate our layouts in person with our property advisor.
              </p>
            </div>
            <Link href="/#site-visit" className="btn btn-primary btn-sm shrink-0">
              <Car className="h-4 w-4 text-[var(--gold-bright)]" />
              <span>Book Site Visit</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
