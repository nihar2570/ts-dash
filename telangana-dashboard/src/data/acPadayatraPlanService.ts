// AC-Wide 30/60/90 Day Padayatra Campaign Itinerary & Strategic Route Generator
// Balances sequential door-to-door physical walking with booth-level electoral prioritization

import { CONSTITUENCY_MANDALS, type MandalDetail } from './mandalData';
import { CONSTITUENCY_TOPICS } from './constituencyTopics';

export type CampaignDuration = 30 | 60 | 90;

export interface SessionItinerary {
  sessionType: 'Morning (7:00 AM – 10:30 AM)' | 'Evening (4:30 PM – 7:30 PM)';
  boothNo: number;
  boothName: string;
  mandalName: string;
  locality: string;
  triage: 'battleground' | 'vulnerable' | 'fortress' | 'hostile';
  visitIteration: 1 | 2 | 3;
  targetDoors: number;
  targetVoters: number;
  targetDemographic: string;
  walkingStrategy: string;
  tacticalDirective: string;
}

export interface DayItinerary {
  dayNumber: number;
  phase: 'Phase 1: Broad Ground Connect' | 'Phase 2: Battleground Deep Dive' | 'Phase 3: Final Mobilization Blitz';
  phaseName: string;
  mandalName: string;
  villageOrSector: string;
  dayTheme: string;
  sessions: [SessionItinerary, SessionItinerary];
  totalDayDoors: number;
  totalDayVoters: number;
  keyTalkingPoint: string;
}

export interface AcPadayatraPlan {
  acNo: number;
  acName: string;
  durationDays: CampaignDuration;
  targetParty: string;
  strategySummary: {
    totalDays: number;
    totalBoothSessions: number;
    uniqueBoothsVisited: number;
    totalBoothsInAc: number;
    boothsVisitedOnce: number;
    boothsVisitedTwice: number;
    boothsVisitedThrice: number;
    strongholdsSkippedOrDelegated: number;
    hostileBoothsAvoided: number;
    battlegroundCoveragePct: number;
    totalDoorsKnocked: number;
    totalVotersContacted: number;
    rationale: string;
  };
  days: DayItinerary[];
  mandalBreakdown: Array<{
    mandalName: string;
    totalBooths: number;
    scheduledSessions: number;
    uniqueBoothsCovered: number;
    battlegroundsCovered: number;
  }>;
}

interface BoothCatalogItem {
  boothNo: number;
  name: string;
  mandalName: string;
  locality: string;
  electorate: number;
  triage: 'battleground' | 'vulnerable' | 'fortress' | 'hostile';
  margin: number;
  dominantCaste: string;
}

/**
 * Builds the deterministic catalog of all polling stations for an AC
 */
