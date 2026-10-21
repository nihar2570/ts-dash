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

export type PartySwing = Record<string, number>;
export type MacroSwing = Record<string, number>;

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
    tdpDiff?: number;
    ysrcpDiff?: number;
    jspDiff?: number;
    bjpDiff?: number;
    incDiff?: number;
    brsDiff?: number;
  };
  onApplyPreset?: (presetKey: string) => void;
  activePreset?: string;
}

export const DECISIVE_KEYS = new Set([
  'kapu',
  'kamma',
  'reddy',
  'bc_turpu_kapu',
  'bc_yadava',
  'bc_kuruba_boya',
  'sc_madiga_relli',
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
  // Backward Classes (BCs ~50% AP)
  {
    key: 'bc_turpu_kapu',
    name: 'Turpu Kapu (BC-D)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~8%',
    region: 'Uttarandhra: Srikakulam, Vizianagaram, Visakhapatnam',
    keyIssues: 'BC quota protection, cashew & irrigation MSP, regional political representation',
  },
  {
    key: 'bc_yadava',
    name: 'Yadava / Golla (BC-D)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~8%',
    region: 'Statewide: Prakasam, Nellore, Anantapur, Kurnool',
    keyIssues: 'Dairy subsidies, pasture land allocation, animal husbandry welfare',
  },
  {
    key: 'bc_kuruba_boya',
    name: 'Kuruba / Boya / Valmiki (BC-A)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~7%',
    region: 'Rayalaseema: Kurnool, Anantapur, Sri Sathya Sai',
    keyIssues: 'ST status demand for Boya/Valmiki, drip irrigation incentives, groundnut MSP',
  },
  {
    key: 'bc_settibalija_goud',
    name: 'Settibalija / Goud / Ediga (BC-B)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~6%',
    region: 'Godavari delta (Konaseema, East & West Godavari) & Rayalaseema',
    keyIssues: 'Toddy tapping rights, toddy tappers insurance, welfare corporation funding',
  },
  {
    key: 'bc_padmashali',
    name: 'Padmashali / Weavers (BC-B)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~4%',
    region: 'Dharmavaram, Mangalagiri, Chirala, Madhavaram',
    keyIssues: 'Handloom power subsidy, silk yarn price stabilization, loom modernization',
  },
  {
    key: 'bc_other',
    name: 'Other BC Castes (BC-A/B/C/D)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~15%',
    region: 'Statewide spread across all 26 districts',
    keyIssues: 'BC sub-plan funds, caste census representation, self-employment loans',
  },

  // Scheduled Castes & Scheduled Tribes (~25% AP)
  {
    key: 'sc_madiga_relli',
    name: 'SC Madiga / Relli',
    category: 'SC_ST',
    categoryLabel: 'Scheduled Castes & Tribes',
    sharePct: '~9%',
    region: 'Rayalaseema, Guntur, Prakasam & Uttarandhra urban fringes',
    keyIssues: 'SC sub-categorization implementation (Supreme Court verdict), Leather park revival',
  },
  {
    key: 'sc_mala',
    name: 'SC Mala & Sub-castes',
    category: 'SC_ST',
    categoryLabel: 'Scheduled Castes & Tribes',
    sharePct: '~9%',
    region: 'Coastal Andhra: Godavari, Krishna, Guntur, Bapatla',
    keyIssues: 'Education scholarships, housing patta titles, land allocation protection',
  },
  {
    key: 'st_tribal',
    name: 'ST Agency Tribals (Koya, Konda Reddi, Savara, Jatapu)',
    category: 'SC_ST',
    categoryLabel: 'Scheduled Castes & Tribes',
    sharePct: '~6%',
    region: 'Alluri Sitharama Raju (ASR) & Parvathipuram Manyam Agency belts',
    keyIssues: 'Agency 1/70 Act preservation, Podu forest land pattas (RoFR), coffee/turmeric MSP',
  },

  // Dominant Communities & Minorities (~25% AP)
  {
    key: 'kapu',
    name: 'Kapu / Balija / Telaga (OC)',
    category: 'OC_MIN',
    categoryLabel: 'Dominant & Minorities',
    sharePct: '~16%',
    region: 'Godavari, Krishna, Guntur, Visakhapatnam & Rayalaseema (Balija)',
    keyIssues: 'Pawan Kalyan leadership consolidation, NDA alliance unity, political empowerment',
  },
  {
    key: 'kamma',
    name: 'Kamma (OC)',
    category: 'OC_MIN',
    categoryLabel: 'Dominant & Minorities',
    sharePct: '~5%',
    region: 'Krishna, Guntur, Prakasam, Chittoor & Godavari',
    keyIssues: 'Amaravati capital development, agro-business protection, TDP core base loyalty',
  },
  {
    key: 'reddy',
    name: 'Reddy (OC)',
    category: 'OC_MIN',
    categoryLabel: 'Dominant & Minorities',
    sharePct: '~7%',
    region: 'Rayalaseema (Kadapa, Kurnool, Chittoor, Anantapur) & Nellore/Prakasam',
    keyIssues: 'YSR legacy connect, irrigation projects (Rayalaseema Lift), agrarian power',
  },
  {
    key: 'minority_muslim',
    name: 'Muslim Minorities (Sunni / Dudekula)',
    category: 'OC_MIN',
    categoryLabel: 'Dominant & Minorities',
    sharePct: '~8%',
    region: 'Rayalaseema (Kurnool, Kadapa), Guntur Urban, Vijayawada',
    keyIssues: '4% BC-E reservation protection, Dulhan scheme, Waqf property protection',
  },
  {
    key: 'minority_christian',
    name: 'Christian Minorities',
    category: 'OC_MIN',
    categoryLabel: 'Dominant & Minorities',
    sharePct: '~3%',
    region: 'Coastal Andhra: Guntur, Bapatla, Krishna, Godavari',
    keyIssues: 'Church land rights, SC status for Dalit Christians, educational institution autonomy',
  },

  // Demographic Cohorts
  {
    key: 'youth_18_25',
    name: 'First-Time & Youth Voters (18-25)',
    category: 'AGE',
    categoryLabel: 'Demographic Cohorts',
    sharePct: '~14%',
    region: 'Statewide: Vizag, Vijayawada, Guntur, Tirupati & educational hubs',
    keyIssues: 'Mega DSC teacher recruitment, APPSC job calendar, IT investments, unemployment allowance',
  },
  {
    key: 'age_60_plus',
    name: 'Senior Citizens & Pensioners (60+)',
    category: 'AGE',
    categoryLabel: 'Demographic Cohorts',
    sharePct: '~13%',
    region: 'All 175 Constituencies',
    keyIssues: 'NTR Bharosa pension hike to ₹4,000/month, doorstep pension delivery, healthcare security',
  },
];

// Helper to auto-rebalance 100% vote share across TDP, YSRCP, JSP
function rebalanceShares(
  current: { TDP: number; YSRCP: number; JSP: number; OTH: number },
  changedParty: 'TDP' | 'YSRCP' | 'JSP',
  newVal: number,
  locked: { TDP?: boolean; YSRCP?: boolean; JSP?: boolean }
): { TDP: number; YSRCP: number; JSP: number; OTH: number } {
  const maxAllowed = 100 - (current.OTH || 0);
  const clampedVal = Math.max(0, Math.min(maxAllowed, newVal));
  const diff = clampedVal - current[changedParty];
  if (Math.abs(diff) < 0.05) return current;

  const otherParties = (['TDP', 'YSRCP', 'JSP'] as const).filter(
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
  const currentSum = updated.TDP + updated.YSRCP + updated.JSP + (updated.OTH || 0);
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
  const [lockedParties, setLockedParties] = useState<Record<string, { TDP?: boolean; YSRCP?: boolean; JSP?: boolean }>>({});
  const [macroLocked, setMacroLocked] = useState<{ TDP?: boolean; YSRCP?: boolean; JSP?: boolean }>({});
  const [isMacroExpanded, setIsMacroExpanded] = useState<boolean>(false);

  // 2024 Andhra Pradesh Statewide Baseline (55.4% NDA vs 39.4% YSRCP)
  const statewideBaseline = useMemo(() => {
    return { TDP: 45.6, YSRCP: 39.4, JSP: 8.5, BJP: 2.8, INC: 1.7, OTH: 2.0 };
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
      if ((s.TDP || 0) !== 0 || (s.YSRCP || 0) !== 0 || (s.JSP || 0) !== 0) count++;
    });
    return count;
  }, [swings]);

  const hasMacroShift = (macroSwing.TDP || 0) !== 0 || (macroSwing.YSRCP || 0) !== 0 || (macroSwing.JSP || 0) !== 0;

  // Reset a single community
  const handleResetCommunity = (key: string) => {
    setSwings((prev) => ({
      ...prev,
      [key]: { TDP: 0, YSRCP: 0, JSP: 0 },
    }));
  };

  // Reset all
  const handleResetAll = () => {
    const resetSwings: Record<string, PartySwing> = {};
    ALL_COMMUNITIES.forEach((c) => {
      resetSwings[c.key] = { TDP: 0, YSRCP: 0, JSP: 0 };
    });
    setSwings(resetSwings);
    setMacroSwing({ TDP: 0, YSRCP: 0, JSP: 0 });
  };

  // Toggle party lock for a community
  const toggleLock = (commKey: string, party: 'TDP' | 'YSRCP' | 'JSP') => {
    setLockedParties((prev) => ({
      ...prev,
      [commKey]: {
        ...prev[commKey],
        [party]: !prev[commKey]?.[party],
      },
    }));
  };

  // Handle Community Party adjustment (Simplex Rebalance)
  const handleAdjustCommunity = (commKey: string, party: 'TDP' | 'YSRCP' | 'JSP', newVal: number) => {
    const baseline = data.baseline_exit_poll?.[commKey] || { TDP: 46, YSRCP: 40, JSP: 10, OTH: 4 };
    const currSwing = swings[commKey] || { TDP: 0, YSRCP: 0, JSP: 0 };

    const currentShares = {
      TDP: (baseline.TDP || 46) + (currSwing.TDP || 0),
      YSRCP: (baseline.YSRCP || 40) + (currSwing.YSRCP || 0),
      JSP: (baseline.JSP || 10) + (currSwing.JSP || 0),
      OTH: baseline.OTH || 4,
    };

    const locked = lockedParties[commKey] || {};
    const updated = rebalanceShares(currentShares, party, newVal, locked);

    setSwings((prev) => ({
      ...prev,
      [commKey]: {
        TDP: Math.round((updated.TDP - (baseline.TDP || 46)) * 10) / 10,
        YSRCP: Math.round((updated.YSRCP - (baseline.YSRCP || 40)) * 10) / 10,
        JSP: Math.round((updated.JSP - (baseline.JSP || 10)) * 10) / 10,
      },
    }));
  };

  // Handle Statewide Macro adjustment
  const handleAdjustMacro = (party: 'TDP' | 'YSRCP' | 'JSP', newVal: number) => {
    const currentShares = {
      TDP: statewideBaseline.TDP + (macroSwing.TDP || 0),
      YSRCP: statewideBaseline.YSRCP + (macroSwing.YSRCP || 0),
      JSP: statewideBaseline.JSP + (macroSwing.JSP || 0),
      OTH: (statewideBaseline.BJP || 2.8) + (statewideBaseline.INC || 1.7) + (statewideBaseline.OTH || 2.0),
    };

    const updated = rebalanceShares(currentShares, party, newVal, macroLocked);

    setMacroSwing({
      TDP: Math.round((updated.TDP - statewideBaseline.TDP) * 10) / 10,
      YSRCP: Math.round((updated.YSRCP - statewideBaseline.YSRCP) * 10) / 10,
      JSP: Math.round((updated.JSP - statewideBaseline.JSP) * 10) / 10,
    });
  };

  if (!isOpen) return null;

  // Macro Projected Shares
  const currMacroTDP = Math.max(0, Math.min(100, Math.round((statewideBaseline.TDP + (macroSwing.TDP || 0)) * 10) / 10));
  const currMacroYSRCP = Math.max(0, Math.min(100, Math.round((statewideBaseline.YSRCP + (macroSwing.YSRCP || 0)) * 10) / 10));
  const currMacroJSP = Math.max(0, Math.min(100, Math.round((statewideBaseline.JSP + (macroSwing.JSP || 0)) * 10) / 10));
  const currMacroOTH = Math.max(0, Math.round((100 - (currMacroTDP + currMacroYSRCP + currMacroJSP)) * 10) / 10);

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
                  Interactive multi-party vote share engine for TDP, YSRCP &amp; JSP across 18 demographic groups
                </p>
              </div>
            </div>

            {/* Right Controls: Reset & Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
                title="Reset all swings to 2024 baseline"
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

          {/* Live Majority Gauge Bar (88 to Majority Mark in AP 175 ACs) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200">
            {/* TDP */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-amber-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                <span className="text-xs font-bold text-amber-900">TDP</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-slate-900">{tally.counts.TDP || 0}</span>
                <span className={`text-[10px] font-mono font-bold ${(tally.tdpDiff || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {(tally.tdpDiff || 0) >= 0 ? `+${tally.tdpDiff || 0}` : tally.tdpDiff}
                </span>
                {(tally.counts.TDP || 0) >= 88 && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
            </div>

            {/* YSRCP */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-sky-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                <span className="text-xs font-bold text-sky-900">YSRCP</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-slate-900">{tally.counts.YSRCP || 0}</span>
                <span className={`text-[10px] font-mono font-bold ${(tally.ysrcpDiff || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {(tally.ysrcpDiff || 0) >= 0 ? `+${tally.ysrcpDiff || 0}` : tally.ysrcpDiff}
                </span>
                {(tally.counts.YSRCP || 0) >= 88 && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
            </div>

            {/* JSP */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-rose-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" />
                <span className="text-xs font-bold text-rose-900">JSP</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-slate-900">{tally.counts.JSP || 0}</span>
                <span className={`text-[10px] font-mono font-bold ${(tally.jspDiff || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {(tally.jspDiff || 0) >= 0 ? `+${tally.jspDiff || 0}` : tally.jspDiff}
                </span>
              </div>
            </div>

            {/* BJP */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-orange-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                <span className="text-xs font-bold text-orange-900">BJP</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-slate-900">{tally.counts.BJP || 0}</span>
                <span className={`text-[10px] font-mono font-bold ${(tally.bjpDiff || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {(tally.bjpDiff || 0) >= 0 ? `+${tally.bjpDiff || 0}` : tally.bjpDiff}
                </span>
              </div>
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
                        Active: TDP {(macroSwing.TDP || 0) >= 0 ? `+${macroSwing.TDP || 0}` : macroSwing.TDP}%, YSRCP {(macroSwing.YSRCP || 0) >= 0 ? `+${macroSwing.YSRCP || 0}` : macroSwing.YSRCP}%, JSP {(macroSwing.JSP || 0) >= 0 ? `+${macroSwing.JSP || 0}` : macroSwing.JSP}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Applies a statewide uniform swing across all 175 constituencies layered on demographic adjustments
                  </p>
                </div>
              </div>

              {/* Presets & Expand Toggle */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Presets:</span>
                <button
                  onClick={() => setMacroSwing({ TDP: 0, YSRCP: 0, JSP: 0 })}
                  className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                    !hasMacroShift
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  Baseline
                </button>
                <button
                  onClick={() => setMacroSwing({ TDP: 3, YSRCP: -2.5, JSP: -0.5 })}
                  className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer"
                >
                  TDP +3%
                </button>
                <button
                  onClick={() => setMacroSwing({ TDP: -3, YSRCP: 3.5, JSP: -0.5 })}
                  className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 cursor-pointer"
                >
                  YSRCP +3.5%
                </button>
                <button
                  onClick={() => setMacroSwing({ TDP: -2, YSRCP: -2, JSP: 4 })}
                  className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 cursor-pointer"
                >
                  JSP +4%
                </button>
                {onApplyPreset && (
                  <button
                    onClick={() => onApplyPreset('nda_2024_sweep')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      activePreset === 'nda_2024_sweep'
                        ? 'bg-amber-600 text-white shadow-xs font-black'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                    title="2024 NDA Pre-Poll Alliance baseline (164 seats)"
                  >
                    <span>🤝 NDA Alliance</span>
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
                  <span className="text-amber-700">TDP {currMacroTDP}%</span>
                  <span className="text-sky-700">YSRCP {currMacroYSRCP}%</span>
                  <span className="text-rose-700">JSP {currMacroJSP}%</span>
                  <span className="text-slate-500">OTH {currMacroOTH}%</span>
                </div>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200 shadow-inner">
                <div style={{ width: `${currMacroTDP}%` }} className="bg-[#eab308] h-full rounded-l-full transition-all duration-150" title={`TDP: ${currMacroTDP}%`} />
                <div style={{ width: `${currMacroYSRCP}%` }} className="bg-[#0284c7] h-full transition-all duration-150" title={`YSRCP: ${currMacroYSRCP}%`} />
                <div style={{ width: `${currMacroJSP}%` }} className="bg-[#e11d48] h-full transition-all duration-150" title={`JSP: ${currMacroJSP}%`} />
                <div style={{ width: `${currMacroOTH}%` }} className="bg-slate-400 h-full rounded-r-full transition-all duration-150" title={`OTH: ${currMacroOTH}%`} />
              </div>
            </div>

            {/* Collapsible Fine-Tuning Sliders */}
            {isMacroExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                {/* TDP Macro Control */}
                <div className="bg-slate-50 p-3 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                      <span className="text-xs font-black text-amber-900">TDP (Telugu Desam)</span>
                    </div>
                    <button
                      onClick={() => setMacroLocked((prev) => ({ ...prev, TDP: !prev.TDP }))}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        macroLocked.TDP ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={macroLocked.TDP ? 'TDP is locked from auto-rebalancing' : 'Click to lock TDP'}
                    >
                      {macroLocked.TDP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-black text-slate-900 font-mono">{currMacroTDP}%</span>
                    <span
                      className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        (macroSwing.TDP || 0) > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : (macroSwing.TDP || 0) < 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {(macroSwing.TDP || 0) > 0 ? `+${macroSwing.TDP}%` : `${macroSwing.TDP || 0}%`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAdjustMacro('TDP', Math.max(0, currMacroTDP - 1))}
                      disabled={macroLocked.TDP}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="20"
                      max="75"
                      step="0.5"
                      value={currMacroTDP}
                      disabled={macroLocked.TDP}
                      onChange={(e) => handleAdjustMacro('TDP', Number(e.target.value))}
                      className="flex-1 accent-amber-600 cursor-pointer disabled:opacity-40 h-1.5 bg-slate-200 rounded-lg"
                    />
                    <button
                      onClick={() => handleAdjustMacro('TDP', Math.min(85, currMacroTDP + 1))}
                      disabled={macroLocked.TDP}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* YSRCP Macro Control */}
                <div className="bg-slate-50 p-3 rounded-xl border border-sky-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                      <span className="text-xs font-black text-sky-900">YSRCP (YSR Congress)</span>
                    </div>
                    <button
                      onClick={() => setMacroLocked((prev) => ({ ...prev, YSRCP: !prev.YSRCP }))}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        macroLocked.YSRCP ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={macroLocked.YSRCP ? 'YSRCP is locked from auto-rebalancing' : 'Click to lock YSRCP'}
                    >
                      {macroLocked.YSRCP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-black text-slate-900 font-mono">{currMacroYSRCP}%</span>
                    <span
                      className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        (macroSwing.YSRCP || 0) > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : (macroSwing.YSRCP || 0) < 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {(macroSwing.YSRCP || 0) > 0 ? `+${macroSwing.YSRCP}%` : `${macroSwing.YSRCP || 0}%`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAdjustMacro('YSRCP', Math.max(0, currMacroYSRCP - 1))}
                      disabled={macroLocked.YSRCP}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="15"
                      max="65"
                      step="0.5"
                      value={currMacroYSRCP}
                      disabled={macroLocked.YSRCP}
                      onChange={(e) => handleAdjustMacro('YSRCP', Number(e.target.value))}
                      className="flex-1 accent-sky-600 cursor-pointer disabled:opacity-40 h-1.5 bg-slate-200 rounded-lg"
                    />
                    <button
                      onClick={() => handleAdjustMacro('YSRCP', Math.min(80, currMacroYSRCP + 1))}
                      disabled={macroLocked.YSRCP}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* JSP Macro Control */}
                <div className="bg-slate-50 p-3 rounded-xl border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" />
                      <span className="text-xs font-black text-rose-900">JSP (Janasena Party)</span>
                    </div>
                    <button
                      onClick={() => setMacroLocked((prev) => ({ ...prev, JSP: !prev.JSP }))}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        macroLocked.JSP ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={macroLocked.JSP ? 'JSP is locked from auto-rebalancing' : 'Click to lock JSP'}
                    >
                      {macroLocked.JSP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-black text-slate-900 font-mono">{currMacroJSP}%</span>
                    <span
                      className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        (macroSwing.JSP || 0) > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : (macroSwing.JSP || 0) < 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {(macroSwing.JSP || 0) > 0 ? `+${macroSwing.JSP}%` : `${macroSwing.JSP || 0}%`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAdjustMacro('JSP', Math.max(0, currMacroJSP - 1))}
                      disabled={macroLocked.JSP}
                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="0.5"
                      value={currMacroJSP}
                      disabled={macroLocked.JSP}
                      onChange={(e) => handleAdjustMacro('JSP', Number(e.target.value))}
                      className="flex-1 accent-rose-600 cursor-pointer disabled:opacity-40 h-1.5 bg-slate-200 rounded-lg"
                    />
                    <button
                      onClick={() => handleAdjustMacro('JSP', Math.min(60, currMacroJSP + 1))}
                      disabled={macroLocked.JSP}
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
                TDP: 46,
                YSRCP: 40,
                JSP: 10,
                OTH: 4,
              };
              const currSwing = swings[comm.key] || { TDP: 0, YSRCP: 0, JSP: 0 };
              const isCustomized = (currSwing.TDP || 0) !== 0 || (currSwing.YSRCP || 0) !== 0 || (currSwing.JSP || 0) !== 0;

              // Current Shares
              const tdpShare = Math.max(0, Math.min(100, Math.round(((baseline.TDP || 46) + (currSwing.TDP || 0)) * 10) / 10));
              const ysrcpShare = Math.max(0, Math.min(100, Math.round(((baseline.YSRCP || 40) + (currSwing.YSRCP || 0)) * 10) / 10));
              const jspShare = Math.max(0, Math.min(100, Math.round(((baseline.JSP || 10) + (currSwing.JSP || 0)) * 10) / 10));
              const othShare = Math.max(0, Math.round((100 - (tdpShare + ysrcpShare + jspShare)) * 10) / 10);

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
                          {comm.sharePct} AP
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
                        title="Reset to 2024 baseline"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>

                  {/* 100% Stacked Horizontal Segmented Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200 shadow-inner">
                      {/* TDP */}
                      <div
                        style={{ width: `${tdpShare}%` }}
                        className="bg-[#eab308] h-full transition-all duration-150"
                        title={`TDP: ${tdpShare}% (Baseline: ${baseline.TDP || 46}%)`}
                      />

                      {/* YSRCP */}
                      <div
                        style={{ width: `${ysrcpShare}%` }}
                        className="bg-[#0284c7] h-full transition-all duration-150"
                        title={`YSRCP: ${ysrcpShare}% (Baseline: ${baseline.YSRCP || 40}%)`}
                      />

                      {/* JSP */}
                      <div
                        style={{ width: `${jspShare}%` }}
                        className="bg-[#e11d48] h-full transition-all duration-150"
                        title={`JSP: ${jspShare}% (Baseline: ${baseline.JSP || 10}%)`}
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
                    {/* TDP Row */}
                    <div className="flex items-center gap-2.5 py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-colors">
                      <div className="w-16 flex items-center justify-between shrink-0">
                        <span className="text-xs font-black text-amber-800 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                          TDP
                        </span>
                        <button
                          onClick={() => toggleLock(comm.key, 'TDP')}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            locked.TDP ? 'text-amber-700 bg-amber-100' : 'text-slate-400 hover:text-slate-600'
                          }`}
                          title={locked.TDP ? 'TDP is locked from auto-rebalancing' : 'Click to lock TDP'}
                        >
                          {locked.TDP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="flex-1 flex items-center gap-1.5 min-w-0">
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'TDP', Math.max(0, tdpShare - 1))}
                          disabled={locked.TDP}
                          className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-30 rounded-md text-xs font-bold cursor-pointer shrink-0 shadow-2xs"
                        >
                          -
                        </button>
                        <input
                          type="range"
                          min="0"
                          max={100 - othShare}
                          step="1"
                          value={tdpShare}
                          disabled={locked.TDP}
                          onChange={(e) => handleAdjustCommunity(comm.key, 'TDP', Number(e.target.value))}
                          className="flex-1 accent-amber-500 cursor-pointer disabled:opacity-30 h-1.5 bg-slate-200 rounded-lg"
                        />
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'TDP', Math.min(100 - othShare, tdpShare + 1))}
                          disabled={locked.TDP}
                          className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-30 rounded-md text-xs font-bold cursor-pointer shrink-0 shadow-2xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="w-20 text-right shrink-0 flex items-baseline justify-end gap-1.5">
                        <span className="text-sm font-black text-slate-900 font-mono">{tdpShare}%</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            (currSwing.TDP || 0) > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : (currSwing.TDP || 0) < 0
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {(currSwing.TDP || 0) > 0 ? `+${currSwing.TDP}%` : (currSwing.TDP || 0) === 0 ? '0%' : `${currSwing.TDP}%`}
                        </span>
                      </div>
                    </div>

                    {/* YSRCP Row */}
                    <div className="flex items-center gap-2.5 py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-colors">
                      <div className="w-16 flex items-center justify-between shrink-0">
                        <span className="text-xs font-black text-sky-800 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                          YSRCP
                        </span>
                        <button
                          onClick={() => toggleLock(comm.key, 'YSRCP')}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            locked.YSRCP ? 'text-sky-700 bg-sky-100' : 'text-slate-400 hover:text-slate-600'
                          }`}
                          title={locked.YSRCP ? 'YSRCP is locked from auto-rebalancing' : 'Click to lock YSRCP'}
                        >
                          {locked.YSRCP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="flex-1 flex items-center gap-1.5 min-w-0">
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'YSRCP', Math.max(0, ysrcpShare - 1))}
                          disabled={locked.YSRCP}
                          className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-30 rounded-md text-xs font-bold cursor-pointer shrink-0 shadow-2xs"
                        >
                          -
                        </button>
                        <input
                          type="range"
                          min="0"
                          max={100 - othShare}
                          step="1"
                          value={ysrcpShare}
                          disabled={locked.YSRCP}
                          onChange={(e) => handleAdjustCommunity(comm.key, 'YSRCP', Number(e.target.value))}
                          className="flex-1 accent-sky-600 cursor-pointer disabled:opacity-30 h-1.5 bg-slate-200 rounded-lg"
                        />
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'YSRCP', Math.min(100 - othShare, ysrcpShare + 1))}
                          disabled={locked.YSRCP}
                          className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-30 rounded-md text-xs font-bold cursor-pointer shrink-0 shadow-2xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="w-20 text-right shrink-0 flex items-baseline justify-end gap-1.5">
                        <span className="text-sm font-black text-slate-900 font-mono">{ysrcpShare}%</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            (currSwing.YSRCP || 0) > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : (currSwing.YSRCP || 0) < 0
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {(currSwing.YSRCP || 0) > 0 ? `+${currSwing.YSRCP}%` : (currSwing.YSRCP || 0) === 0 ? '0%' : `${currSwing.YSRCP}%`}
                        </span>
                      </div>
                    </div>

                    {/* JSP Row */}
                    <div className="flex items-center gap-2.5 py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-rose-300 transition-colors">
                      <div className="w-16 flex items-center justify-between shrink-0">
                        <span className="text-xs font-black text-rose-800 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" />
                          JSP
                        </span>
                        <button
                          onClick={() => toggleLock(comm.key, 'JSP')}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            locked.JSP ? 'text-rose-700 bg-rose-100' : 'text-slate-400 hover:text-slate-600'
                          }`}
                          title={locked.JSP ? 'JSP is locked from auto-rebalancing' : 'Click to lock JSP'}
                        >
                          {locked.JSP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="flex-1 flex items-center gap-1.5 min-w-0">
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'JSP', Math.max(0, jspShare - 1))}
                          disabled={locked.JSP}
                          className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-30 rounded-md text-xs font-bold cursor-pointer shrink-0 shadow-2xs"
                        >
                          -
                        </button>
                        <input
                          type="range"
                          min="0"
                          max={100 - othShare}
                          step="1"
                          value={jspShare}
                          disabled={locked.JSP}
                          onChange={(e) => handleAdjustCommunity(comm.key, 'JSP', Number(e.target.value))}
                          className="flex-1 accent-rose-600 cursor-pointer disabled:opacity-30 h-1.5 bg-slate-200 rounded-lg"
                        />
                        <button
                          onClick={() => handleAdjustCommunity(comm.key, 'JSP', Math.min(100 - othShare, jspShare + 1))}
                          disabled={locked.JSP}
                          className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-30 rounded-md text-xs font-bold cursor-pointer shrink-0 shadow-2xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="w-20 text-right shrink-0 flex items-baseline justify-end gap-1.5">
                        <span className="text-sm font-black text-slate-900 font-mono">{jspShare}%</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            (currSwing.JSP || 0) > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : (currSwing.JSP || 0) < 0
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {(currSwing.JSP || 0) > 0 ? `+${currSwing.JSP}%` : (currSwing.JSP || 0) === 0 ? '0%' : `${currSwing.JSP}%`}
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
                Macro Shift: TDP {(macroSwing.TDP || 0) >= 0 ? `+${macroSwing.TDP || 0}` : macroSwing.TDP}%, YSRCP {(macroSwing.YSRCP || 0) >= 0 ? `+${macroSwing.YSRCP || 0}` : macroSwing.YSRCP}%, JSP {(macroSwing.JSP || 0) >= 0 ? `+${macroSwing.JSP || 0}` : macroSwing.JSP}%
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
