'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Phone,
  MessageSquare,
  Menu,
  X,
  ArrowUpRight,
  Lock,
  User,
  LogOut,
  FolderDown,
  BookOpen,
  LayoutDashboard,
  Building2,
  ShieldCheck
} from 'lucide-react';

const WHATSAPP_URL =
  'https://wa.me/919629048171?text=Hello%20MKM%20Properties,%20I%20would%20like%20to%20book%20a%20site%20visit%20in%20Trichy.';

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

  // Determine navigation links based on user status
  const isApprovedClient = sessionUser && (sessionUser.status === 'APPROVED' || sessionUser.role === 'admin');
  const isAdmin = sessionUser && sessionUser.role === 'admin';

  let navLinks: { href: string; label: string; icon?: any }[] = [];

  if (isAdmin) {
    navLinks = [
      { href: '/admin', label: 'Admin Hub', icon: LayoutDashboard },
      { href: '/admin/leads', label: 'Leads' },
      { href: '/admin/users', label: 'Users' },
      { href: '/projects', label: 'Projects View' },
      { href: '/documents', label: 'Documents' },
      { href: '/', label: 'Public Site' }
    ];
  } else if (isApprovedClient) {
    navLinks = [
      { href: '/dashboard', label: 'Home' },
      { href: '/projects', label: 'Projects' },
      { href: '/documents', label: 'Download Documents' },
      { href: '/property-guidance', label: 'Property Guidance' },
      { href: '/', label: 'Site Visit' }
    ];
  } else {
    // Strictly minimal public navigation per Prompt Section 4: Site Visit | Who We Are | Contact
    navLinks = [
      { href: '/', label: 'Site Visit' },
      { href: '/about', label: 'Who We Are' },
      { href: '/contact', label: 'Contact' }
    ];
  }

  return (
    <header className="header-glass sticky top-0 z-50">
      <div className="container-x">
        <div className="flex h-[4.5rem] items-center justify-between gap-6">
          {/* Brand */}
          <Link href={isApprovedClient ? '/dashboard' : '/'} className="group flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
            <span className="logo-mark f-display transition-transform duration-300 group-hover:rotate-[-4deg]">
              MKM
            </span>
            <span className="leading-none">
              <span className="f-display block text-[1.25rem] font-semibold tracking-[-0.015em] text-[var(--forest)]">
                MKM Properties
              </span>
              <span className="f-mono mt-1.5 block text-[9px] uppercase tracking-[0.22em] text-[var(--ink-soft)]">
                Trichy · Property Advisors
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link text-sm font-medium transition-colors ${
                    isActive ? 'text-[var(--forest)] font-bold border-b-2 border-[var(--forest)] pb-0.5' : 'text-[var(--ink)] hover:text-[var(--gold)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-4 lg:flex">
            {isApprovedClient ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 rounded-full border border-[var(--forest)] bg-[var(--paper-2)] px-3 py-1.5 text-xs font-semibold text-[var(--forest)] hover:bg-[var(--paper)] transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-[var(--forest)]" />
                  <span className="max-w-[120px] truncate">{sessionUser?.name || 'Account'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-[var(--ink-soft)] hover:text-red-700 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[var(--forest)] hover:text-[var(--gold)] transition-colors px-2 py-1"
                >
                  <Lock className="h-3 w-3" />
                  <span>Client Login</span>
                </Link>
                <a
                  href="tel:9629048171"
                  className="f-mono flex items-center gap-1.5 text-xs font-medium text-[var(--forest)] hover:text-[var(--gold)]"
                  title="Call PRATHAP"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>96290 48171</span>
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm !py-2 !px-3.5"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[var(--gold-bright)]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            {!isApprovedClient && (
              <Link href="/login" className="btn btn-outline btn-sm !px-2.5 text-xs">
                <Lock className="h-3 w-3" />
                <span>Login</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid h-10 w-10 place-items-center border border-[var(--ink)] text-[var(--ink)] cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[var(--line)] bg-[var(--paper)] md:hidden">
          <nav className="container-x rise py-4" aria-label="Mobile">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-baseline gap-4 border-b border-[var(--line)] py-3.5"
              >
                <span className="f-mono text-[11px] text-[var(--gold)]">0{i + 1}</span>
                <span className="f-display text-[1.4rem] leading-none text-[var(--ink)]">{link.label}</span>
                <ArrowUpRight className="ml-auto h-4 w-4 self-center text-[var(--ink-soft)]" />
              </Link>
            ))}

            <div className="grid gap-2.5 pb-3 pt-5">
              {isApprovedClient ? (
                <>
                  <div className="flex items-center justify-between py-2 text-xs text-[var(--ink-soft)] border-b border-[var(--line)]">
                    <span>Logged in as: <strong>{sessionUser?.name}</strong></span>
                    <span className="badge badge-sm bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded">
                      APPROVED
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="btn btn-outline w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-outline"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Client Portal Login</span>
                  </Link>
                  <a href="tel:9629048171" className="btn btn-primary">
                    <Phone className="h-4 w-4 text-[var(--gold-bright)]" />
                    <span>Call PRATHAP — 96290 48171</span>
                  </a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn btn-wa">
                    <MessageSquare className="h-4 w-4" />
                    <span>WhatsApp Enquiry</span>
                  </a>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
