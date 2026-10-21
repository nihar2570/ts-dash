import React, { useState, useMemo, useEffect } from 'react';
import type {
  SeeepcDataset,
  ElectionData,
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
  History,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { SwingStudioModal } from './SwingStudioModal';
import type { MacroSwing, PartySwing } from './SwingStudioModal';
import { AdvancedSimulationSuite, URBAN_AC_NOS } from './AdvancedSimulationSuite';
import type { TurnoutSettings, WhatIfTab } from './AdvancedSimulationSuite';
import {
  DEFAULT_COALITION_SETTINGS,
  DEFAULT_MLA_FATIGUE_SETTINGS,
  DEFAULT_GROUND_CRISIS_SETTINGS,
  VIZAG_STEEL_PLANT_AC_NOS,
  AMARAVATI_CORE_AC_NOS,
  JSP_SEATS_2024,
  BJP_SEATS_2024,
  RAYALASEEMA_DISTRICTS,
} from './StrategicSimulationModels';
import type {
  CoalitionSettings,
  MlaFatigueSettings,
  GroundCrisisSettings,
} from './StrategicSimulationModels';

export const READABLE_COMMUNITY_NAMES: Record<string, string> = {
  kapu: 'Kapu / Balija / Telaga',
  kamma: 'Kamma',
  reddy: 'Reddy',
  bc_turpu_kapu: 'BC Turpu Kapu',
  bc_yadava: 'BC Yadava / Golla',
  bc_kuruba_boya: 'BC Kuruba / Boya / Valmiki',
  bc_settibalija_goud: 'BC Settibalija / Goud',
  bc_padmashali: 'BC Padmashali',
  bc_other: 'Other BC Castes',
  sc_madiga_relli: 'SC Madiga / Relli',
  sc_mala: 'SC Mala',
  st_tribal: 'ST Agency Tribals',
  minority_muslim: 'Muslim Minorities',
  minority_christian: 'Christian Minorities',
  youth_18_25: 'Youth (18-25)',
  age_26_40: 'Working Age (26-40)',
  age_41_60: 'Middle Age (41-60)',
  age_60_plus: 'Seniors (60+)',
};

export const DEFAULT_ZERO_SWINGS: Record<string, PartySwing> = {
  kapu: { TDP: 0, YSRCP: 0, JSP: 0 },
  kamma: { TDP: 0, YSRCP: 0, JSP: 0 },
  reddy: { TDP: 0, YSRCP: 0, JSP: 0 },
  bc_turpu_kapu: { TDP: 0, YSRCP: 0, JSP: 0 },
  bc_yadava: { TDP: 0, YSRCP: 0, JSP: 0 },
  bc_kuruba_boya: { TDP: 0, YSRCP: 0, JSP: 0 },
  bc_settibalija_goud: { TDP: 0, YSRCP: 0, JSP: 0 },
  bc_padmashali: { TDP: 0, YSRCP: 0, JSP: 0 },
  bc_other: { TDP: 0, YSRCP: 0, JSP: 0 },
  sc_madiga_relli: { TDP: 0, YSRCP: 0, JSP: 0 },
  sc_mala: { TDP: 0, YSRCP: 0, JSP: 0 },
  st_tribal: { TDP: 0, YSRCP: 0, JSP: 0 },
  minority_muslim: { TDP: 0, YSRCP: 0, JSP: 0 },
  minority_christian: { TDP: 0, YSRCP: 0, JSP: 0 },
  youth_18_25: { TDP: 0, YSRCP: 0, JSP: 0 },
  age_26_40: { TDP: 0, YSRCP: 0, JSP: 0 },
  age_41_60: { TDP: 0, YSRCP: 0, JSP: 0 },
  age_60_plus: { TDP: 0, YSRCP: 0, JSP: 0 },
};

interface SimulationsViewProps {
  data: SeeepcDataset;
  electionData?: ElectionData | null;
  onNavigateToActions: (acNo?: number) => void;
  onSelectConstituencyDossier?: (acNo: number) => void;
  onBridgeChange?: (bridge: ActiveScenarioBridge) => void;
  requestedWhatIfTab?: WhatIfTab;
  onExportToActions?: () => void;
}

export const SimulationsView: React.FC<SimulationsViewProps> = ({
  data,
  electionData,
  onNavigateToActions,
  onSelectConstituencyDossier,
  onBridgeChange,
  requestedWhatIfTab,
  onExportToActions,
}) => {
  // Demographic swing offsets relative to baseline (clean zero-offset default)
  const [swings, setSwings] = useState<Record<string, PartySwing>>(DEFAULT_ZERO_SWINGS);

  const [fallbackElectionData, setFallbackElectionData] = useState<ElectionData | null>(null);

  useEffect(() => {
    if (!electionData) {
      fetch('/data/andhra_elections.json')
        .then((res) => res.json())
        .then((d) => setFallbackElectionData(d))
        .catch((err) => console.error('Failed to load fallback election data:', err));
    }
  }, [electionData]);

  const activeElectionData = electionData || fallbackElectionData;

  const [macroSwing, setMacroSwing] = useState<MacroSwing>({ TDP: 0, YSRCP: 0, JSP: 0 });
  const [turnoutSettings, setTurnoutSettings] = useState<TurnoutSettings>({
    urbanShift: 0,
    ruralShift: 0,
    femaleShift: 0,
  });
  const [coalitionSettings, setCoalitionSettings] = useState<CoalitionSettings>(DEFAULT_COALITION_SETTINGS);
  const [mlaFatigueSettings, setMlaFatigueSettings] = useState<MlaFatigueSettings>(DEFAULT_MLA_FATIGUE_SETTINGS);
  const [groundCrisisSettings, setGroundCrisisSettings] = useState<GroundCrisisSettings>(DEFAULT_GROUND_CRISIS_SETTINGS);
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>('nda_2024_sweep');
  const [selectedBubbleAc, setSelectedBubbleAc] = useState<number | null>(null);
  const [tierFilter, setTierFilter] = useState<'ALL' | 'TOSS_UP' | 'FLIPS'>('TOSS_UP');
  const [tossUpThreshold, setTossUpThreshold] = useState<number>(8000);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Count actively customized communities
  const activeCustomizedCount = useMemo(() => {
    let count = 0;
    Object.values(swings).forEach((s) => {
      if ((s.TDP || 0) !== 0 || (s.YSRCP || 0) !== 0 || (s.JSP || 0) !== 0) count++;
    });
    return count;
  }, [swings]);

  // Handle Preset Scenarios for Andhra Pradesh (Historical Benchmarks & 2029 Future Realignment)
  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    const reset: Record<string, PartySwing> = {
      kapu: { TDP: 0, YSRCP: 0, JSP: 0 },
      kamma: { TDP: 0, YSRCP: 0, JSP: 0 },
      reddy: { TDP: 0, YSRCP: 0, JSP: 0 },
      bc_turpu_kapu: { TDP: 0, YSRCP: 0, JSP: 0 },
      bc_yadava: { TDP: 0, YSRCP: 0, JSP: 0 },
      bc_kuruba_boya: { TDP: 0, YSRCP: 0, JSP: 0 },
      bc_settibalija_goud: { TDP: 0, YSRCP: 0, JSP: 0 },
      bc_padmashali: { TDP: 0, YSRCP: 0, JSP: 0 },
      bc_other: { TDP: 0, YSRCP: 0, JSP: 0 },
      sc_madiga_relli: { TDP: 0, YSRCP: 0, JSP: 0 },
      sc_mala: { TDP: 0, YSRCP: 0, JSP: 0 },
      st_tribal: { TDP: 0, YSRCP: 0, JSP: 0 },
      minority_muslim: { TDP: 0, YSRCP: 0, JSP: 0 },
      minority_christian: { TDP: 0, YSRCP: 0, JSP: 0 },
      youth_18_25: { TDP: 0, YSRCP: 0, JSP: 0 },
      age_26_40: { TDP: 0, YSRCP: 0, JSP: 0 },
      age_41_60: { TDP: 0, YSRCP: 0, JSP: 0 },
      age_60_plus: { TDP: 0, YSRCP: 0, JSP: 0 },
    };

    // Reset common sub-model settings
    setTurnoutSettings({ urbanShift: 0, ruralShift: 0, femaleShift: 0 });
    setCoalitionSettings(DEFAULT_COALITION_SETTINGS);
    setMlaFatigueSettings(DEFAULT_MLA_FATIGUE_SETTINGS);
    setGroundCrisisSettings(DEFAULT_GROUND_CRISIS_SETTINGS);

    if (presetKey === 'nda_2024_sweep' || presetKey === 'baseline') {
      // 1. 2024 Actual Mandate Baseline (Official Historical Returns: 164 NDA / 11 YSRCP)
      setMacroSwing({ TDP: 0, YSRCP: 0, JSP: 0 });
    } else if (presetKey === 'ysrcp_2019_wave') {
      // 2. 2019 YSRCP Wave Benchmark (Official Historical Returns: 151 YSRCP / 23 TDP / 1 JSP)
      // Pure historical returns - zero synthetic demographic shifts
      setMacroSwing({ TDP: 0, YSRCP: 0, JSP: 0 });
    } else if (presetKey === 'bifurcation_2014') {
      // 3. 2014 Post-Bifurcation Mandate (Official Historical Returns: 103 TDP / 68 YSRCP / 4 BJP)
      // Pure historical returns - zero synthetic demographic shifts
      setMacroSwing({ TDP: 0, YSRCP: 0, JSP: 0 });
    } else if (presetKey === 'nda_2029_defense') {
      // 4. 2029 NDA Defense (Alliance Holds): Natural 5-year anti-incumbency (-3.5% swing)
      reset.kapu = { TDP: -2, YSRCP: 2, JSP: 0 };
      reset.sc_madiga_relli = { TDP: -4, YSRCP: 4, JSP: 0 };
      reset.youth_18_25 = { TDP: -3, YSRCP: 3, JSP: 0 };
      setMacroSwing({ TDP: -3.5, YSRCP: 4.0, JSP: -1.5 });
      setTurnoutSettings({ urbanShift: -1.5, ruralShift: 1, femaleShift: 1 });
      setMlaFatigueSettings({ replaceIncumbentPct: 20, unpopularMlaPenalty: -3.0, freshFaceBoost: 3.5, targetParty: 'TDP' });
    } else if (presetKey === 'triangular_2029_solo') {
      // 5. 2029 Triangular: Alliance Breaks, JSP contests all 175 seats independently
      reset.kapu = { TDP: -10, YSRCP: -4, JSP: 14 };
      reset.youth_18_25 = { TDP: -8, YSRCP: -4, JSP: 12 };
      setMacroSwing({ TDP: -4.0, YSRCP: 1.0, JSP: 3.0 });
      setTurnoutSettings({ urbanShift: 2, ruralShift: -1, femaleShift: 0 });
    } else if (presetKey === 'tdp_vs_jsp_bjp_2029') {
      // 6. 2029 Realigned: TDP Solo vs JSP + BJP Alliance vs YSRCP (3-way war)
      reset.kapu = { TDP: -12, YSRCP: -4, JSP: 16 };
      reset.youth_18_25 = { TDP: -8, YSRCP: -3, JSP: 11 };
      reset.kamma = { TDP: 8, YSRCP: -8, JSP: 0 };
      setMacroSwing({ TDP: -3.0, YSRCP: 0.5, JSP: 2.5 });
      setTurnoutSettings({ urbanShift: 3, ruralShift: 0, femaleShift: 0 });
    } else if (presetKey === 'ysrcp_2029_resurgence') {
      // 7. 2029 YSRCP Resurgence (Agrarian & Welfare Backlash)
      reset.reddy = { TDP: -14, YSRCP: 14, JSP: 0 };
      reset.sc_mala = { TDP: -10, YSRCP: 10, JSP: 0 };
      reset.sc_madiga_relli = { TDP: -8, YSRCP: 8, JSP: 0 };
      reset.minority_muslim = { TDP: -12, YSRCP: 12, JSP: 0 };
      reset.minority_christian = { TDP: -14, YSRCP: 14, JSP: 0 };
      reset.bc_yadava = { TDP: -6, YSRCP: 6, JSP: 0 };
      setMacroSwing({ TDP: -6.5, YSRCP: 7.2, JSP: -2.0 });
      setTurnoutSettings({ urbanShift: -2, ruralShift: 4.5, femaleShift: 2 });
    } else if (presetKey === 'nda_2029_max_surge') {
      // 8. 2029 NDA Max Surge: Amaravati & Industrial Delivery Sweep (170+ seats)
      reset.kapu = { TDP: 8, YSRCP: -12, JSP: 4 };
      reset.kamma = { TDP: 10, YSRCP: -10, JSP: 0 };
      reset.bc_turpu_kapu = { TDP: 6, YSRCP: -6, JSP: 0 };
      reset.bc_yadava = { TDP: 5, YSRCP: -5, JSP: 0 };
      reset.bc_kuruba_boya = { TDP: 6, YSRCP: -6, JSP: 0 };
      reset.youth_18_25 = { TDP: 8, YSRCP: -10, JSP: 2 };
      setMacroSwing({ TDP: 3.5, YSRCP: -4.5, JSP: 1.0 });
      setTurnoutSettings({ urbanShift: 4, ruralShift: 1, femaleShift: 2 });
    }

    setSwings(reset);
  };

  // Run Simulation across all 175 Constituencies
  const simulatedResults: SimulatedConstituencyResult[] = useMemo(() => {
    const list: SimulatedConstituencyResult[] = [];

    const isHistorical = ['nda_2024_sweep', 'baseline', 'ysrcp_2019_wave', 'bifurcation_2014'].includes(activePreset);

    // If viewing official historical benchmark without manual customization, show certified historical results directly
    if (isHistorical && activeCustomizedCount === 0 && macroSwing.TDP === 0 && macroSwing.YSRCP === 0 && macroSwing.JSP === 0) {
      const targetYear = activePreset === 'ysrcp_2019_wave' ? '2019' : activePreset === 'bifurcation_2014' ? '2014' : '2024';
      const yearResults = activeElectionData?.results?.[targetYear];

      if (yearResults) {
        Object.values(data.constituencies).forEach((ac) => {
          const hist = yearResults[String(ac.ac_no)];
          if (hist) {
            const isFlipped = targetYear === '2024' ? false : (hist.winner.party !== ac.winner_2023.party);
            const tier: 'TOSS_UP' | 'LEAN' | 'SOLID' =
              hist.margin <= tossUpThreshold ? 'TOSS_UP' : hist.margin < 15000 ? 'LEAN' : 'SOLID';

            let maxComm = 'kapu';
            let maxPct = 0;
            Object.entries(ac.caste_profile).forEach(([k, v]) => {
              if (v > maxPct) {
                maxPct = v;
                maxComm = k;
              }
            });

            list.push({
              ac_no: ac.ac_no,
              ac_name: ac.ac_name,
              district: ac.district,
              reservation: ac.reservation,
              votes_2023: {
                winner_party: ac.winner_2023.party,
                runner_party: ac.runner_up_2023.party,
                margin: ac.margin_2023,
                margin_pct: ac.margin_pct_2023,
              },
              simulated: {
                winner_party: hist.winner.party,
                runner_party: hist.runner_up.party,
                winner_votes: hist.winner.votes,
                runner_votes: hist.runner_up.votes,
                margin: hist.margin,
                margin_pct: hist.margin_pct,
                party_votes: {
                  TDP: hist.winner.party === 'TDP' ? hist.winner.votes : hist.runner_up.party === 'TDP' ? hist.runner_up.votes : 0,
                  YSRCP: hist.winner.party === 'YSRCP' ? hist.winner.votes : hist.runner_up.party === 'YSRCP' ? hist.runner_up.votes : 0,
                  JSP: hist.winner.party === 'JSP' ? hist.winner.votes : hist.runner_up.party === 'JSP' ? hist.runner_up.votes : 0,
                  BJP: hist.winner.party === 'BJP' ? hist.winner.votes : hist.runner_up.party === 'BJP' ? hist.runner_up.votes : 0,
                  INC: hist.winner.party === 'INC' ? hist.winner.votes : hist.runner_up.party === 'INC' ? hist.runner_up.votes : 0,
                },
                is_flipped: isFlipped,
                flipped_from: isFlipped ? ac.winner_2023.party : undefined,
              },
              key_demographic: READABLE_COMMUNITY_NAMES[maxComm] || maxComm,
              key_demographic_pct: maxPct,
              battleground_tier: tier,
            });
          }
        });

        if (list.length === 175) {
          return list;
        }
      }
    }

    Object.values(data.constituencies).forEach((ac) => {
      const actualWinner = ac.winner_2023.party;
      const actualRunner = ac.runner_up_2023.party;
      const totalVotes = ac.total_votes_2023;

      const majorParties = ['TDP', 'YSRCP', 'JSP', 'BJP', 'INC'];
      const winnerIsMajor = majorParties.includes(actualWinner);
      const runnerIsMajor = majorParties.includes(actualRunner);

      const partyPairs: [string, number][] = [];
      if (!winnerIsMajor) partyPairs.push([actualWinner, ac.winner_2023.votes]);
      if (!runnerIsMajor) partyPairs.push([actualRunner, ac.runner_up_2023.votes]);

      const fallbackTdp = totalVotes * 0.44;
      const fallbackYsrcp = totalVotes * 0.39;
      const fallbackJsp = totalVotes * 0.08;
      const fallbackBjp = totalVotes * 0.04;
      const fallbackInc = totalVotes * 0.02;

      let tdpVotes = actualWinner === 'TDP' ? ac.winner_2023.votes : actualRunner === 'TDP' ? ac.runner_up_2023.votes : fallbackTdp;
      let ysrcpVotes = actualWinner === 'YSRCP' ? ac.winner_2023.votes : actualRunner === 'YSRCP' ? ac.runner_up_2023.votes : fallbackYsrcp;
      let jspVotes = actualWinner === 'JSP' ? ac.winner_2023.votes : actualRunner === 'JSP' ? ac.runner_up_2023.votes : fallbackJsp;
      let bjpVotes = actualWinner === 'BJP' ? ac.winner_2023.votes : actualRunner === 'BJP' ? ac.runner_up_2023.votes : fallbackBjp;
      let incVotes = actualWinner === 'INC' ? ac.winner_2023.votes : actualRunner === 'INC' ? ac.runner_up_2023.votes : fallbackInc;

      // Turnout & Mobilization Modeler
      const isUrban = URBAN_AC_NOS.has(ac.ac_no);
      const turnoutDiffPct = isUrban ? turnoutSettings.urbanShift : turnoutSettings.ruralShift;
      if (turnoutDiffPct !== 0) {
        const turnoutMultiplier = 1 + turnoutDiffPct / 100;
        tdpVotes *= turnoutMultiplier;
        ysrcpVotes *= turnoutMultiplier;
        jspVotes *= turnoutMultiplier;
        bjpVotes *= turnoutMultiplier;
      }

      // Female Mobilization (Aadabidda Nidhi & Super Six)
      if (turnoutSettings.femaleShift !== 0) {
        const femaleVoteShift = totalVotes * (turnoutSettings.femaleShift * 0.005);
        tdpVotes += femaleVoteShift * 0.70;
        jspVotes += femaleVoteShift * 0.30;
        ysrcpVotes -= femaleVoteShift;
      }

      // Apply community-weighted demographic swings
      const cp = ac.caste_profile;
      const ap = ac.age_profile;

      Object.entries(swings).forEach(([commKey, swingObj]) => {
        let weightPct = 0;
        if (commKey in cp) {
          weightPct = (cp as any)[commKey] || 0;
        } else if (commKey in ap) {
          weightPct = (ap as any)[commKey] || 0;
        }

        if (weightPct > 0) {
          const communityVoters = totalVotes * (weightPct / 100);
          const tdpShift = communityVoters * ((swingObj.TDP || 0) / 100);
          const ysrcpShift = communityVoters * ((swingObj.YSRCP || 0) / 100);
          const jspShift = communityVoters * ((swingObj.JSP || 0) / 100);

          tdpVotes += tdpShift;
          ysrcpVotes += ysrcpShift;
          jspVotes += jspShift;
        }
      });

      // Apply Statewide Uniform Macro Swing
      tdpVotes += totalVotes * ((macroSwing.TDP || 0) / 100);
      ysrcpVotes += totalVotes * ((macroSwing.YSRCP || 0) / 100);
      jspVotes += totalVotes * ((macroSwing.JSP || 0) / 100);

      // Seat Sharing & Coalition Dynamics across Presets
      if (activePreset === 'nda_2024_sweep' || activePreset === 'baseline') {
        // Exact official 2024 mandate - clean baseline without artificial double transfers
      } else if (activePreset === 'nda_2029_defense' || activePreset === 'nda_2029_max_surge') {
        const isJspContested = JSP_SEATS_2024.has(ac.ac_no);
        const isBjpContested = BJP_SEATS_2024.has(ac.ac_no);

        if (isJspContested) {
          // JSP candidate: TDP transfers to JSP
          const tdpPool = Math.max(0, tdpVotes);
          const transferRatio = coalitionSettings.tdpToJspTransferPct / 100;
          const leakRatio = coalitionSettings.rebelLeakagePct / 100;
          jspVotes += tdpPool * transferRatio;
          ysrcpVotes += tdpPool * leakRatio;
          tdpVotes = 0;
        } else if (isBjpContested) {
          // BJP candidate: TDP & JSP transfer to BJP
          const tdpPool = Math.max(0, tdpVotes);
          const transferRatio = coalitionSettings.ndaToBjpTransferPct / 100;
          const leakRatio = coalitionSettings.rebelLeakagePct / 100;
          bjpVotes += tdpPool * transferRatio;
          ysrcpVotes += tdpPool * leakRatio;
          tdpVotes = 0;
        } else {
          // TDP candidate: JSP transfers to TDP
          const jspPool = Math.max(0, jspVotes);
          const transferRatio = coalitionSettings.jspToTdpTransferPct / 100;
          const leakRatio = coalitionSettings.rebelLeakagePct / 100;
          tdpVotes += jspPool * transferRatio;
          ysrcpVotes += jspPool * leakRatio;
          jspVotes = 0;
        }
      } else if (activePreset === 'triangular_2029_solo' || activePreset === 'jsp_solo_split') {
        // Alliance Breaks: Janasena contests all 175 seats independently
        if (!JSP_SEATS_2024.has(ac.ac_no)) {
          const kapuShare = ((cp as any).kapu || 12.0) / 100;
          const youthShare = ((ap as any).youth_18_25 || 14.0) / 100;
          const jspBase = totalVotes * (kapuShare * 0.52 + youthShare * 0.32 + 0.04);
          tdpVotes = Math.max(0, tdpVotes - jspBase * 0.65);
          ysrcpVotes = Math.max(0, ysrcpVotes - jspBase * 0.35);
          jspVotes = jspBase;
        }
      } else if (activePreset === 'tdp_vs_jsp_bjp_2029') {
        // Realigned: JSP and BJP form an alliance against TDP and YSRCP across all 175 seats
        if (BJP_SEATS_2024.has(ac.ac_no)) {
          const jspPool = Math.max(0, jspVotes);
          bjpVotes += jspPool * 0.85;
          jspVotes = 0;
        } else {
          const bjpPool = Math.max(0, bjpVotes);
          jspVotes += bjpPool * 0.85;
          bjpVotes = 0;
          if (!JSP_SEATS_2024.has(ac.ac_no)) {
            const kapuShare = ((cp as any).kapu || 12.0) / 100;
            const youthShare = ((ap as any).youth_18_25 || 14.0) / 100;
            const jspBase = totalVotes * (kapuShare * 0.58 + youthShare * 0.32 + 0.05);
            tdpVotes = Math.max(0, tdpVotes - jspBase * 0.65);
            ysrcpVotes = Math.max(0, ysrcpVotes - jspBase * 0.35);
            jspVotes = jspBase;
          }
        }
      }

      // Candidate Fatigue & Incumbent MLA Replacement Simulator
      const isTargetWinner = actualWinner === mlaFatigueSettings.targetParty;
      if (isTargetWinner) {
        const isNarrowWin = ac.margin_2023 < 8000;
        const isUnpopular = isNarrowWin || ac.margin_pct_2023 < 5.0;

        if (mlaFatigueSettings.replaceIncumbentPct > 0) {
          const replacementChance = mlaFatigueSettings.replaceIncumbentPct / 50;
          if (isUnpopular && ((ac.ac_no * 7 + 13) % 100) / 100 <= replacementChance) {
            const boost = totalVotes * (mlaFatigueSettings.freshFaceBoost / 100);
            if (actualWinner === 'TDP') {
              tdpVotes += boost;
              ysrcpVotes -= boost;
            } else if (actualWinner === 'YSRCP') {
              ysrcpVotes += boost;
              tdpVotes -= boost;
            } else if (actualWinner === 'JSP') {
              jspVotes += boost;
              ysrcpVotes -= boost;
            }
          } else {
            const penalty = totalVotes * (Math.abs(mlaFatigueSettings.unpopularMlaPenalty) / 100);
            if (actualWinner === 'TDP') {
              tdpVotes -= penalty;
              ysrcpVotes += penalty;
            } else if (actualWinner === 'YSRCP') {
              ysrcpVotes -= penalty;
              tdpVotes += penalty;
            } else if (actualWinner === 'JSP') {
              jspVotes -= penalty;
              ysrcpVotes += penalty;
            }
          }
        }
      }

      // Andhra Pradesh Ground Realities & Crisis Modifiers
      // 1. Amaravati Capital Delivery Pace Slowdown
      if (groundCrisisSettings.amaravatiPaceSlowdown > 0 && AMARAVATI_CORE_AC_NOS.has(ac.ac_no)) {
        const cut = totalVotes * (groundCrisisSettings.amaravatiPaceSlowdown / 100);
        tdpVotes = Math.max(0, tdpVotes - cut);
        ysrcpVotes += cut;
      }

      // 2. Super Six Delivery Fiscal Delay
      if (groundCrisisSettings.superSixFiscalFriction) {
        const cut = totalVotes * 0.025;
        tdpVotes = Math.max(0, tdpVotes - (cut * 0.70));
        jspVotes = Math.max(0, jspVotes - (cut * 0.30));
        ysrcpVotes += cut;
      }

      // 3. Vizag Steel Plant Privatization Agitation
      if (groundCrisisSettings.vizagSteelPlantBacklash && VIZAG_STEEL_PLANT_AC_NOS.has(ac.ac_no)) {
        const cut = totalVotes * 0.040;
        tdpVotes = Math.max(0, tdpVotes - (cut * 0.60));
        bjpVotes = Math.max(0, bjpVotes - (cut * 0.40));
        ysrcpVotes += cut;
      }

      // 4. TDP vs Janasena Local Cadre Clashes
      if (groundCrisisSettings.tdpJspCadreClash > 0) {
        const friction = totalVotes * (groundCrisisSettings.tdpJspCadreClash / 100);
        tdpVotes = Math.max(0, tdpVotes - (friction * 0.60));
        jspVotes = Math.max(0, jspVotes - (friction * 0.40));
        ysrcpVotes += friction;
      }

      // 5. Red Book Politics Polarization
      if (groundCrisisSettings.redBookPolarization && ac.margin_2023 < 10000) {
        const cut = totalVotes * 0.020;
        tdpVotes = Math.max(0, tdpVotes - cut);
        ysrcpVotes += cut;
      }

      // 6. Rayalaseema Drought & Irrigation Grievance
      if (groundCrisisSettings.rayalaseemaWaterGrievance && RAYALASEEMA_DISTRICTS.has(ac.district)) {
        const cut = totalVotes * 0.035;
        tdpVotes = Math.max(0, tdpVotes - cut);
        ysrcpVotes += cut;
      }

      // Ensure positive integer votes
      tdpVotes = Math.max(0, Math.round(tdpVotes));
      ysrcpVotes = Math.max(0, Math.round(ysrcpVotes));
      jspVotes = Math.max(0, Math.round(jspVotes));
      bjpVotes = Math.max(0, Math.round(bjpVotes));
      incVotes = Math.max(0, Math.round(incVotes));

      // Add parties to ranking list
      if (tdpVotes > 0) partyPairs.push(['TDP', tdpVotes]);
      if (ysrcpVotes > 0) partyPairs.push(['YSRCP', ysrcpVotes]);
      if (jspVotes > 0) partyPairs.push(['JSP', jspVotes]);
      if (bjpVotes > 0) partyPairs.push(['BJP', bjpVotes]);
      if (incVotes > 0) partyPairs.push(['INC', incVotes]);
      partyPairs.sort((a, b) => b[1] - a[1]);

      const simWinner = partyPairs[0][0];
      const simWinnerVotes = partyPairs[0][1];
      const simRunner = partyPairs[1] ? partyPairs[1][0] : 'OTH';
      const simRunnerVotes = partyPairs[1] ? partyPairs[1][1] : 0;

      const margin = simWinnerVotes - simRunnerVotes;
      const marginPct = Number(((margin / Math.max(1, simWinnerVotes + simRunnerVotes)) * 100).toFixed(2));
      const isFlipped = simWinner !== actualWinner;

      let maxComm = 'kapu';
      let maxPct = 0;
      Object.entries(cp).forEach(([k, v]) => {
        if (v > maxPct) {
          maxPct = v;
          maxComm = k;
        }
      });

      const tier: 'TOSS_UP' | 'LEAN' | 'SOLID' =
        margin <= tossUpThreshold ? 'TOSS_UP' : margin < 15000 ? 'LEAN' : 'SOLID';

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
            TDP: tdpVotes,
            YSRCP: ysrcpVotes,
            JSP: jspVotes,
            BJP: bjpVotes,
            INC: incVotes,
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
    activeElectionData,
    activeCustomizedCount,
    swings,
    macroSwing,
    turnoutSettings,
    coalitionSettings,
    mlaFatigueSettings,
    groundCrisisSettings,
    tossUpThreshold,
    activePreset,
  ]);

  // Aggregate Path to 88 Majority Gauge (Andhra Pradesh 175 ACs)
  const tally = useMemo(() => {
    const counts: Record<string, number> = { TDP: 0, YSRCP: 0, JSP: 0, BJP: 0, INC: 0, OTH: 0 };
    let flippedCount = 0;
    let tossUpCount = 0;

    simulatedResults.forEach((r) => {
      counts[r.simulated.winner_party] = (counts[r.simulated.winner_party] || 0) + 1;
      if (r.simulated.is_flipped) flippedCount++;
      if (r.battleground_tier === 'TOSS_UP') tossUpCount++;
    });

    const ndaTotal = (counts.TDP || 0) + (counts.JSP || 0) + (counts.BJP || 0);

    return {
      counts,
      flippedCount,
      tossUpCount,
      ndaTotal,
      tdpDiff: (counts.TDP || 0) - 135,
      ysrcpDiff: (counts.YSRCP || 0) - 11,
      jspDiff: (counts.JSP || 0) - 21,
      bjpDiff: (counts.BJP || 0) - 8,
    };
  }, [simulatedResults]);

  // Generate what-if items summary for the active scenario
  const whatIfs = useMemo<ScenarioWhatIfItem[]>(() => {
    const list: ScenarioWhatIfItem[] = [];

    // 1. Coalition & Strategic Alignment What-If Badges
    if (activePreset === 'nda_2024_sweep' || activePreset === 'baseline') {
      list.push({
        id: 'nda_2024_base',
        label: '🤝 2024 Official Baseline (164 NDA / 11 YSRCP)',
        category: 'coalition',
        detail: 'Official 2024 election outcome without demographic swing offsets',
      });
    } else if (activePreset === 'ysrcp_2019_wave') {
      list.push({
        id: 'ysrcp_wave',
        label: '🌊 2019 YSRCP Wave Benchmark (151 Seats)',
        category: 'anti_incumbency',
        detail: 'Navaratnalu agrarian & welfare wave (49.9% vote share)',
      });
    } else if (activePreset === 'bifurcation_2014') {
      list.push({
        id: 'bifurcation_14',
        label: '⚖️ 2014 Bifurcation Mandate (106 NDA / 67 YSRCP)',
        category: 'coalition',
        detail: 'Post-bifurcation election: TDP (102) + BJP (4) = 106 seats vs YSRCP 67 & 2 OTH',
      });
    } else if (activePreset === 'nda_2029_defense') {
      list.push({
        id: 'nda_29_defense',
        label: '🛡️ 2029 NDA Alliance Defense (TDP+JSP+BJP Holds)',
        category: 'coalition',
        detail: `Pre-poll pact holds against natural 5-yr incumbency friction (-3.5% swing)`,
      });
    } else if (activePreset === 'triangular_2029_solo' || activePreset === 'jsp_solo_split') {
      list.push({
        id: 'jsp_solo_29',
        label: '💥 2029 Triangular Contest: TDP vs JSP vs YSRCP',
        category: 'coalition',
        detail: 'Alliance breaks: Janasena contests all 175 seats solo, dividing anti-YSRCP vote',
      });
    } else if (activePreset === 'tdp_vs_jsp_bjp_2029') {
      list.push({
        id: 'realigned_29',
        label: '🤝🔥 2029 Realigned: TDP Solo vs JSP+BJP vs YSRCP',
        category: 'coalition',
        detail: 'JSP and BJP contest in alliance against both TDP and YSRCP across all 175 seats',
      });
    } else if (activePreset === 'ysrcp_2029_resurgence') {
      list.push({
        id: 'ysrcp_resurgence_29',
        label: '⚡ 2029 YSRCP Agrarian & Welfare Resurgence',
        category: 'anti_incumbency',
        detail: 'Discontent over Super-Six execution and rural distress pushes YSRCP past 88 majority',
      });
    } else if (activePreset === 'nda_2029_max_surge') {
      list.push({
        id: 'nda_surge_29',
        label: '🎯 2029 NDA Max Delivery Surge (170+ Sweep)',
        category: 'coalition',
        detail: 'Amaravati delivery and mega industrial investments breach YSRCP last 11 bastions',
      });
    }

    // 2. Caste Blocs
    const modifiedCastes: string[] = [];
    if (swings.kapu?.TDP) modifiedCastes.push(`Kapu ${swings.kapu.TDP >= 0 ? '+' : ''}${swings.kapu.TDP}%`);
    if (swings.kamma?.TDP) modifiedCastes.push(`Kamma ${swings.kamma.TDP >= 0 ? '+' : ''}${swings.kamma.TDP}%`);
    if (swings.reddy?.YSRCP) modifiedCastes.push(`Reddy ${swings.reddy.YSRCP >= 0 ? '+' : ''}${swings.reddy.YSRCP}%`);
    if (swings.bc_turpu_kapu?.TDP) modifiedCastes.push(`Turpu Kapu ${swings.bc_turpu_kapu.TDP >= 0 ? '+' : ''}${swings.bc_turpu_kapu.TDP}%`);
    if (swings.bc_yadava?.TDP) modifiedCastes.push(`Yadava ${swings.bc_yadava.TDP >= 0 ? '+' : ''}${swings.bc_yadava.TDP}%`);

    if (modifiedCastes.length > 0) {
      list.push({
        id: 'caste_swings',
        label: `👥 Castes: ${modifiedCastes.slice(0, 2).join(', ')}${modifiedCastes.length > 2 ? ` +${modifiedCastes.length - 2}` : ''}`,
        category: 'caste_blocs',
        detail: modifiedCastes.join(' | '),
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

    // 4. Macro
    if (macroSwing.TDP !== 0 || macroSwing.YSRCP !== 0 || macroSwing.JSP !== 0) {
      list.push({
        id: 'macro_swing',
        label: `📉 Macro: TDP ${macroSwing.TDP >= 0 ? '+' : ''}${macroSwing.TDP}% | YSRCP ${macroSwing.YSRCP >= 0 ? '+' : ''}${macroSwing.YSRCP}% | JSP ${macroSwing.JSP >= 0 ? '+' : ''}${macroSwing.JSP}%`,
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

    // 6. AP Ground Crises
    if (groundCrisisSettings.amaravatiPaceSlowdown > 0) {
      list.push({
        id: 'crisis_amaravati',
        label: `🏗️ Amaravati: -${groundCrisisSettings.amaravatiPaceSlowdown}% Capital`,
        category: 'anti_incumbency',
        detail: 'Delivery timeline fatigue across 18 capital ACs',
      });
    }
    if (groundCrisisSettings.superSixFiscalFriction) {
      list.push({
        id: 'crisis_super_six',
        label: '💰 Super Six: Fiscal Strain',
        category: 'anti_incumbency',
        detail: '-2.5% rural welfare delay penalty',
      });
    }
    if (groundCrisisSettings.vizagSteelPlantBacklash) {
      list.push({
        id: 'crisis_vizag_steel',
        label: '🏭 Vizag Steel: Disinvestment Friction',
        category: 'anti_incumbency',
        detail: '-4.0% penalty across Gajuwaka & Vizag urban ACs',
      });
    }
    if (groundCrisisSettings.tdpJspCadreClash > 0) {
      list.push({
        id: 'crisis_cadre_clash',
        label: `🤝 TDP-JSP Clash: -${groundCrisisSettings.tdpJspCadreClash}% Local`,
        category: 'anti_incumbency',
        detail: 'Domination rivalry and mutual cross-voting',
      });
    }
    if (groundCrisisSettings.redBookPolarization) {
      list.push({
        id: 'crisis_red_book',
        label: '📕 Red Book: Polarization',
        category: 'anti_incumbency',
        detail: 'Factional retribution consolidating YSRCP sympathy',
      });
    }
    if (groundCrisisSettings.rayalaseemaWaterGrievance) {
      list.push({
        id: 'crisis_seema_water',
        label: '🌾 Seema Irrigation: -3.5% Drought',
        category: 'anti_incumbency',
        detail: 'Handri-Neeva & canal water anxiety in 52 ACs',
      });
    }

    return list;
  }, [
    activePreset,
    coalitionSettings,
    swings,
    turnoutSettings,
    macroSwing,
    mlaFatigueSettings,
    groundCrisisSettings,
  ]);

  // Synchronize with parent app bridge
  useEffect(() => {
    if (!onBridgeChange) return;

    let scenarioName = '🤝 2024 NDA Mandate (164 Seats)';
    if (activePreset === 'nda_2024_sweep' || activePreset === 'baseline') scenarioName = '🤝 2024 Actual Mandate (164 Seats)';
    else if (activePreset === 'ysrcp_2019_wave') scenarioName = '🌊 2019 YSRCP Wave Benchmark (151 Seats)';
    else if (activePreset === 'bifurcation_2014') scenarioName = '⚖️ 2014 Post-Bifurcation Mandate (106 Seats)';
    else if (activePreset === 'nda_2029_defense') scenarioName = '🛡️ 2029 NDA Defense (Alliance Holds)';
    else if (activePreset === 'triangular_2029_solo' || activePreset === 'jsp_solo_split') scenarioName = '💥 2029 Triangular: TDP vs JSP vs YSRCP';
    else if (activePreset === 'tdp_vs_jsp_bjp_2029') scenarioName = '🤝🔥 2029 Realigned: TDP Solo vs JSP+BJP vs YSRCP';
    else if (activePreset === 'ysrcp_2029_resurgence') scenarioName = '⚡ 2029 YSRCP Resurgence (Welfare Backlash)';
    else if (activePreset === 'nda_2029_max_surge' || activePreset === 'nda_super_wave') scenarioName = '🎯 2029 NDA Max Surge (170+ Clean Sweep)';
    else if (activePreset === 'custom') scenarioName = '⚙️ Custom AP Strategic Scenario';

    onBridgeChange({
      id: activePreset,
      name: scenarioName,
      description: 'Simulated 175-AC Andhra Pradesh election projection with active political modifiers',
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
      <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
        {/* Title & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white font-mono text-xs font-black px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3" /> AP CHIEF ADVISOR WAR ROOM
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                175 ACs &middot; 26 Reorganized Districts &middot; 88 to Majority
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Assembly Majority Barometer &amp; Battleground Simulator
            </h2>
          </div>

          {onExportToActions && (
            <button
              onClick={onExportToActions}
              className="px-3.5 py-1.5 text-xs rounded-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              title="Export this simulation scenario to Actions & Playbook"
            >
              <span>Export to Actions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Strategic Presets: 2 Dedicated Structured Rows */}
        <div className="space-y-3 bg-slate-50/80 p-3.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          {/* Row 1: Past Mandates & Historical Benchmarks */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 font-mono flex items-center gap-1.5 min-w-[170px]">
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Historical Benchmarks:</span>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => applyPreset('nda_2024_sweep')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activePreset === 'nda_2024_sweep'
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/50 font-black'
                      : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
                  }`}
                  title="2024 Actual Mandate: TDP 135 + JSP 21 + BJP 8 = 164 seats vs YSRCP 11"
                >
                  <Handshake className="w-3.5 h-3.5 text-amber-300" />
                  <span>🤝 2024 Actual Mandate (164)</span>
                </button>
                <button
                  onClick={() => applyPreset('ysrcp_2019_wave')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activePreset === 'ysrcp_2019_wave'
                      ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-400/50 font-black'
                      : 'bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-900 border border-slate-200'
                  }`}
                  title="2019 YSRCP Landslide benchmark: 151 seats, 49.9% vote share"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>🌊 2019 YSRCP Wave (151)</span>
                </button>
                <button
                  onClick={() => applyPreset('bifurcation_2014')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activePreset === 'bifurcation_2014'
                      ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400/50 font-black'
                      : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
                  }`}
                  title="2014 Post-Bifurcation Mandate: TDP 102 + BJP 4 = 106 seats vs YSRCP 67 (and 2 OTH)"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>⚖️ 2014 Bifurcation Mandate (106)</span>
                </button>
                <button
                  onClick={() => applyPreset('baseline')}
                  className={`px-2.5 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    activePreset === 'baseline'
                      ? 'bg-slate-800 text-white shadow-xs font-black'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                  title="Reset all swings to 2024 baseline (TDP 135, JSP 21, BJP 8, YSRCP 11)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-500 font-medium hidden xl:inline">Official ECI Certified Returns</span>
          </div>

          <div className="border-t border-slate-200/70" />

          {/* Row 2: 2029 Strategic Future Scenarios & Coalition Formations */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-950 font-mono flex items-center gap-1.5 min-w-[170px]">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>2029 Strategic Scenarios:</span>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => applyPreset('nda_2029_defense')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activePreset === 'nda_2029_defense'
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/50 font-black'
                      : 'bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200'
                  }`}
                  title="2029 Pre-poll alliance holds: TDP + JSP + BJP collective defense against 5-yr anti-incumbency (-3.5% swing)"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>🛡️ 2029 NDA Defense (Alliance Holds)</span>
                </button>

                <button
                  onClick={() => applyPreset('triangular_2029_solo')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activePreset === 'triangular_2029_solo' || activePreset === 'jsp_solo_split'
                      ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/50 font-black'
                      : 'bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-900 border border-slate-200'
                  }`}
                  title="2029 Alliance Breaks: Janasena contests all 175 ACs solo, dividing Kapu and youth vote pools"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>💥 2029 Triangular: TDP vs JSP vs YSRCP</span>
                </button>

                <button
                  onClick={() => applyPreset('tdp_vs_jsp_bjp_2029')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activePreset === 'tdp_vs_jsp_bjp_2029'
                      ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400/50 font-black'
                      : 'bg-white text-slate-700 hover:bg-purple-50 hover:text-purple-900 border border-slate-200'
                  }`}
                  title="2029 Realigned: JSP and BJP form alliance against TDP and YSRCP across all 175 seats"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>🤝🔥 2029 Realigned: TDP Solo vs JSP+BJP</span>
                </button>

                <button
                  onClick={() => applyPreset('ysrcp_2029_resurgence')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activePreset === 'ysrcp_2029_resurgence'
                      ? 'bg-sky-700 text-white shadow-sm ring-2 ring-sky-400/50 font-black'
                      : 'bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-900 border border-slate-200'
                  }`}
                  title="2029 Agrarian & Welfare Backlash: Discontent over Super-Six execution and rural distress pushes YSRCP past 88"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>⚡ 2029 YSRCP Resurgence</span>
                </button>

                <button
                  onClick={() => applyPreset('nda_2029_max_surge')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activePreset === 'nda_2029_max_surge' || activePreset === 'nda_super_wave'
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/50 font-black'
                      : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
                  }`}
                  title="2029 NDA Max Surge: Amaravati delivery & mega-industrial push crushes YSRCP to single digits (170+ sweep)"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>🎯 2029 NDA Max Surge (170+)</span>
                </button>
              </div>
            </div>
            <span className="text-[11px] font-mono text-indigo-700 font-bold hidden xl:inline">Forward War Room Models</span>
          </div>
        </div>

        {/* Real-time Explanatory Strategic Barometer Banner for Active Preset */}
        {(activePreset === 'nda_2024_sweep' || activePreset === 'baseline') && (
          <div className="px-4 py-2.5 bg-amber-50/90 rounded-xl border border-amber-200 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <span className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>2024 Actual Mandate (164 NDA / 11 YSRCP):</strong> Official pre-poll alliance (TDP 135 + JSP 21 + BJP 8) secured 55.4% vote share with clean transfers across Coastal Andhra & Rayalaseema.
              </span>
            </span>
            <span className="text-[11px] bg-amber-100 text-amber-900 font-mono px-2.5 py-0.5 rounded border border-amber-300 font-bold">
              88 Majority Mark &middot; 164 Baseline
            </span>
          </div>
        )}

        {activePreset === 'ysrcp_2019_wave' && (
          <div className="px-4 py-2.5 bg-sky-50/90 rounded-xl border border-sky-200 text-xs text-sky-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <span className="font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                <strong>2019 YSRCP Wave Benchmark (151 Seats / 49.9% Vote Share):</strong> Y.S. Jagan Mohan Reddy's historic wave propelled by Navaratnalu, rural consolidation, and a fractured opposition (TDP 23, JSP 1).
              </span>
            </span>
            <span className="text-[11px] bg-sky-100 text-sky-900 font-mono px-2.5 py-0.5 rounded border border-sky-300 font-bold">
              151 AC Benchmark
            </span>
          </div>
        )}

        {activePreset === 'bifurcation_2014' && (
          <div className="px-4 py-2.5 bg-emerald-50/90 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <span className="font-semibold flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>2014 Bifurcation Mandate (106 NDA / 67 YSRCP / 2 OTH):</strong> Post-bifurcation election where TDP (102) &amp; BJP (4) won 106 seats with Pawan Kalyan's JSP supporting from outside, while YSRCP won 67 seats (and 2 seats won by Independents/Others in Chirala &amp; Pithapuram).
              </span>
            </span>
            <span className="text-[11px] bg-emerald-100 text-emerald-900 font-mono px-2.5 py-0.5 rounded border border-emerald-300 font-bold">
              106 AC Bifurcation Mandate
            </span>
          </div>
        )}

        {activePreset === 'nda_2029_defense' && (
          <div className="px-4 py-2.5 bg-indigo-50/90 rounded-xl border border-indigo-200 text-xs text-indigo-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <span className="font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                <strong>2029 NDA Defense (Alliance Holds):</strong> TDP, JSP, and BJP contest collectively under the 2024 seat-sharing pact. Natural 5-year anti-incumbency (-3.5% swing) is checked by alliance cohesion and candidate surgery.
              </span>
            </span>
            <span className="text-[11px] bg-indigo-100 text-indigo-900 font-mono px-2.5 py-0.5 rounded border border-indigo-300 font-bold">
              Pre-poll Alliance Holds
            </span>
          </div>
        )}

        {(activePreset === 'triangular_2029_solo' || activePreset === 'jsp_solo_split') && (
          <div className="px-4 py-2.5 bg-rose-50/90 rounded-xl border border-rose-200 text-xs text-rose-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <span className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>2029 Triangular Contest (TDP vs JSP vs YSRCP):</strong> Alliance collapses &mdash; Janasena contests all 175 ACs solo. JSP captures ~18&ndash;24% Kapu &amp; youth vote share, splitting anti-YSRCP votes and generating volatile 3-corner dogfights.
              </span>
            </span>
            <span className="text-[11px] bg-rose-100 text-rose-900 font-mono px-2.5 py-0.5 rounded border border-rose-300 font-bold">
              175 AC JSP Solo Contest
            </span>
          </div>
        )}

        {activePreset === 'tdp_vs_jsp_bjp_2029' && (
          <div className="px-4 py-2.5 bg-purple-50/90 rounded-xl border border-purple-200 text-xs text-purple-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <span className="font-semibold flex items-center gap-2">
              <Flame className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                <strong>2029 Realigned 3-Way War (TDP Solo vs JSP+BJP vs YSRCP):</strong> Janasena and BJP partner against TDP statewide. JSP+BJP consolidates urban, youth, and Kapu pockets, confronting TDP in Coastal Andhra while YSRCP tests rural bastions.
              </span>
            </span>
            <span className="text-[11px] bg-purple-100 text-purple-900 font-mono px-2.5 py-0.5 rounded border border-purple-300 font-bold">
              JSP + BJP Alliance vs TDP &amp; YSRCP
            </span>
          </div>
        )}

        {activePreset === 'ysrcp_2029_resurgence' && (
          <div className="px-4 py-2.5 bg-sky-50/90 rounded-xl border border-sky-200 text-xs text-sky-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <span className="font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-sky-700 shrink-0" />
              <span>
                <strong>2029 YSRCP Agrarian &amp; Welfare Resurgence:</strong> Backlash over Super-Six delivery friction, welfare delay, and rural water grievances flips 30+ rural battlegrounds back to YSRCP past the 88-seat majority line.
              </span>
            </span>
            <span className="text-[11px] bg-sky-100 text-sky-900 font-mono px-2.5 py-0.5 rounded border border-sky-300 font-bold">
              Welfare Discontent Swing
            </span>
          </div>
        )}

        {(activePreset === 'nda_2029_max_surge' || activePreset === 'nda_super_wave') && (
          <div className="px-4 py-2.5 bg-amber-50/90 rounded-xl border border-amber-200 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <span className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>2029 NDA Max Surge (170+ Clean Sweep):</strong> Completion of Amaravati Phase 1, Polavaram milestones, and industrial investments generate a pro-incumbency wave, breaching YSRCP's last 11 bastions.
              </span>
            </span>
            <span className="text-[11px] bg-amber-100 text-amber-900 font-mono px-2.5 py-0.5 rounded border border-amber-300 font-bold">
              170+ Seat Clean Sweep
            </span>
          </div>
        )}

        {/* Real-time 6-Card AP Assembly Barometer */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-4">
          {/* Card 1: NDA Combined Total */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-slate-50 p-3.5 rounded-xl border border-amber-300 shadow-xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-xs text-amber-900 mb-1">
              <span className="font-black flex items-center gap-1.5 text-slate-900">
                <Handshake className="w-4 h-4 text-amber-600" />
                NDA Alliance
              </span>
              <span className="text-[10px] font-bold font-mono text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                88 Majority
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{tally.ndaTotal}</span>
              <span className="text-xs">
                {tally.ndaTotal >= 88 ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Majority (+{tally.ndaTotal - 88})
                  </span>
                ) : (
                  <span className="text-rose-700 font-bold">-{88 - tally.ndaTotal} to 88</span>
                )}
              </span>
            </div>
            <div className="text-[10px] text-amber-900 font-mono mt-1 font-semibold truncate">
              TDP: {tally.counts.TDP} | JSP: {tally.counts.JSP} | BJP: {tally.counts.BJP}
            </div>
          </div>

          {/* Card 2: TDP */}
          <div className="bg-slate-50 hover:bg-amber-50/50 transition-colors p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFCC00] border border-amber-400" />
                TDP
              </span>
              <span className={`text-[10px] font-bold font-mono ${tally.tdpDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {tally.tdpDiff >= 0 ? `+${tally.tdpDiff}` : tally.tdpDiff} vs 2024
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{tally.counts.TDP}</span>
              <span className="text-xs text-slate-500">
                {tally.counts.TDP >= 88 ? (
                  <span className="text-emerald-700 font-bold">Solo Majority</span>
                ) : (
                  <span>Seats</span>
                )}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">
              Kosta &amp; Seema Strongholds
            </div>
          </div>

          {/* Card 3: YSRCP */}
          <div className="bg-slate-50 hover:bg-sky-50/50 transition-colors p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-bold flex items-center gap-1.5 text-sky-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#004B87]" />
                YSRCP
              </span>
              <span className={`text-[10px] font-bold font-mono ${tally.ysrcpDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {tally.ysrcpDiff >= 0 ? `+${tally.ysrcpDiff}` : tally.ysrcpDiff} vs 2024
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{tally.counts.YSRCP}</span>
              <span className="text-xs text-slate-500">
                {tally.counts.YSRCP >= 88 ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3 text-emerald-600" /> Majority
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold">-{88 - tally.counts.YSRCP} to Maj</span>
                )}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">
              Opposition Baseline (11)
            </div>
          </div>

          {/* Card 4: JSP */}
          <div className="bg-slate-50 hover:bg-rose-50/50 transition-colors p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-bold flex items-center gap-1.5 text-rose-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E61A24]" />
                JSP
              </span>
              <span className={`text-[10px] font-bold font-mono ${tally.jspDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {tally.jspDiff >= 0 ? `+${tally.jspDiff}` : tally.jspDiff} vs 2024
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{tally.counts.JSP}</span>
              <span className="text-xs text-slate-500">
                {tally.counts.JSP >= 21 ? '100% Strike Base' : 'Seats'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">
              Godavari &amp; Uttarandhra
            </div>
          </div>

          {/* Card 5: BJP */}
          <div className="bg-slate-50 hover:bg-orange-50/50 transition-colors p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-bold flex items-center gap-1.5 text-orange-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933]" />
                BJP
              </span>
              <span className={`text-[10px] font-bold font-mono ${tally.bjpDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {tally.bjpDiff >= 0 ? `+${tally.bjpDiff}` : tally.bjpDiff} vs 2024
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{tally.counts.BJP}</span>
              <span className="text-xs text-slate-500">
                {tally.counts.BJP >= 8 ? '8 Won Base' : 'Seats'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">
              Urban &amp; Alliance ACs
            </div>
          </div>

          {/* Card 6: Triage & Flips Alert */}
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
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">
              Targeted Interventions
            </div>
          </div>
        </div>
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
            Constituency Triage Matrix &amp; Projected Outcomes (175 ACs)
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
                    All 175 ACs
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
                <text x="15" y="45" fill="#ca8a04" fontSize="10" fontWeight="bold">
                  ▲ TDP/NDA Lead
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

                <text x="15" y="325" fill="#0284c7" fontSize="10" fontWeight="bold">
                  ▼ YSRCP Lead
                </text>
                <text x="15" y="340" fill="#94a3b8" fontSize="9" fontWeight="500">
                  -{tierFilter === 'TOSS_UP' ? (tossUpThreshold >= 1000 ? `${(tossUpThreshold/1000).toFixed(0)}k` : tossUpThreshold) : '25k'}
                </text>

                {/* X-Axis Labels */}
                <text x="80" y="368" fill="#94a3b8" fontSize="10" fontWeight="500">
                  ← Uttarandhra (Srikakulam, Vizianagaram, Vizag)
                </text>
                <text x="560" y="368" fill="#94a3b8" fontSize="10" fontWeight="500">
                  Rayalaseema (Kurnool, Kadapa, Chittoor) →
                </text>

                {/* Render Bubbles */}
                {filteredList.map((ac) => {
                  // X positioned by AC number 1..175 across width 80..770
                  const cx = 80 + (ac.ac_no / 176) * 690;

                  // Y positioned by simulated margin:
                  // When looking at toss-ups, scale dynamically to tossUpThreshold so bubbles use full vertical range!
                  const maxMarginScale = tierFilter === 'TOSS_UP' ? Math.max(2500, tossUpThreshold) : 25000;
                  const isNda = ac.simulated.winner_party === 'TDP' || ac.simulated.winner_party === 'JSP' || ac.simulated.winner_party === 'BJP';
                  const signedMargin = isNda ? ac.simulated.margin : -ac.simulated.margin;
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
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFCC00] border border-amber-400" /> TDP
                  <span className="w-2.5 h-2.5 rounded-full bg-[#004B87]" /> YSRCP
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E61A24]" /> JSP
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
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">2024 ECI Baseline</span>
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
                        <span className="text-amber-700">TDP {selectedConstituency.simulated.party_votes.TDP?.toLocaleString()}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-sky-800">YSRCP {selectedConstituency.simulated.party_votes.YSRCP?.toLocaleString()}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-rose-700">JSP {selectedConstituency.simulated.party_votes.JSP?.toLocaleString()}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-orange-700">BJP {selectedConstituency.simulated.party_votes.BJP?.toLocaleString()}</span>
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
                    <th className="py-2 px-3">2024 Actual</th>
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
