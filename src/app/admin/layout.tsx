import React from 'react';

// Opt out of static shell prerendering for admin routes as documented in Next.js 16
export const instant = false;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-50">{children}</div>;
}
