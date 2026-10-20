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
} from 'lucide-react';
import type {
  CoalitionSettings,
  MlaFatigueSettings,
} from './StrategicSimulationModels';
import {
  DEFAULT_COALITION_SETTINGS,
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

// Urban constituency numbers (GHMC, Hyderabad, Secunderabad, plus key municipal urban belts)
export const URBAN_AC_NOS = new Set([
  // Hyderabad District (58-72)
  58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72,
  // Ranga Reddy / Medchal peri-urban & IT corridor (43, 45, 46, 47, 48, 49, 50, 51, 52, 53)
  43, 45, 46, 47, 48, 49, 50, 51, 52, 53,
  // Key Urban Centers (Nizamabad Urban 17, Karimnagar 26, Warangal West 106, Warangal East 107, Khammam 112)
  17, 26, 106, 107, 112,
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
  onNavigateToActions,
  onOpenDemographicStudio,
  activeCustomizedCount = 0,
  requestedTab,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<WhatIfTab>(requestedTab || 'caste_blocs');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

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
  const [targetParty, setTargetParty] = useState<'INC' | 'BRS' | 'BJP'>('BRS');

  // Real-time seat tallies from compounded results
  const simulatedPartyTally = useMemo(() => {
    const tally: Record<string, number> = { INC: 0, BRS: 0, BJP: 0, AIMIM: 0, Others: 0 };
    let totalFlips = 0;
    simulatedResults.forEach((r) => {
      const p = r.simulated.winner_party;
      tally[p] = (tally[p] || 0) + 1;
      if (r.simulated.is_flipped) totalFlips++;
    });
    return { tally, totalFlips };
  }, [simulatedResults]);

  // Target 60 Goal-Seek Reverse Optimizer Plan
  const target60Plan = useMemo(() => {
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
        const total = r.simulated.winner_votes + r.simulated.runner_votes || 150000;
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
    const needed = Math.max(0, 60 - wonList.length);
    const pickupSeats = targetOpportunities.slice(0, Math.min(needed > 0 ? needed : 10, targetOpportunities.length));
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

  // Monte Carlo 1,000-Run Volatility Engine
  const monteCarloStats = useMemo(() => {
    void simulationSeed;
    const runs = 1000;
    const incSeats: number[] = [];
    const brsSeats: number[] = [];
    const bjpSeats: number[] = [];
    let incWins = 0;
    let brsWins = 0;
    let bjpWins = 0;
    let coalitionWins = 0;
    let hungCount = 0;

    for (let r = 0; r < runs; r++) {
      const stateErrInc = gaussianRandom() * (pollingErrorSigma * 0.7);
      const stateErrBrs = gaussianRandom() * (pollingErrorSigma * 0.7);
      const stateErrBjp = gaussianRandom() * (pollingErrorSigma * 0.6);

      let runIncSeats = 0;
      let runBrsSeats = 0;
      let runBjpSeats = 0;

      for (let i = 0; i < simulatedResults.length; i++) {
        const item = simulatedResults[i];
        const votes = item.simulated.party_votes;
        const localNoiseInc = gaussianRandom() * (pollingErrorSigma * 0.5);
        const localNoiseBrs = gaussianRandom() * (pollingErrorSigma * 0.5);
        const localNoiseBjp = gaussianRandom() * (pollingErrorSigma * 0.5);

        const vInc = (votes.INC || 0) * (1 + (stateErrInc + localNoiseInc) / 100);
        const vBrs = (votes.BRS || 0) * (1 + (stateErrBrs + localNoiseBrs) / 100);
        const vBjp = (votes.BJP || 0) * (1 + (stateErrBjp + localNoiseBjp) / 100);
        const vAimim = votes.AIMIM || 0;

        const maxVotes = Math.max(vInc, vBrs, vBjp, vAimim);
        if (maxVotes === vInc) runIncSeats++;
        else if (maxVotes === vBrs) runBrsSeats++;
        else if (maxVotes === vBjp) runBjpSeats++;
      }

      incSeats.push(runIncSeats);
      brsSeats.push(runBrsSeats);
      bjpSeats.push(runBjpSeats);

      if (runIncSeats >= 60) incWins++;
      else if (runBrsSeats >= 60) brsWins++;
      else if (runBjpSeats >= 60) bjpWins++;
      else if (runBrsSeats + runBjpSeats >= 60) {
        coalitionWins++;
      } else {
        hungCount++;
      }
    }

    incSeats.sort((a, b) => a - b);
    brsSeats.sort((a, b) => a - b);
    bjpSeats.sort((a, b) => a - b);

    return {
      runs,
      inc: {
        median: incSeats[Math.floor(runs / 2)],
        p10: incSeats[Math.floor(runs * 0.1)],
        p90: incSeats[Math.floor(runs * 0.9)],
        winProb: Math.round((incWins / runs) * 100),
      },
      brs: {
        median: brsSeats[Math.floor(runs / 2)],
        p10: brsSeats[Math.floor(runs * 0.1)],
        p90: brsSeats[Math.floor(runs * 0.9)],
        winProb: Math.round((brsWins / runs) * 100),
      },
      bjp: {
        median: bjpSeats[Math.floor(runs / 2)],
        p10: bjpSeats[Math.floor(runs * 0.1)],
        p90: bjpSeats[Math.floor(runs * 0.9)],
        winProb: Math.round((bjpWins / runs) * 100),
      },
      coalition: {
        winProb: Math.round(((coalitionWins + brsWins + bjpWins) / runs) * 100),
      },
      hungProb: Math.round((hungCount / runs) * 100),
    };
  }, [simulatedResults, pollingErrorSigma, simulationSeed]);

  const isCoalitionActive = activePreset === 'bjp_trs_alliance';

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
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-700/50 px-2 py-0.5 rounded font-mono font-bold">
                  BRS-BJP Coalition Active
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
              Tally: INC {simulatedPartyTally.tally.INC || 0} | BRS {simulatedPartyTally.tally.BRS || 0} | BJP {simulatedPartyTally.tally.BJP || 0}
            </span>
            <span className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              Turnout: {turnoutSettings.urbanShift !== 0 || turnoutSettings.ruralShift !== 0 ? 'Shifted' : 'Baseline'}
            </span>
            <span className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              Anti-Inc: {macroSwing.INC !== 0 ? `${macroSwing.INC}%` : '0%'}
            </span>
            {isCoalitionActive && (
              <span className="px-2 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-800 text-[11px] font-bold">
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
              <span>4. Anti-Inc &amp; Surgery</span>
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
                  {/* Caste 1: BC Mudiraj */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-300">BC Mudiraj (12% TS)</span>
                      <span className="font-mono text-[11px] text-indigo-400 font-bold">
                        {(swings.bc_mudiraj?.BRS || 0) >= 0 ? `+${swings.bc_mudiraj?.BRS || 0}%` : `${swings.bc_mudiraj?.BRS}%`}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Decisive in Nizamabad, Medak, Mahabubnagar</p>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="1"
                      value={swings.bc_mudiraj?.BRS || 0}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setSwings((prev) => ({
                          ...prev,
                          bc_mudiraj: { INC: -v, BRS: Math.round(v * 0.6), BJP: Math.round(v * 0.4) },
                        }));
                      }}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  {/* Caste 2: SC Madiga */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300">SC Madiga (MRPS)</span>
                      <span className="font-mono text-[11px] text-amber-400 font-bold">
                        {(swings.sc_madiga?.BJP || 0) >= 0 ? `+${swings.sc_madiga?.BJP || 0}%` : `${swings.sc_madiga?.BJP}%`}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Modi sub-categorization pitch vs Dalit Bandhu</p>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="1"
                      value={swings.sc_madiga?.BJP || 0}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setSwings((prev) => ({
                          ...prev,
                          sc_madiga: { INC: -v, BRS: Math.round(v * 0.3), BJP: v },
                        }));
                      }}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Caste 3: BC Munnuru Kapu */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-300">BC Munnuru Kapu</span>
                      <span className="font-mono text-[11px] text-emerald-400 font-bold">
                        {(swings.bc_munnuru_kapu?.BRS || 0) >= 0 ? `+${swings.bc_munnuru_kapu?.BRS || 0}%` : `${swings.bc_munnuru_kapu?.BRS}%`}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Agrarian BC leadership in Karimnagar, Warangal</p>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="1"
                      value={swings.bc_munnuru_kapu?.BRS || 0}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setSwings((prev) => ({
                          ...prev,
                          bc_munnuru_kapu: { INC: -v, BRS: Math.round(v * 0.5), BJP: Math.round(v * 0.5) },
                        }));
                      }}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Caste 4: Velama & Reddy */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-pink-300">OC Velama &amp; Reddy</span>
                      <span className="font-mono text-[11px] text-pink-400 font-bold">
                        {(swings.oc_velama?.BRS || 0) >= 0 ? `+${swings.oc_velama?.BRS || 0}%` : `${swings.oc_velama?.BRS}%`}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Political leadership polarization</p>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="1"
                      value={swings.oc_velama?.BRS || 0}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setSwings((prev) => ({
                          ...prev,
                          oc_velama: { INC: -v, BRS: v, BJP: 0 },
                        }));
                      }}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>

                  {/* Caste 5: Muslim Minorities */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-teal-300">Muslim Minorities</span>
                      <span className="font-mono text-[11px] text-teal-400 font-bold">
                        {(swings.minority_muslim?.INC || 0) >= 0 ? `+${swings.minority_muslim?.INC || 0}%` : `${swings.minority_muslim?.INC}%`}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">GHMC, Bodhan, Nizamabad, Sangareddy</p>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="1"
                      value={swings.minority_muslim?.INC || 0}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setSwings((prev) => ({
                          ...prev,
                          minority_muslim: { INC: v, BRS: -v, BJP: 0 },
                        }));
                      }}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                  </div>

                  {/* Caste 6: Youth 18-25 */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-sky-300">Youth (18-25)</span>
                      <span className="font-mono text-[11px] text-sky-400 font-bold">
                        {(swings.youth_18_25?.BJP || 0) >= 0 ? `+${swings.youth_18_25?.BJP || 0}%` : `${swings.youth_18_25?.BJP}%`}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">TSPSC transparency &amp; employment pitch</p>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="1"
                      value={swings.youth_18_25?.BJP || 0}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setSwings((prev) => ({
                          ...prev,
                          youth_18_25: { INC: -v, BRS: Math.round(v * 0.4), BJP: Math.round(v * 0.6) },
                        }));
                      }}
                      className="w-full accent-sky-500 cursor-pointer"
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
                      The active simulation is currently set to <strong>{activePreset}</strong>. To see coalition cadre transfer in action, activate the 2028 BRS-BJP Coalition scenario.
                    </span>
                  </div>
                  <button
                    onClick={() => onApplyPreset('bjp_trs_alliance')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Activate 2028 Coalition (74:45)
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Friction Slider 1: BRS to BJP */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-pink-400">BRS Cadre Transfer to BJP</span>
                    <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
                      {coalitionSettings.brsToBjpTransferPct}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Percentage of baseline BRS voters who vote for the BJP candidate in the 45 BJP-allocated urban seats.
                  </p>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={coalitionSettings.brsToBjpTransferPct}
                    onChange={(e) =>
                      setCoalitionSettings((prev) => ({ ...prev, brsToBjpTransferPct: Number(e.target.value) }))
                    }
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>50% (High Resistance)</span>
                    <span>95% (Iron Cadre)</span>
                  </div>
                </div>

                {/* Friction Slider 2: BJP to BRS */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-400">BJP Cadre Transfer to BRS</span>
                    <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
                      {coalitionSettings.bjpToBrsTransferPct}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Percentage of baseline BJP voters who vote for the BRS candidate in the 74 BRS-allocated rural seats.
                  </p>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={coalitionSettings.bjpToBrsTransferPct}
                    onChange={(e) =>
                      setCoalitionSettings((prev) => ({ ...prev, bjpToBrsTransferPct: Number(e.target.value) }))
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>50% (Urban Reluctance)</span>
                    <span>95% (Perfect Alignment)</span>
                  </div>
                </div>

                {/* Friction Slider 3: Rebel Leakage to INC */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-rose-400">Anti-Pact Rebel Leakage to INC</span>
                    <span className="text-xs font-mono font-black text-rose-300 bg-rose-950 px-2 py-0.5 rounded">
                      {coalitionSettings.rebelLeakagePct}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Cadre who refuse the coalition partner and rebel by casting their votes for the Congress opposition.
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
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>5% (Disciplined)</span>
                    <span>35% (Mass Mutiny)</span>
                  </div>
                </div>
              </div>

              {/* Quick One-Click Coalition Presets */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Coalition Friction Presets:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() =>
                      setCoalitionSettings({ brsToBjpTransferPct: 85, bjpToBrsTransferPct: 80, rebelLeakagePct: 10 })
                    }
                    className="px-3 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/60 rounded-lg font-bold cursor-pointer transition-colors"
                  >
                    Disciplined Base (85:80 | 10% Leak)
                  </button>
                  <button
                    onClick={() => setCoalitionSettings(DEFAULT_COALITION_SETTINGS)}
                    className="px-3 py-1 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-300 border border-indigo-700/60 rounded-lg font-bold cursor-pointer transition-colors"
                  >
                    Standard Formula (75:65 | 15% Leak)
                  </button>
                  <button
                    onClick={() =>
                      setCoalitionSettings({ brsToBjpTransferPct: 60, bjpToBrsTransferPct: 55, rebelLeakagePct: 25 })
                    }
                    className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-300 border border-rose-700/60 rounded-lg font-bold cursor-pointer transition-colors"
                  >
                    High Friction &amp; Rebellion (60:55 | 25% Leak)
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

          {/* TAB 4: ANTI-INCUMBENCY & MLA SURGERY */}
          {activeTab === 'anti_incumbency' && (
            <div className="space-y-4 animate-in fade-in duration-150">
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
            </div>
          )}

          {/* TAB 5: TARGET 60 & MONTE CARLO PROBABILITY */}
          {activeTab === 'target_60' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Target 60 Reverse Solver */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crosshair className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs text-white">Target 60 Reverse Optimizer</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                      {(['BRS', 'BJP', 'INC'] as const).map((p) => (
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
                      <span className="text-xl font-black text-white">{target60Plan.wonCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">NEEDED</span>
                      <span className={`text-xl font-black ${target60Plan.needed === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {target60Plan.needed === 0 ? 'MAJORITY' : `${target60Plan.needed} seats`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">AVG DEFICIT</span>
                      <span className="text-sm font-black text-indigo-300">~{target60Plan.avgDeficit.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1">
                    <span>
                      Top target: <strong>{target60Plan.pickupSeats[0]?.result.ac_name || 'None'}</strong> (Deficit: ~{target60Plan.pickupSeats[0]?.deficitVotes.toLocaleString()} votes)
                    </span>
                    {target60Plan.pickupSeats[0] && (
                      <button
                        onClick={() => onNavigateToActions(target60Plan.pickupSeats[0]?.result.ac_no)}
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
                      <span className="text-[10px] text-slate-400 block font-bold">COALITION WIN</span>
                      <span className="text-xl font-black text-emerald-400">{monteCarloStats.coalition.winProb}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">INC WIN</span>
                      <span className="text-xl font-black text-sky-400">{monteCarloStats.inc.winProb}%</span>
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
