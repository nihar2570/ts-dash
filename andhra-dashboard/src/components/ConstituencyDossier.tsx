import React, { useState, useMemo } from 'react';
import type { ConstituencyCandidatesData, DemographicsDataset, ElectionData } from '../types';
import { getPartyColor, getPartyBg } from '../types';
import {
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Coins,
  GraduationCap,
  Users,
  Award,
  Vote,
  Filter,
  Search,
  Building2,
  TrendingUp,
  FileText,
  PieChart,
  Flame,
  CheckCircle2,
  Target,
  Sparkles,
  MapPin,
  Briefcase,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { CONSTITUENCY_MANDALS } from '../data/mandalData';
import { FORM_20_URLS } from '../data/form20Urls';
import { CONSTITUENCY_TOPICS } from '../data/constituencyTopics';
import { CandidateEquityDecomposer } from './CandidateEquityDecomposer';
import { BoothPannaDeficitSolver } from './BoothPannaDeficitSolver';

interface ConstituencyDossierProps {
  data: ConstituencyCandidatesData | null;
  isOpen?: boolean;
  onClose: () => void;
  demographicsData?: DemographicsDataset | null;
  geoJsonData?: any;
  onSelectAc?: (acNo: number) => void;
  allConstituencies?: { ac_no: number; ac_name: string; district: string }[];
  electionData?: ElectionData | null;
  onNavigateToBoothData?: (acNo: number, boothNo?: number, viewMode?: string) => void;
}

export const ConstituencyDossier: React.FC<ConstituencyDossierProps> = ({
  data,
  isOpen = true,
  onClose,
  demographicsData,
  geoJsonData,
  onSelectAc,
  allConstituencies,
  electionData,
  onNavigateToBoothData,
}) => {
  const [dossierTab, setDossierTab] = useState<'candidates' | 'mandals' | 'booths' | 'demographics' | 'topics'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'mandals' || tabParam === 'booths' || tabParam === 'demographics' || tabParam === 'topics') {
        return tabParam;
      }
    }
    return 'candidates';
  });
  const [isBoothMapOnly, setIsBoothMapOnly] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') === 'booth-map';
    }
    return false;
  });

  const handleExitBoothMapOnly = () => {
    setIsBoothMapOnly(false);
    setDossierTab('booths');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('view');
      url.searchParams.set('tab', 'booths');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  };

  const [minVotes, setMinVotes] = useState<number>(1000);
  const [topLimit, setTopLimit] = useState<number | 'ALL'>('ALL');
  const [filterMode, setFilterMode] = useState<'1000' | '5000' | 'all'>('1000');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Column visibility toggles (defaulted to ON per user preference)
  const [showAge, setShowAge] = useState<boolean>(true);
  const [showEducation, setShowEducation] = useState<boolean>(true);
  const [showCriminalCases, setShowCriminalCases] = useState<boolean>(true);
  const [showNetWorth, setShowNetWorth] = useState<boolean>(true);

  // Handle filter preset change
  const handleFilterPreset = (preset: '1000' | '5000' | 'all') => {
    setFilterMode(preset);
    if (preset === '1000') {
      setMinVotes(1000);
    } else if (preset === '5000') {
      setMinVotes(5000);
    } else if (preset === 'all') {
      setMinVotes(0);
    }
  };

  // Filtered and sorted candidate roster
  const filteredCandidates = useMemo(() => {
    if (!data || !data.candidates) return [];
    let list = [...data.candidates];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.party.toLowerCase().includes(q) ||
          c.raw_party.toLowerCase().includes(q)
      );
    }

    // Filter by minVotes
    list = list.filter((c) => c.votes >= minVotes || c.is_nota);

    // Limit top X if specified
    if (topLimit !== 'ALL') {
      list = list.slice(0, topLimit);
    }

    return list;
  }, [data, minVotes, topLimit, searchQuery]);

  // Mandal & Booth Level Breakdown Data (#13)
  const mandals = useMemo(() => {
    if (!data) return [];
    return CONSTITUENCY_MANDALS[data.ac_no] || [];
  }, [data]);

  const mandalTotals = useMemo(() => {
    const totalBooths = mandals.reduce((sum, m) => sum + (m.booths || 0), 0);
    const totalElectorate =
      data?.voters_info?.electors_total ||
      mandals.reduce((sum, m) => sum + (m.electorate || 0), 0);
    const avgTurnout =
      data?.voters_info?.turnout_pct !== undefined
        ? String(data.voters_info.turnout_pct)
        : mandals.length > 0
        ? (mandals.reduce((sum, m) => sum + (m.turnout_pct || 0), 0) / mandals.length).toFixed(1)
        : '0.0';
    return { totalBooths, totalElectorate, avgTurnout };
  }, [mandals, data?.voters_info]);

  const [mandalSearch, setMandalSearch] = useState('');
  const filteredMandals = useMemo(() => {
    if (!mandalSearch.trim()) return mandals;
    const q = mandalSearch.toLowerCase();
    return mandals.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.lead_party?.toLowerCase().includes(q) ||
        m.dominant_caste?.toLowerCase().includes(q)
    );
  }, [mandals, mandalSearch]);

  // AC Demographics & Key Topics hooks
  const acDemographics = useMemo(() => {
    if (!data || !demographicsData?.constituencies) return null;
    return demographicsData.constituencies[String(data.ac_no)] || null;
  }, [data, demographicsData]);

  const acTopics = useMemo(() => {
    if (!data) return null;
    return CONSTITUENCY_TOPICS[data.ac_no] || null;
  }, [data]);

  const demographicSummary = useMemo(() => {
    if (!acDemographics?.caste_profile) return null;
    const cp = acDemographics.caste_profile;
    const bcTotal = Number((
      (cp.bc_turpu_kapu || 0) +
      (cp.bc_yadava || cp.bc_yadav || 0) +
      (cp.bc_kuruba_boya || 0) +
      (cp.bc_settibalija_goud || cp.bc_goud || 0) +
      (cp.bc_padmashali || 0) +
      (cp.bc_mudiraj || 0) +
      (cp.bc_munnuru_kapu || 0) +
      (cp.bc_other || 0)
    ).toFixed(1));

    const scTotal = Number((
      (cp.sc_madiga_relli || cp.sc_madiga || 0) +
      (cp.sc_mala || 0)
    ).toFixed(1));

    const stTotal = Number((
      (cp.st_tribal || cp.st_lambada || 0) +
      (cp.st_koya_gond || 0)
    ).toFixed(1));

    const minorityTotal = Number((
      (cp.minority_muslim || 0) +
      (cp.minority_christian || 0)
    ).toFixed(1));

    const ocTotal = Number((
      (cp.kapu || 0) +
      (cp.kamma || 0) +
      (cp.reddy || cp.oc_reddy || 0) +
      (cp.oc_velama || 0) +
      (cp.oc_other || 0)
    ).toFixed(1));

    const COMM_META: Record<string, { name: string; category: string; color: string; bg: string }> = {
      // 1. Backward Classes (BC)
      bc_turpu_kapu: { name: 'BC Turpu Kapu', category: 'Backward Classes', color: '#0284c7', bg: '#e0f2fe' },
      bc_yadava: { name: 'BC Yadava / Golla', category: 'Backward Classes', color: '#0369a1', bg: '#e0f2fe' },
      bc_kuruba_boya: { name: 'BC Kuruba / Boya', category: 'Backward Classes', color: '#0284c7', bg: '#e0f2fe' },
      bc_settibalija_goud: { name: 'BC Settibalija / Goud', category: 'Backward Classes', color: '#0ea5e9', bg: '#e0f2fe' },
      bc_padmashali: { name: 'BC Padmashali', category: 'Backward Classes', color: '#06b6d4', bg: '#cffafe' },
      bc_other: { name: 'Other BCs', category: 'Backward Classes', color: '#64748b', bg: '#f1f5f9' },

      // 2. Scheduled Castes (SC)
      sc_madiga_relli: { name: 'SC Madiga / Relli', category: 'Scheduled Castes', color: '#6366f1', bg: '#ede9fe' },
      sc_mala: { name: 'SC Mala', category: 'Scheduled Castes', color: '#7c3aed', bg: '#ede9fe' },

      // 3. Scheduled Tribes (ST)
      st_tribal: { name: 'ST Tribals (Sugali / Agency)', category: 'Scheduled Tribes', color: '#d97706', bg: '#fef3c7' },

      // 4. Open Categories (OC)
      kapu: { name: 'Kapu / Balija / Telaga', category: 'Open Categories', color: '#e11d48', bg: '#ffe4e6' },
      kamma: { name: 'Kamma', category: 'Open Categories', color: '#be123c', bg: '#ffe4e6' },
      reddy: { name: 'Reddy', category: 'Open Categories', color: '#9f1239', bg: '#ffe4e6' },

      // 5. Religious Minorities
      minority_muslim: { name: 'Muslim Minorities', category: 'Religious Minorities', color: '#16a34a', bg: '#dcfce7' },
      minority_christian: { name: 'Christian Minorities', category: 'Religious Minorities', color: '#059669', bg: '#d1fae5' },

      // Fallbacks for any legacy keys
      sc_madiga: { name: 'SC Madiga', category: 'Scheduled Castes', color: '#6366f1', bg: '#ede9fe' },
      st_lambada: { name: 'ST Lambada', category: 'Scheduled Tribes', color: '#d97706', bg: '#fef3c7' },
      st_koya_gond: { name: 'ST Koya / Gond', category: 'Scheduled Tribes', color: '#b45309', bg: '#fef3c7' },
      bc_mudiraj: { name: 'BC Mudiraj', category: 'Backward Classes', color: '#0284c7', bg: '#e0f2fe' },
      bc_munnuru_kapu: { name: 'BC Munnuru Kapu', category: 'Backward Classes', color: '#0284c7', bg: '#e0f2fe' },
      bc_goud: { name: 'BC Goud', category: 'Backward Classes', color: '#0ea5e9', bg: '#e0f2fe' },
      bc_yadav: { name: 'BC Yadav', category: 'Backward Classes', color: '#0369a1', bg: '#e0f2fe' },
      oc_reddy: { name: 'Reddy', category: 'Open Categories', color: '#9f1239', bg: '#ffe4e6' },
      oc_velama: { name: 'Velama', category: 'Open Categories', color: '#be123c', bg: '#ffe4e6' },
      oc_other: { name: 'Other OCs', category: 'Open Categories', color: '#94a3b8', bg: '#f8fafc' },
    };

    const sortedCommunities = Object.entries(cp)
      .map(([key, pct]) => {
        let meta = COMM_META[key];
        if (!meta) {
          const formattedName = key
            .split('_')
            .map((w) => {
              const low = w.toLowerCase();
              if (['bc', 'sc', 'st', 'oc'].includes(low)) return low.toUpperCase();
              return w.charAt(0).toUpperCase() + w.slice(1);
            })
            .join(' ');
          let cat = 'Open Categories';
          let col = '#e11d48';
          let bgCol = '#ffe4e6';
          if (key.startsWith('bc_')) {
            cat = 'Backward Classes';
            col = '#0284c7';
            bgCol = '#e0f2fe';
          } else if (key.startsWith('sc_')) {
            cat = 'Scheduled Castes';
            col = '#6366f1';
            bgCol = '#ede9fe';
          } else if (key.startsWith('st_')) {
            cat = 'Scheduled Tribes';
            col = '#d97706';
            bgCol = '#fef3c7';
          } else if (key.includes('minority') || key.includes('muslim') || key.includes('christian')) {
            cat = 'Religious Minorities';
            col = '#16a34a';
            bgCol = '#dcfce7';
          }
          meta = { name: formattedName, category: cat, color: col, bg: bgCol };
        }
        return {
          key,
          pct: Number(pct.toFixed(2)),
          meta,
        };
      })
      .sort((a, b) => b.pct - a.pct);

    const dominant = sortedCommunities[0];

    return {
      bcTotal,
      scTotal,
      stTotal,
      minorityTotal,
      ocTotal,
      sortedCommunities,
      dominant,
    };
  }, [acDemographics]);

  // All React hooks have been unconditionally invoked above. Now safe to return if closed or no data.
  if (!isOpen || !data || !data.candidates) return null;

  const form20Url = FORM_20_URLS[data.ac_no];
  const winner = data.candidates[0];
  const runnerUp = data.candidates[1];
  const margin = winner && runnerUp ? (winner.votes || 0) - (runnerUp.votes || 0) : 0;
  const marginPct =
    winner && runnerUp && data.total_valid_votes > 0
      ? ((margin / data.total_valid_votes) * 100).toFixed(2)
      : '0.00';

  const electorateBase =
    mandalTotals.totalElectorate > 0
      ? mandalTotals.totalElectorate
      : data.total_valid_votes > 0
      ? Math.round(data.total_valid_votes / 0.72)
      : 220000;

  // ADR Aggregate Statistics for candidates in this AC
  const adrStats = data.candidates.reduce(
    (acc, c) => {
      if (c.myneta) {
        acc.totalCriminalCases += c.myneta.criminal_cases || 0;
        if ((c.myneta.criminal_cases || 0) > 0) acc.candidatesWithCases += 1;
        if (c.myneta.is_crorepati) acc.crorepatiCount += 1;
        if ((c.myneta.total_assets || 0) > acc.maxAssets) {
          acc.maxAssets = c.myneta.total_assets || 0;
          acc.maxAssetCand = c.name;
          acc.maxAssetFormatted = c.myneta.total_assets_formatted || '₹0';
        }
      }
      return acc;
    },
    {
      totalCriminalCases: 0,
      candidatesWithCases: 0,
      crorepatiCount: 0,
      maxAssets: 0,
      maxAssetCand: '',
      maxAssetFormatted: '₹0',
    }
  );


  const dossierTabsAndContent = (
    <>
      {/* Dossier Section Tabs (Light Background) */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={() => setDossierTab('candidates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                dossierTab === 'candidates'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/90 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span>Candidates &amp; ADR ({data.candidates.length})</span>
            </button>
            <button
              onClick={() => setDossierTab('mandals')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                dossierTab === 'mandals'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/90 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Mandals &amp; Circles ({mandals.length})</span>
            </button>
            <button
              onClick={() => setDossierTab('booths')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                dossierTab === 'booths'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/90 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Polling Stations ({mandalTotals.totalBooths})</span>
            </button>
            <button
              onClick={() => setDossierTab('demographics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                dossierTab === 'demographics'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/90 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-cyan-600" />
              <span>Demographics (Caste &amp; Age)</span>
            </button>
            <button
              onClick={() => setDossierTab('topics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                dossierTab === 'topics'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/90 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Key Topics &amp; Issues</span>
              {acTopics && (
                <span className="text-[10px] bg-rose-100 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded font-mono font-bold">
                  {acTopics.key_issues.length}
                </span>
              )}
            </button>
          </div>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            AC #{data.ac_no} {data.ac_name}
          </span>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* TAB 1: CANDIDATES & ADR PROFILE */}
          {dossierTab === 'candidates' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Quick Metrics KPI Bar (1-Line Horizontal Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
                    <Vote className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">Valid Votes</span>
                  </div>
                  <div className="flex items-baseline gap-1 shrink-0 font-mono">
                    <span className="text-sm font-black text-slate-900">
                      {data.total_valid_votes.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-700">
                      {data.voters_info ? `${data.voters_info.turnout_pct}%` : 'cast'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
                    <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Margin ({winner?.party})</span>
                  </div>
                  <div className="flex items-baseline gap-1 shrink-0 font-mono">
                    <span className="text-sm font-black text-slate-900">
                      {margin.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">({marginPct}%)</span>
                  </div>
                </div>

                <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
                    <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">Candidates</span>
                  </div>
                  <div className="flex items-baseline gap-1 shrink-0 font-mono">
                    <span className="text-sm font-black text-slate-900">
                      {data.total_candidates}
                    </span>
                    <span className="text-[10px] text-slate-400">({data.candidates_above_1000} ≥ 1k)</span>
                  </div>
                </div>

                <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span className="truncate">ADR Profile</span>
                  </div>
                  <div className="flex items-baseline gap-1 shrink-0 font-mono">
                    <span className="text-sm font-black text-slate-900">
                      {adrStats.crorepatiCount}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium font-sans">Crorepatis ({adrStats.totalCriminalCases} cases)</span>
                  </div>
                </div>
              </div>

              {/* Feature #6: Candidate Personal Equity vs Party Symbol Decomposer */}
              <CandidateEquityDecomposer
                acNo={data.ac_no}
                acName={data.ac_name}
                winnerCandidate={data.candidates[0]}
                runnerCandidate={data.candidates[1]}
                totalValidVotes={data.total_valid_votes}
                electionData={electionData}
              />

          {/* Candidate Filter & Control Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-indigo-600" />
                Filter Ballot:
              </span>

              {/* Threshold Presets */}
              <button
                type="button"
                onClick={() => handleFilterPreset('1000')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === '1000'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
                title="Show candidates with at least 1,000 votes"
              >
                ≥ 1,000 Votes (Default)
              </button>

              <button
                type="button"
                onClick={() => handleFilterPreset('5000')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === '5000'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
                title="Show major candidates with at least 5,000 votes"
              >
                ≥ 5,000 Votes
              </button>

              <button
                type="button"
                onClick={() => handleFilterPreset('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === 'all'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
                title="Show all candidates including independents"
              >
                All ({data.total_candidates})
              </button>
            </div>

            {/* Top X limit & Search */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <input
                  type="text"
                  placeholder="Search candidate / party..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent focus:outline-hidden text-xs w-36 sm:w-44"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                    ✕
                  </button>
                )}
              </div>

              {/* Top X Limit */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 font-medium hidden sm:inline">Top:</span>
                <select
                  value={topLimit}
                  onChange={(e) => setTopLimit(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-hidden"
                >
                  <option value="ALL">All</option>
                  <option value="3">Top 3</option>
                  <option value="5">Top 5</option>
                  <option value="10">Top 10</option>
                </select>
              </div>
            </div>
          </div>

          {/* Candidates & MyNeta Disclosures Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2.5 text-xs">
              <span className="font-bold text-slate-700">
                Displaying {filteredCandidates.length} Candidates{' '}
                {filterMode === '1000' && '(polling ≥ 1,000 votes)'}
                {filterMode === '5000' && '(polling ≥ 5,000 votes)'}
              </span>

              {/* Individual Column Toggles */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-500 mr-0.5">
                  Show Columns:
                </span>

                <button
                  type="button"
                  onClick={() => {
                    const allActive = showAge && showEducation && showCriminalCases && showNetWorth;
                    setShowAge(!allActive);
                    setShowEducation(!allActive);
                    setShowCriminalCases(!allActive);
                    setShowNetWorth(!allActive);
                  }}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    showAge && showEducation && showCriminalCases && showNetWorth
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                  title="Toggle all disclosure columns"
                >
                  {showAge && showEducation && showCriminalCases && showNetWorth ? 'Hide All' : 'Select All'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowAge((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    showAge
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title="Toggle Age column"
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${showAge ? 'bg-white' : 'bg-slate-300'}`} />
                  Age
                </button>

                <button
                  type="button"
                  onClick={() => setShowEducation((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    showEducation
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title="Toggle Education column"
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${showEducation ? 'bg-white' : 'bg-slate-300'}`} />
                  Education
                </button>

                <button
                  type="button"
                  onClick={() => setShowCriminalCases((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    showCriminalCases
                      ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title="Toggle Criminal Cases column"
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${showCriminalCases ? 'bg-white' : 'bg-slate-300'}`} />
                  Criminal Cases
                </button>

                <button
                  type="button"
                  onClick={() => setShowNetWorth((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    showNetWorth
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title="Toggle Net Worth column"
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${showNetWorth ? 'bg-white' : 'bg-slate-300'}`} />
                  Net Worth
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3 w-12 text-center">Rank</th>
                    <th className="py-2.5 px-3">Candidate</th>
                    <th className="py-2.5 px-3">Party</th>
                    {showAge && <th className="py-2.5 px-3 text-center">Age</th>}
                    {showEducation && <th className="py-2.5 px-3">Education</th>}
                    <th className="py-2.5 px-3 text-right">Votes</th>
                    <th className="py-2.5 px-3 text-right">Vote Share</th>
                    {showCriminalCases && <th className="py-2.5 px-3 text-center">Criminal Cases</th>}
                    {showNetWorth && <th className="py-2.5 px-3 text-right">Net Worth</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.map((cand) => {
                    const partyColor = cand.is_nota ? '#94a3b8' : getPartyColor(cand.party);
                    const partyBg = cand.is_nota ? '#f1f5f9' : getPartyBg(cand.party);
                    const isWinner = cand.rank === 1;
                    const isRunner = cand.rank === 2;

                    return (
                      <tr
                        key={cand.rank}
                        className={`hover:bg-slate-50 transition-colors ${
                          isWinner ? 'bg-indigo-50/20 font-medium' : ''
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                              isWinner
                                ? 'bg-amber-400 text-slate-900 shadow-xs'
                                : isRunner
                                ? 'bg-slate-200 text-slate-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {cand.rank}
                          </span>
                        </td>

                        {/* Candidate Name */}
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {cand.name}
                            {isWinner && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                                Winner
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Party */}
                        <td className="py-3 px-3">
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-md font-bold text-xs"
                            style={{
                              backgroundColor: partyBg,
                              color: partyColor,
                            }}
                          >
                            {cand.party}
                          </span>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {cand.raw_party}
                          </div>
                        </td>

                        {/* Age (conditional) */}
                        {showAge && (
                          <td className="py-3 px-3 text-center font-medium text-slate-700">
                            {cand.myneta?.age ? `${cand.myneta.age} yrs` : <span className="text-slate-400">—</span>}
                          </td>
                        )}

                        {/* Education (conditional) */}
                        {showEducation && (
                          <td className="py-3 px-3">
                            {cand.myneta?.education ? (
                              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[140px]">{cand.myneta.education}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        )}

                        {/* Votes */}
                        <td className="py-3 px-3 text-right">
                          <div className="font-bold text-slate-900">{cand.votes.toLocaleString()}</div>
                          {cand.postal_votes > 0 ? (
                            <div className="text-[10px] text-slate-400">Postal: {cand.postal_votes}</div>
                          ) : null}
                        </td>

                        {/* Vote Share % */}
                        <td className="py-3 px-3 text-right">
                          <div className="font-bold text-slate-800">{cand.vote_share}%</div>
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full ml-auto mt-1 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${cand.vote_share}%`, backgroundColor: partyColor }}
                            />
                          </div>
                        </td>

                        {/* Criminal Cases (conditional) */}
                        {showCriminalCases && (
                          <td className="py-3 px-3 text-center">
                            {cand.myneta ? (
                              cand.myneta.criminal_cases === 0 ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  0 (Clean)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                  <ShieldAlert className="w-3 h-3 text-rose-600" />
                                  {cand.myneta.criminal_cases} Cases
                                </span>
                              )
                            ) : (
                              <span className="text-[11px] text-slate-400">—</span>
                            )}
                          </td>
                        )}

                        {/* Net Worth (conditional) */}
                        {showNetWorth && (
                          <td className="py-3 px-3 text-right">
                            {cand.myneta ? (
                              <div>
                                <div className="font-bold text-slate-900 flex items-center justify-end gap-1">
                                  {cand.myneta.net_worth_formatted}
                                  {cand.myneta.is_crorepati && (
                                    <span title="Crorepati candidate">
                                      <Coins className="w-3 h-3 text-amber-500" />
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  Assets: {cand.myneta.total_assets_formatted}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredCandidates.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <p className="font-medium text-sm">No candidates match the specified filter.</p>
                <button
                  onClick={() => {
                    setMinVotes(0);
                    setFilterMode('all');
                    setSearchQuery('');
                  }}
                  className="mt-2 text-indigo-600 hover:underline text-xs font-semibold cursor-pointer"
                >
                  Reset filters to show all candidates
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MANDAL & POLLING BOOTH DRILLDOWN (#13) */}
      {dossierTab === 'mandals' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Official ECI 2024 Statutory Voters Information Banner */}
          {data.voters_info && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 border border-indigo-700/40 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-500/20 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-indigo-500/30 text-indigo-300">
                    <Vote className="w-4 h-4 text-indigo-300" />
                  </span>
                  <div>
                    <h4 className="font-black text-sm text-slate-100 flex items-center gap-2">
                      Official ECI 2024 Voter Turnout &amp; Electors Profile
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-bold">
                        Form-12 Statutory Report
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Certified election data from Election Commission of India (ECI 2024 General Election)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {form20Url && (
                    <a
                      href={form20Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold border border-indigo-400/30 transition-all cursor-pointer shadow-xs"
                      title="Open official Returning Officer Form-20 (Booth-wise Polling Result Sheet) PDF from CEO Andhra Pradesh"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-200" />
                      <span>Official Form-20 PDF ↗</span>
                    </a>
                  )}
                  <div className="text-right">
                    <div className="text-xl font-black text-indigo-300 font-mono">
                      {data.voters_info.turnout_pct}%
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Official Poll Turnout</div>
                  </div>
                </div>
              </div>

              {/* 5-Column Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Electors</div>
                  <div className="text-base font-black text-slate-100 font-mono mt-0.5">
                    {data.voters_info.electors_total.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex justify-between font-mono">
                    <span>M: {data.voters_info.electors_male.toLocaleString()}</span>
                    <span>F: {data.voters_info.electors_female.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Votes Polled</div>
                  <div className="text-base font-black text-emerald-300 font-mono mt-0.5">
                    {data.voters_info.voted_total.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex justify-between font-mono">
                    <span>M: {data.voters_info.voted_male.toLocaleString()}</span>
                    <span>F: {data.voters_info.voted_female.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Valid Votes Polled</div>
                  <div className="text-base font-black text-indigo-200 font-mono mt-0.5">
                    {(data.voters_info.valid_votes_polled || data.total_valid_votes).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Candidate ballots polled
                  </div>
                </div>

                <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/50">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">NOTA Votes</div>
                  <div className="text-base font-black text-amber-300 font-mono mt-0.5">
                    {data.voters_info.nota_votes.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    {((data.voters_info.nota_votes / data.voters_info.voted_total) * 100).toFixed(2)}% of polled
                  </div>
                </div>

                <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/50 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Postal &amp; Tendered</div>
                  <div className="text-base font-black text-slate-200 font-mono mt-0.5">
                    {data.voters_info.voted_postal.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 flex justify-between font-mono">
                    <span>Rej: {data.voters_info.rejected_postal_votes + data.voters_info.rejected_evm_votes}</span>
                    <span>Tend: {data.voters_info.tendered_votes || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mandal KPI Cards (1-Line Horizontal Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
                <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">Revenue Mandals</span>
              </div>
              <div className="flex items-baseline gap-1 shrink-0 font-mono">
                <span className="text-sm font-black text-slate-900">{mandals.length}</span>
                <span className="text-[10px] text-slate-400">Circles</span>
              </div>
            </div>

            <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
                <Vote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Polling Stations</span>
              </div>
              <div className="flex items-baseline gap-1 shrink-0 font-mono">
                <span className="text-sm font-black text-slate-900">{mandalTotals.totalBooths}</span>
                <span className="text-[10px] text-slate-400">Booths</span>
              </div>
            </div>

            <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
                <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Total Electorate</span>
              </div>
              <div className="flex items-baseline gap-1 shrink-0 font-mono">
                <span className="text-sm font-black text-slate-900">{mandalTotals.totalElectorate.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">Voters</span>
              </div>
            </div>

            <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
                <TrendingUp className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="truncate">Average Turnout</span>
              </div>
              <div className="flex items-baseline gap-1 shrink-0 font-mono">
                <span className="text-sm font-black text-slate-900">
                  {Number(mandalTotals.avgTurnout) > 0 ? `${mandalTotals.avgTurnout}%` : '80.3%'}
                </span>
                <span className="text-[10px] text-slate-400">Polled</span>
              </div>
            </div>
          </div>

          {/* Mandal Ground Roster Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs space-y-0">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Mandal Administrative Directory ({mandals.length} Mandals / Revenue Circles)
                </span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-mono font-bold">
                  Delimitation 2008 &amp; AP Revenue
                </span>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by mandal, caste, party..."
                  value={mandalSearch}
                  onChange={(e) => setMandalSearch(e.target.value)}
                  className="w-48 sm:w-60 bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <th className="py-2.5 px-3">Mandal / Circle</th>
                    <th className="py-2.5 px-3 text-right">Booths</th>
                    <th className="py-2.5 px-3 text-right">Electorate</th>
                    <th className="py-2.5 px-3 text-right">Turnout %</th>
                    <th className="py-2.5 px-3 text-right">2023 Lead Margin</th>
                    <th className="py-2.5 px-3">Dominant Community</th>
                    <th className="py-2.5 px-3 text-center">Field Status</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {filteredMandals.map((m) => {
                    const mColor = getPartyColor(m.lead_party);
                    const dotCount = Math.min(4, Math.max(1, m.margin < 1000 ? 1 : m.margin < 2000 ? 2 : m.margin < 3500 ? 3 : 4));
                    return (
                      <tr key={m.mandal_id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-sans font-bold text-slate-900">
                          {m.name}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                          {m.booths}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600">
                          {m.electorate.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                          {m.turnout_pct}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Lead Intensity Dots */}
                            <div
                              className="flex items-center gap-1 shrink-0"
                              title={`Lead intensity: +${m.margin.toLocaleString()} votes (${dotCount} / 4 dots)`}
                            >
                              {Array.from({ length: dotCount }).map((_, dotIdx) => (
                                <span
                                  key={dotIdx}
                                  className="w-1.5 h-1.5 rounded-full inline-block shadow-2xs"
                                  style={{ backgroundColor: mColor }}
                                />
                              ))}
                            </div>
                            <span
                              className="px-2 py-0.5 rounded text-[10px]"
                              style={{
                                backgroundColor: `${mColor}15`,
                                color: mColor,
                              }}
                            >
                              {m.lead_party} +{m.margin.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-sans">
                          <span className="font-medium text-slate-900">{m.dominant_caste}</span>{' '}
                          <span className="text-[10px] text-slate-400 font-mono">({m.dominant_caste_pct}%)</span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold border"
                            style={{
                              backgroundColor: `${mColor}15`,
                              color: mColor,
                              borderColor: `${mColor}35`,
                            }}
                          >
                            {m.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <button
                            type="button"
                            onClick={() => setDossierTab('booths')}
                            className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            Booths Map ➔
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Transition Banner to Booths Tab */}
          <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50 border border-indigo-200/70 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-slate-700">
                Want to inspect individual EVM booth margins, coordinates &amp; Panna Pramukh quotas?
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToBoothData) {
                    onNavigateToBoothData(data.ac_no, 1, 'ac-plan');
                  } else {
                    const url = new URL(window.location.origin + window.location.pathname);
                    url.searchParams.set('tab', 'booth-data');
                    url.searchParams.set('ac', String(data.ac_no));
                    url.searchParams.set('view', 'ac-plan');
                    window.open(url.toString(), '_blank');
                  }
                }}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-black text-xs cursor-pointer shadow-2xs flex items-center gap-1.5 transition-all"
              >
                <span>🚶 AC Padayatra (30/60/90d)</span>
                <span>➔</span>
              </button>
              <button
                type="button"
                onClick={() => setDossierTab('booths')}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-2xs flex items-center gap-1.5 transition-all"
              >
                <span>Explore All {mandalTotals.totalBooths} Polling Stations &amp; Map</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POLLING STATIONS & FORM-20 TRIAGE */}
      {dossierTab === 'booths' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <BoothPannaDeficitSolver
            acNo={data.ac_no}
            acName={data.ac_name}
            district={data.district}
            mandals={mandals}
            totalValidVotes={data.total_valid_votes}
            winnerParty={data.candidates[0]?.party || 'TDP'}
            winnerCandidate={data.candidates[0]?.name || 'Winner'}
            winnerVotes={data.candidates[0]?.votes || 0}
            runnerParty={data.candidates[1]?.party || 'YSRCP'}
            runnerCandidate={data.candidates[1]?.name || 'Runner-up'}
            runnerVotes={data.candidates[1]?.votes || 0}
            geoJsonData={geoJsonData}
            onNavigateToBoothData={onNavigateToBoothData}
          />
        </div>
      )}

          {/* TAB 3: DEMOGRAPHICS (CASTE & AGE) */}
          {dossierTab === 'demographics' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {acDemographics && demographicSummary ? (
                <>
                  {/* Demographics Survey Header / Context Banner */}
                  <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-800 text-white p-4 rounded-xl border border-indigo-700/50 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-indigo-500 text-white font-mono text-xs px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                          <PieChart className="w-3.5 h-3.5" />
                          AP Demographics
                        </span>
                        <span className="font-bold text-sm text-slate-100">
                          Official Socio-Economic &amp; Caste Demographic Profile
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            acDemographics.reservation === 'SC'
                              ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/50'
                              : acDemographics.reservation === 'ST'
                              ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50'
                              : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50'
                          }`}
                        >
                          {acDemographics.reservation === 'SC'
                            ? 'SC Reserved AC'
                            : acDemographics.reservation === 'ST'
                            ? 'ST Reserved AC'
                            : 'General (Open) Seat'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Door-to-door enumeration data by Directorate of Economics &amp; Statistics (DES), Government of Andhra Pradesh.
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                        Estimated AC Electorate
                      </div>
                      <div className="text-lg font-black font-mono text-white">
                        {electorateBase.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Top 4 KPI Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Dominant Community */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-medium">Dominant Community</span>
                        <Award className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="text-lg font-black text-slate-900 truncate" title={demographicSummary.dominant?.meta.name}>
                        {demographicSummary.dominant?.meta.name}
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="font-bold text-indigo-600 font-mono">
                          {demographicSummary.dominant?.pct}%
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          ~{Math.round(((demographicSummary.dominant?.pct || 0) / 100) * electorateBase).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* BC Aggregate */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-medium">Total BC Bloc</span>
                        <Users className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div className="text-lg font-black text-slate-900 font-mono">
                        {demographicSummary.bcTotal}%
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-[11px] text-slate-500 truncate">6 Key Sub-castes</span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          ~{Math.round((demographicSummary.bcTotal / 100) * electorateBase).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* SC + ST Combined */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-medium">SC + ST Combined</span>
                        <Target className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="text-lg font-black text-slate-900 font-mono">
                        {(demographicSummary.scTotal + demographicSummary.stTotal).toFixed(1)}%
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-[11px] text-slate-500">
                          SC: {demographicSummary.scTotal}% &middot; ST: {demographicSummary.stTotal}%
                        </span>
                      </div>
                    </div>

                    {/* Youth Electorate 18-25 */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-medium">Youth (18–25 Yrs)</span>
                        <Sparkles className="w-4 h-4 text-rose-500" />
                      </div>
                      <div className="text-lg font-black text-slate-900 font-mono">
                        {acDemographics.age_profile.youth_18_25}%
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-[11px] text-slate-500">First-Time Voters</span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          ~{Math.round((acDemographics.age_profile.youth_18_25 / 100) * electorateBase).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Broad Social Categories Coalition */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Users className="w-4 h-4 text-indigo-600" />
                          Broad Social Coalition Composition (Demographic Model)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Aggregated voter shares across the five constitutional and reservation groupings with state baseline comparison.
                        </p>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        AP State Baseline: BC 49.2% &middot; OC 19.7% &middot; SC 17.1% &middot; Min 8.5% &middot; ST 5.5%
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      {/* BC */}
                      <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-sky-800">Backward Classes</span>
                            <span className="text-[10px] bg-sky-200/70 text-sky-800 px-1.5 py-0.2 rounded font-bold">BC</span>
                          </div>
                          <div className="text-2xl font-black text-sky-950 font-mono mt-1">
                            {demographicSummary.bcTotal}%
                          </div>
                          <div className="text-[11px] text-sky-700 mt-0.5 font-mono">
                            ~{Math.round((demographicSummary.bcTotal / 100) * electorateBase).toLocaleString()} voters
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-sky-100 text-[11px]">
                          <span className={demographicSummary.bcTotal >= 49.2 ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                            {demographicSummary.bcTotal >= 49.2 ? `+${(demographicSummary.bcTotal - 49.2).toFixed(1)}%` : `${(demographicSummary.bcTotal - 49.2).toFixed(1)}%`} vs State
                          </span>
                        </div>
                      </div>

                      {/* SC */}
                      <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-800">Scheduled Castes</span>
                            <span className="text-[10px] bg-indigo-200/70 text-indigo-800 px-1.5 py-0.2 rounded font-bold">SC</span>
                          </div>
                          <div className="text-2xl font-black text-indigo-950 font-mono mt-1">
                            {demographicSummary.scTotal}%
                          </div>
                          <div className="text-[11px] text-indigo-700 mt-0.5 font-mono">
                            ~{Math.round((demographicSummary.scTotal / 100) * electorateBase).toLocaleString()} voters
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-indigo-100 text-[11px]">
                          <span className={demographicSummary.scTotal >= 17.1 ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                            {demographicSummary.scTotal >= 17.1 ? `+${(demographicSummary.scTotal - 17.1).toFixed(1)}%` : `${(demographicSummary.scTotal - 17.1).toFixed(1)}%`} vs State
                          </span>
                        </div>
                      </div>

                      {/* ST */}
                      <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-800">Scheduled Tribes</span>
                            <span className="text-[10px] bg-amber-200/70 text-amber-800 px-1.5 py-0.2 rounded font-bold">ST</span>
                          </div>
                          <div className="text-2xl font-black text-amber-950 font-mono mt-1">
                            {demographicSummary.stTotal}%
                          </div>
                          <div className="text-[11px] text-amber-700 mt-0.5 font-mono">
                            ~{Math.round((demographicSummary.stTotal / 100) * electorateBase).toLocaleString()} voters
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-amber-100 text-[11px]">
                          <span className={demographicSummary.stTotal >= 5.5 ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                            {demographicSummary.stTotal >= 5.5 ? `+${(demographicSummary.stTotal - 5.5).toFixed(1)}%` : `${(demographicSummary.stTotal - 5.5).toFixed(1)}%`} vs State
                          </span>
                        </div>
                      </div>

                      {/* Minorities */}
                      <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-800">Religious Minorities</span>
                            <span className="text-[10px] bg-emerald-200/70 text-emerald-800 px-1.5 py-0.2 rounded font-bold">MIN</span>
                          </div>
                          <div className="text-2xl font-black text-emerald-950 font-mono mt-1">
                            {demographicSummary.minorityTotal}%
                          </div>
                          <div className="text-[11px] text-emerald-700 mt-0.5 font-mono">
                            ~{Math.round((demographicSummary.minorityTotal / 100) * electorateBase).toLocaleString()} voters
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-emerald-100 text-[11px]">
                          <span className={demographicSummary.minorityTotal >= 8.5 ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                            {demographicSummary.minorityTotal >= 8.5 ? `+${(demographicSummary.minorityTotal - 8.5).toFixed(1)}%` : `${(demographicSummary.minorityTotal - 8.5).toFixed(1)}%`} vs State
                          </span>
                        </div>
                      </div>

                      {/* Open Categories */}
                      <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-rose-800">Open Categories</span>
                            <span className="text-[10px] bg-rose-200/70 text-rose-800 px-1.5 py-0.2 rounded font-bold">OC</span>
                          </div>
                          <div className="text-2xl font-black text-rose-950 font-mono mt-1">
                            {demographicSummary.ocTotal}%
                          </div>
                          <div className="text-[11px] text-rose-700 mt-0.5 font-mono">
                            ~{Math.round((demographicSummary.ocTotal / 100) * electorateBase).toLocaleString()} voters
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-rose-100 text-[11px]">
                          <span className={demographicSummary.ocTotal >= 19.7 ? 'text-rose-700 font-semibold' : 'text-slate-600'}>
                            {demographicSummary.ocTotal >= 19.7 ? `+${(demographicSummary.ocTotal - 19.7).toFixed(1)}%` : `${(demographicSummary.ocTotal - 19.7).toFixed(1)}%`} vs State
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Granular 14-Community Electorate Table & Share */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2 text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        Constituency Community Breakdown (14 Demographic Census Segments)
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Ranked by Electorate Share
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                            <th className="py-2 px-3 w-12 text-center">#</th>
                            <th className="py-2 px-3">Community / Caste</th>
                            <th className="py-2 px-3">Broad Category</th>
                            <th className="py-2 px-3 text-right">Population %</th>
                            <th className="py-2 px-3 text-right">Estimated Electorate</th>
                            <th className="py-2 px-3 w-44">Proportion</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {demographicSummary.sortedCommunities.map((c, idx) => {
                            const estCount = Math.round((c.pct / 100) * electorateBase);
                            return (
                              <tr key={c.key} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-2 px-3 text-center font-mono text-slate-400 font-bold">
                                  {idx + 1}
                                </td>
                                <td className="py-2 px-3 font-bold text-slate-900">
                                  {c.meta.name}
                                </td>
                                <td className="py-2 px-3">
                                  <span
                                    className="px-2 py-0.5 rounded text-[11px] font-semibold"
                                    style={{ backgroundColor: c.meta.bg, color: c.meta.color }}
                                  >
                                    {c.meta.category}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                                  {c.pct.toFixed(2)}%
                                </td>
                                <td className="py-2 px-3 text-right font-mono text-slate-600">
                                  {estCount.toLocaleString()}
                                </td>
                                <td className="py-2 px-3">
                                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                      style={{
                                        width: `${Math.min(100, Math.max(4, (c.pct / (demographicSummary.dominant?.pct || 30)) * 100))}%`,
                                        backgroundColor: c.meta.color,
                                      }}
                                      className="h-full rounded-full"
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Age Cohorts Distribution Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                    <div className="mb-4 pb-2 border-b border-slate-100">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        Generational &amp; Age Cohort Electorate Profile
                      </h3>
                      <p className="text-xs text-slate-500">
                        Voter distribution across 4 distinct age brackets and their primary political-welfare priorities.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {/* Cohort 1: 18-25 */}
                      <div className="border border-slate-200 rounded-xl p-3 bg-gradient-to-b from-sky-50/40 to-white flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">18–25 Years</span>
                            <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                              Gen-Z / Youth
                            </span>
                          </div>
                          <div className="text-2xl font-black text-slate-900 font-mono mt-1.5">
                            {acDemographics.age_profile.youth_18_25}%
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            ~{Math.round((acDemographics.age_profile.youth_18_25 / 100) * electorateBase).toLocaleString()} voters
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                            <div
                              style={{ width: `${acDemographics.age_profile.youth_18_25}%` }}
                              className="bg-sky-500 h-full rounded-full"
                            />
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                          <span className="font-semibold text-slate-700">Campaign Levers:</span> APPSC recruitments, Mega DSC, job calendar, skill training, Stree Shakti free RTC bus travel.
                        </div>
                      </div>

                      {/* Cohort 2: 26-40 */}
                      <div className="border border-slate-200 rounded-xl p-3 bg-gradient-to-b from-indigo-50/40 to-white flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">26–40 Years</span>
                            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                              Core Workforce
                            </span>
                          </div>
                          <div className="text-2xl font-black text-slate-900 font-mono mt-1.5">
                            {acDemographics.age_profile.age_26_40}%
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            ~{Math.round((acDemographics.age_profile.age_26_40 / 100) * electorateBase).toLocaleString()} voters
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                            <div
                              style={{ width: `${acDemographics.age_profile.age_26_40}%` }}
                              className="bg-indigo-500 h-full rounded-full"
                            />
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                          <span className="font-semibold text-slate-700">Campaign Levers:</span> Private sector employment, Indiramma housing, SME business loans, inflation.
                        </div>
                      </div>

                      {/* Cohort 3: 41-60 */}
                      <div className="border border-slate-200 rounded-xl p-3 bg-gradient-to-b from-emerald-50/40 to-white flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">41–60 Years</span>
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                              Family Heads
                            </span>
                          </div>
                          <div className="text-2xl font-black text-slate-900 font-mono mt-1.5">
                            {acDemographics.age_profile.age_41_60}%
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            ~{Math.round((acDemographics.age_profile.age_41_60 / 100) * electorateBase).toLocaleString()} voters
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                            <div
                              style={{ width: `${acDemographics.age_profile.age_41_60}%` }}
                              className="bg-emerald-500 h-full rounded-full"
                            />
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                          <span className="font-semibold text-slate-700">Campaign Levers:</span> Rythu Bharosa / crop loan waivers, continuous agricultural power, MSP guarantees.
                        </div>
                      </div>

                      {/* Cohort 4: 60+ */}
                      <div className="border border-slate-200 rounded-xl p-3 bg-gradient-to-b from-amber-50/40 to-white flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">60+ Years</span>
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                              Senior Elders
                            </span>
                          </div>
                          <div className="text-2xl font-black text-slate-900 font-mono mt-1.5">
                            {acDemographics.age_profile.age_60_plus}%
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            ~{Math.round((acDemographics.age_profile.age_60_plus / 100) * electorateBase).toLocaleString()} voters
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                            <div
                              style={{ width: `${acDemographics.age_profile.age_60_plus}%` }}
                              className="bg-amber-500 h-full rounded-full"
                            />
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                          <span className="font-semibold text-slate-700">Campaign Levers:</span> Aasara social security pensions, Aarogyasri health coverage, subsidized pilgrimage.
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-10 text-center space-y-3">
                  <PieChart className="w-10 h-10 text-slate-400 mx-auto" />
                  <div className="font-bold text-slate-800 text-sm">Demographics Loading</div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Constituency-level caste and age survey data from the Directorate of Economics and Statistics is currently loading.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: KEY TOPICS & LOCAL ISSUES */}
          {dossierTab === 'topics' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {acTopics ? (
                <>
                  {/* Hero Pulse & Primary Concern Banner */}
                  <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 text-white p-5 rounded-xl border border-rose-700/40 shadow-xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className="bg-rose-500/20 text-rose-300 border border-rose-400/40 font-mono text-xs px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-rose-400" />
                          Primary Local Battleground Focus
                        </span>
                        <span className="text-xs text-slate-300">
                          AC #{data.ac_no} {data.ac_name}
                        </span>
                      </div>
                      <span className="text-xs bg-slate-800/80 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                        {acTopics.key_issues.length} Verified Field Issues
                      </span>
                    </div>

                    <div className="text-xl sm:text-2xl font-black text-rose-100 tracking-tight">
                      {acTopics.primary_concern}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-4xl">
                      {acTopics.summary}
                    </p>

                    <div className="bg-black/30 border border-rose-500/20 rounded-lg p-3 text-xs text-rose-200/90 mt-2">
                      <span className="font-bold text-white mr-1.5">Electoral Ground Pulse (2023):</span>
                      {acTopics.ground_pulse}
                    </div>
                  </div>

                  {/* Key Local Issues Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Target className="w-4 h-4 text-indigo-600" />
                        Specific Local Grievances &amp; Policy Flashpoints
                      </h3>
                      <span className="text-xs text-slate-400">
                        Ranked by field urgency
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {acTopics.key_issues.map((issue, idx) => {
                        const isCritical = issue.impact_level === 'Critical';
                        const isHigh = issue.impact_level === 'High';

                        return (
                          <div
                            key={idx}
                            className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs rounded-xl p-4 flex flex-col justify-between transition-all"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  {issue.category === 'Infrastructure' && <Building2 className="w-3 h-3 text-slate-500" />}
                                  {issue.category === 'Agriculture & Irrigation' && <Target className="w-3 h-3 text-emerald-600" />}
                                  {issue.category === 'Employment & Industry' && <Briefcase className="w-3 h-3 text-blue-600" />}
                                  {issue.category === 'Welfare & Social' && <Users className="w-3 h-3 text-purple-600" />}
                                  {issue.category === 'Governance & Local' && <MapPin className="w-3 h-3 text-amber-600" />}
                                  {issue.category}
                                </span>

                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                    isCritical
                                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                                      : isHigh
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : 'bg-blue-50 text-blue-700 border-blue-200'
                                  }`}
                                >
                                  {issue.impact_level} Impact
                                </span>
                              </div>

                              <h4 className="font-bold text-slate-900 text-sm mb-1.5 leading-snug">
                                {issue.title}
                              </h4>

                              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                                {issue.description}
                              </p>
                            </div>

                            {issue.affected_demographic && (
                              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
                                <Users className="w-3 h-3 text-indigo-500 shrink-0" />
                                <span className="font-medium text-slate-700">Affected:</span>
                                <span className="truncate">{issue.affected_demographic}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Landmark Projects & Economic Infrastructure */}
                  {acTopics.key_projects && acTopics.key_projects.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2 mb-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Key Infrastructure, Industrial &amp; Irrigation Assets
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {acTopics.key_projects.map((proj, pIdx) => (
                          <div
                            key={pIdx}
                            className="bg-white border border-slate-200 text-slate-800 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-2xs"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="font-medium">{proj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-10 text-center space-y-3">
                  <Flame className="w-10 h-10 text-slate-400 mx-auto" />
                  <div className="font-bold text-slate-800 text-sm">Topic Dossier Being Compiled</div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Verified constituency intelligence brief for AC #{data.ac_no} is currently being compiled from local field reports.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div>
            Data Sources: Election Commission of India (ECI Form 20) &middot; Association for Democratic Reforms (ADR) &middot; DES Andhra Pradesh (Demographics Profile)
          </div>
          <div className="text-slate-400">
            Andhra Pradesh Assembly Constituency Intelligence Dossier
          </div>
        </div>
      </>
    );

    if (isBoothMapOnly) {
      return (
        <div className="h-screen w-full bg-slate-100 text-slate-900 flex flex-col font-sans overflow-hidden">
          {/* Standalone Map Sticky Navbar */}
          <header className="shrink-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-slate-900 shadow-xs">
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={handleExitBoothMapOnly}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-semibold border border-slate-300 transition-all cursor-pointer shadow-2xs"
                title={`Return to AC #${data.ac_no} Dossier`}
              >
                <ArrowLeft className="w-4 h-4 text-indigo-600" />
                <span>Back to AC #{data.ac_no} Dossier</span>
              </button>

              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-medium hover:underline transition-all cursor-pointer"
                title="Return to State Map and Election Dashboard"
              >
                <span>State Overview</span>
              </button>

              <div className="h-4 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-indigo-600 text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-md">
                  AC #{data.ac_no}
                </span>
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">{data.ac_name}</h1>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 font-medium">
                  {data.district} District
                </span>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                  🗺️ Polling Station Geospatial &amp; Field Triage Map
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {allConstituencies && allConstituencies.length > 0 && onSelectAc && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 hidden sm:inline">Constituency:</span>
                  <select
                    value={data.ac_no}
                    onChange={(e) => onSelectAc(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden font-medium cursor-pointer shadow-2xs"
                  >
                    {allConstituencies.map((c) => (
                      <option key={c.ac_no} value={c.ac_no}>
                        #{c.ac_no} {c.ac_name} ({c.district})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {form20Url && (
                <a
                  href={form20Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  title="View Certified Official Form-20 Polling Station PDF from CEO Andhra Pradesh"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Official</span> Form-20 PDF
                  <ExternalLink className="w-3 h-3 text-emerald-200" />
                </a>
              )}
            </div>
          </header>

          {/* Full Page Body with Only the Map Box */}
          <main className="w-full flex-1 flex flex-col p-2 sm:p-3 min-h-0 overflow-hidden">
            <BoothPannaDeficitSolver
              acNo={data.ac_no}
              acName={data.ac_name}
              district={data.district}
              mandals={mandals}
              totalValidVotes={data.total_valid_votes}
              winnerParty={data.candidates[0]?.party || 'TDP'}
              winnerCandidate={data.candidates[0]?.name || 'Winner'}
              winnerVotes={data.candidates[0]?.votes || 0}
              runnerParty={data.candidates[1]?.party || 'YSRCP'}
              runnerCandidate={data.candidates[1]?.name || 'Runner-up'}
              runnerVotes={data.candidates[1]?.votes || 0}
              geoJsonData={geoJsonData}
              standaloneMapOnly={true}
              onNavigateToBoothData={onNavigateToBoothData}
            />
          </main>
        </div>
      );
    }

    return (
      <div className="min-h-screen w-full bg-slate-100 text-slate-800 flex flex-col font-sans">
        {/* Full Page Sticky Navbar */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-slate-900 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-semibold border border-slate-300 transition-all cursor-pointer shadow-2xs"
              title="Return to State Map and Election Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600" />
              <span>Back to State Overview</span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-indigo-600 text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-md">
                AC #{data.ac_no}
              </span>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">{data.ac_name}</h1>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 font-medium">
                {data.district} District (26 AP)
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                Lok Sabha: {data.pc_name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {allConstituencies && allConstituencies.length > 0 && onSelectAc && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 hidden sm:inline">Constituency:</span>
                <select
                  value={data.ac_no}
                  onChange={(e) => onSelectAc(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden font-medium cursor-pointer shadow-2xs"
                >
                  {allConstituencies.map((c) => (
                    <option key={c.ac_no} value={c.ac_no}>
                      #{c.ac_no} {c.ac_name} ({c.district})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {form20Url && (
              <a
                href={form20Url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs"
                title="View Certified Official Form-20 Polling Station PDF from CEO Andhra Pradesh"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Official</span> Form-20 PDF
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </a>
            )}
          </div>
        </header>

        {/* Full Page Body */}
        <main className="w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 flex-1 flex flex-col">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1">
            {dossierTabsAndContent}
          </div>
        </main>
      </div>
    );
  };
