import React, { useState } from 'react';
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
  Vote,
  ChevronDown,
  ChevronUp,
  MapPin,
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
  // Compression toggle state for past elections (2019, 2014) to optimize vertical viewport
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({});
  const [expandAllPast, setExpandAllPast] = useState<boolean>(false);

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

  const years: Year[] = ['2024', '2019', '2014'];

  const winnerCand = candidateData?.candidates?.[0];
  const runnerCand = candidateData?.candidates?.[1];
  const candidatesAbove1k = candidateData?.candidates?.filter((c) => c.votes >= 1000) || [];

  const acMandals = selectedAcNo ? CONSTITUENCY_MANDALS[selectedAcNo] || [] : [];
  const totalBooths = acMandals.reduce((sum, m) => sum + (m.booths || 0), 0) || 240;
  const votesPerBoothToFlip = Math.ceil((currentResult?.margin || 0) / totalBooths);

  const toggleYear = (y: string) => {
    setExpandedYears((prev) => ({
      ...prev,
      [y]: prev[y] !== undefined ? !prev[y] : !expandAllPast,
    }));
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-4.5 shadow-sm border border-slate-200 space-y-3">
      {/* Executive Hero Header: Balanced Identity & Floating Action Trigger */}
      <div className="border-b border-slate-100 pb-2.5">
        <div className="flex items-start justify-between gap-3">
          {/* Left: AC Identity & Geo Metadata */}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              {onOpenDossier ? (
                <button
                  type="button"
                  onClick={() => onOpenDossier(selectedAcNo)}
                  className="group flex items-center gap-1.5 text-left cursor-pointer"
                  title="Click to view full candidate dossier in a standalone tab"
                >
                  <h2 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {acName}
                  </h2>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0" />
                </button>
              ) : (
                <h2 className="text-xl font-black text-slate-900 tracking-tight">{acName}</h2>
              )}
            </div>

            {/* Subtitle: Location, Parliamentary Constituency, and AC # */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium flex-wrap">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{district} District</span>
              {pcName && (
                <>
                  <span className="text-slate-300">&middot;</span>
                  <span>
                    LS: <strong className="text-slate-700 font-semibold">{pcName}</strong>
                  </span>
                </>
              )}
              <span className="text-slate-300">&middot;</span>
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 border border-slate-200/90 shrink-0">
                AC #{selectedAcNo}
              </span>
            </div>
          </div>

          {/* Right: Polished Dossier Action Button */}
          {onOpenDossier && (
            <button
              type="button"
              onClick={() => onOpenDossier(selectedAcNo)}
              className="flex items-center gap-2 py-1.5 px-3 bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:from-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow transition-all cursor-pointer group shrink-0 border border-indigo-400/30"
              title="Open full interactive constituency dossier in a standalone tab"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-200 group-hover:scale-110 transition-transform" />
              <span className="whitespace-nowrap">
                Open Dossier
                {candidatesAbove1k.length > 0 ? (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[10px] font-mono">
                    {candidatesAbove1k.length}
                  </span>
                ) : ''}
              </span>
              <ExternalLink className="w-3 h-3 text-indigo-200 ml-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* Historical Election Timeline */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Election History (2014 – 2024)
          </div>
          <button
            type="button"
            onClick={() => {
              const nextState = !expandAllPast;
              setExpandAllPast(nextState);
              setExpandedYears({
                '2024': nextState,
                '2019': nextState,
                '2014': nextState,
              });
            }}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer flex items-center gap-1 bg-indigo-50/70 hover:bg-indigo-100/70 px-2 py-0.5 rounded border border-indigo-200/60"
            title="Toggle between compressed overview and expanded historical election cards"
          >
            <span>{expandAllPast ? 'Compress Past' : 'Expand Past'}</span>
            {expandAllPast ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {years.map((y) => {
          const res = allYearsData[y]?.[String(selectedAcNo)];
          if (!res) return null;

          const isActive = y === activeYear;
          const isExpanded = isActive || (expandedYears[y] ?? expandAllPast);
          const winnerColor = getPartyColor(res.winner.party);

          // Compressed 1-line high-density card for past elections (2019, 2014)
          if (!isExpanded) {
            return (
              <div
                key={y}
                onClick={() => toggleYear(y)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-between gap-2 text-xs group shadow-2xs"
                title={`Click to expand full ${y} election details`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                    {y}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: winnerColor }}
                  />
                  <span className="font-extrabold text-xs shrink-0" style={{ color: winnerColor }}>
                    {res.winner.party} Won
                  </span>
                  <span className="text-slate-800 font-semibold truncate text-xs" title={res.winner.candidate}>
                    {res.winner.candidate}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-slate-700 font-mono">
                    +{res.margin.toLocaleString()} ({res.margin_pct}%)
                  </span>
                  {res.swing && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        res.swing.status === 'GAIN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {res.swing.status === 'GAIN' ? '★ Gain' : 'Held'}
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform" />
                </div>
              </div>
            );
          }

          // Full-featured card for active election or when user explicitly expands
          return (
            <div
              key={y}
              className={`p-3 rounded-lg border transition-all ${
                isActive
                  ? 'border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-500/10'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50'
              }`}
            >
              <div
                className={`flex items-center justify-between mb-2 ${!isActive ? 'cursor-pointer' : ''}`}
                onClick={!isActive ? () => toggleYear(y) : undefined}
                title={!isActive ? `Click to compress ${y} card` : undefined}
              >
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

                <div className="flex items-center gap-2">
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
                  {!isActive && (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 transition-colors" />
                  )}
                </div>
              </div>

              {/* Winner and Runner-up Details */}
              <div className="grid grid-cols-2 gap-1.5 text-xs pt-0.5">
                <div className="bg-white/80 p-1.5 rounded border border-slate-100">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium mb-0.5">
                    <Trophy className="w-2.5 h-2.5 text-amber-500" /> Winner
                  </div>
                  <div className="font-bold text-slate-900 truncate text-[11px]" title={res.winner.candidate}>
                    {res.winner.candidate}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {res.winner.votes.toLocaleString()} votes ({res.winner.vote_share}%)
                  </div>
                </div>

                <div className="bg-white/80 p-1.5 rounded border border-slate-100">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium mb-0.5">
                    <Award className="w-2.5 h-2.5 text-slate-400" /> Runner-up ({res.runner_up.party})
                  </div>
                  <div className="font-semibold text-slate-700 truncate text-[11px]" title={res.runner_up.candidate}>
                    {res.runner_up.candidate}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {res.runner_up.votes.toLocaleString()} votes ({res.runner_up.vote_share}%)
                  </div>
                </div>
              </div>

              {/* Victory Margin & Turnout combined line */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-200/50">
                <span>
                  Margin: <strong className="text-slate-800 font-bold font-mono">+{res.margin.toLocaleString()}</strong> ({res.margin_pct}%)
                </span>
                {res.turnout_pct > 0 && (
                  <span className="flex items-center gap-1 font-medium text-slate-600 font-mono text-[11px]">
                    <Vote className="w-3 h-3 text-indigo-600" />
                    Turnout: <strong className="text-slate-800">{res.turnout_pct}%</strong>
                    {res.total_electors ? (
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({Math.round(res.total_electors / 1000)}k)
                      </span>
                    ) : null}
                  </span>
                )}
              </div>

              {/* Feature #5 Micro-Badge: Form-20 Booth Deficit / Buffer */}
              {isActive && (y === '2024' || y === '2023') && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenBoothData && selectedAcNo) {
                      onOpenBoothData(selectedAcNo);
                    }
                  }}
                  className="mt-1.5 pt-1.5 border-t border-indigo-200/40 flex items-center justify-between text-[11px] bg-white/70 hover:bg-indigo-50/90 p-1.5 rounded-lg w-full text-left cursor-pointer transition-all border border-transparent hover:border-indigo-200 group/booth"
                  title="Click to jump to dedicated E-Panna & Polling Station Rolls tab"
                >
                  <span className="text-slate-600 group-hover/booth:text-indigo-700 flex items-center gap-1.5 font-medium">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    <span><strong>{totalBooths}</strong> Polling Stations</span>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-100/70 px-1.5 py-0.2 rounded group-hover/booth:bg-indigo-600 group-hover/booth:text-white transition-colors">
                      E-Panna &amp; Rolls ➔
                    </span>
                  </span>
                  <span className="font-mono text-slate-800 font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-200 text-[10px]">
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

              <div 
                className="pt-1.5 border-t border-slate-100 text-[11px] flex items-center justify-between text-slate-600"
                title={`Assets: ${winnerCand?.myneta?.total_assets_formatted || '—'} • Liabilities: ${winnerCand?.myneta?.liabilities_formatted || '—'}`}
              >
                <span>
                  Assets: <strong className="text-emerald-600 font-mono font-extrabold">{winnerCand?.myneta?.total_assets_formatted || '—'}</strong>
                </span>
                <span className="text-slate-300">/</span>
                <span>
                  <strong className="text-rose-600 font-mono font-extrabold">{winnerCand?.myneta?.liabilities_formatted || '—'}</strong>
                </span>
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

              <div 
                className="pt-1.5 border-t border-slate-100 text-[11px] flex items-center justify-between text-slate-600"
                title={`Assets: ${runnerCand?.myneta?.total_assets_formatted || '—'} • Liabilities: ${runnerCand?.myneta?.liabilities_formatted || '—'}`}
              >
                <span>
                  Assets: <strong className="text-emerald-600 font-mono font-extrabold">{runnerCand?.myneta?.total_assets_formatted || '—'}</strong>
                </span>
                <span className="text-slate-300">/</span>
                <span>
                  <strong className="text-rose-600 font-mono font-extrabold">{runnerCand?.myneta?.liabilities_formatted || '—'}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
