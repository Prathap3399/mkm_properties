'use client';

import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Building2,
  Layers,
  MapPin,
  CheckCircle2,
  FileText,
  Upload,
  Phone,
  MessageSquare,
  Printer,
  Copy,
  Check,
  Tag,
  Compass,
  ArrowRight,
  ShieldCheck,
  Edit3,
  Plus,
  ExternalLink,
  Info,
  DollarSign
} from 'lucide-react';

export interface SectionData {
  id: string;
  projectId: string;
  sectionCode: string;
  sectionName: string;
  pricePerSqFt: number;
  roadWidth?: string | null;
  description?: string | null;
}

export interface PlotData {
  id: string;
  projectId: string;
  sectionCode: string;
  plotNumber: string;
  areaSqFt: number;
  dimensions?: string | null;
  facing?: string | null;
  roadWidth?: string | null;
  status: 'Available' | 'Booked' | 'Sold';
  cornerPremiumPercent?: number | null;
  notes?: string | null;
}

export interface ProjectData {
  id: string;
  name: string;
  slug: string;
  location: string;
  priceLabel?: string | null;
  brochureUrl?: string | null;
  priceBrochureUrl?: string | null;
  approvalStatus?: string | null;
  sections: SectionData[];
  plots: PlotData[];
}

// Convert numbers into Indian Lakhs / Crores string representation
function numberToIndianWords(num: number): string {
  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2);
    return `₹${cr} Crores (${cr} Cr)`;
  }
  if (num >= 100000) {
    const lk = (num / 100000).toFixed(2);
    return `₹${lk} Lakhs (${lk} L)`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}