export function buildAcBoothCatalog(acNo: number, targetParty = 'INC'): BoothCatalogItem[] {
  const mandals: MandalDetail[] = CONSTITUENCY_MANDALS[acNo] || [];
  const catalog: BoothCatalogItem[] = [];
  let currentBoothNo = 1;

  mandals.forEach((m) => {
    const boothCount = m.booths || 20;
    const avgElectorate = Math.round((m.electorate || 16000) / Math.max(1, boothCount));
    const isTargetLeadMandal = m.lead_party === targetParty;

    for (let i = 1; i <= boothCount; i++) {
      // Deterministic pseudo-random seed per booth
      const seed = acNo * 1000 + currentBoothNo;
      const rand1 = Math.abs(Math.sin(seed * 1.33));
      const rand2 = Math.abs(Math.sin(seed * 3.71));

      let triage: 'battleground' | 'vulnerable' | 'fortress' | 'hostile' = 'battleground';
      let margin = 0;

      if (isTargetLeadMandal) {
        if (rand1 < 0.38) {
          triage = 'fortress';
          margin = Math.round(110 + rand2 * 180);
        } else if (rand1 < 0.72) {
          triage = 'battleground';
          margin = Math.round((rand2 - 0.5) * 70);
        } else {
          triage = 'vulnerable';
          margin = Math.round(25 + rand2 * 60);
        }
      } else {
        if (rand1 < 0.35) {
          triage = 'hostile';
          margin = -Math.round(120 + rand2 * 190);
        } else if (rand1 < 0.75) {
          triage = 'battleground';
          margin = Math.round((rand2 - 0.5) * 80);
        } else {
          triage = 'vulnerable';
          margin = -Math.round(20 + rand2 * 65);
        }
      }

      const localitySuffix = i % 2 === 1 ? 'East Wing / Main Colony' : 'West Wing / Grama Panchayat';

      catalog.push({
        boothNo: currentBoothNo,
        name: `Polling Station #${currentBoothNo} - ${m.name} MPPS (${localitySuffix})`,
        mandalName: m.name,
        locality: `${m.name} - ${i % 3 === 0 ? 'BC Colony' : i % 3 === 1 ? 'Bazar Street' : 'Grama Basti'}`,
        electorate: avgElectorate,
        triage,
        margin,
        dominantCaste: m.dominant_caste || 'BC General',
      });

      currentBoothNo++;
    }
  });

  return catalog;
}

/**
 * Plans a 30 / 60 / 90 Day AC-Wide Padayatra Itinerary
 * - Inside each booth, MLA walks consecutively door-to-door (doors 1-1 to 1-60).
 * - Booth visit frequency is calibrated by strategic triage & campaign length.
 */
