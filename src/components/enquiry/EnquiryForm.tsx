'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useForm, UseFormSetValue } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  User,
  Home,
  Calendar,
  IndianRupee,
  Loader2,
  ChevronDown,
  MessageSquare
} from 'lucide-react';
import { EnquirySchema, type EnquiryFormData } from '@/lib/validation/enquiry';

function UtmParamSync({
  setValue,
  projectOptions
}: {
  setValue: UseFormSetValue<EnquiryFormData>;
  projectOptions: { id: string; name: string; slug: string }[];
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams) {
      if (searchParams.get('utm_source')) setValue('utmSource', searchParams.get('utm_source') || '');
      if (searchParams.get('utm_medium')) setValue('utmMedium', searchParams.get('utm_medium') || '');
      if (searchParams.get('utm_campaign')) setValue('utmCampaign', searchParams.get('utm_campaign') || '');
      if (searchParams.get('utm_content')) setValue('utmContent', searchParams.get('utm_content') || '');
      if (searchParams.get('utm_term')) setValue('utmTerm', searchParams.get('utm_term') || '');
      const projectFromUrl = searchParams.get('project');
      if (projectFromUrl) {
        const found = projectOptions.find((p) => p.slug === projectFromUrl);
        setValue('projectId', found ? found.id : projectFromUrl);
      }
    }
  }, [searchParams, setValue, projectOptions]);
  return null;
}

interface EnquiryFormProps {
  initialProjectSlug?: string;
  projectOptions?: { id: string; name: string; slug: string }[];
  isCompact?: boolean;
}

