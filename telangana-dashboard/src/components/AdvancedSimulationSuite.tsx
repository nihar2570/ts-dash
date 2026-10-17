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
} from 'lucide-react';

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
  onApplyPreset: (presetKey: string) => void;
  onNavigateToActions: (acNo?: number) => void;
}

type SuiteTab = 'monte_carlo' | 'turnout' | 'alliances' | 'target_60' | 'diff_mode';

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
  onApplyPreset,
  onNavigateToActions,
}) => {
  const [activeTab, setActiveTab] = useState<SuiteTab>('monte_carlo');

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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl text-slate-100 space-y-5">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="flex items-center gap-2">
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

        {/* Suite Sub-Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('monte_carlo')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'monte_carlo'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Monte Carlo (1,000 Runs)</span>
          </button>
          <button
            onClick={() => setActiveTab('turnout')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'turnout'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Turnout Mobilization</span>
          </button>
          <button
            onClick={() => setActiveTab('alliances')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'alliances'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Handshake className="w-3.5 h-3.5" />
            <span>Coalition Sandbox</span>
          </button>
          <button
            onClick={() => setActiveTab('target_60')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'target_60'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Target 60 Optimizer</span>
          </button>
          <button
            onClick={() => setActiveTab('diff_mode')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'diff_mode'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Scenario Diff</span>
          </button>
        </div>
      </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Alliance 1: BJP + TRS */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-purple-800/60 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-300">BJP + TRS (BRS) Alliance</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-mono">
                    60/40 Split
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  60% of BJP vote transfers to TRS, 40% to Congress. TRS loses -5% Muslim vote due to secular backlash.
                </p>
              </div>
              <button
                onClick={() => onApplyPreset('bjp_trs_alliance')}
                className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Handshake className="w-3.5 h-3.5" />
                <span>Simulate BJP+TRS Alliance</span>
              </button>
            </div>

            {/* Alliance 2: Congress + Left (CPI/CPM) */}
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
  );
};
