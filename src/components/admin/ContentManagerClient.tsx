'use client';

import React, { useState } from 'react';
import {
  FileEdit,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Phone,
  FileText,
  Info
} from 'lucide-react';
import type { SiteContentRecord } from '@/lib/db/repository';

interface Props {
  initialContents: SiteContentRecord[];
}

export default function ContentManagerClient({ initialContents }: Props) {
  const [contents, setContents] = useState<SiteContentRecord[]>(initialContents);
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'homepage'>('about');
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form values mapped by key
  const getContentValue = (key: string, defaultVal = '') => {
    const item = contents.find((c) => c.key === key);
    return item ? item.content : defaultVal;
  };

  const [aboutCompany, setAboutCompany] = useState(
    getContentValue(
      'about_company',
      'MKM Properties is a customer-first property advisory based in Trichy, Tamil Nadu. We believe buying residential land should be grounded in total clarity, verified legal documentation, and on-ground inspection rather than high-pressure sales tactics.'
    )
  );

  const [aboutCommitment, setAboutCommitment] = useState(
    getContentValue(
      'about_commitment',
      '1. Transparent Direct Promoter Pricing with zero hidden brokerage.\n2. 100% Verified Legal Documents & DTCP/RERA approvals.\n3. Complimentary Guided Round-Trip Site Visit.\n4. Potable Water & Soil Ground Inspection before any financial commitment.\n5. Post-purchase assistance for Patta transfer and plan sanctions.'
    )
  );

  const [heroHeadline, setHeroHeadline] = useState(
    getContentValue('hero_headline', 'Find the Right Property. Visit Before You Decide.')
  );

  const [heroSubtext, setHeroSubtext] = useState(
    getContentValue(
      'hero_subtext',
      'Explore carefully selected residential plots and make your property decision with clarity and confidence.'
    )
  );

  const [contactPhone, setContactPhone] = useState('9629048171');
  const [contactWhatsApp, setContactWhatsApp] = useState('9629048171');
  const [contactAddress, setContactAddress] = useState(
    'No. 14, Royal Tower, Cantonment / K.K. Nagar Road, Tiruchirappalli - 620001, Tamil Nadu'
  );
  const [businessHours, setBusinessHours] = useState('Monday – Sunday: 8:00 AM – 8:00 PM');

  const saveContentItem = async (key: string, title: string, content: string) => {
    setSavingKey(key);
    setSaveSuccess(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, title, content })
      });
      const data = await res.json();
      if (data.success && data.content) {
        setContents((prev) => {
          const idx = prev.findIndex((c) => c.key === key);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = data.content;
            return next;
          }
          return [...prev, data.content];
        });
        setSaveSuccess(`Updated "${title}" successfully`);
        setTimeout(() => setSaveSuccess(null), 3500);
      } else {
        setErrorMsg(data.error || 'Failed to update content');
      }
    } catch (err: any) {
      setErrorMsg('Error saving content');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'about', label: 'Who We Are (About Us)' },
          { id: 'homepage', label: 'Homepage Hero & Messaging' },
          { id: 'contact', label: 'Contact & Office Details' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#0b4632] text-[#fef9c3] shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 text-xs text-emerald-900 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl border border-red-300 bg-red-50 text-xs text-red-900 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-700" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tab 1: About Us Content */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Company Introduction &amp; Philosophy</h3>
            <p className="text-xs text-slate-500">
              Displayed in the "Who We Are" page and public landing section.
            </p>
            <textarea
              rows={6}
              value={aboutCompany}
              onChange={(e) => setAboutCompany(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 leading-relaxed focus:ring-2 focus:ring-[#0b4632]"
            />
            <button
              type="button"
              onClick={() => saveContentItem('about_company', 'Company Philosophy', aboutCompany)}
              disabled={savingKey === 'about_company'}
              className="btn btn-primary btn-sm text-xs cursor-pointer"
            >
              {savingKey === 'about_company' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Company Philosophy</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">5-Point Customer Commitment</h3>
            <p className="text-xs text-slate-500">
              The buyer assurance points emphasized during site visits.
            </p>
            <textarea
              rows={6}
              value={aboutCommitment}
              onChange={(e) => setAboutCommitment(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 leading-relaxed font-mono focus:ring-2 focus:ring-[#0b4632]"
            />
            <button
              type="button"
              onClick={() => saveContentItem('about_commitment', '5-Point Commitment', aboutCommitment)}
              disabled={savingKey === 'about_commitment'}
              className="btn btn-primary btn-sm text-xs cursor-pointer"
            >
              {savingKey === 'about_commitment' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save 5-Point Commitment</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Homepage Messaging */}
      {activeTab === 'homepage' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 max-w-2xl">
          <h3 className="font-extrabold text-base text-slate-900">Site Visit Landing Hero Text</h3>
          <p className="text-xs text-slate-500">
            Control the primary headline and supporting copy on the public index screen.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary Hero Headline</label>
              <input
                type="text"
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Supporting Description</label>
              <textarea
                rows={3}
                value={heroSubtext}
                onChange={(e) => setHeroSubtext(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 leading-relaxed"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await saveContentItem('hero_headline', 'Hero Headline', heroHeadline);
              await saveContentItem('hero_subtext', 'Hero Supporting Text', heroSubtext);
            }}
            disabled={savingKey !== null}
            className="btn btn-primary btn-sm text-xs cursor-pointer"
          >
            {savingKey ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Homepage Hero Settings</span>
          </button>
        </div>
      )}

      {/* Tab 3: Contact & Office */}
      {activeTab === 'contact' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 max-w-2xl">
          <h3 className="font-extrabold text-base text-slate-900">Office &amp; Advisor Details</h3>
          <p className="text-xs text-slate-500">
            Official contact details displayed on the Contact page, Footer, and Header buttons.
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Advisor Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                value={contactWhatsApp}
                onChange={(e) => setContactWhatsApp(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-800"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Office Location Address</label>
              <input
                type="text"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Business Hours</label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              saveContentItem(
                'contact_info',
                'Contact Details',
                JSON.stringify({
                  businessName: 'MKM Properties',
                  contactPerson: 'PRATHAP (Senior Property Advisor)',
                  phone: contactPhone,
                  whatsapp: contactWhatsApp,
                  address: contactAddress,
                  businessHours
                })
              )
            }
            disabled={savingKey === 'contact_info'}
            className="btn btn-primary btn-sm text-xs cursor-pointer"
          >
            {savingKey === 'contact_info' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Contact Information</span>
          </button>
        </div>
      )}
    </div>
  );
}
