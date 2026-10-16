import React, { useState, useMemo } from 'react';
import {
  X,
  RotateCcw,
  Sparkles,
  Search,
  Lock,
  Unlock,
  Sliders,
  TrendingUp,
  CheckCircle,
  Flame,
} from 'lucide-react';
import type { SeeepcDataset } from '../types';

export interface PartySwing {
  INC: number;
  BRS: number;
  BJP: number;
}

export interface MacroSwing {
  INC: number;
  BRS: number;
  BJP: number;
}

interface SwingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SeeepcDataset;
  swings: Record<string, PartySwing>;
  setSwings: React.Dispatch<React.SetStateAction<Record<string, PartySwing>>>;
  macroSwing: MacroSwing;
  setMacroSwing: React.Dispatch<React.SetStateAction<MacroSwing>>;
  tally: {
    counts: Record<string, number>;
    flippedCount: number;
    tossUpCount: number;
    incDiff: number;
    brsDiff: number;
    bjpDiff: number;
  };
  onApplyPreset?: (presetKey: string) => void;
  activePreset?: string;
}

export const DECISIVE_KEYS = new Set([
  'bc_mudiraj',
  'bc_munnuru_kapu',
  'bc_padmashali',
  'bc_goud',
  'sc_madiga',
  'st_lambada',
  'youth_18_25',
]);

export interface CommunityMeta {
  key: string;
  name: string;
  category: 'BC' | 'SC_ST' | 'OC_MIN' | 'AGE';
  categoryLabel: string;
  sharePct: string;
  region: string;
  keyIssues: string;
}

