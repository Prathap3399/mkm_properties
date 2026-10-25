import React from 'react';
import Link from 'next/link';
import { requireApprovedUser } from '@/lib/auth/session';
import { getAllProjects, getAllDocuments, getFollowUps, getEnquiries } from '@/lib/db/repository';
import {
  ShieldCheck,
  Building2,
  FolderDown,
  BookOpen,
  Phone,
  MessageSquare,
  Car,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  MapPin,
  Calendar
} from 'lucide-react';
import ProjectCard from '@/components/projects/ProjectCard';

export const metadata = {
  title: 'Client Dashboard · MKM Properties | Approved Access',
  description: 'Personalized customer portal for approved clients. View verified residential plots, download layout blueprints, and coordinate site visits.'
};

export const instant = false;

export default async function DashboardPage() {
  // Enforce strict backend server-side authorization!
  const session = await requireApprovedUser('/login?unauthorized=true');

  const projects = await getAllProjects({ publishedOnly: true });
  const documents = await getAllDocuments();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)] py-10 sm:py-14">
      <div className="container-x space-y-10">
        {/* Welcome Banner */}
        <div className="rounded-2xl border border-[var(--line-strong)] bg-white p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-900">
              <ShieldCheck className="h-4 w-4 text-[var(--forest)]" />
              <span>APPROVED CLIENT PORTAL ACCESS</span>
            </div>
            <h1 className="f-display text-2xl sm:text-3xl font-extrabold text-[var(--ink)]">
              Welcome, {session.name}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-soft)]">
              Your account is authorized to review proprietary project blueprints, road dimensions, DTCP approvals, and direct promoter pricing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/projects" className="btn btn-primary btn-sm">
              <Building2 className="h-3.5 w-3.5 text-[var(--gold-bright)]" />
              <span>Browse Projects</span>
            </Link>
            <Link href="/documents" className="btn btn-outline btn-sm">
              <FolderDown className="h-3.5 w-3.5 text-[var(--forest)]" />
              <span>Download Documents</span>
            </Link>
          </div>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="rounded-xl border border-[var(--line-strong)] bg-[var(--card)] p-5 shadow-xs">
            <div className="flex items-center justify-between text-[var(--forest)]">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--ink-soft)]">
                Available Projects
              </span>
              <Building2 className="h-4 w-4" />
            </div>
            <div className="f-display mt-2 text-3xl font-bold text-[var(--ink)]">
              {projects.length}
            </div>
            <div className="text-[11px] text-[var(--ink-soft)] mt-1">
              Prime DTCP layouts in Trichy
            </div>
          </div>

          <div className="rounded-xl border border-[var(--line-strong)] bg-[var(--card)] p-5 shadow-xs">
            <div className="flex items-center justify-between text-[var(--forest)]">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--ink-soft)]">
                Protected Documents
              </span>
              <FolderDown className="h-4 w-4" />
            </div>
            <div className="f-display mt-2 text-3xl font-bold text-[var(--ink)]">
              {documents.length}
            </div>
            <div className="text-[11px] text-[var(--ink-soft)] mt-1">
              Brochures, plans &amp; price sheets
            </div>
          </div>

          <div className="rounded-xl border border-[var(--line-strong)] bg-[var(--card)] p-5 shadow-xs">
            <div className="flex items-center justify-between text-[var(--forest)]">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--ink-soft)]">
                Approval Status
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="f-display mt-2 text-3xl font-bold text-emerald-700">
              100%
            </div>
            <div className="text-[11px] text-[var(--ink-soft)] mt-1">
              Verified government sanctions
            </div>
          </div>

          <div className="rounded-xl border border-[var(--line-strong)] bg-[var(--card)] p-5 shadow-xs">
            <div className="flex items-center justify-between text-[var(--forest)]">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--ink-soft)]">
                Dedicated Advisor
              </span>
              <Phone className="h-4 w-4" />
            </div>
            <div className="f-display mt-2 text-xl font-bold text-[var(--ink)]">
              PRATHAP
            </div>
            <a
              href="tel:9629048171"
              className="text-[11px] font-mono text-[var(--forest)] font-semibold hover:underline block mt-1"
            >
              +91 96290 48171
            </a>
          </div>
        </div>

        {/* Recommended Projects Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="eyebrow">Authorized Portfolio</span>
              <h2 className="f-display mt-1 text-2xl font-bold text-[var(--ink)]">
                Recommended Residential Layouts
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-xs font-mono font-bold text-[var(--forest)] hover:underline inline-flex items-center gap-1"
            >
              <span>View all layouts</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Quick Documents & Guidance Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Documents Widget */}
          <div className="rounded-2xl border border-[var(--line-strong)] bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <FolderDown className="h-5 w-5 text-[var(--forest)]" />
                <h3 className="f-display text-lg font-bold text-[var(--ink)]">
                  Latest Protected Documents
                </h3>
              </div>
              <Link
                href="/documents"
                className="text-xs font-mono text-[var(--forest)] hover:underline"
              >
                View Library
              </Link>
            </div>

            <ul className="space-y-3">
              {documents.slice(0, 4).map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-[var(--line)] bg-[var(--paper)] text-xs"
                >
                  <div>
                    <span className="font-bold text-[var(--ink)] block">{doc.title}</span>
                    <span className="text-[11px] text-[var(--ink-soft)]">
                      {doc.category} · {doc.fileSize || 'PDF'}
                    </span>
                  </div>
                  <a
                    href={`/api/documents/${doc.id}/download`}
                    className="btn btn-outline btn-sm !py-1 !px-2.5 text-[11px]"
                  >
                    Download
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Educational Guidance Widget */}
          <div className="rounded-2xl border border-[var(--line-strong)] bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--forest)]" />
                <h3 className="f-display text-lg font-bold text-[var(--ink)]">
                  Property Guidance for Buyers
                </h3>
              </div>
              <Link
                href="/property-guidance"
                className="text-xs font-mono text-[var(--forest)] hover:underline"
              >
                All Articles
              </Link>
            </div>

            <ul className="space-y-3 text-xs">
              {[
                { title: 'How to verify DTCP & RERA approval sanction numbers', time: '4 min read' },
                { title: 'The 12 essential legal documents to verify before purchase', time: '6 min read' },
                { title: 'Why road width (30ft vs 40ft) matters for building permission', time: '3 min read' },
                { title: 'Complete guide to Tamil Nadu land registration & stamp duty', time: '5 min read' }
              ].map((item) => (
                <li
                  key={item.title}
                  className="p-3 rounded-lg border border-[var(--line)] bg-[var(--paper)] flex items-center justify-between"
                >
                  <div>
                    <Link
                      href="/property-guidance"
                      className="font-bold text-[var(--ink)] hover:text-[var(--forest)] block"
                    >
                      {item.title}
                    </Link>
                    <span className="text-[11px] text-[var(--ink-soft)]">{item.time}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--ink-soft)] shrink-0" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Arrange another site visit banner */}
        <div className="rounded-2xl border border-[var(--line-strong)] bg-gradient-to-r from-[var(--paper-2)] to-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--gold)] font-bold">
              Site Visit Coordination
            </span>
            <h3 className="f-display text-xl font-bold text-[var(--ink)] mt-0.5">
              Ready to physically inspect any of these layouts?
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-soft)] mt-1">
              Call our advisor directly or request a new complimentary round-trip cab.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a href="tel:9629048171" className="btn btn-outline btn-sm font-mono text-xs">
              <Phone className="h-3.5 w-3.5 text-[var(--forest)]" />
              <span>Call Advisor</span>
            </a>
            <Link href="/#site-visit" className="btn btn-primary btn-sm text-xs">
              <Car className="h-3.5 w-3.5 text-[var(--gold-bright)]" />
              <span>Schedule Inspection Cab</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
