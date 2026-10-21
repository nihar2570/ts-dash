import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  Users,
  Download,
  Copy,
  Check,
  FileText,
  Layers,
  Sparkles,
  Printer,
  ChevronLeft,
  ChevronRight,
  Home,
  Shield,
  Fingerprint,
} from 'lucide-react';
import type { ElectorRecord, BoothVoterRollSummary } from '../data/voterRollService';
import { fetchBoothVoters } from '../data/voterRollService';
import {
  predictCaste,
  predictHouseholdCaste,
  type CasteCategory,
  type CastePrediction,
} from '../data/casteClassifierService';

export interface BoothVoterRollModalProps {
  isOpen: boolean;
  onClose: () => void;
  acNo: number;
  acName: string;
  district: string;
  boothNo: number;
  boothName: string;
  mandalName: string;
  electorateCount?: number;
  form20Margin?: number;
  leadParty?: string;
  triage?: 'fortress' | 'battleground' | 'vulnerable' | 'hostile';
}

export const BoothVoterRollModal: React.FC<BoothVoterRollModalProps> = ({
  isOpen,
  onClose,
  acNo,
  acName,
  district,
  boothNo,
  boothName,
  mandalName,
  electorateCount = 840,
  form20Margin = 0,
  leadParty = 'BJP',
  triage = 'battleground',
}) => {
  const [data, setData] = useState<BoothVoterRollSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'M' | 'F'>('ALL');
  const [ageCohort, setAgeCohort] = useState<'ALL' | '18-25' | '26-40' | '41-60' | '60+'>('ALL');
  const [casteCategoryFilter, setCasteCategoryFilter] = useState<'ALL' | CasteCategory>('ALL');
  const [selectedPage, setSelectedPage] = useState<number | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'panna' | 'household'>('table');
  const [copiedEpic, setCopiedEpic] = useState<string | null>(null);

  // Pagination for large list
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // Local state for interactive voter triage tag adjustments
  const [voterTags, setVoterTags] = useState<Record<string, ElectorRecord['triageTag']>>({});

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);

    fetchBoothVoters(acNo, boothNo, boothName, mandalName, electorateCount).then((res) => {
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, acNo, boothNo, boothName, mandalName, electorateCount]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Precompute onomastic caste predictions for all electors in the booth
  const casteMap = useMemo(() => {
    if (!data) return new Map<string, CastePrediction>();
    const map = new Map<string, CastePrediction>();
    for (const e of data.electors) {
      map.set(e.epic, predictCaste(e.name, e.relativeName, mandalName));
    }
    return map;
  }, [data, mandalName]);

  // Aggregate booth-level estimated community composition
  const casteSummary = useMemo(() => {
    const counts: Record<CasteCategory, number> = { BC: 0, SC: 0, ST: 0, OC: 0, Minority: 0 };
    if (!data || data.electors.length === 0) return counts;
    for (const e of data.electors) {
      const pred = casteMap.get(e.epic);
      if (pred) counts[pred.category]++;
    }
    return counts;
  }, [data, casteMap]);

  // Filtered electors
  const filteredElectors = useMemo(() => {
    if (!data) return [];
    let list = data.electors;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((e) => {
        const pred = casteMap.get(e.epic);
        return (
          e.name.toLowerCase().includes(q) ||
          e.relativeName.toLowerCase().includes(q) ||
          e.epic.toLowerCase().includes(q) ||
          e.houseNo.toLowerCase().includes(q) ||
          e.section.toLowerCase().includes(q) ||
          (pred && pred.casteName.toLowerCase().includes(q)) ||
          (pred && pred.category.toLowerCase() === q)
        );
      });
    }

    if (genderFilter !== 'ALL') {
      list = list.filter((e) => e.gender === genderFilter);
    }

    if (ageCohort !== 'ALL') {
      if (ageCohort === '18-25') list = list.filter((e) => e.age >= 18 && e.age <= 25);
      else if (ageCohort === '26-40') list = list.filter((e) => e.age >= 26 && e.age <= 40);
      else if (ageCohort === '41-60') list = list.filter((e) => e.age >= 41 && e.age <= 60);
      else if (ageCohort === '60+') list = list.filter((e) => e.age > 60);
    }

    if (casteCategoryFilter !== 'ALL') {
      list = list.filter((e) => {
        const pred = casteMap.get(e.epic);
        return pred?.category === casteCategoryFilter;
      });
    }

    if (selectedPage !== 'ALL') {
      list = list.filter((e) => e.pannaPage === selectedPage);
    }

    return list;
  }, [data, searchQuery, genderFilter, ageCohort, casteCategoryFilter, selectedPage, casteMap]);

  // Paginated view for table
  const paginatedElectors = useMemo(() => {
    if (viewMode === 'panna' || viewMode === 'household') {
      return filteredElectors; // Show all in group modes
    }
    const start = (currentPage - 1) * pageSize;
    return filteredElectors.slice(start, start + pageSize);
  }, [filteredElectors, currentPage, pageSize, viewMode]);

  const totalPaginationPages = Math.ceil(filteredElectors.length / pageSize) || 1;

  // Household grouping
  const householdGroups = useMemo(() => {
    if (viewMode !== 'household') return [];
    const map = new Map<string, ElectorRecord[]>();
    filteredElectors.forEach((e) => {
      const existing = map.get(e.houseNo) || [];
      existing.push(e);
      map.set(e.houseNo, existing);
    });
    return Array.from(map.entries()).map(([houseNo, members]) => ({
      houseNo,
      members,
      section: members[0]?.section || '',
    }));
  }, [filteredElectors, viewMode]);

  // Panna grouping
  const pannaGroups = useMemo(() => {
    if (viewMode !== 'panna') return [];
    const map = new Map<number, ElectorRecord[]>();
    filteredElectors.forEach((e) => {
      const existing = map.get(e.pannaPage) || [];
      existing.push(e);
      map.set(e.pannaPage, existing);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([pageNum, members]) => ({
        pageNum,
        members,
      }));
  }, [filteredElectors, viewMode]);

  // Copy EPIC to clipboard
  const handleCopyEpic = (epic: string) => {
    navigator.clipboard.writeText(epic);
    setCopiedEpic(epic);
    setTimeout(() => setCopiedEpic(null), 1800);
  };

  // Toggle voter field tag
  const toggleVoterTag = (epic: string, currentTag: ElectorRecord['triageTag']) => {
    const cycle: Record<ElectorRecord['triageTag'], ElectorRecord['triageTag']> = {
      committed: 'swing',
      swing: 'lean_opp',
      lean_opp: 'neutral',
      neutral: 'committed',
    };
    const nextTag = cycle[voterTags[epic] || currentTag];
    setVoterTags((prev) => ({ ...prev, [epic]: nextTag }));
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (!data) return;
    const headers = [
      'Sl No',
      'EPIC ID',
      'Elector Name',
      'Relative Name',
      'Relation',
      'House No',
      'Age',
      'Gender',
      'Section',
      'Panna Page',
      'Field Status',
    ];

    const rows = filteredElectors.map((e) => [
      e.slNo,
      e.epic,
      `"${e.name}"`,
      `"${e.relativeName}"`,
      e.relationType,
      `"${e.houseNo}"`,
      e.age,
      e.gender,
      `"${e.section}"`,
      e.pannaPage,
      voterTags[e.epic] || e.triageTag,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `AC${acNo}_Sirpur_Booth_${boothNo}_Voter_Roll.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center font-mono font-black text-amber-400 text-base shadow-inner">
              #{boothNo}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-mono">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  Electoral Roll Register &middot; CEO Telangana
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  AC #{acNo} {acName} &middot; {district} District
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    triage === 'battleground'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                      : triage === 'fortress'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                  }`}
                >
                  {triage.toUpperCase()} (Form-20: {leadParty} {form20Margin >= 0 ? `+${form20Margin}` : form20Margin})
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5 truncate max-w-2xl">
                {boothName} &middot; <span className="text-indigo-200 font-normal">{mandalName} Mandal</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={loading || !data}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              title="Download Filtered Electors as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors cursor-pointer"
              title="Print Panna Pramukh Sheets"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demographics & Panna KPI Banner */}
        {data && (
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Registered Electors</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {data.totalElectors.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-[10px]">
                ♀
              </span>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Sex Ratio</span>
                <span className="font-mono font-bold text-slate-900">
                  {data.femaleCount} F / {data.maleCount} M{' '}
                  <span className="text-[10px] font-normal text-slate-500">
                    ({Math.round((data.femaleCount / Math.max(1, data.maleCount)) * 1000)}/1k)
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">First-Time (18-25)</span>
                <span className="font-mono font-bold text-amber-700">
                  {data.firstTimeCount} voters{' '}
                  <span className="text-[10px] font-normal text-slate-500">
                    ({((data.firstTimeCount / data.totalElectors) * 100).toFixed(1)}%)
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Households / Doors</span>
                <span className="font-mono font-bold text-slate-900">
                  {data.householdCount} doors{' '}
                  <span className="text-[10px] font-normal text-slate-500">
                    (~{(data.totalElectors / Math.max(1, data.householdCount)).toFixed(1)}/door)
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Panna Allocation</span>
                <span className="font-mono font-bold text-purple-900">
                  {data.totalPages} Panna Pages{' '}
                  <span className="text-[10px] font-normal text-slate-500">(50/panna)</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Est. Community Mix</span>
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold">
                  <span className="text-blue-700 bg-blue-50 px-1 rounded border border-blue-200" title={`BC: ${casteSummary.BC}`}>
                    {data.totalElectors ? Math.round((casteSummary.BC / data.totalElectors) * 100) : 0}% BC
                  </span>
                  <span className="text-purple-700 bg-purple-50 px-1 rounded border border-purple-200" title={`SC: ${casteSummary.SC}`}>
                    {data.totalElectors ? Math.round((casteSummary.SC / data.totalElectors) * 100) : 0}% SC
                  </span>
                  <span className="text-amber-700 bg-amber-50 px-1 rounded border border-amber-200" title={`ST: ${casteSummary.ST}`}>
                    {data.totalElectors ? Math.round((casteSummary.ST / data.totalElectors) * 100) : 0}% ST
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200" title={`OC: ${casteSummary.OC}`}>
                    {data.totalElectors ? Math.round((casteSummary.OC / data.totalElectors) * 100) : 0}% OC
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar: Search, Filters & View Mode */}
        <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search voter name, caste/clan (e.g. Goud, Reddy), door, or EPIC..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Gender Filter */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
              {(['ALL', 'M', 'F'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setGenderFilter(g);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    genderFilter === g
                      ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {g === 'ALL' ? 'All' : g === 'M' ? 'Male ♂' : 'Female ♀'}
                </button>
              ))}
            </div>

            {/* Community / Caste Filter */}
            <select
              value={casteCategoryFilter}
              onChange={(e) => {
                setCasteCategoryFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden cursor-pointer font-medium"
              title="Filter electors by estimated caste / community"
            >
              <option value="ALL">All Communities</option>
              <option value="BC">BC ({casteSummary.BC}) · {data ? Math.round((casteSummary.BC / data.totalElectors) * 100) : 0}%</option>
              <option value="SC">SC ({casteSummary.SC}) · {data ? Math.round((casteSummary.SC / data.totalElectors) * 100) : 0}%</option>
              <option value="ST">ST ({casteSummary.ST}) · {data ? Math.round((casteSummary.ST / data.totalElectors) * 100) : 0}%</option>
              <option value="OC">OC ({casteSummary.OC}) · {data ? Math.round((casteSummary.OC / data.totalElectors) * 100) : 0}%</option>
              <option value="Minority">Minority ({casteSummary.Minority}) · {data ? Math.round((casteSummary.Minority / data.totalElectors) * 100) : 0}%</option>
            </select>

            {/* Age Cohort Filter */}
            <select
              value={ageCohort}
              onChange={(e) => {
                setAgeCohort(e.target.value as any);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Age Cohorts</option>
              <option value="18-25">18–25 (First-Time)</option>
              <option value="26-40">26–40 (Youth)</option>
              <option value="41-60">41–60 (Middle Age)</option>
              <option value="60+">60+ (Senior Citizen)</option>
            </select>

            {/* Panna Page Selector */}
            {data && (
              <select
                value={selectedPage}
                onChange={(e) => {
                  setSelectedPage(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Panna Pages ({data.totalPages})</option>
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>
                    Panna Page #{p} (Sl { (p - 1) * 50 + 1 }–{ Math.min(data.totalElectors, p * 50) })
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Roll Table</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('panna')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'panna'
                  ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Panna Pages</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('household')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'household'
                  ? 'bg-white text-amber-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Door-to-Door</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100/50">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-3">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold">Loading E-Roll voter register for Booth #{boothNo}...</p>
            </div>
          ) : filteredElectors.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Users className="w-8 h-8 stroke-1" />
              <p className="text-sm font-semibold">No electors match the selected filters or search query.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setGenderFilter('ALL');
                  setAgeCohort('ALL');
                  setCasteCategoryFilter('ALL');
                  setSelectedPage('ALL');
                }}
                className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* VIEW 1: Standard E-Roll Table */
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3 w-14 text-center">Sl No</th>
                    <th className="py-2.5 px-3 w-32 font-mono">EPIC Number</th>
                    <th className="py-2.5 px-3">Elector Name</th>
                    <th className="py-2.5 px-3 w-40">Est. Community</th>
                    <th className="py-2.5 px-3">Relative Name</th>
                    <th className="py-2.5 px-3 w-24">House / Door</th>
                    <th className="py-2.5 px-3 w-16 text-center">Age</th>
                    <th className="py-2.5 px-3 w-16 text-center">Gender</th>
                    <th className="py-2.5 px-3">Section / Street</th>
                    <th className="py-2.5 px-3 w-20 text-center">Panna</th>
                    <th className="py-2.5 px-3 w-28 text-center">Field Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-sans">
                  {paginatedElectors.map((e) => {
                    const tag = voterTags[e.epic] || e.triageTag;
                    const pred = casteMap.get(e.epic);
                    return (
                      <tr key={e.epic} className="hover:bg-indigo-50/40 transition-colors">
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-600">
                          {e.slNo}
                        </td>
                        <td className="py-2 px-3 font-mono font-semibold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px]">{e.epic}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyEpic(e.epic)}
                              className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                              title="Copy EPIC ID"
                            >
                              {copiedEpic === e.epic ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span>{e.name}</span>
                            {e.age <= 25 && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-semibold">
                                First-Time
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          {pred ? (
                            <div className="flex items-center gap-1.5" title={`Source: ${pred.sourceBasis} (${pred.confidenceTier} confidence)`}>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${pred.color.badge}`}>
                                {pred.casteName}
                              </span>
                              <span className="font-mono text-[10px] font-semibold text-slate-500">
                                {pred.probabilityPercent}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-mono text-[10px]">—</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          <span className="text-[10px] text-slate-400 font-mono mr-1">
                            ({e.relationType}/o)
                          </span>
                          {e.relativeName}
                        </td>
                        <td className="py-2 px-3 font-mono font-medium text-slate-700">
                          {e.houseNo}
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-semibold">
                          <span
                            className={
                              e.age <= 25
                                ? 'text-amber-700 font-bold'
                                : e.age > 60
                                ? 'text-purple-700 font-bold'
                                : 'text-slate-800'
                            }
                          >
                            {e.age}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              e.gender === 'F'
                                ? 'bg-pink-100 text-pink-700 border border-pink-200'
                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {e.gender}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[11px] text-slate-500 truncate max-w-[180px]">
                          {e.section}
                        </td>
                        <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-500">
                          P.{e.pannaPage}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleVoterTag(e.epic, e.triageTag)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-transform active:scale-95 cursor-pointer ${
                              tag === 'committed'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : tag === 'swing'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : tag === 'lean_opp'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : 'bg-slate-100 text-slate-600 border-slate-300'
                            }`}
                            title="Click to cycle status: Committed → Swing → Opponent → Neutral"
                          >
                            {tag === 'committed'
                              ? '✓ Committed'
                              : tag === 'swing'
                              ? '⚡ Swing'
                              : tag === 'lean_opp'
                              ? '✕ Opponent'
                              : '○ Neutral'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : viewMode === 'panna' ? (
            /* VIEW 2: Panna Pramukh (50 electors per sheet) */
            <div className="space-y-4">
              {pannaGroups.map((group) => (
                <div
                  key={group.pageNum}
                  className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden"
                >
                  <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-950 to-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-sm font-mono">
                        Panna Page #{group.pageNum}
                      </span>
                      <span className="text-xs text-slate-300">
                        ({group.members.length} Electors Assigned)
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-300">
                      Sl #{group.members[0]?.slNo} – #{group.members[group.members.length - 1]?.slNo}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 p-3">
                    {group.members.map((e) => {
                      const tag = voterTags[e.epic] || e.triageTag;
                      return (
                        <div
                          key={e.epic}
                          className="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-400 bg-slate-50/60 transition-all text-xs space-y-1"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-mono text-[10px] text-slate-400 block">
                                Sl #{e.slNo} &middot; {e.epic}
                              </span>
                              <div className="font-bold text-slate-900 text-xs">
                                {e.name}
                              </div>
                            </div>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                tag === 'committed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : tag === 'swing'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {tag.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            {e.relationType}/o {e.relativeName}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                            <span>Door: <strong>{e.houseNo}</strong></span>
                            {casteMap.get(e.epic) && (
                              <span className={`px-1.5 py-0.2 rounded font-bold border text-[9px] ${casteMap.get(e.epic)!.color.badge}`} title={casteMap.get(e.epic)!.sourceBasis}>
                                {casteMap.get(e.epic)!.casteName} ({casteMap.get(e.epic)!.probabilityPercent})
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* VIEW 3: Household / Door-to-Door Canvassing */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {householdGroups.map((h) => {
                const hCaste = predictHouseholdCaste(h.members, mandalName);
                return (
                  <div
                    key={h.houseNo}
                    className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs hover:border-amber-400 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                          <Home className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-mono font-bold text-xs text-slate-900">
                            Door #{h.houseNo}
                          </span>
                          <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                            {h.section}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${hCaste.color.badge}`} title={`Household Consensus: ${hCaste.sourceBasis}`}>
                          {hCaste.casteName} · {hCaste.probabilityPercent}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          {h.members.length}
                        </span>
                      </div>
                    </div>

                  <div className="space-y-1.5">
                    {h.members.map((m) => (
                      <div
                        key={m.epic}
                        className="flex items-center justify-between text-xs py-1 px-1.5 rounded bg-slate-50 border border-slate-100"
                      >
                        <div>
                          <div className="font-semibold text-slate-800 text-[11px] flex items-center gap-1.5">
                            <span>{m.name}</span>
                            {casteMap.get(m.epic) && (
                              <span className={`text-[9px] px-1 py-0.2 rounded font-medium border ${casteMap.get(m.epic)!.color.badge}`}>
                                {casteMap.get(m.epic)!.casteName}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {m.relationType}/o {m.relativeName}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-[10px] text-slate-600 block">
                            {m.age}y ({m.gender})
                          </span>
                          <span className="font-mono text-[9px] text-slate-400">
                            {m.epic}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

        {/* Footer / Pagination Controls */}
        <div className="px-5 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div>
            Showing <strong className="text-slate-900">{filteredElectors.length}</strong> of{' '}
            <strong className="text-slate-900">{data?.totalElectors || 0}</strong> electors in Booth #{boothNo}
          </div>

          {viewMode === 'table' && totalPaginationPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs">
                Page {currentPage} of {totalPaginationPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPaginationPages, p + 1))}
                disabled={currentPage === totalPaginationPages}
                className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