export const ALL_COMMUNITIES: CommunityMeta[] = [
  // Backward Classes (BCs ~50% TS)
  {
    key: 'bc_mudiraj',
    name: 'Mudiraj (BC-D)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~12%',
    region: 'North Telangana, Nizamabad, Karimnagar, Medak',
    keyIssues: 'BC sub-categorization, fisheries corp, political representation',
  },
  {
    key: 'bc_munnuru_kapu',
    name: 'Munnuru Kapu (BC-D)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~10%',
    region: 'Karimnagar, Jagtial, Adilabad, Nizamabad',
    keyIssues: 'Turmeric board, agrarian price support, BC quota leadership',
  },
  {
    key: 'bc_padmashali',
    name: 'Padmashali (BC-B)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~6%',
    region: 'Sircilla, Pochampally, Warangal, Nalgonda',
    keyIssues: 'Weaver yarn subsidies, power bill waivers, handloom revival',
  },
  {
    key: 'bc_goud',
    name: 'Goud / Ediga (BC-B)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~7%',
    region: 'Nalgonda, Mahabubnagar, Ranga Reddy, Medak',
    keyIssues: 'Toddy tappers safety, excise policy reforms, Neera cafe incentives',
  },
  {
    key: 'bc_yadav',
    name: 'Yadav / Kuruma (BC-D)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~8%',
    region: 'Suryapet, Yadadri, Mahabubnagar, Warangal',
    keyIssues: 'Sheep distribution scheme revival, livestock insurance, dairy quota',
  },
  {
    key: 'bc_other',
    name: 'Other BC Communities (BC-A/E)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~7%',
    region: 'Statewide distributed across rural & semi-urban belts',
    keyIssues: 'BC hostel infrastructure, artisan loans, skill scholarships',
  },

  // SC & ST Communities (~28% TS)
  {
    key: 'sc_madiga',
    name: 'SC Madiga',
    category: 'SC_ST',
    categoryLabel: 'SC & ST Communities',
    sharePct: '~11%',
    region: 'Statewide: Warangal, Khammam, Nalgonda, Karimnagar',
    keyIssues: 'SC sub-categorization (A/B/C/D), MRPS demands, job backlogs',
  },
  {
    key: 'sc_mala',
    name: 'SC Mala',
    category: 'SC_ST',
    categoryLabel: 'SC & ST Communities',
    sharePct: '~6%',
    region: 'Statewide: Hyderabad outskirts, Khammam, Medak',
    keyIssues: 'Dalit Bandhu continuation, educational access, land rights',
  },
  {
    key: 'st_lambada',
    name: 'ST Lambada / Banjara',
    category: 'SC_ST',
    categoryLabel: 'SC & ST Communities',
    sharePct: '~7%',
    region: 'Mahabubnagar, Nalgonda, Khammam, Ranga Reddy',
    keyIssues: 'Thanda gram panchayat development funds, Podu land pattas',
  },
  {
    key: 'st_koya_gond',
    name: 'ST Koya & Gond (Adivasi)',
    category: 'SC_ST',
    categoryLabel: 'SC & ST Communities',
    sharePct: '~3%',
    region: 'Agency tracts: Adilabad, Asifabad, Mulugu, Bhadradri',
    keyIssues: '1/70 Agency Act protection, forest rights, tribal healthcare',
  },

  // Minorities & General / OCs (~22% TS)
  {
    key: 'minority_muslim',
    name: 'Muslim Minorities',
    category: 'OC_MIN',
    categoryLabel: 'Minorities & OCs',
    sharePct: '~13%',
    region: 'Hyderabad (Old City & Outskirts), Nizamabad, Mahabubnagar',
    keyIssues: '4% BC-E quota preservation, Waqf land protection, minority residential schools',
  },
  {
    key: 'oc_reddy',
    name: 'Reddy (OC)',
    category: 'OC_MIN',
    categoryLabel: 'Minorities & OCs',
    sharePct: '~7%',
    region: 'Nalgonda, Mahabubnagar, Ranga Reddy, Khammam',
    keyIssues: 'Political leadership consolidation, irrigation projects, Rythu Bharosa',
  },
  {
    key: 'oc_velama',
    name: 'Velama (OC)',
    category: 'OC_MIN',
    categoryLabel: 'Minorities & OCs',
    sharePct: '~3%',
    region: 'Karimnagar, Medak, Warangal, Siddipet',
    keyIssues: 'BRS political base, agricultural infrastructure, urban investments',
  },
  {
    key: 'oc_other',
    name: 'Other General (Brahmin, Arya Vysya, etc.)',
    category: 'OC_MIN',
    categoryLabel: 'Minorities & OCs',
    sharePct: '~5%',
    region: 'Urban Hyderabad, Secunderabad, Warangal, Nizamabad',
    keyIssues: 'EWS reservations, trader welfare, urban civic infrastructure',
  },

  // Age & Demographic Cohorts
  {
    key: 'youth_18_25',
    name: 'Youth & First-Time Voters (18-25)',
    category: 'AGE',
    categoryLabel: 'Demographic Cohorts',
    sharePct: '~18%',
    region: 'All 119 Constituencies',
    keyIssues: 'TSPSC exam integrity, job calendar releases, IT hiring, Rajiv Yuva Shakthi',
  },
  {
    key: 'age_26_40',
    name: 'Working Age Cohort (26-40)',
    category: 'AGE',
    categoryLabel: 'Demographic Cohorts',
    sharePct: '~32%',
    region: 'All 119 Constituencies',
    keyIssues: 'Indiramma housing delivery, price stability, MSME credit',
  },
  {
    key: 'age_41_60',
    name: 'Middle Age / Farmers (41-60)',
    category: 'AGE',
    categoryLabel: 'Demographic Cohorts',
    sharePct: '~28%',
    region: 'All 119 Constituencies',
    keyIssues: 'Farmer crop loan waiver up to ₹2 Lakh, Rythu Bharosa bonus',
  },
  {
    key: 'age_60_plus',
    name: 'Senior Citizens & Pensioners (60+)',
    category: 'AGE',
    categoryLabel: 'Demographic Cohorts',
    sharePct: '~12%',
    region: 'All 119 Constituencies',
    keyIssues: 'Aasara pension hike to ₹4,000, free bus travel (Mahalakshmi), health insurance',
  },
];

// Helper to auto-rebalance 100% vote share across INC, BRS, BJP
function rebalanceShares(
  current: { INC: number; BRS: number; BJP: number; OTH: number },
  changedParty: 'INC' | 'BRS' | 'BJP',
  newVal: number,
  locked: { INC?: boolean; BRS?: boolean; BJP?: boolean }
): { INC: number; BRS: number; BJP: number; OTH: number } {
  const maxAllowed = 100 - (current.OTH || 0);
  const clampedVal = Math.max(0, Math.min(maxAllowed, newVal));
  const diff = clampedVal - current[changedParty];
  if (Math.abs(diff) < 0.05) return current;

  const otherParties = (['INC', 'BRS', 'BJP'] as const).filter(
    (p) => p !== changedParty && !locked[p]
  );

  if (otherParties.length === 0) return current;

  const currentPool = otherParties.reduce((acc, p) => acc + current[p], 0);
  const updated = { ...current, [changedParty]: clampedVal };

  if (currentPool === 0) {
    const shareEach = diff / otherParties.length;
    otherParties.forEach((p) => {
      updated[p] = Math.max(0, Math.round((updated[p] - shareEach) * 10) / 10);
    });
  } else {
    let remainingToDeduct = diff;
    otherParties.forEach((p, idx) => {
      if (idx === otherParties.length - 1) {
        updated[p] = Math.max(0, Math.round((current[p] - remainingToDeduct) * 10) / 10);
      } else {
        const proportion = current[p] / currentPool;
        const deduction = Math.round(diff * proportion * 10) / 10;
        updated[p] = Math.max(0, current[p] - deduction);
        remainingToDeduct -= deduction;
      }
    });
  }

  // Exact 100% integrity check
  const targetSum = 100;
  const currentSum = updated.INC + updated.BRS + updated.BJP + (updated.OTH || 0);
  const drift = Math.round((targetSum - currentSum) * 10) / 10;
  if (Math.abs(drift) > 0 && otherParties.length > 0) {
    const adjustParty = otherParties[0];
    updated[adjustParty] = Math.max(0, Math.round((updated[adjustParty] + drift) * 10) / 10);
  }

  return updated;
}

