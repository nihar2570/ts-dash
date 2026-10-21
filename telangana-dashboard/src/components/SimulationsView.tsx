import React, { useState, useMemo, useEffect } from 'react';
import type {
  SeeepcDataset,
  SimulatedConstituencyResult,
  ActiveScenarioBridge,
  ScenarioWhatIfItem,
} from '../types';
import { getPartyColor } from '../types';
import {
  Sparkles,
  RotateCcw,
  Sliders,
  ChevronRight,
  Target,
  Flame,
  Search,
  CheckCircle,
  TrendingUp,
  Handshake,
  ArrowRight,
} from 'lucide-react';
import { SwingStudioModal } from './SwingStudioModal';
import type { MacroSwing, PartySwing } from './SwingStudioModal';
import { AdvancedSimulationSuite, URBAN_AC_NOS } from './AdvancedSimulationSuite';
import type { TurnoutSettings, WhatIfTab } from './AdvancedSimulationSuite';
import {
  DEFAULT_COALITION_SETTINGS,
  DEFAULT_MLA_FATIGUE_SETTINGS,
  DEFAULT_GROUND_CRISIS_SETTINGS,
  AIMIM_NORTH_EXPANSION_AC_NOS,
  LAGACHERLA_ZONE_AC_NOS,
} from './StrategicSimulationModels';
import type {
  CoalitionSettings,
  MlaFatigueSettings,
  GroundCrisisSettings,
} from './StrategicSimulationModels';

// 44 Constituencies Contested by BJP in BJP+TRS Coalition (Urban GHMC, Ranga Reddy, North TS core, Kamareddy)
export const BJP_ALLIANCE_SEATS = new Set([
  // Hyderabad District Core (9 seats)
  57, 59, 60, 61, 62, 64, 65, 70, 71, // Musheerabad, Amberpet, Khairatabad, Jubilee Hills, Sanathnagar, Karwan, Goshamahal, Secunderabad, Cantt
  // Medchal & Ranga Reddy Urban Belt (11 seats)
  43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, // Quthbullapur, Malkajgiri, Medchal, Kukatpally, Uppal, LB Nagar, Maheshwaram, Rajendranagar, Serilingampally, Chevella, Shadnagar
  // North Telangana Core (16 seats)
  1, 5, 6, 7, 8, 9, 10, // Sirpur, Asifabad, Khanapur, Adilabad, Boath, Nirmal, Mudhole
  16, 17, 18, 19, 20, 21, // Kamareddy, Nizamabad Urban, Nizamabad Rural, Armur, Bodhan, Balkonda
  23, 24, 26, 31, // Koratla, Jagtial, Karimnagar, Huzurabad
  // South & Central Strongholds (8 seats)
  74, 77, 82, 85, 93, 106, 107, 112 // Mahabubnagar, Makthal, Kalwakurthy, Kollapur, Munugode, Warangal West, Warangal East, Khammam
]);

// 14 North Telangana Constituencies targeted by Kavitha's Telangana Jagruthi outfit
export const KAVITHA_SPOILER_SEATS = new Set([
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29
]);

export const READABLE_COMMUNITY_NAMES: Record<string, string> = {
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
  youth_18_25: 'Youth (18-25)',
  age_26_40: 'Working Age (26-40)',
  age_41_60: 'Middle Age (41-60)',
  age_60_plus: 'Seniors (60+)',
};

interface SimulationsViewProps {
  data: SeeepcDataset;
  onNavigateToActions: (acNo?: number) => void;
  onSelectConstituencyDossier?: (acNo: number) => void;
  onBridgeChange?: (bridge: ActiveScenarioBridge) => void;
  requestedWhatIfTab?: WhatIfTab;
  onExportToActions?: () => void;
}

