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
  ChevronDown,
  ChevronUp,
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
    region: 'Ranga Reddy, Mahabubnagar, Nalgonda, Medak',
    keyIssues: 'Toddy tapping rights, Neera cafes, excise license quotas',
  },
  {
    key: 'bc_yadav',
    name: 'Yadav / Golla-Kuruma (BC-D)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~7%',
    region: 'South Telangana, Nalgonda, Mahabubnagar, Khammam',
    keyIssues: 'Sheep distribution reboot, animal husbandry welfare, grazing lands',
  },
  {
    key: 'bc_vishwakarma',
    name: 'Vishwakarma / Artisan BCs (BC-B)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~4%',
    region: 'Statewide spread across rural and semi-urban pockets',
    keyIssues: 'Artisan toolkit grants, low-interest microcredit, temple board quotas',
  },

  // Scheduled Castes & Scheduled Tribes (~28% TS)
  {
    key: 'sc_madiga',
    name: 'SC Madiga & Sub-castes',
    category: 'SC_ST',
    categoryLabel: 'Scheduled Castes & Tribes',
    sharePct: '~10%',
    region: 'Statewide rural belts, Karimnagar, Warangal, Medak',
    keyIssues: 'SC A/B/C/D sub-categorization (MRPS movement), Dalit Bandhu direct transfer',
  },
  {
    key: 'sc_mala',
    name: 'SC Mala & Sub-castes',
    category: 'SC_ST',
    categoryLabel: 'Scheduled Castes & Tribes',
    sharePct: '~7%',
    region: 'Statewide, South Telangana, Khammam, Nalgonda',
    keyIssues: 'Preservation of unified SC quota, Ambedkar social welfare funding, job backlog',
  },
  {
    key: 'st_lambada',
    name: 'ST Lambada / Banjara',
    category: 'SC_ST',
    categoryLabel: 'Scheduled Castes & Tribes',
    sharePct: '~6%',
    region: 'Nalgonda, Mahabubnagar, Warangal, Khammam thandas',
    keyIssues: 'Thanda gram panchayat funds, Podu land titles (RoFR), ST quota hike to 10%',
  },
  {
    key: 'st_koya_gond',
    name: 'ST Adivasi Gond & Koya',
    category: 'SC_ST',
    categoryLabel: 'Scheduled Castes & Tribes',
    sharePct: '~4%',
    region: 'Adilabad, Asifabad, Mulugu, Bhadrachalam Agency belts',
    keyIssues: 'Agency 1/70 Act preservation, Gondi language script, forest rights, non-ST tensions',
  },

  // Minorities & Other Castes (~22% TS)
  {
    key: 'muslim_general',
    name: 'Muslim Minorities (Sunni / General)',
    category: 'OC_MIN',
    categoryLabel: 'Minorities & General',
    sharePct: '~11%',
    region: 'GHMC Hyderabad, Nizamabad Urban, Karimnagar, Mahabubnagar',
    keyIssues: '4% BC-E minority quota defense, Shaadi Mubarak funding, Waqf land protection',
  },
  {
    key: 'muslim_mehdavia',
    name: 'Muslim Minorities (Old City / AIMIM Base)',
    category: 'OC_MIN',
    categoryLabel: 'Minorities & General',
    sharePct: '~2%',
    region: 'Hyderabad Old City, Charminar, Chandrayangutta, Malakpet',
    keyIssues: 'AIMIM strongholds, civic infrastructure, Old City metro, power amnesty',
  },
  {
    key: 'oc_reddy',
    name: 'Reddy (OC)',
    category: 'OC_MIN',
    categoryLabel: 'Minorities & General',
    sharePct: '~6%',
    region: 'South Telangana, Nalgonda, Mahabubnagar, Ranga Reddy',
    keyIssues: 'Ruling party leadership consolidation, agrarian power, irrigation priorities',
  },
  {
    key: 'oc_velama',
    name: 'Velama (OC)',
    category: 'OC_MIN',
    categoryLabel: 'Minorities & General',
    sharePct: '~2.5%',
    region: 'North Telangana, Sircilla, Siddipet, Gajwel, Karimnagar',
    keyIssues: 'BRS core leadership base, KCR legacy loyalty, political party leadership',
  },
  {
    key: 'oc_kamma',
    name: 'Kamma (OC)',
    category: 'OC_MIN',
    categoryLabel: 'Minorities & General',
    sharePct: '~2%',
    region: 'Khammam, Madhira, Kukatpally, Serilingampally (GHMC)',
    keyIssues: 'Andhra settler alignment, real estate clarity, Telugu Desam sympathy',
  },
  {
    key: 'oc_brahmin_arya_vysya',
    name: 'Brahmin & Arya Vysya (OC)',
    category: 'OC_MIN',
    categoryLabel: 'Minorities & General',
    sharePct: '~3.5%',
    region: 'Urban centres, Secunderabad, Warangal, Nizamabad',
    keyIssues: 'Brahmin Parishad allocations, GST trade relief, urban civic order',
  },

  // Age Cohorts
  {
    key: 'youth_18_25',
    name: 'First-Time & Youth Voters (18-25)',
    category: 'AGE',
    categoryLabel: 'Demographic Cohorts',
    sharePct: '~14%',
    region: 'GHMC Hyderabad, University Towns (Osmania, Kakatiya), Urban centres',
    keyIssues: 'TGPSC exam calendar integrity, mega DSC notifications, IT jobs, youth unemployment',
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
  const [activeTab, setActiveTab] = useState<'ALL' | 'DECISIVE' | 'BC' | 'SC_ST' | 'OC_MIN' | 'AGE'>('DECISIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [lockedParties, setLockedParties] = useState<Record<string, { INC?: boolean; BRS?: boolean; BJP?: boolean }>>({});
  const [macroLocked, setMacroLocked] = useState<{ INC?: boolean; BRS?: boolean; BJP?: boolean }>({});
  const [isMacroExpanded, setIsMacroExpanded] = useState<boolean>(false);

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

  // Handle Community Party adjustment (Simplex Rebalance)
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

  // Handle Statewide Macro adjustment
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
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col text-slate-900 overflow-hidden">
        {/* Sticky Header: War Room Barometer & Controls */}
        <div className="bg-white border-b border-slate-200 p-4 sm:p-5 flex flex-col gap-3 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl">
                <Sliders className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Demographic Swing Studio
                  </h2>
                  <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold">
                    SEEEPC Vol-4 • 100% Simplex Balancer
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Interactive multi-party vote share engine for INC, BRS &amp; BJP across 18 demographic groups
                </p>
              </div>
            </div>

            {/* Right Controls: Reset & Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
                title="Reset all swings to 2023 baseline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Live Majority Gauge Bar (Light Theme Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200">
            {/* INC */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-sky-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                <span className="text-xs font-bold text-sky-900">INC</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-slate-900">{tally.counts.INC}</span>
                <span className={`text-[10px] font-mono font-bold ${tally.incDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tally.incDiff >= 0 ? `+${tally.incDiff}` : tally.incDiff}
                </span>
                {tally.counts.INC >= 60 && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
            </div>

            {/* BRS */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-pink-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
                <span className="text-xs font-bold text-pink-900">BRS</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-slate-900">{tally.counts.BRS}</span>
                <span className={`text-[10px] font-mono font-bold ${tally.brsDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tally.brsDiff >= 0 ? `+${tally.brsDiff}` : tally.brsDiff}
                </span>
              </div>
            </div>

            {/* BJP */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-amber-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                <span className="text-xs font-bold text-amber-900">BJP</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-slate-900">{tally.counts.BJP}</span>
                <span className={`text-[10px] font-mono font-bold ${tally.bjpDiff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tally.bjpDiff >= 0 ? `+${tally.bjpDiff}` : tally.bjpDiff}
                </span>
              </div>
            </div>

            {/* AIMIM */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-emerald-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#15803d]" />
                <span className="text-xs font-bold text-emerald-900">AIMIM</span>
              </div>
              <span className="text-base font-black text-slate-900">{tally.counts.AIMIM}</span>
            </div>

            {/* Triage / Flips */}
            <div className="flex items-center justify-between px-3 py-2 bg-rose-50 rounded-lg border border-rose-200 col-span-2 sm:col-span-1 shadow-2xs">
              <div className="flex items-center gap-1 text-rose-700 text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>Flips / Triage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-rose-900 font-mono">{tally.flippedCount} flips</span>
                <span className="text-[10px] text-slate-500 font-mono">({tally.tossUpCount} close)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-100/50">
          {/* Section 1: Statewide Macro Swing (Compact & Collapsible to prevent clutter) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Statewide Uniform Macro Swing
                    </h3>
                    {hasMacroShift && (
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-bold font-mono">
                        Active: INC {macroSwing.INC >= 0 ? `+${macroSwing.INC}` : macroSwing.INC}%, BRS {macroSwing.BRS >= 0 ? `+${macroSwing.BRS}` : macroSwing.BRS}%, BJP {macroSwing.BJP >= 0 ? `+${macroSwing.BJP}` : macroSwing.BJP}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Applies a statewide uniform swing across all 119 constituencies layered on demographic adjustments
                  </p>
                </div>
              </div>

              {/* Presets & Expand Toggle */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Presets:</span>
                <button
                  onClick={() => setMacroSwing({ INC: 0, BRS: 0, BJP: 0 })}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                    !hasMacroShift
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  Baseline
                </button>
                <button
                  onClick={() => setMacroSwing({ INC: 3, BRS: -2, BJP: -1 })}
                  className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 cursor-pointer"
                >
                  INC +3%
                </button>
                <button
                  onClick={() => setMacroSwing({ INC: -2, BRS: 3.5, BJP: -1.5 })}
                  className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 cursor-pointer"
                >
                  BRS +3.5%
                </button>
                <button
                  onClick={() => setMacroSwing({ INC: -2, BRS: -3, BJP: 5 })}
                  className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer"
                >
                  BJP +5%
                </button>
                {onApplyPreset && (
                  <button
                    onClick={() => onApplyPreset('bjp_trs_alliance')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      activePreset === 'bjp_trs_alliance'
                        ? 'bg-purple-600 text-white shadow-xs font-black'
                        : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200'
                    }`}
                    title="BRS-BJP 74:45 Coalition formula"
                  >
                    <span>🤝 Coalition</span>
                  </button>
                )}
                <button
                  onClick={() => setIsMacroExpanded(!isMacroExpanded)}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer shadow-2xs ml-1"
                >
                  <span>{isMacroExpanded ? 'Hide Sliders' : 'Fine-Tune Sliders'}</span>
                  {isMacroExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Compact Segmented Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Projected Statewide Vote Share:</span>
                <div className="flex items-center gap-3 text-xs font-bold font-mono">
                  <span className="text-sky-700">INC {currMacroINC}%</span>
                  <span className="text-pink-700">BRS {currMacroBRS}%</span>
                  <span className="text-amber-700">BJP {currMacroBJP}%</span>
                  <span className="text-slate-500">OTH {currMacroOTH}%</span>
                </div>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200 shadow-inner">
                <div style={{ width: `${currMacroINC}%` }} className="bg-[#0284c7] h-full rounded-l-full transition-all duration-150" title={`INC: ${currMacroINC}%`} />
                <div style={{ width: `${currMacroBRS}%` }} className="bg-[#ec4899] h-full transition-all duration-150" title={`BRS: ${currMacroBRS}%`} />
                <div style={{ width: `${currMacroBJP}%` }} className="bg-[#f97316] h-full transition-all duration-150" title={`BJP: ${currMacroBJP}%`} />
                <div style={{ width: `${currMacroOTH}%` }} className="bg-slate-400 h-full rounded-r-full transition-all duration-150" title={`OTH: ${currMacroOTH}%`} />
              </div>
            </div>

            {/* Collapsible Fine-Tuning Sliders */}
            {isMacroExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                {/* INC Macro Control */}
                <div className="bg-slate-50 p-3 rounded-xl border border-sky-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                      <span className="text-xs font-black text-sky-900">INC (Congress)</span>
                    </div>
                    <button
                      onClick={() => setMacroLocked((prev) => ({ ...prev, INC: !prev.INC }))}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        macroLocked.INC ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={macroLocked.INC ? 'INC is locked from auto-rebalancing' : 'Click to lock INC'}
                    >
                      {macroLocked.INC ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-black text-slate-900 font-mono">{currMacroINC}%</span>
                    <span
                      className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        macroSwing.INC > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : macroSwing.INC < 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {macroSwing.INC > 0 ? `+${macroSwing.INC}%` : `${macroSwing.INC}%`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAdjustMacro('INC', Math.max(0, currMacroINC - 1))}
                      disabled={macroLocked.INC}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
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
                      className="flex-1 accent-sky-600 cursor-pointer disabled:opacity-40 h-1.5 bg-slate-200 rounded-lg"
                    />
                    <button
                      onClick={() => handleAdjustMacro('INC', Math.min(80, currMacroINC + 1))}
                      disabled={macroLocked.INC}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* BRS Macro Control */}
                <div className="bg-slate-50 p-3 rounded-xl border border-pink-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
                      <span className="text-xs font-black text-pink-900">BRS (TRS)</span>
                    </div>
                    <button
                      onClick={() => setMacroLocked((prev) => ({ ...prev, BRS: !prev.BRS }))}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        macroLocked.BRS ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={macroLocked.BRS ? 'BRS is locked from auto-rebalancing' : 'Click to lock BRS'}
                    >
                      {macroLocked.BRS ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-black text-slate-900 font-mono">{currMacroBRS}%</span>
                    <span
                      className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        macroSwing.BRS > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : macroSwing.BRS < 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {macroSwing.BRS > 0 ? `+${macroSwing.BRS}%` : `${macroSwing.BRS}%`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAdjustMacro('BRS', Math.max(0, currMacroBRS - 1))}
                      disabled={macroLocked.BRS}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
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
                      className="flex-1 accent-pink-600 cursor-pointer disabled:opacity-40 h-1.5 bg-slate-200 rounded-lg"
                    />
                    <button
                      onClick={() => handleAdjustMacro('BRS', Math.min(80, currMacroBRS + 1))}
                      disabled={macroLocked.BRS}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* BJP Macro Control */}
                <div className="bg-slate-50 p-3 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                      <span className="text-xs font-black text-amber-900">BJP</span>
                    </div>
                    <button
                      onClick={() => setMacroLocked((prev) => ({ ...prev, BJP: !prev.BJP }))}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        macroLocked.BJP ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={macroLocked.BJP ? 'BJP is locked from auto-rebalancing' : 'Click to lock BJP'}
                    >
                      {macroLocked.BJP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-black text-slate-900 font-mono">{currMacroBJP}%</span>
                    <span
                      className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        macroSwing.BJP > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : macroSwing.BJP < 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {macroSwing.BJP > 0 ? `+${macroSwing.BJP}%` : `${macroSwing.BJP}%`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAdjustMacro('BJP', Math.max(0, currMacroBJP - 1))}
                      disabled={macroLocked.BJP}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
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
                      className="flex-1 accent-amber-600 cursor-pointer disabled:opacity-40 h-1.5 bg-slate-200 rounded-lg"
                    />
                    <button
                      onClick={() => handleAdjustMacro('BJP', Math.min(60, currMacroBJP + 1))}
                      disabled={macroLocked.BJP}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Demographic Category Filter Tabs & Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl border border-slate-300/60 overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveTab('DECISIVE')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'DECISIVE'
                    ? 'bg-amber-500 text-white font-black shadow-xs'
                    : 'text-amber-800 hover:text-amber-950 hover:bg-amber-100/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Battleground Sliders (7)</span>
              </button>
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'ALL'
                    ? 'bg-white text-indigo-700 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Groups ({ALL_COMMUNITIES.length})
              </button>
              <button
                onClick={() => setActiveTab('BC')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'BC'
                    ? 'bg-white text-indigo-700 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Backward Classes (~50%)
              </button>
              <button
                onClick={() => setActiveTab('SC_ST')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'SC_ST'
                    ? 'bg-white text-indigo-700 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                SC &amp; ST (~28%)
              </button>
              <button
                onClick={() => setActiveTab('OC_MIN')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'OC_MIN'
                    ? 'bg-white text-indigo-700 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Minorities &amp; OCs (~22%)
              </button>
              <button
                onClick={() => setActiveTab('AGE')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'AGE'
                    ? 'bg-white text-indigo-700 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
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
                className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Section 3: Clean 2-Column Grid of Community Cards */}
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
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
                    isCustomized
                      ? 'border-indigo-400 shadow-md ring-1 ring-indigo-200/60'
                      : 'border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{comm.name}</h4>
                        <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold border border-slate-200">
                          {comm.sharePct} TS
                        </span>
                        {isCustomized && (
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md font-bold font-mono">
                            Modified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1" title={comm.region}>
                        📍 {comm.region}
                      </p>
                      <p className="text-[11px] text-indigo-700 font-medium mt-0.5 line-clamp-1" title={comm.keyIssues}>
                        ⚡ {comm.keyIssues}
                      </p>
                    </div>

                    {isCustomized && (
                      <button
                        onClick={() => handleResetCommunity(comm.key)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer transition-colors shrink-0"
                        title="Reset to 2023 baseline"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>

                  {/* 100% Stacked Horizontal Segmented Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200 shadow-inner">
                      {/* INC */}
                      <div
                        style={{ width: `${incShare}%` }}
                        className="bg-[#0284c7] h-full transition-all duration-150"
                        title={`INC: ${incShare}% (Baseline: ${baseline.INC}%)`}
                      />

                      {/* BRS */}
                      <div
                        style={{ width: `${brsShare}%` }}
                        className="bg-[#ec4899] h-full transition-all duration-150"
                        title={`BRS: ${brsShare}% (Baseline: ${baseline.BRS}%)`}
                      />

                      {/* BJP */}
                      <div
                        style={{ width: `${bjpShare}%` }}
                        className="bg-[#f97316] h-full transition-all duration-150"
                        title={`BJP: ${bjpShare}% (Baseline: ${baseline.BJP}%)`}
                      />

                      {/* OTH */}
                      {othShare > 0 && (
                        <div
                          style={{ width: `${othShare}%` }}
                          className="bg-slate-400 h-full transition-all duration-150"
                          title={`OTH: ${othShare}%`}
                        />
                      )}
                    </div>
                  </div>

                  {/* 3 Party Interactive Adjusters (Clean Horizontal Rows) */}
                  <div className="space-y-2">
                    {/* INC Row */}
                    <div className="flex items-center gap-2.5 py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-colors">
                      <div className="w-16 flex items-center justify-between shrink-0">
                        <span className="text-xs font-black text-sky-800 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                          INC
                        </span>
                        <button
                          onClick={() => toggleLock(comm.key, 'INC')}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            locked.INC ? 'text-sky-700 bg-sky-100' : 'text-slate-400 hover:text-slate-600'
                          }`}
                          title={locked.INC ? 'INC is locked from auto-rebalancing' : 'Click to lock INC'}
                        >
                          {locked.INC ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="flex-1 flex items-center gap-1.5 min-w-0">
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'INC', Math.max(0, incShare - 1))}
                          disabled={locked.INC}
                          className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-30 rounded-md text-xs font-bold cursor-pointer shrink-0 shadow-2xs"
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
                          className="flex-1 accent-sky-600 cursor-pointer disabled:opacity-30 h-1.5 bg-slate-200 rounded-lg"
                        />
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'INC', Math.min(100 - othShare, incShare + 1))}
                          disabled={locked.INC}
                          className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-30 rounded-md text-xs font-bold cursor-pointer shrink-0 shadow-2xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="w-20 text-right shrink-0 flex items-baseline justify-end gap-1.5">
                        <span className="text-sm font-black text-slate-900 font-mono">{incShare}%</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            currSwing.INC > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : currSwing.INC < 0
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {currSwing.INC > 0 ? `+${currSwing.INC}%` : currSwing.INC === 0 ? '0%' : `${currSwing.INC}%`}
                        </span>
                      </div>
                    </div>

                    {/* BRS Row */}
                    <div className="flex items-center gap-2.5 py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-pink-300 transition-colors">
                      <div className="w-16 flex items-center justify-between shrink-0">
                        <span className="text-xs font-black text-pink-800 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
                          BRS
                        </span>
                        <button
                          onClick={() => toggleLock(comm.key, 'BRS')}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            locked.BRS ? 'text-pink-700 bg-pink-100' : 'text-slate-400 hover:text-slate-600'
                          }`}
                          title={locked.BRS ? 'BRS is locked from auto-rebalancing' : 'Click to lock BRS'}
                        >
                          {locked.BRS ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="flex-1 flex items-center gap-1.5 min-w-0">
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'BRS', Math.max(0, brsShare - 1))}
                          disabled={locked.BRS}
                          className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-30 rounded-md text-xs font-bold cursor-pointer shrink-0 shadow-2xs"
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
                          className="flex-1 accent-pink-600 cursor-pointer disabled:opacity-30 h-1.5 bg-slate-200 rounded-lg"
                        />
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'BRS', Math.min(100 - othShare, brsShare + 1))}
                          disabled={locked.BRS}
                          className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-30 rounded-md text-xs font-bold cursor-pointer shrink-0 shadow-2xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="w-20 text-right shrink-0 flex items-baseline justify-end gap-1.5">
                        <span className="text-sm font-black text-slate-900 font-mono">{brsShare}%</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            currSwing.BRS > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : currSwing.BRS < 0
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {currSwing.BRS > 0 ? `+${currSwing.BRS}%` : currSwing.BRS === 0 ? '0%' : `${currSwing.BRS}%`}
                        </span>
                      </div>
                    </div>

                    {/* BJP Row */}
                    <div className="flex items-center gap-2.5 py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-colors">
                      <div className="w-16 flex items-center justify-between shrink-0">
                        <span className="text-xs font-black text-amber-800 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                          BJP
                        </span>
                        <button
                          onClick={() => toggleLock(comm.key, 'BJP')}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            locked.BJP ? 'text-amber-700 bg-amber-100' : 'text-slate-400 hover:text-slate-600'
                          }`}
                          title={locked.BJP ? 'BJP is locked from auto-rebalancing' : 'Click to lock BJP'}
                        >
                          {locked.BJP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="flex-1 flex items-center gap-1.5 min-w-0">
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'BJP', Math.max(0, bjpShare - 1))}
                          disabled={locked.BJP}
                          className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-30 rounded-md text-xs font-bold cursor-pointer shrink-0 shadow-2xs"
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
                          className="flex-1 accent-amber-600 cursor-pointer disabled:opacity-30 h-1.5 bg-slate-200 rounded-lg"
                        />
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'BJP', Math.min(100 - othShare, bjpShare + 1))}
                          disabled={locked.BJP}
                          className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-30 rounded-md text-xs font-bold cursor-pointer shrink-0 shadow-2xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="w-20 text-right shrink-0 flex items-baseline justify-end gap-1.5">
                        <span className="text-sm font-black text-slate-900 font-mono">{bjpShare}%</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            currSwing.BJP > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : currSwing.BJP < 0
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {currSwing.BJP > 0 ? `+${currSwing.BJP}%` : currSwing.BJP === 0 ? '0%' : `${currSwing.BJP}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Footer: Active Scenario Summary & Apply Button */}
        <div className="bg-white border-t border-slate-200 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1 text-indigo-700 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{activeCustomizedCount} of 18 Groups Custom Adjusted</span>
            </span>
            {hasMacroShift && (
              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-700">
                Macro Shift: INC {macroSwing.INC >= 0 ? `+${macroSwing.INC}` : macroSwing.INC}%, BRS {macroSwing.BRS >= 0 ? `+${macroSwing.BRS}` : macroSwing.BRS}%, BJP {macroSwing.BJP >= 0 ? `+${macroSwing.BJP}` : macroSwing.BJP}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply &amp; Return to Battleground Matrix</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
