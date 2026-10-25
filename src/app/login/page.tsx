'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  Car,
  UserCheck
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check if redirected due to unauthorized attempt
  const isUnauthorized = searchParams?.get('unauthorized') === 'true';
  const reason = searchParams?.get('reason');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.redirectUrl) {
          router.push(data.redirectUrl);
        } else if (data.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      } else {
        setErrorMessage(data.error || 'Failed to authenticate. Please check your credentials.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. Please try again or call 9629048171.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (type: 'client' | 'admin') => {
    if (type === 'client') {
      setIdentifier('demo@mkmproperties.com');
      setPassword('MKMClient@2026!');
    } else {
      setIdentifier('admin@mkmproperties.com');
      setPassword('MkmTrichy@2026!');
    }
    setErrorMessage(null);
  };

  return (
    <div className="mx-auto max-w-md w-full">
      {/* Authorization Alert if redirected */}
      {isUnauthorized && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 shadow-xs flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Authorized Client Access Required</strong>
            <span>
              Detailed project layouts, DTCP approvals, and download documents are protected. Please login with your approved account, or request a site visit below.
            </span>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-[var(--line-strong)] bg-white p-7 sm:p-9 shadow-md">
        <div className="text-center mb-6">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[var(--paper-2)] text-[var(--forest)] border border-[var(--forest)]/20 mb-3">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="f-display text-2xl font-bold text-[var(--ink)]">
            Client Portal Access
          </h1>
          <p className="mt-1 text-xs text-[var(--ink-soft)] leading-relaxed">
            Authorized portal for verified clients to review blueprints, DTCP approvals, and direct promoter rates.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--ink)] mb-1.5">
              Email Address or Mobile Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--ink-soft)]">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. demo@mkmproperties.com or 9840123456"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--line-strong)] bg-white text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--ink)]">
                Password
              </label>
              <a
                href="tel:9629048171"
                className="text-[11px] text-[var(--forest)] hover:underline"
                title="Contact Advisor for Password Reset"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--ink-soft)]">
                <KeyRound className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--line-strong)] bg-white text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 text-sm font-bold shadow-md cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying Access...</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Lock className="h-4 w-4 text-[var(--gold-bright)]" />
                <span>SIGN IN TO PORTAL</span>
              </span>
            )}
          </button>
        </form>

        {/* Quick Demo Logins for Evaluation */}
        <div className="mt-6 border-t border-[var(--line)] pt-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink-soft)] block mb-2 text-center">
            Quick Testing Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('client')}
              className="py-1.5 px-2.5 rounded border border-[var(--line-strong)] bg-[var(--paper)] text-[11px] text-[var(--ink)] font-medium hover:bg-[var(--paper-2)] text-center cursor-pointer transition-colors"
            >
              Demo Client Login
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              className="py-1.5 px-2.5 rounded border border-[var(--line-strong)] bg-[var(--paper)] text-[11px] text-[var(--ink)] font-medium hover:bg-[var(--paper-2)] text-center cursor-pointer transition-colors"
            >
              Admin Login
            </button>
          </div>
        </div>

        {/* Don't have access link */}
        <div className="mt-6 text-center text-xs text-[var(--ink-soft)] border-t border-[var(--line)] pt-4">
          <span>Not an approved client yet? </span>
          <Link href="/#site-visit" className="font-bold text-[var(--forest)] hover:underline inline-flex items-center gap-1">
            <span>Book a Site Visit to get access</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:py-16 bg-[var(--paper)]">
      <div className="container-x">
        <Suspense fallback={<div className="text-center py-12 text-sm text-[var(--ink-soft)]">Loading login...</div>}>
          <LoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}