export const SwingStudioModal: React.FC<SwingStudioModalProps> = ({
  isOpen,
  onClose,
  data,
  swings,
  setSwings,
  macroSwing,
  setMacroSwing,
  tally,
  onApplyPreset,
  activePreset,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'DECISIVE' | 'BC' | 'SC_ST' | 'OC_MIN' | 'AGE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [lockedParties, setLockedParties] = useState<Record<string, { INC?: boolean; BRS?: boolean; BJP?: boolean }>>({});
  const [macroLocked, setMacroLocked] = useState<{ INC?: boolean; BRS?: boolean; BJP?: boolean }>({});

  // 2023 Telangana Statewide Baseline
  const statewideBaseline = useMemo(() => {
    return { INC: 39.4, BRS: 37.4, BJP: 13.9, AIMIM: 2.2, OTH: 7.1 };
  }, []);

  // Filtered list of communities
  const filteredCommunities = useMemo(() => {
    return ALL_COMMUNITIES.filter((c) => {
      if (activeTab === 'DECISIVE') {
        if (!DECISIVE_KEYS.has(c.key)) return false;
      } else if (activeTab !== 'ALL' && c.category !== activeTab) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          c.name.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.keyIssues.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeTab, searchQuery]);

  // Count active customizations
  const activeCustomizedCount = useMemo(() => {
    let count = 0;
    Object.values(swings).forEach((s) => {
      if (s.INC !== 0 || s.BRS !== 0 || s.BJP !== 0) count++;
    });
    return count;
  }, [swings]);

  const hasMacroShift = macroSwing.INC !== 0 || macroSwing.BRS !== 0 || macroSwing.BJP !== 0;

  // Reset a single community
  const handleResetCommunity = (key: string) => {
    setSwings((prev) => ({
      ...prev,
      [key]: { INC: 0, BRS: 0, BJP: 0 },
    }));
  };

  // Reset all
  const handleResetAll = () => {
    const resetSwings: Record<string, PartySwing> = {};
    ALL_COMMUNITIES.forEach((c) => {
      resetSwings[c.key] = { INC: 0, BRS: 0, BJP: 0 };
    });
    setSwings(resetSwings);
    setMacroSwing({ INC: 0, BRS: 0, BJP: 0 });
  };

  // Toggle party lock for a community
  const toggleLock = (commKey: string, party: 'INC' | 'BRS' | 'BJP') => {
    setLockedParties((prev) => ({
      ...prev,
      [commKey]: {
        ...prev[commKey],
        [party]: !prev[commKey]?.[party],
      },
    }));
  };

  // Handle Community Party adjustment (Pattern C Segmented Bar)
  const handleAdjustCommunity = (commKey: string, party: 'INC' | 'BRS' | 'BJP', newVal: number) => {
    const baseline = data.baseline_exit_poll?.[commKey] || { INC: 35, BRS: 35, BJP: 25, OTH: 5 };
    const currSwing = swings[commKey] || { INC: 0, BRS: 0, BJP: 0 };

    const currentShares = {
      INC: baseline.INC + currSwing.INC,
      BRS: baseline.BRS + currSwing.BRS,
      BJP: baseline.BJP + currSwing.BJP,
      OTH: baseline.OTH || (baseline.AIMIM ? baseline.AIMIM : 0),
    };

    const locked = lockedParties[commKey] || {};
    const updated = rebalanceShares(currentShares, party, newVal, locked);

    setSwings((prev) => ({
      ...prev,
      [commKey]: {
        INC: Math.round((updated.INC - baseline.INC) * 10) / 10,
        BRS: Math.round((updated.BRS - baseline.BRS) * 10) / 10,
        BJP: Math.round((updated.BJP - baseline.BJP) * 10) / 10,
      },
    }));
  };

  // Handle Statewide Macro adjustment (Pattern C)
  const handleAdjustMacro = (party: 'INC' | 'BRS' | 'BJP', newVal: number) => {
    const currentShares = {
      INC: statewideBaseline.INC + macroSwing.INC,
      BRS: statewideBaseline.BRS + macroSwing.BRS,
      BJP: statewideBaseline.BJP + macroSwing.BJP,
      OTH: statewideBaseline.AIMIM + statewideBaseline.OTH,
    };

    const updated = rebalanceShares(currentShares, party, newVal, macroLocked);

    setMacroSwing({
      INC: Math.round((updated.INC - statewideBaseline.INC) * 10) / 10,
      BRS: Math.round((updated.BRS - statewideBaseline.BRS) * 10) / 10,
      BJP: Math.round((updated.BJP - statewideBaseline.BJP) * 10) / 10,
    });
  };

  if (!isOpen) return null;

  // Macro Projected Shares
  const currMacroINC = Math.max(0, Math.min(100, Math.round((statewideBaseline.INC + macroSwing.INC) * 10) / 10));
  const currMacroBRS = Math.max(0, Math.min(100, Math.round((statewideBaseline.BRS + macroSwing.BRS) * 10) / 10));
  const currMacroBJP = Math.max(0, Math.min(100, Math.round((statewideBaseline.BJP + macroSwing.BJP) * 10) / 10));
  const currMacroOTH = Math.round((statewideBaseline.AIMIM + statewideBaseline.OTH) * 10) / 10;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col text-slate-100 overflow-hidden">
        {/* Sticky Header: War Room Barometer & Controls */}
        <div className="bg-slate-900/95 border-b border-slate-800 p-4 sm:p-5 flex flex-col gap-3 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 rounded-xl">
                <Sliders className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Demographic Swing Studio (Pattern C)
                  </h2>
                  <span className="text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                    100% Simplex Balancer
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Interactive multi-party vote share engine for INC, BRS &amp; BJP across 18 demographic groups
                </p>
              </div>
            </div>

            {/* Right Controls: Reset & Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                title="Reset all swings to 2023 baseline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Live Majority Gauge Bar (Updated in Real-Time as Sliders Move) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            {/* INC */}
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-900/90 rounded-lg border border-sky-900/50">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                <span className="text-xs font-bold text-sky-400">INC</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-white">{tally.counts.INC}</span>
                <span className={`text-[10px] font-mono font-bold ${tally.incDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tally.incDiff >= 0 ? `+${tally.incDiff}` : tally.incDiff}
                </span>
                {tally.counts.INC >= 60 && <CheckCircle className="w-3 h-3 text-emerald-400" />}
              </div>
            </div>

            {/* BRS */}
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-900/90 rounded-lg border border-pink-900/50">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
                <span className="text-xs font-bold text-pink-400">BRS</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-white">{tally.counts.BRS}</span>
                <span className={`text-[10px] font-mono font-bold ${tally.brsDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tally.brsDiff >= 0 ? `+${tally.brsDiff}` : tally.brsDiff}
                </span>
              </div>
            </div>

            {/* BJP */}
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-900/90 rounded-lg border border-amber-900/50">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                <span className="text-xs font-bold text-amber-400">BJP</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-white">{tally.counts.BJP}</span>
                <span className={`text-[10px] font-mono font-bold ${tally.bjpDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tally.bjpDiff >= 0 ? `+${tally.bjpDiff}` : tally.bjpDiff}
                </span>
              </div>
            </div>

            {/* AIMIM */}
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-900/90 rounded-lg border border-emerald-900/50">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#15803d]" />
                <span className="text-xs font-bold text-emerald-400">AIMIM</span>
              </div>
              <span className="text-base font-black text-white">{tally.counts.AIMIM}</span>
            </div>

            {/* Triage / Flips */}
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-rose-950/30 rounded-lg border border-rose-900/40 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1 text-rose-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>Flips / Triage</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-rose-300 font-mono">{tally.flippedCount} flips</span>
                <span className="text-[10px] text-slate-400 font-mono">({tally.tossUpCount} close)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Section 1: Statewide Macro Swing (Pattern C Segmented Bar) */}
          <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>Statewide Uniform Macro Swing</span>
                    {hasMacroShift && (
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono border border-indigo-500/30">
                        Active Shift
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Applies a uniform swing across all 119 constituencies on top of demographic adjustments
                  </p>
                </div>
              </div>

              {/* Macro Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Presets:</span>
                <button
                  onClick={() => setMacroSwing({ INC: 0, BRS: 0, BJP: 0 })}
                  className={`px-2 py-0.5 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                    !hasMacroShift ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Baseline
                </button>
                <button
                  onClick={() => setMacroSwing({ INC: 3, BRS: -2, BJP: -1 })}
                  className="px-2 py-0.5 text-xs rounded-md font-semibold bg-sky-900/60 hover:bg-sky-800/80 text-sky-200 border border-sky-700/50 cursor-pointer"
                >
                  INC +3% Wave
                </button>
                <button
                  onClick={() => setMacroSwing({ INC: -2, BRS: 3.5, BJP: -1.5 })}
                  className="px-2 py-0.5 text-xs rounded-md font-semibold bg-pink-900/60 hover:bg-pink-800/80 text-pink-200 border border-pink-700/50 cursor-pointer"
                >
                  BRS +3.5% Surge
                </button>
                <button
                  onClick={() => setMacroSwing({ INC: -2, BRS: -3, BJP: 5 })}
                  className="px-2 py-0.5 text-xs rounded-md font-semibold bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 border border-amber-700/50 cursor-pointer"
                >
                  BJP +5% Push
                </button>
                {onApplyPreset && (
                  <button
                    onClick={() => onApplyPreset('bjp_trs_alliance')}
                    className={`px-2.5 py-0.5 text-xs rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      activePreset === 'bjp_trs_alliance'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-800/60'
                    }`}
                  >
                    <span>🤝 BJP+TRS Alliance (60/40 + Anti-Inc)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Pattern C: Statewide Segmented Stacked Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Statewide Projected Vote Share:</span>
                <span className="font-mono text-slate-300 text-[11px]">
                  Total: {(currMacroINC + currMacroBRS + currMacroBJP + currMacroOTH).toFixed(1)}%
                </span>
              </div>

              {/* Visual Multi-Segment Bar */}
              <div className="w-full h-8 rounded-xl overflow-hidden flex bg-slate-950 p-0.5 border border-slate-700 shadow-inner">
                {/* INC Segment */}
                <div
                  style={{ width: `${currMacroINC}%` }}
                  className="bg-[#0284c7] h-full flex items-center justify-center text-[11px] font-black text-white transition-all duration-200 overflow-hidden px-1 border-r border-slate-900/40 relative group"
                  title={`INC: ${currMacroINC}% (Baseline: 39.4%)`}
                >
                  <span className="truncate">INC {currMacroINC}%</span>
                </div>

                {/* BRS Segment */}
                <div
                  style={{ width: `${currMacroBRS}%` }}
                  className="bg-[#ec4899] h-full flex items-center justify-center text-[11px] font-black text-white transition-all duration-200 overflow-hidden px-1 border-r border-slate-900/40 relative group"
                  title={`BRS: ${currMacroBRS}% (Baseline: 37.4%)`}
                >
                  <span className="truncate">BRS {currMacroBRS}%</span>
                </div>

                {/* BJP Segment */}
                <div
                  style={{ width: `${currMacroBJP}%` }}
                  className="bg-[#f97316] h-full flex items-center justify-center text-[11px] font-black text-white transition-all duration-200 overflow-hidden px-1 border-r border-slate-900/40 relative group"
                  title={`BJP: ${currMacroBJP}% (Baseline: 13.9%)`}
                >
                  <span className="truncate">BJP {currMacroBJP}%</span>
                </div>

                {/* OTH / AIMIM Segment */}
                <div
                  style={{ width: `${currMacroOTH}%` }}
                  className="bg-slate-600 h-full flex items-center justify-center text-[10px] font-bold text-slate-200 transition-all duration-200 overflow-hidden px-1"
                  title={`AIMIM & OTH: ${currMacroOTH}%`}
                >
                  <span className="truncate">OTH {currMacroOTH}%</span>
                </div>
              </div>
            </div>

            {/* Macro Steppers & Sliders for INC, BRS, BJP */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* INC Macro Control */}
              <div className="bg-slate-900/90 p-3 rounded-xl border border-sky-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                    <span className="text-xs font-black text-sky-400">INC (Congress)</span>
                  </div>
                  <button
                    onClick={() => setMacroLocked((prev) => ({ ...prev, INC: !prev.INC }))}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      macroLocked.INC ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title={macroLocked.INC ? 'INC is Locked from auto-rebalance' : 'Click to Lock INC'}
                  >
                    {macroLocked.INC ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-black text-white">{currMacroINC}%</span>
                  <span
                    className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                      macroSwing.INC > 0
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : macroSwing.INC < 0
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {macroSwing.INC > 0 ? `+${macroSwing.INC}%` : `${macroSwing.INC}%`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdjustMacro('INC', Math.max(0, currMacroINC - 1))}
                    disabled={macroLocked.INC}
                    className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-sm font-bold cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    step="0.5"
                    value={currMacroINC}
                    disabled={macroLocked.INC}
                    onChange={(e) => handleAdjustMacro('INC', Number(e.target.value))}
                    className="flex-1 accent-sky-500 cursor-pointer disabled:opacity-40"
                  />
                  <button
                    onClick={() => handleAdjustMacro('INC', Math.min(80, currMacroINC + 1))}
                    disabled={macroLocked.INC}
                    className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-sm font-bold cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* BRS Macro Control */}
              <div className="bg-slate-900/90 p-3 rounded-xl border border-pink-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
                    <span className="text-xs font-black text-pink-400">BRS (TRS)</span>
                  </div>
                  <button
                    onClick={() => setMacroLocked((prev) => ({ ...prev, BRS: !prev.BRS }))}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      macroLocked.BRS ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title={macroLocked.BRS ? 'BRS is Locked from auto-rebalance' : 'Click to Lock BRS'}
                  >
                    {macroLocked.BRS ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-black text-white">{currMacroBRS}%</span>
                  <span
                    className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                      macroSwing.BRS > 0
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : macroSwing.BRS < 0
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {macroSwing.BRS > 0 ? `+${macroSwing.BRS}%` : `${macroSwing.BRS}%`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdjustMacro('BRS', Math.max(0, currMacroBRS - 1))}
                    disabled={macroLocked.BRS}
                    className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-sm font-bold cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="0.5"
                    value={currMacroBRS}
                    disabled={macroLocked.BRS}
                    onChange={(e) => handleAdjustMacro('BRS', Number(e.target.value))}
                    className="flex-1 accent-pink-500 cursor-pointer disabled:opacity-40"
                  />
                  <button
                    onClick={() => handleAdjustMacro('BRS', Math.min(80, currMacroBRS + 1))}
                    disabled={macroLocked.BRS}
                    className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-sm font-bold cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* BJP Macro Control */}
              <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                    <span className="text-xs font-black text-amber-400">BJP</span>
                  </div>
                  <button
                    onClick={() => setMacroLocked((prev) => ({ ...prev, BJP: !prev.BJP }))}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      macroLocked.BJP ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                    title={macroLocked.BJP ? 'BJP is Locked from auto-rebalance' : 'Click to Lock BJP'}
                  >
                    {macroLocked.BJP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-black text-white">{currMacroBJP}%</span>
                  <span
                    className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                      macroSwing.BJP > 0
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : macroSwing.BJP < 0
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {macroSwing.BJP > 0 ? `+${macroSwing.BJP}%` : `${macroSwing.BJP}%`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdjustMacro('BJP', Math.max(0, currMacroBJP - 1))}
                    disabled={macroLocked.BJP}
                    className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-sm font-bold cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="0.5"
                    value={currMacroBJP}
                    disabled={macroLocked.BJP}
                    onChange={(e) => handleAdjustMacro('BJP', Number(e.target.value))}
                    className="flex-1 accent-amber-500 cursor-pointer disabled:opacity-40"
                  />
                  <button
                    onClick={() => handleAdjustMacro('BJP', Math.min(60, currMacroBJP + 1))}
                    disabled={macroLocked.BJP}
                    className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-sm font-bold cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Demographic Category Filter Tabs & Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
              <button
                onClick={() => setActiveTab('DECISIVE')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  activeTab === 'DECISIVE'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Battleground Sliders (7)</span>
              </button>
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Groups ({ALL_COMMUNITIES.length})
              </button>
              <button
                onClick={() => setActiveTab('BC')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'BC'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Backward Classes (~50%)
              </button>
              <button
                onClick={() => setActiveTab('SC_ST')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'SC_ST'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                SC &amp; ST (~28%)
              </button>
              <button
                onClick={() => setActiveTab('OC_MIN')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'OC_MIN'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Minorities &amp; OCs (~22%)
              </button>
              <button
                onClick={() => setActiveTab('AGE')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'AGE'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Age Cohorts
              </button>
            </div>

            {/* Search Box */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search caste, district, issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 placeholder-slate-400 text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-700 focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Section 3: 2-Column Grid of Community Pattern C Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCommunities.map((comm) => {
              const baseline = data.baseline_exit_poll?.[comm.key] || {
                INC: 35,
                BRS: 35,
                BJP: 25,
                OTH: 5,
              };
              const currSwing = swings[comm.key] || { INC: 0, BRS: 0, BJP: 0 };
              const isCustomized = currSwing.INC !== 0 || currSwing.BRS !== 0 || currSwing.BJP !== 0;

              // Current Shares
              const incShare = Math.max(0, Math.min(100, Math.round((baseline.INC + currSwing.INC) * 10) / 10));
              const brsShare = Math.max(0, Math.min(100, Math.round((baseline.BRS + currSwing.BRS) * 10) / 10));
              const bjpShare = Math.max(0, Math.min(100, Math.round((baseline.BJP + currSwing.BJP) * 10) / 10));
              const othShare = baseline.OTH || (baseline.AIMIM ? baseline.AIMIM : 0);

              const locked = lockedParties[comm.key] || {};

              return (
                <div
                  key={comm.key}
                  className={`bg-slate-800/70 rounded-2xl p-4 border transition-all ${
                    isCustomized
                      ? 'border-indigo-500/60 shadow-lg shadow-indigo-950/30'
                      : 'border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-700/60 pb-2.5 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{comm.name}</h4>
                        <span className="text-[10px] font-mono bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded font-semibold">
                          {comm.sharePct} TS
                        </span>
                        {isCustomized && (
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded font-bold font-mono">
                            Modified
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1" title={comm.region}>
                        📍 {comm.region}
                      </p>
                      <p className="text-[10px] text-indigo-300 mt-0.5 line-clamp-1" title={comm.keyIssues}>
                        ⚡ Key issue: {comm.keyIssues}
                      </p>
                    </div>

                    {isCustomized && (
                      <button
                        onClick={() => handleResetCommunity(comm.key)}
                        className="text-[10px] font-bold text-slate-400 hover:text-white flex items-center gap-1 bg-slate-700/80 hover:bg-slate-700 px-2 py-1 rounded-lg cursor-pointer transition-colors"
                        title="Reset to 2023 baseline"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>

                  {/* Pattern C: 100% Stacked Horizontal Segmented Bar */}
                  <div className="space-y-1.5 mb-3">
                    <div className="w-full h-7 rounded-lg overflow-hidden flex bg-slate-950 p-0.5 border border-slate-700 shadow-inner">
                      {/* INC */}
                      <div
                        style={{ width: `${incShare}%` }}
                        className="bg-[#0284c7] h-full flex items-center justify-center text-[10px] font-black text-white transition-all duration-150 overflow-hidden px-1 border-r border-slate-900/30"
                        title={`INC: ${incShare}% (Baseline: ${baseline.INC}%)`}
                      >
                        <span className="truncate">{incShare >= 12 ? `INC ${incShare}%` : `${incShare}%`}</span>
                      </div>

                      {/* BRS */}
                      <div
                        style={{ width: `${brsShare}%` }}
                        className="bg-[#ec4899] h-full flex items-center justify-center text-[10px] font-black text-white transition-all duration-150 overflow-hidden px-1 border-r border-slate-900/30"
                        title={`BRS: ${brsShare}% (Baseline: ${baseline.BRS}%)`}
                      >
                        <span className="truncate">{brsShare >= 12 ? `BRS ${brsShare}%` : `${brsShare}%`}</span>
                      </div>

                      {/* BJP */}
                      <div
                        style={{ width: `${bjpShare}%` }}
                        className="bg-[#f97316] h-full flex items-center justify-center text-[10px] font-black text-white transition-all duration-150 overflow-hidden px-1 border-r border-slate-900/30"
                        title={`BJP: ${bjpShare}% (Baseline: ${baseline.BJP}%)`}
                      >
                        <span className="truncate">{bjpShare >= 12 ? `BJP ${bjpShare}%` : `${bjpShare}%`}</span>
                      </div>

                      {/* OTH */}
                      {othShare > 0 && (
                        <div
                          style={{ width: `${othShare}%` }}
                          className="bg-slate-600 h-full flex items-center justify-center text-[9px] font-bold text-slate-300 transition-all duration-150 overflow-hidden px-1"
                          title={`OTH: ${othShare}%`}
                        >
                          <span className="truncate">{othShare >= 8 ? `OTH ${othShare}%` : `${othShare}%`}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3 Party Interactive Adjusters (INC, BRS, BJP) */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* INC */}
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-sky-900/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-sky-400">INC</span>
                        <button
                          onClick={() => toggleLock(comm.key, 'INC')}
                          className={`p-0.5 rounded transition-colors cursor-pointer ${
                            locked.INC ? 'text-sky-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title={locked.INC ? 'Locked from auto-rebalance' : 'Click to lock'}
                        >
                          {locked.INC ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                        </button>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-black text-white">{incShare}%</span>
                        <span
                          className={`text-[9px] font-mono font-bold ${
                            currSwing.INC > 0
                              ? 'text-emerald-400'
                              : currSwing.INC < 0
                              ? 'text-rose-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {currSwing.INC > 0 ? `+${currSwing.INC}%` : currSwing.INC === 0 ? '0%' : `${currSwing.INC}%`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'INC', Math.max(0, incShare - 1))}
                          disabled={locked.INC}
                          className="w-5 h-5 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-xs font-bold text-slate-200 cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="range"
                          min="0"
                          max={100 - othShare}
                          step="1"
                          value={incShare}
                          disabled={locked.INC}
                          onChange={(e) => handleAdjustCommunity(comm.key, 'INC', Number(e.target.value))}
                          className="flex-1 accent-sky-500 cursor-pointer disabled:opacity-30 h-1"
                        />
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'INC', Math.min(100 - othShare, incShare + 1))}
                          disabled={locked.INC}
                          className="w-5 h-5 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-xs font-bold text-slate-200 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* BRS */}
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-pink-900/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-pink-400">BRS</span>
                        <button
                          onClick={() => toggleLock(comm.key, 'BRS')}
                          className={`p-0.5 rounded transition-colors cursor-pointer ${
                            locked.BRS ? 'text-pink-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title={locked.BRS ? 'Locked from auto-rebalance' : 'Click to lock'}
                        >
                          {locked.BRS ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                        </button>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-black text-white">{brsShare}%</span>
                        <span
                          className={`text-[9px] font-mono font-bold ${
                            currSwing.BRS > 0
                              ? 'text-emerald-400'
                              : currSwing.BRS < 0
                              ? 'text-rose-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {currSwing.BRS > 0 ? `+${currSwing.BRS}%` : currSwing.BRS === 0 ? '0%' : `${currSwing.BRS}%`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'BRS', Math.max(0, brsShare - 1))}
                          disabled={locked.BRS}
                          className="w-5 h-5 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-xs font-bold text-slate-200 cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="range"
                          min="0"
                          max={100 - othShare}
                          step="1"
                          value={brsShare}
                          disabled={locked.BRS}
                          onChange={(e) => handleAdjustCommunity(comm.key, 'BRS', Number(e.target.value))}
                          className="flex-1 accent-pink-500 cursor-pointer disabled:opacity-30 h-1"
                        />
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'BRS', Math.min(100 - othShare, brsShare + 1))}
                          disabled={locked.BRS}
                          className="w-5 h-5 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-xs font-bold text-slate-200 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* BJP */}
                    <div className="bg-slate-900/80 p-2 rounded-xl border border-amber-900/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-400">BJP</span>
                        <button
                          onClick={() => toggleLock(comm.key, 'BJP')}
                          className={`p-0.5 rounded transition-colors cursor-pointer ${
                            locked.BJP ? 'text-amber-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title={locked.BJP ? 'Locked from auto-rebalance' : 'Click to lock'}
                        >
                          {locked.BJP ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                        </button>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-black text-white">{bjpShare}%</span>
                        <span
                          className={`text-[9px] font-mono font-bold ${
                            currSwing.BJP > 0
                              ? 'text-emerald-400'
                              : currSwing.BJP < 0
                              ? 'text-rose-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {currSwing.BJP > 0 ? `+${currSwing.BJP}%` : currSwing.BJP === 0 ? '0%' : `${currSwing.BJP}%`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'BJP', Math.max(0, bjpShare - 1))}
                          disabled={locked.BJP}
                          className="w-5 h-5 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-xs font-bold text-slate-200 cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="range"
                          min="0"
                          max={100 - othShare}
                          step="1"
                          value={bjpShare}
                          disabled={locked.BJP}
                          onChange={(e) => handleAdjustCommunity(comm.key, 'BJP', Number(e.target.value))}
                          className="flex-1 accent-amber-500 cursor-pointer disabled:opacity-30 h-1"
                        />
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'BJP', Math.min(100 - othShare, bjpShare + 1))}
                          disabled={locked.BJP}
                          className="w-5 h-5 flex items-center justify-center bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-xs font-bold text-slate-200 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Footer: Active Scenario Summary & Apply Button */}
        <div className="bg-slate-900 border-t border-slate-800 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1 text-indigo-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>{activeCustomizedCount} of 18 Groups Custom Adjusted</span>
            </span>
            {hasMacroShift && (
              <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono text-slate-300">
                Macro Shift: INC {macroSwing.INC >= 0 ? `+${macroSwing.INC}` : macroSwing.INC}%, BRS {macroSwing.BRS >= 0 ? `+${macroSwing.BRS}` : macroSwing.BRS}%, BJP {macroSwing.BJP >= 0 ? `+${macroSwing.BJP}` : macroSwing.BJP}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply &amp; View Map / Triage Chart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
