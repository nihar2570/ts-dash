import type { DemographicsDataset, ActiveScenarioBridge } from '../types';
import type { ActionAllocation } from '../components/actions/ConstituencyActionList';
import { CAMPAIGNER_PROFILES } from '../components/campaigner/campaignerProfiles';
import type { DefectionEvent } from '../components/DefectionRebelModeler';

export interface BattlegroundItem {
  ac_no: number;
  ac_name: string;
  district: string;
  pc_name?: string;
  winner_2023: string;
  runner_up_2023: string;
  margin_2023: number;
  isTargetWinning: boolean;
  deficit: number;
  target_community: string;
  target_community_pct: number;
  alloc: ActionAllocation;
  seatTotalPoints: number;
  totalSwing: number;
  projectedNewMargin: number;
  isFlippedToWin: boolean;
  isDefended: boolean;
  reservation?: string;
  adFocus: string;
  recommendedChannel: string;
  starLift: number;
  defectionShift: number;
  totalCumulativeSwing: number;
  cumulativeProjectedMargin: number;
  isCumulativelyFlipped: boolean;
}

export function computeStarLiftMap(
  data: DemographicsDataset,
  starAllocations: Record<string, Record<number, number>>,
  targetParty: string
): Map<number, number> {
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
}

export function computeDefectionShiftMap(
  data: DemographicsDataset,
  defectionEvents: DefectionEvent[],
  targetParty: string
): Map<number, number> {
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
}

export interface CumulativeAcImpact {
  resourceSwing: number;
  starLift: number;
  defectionShift: number;
  totalCumulativeSwing: number;
  cumulativeProjectedMargin: number;
  isCumulativelyFlipped: boolean;
}

export function computeCumulativeAcImpacts(
  data: DemographicsDataset,
  allocations: Record<number, ActionAllocation>,
  starLiftMap: Map<number, number>,
  defectionShiftMap: Map<number, number>,
  targetParty: string,
  digitalYieldPerPoint: number,
  rallyYieldPerPoint: number,
  welfareYieldPerPoint: number
): Record<number, CumulativeAcImpact> {
  const impacts: Record<number, CumulativeAcImpact> = {};

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
}

export interface ComputeBattlegroundParams {
  data: DemographicsDataset;
  targetParty: string;
  allocations: Record<number, ActionAllocation>;
  digitalYieldPerPoint: number;
  rallyYieldPerPoint: number;
  welfareYieldPerPoint: number;
  starLiftMap: Map<number, number>;
  defectionShiftMap: Map<number, number>;
  isScenarioActive: boolean;
  scenarioBridge?: ActiveScenarioBridge | null;
}

