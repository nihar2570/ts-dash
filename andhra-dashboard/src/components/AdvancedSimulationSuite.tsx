import React, { useState, useMemo, useEffect } from 'react';
import type { SeeepcDataset, SimulatedConstituencyResult } from '../types';
import type { MacroSwing, PartySwing } from './SwingStudioModal';
import {
  Handshake,
  Users,
  TrendingDown,
  Crosshair,
  Dices,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Sliders,
  Building2,
  Flame,
  ShieldAlert,
  Scale,
  GraduationCap,
  Car,
  Trees,
} from 'lucide-react';
import type {
  CoalitionSettings,
  MlaFatigueSettings,
  GroundCrisisSettings,
} from './StrategicSimulationModels';
import {
  DEFAULT_COALITION_SETTINGS,
  DEFAULT_GROUND_CRISIS_SETTINGS,
} from './StrategicSimulationModels';

export interface TurnoutSettings {
  urbanShift: number;   // -15% to +15%
  ruralShift: number;   // -10% to +10%
  femaleShift: number;  // -8% to +8%
}

export interface AdvancedSimulationSuiteProps {
  data: SeeepcDataset;
  simulatedResults: SimulatedConstituencyResult[];
  activePreset: string;
  onApplyPreset: (presetKey: string) => void;
  swings: Record<string, PartySwing>;
  setSwings: React.Dispatch<React.SetStateAction<Record<string, PartySwing>>>;
  macroSwing: MacroSwing;
  setMacroSwing: React.Dispatch<React.SetStateAction<MacroSwing>>;
  turnoutSettings: TurnoutSettings;
  setTurnoutSettings: React.Dispatch<React.SetStateAction<TurnoutSettings>>;
  coalitionSettings: CoalitionSettings;
  setCoalitionSettings: React.Dispatch<React.SetStateAction<CoalitionSettings>>;
  mlaFatigueSettings: MlaFatigueSettings;
  setMlaFatigueSettings: React.Dispatch<React.SetStateAction<MlaFatigueSettings>>;
  groundCrisisSettings: GroundCrisisSettings;
  setGroundCrisisSettings: React.Dispatch<React.SetStateAction<GroundCrisisSettings>>;
  onNavigateToActions: (acNo?: number) => void;
  onOpenDemographicStudio?: () => void;
  activeCustomizedCount?: number;
  requestedTab?: WhatIfTab;
  onTabChange?: (tab: WhatIfTab) => void;
}

export type WhatIfTab =
  | 'caste_blocs'
  | 'coalition'
  | 'turnout'
  | 'anti_incumbency'
  | 'target_60';

