import { z } from 'zod';

// Indian phone number normalization helper
export function normalizeIndianPhone(input: string): string | null {
  if (!input) return null;
  const digitsOnly = input.replace(/\D/g, '');

  if (digitsOnly.length === 10 && /^[6-9]\d{9}$/.test(digitsOnly)) {
    return `+91${digitsOnly}`;
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0') && /^[6-9]/.test(digitsOnly.slice(1))) {
    return `+91${digitsOnly.slice(1)}`;
  }
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91') && /^[6-9]/.test(digitsOnly.slice(2))) {
    return `+91${digitsOnly.slice(2)}`;
  }

  return null;
}

export const EnquirySchema = z.object({
  name: z.string().trim().min(2, 'Full Name must be at least 2 characters').max(60, 'Name cannot exceed 60 characters'),
  phone: z.string().trim().refine((val) => normalizeIndianPhone(val) !== null, {
    message: 'Please provide a valid 10-digit mobile number (e.g. 9629048171)'
  }),
  whatsapp: z.string().trim().optional().or(z.literal('')),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  preferredLocation: z.string().trim().optional().or(z.literal('')),
  purpose: z.enum(['Building a House', 'Investment', 'Both', 'Build a House']),
  preferredVisitDate: z.string().trim().optional().or(z.literal('')),
  preferredTime: z.string().trim().optional().or(z.literal('')),
  purchaseTimeline: z.string().trim().optional().or(z.literal('')),
  budget: z.string().trim().optional().or(z.literal('')),
  hearAboutUs: z.string().trim().optional().or(z.literal('')),
  additionalRequirements: z.string().trim().max(1000, 'Requirements cannot exceed 1000 characters').optional().or(z.literal('')),
  projectId: z.string().trim().optional().or(z.literal('')),
  message: z.string().trim().max(1000).optional().or(z.literal('')),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Please accept consent to coordinate site visit inspection'
  }),
  // Anti-bot honeypot field
  botField: z.string().optional().or(z.literal('')),
  // Campaign & attribution
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
  privacyPolicyVersion: z.string().optional()
});

export type EnquiryFormData = z.infer<typeof EnquirySchema>;
