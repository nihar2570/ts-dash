import React, { useState, useMemo, useEffect } from 'react';
import type { SeeepcDataset, ActiveScenarioBridge, ConstituencyCandidatesData } from '../types';
import { getPartyColor, getPartyBg } from '../types';
import type { WhatIfTab } from './AdvancedSimulationSuite';
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
  Sliders,
  ExternalLink,
  Handshake,
  ShieldCheck,
  ShieldAlert,
  Coins,
  GraduationCap,
} from 'lucide-react';
import { StarCampaignerAllocator, CAMPAIGNER_PROFILES } from './StarCampaignerAllocator';
import { DefectionRebelModeler, type DefectionEvent, PRESET_SCENARIOS } from './DefectionRebelModeler';
import { ExecutiveBriefingModal } from './ExecutiveBriefingModal';

interface ActionsViewProps {
  data: SeeepcDataset;
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

interface ActionAllocation {
  digitalPoints: number; // 0 - 50
  rallyPoints: number;   // 0 - 50
  welfarePoints: number; // 0 - 50
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
    const map = new Map<number, number>();
    const partyCampaigners = CAMPAIGNER_PROFILES.filter((c) => c.party === targetParty);

    Object.values(data.constituencies).forEach((ac) => {
      let totalLiftPct = 0;
      partyCampaigners.forEach((camp) => {
        const days = starAllocations[camp.id]?.[ac.ac_no] || 0;
        if (days > 0) {
          totalLiftPct += Math.min(6.0, days * camp.voteLiftPerDayPct);
        }
      });
      const estimatedTotalVotes = ac.total_votes_2023 || 185000;
      const votes = Math.round((totalLiftPct / 100) * estimatedTotalVotes);
      map.set(ac.ac_no, votes);
    });
    return map;
  }, [data, starAllocations, targetParty]);

  // Compute net defection & rebel shift per AC for targetParty
  const defectionShiftMap = useMemo(() => {
    const map = new Map<number, number>();

    defectionEvents.filter((e) => e.enabled).forEach((evt) => {
      const ac = data.constituencies[evt.acNo];
      if (!ac) return;
      const totalVotes = ac.total_votes_2023 || 180000;
      const transferredVotes = Math.round((evt.cadreTransferPct / 100) * totalVotes);
      const backlashVotes = Math.round((evt.backlashPct / 100) * totalVotes);

      let netShift = 0;
      if (evt.eventType === 'defection') {
        if (evt.toParty === targetParty) {
          netShift = transferredVotes - backlashVotes;
        } else if (evt.fromParty === targetParty) {
          netShift = -(transferredVotes + backlashVotes);
        } else {
          const actualWinner = ac.winner_2023.party;
          if (evt.fromParty === actualWinner) {
            netShift = Math.round(transferredVotes * 0.5);
          }
        }
      } else if (evt.eventType === 'rebel_spoiler') {
        if (evt.fromParty === targetParty) {
          netShift = -transferredVotes;
        } else {
          netShift = transferredVotes;
        }
      }

      map.set(evt.acNo, (map.get(evt.acNo) || 0) + netShift);
    });
    return map;
  }, [data, defectionEvents, targetParty]);

  // Pre-calculate cumulative AC impacts for fast lookup in child tabs
  const cumulativeAcImpacts = useMemo(() => {
    const impacts: Record<number, {
      resourceSwing: number;
      starLift: number;
      defectionShift: number;
      totalCumulativeSwing: number;
      cumulativeProjectedMargin: number;
      isCumulativelyFlipped: boolean;
    }> = {};

    Object.values(data.constituencies).forEach((ac) => {
      const winner = ac.winner_2023.party;
      const margin = ac.margin_2023;
      const isTargetWinning = winner === targetParty;

      let maxPct = 0;
      Object.values(ac.caste_profile).forEach((v) => { if (v > maxPct) maxPct = v; });

      const alloc = allocations[ac.ac_no] || { digitalPoints: 0, rallyPoints: 0, welfarePoints: 0 };
      const digitalSwing = alloc.digitalPoints * digitalYieldPerPoint * (maxPct / 18);
      const rallySwing = alloc.rallyPoints * rallyYieldPerPoint * (maxPct / 18);
      const welfareSwing = alloc.welfarePoints * welfareYieldPerPoint * (maxPct / 18);
      const resourceSwing = Math.round(digitalSwing + rallySwing + welfareSwing);

      const starLift = starLiftMap.get(ac.ac_no) || 0;
      const defectionShift = defectionShiftMap.get(ac.ac_no) || 0;

      const totalCumulativeSwing = resourceSwing + starLift + defectionShift;
      const cumulativeProjectedMargin = isTargetWinning
        ? margin + totalCumulativeSwing
        : -margin + totalCumulativeSwing;
      const isCumulativelyFlipped = !isTargetWinning && cumulativeProjectedMargin > 0;

      impacts[ac.ac_no] = {
        resourceSwing,
        starLift,
        defectionShift,
        totalCumulativeSwing,
        cumulativeProjectedMargin,
        isCumulativelyFlipped,
      };
    });

    return impacts;
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
    const simMap = isScenarioActive && scenarioBridge
      ? new Map(scenarioBridge.simulatedResults.map((r) => [r.ac_no, r]))
      : null;

    const list = Object.values(data.constituencies).map((ac) => {
      const sim = simMap ? simMap.get(ac.ac_no) : null;
      const winner = sim ? sim.simulated.winner_party : ac.winner_2023.party;
      const runner = sim ? sim.simulated.runner_party : ac.runner_up_2023.party;
      const margin = sim ? sim.simulated.margin : ac.margin_2023;

      // Find primary decisive community
      let maxComm = 'kapu';
      let maxPct = 0;
      Object.entries(ac.caste_profile).forEach(([k, v]) => {
        if (v > maxPct) {
          maxPct = v;
          maxComm = k;
        }
      });

      const readableCasteName: Record<string, string> = {
        kapu: 'Kapu / Balija / Telaga',
        kamma: 'Kamma',
        reddy: 'Reddy',
        bc_turpu_kapu: 'BC Turpu Kapu',
        bc_yadava: 'BC Yadava',
        bc_kuruba_boya: 'BC Kuruba / Boya',
        bc_settibalija_goud: 'BC Settibalija / Goud',
        bc_padmashali: 'BC Padmashali',
        bc_other: 'BC Other',
        sc_madiga_relli: 'SC Madiga / Relli',
        sc_mala: 'SC Mala',
        st_tribal: 'ST Tribals',
        minority_muslim: 'Muslim Minorities',
        minority_christian: 'Christian Minorities',
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

      // Cumulative impacts from Star Campaigners + Defections & Rebels
      const starLift = starLiftMap.get(ac.ac_no) || 0;
      const defectionShift = defectionShiftMap.get(ac.ac_no) || 0;
      const totalCumulativeSwing = totalSwing + starLift + defectionShift;
      const cumulativeProjectedMargin = isTargetWinning
        ? margin + totalCumulativeSwing
        : -margin + totalCumulativeSwing;
      const isCumulativelyFlipped = !isTargetWinning && cumulativeProjectedMargin > 0;

      // Messaging directive based on community for Andhra Pradesh
      let adFocus = 'Youth DSC teacher notifications, IT investments in Vizag & Amaravati, and Super Six youth stipend';
      let recommendedChannel = 'WhatsApp broadcast + Instagram Reels regional ads';
      if (maxComm.includes('kapu')) {
        adFocus = 'Kapu welfare corporation funds, Janasena-TDP alliance harmony, and self-respect leadership representation';
        recommendedChannel = 'Pawan Kalyan video messages + community association outreach';
      } else if (maxComm.includes('kamma')) {
        adFocus = 'Amaravati capital acceleration, industrial development, and investor confidence restoration';
        recommendedChannel = 'Business townhall meets + NRI & trade association channels';
      } else if (maxComm.includes('reddy')) {
        adFocus = 'Rayalaseema irrigation canals, Handri-Neeva delivery, and rural agrarian fair-price security';
        recommendedChannel = 'Community leadership rallies + targeted village WhatsApp networks';
      } else if (maxComm.includes('turpu_kapu')) {
        adFocus = 'Uttarandhra backward area package, Sujala Sravanthi canal, and local political representation';
        recommendedChannel = 'Mandal-level public meetings + vernacular digital news portals';
      } else if (maxComm.includes('yadava') || maxComm.includes('kuruba')) {
        adFocus = 'Pastoral community welfare, dairy cattle subsidies, and sheep breeding credit support';
        recommendedChannel = 'Mandal rythu sabhas + weekly shandy rural outreach';
      } else if (maxComm.includes('madiga') || maxComm.includes('mala')) {
        adFocus = 'SC sub-categorization consensus, free power units, and housing land title deeds';
        recommendedChannel = 'Dalit colony outreach + Ambedkar sangham meetings';
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
        starLift,
        defectionShift,
        totalCumulativeSwing,
        cumulativeProjectedMargin,
        isCumulativelyFlipped,
      };
    });

    // Sort by tightest margin
    return list.sort((a, b) => a.margin_2023 - b.margin_2023);
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

Generated via Andhra Pradesh Assembly SEEEPC Strategic Decision Engine.`;
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

      {/* 3-Stage Mandate Progression Card (Visible when simulation scenario is exported to Actions) */}
      {isScenarioActive && scenarioBridge && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-indigo-200 shadow-sm space-y-3.5 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    3-Stage Comprehensive Mandate Pipeline
                  </h3>
                  <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Simulation Active: {scenarioBridge.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Showing return-on-investment: 2023 Actual Mandate ➔ 2028 Simulation Scenario ➔ Field Playbook Compounded Lift
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateToWhatIf?.('coalition')}
                className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Open Simulations tab to modify what-ifs"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Modify What-Ifs</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              {onUnlinkScenario && (
                <button
                  onClick={onUnlinkScenario}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  title="Unlink simulation scenario and restore 2024 actual results baseline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to 2024</span>
                </button>
              )}
            </div>
          </div>

          {/* 3-Stage Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Stage 1: 2024 Actual Mandate */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Stage 1: 2024 Actual</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Historical Base</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-700 font-mono">{targetSeats2023}</span>
                <span className="text-xs text-slate-500 font-medium">seats won ({targetParty})</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Official Election Commission of India 2024 result
              </p>
              {isCoalition && (
                <div className="text-[11px] font-mono text-amber-700 font-bold mt-1.5 pt-1.5 border-t border-slate-200 flex items-center justify-between">
                  <span>NDA 2024 Mandate:</span>
                  <span className="font-black text-amber-900">{coalition2024Seats} seats</span>
                </div>
              )}
            </div>

            {/* Stage 2: Simulation Scenario Base */}
            <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                <span>Stage 2: Simulation Base</span>
                <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-100 px-1.5 py-0.2 rounded">
                  {scenarioBridge.whatIfs.length} What-Ifs
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-indigo-950 font-mono">{cumulativeMetrics.baselineSeats}</span>
                <span className={`text-xs font-bold font-mono ${cumulativeMetrics.baselineSeats - targetSeats2023 >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {cumulativeMetrics.baselineSeats - targetSeats2023 >= 0 ? `+${cumulativeMetrics.baselineSeats - targetSeats2023}` : cumulativeMetrics.baselineSeats - targetSeats2023} vs 2024
                </span>
              </div>
              <p className="text-[11px] text-indigo-800 font-medium line-clamp-1" title={scenarioBridge.name}>
                {scenarioBridge.name}
              </p>
              {isCoalition && (
                <div className="text-[11px] font-mono text-amber-900 font-bold mt-1.5 pt-1.5 border-t border-indigo-200 flex items-center justify-between">
                  <span>NDA Alliance Simulation Base:</span>
                  <span className="font-black text-amber-950">
                    {baselineCoalitionSeats} seats (TDP {scenarioBridge.tally.counts.TDP || 0} + JSP {scenarioBridge.tally.counts.JSP || 0} + BJP {scenarioBridge.tally.counts.BJP || 0})
                  </span>
                </div>
              )}
            </div>

            {/* Stage 3: Field Actions Final */}
            <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-300 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>Stage 3: Compounded Final</span>
                <span className="text-[10px] font-mono text-emerald-800 font-black bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                  Playbook Total
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-950 font-mono">
                  {cumulativeMetrics.cumulativeSeatsWon}
                </span>
                <span className="text-xs text-emerald-700 font-black font-mono">
                  +{cumulativeMetrics.cumulativeFlipsCount} Flips Unlocked
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium">
                {cumulativeMetrics.netCombinedVotes >= 0 ? '+' : ''}{cumulativeMetrics.netCombinedVotes.toLocaleString()} net votes generated from Ground Operations
              </p>
              {isCoalition && (
                <div className="text-[11px] font-mono font-bold mt-1.5 pt-1.5 border-t border-emerald-200 flex items-center justify-between">
                  <span className="text-amber-950">NDA Projected Total:</span>
                  <span className="font-black text-amber-900">
                    {postActionCoalitionSeats} seats
                    {coalitionDiff !== 0 && (
                      <span className={`ml-1 text-[10px] px-1 py-0.2 rounded ${coalitionDiff < 0 ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'}`}>
                        {coalitionDiff < 0 ? `${coalitionDiff}` : `+${coalitionDiff}`}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* NDA Coalition Combined Majority Barometer Banner */}
          {isCoalition && (
            <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-black text-amber-900 flex items-center gap-1.5">
                  <Handshake className="w-4 h-4 text-amber-600" />
                  <span>NDA Alliance Combined Projection:</span>
                </span>
                <span className="text-sm font-black font-mono text-amber-950">
                  {postActionCoalitionSeats} Seats
                </span>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                  coalitionDiff < 0
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {coalitionDiff < 0 ? `${coalitionDiff} seats dropped` : 'Simulation baseline intact'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-mono text-xs">
                <span>Majority Mark: <strong>88 Seats</strong></span>
                <span>•</span>
                <span className={`font-bold ${postActionCoalitionSeats >= 88 ? 'text-emerald-800 font-black' : 'text-rose-800'}`}>
                  {postActionCoalitionSeats >= 88
                    ? `NDA holds +${postActionCoalitionSeats - 88} seat supermajority buffer`
                    : `Dropped below 88-seat majority (-${88 - postActionCoalitionSeats} seats)!`}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Cumulative Campaign Actions Engine Barometer */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-700/60 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-indigo-300">
                  Compounded Action Engine
                </span>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded font-mono font-bold">
                  Strategy for: {targetParty}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white">
                Live Cumulative Impact: Resource Allocator + Star Campaigners + Defections &amp; Rebels
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Target Total Won */}
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-right">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">{targetParty} Projected Won</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-white">{cumulativeMetrics.cumulativeSeatsWon}</span>
                <span className="text-xs text-slate-400 font-mono">/ 175 seats</span>
                <span className={`text-[11px] font-black px-1.5 py-0.2 rounded font-mono ${
                  cumulativeMetrics.cumulativeSeatsWon >= 88 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {cumulativeMetrics.cumulativeSeatsWon >= 88 ? 'MAJORITY' : `${88 - cumulativeMetrics.cumulativeSeatsWon} short`}
                </span>
              </div>
            </div>

            {/* NDA Coalition Combined Box */}
            {isCoalition && (
              <div className="bg-amber-950/70 border border-amber-500/50 px-3 py-1.5 rounded-xl text-right">
                <span className="text-[10px] text-amber-300 block font-bold uppercase tracking-wider">
                  NDA Alliance (Combined)
                </span>
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="text-lg font-black text-amber-200 font-mono">{postActionCoalitionSeats}</span>
                  <span className="text-xs text-amber-400 font-mono">/ 175</span>
                  <span className={`text-[11px] font-black px-1.5 py-0.2 rounded font-mono ${
                    postActionCoalitionSeats >= 88 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {postActionCoalitionSeats >= 88 ? 'MAJORITY' : 'UNDER 88'}
                  </span>
                  {coalitionDiff !== 0 && (
                    <span className={`text-[10px] font-mono font-bold px-1 rounded ${
                      coalitionDiff < 0 ? 'bg-rose-400/20 text-rose-300' : 'bg-emerald-400/20 text-emerald-300'
                    }`}>
                      {coalitionDiff < 0 ? `${coalitionDiff}` : `+${coalitionDiff}`}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4 Pillars Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Pillar 1: Resource Point Allocator */}
          <div className={`p-2.5 rounded-xl border transition-all ${
            cumulativeMetrics.resourceTargetCount > 0
              ? 'bg-indigo-950/40 border-indigo-500/40'
              : 'bg-slate-800/40 border-slate-700/50'
          }`}>
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3 text-indigo-400" /> Resource Allocator
              </span>
              <span className="font-mono text-indigo-300">{cumulativeMetrics.resourceTargetCount} ACs</span>
            </div>
            <div className="text-sm font-black text-indigo-200 font-mono">
              +{cumulativeMetrics.totalResourceVotes.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">votes</span>
            </div>
          </div>

          {/* Pillar 2: Star Campaigners */}
          <div className={`p-2.5 rounded-xl border transition-all ${
            cumulativeMetrics.activeStarCampaignerDays > 0
              ? 'bg-amber-950/40 border-amber-500/40'
              : 'bg-slate-800/40 border-slate-700/50'
          }`}>
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Star Campaigners
              </span>
              <span className="font-mono text-amber-300">{cumulativeMetrics.activeStarCampaignerDays} days</span>
            </div>
            <div className="text-sm font-black text-amber-200 font-mono">
              +{cumulativeMetrics.totalStarVotes.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">votes</span>
            </div>
          </div>

          {/* Pillar 3: Defections & Rebels */}
          <div className={`p-2.5 rounded-xl border transition-all ${
            cumulativeMetrics.activeDefectionsCount > 0
              ? 'bg-rose-950/40 border-rose-500/40'
              : 'bg-slate-800/40 border-slate-700/50'
          }`}>
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" /> Defections &amp; Rebels
              </span>
              <span className="font-mono text-rose-300">{cumulativeMetrics.activeDefectionsCount} events</span>
            </div>
            <div className="text-sm font-black text-rose-200 font-mono">
              {cumulativeMetrics.totalDefectionNetVotes >= 0 ? '+' : ''}
              {cumulativeMetrics.totalDefectionNetVotes.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">votes</span>
            </div>
          </div>

          {/* Consolidated Combined Lift */}
          <div className="p-2.5 rounded-xl border bg-emerald-950/40 border-emerald-500/40">
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
              <span className="flex items-center gap-1 text-emerald-300">
                <TrendingUp className="w-3 h-3 text-emerald-400" /> Net Flips Gained
              </span>
              <span className="font-mono text-emerald-300 font-black">+{cumulativeMetrics.cumulativeFlipsCount} Flips</span>
            </div>
            <div className="text-sm font-black text-emerald-200 font-mono">
              {cumulativeMetrics.netCombinedVotes >= 0 ? '+' : ''}
              {cumulativeMetrics.netCombinedVotes.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">net votes</span>
            </div>
          </div>
        </div>
      </div>

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
              {(['TDP', 'YSRCP', 'JSP', 'BJP'] as const).map((p) => (
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
              All 175
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

                  {/* Cumulative Compounded Outcome if Star or Defection/Rebel active */}
                  {(b.starLift > 0 || b.defectionShift !== 0) && (
                    <div className="flex items-center gap-1">
                      {b.isCumulativelyFlipped ? (
                        <span
                          className="px-2 py-0.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded text-[11px] font-black flex items-center gap-1 shadow-2xs"
                          title={`Compounded Net Swing: +${b.totalCumulativeSwing.toLocaleString()} (Resource: +${b.totalSwing.toLocaleString()}, Star: +${b.starLift.toLocaleString()}, Rebel/Defection: ${b.defectionShift >= 0 ? '+' : ''}${b.defectionShift.toLocaleString()})`}
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          TOTAL FLIP (+{b.cumulativeProjectedMargin.toLocaleString()})
                        </span>
                      ) : b.cumulativeProjectedMargin > 0 ? (
                        <span
                          className="px-2 py-0.5 bg-indigo-100 text-indigo-900 border border-indigo-300 rounded text-[11px] font-bold font-mono"
                          title={`Compounded Total Margin: +${b.cumulativeProjectedMargin.toLocaleString()}`}
                        >
                          Total: +{b.cumulativeProjectedMargin.toLocaleString()}
                        </span>
                      ) : (
                        <span
                          className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded text-[11px] font-bold font-mono"
                          title={`Compounded Total Deficit: ${b.cumulativeProjectedMargin.toLocaleString()}`}
                        >
                          Total: {b.cumulativeProjectedMargin.toLocaleString()}
                        </span>
                      )}
                    </div>
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

                  {/* Candidate Equity & ADR Matchup Box */}
                  {candidatesData && candidatesData[String(b.ac_no)] && (() => {
                    const acCands = candidatesData[String(b.ac_no)].candidates || [];
                    const targetCand = acCands.find((c) => c.party === targetParty) || acCands[0];
                    const oppCand = acCands.find((c) => c.party !== targetParty && !c.is_nota) || acCands[1];

                    if (!targetCand) return null;

                    const tCases = targetCand.myneta?.criminal_cases ?? 0;
                    const oCases = oppCand?.myneta?.criminal_cases ?? 0;
                    const hasLegalEdge = oppCand && tCases < oCases;
                    const hasAssetEdge = oppCand && (targetCand.myneta?.total_assets || 0) > (oppCand.myneta?.total_assets || 0);

                    return (
                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                            <Award className="w-4 h-4 text-amber-500" />
                            <span>Candidate Equity &amp; ADR Matchup ({b.ac_name})</span>
                          </div>
                          {onOpenDossier && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenDossier(b.ac_no);
                              }}
                              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Full Dossier</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          {/* Target Party Candidate */}
                          <div className="p-2.5 rounded-lg border border-indigo-100 bg-indigo-50/40 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-indigo-950 truncate max-w-[160px]" title={targetCand.name}>
                                {targetCand.name}
                              </span>
                              <span
                                className="px-1.5 py-0.2 rounded font-bold text-[10px]"
                                style={{ backgroundColor: getPartyBg(targetCand.party), color: getPartyColor(targetCand.party) }}
                              >
                                {targetCand.party}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600 text-[10px] pt-1 border-t border-indigo-100">
                              <span>Net Worth: <strong className="font-mono text-slate-900">{targetCand.myneta?.net_worth_formatted || 'N/A'}</strong></span>
                              <span className="flex items-center gap-1">
                                {tCases === 0 ? (
                                  <span className="text-emerald-700 font-bold flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> 0 Cases</span>
                                ) : (
                                  <span className="text-rose-700 font-bold flex items-center gap-0.5"><ShieldAlert className="w-3 h-3" /> {tCases} Cases</span>
                                )}
                              </span>
                            </div>
                            {targetCand.myneta?.education && (
                              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                <GraduationCap className="w-3 h-3 text-slate-400" />
                                <span className="truncate">{targetCand.myneta.education}</span>
                              </div>
                            )}
                          </div>

                          {/* Opponent Candidate */}
                          {oppCand ? (
                            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 truncate max-w-[160px]" title={oppCand.name}>
                                  {oppCand.name}
                                </span>
                                <span
                                  className="px-1.5 py-0.2 rounded font-bold text-[10px]"
                                  style={{ backgroundColor: getPartyBg(oppCand.party), color: getPartyColor(oppCand.party) }}
                                >
                                  {oppCand.party}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-slate-600 text-[10px] pt-1 border-t border-slate-200">
                                <span>Net Worth: <strong className="font-mono text-slate-900">{oppCand.myneta?.net_worth_formatted || 'N/A'}</strong></span>
                                <span className="flex items-center gap-1">
                                  {oCases === 0 ? (
                                    <span className="text-emerald-700 font-bold flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> 0 Cases</span>
                                  ) : (
                                    <span className="text-rose-700 font-bold flex items-center gap-0.5"><ShieldAlert className="w-3 h-3" /> {oCases} Cases</span>
                                  )}
                                </span>
                              </div>
                              {oppCand.myneta?.education && (
                                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3 text-slate-400" />
                                  <span className="truncate">{oppCand.myneta.education}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-center flex items-center justify-center text-[11px]">
                              Opponent profile pending Form-20 filing
                            </div>
                          )}
                        </div>

                        {/* Tactical Narrative Directive based on Candidate Matchup */}
                        <div className="flex items-center gap-2 flex-wrap text-[10px] pt-1">
                          {hasLegalEdge && (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Legal Integrity Edge: Clean statutory record vs opponent ({oCases} cases). Hammer anti-corruption narrative in townhalls.
                            </span>
                          )}
                          {!hasLegalEdge && oCases > 5 && (
                            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-bold flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3 text-rose-600" />
                              Opponent Legal Vulnerability: Opponent faces {oCases} pending criminal charges. Distribute Form-26 fact sheets to fence-sitters.
                            </span>
                          )}
                          {hasAssetEdge && (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center gap-1">
                              <Coins className="w-3 h-3 text-amber-600" />
                              Resource Clout: Superior candidate financial base ({targetCand.myneta?.total_assets_formatted} vs {oppCand?.myneta?.total_assets_formatted}).
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}

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

                  {/* Cross-Tab Compounded Impact Panel if Star or Defection models are active on this AC */}
                  {(b.starLift > 0 || b.defectionShift !== 0) && (
                    <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-lg p-3 space-y-2 border border-indigo-900/60 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-indigo-300">
                          <Sparkles className="w-3.5 h-3.5" />
                          Compounded Cross-Pillar Impact (Actions Engine)
                        </span>
                        <span className={`font-mono px-2 py-0.5 rounded text-[11px] font-black ${
                          b.cumulativeProjectedMargin > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          Net Compounded Margin: {b.cumulativeProjectedMargin > 0 ? '+' : ''}{b.cumulativeProjectedMargin.toLocaleString()} votes
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                        <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
                          <span className="text-slate-400 block text-[9px] uppercase">Resource Allocator</span>
                          <span className="font-bold text-indigo-300">+{b.totalSwing.toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
                          <span className="text-slate-400 block text-[9px] uppercase">Star Campaigners</span>
                          <span className="font-bold text-amber-300">+{b.starLift.toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
                          <span className="text-slate-400 block text-[9px] uppercase">Defection / Rebel</span>
                          <span className={`font-bold ${b.defectionShift >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                            {b.defectionShift >= 0 ? '+' : ''}{b.defectionShift.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

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
