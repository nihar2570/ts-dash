import React, { useState, useMemo } from 'react';
import type { DetailedCandidate } from '../types';
import { getPartyColor } from '../types';
import {
  UserCheck,
  Crown,
  RotateCcw,
  Sliders,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

// Known high-profile Telangana political heavyweights with quantified personal equity
const HEAVYWEIGHT_DATABASE: Record<number, {
  name: string;
  party: string;
  equityVotes: number;
  tier: 'HEAVYWEIGHT_CHIEF' | 'STRONGMAN_MINISTER' | 'LOCAL_INFLUENCER';
  rationale: string;
}> = {
  // Gajwel - KCR
  42: {
    name: 'Kalvakuntla Chandrashekar Rao (KCR)',
    party: 'BRS',
    equityVotes: 18500,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'Two-time Chief Minister, Telangana movement patriarch, commanding personal welfare loyalty across rural BCs and Velamas.',
  },
  // Kodangal - Revanth Reddy
  72: {
    name: 'Anumula Revanth Reddy',
    party: 'INC',
    equityVotes: 16800,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'Sitting Chief Minister & TPCC chief, intense charisma among youth and Reddys, deep home-turf personal network.',
  },
  // Sircilla - KTR
  29: {
    name: 'Kalvakuntla Taraka Rama Rao (KTR)',
    party: 'BRS',
    equityVotes: 19200,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'BRS Working President & Ex-IT Minister, massive textile worker goodwill, urban youth icon across Rajanna Sircilla.',
  },
  // Siddipet - Harish Rao
  33: {
    name: 'Thanneeru Harish Rao',
    party: 'BRS',
    equityVotes: 24500,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'Unbroken winning record, legendary hospital and healthcare delivery, deep personal connect with every sarpanch.',
  },
  // Goshamahal - T. Raja Singh
  65: {
    name: 'T. Raja Singh',
    party: 'BJP',
    equityVotes: 15400,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Hyper-polarized personal Hindu youth following, religious festival mascot, personal brand eclipses local party machine.',
  },
  // Huzurabad - Kaushik Reddy & Eatala legacy
  31: {
    name: 'Padi Kaushik Reddy / Eatala Rajender (Legacy)',
    party: 'BRS',
    equityVotes: 11500,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'High-octane personal caste consolidation across Mudiraj and rural youth in Huzurabad.',
  },
  // Medchal - Ch. Malla Reddy
  43: {
    name: 'Chamakura Malla Reddy',
    party: 'BRS',
    equityVotes: 13200,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Educational empire patron, rural infrastructure contractor network, popular colloquial mass connect.',
  },
  // Khairatabad - Danam Nagender
  60: {
    name: 'Danam Nagender',
    party: 'BRS',
    equityVotes: 10800,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Veteran 5-term MLA, slum and basti commander, cross-caste personal patronage across urban core.',
  },
  // Chandrayangutta - Akbaruddin Owaisi
  67: {
    name: 'Akbar Uddin Owaisi',
    party: 'AIMIM',
    equityVotes: 26000,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'AIMIM Floor Leader, Salar-e-Millat legacy, Owaisi hospital and school patronage, undisputed Old City titan.',
  },
  // Kamareddy - KVR Reddy
  16: {
    name: 'Katipally Venkata Ramana Reddy',
    party: 'BJP',
    equityVotes: 11200,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Giant-killer who defeated both KCR and Revanth Reddy through relentless anti-masterplan farmer agitation.',
  },
  // Quthbullapur - KP Vivekanand
  45: {
    name: 'K.P. Vivekanand',
    party: 'BRS',
    equityVotes: 17500,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Won with state-record 85,000+ margin; unmatched personal grievance redressal network across Ranga Reddy urban colonies.',
  },
  // Nalgonda - Komatireddy Venkat Reddy
  92: {
    name: 'Komatireddy Venkat Reddy',
    party: 'INC',
    equityVotes: 14200,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Senior Cabinet Minister, Nalgonda district strongman, independent family cadre and financial muscle.',
  },
  // Madhira - Bhatti Vikramarka
  114: {
    name: 'Mallu Bhatti Vikramarka',
    party: 'INC',
    equityVotes: 14800,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'Deputy Chief Minister & Finance Minister, 1,360-km Peoples March Padayatra goodwill, SC Mala anchor.',
  },
};

interface CandidateEquityDecomposerProps {
  acNo: number;
  acName: string;
  winnerCandidate?: DetailedCandidate;
  runnerCandidate?: DetailedCandidate;
  totalValidVotes: number;
}

export const CandidateEquityDecomposer: React.FC<CandidateEquityDecomposerProps> = ({
  acNo,
  acName,
  winnerCandidate,
  runnerCandidate,
  totalValidVotes,
}) => {
  // Interactive Stress-Test Slider: Simulated change in winner's personal equity (e.g. candidate replacement or fatigue)
  const [winnerEquityAdjustment, setWinnerEquityAdjustment] = useState<number>(0);
  const [runnerEquityAdjustment, setRunnerEquityAdjustment] = useState<number>(0);

  // Compute baseline personal equity for Winner
  const winnerDecomposition = useMemo(() => {
    if (!winnerCandidate) return null;

    const totalVotes = winnerCandidate.votes;
    const knownHeavyweight = HEAVYWEIGHT_DATABASE[acNo];

    let personalVotes = 0;
    let tier: 'HEAVYWEIGHT_CHIEF' | 'STRONGMAN_MINISTER' | 'LOCAL_INFLUENCER' | 'STANDARD_MLA' = 'STANDARD_MLA';
    let rationale = '';

    if (knownHeavyweight && (winnerCandidate.name.toLowerCase().includes(knownHeavyweight.name.split(' ')[0].toLowerCase()) || knownHeavyweight.party === winnerCandidate.party)) {
      personalVotes = knownHeavyweight.equityVotes;
      tier = knownHeavyweight.tier;
      rationale = knownHeavyweight.rationale;
    } else {
      // Heuristic model: Candidates with high margin and high assets carry 14% to 22% personal equity
      const assetBonus = (winnerCandidate.myneta?.total_assets || 0) > 20000000 ? 3000 : 1500;
      const marginShare = Math.round(totalVotes * 0.16) + assetBonus;
      personalVotes = Math.max(3500, Math.min(Math.round(totalVotes * 0.28), marginShare));
      tier = personalVotes > 9000 ? 'STRONGMAN_MINISTER' : 'LOCAL_INFLUENCER';
      rationale = 'Built on local sarpanch alignment, constituency office presence, and community patronage.';
    }

    const partyBaseline = Math.max(1000, totalVotes - personalVotes);
    const partyPct = Number(((partyBaseline / totalVotes) * 100).toFixed(1));
    const personalPct = Number(((personalVotes / totalVotes) * 100).toFixed(1));

    return {
      candidateName: winnerCandidate.name,
      party: winnerCandidate.party,
      totalVotes,
      partyBaseline,
      partyPct,
      personalVotes,
      personalPct,
      tier,
      rationale,
    };
  }, [winnerCandidate, acNo]);

  // Compute baseline personal equity for Runner-up
  const runnerDecomposition = useMemo(() => {
    if (!runnerCandidate) return null;

    const totalVotes = runnerCandidate.votes;
    const personalVotes = Math.max(2500, Math.round(totalVotes * 0.18));
    const partyBaseline = Math.max(1000, totalVotes - personalVotes);
    const partyPct = Number(((partyBaseline / totalVotes) * 100).toFixed(1));
    const personalPct = Number(((personalVotes / totalVotes) * 100).toFixed(1));

    return {
      candidateName: runnerCandidate.name,
      party: runnerCandidate.party,
      totalVotes,
      partyBaseline,
      partyPct,
      personalVotes,
      personalPct,
    };
  }, [runnerCandidate]);

  if (!winnerCandidate || !winnerDecomposition) return null;

  // Live Simulated Outcome with adjustments applied
  const actualMargin = winnerCandidate.votes - (runnerCandidate?.votes || 0);
  const adjustedWinnerVotes = Math.max(0, winnerCandidate.votes + winnerEquityAdjustment);
  const adjustedRunnerVotes = Math.max(0, (runnerCandidate?.votes || 0) + runnerEquityAdjustment);
  const simulatedMargin = adjustedWinnerVotes - adjustedRunnerVotes;
  const isFlipped = simulatedMargin < 0;
  const flipParty = isFlipped ? runnerCandidate?.party || 'Opponent' : winnerCandidate.party;

  const winnerPartyColor = getPartyColor(winnerCandidate.party);
  const runnerPartyColor = runnerCandidate ? getPartyColor(runnerCandidate.party) : '#64748b';

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-4 sm:p-5 border border-indigo-500/30 shadow-xl space-y-4">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <UserCheck className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>Candidate Personal Equity vs. Party Symbol Decomposer</span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Decomposes Form-20 votes in <strong>{acName}</strong> ({totalValidVotes.toLocaleString()} valid votes) into <strong>Core Party Symbol Baseline</strong> vs. <strong>Candidate Personal Pull</strong>.
          </p>
        </div>

        {/* Reset button if adjusted */}
        {(winnerEquityAdjustment !== 0 || runnerEquityAdjustment !== 0) && (
          <button
            onClick={() => {
              setWinnerEquityAdjustment(0);
              setRunnerEquityAdjustment(0);
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            title="Reset candidate equity adjustments to 0"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset Baseline</span>
          </button>
        )}
      </div>

      {/* Side-by-Side Candidate Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Winner Decomposition Card */}
        <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: winnerPartyColor }}
              />
              <span className="font-bold text-xs text-white truncate max-w-[180px]" title={winnerCandidate.name}>
                {winnerCandidate.name}
              </span>
              <span
                className="text-[10px] font-black px-1.5 py-0.2 rounded"
                style={{ backgroundColor: `${winnerPartyColor}25`, color: winnerPartyColor }}
              >
                {winnerCandidate.party} (Winner)
              </span>
            </div>

            {winnerDecomposition.tier === 'HEAVYWEIGHT_CHIEF' && (
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" />
                Heavyweight Face
              </span>
            )}
          </div>

          {/* Segmented Progress Bar: Party Baseline vs Personal Pull */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-400">
                Party Brand: <strong className="text-white">{winnerDecomposition.partyPct}%</strong> ({winnerDecomposition.partyBaseline.toLocaleString()} votes)
              </span>
              <span className="text-indigo-300">
                Personal Equity: <strong className="text-white">+{winnerDecomposition.personalPct}%</strong> (+{winnerDecomposition.personalVotes.toLocaleString()})
              </span>
            </div>

            <div className="w-full h-3.5 rounded-lg overflow-hidden flex bg-slate-950 p-0.5 border border-slate-700">
              {/* Party Symbol Share */}
              <div
                style={{ width: `${winnerDecomposition.partyPct}%`, backgroundColor: winnerPartyColor }}
                className="h-full rounded-l transition-all"
                title={`Party Symbol Baseline: ${winnerDecomposition.partyBaseline.toLocaleString()} votes (${winnerDecomposition.partyPct}%)`}
              />
              {/* Personal Equity Share */}
              <div
                style={{ width: `${winnerDecomposition.personalPct}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-r transition-all"
                title={`Candidate Personal Equity: +${winnerDecomposition.personalVotes.toLocaleString()} votes (+${winnerDecomposition.personalPct}%)`}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-0.5">
              <span>Total Form-20 Votes: {winnerCandidate.votes.toLocaleString()}</span>
              <span className="text-indigo-400 font-bold">{winnerDecomposition.personalVotes > 10000 ? 'High Personal Brand' : 'Standard MLA'}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            {winnerDecomposition.rationale}
          </p>
        </div>

        {/* Runner-up Decomposition Card */}
        {runnerDecomposition && runnerCandidate && (
          <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: runnerPartyColor }}
                />
                <span className="font-bold text-xs text-white truncate max-w-[180px]" title={runnerCandidate.name}>
                  {runnerCandidate.name}
                </span>
                <span
                  className="text-[10px] font-black px-1.5 py-0.2 rounded"
                  style={{ backgroundColor: `${runnerPartyColor}25`, color: runnerPartyColor }}
                >
                  {runnerCandidate.party} (Runner-up)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Deficit: {actualMargin.toLocaleString()} votes
              </span>
            </div>

            {/* Segmented Progress Bar: Runner-up Party vs Personal */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-400">
                  Party Brand: <strong className="text-white">{runnerDecomposition.partyPct}%</strong> ({runnerDecomposition.partyBaseline.toLocaleString()} votes)
                </span>
                <span className="text-sky-300">
                  Personal Equity: <strong className="text-white">+{runnerDecomposition.personalPct}%</strong> (+{runnerDecomposition.personalVotes.toLocaleString()})
                </span>
              </div>

              <div className="w-full h-3.5 rounded-lg overflow-hidden flex bg-slate-950 p-0.5 border border-slate-700">
                <div
                  style={{ width: `${runnerDecomposition.partyPct}%`, backgroundColor: runnerPartyColor }}
                  className="h-full rounded-l transition-all"
                  title={`Party Symbol: ${runnerDecomposition.partyBaseline.toLocaleString()}`}
                />
                <div
                  style={{ width: `${runnerDecomposition.personalPct}%` }}
                  className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 rounded-r transition-all"
                  title={`Personal Equity: +${runnerDecomposition.personalVotes.toLocaleString()}`}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-0.5">
                <span>Total Form-20 Votes: {runnerCandidate.votes.toLocaleString()}</span>
                <span className="text-slate-400">Challenger Threshold</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              Challenger personal equity relies heavily on party anti-incumbency consolidation and local caste alignment against the incumbent.
            </p>
          </div>
        )}
      </div>

      {/* Interactive Candidate Replacement & Anti-Incumbency Stress-Test */}
      <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/40 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Candidate Selection &amp; Replacement Stress-Test
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Simulate incumbent candidate swap, corruption fatigue, or strong rebel spoiler
          </span>
        </div>

        {/* Preset Archetype Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-semibold mr-1">Scenario Presets:</span>
          <button
            onClick={() => setWinnerEquityAdjustment(6000)}
            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 cursor-pointer transition-all"
          >
            🌟 Heavyweight Boost (+6k)
          </button>
          <button
            onClick={() => setWinnerEquityAdjustment(0)}
            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition-all"
          >
            Baseline Nominee (0)
          </button>
          <button
            onClick={() => setWinnerEquityAdjustment(-5000)}
            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-700/50 cursor-pointer transition-all"
          >
            ⚠️ Candidate Fatigue (-5k)
          </button>
          <button
            onClick={() => setWinnerEquityAdjustment(-10000)}
            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-700/50 cursor-pointer transition-all"
          >
            ⚡ Unpopular Replacement / Rebel Sabotage (-10k)
          </button>
        </div>

        {/* Live Adjustment Slider */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300 font-medium">
              Adjust {winnerCandidate.name}&apos;s Personal Equity:
            </span>
            <span className={`font-mono font-bold text-sm ${winnerEquityAdjustment > 0 ? 'text-emerald-400' : winnerEquityAdjustment < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {winnerEquityAdjustment >= 0 ? `+${winnerEquityAdjustment.toLocaleString()}` : winnerEquityAdjustment.toLocaleString()} votes
            </span>
          </div>

          <input
            type="range"
            min="-15000"
            max="15000"
            step="500"
            value={winnerEquityAdjustment}
            onChange={(e) => setWinnerEquityAdjustment(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-15,000 (Severe Rebellion)</span>
            <span>0 (2023 Actual Baseline)</span>
            <span>+15,000 (Super-Star Lift)</span>
          </div>
        </div>

        {/* Live Result Banner */}
        <div className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-3 transition-all ${
          isFlipped
            ? 'bg-rose-950/60 border-rose-500/60 text-rose-200 shadow-md'
            : simulatedMargin <= 2500
            ? 'bg-amber-950/60 border-amber-500/60 text-amber-200'
            : 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            {isFlipped ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <div>
              <div className="text-xs font-black">
                {isFlipped
                  ? `🚨 SEAT FLIPS TO ${flipParty}!`
                  : simulatedMargin <= 2500
                  ? '⚠️ VULNERABLE RAZOR-THIN HOLD'
                  : 'SAFE / COMFORTABLE RETENTION'}
              </div>
              <p className="text-[11px] opacity-90">
                {isFlipped
                  ? `A drop of ${Math.abs(winnerEquityAdjustment).toLocaleString()} votes wipes out ${winnerCandidate.name}'s lead, handing the constituency to ${runnerCandidate?.name || 'the runner-up'}.`
                  : `With current adjustments, ${winnerCandidate.name} holds a projected lead of ${simulatedMargin.toLocaleString()} votes.`}
              </p>
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-xs font-bold uppercase tracking-wider opacity-80">Simulated Margin</div>
            <div className="text-lg font-black">
              {Math.abs(simulatedMargin).toLocaleString()} votes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
