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
  Car,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Tag
} from 'lucide-react';
import { EnquirySchema, type EnquiryFormData } from '@/lib/validation/enquiry';

interface SiteVisitFormProps {
  defaultLocation?: string;
  isCompact?: boolean;
}

const TRICHY_LOCATIONS = [
  'Panjappur (New Integrated Bus Terminal)',
  'K.K. Nagar Extension / Manikandam',
  'Samayapuram / NH-45 Corridor',
  'Navalpattu (ELCOT IT Park Road)',
  'Thiruverumbur / BHEL / NIT Belt',
  'Vayalur Road / Somarasampettai',
  'Other / Open to Suggestions'
];

const BUDGET_OPTIONS = [
  'Under ₹15 Lakhs',
  '₹15 Lakhs – ₹30 Lakhs',
  '₹30 Lakhs – ₹50 Lakhs',
  'Above ₹50 Lakhs'
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
      preferredLocation: defaultLocation || 'Panjappur (New Integrated Bus Terminal)',
      purpose: 'Build a House',
      projectId: '',
      preferredVisitDate: '',
      preferredTime: 'Morning (09:00 AM – 12:00 PM)',
      budget: '₹15 Lakhs – ₹30 Lakhs',
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
        setServerError(
          result.error || 'Failed to submit site visit request. Please call PRATHAP directly at +91 96290 48171.'
        );
      }
    } catch (err: any) {
      setServerError('Network connection error. Please call PRATHAP at +91 96290 48171 directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-8 sm:p-10 shadow-lg text-center animate-fadeIn">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-slate-900 mt-5">
          Site Visit Request Confirmed
        </h3>

        <div className="mt-4 rounded-xl bg-slate-50 p-6 text-left border border-slate-200 space-y-3">
          <p className="text-base font-semibold text-[#0B271F]">
            "Thank you for your enquiry. Our property advisor PRATHAP will contact you shortly to confirm your site visit arrangements."
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            We will coordinate your private cab pickup in Trichy, verify your preferred layout choices, and walk the boundary stones together with your family. Zero fees, zero brokerage.
          </p>
        </div>

        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <a
            href="https://wa.me/919629048171?text=Hello%20PRATHAP,%20I%20just%20submitted%20a%20site%20visit%20request%20on%20the%20website%20and%20would%20like%20to%20confirm."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa w-full sm:w-auto"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Confirm on WhatsApp (Instant)</span>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-9 shadow-md relative">
      {/* Heading & Supporting text per prompt Section 11 */}
      <div className="mb-6 border-b border-slate-100 pb-5">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#C2922E] block mb-1">
          Complimentary Guided Inspection
        </span>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Plan Your Site Visit
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Tell us what you're looking for. Our property advisor will help you identify suitable options and arrange a convenient site visit.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <div>{serverError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Anti-bot honeypot */}
        <input type="text" {...register('botField')} className="hidden" tabIndex={-1} autoComplete="off" />

        {/* 1. Name & Mobile Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="e.g. S. Prathap"
                {...register('name')}
                className={`field !pl-10 ${errors.name ? 'field-error' : ''}`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="h-4 w-4" />
              </span>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                {...register('phone')}
                className={`field !pl-10 ${errors.phone ? 'field-error' : ''}`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* 2. WhatsApp Number & Purpose */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">
              WhatsApp Number <span className="text-slate-400 font-normal text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MessageSquare className="h-4 w-4" />
              </span>
              <input
                type="tel"
                placeholder="Same as mobile or different"
                {...register('whatsapp')}
                className="field !pl-10"
              />
            </div>
          </div>

          <div>
            <label className="label">
              Purpose <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'Build a House', label: 'Build Home' },
                { value: 'Investment', label: 'Investment' },
                { value: 'Both', label: 'Both' }
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setValue('purpose', item.value as any)}
                  className={`py-2.5 px-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    selectedPurpose === item.value
                      ? 'bg-[#0B271F] border-[#0B271F] text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Preferred Location & Budget Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">
              Preferred Location
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="h-4 w-4" />
              </span>
              <select {...register('preferredLocation')} className="field !pl-10 appearance-none bg-white cursor-pointer">
                {TRICHY_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">
              Budget Range
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Tag className="h-4 w-4" />
              </span>
              <select {...register('budget')} className="field !pl-10 appearance-none bg-white cursor-pointer">
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4. Preferred Visit Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">
              Preferred Visit Date
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar className="h-4 w-4" />
              </span>
              <input
                type="date"
                min={minDateStr}
                {...register('preferredVisitDate')}
                className="field !pl-10 bg-white cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="label">
              Preferred Time
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Clock className="h-4 w-4" />
              </span>
              <select {...register('preferredTime')} className="field !pl-10 appearance-none bg-white cursor-pointer">
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 5. Message / Specific Requirements */}
        <div>
          <label className="label">
            Specific Requirements / Questions <span className="text-slate-400 font-normal text-xs">(Optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Tell us what you're looking for (e.g. plot size, facing direction, immediate construction timeline...)"
            {...register('message')}
            className="field resize-none"
          />
        </div>

        {/* 6. Consent */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('consent')}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0B271F] focus:ring-[#0B271F] cursor-pointer"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              I agree to be contacted by MKM Properties regarding my property inquiry and site visit coordination. We respect your privacy — no promotional spam.
            </span>
          </label>
          {errors.consent && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.consent.message}</p>
          )}
        </div>

        {/* 7. Submit Button per prompt Section 11 */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full py-3.5 text-base font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Submitting Your Request...</span>
              </>
            ) : (
              <>
                <Car className="h-5 w-5 text-[#D9A838]" />
                <span>Request Site Visit</span>
              </>
            )}
          </button>
        </div>

        {/* Value Reassurance */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Free Private Cab Pickup
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Zero Brokerage / Direct Rates
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Verified Approvals
          </span>
        </div>
      </form>
    </div>
  );
}
