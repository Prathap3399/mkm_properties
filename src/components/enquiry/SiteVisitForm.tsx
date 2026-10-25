'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar,
  Clock,
  MapPin,
  Home,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Car
} from 'lucide-react';
import { EnquirySchema, type EnquiryFormData } from '@/lib/validation/enquiry';

interface SiteVisitFormProps {
  defaultLocation?: string;
  isCompact?: boolean;
}

const TRICHY_LOCATIONS = [
  'K.K. Nagar Extension / Manikandam',
  'Panjappur (New Integrated Bus Terminal)',
  'Samayapuram / NH-45 Corridor',
  'Navalpattu (ELCOT IT Park Road)',
  'Thiruverumbur / BHEL / NIT Belt',
  'Vayalur Road / Somarasampettai',
  'Other / Open to Suggestions'
];

const PROJECT_CHOICES = [
  'Select a Project / Not Sure Yet',
  'Sterling Avenue (K.K. Nagar Extension)',
  'Ritz Landmark Avenue (Panjappur)',
  'Rainbow City (Samayapuram)',
  'Elegant Avenue (Navalpattu)',
  'Glorious Town (Thiruverumbur)',
  'Samayapuram Highway Property',
  'Other / Not Sure'
];

const TIME_SLOTS = [
  'Morning (09:00 AM – 12:00 PM)',
  'Afternoon (12:00 PM – 03:00 PM)',
  'Evening (03:00 PM – 06:00 PM)',
  'Flexible / Any Time'
];

