import React, { useState, useMemo } from 'react';
import type { SeeepcDataset } from '../types';
import { getPartyColor } from '../types';
import {
  Star,
  Sparkles,
  RotateCcw,
  CheckCircle,
  MapPin,
  Calendar,
  Flame,
  Search
} from 'lucide-react';

export interface CampaignerConfig {
  id: string;
  name: string;
  title: string;
  party: 'INC' | 'BRS' | 'BJP' | 'AIMIM';
  totalDays: number;
  voteLiftPerDayPct: number; // e.g. 0.8% vote lift per day in that AC
  maxDaysPerAc: number;
  resonanceZones: string;
  description: string;
  avatarBg: string;
}

export const CAMPAIGNERS: CampaignerConfig[] = [
  {
    id: 'revanth',
    name: 'A. Revanth Reddy',
    title: 'Chief Minister & Mass Orator',
    party: 'INC',
    totalDays: 25,
    voteLiftPerDayPct: 0.85,
    maxDaysPerAc: 4,
    resonanceZones: 'South Telangana, Palamuru, Rural BCs, Youth',
    description: 'High anti-incumbency narrative, mass turnout spikes, aggressive grassroots mobilization.',
    avatarBg: 'bg-sky-600',
  },
  {
    id: 'kcr',
    name: 'K. Chandrashekar Rao / KTR',
    title: 'BRS Supremo & Welfare Architect',
    party: 'BRS',
    totalDays: 25,
    voteLiftPerDayPct: 0.90,
    maxDaysPerAc: 4,
    resonanceZones: 'North Telangana, Medak, Karimnagar, Farmers',
    description: 'Emotional Telangana pride, Rythu Bandhu welfare consolidation, loyal rural cadre pull.',
    avatarBg: 'bg-pink-600',
  },
  {
    id: 'kishan_sanjay',
    name: 'G. Kishan Reddy / Bandi Sanjay',
    title: 'Union Minister & Firebrand Orator',
    party: 'BJP',
    totalDays: 20,
    voteLiftPerDayPct: 0.80,
    maxDaysPerAc: 4,
    resonanceZones: 'GHMC Corridors, Nizamabad, Karimnagar, Adilabad',
    description: 'National security & Modi welfare pitch, polarizing Hindu consolidation, urban middle class.',
    avatarBg: 'bg-amber-600',
  },
  {
    id: 'owaisi',
    name: 'Asaduddin Owaisi',
    title: 'AIMIM President & Parliamentarian',
    party: 'AIMIM',
    totalDays: 15,
    voteLiftPerDayPct: 1.40,
    maxDaysPerAc: 3,
    resonanceZones: 'Old City Hyderabad, Bodhan, Sangareddy, Nizamabad Urban',
    description: 'Hyper-consolidates minority votes, drives high urban minority turnout, counter-BJP mobilization.',
    avatarBg: 'bg-emerald-700',
  },
];

interface StarCampaignerAllocatorProps {
  data: SeeepcDataset;
  onOpenDossier?: (acNo: number) => void;
}

