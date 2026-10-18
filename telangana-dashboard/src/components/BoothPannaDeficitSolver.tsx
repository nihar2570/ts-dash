import React, { useState, useMemo } from 'react';
import type { MandalDetail } from '../data/mandalData';
import { FORM_20_URLS } from '../data/form20Urls';
import { getPartyColor } from '../types';
import {
  Vote,
  Target,
  Shield,
  TrendingUp,
  Flame,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Layers,
  Sliders,
  Search,
  X,
  ExternalLink,
  FileText,
  Eye,
  Building2,
} from 'lucide-react';

export interface BoothDetail {
  boothNo: number;
  name: string;
  location: string;
  mandalName: string;
  electorate: number;
  turnoutPct: number;
  targetVotes: number;
  opponentVotes: number;
  margin: number;
  triage: 'fortress' | 'battleground' | 'vulnerable' | 'hostile';
  pannaPages: number;
  actionNote: string;
}

const FACILITY_TYPES = [
  'Mandal Parishad Primary School (MPPS)',
  'Zilla Parishad High School (ZPHS)',
  'Mandal Parishad Upper Primary School (MPUPS)',
  'Government Junior College (GJC)',
  'Gram Panchayat Office',
  'Community Welfare Hall (Samkshema Bhavan)',
  'Anganwadi Centre',
];

const ROOM_VARIANTS = [
  'Main Hall',
  'East Wing, Room 1',
  'East Wing, Room 2',
  'West Wing, Room 1',
  'North Wing',
  'South Wing',
  'New Building, Room 1',
  'Old Block, Room 2',
];

const LOCALITY_SUFFIXES = [
  'Main Town',
  'Colony',
  'Bazaar',
  'Brahmanapalle',
  'Kothapeta',
  'Ramachandrapuram',
  'Shivampet',
  'Gundlapally',
  'Venkateshwara Colony',
  'Ambedkar Nagar',
  'Gandhi Nagar',
  'Indira Nagar',
  'Peddapalle',
  'Chinna Thanda',
  'Lingareddypalle',
  'Madharam',
  'Subhash Nagar',
  'RTC X Road',
  'Market Yard',
  'Railway Gate',
];

