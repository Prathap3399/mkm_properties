import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  ShieldCheck,
  Phone,
  MessageSquare,
  Check,
  Navigation,
  ArrowLeft
} from 'lucide-react';
import { getProjectBySlug, getAllProjects } from '@/lib/db/repository';
import ProjectVideo from '@/components/projects/ProjectVideo';
import BrochureViewer from '@/components/projects/BrochureViewer';
import EnquiryForm from '@/components/enquiry/EnquiryForm';
import ProjectCard from '@/components/projects/ProjectCard';

import { requireApprovedUser } from '@/lib/auth/session';

interface Props {
  params: Promise<{ slug: string }>;
}

export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: 'Project Not Found | MKM Properties – Trichy' };
  }

  return {
    title: `${project.name} – Protected Layout Details | MKM Properties`,
    description: `Authorized project information for verified clients.`,
    robots: {
      index: false,
      follow: false
    }
  };
}

function SpecCell({
  label,
  children,
  wide = false
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`border-b border-r border-[var(--line)] p-5 ${wide ? 'sm:col-span-2' : ''}`}>
      <dt className="f-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink-soft)]">{label}</dt>
      <dd className="mt-2 text-[15px] font-medium leading-snug text-[var(--ink)]">{children}</dd>
    </div>
  );
}