export const StarCampaignerAllocator: React.FC<StarCampaignerAllocatorProps> = ({
  data,
  onOpenDossier,
}) => {
  const [selectedCampaignerId, setSelectedCampaignerId] = useState<string>('revanth');
  const [filterType, setFilterType] = useState<'battleground' | 'all' | 'flipped'>('battleground');
  const [searchQuery, setSearchQuery] = useState('');

  // Store days allocated: { [campaignerId]: { [acNo]: number } }
  const [allocations, setAllocations] = useState<Record<string, Record<number, number>>>(() => {
    // Seed sensible defaults for key battleground seats
    return {
      revanth: { 40: 3, 23: 2, 77: 2, 85: 2, 1: 2, 28: 2, 31: 1 },
      kcr: { 40: 2, 23: 3, 28: 2, 105: 2, 77: 1, 3: 2 },
      kishan_sanjay: { 48: 3, 56: 2, 2: 2, 4: 2, 7: 2 },
      owaisi: { 58: 2, 59: 2, 60: 2, 17: 2 },
    };
  });

  const activeCampaigner = useMemo(
    () => CAMPAIGNERS.find((c) => c.id === selectedCampaignerId) || CAMPAIGNERS[0],
    [selectedCampaignerId]
  );

  // Calculate used days per campaigner
  const daysUsed = useMemo(() => {
    const used: Record<string, number> = {};
    CAMPAIGNERS.forEach((c) => {
      const seatMap = allocations[c.id] || {};
      used[c.id] = Object.values(seatMap).reduce((sum, d) => sum + d, 0);
    });
    return used;
  }, [allocations]);

  const remainingDays = activeCampaigner.totalDays - (daysUsed[activeCampaigner.id] || 0);

  // Modify days for an AC
  const handleDayChange = (acNo: number, delta: number) => {
    const current = allocations[activeCampaigner.id]?.[acNo] || 0;
    const next = current + delta;
    if (next < 0 || next > activeCampaigner.maxDaysPerAc) return;
    if (delta > 0 && remainingDays <= 0) return;

    setAllocations((prev) => {
      const campAlloc = { ...(prev[activeCampaigner.id] || {}) };
      if (next === 0) {
        delete campAlloc[acNo];
      } else {
        campAlloc[acNo] = next;
      }
      return {
        ...prev,
        [activeCampaigner.id]: campAlloc,
      };
    });
  };

  // Reset allocations for current campaigner
  const handleResetCurrent = () => {
    setAllocations((prev) => ({
      ...prev,
      [activeCampaigner.id]: {},
    }));
  };

  // Auto-optimize remaining days to flip highest-yield seats
  const handleAutoDeploy = () => {
    let daysToGive = remainingDays;
    if (daysToGive <= 0) return;

    const campAlloc = { ...(allocations[activeCampaigner.id] || {}) };
    const acList = Object.values(data.constituencies);

    // Prioritize seats where campaigner's party was runner-up with tight deficit
    const targets = acList
      .filter((ac) => ac.runner_up_2023.party === activeCampaigner.party)
      .sort((a, b) => a.margin_2023 - b.margin_2023);

    for (const t of targets) {
      if (daysToGive <= 0) break;
      const current = campAlloc[t.ac_no] || 0;
      const space = activeCampaigner.maxDaysPerAc - current;
      if (space > 0) {
        const assign = Math.min(space, daysToGive, 2);
        campAlloc[t.ac_no] = current + assign;
        daysToGive -= assign;
      }
    }

    setAllocations((prev) => ({
      ...prev,
      [activeCampaigner.id]: campAlloc,
    }));
  };

  // Compute live constituency metrics
  const constituencyList = useMemo(() => {
    return Object.values(data.constituencies).map((ac) => {
      const winner = ac.winner_2023.party;
      const margin = ac.margin_2023;
      const isPartyWinner = winner === activeCampaigner.party;

      // Estimate total valid votes from 2023 baseline ~ 180,000 average in Telangana
      const estimatedTotalVotes = 185000;

      // Sum days from this campaigner
      const days = allocations[activeCampaigner.id]?.[ac.ac_no] || 0;

      // Vote lift: each day adds `voteLiftPerDayPct` % to active campaigner's party vote share
      const voteLiftPct = days * activeCampaigner.voteLiftPerDayPct;
      const voteLiftCount = Math.round((voteLiftPct / 100) * estimatedTotalVotes);

      // New margin calculation
      let newMargin = isPartyWinner ? margin + voteLiftCount : -margin + voteLiftCount;
      const isFlippedToWin = !isPartyWinner && newMargin > 0;
      const isDefended = isPartyWinner && days > 0;

      return {
        ac_no: ac.ac_no,
        ac_name: ac.ac_name,
        district: ac.district,
        pc_name: ac.pc_name,
        winner_2023: winner,
        runner_up_2023: ac.runner_up_2023.party,
        margin_2023: margin,
        isPartyWinner,
        days,
        voteLiftPct,
        voteLiftCount,
        newMargin,
        isFlippedToWin,
        isDefended,
      };
    });
  }, [data, activeCampaigner, allocations]);

  // Aggregate stats
  const totalCampaignDaysAllocated = useMemo(() => {
    return Object.values(daysUsed).reduce((s, v) => s + v, 0);
  }, [daysUsed]);

  const totalSeatsFlippedByActive = useMemo(() => {
    return constituencyList.filter((c) => c.isFlippedToWin).length;
  }, [constituencyList]);

  const totalNetVotesGained = useMemo(() => {
    return constituencyList.reduce((sum, c) => sum + c.voteLiftCount, 0);
  }, [constituencyList]);

  // Filtered view
  const filteredList = useMemo(() => {
    return constituencyList
      .filter((c) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = c.ac_name.toLowerCase().includes(q);
          const matchesDist = c.district.toLowerCase().includes(q);
          const matchesNo = c.ac_no.toString().includes(q);
          if (!matchesName && !matchesDist && !matchesNo) return false;
        }

        if (filterType === 'battleground') {
          return c.margin_2023 <= 8000 || c.days > 0;
        }
        if (filterType === 'flipped') {
          return c.isFlippedToWin || c.days > 0;
        }
        return true;
      })
      .sort((a, b) => {
        // Show assigned seats first, then tightest margin
        if (b.days !== a.days) return b.days - a.days;
        return a.margin_2023 - b.margin_2023;
      });
  }, [constituencyList, filterType, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Campaigner Selector Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 font-mono text-xs font-black px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                <Star className="w-3.5 h-3.5 fill-slate-950" /> FEATURE #10
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                Star Campaigner Days Allocator
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Leadership Tour &amp; Rally Allocation Engine
            </h2>
            <p className="text-xs text-slate-400">
              Deploy finite rally days of top state leadership to hyper-close battlegrounds to maximize localized voter turnout and swing.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAutoDeploy}
              disabled={remainingDays <= 0}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              title="Auto deploy remaining days to flip close deficit seats"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              Auto-Deploy Days ({remainingDays} left)
            </button>

            <button
              onClick={handleResetCurrent}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              title="Reset campaigner days"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Star Campaigner Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CAMPAIGNERS.map((camp) => {
            const isSelected = camp.id === selectedCampaignerId;
            const used = daysUsed[camp.id] || 0;
            const left = camp.totalDays - used;
            const partyColor = getPartyColor(camp.party);

            return (
              <button
                key={camp.id}
                onClick={() => setSelectedCampaignerId(camp.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-800 border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-xs ${camp.avatarBg}`}
                    >
                      {camp.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs leading-snug line-clamp-1">{camp.name}</h4>
                      <span
                        className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded"
                        style={{ backgroundColor: `${partyColor}22`, color: partyColor }}
                      >
                        {camp.party}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-700/60 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Rally Days:</span>
                    <span className="font-mono font-bold text-white">
                      {used} / {camp.totalDays}d ({left} left)
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all"
                      style={{ width: `${Math.min(100, (used / camp.totalDays) * 100)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-1">
                    🎯 {camp.resonanceZones}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Campaigner Impact KPI Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-[11px] text-slate-400 font-medium">Selected Leader</div>
            <div className="text-sm font-black text-white truncate">{activeCampaigner.name}</div>
            <div className="text-[10px] text-amber-300 font-mono mt-0.5">
              +{activeCampaigner.voteLiftPerDayPct}% shift / rally day
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-[11px] text-slate-400 font-medium">Days Available to Tour</div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-black ${remainingDays > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {remainingDays}
              </span>
              <span className="text-xs text-slate-400">/ {activeCampaigner.totalDays} Total</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {totalCampaignDaysAllocated}d scheduled state-wide
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-[11px] text-slate-400 font-medium">Projected Flips by {activeCampaigner.party}</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400">+{totalSeatsFlippedByActive}</span>
              <span className="text-xs text-slate-400">Seats Won</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-[11px] text-slate-400 font-medium">Mobilized Net Votes</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-sky-400">+{totalNetVotesGained.toLocaleString()}</span>
              <span className="text-xs text-slate-400">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Constituency Allocation Grid Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
            Schedule Rallies for {activeCampaigner.name} ({activeCampaigner.party})
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search AC or District..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 w-44"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setFilterType('battleground')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'battleground'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Battlegrounds (&lt;8k)
            </button>
            <button
              onClick={() => setFilterType('flipped')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'flipped'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Flipped / Scheduled
            </button>
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All 119
            </button>
          </div>
        </div>
      </div>

      {/* Target AC Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.slice(0, 18).map((c) => {
          const hasDays = c.days > 0;
          const isFlipped = c.isFlippedToWin;
          const winnerColor = getPartyColor(c.winner_2023);

          return (
            <div
              key={c.ac_no}
              className={`p-4 rounded-xl border transition-all ${
                isFlipped
                  ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                  : hasDays
                  ? 'bg-amber-50/30 border-amber-300 ring-1 ring-amber-400/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] font-bold bg-slate-900 text-white px-1.5 py-0.2 rounded">
                      #{c.ac_no}
                    </span>
                    <h4 className="font-black text-slate-900 text-sm">{c.ac_name}</h4>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{c.district}</span>
                  </div>
                </div>

                {isFlipped ? (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md text-[11px] font-black flex items-center gap-1 shadow-2xs">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    FLIPPED (+{c.newMargin.toLocaleString()})
                  </span>
                ) : c.isPartyWinner ? (
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-800 border border-sky-300 rounded-md text-[11px] font-bold">
                    Defended (+{c.newMargin.toLocaleString()})
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md text-[11px] font-bold">
                    Deficit: -{Math.abs(c.newMargin).toLocaleString()}
                  </span>
                )}
              </div>

              {/* 2023 Baseline Info */}
              <div className="py-2.5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>2023 Result:</span>
                  <span>
                    Won by <strong style={{ color: winnerColor }}>{c.winner_2023}</strong> by {c.margin_2023.toLocaleString()} votes
                  </span>
                </div>

                {/* Day Allocation Stepper */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Rally Days Allocated:
                    </div>
                    <div className="text-[10px] text-slate-500">
                      +{c.voteLiftPct.toFixed(1)}% ({c.voteLiftCount.toLocaleString()} votes)
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDayChange(c.ac_no, -1)}
                      disabled={c.days <= 0}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-300 disabled:opacity-30 hover:bg-slate-100 font-bold text-slate-700 text-sm flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                    >
                      -
                    </button>
                    <span className="font-mono font-black text-sm text-slate-900 w-6 text-center">
                      {c.days}d
                    </span>
                    <button
                      onClick={() => handleDayChange(c.ac_no, 1)}
                      disabled={c.days >= activeCampaigner.maxDaysPerAc || remainingDays <= 0}
                      className="w-7 h-7 rounded-lg bg-amber-500 disabled:opacity-30 hover:bg-amber-400 font-black text-slate-950 text-sm flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <div className="text-slate-500 font-medium">
                  {c.days > 0 ? (
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-500" /> High-Voltage Ground Rally
                    </span>
                  ) : (
                    <span className="text-slate-400">No leadership rally slated</span>
                  )}
                </div>

                {onOpenDossier && (
                  <button
                    onClick={() => onOpenDossier(c.ac_no)}
                    className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                  >
                    AC Dossier ↗
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
