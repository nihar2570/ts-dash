import React, { useState, useMemo } from 'react';
import type { ConstituencyCandidatesData, SeeepcDataset } from '../types';
import { getPartyColor, getPartyBg } from '../types';
import {
  ExternalLink,
  X,
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
  Maximize2,
  Minimize2,
  ArrowLeft,
} from 'lucide-react';
import { CONSTITUENCY_MANDALS } from '../data/mandalData';
import { FORM_20_URLS } from '../data/form20Urls';
import { CONSTITUENCY_TOPICS } from '../data/constituencyTopics';
import { CandidateEquityDecomposer } from './CandidateEquityDecomposer';
import { BoothPannaDeficitSolver } from './BoothPannaDeficitSolver';

interface ConstituencyDossierProps {
  data: ConstituencyCandidatesData | null;
  isOpen: boolean;
  onClose: () => void;
  seeepcData?: SeeepcDataset | null;
  isFullPageView?: boolean;
  onSelectAc?: (acNo: number) => void;
  allConstituencies?: { ac_no: number; ac_name: string; district: string }[];
}

export const ConstituencyDossier: React.FC<ConstituencyDossierProps> = ({
  data,
  isOpen,
  onClose,
  seeepcData,
  isFullPageView = false,
  onSelectAc,
  allConstituencies,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [dossierTab, setDossierTab] = useState<'candidates' | 'mandals' | 'demographics' | 'topics'>('candidates');
  const [minVotes, setMinVotes] = useState<number>(1000);
  const [topLimit, setTopLimit] = useState<number | 'ALL'>('ALL');
  const [filterMode, setFilterMode] = useState<'1000' | '5000' | 'all'>('1000');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Column visibility toggles (defaulted to OFF, shown only when toggled ON individually)
  const [showAge, setShowAge] = useState<boolean>(false);
  const [showEducation, setShowEducation] = useState<boolean>(false);
  const [showCriminalCases, setShowCriminalCases] = useState<boolean>(false);
  const [showNetWorth, setShowNetWorth] = useState<boolean>(false);

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
    const totalElectorate = mandals.reduce((sum, m) => sum + (m.electorate || 0), 0);
    const avgTurnout =
      mandals.length > 0
        ? (mandals.reduce((sum, m) => sum + (m.turnout_pct || 0), 0) / mandals.length).toFixed(1)
        : '0.0';
    return { totalBooths, totalElectorate, avgTurnout };
  }, [mandals]);

  // AC Demographics & Key Topics hooks
  const acDemographics = useMemo(() => {
    if (!data || !seeepcData?.constituencies) return null;
    return seeepcData.constituencies[String(data.ac_no)] || null;
  }, [data, seeepcData]);

  const acTopics = useMemo(() => {
    if (!data) return null;
    return CONSTITUENCY_TOPICS[data.ac_no] || null;
  }, [data]);

  const demographicSummary = useMemo(() => {
    if (!acDemographics?.caste_profile) return null;
    const cp = acDemographics.caste_profile;
    const bcTotal = Number((
      (cp.bc_mudiraj || 0) +
      (cp.bc_munnuru_kapu || 0) +
      (cp.bc_padmashali || 0) +
      (cp.bc_goud || 0) +
      (cp.bc_yadav || 0) +
      (cp.bc_other || 0)
    ).toFixed(1));

    const scTotal = Number(((cp.sc_madiga || 0) + (cp.sc_mala || 0)).toFixed(1));
    const stTotal = Number(((cp.st_lambada || 0) + (cp.st_koya_gond || 0)).toFixed(1));
    const minorityTotal = Number((cp.minority_muslim || 0).toFixed(1));
    const ocTotal = Number(((cp.oc_reddy || 0) + (cp.oc_velama || 0) + (cp.oc_other || 0)).toFixed(1));

    const COMM_META: Record<string, { name: string; category: string; color: string; bg: string }> = {
      sc_madiga: { name: 'SC Madiga', category: 'Scheduled Castes', color: '#6366f1', bg: '#e0e7ff' },
      sc_mala: { name: 'SC Mala', category: 'Scheduled Castes', color: '#818cf8', bg: '#ede9fe' },
      st_lambada: { name: 'ST Lambada', category: 'Scheduled Tribes', color: '#f59e0b', bg: '#fef3c7' },
      st_koya_gond: { name: 'ST Koya / Gond', category: 'Scheduled Tribes', color: '#d97706', bg: '#fef3c7' },
      bc_mudiraj: { name: 'BC Mudiraj', category: 'Backward Classes', color: '#06b6d4', bg: '#cffafe' },
      bc_munnuru_kapu: { name: 'BC Munnuru Kapu', category: 'Backward Classes', color: '#10b981', bg: '#d1fae5' },
      bc_padmashali: { name: 'BC Padmashali', category: 'Backward Classes', color: '#14b8a6', bg: '#ccfbf1' },
      bc_goud: { name: 'BC Goud', category: 'Backward Classes', color: '#0ea5e9', bg: '#e0f2fe' },
      bc_yadav: { name: 'BC Yadav', category: 'Backward Classes', color: '#3b82f6', bg: '#dbeafe' },
      bc_other: { name: 'Other BCs', category: 'Backward Classes', color: '#64748b', bg: '#f1f5f9' },
      minority_muslim: { name: 'Muslim Minorities', category: 'Religious Minorities', color: '#16a34a', bg: '#dcfce7' },
      oc_reddy: { name: 'OC Reddy', category: 'Open Categories', color: '#e11d48', bg: '#ffe4e6' },
      oc_velama: { name: 'OC Velama', category: 'Open Categories', color: '#f43f5e', bg: '#ffe4e6' },
      oc_other: { name: 'Other OCs', category: 'Open Categories', color: '#94a3b8', bg: '#f8fafc' },
    };

    const sortedCommunities = Object.entries(cp)
      .map(([key, pct]) => ({
        key,
        pct: Number(pct.toFixed(2)),
        meta: COMM_META[key] || { name: key, category: 'Other', color: '#64748b', bg: '#f1f5f9' },
      }))
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

  const openInNewTab = () => {
    const url = `${window.location.origin}${window.location.pathname}?dossier=${data.ac_no}&view=full`;
    window.open(url, '_blank');
  };

  const dossierTabsAndContent = (
    <>
      {/* Dossier Section Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={() => setDossierTab('candidates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                dossierTab === 'candidates'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Candidates &amp; ADR ({data.candidates.length})</span>
            </button>
            <button
              onClick={() => setDossierTab('mandals')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                dossierTab === 'mandals'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Mandals &amp; Booths ({mandals.length})</span>
            </button>
            <button
              onClick={() => setDossierTab('demographics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                dossierTab === 'demographics'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-cyan-400" />
              <span>Demographics (Caste &amp; Age)</span>
            </button>
            <button
              onClick={() => setDossierTab('topics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                dossierTab === 'topics'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Key Topics &amp; Issues</span>
              {acTopics && (
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-mono font-bold">
                  {acTopics.key_issues.length}
                </span>
              )}
            </button>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            AC #{data.ac_no} {data.ac_name}
          </span>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: CANDIDATES & ADR PROFILE */}
          {dossierTab === 'candidates' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Vote className="w-4 h-4 text-indigo-600" />
                <span>Total Valid Votes</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {data.total_valid_votes.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">Total cast ballot count</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Victory Margin</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {margin.toLocaleString()}{' '}
                <span className="text-xs font-bold text-slate-500">({marginPct}%)</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Winner: <span className="font-semibold text-slate-800">{winner?.party}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Total Candidates</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {data.total_candidates}
              </div>
              <div className="text-[11px] text-slate-500">
                {data.candidates_above_1000} polled &ge; 1,000 votes
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>ADR MyNeta Profile</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {adrStats.crorepatiCount}{' '}
                <span className="text-xs font-semibold text-slate-500">Crorepatis</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {adrStats.totalCriminalCases} criminal cases across {adrStats.candidatesWithCases} candidates
              </div>
            </div>
          </div>

          {/* Visual Vote Stack Distribution Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Vote Share Distribution (2023)
              </span>
              <span className="text-slate-500 text-xs">
                Total Contenders: {data.total_candidates} candidates
              </span>
            </div>
            {/* Multi-segment progress bar */}
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              {data.candidates.slice(0, 6).map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: `${c.vote_share}%`,
                    backgroundColor: c.is_nota ? '#94a3b8' : getPartyColor(c.party),
                  }}
                  className="h-full transition-all relative group"
                  title={`${c.name} (${c.party}): ${c.vote_share}% (${c.votes.toLocaleString()} votes)`}
                />
              ))}
            </div>
            {/* Top 4 Legend below progress bar */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs pt-1">
              {data.candidates.slice(0, 4).map((c, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: c.is_nota ? '#94a3b8' : getPartyColor(c.party) }}
                  />
                  <span className="font-semibold text-slate-800">{c.party}:</span>
                  <span className="text-slate-600">{c.vote_share}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature #6: Candidate Personal Equity vs Party Symbol Decomposer */}
          <CandidateEquityDecomposer
            acNo={data.ac_no}
            acName={data.ac_name}
            winnerCandidate={data.candidates[0]}
            runnerCandidate={data.candidates[1]}
            totalValidVotes={data.total_valid_votes}
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
                &ge; 1,000 Votes (Default)
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
                &ge; 5,000 Votes
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
                {filterMode === '1000' && '(polling &ge; 1,000 votes)'}
                {filterMode === '5000' && '(polling &ge; 5,000 votes)'}
              </span>

              {/* Individual Column Toggles */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-500 mr-0.5">
                  Show Columns:
                </span>

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
          {/* Form-20 Official Verification Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 border border-slate-700/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Official CEO Telangana Source
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  Form-20 Polling Station Result Sheets
                </span>
              </div>
              <p className="text-[11px] text-slate-400 max-w-2xl leading-relaxed">
                Statutory Form-20 records certify individual EVM vote counts across all {mandalTotals.totalBooths} polling stations for {data.ac_name}. Mandals below represent official Delimitation 2008 &amp; TS Revenue revenue clusters with modeled booth allocations.
              </p>
            </div>
            {form20Url && (
              <a
                href={form20Url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
                title="Open official CEO Telangana Form-20 PDF in new tab"
              >
                <FileText className="w-3.5 h-3.5" />
                View Official Form-20 PDF
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
              </a>
            )}
          </div>

          {/* Mandal KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Revenue Mandals / Circles</span>
              </div>
              <div className="text-xl font-black text-slate-900">{mandals.length}</div>
              <div className="text-[11px] text-slate-500">Delimitation 2008 Mandals</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Vote className="w-4 h-4 text-emerald-600" />
                <span>Polling Stations (Booths)</span>
              </div>
              <div className="text-xl font-black text-slate-900">{mandalTotals.totalBooths}</div>
              <div className="text-[11px] text-slate-500">Form-20 Polling Stations</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Total Electorate</span>
              </div>
              <div className="text-xl font-black text-slate-900">
                {mandalTotals.totalElectorate.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">Registered Assembly Electors</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span>Average Turnout</span>
              </div>
              <div className="text-xl font-black text-slate-900">{mandalTotals.avgTurnout}%</div>
              <div className="text-[11px] text-slate-500">2023 Form-20 Voter Turnout</div>
            </div>
          </div>

          {/* Feature #5: Form-20 Polling Station Deficit & Panna Pramukh Triage Solver */}
          <BoothPannaDeficitSolver
            acNo={data.ac_no}
            acName={data.ac_name}
            district={data.district}
            mandals={mandals}
            totalValidVotes={data.total_valid_votes}
            winnerParty={data.candidates[0]?.party || 'INC'}
            winnerCandidate={data.candidates[0]?.name || 'Winner'}
            winnerVotes={data.candidates[0]?.votes || 0}
            runnerParty={data.candidates[1]?.party || 'BRS'}
            runnerCandidate={data.candidates[1]?.name || 'Runner-up'}
            runnerVotes={data.candidates[1]?.votes || 0}
          />
        </div>
      )}

          {/* TAB 3: DEMOGRAPHICS (CASTE & AGE) */}
          {dossierTab === 'demographics' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {acDemographics && demographicSummary ? (
                <>
                  {/* SEEEPC Survey Header / Context Banner */}
                  <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-800 text-white p-4 rounded-xl border border-indigo-700/50 shadow-xs flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-indigo-500 text-white font-mono text-xs px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                          <PieChart className="w-3.5 h-3.5" />
                          SEEEPC Vol-IV
                        </span>
                        <span className="font-bold text-sm text-slate-100">
                          Official Socio-Economic &amp; Caste Census Survey
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
                        Door-to-door enumeration data by Directorate of Economics &amp; Statistics (DES), Government of Telangana.
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
                          Broad Social Coalition Composition (SEEEPC Model)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Aggregated voter shares across the five constitutional and reservation groupings with state baseline comparison.
                        </p>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        TS State Baseline: BC 46.3% &middot; SC 17.4% &middot; ST 10.4% &middot; Min 11.8% &middot; OC 15.8%
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
                          <span className={demographicSummary.bcTotal >= 46.27 ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                            {demographicSummary.bcTotal >= 46.27 ? `+${(demographicSummary.bcTotal - 46.27).toFixed(1)}%` : `${(demographicSummary.bcTotal - 46.27).toFixed(1)}%`} vs State
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
                          <span className={demographicSummary.scTotal >= 17.42 ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                            {demographicSummary.scTotal >= 17.42 ? `+${(demographicSummary.scTotal - 17.42).toFixed(1)}%` : `${(demographicSummary.scTotal - 17.42).toFixed(1)}%`} vs State
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
                          <span className={demographicSummary.stTotal >= 10.43 ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                            {demographicSummary.stTotal >= 10.43 ? `+${(demographicSummary.stTotal - 10.43).toFixed(1)}%` : `${(demographicSummary.stTotal - 10.43).toFixed(1)}%`} vs State
                          </span>
                        </div>
                      </div>

                      {/* Minorities */}
                      <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-800">Muslim Minorities</span>
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
                          <span className={demographicSummary.minorityTotal >= 11.84 ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                            {demographicSummary.minorityTotal >= 11.84 ? `+${(demographicSummary.minorityTotal - 11.84).toFixed(1)}%` : `${(demographicSummary.minorityTotal - 11.84).toFixed(1)}%`} vs State
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
                          <span className={demographicSummary.ocTotal >= 15.79 ? 'text-rose-700 font-semibold' : 'text-slate-600'}>
                            {demographicSummary.ocTotal >= 15.79 ? `+${(demographicSummary.ocTotal - 15.79).toFixed(1)}%` : `${(demographicSummary.ocTotal - 15.79).toFixed(1)}%`} vs State
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
                        Constituency Community Breakdown (14 SEEEPC Census Segments)
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
                          <span className="font-semibold text-slate-700">Campaign Levers:</span> TSPSC recruitments, job calendar, tech allowances, free RTC bus travel.
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
                  <div className="font-bold text-slate-800 text-sm">SEEEPC Demographics Loading</div>
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
            Data Sources: Election Commission of India (ECI Form 20) &middot; Association for Democratic Reforms (ADR) &middot; DES Telangana (SEEEPC Survey Vol-IV)
          </div>
          <div className="text-slate-400">
            Telangana Assembly Constituency Intelligence Dossier
          </div>
        </div>
      </>
    );

    if (isFullPageView) {
      return (
        <div className="min-h-screen w-full bg-slate-950 text-slate-800 flex flex-col font-sans">
          {/* Full Page Sticky Navbar */}
          <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition-all cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4 text-indigo-400" />
                <span>Back to Dashboard Map</span>
              </button>

              <div className="h-4 w-px bg-slate-800 hidden sm:block" />

              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-indigo-600 text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-md">
                  AC #{data.ac_no}
                </span>
                <h1 className="text-lg sm:text-xl font-black tracking-tight">{data.ac_name}</h1>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-medium">
                  {data.district} District (33 TS)
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                  Lok Sabha: {data.pc_name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {allConstituencies && allConstituencies.length > 0 && onSelectAc && (
                <select
                  value={data.ac_no}
                  onChange={(e) => onSelectAc(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-hidden font-medium cursor-pointer"
                >
                  {allConstituencies.map((c) => (
                    <option key={c.ac_no} value={c.ac_no}>
                      #{c.ac_no} {c.ac_name} ({c.district})
                    </option>
                  ))}
                </select>
              )}

              {form20Url && (
                <a
                  href={form20Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold border border-emerald-500/50 transition-all cursor-pointer shadow-xs"
                  title="View Certified Official Form-20 Polling Station PDF from CEO Telangana"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Official Form-20 PDF</span>
                  <ExternalLink className="w-3 h-3 text-emerald-300" />
                </a>
              )}
            </div>
          </header>

          {/* Full Page Body */}
          <main className="w-full max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 flex-1 flex flex-col">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col flex-1">
              {dossierTabsAndContent}
            </div>
          </main>
        </div>
      );
    }

    return (
      <div
        className={`fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 ${
          isFullScreen ? 'p-0' : 'p-2 sm:p-4'
        }`}
      >
        <div
          className={`bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-800 transition-all duration-200 ${
            isFullScreen
              ? 'w-full h-full rounded-none max-w-none max-h-none'
              : 'w-full max-w-5xl max-h-[92vh] rounded-2xl'
          }`}
        >
          {/* Top Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="bg-indigo-600 text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-md">
                  AC #{data.ac_no}
                </span>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">{data.ac_name}</h2>
                <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-medium">
                  {data.district} District (33 TS)
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                  Lok Sabha: {data.pc_name}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Constituency Election Intelligence Dossier &middot; 2023 Assembly Ballot &middot; MyNeta ADR Disclosures
              </p>
            </div>

            <div className="flex items-center gap-2">
              {form20Url && (
                <a
                  href={form20Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold border border-emerald-500/50 transition-all shadow-xs cursor-pointer"
                  title="View Certified Official Form-20 Polling Station PDF from CEO Telangana"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Official</span> Form-20 PDF
                </a>
              )}
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition-all shadow-xs cursor-pointer"
                title={isFullScreen ? 'Restore Modal Window' : 'Maximize to Full Screen'}
              >
                {isFullScreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Restore</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Maximize</span>
                  </>
                )}
              </button>
              <button
                onClick={openInNewTab}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold border border-indigo-500/50 transition-all shadow-xs cursor-pointer"
                title="Open full page in a new standalone tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in New Tab</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
                title="Close Dossier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {dossierTabsAndContent}
        </div>
      </div>
    );
  };
