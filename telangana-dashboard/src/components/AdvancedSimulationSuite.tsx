import React, { useState, useMemo } from 'react';
import type { SeeepcDataset, SimulatedConstituencyResult } from '../types';
import { getPartyColor } from '../types';
import type { MacroSwing, PartySwing } from './SwingStudioModal';
import {
  Dices,
  Users,
  Handshake,
  Crosshair,
  GitCompare,
  AlertTriangle,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  UserX,
  Shuffle,
  RefreshCw,
} from 'lucide-react';
import type {
  WelfareSettings,
  MlaFatigueSettings,
  CannibalizationSettings,
} from './StrategicSimulationModels';
import {
  DEFAULT_WELFARE_SETTINGS,
  DEFAULT_MLA_FATIGUE_SETTINGS,
  DEFAULT_CANNIBALIZATION_SETTINGS,
} from './StrategicSimulationModels';

export interface TurnoutSettings {
  urbanShift: number;   // -15% to +15%
  ruralShift: number;   // -10% to +10%
  femaleShift: number;  // -8% to +8% (Mahalakshmi Welfare effect)
}

interface AdvancedSimulationSuiteProps {
  data: SeeepcDataset;
  simulatedResults: SimulatedConstituencyResult[];
  swings: Record<string, PartySwing>;
  setSwings: React.Dispatch<React.SetStateAction<Record<string, PartySwing>>>;
  macroSwing: MacroSwing;
  setMacroSwing: React.Dispatch<React.SetStateAction<MacroSwing>>;
  turnoutSettings: TurnoutSettings;
  setTurnoutSettings: React.Dispatch<React.SetStateAction<TurnoutSettings>>;
  welfareSettings: WelfareSettings;
  setWelfareSettings: React.Dispatch<React.SetStateAction<WelfareSettings>>;
  mlaFatigueSettings: MlaFatigueSettings;
  setMlaFatigueSettings: React.Dispatch<React.SetStateAction<MlaFatigueSettings>>;
  cannibalizationSettings: CannibalizationSettings;
  setCannibalizationSettings: React.Dispatch<React.SetStateAction<CannibalizationSettings>>;
  onApplyPreset: (presetKey: string) => void;
  onNavigateToActions: (acNo?: number) => void;
}

type SuiteTab =
  | 'monte_carlo'
  | 'turnout'
  | 'welfare_meter'
  | 'mla_fatigue'
  | 'cannibalization'
  | 'alliances'
  | 'target_60'
  | 'diff_mode';

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
  17, 26, 106, 107, 112
]);