function PanelHeading({
  eyebrow,
  title,
  tamil,
  note
}: {
  eyebrow: string;
  title: string;
  tamil?: string;
  note?: string;
}) {
  return (
    <div className="mb-6 border-b border-[var(--line-strong)] pb-5">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="f-display mt-3 text-[1.9rem] font-medium leading-tight tracking-[-0.02em]">{title}</h2>
      {tamil && <p className="tamil mt-1 text-sm font-medium text-[var(--forest)]">{tamil}</p>}
      {note && <p className="mt-1.5 text-sm text-[var(--ink-soft)]">{note}</p>}
    </div>
  );
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  // Enforce strict backend server-side authorization!
  await requireApprovedUser('/login?unauthorized=true&from=/projects/' + slug);

  const project = await getProjectBySlug(slug);

  if (!project || project.isPublished === 0) {
    notFound();
  }

  // Parse amenities & gallery
  let amenitiesList: string[] = [];
  try {
    if (project.amenities) {
      amenitiesList = JSON.parse(project.amenities);
    }
  } catch {
    amenitiesList = project.amenities ? project.amenities.split(',') : [];
  }

  let galleryImages: string[] = [project.coverImageUrl];
  try {
    if (project.galleryUrls) {
      const parsed = JSON.parse(project.galleryUrls);
      if (Array.isArray(parsed) && parsed.length > 0) {
        galleryImages = parsed;
      }
    }
  } catch {
    // fallback
  }

  const allProjects = await getAllProjects({ publishedOnly: true });
  const relatedProjects = allProjects.filter((p) => p.id !== project.id).slice(0, 2);

  const isAvailable = project.availabilityStatus === 'Available';
  const isComingSoon = project.availabilityStatus === 'Coming Soon';
  const statusDot = isAvailable ? 'bg-[#1c9d52]' : isComingSoon ? 'bg-[var(--gold-bright)]' : 'bg-[#8a8f8b]';

  const whatsappUrl = `https://wa.me/919629048171?text=${encodeURIComponent(
    `Hello PRATHAP, I am interested in ${project.name} in ${project.location}. Please share the verified layout plan and pricing details.`
  )}`;

  return (
    <div className="min-h-screen">
      {/* ================= Header banner ================= */}
      <section className="on-dark relative isolate overflow-hidden bg-[var(--forest-deep)] text-[#f3ecd6]">
        <div aria-hidden="true" className="bg-contours-light absolute inset-0 -z-10" />
        <div className="container-x py-10 sm:py-14">
          {/* Breadcrumb */}
          <div className="f-mono flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-[#9fb0a5]">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-[var(--gold-bright)] transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>All projects</span>
            </Link>
            <div className="flex items-center gap-2">
              <span>Trichy</span>
              <span>/</span>
              <span className="max-w-[200px] truncate">{project.location}</span>
              <span>/</span>
              <span className="text-white">{project.name}</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="f-mono inline-flex items-center gap-2 bg-[var(--paper)] px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
                  <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
                  {project.availabilityStatus}
                </span>
                {project.approvalStatus && (
                  <span className="f-mono inline-flex items-center gap-1.5 border border-[var(--gold-bright)]/60 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--gold-bright)]">
                    <ShieldCheck className="h-3 w-3" />
                    {project.approvalStatus}
                  </span>
                )}
              </div>

              <h1 className="display on-dark rise mt-5 text-[clamp(2.6rem,6vw,5rem)] text-white">{project.name}</h1>

              <p className="mt-4 flex items-center gap-2 text-base text-[#b3c0b7]">
                <MapPin className="h-4 w-4 shrink-0 text-[var(--gold-bright)]" />
                <span>{project.location}</span>
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end">
              {project.priceLabel && (
                <div className="border-l-2 border-[var(--gold-bright)] pl-4">
                  <span className="f-mono block text-[10px] uppercase tracking-[0.2em] text-[#9fb0a5]">Pricing</span>
                  <span className="f-display mt-1 block text-3xl font-medium leading-none text-[var(--gold-bright)]">
                    {project.priceLabel}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <a href="tel:9629048171" className="btn btn-outline-light flex-1 sm:flex-initial">
                  <Phone className="h-4 w-4" />
                  <span>Call PRATHAP</span>
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-wa flex-1 sm:flex-initial">
                  <MessageSquare className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Body ================= */}
      <div className="container-x py-12 sm:py-16">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ---------- Left column ---------- */}
          <div className="space-y-12 lg:col-span-7">
            {/* Gallery */}
            <div>
              <div className="corners corners-out relative aspect-[16/10] w-full bg-[var(--forest-deep)]">
                <img
                  src={project.coverImageUrl}
                  alt={`${project.name} layout view`}
                  className="h-full w-full object-cover"
                />
              </div>

              {galleryImages.length > 1 && (
                <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="h-16 w-24 shrink-0 overflow-hidden border border-[var(--line-strong)]"
                    >
                      <img
                        src={img}
                        alt={`${project.name} photo ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plot details */}
            <div>
              <PanelHeading eyebrow="01 · Specification" title="Plot details & approval information" />

              <dl className="grid grid-cols-1 border-l border-t border-[var(--line)] bg-[var(--card)] sm:grid-cols-2">
                {project.plotSizes && <SpecCell label="Plot dimensions / sizes">{project.plotSizes}</SpecCell>}
                {project.roadAccess && <SpecCell label="Road width & access">{project.roadAccess}</SpecCell>}
                {project.approvalStatus && (
                  <SpecCell label="Approval & document status">
                    <span className="flex items-center gap-1.5 text-[var(--forest)]">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--gold)]" />
                      {project.approvalStatus}
                    </span>
                  </SpecCell>
                )}
                {project.priceLabel && (
                  <SpecCell label="Verified pricing">
                    <span className="text-[var(--forest)]">{project.priceLabel}</span>
                  </SpecCell>
                )}
                {project.nearbyLandmarks && (
                  <SpecCell label="Nearby landmarks & connectivity" wide>
                    {project.nearbyLandmarks}
                  </SpecCell>
                )}
              </dl>
            </div>

            {/* About */}
            <div>
              <PanelHeading eyebrow="02 · Overview" title={`About ${project.name}`} />
              <p className="text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">{project.description}</p>

              {amenitiesList.length > 0 && (
                <div className="mt-8">
                  <h3 className="f-mono text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">
                    Verified infrastructure &amp; amenities
                  </h3>
                  <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                    {amenitiesList.map((amenity, idx) => (
                      <li key={idx} className="flex items-center gap-3 border-b border-[var(--line)] pb-3 text-[15px] font-medium">
                        <span className="grid h-5 w-5 shrink-0 place-items-center bg-[var(--forest)]">
                          <Check className="h-3 w-3 text-[var(--gold-bright)]" strokeWidth={3} />
                        </span>
                        <span>{amenity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Video */}
            <div>
              <PanelHeading
                eyebrow="03 · Video"
                title="Explore the project through video"
                tamil="வீடியோவில் Project-ஐப் பாருங்கள்"
              />
              <div className="corners corners-out corners-forest">
                <ProjectVideo
                  videoUrl={project.videoUrl}
                  title={`${project.name} – Site Walkthrough Tour`}
                  thumbnailUrl={project.coverImageUrl}
                />
              </div>
            </div>

            {/* Brochure */}
            <div>
              <PanelHeading
                eyebrow="04 · Documents"
                title="Brochure & master plan"
                note="View and download the layout plan directly to your device."
              />
              <BrochureViewer brochureUrl={project.brochureUrl} projectName={project.name} />
            </div>

            {/* Map */}
            {project.mapUrl && (
              <div>
                <PanelHeading
                  eyebrow="05 · Location"
                  title="Location & GPS navigation"
                  note="Navigate directly to the layout via Google Maps."
                />
                <a
                  href={project.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <Navigation className="h-4 w-4 text-[var(--gold-bright)]" />
                  <span>Open location in Google Maps</span>
                </a>
              </div>
            )}
          </div>

          {/* ---------- Right column: enquiry ---------- */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-5">
            <EnquiryForm
              initialProjectSlug={project.slug}
              projectOptions={allProjects.map((p) => ({ id: p.id, name: p.name, slug: p.slug }))}
              isCompact={false}
            />

            <div className="on-dark relative isolate overflow-hidden bg-[var(--forest)] p-6 text-[#f3ecd6]">
              <div aria-hidden="true" className="bg-contours-light absolute inset-0 -z-10 opacity-80" />
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-[var(--gold-bright)]" />
                <h4 className="f-display text-xl font-medium text-white">Free cab site inspection</h4>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#c3cfc6]">
                We coordinate a complimentary round-trip cab pickup anywhere in Trichy so you and your family can inspect {project.name} in person.
              </p>
              <a
                href="tel:9629048171"
                className="f-mono mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-[var(--gold-bright)] hover:text-white"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Call PRATHAP: 9629048171</span>
              </a>
            </div>
          </div>
        </div>

        {/* ---------- Related ---------- */}
        {relatedProjects.length > 0 && (
          <div className="mt-20 border-t-2 border-[var(--ink)] pt-12">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="eyebrow">More to explore</span>
                <h3 className="h-section mt-4 !text-[clamp(1.9rem,3.6vw,2.8rem)]">
                  Other verified <em>layouts</em> in Trichy
                </h3>
                <p className="mt-3 text-sm text-[var(--ink-soft)] sm:text-base">
                  Explore alternative residential corridors across Tiruchirappalli.
                </p>
              </div>
              <Link href="/projects" className="btn btn-outline btn-sm self-start sm:self-auto">
                View all layouts →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
              {relatedProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
