import React from 'react';
import {
  X,
  Users,
  Building2,
  FileText,
  Target,
  ShieldAlert,
  Vote,
  Heart,
} from 'lucide-react';
import type { BoothDetail } from '../BoothPannaDeficitSolver';
import { FORM_20_URLS } from '../../data/form20Urls';
import { getOfficialSir2026PdfUrl } from '../../data/voterRollService';

export type MapLayerMode = 'political' | 'panna' | 'gender';

export interface CampusFacility {
  id: string;
  name: string;
  cleanBuildingName: string;
  location: string;
  mandalName: string;
  lat: number;
  lng: number;
  booths: BoothDetail[];
  totalElectors: number;
  totalVotes: number;
  turnoutPct: number;
  pannaPages: number;
  femaleElectors: number;
  isSplitCampus: boolean;
  campusTriage: 'fortress' | 'battleground' | 'hostile';
  highestSviLevel?: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'NORMAL';
  highestSviScore: number;
}

export const getTriageColor = (triage: string): string => {
  switch (triage) {
    case 'battleground':
    case 'vulnerable':
    case 'lean':
    case 'tight':
    case 'swing':
    case 'toss_up':
      return '#f59e0b'; // Amber / Orange
    case 'fortress':
    case 'secure':
    case 'stronghold':
      return '#10b981'; // Emerald Green
    case 'hostile':
    case 'opponent':
    case 'deficit':
      return '#f43f5e'; // Rose / Red
    default:
      return '#f59e0b';
  }
};

export const getMarkerColor = (b: BoothDetail, mode: MapLayerMode): string => {
  if (mode === 'panna') {
    return b.pannaPages > 35 ? '#a855f7' : b.pannaPages >= 25 ? '#0ea5e9' : '#10b981';
  }
  if (mode === 'gender') {
    const fElectors = b.femaleElectors ?? Math.round(b.electorate * 0.51);
    const fRatio = b.electorate > 0 ? (fElectors / b.electorate) * 100 : 50;
    return fRatio >= 52.5 ? '#ec4899' : fRatio <= 47.5 ? '#3b82f6' : '#64748b';
  }
  return getTriageColor(b.triage);
};

export interface CampusPollingStationsDrawerProps {
  activeBooth: BoothDetail | null;
  activeCampus: CampusFacility | null;
  mapLayerMode: MapLayerMode;
  acNo: number;
  isLight: boolean;
  onClose: () => void;
  onSelectBooth?: (b: BoothDetail) => void;
  onOpenStandaloneBooth?: (b: BoothDetail) => void;
  onViewVoterRoll?: (b: BoothDetail) => void;
}