export default function PriceCalculatorClient({
  initialProjects
}: {
  initialProjects: ProjectData[];
}) {
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjects[0]?.id || ''
  );
  const [sectionFilter, setSectionFilter] = useState<string>('ALL');
  const [selectedPlotId, setSelectedPlotId] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Custom calculation state
  const [customSectionCode, setCustomSectionCode] = useState<string>('A');
  const [customAreaSqFt, setCustomAreaSqFt] = useState<number>(1200);
  const [customPlotNo, setCustomPlotNo] = useState<string>('Custom Plot');
  const [customFacing, setCustomFacing] = useState<string>('East Facing');
  const [customCorner, setCustomCorner] = useState<boolean>(false);

  // Calculation output state (set upon submit or selection)
  const [calculatedQuote, setCalculatedQuote] = useState<any | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Manage modals
  const [showBrochureModal, setShowBrochureModal] = useState<boolean>(false);
  const [showSectionEditModal, setShowSectionEditModal] = useState<boolean>(false);
  const [showAddPlotModal, setShowAddPlotModal] = useState<boolean>(false);

  // Upload brochure form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadUrlInput, setUploadUrlInput] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Section price editing state
  const [editingSections, setEditingSections] = useState<Record<string, number>>({});

  // Add plot form state
  const [newPlotData, setNewPlotData] = useState({
    plotNumber: '',
    sectionCode: 'A',
    areaSqFt: 1200,
    dimensions: '30 x 40 ft',
    facing: 'East Facing',
    roadWidth: '30 ft',
    status: 'Available' as const,
    cornerPremiumPercent: 0,
    notes: ''
  });

  // Current active project
  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0] || null;
  }, [projects, selectedProjectId]);

  // Sections for active project
  const currentSections = useMemo(() => {
    return currentProject?.sections || [];
  }, [currentProject]);

  // Plots for active project filtered by section
  const filteredPlots = useMemo(() => {
    if (!currentProject) return [];
    if (sectionFilter === 'ALL') return currentProject.plots;
    return currentProject.plots.filter((p) => p.sectionCode === sectionFilter);
  }, [currentProject, sectionFilter]);

  // Selected plot object
  const currentPlot = useMemo(() => {
    if (!currentProject) return null;
    return currentProject.plots.find((p) => p.id === selectedPlotId) || null;
  }, [currentProject, selectedPlotId]);

  // Execute Price Calculation
  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentProject) return;

    if (isCustomMode) {
      const section = currentSections.find((s) => s.sectionCode === customSectionCode) || currentSections[0];
      const rate = section ? section.pricePerSqFt : 1450;
      const area = Number(customAreaSqFt) || 1200;
      const basePrice = area * rate;
      const cornerPremium = customCorner ? basePrice * 0.05 : 0;
      const totalPrice = Math.round(basePrice + cornerPremium);
      const estRegistration = Math.round(totalPrice * 0.09); // 7% stamp + 2% reg estimate
      const cents = (area / 435.6).toFixed(2);
      const sqMeters = (area * 0.092903).toFixed(2);

      setCalculatedQuote({
        isCustom: true,
        projectName: currentProject.name,
        location: currentProject.location,
        plotNumber: customPlotNo || 'Custom Enquiry',
        sectionCode: customSectionCode,
        sectionName: section ? section.sectionName : `Section ${customSectionCode}`,
        dimensions: `${Math.round(Math.sqrt(area * 1.33))} x ${Math.round(area / Math.sqrt(area * 1.33))} ft approx`,
        areaSqFt: area,
        cents,
        sqMeters,
        facing: customFacing,
        roadWidth: section?.roadWidth || '30 ft',
        status: 'Available',
        pricePerSqFt: rate,
        basePrice,
        cornerPremium,
        totalPrice,
        words: numberToIndianWords(totalPrice),
        estRegistration,
        brochureUrl: currentProject.priceBrochureUrl || currentProject.brochureUrl
      });
      return;
    }

    if (!currentPlot) {
      alert('Please select a plot number to calculate.');
      return;
    }

    const section = currentSections.find((s) => s.sectionCode === currentPlot.sectionCode);
    const rate = section ? section.pricePerSqFt : 1450;
    const basePrice = currentPlot.areaSqFt * rate;
    const cornerRate = (currentPlot.cornerPremiumPercent || 0) / 100;
    const cornerPremium = basePrice * cornerRate;
    const totalPrice = Math.round(basePrice + cornerPremium);
    const estRegistration = Math.round(totalPrice * 0.09);
    const cents = (currentPlot.areaSqFt / 435.6).toFixed(2);
    const sqMeters = (currentPlot.areaSqFt * 0.092903).toFixed(2);

    setCalculatedQuote({
      isCustom: false,
      plotId: currentPlot.id,
      projectName: currentProject.name,
      location: currentProject.location,
      plotNumber: `Plot #${currentPlot.plotNumber}`,
      sectionCode: currentPlot.sectionCode,
      sectionName: section ? section.sectionName : `Section ${currentPlot.sectionCode}`,
      dimensions: currentPlot.dimensions || '30 x 40 ft',
      areaSqFt: currentPlot.areaSqFt,
      cents,
      sqMeters,
      facing: currentPlot.facing || 'East Facing',
      roadWidth: currentPlot.roadWidth || section?.roadWidth || '30 ft',
      status: currentPlot.status,
      pricePerSqFt: rate,
      basePrice,
      cornerPremium,
      totalPrice,
      words: numberToIndianWords(totalPrice),
      estRegistration,
      notes: currentPlot.notes,
      brochureUrl: currentProject.priceBrochureUrl || currentProject.brochureUrl
    });
  };

  // Copy Quotation Text to Clipboard
  const handleCopyQuote = () => {
    if (!calculatedQuote) return;
    const text = `*MKM PROPERTIES — OFFICIAL PLOT QUOTATION*\n` +
      `-------------------------------------------\n` +
      `*Project:* ${calculatedQuote.projectName}\n` +
      `*Location:* ${calculatedQuote.location}\n` +
      `*Plot Number:* ${calculatedQuote.plotNumber}\n` +
      `*Section:* ${calculatedQuote.sectionName} (${calculatedQuote.sectionCode})\n` +
      `*Plot Size:* ${calculatedQuote.areaSqFt} sq.ft (${calculatedQuote.cents} Cents / ${calculatedQuote.sqMeters} sq.m)\n` +
      `*Dimensions:* ${calculatedQuote.dimensions}\n` +
      `*Facing:* ${calculatedQuote.facing} | *Road:* ${calculatedQuote.roadWidth}\n` +
      `*Availability:* ${calculatedQuote.status}\n` +
      `-------------------------------------------\n` +
      `*Rate:* ₹${calculatedQuote.pricePerSqFt.toLocaleString('en-IN')} / sq.ft\n` +
      (calculatedQuote.cornerPremium > 0 ? `*Corner Premium:* ₹${calculatedQuote.cornerPremium.toLocaleString('en-IN')}\n` : '') +
      `*TOTAL LAND PRICE:* ₹${calculatedQuote.totalPrice.toLocaleString('en-IN')} (${calculatedQuote.words})\n` +
      `*Est. Registration & Stamp Duty (9%):* ~₹${calculatedQuote.estRegistration.toLocaleString('en-IN')}\n` +
      `*Brokerage:* ₹0 (Zero Commission / Direct Promoter Rate)\n` +
      `-------------------------------------------\n` +
      `Advisor: PRATHAP — +91 96290 48171\n` +
      `Tiruchirappalli, Tamil Nadu`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Print Quote
  const handlePrint = () => {
    window.print();
  };

  // Handle Brochure Upload Submit
  const handleBrochureUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;
    setIsUploading(true);

    try {
      if (uploadFile) {
        const formData = new FormData();
        formData.append('projectId', currentProject.id);
        formData.append('file', uploadFile);

        const res = await fetch('/api/admin/calculator/upload-brochure', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');

        // Update local project
        setProjects((prev) =>
          prev.map((p) =>
            p.id === currentProject.id ? { ...p, priceBrochureUrl: data.brochureUrl, brochureUrl: data.brochureUrl } : p
          )
        );
      } else if (uploadUrlInput) {
        const res = await fetch('/api/admin/calculator/upload-brochure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: currentProject.id, brochureUrl: uploadUrlInput })
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');

        setProjects((prev) =>
          prev.map((p) =>
            p.id === currentProject.id ? { ...p, priceBrochureUrl: uploadUrlInput, brochureUrl: uploadUrlInput } : p
          )
        );
      }
      setShowBrochureModal(false);
      setUploadFile(null);
      setUploadUrlInput('');
      alert('Price brochure updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Error uploading brochure');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Section Rates Save
  const handleSaveSectionRates = async () => {
    if (!currentProject) return;
    try {
      for (const section of currentSections) {
        const newRate = editingSections[section.sectionCode];
        if (newRate !== undefined && newRate !== section.pricePerSqFt) {
          await fetch('/api/admin/calculator/sections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectId: currentProject.id,
              sectionCode: section.sectionCode,
              pricePerSqFt: newRate,
              sectionName: section.sectionName,
              roadWidth: section.roadWidth,
              description: section.description
            })
          });
        }
      }

      // Refresh local projects
      const res = await fetch('/api/admin/calculator');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
      setShowSectionEditModal(false);
      alert('Section price tags updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Error updating section rates');
    }
  };

  // Handle Add Plot Submit
  const handleAddPlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    try {
      const res = await fetch('/api/admin/calculator/plots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: currentProject.id,
          ...newPlotData
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to add plot');

      // Refresh projects
      const r = await fetch('/api/admin/calculator');
      const d = await r.json();
      if (d.success) {
        setProjects(d.projects);
      }

      setShowAddPlotModal(false);
      setNewPlotData({
        plotNumber: '',
        sectionCode: 'A',
        areaSqFt: 1200,
        dimensions: '30 x 40 ft',
        facing: 'East Facing',
        roadWidth: '30 ft',
        status: 'Available',
        cornerPremiumPercent: 0,
        notes: ''
      });
      alert('New plot added successfully to layout!');
    } catch (err: any) {
      alert(err.message || 'Error adding plot');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Actions Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-[#06281d] via-[#0b4632] to-[#12211a] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-900/50">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/80 px-3 py-1 text-xs font-mono font-semibold text-emerald-200 mb-3 border border-emerald-700/50">
            <Calculator className="h-3.5 w-3.5 text-[#c59b27]" />
            <span>MKM Layout Price Calculator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Plot Information &amp; Price Calculator
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl">
            Select a project and plot number to instantly generate the plot specifications, section price tag breakdown, and total quote.
          </p>
        </div>

        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              const initial: Record<string, number> = {};
              currentSections.forEach((s) => {
                initial[s.sectionCode] = s.pricePerSqFt;
              });
              setEditingSections(initial);
              setShowSectionEditModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-colors cursor-pointer"
          >
            <Tag className="h-3.5 w-3.5 text-[#c59b27]" />
            <span>Edit Section Rates</span>
          </button>

          <button
            onClick={() => setShowAddPlotModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-[#c59b27]" />
            <span>Add Plot</span>
          </button>

          <button
            onClick={() => setShowBrochureModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#c59b27] hover:bg-[#b0881e] text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Price Brochure</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="h-4 w-4 text-[#0b4632]" />
              <span>Select Project &amp; Plot</span>
            </h2>

            {/* 1. Choose Project Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Choose Project <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  setSelectedPlotId('');
                  setCalculatedQuote(null);
                }}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#0b4632] focus:bg-white focus:outline-hidden"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name} — {proj.location}
                  </option>
                ))}
              </select>

              {currentProject && (
                <div className="flex items-center justify-between gap-2 pt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                    <span>{currentProject.location}</span>
                  </span>
                  {currentProject.priceBrochureUrl && (
                    <a
                      href={currentProject.priceBrochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0b4632] font-semibold hover:underline flex items-center gap-1 shrink-0"
                    >
                      <span>Brochure</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* 2. Layout Section Tags Ribbon */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Layout Sections &amp; Price Tags
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  {currentSections.length} Sections Defined
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {currentSections.map((sec) => (
                  <div
                    key={sec.sectionCode}
                    className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-emerald-900 text-white text-[10px] font-black px-1.5 py-0.5">
                          SEC {sec.sectionCode}
                        </span>
                        <span className="text-[10px] text-emerald-800 font-mono">
                          {sec.roadWidth || '30 ft'}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 block mt-1 line-clamp-1" title={sec.sectionName}>
                        {sec.sectionName}
                      </span>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-emerald-200/60 flex items-baseline justify-between">
                      <span className="text-[10px] text-slate-500 font-medium">Rate:</span>
                      <span className="text-xs font-black text-[#0b4632] font-mono">
                        ₹{sec.pricePerSqFt.toLocaleString('en-IN')}<span className="text-[10px] font-normal">/sqft</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggle: Select Pre-configured Plot vs Custom Area */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-700">Mode:</span>
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    !isCustomMode ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Layout Plots ({filteredPlots.length})
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(true)}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    isCustomMode ? 'bg-white font-bold text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Custom Area
                </button>
              </div>
            </div>

            {/* Mode A: Select Plot Number */}
            {!isCustomMode ? (
              <div className="space-y-3">
                {/* Section filter tabs */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setSectionFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      sectionFilter === 'ALL'
                        ? 'bg-[#0b4632] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({currentProject?.plots.length || 0})
                  </button>
                  {currentSections.map((s) => (
                    <button
                      key={s.sectionCode}
                      type="button"
                      onClick={() => setSectionFilter(s.sectionCode)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        sectionFilter === s.sectionCode
                          ? 'bg-[#0b4632] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Sec {s.sectionCode}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    2. Select Plot Number <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedPlotId}
                    onChange={(e) => {
                      setSelectedPlotId(e.target.value);
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#0b4632] focus:bg-white focus:outline-hidden"
                  >
                    <option value="">-- Choose a Plot Number --</option>
                    {filteredPlots.map((plot) => (
                      <option key={plot.id} value={plot.id}>
                        Plot #{plot.plotNumber} — Sec {plot.sectionCode} ({plot.areaSqFt} sq.ft | {plot.facing} | {plot.status})
                      </option>
                    ))}
                  </select>
                </div>

                {currentPlot && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">Plot #{currentPlot.plotNumber} Details:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        currentPlot.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                        currentPlot.status === 'Booked' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {currentPlot.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                      <div>Dimensions: <strong>{currentPlot.dimensions || 'Standard'}</strong></div>
                      <div>Area: <strong>{currentPlot.areaSqFt} sq.ft</strong></div>
                      <div>Facing: <strong>{currentPlot.facing}</strong></div>
                      <div>Road: <strong>{currentPlot.roadWidth || '30 ft'}</strong></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Mode B: Custom Dimensions / Area */
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700">Section Tag</label>
                    <select
                      value={customSectionCode}
                      onChange={(e) => setCustomSectionCode(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-800"
                    >
                      {currentSections.map((s) => (
                        <option key={s.sectionCode} value={s.sectionCode}>
                          Sec {s.sectionCode} (₹{s.pricePerSqFt}/sqft)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700">Plot Identifier</label>
                    <input
                      type="text"
                      value={customPlotNo}
                      onChange={(e) => setCustomPlotNo(e.target.value)}
                      placeholder="e.g. Plot 15A"
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700">Total Area (sq.ft)</label>
                    <input
                      type="number"
                      value={customAreaSqFt}
                      onChange={(e) => setCustomAreaSqFt(Number(e.target.value))}
                      min={100}
                      step={50}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700">Facing</label>
                    <select
                      value={customFacing}
                      onChange={(e) => setCustomFacing(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-semibold text-slate-800"
                    >
                      <option value="East Facing">East Facing</option>
                      <option value="North Facing">North Facing</option>
                      <option value="South Facing">South Facing</option>
                      <option value="West Facing">West Facing</option>
                      <option value="Corner East-North">Corner East-North</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customCorner}
                    onChange={(e) => setCustomCorner(e.target.checked)}
                    className="rounded text-[#0b4632]"
                  />
                  <span>Corner Plot (+5% corner location surcharge)</span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={() => handleCalculate()}
              className="w-full py-3.5 px-6 rounded-xl bg-[#0b4632] hover:bg-[#073022] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Calculator className="h-4 w-4 text-[#c59b27]" />
              <span>Calculate Plot Information &amp; Price</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Output Quotation & Plot Specs */}
        <div className="lg:col-span-7">
          {calculatedQuote ? (
            <div className="space-y-6">
              {/* Official Quotation Card (Printable) */}
              <div
                id="quotation-print-area"
                className="bg-white rounded-2xl border-2 border-emerald-900/30 p-6 sm:p-8 shadow-lg space-y-6 relative overflow-hidden"
              >
                {/* Header Strip with MKM Branding */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0b4632] text-[#fef9c3] flex items-center justify-center font-black text-xl shadow-md border-2 border-[#c59b27]">
                      MKM
                    </div>
                    <div>
                      <span className="font-extrabold text-lg text-slate-900 block leading-tight">
                        MKM Properties · Trichy
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Official Layout Plot Valuation &amp; Quotation
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 inline-block">
                      {calculatedQuote.plotNumber}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-1 font-mono">
                      Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Section A: Plot Information Grid */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    1. Plot Information &amp; Layout Specifications
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">Project</span>
                      <strong className="text-xs sm:text-sm text-slate-900 block mt-0.5 truncate" title={calculatedQuote.projectName}>
                        {calculatedQuote.projectName}
                      </strong>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">Section / Zone</span>
                      <strong className="text-xs sm:text-sm text-slate-900 block mt-0.5 truncate">
                        Sec {calculatedQuote.sectionCode} ({calculatedQuote.roadWidth})
                      </strong>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">Dimensions</span>
                      <strong className="text-xs sm:text-sm text-slate-900 block mt-0.5 font-mono">
                        {calculatedQuote.dimensions}
                      </strong>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">Total Area</span>
                      <strong className="text-xs sm:text-sm text-[#0b4632] block mt-0.5 font-mono">
                        {calculatedQuote.areaSqFt} sq.ft ({calculatedQuote.cents} Cts)
                      </strong>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">Orientation</span>
                      <strong className="text-xs sm:text-sm text-slate-900 block mt-0.5">
                        {calculatedQuote.facing}
                      </strong>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">Status</span>
                      <strong className="text-xs sm:text-sm text-emerald-800 block mt-0.5">
                        {calculatedQuote.status}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Section B: Financial & Price Tag Breakdown */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    2. Price Calculation &amp; Cost Breakdown
                  </h3>

                  <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                    <div className="flex justify-between p-3 bg-slate-50 border-b border-slate-200">
                      <span className="text-slate-600 font-medium">
                        Section {calculatedQuote.sectionCode} Rate (Price Tag):
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        ₹{calculatedQuote.pricePerSqFt.toLocaleString('en-IN')} / sq.ft
                      </span>
                    </div>

                    <div className="flex justify-between p-3 bg-white border-b border-slate-200">
                      <span className="text-slate-600">
                        Base Land Cost ({calculatedQuote.areaSqFt} sq.ft × ₹{calculatedQuote.pricePerSqFt}):
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        ₹{calculatedQuote.basePrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {calculatedQuote.cornerPremium > 0 && (
                      <div className="flex justify-between p-3 bg-amber-50/50 border-b border-slate-200 text-amber-900">
                        <span>Corner Facing Location Surcharge:</span>
                        <span className="font-mono font-bold">
                          +₹{calculatedQuote.cornerPremium.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between p-3 bg-white border-b border-slate-200 text-slate-600">
                      <span>Brokerage / Agent Commission:</span>
                      <span className="font-bold text-emerald-700">₹0 (100% Free / Direct Promoter)</span>
                    </div>

                    {/* Total Final Price Banner */}
                    <div className="p-4 bg-emerald-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#c59b27] font-bold block">
                          Total Plot Price
                        </span>
                        <span className="text-xs text-emerald-200 block font-medium">
                          {calculatedQuote.words}
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black font-mono text-[#fef9c3]">
                        ₹{calculatedQuote.totalPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section C: Registration Guidance & Compliance */}
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <ShieldCheck className="h-4 w-4 text-[#0b4632]" />
                    <span>Tamil Nadu Statutory Registration Estimate (Guide Value):</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Tamil Nadu guideline stamp duty (7%) &amp; registration fee (2%) estimated at approx{' '}
                    <strong className="text-slate-900 font-mono">
                      ~₹{calculatedQuote.estRegistration.toLocaleString('en-IN')}
                    </strong>{' '}
                    payable directly at the Sub-Registrar Office (SRO) upon registration.
                  </p>
                </div>

                {/* Footer Note */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
                  <div>
                    Senior Advisor: <strong>PRATHAP (+91 96290 48171)</strong>
                  </div>
                  {calculatedQuote.brochureUrl && (
                    <a
                      href={calculatedQuote.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0b4632] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Download Project Price Brochure</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Toolbar on Generated Quote */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyQuote}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs hover:border-[#0b4632] hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? 'Quotation Copied!' : 'Copy WhatsApp Quote'}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `*MKM PROPERTIES — PLOT QUOTATION*\n` +
                    `Project: ${calculatedQuote.projectName}\n` +
                    `Plot: ${calculatedQuote.plotNumber} (Section ${calculatedQuote.sectionCode})\n` +
                    `Area: ${calculatedQuote.areaSqFt} sq.ft (${calculatedQuote.cents} Cents)\n` +
                    `Price: ₹${calculatedQuote.totalPrice.toLocaleString('en-IN')} (${calculatedQuote.words})\n` +
                    `Advisor: PRATHAP (96290 48171)`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs hover:bg-[#20ba59] transition-colors shadow-xs"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Send to WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Quotation Sheet</span>
                </button>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#0b4632] flex items-center justify-center mx-auto">
                <Calculator className="h-8 w-8 text-[#0b4632]" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Ready to Calculate Plot Price
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select a project and plot number from the left panel, then click <strong>Calculate Plot Information &amp; Price</strong> to generate the comprehensive specification card and price quotation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ====================================================================
          MODAL 1: Upload Project Brochure / Price Sheet
          ==================================================================== */}
      {showBrochureModal && currentProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upload Project Price Brochure</h3>
                <p className="text-xs text-slate-500 mt-0.5">Project: {currentProject.name}</p>
              </div>
              <button
                onClick={() => setShowBrochureModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBrochureUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Option 1: Upload PDF / Image File
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-[#0b4632] hover:file:bg-emerald-100"
                />
              </div>

              <div className="text-center text-xs text-slate-400 font-bold uppercase">— OR —</div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Option 2: Enter Existing Document URL / Path
                </label>
                <input
                  type="text"
                  placeholder="/brochures/mkm-sterling-avenue-brochure.pdf"
                  value={uploadUrlInput}
                  onChange={(e) => setUploadUrlInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800"
                />
              </div>

              {currentProject.priceBrochureUrl && (
                <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600">
                  Current file: <strong>{currentProject.priceBrochureUrl}</strong>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBrochureModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-xl bg-[#0b4632] hover:bg-[#073022] text-white font-bold text-xs shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Save & Link to Calculator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: Edit Section Rates
          ==================================================================== */}
      {showSectionEditModal && currentProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Section Price Tags</h3>
                <p className="text-xs text-slate-500 mt-0.5">Project: {currentProject.name}</p>
              </div>
              <button
                onClick={() => setShowSectionEditModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {currentSections.map((sec) => (
                <div key={sec.sectionCode} className="p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-900">
                      Section {sec.sectionCode} — {sec.sectionName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{sec.roadWidth}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 font-medium">Rate per sq.ft (₹):</span>
                    <input
                      type="number"
                      value={editingSections[sec.sectionCode] ?? sec.pricePerSqFt}
                      onChange={(e) =>
                        setEditingSections({
                          ...editingSections,
                          [sec.sectionCode]: Number(e.target.value)
                        })
                      }
                      className="w-32 rounded-lg border border-slate-300 p-1.5 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSectionEditModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSectionRates}
                className="px-5 py-2.5 rounded-xl bg-[#0b4632] hover:bg-[#073022] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Save New Section Rates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: Add New Plot
          ==================================================================== */}
      {showAddPlotModal && currentProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Plot to Layout</h3>
                <p className="text-xs text-slate-500 mt-0.5">Project: {currentProject.name}</p>
              </div>
              <button
                onClick={() => setShowAddPlotModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPlot} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Plot Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 25"
                    value={newPlotData.plotNumber}
                    onChange={(e) => setNewPlotData({ ...newPlotData, plotNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Tag *</label>
                  <select
                    value={newPlotData.sectionCode}
                    onChange={(e) => setNewPlotData({ ...newPlotData, sectionCode: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800 font-semibold"
                  >
                    {currentSections.map((s) => (
                      <option key={s.sectionCode} value={s.sectionCode}>
                        Section {s.sectionCode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Area (sq.ft) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={newPlotData.areaSqFt}
                    onChange={(e) => setNewPlotData({ ...newPlotData, areaSqFt: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dimensions</label>
                  <input
                    type="text"
                    placeholder="30 x 40 ft"
                    value={newPlotData.dimensions}
                    onChange={(e) => setNewPlotData({ ...newPlotData, dimensions: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Facing</label>
                  <select
                    value={newPlotData.facing}
                    onChange={(e) => setNewPlotData({ ...newPlotData, facing: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800"
                  >
                    <option value="East Facing">East Facing</option>
                    <option value="North Facing">North Facing</option>
                    <option value="South Facing">South Facing</option>
                    <option value="West Facing">West Facing</option>
                    <option value="Corner (East-North)">Corner (East-North)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={newPlotData.status}
                    onChange={(e) => setNewPlotData({ ...newPlotData, status: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-300 p-2 text-xs text-slate-800"
                  >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddPlotModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0b4632] hover:bg-[#073022] text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Add Plot to Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
