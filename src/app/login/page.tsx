'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ShieldCheck, Loader2, AlertCircle, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUnauthorized = searchParams.get('unauthorized') === 'true';
  const redirectTarget = searchParams.get('redirect') || '/projects';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify your credentials.');
      }

      setSuccessMsg('Authentication verified. Redirecting to authorized portal...');
      setTimeout(() => {
        router.push(data.redirectUrl || redirectTarget);
        router.refresh();
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <div className="w-12 h-12 rounded-2xl bg-[var(--forest-deep)] border-2 border-[var(--gold)] text-[#fef9c3] font-black text-xl flex items-center justify-center mx-auto shadow-md">
              MKM
            </div>
          </Link>
          <h1 className="f-display text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
            Client Portal Login
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-soft)]">
            Verified Property Layouts &amp; Approval Documents
          </p>
        </div>

        {/* Unauthorized Notification Banner */}
        {isUnauthorized && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1.5 shadow-xs">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <ShieldCheck className="w-4 h-4 text-[var(--gold)] shrink-0" />
              <span>Authorized Client Access Required</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-700">
              To inspect verified layout maps, approval documents, and direct promoter pricing, please sign in with your approved client account.
            </p>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-md border border-[var(--line-strong)] space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Registered Email or Mobile Phone
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. client@example.com or 9840123456"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/20 focus:border-[var(--forest)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/20 focus:border-[var(--forest)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[var(--forest)] hover:bg-[var(--forest-deep)] text-[#fef9c3] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Client Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Prompt */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-600">
              Don&apos;t have an approved client account?
            </p>
            <Link
              href="/#site-visit"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--forest)] hover:underline"
            >
              <UserCheck className="w-3.5 h-3.5 text-[var(--gold)]" />
              <span>Book a Site Visit to Request Portal Access</span>
            </Link>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-2">
          <Link href="/" className="hover:text-[var(--forest)] transition-colors">
            ← Home
          </Link>
          <Link href="/admin/login" className="hover:text-slate-800 transition-colors">
            Staff / Admin Login →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
