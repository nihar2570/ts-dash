import React, { useState, useMemo } from 'react';
import type { SeeepcDataset, SimulatedConstituencyResult } from '../types';
import { getPartyColor } from '../types';
import {
  Sparkles,
  RotateCcw,
  Sliders,
  ChevronRight,
  Target,
  Flame,
  Search,
  CheckCircle
} from 'lucide-react';

interface SimulationsViewProps {
  data: SeeepcDataset;
  onNavigateToActions: (acNo?: number) => void;
  onSelectConstituencyDossier?: (acNo: number) => void;
}

export const SimulationsView: React.FC<SimulationsViewProps> = ({
  data,
  onNavigateToActions,
  onSelectConstituencyDossier,
}) => {
  // Demographic swing offsets relative to 2023 baseline
  // Key: community id, Value: swing to party (% shift, positive = INC gain, negative = BRS/BJP gain)
  const [swings, setSwings] = useState<Record<string, { INC: number; BRS: number; BJP: number }>>({
    sc_madiga: { INC: 0, BRS: 0, BJP: 0 },
    sc_mala: { INC: 0, BRS: 0, BJP: 0 },
    st_lambada: { INC: 0, BRS: 0, BJP: 0 },
    st_koya_gond: { INC: 0, BRS: 0, BJP: 0 },
    bc_mudiraj: { INC: 0, BRS: 0, BJP: 0 },
    bc_munnuru_kapu: { INC: 0, BRS: 0, BJP: 0 },
    bc_padmashali: { INC: 0, BRS: 0, BJP: 0 },
    bc_goud: { INC: 0, BRS: 0, BJP: 0 },
    bc_yadav: { INC: 0, BRS: 0, BJP: 0 },
    minority_muslim: { INC: 0, BRS: 0, BJP: 0 },
    oc_reddy: { INC: 0, BRS: 0, BJP: 0 },
    oc_velama: { INC: 0, BRS: 0, BJP: 0 },
    youth_18_25: { INC: 0, BRS: 0, BJP: 0 },
  });

  const [activePreset, setActivePreset] = useState<string>('baseline');
  const [selectedBubbleAc, setSelectedBubbleAc] = useState<number | null>(null);
  const [tierFilter, setTierFilter] = useState<'ALL' | 'TOSS_UP' | 'FLIPS'>('TOSS_UP');
  const [tossUpThreshold, setTossUpThreshold] = useState<number>(5000);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Handle Preset Scenarios
  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    const reset = {
      sc_madiga: { INC: 0, BRS: 0, BJP: 0 },
      sc_mala: { INC: 0, BRS: 0, BJP: 0 },
      st_lambada: { INC: 0, BRS: 0, BJP: 0 },
      st_koya_gond: { INC: 0, BRS: 0, BJP: 0 },
      bc_mudiraj: { INC: 0, BRS: 0, BJP: 0 },
      bc_munnuru_kapu: { INC: 0, BRS: 0, BJP: 0 },
      bc_padmashali: { INC: 0, BRS: 0, BJP: 0 },
      bc_goud: { INC: 0, BRS: 0, BJP: 0 },
      bc_yadav: { INC: 0, BRS: 0, BJP: 0 },
      minority_muslim: { INC: 0, BRS: 0, BJP: 0 },
      oc_reddy: { INC: 0, BRS: 0, BJP: 0 },
      oc_velama: { INC: 0, BRS: 0, BJP: 0 },
      youth_18_25: { INC: 0, BRS: 0, BJP: 0 },
    };

    if (presetKey === 'mudiraj_brs') {
      // BRS consolidates North Telangana Mudiraj & BCs
      reset.bc_mudiraj = { INC: -6, BRS: 7, BJP: -1 };
      reset.bc_munnuru_kapu = { INC: -4, BRS: 5, BJP: -1 };
      reset.bc_goud = { INC: -3, BRS: 4, BJP: -1 };
    } else if (presetKey === 'madiga_bjp') {
      // BJP consolidates Madiga SCs via sub-categorization
      reset.sc_madiga = { INC: -7, BRS: -3, BJP: 10 };
      reset.bc_mudiraj = { INC: -3, BRS: -2, BJP: 5 };
    } else if (presetKey === 'youth_inc') {
      // Youth 18-25 & employment swing to INC
      reset.youth_18_25 = { INC: 8, BRS: -5, BJP: -3 };
      reset.bc_mudiraj = { INC: 4, BRS: -3, BJP: -1 };
      reset.sc_mala = { INC: 5, BRS: -4, BJP: -1 };
    } else if (presetKey === 'mahalakshmi_wave') {
      // Welfare momentum
      reset.bc_padmashali = { INC: 6, BRS: -5, BJP: -1 };
      reset.st_lambada = { INC: 5, BRS: -4, BJP: -1 };
      reset.sc_mala = { INC: 4, BRS: -3, BJP: -1 };
      reset.minority_muslim = { INC: 4, BRS: -4, BJP: 0 };
    }

    setSwings(reset);
  };

  // Helper to adjust a single community swing
  const updateSwing = (communityKey: string, party: 'INC' | 'BRS' | 'BJP', val: number) => {
    setActivePreset('custom');
    setSwings((prev) => ({
      ...prev,
      [communityKey]: {
        ...prev[communityKey],
        [party]: val,
      },
    }));
  };

  // Run Simulation across all 119 Constituencies
  const simulatedResults: SimulatedConstituencyResult[] = useMemo(() => {
    const list: SimulatedConstituencyResult[] = [];

    Object.values(data.constituencies).forEach((ac) => {
      const actualWinner = ac.winner_2023.party;
      const actualRunner = ac.runner_up_2023.party;
      const totalVotes = ac.total_votes_2023;

      // Base vote calculation using 2023 Form-20 votes as anchor
      let incVotes = actualWinner === 'INC' ? ac.winner_2023.votes : actualRunner === 'INC' ? ac.runner_up_2023.votes : totalVotes * 0.25;
      let brsVotes = actualWinner === 'BRS' ? ac.winner_2023.votes : actualRunner === 'BRS' ? ac.runner_up_2023.votes : totalVotes * 0.28;
      let bjpVotes = actualWinner === 'BJP' ? ac.winner_2023.votes : actualRunner === 'BJP' ? ac.runner_up_2023.votes : totalVotes * 0.12;
      let aimimVotes = actualWinner === 'AIMIM' ? ac.winner_2023.votes : actualRunner === 'AIMIM' ? ac.runner_up_2023.votes : (ac.ac_no >= 58 && ac.ac_no <= 70 ? totalVotes * 0.40 : 0);

      // Apply community-weighted demographic swings from SEEEPC
      const cp = ac.caste_profile;
      const ap = ac.age_profile;

      // Calculate net vote shifts
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

      // Ensure positive votes
      incVotes = Math.max(100, Math.round(incVotes));
      brsVotes = Math.max(100, Math.round(brsVotes));
      bjpVotes = Math.max(100, Math.round(bjpVotes));
      aimimVotes = Math.max(0, Math.round(aimimVotes));

      // Rank parties
      const partyPairs: [string, number][] = [
        ['INC', incVotes],
        ['BRS', brsVotes],
        ['BJP', bjpVotes],
      ];
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

      // Format readable demographic name
      const readableCasteName: Record<string, string> = {
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
      };

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
        key_demographic: readableCasteName[maxComm] || maxComm,
        key_demographic_pct: maxPct,
        battleground_tier: tier,
      });
    });

    return list;
  }, [data, swings, tossUpThreshold]);

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
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white font-mono text-xs font-black px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> CM STRATEGIC WAR ROOM
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                SEEEPC Vol-4 Demographics + Dynamic Polling
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Assembly Majority Barometer &amp; Battleground Simulator
            </h2>
          </div>

          {/* Quick Scenario Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold mr-1">Scenarios:</span>
            <button
              onClick={() => applyPreset('baseline')}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                activePreset === 'baseline'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              2023 Baseline
            </button>
            <button
              onClick={() => applyPreset('mudiraj_brs')}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                activePreset === 'mudiraj_brs'
                  ? 'bg-pink-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              BC Mudiraj + BRS (+7%)
            </button>
            <button
              onClick={() => applyPreset('madiga_bjp')}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                activePreset === 'madiga_bjp'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Madiga + BJP (+10%)
            </button>
            <button
              onClick={() => applyPreset('youth_inc')}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                activePreset === 'youth_inc'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Youth + INC (+8%)
            </button>
            <button
              onClick={() => applyPreset('baseline')}
              title="Reset all swings to 0"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real-time "Path to 60" Seat Barometer Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
          {/* INC */}
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-bold flex items-center gap-1.5 text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#19AAED]" />
                INC (Congress)
              </span>
              <span className={`text-[10px] font-bold font-mono ${tally.incDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {tally.incDiff >= 0 ? `+${tally.incDiff}` : tally.incDiff} vs 2023
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{tally.counts.INC}</span>
              <span className="text-xs text-slate-400">
                {tally.counts.INC >= 60 ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3" /> Majority
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold">-{60 - tally.counts.INC} to Majority</span>
                )}
              </span>
            </div>
          </div>

          {/* BRS */}
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-bold flex items-center gap-1.5 text-pink-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF1493]" />
                BRS
              </span>
              <span className={`text-[10px] font-bold font-mono ${tally.brsDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {tally.brsDiff >= 0 ? `+${tally.brsDiff}` : tally.brsDiff} vs 2023
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{tally.counts.BRS}</span>
              <span className="text-xs text-slate-400">
                {tally.counts.BRS >= 60 ? (
                  <span className="text-emerald-400 font-bold">Majority</span>
                ) : (
                  <span className="text-slate-400">Seats</span>
                )}
              </span>
            </div>
          </div>

          {/* BJP */}
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933]" />
                BJP
              </span>
              <span className={`text-[10px] font-bold font-mono ${tally.bjpDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {tally.bjpDiff >= 0 ? `+${tally.bjpDiff}` : tally.bjpDiff} vs 2023
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{tally.counts.BJP}</span>
              <span className="text-xs text-slate-400">Kingmaker Zone</span>
            </div>
          </div>

          {/* AIMIM */}
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006600]" />
                AIMIM
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Hyderabad</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{tally.counts.AIMIM}</span>
              <span className="text-xs text-slate-400">Old City Base</span>
            </div>
          </div>

          {/* Triage & Flips Alert */}
          <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/60 p-3.5 rounded-xl border border-indigo-700/40">
            <div className="flex items-center justify-between text-xs text-indigo-300 mb-1 font-semibold">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> Triage Alarms
              </span>
              <span className="bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-mono text-[10px]">
                {tally.flippedCount} Flips
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-300">{tally.tossUpCount}</span>
              <span className="text-xs text-slate-300">
                Toss-ups (&le; {tossUpThreshold >= 1000 ? `${(tossUpThreshold / 1000).toFixed(1).replace('.0', '')}k` : tossUpThreshold} votes)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls (Sliders), Right Bubble Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Polling & Demographics Sliders (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                Poll Swing Sliders by Caste &amp; Group
              </h3>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              Live Engine
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Backward Classes (BCs) */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Backward Classes (BCs ~50% of TS)
              </div>
              <div className="space-y-3">
                {/* Mudiraj */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-bold">Mudiraj (BC-D ~12%)</span>
                    <span className={`font-mono font-bold text-[11px] ${swings.bc_mudiraj.INC > 0 ? 'text-sky-600' : swings.bc_mudiraj.BRS > 0 ? 'text-pink-600' : 'text-slate-500'}`}>
                      {swings.bc_mudiraj.INC > 0 ? `+${swings.bc_mudiraj.INC}% INC` : swings.bc_mudiraj.BRS > 0 ? `+${swings.bc_mudiraj.BRS}% BRS` : 'Neutral'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={swings.bc_mudiraj.INC - swings.bc_mudiraj.BRS}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v >= 0) {
                        updateSwing('bc_mudiraj', 'INC', v);
                        updateSwing('bc_mudiraj', 'BRS', 0);
                      } else {
                        updateSwing('bc_mudiraj', 'INC', 0);
                        updateSwing('bc_mudiraj', 'BRS', Math.abs(v));
                      }
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>← BRS Favored</span>
                    <span>INC Favored →</span>
                  </div>
                </div>

                {/* Munnuru Kapu */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-bold">Munnuru Kapu (BC-D ~10%)</span>
                    <span className={`font-mono font-bold text-[11px] ${swings.bc_munnuru_kapu.INC > 0 ? 'text-sky-600' : swings.bc_munnuru_kapu.BRS > 0 ? 'text-pink-600' : 'text-slate-500'}`}>
                      {swings.bc_munnuru_kapu.INC > 0 ? `+${swings.bc_munnuru_kapu.INC}% INC` : swings.bc_munnuru_kapu.BRS > 0 ? `+${swings.bc_munnuru_kapu.BRS}% BRS` : 'Neutral'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={swings.bc_munnuru_kapu.INC - swings.bc_munnuru_kapu.BRS}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v >= 0) {
                        updateSwing('bc_munnuru_kapu', 'INC', v);
                        updateSwing('bc_munnuru_kapu', 'BRS', 0);
                      } else {
                        updateSwing('bc_munnuru_kapu', 'INC', 0);
                        updateSwing('bc_munnuru_kapu', 'BRS', Math.abs(v));
                      }
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Padmashali */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-bold">Padmashali (Weavers ~6%)</span>
                    <span className={`font-mono font-bold text-[11px] ${swings.bc_padmashali.INC > 0 ? 'text-sky-600' : swings.bc_padmashali.BRS > 0 ? 'text-pink-600' : 'text-slate-500'}`}>
                      {swings.bc_padmashali.INC > 0 ? `+${swings.bc_padmashali.INC}% INC` : swings.bc_padmashali.BRS > 0 ? `+${swings.bc_padmashali.BRS}% BRS` : 'Neutral'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={swings.bc_padmashali.INC - swings.bc_padmashali.BRS}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v >= 0) {
                        updateSwing('bc_padmashali', 'INC', v);
                        updateSwing('bc_padmashali', 'BRS', 0);
                      } else {
                        updateSwing('bc_padmashali', 'INC', 0);
                        updateSwing('bc_padmashali', 'BRS', Math.abs(v));
                      }
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Goud */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-bold">Goud / Ediga (BC-B ~7%)</span>
                    <span className={`font-mono font-bold text-[11px] ${swings.bc_goud.INC > 0 ? 'text-sky-600' : swings.bc_goud.BRS > 0 ? 'text-pink-600' : 'text-slate-500'}`}>
                      {swings.bc_goud.INC > 0 ? `+${swings.bc_goud.INC}% INC` : swings.bc_goud.BRS > 0 ? `+${swings.bc_goud.BRS}% BRS` : 'Neutral'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={swings.bc_goud.INC - swings.bc_goud.BRS}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v >= 0) {
                        updateSwing('bc_goud', 'INC', v);
                        updateSwing('bc_goud', 'BRS', 0);
                      } else {
                        updateSwing('bc_goud', 'INC', 0);
                        updateSwing('bc_goud', 'BRS', Math.abs(v));
                      }
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Scheduled Castes & Tribes (SC/ST) */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                SC &amp; ST Communities (~28% of TS)
              </div>
              <div className="space-y-3">
                {/* Madiga SC */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-bold">SC Madiga (~11%)</span>
                    <span className={`font-mono font-bold text-[11px] ${swings.sc_madiga.BJP > 0 ? 'text-amber-600' : swings.sc_madiga.INC > 0 ? 'text-sky-600' : 'text-slate-500'}`}>
                      {swings.sc_madiga.BJP > 0 ? `+${swings.sc_madiga.BJP}% BJP` : swings.sc_madiga.INC > 0 ? `+${swings.sc_madiga.INC}% INC` : 'Neutral'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={swings.sc_madiga.BJP - swings.sc_madiga.INC}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v >= 0) {
                        updateSwing('sc_madiga', 'BJP', v);
                        updateSwing('sc_madiga', 'INC', 0);
                      } else {
                        updateSwing('sc_madiga', 'BJP', 0);
                        updateSwing('sc_madiga', 'INC', Math.abs(v));
                      }
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>← INC Favored</span>
                    <span>BJP Favored →</span>
                  </div>
                </div>

                {/* Lambada ST */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="font-bold">ST Lambada (~7%)</span>
                    <span className={`font-mono font-bold text-[11px] ${swings.st_lambada.INC > 0 ? 'text-sky-600' : swings.st_lambada.BRS > 0 ? 'text-pink-600' : 'text-slate-500'}`}>
                      {swings.st_lambada.INC > 0 ? `+${swings.st_lambada.INC}% INC` : swings.st_lambada.BRS > 0 ? `+${swings.st_lambada.BRS}% BRS` : 'Neutral'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    value={swings.st_lambada.INC - swings.st_lambada.BRS}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (v >= 0) {
                        updateSwing('st_lambada', 'INC', v);
                        updateSwing('st_lambada', 'BRS', 0);
                      } else {
                        updateSwing('st_lambada', 'INC', 0);
                        updateSwing('st_lambada', 'BRS', Math.abs(v));
                      }
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Youth & Age Cohort */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Demographic Cohorts
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold">Youth 18-25 (~18% of TS)</span>
                  <span className={`font-mono font-bold text-[11px] ${swings.youth_18_25.INC > 0 ? 'text-sky-600' : swings.youth_18_25.BRS > 0 ? 'text-pink-600' : 'text-slate-500'}`}>
                    {swings.youth_18_25.INC > 0 ? `+${swings.youth_18_25.INC}% INC` : swings.youth_18_25.BRS > 0 ? `+${swings.youth_18_25.BRS}% BRS` : 'Neutral'}
                  </span>
                </div>
                <input
                  type="range"
                  min="-15"
                  max="15"
                  step="1"
                  value={swings.youth_18_25.INC - swings.youth_18_25.BRS}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (v >= 0) {
                      updateSwing('youth_18_25', 'INC', v);
                      updateSwing('youth_18_25', 'BRS', 0);
                    } else {
                      updateSwing('youth_18_25', 'INC', 0);
                      updateSwing('youth_18_25', 'BRS', Math.abs(v));
                    }
                  }}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action Callout */}
          <div className="pt-2">
            <button
              onClick={() => onNavigateToActions()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer group"
            >
              <Target className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform" />
              <span>Export Scenario to Actions Playbook</span>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-300" />
            </button>
          </div>
        </div>

        {/* Right Column: Inverse-Margin Bubble Chart (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
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
                {/* Grid guidelines */}
                <line x1="50" y1="190" x2="780" y2="190" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="415" y1="20" x2="415" y2="350" stroke="#e2e8f0" strokeWidth="1" />

                {/* Y-Axis Labels */}
                <text x="55" y="40" fill="#94a3b8" fontSize="10" fontWeight="600">
                  ▲ INC / Coalition Margin Lead
                </text>
                <text x="55" y="185" fill="#64748b" fontSize="10" fontWeight="bold">
                  0 Margin (Tipping Point Boundary)
                </text>
                <text x="55" y="340" fill="#94a3b8" fontSize="10" fontWeight="600">
                  ▼ BRS / BJP Margin Lead
                </text>

                {/* X-Axis Labels */}
                <text x="60" y="368" fill="#94a3b8" fontSize="10" fontWeight="500">
                  ← North Telangana (Adilabad, Nizamabad, Karimnagar)
                </text>
                <text x="620" y="368" fill="#94a3b8" fontSize="10" fontWeight="500">
                  South TS (Nalgonda, Khammam) →
                </text>

                {/* Render Bubbles */}
                {filteredList.map((ac) => {
                  // X positioned by AC number 1..119 across width 70..760
                  const cx = 70 + (ac.ac_no / 120) * 690;

                  // Y positioned by simulated margin: INC lead goes up, BRS/BJP lead goes down
                  const signedMargin = ac.simulated.winner_party === 'INC' ? ac.simulated.margin : -ac.simulated.margin;
                  // Map signed margin -25000 to +25000 into Y: 330 to 50
                  const clamped = Math.max(-28000, Math.min(28000, signedMargin));
                  const cy = 190 - (clamped / 28000) * 140;

                  // Inverse margin radius: tighter margin = bigger bubble!
                  // Margin 500 => r=26, Margin 3000 => r=18, Margin 20000 => r=7
                  const invRadius = Math.max(7, Math.min(28, 40000 / Math.pow(Math.max(500, ac.simulated.margin), 0.76)));

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
      </div>
    </div>
  );
};
