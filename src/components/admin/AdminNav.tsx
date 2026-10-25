'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Users,
  Building2,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  ExternalLink,
  FolderDown,
  FileEdit,
  Settings,
  UserCheck
} from 'lucide-react';

export default function AdminNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/leads', label: 'Leads', icon: Users },
    { href: '/admin/users', label: 'Users', icon: UserCheck },
    { href: '/admin/projects', label: 'Projects', icon: Building2 },
    { href: '/admin/documents', label: 'Documents', icon: FolderDown },
    { href: '/admin/content', label: 'Content', icon: FileEdit },
    { href: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <header className="bg-[#0b4632] text-white border-b border-emerald-950 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c59b27] text-[#06281d] flex items-center justify-center font-black text-sm shadow-xs">
              MKM
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wide text-[#fef9c3]">
                MKM ADMIN
              </span>
              <span className="hidden sm:inline text-xs text-emerald-200 ml-2 font-medium">
                Real Estate Customer Portal
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#06281d] text-[#fef9c3] shadow-inner'
                      : 'text-slate-200 hover:bg-emerald-900/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#c59b27]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User profile & actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden lg:flex items-center gap-1 text-xs text-emerald-300 hover:text-white"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <span className="hidden sm:inline text-xs text-slate-300 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/60 font-mono">
              {userEmail}
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-200 text-xs font-bold border border-red-800/50 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile horizontal scroll nav */}
        <div className="md:hidden flex items-center gap-1 py-2 overflow-x-auto border-t border-emerald-900/60 scrollbar-none">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#06281d] text-[#fef9c3]'
                    : 'text-slate-300 hover:bg-emerald-900/40'
                }`}
              >
                <Icon className="w-3 h-3 text-[#c59b27]" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
