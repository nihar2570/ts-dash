import React from 'react';
import type { DemographicsDataset } from '../types';
import { getPartyColor } from '../types';
import {
  X,
  Printer,
  Sparkles,
  Target,
  CheckCircle,
  FileText,
  Users,
} from 'lucide-react';

interface ExecutiveBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DemographicsDataset;
  targetParty: 'TDP' | 'YSRCP' | 'JSP' | 'BJP' | 'INC';
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

  // Calculate current Assembly standing from 2024 baseline
  const acList = Object.values(data.constituencies);
  const seatsByParty: Record<string, number> = { TDP: 0, YSRCP: 0, JSP: 0, BJP: 0, INC: 0, OTH: 0 };
  acList.forEach((ac) => {
    const p = ac.winner_2023.party;
    seatsByParty[p] = (seatsByParty[p] || 0) + 1;
  });

  // Target party stats
  const targetCurrentSeats = seatsByParty[targetParty] || 0;
  const targetNeeded = Math.max(0, 88 - targetCurrentSeats);

  // Top 10 lowest deficit pickup battleground seats for the target party
  const topBattlegrounds = acList
    .filter((ac) => ac.winner_2023.party !== targetParty)
    .map((ac) => {
      const isRunner = ac.runner_up_2023.party === targetParty;
      const deficit = isRunner ? ac.margin_2023 : ac.margin_2023 + Math.round(ac.total_votes_2023 * 0.15);

      // Find top decisive caste
      let maxComm = 'kapu';
      let maxPct = 0;
      Object.entries(ac.caste_profile).forEach(([k, v]) => {
        if (v > maxPct) {
          maxPct = v;
          maxComm = k;
        }
      });

      const commLabels: Record<string, string> = {
        kapu: 'Kapu / Balija / Telaga',
        kamma: 'Kamma',
        reddy: 'Reddy',
        bc_turpu_kapu: 'BC Turpu Kapu',
        bc_yadava: 'BC Yadava',
        bc_kuruba_boya: 'BC Kuruba / Boya',
        bc_settibalija_goud: 'BC Settibalija / Goud',
        bc_padmashali: 'BC Padmashali',
        bc_other: 'BC Other',
        sc_madiga_relli: 'SC Madiga / Relli',
        sc_mala: 'SC Mala',
        st_tribal: 'ST Tribals',
        minority_muslim: 'Muslim Minorities',
        minority_christian: 'Christian Minorities',
      };

      return {
        ac_no: ac.ac_no,
        ac_name: ac.ac_name,
        district: ac.district,
        reservation: ac.reservation,
        winner: ac.winner_2023.party,
        margin: ac.margin_2023,
        deficit,
        topCaste: commLabels[maxComm] || maxComm,
        topCastePct: maxPct,
      };
    })
    .sort((a, b) => a.deficit - b.deficit)
    .slice(0, 10);

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Top Floating Control Bar */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <div className="text-xs font-black tracking-wider uppercase text-indigo-300">
                1-Click C-Suite Strategic Assessment &middot; Target 88 Majority Roadmap
              </div>
              <div className="text-[11px] text-slate-400">
                Formatted for print &amp; PDF export
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Executive Briefing Document */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-900 print:p-0">
          
          {/* Header Memo Banner */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                ANDHRA PRADESH STRATEGIC ELECTION INTELLIGENCE UNIT &middot; 175 AC WAR ROOM
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 mt-1">
                Executive Strategy Briefing: {targetParty} Majority Plan
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Path to 88 Assembly Seats &middot; Field Mobilization &middot; Demographic Levers
              </p>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              <div>Date: <strong className="text-slate-900">{todayStr}</strong></div>
              <div>Classification: <strong className="text-rose-700">RESTRICTED // WAR ROOM</strong></div>
            </div>
          </div>

          {/* Section 1: State of the Race & Path to 88 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="text-xs text-slate-500 font-semibold mb-1">Target Party Standing</div>
              <div className="text-3xl font-black text-slate-950 flex items-baseline gap-2">
                <span style={{ color: getPartyColor(targetParty) }}>{targetCurrentSeats}</span>
                <span className="text-xs text-slate-500 font-normal">/ 175 Seats</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">2024 ECI Actual Baseline</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="text-xs text-slate-500 font-semibold mb-1">Target 88 Majority Deficit</div>
              <div className="text-3xl font-black text-slate-950">
                {targetNeeded === 0 ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-6 h-6" /> 88+ Won
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
                {topBattlegrounds.length > 0 ? Math.round(topBattlegrounds.reduce((s, b) => s + b.deficit, 0) / topBattlegrounds.length).toLocaleString() : '0'}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Votes per AC to flip</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="text-xs text-slate-500 font-semibold mb-1">Primary Demographic Driver</div>
              <div className="text-xl font-black text-indigo-700">Kapu + BC Turpu/Yadava</div>
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
              To maintain or secure a governing majority of 88 seats in the 175-member Andhra Pradesh Legislative Assembly, <strong className="text-slate-900">{targetParty}</strong> must execute a disciplined regional strategy: (1) Protect fortresses across Kosta Andhra, Uttarandhra, and Rayalaseema, and (2) proactively target and flip the lowest-deficit battleground seats outlined below.
            </p>
            <p>
              Caste demography is highly consolidated: Kapu/Balija communities represent <strong>22%</strong> of the electorate, while BC communities (Turpu Kapu, Yadava, Kuruba/Boya, Settibalija) constitute over <strong>38%</strong>. Preserving coalition harmony between TDP and Janasena grassroots is paramount to sustaining double-digit vote share advantages across the Godavari and Krishna delta basins.
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
                    <th className="py-2.5 px-3">2024 Incumbent</th>
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
                <Users className="w-4 h-4 text-rose-600" />
                <span>Kapu &amp; Balija Coalition Anchor</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Represents 22% of voters across East Godavari, West Godavari, Krishna, and Visakhapatnam. Pawan Kalyan&apos;s Janasena alignment ensures high strike rates; minimizing local seat disputes is paramount.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>BC Turpu Kapu &amp; Yadava/Kuruba</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Dominant across Uttarandhra (Srikakulam, Vizianagaram) and Rayalaseema agrarian belts. Focus messaging on irrigation projects, agricultural subsidies, and local leadership empowerment.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>SC Dalit &amp; Minority Consolidation</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Crucial in 29 SC/ST reserved constituencies and Rayalaseema/Palnadu minority pockets. Super Six delivery promises and social justice guarantees counter traditional opposition hold.
              </p>
            </div>
          </div>

          {/* Signoff Footer */}
          <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <div>
              Andhra Pradesh Election Intelligence System &middot; Generated for Campaign Command
            </div>
            <div className="font-mono text-[11px]">
              Document ID: AP-WAR-ROOM-2024-REV88
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