export function computeBattlegroundList({
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
}: ComputeBattlegroundParams): BattlegroundItem[] {
  const simMap = isScenarioActive && scenarioBridge
    ? new Map(scenarioBridge.simulatedResults.map((r) => [r.ac_no, r]))
    : null;

  const list = Object.values(data.constituencies).map((ac) => {
    const sim = simMap ? simMap.get(ac.ac_no) : null;
    const winner = sim ? sim.simulated.winner_party : ac.winner_2023.party;
    const runner = sim ? sim.simulated.runner_party : ac.runner_up_2023.party;
    const margin = sim ? sim.simulated.margin : ac.margin_2023;

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

    const isTargetWinning = winner === targetParty;
    const deficit = isTargetWinning ? 0 : margin;

    const alloc = allocations[ac.ac_no] || { digitalPoints: 0, rallyPoints: 0, welfarePoints: 0 };
    const seatTotalPoints = alloc.digitalPoints + alloc.rallyPoints + alloc.welfarePoints;

    const digitalSwing = alloc.digitalPoints * digitalYieldPerPoint * (maxPct / 18);
    const rallySwing = alloc.rallyPoints * rallyYieldPerPoint * (maxPct / 18);
    const welfareSwing = alloc.welfarePoints * welfareYieldPerPoint * (maxPct / 18);
    const totalSwing = Math.round(digitalSwing + rallySwing + welfareSwing);

    const projectedNewMargin = isTargetWinning
      ? margin + totalSwing
      : -margin + totalSwing;

    const isFlippedToWin = !isTargetWinning && projectedNewMargin > 0;
    const isDefended = isTargetWinning && projectedNewMargin > 2000;

    const starLift = starLiftMap.get(ac.ac_no) || 0;
    const defectionShift = defectionShiftMap.get(ac.ac_no) || 0;
    const totalCumulativeSwing = totalSwing + starLift + defectionShift;
    const cumulativeProjectedMargin = isTargetWinning
      ? margin + totalCumulativeSwing
      : -margin + totalCumulativeSwing;
    const isCumulativelyFlipped = !isTargetWinning && cumulativeProjectedMargin > 0;

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

  return list.sort((a, b) => a.margin_2023 - b.margin_2023);
}

export function autoAllocateBudget(
  totalPointsBudget: number,
  battlegroundList: BattlegroundItem[],
  digitalYieldPerPoint: number,
  rallyYieldPerPoint: number,
  welfareYieldPerPoint: number
): Record<number, ActionAllocation> {
  if (totalPointsBudget <= 0) return {};

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

  const getEstYieldPerPt = (commPct: number) => {
    const avgYield =
      0.4 * digitalYieldPerPoint + 0.35 * rallyYieldPerPoint + 0.25 * welfareYieldPerPoint;
    return Math.max(10, avgYield * (commPct / 18));
  };

  const tier1Flips = battlegroundList
    .filter((b) => !b.isTargetWinning && b.margin_2023 <= 7000)
    .sort((a, b) => a.margin_2023 - b.margin_2023);

  const tier2Defend = battlegroundList
    .filter((b) => b.isTargetWinning && b.margin_2023 <= 4000)
    .sort((a, b) => a.margin_2023 - b.margin_2023);

  const tier3Flips = battlegroundList
    .filter((b) => !b.isTargetWinning && b.margin_2023 > 7000 && b.margin_2023 <= 15000)
    .sort((a, b) => a.margin_2023 - b.margin_2023);

  const tier4Defend = battlegroundList
    .filter((b) => b.isTargetWinning && b.margin_2023 > 4000 && b.margin_2023 <= 10000)
    .sort((a, b) => a.margin_2023 - b.margin_2023);

  const tier5Flips = battlegroundList
    .filter((b) => !b.isTargetWinning && b.margin_2023 > 15000)
    .sort((a, b) => a.margin_2023 - b.margin_2023);

  // Pass 1: Allocate required points to flip Tier 1 seats
  for (const b of tier1Flips) {
    if (pointsLeft <= 0) break;
    const yieldPerPt = getEstYieldPerPt(b.target_community_pct);
    const targetVotesNeeded = b.margin_2023 + 1200;
    const ptsNeeded = Math.min(65, Math.ceil(targetVotesNeeded / yieldPerPt));
    const ptsToGive = Math.min(pointsLeft, ptsNeeded);
    addPointsToSeat(b.ac_no, ptsToGive);
    pointsLeft -= ptsToGive;
  }

  // Pass 2: Allocate points to defend vulnerable won seats
  for (const b of tier2Defend) {
    if (pointsLeft <= 0) break;
    const ptsNeeded = Math.min(40, Math.ceil(3500 / getEstYieldPerPt(b.target_community_pct)));
    const ptsToGive = Math.min(pointsLeft, ptsNeeded);
    addPointsToSeat(b.ac_no, ptsToGive);
    pointsLeft -= ptsToGive;
  }

  // Pass 3: Allocate points to flip Tier 3 seats
  for (const b of tier3Flips) {
    if (pointsLeft <= 0) break;
    const yieldPerPt = getEstYieldPerPt(b.target_community_pct);
    const targetVotesNeeded = b.margin_2023 + 1500;
    const ptsNeeded = Math.min(80, Math.ceil(targetVotesNeeded / yieldPerPt));
    const ptsToGive = Math.min(pointsLeft, ptsNeeded);
    addPointsToSeat(b.ac_no, ptsToGive);
    pointsLeft -= ptsToGive;
  }

  // Pass 4: Allocate points to defend moderate won seats
  for (const b of tier4Defend) {
    if (pointsLeft <= 0) break;
    const ptsNeeded = Math.min(30, Math.ceil(3000 / getEstYieldPerPt(b.target_community_pct)));
    const ptsToGive = Math.min(pointsLeft, ptsNeeded);
    addPointsToSeat(b.ac_no, ptsToGive);
    pointsLeft -= ptsToGive;
  }

  // Pass 5: Allocate points to Reach Flips
  for (const b of tier5Flips) {
    if (pointsLeft <= 0) break;
    const ptsNeeded = Math.min(60, Math.ceil(5000 / getEstYieldPerPt(b.target_community_pct)));
    const ptsToGive = Math.min(pointsLeft, ptsNeeded);
    addPointsToSeat(b.ac_no, ptsToGive);
    pointsLeft -= ptsToGive;
  }

  // Pass 6: Distribute any remaining points
  if (pointsLeft > 0) {
    const prioritySeats = [...tier1Flips, ...tier2Defend, ...tier3Flips];
    const seatsToTopUp = prioritySeats.length > 0 ? prioritySeats : battlegroundList.slice(0, 30);
    const topUpPerSeat = Math.max(1, Math.floor(pointsLeft / seatsToTopUp.length));
    for (const b of seatsToTopUp) {
      if (pointsLeft <= 0) break;
      const ptsToGive = Math.min(pointsLeft, topUpPerSeat);
      addPointsToSeat(b.ac_no, ptsToGive);
      pointsLeft -= ptsToGive;
    }
    if (pointsLeft > 0 && seatsToTopUp.length > 0) {
      addPointsToSeat(seatsToTopUp[0].ac_no, pointsLeft);
    }
  }

  return newAlloc;
}

export function generateStrategicPlanMemo(
  battlegroundList: BattlegroundItem[],
  targetParty: string,
  totalAllocated: number,
  totalPointsBudget: number,
  flippedCount: number,
  digitalYieldPerPoint: number,
  rallyYieldPerPoint: number,
  welfareYieldPerPoint: number
): string {
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

Generated via Andhra Pradesh Assembly Strategic Decision Engine.`;
}

