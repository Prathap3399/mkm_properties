'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Phone,
  MessageSquare,
  Menu,
  X,
  CalendarCheck,
  User,
  LogOut,
  Lock,
  ArrowRight
} from 'lucide-react';

const WHATSAPP_URL =
  'https://wa.me/919629048171?text=Hello%20MKM%20Properties,%20I%20would%20like%20to%20know%20more%20about%20residential%20plots%20in%20Trichy%20and%20book%20a%20site%20visit.';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'PENDING' | 'APPROVED' | 'DISABLED';
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Fetch session user on mount and route change
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.authenticated && data.user) {
              setSessionUser(data.user);
            } else {
              setSessionUser(null);
            }
          }
        }
      } catch (e) {
        if (isMounted) setSessionUser(null);
      } finally {
        if (isMounted) setLoadingSession(false);
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setSessionUser(null);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isAdmin = sessionUser && sessionUser.role === 'admin';

  const navLinks = isAdmin
    ? [
        { href: '/admin/projects', label: 'Projects View' },
        { href: '/admin/calculator', label: 'Price Calculator' },
        { href: '/', label: 'Public Site' }
      ]
    : [
        { href: '/#site-visit', label: 'Site Visit' },
        { href: '/#why-us', label: 'Why Us' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' }
      ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="container-x">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Brand Identity */}
          <Link
            href="/"
            className="group flex items-center gap-3.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#0B271F] to-[#071B15] text-[#D9A838] font-bold text-base shadow-sm ring-1 ring-amber-400/20 group-hover:scale-105 transition-transform">
              MKM
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-[#0B271F] transition-colors leading-tight">
                MKM Properties
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-medium">
                Tiruchirappalli • Property Advisors
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-150 py-1 ${
                    isActive
                      ? 'text-[#0B271F] font-bold border-b-2 border-[#0B271F]'
                      : 'text-slate-600 hover:text-[#0B271F]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden items-center gap-3.5 lg:flex">
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900">
                  <User className="h-3.5 w-3.5 text-emerald-700" />
                  <span className="max-w-[120px] truncate">{sessionUser?.name || 'Admin'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-700 transition-colors cursor-pointer py-1.5 px-2 rounded-md hover:bg-slate-100"
                  title="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                {/* Advisor Phone */}
                <a
                  href="tel:9629048171"
                  className="hidden xl:flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-[#0B271F] px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  title="Direct Phone to Advisor PRATHAP"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[#0B271F]">
                    <Phone className="h-3 w-3" />
                  </div>
                  <span>+91 96290 48171</span>
                </a>

                {/* Primary CTA: Book Site Visit */}
                <a
                  href="/#site-visit"
                  className="btn btn-primary btn-sm shadow-sm flex items-center gap-2"
                >
                  <CalendarCheck className="h-4 w-4 text-[#D9A838]" />
                  <span>Book Site Visit</span>
                </a>

                {/* WhatsApp Quick Action */}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  title="Instant WhatsApp Consultation"
                  aria-label="WhatsApp Consultation"
                >
                  <MessageSquare className="h-5 w-5" />
                </a>

                {/* Discreet Admin Login */}
                <Link
                  href="/admin/login"
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Staff & Advisor Login"
                  aria-label="Admin Portal Login"
                >
                  <Lock className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="/#site-visit"
              className="btn btn-primary btn-sm !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            >
              <CalendarCheck className="h-3.5 w-3.5 text-[#D9A838]" />
              <span>Site Visit</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white shadow-xl md:hidden animate-fadeIn">
          <nav className="container-x py-5 space-y-1" aria-label="Mobile Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-slate-800 hover:bg-slate-50 hover:text-[#0B271F] transition-colors"
              >
                <span>{link.label}</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}

            <div className="pt-4 mt-3 border-t border-slate-100 space-y-2.5">
              {isAdmin ? (
                <>
                  <div className="flex items-center justify-between px-4 py-2 text-xs text-slate-600 bg-slate-50 rounded-lg">
                    <span>Admin: <strong>{sessionUser?.name}</strong></span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="btn btn-outline w-full text-red-600 hover:bg-red-50 hover:border-red-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="tel:9629048171"
                    className="btn btn-outline w-full flex items-center justify-center gap-2 text-sm font-semibold text-slate-800"
                  >
                    <Phone className="h-4 w-4 text-[#0B271F]" />
                    <span>Call PRATHAP: +91 96290 48171</span>
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa w-full flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>WhatsApp Enquiry</span>
                  </a>
                  <div className="pt-2 text-center">
                    <Link
                      href="/admin/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 inline-flex items-center gap-1"
                    >
                      <Lock className="h-3 w-3" />
                      <span>Advisor / Staff Access</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
