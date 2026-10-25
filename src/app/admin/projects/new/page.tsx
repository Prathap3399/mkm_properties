'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Loader2, AlertCircle } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    location: '',
    description: '',
    coverImageUrl: '/images/sterling-avenue.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    brochureUrl: '/brochures/mkm-sterling-avenue-brochure.pdf',
    priceLabel: 'Starting from ₹1,500 / sq.ft',
    approvalStatus: 'DTCP Approved',
    availabilityStatus: 'Available',
    plotSizes: '1200 sq.ft to 2400 sq.ft',
    roadAccess: '30ft and 40ft blacktop road',
    nearbyLandmarks: 'Near Panjappur New Bus Stand, Trichy',
    amenities: 'Blacktop Road, Solar Street Lights, Avenue Trees, Sweet Groundwater',
    mapUrl: 'https://maps.google.com/?q=Trichy'
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const amenitiesArray = formData.amenities
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amenities: JSON.stringify(amenitiesArray),
          galleryUrls: JSON.stringify([formData.coverImageUrl]),
          isPublished: 1
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save project');
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b4632] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects List</span>
        </Link>

        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-2xl font-extrabold text-slate-900">
              Add New Residential Project
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Ensure all legal details, road measurements, and approval statuses are verified before publishing.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Sterling Avenue"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b4632]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Slug (URL parameter) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="sterling-avenue"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b4632]/20 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Location in Trichy *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Panjappur New Bus Terminal, Trichy"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b4632]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Description *
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide accurate details regarding road width, groundwater, connectivity, and nearby schools/institutions..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b4632]/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Price Label
                </label>
                <input
                  type="text"
                  value={formData.priceLabel}
                  onChange={(e) => setFormData({ ...formData, priceLabel: e.target.value })}
                  placeholder="e.g. ₹1,450 / sq.ft"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Approval Status
                </label>
                <input
                  type="text"
                  value={formData.approvalStatus}
                  onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value })}
                  placeholder="e.g. DTCP Approved"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Availability
                </label>
                <select
                  value={formData.availabilityStatus}
                  onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Available">Available</option>
                  <option value="Coming Soon">Coming Soon</option>
                  <option value="Sold Out">Sold Out</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={formData.coverImageUrl}
                  onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                  placeholder="/images/sterling-avenue.jpg"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Plot Sizes
                </label>
                <input
                  type="text"
                  value={formData.plotSizes}
                  onChange={(e) => setFormData({ ...formData, plotSizes: e.target.value })}
                  placeholder="e.g. 1200 - 2400 sq.ft"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Road Access
                </label>
                <input
                  type="text"
                  value={formData.roadAccess}
                  onChange={(e) => setFormData({ ...formData, roadAccess: e.target.value })}
                  placeholder="e.g. 30ft and 40ft blacktop road"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Nearby Landmarks
                </label>
                <input
                  type="text"
                  value={formData.nearbyLandmarks}
                  onChange={(e) => setFormData({ ...formData, nearbyLandmarks: e.target.value })}
                  placeholder="e.g. 5 mins to Central Bus Stand"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                Amenities (Comma-separated)
              </label>
              <input
                type="text"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="Blacktop Road, Solar Lights, Potable Groundwater, Gated Arch"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-[#0b4632] hover:bg-[#06281d] text-[#fef9c3] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Project...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4 text-[#c59b27]" />
                    <span>Publish Project</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
