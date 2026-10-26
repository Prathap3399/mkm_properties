import React from 'react';
import { connection } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { getAllProjects, getSectionsByProjectId, getPlotsByProjectId } from '@/lib/db/repository';
import AdminNav from '@/components/admin/AdminNav';
import PriceCalculatorClient from '@/components/admin/PriceCalculatorClient';

export const metadata = {
  title: 'Plot Price Calculator · MKM Admin Portal | Trichy',
  description: 'Official layout plot and pricing calculation tool for MKM Properties administrators.'
};

export const instant = false;

export default async function AdminCalculatorPage() {
  await connection();
  const session = await requireAdmin('/admin/login');

  const rawProjects = await getAllProjects();

  const projectsWithData = await Promise.all(
    rawProjects.map(async (p) => {
      const sections = await getSectionsByProjectId(p.id);
      const plots = await getPlotsByProjectId(p.id);
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        location: p.location,
        priceLabel: p.priceLabel,
        brochureUrl: p.brochureUrl,
        priceBrochureUrl: p.priceBrochureUrl || p.brochureUrl,
        approvalStatus: p.approvalStatus,
        sections: sections.map(s => ({
          id: s.id,
          projectId: s.projectId,
          sectionCode: s.sectionCode,
          sectionName: s.sectionName,
          pricePerSqFt: s.pricePerSqFt,
          roadWidth: s.roadWidth,
          description: s.description
        })),
        plots: plots.map(pl => ({
          id: pl.id,
          projectId: pl.projectId,
          sectionCode: pl.sectionCode,
          plotNumber: pl.plotNumber,
          areaSqFt: pl.areaSqFt,
          dimensions: pl.dimensions,
          facing: pl.facing,
          roadWidth: pl.roadWidth,
          status: pl.status,
          cornerPremiumPercent: pl.cornerPremiumPercent,
          notes: pl.notes
        }))
      };
    })
  );

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <AdminNav userEmail={session.email} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <PriceCalculatorClient initialProjects={projectsWithData} />
      </main>
    </div>
  );
}
