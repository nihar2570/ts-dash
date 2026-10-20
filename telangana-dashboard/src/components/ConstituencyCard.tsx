import React from 'react';
import type { ConstituencyResult, Year, ConstituencyCandidatesData } from '../types';
import { getPartyColor } from '../types';
import {
  Trophy,
  Award,
  Compass,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Scale,
  FileText,
  Target,
} from 'lucide-react';
import { CONSTITUENCY_MANDALS } from '../data/mandalData';

interface ConstituencyCardProps {
  selectedAcNo: number | null;
  allYearsData: Record<Year, Record<string, ConstituencyResult>>;
  activeYear: Year;
  candidateData?: ConstituencyCandidatesData | null;
  onOpenDossier?: (acNo: number) => void;
  onOpenBoothData?: (acNo: number) => void;
}

export const ConstituencyCard: React.FC<ConstituencyCardProps> = ({
  selectedAcNo,
  allYearsData,
  activeYear,
  candidateData,
  onOpenDossier,
  onOpenBoothData,
}) => {
  if (!selectedAcNo) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center py-12">
        <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h3 className="font-semibold text-slate-700 text-base mb-1">Select a Constituency</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Click on any assembly constituency on the map or select from the table below to inspect multi-election trends.
        </p>
      </div>
    );
  }

  const currentResult = allYearsData[activeYear]?.[String(selectedAcNo)];
  const acName = currentResult?.ac_name || `Constituency #${selectedAcNo}`;
  const district = currentResult?.district || '';
  const pcName = currentResult?.pc_name || '';

  const years: Year[] = ['2023', '2018', '2014'];

  const winnerCand = candidateData?.candidates?.[0];
  const runnerCand = candidateData?.candidates?.[1];
  const candidatesAbove1k = candidateData?.candidates?.filter((c) => c.votes >= 1000) || [];

  const acMandals = selectedAcNo ? CONSTITUENCY_MANDALS[selectedAcNo] || [] : [];
  const totalBooths = acMandals.reduce((sum, m) => sum + (m.booths || 0), 0) || 240;
  const votesPerBoothToFlip = Math.ceil((currentResult?.margin || 0) / totalBooths);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
      {/* Header with Open AC Dossier button */}
      <div className="border-b border-slate-100 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-900 text-white font-mono px-2 py-0.5 rounded font-bold">
              AC #{selectedAcNo}
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
              {district} District
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {onOpenDossier && (
              <button
                type="button"
                onClick={() => onOpenDossier(selectedAcNo)}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-all shadow-2xs cursor-pointer"
                title="Open full interactive constituency dossier in a standalone tab"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Open AC Dossier ↗</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          {onOpenDossier ? (
            <button
              type="button"
              onClick={() => onOpenDossier(selectedAcNo)}
              className="text-left group flex items-center gap-2 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Click to view full candidate dossier in a standalone tab"
            >
              <h2 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                {acName}
              </h2>
              <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-all" />
            </button>
          ) : (
            <h2 className="text-xl font-black text-slate-900">{acName}</h2>
          )}
          {pcName && (
            <span className="text-[11px] text-slate-400">
              LS: <strong className="text-slate-600">{pcName}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Historical Election Timeline */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Election History (2014 – 2023)
        </div>

        {years.map((y) => {
          const res = allYearsData[y]?.[String(selectedAcNo)];
          if (!res) return null;

          const isActive = y === activeYear;
          const winnerColor = getPartyColor(res.winner.party);

          return (
            <div
              key={y}
              className={`p-3.5 rounded-lg border transition-all ${
                isActive
                  ? 'border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-500/10'
                  : 'border-slate-100 bg-slate-50/70 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {y}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: winnerColor }}
                    />
                    <span className="font-extrabold text-sm" style={{ color: winnerColor }}>
                      {res.winner.party} Won
                    </span>
                  </div>
                </div>

                {res.swing && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                      res.swing.status === 'GAIN'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {res.swing.status === 'GAIN'
                      ? `★ Gained from ${res.swing.gained_from}`
                      : 'Held'}
                  </span>
                )}
              </div>

              {/* Winner and Runner-up Details */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-white/80 p-2 rounded border border-slate-100">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mb-0.5">
                    <Trophy className="w-3 h-3 text-amber-500" /> Winner
                  </div>
                  <div className="font-bold text-slate-900 truncate" title={res.winner.candidate}>
                    {res.winner.candidate}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {res.winner.votes.toLocaleString()} votes ({res.winner.vote_share}%)
                  </div>
                </div>

                <div className="bg-white/80 p-2 rounded border border-slate-100">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mb-0.5">
                    <Award className="w-3 h-3 text-slate-400" /> Runner-up ({res.runner_up.party})
                  </div>
                  <div className="font-semibold text-slate-700 truncate" title={res.runner_up.candidate}>
                    {res.runner_up.candidate}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {res.runner_up.votes.toLocaleString()} votes ({res.runner_up.vote_share}%)
                  </div>
                </div>
              </div>

              {/* Victory Margin footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-1.5 border-t border-slate-200/50">
                <span>Victory Margin:</span>
                <span className="font-bold text-slate-800">
                  {res.margin.toLocaleString()} votes ({res.margin_pct}%)
                </span>
              </div>

              {/* Feature #5 Micro-Badge: Form-20 Booth Deficit / Buffer */}
              {isActive && y === '2023' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenBoothData && selectedAcNo) {
                      onOpenBoothData(selectedAcNo);
                    }
                  }}
                  className="mt-2 pt-2 border-t border-indigo-200/40 flex items-center justify-between text-[11px] bg-white/70 hover:bg-indigo-50/90 p-2 rounded-lg w-full text-left cursor-pointer transition-all border border-transparent hover:border-indigo-200 group/booth"
                  title="Click to jump to dedicated E-Panna & Polling Station Rolls tab"
                >
                  <span className="text-slate-600 group-hover/booth:text-indigo-700 flex items-center gap-1.5 font-medium">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    <span><strong>{totalBooths}</strong> Polling Stations</span>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-100/70 px-1.5 py-0.5 rounded group-hover/booth:bg-indigo-600 group-hover/booth:text-white transition-colors">
                      E-Panna &amp; Rolls ➔
                    </span>
                  </span>
                  <span className="font-mono text-slate-800 font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 text-[10px]">
                    ±{votesPerBoothToFlip} votes / booth gap
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 2023 Candidate Disclosures (MyNeta / ADR) preview */}
      {candidateData && (winnerCand?.myneta || runnerCand?.myneta) && (
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-indigo-600" />
              2023 Candidate Affidavits (MyNeta)
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              ADR Affidavit Records
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Winner MyNeta */}
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-slate-800 truncate text-[11px]" title={winnerCand?.name}>
                  {winnerCand?.name}
                </span>
                {winnerCand?.myneta?.criminal_cases !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold whitespace-nowrap flex items-center gap-1 ${
                      winnerCand.myneta.criminal_cases > 0
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {winnerCand.myneta.criminal_cases > 0 ? (
                      <>
                        <ShieldAlert className="w-2.5 h-2.5 text-rose-600" />
                        {winnerCand.myneta.criminal_cases} Cases
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                        0 Cases
                      </>
                    )}
                  </span>
                )}
              </div>

              <div className="space-y-0.5 pt-1 border-t border-slate-100 text-[11px]">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-slate-400">Net Worth:</span>
                  <span className="font-extrabold text-slate-900 font-mono">
                    {winnerCand?.myneta?.net_worth_formatted || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span className="text-slate-400">Assets / Liab:</span>
                  <span className="font-mono text-slate-700">
                    {winnerCand?.myneta?.total_assets_formatted || '—'} / {winnerCand?.myneta?.liabilities_formatted || '—'}
                  </span>
                </div>
                {winnerCand?.myneta?.education && (
                  <div className="text-[10px] text-slate-500 truncate" title={winnerCand.myneta.education}>
                    Edu: <span className="text-slate-700 font-medium">{winnerCand.myneta.education}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Runner-up MyNeta */}
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between gap-1">
                <span className="font-bold text-slate-800 truncate text-[11px]" title={runnerCand?.name}>
                  {runnerCand?.name}
                </span>
                {runnerCand?.myneta?.criminal_cases !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold whitespace-nowrap flex items-center gap-1 ${
                      runnerCand.myneta.criminal_cases > 0
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {runnerCand.myneta.criminal_cases > 0 ? (
                      <>
                        <ShieldAlert className="w-2.5 h-2.5 text-rose-600" />
                        {runnerCand.myneta.criminal_cases} Cases
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                        0 Cases
                      </>
                    )}
                  </span>
                )}
              </div>

              <div className="space-y-0.5 pt-1 border-t border-slate-100 text-[11px]">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-slate-400">Net Worth:</span>
                  <span className="font-extrabold text-slate-900 font-mono">
                    {runnerCand?.myneta?.net_worth_formatted || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span className="text-slate-400">Assets / Liab:</span>
                  <span className="font-mono text-slate-700">
                    {runnerCand?.myneta?.total_assets_formatted || '—'} / {runnerCand?.myneta?.liabilities_formatted || '—'}
                  </span>
                </div>
                {runnerCand?.myneta?.education && (
                  <div className="text-[10px] text-slate-500 truncate" title={runnerCand.myneta.education}>
                    Edu: <span className="text-slate-700 font-medium">{runnerCand.myneta.education}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Dossier Action Button */}
      {onOpenDossier && (
        <button
          type="button"
          onClick={() => onOpenDossier(selectedAcNo)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow transition-all cursor-pointer group"
        >
          <FileText className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform" />
          <span>
            Open Full AC Dossier &amp; Candidate Ballots
            {candidatesAbove1k.length > 0 ? ` (${candidatesAbove1k.length} candidates ≥ 1k votes)` : ''}
          </span>
          <ExternalLink className="w-3.5 h-3.5 ml-0.5 text-indigo-300" />
        </button>
      )}
    </div>
  );
};
