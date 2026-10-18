import React, { useState, useMemo } from 'react';
import type { SeeepcDataset } from '../types';
import { getPartyColor } from '../types';
import {
  Target,
  Megaphone,
  Users,
  Award,
  Sparkles,
  RotateCcw,
  CheckCircle,
  TrendingUp,
  Copy,
  Check,
  FileText,
  Star,
  AlertTriangle,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
  Download,
  X,
} from 'lucide-react';
import { StarCampaignerAllocator } from './StarCampaignerAllocator';
import { DefectionRebelModeler } from './DefectionRebelModeler';
import { ExecutiveBriefingModal } from './ExecutiveBriefingModal';

interface ActionsViewProps {
  data: SeeepcDataset;
  initialSelectedAc?: number | null;
  onOpenDossier?: (acNo: number) => void;
}

interface ActionAllocation {
  digitalPoints: number; // 0 - 50
  rallyPoints: number;   // 0 - 50
  welfarePoints: number; // 0 - 50
}

export const ActionsView: React.FC<ActionsViewProps> = ({
  data,
  initialSelectedAc,
  onOpenDossier,
}) => {
  const [targetParty, setTargetParty] = useState<'INC' | 'BRS' | 'BJP'>('INC');
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [digitalYieldPerPoint, setDigitalYieldPerPoint] = useState<number>(45);
  const [rallyYieldPerPoint, setRallyYieldPerPoint] = useState<number>(65);
  const [welfareYieldPerPoint, setWelfareYieldPerPoint] = useState<number>(55);
  const [expandedAcNo, setExpandedAcNo] = useState<number | null>(initialSelectedAc || null);
  const [filterType, setFilterType] = useState<'battleground' | 'all' | 'flipped'>('battleground');
  const [battlegroundMarginThreshold, setBattlegroundMarginThreshold] = useState<number>(8000);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSubTab, setActionSubTab] = useState<'tactical' | 'star_campaigners' | 'defections'>('tactical');
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);

  // Per-AC action allocations
  const [allocations, setAllocations] = useState<Record<number, ActionAllocation>>(() => {
    const init: Record<number, ActionAllocation> = {};
    // Seed default allocations for hyper-close battleground seats including initialSelectedAc
    const topBattlegrounds = [40, 23, 1, 28, 77, 85, 31, 105];
    if (initialSelectedAc && !topBattlegrounds.includes(initialSelectedAc)) {
      topBattlegrounds.unshift(initialSelectedAc);
    }
    topBattlegrounds.forEach((acNo) => {
      init[acNo] = {
        digitalPoints: 20,
        rallyPoints: 15,
        welfarePoints: 15,
      };
    });
    return init;
  });

  // Campaign Resource Points Pool (customizable & expandable)
  const [totalPointsBudget, setTotalPointsBudget] = useState<number>(1000);
  const totalAllocated = useMemo(() => {
    return Object.values(allocations).reduce(
      (sum, a) => sum + a.digitalPoints + a.rallyPoints + a.welfarePoints,
      0
    );
  }, [allocations]);

  const remainingPoints = totalPointsBudget - totalAllocated;

  // Prioritize battleground seats sorted by tightest margin
  const battlegroundList = useMemo(() => {
    const list = Object.values(data.constituencies).map((ac) => {
      const winner = ac.winner_2023.party;
      const runner = ac.runner_up_2023.party;
      const margin = ac.margin_2023;

      // Find primary decisive community
      let maxComm = 'bc_mudiraj';
      let maxPct = 0;
      Object.entries(ac.caste_profile).forEach(([k, v]) => {
        if (v > maxPct) {
          maxPct = v;
          maxComm = k;
        }
      });

      const readableCasteName: Record<string, string> = {
        sc_madiga: 'SC Madiga',
        sc_mala: 'SC Mala',
        st_lambada: 'ST Lambada',
        st_koya_gond: 'ST Koya/Gond',
        bc_mudiraj: 'BC Mudiraj',
        bc_munnuru_kapu: 'BC Munnuru Kapu',
        bc_padmashali: 'BC Padmashali',
        bc_goud: 'BC Goud',
        bc_yadav: 'BC Yadav',
        bc_other: 'BC Other',
        minority_muslim: 'Muslim Minorities',
        oc_reddy: 'OC Reddy',
        oc_velama: 'OC Velama',
        oc_other: 'OC Other',
      };

      // Current deficit or defense requirement
      const isTargetWinning = winner === targetParty;
      const deficit = isTargetWinning ? 0 : margin;

      // Allocation for this seat
      const alloc = allocations[ac.ac_no] || { digitalPoints: 0, rallyPoints: 0, welfarePoints: 0 };
      const seatTotalPoints = alloc.digitalPoints + alloc.rallyPoints + alloc.welfarePoints;

      // Projected vote swing: Every point translates to votes based on community size and customizable yield
      const digitalSwing = alloc.digitalPoints * digitalYieldPerPoint * (maxPct / 18);
      const rallySwing = alloc.rallyPoints * rallyYieldPerPoint * (maxPct / 18);
      const welfareSwing = alloc.welfarePoints * welfareYieldPerPoint * (maxPct / 18);
      const totalSwing = Math.round(digitalSwing + rallySwing + welfareSwing);

      const projectedNewMargin = isTargetWinning
        ? margin + totalSwing
        : -margin + totalSwing;

      const isFlippedToWin = !isTargetWinning && projectedNewMargin > 0;
      const isDefended = isTargetWinning && projectedNewMargin > 2000;

      // Messaging directive based on community
      let adFocus = 'Youth employment, TSPSC transparency, and digital skills';
      let recommendedChannel = 'WhatsApp broadcast + YouTube regional dialect ads';
      if (maxComm.includes('mudiraj')) {
        adFocus = 'BC Bandhu expansion, fisheries infrastructure, and educational reservations';
        recommendedChannel = 'Meta hyper-targeted reels + community association outreach';
      } else if (maxComm.includes('padmashali')) {
        adFocus = 'Power loom power tariff subsidies, yarn price protection, and weaver health insurance';
        recommendedChannel = 'Ground townhall meetings + weaver cooperative channels';
      } else if (maxComm.includes('madiga')) {
        adFocus = 'SC sub-categorization statutory roadmap and Dalit Bandhu direct transfers';
        recommendedChannel = 'Community leadership rallies + targeted WhatsApp networks';
      } else if (maxComm.includes('munnuru_kapu')) {
        adFocus = 'Agriculture loan waivers, cold storage chains, and political representation';
        recommendedChannel = 'Digital regional news portals + mandal-level farmer meets';
      }

      return {
        ac_no: ac.ac_no,
        ac_name: ac.ac_name,
        district: ac.district,
        pc_name: ac.pc_name,
        winner_2023: winner,
        runner_up_2023: runner,
        margin_2023: margin,
        isTargetWinning,
        deficit,
        target_community: readableCasteName[maxComm] || maxComm,
        target_community_pct: maxPct,
        alloc,
        seatTotalPoints,
        totalSwing,
        projectedNewMargin,
        isFlippedToWin,
        isDefended,
        reservation: ac.reservation,
        adFocus,
        recommendedChannel,
      };
    });

    // Sort by tightest margin
    return list.sort((a, b) => a.margin_2023 - b.margin_2023);
  }, [data, targetParty, allocations, digitalYieldPerPoint, rallyYieldPerPoint, welfareYieldPerPoint]);

  // Filtered battleground view based on search, threshold, and filter pill
  const filteredBattlegrounds = useMemo(() => {
    return battlegroundList
      .filter((b) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = b.ac_name.toLowerCase().includes(q);
          const matchesDist = b.district.toLowerCase().includes(q);
          const matchesNo = b.ac_no.toString().includes(q);
          if (!matchesName && !matchesDist && !matchesNo) return false;
        }

        if (filterType === 'battleground') {
          return b.margin_2023 <= battlegroundMarginThreshold;
        }
        if (filterType === 'flipped') {
          return b.isFlippedToWin || b.seatTotalPoints > 0;
        }
        return true;
      })
      .sort((a, b) => a.margin_2023 - b.margin_2023);
  }, [battlegroundList, filterType, battlegroundMarginThreshold, searchQuery]);

  // Handle single AC point adjustment
  const handlePointChange = (
    acNo: number,
    field: 'digitalPoints' | 'rallyPoints' | 'welfarePoints',
    val: number
  ) => {
    setAllocations((prev) => {
      const current = prev[acNo] || { digitalPoints: 0, rallyPoints: 0, welfarePoints: 0 };
      return {
        ...prev,
        [acNo]: {
          ...current,
          [field]: Math.max(0, val),
        },
      };
    });
  };

  // Automated Smart Allocator: Distributes points to top battleground seats for maximum seat yield, fully exhausting the total points budget
  const autoAllocateBudget = () => {
    if (totalPointsBudget <= 0) {
      setAllocations({});
      return;
    }

    const newAlloc: Record<number, ActionAllocation> = {};
    let pointsLeft = totalPointsBudget;

    const addPointsToSeat = (acNo: number, ptsToAdd: number) => {
      if (ptsToAdd <= 0) return;
      const current = newAlloc[acNo] || { digitalPoints: 0, rallyPoints: 0, welfarePoints: 0 };
      const d = Math.round(ptsToAdd * 0.4);
      const r = Math.round(ptsToAdd * 0.35);
      const w = Math.max(0, ptsToAdd - d - r);
      newAlloc[acNo] = {
        digitalPoints: current.digitalPoints + d,
        rallyPoints: current.rallyPoints + r,
        welfarePoints: current.welfarePoints + w,
      };
    };

    // Calculate approximate vote yield per point for a seat given current yield settings
    const getEstYieldPerPt = (commPct: number) => {
      const avgYield =
        0.4 * digitalYieldPerPoint + 0.35 * rallyYieldPerPoint + 0.25 * welfareYieldPerPoint;
      return Math.max(10, avgYield * (commPct / 18));
    };

    // Tier 1: Prime Flips - Lost seats with narrowest margins (<= 7,000)
    const tier1Flips = battlegroundList
      .filter((b) => !b.isTargetWinning && b.margin_2023 <= 7000)
      .sort((a, b) => a.margin_2023 - b.margin_2023);

    // Tier 2: Vulnerable Defense - Won seats with razor-thin margins (<= 4,000)
    const tier2Defend = battlegroundList
      .filter((b) => b.isTargetWinning && b.margin_2023 <= 4000)
      .sort((a, b) => a.margin_2023 - b.margin_2023);

    // Tier 3: Secondary Flips - Lost seats with moderate margins (7,001 - 15,000)
    const tier3Flips = battlegroundList
      .filter((b) => !b.isTargetWinning && b.margin_2023 > 7000 && b.margin_2023 <= 15000)
      .sort((a, b) => a.margin_2023 - b.margin_2023);

    // Tier 4: Moderate Defense - Won seats with moderate margins (4,001 - 10,000)
    const tier4Defend = battlegroundList
      .filter((b) => b.isTargetWinning && b.margin_2023 > 4000 && b.margin_2023 <= 10000)
      .sort((a, b) => a.margin_2023 - b.margin_2023);

    // Tier 5: Reach Flips - Lost seats with larger margins (> 15,000)
    const tier5Flips = battlegroundList
      .filter((b) => !b.isTargetWinning && b.margin_2023 > 15000)
      .sort((a, b) => a.margin_2023 - b.margin_2023);

    // Pass 1: Allocate required points to flip Tier 1 seats
    for (const b of tier1Flips) {
      if (pointsLeft <= 0) break;
      const yieldPerPt = getEstYieldPerPt(b.target_community_pct);
      const needed = Math.min(80, Math.max(18, Math.ceil((b.margin_2023 + 300) / yieldPerPt)));
      const grant = Math.min(pointsLeft, needed);
      addPointsToSeat(b.ac_no, grant);
      pointsLeft -= grant;
    }

    // Pass 2: Allocate defense fortification for Tier 2 vulnerable defense seats
    for (const b of tier2Defend) {
      if (pointsLeft <= 0) break;
      const yieldPerPt = getEstYieldPerPt(b.target_community_pct);
      const needed = Math.min(35, Math.max(15, Math.ceil((4000 - b.margin_2023) / yieldPerPt) + 8));
      const grant = Math.min(pointsLeft, needed);
      addPointsToSeat(b.ac_no, grant);
      pointsLeft -= grant;
    }

    // Pass 3: Expand to Tier 3 secondary flippable seats
    for (const b of tier3Flips) {
      if (pointsLeft <= 0) break;
      const yieldPerPt = getEstYieldPerPt(b.target_community_pct);
      const needed = Math.min(75, Math.max(25, Math.ceil((b.margin_2023 + 300) / yieldPerPt)));
      const grant = Math.min(pointsLeft, needed);
      addPointsToSeat(b.ac_no, grant);
      pointsLeft -= grant;
    }

    // Pass 4: Expand to Tier 4 defense seats
    for (const b of tier4Defend) {
      if (pointsLeft <= 0) break;
      const grant = Math.min(pointsLeft, 20);
      addPointsToSeat(b.ac_no, grant);
      pointsLeft -= grant;
    }

    // Pass 5: Reach into Tier 5 seats if budget still has surplus
    for (const b of tier5Flips) {
      if (pointsLeft <= 0) break;
      const grant = Math.min(pointsLeft, 30);
      addPointsToSeat(b.ac_no, grant);
      pointsLeft -= grant;
    }

    // Pass 6: Full Budget Exhaustion Guarantee - Distribute any remaining points across priority targets
    if (pointsLeft > 0) {
      const allocatedAcNos = Object.keys(newAlloc).map(Number);
      const targetAcList = allocatedAcNos.length > 0 ? allocatedAcNos : battlegroundList.map((b) => b.ac_no);
      let idx = 0;
      while (pointsLeft > 0 && targetAcList.length > 0) {
        const acNo = targetAcList[idx % targetAcList.length];
        if (!newAlloc[acNo]) {
          newAlloc[acNo] = { digitalPoints: 0, rallyPoints: 0, welfarePoints: 0 };
        }
        if (pointsLeft >= 3) {
          newAlloc[acNo].digitalPoints += 1;
          newAlloc[acNo].rallyPoints += 1;
          newAlloc[acNo].welfarePoints += 1;
          pointsLeft -= 3;
        } else if (pointsLeft === 2) {
          newAlloc[acNo].digitalPoints += 1;
          newAlloc[acNo].rallyPoints += 1;
          pointsLeft -= 2;
        } else {
          newAlloc[acNo].rallyPoints += 1;
          pointsLeft -= 1;
        }
        idx++;
      }
    }

    setAllocations(newAlloc);
  };

  // Reset all allocations
  const resetAllocations = () => {
    setAllocations({});
  };

  // Seats flipped count
  const flippedCount = useMemo(() => {
    return battlegroundList.filter((b) => b.isFlippedToWin).length;
  }, [battlegroundList]);

  // Generated Plan Memo content
  const generatedPlanMemo = useMemo(() => {
    const topTargets = battlegroundList.filter((b) => b.seatTotalPoints > 0);
    return `CONFIDENTIAL - STRATEGIC CAMPAIGN ACTION PLAN
Target Party: ${targetParty}
Total Points Allocated: ${totalAllocated} / ${totalPointsBudget}
Projected Net Seats Flipped to Win: +${flippedCount}

MODEL PARAMETERS (VOTES PER POINT):
 - Micro-Targeted Digital Ads: ${digitalYieldPerPoint} votes/pt
 - CM & Star Rallies: ${rallyYieldPerPoint} votes/pt
 - Targeted Welfare Schemes: ${welfareYieldPerPoint} votes/pt

TARGETED BATTLEGROUND CONSTITUENCIES (${topTargets.length} SEATS ALLOCATED):
${topTargets.length === 0 ? 'No constituencies allocated yet. Use Auto-Optimize or allocate points in the list below.' :
topTargets
  .map(
    (t, i) =>
      `${i + 1}. AC #${t.ac_no} ${t.ac_name} (${t.district}):
   - 2023 Margin: ${t.margin_2023.toLocaleString()} votes (Held by ${t.winner_2023})
   - Target Community: ${t.target_community} (${t.target_community_pct}% of AC)
   - Allocated Points: ${t.seatTotalPoints} (Digital: ${t.alloc.digitalPoints}, CM Rally: ${t.alloc.rallyPoints}, Welfare: ${t.alloc.welfarePoints})
   - Projected Swing: +${t.totalSwing.toLocaleString()} votes -> Result: ${t.isFlippedToWin ? 'FLIP TO VICTORY' : t.isTargetWinning ? 'DEFENDED' : 'DEFICIT REDUCED'}
   - Creative Focus: ${t.adFocus}
   - Delivery Channel: ${t.recommendedChannel}`
  )
  .join('\n\n')}

Generated via Telangana Assembly SEEEPC Strategic Decision Engine.`;
  }, [
    battlegroundList,
    targetParty,
    totalAllocated,
    totalPointsBudget,
    flippedCount,
    digitalYieldPerPoint,
    rallyYieldPerPoint,
    welfareYieldPerPoint,
  ]);

  // Download plan file handler
  const handleDownloadPlan = () => {
    const blob = new Blob([generatedPlanMemo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Telangana_Strategic_Campaign_Plan_${targetParty}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy plan to clipboard
  const handleCopyPlan = () => {
    navigator.clipboard.writeText(generatedPlanMemo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Playbook Sub-Navigation & Feature #11 Executive Briefing Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActionSubTab('tactical')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              actionSubTab === 'tactical'
                ? 'bg-white text-indigo-700 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            <span>Resource Points Allocator</span>
          </button>

          <button
            onClick={() => setActionSubTab('star_campaigners')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              actionSubTab === 'star_campaigners'
                ? 'bg-white text-amber-700 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Star Campaigners</span>
          </button>

          <button
            onClick={() => setActionSubTab('defections')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              actionSubTab === 'defections'
                ? 'bg-white text-rose-700 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Defections &amp; Rebels</span>
          </button>
        </div>

        {/* Executive Intelligence Briefing */}
        <button
          onClick={() => setIsExecutiveModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 hover:from-indigo-600 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer border border-indigo-500/30 group"
          title="Open printable C-Suite Executive Intelligence Briefing Dossier"
        >
          <FileText className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform" />
          <span>Executive Briefing</span>
        </button>
      </div>

      {actionSubTab === 'star_campaigners' && (
        <StarCampaignerAllocator data={data} onOpenDossier={onOpenDossier} />
      )}

      {actionSubTab === 'defections' && (
        <DefectionRebelModeler data={data} onOpenDossier={onOpenDossier} />
      )}

      {actionSubTab === 'tactical' && (
        <div className="space-y-6">
          {/* Executive Command Header */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white font-mono text-xs font-black px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> CAMPAIGN ACTIONS PLAYBOOK
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                Resource &amp; Point Allocator
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Caste-Targeted Ads, Rallies &amp; Welfare Campaign Allocator
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Perspective party selector */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-700">
              <span className="text-slate-400 px-2 text-[11px]">Strategy for:</span>
              {(['INC', 'BRS', 'BJP'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setTargetParty(p)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    targetParty === p
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={autoAllocateBudget}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              title="Automatically distribute points to flip highest-yield seats"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              Auto-Optimize Budget
            </button>

            <button
              onClick={resetAllocations}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              title="Reset allocations"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-Time Strategic Impact Scoreboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-400 font-semibold mb-1">Campaign Resource Points</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white">{totalAllocated}</span>
                <span className="text-xs text-slate-400">/</span>
                <input
                  type="number"
                  min="100"
                  max="100000"
                  step="100"
                  value={totalPointsBudget}
                  onChange={(e) => setTotalPointsBudget(Math.max(0, Number(e.target.value) || 0))}
                  className="w-20 px-1.5 py-0.5 bg-slate-900 border border-slate-600 rounded font-mono font-bold text-xs text-amber-400 text-right focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  title="Click to edit total point pool"
                />
                <span className="text-[10px] text-slate-400">Pool</span>
              </div>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all ${totalAllocated > totalPointsBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, (totalAllocated / Math.max(1, totalPointsBudget)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
                <span>Points Available</span>
                <span className="text-[10px] text-slate-400 font-mono">Add more:</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-3xl font-black ${remainingPoints >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {remainingPoints}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setTotalPointsBudget((prev) => prev + 100)}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 active:bg-emerald-700 text-white rounded text-[11px] font-mono font-bold cursor-pointer transition-colors shadow-2xs"
                    title="Add 100 points to available pool"
                  >
                    +100
                  </button>
                  <button
                    onClick={() => setTotalPointsBudget((prev) => prev + 250)}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 active:bg-emerald-700 text-white rounded text-[11px] font-mono font-bold cursor-pointer transition-colors shadow-2xs"
                    title="Add 250 points to available pool"
                  >
                    +250
                  </button>
                  <button
                    onClick={() => setTotalPointsBudget((prev) => prev + 500)}
                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded text-[11px] font-mono font-bold cursor-pointer transition-colors shadow-2xs"
                    title="Add 500 points to available pool"
                  >
                    +500
                  </button>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
              <span>{remainingPoints >= 0 ? 'Ready to assign' : 'Budget Overspent!'}</span>
              <span className="text-slate-500 text-[10px]">Total: {totalPointsBudget} pts</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 font-semibold mb-1">Projected Net Seat Flips</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">+{flippedCount}</span>
              <span className="text-xs text-slate-400">Seats Flipped</span>
            </div>
            <div className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Flipped to {targetParty} Victory
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div className="text-xs text-slate-400 font-semibold mb-1">Strategic Campaign Plan</div>
            <button
              onClick={() => setIsPlanModalOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all shadow-xs cursor-pointer"
              title="Open full campaign action plan modal with copy & download"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Strategic Directives: 3 Action Pillars (Compressed & Dynamic Yield Inputs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Digital Ads */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs">
              <Megaphone className="w-3.5 h-3.5" />
              <span>Micro-Targeted Digital Ads</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Reels &amp; WhatsApp</span>
          </div>
          <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 text-[11px]">Votes Per Point:</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="500"
                value={digitalYieldPerPoint}
                onChange={(e) => setDigitalYieldPerPoint(Math.max(1, Number(e.target.value) || 0))}
                className="w-14 px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-xs text-indigo-700 text-right focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-500">votes/pt</span>
            </div>
          </div>
        </div>

        {/* CM & Star Rallies */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
              <Users className="w-3.5 h-3.5" />
              <span>CM &amp; Star Rallies</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Mandal Townhalls</span>
          </div>
          <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 text-[11px]">Votes Per Point:</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="500"
                value={rallyYieldPerPoint}
                onChange={(e) => setRallyYieldPerPoint(Math.max(1, Number(e.target.value) || 0))}
                className="w-14 px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-xs text-emerald-700 text-right focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-500">votes/pt</span>
            </div>
          </div>
        </div>

        {/* Targeted Welfare */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs">
              <Award className="w-3.5 h-3.5" />
              <span>Targeted Welfare Schemes</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Corporation Disbursals</span>
          </div>
          <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 text-[11px]">Votes Per Point:</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="1"
                max="500"
                value={welfareYieldPerPoint}
                onChange={(e) => setWelfareYieldPerPoint(Math.max(1, Number(e.target.value) || 0))}
                className="w-14 px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-xs text-amber-700 text-right focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
              <span className="text-[10px] text-slate-500">votes/pt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
            Constituency Resource Allocation &amp; Community Directives
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search AC or District..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-44"
            />
          </div>

          {/* Battleground Margin Threshold Input */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-xs">
            <span className="text-slate-500 font-semibold text-[11px]">Margin &le;</span>
            <input
              type="number"
              min="500"
              max="50000"
              step="500"
              value={battlegroundMarginThreshold}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setBattlegroundMarginThreshold(isNaN(val) ? 0 : Math.max(0, val));
                setFilterType('battleground');
              }}
              className="w-16 px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-xs text-slate-900 text-right focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-slate-400 text-[10px]">votes</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setFilterType('battleground')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'battleground'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Battlegrounds ({filteredBattlegrounds.length})
            </button>
            <button
              onClick={() => setFilterType('flipped')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'flipped'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Flipped / Allocated
            </button>
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All 119
            </button>
          </div>
        </div>
      </div>

      {/* Single Collapsible Card List */}
      <div className="space-y-2">
        {filteredBattlegrounds.map((b) => {
          const isExpanded = expandedAcNo === b.ac_no;
          const hasPoints = b.seatTotalPoints > 0;
          const isFlipped = b.isFlippedToWin;
          const winnerColor = getPartyColor(b.winner_2023);

          return (
            <div
              key={b.ac_no}
              className={`bg-white rounded-xl border transition-all ${
                isFlipped
                  ? 'border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                  : hasPoints
                  ? 'border-indigo-300 ring-1 ring-indigo-400/20 shadow-2xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Compact 1-Line Row Summary */}
              <div
                onClick={() => setExpandedAcNo(isExpanded ? null : b.ac_no)}
                className="p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
              >
                {/* 1. AC No + Name + District */}
                <div className="flex items-center gap-2.5 min-w-[170px]">
                  <span className="font-mono text-xs font-black bg-slate-900 text-white px-2 py-0.5 rounded">
                    #{b.ac_no}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1.5">
                      {b.ac_name}
                      {b.reservation && b.reservation !== 'GEN' && (
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono font-bold">
                          {b.reservation}
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-500">{b.district}</span>
                  </div>
                </div>

                {/* 2. Target Decisive Community Badge */}
                <div className="hidden lg:flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Target Community:</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 border border-indigo-200 flex items-center gap-1">
                    <Users className="w-3 h-3 text-indigo-600" />
                    {b.target_community} ({b.target_community_pct}%)
                  </span>
                </div>

                {/* 3. 2023 Baseline Result vs Projected Outcome */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="text-right hidden sm:block">
                    <div className="text-slate-400 text-[10px]">2023 Result</div>
                    <div className="font-bold">
                      <span style={{ color: winnerColor }}>{b.winner_2023}</span>{' '}
                      <span className="text-slate-500 font-mono">+{b.margin_2023.toLocaleString()}</span>
                    </div>
                  </div>

                  {isFlipped ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-black flex items-center gap-1 shadow-2xs">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      FLIPPED (+{b.projectedNewMargin.toLocaleString()})
                    </span>
                  ) : b.isTargetWinning ? (
                    <span className="px-2.5 py-1 bg-sky-100 text-sky-800 border border-sky-300 rounded-lg text-xs font-bold">
                      Defended (+{b.projectedNewMargin.toLocaleString()})
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold">
                      Deficit: -{Math.abs(b.projectedNewMargin).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* 4. Active Points & Projected Swing Pills & Expand Chevron */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    {hasPoints ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        +{b.totalSwing.toLocaleString()} votes ({b.seatTotalPoints} pts: {b.alloc.digitalPoints}d / {b.alloc.rallyPoints}r / {b.alloc.welfarePoints}w)
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">No points assigned</span>
                    )}
                  </div>

                  <button className="text-slate-400 hover:text-slate-700 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Drawer (Revealed on Click): Resource Point Allocator Across 3 Pillars */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/60 rounded-b-xl text-xs space-y-3 animate-in fade-in duration-150">
                  {/* Demographic Directive Box */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-slate-800 font-bold text-xs">
                      <div className="flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-indigo-600" />
                        <span>Strategic Directive for {b.ac_name}: {b.target_community} ({b.target_community_pct}% of AC)</span>
                      </div>
                      <span className="font-mono text-indigo-700 font-black">
                        Total Allocated: {b.seatTotalPoints} pts &bull; Projected Swing: +{b.totalSwing.toLocaleString()} votes
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <strong className="text-slate-700">Messaging Focus:</strong>{' '}
                        <span className="text-slate-600">{b.adFocus}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <strong className="text-slate-700">Delivery Channel:</strong>{' '}
                        <span className="text-slate-600">{b.recommendedChannel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Allocation 3 Pillars Controls */}
                  <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-3">
                    <div className="flex items-center justify-between font-bold text-slate-800 text-[11px] border-b border-slate-100 pb-1.5">
                      <span>Deploy Campaign Resource Points Across 3 Strategic Pillars</span>
                      <span className="text-slate-500 font-normal">Available Pool: <strong className="text-emerald-700 font-bold">{remainingPoints} pts</strong></span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Pillar 1: Digital Ads */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900 flex items-center gap-1.5 text-xs">
                            <Megaphone className="w-3.5 h-3.5 text-indigo-600" />
                            Digital Ads
                          </span>
                          <span className="font-mono font-bold text-xs text-indigo-700">
                            {b.alloc.digitalPoints} pts
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Yield: ~{digitalYieldPerPoint} votes/pt &bull; Local reels &amp; WhatsApp
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="5"
                          value={b.alloc.digitalPoints}
                          onChange={(e) => handlePointChange(b.ac_no, 'digitalPoints', Number(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          {[0, 10, 25, 40].map((val) => (
                            <button
                              key={val}
                              onClick={() => handlePointChange(b.ac_no, 'digitalPoints', val)}
                              className={`px-1.5 py-0.5 rounded border text-[9px] font-bold cursor-pointer transition-colors ${
                                b.alloc.digitalPoints === val ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {val}p
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pillar 2: CM Rallies */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                            <Users className="w-3.5 h-3.5 text-emerald-600" />
                            CM / Star Rallies
                          </span>
                          <span className="font-mono font-bold text-xs text-emerald-700">
                            {b.alloc.rallyPoints} pts
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Yield: ~{rallyYieldPerPoint} votes/pt &bull; Mandal meetings
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="5"
                          value={b.alloc.rallyPoints}
                          onChange={(e) => handlePointChange(b.ac_no, 'rallyPoints', Number(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          {[0, 10, 20, 30].map((val) => (
                            <button
                              key={val}
                              onClick={() => handlePointChange(b.ac_no, 'rallyPoints', val)}
                              className={`px-1.5 py-0.5 rounded border text-[9px] font-bold cursor-pointer transition-colors ${
                                b.alloc.rallyPoints === val ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {val}p
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pillar 3: Targeted Welfare */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                            <Award className="w-3.5 h-3.5 text-amber-600" />
                            Targeted Welfare
                          </span>
                          <span className="font-mono font-bold text-xs text-amber-700">
                            {b.alloc.welfarePoints} pts
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Yield: ~{welfareYieldPerPoint} votes/pt &bull; Community loan disbursals
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="5"
                          value={b.alloc.welfarePoints}
                          onChange={(e) => handlePointChange(b.ac_no, 'welfarePoints', Number(e.target.value))}
                          className="w-full accent-amber-600 cursor-pointer"
                        />
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          {[0, 10, 20, 30].map((val) => (
                            <button
                              key={val}
                              onClick={() => handlePointChange(b.ac_no, 'welfarePoints', val)}
                              className={`px-1.5 py-0.5 rounded border text-[9px] font-bold cursor-pointer transition-colors ${
                                b.alloc.welfarePoints === val ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {val}p
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Dossier Link */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Seat Status: <strong>{b.isFlippedToWin ? 'Flipped to Victory' : b.isTargetWinning ? 'Defended' : `Deficit of ${Math.abs(b.projectedNewMargin).toLocaleString()} votes`}</strong>
                    </span>
                    {onOpenDossier && (
                      <button
                        onClick={() => onOpenDossier(b.ac_no)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                      >
                        Inspect Full AC Dossier ↗
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )}

  {/* Executive Intelligence Briefing Modal */}
  <ExecutiveBriefingModal
    isOpen={isExecutiveModalOpen}
    onClose={() => setIsExecutiveModalOpen(false)}
    data={data}
    targetParty={targetParty}
  />

  {/* Strategic Campaign Plan Modal Popup with Download & Copy */}
  {isPlanModalOpen && (
    <div
      className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={() => setIsPlanModalOpen(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded">
                STRATEGIC PLAN
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {targetParty} Campaign Action Plan
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              {totalAllocated} / {totalPointsBudget} Points Allocated &bull; +{flippedCount} Projected Net Flips
            </p>
          </div>

          <button
            onClick={() => setIsPlanModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Text Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-900 text-slate-100 font-mono text-xs whitespace-pre-wrap leading-relaxed select-text">
          {generatedPlanMemo}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">
            Ready to export or distribute to leadership war room
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPlan}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {copiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMemo ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
            </button>

            <button
              onClick={handleDownloadPlan}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span>Download (.txt)</span>
            </button>

            <button
              onClick={() => setIsPlanModalOpen(false)}
              className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
);
};