export default function EnquiryForm({
  initialProjectSlug,
  projectOptions = [],
  isCompact = false
}: EnquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showOptionalFields, setShowOptionalFields] = useState(!isCompact);

  // Find initial project ID if matching slug exists
  const initialProjectId =
    projectOptions.find((p) => p.slug === initialProjectSlug)?.id ||
    (initialProjectSlug ? initialProjectSlug : 'General Enquiry');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(EnquirySchema) as any,
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      projectId: initialProjectId,
      purpose: 'Build a House',
      budget: '',
      preferredLocation: '',
      purchaseTimeline: '',
      preferredVisitDate: '',
      message: '',
      consent: true,
      botField: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmContent: '',
      utmTerm: '',
      privacyPolicyVersion: 'v1.0'
    }
  });

  const selectedPurpose = watch('purpose');

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    const eventId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, eventId })
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit enquiry. Please try again.');
      }

      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq(
          'track',
          'Lead',
          {
            content_name: data.projectId,
            content_category: data.purpose
          },
          { eventID: eventId }
        );
      }

      setSubmitSuccess(true);
      reset();
    } catch (err: any) {
      setServerError(err.message || 'An unexpected error occurred. Please call 9629048171 directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------------------- Success state ---------------------------- */
  if (submitSuccess) {
    return (
      <div className="plan-card relative border-t-4 !border-t-[var(--forest)] p-8 text-center shadow-[10px_10px_0_rgba(15,61,46,0.1)] sm:p-12">
        <div className="mx-auto grid h-16 w-16 place-items-center bg-[var(--forest)]">
          <CheckCircle2 className="h-8 w-8 text-[var(--gold-bright)]" />
        </div>
        <h3 className="tamil mt-6 text-xl font-semibold text-[var(--forest)] sm:text-2xl">
          நன்றி! உங்கள் தகவல் பதிவு செய்யப்பட்டது
        </h3>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[var(--ink-soft)]">
          Thank you! We have received your property requirements. Our proprietor <strong className="text-[var(--ink)]">PRATHAP</strong> will call you shortly to share verified details and arrange a free site visit.
        </p>

        <dl className="mx-auto mt-8 max-w-sm divide-y divide-[var(--line)] border-y border-[var(--line)] text-left text-sm">
          <div className="flex justify-between py-3">
            <dt className="f-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-soft)]">Direct guidance</dt>
            <dd className="font-semibold">PRATHAP</dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="f-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-soft)]">Phone</dt>
            <dd>
              <a href="tel:9629048171" className="f-mono font-medium text-[var(--forest)] underline">
                +91 96290 48171
              </a>
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://wa.me/919629048171?text=Hello%20PRATHAP,%20I%20just%20submitted%20my%20plot%20enquiry%20on%20the%20website."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa w-full sm:w-auto"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat on WhatsApp</span>
          </a>
          <button onClick={() => setSubmitSuccess(false)} className="btn btn-outline w-full sm:w-auto">
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------- Form ---------------------------------- */
  return (
    <div className="plan-card relative border-t-4 !border-t-[var(--forest)] p-6 shadow-[10px_10px_0_rgba(15,61,46,0.1)] sm:p-9">
      {/* Heading */}
      <div className="mb-8">
        <span className="f-mono text-[10.5px] uppercase tracking-[0.2em] text-[var(--gold)]">
          Direct Land Consultation
        </span>
        <h3 className="f-display mt-2 text-3xl font-medium leading-tight tracking-[-0.02em]">Get project details</h3>
        <p className="tamil mt-1.5 text-sm font-medium text-[var(--forest)]">
          விவரங்களைப் பெறுங்கள் &amp; நேரடி மனையிடப் பார்வை
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
          Share your requirements. We will send you verified layout details, pricing sheets, and arrange a free site visit.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 flex items-start gap-3 border border-[#e3a39b] bg-[#fff3f1] p-4 text-sm text-[#8c2a20]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Suspense fallback={null}>
          <UtmParamSync setValue={setValue} projectOptions={projectOptions} />
        </Suspense>

        {/* Anti-bot honeypot */}
        <div className="hidden" aria-hidden="true">
          <input type="text" tabIndex={-1} autoComplete="off" {...register('botField')} />
        </div>

        {/* Name & Mobile */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="label">
              Full Name <span className="text-[#b3382c]">*</span>
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-soft)]/70" />
              <input
                type="text"
                placeholder="உங்கள் பெயர் (e.g. S. Prathap)"
                className={`field !pl-10 ${errors.name ? 'field-error' : ''}`}
                {...register('name')}
              />
            </div>
            {errors.name && <p className="mt-1.5 text-xs font-medium text-[#b3382c]">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">
              Mobile Number <span className="text-[#b3382c]">*</span>
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-soft)]/70" />
              <input
                type="tel"
                placeholder="10-digit mobile (e.g. 9629048171)"
                className={`field !pl-10 ${errors.phone ? 'field-error' : ''}`}
                {...register('phone')}
              />
            </div>
            {errors.phone && <p className="mt-1.5 text-xs font-medium text-[#b3382c]">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Project */}
        <div>
          <label className="label">
            Preferred Project <span className="text-[#b3382c]">*</span>
          </label>
          <div className="relative">
            <Home className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-soft)]/70" />
            <select className="field cursor-pointer appearance-none !pl-10 !pr-10" {...register('projectId')}>
              <option value="General Enquiry">All / General Enquiry (Explore Trichy Plots)</option>
              {projectOptions.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
              {projectOptions.length === 0 && (
                <>
                  <option value="Sterling Avenue">Sterling Avenue (K.K. Nagar Ext)</option>
                  <option value="Ritz Landmark Avenue">Ritz Landmark Avenue (Panjappur)</option>
                  <option value="Rainbow City">Rainbow City (Samayapuram)</option>
                  <option value="Elegant Avenue">Elegant Avenue (Navalpattu IT Park)</option>
                  <option value="Glorious Town">Glorious Town (Thiruverumbur)</option>
                  <option value="Samayapuram Highway Property">Samayapuram Highway Property</option>
                </>
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-soft)]/70" />
          </div>
        </div>

        {/* Purpose */}
        <div>
          <label className="label">
            Purpose <span className="text-[#b3382c]">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { val: 'Build a House', label: 'Build a House', tamil: 'வீடு கட்ட' },
              { val: 'Investment', label: 'Investment', tamil: 'முதலீடு' },
              { val: 'Both', label: 'Both', tamil: 'இரண்டும்' }
            ].map((item) => {
              const isChecked = selectedPurpose === item.val;
              return (
                <label
                  key={item.val}
                  className={`flex cursor-pointer flex-col items-center justify-center border px-2 py-3 text-center transition-all ${
                    isChecked
                      ? 'border-[var(--forest)] bg-[var(--forest)] text-[#fbf5e1] shadow-[3px_3px_0_var(--gold-bright)]'
                      : 'border-[var(--line-strong)] bg-white text-[var(--ink)] hover:border-[var(--forest)]'
                  }`}
                >
                  <input type="radio" value={item.val} className="sr-only" {...register('purpose')} />
                  <span className="text-[13px] font-semibold leading-tight">{item.label}</span>
                  <span
                    className={`tamil mt-0.5 text-[11px] ${isChecked ? 'text-[var(--gold-bright)]' : 'text-[var(--ink-soft)]'}`}
                  >
                    {item.tamil}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Toggle optional */}
        <div>
          <button
            type="button"
            onClick={() => setShowOptionalFields(!showOptionalFields)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--forest)] hover:text-[var(--gold)] cursor-pointer"
          >
            <span>
              {showOptionalFields ? 'Hide optional preferences' : '+ Add budget, location or visit date (Optional)'}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showOptionalFields ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Optional fields */}
        {showOptionalFields && (
          <div className="rise space-y-5 border-t border-dashed border-[var(--line-strong)] pt-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="label">
                  Budget Range <span className="normal-case tracking-normal text-[var(--ink-soft)]/70">(Optional)</span>
                </label>
                <div className="relative">
                  <IndianRupee className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-soft)]/70" />
                  <select className="field cursor-pointer appearance-none !pl-10 !pr-10" {...register('budget')}>
                    <option value="">Select Budget Range</option>
                    <option value="Under ₹15 Lakhs">Under ₹15 Lakhs</option>
                    <option value="₹15 Lakhs – ₹25 Lakhs">₹15 Lakhs – ₹25 Lakhs</option>
                    <option value="₹25 Lakhs – ₹40 Lakhs">₹25 Lakhs – ₹40 Lakhs</option>
                    <option value="Above ₹40 Lakhs">Above ₹40 Lakhs</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-soft)]/70" />
                </div>
              </div>

              <div>
                <label className="label">
                  Preferred Location <span className="normal-case tracking-normal text-[var(--ink-soft)]/70">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Panjappur, K.K. Nagar, Samayapuram"
                  className="field"
                  {...register('preferredLocation')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="label">
                  Purchase Timeline <span className="normal-case tracking-normal text-[var(--ink-soft)]/70">(Optional)</span>
                </label>
                <div className="relative">
                  <select className="field cursor-pointer appearance-none !pr-10" {...register('purchaseTimeline')}>
                    <option value="">Expected Timeline</option>
                    <option value="Immediate (Within 1 Month)">Immediate (Within 1 Month)</option>
                    <option value="1 – 3 Months">1 – 3 Months</option>
                    <option value="3 – 6 Months">3 – 6 Months</option>
                    <option value="Exploring Options">Just Exploring</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-soft)]/70" />
                </div>
              </div>

              <div>
                <label className="label">
                  Site Visit Date <span className="normal-case tracking-normal text-[var(--ink-soft)]/70">(Optional)</span>
                </label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-soft)]/70" />
                  <input type="date" className="field !pl-10" {...register('preferredVisitDate')} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Consent */}
        <div className="pt-1">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 accent-[var(--forest)]"
              {...register('consent')}
            />
            <span className="text-[13px] leading-relaxed text-[var(--ink-soft)]">
              I agree to receive verified project details and site visit guidance from MKM Properties via Phone or WhatsApp in accordance with the{' '}
              <Link href="/privacy" className="font-semibold text-[var(--forest)] underline">
                Privacy Notice
              </Link>
              .
            </span>
          </label>
          {errors.consent && <p className="mt-1.5 text-xs font-medium text-[#b3382c]">{errors.consent.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary group w-full !py-4 text-[15px] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[var(--gold-bright)]" />
              <span>தகவல் பதிவாகிறது (Submitting)...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4 text-[var(--gold-bright)] transition-transform group-hover:translate-x-0.5" />
              <span>Get Project Details • விவரங்களைப் பெறுங்கள்</span>
            </>
          )}
        </button>

        {/* Trust line */}
        <p className="f-mono text-center text-[11px] uppercase tracking-[0.1em] text-[var(--ink-soft)]">
          Direct: PRATHAP —{' '}
          <a href="tel:9629048171" className="font-medium text-[var(--forest)] underline">
            9629048171
          </a>{' '}
          · Zero brokerage
        </p>
      </form>
    </div>
  );
}
