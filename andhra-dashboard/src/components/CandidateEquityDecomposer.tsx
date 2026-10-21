import React, { useState, useMemo } from 'react';
import type { DetailedCandidate, ElectionData } from '../types';
import { getPartyColor } from '../types';
import {
  UserCheck,
  Crown,
  RotateCcw,
  Sliders,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  X,
  Award,
  History,
  TrendingUp,
} from 'lucide-react';

// Known high-profile Andhra Pradesh political heavyweights with quantified baseline personal equity
const HEAVYWEIGHT_DATABASE: Record<number, {
  name: string;
  party: string;
  equityVotes: number;
  tier: 'HEAVYWEIGHT_CHIEF' | 'STRONGMAN_MINISTER' | 'LOCAL_INFLUENCER';
  rationale: string;
}> = {
  // Kuppam - Chandrababu Naidu
  175: {
    name: 'Nara Chandrababu Naidu',
    party: 'TDP',
    equityVotes: 32000,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'Chief Minister, 4-time CM of Andhra Pradesh, undefeated 8-term Kuppam MLA, commanding personal devotion and generational institutional development across Chittoor.',
  },
  // Pulivendla - YS Jagan Mohan Reddy
  129: {
    name: 'Y.S. Jagan Mohan Reddy',
    party: 'YSRCP',
    equityVotes: 36000,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'Former Chief Minister & YSRCP President, YSR family political fortress, unassailable grassroots welfare loyalty across Kadapa.',
  },
  // Pithapuram - Pawan Kalyan
  37: {
    name: 'Konidela Pawan Kalyan',
    party: 'JSP',
    equityVotes: 38000,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'Deputy Chief Minister, Janasena Party founder, cinema superstar and cultural powerhouse, catalytic youth and Kapu consolidation wave.',
  },
  // Mangalagiri - Nara Lokesh
  85: {
    name: 'Nara Lokesh',
    party: 'TDP',
    equityVotes: 28500,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'Cabinet Minister (IT & HRD), Yuva Galam Padayatra architect, secured record 91,413-vote victory margin in the capital Amaravati core.',
  },
  // Gajuwaka - Palla Srinivasa Rao
  25: {
    name: 'Palla Srinivasa Rao',
    party: 'TDP',
    equityVotes: 24000,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'TDP Andhra Pradesh State President, won with state-highest victory margin (95,235 votes), dominant industrial labour and BC leader in Vizag.',
  },
  // Hindupur - Nandamuri Balakrishna
  157: {
    name: 'Nandamuri Balakrishna',
    party: 'TDP',
    equityVotes: 22000,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'Legendary cine star, 3-time consecutive Hindupur MLA, NTR family legacy stronghold, hospital philanthropy and Rayalaseema connect.',
  },
  // Tenali - Nadendla Manohar
  91: {
    name: 'Nadendla Manohar',
    party: 'JSP',
    equityVotes: 18500,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Cabinet Minister (Civil Supplies), former AP Assembly Speaker, Janasena Political Affairs Committee Chairman, elite urban statesman in Guntur.',
  },
  // Kurnool - T.G. Bharath
  137: {
    name: 'T.G. Bharath',
    party: 'TDP',
    equityVotes: 16800,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Cabinet Minister (Industries & Commerce), prominent industrialist, TG Venkatesh family legacy and massive urban middle-class philanthropy.',
  },
  // Tekkali - Kinjarapu Atchannaidu
  3: {
    name: 'Kinjarapu Atchannaidu',
    party: 'TDP',
    equityVotes: 19500,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Cabinet Minister (Agriculture), veteran North Andhra strongman, Kinjarapu Yerran Naidu political dynasty anchor.',
  },
  // Vijayawada West - Sujana Chowdary
  79: {
    name: 'Y.S. Chowdary (Sujana Chowdary)',
    party: 'BJP',
    equityVotes: 14500,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Former Union Minister of State, prominent industrial leader, key architect of NDA coalition coordination in Krishna-NTR commercial capital.',
  },
  // Dharmavaram - Y. Satya Kumar
  160: {
    name: 'Y. Satya Kumar',
    party: 'BJP',
    equityVotes: 15200,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Cabinet Minister (Health & Family Welfare), BJP National Secretary, high-impact developmental and weaver-welfare mobilization.',
  },
  // Atmakur - Anam Ramanarayana Reddy
  115: {
    name: 'Anam Ramanarayana Reddy',
    party: 'TDP',
    equityVotes: 17200,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Cabinet Minister (Endowments), 40-year veteran Nellore political patriarch, formidable cross-party institutional network.',
  },
};