export function generateAcPadayatraPlan(
  acNo: number,
  acName: string,
  durationDays: CampaignDuration = 60,
  targetParty = 'INC'
): AcPadayatraPlan {
  const catalog = buildAcBoothCatalog(acNo, targetParty);
  const totalBoothsInAc = catalog.length;

  const topicData = CONSTITUENCY_TOPICS[acNo];
  const primaryConcern = topicData?.primary_concern || 'Local infrastructure & civic amenities';
  const primaryIssue = topicData?.key_issues?.[0];

  // Group booths by triage
  const battlegrounds = catalog.filter((b) => b.triage === 'battleground');
  const vulnerables = catalog.filter((b) => b.triage === 'vulnerable');
  const fortresses = catalog.filter((b) => b.triage === 'fortress');
  const hostiles = catalog.filter((b) => b.triage === 'hostile');

  const mandals: MandalDetail[] = CONSTITUENCY_MANDALS[acNo] || [];

  // Determine booth selection and repetition based on campaign duration
  // Each day has 2 sessions (Morning and Evening) = durationDays * 2 sessions total
  const totalSessionsNeeded = durationDays * 2;

  let selectedBoothVisits: Array<{
    booth: BoothCatalogItem;
    iteration: 1 | 2 | 3;
    phase: DayItinerary['phase'];
  }> = [];

  let rationale = '';
  let skippedFortresses = 0;
  let avoidedHostiles = 0;

  if (durationDays === 30) {
    // 30 DAYS: BATTLEGROUND BLITZ (60 sessions)
    // Avoid fortresses (leave to local cadre) & avoid deep hostile booths
    // Focus 100% on Battlegrounds (visited 2x) and Vulnerable seats (visited 1x)
    rationale =
      '30-Day Battleground Blitz: The MLA strictly avoids comfortable fortresses (delegated to local corporators) and hopeless hostile strongholds. Every crucial battleground is saturated with 2 visits (initial connect + closing surge).';

    skippedFortresses = fortresses.length;
    avoidedHostiles = hostiles.length;

    // Phase 1 (Days 1–18): First pass over Battlegrounds & Vulnerables
    const phase1Booths = [...battlegrounds, ...vulnerables];
    // Take as many as can fit (e.g. 36 sessions)
    const p1Count = Math.min(36, phase1Booths.length);
    for (let i = 0; i < p1Count; i++) {
      selectedBoothVisits.push({
        booth: phase1Booths[i % phase1Booths.length],
        iteration: 1,
        phase: 'Phase 1: Broad Ground Connect',
      });
    }

    // Phase 2 (Days 19–30): Deep-dive re-visits to top battlegrounds (24 sessions)
    const p2Count = totalSessionsNeeded - selectedBoothVisits.length;
    for (let i = 0; i < p2Count; i++) {
      selectedBoothVisits.push({
        booth: battlegrounds[i % Math.max(1, battlegrounds.length)],
        iteration: 2,
        phase: 'Phase 2: Battleground Deep Dive',
      });
    }
  } else if (durationDays === 60) {
    // 60 DAYS: BALANCED SATURATION (120 sessions)
    // Covers Battlegrounds (2-3x), Vulnerable (1-2x), Moderate Fortresses (1x)
    // Skips deep hostile dead-ends
    rationale =
      '60-Day Balanced Saturation: Comprehensive coverage of all winnable territory. Key battlegrounds are visited 2 to 3 times, fortress strongholds are touched once to energize party cadre, and unwinnable hostile pockets are bypassed.';

    avoidedHostiles = Math.round(hostiles.length * 0.75);

    // Phase 1 (Days 1–35): 70 sessions covering Battlegrounds (round 1), Vulnerables (round 1), Fortresses (round 1)
    const p1Pool = [...battlegrounds, ...vulnerables, ...fortresses];
    const p1Target = 70;
    for (let i = 0; i < p1Target; i++) {
      selectedBoothVisits.push({
        booth: p1Pool[i % p1Pool.length],
        iteration: 1,
        phase: 'Phase 1: Broad Ground Connect',
      });
    }

    // Phase 2 (Days 36–50): 30 sessions re-visiting Battlegrounds (round 2)
    const p2Target = 30;
    for (let i = 0; i < p2Target; i++) {
      selectedBoothVisits.push({
        booth: battlegrounds[i % Math.max(1, battlegrounds.length)],
        iteration: 2,
        phase: 'Phase 2: Battleground Deep Dive',
      });
    }

    // Phase 3 (Days 51–60): 20 sessions final mobilization blitz
    const p3Target = totalSessionsNeeded - selectedBoothVisits.length;
    for (let i = 0; i < p3Target; i++) {
      selectedBoothVisits.push({
        booth: battlegrounds[i % Math.max(1, battlegrounds.length)],
        iteration: 3,
        phase: 'Phase 3: Final Mobilization Blitz',
      });
    }
  } else {
    // 90 DAYS: FULL CONSTITUENCY FOOTPRINT (180 sessions)
    // Saturation of all booths in the AC (even hostile once to show courage)
    // Battlegrounds visited 3 times
    rationale =
      '90-Day Full Footprint: Complete constituency saturation. Every polling station in the AC is walked door-to-door at least once. Critical battleground colonies are saturated 3 times across the 3 strategic phases.';

    // Phase 1 (Days 1–45): 90 sessions covering every booth in AC
    const p1Pool = catalog;
    for (let i = 0; i < 90; i++) {
      selectedBoothVisits.push({
        booth: p1Pool[i % p1Pool.length],
        iteration: 1,
        phase: 'Phase 1: Broad Ground Connect',
      });
    }

    // Phase 2 (Days 46–72): 54 sessions re-visiting Battlegrounds & Vulnerables
    const p2Pool = [...battlegrounds, ...vulnerables];
    for (let i = 0; i < 54; i++) {
      selectedBoothVisits.push({
        booth: p2Pool[i % p2Pool.length],
        iteration: 2,
        phase: 'Phase 2: Battleground Deep Dive',
      });
    }

    // Phase 3 (Days 73–90): 36 sessions final closing blitz on top battlegrounds
    const p3Target = totalSessionsNeeded - selectedBoothVisits.length;
    for (let i = 0; i < p3Target; i++) {
      selectedBoothVisits.push({
        booth: battlegrounds[i % Math.max(1, battlegrounds.length)],
        iteration: 3,
        phase: 'Phase 3: Final Mobilization Blitz',
      });
    }
  }

  // Sort visits within each phase geographically by Mandal so the MLA walks contiguous areas
  const phaseOrder: Record<DayItinerary['phase'], number> = {
    'Phase 1: Broad Ground Connect': 1,
    'Phase 2: Battleground Deep Dive': 2,
    'Phase 3: Final Mobilization Blitz': 3,
  };

  selectedBoothVisits.sort((a, b) => {
    if (phaseOrder[a.phase] !== phaseOrder[b.phase]) {
      return phaseOrder[a.phase] - phaseOrder[b.phase];
    }
    // Same phase: sort by mandal name so days stay geographically clustered
    if (a.booth.mandalName !== b.booth.mandalName) {
      return a.booth.mandalName.localeCompare(b.booth.mandalName);
    }
    return a.booth.boothNo - b.booth.boothNo;
  });

  // Assemble Day-by-Day Itineraries (2 sessions per day)
  const days: DayItinerary[] = [];
  const boothVisitCounts = new Map<number, number>();

  const themePool = [
    'BC Artisan & Traditional Livelihoods Outreach',
    'Youth & Employment Aspirations Round',
    'Women SHG & Mahalakshmi Saturation',
    'Farmers & Irrigation Canal Tail-End Grievances',
    'Urban Colony Civic Infrastructure Walk',
    'Dalit & Minority Basti Rights Assurance',
    'Senior Citizens & Health Pension Verification',
    'Local Small Traders & Vyapari Connect',
  ];

  for (let d = 0; d < durationDays; d++) {
    const sessionIndex1 = d * 2;
    const sessionIndex2 = d * 2 + 1;

    const item1 = selectedBoothVisits[sessionIndex1 % selectedBoothVisits.length];
    const item2 = selectedBoothVisits[sessionIndex2 % selectedBoothVisits.length];

    const currentMandal = item1.booth.mandalName;
    const dayTheme = themePool[d % themePool.length];

    // Track visit iteration
    const v1Count = (boothVisitCounts.get(item1.booth.boothNo) || 0) + 1;
    boothVisitCounts.set(item1.booth.boothNo, v1Count);

    const v2Count = (boothVisitCounts.get(item2.booth.boothNo) || 0) + 1;
    boothVisitCounts.set(item2.booth.boothNo, v2Count);

    const morningDoors = Math.round(50 + (d % 3) * 5); // 50-60 consecutive doors
    const eveningDoors = Math.round(55 + ((d + 1) % 3) * 5); // 55-65 consecutive doors

    const morningVoters = morningDoors * 4;
    const eveningVoters = eveningDoors * 4;

    const morningSession: SessionItinerary = {
      sessionType: 'Morning (7:00 AM – 10:30 AM)',
      boothNo: item1.booth.boothNo,
      boothName: item1.booth.name,
      mandalName: item1.booth.mandalName,
      locality: item1.booth.locality,
      triage: item1.booth.triage,
      visitIteration: Math.min(3, v1Count) as 1 | 2 | 3,
      targetDoors: morningDoors,
      targetVoters: morningVoters,
      targetDemographic: `${item1.booth.dominantCaste} Households & Women Voters`,
      walkingStrategy: `Consecutive Street Walk: Door #1-1 to Door #1-${morningDoors}. No skipping adjacent doors.`,
      tacticalDirective:
        v1Count === 1
          ? `Initial ground listening tour. Distribute candidate guarantee card and note civic grievances.`
          : v1Count === 2
          ? `Reinforcement visit. Meet local community elders and address booth margin deficit of ${Math.abs(item1.booth.margin)} votes.`
          : `Final GOTV mobilization. Verify Panna Pramukh voter slip distribution.`,
    };

    const eveningSession: SessionItinerary = {
      sessionType: 'Evening (4:30 PM – 7:30 PM)',
      boothNo: item2.booth.boothNo,
      boothName: item2.booth.name,
      mandalName: item2.booth.mandalName,
      locality: item2.booth.locality,
      triage: item2.booth.triage,
      visitIteration: Math.min(3, v2Count) as 1 | 2 | 3,
      targetDoors: eveningDoors,
      targetVoters: eveningVoters,
      targetDemographic: `Youth (18–25) & Senior Pensioners (${item2.booth.dominantCaste})`,
      walkingStrategy: `Consecutive Street Walk: Door #1-1 to Door #1-${eveningDoors} along main bazaar lane.`,
      tacticalDirective:
        v2Count === 1
          ? `Door-to-door personal outreach followed by 15-min corner choupal address.`
          : `Closing battleground consolidation. Reassure welfare guarantees and counter opponent claims.`,
    };

    days.push({
      dayNumber: d + 1,
      phase: item1.phase,
      phaseName: item1.phase,
      mandalName: currentMandal,
      villageOrSector: `${item1.booth.locality} & ${item2.booth.locality}`,
      dayTheme,
      sessions: [morningSession, eveningSession],
      totalDayDoors: morningDoors + eveningDoors,
      totalDayVoters: morningVoters + eveningVoters,
      keyTalkingPoint: primaryIssue
        ? `${primaryIssue.title}: Pledging resolution of ${primaryConcern.toLowerCase()} in ${currentMandal}.`
        : `Personal door-to-door commitment to 24x7 water and community welfare in ${currentMandal}.`,
    });
  }

  // Calculate unique coverage
  const uniqueBoothsSet = new Set(selectedBoothVisits.map((v) => v.booth.boothNo));
  let onceCount = 0;
  let twiceCount = 0;
  let thriceCount = 0;

  boothVisitCounts.forEach((count) => {
    if (count === 1) onceCount++;
    else if (count === 2) twiceCount++;
    else if (count >= 3) thriceCount++;
  });

  const coveredBattlegroundsCount = battlegrounds.filter((b) => uniqueBoothsSet.has(b.boothNo)).length;
  const battlegroundCoveragePct =
    battlegrounds.length > 0 ? Math.round((coveredBattlegroundsCount / battlegrounds.length) * 100) : 100;

  const totalDoorsKnocked = days.reduce((sum, d) => sum + d.totalDayDoors, 0);
  const totalVotersContacted = days.reduce((sum, d) => sum + d.totalDayVoters, 0);

  // Mandal breakdown
  const mandalBreakdown = mandals.map((m) => {
    const scheduled = selectedBoothVisits.filter((v) => v.booth.mandalName === m.name).length;
    const uniqueCovered = new Set(
      selectedBoothVisits.filter((v) => v.booth.mandalName === m.name).map((v) => v.booth.boothNo)
    ).size;
    const bgInMandal = battlegrounds.filter((b) => b.mandalName === m.name && uniqueBoothsSet.has(b.boothNo)).length;

    return {
      mandalName: m.name,
      totalBooths: m.booths || 20,
      scheduledSessions: scheduled,
      uniqueBoothsCovered: uniqueCovered,
      battlegroundsCovered: bgInMandal,
    };
  });

  return {
    acNo,
    acName,
    durationDays,
    targetParty,
    strategySummary: {
      totalDays: durationDays,
      totalBoothSessions: totalSessionsNeeded,
      uniqueBoothsVisited: uniqueBoothsSet.size,
      totalBoothsInAc,
      boothsVisitedOnce: onceCount,
      boothsVisitedTwice: twiceCount,
      boothsVisitedThrice: thriceCount,
      strongholdsSkippedOrDelegated: skippedFortresses,
      hostileBoothsAvoided: avoidedHostiles,
      battlegroundCoveragePct,
      totalDoorsKnocked,
      totalVotersContacted,
      rationale,
    },
    days,
    mandalBreakdown,
  };
}

