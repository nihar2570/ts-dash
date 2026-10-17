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
  Sliders,
  CheckCircle,
  TrendingUp,
  Copy,
  Check,
  FileText,
  Star,
  AlertTriangle,
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
  digitalPoints: number; // 0 - 40
  rallyPoints: number;   // 0 - 30
  welfarePoints: number; // 0 - 30
}

export const ActionsView: React.FC<ActionsViewProps> = ({
  data,
  initialSelectedAc,
  onOpenDossier,
}) => {
  const [targetParty, setTargetParty] = useState<'INC' | 'BRS' | 'BJP'>('INC');
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [focusedAc] = useState<number | null>(initialSelectedAc || null);
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

  // Calculate budget: 1000 total points pool
  const totalPointsBudget = 1000;
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

      // Projected vote swing: Every point translates to votes based on community size
      // ROI: ~45 votes per point on digital, ~65 per point on rally, ~55 per point on welfare
      const digitalSwing = alloc.digitalPoints * 45 * (maxPct / 18);
      const rallySwing = alloc.rallyPoints * 65 * (maxPct / 18);
      const welfareSwing = alloc.welfarePoints * 55 * (maxPct / 18);
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
        adFocus,
        recommendedChannel,
      };
    });

    // Sort by tightest margin
    return list.sort((a, b) => a.margin_2023 - b.margin_2023);
  }, [data, targetParty, allocations]);

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

  // Automated Smart Allocator: Distributes points to top battleground seats for maximum seat yield
  const autoAllocateBudget = () => {
    const newAlloc: Record<number, ActionAllocation> = {};
    let pointsLeft = totalPointsBudget;

    // Pick seats where deficit <= 7,000 votes
    const targetOpportunities = battlegroundList.filter(
      (b) => (!b.isTargetWinning && b.margin_2023 <= 6500) || (b.isTargetWinning && b.margin_2023 <= 2500)
    );

    targetOpportunities.forEach((b) => {
      if (pointsLeft >= 60) {
        newAlloc[b.ac_no] = {
          digitalPoints: 25,
          rallyPoints: 20,
          welfarePoints: 15,
        };
        pointsLeft -= 60;
      } else if (pointsLeft >= 30) {
        newAlloc[b.ac_no] = {
          digitalPoints: 15,
          rallyPoints: 10,
          welfarePoints: 5,
        };
        pointsLeft -= 30;
      }
    });

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

  // Executive Memo Copy handler
  const copyExecutiveMemo = () => {
    const topTargets = battlegroundList.filter((b) => b.seatTotalPoints > 0).slice(0, 10);
    const memo = `CONFIDENTIAL - CHIEF MINISTER'S STRATEGIC CAMPAIGN ACTION MEMO
Target Party: ${targetParty}
Total Points Allocated: ${totalAllocated} / ${totalPointsBudget}
Projected Net Seats Flipped to Win: +${flippedCount}

TOP HIGH-YIELD ACTION TARGETS:
${topTargets
  .map(
    (t, i) =>
      `${i + 1}. AC #${t.ac_no} ${t.ac_name} (${t.district}):
   - 2023 Margin: ${t.margin_2023.toLocaleString()} votes (Held by ${t.winner_2023})
   - Target Community: ${t.target_community} (${t.target_community_pct}% of AC)
   - Allocated Points: ${t.seatTotalPoints} (Digital: ${t.alloc.digitalPoints}, CM Rally: ${t.alloc.rallyPoints}, Welfare: ${t.alloc.welfarePoints})
   - Projected Swing: +${t.totalSwing.toLocaleString()} votes -> Result: ${t.isFlippedToWin ? 'FLIP TO VICTORY' : 'DEFENDED'}
   - Creative Focus: ${t.adFocus}
   - Delivery Channel: ${t.recommendedChannel}`
  )
  .join('\n\n')}

Generated via Telangana Assembly SEEEPC Strategic Decision Engine.`;

    navigator.clipboard.writeText(memo);
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
            <span>Star Campaigners (#10)</span>
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
            <span>Defections &amp; Rebels (#4)</span>
          </button>
        </div>

        {/* 1-Click Executive Intelligence Briefing (#11) */}
        <button
          onClick={() => setIsExecutiveModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 hover:from-indigo-600 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer border border-indigo-500/30 group"
          title="Open printable C-Suite Executive Intelligence Briefing Dossier"
        >
          <FileText className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform" />
          <span>1-Click Executive Briefing (#11)</span>
          <span className="text-[10px] bg-indigo-500/40 text-indigo-100 font-mono px-1.5 py-0.2 rounded border border-indigo-400/40">
            Dossier &amp; Print
          </span>
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
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 font-semibold mb-1">Campaign Resource Points</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{totalAllocated}</span>
              <span className="text-xs text-slate-400">/ {totalPointsBudget} Allocated</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all ${totalAllocated > totalPointsBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, (totalAllocated / totalPointsBudget) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 font-semibold mb-1">Points Available</div>
            <div className={`text-3xl font-black ${remainingPoints >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {remainingPoints}
            </div>
            <div className="text-[11px] text-slate-400">
              {remainingPoints >= 0 ? 'Ready to assign' : 'Budget Overspent!'}
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
            <div className="text-xs text-slate-400 font-semibold mb-1">Executive Briefing Memo</div>
            <button
              onClick={copyExecutiveMemo}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all shadow-xs cursor-pointer"
            >
              {copiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMemo ? 'Memo Copied!' : 'Copy CM Memo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Strategic Directives: 3 Action Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Digital Ads */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <Megaphone className="w-4 h-4" />
            <span>Pillar 1: Micro-Targeted Digital Ads</span>
          </div>
          <p className="text-xs text-slate-600">
            Hyper-localized video &amp; WhatsApp broadcasts targeted at dominant swing sub-groups (Mudiraj, Munnuru Kapu, Padmashali) in local dialects.
          </p>
          <div className="text-[11px] font-mono font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
            Yield: ~45 community votes per point
          </div>
        </div>

        {/* Pillar 2: CM Rallies */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Pillar 2: CM &amp; Star Rallies</span>
          </div>
          <p className="text-xs text-slate-600">
            High-spillover public meetings by the Chief Minister and star campaigners scheduled in key mandal centers to consolidate community elders.
          </p>
          <div className="text-[11px] font-mono font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
            Yield: ~65 community votes per point
          </div>
        </div>

        {/* Pillar 3: Targeted Welfare */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Pillar 3: Targeted Welfare Schemes</span>
          </div>
          <p className="text-xs text-slate-600">
            Direct scheme announcements and loan disbursals (BC Bandhu, Weavers loan waiver, Dalit Bandhu, Rythu Bharosa) timed 10 days before polling.
          </p>
          <div className="text-[11px] font-mono font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
            Yield: ~55 community votes per point
          </div>
        </div>
      </div>

      {/* Battleground Action Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>High-Priority Battleground Targets (Sorted by Triage ROI)</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Showing Top 15 Battlegrounds
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {battlegroundList.slice(0, 14).map((b) => {
            const hasPoints = b.seatTotalPoints > 0;
            const isFocused = focusedAc === b.ac_no;
            return (
              <div
                key={b.ac_no}
                className={`p-4 rounded-xl border transition-all ${
                  isFocused
                    ? 'ring-2 ring-indigo-500 shadow-md bg-indigo-50/30 border-indigo-300'
                    : b.isFlippedToWin
                    ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-500/10'
                    : hasPoints
                    ? 'bg-indigo-50/20 border-indigo-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                        #{b.ac_no}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm">{b.ac_name}</h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {b.district}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      2023 Winner: <strong style={{ color: getPartyColor(b.winner_2023) }}>{b.winner_2023}</strong> by {b.margin_2023.toLocaleString()} votes
                    </div>
                  </div>

                  {b.isFlippedToWin ? (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-black flex items-center gap-1 shadow-2xs">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      FLIPPED (+{b.projectedNewMargin.toLocaleString()})
                    </span>
                  ) : b.isTargetWinning ? (
                    <span className="px-2 py-1 bg-sky-100 text-sky-800 border border-sky-300 rounded-lg text-xs font-bold">
                      Defended (+{b.projectedNewMargin.toLocaleString()})
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold">
                      Deficit: -{Math.abs(b.projectedNewMargin).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Target Sub-Group & Strategy Directive */}
                <div className="py-2.5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span>
                      Decisive Target Community: <strong className="text-indigo-700">{b.target_community}</strong> ({b.target_community_pct}% of AC)
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      Total Allocated: {b.seatTotalPoints} pts
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-1 text-[11px]">
                    <div className="text-slate-700">
                      <strong>Messaging Angle:</strong> {b.adFocus}
                    </div>
                    <div className="text-slate-500">
                      <strong>Channel:</strong> {b.recommendedChannel}
                    </div>
                  </div>

                  {/* 3 Point Sliders */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                    {/* Digital */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>Digital Ads:</span>
                        <span className="font-bold font-mono">{b.alloc.digitalPoints}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        step="5"
                        value={b.alloc.digitalPoints}
                        onChange={(e) => handlePointChange(b.ac_no, 'digitalPoints', Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>

                    {/* CM Rally */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>CM Rally:</span>
                        <span className="font-bold font-mono">{b.alloc.rallyPoints}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        step="5"
                        value={b.alloc.rallyPoints}
                        onChange={(e) => handlePointChange(b.ac_no, 'rallyPoints', Number(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                    </div>

                    {/* Welfare */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>Welfare:</span>
                        <span className="font-bold font-mono">{b.alloc.welfarePoints}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        step="5"
                        value={b.alloc.welfarePoints}
                        onChange={(e) => handlePointChange(b.ac_no, 'welfarePoints', Number(e.target.value))}
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer with Dossier Link */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="text-[11px] text-slate-500 font-mono">
                    Projected Swing: <strong className="text-emerald-700">+{b.totalSwing.toLocaleString()}</strong> votes
                  </div>
                  {onOpenDossier && (
                    <button
                      onClick={() => onOpenDossier(b.ac_no)}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold"
                    >
                      Inspect AC Dossier ↗
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )}

  {/* Feature #11: 1-Click Executive Intelligence Briefing Modal */}
  <ExecutiveBriefingModal
    isOpen={isExecutiveModalOpen}
    onClose={() => setIsExecutiveModalOpen(false)}
    data={data}
    targetParty={targetParty}
  />
</div>
);
};