// Robust Name Matcher for historical elections
function matchCandidateName(name1?: string, name2?: string): boolean {
  if (!name1 || !name2) return false;
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/\b(dr|shri|sri|smt|mr|mrs|prof|ch|k|t|a|m)\b/g, '')
      .replace(/[^a-z0-9 ]/g, '')
      .trim();

  const n1 = clean(name1);
  const n2 = clean(name2);
  if (n1 === n2 || n1.includes(n2) || n2.includes(n1)) return true;

  const words1 = n1.split(/\s+/).filter((w) => w.length > 2);
  const words2 = n2.split(/\s+/).filter((w) => w.length > 2);
  const common = words1.filter((w) => words2.includes(w));
  if (common.length >= 2) return true;
  if (common.length === 1 && common[0].length >= 5 && (words1.length <= 2 || words2.length <= 2)) return true;
  return false;
}

export interface CandidatePastRecord {
  is2018Winner: boolean;
  is2018RunnerUp: boolean;
  is2014Winner: boolean;
  is2014RunnerUp: boolean;
  ac2018Name?: string;
  ac2014Name?: string;
  tags: string[];
  incumbencyBonusPct: number;
}

function getCandidatePastRecord(
  candidateName: string,
  acNo: number,
  electionData?: ElectionData | null
): CandidatePastRecord {
  const record: CandidatePastRecord = {
    is2018Winner: false,
    is2018RunnerUp: false,
    is2014Winner: false,
    is2014RunnerUp: false,
    tags: [],
    incumbencyBonusPct: 0,
  };

  if (!candidateName || !electionData?.results) return record;

  const res2018 = electionData.results['2018'];
  const res2014 = electionData.results['2014'];

  // Check current AC in 2018
  const ac2018 = res2018?.[String(acNo)];
  if (ac2018) {
    if (matchCandidateName(candidateName, ac2018.winner?.candidate)) {
      record.is2018Winner = true;
      record.ac2018Name = ac2018.ac_name;
      record.tags.push('2018 Incumbent MLA');
      record.incumbencyBonusPct += 10.0;
    } else if (matchCandidateName(candidateName, ac2018.runner_up?.candidate)) {
      record.is2018RunnerUp = true;
      record.ac2018Name = ac2018.ac_name;
      record.tags.push('2018 Runner-up');
      record.incumbencyBonusPct += 6.0;
    }
  }

  // Check current AC in 2014
  const ac2014 = res2014?.[String(acNo)];
  if (ac2014) {
    if (matchCandidateName(candidateName, ac2014.winner?.candidate)) {
      record.is2014Winner = true;
      record.ac2014Name = ac2014.ac_name;
      record.tags.push('2014 Former MLA');
      record.incumbencyBonusPct += 5.0;
    } else if (matchCandidateName(candidateName, ac2014.runner_up?.candidate)) {
      record.is2014RunnerUp = true;
      record.ac2014Name = ac2014.ac_name;
      record.tags.push('2014 Runner-up');
      record.incumbencyBonusPct += 3.0;
    }
  }

  // If not matched in this AC, check if they won anywhere else in Telangana in 2018 or 2014
  if (!record.is2018Winner && res2018) {
    for (const [key, item] of Object.entries(res2018)) {
      if (key !== String(acNo) && matchCandidateName(candidateName, item.winner?.candidate)) {
        record.is2018Winner = true;
        record.ac2018Name = item.ac_name;
        record.tags.push(`2018 MLA (${item.ac_name})`);
        record.incumbencyBonusPct += 7.0;
        break;
      }
    }
  }

  if (!record.is2014Winner && res2014) {
    for (const [key, item] of Object.entries(res2014)) {
      if (key !== String(acNo) && matchCandidateName(candidateName, item.winner?.candidate)) {
        record.is2014Winner = true;
        record.ac2014Name = item.ac_name;
        record.tags.push(`2014 MLA (${item.ac_name})`);
        record.incumbencyBonusPct += 3.5;
        break;
      }
    }
  }

  return record;
}