// Standard normal distribution generator using Box-Muller transform
function gaussianRandom(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Urban constituency numbers (Key municipal corporations & urban industrial belts in Andhra Pradesh)
export const URBAN_AC_NOS = new Set([
  // Visakhapatnam Greater Corporation (21, 22, 23, 24, 25)
  21, 22, 23, 24, 25,
  // Vijayawada Municipal Corporation (79, 80, 81)
  79, 80, 81,
  // Guntur City (94, 95) & Tenali (91)
  94, 95, 91,
  // Godavari Urban Centers: Kakinada City (41), Rajahmundry City (50), Bhimavaram (59), Eluru (65)
  41, 50, 59, 65,
  // Rayalaseema Urban Centers: Kurnool (137), Tirupati (167), Kadapa (126), Anantapur Urban (153), Nandyal (139), Proddatur (132), Hindupur (157), Adoni (146)
  137, 167, 126, 153, 139, 132, 157, 146,
  // South Coastal Urban Centers: Nellore City (117), Ongole (108), Machilipatnam (75)
  117, 108, 75,
  // North Coastal Urban Centers: Vizianagaram (18), Srikakulam (5)
  18, 5,
]);

export const AdvancedSimulationSuite: React.FC<AdvancedSimulationSuiteProps> = ({
  data: _data,
  simulatedResults,
  activePreset,
  onApplyPreset,
  swings,
  setSwings,
  macroSwing,
  setMacroSwing,
  turnoutSettings,
  setTurnoutSettings,
  coalitionSettings,
  setCoalitionSettings,
  mlaFatigueSettings,
  setMlaFatigueSettings,
  groundCrisisSettings,
  setGroundCrisisSettings,
  onNavigateToActions,
  onOpenDemographicStudio,
  activeCustomizedCount = 0,
  requestedTab,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<WhatIfTab>(requestedTab || 'caste_blocs');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const activeCrisisCount = useMemo(() => {
    let c = 0;
    if (groundCrisisSettings.amaravatiPaceSlowdown > 0) c++;
    if (groundCrisisSettings.superSixFiscalFriction) c++;
    if (groundCrisisSettings.vizagSteelPlantBacklash) c++;
    if (groundCrisisSettings.redBookPolarization) c++;
    if (groundCrisisSettings.tdpJspCadreClash > 0) c++;
    if (groundCrisisSettings.rayalaseemaWaterGrievance) c++;
    return c;
  }, [groundCrisisSettings]);

  useEffect(() => {
    if (requestedTab) {
      setActiveTab(requestedTab);
      setIsCollapsed(false);
    }
  }, [requestedTab]);

  const handleSelectTab = (tab: WhatIfTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };
  const [pollingErrorSigma, setPollingErrorSigma] = useState<number>(3.0);
  const [simulationSeed, setSimulationSeed] = useState<number>(1);
  const [targetParty, setTargetParty] = useState<'TDP' | 'YSRCP' | 'JSP' | 'BJP'>('TDP');

  // Real-time seat tallies from compounded results
  const simulatedPartyTally = useMemo(() => {
    const tally: Record<string, number> = { TDP: 0, YSRCP: 0, JSP: 0, BJP: 0, INC: 0, Others: 0 };
    let totalFlips = 0;
    simulatedResults.forEach((r) => {
      const p = r.simulated.winner_party;
      tally[p] = (tally[p] || 0) + 1;
      if (r.simulated.is_flipped) totalFlips++;
    });
    return { tally, totalFlips };
  }, [simulatedResults]);

  // Target 88 Goal-Seek Reverse Optimizer Plan (Andhra Pradesh 175 ACs)
  const target88Plan = useMemo(() => {
    const wonList: SimulatedConstituencyResult[] = [];
    const targetOpportunities: {
      result: SimulatedConstituencyResult;
      deficitVotes: number;
      pctDeficit: number;
      dominantCommunity: string;
      dominantCommunityPct: number;
    }[] = [];

    simulatedResults.forEach((r) => {
      if (r.simulated.winner_party === targetParty) {
        wonList.push(r);
      } else {
        const total = r.simulated.winner_votes + r.simulated.runner_votes || 180000;
        const targetVotes = r.simulated.party_votes[targetParty] || 0;
        const deficitVotes = Math.max(0, r.simulated.winner_votes - targetVotes);
        const pctDeficit = Math.round((deficitVotes / total) * 1000) / 10;
        targetOpportunities.push({
          result: r,
          deficitVotes,
          pctDeficit,
          dominantCommunity: r.key_demographic,
          dominantCommunityPct: r.key_demographic_pct,
        });
      }
    });

    targetOpportunities.sort((a, b) => a.deficitVotes - b.deficitVotes);
    const needed = Math.max(0, 88 - wonList.length);
    const pickupSeats = targetOpportunities.slice(0, Math.min(needed > 0 ? needed : 15, targetOpportunities.length));
    const avgDeficit =
      pickupSeats.length > 0
        ? Math.round(pickupSeats.reduce((acc, p) => acc + p.deficitVotes, 0) / pickupSeats.length)
        : 0;

    return {
      wonCount: wonList.length,
      needed,
      pickupSeats,
      avgDeficit,
    };
  }, [simulatedResults, targetParty]);

  // Monte Carlo 1,000-Run Volatility Engine for Andhra Pradesh (175 ACs, 88 to Majority)
  const monteCarloStats = useMemo(() => {
    void simulationSeed;
    const runs = 1000;
    const tdpSeats: number[] = [];
    const ysrcpSeats: number[] = [];
    const jspSeats: number[] = [];
    const bjpSeats: number[] = [];
    let tdpWins = 0;
    let ysrcpWins = 0;
    let ndaWins = 0;
    let hungCount = 0;

    for (let r = 0; r < runs; r++) {
      const stateErrTdp = gaussianRandom() * (pollingErrorSigma * 0.7);
      const stateErrYsrcp = gaussianRandom() * (pollingErrorSigma * 0.7);
      const stateErrJsp = gaussianRandom() * (pollingErrorSigma * 0.6);
      const stateErrBjp = gaussianRandom() * (pollingErrorSigma * 0.5);

      let runTdpSeats = 0;
      let runYsrcpSeats = 0;
      let runJspSeats = 0;
      let runBjpSeats = 0;

      for (let i = 0; i < simulatedResults.length; i++) {
        const item = simulatedResults[i];
        const votes = item.simulated.party_votes;
        const localNoiseTdp = gaussianRandom() * (pollingErrorSigma * 0.5);
        const localNoiseYsrcp = gaussianRandom() * (pollingErrorSigma * 0.5);
        const localNoiseJsp = gaussianRandom() * (pollingErrorSigma * 0.5);
        const localNoiseBjp = gaussianRandom() * (pollingErrorSigma * 0.5);

        const vTdp = (votes.TDP || 0) * (1 + (stateErrTdp + localNoiseTdp) / 100);
        const vYsrcp = (votes.YSRCP || 0) * (1 + (stateErrYsrcp + localNoiseYsrcp) / 100);
        const vJsp = (votes.JSP || 0) * (1 + (stateErrJsp + localNoiseJsp) / 100);
        const vBjp = (votes.BJP || 0) * (1 + (stateErrBjp + localNoiseBjp) / 100);

        const maxVotes = Math.max(vTdp, vYsrcp, vJsp, vBjp);
        if (maxVotes === vTdp) runTdpSeats++;
        else if (maxVotes === vYsrcp) runYsrcpSeats++;
        else if (maxVotes === vJsp) runJspSeats++;
        else if (maxVotes === vBjp) runBjpSeats++;
      }

      tdpSeats.push(runTdpSeats);
      ysrcpSeats.push(runYsrcpSeats);
      jspSeats.push(runJspSeats);
      bjpSeats.push(runBjpSeats);

      const runNdaSeats = runTdpSeats + runJspSeats + runBjpSeats;
      if (runTdpSeats >= 88) tdpWins++;
      if (runYsrcpSeats >= 88) ysrcpWins++;

      if (runNdaSeats >= 88) {
        ndaWins++;
      } else if (runYsrcpSeats < 88) {
        hungCount++;
      }
    }

    tdpSeats.sort((a, b) => a - b);
    ysrcpSeats.sort((a, b) => a - b);
    jspSeats.sort((a, b) => a - b);
    bjpSeats.sort((a, b) => a - b);

    return {
      runs,
      tdp: {
        median: tdpSeats[Math.floor(runs / 2)],
        p10: tdpSeats[Math.floor(runs * 0.1)],
        p90: tdpSeats[Math.floor(runs * 0.9)],
        winProb: Math.round((tdpWins / runs) * 100),
      },
      ysrcp: {
        median: ysrcpSeats[Math.floor(runs / 2)],
        p10: ysrcpSeats[Math.floor(runs * 0.1)],
        p90: ysrcpSeats[Math.floor(runs * 0.9)],
        winProb: Math.round((ysrcpWins / runs) * 100),
      },
      nda: {
        winProb: Math.round((ndaWins / runs) * 100),
      },
      hungProb: Math.round((hungCount / runs) * 100),
    };
  }, [simulatedResults, pollingErrorSigma, simulationSeed]);

  const isCoalitionActive = [
    'nda_2024_sweep',
    'nda_2029_defense',
    'nda_2029_max_surge',
    'nda_super_wave',
    'baseline',
    'tdp_vs_jsp_bjp_2029',
  ].includes(activePreset);

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden transition-all">
      {/* Header & Collapsed Summary Ribbon */}
      <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-wider uppercase text-indigo-400 font-mono">
                War Room Modifiers
              </span>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded font-mono font-bold">
                Step 2: Add What-Ifs
              </span>
              {isCoalitionActive && (
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-700/50 px-2 py-0.5 rounded font-mono font-bold">
                  NDA Alliance Active
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Chief Advisor "What-If" Simulation Suite</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Status Pills */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              Tally: TDP {simulatedPartyTally.tally.TDP || 0} | YSRCP {simulatedPartyTally.tally.YSRCP || 0} | JSP {simulatedPartyTally.tally.JSP || 0} | BJP {simulatedPartyTally.tally.BJP || 0}
            </span>
            <span className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              Turnout: {turnoutSettings.urbanShift !== 0 || turnoutSettings.ruralShift !== 0 ? 'Shifted' : 'Baseline'}
            </span>
            <span className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              Macro: {macroSwing.TDP !== 0 ? `TDP ${macroSwing.TDP}%` : '0%'}
            </span>
            {isCoalitionActive && (
              <span className="px-2 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800 text-[11px] font-bold">
                Friction: {coalitionSettings.rebelLeakagePct}% Leak
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="w-4 h-4 text-indigo-400" />
                <span>Expand What-Ifs</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4 text-slate-400" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-5">
          {/* 5 Clean What-If Navigation Tabs - Caste Blocs First! */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => handleSelectTab('caste_blocs')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'caste_blocs'
                  ? 'bg-amber-600 text-white shadow-md font-black ring-1 ring-amber-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span>1. Decisive Caste &amp; Blocs</span>
            </button>

            <button
              onClick={() => handleSelectTab('coalition')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'coalition'
                  ? 'bg-purple-600 text-white shadow-md font-black ring-1 ring-purple-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Handshake className="w-4 h-4 text-purple-300" />
              <span>2. Coalition &amp; Friction</span>
            </button>

            <button
              onClick={() => handleSelectTab('turnout')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'turnout'
                  ? 'bg-sky-600 text-white shadow-md font-black ring-1 ring-sky-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Users className="w-4 h-4 text-sky-300" />
              <span>3. Turnout &amp; Mobilization</span>
            </button>

            <button
              onClick={() => handleSelectTab('anti_incumbency')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'anti_incumbency'
                  ? 'bg-rose-600 text-white shadow-md font-black ring-1 ring-rose-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <TrendingDown className="w-4 h-4 text-rose-300" />
              <span>4. Anti-Inc &amp; Crises</span>
              {activeCrisisCount > 0 && (
                <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-500/50 px-1.5 py-0.2 rounded font-mono font-bold">
                  {activeCrisisCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleSelectTab('target_60')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'target_60'
                  ? 'bg-emerald-600 text-white shadow-md font-black ring-1 ring-emerald-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Crosshair className="w-4 h-4 text-emerald-300" />
              <span>5. Target 60 &amp; Monte Carlo</span>
            </button>
          </div>

          {/* TAB 1: DECISIVE CASTE & DEMOGRAPHIC BLOCS (SHIFTED TO FIRST TAB WITH DEMOGRAPHIC STUDIO) */}
          {activeTab === 'caste_blocs' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Demographic Studio Launcher Ribbon */}
              <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950/70 p-4 rounded-xl border border-indigo-700/50 shadow-md flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      <Sliders className="w-4 h-4 text-indigo-300" />
                    </span>
                    <span className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                      SEEEPC Volume-4 Demographics Engine
                    </span>
                    {activeCustomizedCount > 0 && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-bold">
                        {activeCustomizedCount} Cohorts Customized
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tune all 18 caste and age cohorts (Mudiraj, Madiga, Mala, Munnuru Kapu, Padmashali, Goud, Yadav, Velama, Reddy, Muslim, Youth 18-25) with mathematical simplex balancers.
                  </p>
                </div>

                {onOpenDemographicStudio && (
                  <button
                    onClick={onOpenDemographicStudio}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 border border-indigo-400/30 group shrink-0"
                  >
                    <span>Configure Full Demographic Studio</span>
                    <span className="group-hover:translate-x-0.5 transition-transform font-bold">↗</span>
                  </button>
                )}
              </div>

              {/* Quick Sliders for Key Decisive Kingmaker Blocs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Quick-Tune Decisive Kingmaker Blocs:</span>
                  <span className="text-[11px] text-slate-500">Fine-tune shifts below or use the Studio above</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Caste 1: Kapu / Balija / Telaga */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-300">Kapu / Balija (22% AP)</span>
                      <span className="font-mono text-[11px] text-rose-400 font-bold">
                        {(swings.kapu?.JSP || 0) >= 0 ? `+${swings.kapu?.JSP || 0}%` : `${swings.kapu?.JSP}%`}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Pawan Kalyan / Janasena alliance wave in Godavari &amp; Rayalaseema</p>
                    <input
                      type="range"
                      min="-15"
                      max="15"
                      step="1"
                      value={swings.kapu?.JSP || 0}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setSwings((prev) => ({
                          ...prev,
                          kapu: { TDP: Math.round(v * 0.5), YSRCP: -v, JSP: v },
                        }));
                      }}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>

                  {/* Caste 2: Kamma */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-yellow-300">Kamma (10% AP)</span>
                      <span className="font-mono text-[11px] text-yellow-400 font-bold">
                        {(swings.kamma?.TDP || 0) >= 0 ? `+${swings.kamma?.TDP || 0}%` : `${swings.kamma?.TDP}%`}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Amaravati core, Krishna, Guntur &amp; NRI financial backing</p>
                    <input
                      type="range"
                      min="-15"
                      max="15"
                      step="1"
                      value={swings.kamma?.TDP || 0}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setSwings((prev) => ({
                          ...prev,
                          kamma: { TDP: v, YSRCP: -v, JSP: 0 },
                        }));
                      }}
                      className="w-full accent-yellow-500 cursor-pointer"
                    />
                  </div>

                  {/* Caste 3: Reddy */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-sky-300">Reddy (12% AP)</span>
                      <span className="font-mono text-[11px] text-sky-400 font-bold">
                        {(swings.reddy?.YSRCP || 0) >= 0 ? `+${swings.reddy?.YSRCP || 0}%` : `${swings.reddy?.YSRCP}%`}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Rayalaseema fortresses &amp; traditional YSR family loyalty</p>
                    <input
                      type="range"
                      min="-15"
                      max="15"
                      step="1"
                      value={swings.reddy?.YSRCP || 0}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setSwings((prev) => ({
                          ...prev,
                          reddy: { TDP: -v, YSRCP: v, JSP: 0 },
                        }));
                      }}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  {/* Caste 4: BC Turpu Kapu */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-300">BC Turpu Kapu</span>
                      <span className="font-mono text-[11px] text-indigo-400 font-bold">
                        {(swings.bc_turpu_kapu?.TDP || 0) >= 0 ? `+${swings.bc_turpu_kapu?.TDP || 0}%` : `${swings.bc_turpu_kapu?.TDP}%`}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Decisive in Srikakulam &amp; Vizianagaram northern belt</p>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="1"
                      value={swings.bc_turpu_kapu?.TDP || 0}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setSwings((prev) => ({
                          ...prev,
                          bc_turpu_kapu: { TDP: v, YSRCP: -v, JSP: 0 },
                        }));
                      }}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  {/* Caste 5: BC Yadava & Kuruba/Boya */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-300">BC Yadava &amp; Kuruba</span>
                      <span className="font-mono text-[11px] text-emerald-400 font-bold">
                        {(swings.bc_yadava?.TDP || 0) >= 0 ? `+${swings.bc_yadava?.TDP || 0}%` : `${swings.bc_yadava?.TDP}%`}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Prakasam, Nellore, Anantapur &amp; Kurnool agrarian BCs</p>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="1"
                      value={swings.bc_yadava?.TDP || 0}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setSwings((prev) => ({
                          ...prev,
                          bc_yadava: { TDP: v, YSRCP: -v, JSP: 0 },
                        }));
                      }}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Caste 6: Youth 18-25 */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300">Youth (18-25)</span>
                      <span className="font-mono text-[11px] text-amber-400 font-bold">
                        {(swings.youth_18_25?.JSP || 0) >= 0 ? `+${swings.youth_18_25?.JSP || 0}%` : `${swings.youth_18_25?.JSP}%`}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Mega star fandom, job DSC notifications &amp; anti-incumbency</p>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="1"
                      value={swings.youth_18_25?.JSP || 0}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setSwings((prev) => ({
                          ...prev,
                          youth_18_25: { TDP: Math.round(v * 0.4), YSRCP: -v, JSP: Math.round(v * 0.6) },
                        }));
                      }}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COALITION FRICTION & CADRE TRANSFER */}
          {activeTab === 'coalition' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {!isCoalitionActive && (
                <div className="bg-amber-950/60 border border-amber-500/40 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      The active simulation is currently set to <strong>{activePreset}</strong>. To see coalition cadre transfer in action, activate the NDA Alliance (TDP+JSP+BJP) scenario.
                    </span>
                  </div>
                  <button
                    onClick={() => onApplyPreset('nda_2024_sweep')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Activate NDA Alliance
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Friction Slider 1: TDP to JSP */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-yellow-400">TDP Cadre Transfer to Janasena</span>
                    <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
                      {coalitionSettings.tdpToJspTransferPct}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Percentage of baseline TDP voters who vote for the Janasena candidate in the 21 JSP-allocated constituencies.
                  </p>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={coalitionSettings.tdpToJspTransferPct}
                    onChange={(e) =>
                      setCoalitionSettings((prev) => ({ ...prev, tdpToJspTransferPct: Number(e.target.value) }))
                    }
                    className="w-full accent-yellow-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>50% (High Local Friction)</span>
                    <span>95% (Perfect Alignment)</span>
                  </div>
                </div>

                {/* Friction Slider 2: JSP to TDP */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-rose-400">Janasena Transfer to TDP</span>
                    <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
                      {coalitionSettings.jspToTdpTransferPct}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Percentage of passionate Kapu/youth Janasena voters who cast ballots for the TDP candidate in 144 seats.
                  </p>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={coalitionSettings.jspToTdpTransferPct}
                    onChange={(e) =>
                      setCoalitionSettings((prev) => ({ ...prev, jspToTdpTransferPct: Number(e.target.value) }))
                    }
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>50% (Kapu Dissent)</span>
                    <span>95% (Disciplined Transfer)</span>
                  </div>
                </div>

                {/* Friction Slider 3: Rebel Leakage to YSRCP */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-400">Disgruntled Rebel Leakage to YSRCP</span>
                    <span className="text-xs font-mono font-black text-blue-300 bg-blue-950 px-2 py-0.5 rounded">
                      {coalitionSettings.rebelLeakagePct}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Local grassroots ticket rebels who defect or silently cross-vote for the YSRCP opposition candidate.
                  </p>
                  <input
                    type="range"
                    min="5"
                    max="35"
                    step="5"
                    value={coalitionSettings.rebelLeakagePct}
                    onChange={(e) =>
                      setCoalitionSettings((prev) => ({ ...prev, rebelLeakagePct: Number(e.target.value) }))
                    }
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>5% (Disciplined Alliance)</span>
                    <span>35% (Mass Mutiny)</span>
                  </div>
                </div>
              </div>

              {/* Quick One-Click Coalition Presets */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">NDA Coalition Presets:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() =>
                      setCoalitionSettings({ tdpToJspTransferPct: 90, jspToTdpTransferPct: 88, ndaToBjpTransferPct: 80, rebelLeakagePct: 8 })
                    }
                    className="px-3 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/60 rounded-lg font-bold cursor-pointer transition-colors"
                  >
                    2024 Clean Sweep (90:88 | 8% Leak)
                  </button>
                  <button
                    onClick={() => setCoalitionSettings(DEFAULT_COALITION_SETTINGS)}
                    className="px-3 py-1 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-300 border border-indigo-700/60 rounded-lg font-bold cursor-pointer transition-colors"
                  >
                    Standard Formula (85:80 | 12% Leak)
                  </button>
                  <button
                    onClick={() =>
                      setCoalitionSettings({ tdpToJspTransferPct: 65, jspToTdpTransferPct: 60, ndaToBjpTransferPct: 60, rebelLeakagePct: 25 })
                    }
                    className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-300 border border-rose-700/60 rounded-lg font-bold cursor-pointer transition-colors"
                  >
                    High Friction &amp; Dissent (65:60 | 25% Leak)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TURNOUT & MOBILIZATION */}
          {activeTab === 'turnout' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Urban Turnout */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-sky-400">Urban Voter Turnout Shift</span>
                    <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
                      {turnoutSettings.urbanShift >= 0 ? `+${turnoutSettings.urbanShift}%` : `${turnoutSettings.urbanShift}%`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    GHMC, Ranga Reddy, and urban municipalities. Simulates IT corridor voter apathy vs middle-class turnout waves.
                  </p>
                  <input
                    type="range"
                    min="-15"
                    max="15"
                    step="1"
                    value={turnoutSettings.urbanShift}
                    onChange={(e) =>
                      setTurnoutSettings((prev) => ({ ...prev, urbanShift: Number(e.target.value) }))
                    }
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>-15% (Severe Apathy)</span>
                    <span>+15% (Urban Surge)</span>
                  </div>
                </div>

                {/* Rural Turnout */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400">Rural Agrarian Turnout Shift</span>
                    <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
                      {turnoutSettings.ruralShift >= 0 ? `+${turnoutSettings.ruralShift}%` : `${turnoutSettings.ruralShift}%`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Rural farmer constituencies. Simulates agrarian mobilization over crop loan waivers, MSP, and Rythu Bharosa.
                  </p>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    value={turnoutSettings.ruralShift}
                    onChange={(e) =>
                      setTurnoutSettings((prev) => ({ ...prev, ruralShift: Number(e.target.value) }))
                    }
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>-10% (Agrarian Drop)</span>
                    <span>+10% (Farmer Surge)</span>
                  </div>
                </div>

                {/* Female Mobilization */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-purple-400">Mahalakshmi Female Mobilization</span>
                    <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
                      {turnoutSettings.femaleShift >= 0 ? `+${turnoutSettings.femaleShift}%` : `${turnoutSettings.femaleShift}%`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Women voter mobilization driven by free RTC bus travel and cash benefits (+ shifts votes to ruling party).
                  </p>
                  <input
                    type="range"
                    min="-8"
                    max="8"
                    step="1"
                    value={turnoutSettings.femaleShift}
                    onChange={(e) =>
                      setTurnoutSettings((prev) => ({ ...prev, femaleShift: Number(e.target.value) }))
                    }
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>-8% (Fatigue)</span>
                    <span>+8% (Women Consolidation)</span>
                  </div>
                </div>
              </div>

              {/* Turnout Presets */}
              <div className="flex items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Turnout Presets:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTurnoutSettings({ urbanShift: 6, ruralShift: -2, femaleShift: 0 })}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold cursor-pointer"
                  >
                    Urban Anti-Incumbent Surge (+6% Urban)
                  </button>
                  <button
                    onClick={() => setTurnoutSettings({ urbanShift: -6, ruralShift: 4, femaleShift: 3 })}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold cursor-pointer"
                  >
                    Rural Welfare Surge (+4% Rural, +3% Women)
                  </button>
                  <button
                    onClick={() => setTurnoutSettings({ urbanShift: 0, ruralShift: 0, femaleShift: 0 })}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg font-bold cursor-pointer"
                  >
                    Reset (0%)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANTI-INCUMBENCY & GROUND REALITIES */}
          {activeTab === 'anti_incumbency' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Row 1: Statewide Macro & MLA Replacement Surgery */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Statewide Macro Swing */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-rose-400">Statewide Swing against Congress</span>
                    <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
                      {macroSwing.INC}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Models uniform statewide anti-incumbency across all 119 constituencies. Negative values shave votes from INC.
                  </p>
                  <input
                    type="range"
                    min="-12"
                    max="6"
                    step="0.5"
                    value={macroSwing.INC}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setMacroSwing({
                        INC: val,
                        BRS: Math.round(-val * 0.55 * 10) / 10,
                        BJP: Math.round(-val * 0.45 * 10) / 10,
                      });
                    }}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>-12% (Severe Backlash)</span>
                    <span>0% (Neutral)</span>
                    <span>+6% (Pro-Incumbent)</span>
                  </div>
                </div>

                {/* MLA Surgery */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-purple-400">Incumbent MLA Replacement Surgery</span>
                    <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
                      {mlaFatigueSettings.replaceIncumbentPct}% Dropped
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Dropping unpopular sitting MLAs eliminates the local -4.5% voter fatigue penalty and grants a +4.0% fresh face boost.
                  </p>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={mlaFatigueSettings.replaceIncumbentPct}
                    onChange={(e) =>
                      setMlaFatigueSettings((prev) => ({ ...prev, replaceIncumbentPct: Number(e.target.value) }))
                    }
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>0% (All Retained)</span>
                    <span>50% (Radical Ticket Surgery)</span>
                  </div>
                </div>
              </div>

              {/* Row 2: Telangana Ground Realities & Crisis Stress-Testing Matrix */}
              <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 rounded-xl border border-rose-900/40 shadow-lg space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white">
                          Telangana Ground Realities &amp; Crisis Stress Matrix
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                          activeCrisisCount > 0
                            ? 'bg-rose-950 text-rose-300 border-rose-700/60'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {activeCrisisCount} Crises Active
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Model live political fault lines: HYDRA demolitions, central agencies, minority split, youth protests &amp; land backlash.
                      </p>
                    </div>
                  </div>

                  {/* Crisis Presets */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setGroundCrisisSettings(DEFAULT_GROUND_CRISIS_SETTINGS)}
                      className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold cursor-pointer transition-colors border border-slate-700"
                    >
                      Baseline (0 Crises)
                    </button>
                    <button
                      onClick={() =>
                        setGroundCrisisSettings({
                          amaravatiPaceSlowdown: 4.0,
                          superSixFiscalFriction: false,
                          vizagSteelPlantBacklash: true,
                          redBookPolarization: false,
                          tdpJspCadreClash: 3.5,
                          rayalaseemaWaterGrievance: false,
                        })
                      }
                      className="px-2.5 py-1 text-xs bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700/60 rounded-lg font-bold cursor-pointer transition-colors"
                    >
                      Capital &amp; Steel Plant Discontent
                    </button>
                    <button
                      onClick={() =>
                        setGroundCrisisSettings({
                          amaravatiPaceSlowdown: 5.0,
                          superSixFiscalFriction: true,
                          vizagSteelPlantBacklash: true,
                          redBookPolarization: true,
                          tdpJspCadreClash: 6.0,
                          rayalaseemaWaterGrievance: true,
                        })
                      }
                      className="px-2.5 py-1 text-xs bg-rose-950/90 hover:bg-rose-900 text-rose-200 border border-rose-600/70 rounded-lg font-bold cursor-pointer transition-colors"
                    >
                      Full 6-Point Stress
                    </button>
                  </div>
                </div>

                {/* 6 AP Crisis Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Card 1: Amaravati Capital Execution Pace */}
                  <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 hover:border-amber-900/60 transition-colors space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-xs text-white">Amaravati Delivery Pace</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        groundCrisisSettings.amaravatiPaceSlowdown > 0
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {groundCrisisSettings.amaravatiPaceSlowdown > 0
                          ? `-${groundCrisisSettings.amaravatiPaceSlowdown}% NDA`
                          : 'Off'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                        18 Capital ACs
                      </span>
                      <span>Guntur, NTR, Krishna Corridor</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Construction timeline fatigue and compensation disbursement delays in the Amaravati capital region.
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="6"
                      step="0.5"
                      value={groundCrisisSettings.amaravatiPaceSlowdown}
                      onChange={(e) =>
                        setGroundCrisisSettings((prev) => ({
                          ...prev,
                          amaravatiPaceSlowdown: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>0% (On Schedule)</span>
                      <span>-3% (Moderate)</span>
                      <span>-6% (Acute Disillusionment)</span>
                    </div>
                  </div>

                  {/* Card 2: Super Six Guarantees Delivery Strain */}
                  <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 hover:border-rose-900/60 transition-colors space-y-2.5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-400" />
                          <span className="font-bold text-xs text-white">Super Six Fiscal Delay</span>
                        </div>
                        <button
                          onClick={() =>
                            setGroundCrisisSettings((prev) => ({
                              ...prev,
                              superSixFiscalFriction: !prev.superSixFiscalFriction,
                            }))
                          }
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded cursor-pointer transition-colors border ${
                            groundCrisisSettings.superSixFiscalFriction
                              ? 'bg-rose-950 text-rose-300 border-rose-600'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {groundCrisisSettings.superSixFiscalFriction ? 'ACTIVE' : 'OFF'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded text-rose-300 font-mono">
                          Statewide Rural
                        </span>
                        <span>Aadabidda Nidhi &amp; Thalliki Vandanam</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Cash flow constraints delaying ₹1,500/mo cash transfers and free bus delivery, creating rural friction (-2.5%).
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-900 text-[10px] font-mono text-rose-400/90">
                      {groundCrisisSettings.superSixFiscalFriction
                        ? '⚡ -2.5% rural welfare delivery delay penalty'
                        : '○ Smooth welfare disbursals'}
                    </div>
                  </div>

                  {/* Card 3: Vizag Steel Plant Privatization */}
                  <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 hover:border-indigo-900/60 transition-colors space-y-2.5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4 text-indigo-400" />
                          <span className="font-bold text-xs text-white">Vizag Steel Plant Friction</span>
                        </div>
                        <button
                          onClick={() =>
                            setGroundCrisisSettings((prev) => ({
                              ...prev,
                              vizagSteelPlantBacklash: !prev.vizagSteelPlantBacklash,
                            }))
                          }
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded cursor-pointer transition-colors border ${
                            groundCrisisSettings.vizagSteelPlantBacklash
                              ? 'bg-indigo-950 text-indigo-300 border-indigo-600'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {groundCrisisSettings.vizagSteelPlantBacklash ? 'ACTIVE' : 'OFF'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-300 font-mono">
                          7 Uttarandhra ACs
                        </span>
                        <span>Visakhapatnam &amp; Anakapalli Belt</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Trade union strikes and employee agitations against RINL disinvestment shave -4.0% in steel city urban seats.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-900 text-[10px] font-mono text-indigo-300">
                      {groundCrisisSettings.vizagSteelPlantBacklash
                        ? '⚡ -4.0% penalty across Gajuwaka & Vizag urban ACs'
                        : '○ Industrial peace maintained'}
                    </div>
                  </div>

                  {/* Card 4: TDP vs Janasena Local Cadre Clashes */}
                  <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 hover:border-yellow-900/60 transition-colors space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-yellow-400" />
                        <span className="font-bold text-xs text-white">TDP-JSP Cadre Clashes</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        groundCrisisSettings.tdpJspCadreClash > 0
                          ? 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {groundCrisisSettings.tdpJspCadreClash > 0
                          ? `-${groundCrisisSettings.tdpJspCadreClash}% Friction`
                          : 'Off'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <span className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                        Godavari &amp; Krishna
                      </span>
                      <span>Grassroots Domination Rivalry</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Clashes over local contracts, nominated posts, and police station dominance triggering mutual cross-voting.
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="8"
                      step="1"
                      value={groundCrisisSettings.tdpJspCadreClash}
                      onChange={(e) =>
                        setGroundCrisisSettings((prev) => ({
                          ...prev,
                          tdpJspCadreClash: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-yellow-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>0% (Harmonious)</span>
                      <span>-4% (Moderate Friction)</span>
                      <span>-8% (Open Sabotage)</span>
                    </div>
                  </div>

                  {/* Card 5: Red Book & Vendetta Polarization */}
                  <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 hover:border-red-900/60 transition-colors space-y-2.5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-red-400" />
                          <span className="font-bold text-xs text-white">Red Book Politics Polarization</span>
                        </div>
                        <button
                          onClick={() =>
                            setGroundCrisisSettings((prev) => ({
                              ...prev,
                              redBookPolarization: !prev.redBookPolarization,
                            }))
                          }
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded cursor-pointer transition-colors border ${
                            groundCrisisSettings.redBookPolarization
                              ? 'bg-red-950 text-red-300 border-red-600'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {groundCrisisSettings.redBookPolarization ? 'ACTIVE' : 'OFF'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded text-red-300 font-mono">
                          Palnadu &amp; Seema
                        </span>
                        <span>Factional Retribution &amp; Police Cases</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Aggressive police inquiries and factional raids galvanizing YSRCP sympathetic voters into defiant consolidation (-2.0%).
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-900 text-[10px] font-mono text-red-400/90">
                      {groundCrisisSettings.redBookPolarization
                        ? '⚡ Consolidates sympathetic Reddy & BC voters behind YSRCP'
                        : '○ Normal governance perception'}
                    </div>
                  </div>

                  {/* Card 6: Rayalaseema Drought & Irrigation Grievance */}
                  <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 hover:border-emerald-900/60 transition-colors space-y-2.5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trees className="w-4 h-4 text-emerald-400" />
                          <span className="font-bold text-xs text-white">Rayalaseema Irrigation Friction</span>
                        </div>
                        <button
                          onClick={() =>
                            setGroundCrisisSettings((prev) => ({
                              ...prev,
                              rayalaseemaWaterGrievance: !prev.rayalaseemaWaterGrievance,
                            }))
                          }
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded cursor-pointer transition-colors border ${
                            groundCrisisSettings.rayalaseemaWaterGrievance
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {groundCrisisSettings.rayalaseemaWaterGrievance ? 'ACTIVE' : 'OFF'}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="bg-slate-900 px-1.5 py-0.5 rounded text-emerald-300 font-mono">
                          52 Seema ACs
                        </span>
                        <span>Kadapa, Kurnool, Anantapur Fortresses</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Canal water supply anxieties and delays in Handri-Neeva/GND projects revive traditional YSR family loyalties (-3.5%).
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-900 text-[10px] font-mono text-emerald-400/90">
                      {groundCrisisSettings.rayalaseemaWaterGrievance
                        ? '⚡ -3.5% swing in Rayalaseema agrarian fortresses'
                        : '○ Rayalaseema baseline stable'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TARGET 88 & MONTE CARLO PROBABILITY */}
          {activeTab === 'target_60' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Target 88 Reverse Solver */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crosshair className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs text-white">Target 88 Majority Optimizer</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                      {(['TDP', 'YSRCP', 'JSP', 'BJP'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setTargetParty(p)}
                          className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                            targetParty === p ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800 text-center font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">WON</span>
                      <span className="text-xl font-black text-white">{target88Plan.wonCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">NEEDED</span>
                      <span className={`text-xl font-black ${target88Plan.needed === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {target88Plan.needed === 0 ? 'MAJORITY' : `${target88Plan.needed} seats`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">AVG DEFICIT</span>
                      <span className="text-sm font-black text-indigo-300">~{target88Plan.avgDeficit.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                    <span>
                      Top target: <strong>{target88Plan.pickupSeats[0]?.result.ac_name || 'None'}</strong> (Deficit: ~{target88Plan.pickupSeats[0]?.deficitVotes.toLocaleString()} votes)
                    </span>
                    {target88Plan.pickupSeats[0] && (
                      <button
                        onClick={() => onNavigateToActions(target88Plan.pickupSeats[0]?.result.ac_no)}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[10px] cursor-pointer transition-colors"
                      >
                        Target in Playbook 🎯
                      </button>
                    )}
                  </div>
                </div>

                {/* Monte Carlo 1,000-Run Volatility Meter */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Dices className="w-4 h-4 text-indigo-400" />
                      <span className="font-bold text-xs text-white">Monte Carlo Win Probability (1,000 Runs)</span>
                    </div>
                    <button
                      onClick={() => setSimulationSeed((prev) => prev + 1)}
                      className="text-[10px] bg-slate-900 text-indigo-300 px-2 py-1 rounded border border-slate-800 hover:text-white cursor-pointer font-bold"
                    >
                      Re-run 1,000
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800 text-center font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">NDA WIN</span>
                      <span className="text-xl font-black text-emerald-400">{monteCarloStats.nda.winProb}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">YSRCP WIN</span>
                      <span className="text-xl font-black text-sky-400">{monteCarloStats.ysrcp.winProb}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">HUNG ASSEMBLY</span>
                      <span className="text-xl font-black text-amber-400">{monteCarloStats.hungProb}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Polling Error Sigma: &plusmn;{pollingErrorSigma}%</span>
                    <input
                      type="range"
                      min="1.5"
                      max="5.0"
                      step="0.5"
                      value={pollingErrorSigma}
                      onChange={(e) => setPollingErrorSigma(Number(e.target.value))}
                      className="w-28 accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
