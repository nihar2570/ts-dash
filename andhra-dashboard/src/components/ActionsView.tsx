import React, { useState, useMemo, useEffect } from 'react';
import type { DemographicsDataset, ActiveScenarioBridge, ConstituencyCandidatesData } from '../types';
import type { WhatIfTab } from './AdvancedSimulationSuite';
import {
  Target,
  Sparkles,
  TrendingUp,
  FileText,
  Star,
  AlertTriangle,
  Sliders,
  ShieldAlert,
} from 'lucide-react';
import { StarCampaignerAllocator } from './StarCampaignerAllocator';
import { DefectionRebelModeler, type DefectionEvent, PRESET_SCENARIOS } from './DefectionRebelModeler';
import { ExecutiveBriefingModal } from './ExecutiveBriefingModal';
import { PlaybookPipelineSummaryCard } from './actions/PlaybookPipelineSummaryCard';
import { StrategicPlanMemoModal } from './actions/StrategicPlanMemoModal';
import { ResourceAllocationBarometer } from './actions/ResourceAllocationBarometer';
import { FloatingSideNav, type NavSection } from './common/FloatingSideNav';
import {
  ConstituencyActionList,
  type ActionAllocation,
} from './actions/ConstituencyActionList';
import {
  computeStarLiftMap,
  computeDefectionShiftMap,
  computeCumulativeAcImpacts,
  computeBattlegroundList,
  autoAllocateBudget as calculateSmartAllocations,
  generateStrategicPlanMemo,
} from '../services/actionEngine';

interface ActionsViewProps {
  data: DemographicsDataset;
  initialSelectedAc?: number | null;
  onOpenDossier?: (acNo: number) => void;
  scenarioBridge?: ActiveScenarioBridge | null;
  onUnlinkScenario?: () => void;
  onNavigateToWhatIf?: (category: WhatIfTab) => void;
  onActionsTallyChange?: (tally: {
    TDP: number;
    YSRCP: number;
    JSP: number;
    BJP: number;
    INC: number;
    coalitionCombined: number;
    flipsCount: number;
  }) => void;
  candidatesData?: Record<string, ConstituencyCandidatesData> | null;
}