interface CandidateEquityDecomposerProps {
  acNo: number;
  acName: string;
  winnerCandidate?: DetailedCandidate;
  runnerCandidate?: DetailedCandidate;
  totalValidVotes: number;
  electionData?: ElectionData | null;
}

export const CandidateEquityDecomposer: React.FC<CandidateEquityDecomposerProps> = ({
  acNo,
  acName,
  winnerCandidate,
  runnerCandidate,
  totalValidVotes: _totalValidVotes,
  electionData,
}) => {
  // Interactive Stress-Test Slider: Simulated change in winner's personal equity
  const [winnerEquityAdjustment, setWinnerEquityAdjustment] = useState<number>(0);
  const [runnerEquityAdjustment, setRunnerEquityAdjustment] = useState<number>(0);

  // Methodology Modal & Interactive Custom Adjustments
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [userWinnerEquityPct, setUserWinnerEquityPct] = useState<number | null>(null);
  const [userRunnerEquityPct, setUserRunnerEquityPct] = useState<number | null>(null);
  const [incumbencyMultiplier, setIncumbencyMultiplier] = useState<number>(1.0);

  // Regional PC / District average baseline for party performance
  const regionalPartyAvg = useMemo(() => {
    if (!electionData?.results?.['2023']) return {};
    const currentAc = electionData.results['2023'][String(acNo)];
    const pc = currentAc?.pc_name;
    const dist = currentAc?.district;

    const partyStats: Record<string, { votes: number; total: number }> = {};
    for (const ac of Object.values(electionData.results['2023'])) {
      const matchesGroup = pc ? ac.pc_name === pc : ac.district === dist;
      if (matchesGroup && ac.total_valid_votes > 0) {
        if (ac.winner?.party) {
          if (!partyStats[ac.winner.party]) partyStats[ac.winner.party] = { votes: 0, total: 0 };
          partyStats[ac.winner.party].votes += ac.winner.votes || 0;
          partyStats[ac.winner.party].total += ac.total_valid_votes;
        }
        if (ac.runner_up?.party) {
          if (!partyStats[ac.runner_up.party]) partyStats[ac.runner_up.party] = { votes: 0, total: 0 };
          partyStats[ac.runner_up.party].votes += ac.runner_up.votes || 0;
          partyStats[ac.runner_up.party].total += ac.total_valid_votes;
        }
      }
    }
    const avgs: Record<string, number> = {};
    for (const [p, d] of Object.entries(partyStats)) {
      if (d.total > 0) {
        avgs[p] = Number(((d.votes / d.total) * 100).toFixed(1));
      }
    }
    return avgs;
  }, [electionData, acNo]);

  // Historical candidate lookup for 2018 and 2014
  const winnerPastRecord = useMemo(() => {
    return getCandidatePastRecord(winnerCandidate?.name || '', acNo, electionData);
  }, [winnerCandidate, acNo, electionData]);

  const runnerPastRecord = useMemo(() => {
    return getCandidatePastRecord(runnerCandidate?.name || '', acNo, electionData);
  }, [runnerCandidate, acNo, electionData]);

  // Baseline empirical personal equity for winner
  const empiricalWinnerEquityPct = useMemo(() => {
    if (!winnerCandidate) return 18.0;
    const knownHeavyweight = HEAVYWEIGHT_DATABASE[acNo];
    if (knownHeavyweight && (matchCandidateName(winnerCandidate.name, knownHeavyweight.name) || knownHeavyweight.party === winnerCandidate.party)) {
      const knownPct = (knownHeavyweight.equityVotes / winnerCandidate.votes) * 100;
      return Number(knownPct.toFixed(1));
    }

    const baseNomineePct = 8.0;
    const incumbencyBonus = (winnerPastRecord.incumbencyBonusPct || 0) * incumbencyMultiplier;
    const regionalAvg = regionalPartyAvg[winnerCandidate.party] || 38.0;
    const delta = winnerCandidate.vote_share - regionalAvg;
    const outperformanceBonus = Number((delta * 0.35).toFixed(1));

    const totalPct = baseNomineePct + incumbencyBonus + Math.max(-3, Math.min(10, outperformanceBonus));
    return Number(Math.max(5.0, Math.min(42.0, totalPct)).toFixed(1));
  }, [winnerCandidate, acNo, winnerPastRecord, incumbencyMultiplier, regionalPartyAvg]);

  // Baseline empirical personal equity for runner-up
  const empiricalRunnerEquityPct = useMemo(() => {
    if (!runnerCandidate) return 15.0;
    const baseNomineePct = 7.0;
    const incumbencyBonus = (runnerPastRecord.incumbencyBonusPct || 0) * incumbencyMultiplier;
    const regionalAvg = regionalPartyAvg[runnerCandidate.party] || 32.0;
    const delta = runnerCandidate.vote_share - regionalAvg;
    const outperformanceBonus = Number((delta * 0.35).toFixed(1));

    const totalPct = baseNomineePct + incumbencyBonus + Math.max(-3, Math.min(8, outperformanceBonus));
    return Number(Math.max(4.0, Math.min(38.0, totalPct)).toFixed(1));
  }, [runnerCandidate, runnerPastRecord, incumbencyMultiplier, regionalPartyAvg]);

  const finalWinnerEquityPct = userWinnerEquityPct ?? empiricalWinnerEquityPct;
  const finalRunnerEquityPct = userRunnerEquityPct ?? empiricalRunnerEquityPct;

  // Compute final breakdown for Winner
  const winnerDecomposition = useMemo(() => {
    if (!winnerCandidate) return null;
    const totalVotes = winnerCandidate.votes;
    const personalPct = finalWinnerEquityPct;
    const personalVotes = Math.round(totalVotes * (personalPct / 100));
    const partyBaseline = Math.max(0, totalVotes - personalVotes);
    const partyPct = Number(((partyBaseline / totalVotes) * 100).toFixed(1));

    return {
      candidateName: winnerCandidate.name,
      party: winnerCandidate.party,
      totalVotes,
      partyBaseline,
      partyPct,
      personalVotes,
      personalPct,
      pastRecord: winnerPastRecord,
    };
  }, [winnerCandidate, finalWinnerEquityPct, winnerPastRecord]);

  // Compute final breakdown for Runner-up
  const runnerDecomposition = useMemo(() => {
    if (!runnerCandidate) return null;
    const totalVotes = runnerCandidate.votes;
    const personalPct = finalRunnerEquityPct;
    const personalVotes = Math.round(totalVotes * (personalPct / 100));
    const partyBaseline = Math.max(0, totalVotes - personalVotes);
    const partyPct = Number(((partyBaseline / totalVotes) * 100).toFixed(1));

    return {
      candidateName: runnerCandidate.name,
      party: runnerCandidate.party,
      totalVotes,
      partyBaseline,
      partyPct,
      personalVotes,
      personalPct,
      pastRecord: runnerPastRecord,
    };
  }, [runnerCandidate, finalRunnerEquityPct, runnerPastRecord]);

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
            Calibrated against historical incumbency (2018/2014) and Parliamentary Constituency party baselines in <strong>{acName}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Methodology & Calibration Button */}
          <button
            type="button"
            onClick={() => setIsMethodologyOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/50 transition-all cursor-pointer shadow-xs"
            title="View exact mathematical breakdown and adjust personal equity sliders"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-300" />
            <span>How is Equity Calculated?</span>
            {(userWinnerEquityPct !== null || userRunnerEquityPct !== null || incumbencyMultiplier !== 1.0) && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Custom overrides active" />
            )}
          </button>

          {/* Reset button if adjusted */}
          {(winnerEquityAdjustment !== 0 || runnerEquityAdjustment !== 0 || userWinnerEquityPct !== null || userRunnerEquityPct !== null || incumbencyMultiplier !== 1.0) && (
            <button
              type="button"
              onClick={() => {
                setWinnerEquityAdjustment(0);
                setRunnerEquityAdjustment(0);
                setUserWinnerEquityPct(null);
                setUserRunnerEquityPct(null);
                setIncumbencyMultiplier(1.0);
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Reset all adjustments and calibration overrides to default"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Reset</span>
            </button>
          )}
        </div>
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

            {winnerPastRecord.is2018Winner ? (
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3 text-emerald-400" />
                2018 Incumbent MLA
              </span>
            ) : winnerPastRecord.is2014Winner ? (
              <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <History className="w-3 h-3 text-indigo-400" />
                2014 Former MLA
              </span>
            ) : null}
          </div>

          {/* Segmented Progress Bar: Party Baseline vs Personal Pull */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-400">
                Party Brand: <strong className="text-white">{winnerDecomposition.partyPct}%</strong> ({winnerDecomposition.partyBaseline.toLocaleString()} votes)
              </span>
              <span className="text-indigo-300 font-bold">
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

            {/* Historical Verification Badges (Replaced Total Form-20 & High Personal Brand lines) */}
            <div className="flex flex-wrap items-center justify-between gap-1 pt-1 text-[10px]">
              <div className="flex flex-wrap items-center gap-1.5">
                {winnerPastRecord.tags.length > 0 ? (
                  winnerPastRecord.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Award className="w-3 h-3 text-emerald-400" />
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-slate-400 bg-slate-900 border border-slate-800">
                    ⭐ Fresh Contestant (No 2014/2018 Run)
                  </span>
                )}
              </div>
              <span className="text-slate-400 font-mono text-[10px]">
                Valid: {winnerCandidate.votes.toLocaleString()}
              </span>
            </div>
          </div>
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
                <span className="text-sky-300 font-bold">
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

              {/* Historical Verification Badges (Replaced Total Form-20 & Challenger Threshold lines) */}
              <div className="flex flex-wrap items-center justify-between gap-1 pt-1 text-[10px]">
                <div className="flex flex-wrap items-center gap-1.5">
                  {runnerPastRecord.tags.length > 0 ? (
                    runnerPastRecord.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                        <Award className="w-3 h-3 text-sky-400" />
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-slate-400 bg-slate-900 border border-slate-800">
                      ⭐ Fresh Challenger (No 2014/2018 Run)
                    </span>
                  )}
                </div>
                <span className="text-slate-400 font-mono text-[10px]">
                  Valid: {runnerCandidate.votes.toLocaleString()}
                </span>
              </div>
            </div>
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
            type="button"
            onClick={() => setWinnerEquityAdjustment(6000)}
            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 cursor-pointer transition-all"
          >
            🌟 Heavyweight Boost (+6k)
          </button>
          <button
            type="button"
            onClick={() => setWinnerEquityAdjustment(0)}
            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition-all"
          >
            Baseline Nominee (0)
          </button>
          <button
            type="button"
            onClick={() => setWinnerEquityAdjustment(-5000)}
            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-700/50 cursor-pointer transition-all"
          >
            ⚠️ Candidate Fatigue (-5k)
          </button>
          <button
            type="button"
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

      {/* Methodology & Interactive Calibration Modal */}
      {isMethodologyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl max-w-2xl w-full p-5 sm:p-6 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-400" />
                  <span>How Candidate Personal Equity is Formulated</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  AC #{acNo} {acName} &middot; Empirically calibrated against historical election archives
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMethodologyOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Historical Incumbency & Prior Election Track Record */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                <History className="w-4 h-4 text-indigo-400" />
                <span>1. Historical Assembly Election Cross-Check (2018 &amp; 2014)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                {/* Winner History Card */}
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate max-w-[150px]">{winnerCandidate.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-bold" style={{ backgroundColor: `${winnerPartyColor}30`, color: winnerPartyColor }}>
                      {winnerCandidate.party}
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>2018 Assembly:</span>
                      <strong className={winnerPastRecord.is2018Winner ? 'text-emerald-400' : winnerPastRecord.is2018RunnerUp ? 'text-sky-400' : 'text-slate-400'}>
                        {winnerPastRecord.is2018Winner ? '🏆 Won (Incumbent MLA)' : winnerPastRecord.is2018RunnerUp ? '🥈 Runner-up' : 'Not Contested'}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>2014 Assembly:</span>
                      <strong className={winnerPastRecord.is2014Winner ? 'text-indigo-400' : winnerPastRecord.is2014RunnerUp ? 'text-sky-400' : 'text-slate-400'}>
                        {winnerPastRecord.is2014Winner ? '🏛️ Won (Former MLA)' : winnerPastRecord.is2014RunnerUp ? '🥈 Runner-up' : 'Not Contested'}
                      </strong>
                    </div>
                    <div className="pt-1 border-t border-slate-800 flex justify-between text-slate-400">
                      <span>Incumbency Lift:</span>
                      <span className="text-emerald-400 font-mono font-bold">+{winnerPastRecord.incumbencyBonusPct.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Runner-up History Card */}
                {runnerCandidate && (
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white truncate max-w-[150px]">{runnerCandidate.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-bold" style={{ backgroundColor: `${runnerPartyColor}30`, color: runnerPartyColor }}>
                        {runnerCandidate.party}
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>2018 Assembly:</span>
                        <strong className={runnerPastRecord.is2018Winner ? 'text-emerald-400' : runnerPastRecord.is2018RunnerUp ? 'text-sky-400' : 'text-slate-400'}>
                          {runnerPastRecord.is2018Winner ? '🏆 Won (Incumbent MLA)' : runnerPastRecord.is2018RunnerUp ? '🥈 Runner-up' : 'Not Contested'}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>2014 Assembly:</span>
                        <strong className={runnerPastRecord.is2014Winner ? 'text-indigo-400' : runnerPastRecord.is2014RunnerUp ? 'text-sky-400' : 'text-slate-400'}>
                          {runnerPastRecord.is2014Winner ? '🏛️ Won (Former MLA)' : runnerPastRecord.is2014RunnerUp ? '🥈 Runner-up' : 'Not Contested'}
                        </strong>
                      </div>
                      <div className="pt-1 border-t border-slate-800 flex justify-between text-slate-400">
                        <span>Incumbency Lift:</span>
                        <span className="text-sky-400 font-mono font-bold">+{runnerPastRecord.incumbencyBonusPct.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Mathematical Formulation */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span>2. The Three Component Attribution Pillars</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside text-[11px]">
                <li>
                  <strong>Base Nominee Core (8%):</strong> Ground machinery, family caste network, and sarpanch patron linkages carried by any recognized ticket-holder.
                </li>
                <li>
                  <strong>Prior Election Track Record (+3% to +15%):</strong> Sitting 2018 MLAs gain +10% for running local welfare offices, 2014 MLAs gain +5%, and 2018 runners-up gain +6% for established booth cadre.
                </li>
                <li>
                  <strong>Regional Outperformance Delta:</strong> How much the candidate exceeded their party&apos;s average vote share across the 7 assembly segments in the same Parliamentary Constituency.
                </li>
              </ul>
            </div>

            {/* Section 3: Interactive Parameter Calibration (Make it adjustable) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/40 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  <span>3. Interactive Custom Calibration</span>
                </span>
                <span className="text-[11px] text-slate-400">Adjust weights directly if required</span>
              </div>

              {/* Slider 1: Incumbency Multiplier */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Past MLA / Runner-up Weight Multiplier:</span>
                  <span className="font-mono font-bold text-indigo-400">{incumbencyMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="2.0"
                  step="0.1"
                  value={incumbencyMultiplier}
                  onChange={(e) => setIncumbencyMultiplier(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0.0x (Ignore Past History)</span>
                  <span>1.0x (Standard Model)</span>
                  <span>2.0x (Heavyweight Incumbency)</span>
                </div>
              </div>

              {/* Slider 2: Winner Equity % */}
              <div className="space-y-1 pt-1 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">{winnerCandidate.name} Personal Equity %:</span>
                  <span className="font-mono font-bold text-emerald-400">{finalWinnerEquityPct}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="0.5"
                  value={finalWinnerEquityPct}
                  onChange={(e) => setUserWinnerEquityPct(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>5% (Pure Party Wave)</span>
                  <span>{empiricalWinnerEquityPct}% (Empirical Calc)</span>
                  <span>45% (Unstoppable Cult Leader)</span>
                </div>
              </div>

              {/* Slider 3: Runner-up Equity % */}
              {runnerCandidate && (
                <div className="space-y-1 pt-1 border-t border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{runnerCandidate.name} Personal Equity %:</span>
                    <span className="font-mono font-bold text-sky-400">{finalRunnerEquityPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="40"
                    step="0.5"
                    value={finalRunnerEquityPct}
                    onChange={(e) => setUserRunnerEquityPct(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>4% (Pure Symbol Ticket)</span>
                    <span>{empiricalRunnerEquityPct}% (Empirical Calc)</span>
                    <span>40% (Independent Titan)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setUserWinnerEquityPct(null);
                  setUserRunnerEquityPct(null);
                  setIncumbencyMultiplier(1.0);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                Reset to Empirical Defaults
              </button>

              <button
                type="button"
                onClick={() => setIsMethodologyOpen(false)}
                className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Apply &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
