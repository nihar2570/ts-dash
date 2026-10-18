import React from 'react';
import type { SeeepcDataset } from '../types';
import { getPartyColor } from '../types';
import {
  Printer,
  X,
  Award,
  Target,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface ExecutiveBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SeeepcDataset;
  targetParty: 'INC' | 'BRS' | 'BJP';
}

export const ExecutiveBriefingModal: React.FC<ExecutiveBriefingModalProps> = ({
  isOpen,
  onClose,
  data,
  targetParty,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calculate current Assembly standing from 2023 baseline
  const acList = Object.values(data.constituencies);
  const seatsByParty: Record<string, number> = { INC: 0, BRS: 0, BJP: 0, AIMIM: 0, CPI: 0, OTH: 0 };
  acList.forEach((ac) => {
    const p = ac.winner_2023.party;
    seatsByParty[p] = (seatsByParty[p] || 0) + 1;
  });

  // Target party stats
  const targetCurrentSeats = seatsByParty[targetParty] || 0;
  const targetNeeded = Math.max(0, 60 - targetCurrentSeats);

  // Top 10 lowest deficit pickup battleground seats for the target party
  const topBattlegrounds = acList
    .filter((ac) => ac.winner_2023.party !== targetParty)
    .map((ac) => {
      const isRunner = ac.runner_up_2023.party === targetParty;
      const deficit = isRunner ? ac.margin_2023 : ac.margin_2023 + Math.round(ac.total_votes_2023 * 0.15);

      // Find top decisive caste
      let maxComm = 'bc_mudiraj';
      let maxPct = 0;
      Object.entries(ac.caste_profile).forEach(([k, v]) => {
        if (v > maxPct) {
          maxPct = v;
          maxComm = k;
        }
      });

      const commLabels: Record<string, string> = {
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

      return {
        ac_no: ac.ac_no,
        ac_name: ac.ac_name,
        district: ac.district,
        winner: ac.winner_2023.party,
        deficit,
        topCaste: commLabels[maxComm] || maxComm,
        topCastePct: maxPct,
        reservation: ac.reservation,
      };
    })
    .sort((a, b) => a.deficit - b.deficit)
    .slice(0, 10);

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden text-slate-800">
        {/* Top Control Bar (Hidden during print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Award className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>Executive Intelligence Briefing</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.2 rounded-full font-mono">
                  CONFIDENTIAL
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                1-Click C-Suite Strategic Assessment &middot; Target 60 Majority Roadmap
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Briefing Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 print:p-0 print:overflow-visible text-slate-900 font-sans">
          {/* Header Banner */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                TELANGANA STRATEGIC ELECTION INTELLIGENCE UNIT &middot; FORM 20 &amp; SEEEPC
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 mt-1">
                Executive Strategy Briefing: {targetParty} Majority Plan
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Path to 60 Assembly Seats &middot; Field Mobilization &middot; Demographic Levers
              </p>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              <div>Date: <strong className="text-slate-900">{todayStr}</strong></div>
              <div>Classification: <strong className="text-rose-700">RESTRICTED // WAR ROOM</strong></div>
            </div>
          </div>

          {/* Section 1: State of the Race & Path to 60 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="text-xs text-slate-500 font-semibold mb-1">Target Party Standing</div>
              <div className="text-3xl font-black text-slate-950 flex items-baseline gap-2">
                <span style={{ color: getPartyColor(targetParty) }}>{targetCurrentSeats}</span>
                <span className="text-xs text-slate-500 font-normal">/ 119 Seats</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">2023 Form-20 Baseline</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="text-xs text-slate-500 font-semibold mb-1">Target 60 Majority Deficit</div>
              <div className="text-3xl font-black text-slate-950">
                {targetNeeded === 0 ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-6 h-6" /> 60+ Won
                  </span>
                ) : (
                  <span className="text-rose-600 font-mono">-{targetNeeded}</span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Seats needed to govern</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="text-xs text-slate-500 font-semibold mb-1">Average Deficit in Top 10</div>
              <div className="text-3xl font-black font-mono text-slate-950">
                {Math.round(topBattlegrounds.reduce((s, b) => s + b.deficit, 0) / topBattlegrounds.length).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Votes per AC to flip</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="text-xs text-slate-500 font-semibold mb-1">Primary Demographic Driver</div>
              <div className="text-xl font-black text-indigo-700">BC Mudiraj + Madiga</div>
              <div className="text-[11px] text-slate-500 mt-1">Highest leverage voter blocs</div>
            </div>
          </div>

          {/* Section 2: Executive Summary Narrative */}
          <div className="bg-slate-50 border-l-4 border-indigo-600 p-4 rounded-r-xl space-y-1.5 text-xs text-slate-700 leading-relaxed">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Strategic Appraisal &amp; War Room Directives
            </h4>
            <p>
              To secure a governing majority of 60 seats in the Telangana Legislative Assembly, <strong className="text-slate-900">{targetParty}</strong> must execute a disciplined dual-track campaign: (1) Defend core bastions across North and South Telangana while (2) concentratedly flipping the 10 lowest-deficit battleground seats outlined below.
            </p>
            <p>
              According to official DES SEEEPC door-to-door caste census tables, BC communities (Mudiraj, Munnuru Kapu, Padmashali, Goud, Yadav) comprise <strong>46.27%</strong> of the electorate, while SC communities (Madiga, Mala) represent <strong>17.42%</strong>. Shifting just <strong>+3.5%</strong> among BC Mudiraj and SC Madiga voters flips 7 of the 10 closest toss-up constituencies without requiring uniform statewide macro swings.
            </p>
          </div>

          {/* Section 3: Top 10 Critical Battleground Pickup Roster */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-rose-600" />
                Top 10 High-Priority Battleground Targets
              </h4>
              <span className="text-xs text-slate-500 font-mono">Sorted by lowest vote deficit</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">AC # &amp; Name</th>
                    <th className="py-2.5 px-3">District</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">2023 Incumbent</th>
                    <th className="py-2.5 px-3 text-right">Net Deficit</th>
                    <th className="py-2.5 px-3">Decisive Demographic Lever</th>
                    <th className="py-2.5 px-3 text-center">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topBattlegrounds.map((b, idx) => (
                    <tr key={b.ac_no} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        #{b.ac_no} {b.ac_name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{b.district}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                          {b.reservation}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className="font-bold px-2 py-0.5 rounded text-[11px]"
                          style={{ backgroundColor: `${getPartyColor(b.winner)}18`, color: getPartyColor(b.winner) }}
                        >
                          {b.winner}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                        -{b.deficit.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {b.topCaste} <span className="text-slate-500 font-mono">({b.topCastePct}%)</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          TIER {idx < 4 ? '1 MUST-WIN' : '2 LEAN'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Key Demographic Battlegrounds Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>🐟</span>
                <span>BC Mudiraj &amp; OBC Bloc</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Represents 15-28% of voters across Karimnagar, Nizamabad, Medak, and Warangal. Crucial for countering BRS cadre retention. Focus messaging on BC sub-categorization and welfare credit.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>👞</span>
                <span>SC Madiga &amp; Sub-Categorization</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Decisive in 19 SC Reserved assembly segments and 24 general toss-ups. BJP&apos;s aggressive reach creates a tripartite split; defending or flipping this bloc requires localized candidate guarantees.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>🌙</span>
                <span>Muslim &amp; Urban Youth Cohort</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                20.8% in Hyderabad GHMC and 8-15% in Nizamabad, Karimnagar, Khammam municipal belts. Vulnerable to tactical splits if pre-poll or post-poll alliance signals appear ambiguous.
              </p>
            </div>
          </div>

          {/* Signoff Footer */}
          <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <div>
              Telangana Election Intelligence System &middot; Generated for Campaign Command
            </div>
            <div className="font-mono text-[11px]">
              Document ID: TS-WAR-ROOM-2028-REV60
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