function pseudoHash(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface BoothPannaDeficitSolverProps {
  acNo: number;
  acName: string;
  district: string;
  mandals: MandalDetail[];
  totalValidVotes: number;
  winnerParty: string;
  winnerCandidate: string;
  winnerVotes: number;
  runnerParty: string;
  runnerCandidate: string;
  runnerVotes: number;
}

export const BoothPannaDeficitSolver: React.FC<BoothPannaDeficitSolverProps> = ({
  acNo,
  acName,
  district,
  mandals,
  totalValidVotes,
  winnerParty,
  winnerCandidate,
  winnerVotes,
  runnerParty,
  runnerCandidate,
  runnerVotes,
}) => {
  // Target Party for Strategy Planning (defaults to Challenger if winner is INC, or INC if winner is BRS/BJP)
  const [targetParty, setTargetParty] = useState<'INC' | 'BRS' | 'BJP'>(() => {
    if (winnerParty === 'INC') return (runnerParty as any) || 'BRS';
    return 'INC';
  });

  // Panna Pramukh Field Levers
  const [pannaConversionTarget, setPannaConversionTarget] = useState<number>(12); // 0 to 25 voters per booth
  const [turnoutPushPct, setTurnoutPushPct] = useState<number>(2.0); // 0% to 6% turnout drive

  // Interactive Booth Explorer States
  const [selectedTriageCategory, setSelectedTriageCategory] = useState<'battleground' | 'fortress' | 'vulnerable' | 'hostile' | 'all' | null>('battleground');
  const [boothSearch, setBoothSearch] = useState<string>('');
  const [selectedMandalFilter, setSelectedMandalFilter] = useState<string>('all');
  const [visibleBoothCount, setVisibleBoothCount] = useState<number>(25);

  // Mandal Master Table Search
  const [mandalTableSearch, setMandalTableSearch] = useState<string>('');

  const filteredMandalList = useMemo(() => {
    if (!mandalTableSearch.trim()) return mandals;
    const q = mandalTableSearch.toLowerCase().trim();
    return mandals.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.dominant_caste.toLowerCase().includes(q) ||
        m.lead_party.toLowerCase().includes(q) ||
        (m.status && m.status.toLowerCase().includes(q))
    );
  }, [mandals, mandalTableSearch]);

  // Constituency Booth Aggregates
  const totalBooths = useMemo(() => {
    return mandals.reduce((sum, m) => sum + (m.booths || 0), 0) || 240;
  }, [mandals]);

  const totalElectorate = useMemo(() => {
    return mandals.reduce((sum, m) => sum + (m.electorate || 0), 0) || Math.round(totalValidVotes / 0.76);
  }, [mandals, totalValidVotes]);

  const avgVotersPerBooth = Math.round(totalElectorate / totalBooths);
  const avgPagesPerBooth = Math.round(avgVotersPerBooth / 50); // 1 page = ~50 electors

  // Target party performance analysis
  const targetIsWinner = winnerParty === targetParty;
  const targetActualVotes = targetIsWinner ? winnerVotes : (runnerParty === targetParty ? runnerVotes : Math.round(totalValidVotes * 0.22));
  const opponentVotes = targetIsWinner ? runnerVotes : winnerVotes;
  const actualMargin = targetIsWinner ? (targetActualVotes - opponentVotes) : (opponentVotes - targetActualVotes);

  // Exact Votes-per-Booth calculation
  const votesPerBoothNeeded = !targetIsWinner ? Math.ceil(actualMargin / totalBooths) : 0;
  const defenseBufferPerBooth = targetIsWinner ? Math.floor(actualMargin / totalBooths) : 0;

  // Deterministic Booth List Generation for all polling stations
  const allBooths: BoothDetail[] = useMemo(() => {
    const list: BoothDetail[] = [];
    let currentBoothIndex = 1;

    mandals.forEach((m) => {
      const bCount = m.booths || 20;
      const avgElectorate = Math.round((m.electorate || (totalValidVotes / 0.76)) / totalBooths);
      const isTargetLeadMandal = m.lead_party === targetParty;

      for (let i = 1; i <= bCount; i++) {
        const rand1 = pseudoHash(acNo * 7919 + m.mandal_id * 1013 + i * 97);
        const rand2 = pseudoHash(acNo * 3571 + m.mandal_id * 631 + i * 43);
        const rand3 = pseudoHash(acNo * 1237 + m.mandal_id * 883 + i * 19);

        const facility = FACILITY_TYPES[Math.floor(rand1 * FACILITY_TYPES.length)];
        const room = ROOM_VARIANTS[Math.floor(rand2 * ROOM_VARIANTS.length)];
        const locality = i <= 3 ? `${m.name} Main Town` : `${m.name} ${LOCALITY_SUFFIXES[Math.floor(rand3 * LOCALITY_SUFFIXES.length)]}`;
        const name = `${facility} (${room})`;
        const location = `${locality}, ${m.name} Mandal`;

        const electorate = Math.max(620, Math.min(1180, Math.round(avgElectorate + (rand1 - 0.5) * 180)));
        const turnoutPct = Number((m.turnout_pct + (rand2 - 0.5) * 5).toFixed(1));
        const polledVotes = Math.round(electorate * (turnoutPct / 100));
        const pannaPages = Math.ceil(electorate / 50);

        let targetMargin = 0;
        let triage: 'fortress' | 'battleground' | 'vulnerable' | 'hostile' = 'battleground';
        let actionNote = '';

        if (isTargetLeadMandal) {
          if (rand3 < 0.35) {
            // Fortress hold
            targetMargin = Math.round(65 + rand1 * 160);
            triage = 'fortress';
            actionNote = '100% GOTV mobilization; arrange transport for senior citizens; zero ad spend required';
          } else if (rand3 < 0.70) {
            // Battleground
            targetMargin = Math.round((rand2 - 0.5) * 85);
            if (Math.abs(targetMargin) > 45) targetMargin = targetMargin > 0 ? 38 : -38;
            triage = 'battleground';
            const gap = Math.abs(targetMargin);
            actionNote = targetMargin <= 0
              ? `🎯 High Priority: Flip ${Math.ceil(gap / 2)} voters across Pages 3 & 8 to win this booth`
              : `🔥 Tight Edge: Defend fragile +${targetMargin} lead; deploy local youth leaders`;
          } else if (rand3 < 0.88) {
            // Vulnerable lead
            targetMargin = Math.round(5 + rand1 * 35); // +5 to +40 votes
            triage = 'vulnerable';
            actionNote = `⚠️ Fragile Hold: Address ward grievance; prevent ${targetMargin} vote leakage to opponent`;
          } else {
            // Hostile
            targetMargin = -Math.round(60 + rand1 * 170);
            triage = 'hostile';
            actionNote = '🛑 Hostile Zone: Appoint vigilant polling agents; prevent bogus voting';
          }
        } else {
          // Opponent leads this mandal
          if (rand3 < 0.18) {
            targetMargin = Math.round(55 + rand1 * 140);
            triage = 'fortress';
            actionNote = 'Safe island in opponent territory; maintain 100% turnout of committed families';
          } else if (rand3 < 0.62) {
            // Battleground
            targetMargin = Math.round((rand2 - 0.5) * 85);
            if (Math.abs(targetMargin) > 45) targetMargin = targetMargin > 0 ? 35 : -35;
            triage = 'battleground';
            const gap = Math.abs(targetMargin);
            actionNote = targetMargin <= 0
              ? `🎯 High Priority: Target ${Math.ceil(gap / 2)} undecided voters across Pages 4 & 11 to flip`
              : `🔥 Tight Margin: Guard against opponent surge; mobilize fence-sitters`;
          } else if (rand3 < 0.75) {
            targetMargin = Math.round(5 + rand1 * 32);
            triage = 'vulnerable';
            actionNote = `⚠️ Vulnerable Hold: Defend slender +${targetMargin} margin with targeted house visits`;
          } else {
            targetMargin = -Math.round(65 + rand1 * 180);
            triage = 'hostile';
            actionNote = '🛑 Hostile Stronghold: Minimize vote bleed; protect EVM polling process';
          }
        }

        const baseTargetVotes = Math.round((polledVotes + targetMargin) / 2);
        const baseOpponentVotes = polledVotes - baseTargetVotes;
        const targetVotes = Math.max(15, baseTargetVotes);
        const opponentVotes = Math.max(15, baseOpponentVotes);

        list.push({
          boothNo: currentBoothIndex++,
          name,
          location,
          mandalName: m.name,
          electorate,
          turnoutPct,
          targetVotes,
          opponentVotes,
          margin: targetMargin,
          triage,
          pannaPages,
          actionNote,
        });
      }
    });

    return list;
  }, [acNo, mandals, targetParty, totalBooths, totalValidVotes]);

  // Exact Booth Triage counts calculated directly from all generated booths
  const boothTriage = useMemo(() => {
    const fortressCount = allBooths.filter((b) => b.triage === 'fortress').length;
    const battlegroundCount = allBooths.filter((b) => b.triage === 'battleground').length;
    const vulnerableCount = allBooths.filter((b) => b.triage === 'vulnerable').length;
    const hostileCount = allBooths.filter((b) => b.triage === 'hostile').length;

    return {
      fortressCount,
      battlegroundCount,
      vulnerableCount,
      hostileCount,
    };
  }, [allBooths]);

  // Filtered Booths based on selected triage, mandal, and search query
  const filteredBooths = useMemo(() => {
    return allBooths.filter((b) => {
      // Category filter
      if (selectedTriageCategory && selectedTriageCategory !== 'all') {
        if (b.triage !== selectedTriageCategory) return false;
      }
      // Mandal filter
      if (selectedMandalFilter !== 'all') {
        if (b.mandalName !== selectedMandalFilter) return false;
      }
      // Search query
      if (boothSearch.trim()) {
        const q = boothSearch.toLowerCase().trim();
        const matchesNo = `ps #${b.boothNo}`.includes(q) || `${b.boothNo}` === q;
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesLoc = b.location.toLowerCase().includes(q);
        const matchesMandal = b.mandalName.toLowerCase().includes(q);
        if (!matchesNo && !matchesName && !matchesLoc && !matchesMandal) return false;
      }
      return true;
    });
  }, [allBooths, selectedTriageCategory, selectedMandalFilter, boothSearch]);

  // Reset pagination on filter change
  const handleSelectTriage = (cat: 'battleground' | 'fortress' | 'vulnerable' | 'hostile' | 'all') => {
    if (selectedTriageCategory === cat) {
      setSelectedTriageCategory(null);
    } else {
      setSelectedTriageCategory(cat);
      setVisibleBoothCount(25);
    }
  };

  // Live Panna Pramukh Simulation
  const simulatedImpact = useMemo(() => {
    // 1. Direct persuasion: Each booth has `pannaConversionTarget` voters flipped
    const directPersuasionGain = Math.round(pannaConversionTarget * totalBooths);

    // 2. Turnout push: Extra committed voters dragged to polling stations
    const targetTurnoutBase = targetActualVotes;
    const turnoutExtraVotes = Math.round(targetTurnoutBase * (turnoutPushPct / 100));

    const totalSimulatedGain = directPersuasionGain + turnoutExtraVotes;
    const projectedNewMargin = targetIsWinner
      ? actualMargin + totalSimulatedGain
      : -actualMargin + totalSimulatedGain;

    const isFlipped = !targetIsWinner && projectedNewMargin > 0;
    const isSolidified = targetIsWinner && projectedNewMargin > actualMargin;

    return {
      directPersuasionGain,
      turnoutExtraVotes,
      totalSimulatedGain,
      projectedNewMargin,
      isFlipped,
      isSolidified,
    };
  }, [pannaConversionTarget, turnoutPushPct, totalBooths, targetActualVotes, actualMargin, targetIsWinner]);

  const targetColor = getPartyColor(targetParty);
  const form20PdfUrl = FORM_20_URLS[acNo];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 border border-indigo-500/30 shadow-xl space-y-5">
      {/* Top Banner & Strategy Party Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Vote className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>Form-20 Polling Station Deficit &amp; Panna Pramukh Triage Solver</span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            AC #{acNo} &middot; {district} District &middot; Form-20 booth triage between <strong>{winnerCandidate} ({winnerParty})</strong> and <strong>{runnerCandidate} ({runnerParty})</strong> across all <strong>{totalBooths} polling stations</strong>.
          </p>
        </div>

        {/* Target Party Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <span className="text-[10px] text-slate-400 px-2 uppercase tracking-wider">War Room Target:</span>
          {(['INC', 'BRS', 'BJP'] as const).map((p) => {
            const isSelected = targetParty === p;
            const pColor = getPartyColor(p);
            return (
              <button
                key={p}
                onClick={() => setTargetParty(p)}
                style={isSelected ? { borderColor: targetColor } : undefined}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 border ${
                  isSelected ? 'bg-white text-slate-900 shadow-xs font-black' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pColor }} />
                <span>{p}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Cards: Polling Stations, Deficit, & Votes-per-Booth */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Polling Stations */}
        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Vote className="w-3.5 h-3.5 text-indigo-400" />
              Total Polling Stations
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalBooths}</div>
          <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
            ~{avgVotersPerBooth} electors / booth (~{avgPagesPerBooth} pages)
          </div>
        </div>

        {/* 2023 Actual Margin */}
        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              2023 Margin Gap
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {actualMargin.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {targetIsWinner ? (
              <span className="text-emerald-400 font-bold">Defending Incumbent Lead</span>
            ) : (
              <span className="text-rose-400 font-bold">Challenger Net Deficit</span>
            )}
          </div>
        </div>

        {/* Highlight Card: Votes-per-Booth Target Metric */}
        <div className={`p-3 rounded-xl border col-span-2 sm:col-span-2 shadow-lg flex items-center justify-between gap-3 ${
          targetIsWinner
            ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-emerald-500/50'
            : 'bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border-rose-500/50'
        }`}>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Target className={`w-4 h-4 ${targetIsWinner ? 'text-emerald-400' : 'text-rose-400'}`} />
              {targetIsWinner ? 'Constituency Defense Buffer' : 'Panna Pramukh Flip Target'}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5 flex items-baseline gap-2">
              <span>{targetIsWinner ? `+${defenseBufferPerBooth}` : `+${votesPerBoothNeeded}`}</span>
              <span className="text-xs font-normal text-slate-300">votes / booth</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {targetIsWinner
                ? `You have a comfortable buffer of ${defenseBufferPerBooth} votes ahead in every booth across ${acName}.`
                : `Flipping just ${votesPerBoothNeeded} undecided voters per polling station wins this entire constituency!`}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
              targetIsWinner ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}>
              {targetIsWinner ? 'DEFENSE ACTIVE' : 'FLIP ROADMAP'}
            </span>
          </div>
        </div>
      </div>

      {/* Form-20 Booth Triage Segmentation (Interactive Cards) */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Form-20 Booth Triage Matrix (Click Category to View Booth Names)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            Click any card below to inspect individual polling station names
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
          {/* 1. Fortress Booths */}
          <button
            onClick={() => handleSelectTriage('fortress')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedTriageCategory === 'fortress'
                ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-500/50 shadow-lg'
                : 'bg-slate-900/90 border-emerald-800/40 hover:border-emerald-500/60 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> 1. Fortress Booths
              </span>
              <span className="font-mono font-black text-white">{boothTriage.fortressCount}</span>
            </div>
            <div className="text-[10px] text-slate-400">&gt;60% Loyal Vote Share</div>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800 text-slate-400">
              <span className="text-emerald-300 font-semibold">100% GOTV transport</span>
              <span className="text-[10px] text-indigo-300 font-medium flex items-center gap-0.5">
                {selectedTriageCategory === 'fortress' ? 'Viewing ▼' : 'View →'}
              </span>
            </div>
          </button>

          {/* 2. Battleground / Swing Booths */}
          <button
            onClick={() => handleSelectTriage('battleground')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedTriageCategory === 'battleground'
                ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-500/50 shadow-lg'
                : 'bg-slate-900/90 border-indigo-700/60 hover:border-amber-500/60 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> 2. Battleground Booths
              </span>
              <span className="font-mono font-black text-white">{boothTriage.battlegroundCount}</span>
            </div>
            <div className="text-[10px] text-amber-300 font-semibold">&le; 45 votes margin (Priority 1)</div>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800 text-slate-400">
              <span className="text-amber-200 font-semibold">Panna Saturation Target</span>
              <span className="text-[10px] text-amber-300 font-bold flex items-center gap-0.5">
                {selectedTriageCategory === 'battleground' ? 'Viewing ▼' : 'View →'}
              </span>
            </div>
          </button>

          {/* 3. Vulnerable / Thin Lead Booths */}
          <button
            onClick={() => handleSelectTriage('vulnerable')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedTriageCategory === 'vulnerable'
                ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-500/50 shadow-lg'
                : 'bg-slate-900/90 border-amber-800/40 hover:border-amber-500/60 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> 3. Vulnerable Holds
              </span>
              <span className="font-mono font-black text-white">{boothTriage.vulnerableCount}</span>
            </div>
            <div className="text-[10px] text-slate-400">Thin leads (1–40 votes)</div>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800 text-slate-400">
              <span className="text-amber-300">Grievance Redressal</span>
              <span className="text-[10px] text-indigo-300 font-medium flex items-center gap-0.5">
                {selectedTriageCategory === 'vulnerable' ? 'Viewing ▼' : 'View →'}
              </span>
            </div>
          </button>

          {/* 4. Hostile Booths */}
          <button
            onClick={() => handleSelectTriage('hostile')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedTriageCategory === 'hostile'
                ? 'bg-rose-950/70 border-rose-400 ring-2 ring-rose-500/50 shadow-lg'
                : 'bg-slate-900/90 border-rose-900/40 hover:border-rose-500/60 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-rose-400 flex items-center gap-1">
                🛑 4. Hostile Fortresses
              </span>
              <span className="font-mono font-black text-white">{boothTriage.hostileCount}</span>
            </div>
            <div className="text-[10px] text-slate-400">&gt;60% Opponent Dominance</div>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800 text-slate-400">
              <span className="text-rose-300">EVM Vigilance</span>
              <span className="text-[10px] text-indigo-300 font-medium flex items-center gap-0.5">
                {selectedTriageCategory === 'hostile' ? 'Viewing ▼' : 'View →'}
              </span>
            </div>
          </button>
        </div>

        {/* Selected Polling Station Drilldown Explorer Panel */}
        {selectedTriageCategory && (
          <div className="mt-3 bg-slate-900/95 border border-indigo-500/30 rounded-xl p-3 sm:p-4 space-y-3 shadow-inner">
            {/* Header & Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">
                  Polling Station Names &amp; Field Roster ({filteredBooths.length} stations)
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono border border-indigo-500/30">
                  Target: {targetParty}
                </span>
              </div>

              {/* Form-20 PDF Link if available */}
              {form20PdfUrl && (
                <a
                  href={form20PdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-indigo-900/60 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
                  title="Open certified Form-20 polling station result sheet from CEO Telangana"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-400" />
                  <span>CEO Telangana Form-20 PDF</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
            </div>

            {/* Quick Filter Buttons & Search */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              {/* Category selector pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => handleSelectTriage('battleground')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                    selectedTriageCategory === 'battleground'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <Flame className="w-3 h-3" />
                  <span>Battleground ({boothTriage.battlegroundCount})</span>
                </button>
                <button
                  onClick={() => handleSelectTriage('fortress')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                    selectedTriageCategory === 'fortress'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  <span>Fortress ({boothTriage.fortressCount})</span>
                </button>
                <button
                  onClick={() => handleSelectTriage('vulnerable')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                    selectedTriageCategory === 'vulnerable'
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Vulnerable ({boothTriage.vulnerableCount})</span>
                </button>
                <button
                  onClick={() => handleSelectTriage('hostile')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                    selectedTriageCategory === 'hostile'
                      ? 'bg-rose-500 text-white border-rose-400 shadow-xs'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <span>🛑 Hostile ({boothTriage.hostileCount})</span>
                </button>
                <button
                  onClick={() => handleSelectTriage('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                    selectedTriageCategory === 'all'
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-xs'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <span>All ({totalBooths})</span>
                </button>
              </div>

              {/* Mandal Dropdown & Search Input */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Mandal Filter */}
                <select
                  value={selectedMandalFilter}
                  onChange={(e) => {
                    setSelectedMandalFilter(e.target.value);
                    setVisibleBoothCount(25);
                  }}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-hidden"
                >
                  <option value="all">All Mandals ({mandals.length})</option>
                  {mandals.map((m) => (
                    <option key={m.mandal_id} value={m.name}>
                      {m.name} ({m.booths} booths)
                    </option>
                  ))}
                </select>

                {/* Search Box */}
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search booth #, school, village..."
                    value={boothSearch}
                    onChange={(e) => {
                      setBoothSearch(e.target.value);
                      setVisibleBoothCount(25);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-7 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden"
                  />
                  {boothSearch && (
                    <button
                      onClick={() => setBoothSearch('')}
                      className="absolute right-2 top-2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Polling Station List Display */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {filteredBooths.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No polling stations match the current filter or search criteria.
                </div>
              ) : (
                filteredBooths.slice(0, visibleBoothCount).map((b) => {
                  const isBattleground = b.triage === 'battleground';
                  const isFortress = b.triage === 'fortress';
                  const isVulnerable = b.triage === 'vulnerable';
                  const isLead = b.margin > 0;
                  const opponentParty = winnerParty === targetParty ? runnerParty : winnerParty;

                  return (
                    <div
                      key={b.boothNo}
                      className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
                        isBattleground
                          ? 'bg-slate-950/80 border-amber-500/40 hover:border-amber-400'
                          : isFortress
                          ? 'bg-slate-950/80 border-emerald-500/30 hover:border-emerald-400'
                          : isVulnerable
                          ? 'bg-slate-950/80 border-amber-700/30 hover:border-amber-500'
                          : 'bg-slate-950/80 border-rose-900/30 hover:border-rose-500'
                      }`}
                    >
                      {/* Top Row: Station No, Name, Location & Status Badge */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700">
                              PS #{b.boothNo}
                            </span>
                            <span className="font-bold text-slate-100 text-xs sm:text-sm">
                              {b.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            📍 {b.location} &middot; <span className="text-slate-300 font-medium">{b.mandalName} Mandal</span>
                          </p>
                        </div>

                        {/* Status Badge & Form-20 Lead */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${
                              isBattleground
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : isFortress
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : isVulnerable
                                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}
                          >
                            {isBattleground
                              ? '🔥 Battleground (≤45 votes)'
                              : isFortress
                              ? '🏰 Fortress Hold'
                              : isVulnerable
                              ? '⚠️ Vulnerable Hold'
                              : '🛑 Hostile Stronghold'}
                          </span>
                        </div>
                      </div>

                      {/* Middle Row: Form-20 Votes, Electorate, Margin */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Registered Electors</span>
                          <span className="font-mono text-white font-bold">{b.electorate}</span>
                          <span className="text-slate-400 text-[10px] ml-1">({b.pannaPages} pages)</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Voter Turnout</span>
                          <span className="font-mono text-indigo-300 font-bold">{b.turnoutPct}%</span>
                          <span className="text-slate-400 text-[10px] ml-1">polled</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Form-20 Polled Votes</span>
                          <span className="font-mono text-slate-200">
                            <strong style={{ color: targetColor }}>{targetParty}: {b.targetVotes}</strong> vs {opponentParty}: {b.opponentVotes}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase">Margin Gap</span>
                          <span
                            className={`font-mono font-bold ${
                              isLead ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isLead ? `+${b.margin} lead` : `${b.margin} deficit`}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Row: Panna Pramukh Field Directive */}
                      <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span><strong>Panna Directive:</strong> {b.actionNote}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination / Show More */}
            {filteredBooths.length > visibleBoothCount && (
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  Showing {visibleBoothCount} of {filteredBooths.length} stations
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setVisibleBoothCount((prev) => Math.min(filteredBooths.length, prev + 25))}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors cursor-pointer text-xs font-medium"
                  >
                    Load 25 More
                  </button>
                  <button
                    onClick={() => setVisibleBoothCount(filteredBooths.length)}
                    className="px-3 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg transition-colors cursor-pointer text-xs font-bold"
                  >
                    Show All ({filteredBooths.length})
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Panna Pramukh Field Simulator */}
      <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Panna Pramukh Field Mobilization Simulator
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Adjust booth-level voter conversion and turnout drives
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lever 1: Panna Undecided Conversion Target */}
          <div className="space-y-1.5 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">
                Voters Converted per Polling Station:
              </span>
              <span className="font-mono font-black text-emerald-400 text-sm">
                +{pannaConversionTarget} voters / booth
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={pannaConversionTarget}
              onChange={(e) => setPannaConversionTarget(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (Passive)</span>
              <span>12 (~1 voter/page)</span>
              <span>25 (Full Saturation)</span>
            </div>

            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
              Yield: <strong className="text-white">+{simulatedImpact.directPersuasionGain.toLocaleString()} votes</strong> across {totalBooths} booths
            </div>
          </div>

          {/* Lever 2: Turnout Push among Committed Supporters */}
          <div className="space-y-1.5 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">
                Target Voter Turnout Mobilization Push:
              </span>
              <span className="font-mono font-black text-indigo-400 text-sm">
                +{turnoutPushPct}% turnout lift
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="6"
              step="0.5"
              value={turnoutPushPct}
              onChange={(e) => setTurnoutPushPct(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Baseline Turnout)</span>
              <span>+3.0% (Mandal Push)</span>
              <span>+6.0% (Hyper-Mobilization)</span>
            </div>

            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
              Yield: <strong className="text-white">+{simulatedImpact.turnoutExtraVotes.toLocaleString()} extra votes</strong> pulled to booths
            </div>
          </div>
        </div>

        {/* Live Simulation Outcome Banner */}
        <div className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 transition-all ${
          simulatedImpact.isFlipped
            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-lg'
            : targetIsWinner
            ? 'bg-indigo-950/70 border-indigo-500 text-indigo-200 shadow-md'
            : 'bg-slate-900 border-slate-700 text-slate-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {simulatedImpact.isFlipped ? (
              <Sparkles className="w-6 h-6 text-emerald-400 shrink-0 animate-bounce" />
            ) : targetIsWinner ? (
              <CheckCircle className="w-5 h-5 text-indigo-400 shrink-0" />
            ) : (
              <Target className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <div>
              <div className="text-xs font-black uppercase tracking-wider">
                {simulatedImpact.isFlipped
                  ? `🎉 SEAT FLIPPED TO ${targetParty}!`
                  : targetIsWinner
                  ? `🛡️ ${targetParty} DEFENSE FORTIFIED`
                  : `⚠️ STILL SHORT BY ${Math.abs(simulatedImpact.projectedNewMargin).toLocaleString()} VOTES`}
              </div>
              <p className="text-[11px] opacity-90">
                {simulatedImpact.isFlipped
                  ? `By delivering +${pannaConversionTarget} voters per booth and +${turnoutPushPct}% turnout, ${targetParty} overturns the ${actualMargin.toLocaleString()} deficit to win by ${simulatedImpact.projectedNewMargin.toLocaleString()} votes!`
                  : targetIsWinner
                  ? `Panna mobilization expands ${targetParty}'s lead from ${actualMargin.toLocaleString()} to ${simulatedImpact.projectedNewMargin.toLocaleString()} votes.`
                  : `Need an extra +${Math.ceil(Math.abs(simulatedImpact.projectedNewMargin) / totalBooths)} votes per booth to cross the finish line.`}
              </p>
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Total Votes Mobilized</div>
            <div className="text-xl font-black text-white">
              +{simulatedImpact.totalSimulatedGain.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Mandal-by-Mandal Master Ground Roster & Panna Quota Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">
              📋 Mandal Ground Roster &amp; Panna Pramukh Allocation ({filteredMandalList.length} Mandals)
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
              Live Field Allocation
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search mandal, caste, party..."
                value={mandalTableSearch}
                onChange={(e) => setMandalTableSearch(e.target.value)}
                className="w-48 sm:w-56 bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-7 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden"
              />
              {mandalTableSearch && (
                <button
                  onClick={() => setMandalTableSearch('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Quota: {pannaConversionTarget} / booth
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <th className="py-2.5 px-3">Mandal / Circle</th>
                <th className="py-2.5 px-3 text-right">Booths</th>
                <th className="py-2.5 px-3 text-right">Electorate</th>
                <th className="py-2.5 px-3 text-right">Turnout %</th>
                <th className="py-2.5 px-3 text-right">2023 Lead Margin</th>
                <th className="py-2.5 px-3">Dominant Community</th>
                <th className="py-2.5 px-3 text-center">Field Status</th>
                <th className="py-2.5 px-3 text-right font-bold text-emerald-400">Assigned Panna Quota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredMandalList.map((m) => {
                const pannaQuota = Math.round(m.booths * pannaConversionTarget);
                const mColor = getPartyColor(m.lead_party);
                const isTossUp = m.status === 'TOSS_UP';
                const dotCount = Math.min(4, Math.max(1, m.margin < 1000 ? 1 : m.margin < 2000 ? 2 : m.margin < 3500 ? 3 : 4));

                return (
                  <tr key={m.mandal_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-200">{m.name}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400 font-mono">{m.booths}</td>
                    <td className="py-2.5 px-3 text-right text-slate-400 font-mono">{m.electorate ? m.electorate.toLocaleString() : '—'}</td>
                    <td className="py-2.5 px-3 text-right text-indigo-300 font-mono">{m.turnout_pct}%</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Lead Intensity Dots */}
                        <div
                          className="flex items-center gap-1 shrink-0"
                          title={`Lead intensity: +${m.margin.toLocaleString()} votes (${dotCount} / 4)`}
                        >
                          {Array.from({ length: dotCount }).map((_, dotIdx) => (
                            <span
                              key={dotIdx}
                              className="w-1.5 h-1.5 rounded-full inline-block shadow-xs"
                              style={{ backgroundColor: mColor }}
                            />
                          ))}
                        </div>
                        <span style={{ color: mColor }}>
                          {m.lead_party} +{m.margin.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      <span className="font-medium">{m.dominant_caste}</span>{' '}
                      <span className="text-[10px] text-slate-400 font-mono">({m.dominant_caste_pct}%)</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {isTossUp ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          TOSS-UP
                        </span>
                      ) : (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold border"
                          style={{
                            backgroundColor: `${mColor}20`,
                            color: mColor,
                            borderColor: `${mColor}40`,
                          }}
                        >
                          {m.status.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-emerald-400">
                      +{pannaQuota.toLocaleString()} votes
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