export const CampusPollingStationsDrawer: React.FC<CampusPollingStationsDrawerProps> = ({
  activeBooth,
  activeCampus,
  mapLayerMode,
  acNo,
  isLight,
  onClose,
  onSelectBooth,
  onOpenStandaloneBooth,
  onViewVoterRoll,
}) => {
  if (!activeBooth) return null;

  return (
    <div
      className={`absolute top-12 right-3 left-3 sm:left-auto sm:w-96 z-30 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150 transition-colors ${
        isLight
          ? 'bg-white/95 border-indigo-300 text-slate-900 shadow-indigo-100'
          : 'bg-slate-900/95 border-indigo-500/50 text-white'
      }`}
    >
      <div
        className={`flex items-start justify-between gap-2 border-b pb-2 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                isLight
                  ? 'bg-slate-100 text-amber-700 border-slate-300'
                  : 'bg-slate-800 text-amber-300 border-slate-700'
              }`}
            >
              PS #{activeBooth.boothNo}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                activeBooth.triage === 'battleground' || (activeBooth.triage as string) === 'vulnerable'
                  ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                  : activeBooth.triage === 'fortress'
                  ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-600 border-rose-500/40'
              }`}
            >
              {activeBooth.triage === 'battleground' || (activeBooth.triage as string) === 'vulnerable'
                ? '🔥 Battleground (Swing / Close)'
                : activeBooth.triage === 'fortress'
                ? '🛡️ Stronghold (Safe Hold)'
                : '🛑 Opponent Turf'}
            </span>
          </div>
          <h4
            className={`text-xs sm:text-sm font-bold mt-1 leading-snug ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            {activeBooth.name}
          </h4>
          <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            📍 {activeBooth.location} &middot;{' '}
            <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {activeBooth.mandalName} Mandal
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
          }`}
          aria-label="Close inspector drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Multi-Station Campus Room Switcher */}
      {activeCampus && activeCampus.booths.length > 1 && (
        <div
          className={`p-2.5 rounded-lg border text-xs ${
            isLight ? 'bg-indigo-50/70 border-indigo-200' : 'bg-slate-800/80 border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold flex items-center gap-1.5 text-[11px] text-indigo-400">
              <Building2 className="w-3.5 h-3.5" />
              <span>Campus Stations ({activeCampus.booths.length} Rooms):</span>
            </span>
            {activeCampus.isSplitCampus ? (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ⚡ Split Results
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Solid {activeCampus.booths[0]?.winnerParty || 'Lead'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {activeCampus.booths.map((sb) => {
              const isRoomActive = activeBooth?.boothNo === sb.boothNo;
              const sbColor = getMarkerColor(sb, mapLayerMode);
              return (
                <button
                  key={sb.boothNo}
                  type="button"
                  onClick={() => {
                    if (onSelectBooth) onSelectBooth(sb);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isRoomActive
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                      : isLight
                      ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                      : 'bg-slate-900 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title={`Inspect Station PS #${sb.boothNo} (${sb.winnerParty ? `${sb.winnerParty} +${sb.margin}` : sb.triage})`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sbColor }} />
                  <span>PS #{sb.boothNo}</span>
                  {sb.winnerParty && <span className="text-[9px] opacity-75 uppercase">({sb.winnerParty})</span>}
                </button>
              );
            })}
          </div>
          <div
            className={`mt-2 pt-1.5 border-t flex items-center justify-between text-[10px] ${
              isLight ? 'border-indigo-100 text-slate-500' : 'border-slate-700 text-slate-400'
            }`}
          >
            <span>Campus Total:</span>
            <span className="font-mono font-bold text-indigo-400">
              {activeCampus.totalElectors.toLocaleString()} electors &middot; {activeCampus.turnoutPct}% turnout
            </span>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div
        className={`grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg border ${
          isLight
            ? 'bg-slate-50 border-slate-200 text-slate-800'
            : 'bg-slate-950/80 border-slate-800 text-slate-200'
        }`}
      >
        <div>
          <span
            className={`text-[10px] block uppercase ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Registered Electors
          </span>
          <span
            className={`font-mono font-bold flex items-center gap-1 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            <Users className="w-3 h-3 text-indigo-500" />
            {activeBooth.electorate} (~{activeBooth.pannaPages} pages)
          </span>
        </div>
        <div>
          <span
            className={`text-[10px] block uppercase ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Panna Pramukhs
          </span>
          <span
            className={`font-mono font-bold ${
              isLight ? 'text-indigo-600' : 'text-indigo-300'
            }`}
          >
            {activeBooth.pannaPages} Assigned (30/p)
          </span>
        </div>
      </div>

      {/* 2024 Form-20 Candidate Vote Breakdown */}
      {activeBooth.candidates && (
        <div
          className={`p-2.5 rounded-lg border text-[11px] space-y-1.5 ${
            isLight ? 'bg-indigo-50/60 border-indigo-200' : 'bg-indigo-950/30 border-indigo-800/40'
          }`}
        >
          <div className="flex items-center justify-between font-bold text-xs">
            <span className="flex items-center gap-1.5">
              <Vote className="w-3.5 h-3.5 text-indigo-500" />
              <span>2024 Form-20 Result</span>
            </span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                activeBooth.form20Source?.includes('OFFICIAL')
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {activeBooth.form20Source?.includes('OFFICIAL') ? 'Verified Form-20 OCR' : 'Mandal Model'}
            </span>
          </div>
          <div className="space-y-1 pt-0.5">
            {Object.entries(activeBooth.candidates).map(([cand, votes]) => (
              <div key={cand} className="flex items-center justify-between text-[11px]">
                <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{cand}</span>
                <span className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {votes.toLocaleString()}
                </span>
              </div>
            ))}
            <div
              className={`pt-1 border-t flex items-center justify-between font-bold text-[10px] ${
                isLight ? 'border-indigo-200' : 'border-indigo-800/50'
              }`}
            >
              <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                Winner Lead:{' '}
                <strong className="text-indigo-400">{activeBooth.winnerParty}</strong> (+{activeBooth.margin?.toLocaleString()} votes)
              </span>
              <span className="text-slate-400 font-mono">Turnout: {activeBooth.turnoutPct}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Mahila / Gender Mobilization Card */}
      <div
        className={`p-2.5 rounded-lg border text-[11px] space-y-1.5 ${
          isLight ? 'bg-pink-50/50 border-pink-200' : 'bg-pink-950/20 border-pink-900/40'
        }`}
      >
        <div className="flex items-center justify-between font-bold text-xs">
          <span className="flex items-center gap-1.5 text-pink-500">
            <Heart className="w-3.5 h-3.5" />
            <span>Mahila / Gender Distribution (SIR 2026)</span>
          </span>
          <span className="font-mono text-[10px] text-pink-400 font-bold">
            {(((activeBooth.femaleElectors || Math.round(activeBooth.electorate * 0.51)) / activeBooth.electorate) * 100).toFixed(1)}% Women
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="flex items-center justify-between">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Female Electors:</span>
            <span className="font-mono font-bold text-pink-400">
              {(activeBooth.femaleElectors || Math.round(activeBooth.electorate * 0.51)).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Male Electors:</span>
            <span className="font-mono font-bold text-blue-400">
              {(activeBooth.maleElectors || (activeBooth.electorate - (activeBooth.femaleElectors || Math.round(activeBooth.electorate * 0.51)))).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* SVI Threat Assessment Card */}
      {activeBooth.svi && (
        <div
          className={`text-[11px] p-2.5 rounded-lg border space-y-1.5 ${
            activeBooth.svi.level === 'CRITICAL'
              ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
              : activeBooth.svi.level === 'HIGH'
              ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
              : isLight
              ? 'bg-slate-50 border-slate-200 text-slate-700'
              : 'bg-slate-950/50 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5 text-xs">
              <ShieldAlert
                className={`w-3.5 h-3.5 ${
                  activeBooth.svi.level === 'CRITICAL'
                    ? 'text-rose-400'
                    : activeBooth.svi.level === 'HIGH'
                    ? 'text-amber-400'
                    : 'text-slate-400'
                }`}
              />
              <span>SVI Vulnerability Index: {activeBooth.svi.level}</span>
            </span>
            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-black/30">
              Score: {activeBooth.svi.score}/100
            </span>
          </div>
          <div className="text-[10px] space-y-0.5 opacity-90">
            {activeBooth.svi.reasons.map((r, rIdx) => (
              <div key={rIdx} className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-current" />
                <span>{r}</span>
              </div>
            ))}
          </div>
          <div className="pt-1 border-t border-current/20 flex items-center justify-between text-[10px] font-mono">
            <span>EC Protocol:</span>
            <strong className="underline">
              {activeBooth.svi.recommendedCapf
                ? '🚨 Deploy CAPF & 100% Webcasting'
                : 'Standard Micro-Observer'}
            </strong>
          </div>
        </div>
      )}

      {/* Panna Pramukh Directive */}
      <div
        className={`text-[11px] p-2 rounded-lg border flex items-start gap-1.5 ${
          isLight
            ? 'bg-amber-50/80 border-amber-200 text-slate-800'
            : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
        }`}
      >
        <Target className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        <span>
          <strong>Ground Directive:</strong> {activeBooth.actionNote}
        </span>
      </div>

      {/* View in Dedicated Standalone E-Panna & Rolls Tab */}
      <button
        type="button"
        onClick={() => {
          if (onOpenStandaloneBooth) {
            onOpenStandaloneBooth(activeBooth);
          } else {
            const url = new URL(window.location.origin + window.location.pathname);
            url.searchParams.set('tab', 'booth-data');
            url.searchParams.set('ac', String(acNo));
            url.searchParams.set('booth', String(activeBooth.boothNo));
            window.open(url.toString(), '_blank');
          }
        }}
        className="w-full py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white group"
        title="Open full E-Panna, voter register, and household caste intelligence in dedicated standalone tab"
      >
        <FileText className="w-3.5 h-3.5 text-indigo-200 group-hover:scale-110 transition-transform" />
        <span>Open in E-Panna &amp; Rolls Standalone Tab ({activeBooth.electorate} Electors) ↗</span>
      </button>

      {FORM_20_URLS[acNo] && (
        <a
          href={FORM_20_URLS[acNo]}
          target="_blank"
          rel="noreferrer"
          className={`w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all border flex items-center justify-center gap-1.5 cursor-pointer mt-1 ${
            isLight
              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-700'
          }`}
          title={`Open Official CEO Andhra Pradesh 2024 Form-20 PDF for AC #${acNo} (Station #${activeBooth.boothNo})`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-600" />
          <span>Official 2024 Form-20 PDF (Station #{activeBooth.boothNo}) ↗</span>
        </a>
      )}

      <a
        href={getOfficialSir2026PdfUrl(acNo, activeBooth.boothNo)}
        target="_blank"
        rel="noreferrer"
        className={`w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all border flex items-center justify-center gap-1.5 cursor-pointer mt-1 ${
          isLight
            ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
            : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-700'
        }`}
        title={`Open Official ECI SIR 2026 Draft Roll PDF for AC #${acNo} (Station #${activeBooth.boothNo})`}
      >
        <FileText className="w-3.5 h-3.5 text-rose-600" />
        <span>Official SIR 2026 PDF (Station #{activeBooth.boothNo}) ↗</span>
      </a>

      {/* Optional Quick Overlay Modal */}
      {onViewVoterRoll && (
        <button
          type="button"
          onClick={() => onViewVoterRoll(activeBooth)}
          className={`w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all border flex items-center justify-center gap-1.5 cursor-pointer mt-1 ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
          }`}
          title="Quick preview modal"
        >
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>Quick Preview Modal</span>
        </button>
      )}
    </div>
  );
};