export const SimulationsView: React.FC<SimulationsViewProps> = ({
  data,
  onNavigateToActions,
  onSelectConstituencyDossier,
  onBridgeChange,
  requestedWhatIfTab,
  onExportToActions,
}) => {
  // Demographic swing offsets relative to 2023 baseline (defaults to 2028 BRS-BJP Coalition)
  const [swings, setSwings] = useState<Record<string, PartySwing>>({
    sc_madiga: { INC: -6, BRS: 4, BJP: 2 },
    sc_mala: { INC: 6, BRS: -4, BJP: -2 },
    st_lambada: { INC: 0, BRS: 0, BJP: 0 },
    st_koya_gond: { INC: 0, BRS: 0, BJP: 0 },
    bc_mudiraj: { INC: -8, BRS: 5, BJP: 3 },
    bc_munnuru_kapu: { INC: -7, BRS: 4, BJP: 3 },
    bc_padmashali: { INC: -5, BRS: 3, BJP: 2 },
    bc_goud: { INC: 0, BRS: 0, BJP: 0 },
    bc_yadav: { INC: 0, BRS: 0, BJP: 0 },
    bc_other: { INC: 0, BRS: 0, BJP: 0 },
    minority_muslim: { INC: 10, BRS: -10, BJP: 0 },
    oc_reddy: { INC: 4, BRS: -2, BJP: -2 },
    oc_velama: { INC: -8, BRS: 6, BJP: 2 },
    oc_other: { INC: 0, BRS: 0, BJP: 0 },
    youth_18_25: { INC: 0, BRS: 0, BJP: 0 },
    age_26_40: { INC: 0, BRS: 0, BJP: 0 },
    age_41_60: { INC: 0, BRS: 0, BJP: 0 },
    age_60_plus: { INC: 0, BRS: 0, BJP: 0 },
  });

  const [macroSwing, setMacroSwing] = useState<MacroSwing>({ INC: -3.0, BRS: 1.5, BJP: 1.5 });
  const [turnoutSettings, setTurnoutSettings] = useState<TurnoutSettings>({
    urbanShift: 2,
    ruralShift: 0,
    femaleShift: 0,
  });
  const [coalitionSettings, setCoalitionSettings] = useState<CoalitionSettings>(DEFAULT_COALITION_SETTINGS);
  const [mlaFatigueSettings, setMlaFatigueSettings] = useState<MlaFatigueSettings>(DEFAULT_MLA_FATIGUE_SETTINGS);
  const [groundCrisisSettings, setGroundCrisisSettings] = useState<GroundCrisisSettings>(DEFAULT_GROUND_CRISIS_SETTINGS);
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>('bjp_trs_alliance');
  const [selectedBubbleAc, setSelectedBubbleAc] = useState<number | null>(null);
  const [tierFilter, setTierFilter] = useState<'ALL' | 'TOSS_UP' | 'FLIPS'>('TOSS_UP');
  const [tossUpThreshold, setTossUpThreshold] = useState<number>(5000);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Count actively customized communities
  const activeCustomizedCount = useMemo(() => {
    let count = 0;
    Object.values(swings).forEach((s) => {
      if (s.INC !== 0 || s.BRS !== 0 || s.BJP !== 0) count++;
    });
    return count;
  }, [swings]);

  // Handle Preset Scenarios
  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    const reset: Record<string, PartySwing> = {
      sc_madiga: { INC: 0, BRS: 0, BJP: 0 },
      sc_mala: { INC: 0, BRS: 0, BJP: 0 },
      st_lambada: { INC: 0, BRS: 0, BJP: 0 },
      st_koya_gond: { INC: 0, BRS: 0, BJP: 0 },
      bc_mudiraj: { INC: 0, BRS: 0, BJP: 0 },
      bc_munnuru_kapu: { INC: 0, BRS: 0, BJP: 0 },
      bc_padmashali: { INC: 0, BRS: 0, BJP: 0 },
      bc_goud: { INC: 0, BRS: 0, BJP: 0 },
      bc_yadav: { INC: 0, BRS: 0, BJP: 0 },
      bc_other: { INC: 0, BRS: 0, BJP: 0 },
      minority_muslim: { INC: 0, BRS: 0, BJP: 0 },
      oc_reddy: { INC: 0, BRS: 0, BJP: 0 },
      oc_velama: { INC: 0, BRS: 0, BJP: 0 },
      oc_other: { INC: 0, BRS: 0, BJP: 0 },
      youth_18_25: { INC: 0, BRS: 0, BJP: 0 },
      age_26_40: { INC: 0, BRS: 0, BJP: 0 },
      age_41_60: { INC: 0, BRS: 0, BJP: 0 },
      age_60_plus: { INC: 0, BRS: 0, BJP: 0 },
    };

    if (presetKey === 'trs_2018_landslide') {
      // 2018/2019 TRS Landslide Mandate (88 Seats, 46.9% Vote Share)
      // 1. Rythu Bandhu & 24x7 Free Agriculture Power: Agrarian wave across rural Telangana
      // 2. Prajakootami Backfire: TDP alliance triggered Telangana regional self-respect against Andhra control
      // 3. BC Welfare Consolidation: Mudiraj, Munnuru Kapu, Yadav (sheep distribution), Goud, Padmashali
      // 4. Welfare Architecture: Aasara pensions + Kalyana Lakshmi/Shaadi Mubarak + KCR Kit
      // 5. Muslim minority strategic alignment with TRS (via AIMIM friendship)
      reset.bc_mudiraj = { INC: -7, BRS: 8, BJP: -1 };
      reset.bc_munnuru_kapu = { INC: -6, BRS: 7, BJP: -1 };
      reset.bc_yadav = { INC: -6, BRS: 8, BJP: -2 };
      reset.bc_goud = { INC: -5, BRS: 6, BJP: -1 };
      reset.bc_padmashali = { INC: -5, BRS: 6, BJP: -1 };
      reset.oc_velama = { INC: -7, BRS: 9, BJP: -2 };
      reset.minority_muslim = { INC: -6, BRS: 7, BJP: -1 };
      reset.age_60_plus = { INC: -5, BRS: 6, BJP: -1 };
      reset.sc_madiga = { INC: -4, BRS: 5, BJP: -1 };

      // Statewide Macro Swing: BRS surges by +9.5% (reproducing 46.9% statewide vote share),
      // INC drops by -8.5%, BJP drops by -3.5%
      setMacroSwing({ INC: -8.5, BRS: 9.5, BJP: -3.5 });
      setTurnoutSettings({ urbanShift: 0, ruralShift: 4, femaleShift: 3 });
    } else if (presetKey === 'trs_2014_mandate') {
      // 2014 Telangana Inaugural Assembly Election (TRS 63 Seats, 34.0% Vote Share)
      // 1. Statehood Agitation Wave: Sweeps North Telangana (Karimnagar, Medak, Nizamabad, Warangal)
      // 2. Congress Bifurcation Backlash: Crushed to 21 seats (25.2% vote share)
      // 3. TDP-BJP Alliance Surge: Dominates GHMC / Ranga Reddy urban corridor (TDP 15 + BJP 5 seats)
      // 4. Student & Youth Agitation Movement: Youth 18-25 consolidates behind TRS (+7%)
      reset.youth_18_25 = { INC: -6, BRS: 7, BJP: -1 };
      reset.oc_velama = { INC: -8, BRS: 9, BJP: -1 };
      reset.bc_munnuru_kapu = { INC: -5, BRS: 6, BJP: -1 };
      reset.bc_mudiraj = { INC: -5, BRS: 6, BJP: -1 };
      reset.oc_reddy = { INC: 4, BRS: -3, BJP: -1 };
      reset.minority_muslim = { INC: -3, BRS: 4, BJP: -1 };

      // Statewide Macro Swing:
      // INC drops by -15.0%, BRS at -4.5%, BJP at -6.5%
      setMacroSwing({ INC: -15.0, BRS: -4.5, BJP: -6.5 });
      setTurnoutSettings({ urbanShift: 3, ruralShift: 0, femaleShift: 0 });
    } else if (presetKey === 'bjp_trs_alliance') {
      // BJP-TRS Pre-Poll Coalition (74 BRS : 45 BJP Seat-Sharing Formula)
      // 1. Seat Sharing Architecture:
      //    - BJP contests 45 seats: Greater Hyderabad/GHMC, Ranga Reddy urban IT belt, North TS urban/semi-urban cores (Kamareddy, Nizamabad, Karimnagar, Adilabad), Mahabubnagar.
      //    - BRS contests 74 seats: Rural Medak, Warangal, Nalgonda, Khammam, and North TS rural belts.
      // 2. Cadre Transfer Friction Matrix:
      //    - When BRS contests: 65% BJP vote transfers to BRS, 25% hardcore anti-KCR voters rebel to Congress, 10% sit out.
      //    - When BJP contests: 75% BRS vote transfers to BJP, 15% rebel to Congress, 10% sit out.
      // 3. Demographic & Caste Fracture:
      //    - Muslim Minority Revolt: BRS loses -10% Muslim vote entirely to Congress & AIMIM.
      //    - SC Madiga (MRPS) Surge: +6% to Coalition on Modi sub-categorization commitment.
      //    - SC Mala Consolidation: +6% to Congress.
      //    - BC Mudiraj & Munnuru Kapu Surge: +8% Coalition consolidation.
      //    - Velama leadership loyalty: +8% to Coalition.
      reset.minority_muslim = { INC: 10, BRS: -10, BJP: 0 };
      reset.sc_madiga = { INC: -6, BRS: 4, BJP: 2 };
      reset.sc_mala = { INC: 6, BRS: -4, BJP: -2 };
      reset.bc_mudiraj = { INC: -8, BRS: 5, BJP: 3 };
      reset.bc_munnuru_kapu = { INC: -7, BRS: 4, BJP: 3 };
      reset.bc_padmashali = { INC: -5, BRS: 3, BJP: 2 };
      reset.oc_reddy = { INC: 4, BRS: -2, BJP: -2 };
      reset.oc_velama = { INC: -8, BRS: 6, BJP: 2 };

      // Statewide Macro Swing: Ruling Congress sheds -3.0% anti-incumbency
      setMacroSwing({ INC: -3.0, BRS: 1.5, BJP: 1.5 });
      setTurnoutSettings({ urbanShift: 2, ruralShift: 0, femaleShift: 0 });
    } else if (presetKey === 'bjp_trs_merger') {
      // 1. Full Merger: BRS Merges into BJP (KTR CM Face / Harish Union Cabinet)
      // Unified Lotus symbol on all 119 ballots; 88% BRS cadre merges, 12% old agitation cadre defect to INC.
      reset.minority_muslim = { INC: 15, BRS: 0, BJP: -15 };
      reset.sc_madiga = { INC: -8, BRS: 0, BJP: 8 };
      reset.sc_mala = { INC: 8, BRS: 0, BJP: -8 };
      reset.bc_mudiraj = { INC: -10, BRS: 0, BJP: 10 };
      reset.bc_munnuru_kapu = { INC: -9, BRS: 0, BJP: 9 };
      reset.youth_18_25 = { INC: -7, BRS: 0, BJP: 7 };
      reset.oc_velama = { INC: -10, BRS: 0, BJP: 10 };
      reset.oc_reddy = { INC: 6, BRS: 0, BJP: -6 };

      // Statewide Macro: Ruling Congress sheds -4.0% anti-incumbency
      setMacroSwing({ INC: -4.0, BRS: 0, BJP: 4.0 });
      setTurnoutSettings({ urbanShift: 4, ruralShift: 0, femaleShift: 0 });
    } else if (presetKey === 'triangular_2028_anti_inc') {
      // 2. 2028 3-Way Independent Contest: Sharp Anti-Incumbency against Ruling Congress
      // Congress sheds -7.0% vote due to farm loan & TSPSC controversy; BRS gains +3.2%, BJP gains +3.8%
      reset.youth_18_25 = { INC: -8, BRS: 3, BJP: 5 };
      reset.bc_mudiraj = { INC: -6, BRS: 3, BJP: 3 };
      reset.bc_munnuru_kapu = { INC: -6, BRS: 2, BJP: 4 };
      reset.sc_madiga = { INC: -5, BRS: 1, BJP: 4 };
      reset.minority_muslim = { INC: 4, BRS: -2, BJP: -2 };
      reset.oc_reddy = { INC: 3, BRS: -2, BJP: -1 };

      setMacroSwing({ INC: -7.0, BRS: 3.2, BJP: 3.8 });
      setTurnoutSettings({ urbanShift: 2, ruralShift: 0, femaleShift: 0 });
    } else if (presetKey === 'kavitha_spoiler_front') {
      // 3. Kavitha's Jagruthi Front: North TS Spoiler Effect
      // Slices 4.2% traditional BRS votes in 14 Nizamabad, Jagtial, and Karimnagar constituencies
      reset.bc_goud = { INC: 2, BRS: -4, BJP: 2 };
      reset.bc_padmashali = { INC: 1, BRS: -3, BJP: 2 };
      setMacroSwing({ INC: 0, BRS: -1.0, BJP: 1.0 });
      setTurnoutSettings({ urbanShift: 0, ruralShift: 0, femaleShift: 0 });
    } else if (presetKey === 'mahalakshmi_wave') {
      // Welfare momentum
      reset.bc_padmashali = { INC: 6, BRS: -5, BJP: -1 };
      reset.st_lambada = { INC: 5, BRS: -4, BJP: -1 };
      reset.sc_mala = { INC: 4, BRS: -3, BJP: -1 };
      reset.minority_muslim = { INC: 4, BRS: -4, BJP: 0 };
      setMacroSwing({ INC: 3, BRS: -2.5, BJP: -0.5 });
      setTurnoutSettings({ urbanShift: 0, ruralShift: 0, femaleShift: 0 });
    } else if (presetKey === 'baseline') {
      setMacroSwing({ INC: 0, BRS: 0, BJP: 0 });
      setTurnoutSettings({ urbanShift: 0, ruralShift: 0, femaleShift: 0 });
      setCoalitionSettings(DEFAULT_COALITION_SETTINGS);
      setMlaFatigueSettings(DEFAULT_MLA_FATIGUE_SETTINGS);
      setGroundCrisisSettings(DEFAULT_GROUND_CRISIS_SETTINGS);
    }

    setSwings(reset);
  };

  // Run Simulation across all 119 Constituencies
  const simulatedResults: SimulatedConstituencyResult[] = useMemo(() => {
    const list: SimulatedConstituencyResult[] = [];

    Object.values(data.constituencies).forEach((ac) => {
      const actualWinner = ac.winner_2023.party;
      const actualRunner = ac.runner_up_2023.party;
      const totalVotes = ac.total_votes_2023;

      // Base vote calculation using 2023 Form-20 votes as anchor
      // For each major party, use actual votes if winner/runner, else a fallback share.
      // When the actual winner/runner is a non-major party (e.g. CPI, AIFB),
      // track their votes separately as "Others" so the simulation respects the real baseline.
      const majorParties = ['INC', 'BRS', 'BJP', 'AIMIM'];
      const winnerIsMajor = majorParties.includes(actualWinner);
      const runnerIsMajor = majorParties.includes(actualRunner);

      // Determine non-major parties (e.g. CPI, AIFB) if winner or runner-up is not in INC/BRS/BJP/AIMIM
      const partyPairs: [string, number][] = [];

      if (!winnerIsMajor) {
        partyPairs.push([actualWinner, ac.winner_2023.votes]);
      }
      if (!runnerIsMajor) {
        partyPairs.push([actualRunner, ac.runner_up_2023.votes]);
      }

      // If winner or runner-up was a non-major party, scale down the default fallback estimates
      const nonMajorVotes = (!winnerIsMajor ? ac.winner_2023.votes : 0) + (!runnerIsMajor ? ac.runner_up_2023.votes : 0);
      const remainingShare = Math.max(0.05, 1 - (nonMajorVotes / totalVotes));
      const fallbackInc = totalVotes * 0.25 * remainingShare;
      const fallbackBrs = totalVotes * 0.28 * remainingShare;
      const fallbackBjp = totalVotes * 0.12 * remainingShare;

      let incVotes = actualWinner === 'INC' ? ac.winner_2023.votes : actualRunner === 'INC' ? ac.runner_up_2023.votes : fallbackInc;
      let brsVotes = actualWinner === 'BRS' ? ac.winner_2023.votes : actualRunner === 'BRS' ? ac.runner_up_2023.votes : fallbackBrs;
      let bjpVotes = actualWinner === 'BJP' ? ac.winner_2023.votes : actualRunner === 'BJP' ? ac.runner_up_2023.votes : fallbackBjp;
      let aimimVotes = actualWinner === 'AIMIM' ? ac.winner_2023.votes : actualRunner === 'AIMIM' ? ac.runner_up_2023.votes : (ac.ac_no >= 58 && ac.ac_no <= 70 ? totalVotes * 0.40 : 0);

      // Feature #3: Voter Turnout & Mobilization Modeler (Urban vs Rural Differential)
      const isUrban = URBAN_AC_NOS.has(ac.ac_no);
      const turnoutDiffPct = isUrban ? turnoutSettings.urbanShift : turnoutSettings.ruralShift;
      if (turnoutDiffPct !== 0) {
        const turnoutMultiplier = 1 + turnoutDiffPct / 100;
        incVotes *= turnoutMultiplier;
        brsVotes *= turnoutMultiplier;
        bjpVotes *= turnoutMultiplier;
        aimimVotes *= turnoutMultiplier;
      }

      // Feature #3: Mahalakshmi Female Voter Welfare Mobilization
      if (turnoutSettings.femaleShift !== 0) {
        const femaleVoteShift = totalVotes * (turnoutSettings.femaleShift * 0.005);
        incVotes += femaleVoteShift;
        brsVotes -= femaleVoteShift * 0.6;
        bjpVotes -= femaleVoteShift * 0.4;
      }

      // Historical 2014 Mandate Calibration: TDP-BJP Urban Alliance & Settler Vote Realignment
      // In 2014, the TDP-BJP alliance won 20 seats (TDP 15 + BJP 5) in Greater Hyderabad & Ranga Reddy.
      // Since TDP and YSRCP are not standalone contenders in today's baseline, their 2014 urban anti-TRS bloc
      // is absorbed by the NDA/BJP urban partner. Without this realignment, naive extrapolation defaults those
      // 15 urban seats to BRS as 2023 runner-up, erroneously inflating BRS to 71+ seats instead of its actual 63.
      if (activePreset === 'trs_2014_mandate' && isUrban) {
        const tdpAllianceUrbanShift = totalVotes * 0.25;
        bjpVotes += tdpAllianceUrbanShift;
        brsVotes -= tdpAllianceUrbanShift * 0.55;
        incVotes -= tdpAllianceUrbanShift * 0.45;
      }

      // Apply community-weighted demographic swings from SEEEPC
      const cp = ac.caste_profile;
      const ap = ac.age_profile;

      // Calculate net vote shifts from Demographics
      Object.entries(swings).forEach(([commKey, swingObj]) => {
        let weightPct = 0;
        if (commKey in cp) {
          weightPct = cp[commKey as keyof typeof cp] || 0;
        } else if (commKey in ap) {
          weightPct = ap[commKey as keyof typeof ap] || 0;
        }

        if (weightPct > 0) {
          const communityVoters = totalVotes * (weightPct / 100);
          const incShift = communityVoters * (swingObj.INC / 100);
          const brsShift = communityVoters * (swingObj.BRS / 100);
          const bjpShift = communityVoters * (swingObj.BJP / 100);

          incVotes += incShift;
          brsVotes += brsShift;
          bjpVotes += bjpShift;
        }
      });

      // Apply Statewide Uniform Macro Swing
      const macroIncShift = totalVotes * (macroSwing.INC / 100);
      const macroBrsShift = totalVotes * (macroSwing.BRS / 100);
      const macroBjpShift = totalVotes * (macroSwing.BJP / 100);

      incVotes += macroIncShift;
      brsVotes += macroBrsShift;
      bjpVotes += macroBjpShift;

      // Feature #5A: BJP + TRS Full Merger (KTR CM Face / Harish Union Cabinet)
      if (activePreset === 'bjp_trs_merger') {
        const brsPool = Math.max(0, brsVotes);
        bjpVotes += brsPool * 0.88;
        incVotes += brsPool * 0.12; // 12% old agitation cadre defect to INC
        brsVotes = 0; // Merged under Lotus symbol
      }

      // Feature #5B: BJP + TRS Pre-Poll Coalition Seat-Sharing & Dynamic Transfer Matrix Realignment
      if (activePreset === 'bjp_trs_alliance') {
        const isBjpContested = BJP_ALLIANCE_SEATS.has(ac.ac_no);
        if (isBjpContested) {
          // BJP is candidate. BRS transfers: dynamic transfer %, rebel leakage to INC
          const brsPool = Math.max(0, brsVotes);
          const transferRatio = coalitionSettings.brsToBjpTransferPct / 100;
          const leakRatio = coalitionSettings.rebelLeakagePct / 100;
          bjpVotes += brsPool * transferRatio;
          incVotes += brsPool * leakRatio;
          brsVotes = 0; // BRS candidate stands down
        } else {
          // BRS is candidate. BJP transfers: dynamic transfer %, rebel leakage to INC
          const bjpPool = Math.max(0, bjpVotes);
          const transferRatio = coalitionSettings.bjpToBrsTransferPct / 100;
          const leakRatio = coalitionSettings.rebelLeakagePct / 100;
          brsVotes += bjpPool * transferRatio;
          incVotes += bjpPool * leakRatio;
          bjpVotes = 0; // BJP candidate stands down
        }
      }

      // Feature #5C: Kavitha Jagruthi Splinter (North TS Spoiler Effect in 14 ACs)
      if (activePreset === 'kavitha_spoiler_front' && KAVITHA_SPOILER_SEATS.has(ac.ac_no)) {
        const spoilerCut = totalVotes * 0.042;
        brsVotes = Math.max(0, brsVotes - spoilerCut);
        incVotes = Math.max(0, incVotes - (totalVotes * 0.005));
      }



      // --------------------------------------------------------------------
      // FEATURE 3: Candidate Fatigue & Incumbent MLA Replacement Simulator
      // --------------------------------------------------------------------
      // Simulates ticket distribution strategy: dropping anti-incumbent sitting MLAs vs retaining them
      const isTargetWinner = actualWinner === mlaFatigueSettings.targetParty;
      if (isTargetWinner) {
        const isNarrowWin = ac.margin_2023 < 8000;
        const isUnpopular = isNarrowWin || ac.margin_pct_2023 < 5.0;

        if (mlaFatigueSettings.replaceIncumbentPct > 0) {
          // Fraction of seats where incumbent is dropped for a fresh face
          const replacementChance = mlaFatigueSettings.replaceIncumbentPct / 50; // up to 1.0
          if (isUnpopular && ((ac.ac_no * 7 + 13) % 100) / 100 <= replacementChance) {
            // Fresh face nominated: removes anti-incumbency and grants vitality boost
            const boost = totalVotes * (mlaFatigueSettings.freshFaceBoost / 100);
            if (actualWinner === 'INC') {
              incVotes += boost;
              brsVotes -= boost * 0.6;
              bjpVotes -= boost * 0.4;
            } else if (actualWinner === 'BRS') {
              brsVotes += boost;
              incVotes -= boost * 0.6;
              bjpVotes -= boost * 0.4;
            } else if (actualWinner === 'BJP') {
              bjpVotes += boost;
              incVotes -= boost * 0.5;
              brsVotes -= boost * 0.5;
            }
          } else {
            // Incumbent retained with local voter fatigue penalty
            const penalty = totalVotes * (Math.abs(mlaFatigueSettings.unpopularMlaPenalty) / 100);
            if (actualWinner === 'INC') {
              incVotes -= penalty;
              brsVotes += penalty * 0.6;
              bjpVotes += penalty * 0.4;
            } else if (actualWinner === 'BRS') {
              brsVotes -= penalty;
              incVotes += penalty * 0.6;
              bjpVotes += penalty * 0.4;
            } else if (actualWinner === 'BJP') {
              bjpVotes -= penalty;
              incVotes += penalty * 0.5;
              brsVotes += penalty * 0.5;
            }
          }
        }
      }

      // --------------------------------------------------------------------
      // FEATURE: Telangana Ground Realities & Crisis Stress Modifiers
      // --------------------------------------------------------------------
      // 1. HYDRAA & Musi Demolition Backlash in Urban GHMC / Ranga Reddy
      if (groundCrisisSettings.hydraUrbanBacklash > 0 && URBAN_AC_NOS.has(ac.ac_no)) {
        const hydraCut = totalVotes * (groundCrisisSettings.hydraUrbanBacklash / 100);
        incVotes = Math.max(0, incVotes - hydraCut);
        brsVotes += hydraCut * 0.60;
        bjpVotes += hydraCut * 0.40;
      }

      // 2. AIMIM North Telangana & Semi-Urban 10-AC Expansion
      if (groundCrisisSettings.aimimNorthExpansion && AIMIM_NORTH_EXPANSION_AC_NOS.has(ac.ac_no)) {
        const aimimCut = totalVotes * 0.16;
        incVotes = Math.max(0, incVotes - (aimimCut * 0.80));
        brsVotes = Math.max(0, brsVotes - (aimimCut * 0.20));
        aimimVotes += aimimCut;
      }

      // 3. ED / CBI & Funding Choke on High-Stakes Battlegrounds (<8,000 Margin)
      if (groundCrisisSettings.edCbiFundingChoke && ac.margin_2023 < 8000) {
        const chokeCut = totalVotes * 0.022;
        incVotes = Math.max(0, incVotes - chokeCut);
        brsVotes += chokeCut * 0.55;
        bjpVotes += chokeCut * 0.45;
      }

      // 4. Ashok Nagar & Youth Aspirant Revolt (Youth 18-25 cohort shift)
      if (groundCrisisSettings.youthUnrestShift > 0 && ap.youth_18_25) {
        const youthVoters = totalVotes * (ap.youth_18_25 / 100);
        const youthShift = youthVoters * (groundCrisisSettings.youthUnrestShift / 100);
        incVotes = Math.max(0, incVotes - youthShift);
        bjpVotes += youthShift * 0.60;
        brsVotes += youthShift * 0.40;
      }

      // 5. Auto-Rickshaw Livelihood Discontent (-1.5% in urban/fringe ACs)
      if (groundCrisisSettings.autoDriverDiscontent && (isUrban || ac.margin_pct_2023 < 8.0)) {
        const autoCut = totalVotes * 0.015;
        incVotes = Math.max(0, incVotes - autoCut);
        brsVotes += autoCut * 0.65;
        bjpVotes += autoCut * 0.35;
      }

      // 6. Lagacherla & Tribal Land Backlash (-4.5% in Kodangal & South TS belt)
      if (groundCrisisSettings.lagacherlaLandBacklash && LAGACHERLA_ZONE_AC_NOS.has(ac.ac_no)) {
        const landCut = totalVotes * 0.045;
        incVotes = Math.max(0, incVotes - landCut);
        brsVotes += landCut * 0.70;
        bjpVotes += landCut * 0.30;
      }

      // Ensure positive votes
      incVotes = Math.max(100, Math.round(incVotes));
      brsVotes = Math.max(0, Math.round(brsVotes));
      bjpVotes = Math.max(0, Math.round(bjpVotes));
      aimimVotes = Math.max(0, Math.round(aimimVotes));

      // Add major parties to ranking list
      partyPairs.push(['INC', incVotes]);
      if (brsVotes > 0) partyPairs.push(['BRS', brsVotes]);
      if (bjpVotes > 0) partyPairs.push(['BJP', bjpVotes]);
      if (aimimVotes > 0) {
        partyPairs.push(['AIMIM', aimimVotes]);
      }
      partyPairs.sort((a, b) => b[1] - a[1]);

      const simWinner = partyPairs[0][0];
      const simWinnerVotes = partyPairs[0][1];
      const simRunner = partyPairs[1][0];
      const simRunnerVotes = partyPairs[1][1];

      const margin = simWinnerVotes - simRunnerVotes;
      const marginPct = Number(((margin / (simWinnerVotes + simRunnerVotes)) * 100).toFixed(2));
      const isFlipped = simWinner !== actualWinner;

      // Find primary decisive community for this AC
      let maxComm = 'bc_mudiraj';
      let maxPct = 0;
      Object.entries(cp).forEach(([k, v]) => {
        if (v > maxPct) {
          maxPct = v;
          maxComm = k;
        }
      });

      const tier: 'TOSS_UP' | 'LEAN' | 'SOLID' =
        margin <= tossUpThreshold ? 'TOSS_UP' : margin < 12000 ? 'LEAN' : 'SOLID';

      list.push({
        ac_no: ac.ac_no,
        ac_name: ac.ac_name,
        district: ac.district,
        reservation: ac.reservation,
        votes_2023: {
          winner_party: actualWinner,
          runner_party: actualRunner,
          margin: ac.margin_2023,
          margin_pct: ac.margin_pct_2023,
        },
        simulated: {
          winner_party: simWinner,
          runner_party: simRunner,
          winner_votes: simWinnerVotes,
          runner_votes: simRunnerVotes,
          margin,
          margin_pct: marginPct,
          party_votes: {
            INC: incVotes,
            BRS: brsVotes,
            BJP: bjpVotes,
            AIMIM: aimimVotes,
          },
          is_flipped: isFlipped,
          flipped_from: isFlipped ? actualWinner : undefined,
        },
        key_demographic: READABLE_COMMUNITY_NAMES[maxComm] || maxComm,
        key_demographic_pct: maxPct,
        battleground_tier: tier,
      });
    });

    return list;
  }, [
    data,
    swings,
    macroSwing,
    turnoutSettings,
    coalitionSettings,
    mlaFatigueSettings,
    groundCrisisSettings,
    tossUpThreshold,
    activePreset,
  ]);

  // Aggregate Path to 60 Majority Gauge
  const tally = useMemo(() => {
    const counts: Record<string, number> = { INC: 0, BRS: 0, BJP: 0, AIMIM: 0, OTH: 0 };
    let flippedCount = 0;
    let tossUpCount = 0;

    simulatedResults.forEach((r) => {
      counts[r.simulated.winner_party] = (counts[r.simulated.winner_party] || 0) + 1;
      if (r.simulated.is_flipped) flippedCount++;
      if (r.battleground_tier === 'TOSS_UP') tossUpCount++;
    });

    return {
      counts,
      flippedCount,
      tossUpCount,
      incDiff: counts.INC - 64, // 2023 actual was 64 (with CPI)
      brsDiff: counts.BRS - 39,
      bjpDiff: counts.BJP - 8,
    };
  }, [simulatedResults]);

  // Generate what-if items summary for the active scenario
  const whatIfs = useMemo<ScenarioWhatIfItem[]>(() => {
    const list: ScenarioWhatIfItem[] = [];

    // 1. Coalition & Friction
    if (activePreset === 'bjp_trs_alliance') {
      list.push({
        id: 'coalition_pact',
        label: `🤝 74:45 Pact (${coalitionSettings.brsToBjpTransferPct}% BRS→BJP / ${coalitionSettings.bjpToBrsTransferPct}% BJP→BRS)`,
        category: 'coalition',
        detail: `Anti-KCR Rebel Leakage: ${coalitionSettings.rebelLeakagePct}% to INC`,
      });
    } else if (activePreset === 'bjp_trs_merger') {
      list.push({
        id: 'merger_pact',
        label: '🪷 Full Merger (KTR CM / Harish Union Cabinet)',
        category: 'coalition',
        detail: '100% unified vote under Lotus symbol',
      });
    } else if (activePreset === 'triangular_2028_anti_inc') {
      list.push({
        id: 'triangular_contest',
        label: '⚔️ 2028 Triangular Contest',
        category: 'anti_incumbency',
        detail: '3-way contest with 5-yr anti-incumbency against INC',
      });
    }

    // 2. Caste Blocs
    const modifiedCastes: string[] = [];
    if (swings.bc_mudiraj?.BRS) modifiedCastes.push(`Mudiraj ${swings.bc_mudiraj.BRS >= 0 ? '+' : ''}${swings.bc_mudiraj.BRS}%`);
    if (swings.sc_madiga?.BJP) modifiedCastes.push(`Madiga MRPS ${swings.sc_madiga.BJP >= 0 ? '+' : ''}${swings.sc_madiga.BJP}%`);
    if (swings.bc_munnuru_kapu?.BRS) modifiedCastes.push(`Munnuru Kapu ${swings.bc_munnuru_kapu.BRS >= 0 ? '+' : ''}${swings.bc_munnuru_kapu.BRS}%`);
    if (swings.youth_18_25?.BRS) modifiedCastes.push(`Youth ${swings.youth_18_25.BRS >= 0 ? '+' : ''}${swings.youth_18_25.BRS}%`);
    if (swings.minority_muslim?.INC) modifiedCastes.push(`Muslims ${swings.minority_muslim.INC >= 0 ? '+' : ''}${swings.minority_muslim.INC}%`);

    if (modifiedCastes.length > 0) {
      list.push({
        id: 'caste_swings',
        label: `👥 Castes: ${modifiedCastes.slice(0, 2).join(', ')}${modifiedCastes.length > 2 ? ` +${modifiedCastes.length - 2}` : ''}`,
        category: 'caste_blocs',
        detail: modifiedCastes.join(' | '),
      });
    } else if (activeCustomizedCount > 0) {
      list.push({
        id: 'caste_custom',
        label: `👥 ${activeCustomizedCount} Demographic Cohorts Tuned`,
        category: 'caste_blocs',
        detail: 'Fine-tuned in SEEEPC Demographic Studio',
      });
    }

    // 3. Turnout
    if (turnoutSettings.urbanShift !== 0 || turnoutSettings.ruralShift !== 0 || turnoutSettings.femaleShift !== 0) {
      const parts: string[] = [];
      if (turnoutSettings.urbanShift !== 0) parts.push(`Urban ${turnoutSettings.urbanShift >= 0 ? '+' : ''}${turnoutSettings.urbanShift}%`);
      if (turnoutSettings.ruralShift !== 0) parts.push(`Rural ${turnoutSettings.ruralShift >= 0 ? '+' : ''}${turnoutSettings.ruralShift}%`);
      if (turnoutSettings.femaleShift !== 0) parts.push(`Women ${turnoutSettings.femaleShift >= 0 ? '+' : ''}${turnoutSettings.femaleShift}%`);
      list.push({
        id: 'turnout_modifier',
        label: `🗳️ Turnout: ${parts.join(', ')}`,
        category: 'turnout',
        detail: parts.join(' | '),
      });
    }

    // 4. Macro & Anti-Incumbency
    if (macroSwing.INC !== 0 || macroSwing.BRS !== 0 || macroSwing.BJP !== 0) {
      list.push({
        id: 'macro_swing',
        label: `📉 Macro: INC ${macroSwing.INC >= 0 ? '+' : ''}${macroSwing.INC}% | BRS ${macroSwing.BRS >= 0 ? '+' : ''}${macroSwing.BRS}% | BJP ${macroSwing.BJP >= 0 ? '+' : ''}${macroSwing.BJP}%`,
        category: 'anti_incumbency',
        detail: 'Uniform statewide political shift',
      });
    }

    // 5. Candidate Surgery
    if (mlaFatigueSettings.replaceIncumbentPct > 0) {
      list.push({
        id: 'mla_surgery',
        label: `✂️ MLA Surgery: ${mlaFatigueSettings.replaceIncumbentPct}% denied tickets`,
        category: 'anti_incumbency',
        detail: `Fresh face boost: +${mlaFatigueSettings.freshFaceBoost}%`,
      });
    }

    // 6. Ground Realities & Crisis Modifiers
    if (groundCrisisSettings.hydraUrbanBacklash > 0) {
      list.push({
        id: 'crisis_hydra',
        label: `🏗️ HYDRAA: -${groundCrisisSettings.hydraUrbanBacklash}% GHMC`,
        category: 'anti_incumbency',
        detail: 'Urban lake buffer & real estate backlash in 29 ACs',
      });
    }
    if (groundCrisisSettings.aimimNorthExpansion) {
      list.push({
        id: 'crisis_aimim',
        label: '🛡️ AIMIM: 10 ACs North TS',
        category: 'anti_incumbency',
        detail: 'Multi-polar vote split outside Old City',
      });
    }
    if (groundCrisisSettings.edCbiFundingChoke) {
      list.push({
        id: 'crisis_ed_cbi',
        label: '⚖️ ED/CBI: Funding Choke',
        category: 'anti_incumbency',
        detail: '-2.2% mobilization penalty in tight ACs',
      });
    }
    if (groundCrisisSettings.youthUnrestShift > 0) {
      list.push({
        id: 'crisis_youth',
        label: `🎓 Youth Revolt: -${groundCrisisSettings.youthUnrestShift}% (18-25)`,
        category: 'anti_incumbency',
        detail: 'Ashok Nagar GO 29 & DSC aspirant agitation',
      });
    }
    if (groundCrisisSettings.autoDriverDiscontent) {
      list.push({
        id: 'crisis_auto',
        label: '🛺 Auto Union: -1.5% Fringe',
        category: 'anti_incumbency',
        detail: '6.5L auto driver families livelihood grievance',
      });
    }
    if (groundCrisisSettings.lagacherlaLandBacklash) {
      list.push({
        id: 'crisis_lagacherla',
        label: '🌳 Lagacherla: -4.5% Kodangal',
        category: 'anti_incumbency',
        detail: 'Pharma Village ST Lambada land acquisition clash',
      });
    }

    return list;
  }, [
    activePreset,
    coalitionSettings,
    swings,
    activeCustomizedCount,
    turnoutSettings,
    macroSwing,
    mlaFatigueSettings,
    groundCrisisSettings,
  ]);

  // Synchronize with parent app bridge
  useEffect(() => {
    if (!onBridgeChange) return;

    let scenarioName = '2028 BRS-BJP Coalition (74:45 Pact)';
    if (activePreset === 'bjp_trs_merger') scenarioName = '🪷 2028 TRS-BJP Merger';
    else if (activePreset === 'triangular_2028_anti_inc') scenarioName = '⚔️ 2028 Triangular Contest';
    else if (activePreset === 'trs_2018_landslide') scenarioName = '🌸 2018 TRS Wave Benchmark';
    else if (activePreset === 'trs_2014_mandate') scenarioName = '🏛️ 2014 Mandate Benchmark';
    else if (activePreset === 'baseline') scenarioName = '📊 2023 Actual Baseline';
    else if (activePreset === 'custom') scenarioName = '⚙️ Custom War Room Scenario';

    onBridgeChange({
      id: activePreset,
      name: scenarioName,
      description: 'Simulated 119-AC election projection with active what-ifs',
      isExportedToActions: false,
      timestamp: Date.now(),
      whatIfs,
      simulatedResults,
      tally,
    });
  }, [activePreset, whatIfs, simulatedResults, tally, onBridgeChange]);

  // Filtered list for directory and bubble selection
  const filteredList = useMemo(() => {
    return simulatedResults.filter((r) => {
      if (tierFilter === 'TOSS_UP' && r.battleground_tier !== 'TOSS_UP') return false;
      if (tierFilter === 'FLIPS' && !r.simulated.is_flipped) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase().trim();
        return (
          r.ac_name.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q) ||
          r.simulated.winner_party.toLowerCase().includes(q) ||
          r.key_demographic.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [simulatedResults, tierFilter, searchFilter]);

  const selectedConstituency = useMemo(() => {
    if (selectedBubbleAc) {
      const match = simulatedResults.find((r) => r.ac_no === selectedBubbleAc);
      if (match) return match;
    }
    return filteredList[0] || simulatedResults[0];
  }, [simulatedResults, selectedBubbleAc, filteredList]);

  const activeAcNo = selectedBubbleAc ?? selectedConstituency?.ac_no ?? null;

  return (
    <div className="space-y-6">
      {/* Top Banner: CM Advisor War Room Barometer */}
      <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white font-mono text-xs font-black px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3" /> CM STRATEGIC WAR ROOM
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                SEEEPC Vol-4 Demographics + Dynamic Polling
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Assembly Majority Barometer &amp; Battleground Simulator
            </h2>
          </div>

          {/* Quick Scenario Presets (Structured into 2028 Forecasts & Past Benchmarks) */}
          <div className="flex flex-col gap-2 sm:items-end">
            {/* Row 1: 2028 Future Forecasts */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-indigo-950 font-black mr-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>2028 Forecasts:</span>
              </span>
              <button
                onClick={() => applyPreset('bjp_trs_alliance')}
                className={`px-3 py-1.5 text-xs rounded-xl font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                  activePreset === 'bjp_trs_alliance'
                    ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md ring-2 ring-purple-400/40'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                }`}
                title="2028 BRS-BJP Pre-Poll Coalition: 74 BRS : 45 BJP seat formula, dynamic transfer matrix & secular/caste split"
              >
                <Handshake className="w-3.5 h-3.5 text-purple-300" />
                <span>🤝 2028 BRS-BJP Coalition (74:45 Pact)</span>
              </button>
              <button
                onClick={() => applyPreset('bjp_trs_merger')}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activePreset === 'bjp_trs_merger'
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
                title="Full merger of TRS into BJP under Lotus symbol: KTR as Chief Minister face, Harish Rao in Union Cabinet"
              >
                <span>🪷 Full Merger</span>
              </button>
              <button
                onClick={() => applyPreset('triangular_2028_anti_inc')}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activePreset === 'triangular_2028_anti_inc'
                    ? 'bg-rose-600 text-white shadow-xs font-black'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
                title="2028 Triangular Contest: All 3 parties go alone, ruling Congress faces 5-year anti-incumbency (-7%)"
              >
                <span>⚔️ 2028 Triangular</span>
              </button>

              {onExportToActions && (
                <button
                  onClick={onExportToActions}
                  className="px-3 py-1 text-xs rounded-lg font-black bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xs transition-all cursor-pointer flex items-center gap-1 ml-1"
                  title="Export this simulation scenario to Actions & Playbook"
                >
                  <span>Export to Actions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Row 2: Past Historical Benchmarks */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">
                Past Scenarios:
              </span>
              <button
                onClick={() => applyPreset('baseline')}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activePreset === 'baseline'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                }`}
                title="2023 Actual Election Baseline (INC 64, BRS 39, BJP 8, AIMIM 7, CPI 1)"
              >
                <span>📊 2023 Baseline</span>
              </button>
              <button
                onClick={() => applyPreset('trs_2018_landslide')}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activePreset === 'trs_2018_landslide'
                    ? 'bg-pink-600 text-white shadow-xs font-black'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                }`}
                title="2018/19 TRS Landslide: 88 seats, 46.9% vote share, Rythu Bandhu wave & Prajakootami backfire"
              >
                <span>🌸 2018 Wave (88)</span>
              </button>
              <button
                onClick={() => applyPreset('trs_2014_mandate')}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  activePreset === 'trs_2014_mandate'
                    ? 'bg-rose-600 text-white shadow-xs font-black'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                }`}
                title="2014 Inaugural Mandate: TRS 63 seats, 34% vote share, Statehood movement surge"
              >
                <span>🏛️ 2014 Mandate (63)</span>
              </button>
              <button
                onClick={() => applyPreset('baseline')}
                title="Reset all swings to 2023 baseline"
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg transition-colors cursor-pointer ml-0.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Real-time "Path to 60" Seat Barometer Cards */}
        {activePreset === 'bjp_trs_merger' && (
          <div className="mt-3 px-3.5 py-2 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <strong>Merger Scenario:</strong> TRS dissolves and merges into BJP under Lotus symbol. KTR projected as NDA Chief Minister; Harish Rao takes Union Cabinet portfolio.
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-mono px-2 py-0.5 rounded border border-amber-200 font-bold">
              88% Cadre Transfer | 12% Defect to INC
            </span>
          </div>
        )}

        {activePreset === 'triangular_2028_anti_inc' && (
          <div className="mt-3 px-3.5 py-2 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <strong>2028 Triangular Contest:</strong> 5-Year anti-incumbency (-7.0% INC vote shed) triggers a fractured 3-way race. BJP holds the kingmaker balance of power.
            </span>
            <span className="text-[10px] bg-sky-100 text-sky-800 font-mono px-2 py-0.5 rounded border border-sky-200 font-bold">
              3-Way Independent Battle
            </span>
          </div>
        )}

        {activePreset === 'kavitha_spoiler_front' && (
          <div className="mt-3 px-3.5 py-2 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
            <span className="font-semibold flex items-center gap-1.5">
              <Target className="w-4 h-4 text-teal-600" />
              <strong>Kavitha Spoiler Front:</strong> Telangana Jagruthi acts as targeted vote-cutter in 14 North TS constituencies, shaving 4.2% BRS votes and flipping key seats.
            </span>
            <span className="text-[10px] bg-teal-100 text-teal-800 font-mono px-2 py-0.5 rounded border border-teal-200 font-bold">
              14 North TS ACs
            </span>
          </div>
        )}

        {activePreset === 'bjp_trs_merger' ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
            {/* Merged Front (Lotus) - KTR CM */}
            <div className="bg-gradient-to-br from-amber-50 via-pink-50 to-slate-50 p-3.5 rounded-xl border border-amber-300 shadow-xs col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-xs text-amber-800 mb-1">
                <span className="font-black flex items-center gap-1.5 text-slate-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Merged BJP (Lotus)
                </span>
                <span className="text-[10px] font-bold font-mono text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                  KTR CM Face
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{tally.counts.BJP}</span>
                <span className="text-xs">
                  {tally.counts.BJP >= 60 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Majority (+{tally.counts.BJP - 60})
                    </span>
                  ) : (
                    <span className="text-amber-700 font-bold">Short of 60</span>
                  )}
                </span>
              </div>
              <div className="text-[11px] text-amber-900 font-mono mt-1">
                Harish Rao: <span className="font-bold text-pink-700">Union Cabinet</span>
              </div>
            </div>

            {/* BRS Integration Card */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1.5 text-pink-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF1493]" />
                  BRS Integration
                </span>
                <span className="text-[10px] text-pink-700 font-mono font-bold bg-pink-50 px-1.5 py-0.2 rounded border border-pink-200">
                  88% Merged
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">0</span>
                <span className="text-xs text-pink-700 font-medium">Contested on Lotus</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                12% dissident cadre defected to INC
              </div>
            </div>

            {/* INC (Congress) Card */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1.5 text-sky-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#19AAED]" />
                  INC (Opposition)
                </span>
                <span className={`text-[10px] font-bold font-mono ${tally.incDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {tally.incDiff >= 0 ? `+${tally.incDiff}` : tally.incDiff} vs 2023
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{tally.counts.INC}</span>
                <span className="text-xs text-slate-500">
                  {tally.counts.INC >= 60 ? 'Majority' : 'Seats'}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                South TS, Khammam, Nalgonda
              </div>
            </div>

            {/* AIMIM */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006600]" />
                  AIMIM
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Hyderabad</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{tally.counts.AIMIM}</span>
                <span className="text-xs text-slate-500">Old City Base</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Hyderabad Core Unchanged
              </div>
            </div>

            {/* Flips & Triage */}
            <div className="bg-rose-50/80 p-3.5 rounded-xl border border-rose-200">
              <div className="flex items-center justify-between text-xs text-rose-800 mb-1 font-semibold">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-600" /> Triage Alarms
                </span>
                <span className="bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-mono text-[10px] font-bold border border-rose-200">
                  {tally.flippedCount} Flips
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-700">{tally.tossUpCount}</span>
                <span className="text-xs text-slate-600">Toss-ups</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Consolidated Lotus Wave
              </div>
            </div>
          </div>
        ) : activePreset === 'bjp_trs_alliance' ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
            {/* Joint Coalition Total Card */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-slate-50 p-3.5 rounded-xl border border-purple-300 shadow-xs col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-xs text-purple-800 mb-1">
                <span className="font-black flex items-center gap-1.5 text-purple-900">
                  <Handshake className="w-4 h-4 text-purple-600" />
                  BRS + BJP Coalition
                </span>
                <span className="text-[10px] font-bold font-mono text-purple-800 bg-purple-100 px-1.5 py-0.2 rounded border border-purple-300">
                  74:45 Pact
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{tally.counts.BRS + tally.counts.BJP}</span>
                <span className="text-xs">
                  {tally.counts.BRS + tally.counts.BJP >= 60 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Majority (+{tally.counts.BRS + tally.counts.BJP - 60})
                    </span>
                  ) : (
                    <span className="text-amber-700 font-bold">Short of 60</span>
                  )}
                </span>
              </div>
              <div className="text-[11px] text-purple-800 font-mono mt-1">
                BRS: <span className="font-bold text-pink-700">{tally.counts.BRS}</span> | BJP: <span className="font-bold text-amber-700">{tally.counts.BJP}</span>
              </div>
            </div>

            {/* BRS Partner Card */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1.5 text-pink-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF1493]" />
                  BRS (74 Seats)
                </span>
                <span className="text-[10px] text-pink-700 font-mono font-bold bg-pink-50 px-1.5 py-0.2 rounded border border-pink-200">
                  {tally.brsDiff >= 0 ? `+${tally.brsDiff}` : tally.brsDiff} vs 2023
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{tally.counts.BRS}</span>
                <span className="text-xs text-slate-500">Seats Won</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Rural TS, Medak, Warangal
              </div>
            </div>

            {/* BJP Partner Card */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933]" />
                  BJP (45 Seats)
                </span>
                <span className="text-[10px] text-amber-700 font-mono font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  {tally.bjpDiff >= 0 ? `+${tally.bjpDiff}` : tally.bjpDiff} vs 2023
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{tally.counts.BJP}</span>
                <span className="text-xs text-slate-500">Seats Won</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                GHMC Urban, North TS Core
              </div>
            </div>

            {/* INC (Congress) Card */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1.5 text-sky-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#19AAED]" />
                  INC (Opposition)
                </span>
                <span className={`text-[10px] font-bold font-mono ${tally.incDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {tally.incDiff >= 0 ? `+${tally.incDiff}` : tally.incDiff} vs 2023
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{tally.counts.INC}</span>
                <span className="text-xs text-slate-500">
                  {tally.counts.INC >= 60 ? 'Majority' : 'Seats'}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                South TS, Khammam, Nalgonda
              </div>
            </div>

            {/* AIMIM & Flips */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006600]" />
                  AIMIM &amp; Close
                </span>
                <span className="bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-mono text-[10px] font-bold border border-rose-200">
                  {tally.flippedCount} Flips
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{tally.counts.AIMIM}</span>
                <span className="text-xs text-slate-500">Old City Base</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {tally.tossUpCount} Close Toss-ups
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
            {/* INC */}
            <div className="bg-slate-50 hover:bg-sky-50/60 transition-colors p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1.5 text-sky-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#19AAED]" />
                  INC (Congress)
                </span>
                <span className={`text-[10px] font-bold font-mono ${tally.incDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {tally.incDiff >= 0 ? `+${tally.incDiff}` : tally.incDiff} vs 2023
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{tally.counts.INC}</span>
                <span className="text-xs text-slate-500">
                  {tally.counts.INC >= 60 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Majority
                    </span>
                  ) : (
                    <span className="text-amber-700 font-bold">-{60 - tally.counts.INC} to Majority</span>
                  )}
                </span>
              </div>
            </div>

            {/* BRS */}
            <div className="bg-slate-50 hover:bg-pink-50/60 transition-colors p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1.5 text-pink-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF1493]" />
                  BRS
                </span>
                <span className={`text-[10px] font-bold font-mono ${tally.brsDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {tally.brsDiff >= 0 ? `+${tally.brsDiff}` : tally.brsDiff} vs 2023
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{tally.counts.BRS}</span>
                <span className="text-xs text-slate-500">
                  {tally.counts.BRS >= 60 ? (
                    <span className="text-emerald-700 font-bold">Majority</span>
                  ) : (
                    <span className="text-slate-500">Seats</span>
                  )}
                </span>
              </div>
            </div>

            {/* BJP */}
            <div className="bg-slate-50 hover:bg-amber-50/60 transition-colors p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933]" />
                  BJP
                </span>
                <span className={`text-[10px] font-bold font-mono ${tally.bjpDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {tally.bjpDiff >= 0 ? `+${tally.bjpDiff}` : tally.bjpDiff} vs 2023
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{tally.counts.BJP}</span>
                <span className="text-xs text-slate-500">
                  {tally.counts.BJP >= 60 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Majority
                    </span>
                  ) : tally.counts.BJP >= 10 ? (
                    <span className="text-amber-700 font-bold">Kingmaker Zone</span>
                  ) : (
                    'Seats'
                  )}
                </span>
              </div>
            </div>

            {/* AIMIM */}
            <div className="bg-slate-50 hover:bg-emerald-50/60 transition-colors p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006600]" />
                  AIMIM
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Hyderabad</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{tally.counts.AIMIM}</span>
                <span className="text-xs text-slate-500">Old City Base</span>
              </div>
            </div>

            {/* Triage & Flips Alert */}
            <div className="bg-rose-50/80 hover:bg-rose-100/60 transition-colors p-3.5 rounded-xl border border-rose-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-rose-800 mb-1 font-semibold">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-600" /> Triage Alarms
                </span>
                <span className="bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-mono text-[10px] font-bold border border-rose-200">
                  {tally.flippedCount} Flips
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-700">{tally.tossUpCount}</span>
                <span className="text-xs text-slate-600">
                  Toss-ups (&le; {tossUpThreshold >= 1000 ? `${(tossUpThreshold / 1000).toFixed(1).replace('.0', '')}k` : tossUpThreshold} votes)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Chief Advisor "What-If" War Room Modifiers */}
      <AdvancedSimulationSuite
        data={data}
        simulatedResults={simulatedResults}
        activePreset={activePreset}
        onApplyPreset={applyPreset}
        swings={swings}
        setSwings={setSwings}
        macroSwing={macroSwing}
        setMacroSwing={setMacroSwing}
        turnoutSettings={turnoutSettings}
        setTurnoutSettings={setTurnoutSettings}
        coalitionSettings={coalitionSettings}
        setCoalitionSettings={setCoalitionSettings}
        mlaFatigueSettings={mlaFatigueSettings}
        setMlaFatigueSettings={setMlaFatigueSettings}
        groundCrisisSettings={groundCrisisSettings}
        setGroundCrisisSettings={setGroundCrisisSettings}
        onNavigateToActions={onNavigateToActions}
        onOpenDemographicStudio={() => setIsStudioOpen(true)}
        activeCustomizedCount={activeCustomizedCount}
        requestedTab={requestedWhatIfTab}
      />

      {/* Step 3: Constituency Results & Battleground Map (Full-Width Presentation) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div>
          <span className="text-[10px] font-black tracking-wider uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded font-mono">
            Step 3: Assembly Results &amp; Constituency Battlegrounds
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-1">
            Constituency Triage Matrix &amp; Projected Outcomes (119 ACs)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStudioOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Demographic Studio</span>
            {activeCustomizedCount > 0 && (
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-mono font-bold">
                {activeCustomizedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigateToActions()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Export to Playbook</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />
          </button>
        </div>
      </div>

      {/* Full-Width Results Chart & Directory */}
      <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <span>Battleground Triage Bubble Chart</span>
                  <span className="text-[11px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                    {filteredList.length} ACs
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Bubble size is <strong className="text-slate-800">inversely proportional</strong> to victory margin (Large = Razor-thin battleground needing urgent intervention; Small = Safe fortress).
                </p>
              </div>

              {/* Tier Filters & Toss-Up Threshold Input */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Input box for votes considered for toss-up ACs */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-xs shadow-2xs">
                  <label htmlFor="tossup-threshold-input" className="text-slate-700 font-bold whitespace-nowrap flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span>Toss-up margin &le;</span>
                  </label>
                  <input
                    id="tossup-threshold-input"
                    type="number"
                    min="500"
                    max="50000"
                    step="500"
                    value={tossUpThreshold}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setTossUpThreshold(isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    className="w-16 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs font-bold font-mono text-slate-900 text-right focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500 font-medium">votes</span>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setTierFilter('TOSS_UP')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      tierFilter === 'TOSS_UP' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Flame className="w-3 h-3 text-rose-500" /> Toss-ups ({tally.tossUpCount})
                  </button>
                  <button
                    onClick={() => setTierFilter('FLIPS')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      tierFilter === 'FLIPS' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-indigo-600" /> Flips ({tally.flippedCount})
                  </button>
                  <button
                    onClick={() => setTierFilter('ALL')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      tierFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All 119 ACs
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive SVG Bubble Chart Canvas */}
            <div className="relative w-full h-[380px] bg-slate-50/70 rounded-xl border border-slate-200/80 overflow-hidden select-none">
              <svg className="w-full h-full" viewBox="0 0 800 380">
                {/* Background Grid guidelines */}
                {/* Upper Guide (+Max / 2) */}
                <line x1="75" y1="120" x2="780" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2 2" />
                {/* Center 0-Margin Tipping Point Boundary */}
                <line x1="75" y1="190" x2="780" y2="190" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
                {/* Lower Guide (-Max / 2) */}
                <line x1="75" y1="260" x2="780" y2="260" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2 2" />
                {/* Vertical Central Meridian */}
                <line x1="427" y1="25" x2="427" y2="350" stroke="#f1f5f9" strokeWidth="1" />

                {/* Y-Axis Labels positioned on the left margin to prevent bubble overlap */}
                <text x="15" y="45" fill="#0284c7" fontSize="10" fontWeight="bold">
                  ▲ INC Lead
                </text>
                <text x="15" y="60" fill="#94a3b8" fontSize="9" fontWeight="500">
                  +{tierFilter === 'TOSS_UP' ? (tossUpThreshold >= 1000 ? `${(tossUpThreshold/1000).toFixed(0)}k` : tossUpThreshold) : '25k'}
                </text>

                <text x="15" y="187" fill="#64748b" fontSize="10" fontWeight="bold">
                  0 Margin
                </text>
                <text x="15" y="198" fill="#94a3b8" fontSize="8" fontWeight="500">
                  Tipping Point
                </text>

                <text x="15" y="325" fill="#f43f5e" fontSize="10" fontWeight="bold">
                  ▼ BRS/BJP Lead
                </text>
                <text x="15" y="340" fill="#94a3b8" fontSize="9" fontWeight="500">
                  -{tierFilter === 'TOSS_UP' ? (tossUpThreshold >= 1000 ? `${(tossUpThreshold/1000).toFixed(0)}k` : tossUpThreshold) : '25k'}
                </text>

                {/* X-Axis Labels */}
                <text x="80" y="368" fill="#94a3b8" fontSize="10" fontWeight="500">
                  ← North Telangana (Adilabad, Nizamabad, Karimnagar)
                </text>
                <text x="590" y="368" fill="#94a3b8" fontSize="10" fontWeight="500">
                  South TS (Nalgonda, Khammam) →
                </text>

                {/* Render Bubbles */}
                {filteredList.map((ac) => {
                  // X positioned by AC number 1..119 across width 80..770
                  const cx = 80 + (ac.ac_no / 120) * 690;

                  // Y positioned by simulated margin:
                  // When looking at toss-ups, scale dynamically to tossUpThreshold so bubbles use full vertical range!
                  const maxMarginScale = tierFilter === 'TOSS_UP' ? Math.max(2500, tossUpThreshold) : 25000;
                  const signedMargin = ac.simulated.winner_party === 'INC' ? ac.simulated.margin : -ac.simulated.margin;
                  const clamped = Math.max(-maxMarginScale, Math.min(maxMarginScale, signedMargin));
                  const cy = 190 - (clamped / maxMarginScale) * 135;

                  // Inverse margin radius: tighter margin = bigger bubble!
                  const invRadius = Math.max(7, Math.min(26, 36000 / Math.pow(Math.max(500, ac.simulated.margin), 0.74)));

                  const partyColor = getPartyColor(ac.simulated.winner_party);
                  const isSelected = ac.ac_no === activeAcNo;
                  const isFlipped = ac.simulated.is_flipped;

                  return (
                    <g
                      key={ac.ac_no}
                      onClick={() => setSelectedBubbleAc(ac.ac_no)}
                      className="cursor-pointer transition-transform duration-200"
                    >
                      {/* Pulsing halo ring on flipped seats */}
                      {isFlipped && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={invRadius + 5}
                          fill="none"
                          stroke={partyColor}
                          strokeWidth="2"
                          strokeDasharray="4 3"
                          className="animate-pulse"
                        />
                      )}

                      {/* Selected halo */}
                      {isSelected && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={invRadius + 6}
                          fill="none"
                          stroke="#4f46e5"
                          strokeWidth="2.5"
                        />
                      )}

                      {/* Main Bubble */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={invRadius}
                        fill={partyColor}
                        fillOpacity={isSelected ? 0.95 : 0.72}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="hover:opacity-100 transition-opacity"
                      />

                      {/* Show AC number on prominent bubbles */}
                      {invRadius >= 14 && (
                        <text
                          x={cx}
                          y={cy + 3.5}
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          pointerEvents="none"
                        >
                          {ac.ac_no}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Legend overlay */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 shadow-2xs text-[10px] space-y-1">
                <div className="font-bold text-slate-700">Party Color:</div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#19AAED]" /> INC
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF1493]" /> BRS
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933]" /> BJP
                </div>
                <div className="text-[9px] text-slate-500 pt-0.5 border-t border-slate-100">
                  Bigger Bubble = Tighter Margin (&le; {tossUpThreshold >= 1000 ? `${(tossUpThreshold / 1000).toFixed(1).replace('.0', '')}k` : tossUpThreshold} votes)
                </div>
              </div>
            </div>

            {/* Selected Bubble Deep-Dive Drawer */}
            {selectedConstituency && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-slate-900 text-white px-2 py-0.5 rounded">
                      AC #{selectedConstituency.ac_no}
                    </span>
                    <h4 className="text-base font-black text-slate-900">
                      {selectedConstituency.ac_name} ({selectedConstituency.district})
                    </h4>
                    {selectedConstituency.simulated.is_flipped && (
                      <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        FLIPS from {selectedConstituency.votes_2023.winner_party} to {selectedConstituency.simulated.winner_party}!
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-3">
                    <span>
                      Simulated Winner:{' '}
                      <strong style={{ color: getPartyColor(selectedConstituency.simulated.winner_party) }}>
                        {selectedConstituency.simulated.winner_party}
                      </strong>{' '}
                      by <strong>{selectedConstituency.simulated.margin.toLocaleString()}</strong> votes ({selectedConstituency.simulated.margin_pct}%)
                    </span>
                    <span>&middot;</span>
                    <span>
                      Decisive Demographic: <strong className="text-slate-800">{selectedConstituency.key_demographic}</strong> ({selectedConstituency.key_demographic_pct}%)
                    </span>
                  </div>

                  {/* Step-by-Step Compounded Simulation Impact Breakdown */}
                  <div className="w-full mt-3 pt-3 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">2023 Form-20 Baseline</span>
                      <span className="font-bold text-slate-800">
                        {selectedConstituency.votes_2023.winner_party} +{selectedConstituency.votes_2023.margin.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Compounded Simulated</span>
                      <span className="font-bold" style={{ color: getPartyColor(selectedConstituency.simulated.winner_party) }}>
                        {selectedConstituency.simulated.winner_party} +{selectedConstituency.simulated.margin.toLocaleString()}
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-200 col-span-2">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Compounded Simulated Votes</span>
                      <div className="flex items-center gap-2 font-mono font-bold text-xs mt-0.5">
                        <span className="text-sky-700">INC {selectedConstituency.simulated.party_votes.INC?.toLocaleString()}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-pink-700">BRS {selectedConstituency.simulated.party_votes.BRS?.toLocaleString()}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-amber-700">BJP {selectedConstituency.simulated.party_votes.BJP?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onSelectConstituencyDossier && (
                    <button
                      onClick={() => onSelectConstituencyDossier(selectedConstituency.ac_no)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    >
                      View Dossier
                    </button>
                  )}
                  <button
                    onClick={() => onNavigateToActions(selectedConstituency.ac_no)}
                    className="flex items-center gap-1 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
                  >
                    <Target className="w-3.5 h-3.5" />
                    Target in Playbook 🎯
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Directory of Battlegrounds and Flips */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <span>Simulation Battleground Roster ({filteredList.length})</span>
              </h3>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter AC, district, caste..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs w-44 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2 px-3">AC #</th>
                    <th className="py-2 px-3">Constituency</th>
                    <th className="py-2 px-3">District</th>
                    <th className="py-2 px-3">2023 Actual</th>
                    <th className="py-2 px-3">Simulated Project</th>
                    <th className="py-2 px-3 text-right">Sim. Margin</th>
                    <th className="py-2 px-3">Key Demographic</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.slice(0, 15).map((r) => {
                    const simColor = getPartyColor(r.simulated.winner_party);
                    return (
                      <tr
                        key={r.ac_no}
                        onClick={() => setSelectedBubbleAc(r.ac_no)}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                          r.ac_no === activeAcNo ? 'bg-indigo-50/30' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-500">#{r.ac_no}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{r.ac_name}</td>
                        <td className="py-2.5 px-3 text-slate-500">{r.district}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">
                          {r.votes_2023.winner_party} ({r.votes_2023.margin.toLocaleString()})
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[11px]"
                            style={{ backgroundColor: `${simColor}18`, color: simColor }}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: simColor }} />
                            {r.simulated.winner_party}
                            {r.simulated.is_flipped && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded ml-1 font-extrabold">
                                FLIP
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {r.simulated.margin.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {r.key_demographic} ({r.key_demographic_pct}%)
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToActions(r.ac_no);
                            }}
                            className="px-2 py-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition-colors"
                          >
                            Playbook 🎯
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {/* Demographic Swing Studio (Pattern C Large Overlay Window) */}
      <SwingStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        data={data}
        swings={swings}
        setSwings={setSwings}
        macroSwing={macroSwing}
        setMacroSwing={setMacroSwing}
        tally={tally}
        onApplyPreset={applyPreset}
        activePreset={activePreset}
      />
    </div>
  );
};