export const AdvancedSimulationSuite: React.FC<AdvancedSimulationSuiteProps> = ({
  data,
  simulatedResults,
  swings,
  setSwings,
  macroSwing,
  setMacroSwing,
  turnoutSettings,
  setTurnoutSettings,
  welfareSettings,
  setWelfareSettings,
  mlaFatigueSettings,
  setMlaFatigueSettings,
  cannibalizationSettings,
  setCannibalizationSettings,
  onApplyPreset,
  onNavigateToActions,
}) => {
  const [activeTab, setActiveTab] = useState<SuiteTab>('monte_carlo');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  // --- Feature 2: Monte Carlo Probabilistic Forecast State ---
  const [pollingErrorSigma, setPollingErrorSigma] = useState<number>(3.0); // Polling uncertainty %
  const [simulationSeed, setSimulationSeed] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // --- Feature 9: Target 60 Reverse-Optimizer State ---
  const [targetParty, setTargetParty] = useState<'INC' | 'BRS' | 'BJP'>('BRS');

  // --- Feature 14: Diff View Filter State ---
  const [diffFilter, setDiffFilter] = useState<'ALL' | 'FLIPS' | 'TIGHTENED'>('FLIPS');
  const [diffSearch, setDiffSearch] = useState<string>('');

  // ----------------------------------------------------
  // FEATURE 2: 1,000-Run Monte Carlo Simulation Engine
  // ----------------------------------------------------
  const monteCarloStats = useMemo(() => {
    // Reference run trigger via simulationSeed and pollingErrorSigma
    void simulationSeed;
    const runs = 1000;
    const incSeats: number[] = [];
    const brsSeats: number[] = [];
    const bjpSeats: number[] = [];
    let incWins = 0;
    let brsWins = 0;
    let bjpWins = 0;
    let hungCount = 0;

    for (let r = 0; r < runs; r++) {
      // Correlated statewide polling error for this specific run
      const stateErrInc = gaussianRandom() * (pollingErrorSigma * 0.7);
      const stateErrBrs = gaussianRandom() * (pollingErrorSigma * 0.7);
      const stateErrBjp = gaussianRandom() * (pollingErrorSigma * 0.6);

      let runIncSeats = 0;
      let runBrsSeats = 0;
      let runBjpSeats = 0;

      for (let i = 0; i < simulatedResults.length; i++) {
        const item = simulatedResults[i];
        const votes = item.simulated.party_votes;

        // Idiosyncratic local noise for this constituency
        const localNoiseInc = gaussianRandom() * (pollingErrorSigma * 0.5);
        const localNoiseBrs = gaussianRandom() * (pollingErrorSigma * 0.5);
        const localNoiseBjp = gaussianRandom() * (pollingErrorSigma * 0.5);

        const totalVotes = item.simulated.winner_votes + item.simulated.runner_votes;

        const simInc = votes.INC + totalVotes * ((stateErrInc + localNoiseInc) / 100);
        const simBrs = votes.BRS + totalVotes * ((stateErrBrs + localNoiseBrs) / 100);
        const simBjp = votes.BJP + totalVotes * ((stateErrBjp + localNoiseBjp) / 100);
        const simAimim = votes.AIMIM || 0;

        const pairs: [string, number][] = [
          ['INC', simInc],
          ['BRS', simBrs],
          ['BJP', simBjp],
        ];
        if (simAimim > 0) pairs.push(['AIMIM', simAimim]);
        pairs.sort((a, b) => b[1] - a[1]);

        const winner = pairs[0][0];
        if (winner === 'INC') runIncSeats++;
        else if (winner === 'BRS') runBrsSeats++;
        else if (winner === 'BJP') runBjpSeats++;
      }

      incSeats.push(runIncSeats);
      brsSeats.push(runBrsSeats);
      bjpSeats.push(runBjpSeats);

      if (runIncSeats >= 60) incWins++;
      else if (runBrsSeats >= 60) brsWins++;
      else if (runBjpSeats >= 60) bjpWins++;
      else hungCount++;
    }

    incSeats.sort((a, b) => a - b);
    brsSeats.sort((a, b) => a - b);
    bjpSeats.sort((a, b) => a - b);

    // Distribution percentiles (P10, P50, P90)
    return {
      inc: {
        winProb: Number(((incWins / runs) * 100).toFixed(1)),
        median: incSeats[500],
        p10: incSeats[100],
        p90: incSeats[900],
        seats: incSeats,
      },
      brs: {
        winProb: Number(((brsWins / runs) * 100).toFixed(1)),
        median: brsSeats[500],
        p10: brsSeats[100],
        p90: brsSeats[900],
        seats: brsSeats,
      },
      bjp: {
        winProb: Number(((bjpWins / runs) * 100).toFixed(1)),
        median: bjpSeats[500],
        p10: bjpSeats[100],
        p90: bjpSeats[900],
        seats: bjpSeats,
      },
      hungProb: Number(((hungCount / runs) * 100).toFixed(1)),
    };
  }, [simulatedResults, pollingErrorSigma, simulationSeed]);

  const handleRerunMonteCarlo = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setSimulationSeed((prev) => prev + 1);
      setIsSimulating(false);
    }, 200);
  };

  // ----------------------------------------------------
  // FEATURE 9: Target 60 Reverse-Optimizer (Goal Seek)
  // ----------------------------------------------------
  const target60Plan = useMemo(() => {
    const currentWon = simulatedResults.filter((r) => r.simulated.winner_party === targetParty);
    const wonCount = currentWon.length;
    const needed = Math.max(0, 60 - wonCount);

    // Filter constituencies not won by target party and sort by smallest margin deficit
    const candidates = simulatedResults
      .filter((r) => r.simulated.winner_party !== targetParty)
      .map((r) => {
        const targetVotes = r.simulated.party_votes[targetParty] || 0;
        const winnerVotes = r.simulated.winner_votes;
        const deficit = winnerVotes - targetVotes;

        // Calculate demographic leverage in this AC
        const acData = data.constituencies[String(r.ac_no)];
        const cp: Record<string, number> = acData ? (acData.caste_profile as unknown as Record<string, number>) : {};
        const sortedComms: [string, number][] = (Object.entries(cp) as [string, number][]).sort((a, b) => b[1] - a[1]);
        const topComm: [string, number] = sortedComms[0] || ['bc_mudiraj', 15];

        // Calculated % swing in that top community needed to flip this AC
        const totalVotes = r.simulated.winner_votes + r.simulated.runner_votes;
        const communityVoters = totalVotes * (topComm[1] / 100);
        const requiredSwingPct =
          communityVoters > 0
            ? Math.min(25, Number(((deficit / (2 * communityVoters)) * 100).toFixed(1)))
            : 10;

        return {
          ac_no: r.ac_no,
          ac_name: r.ac_name,
          district: r.district,
          winner: r.simulated.winner_party,
          deficit,
          topCommKey: topComm[0],
          topCommPct: topComm[1],
          requiredSwingPct,
        };
      })
      .sort((a, b) => a.deficit - b.deficit);

    const pickupSeats = candidates.slice(0, needed);
    const avgDeficit =
      pickupSeats.length > 0
        ? Math.round(pickupSeats.reduce((sum, s) => sum + s.deficit, 0) / pickupSeats.length)
        : 0;

    return {
      wonCount,
      needed,
      pickupSeats,
      avgDeficit,
    };
  }, [simulatedResults, targetParty, data]);

  // Apply single target swing recommendation
  const handleApplyTargetLever = (commKey: string, swingPct: number) => {
    setSwings((prev) => {
      const current = prev[commKey] || { INC: 0, BRS: 0, BJP: 0 };
      return {
        ...prev,
        [commKey]: {
          ...current,
          [targetParty]: Math.min(20, Math.round((current[targetParty] + swingPct) * 10) / 10),
        },
      };
    });
  };

  // ----------------------------------------------------
  // FEATURE 14: Scenario Diff & Benchmark Calculations
  // ----------------------------------------------------
  const diffList = useMemo(() => {
    return simulatedResults
      .map((r) => {
        const actualWin = r.votes_2023.winner_party;
        const simWin = r.simulated.winner_party;
        const actualMargin = r.votes_2023.margin;
        const simMargin = r.simulated.margin;
        const isFlipped = simWin !== actualWin;
        const marginDelta = simMargin - actualMargin;

        return {
          ac_no: r.ac_no,
          ac_name: r.ac_name,
          district: r.district,
          actualWinner: actualWin,
          simWinner: simWin,
          actualMargin,
          simMargin,
          isFlipped,
          marginDelta,
          tier: r.battleground_tier,
          isTightened: !isFlipped && simMargin < actualMargin && simMargin <= 6000,
        };
      })
      .filter((r) => {
        if (diffFilter === 'FLIPS' && !r.isFlipped) return false;
        if (diffFilter === 'TIGHTENED' && !r.isTightened) return false;
        if (diffSearch.trim()) {
          const q = diffSearch.toLowerCase().trim();
          return (
            r.ac_name.toLowerCase().includes(q) ||
            r.district.toLowerCase().includes(q) ||
            r.simWinner.toLowerCase().includes(q)
          );
        }
        return true;
      });
  }, [simulatedResults, diffFilter, diffSearch]);

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-slate-100 transition-all ${
      isCollapsed ? 'p-4 sm:p-4.5' : 'p-4 sm:p-5 space-y-5'
    }`}>
      {/* Top Header */}
      {isCollapsed ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 rounded-xl">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>War Room Simulation Suite</span>
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                  Advanced Lab
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Probabilistic forecasting, differential mobilization, alliance builder &amp; target optimization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono font-medium">
              {activeTab === 'monte_carlo'
                ? '🎲 Monte Carlo (1,000 Runs)'
                : activeTab === 'turnout'
                ? '👥 Turnout Mobilization'
                : activeTab === 'alliances'
                ? '🤝 Coalition Sandbox'
                : activeTab === 'target_60'
                ? '🎯 Target 60 Optimizer'
                : '⚖️ Scenario Diff'}
            </span>
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              title="Open and expand the Advanced Simulation Suite"
            >
              <ChevronDown className="w-4 h-4" />
              <span>Open Simulation Suite</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5 border-b border-slate-800 pb-3.5">
          {/* Top Row: Suite Title & Collapse Button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 rounded-xl shrink-0">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <span>War Room Simulation Suite</span>
                  <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                    Advanced Lab
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Probabilistic forecasting, welfare delivery, ticket surgery, 3-way cannibalization &amp; target optimization
                </p>
              </div>
            </div>

            {/* Collapse Button */}
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer border border-slate-700 shrink-0 flex items-center gap-1.5 px-3 text-xs font-semibold shadow-xs"
              title="Collapse Simulation Suite"
            >
              <ChevronUp className="w-4 h-4" />
              <span className="hidden sm:inline">Collapse</span>
            </button>
          </div>

          {/* Sub-Tabs: 2-Line Structured Grid with Sized-Up Typography */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800/90 shadow-inner">
            <button
              onClick={() => setActiveTab('monte_carlo')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-2 ${
                activeTab === 'monte_carlo'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <Dices className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">Monte Carlo (1,000 Runs)</span>
            </button>
            <button
              onClick={() => setActiveTab('turnout')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-2 ${
                activeTab === 'turnout'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="truncate">Turnout Mobilization</span>
            </button>
            <button
              onClick={() => setActiveTab('welfare_meter')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-2 ${
                activeTab === 'welfare_meter'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Welfare Guarantee Meter</span>
            </button>
            <button
              onClick={() => setActiveTab('mla_fatigue')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-2 ${
                activeTab === 'mla_fatigue'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <UserX className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">MLA Fatigue Surgery</span>
            </button>
            <button
              onClick={() => setActiveTab('cannibalization')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-2 ${
                activeTab === 'cannibalization'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <Shuffle className="w-4 h-4 text-pink-400 shrink-0" />
              <span className="truncate">3-Way Cannibalization</span>
            </button>
            <button
              onClick={() => setActiveTab('alliances')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-2 ${
                activeTab === 'alliances'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <Handshake className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="truncate">Coalition Sandbox</span>
            </button>
            <button
              onClick={() => setActiveTab('target_60')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-2 ${
                activeTab === 'target_60'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <Crosshair className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="truncate">Target 60 Optimizer</span>
            </button>
            <button
              onClick={() => setActiveTab('diff_mode')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-2 ${
                activeTab === 'diff_mode'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <GitCompare className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="truncate">Scenario Diff</span>
            </button>
          </div>
        </div>
      )}

      {/* Expanded Suite Body */}
      {!isCollapsed && (
        <div className="space-y-5 animate-in fade-in duration-150">

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: MONTE CARLO PROBABILISTIC FORECAST (#2)                */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'monte_carlo' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Nate Silver / 538 Style Probabilistic Engine</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">
                  1,000 Simulated Elections
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Simulates polling error volatility across correlated statewide and idiosyncratic constituency noise
              </p>
            </div>

            {/* Uncertainty Slider & Re-run Button */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400">Polling Uncertainty:</span>
                <input
                  type="range"
                  min="1.5"
                  max="5.0"
                  step="0.5"
                  value={pollingErrorSigma}
                  onChange={(e) => setPollingErrorSigma(Number(e.target.value))}
                  className="w-20 accent-indigo-500 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-indigo-300">&plusmn;{pollingErrorSigma}%</span>
              </div>

              <button
                onClick={handleRerunMonteCarlo}
                disabled={isSimulating}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Dices className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>Re-Simulate</span>
              </button>
            </div>
          </div>

          {/* Win Probability Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* INC */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-sky-800/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                  INC (Congress)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Majority Threshold: 60</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-black text-white">{monteCarloStats.inc.winProb}%</div>
                  <div className="text-[11px] text-slate-400">Win Probability</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-200 font-mono">
                    {monteCarloStats.inc.median} Seats
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    80% CI: [{monteCarloStats.inc.p10} &ndash; {monteCarloStats.inc.p90}]
                  </div>
                </div>
              </div>
            </div>

            {/* BRS */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-pink-800/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-pink-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
                  BRS (TRS)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Majority Threshold: 60</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-black text-white">{monteCarloStats.brs.winProb}%</div>
                  <div className="text-[11px] text-slate-400">Win Probability</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-200 font-mono">
                    {monteCarloStats.brs.median} Seats
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    80% CI: [{monteCarloStats.brs.p10} &ndash; {monteCarloStats.brs.p90}]
                  </div>
                </div>
              </div>
            </div>

            {/* BJP */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-amber-800/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                  BJP
                </span>
                <span className="text-[10px] font-mono text-slate-400">Majority Threshold: 60</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-black text-white">{monteCarloStats.bjp.winProb}%</div>
                  <div className="text-[11px] text-slate-400">Win Probability</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-200 font-mono">
                    {monteCarloStats.bjp.median} Seats
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    80% CI: [{monteCarloStats.bjp.p10} &ndash; {monteCarloStats.bjp.p90}]
                  </div>
                </div>
              </div>
            </div>

            {/* HUNG ASSEMBLY */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-purple-800/50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
                  Hung Assembly
                </span>
                <span className="text-[10px] font-mono text-slate-400">No Party &ge; 60</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-black text-white">{monteCarloStats.hungProb}%</div>
                  <div className="text-[11px] text-slate-400">Likelihood</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-purple-300">Kingmaker Zone</div>
                  <div className="text-[10px] text-slate-400">AIMIM + Independents decide CM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Probability Distribution Density Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Overall Win Probability Split:</span>
              <span className="font-mono text-slate-300">Total: 100% (1,000 runs)</span>
            </div>
            <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-950 p-0.5 border border-slate-800">
              <div
                style={{ width: `${monteCarloStats.inc.winProb}%` }}
                className="bg-[#0284c7] h-full transition-all duration-300"
                title={`INC: ${monteCarloStats.inc.winProb}%`}
              />
              <div
                style={{ width: `${monteCarloStats.brs.winProb}%` }}
                className="bg-[#ec4899] h-full transition-all duration-300"
                title={`BRS: ${monteCarloStats.brs.winProb}%`}
              />
              <div
                style={{ width: `${monteCarloStats.bjp.winProb}%` }}
                className="bg-[#f97316] h-full transition-all duration-300"
                title={`BJP: ${monteCarloStats.bjp.winProb}%`}
              />
              <div
                style={{ width: `${monteCarloStats.hungProb}%` }}
                className="bg-purple-600 h-full transition-all duration-300"
                title={`Hung: ${monteCarloStats.hungProb}%`}
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: TURNOUT & DIFFERENTIAL MOBILIZATION (#3)               */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'turnout' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Voter Turnout &amp; Demographic Mobilization Simulator</span>
                {(turnoutSettings.urbanShift !== 0 || turnoutSettings.ruralShift !== 0 || turnoutSettings.femaleShift !== 0) && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono border border-emerald-500/30">
                    Active Mobilization
                  </span>
                )}
              </h4>
              <p className="text-[11px] text-slate-400">
                Simulate how differential voter enthusiasm between urban apathy, rural turnout, and women welfare beneficiaries alters the map
              </p>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Presets:</span>
              <button
                onClick={() => setTurnoutSettings({ urbanShift: 0, ruralShift: 0, femaleShift: 0 })}
                className="px-2 py-0.5 text-xs rounded-md font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                Neutral
              </button>
              <button
                onClick={() => setTurnoutSettings({ urbanShift: -10, ruralShift: 4, femaleShift: 2 })}
                className="px-2 py-0.5 text-xs rounded-md font-semibold bg-sky-950/60 hover:bg-sky-900/80 text-sky-200 border border-sky-800/60 cursor-pointer"
              >
                Urban Apathy (-10%)
              </button>
              <button
                onClick={() => setTurnoutSettings({ urbanShift: 2, ruralShift: 3, femaleShift: 6 })}
                className="px-2 py-0.5 text-xs rounded-md font-semibold bg-pink-950/60 hover:bg-pink-900/80 text-pink-200 border border-pink-800/60 cursor-pointer"
              >
                Mahalakshmi Women Surge (+6%)
              </button>
              <button
                onClick={() => setTurnoutSettings({ urbanShift: 8, ruralShift: 8, femaleShift: 0 })}
                className="px-2 py-0.5 text-xs rounded-md font-semibold bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-800/60 cursor-pointer"
              >
                Hyper-Polarized Wave (+8%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Urban Turnout */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Urban Voter Turnout</span>
                <span className="text-[10px] text-slate-400">GHMC &amp; Municipalities (29 ACs)</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-white font-mono">
                  {turnoutSettings.urbanShift >= 0 ? `+${turnoutSettings.urbanShift}%` : `${turnoutSettings.urbanShift}%`}
                </span>
                <span className="text-[11px] text-slate-400">
                  {turnoutSettings.urbanShift > 0 ? 'Favors BJP & INC Urban' : turnoutSettings.urbanShift < 0 ? 'Favors BRS Core Base' : 'Baseline (48% TS)'}
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                step="1"
                value={turnoutSettings.urbanShift}
                onChange={(e) => setTurnoutSettings((prev) => ({ ...prev, urbanShift: Number(e.target.value) }))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-15% (Apathy)</span>
                <span>+15% (Surge)</span>
              </div>
            </div>

            {/* Rural Turnout */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Rural Agrarian Turnout</span>
                <span className="text-[10px] text-slate-400">90 Rural ACs</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-white font-mono">
                  {turnoutSettings.ruralShift >= 0 ? `+${turnoutSettings.ruralShift}%` : `${turnoutSettings.ruralShift}%`}
                </span>
                <span className="text-[11px] text-slate-400">
                  {turnoutSettings.ruralShift > 0 ? 'Agrarian Dissatisfaction' : 'Turnout Suppression'}
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="1"
                value={turnoutSettings.ruralShift}
                onChange={(e) => setTurnoutSettings((prev) => ({ ...prev, ruralShift: Number(e.target.value) }))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-10%</span>
                <span>+10%</span>
              </div>
            </div>

            {/* Female Mobilization */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Mahalakshmi Female Mobilization</span>
                <span className="text-[10px] text-slate-400">Free Bus &amp; Gas Subsidy</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-white font-mono">
                  {turnoutSettings.femaleShift >= 0 ? `+${turnoutSettings.femaleShift}%` : `${turnoutSettings.femaleShift}%`}
                </span>
                <span className="text-[11px] text-slate-400">
                  {turnoutSettings.femaleShift > 0 ? 'High INC Welfare Stickiness' : 'Welfare Fatigue'}
                </span>
              </div>
              <input
                type="range"
                min="-8"
                max="8"
                step="1"
                value={turnoutSettings.femaleShift}
                onChange={(e) => setTurnoutSettings((prev) => ({ ...prev, femaleShift: Number(e.target.value) }))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-8%</span>
                <span>+8% (Female Wave)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* FEATURE 2: WELFARE GUARANTEE DELIVERY INDEX ("LABHARTHI METER") */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'welfare_meter' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>The Welfare Delivery Barometer ("Labharthi Meter")</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                  Flagship Guarantee Levers
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Simulate voter retention and swing based on operational rollout of direct welfare transfers
              </p>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-semibold mr-1">Presets:</span>
              <button
                onClick={() =>
                  setWelfareSettings({
                    mahalakshmiPct: 95,
                    rythuBharosaPct: 90,
                    loanWaiverPct: 90,
                    gruhaJyothiPct: 95,
                    indirammaIndluPct: 75,
                  })
                }
                className="px-2 py-1 text-xs rounded-md font-semibold bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-800/60 cursor-pointer"
              >
                100% Saturation Wave
              </button>
              <button
                onClick={() =>
                  setWelfareSettings({
                    mahalakshmiPct: 45,
                    rythuBharosaPct: 35,
                    loanWaiverPct: 30,
                    gruhaJyothiPct: 60,
                    indirammaIndluPct: 15,
                  })
                }
                className="px-2 py-1 text-xs rounded-md font-semibold bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-800/60 cursor-pointer"
              >
                Fiscal Bottleneck (-40%)
              </button>
              <button
                onClick={() => setWelfareSettings(DEFAULT_WELFARE_SETTINGS)}
                className="px-2 py-1 text-xs rounded-md font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset (Current Reality)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Mahalakshmi */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-pink-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-400" />
                  Mahalakshmi (Free Bus &amp; ₹2,500/mo)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Target: Women</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-white font-mono">
                  {welfareSettings.mahalakshmiPct}%
                </span>
                <span className="text-[11px] font-semibold text-pink-300">
                  {welfareSettings.mahalakshmiPct >= 75
                    ? `+${(((welfareSettings.mahalakshmiPct - 75) * 0.038)).toFixed(1)}% INC Women Edge`
                    : `${(((welfareSettings.mahalakshmiPct - 75) * 0.038)).toFixed(1)}% Deficit`}
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={welfareSettings.mahalakshmiPct}
                onChange={(e) =>
                  setWelfareSettings((prev) => ({ ...prev, mahalakshmiPct: Number(e.target.value) }))
                }
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>20% (Distress)</span>
                <span>Baseline (75%)</span>
                <span>100% (Universal)</span>
              </div>
            </div>

            {/* Rythu Bharosa */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Rythu Bharosa (₹15,000/acre)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Agrarian Belts</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-white font-mono">
                  {welfareSettings.rythuBharosaPct}%
                </span>
                <span className="text-[11px] font-semibold text-emerald-300">
                  {welfareSettings.rythuBharosaPct >= 70
                    ? `+${(((welfareSettings.rythuBharosaPct - 70) * 0.042)).toFixed(1)}% Rural Swing`
                    : `${(((welfareSettings.rythuBharosaPct - 70) * 0.042)).toFixed(1)}% Agrarian Backlash`}
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={welfareSettings.rythuBharosaPct}
                onChange={(e) =>
                  setWelfareSettings((prev) => ({ ...prev, rythuBharosaPct: Number(e.target.value) }))
                }
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>20% (Tenant Anger)</span>
                <span>Baseline (70%)</span>
                <span>100%</span>
              </div>
            </div>

            {/* Farm Loan Waiver */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Crop Loan Waiver (₹2 Lakh)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">North/South TS</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-white font-mono">
                  {welfareSettings.loanWaiverPct}%
                </span>
                <span className="text-[11px] font-semibold text-amber-300">
                  {welfareSettings.loanWaiverPct >= 65
                    ? `+${(((welfareSettings.loanWaiverPct - 65) * 0.045)).toFixed(1)}% Farmer Lock`
                    : `${(((welfareSettings.loanWaiverPct - 65) * 0.045)).toFixed(1)}% Unfulfilled Anger`}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={welfareSettings.loanWaiverPct}
                onChange={(e) =>
                  setWelfareSettings((prev) => ({ ...prev, loanWaiverPct: Number(e.target.value) }))
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10%</span>
                <span>Baseline (65%)</span>
                <span>100% Full Waiver</span>
              </div>
            </div>

            {/* Gruha Jyothi */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Gruha Jyothi (200 Units Free)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Urban Slums &amp; Rural</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-white font-mono">
                  {welfareSettings.gruhaJyothiPct}%
                </span>
                <span className="text-[11px] font-semibold text-cyan-300">
                  {welfareSettings.gruhaJyothiPct >= 85
                    ? 'Universal Free Power Active'
                    : 'Disconnection Friction'}
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="5"
                value={welfareSettings.gruhaJyothiPct}
                onChange={(e) =>
                  setWelfareSettings((prev) => ({ ...prev, gruhaJyothiPct: Number(e.target.value) }))
                }
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>40%</span>
                <span>Baseline (85%)</span>
                <span>100%</span>
              </div>
            </div>

            {/* Indiramma Indlu */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-violet-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400" />
                  Indiramma Indlu (₹5 Lakh Housing)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">SC/ST/BC Poor</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-white font-mono">
                  {welfareSettings.indirammaIndluPct}%
                </span>
                <span className="text-[11px] font-semibold text-violet-300">
                  {welfareSettings.indirammaIndluPct >= 40
                    ? `+${(((welfareSettings.indirammaIndluPct - 40) * 0.030)).toFixed(1)}% Dalit/OBC Loyalty`
                    : 'Allotment Delay Penalty'}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={welfareSettings.indirammaIndluPct}
                onChange={(e) =>
                  setWelfareSettings((prev) => ({ ...prev, indirammaIndluPct: Number(e.target.value) }))
                }
                className="w-full accent-violet-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10% (Phase 1)</span>
                <span>Baseline (40%)</span>
                <span>100% All Gramas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* FEATURE 3: CANDIDATE FATIGUE & INCUMBENT MLA REPLACEMENT       */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'mla_fatigue' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <UserX className="w-4 h-4 text-amber-400" />
                <span>Incumbent MLA Fatigue &amp; Ticket Surgery Simulator</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                  Anti-Incumbency Decoupling
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Model ticket distribution surgery: dropping vulnerable/unpopular MLAs vs retaining fatigued incumbents
              </p>
            </div>

            {/* Target Party Picker & Reset */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-slate-400 font-semibold">Party Surgery:</span>
              <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                {(['INC', 'BRS', 'BJP'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setMlaFatigueSettings((prev) => ({ ...prev, targetParty: p }))}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      mlaFatigueSettings.targetParty === p
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setMlaFatigueSettings(DEFAULT_MLA_FATIGUE_SETTINGS)}
                className="px-2 py-1 text-xs rounded-md font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer flex items-center gap-1"
                title="Reset MLA surgery settings"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Surgery Slider: Drop Vulnerable Incumbents */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300">Drop Unpopular Sitting MLAs</span>
                <span className="text-[10px] text-slate-400 font-mono">Ticket Distribution</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-white font-mono">
                  {mlaFatigueSettings.replaceIncumbentPct} MLAs Replaced
                </span>
                <span className="text-[11px] font-semibold text-amber-400">
                  {mlaFatigueSettings.replaceIncumbentPct > 0 ? 'Fresh Face Recovery Active' : 'All Incumbents Retained'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="5"
                value={mlaFatigueSettings.replaceIncumbentPct}
                onChange={(e) =>
                  setMlaFatigueSettings((prev) => ({
                    ...prev,
                    replaceIncumbentPct: Number(e.target.value),
                  }))
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 (Repeat All)</span>
                <span>20 MLAs (Surgical)</span>
                <span>40 MLAs (Mass Purge)</span>
              </div>
            </div>

            {/* Fatigue Penalty for Retaining */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-300">Voter Fatigue Penalty</span>
                <span className="text-[10px] text-slate-400 font-mono">If Incumbent Repeated</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-rose-400 font-mono">
                  {mlaFatigueSettings.unpopularMlaPenalty}%
                </span>
                <span className="text-[11px] text-slate-400">
                  Local corruption / accessibility penalty
                </span>
              </div>
              <input
                type="range"
                min="-8"
                max="-1"
                step="0.5"
                value={mlaFatigueSettings.unpopularMlaPenalty}
                onChange={(e) =>
                  setMlaFatigueSettings((prev) => ({
                    ...prev,
                    unpopularMlaPenalty: Number(e.target.value),
                  }))
                }
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-8% (Severe Rage)</span>
                <span>-4.5% (Baseline)</span>
                <span>-1% (Mild)</span>
              </div>
            </div>

            {/* Fresh Face Vitality Boost */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300">Fresh Face Vitality Boost</span>
                <span className="text-[10px] text-slate-400 font-mono">When New Nominee Picked</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-emerald-400 font-mono">
                  +{mlaFatigueSettings.freshFaceBoost}%
                </span>
                <span className="text-[11px] text-slate-400">
                  Neutralizes anti-incumbency
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={mlaFatigueSettings.freshFaceBoost}
                onChange={(e) =>
                  setMlaFatigueSettings((prev) => ({
                    ...prev,
                    freshFaceBoost: Number(e.target.value),
                  }))
                }
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>+1%</span>
                <span>+4% (Benchmark)</span>
                <span>+8% (Youth Surge)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* FEATURE 4: TRI-CORNERED VOTE CANNIBALIZATION & DEFECTION MODEL */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'cannibalization' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Shuffle className="w-4 h-4 text-pink-400" />
                <span>Tri-Cornered Vote Cannibalization &amp; Defection Modeler</span>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded font-mono font-bold">
                  3-Way Transfer Friction
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Model where votes flow when a party bleeds cadre, leadership defects, or voter polarization spikes
              </p>
            </div>

            {/* Reset */}
            <button
              onClick={() => setCannibalizationSettings(DEFAULT_CANNIBALIZATION_SETTINGS)}
              className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Flow</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Bleeding Source Party */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="text-xs font-bold text-slate-300">1. Bleeding / Defecting Party</div>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {(['BRS', 'INC', 'BJP'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() =>
                      setCannibalizationSettings((prev) => ({
                        ...prev,
                        sourceParty: p,
                        destinationRatio:
                          p === 'BRS'
                            ? { toBjp: 60, toInc: 40, toBrs: 0 }
                            : p === 'INC'
                            ? { toBjp: 45, toBrs: 55, toInc: 0 }
                            : { toBrs: 40, toInc: 60, toBjp: 0 },
                      }))
                    }
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      cannibalizationSettings.sourceParty === p
                        ? 'bg-pink-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-slate-400 pt-1">
                Simulating vote drain away from {cannibalizationSettings.sourceParty}
              </div>
            </div>

            {/* Bleed Percentage Slider */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">2. Vote Share Siphoned</span>
                <span className="text-[10px] text-pink-400 font-mono font-bold">
                  -{cannibalizationSettings.bleedPct}%
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-white font-mono">
                  {cannibalizationSettings.bleedPct}%
                </span>
                <span className="text-[11px] text-slate-400">
                  {cannibalizationSettings.bleedPct === 0 ? 'No Defection' : 'Active Cadre Migration'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={cannibalizationSettings.bleedPct}
                onChange={(e) =>
                  setCannibalizationSettings((prev) => ({
                    ...prev,
                    bleedPct: Number(e.target.value),
                  }))
                }
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0%</span>
                <span>4% (Defection)</span>
                <span>12% (Collapse)</span>
              </div>
            </div>

            {/* Absorption Split Slider */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">3. Absorption Ratio</span>
                <span className="text-[10px] text-indigo-300 font-mono font-bold">Split %</span>
              </div>
              {cannibalizationSettings.sourceParty === 'BRS' && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold">BJP: {cannibalizationSettings.destinationRatio.toBjp}%</span>
                    <span className="text-sky-400 font-bold">INC: {cannibalizationSettings.destinationRatio.toInc}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={cannibalizationSettings.destinationRatio.toBjp}
                    onChange={(e) => {
                      const toBjp = Number(e.target.value);
                      setCannibalizationSettings((prev) => ({
                        ...prev,
                        destinationRatio: { toBjp, toInc: 100 - toBjp, toBrs: 0 },
                      }));
                    }}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>100% to INC</span>
                    <span>50:50</span>
                    <span>100% to BJP</span>
                  </div>
                </div>
              )}
              {cannibalizationSettings.sourceParty === 'INC' && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold">BJP: {cannibalizationSettings.destinationRatio.toBjp}%</span>
                    <span className="text-pink-400 font-bold">BRS: {cannibalizationSettings.destinationRatio.toBrs}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={cannibalizationSettings.destinationRatio.toBjp}
                    onChange={(e) => {
                      const toBjp = Number(e.target.value);
                      setCannibalizationSettings((prev) => ({
                        ...prev,
                        destinationRatio: { toBjp, toBrs: 100 - toBjp, toInc: 0 },
                      }));
                    }}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>100% to BRS</span>
                    <span>50:50</span>
                    <span>100% to BJP</span>
                  </div>
                </div>
              )}
              {cannibalizationSettings.sourceParty === 'BJP' && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-pink-400 font-bold">BRS: {cannibalizationSettings.destinationRatio.toBrs}%</span>
                    <span className="text-sky-400 font-bold">INC: {cannibalizationSettings.destinationRatio.toInc}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={cannibalizationSettings.destinationRatio.toBrs}
                    onChange={(e) => {
                      const toBrs = Number(e.target.value);
                      setCannibalizationSettings((prev) => ({
                        ...prev,
                        destinationRatio: { toBrs, toInc: 100 - toBrs, toBjp: 0 },
                      }));
                    }}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>100% to INC</span>
                    <span>50:50</span>
                    <span>100% to BRS</span>
                  </div>
                </div>
              )}
            </div>

            {/* Regional Bias */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="text-xs font-bold text-slate-300">4. Geographic Focus</div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {[
                  { key: 'ALL', label: 'All 119 ACs' },
                  { key: 'NORTH_TS', label: 'North TS' },
                  { key: 'SOUTH_TS', label: 'South TS' },
                  { key: 'GHMC_URBAN', label: 'GHMC/Urban' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() =>
                      setCannibalizationSettings((prev) => ({
                        ...prev,
                        regionBias: item.key as any,
                      }))
                    }
                    className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      cannibalizationSettings.regionBias === item.key
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-slate-400 pt-1">
                Concentrates transfer shifts into target geopolitical belt
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: COALITION & ALLIANCE SANDBOX (#5)                      */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'alliances' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Interactive Pre-Poll Alliance &amp; Coalition Sandbox</span>
              <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                Coalition Engine
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Test formal pacts, tactical transfers, and secular or ideological partner backlashes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {/* Historical Mandate: 2018/19 TRS Landslide */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-pink-800/60 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-pink-300">2018/19 TRS Landslide</span>
                  <span className="text-[10px] bg-pink-500/20 text-pink-300 px-1.5 py-0.2 rounded font-mono font-bold">
                    88 Seats (46.9%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Rythu Bandhu &amp; 24x7 power agrarian wave + Prajakootami backfire. Swept rural BCs and women.
                </p>
              </div>
              <button
                onClick={() => onApplyPreset('trs_2018_landslide')}
                className="w-full py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate 2018/19</span>
              </button>
            </div>

            {/* Historical Mandate: 2014 Inaugural Mandate */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-rose-800/60 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-300">2014 Inaugural Mandate</span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-mono font-bold">
                    63 Seats (34.0%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Statehood agitation wave in North TS + student movement. Congress collapsed to 21 seats; TDP-BJP won 20.
                </p>
              </div>
              <button
                onClick={() => onApplyPreset('trs_2014_mandate')}
                className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate 2014</span>
              </button>
            </div>

            {/* Alliance 1: BJP + TRS Coalition */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-purple-800/60 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-300">BJP + TRS Coalition</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-mono font-bold">
                    74:45 Seat Pact
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  BJP contests 45 seats (GHMC &amp; North TS); BRS contests 74. Models 65/25 cadre friction, anti-KCR rebel leakage &amp; Muslim/BC split.
                </p>
              </div>
              <button
                onClick={() => onApplyPreset('bjp_trs_alliance')}
                className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Handshake className="w-3.5 h-3.5" />
                <span>Simulate BJP+TRS Coalition</span>
              </button>
            </div>

            {/* Alliance 2: TRS-BJP Full Merger */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-amber-800/60 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300">TRS-BJP Full Merger</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
                    KTR CM Face
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  BRS dissolves &amp; merges into BJP under Lotus symbol. 88% cadre consolidates; KTR CM Face, Harish Rao Union Cabinet. 12% defect to INC.
                </p>
              </div>
              <button
                onClick={() => onApplyPreset('bjp_trs_merger')}
                className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate TRS-BJP Merger</span>
              </button>
            </div>

            {/* Alliance 3: 2028 Triangular Anti-Incumbency */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-indigo-800/60 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-300">2028 Triangular (Anti-Inc)</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-mono font-bold">
                    3-Way Contest
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  INC, BRS, BJP fight independently. 5-year anti-incumbency (-7.0% INC vote shed); BRS (+3.2%) and BJP (+3.8%) surge into a hung balance.
                </p>
              </div>
              <button
                onClick={() => onApplyPreset('triangular_2028_anti_inc')}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Simulate 2028 Triangular</span>
              </button>
            </div>

            {/* Alliance 4: Kavitha Jagruthi Spoiler Front */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-teal-800/60 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-teal-300">Kavitha Jagruthi Spoiler</span>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded font-mono font-bold">
                    14 North TS ACs
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Telangana Jagruthi acts as targeted vote-cutter in Nizamabad, Jagtial &amp; Karimnagar (-4.2% BRS votes), flipping close seats to INC/BJP.
                </p>
              </div>
              <button
                onClick={() => onApplyPreset('kavitha_spoiler_front')}
                className="w-full py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Simulate Kavitha Spoiler</span>
              </button>
            </div>

            {/* Alliance 5: Congress + Left (CPI/CPM) */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-red-800/60 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-300">Congress + Left Front</span>
                  <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.2 rounded font-mono">
                    Khammam &amp; Nalgonda
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  CPI + CPM cadre transfer 95% of votes to INC in Munugode, Palair, Kothagudem, Wyra, and Miryalaguda.
                </p>
              </div>
              <button
                onClick={() => {
                  setMacroSwing({ INC: 2.0, BRS: -1.5, BJP: -0.5 });
                  setSwings((prev) => ({
                    ...prev,
                    bc_mudiraj: { INC: 3, BRS: -2, BJP: -1 },
                    sc_mala: { INC: 4, BRS: -3, BJP: -1 },
                  }));
                }}
                className="w-full py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Handshake className="w-3.5 h-3.5" />
                <span>Simulate Congress + Left Pact</span>
              </button>
            </div>

            {/* Alliance 3: BRS + BSP */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-blue-800/60 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-300">BRS + BSP (RS Praveen Factor)</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-mono">
                    Bahujan Base
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Consolidates Bahujan and SC Mala/Madiga cadres behind BRS in Sirpur, Bellampalli, and Nagarjuna Sagar.
                </p>
              </div>
              <button
                onClick={() => {
                  setMacroSwing({ INC: -1.0, BRS: 2.5, BJP: -1.5 });
                  setSwings((prev) => ({
                    ...prev,
                    sc_madiga: { INC: -3, BRS: 4, BJP: -1 },
                    sc_mala: { INC: -4, BRS: 5, BJP: -1 },
                    youth_18_25: { INC: -2, BRS: 3, BJP: -1 },
                  }));
                }}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Handshake className="w-3.5 h-3.5" />
                <span>Simulate BRS + BSP Alliance</span>
              </button>
            </div>
          </div>

          {/* Active Macro Swing and Demographic Summary */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
            <div>
              <span className="text-slate-400">Current Macro Applied:</span>{' '}
              <span className="font-mono font-bold text-sky-400">INC {macroSwing.INC >= 0 ? `+${macroSwing.INC}%` : `${macroSwing.INC}%`}</span>,{' '}
              <span className="font-mono font-bold text-pink-400">BRS {macroSwing.BRS >= 0 ? `+${macroSwing.BRS}%` : `${macroSwing.BRS}%`}</span>,{' '}
              <span className="font-mono font-bold text-amber-400">BJP {macroSwing.BJP >= 0 ? `+${macroSwing.BJP}%` : `${macroSwing.BJP}%`}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Active Demographic Overrides: <span className="font-mono font-bold text-indigo-400">{Object.values(swings).filter(s => s.INC !== 0 || s.BRS !== 0 || s.BJP !== 0).length} groups tuned</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: TARGET 60 REVERSE-OPTIMIZER (#9)                       */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'target_60' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Target 60 Majority Reverse-Optimizer</h4>
              </div>
              <p className="text-[11px] text-slate-400">
                Calculates the lowest-margin pickup seats and exact demographic shifts needed to cross the 60-seat majority line
              </p>
            </div>

            {/* Target Party Picker */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">Optimize Path For:</span>
              {(['INC', 'BRS', 'BJP'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setTargetParty(p)}
                  className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                    targetParty === p
                      ? p === 'INC'
                        ? 'bg-[#0284c7] text-white shadow-xs'
                        : p === 'BRS'
                        ? 'bg-[#ec4899] text-white shadow-xs'
                        : 'bg-[#f97316] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Goal Seek Summary Banner */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Current Seats</span>
                <div className="text-2xl font-black text-white">{target60Plan.wonCount}</div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Needed for 60</span>
                <div className={`text-2xl font-black ${target60Plan.needed === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {target60Plan.needed === 0 ? 'Majority Secured' : `${target60Plan.needed} Seats`}
                </div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Avg Deficit in Target ACs</span>
                <div className="text-xl font-bold font-mono text-slate-200">
                  ~{target60Plan.avgDeficit.toLocaleString()} votes
                </div>
              </div>
            </div>

            <span className="text-xs text-slate-400">
              Showing the top <strong className="text-white">{target60Plan.pickupSeats.length}</strong> lowest-hanging fruit pickup battlegrounds
            </span>
          </div>

          {/* Table of Lowest-Hanging Fruit Pickup Seats */}
          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 text-[10px] font-bold uppercase sticky top-0">
                <tr>
                  <th className="py-2 px-3">AC # &amp; Name</th>
                  <th className="py-2 px-3">District</th>
                  <th className="py-2 px-3">Current Winner</th>
                  <th className="py-2 px-3 text-right">Vote Deficit</th>
                  <th className="py-2 px-3">Decisive Demographic Lever</th>
                  <th className="py-2 px-3 text-right">Quick Apply</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {target60Plan.pickupSeats.map((seat) => (
                  <tr key={seat.ac_no} className="hover:bg-slate-800/60 transition-colors">
                    <td className="py-2 px-3 font-bold text-white">
                      #{seat.ac_no} {seat.ac_name}
                    </td>
                    <td className="py-2 px-3 text-slate-400">{seat.district}</td>
                    <td className="py-2 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {seat.winner}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-rose-400">
                      -{seat.deficit.toLocaleString()}
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-indigo-300 font-medium">
                        +{seat.requiredSwingPct}% in {seat.topCommKey.replace('_', ' ').toUpperCase()} ({seat.topCommPct}%)
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApplyTargetLever(seat.topCommKey, seat.requiredSwingPct)}
                          className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded cursor-pointer transition-colors"
                        >
                          Apply Lever ⚡
                        </button>
                        <button
                          onClick={() => onNavigateToActions(seat.ac_no)}
                          className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer transition-colors"
                          title="Open AC Playbook"
                        >
                          Playbook 🎯
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: SCENARIO DIFF & BENCHMARK COMPARISON (#14)             */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'diff_mode' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-sky-400" />
                <h4 className="text-sm font-bold text-white">Scenario Diff vs. 2023 Actual Election</h4>
              </div>
              <p className="text-[11px] text-slate-400">
                Direct benchmark isolating which seats flipped, which held, and where margins tightened
              </p>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setDiffFilter('FLIPS')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    diffFilter === 'FLIPS' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Flips Only
                </button>
                <button
                  onClick={() => setDiffFilter('TIGHTENED')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    diffFilter === 'TIGHTENED' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tightened (&le;6k)
                </button>
                <button
                  onClick={() => setDiffFilter('ALL')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    diffFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All 119 Seats
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search AC..."
                  value={diffSearch}
                  onChange={(e) => setDiffSearch(e.target.value)}
                  className="bg-slate-950 text-xs pl-8 pr-2.5 py-1 rounded-xl border border-slate-800 text-white placeholder-slate-500 w-32 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Diff Table */}
          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 text-[10px] font-bold uppercase sticky top-0">
                <tr>
                  <th className="py-2 px-3">AC # &amp; Name</th>
                  <th className="py-2 px-3">District</th>
                  <th className="py-2 px-3">2023 Actual</th>
                  <th className="py-2 px-3">Simulated Result</th>
                  <th className="py-2 px-3 text-right">Margin Shift</th>
                  <th className="py-2 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {diffList.map((seat) => (
                  <tr key={seat.ac_no} className="hover:bg-slate-800/60 transition-colors">
                    <td className="py-2 px-3 font-bold text-white">
                      #{seat.ac_no} {seat.ac_name}
                    </td>
                    <td className="py-2 px-3 text-slate-400">{seat.district}</td>
                    <td className="py-2 px-3 text-slate-300">
                      {seat.actualWinner} (+{seat.actualMargin.toLocaleString()})
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className="font-bold px-2 py-0.5 rounded text-[11px]"
                        style={{
                          backgroundColor: `${getPartyColor(seat.simWinner)}22`,
                          color: getPartyColor(seat.simWinner),
                        }}
                      >
                        {seat.simWinner} (+{seat.simMargin.toLocaleString()})
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      <span className={seat.marginDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {seat.marginDelta >= 0 ? `+${seat.marginDelta.toLocaleString()}` : seat.marginDelta.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {seat.isFlipped ? (
                          <span className="text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded">
                            FLIPPED: {seat.actualWinner} &rarr; {seat.simWinner}
                          </span>
                        ) : seat.isTightened ? (
                          <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                            TIGHTENED TOSS-UP
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">HELD</span>
                        )}
                        <button
                          onClick={() => onNavigateToActions(seat.ac_no)}
                          className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer transition-colors"
                          title="Open AC Playbook"
                        >
                          Playbook 🎯
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
};