export const ActionsView: React.FC<ActionsViewProps> = ({
  data,
  initialSelectedAc,
  onOpenDossier,
  scenarioBridge,
  onUnlinkScenario,
  onNavigateToWhatIf,
  onActionsTallyChange,
  candidatesData,
}) => {
  const isScenarioActive = Boolean(scenarioBridge && scenarioBridge.isExportedToActions);
  const isCoalition = scenarioBridge?.id === 'nda_2024_sweep' || true; // NDA alliance is the governing coalition
  // Default to TDP across Andhra Pradesh War Room
  const [targetParty, setTargetParty] = useState<'TDP' | 'YSRCP' | 'JSP' | 'BJP'>('TDP');
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
    // Seed default allocations for close Andhra battleground seats
    const topBattlegrounds = [25, 37, 71, 79, 81, 91, 166, 174];
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

  // Star Campaigners Allocations store (shared across Playbook tabs)
  const [starAllocations, setStarAllocations] = useState<Record<string, Record<number, number>>>({});

  // Defection & Rebel Events store (shared across Playbook tabs)
  const [defectionEvents, setDefectionEvents] = useState<DefectionEvent[]>(() =>
    PRESET_SCENARIOS.map((s, idx) => ({ ...s, id: `preset_${idx + 1}` }))
  );

  // Compute star lift per AC for targetParty
  const starLiftMap = useMemo(() => {
    return computeStarLiftMap(data, starAllocations, targetParty);
  }, [data, starAllocations, targetParty]);

  // Compute net defection & rebel shift per AC for targetParty
  const defectionShiftMap = useMemo(() => {
    return computeDefectionShiftMap(data, defectionEvents, targetParty);
  }, [data, defectionEvents, targetParty]);

  // Pre-calculate cumulative AC impacts for fast lookup in child tabs
  const cumulativeAcImpacts = useMemo(() => {
    return computeCumulativeAcImpacts(
      data,
      allocations,
      starLiftMap,
      defectionShiftMap,
      targetParty,
      digitalYieldPerPoint,
      rallyYieldPerPoint,
      welfareYieldPerPoint
    );
  }, [data, allocations, starLiftMap, defectionShiftMap, targetParty, digitalYieldPerPoint, rallyYieldPerPoint, welfareYieldPerPoint]);

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
    return computeBattlegroundList({
      data,
      targetParty,
      allocations,
      digitalYieldPerPoint,
      rallyYieldPerPoint,
      welfareYieldPerPoint,
      starLiftMap,
      defectionShiftMap,
      isScenarioActive,
      scenarioBridge,
    });
  }, [
    data,
    targetParty,
    allocations,
    digitalYieldPerPoint,
    rallyYieldPerPoint,
    welfareYieldPerPoint,
    starLiftMap,
    defectionShiftMap,
    isScenarioActive,
    scenarioBridge,
  ]);

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
    const newAlloc = calculateSmartAllocations(
      totalPointsBudget,
      battlegroundList,
      digitalYieldPerPoint,
      rallyYieldPerPoint,
      welfareYieldPerPoint
    );
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

  // Overall Cumulative Playbook Metrics across all 3 pillars
  const cumulativeMetrics = useMemo(() => {
    let baselineSeats = 0;
    let cumulativeSeatsWon = 0;
    let cumulativeFlipsCount = 0;
    let resourceTargetCount = 0;
    let totalResourceVotes = 0;
    let totalStarVotes = 0;
    let totalDefectionNetVotes = 0;

    battlegroundList.forEach((b) => {
      if (b.isTargetWinning) baselineSeats++;
      if (b.cumulativeProjectedMargin > 0) cumulativeSeatsWon++;
      if (b.isCumulativelyFlipped) cumulativeFlipsCount++;
      if (b.seatTotalPoints > 0) {
        resourceTargetCount++;
        totalResourceVotes += b.totalSwing;
      }
      totalStarVotes += b.starLift;
      totalDefectionNetVotes += b.defectionShift;
    });

    let activeStarCampaignerDays = 0;
    const starAcSet = new Set<number>();
    Object.values(starAllocations).forEach((acMap) => {
      Object.entries(acMap).forEach(([acNo, days]) => {
        if (days > 0) {
          activeStarCampaignerDays += days;
          starAcSet.add(Number(acNo));
        }
      });
    });
    const starConstituenciesCount = starAcSet.size;
    const activeDefectionsCount = defectionEvents.filter((e) => e.enabled).length;
    const netCombinedVotes = totalResourceVotes + totalStarVotes + totalDefectionNetVotes;

    return {
      baselineSeats,
      cumulativeSeatsWon,
      cumulativeFlipsCount,
      resourceTargetCount,
      totalResourceVotes,
      totalStarVotes,
      totalDefectionNetVotes,
      netCombinedVotes,
      activeStarCampaignerDays,
      starConstituenciesCount,
      activeDefectionsCount,
    };
  }, [battlegroundList, starAllocations, defectionEvents]);

  // 2023 Historical Baseline for Target Party
  const targetSeats2023 = useMemo(() => {
    return Object.values(data.constituencies).filter(
      (c) => c.winner_2023.party === targetParty
    ).length;
  }, [data, targetParty]);

  // Post-Actions Statewide Seat Tally across all parties (Andhra Pradesh 175 ACs)
  const postActionTally = useMemo(() => {
    let tdpSeats = 0;
    let ysrcpSeats = 0;
    let jspSeats = 0;
    let bjpSeats = 0;
    let incSeats = 0;
    let othSeats = 0;

    battlegroundList.forEach((b) => {
      if (b.cumulativeProjectedMargin > 0) {
        if (targetParty === 'TDP') tdpSeats++;
        else if (targetParty === 'YSRCP') ysrcpSeats++;
        else if (targetParty === 'JSP') jspSeats++;
        else if (targetParty === 'BJP') bjpSeats++;
      } else {
        const originalWinner = b.winner_2023;
        if (originalWinner === targetParty) {
          const runner = b.runner_up_2023;
          if (runner === 'TDP') tdpSeats++;
          else if (runner === 'YSRCP') ysrcpSeats++;
          else if (runner === 'JSP') jspSeats++;
          else if (runner === 'BJP') bjpSeats++;
          else if (runner === 'INC') incSeats++;
          else othSeats++;
        } else {
          if (originalWinner === 'TDP') tdpSeats++;
          else if (originalWinner === 'YSRCP') ysrcpSeats++;
          else if (originalWinner === 'JSP') jspSeats++;
          else if (originalWinner === 'BJP') bjpSeats++;
          else if (originalWinner === 'INC') incSeats++;
          else othSeats++;
        }
      }
    });

    const coalitionCombined = tdpSeats + jspSeats + bjpSeats;

    return {
      TDP: tdpSeats,
      YSRCP: ysrcpSeats,
      JSP: jspSeats,
      BJP: bjpSeats,
      INC: incSeats,
      OTH: othSeats,
      coalitionCombined,
    };
  }, [battlegroundList, targetParty]);

  const baselineCoalitionSeats = useMemo(() => {
    if (!scenarioBridge) return 164;
    return (
      (scenarioBridge.tally.counts.TDP || 0) +
      (scenarioBridge.tally.counts.JSP || 0) +
      (scenarioBridge.tally.counts.BJP || 0)
    );
  }, [scenarioBridge]);

  const postActionCoalitionSeats = postActionTally.coalitionCombined;
  const coalitionDiff = postActionCoalitionSeats - baselineCoalitionSeats;

  // 2024 Actual Combined Seats for NDA (TDP 135 + JSP 21 + BJP 8 = 164)
  const coalition2024Seats = useMemo(() => {
    let count = 0;
    Object.values(data.constituencies).forEach((c) => {
      if (c.winner_2023.party === 'TDP' || c.winner_2023.party === 'JSP' || c.winner_2023.party === 'BJP') count++;
    });
    return count;
  }, [data]);

  // Sync post-action tally with parent bridge/ribbon
  useEffect(() => {
    if (onActionsTallyChange) {
      onActionsTallyChange({
        TDP: postActionTally.TDP,
        YSRCP: postActionTally.YSRCP,
        JSP: postActionTally.JSP,
        BJP: postActionTally.BJP,
        INC: postActionTally.INC,
        coalitionCombined: postActionTally.coalitionCombined,
        flipsCount: cumulativeMetrics.cumulativeFlipsCount,
      });
    }
  }, [postActionTally, cumulativeMetrics.cumulativeFlipsCount, onActionsTallyChange]);

  // Generated Plan Memo content
  const generatedPlanMemo = useMemo(() => {
    return generateStrategicPlanMemo(
      battlegroundList,
      targetParty,
      totalAllocated,
      totalPointsBudget,
      flippedCount,
      digitalYieldPerPoint,
      rallyYieldPerPoint,
      welfareYieldPerPoint
    );
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
    link.download = `Andhra_Pradesh_Strategic_Campaign_Plan_${targetParty}_${new Date().toISOString().slice(0, 10)}.txt`;
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

  // Dynamic Side Navigation sections tailored to the active sub-tab
  const navSections: NavSection[] = useMemo(() => {
    if (actionSubTab === 'defections') {
      return [
        {
          id: 'act-modules',
          label: 'Playbook Sub-Modules',
          shortLabel: 'Modules',
          icon: <Sliders className="w-4 h-4" />,
        },
        {
          id: 'act-barometer',
          label: 'Live Cumulative Action Barometer',
          shortLabel: 'Barometer',
          icon: <TrendingUp className="w-4 h-4" />,
        },
        {
          id: 'defection-scorecard',
          label: 'Defection Engine & Scorecard',
          shortLabel: 'Scorecard',
          icon: <AlertTriangle className="w-4 h-4" />,
        },
        {
          id: 'defection-registry',
          label: 'Active Defection & Rebel Registry',
          shortLabel: 'Registry',
          icon: <ShieldAlert className="w-4 h-4" />,
        },
      ];
    }
    if (actionSubTab === 'star_campaigners') {
      return [
        {
          id: 'act-modules',
          label: 'Playbook Sub-Modules',
          shortLabel: 'Modules',
          icon: <Sliders className="w-4 h-4" />,
        },
        {
          id: 'act-barometer',
          label: 'Live Cumulative Action Barometer',
          shortLabel: 'Barometer',
          icon: <TrendingUp className="w-4 h-4" />,
        },
        {
          id: 'star-campaigners',
          label: 'Star Campaigner Squads & Quotas',
          shortLabel: 'Stars',
          icon: <Star className="w-4 h-4" />,
        },
        {
          id: 'star-targets',
          label: 'Constituency Tour Schedule',
          shortLabel: 'Schedule',
          icon: <Target className="w-4 h-4" />,
        },
      ];
    }
    return [
      {
        id: 'act-modules',
        label: 'Playbook Sub-Modules',
        shortLabel: 'Modules',
        icon: <Sliders className="w-4 h-4" />,
      },
      {
        id: 'act-barometer',
        label: 'Live Cumulative Action Barometer',
        shortLabel: 'Barometer',
        icon: <TrendingUp className="w-4 h-4" />,
      },
      {
        id: 'act-operations',
        label: 'Tactical Resource Allocator',
        shortLabel: 'Allocator',
        icon: <Sparkles className="w-4 h-4" />,
      },
      {
        id: 'act-targets',
        label: '175-AC Battleground Priorities',
        shortLabel: 'Targets',
        icon: <Target className="w-4 h-4" />,
      },
    ];
  }, [actionSubTab]);

  return (
    <div className="space-y-6 relative">
      {/* Floating Vertical Section Navigation */}
      <FloatingSideNav sections={navSections} />

      {/* Top Playbook Sub-Navigation & Feature #11 Executive Briefing Trigger */}
      <div id="act-modules" className="scroll-mt-24 flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
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

      {/* 3-Stage Mandate Progression Card & Live Playbook Pipeline Summary */}
      <PlaybookPipelineSummaryCard
        isScenarioActive={isScenarioActive}
        scenarioBridge={scenarioBridge}
        onNavigateToWhatIf={onNavigateToWhatIf}
        onUnlinkScenario={onUnlinkScenario}
        targetSeats2023={targetSeats2023}
        targetParty={targetParty}
        coalition2024Seats={coalition2024Seats}
        cumulativeMetrics={cumulativeMetrics}
        isCoalition={isCoalition}
        postActionCoalitionSeats={postActionCoalitionSeats}
        coalitionDiff={coalitionDiff}
      />

      {actionSubTab === 'star_campaigners' && (
        <StarCampaignerAllocator
          data={data}
          onOpenDossier={onOpenDossier}
          allocations={starAllocations}
          onAllocationsChange={setStarAllocations}
          cumulativeAcImpacts={cumulativeAcImpacts}
        />
      )}

      {actionSubTab === 'defections' && (
        <DefectionRebelModeler
          data={data}
          onOpenDossier={onOpenDossier}
          events={defectionEvents}
          onEventsChange={setDefectionEvents}
          cumulativeAcImpacts={cumulativeAcImpacts}
        />
      )}

      {actionSubTab === 'tactical' && (
        <div className="space-y-6">
          <div id="act-operations" className="scroll-mt-24">
            <ResourceAllocationBarometer
              targetParty={targetParty}
              setTargetParty={setTargetParty}
              autoAllocateBudget={autoAllocateBudget}
              resetAllocations={resetAllocations}
              totalAllocated={totalAllocated}
              totalPointsBudget={totalPointsBudget}
              setTotalPointsBudget={setTotalPointsBudget}
              remainingPoints={remainingPoints}
              flipsCount={flippedCount}
              totalVotesGained={cumulativeMetrics.totalResourceVotes}
              isScenarioActive={isScenarioActive}
              scenarioBridge={scenarioBridge}
              onUnlinkScenario={onUnlinkScenario}
              onNavigateToWhatIf={onNavigateToWhatIf}
              digitalYieldPerPoint={digitalYieldPerPoint}
              setDigitalYieldPerPoint={setDigitalYieldPerPoint}
              rallyYieldPerPoint={rallyYieldPerPoint}
              setRallyYieldPerPoint={setRallyYieldPerPoint}
              welfareYieldPerPoint={welfareYieldPerPoint}
              setWelfareYieldPerPoint={setWelfareYieldPerPoint}
            />
          </div>

          <div id="act-targets" className="scroll-mt-24">
            <ConstituencyActionList
              filteredBattlegrounds={filteredBattlegrounds}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              battlegroundMarginThreshold={battlegroundMarginThreshold}
              setBattlegroundMarginThreshold={setBattlegroundMarginThreshold}
              filterType={filterType}
              setFilterType={setFilterType}
              expandedAcNo={expandedAcNo}
              setExpandedAcNo={setExpandedAcNo}
              handlePointChange={handlePointChange}
              digitalYieldPerPoint={digitalYieldPerPoint}
              rallyYieldPerPoint={rallyYieldPerPoint}
              welfareYieldPerPoint={welfareYieldPerPoint}
              remainingPoints={remainingPoints}
              targetParty={targetParty}
              candidatesData={candidatesData}
              onOpenDossier={onOpenDossier}
            />
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
  <StrategicPlanMemoModal
    isOpen={isPlanModalOpen}
    onClose={() => setIsPlanModalOpen(false)}
    targetParty={targetParty}
    totalAllocated={totalAllocated}
    totalPointsBudget={totalPointsBudget}
    flippedCount={flippedCount}
    planMemo={generatedPlanMemo}
    onCopyPlan={handleCopyPlan}
    onDownloadPlan={handleDownloadPlan}
    copiedMemo={copiedMemo}
  />
</div>
);
};
