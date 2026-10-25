'use client';

import React, { useState } from 'react';
import { Play, VideoOff, ExternalLink } from 'lucide-react';

interface ProjectVideoProps {
  videoUrl?: string | null;
  title: string;
  thumbnailUrl?: string | null;
  className?: string;
  hideIfEmpty?: boolean;
}

export function extractYouTubeId(urlOrId?: string | null): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const trimmed = urlOrId.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    if (trimmed.includes('youtu.be/')) {
      const id = trimmed.split('youtu.be/')[1].split(/[?#&]/)[0];
      return id && id.length === 11 ? id : id;
    }
    if (trimmed.includes('watch')) {
      const urlObj = new URL(trimmed);
      const v = urlObj.searchParams.get('v');
      if (v) return v;
    }
    if (trimmed.includes('/embed/')) {
      const id = trimmed.split('/embed/')[1].split(/[?#&]/)[0];
      return id;
    }
  } catch (e) {
    // Regex fallback
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) return match[1];
  }

  return null;
}

export default function ProjectVideo({
  videoUrl,
  title,
  thumbnailUrl,
  className = '',
  hideIfEmpty = false
}: ProjectVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const youtubeId = extractYouTubeId(videoUrl);

  if (!videoUrl || !youtubeId) {
    if (hideIfEmpty) return null;

    return (
      <div className={`plan-card grid-paper p-8 text-center sm:p-10 ${className}`}>
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center border border-[var(--ink)]">
          <VideoOff className="h-6 w-6 text-[var(--forest)]" strokeWidth={1.5} />
        </div>
        <h4 className="f-display text-2xl font-medium leading-tight">
          Project video tour coming soon
        </h4>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--ink-soft)]">
          Our ground drone and site walkthrough footage for this layout is currently being edited. You can schedule an on-site visit to inspect the property in person.
        </p>
        <div className="mt-5">
          <a
            href="https://wa.me/919629048171?text=Hello%20PRATHAP,%20please%20send%20site%20photos%20and%20details."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--forest)] underline underline-offset-4 hover:text-[var(--gold)]"
          >
            <span>Request layout photos on WhatsApp</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    );
  }

  const posterImage =
    thumbnailUrl && !thumbnailError
      ? thumbnailUrl
      : `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div
      className={`group relative aspect-video w-full overflow-hidden bg-[var(--forest-deep)] ${className}`}
    >
      {!isPlaying ? (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="relative h-full w-full cursor-pointer text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--gold-bright)]"
          aria-label={`Play site video walkthrough for ${title}`}
        >
          <img
            src={posterImage}
            alt={title}
            onError={() => setThumbnailError(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(7,29,22,0.85)] via-[rgba(7,29,22,0.15)] to-[rgba(7,29,22,0.3)] transition-colors group-hover:from-[rgba(7,29,22,0.7)]" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <span className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border border-[var(--gold-bright)] bg-[rgba(7,29,22,0.55)] text-[var(--gold-bright)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
              <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
            </span>
          </div>

          {/* Title bar */}
          <div className="absolute inset-x-5 bottom-4 text-white">
            <span className="f-mono block text-[10px] uppercase tracking-[0.2em] text-[var(--gold-bright)]">
              Site video tour
            </span>
            <span className="f-display mt-1 block line-clamp-1 text-lg text-white sm:text-xl">{title}</span>
          </div>
        </button>
      ) : (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={`Video tour: ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
          loading="lazy"
        />
      )}
    </div>
  );
}