export default function SiteVisitForm({ defaultLocation = '' }: SiteVisitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [minDateStr, setMinDateStr] = useState('');

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
      whatsapp: '',
      email: '',
      preferredLocation: defaultLocation || 'K.K. Nagar Extension / Manikandam',
      purpose: 'Build a House',
      projectId: 'Select a Project / Not Sure Yet',
      preferredVisitDate: '',
      preferredTime: 'Morning (09:00 AM – 12:00 PM)',
      budget: '',
      hearAboutUs: '',
      additionalRequirements: '',
      message: '',
      consent: true,
      botField: ''
    }
  });

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dStr = tomorrow.toISOString().split('T')[0];
    setMinDateStr(dStr);
    setValue('preferredVisitDate', dStr);
  }, [setValue]);

  const selectedPurpose = watch('purpose');

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSubmitSuccess(true);
        reset();
      } else {
        setServerError(result.error || 'Failed to submit site visit request. Please call PRATHAP at 9629048171 directly.');
      }
    } catch (err: any) {
      setServerError('Network connection error. Please call PRATHAP at 96290 48171 directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="rounded-2xl border-2 border-[var(--forest)] bg-[var(--card)] p-8 sm:p-10 shadow-lg text-center animate-fadeIn">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="h-9 w-9 text-[var(--forest)]" />
        </div>

        <h3 className="f-display mt-5 text-2xl font-bold text-[var(--ink)]">
          Site Visit Request Received
        </h3>

        <div className="mt-4 rounded-xl bg-[var(--paper)] p-5 text-left border border-[var(--line)]">
          <p className="text-base font-semibold text-[var(--forest)]">
            "Thank you for your enquiry. Our team will contact you shortly to confirm your site visit."
          </p>
          <p className="mt-2 text-sm text-[var(--ink-soft)] leading-relaxed">
            PRATHAP will connect with you directly to understand your property requirements, discuss suitable location options, and coordinate a convenient time for your site inspection.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="tel:9629048171"
            className="btn btn-primary w-full sm:w-auto"
          >
            <Phone className="h-4 w-4 text-[var(--gold-bright)]" />
            <span>Call PRATHAP Directly (96290 48171)</span>
          </a>
          <button
            type="button"
            onClick={() => setSubmitSuccess(false)}
            className="btn btn-outline w-full sm:w-auto"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--card)] p-6 sm:p-9 shadow-md relative">
      {/* 5. Form Heading & Description per prompt */}
      <div className="mb-6 border-b border-[var(--line)] pb-5">
        <h3 className="f-display text-2xl font-bold text-[var(--ink)] sm:text-3xl">
          Book Your Free Site Visit
        </h3>
        <p className="mt-2 text-sm text-[var(--ink-soft)] leading-relaxed">
          Share your details and requirements. We’ll contact you to understand your needs and arrange a suitable site visit.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <div>{serverError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Anti-bot honeypot */}
        <input type="text" {...register('botField')} className="hidden" tabIndex={-1} autoComplete="off" />

        {/* 1. Name */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--ink)] mb-1.5 font-bold">
            Name <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--ink-soft)]">
              <User className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Your full name"
              {...register('name')}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white text-sm text-[var(--ink)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--forest)] ${
                errors.name ? 'border-red-500' : 'border-[var(--line-strong)]'
              }`}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        {/* 2. Mobile Number */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--ink)] mb-1.5 font-bold">
            Mobile Number <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--ink-soft)]">
              <Phone className="h-4 w-4" />
            </span>
            <input
              type="tel"
              placeholder="10-digit mobile number (e.g. 9629048171)"
              {...register('phone')}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white text-sm text-[var(--ink)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--forest)] ${
                errors.phone ? 'border-red-500' : 'border-[var(--line-strong)]'
              }`}
            />
          </div>
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>

        {/* 3. What are you looking for? (Build a House / Investment / Both) */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--ink)] mb-2 font-bold">
            What are you looking for? <span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'Build a House', label: 'Build a House' },
              { id: 'Investment', label: 'Investment' },
              { id: 'Both', label: 'Both' }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setValue('purpose', item.id as any)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                  selectedPurpose === item.id || (selectedPurpose === 'Building a House' && item.id === 'Build a House')
                    ? 'bg-[var(--forest)] text-[#fef9c3] border-[var(--forest)] shadow-xs'
                    : 'bg-white text-[var(--ink)] border-[var(--line-strong)] hover:bg-[var(--paper)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Preferred Location & Preferred Project */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--ink)] mb-1.5 font-bold">
              Preferred Location
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--ink-soft)]">
                <MapPin className="h-4 w-4" />
              </span>
              <select
                {...register('preferredLocation')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--line-strong)] bg-white text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]"
              >
                {TRICHY_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--ink)] mb-1.5 font-bold">
              Preferred Project
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--ink-soft)]">
                <Building2 className="h-4 w-4" />
              </span>
              <select
                {...register('projectId')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--line-strong)] bg-white text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]"
              >
                {PROJECT_CHOICES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 5. Preferred Site Visit Date & Preferred Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--ink)] mb-1.5 font-bold">
              Preferred Site Visit Date
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--ink-soft)]">
                <Calendar className="h-4 w-4" />
              </span>
              <input
                type="date"
                min={minDateStr}
                {...register('preferredVisitDate')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--line-strong)] bg-white text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--ink)] mb-1.5 font-bold">
              Preferred Time
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--ink-soft)]">
                <Clock className="h-4 w-4" />
              </span>
              <select
                {...register('preferredTime')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--line-strong)] bg-white text-sm text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]"
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 6. Your Requirement / Message */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--ink)] mb-1.5 font-bold">
            Your Requirement / Message <span className="text-[var(--ink-soft)] font-normal text-[11px]">(Optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Tell us what you're looking for (e.g. plot size, budget, road preference, or questions)..."
            {...register('message')}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[var(--line-strong)] bg-white text-sm text-[var(--ink)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--forest)]"
          />
        </div>

        {/* 7. Consent per prompt */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="siteVisitConsent"
            {...register('consent')}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--forest)] focus:ring-[var(--forest)] cursor-pointer"
          />
          <label htmlFor="siteVisitConsent" className="text-xs text-[var(--ink-soft)] leading-snug cursor-pointer font-medium">
            I agree to be contacted regarding my property enquiry and site visit.
          </label>
        </div>
        {errors.consent && <p className="text-xs text-red-600">{errors.consent.message}</p>}

        {/* 8. Button: BOOK MY SITE VISIT */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full py-3.5 text-base font-bold shadow-md cursor-pointer disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Submitting Your Request...</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Car className="h-5 w-5 text-[var(--gold-bright)]" />
              <span>BOOK MY SITE VISIT</span>
            </span>
          )}
        </button>

        {/* Direct advisory note */}
        <div className="pt-2 text-center text-xs text-[var(--ink-soft)]">
          <span>Prefer direct consultation? Call </span>
          <a href="tel:9629048171" className="font-bold text-[var(--forest)] hover:underline">
            PRATHAP at 96290 48171
          </a>
        </div>
      </form>
    </div>
  );
}
