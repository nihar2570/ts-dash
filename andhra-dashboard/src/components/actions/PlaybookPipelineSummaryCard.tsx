import React from 'react';
import {
  Sparkles,
  CheckCircle,
  Sliders,
  ExternalLink,
  RotateCcw,
  Handshake,
  Target,
  Star,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import type { ActiveScenarioBridge } from '../../types';
import type { WhatIfTab } from '../AdvancedSimulationSuite';

export interface PlaybookCumulativeMetrics {
  baselineSeats: number;
  cumulativeSeatsWon: number;
  cumulativeFlipsCount: number;
  resourceTargetCount: number;
  totalResourceVotes: number;
  totalStarVotes: number;
  totalDefectionNetVotes: number;
  activeStarCampaignerDays: number;
  starConstituenciesCount: number;
  activeDefectionsCount: number;
  netCombinedVotes: number;
}

export interface PlaybookPipelineSummaryCardProps {
  isScenarioActive: boolean;
  scenarioBridge?: ActiveScenarioBridge | null;
  onNavigateToWhatIf?: (category: WhatIfTab) => void;
  onUnlinkScenario?: () => void;
  targetSeats2023: number;
  targetParty: string;
  coalition2024Seats: number;
  cumulativeMetrics: PlaybookCumulativeMetrics;
  isCoalition: boolean;
  postActionCoalitionSeats: number;
  coalitionDiff: number;
}

export const PlaybookPipelineSummaryCard: React.FC<PlaybookPipelineSummaryCardProps> = ({
  isScenarioActive,
  scenarioBridge,
  onNavigateToWhatIf,
  onUnlinkScenario,
  targetSeats2023,
  targetParty,
  coalition2024Seats,
  cumulativeMetrics,
  isCoalition,
  postActionCoalitionSeats,
  coalitionDiff,
}) => {
  return (
    <div className="space-y-4">
      {/* 3-Stage Mandate Pipeline (Simulation Bridge Active) */}
      {isScenarioActive && scenarioBridge && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-indigo-200 shadow-sm space-y-3.5 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    3-Stage Comprehensive Mandate Pipeline
                  </h3>
                  <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Simulation Active: {scenarioBridge.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Showing return-on-investment: 2023 Actual Mandate ➔ 2028 Simulation Scenario ➔ Field Playbook Compounded Lift
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigateToWhatIf?.('coalition')}
                className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Open Simulations tab to modify what-ifs"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Modify What-Ifs</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              {onUnlinkScenario && (
                <button
                  type="button"
                  onClick={onUnlinkScenario}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  title="Unlink simulation scenario and restore 2024 actual results baseline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to 2024</span>
                </button>
              )}
            </div>
          </div>

          {/* 3-Stage Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Stage 1: 2024 Actual Mandate */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Stage 1: 2024 Actual</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Historical Base</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-700 font-mono">{targetSeats2023}</span>
                <span className="text-xs text-slate-500 font-medium">seats won ({targetParty})</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Official Election Commission of India 2024 result
              </p>
              {isCoalition && (
                <div className="text-[11px] font-mono text-amber-700 font-bold mt-1.5 pt-1.5 border-t border-slate-200 flex items-center justify-between">
                  <span>NDA 2024 Mandate:</span>
                  <span className="font-black text-amber-900">{coalition2024Seats} seats</span>
                </div>
              )}
            </div>

            {/* Stage 2: Simulation Scenario Base */}
            <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                <span>Stage 2: Simulation Base</span>
                <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-100 px-1.5 py-0.2 rounded">
                  {scenarioBridge.name || scenarioBridge.id || 'Exported'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-indigo-950 font-mono">{cumulativeMetrics.baselineSeats}</span>
                <span className={`text-xs font-bold font-mono ${cumulativeMetrics.baselineSeats - targetSeats2023 >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {cumulativeMetrics.baselineSeats - targetSeats2023 >= 0 ? `+${cumulativeMetrics.baselineSeats - targetSeats2023}` : `${cumulativeMetrics.baselineSeats - targetSeats2023}`} vs 2024
                </span>
              </div>
              <p className="text-[11px] text-indigo-800 font-medium line-clamp-1" title={scenarioBridge.description}>
                {scenarioBridge.description}
              </p>
              {isCoalition && (
                <div className="text-[11px] font-mono text-indigo-900 font-bold mt-1.5 pt-1.5 border-t border-indigo-200 flex items-center justify-between">
                  <span>Simulated Base:</span>
                  <span>{cumulativeMetrics.baselineSeats} {targetParty}</span>
                </div>
              )}
            </div>

            {/* Stage 3: Compounded Post-Playbook Total */}
            <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>Stage 3: Compounded Final</span>
                <span className="text-[10px] font-mono text-emerald-800 font-black bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                  Playbook Total
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-950 font-mono">
                  {cumulativeMetrics.cumulativeSeatsWon}
                </span>
                <span className="text-xs text-emerald-700 font-black font-mono">
                  +{cumulativeMetrics.cumulativeFlipsCount} Flips Unlocked
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium">
                {cumulativeMetrics.netCombinedVotes >= 0 ? '+' : ''}{cumulativeMetrics.netCombinedVotes.toLocaleString()} net votes generated from Ground Operations
              </p>
              {isCoalition && (
                <div className="text-[11px] font-mono font-bold mt-1.5 pt-1.5 border-t border-emerald-200 flex items-center justify-between">
                  <span className="text-amber-950">NDA Projected Total:</span>
                  <span className="font-black text-amber-900">
                    {postActionCoalitionSeats} seats
                    {coalitionDiff !== 0 && (
                      <span className={`ml-1 text-[10px] px-1 py-0.2 rounded ${coalitionDiff < 0 ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'}`}>
                        {coalitionDiff < 0 ? `${coalitionDiff}` : `+${coalitionDiff}`}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* NDA Coalition Combined Majority Barometer Banner */}
          {isCoalition && (
            <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-black text-amber-900 flex items-center gap-1.5">
                  <Handshake className="w-4 h-4 text-amber-600" />
                  <span>NDA Alliance Combined Projection:</span>
                </span>
                <span className="text-sm font-black font-mono text-amber-950">
                  {postActionCoalitionSeats} Seats
                </span>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                  coalitionDiff < 0
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {coalitionDiff < 0 ? `${coalitionDiff} seats dropped` : 'Simulation baseline intact'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-mono text-xs">
                <span>Majority Mark: <strong>88 Seats</strong></span>
                <span>•</span>
                <span className={`font-bold ${postActionCoalitionSeats >= 88 ? 'text-emerald-800 font-black' : 'text-rose-800'}`}>
                  {postActionCoalitionSeats >= 88
                    ? `NDA holds +${postActionCoalitionSeats - 88} seat supermajority buffer`
                    : `Dropped below 88-seat majority (-${88 - postActionCoalitionSeats} seats)!`}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Cumulative Campaign Actions Engine Barometer */}
      <div id="act-barometer" className="scroll-mt-24 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-700/60 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-indigo-300">
                  Compounded Action Engine
                </span>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded font-mono font-bold">
                  Strategy for: {targetParty}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white">
                Live Cumulative Impact: Resource Allocator + Star Campaigners + Defections &amp; Rebels
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Target Total Won */}
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-right">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">{targetParty} Projected Won</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-white">{cumulativeMetrics.cumulativeSeatsWon}</span>
                <span className="text-xs text-slate-400 font-mono">/ 175 seats</span>
                <span className={`text-[11px] font-black px-1.5 py-0.2 rounded font-mono ${
                  cumulativeMetrics.cumulativeSeatsWon >= 88 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {cumulativeMetrics.cumulativeSeatsWon >= 88 ? 'MAJORITY' : `${88 - cumulativeMetrics.cumulativeSeatsWon} short`}
                </span>
              </div>
            </div>

            {/* NDA Coalition Combined Box */}
            {isCoalition && (
              <div className="bg-amber-950/70 border border-amber-500/50 px-3 py-1.5 rounded-xl text-right">
                <span className="text-[10px] text-amber-300 block font-bold uppercase tracking-wider">
                  NDA Alliance (Combined)
                </span>
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="text-lg font-black text-amber-200 font-mono">{postActionCoalitionSeats}</span>
                  <span className="text-xs text-amber-400 font-mono">/ 175</span>
                  <span className={`text-[11px] font-black px-1.5 py-0.2 rounded font-mono ${
                    postActionCoalitionSeats >= 88 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {postActionCoalitionSeats >= 88 ? 'MAJORITY' : 'UNDER 88'}
                  </span>
                  {coalitionDiff !== 0 && (
                    <span className={`text-[10px] font-mono font-bold px-1 rounded ${
                      coalitionDiff < 0 ? 'bg-rose-400/20 text-rose-300' : 'bg-emerald-400/20 text-emerald-300'
                    }`}>
                      {coalitionDiff < 0 ? `${coalitionDiff}` : `+${coalitionDiff}`}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4 Pillars Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Pillar 1: Resource Point Allocator */}
          <div className={`p-2.5 rounded-xl border transition-all ${
            cumulativeMetrics.resourceTargetCount > 0
              ? 'bg-indigo-950/40 border-indigo-500/40'
              : 'bg-slate-800/40 border-slate-700/50'
          }`}>
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3 text-indigo-400" /> Resource Allocator
              </span>
              <span className="font-mono text-indigo-300">{cumulativeMetrics.resourceTargetCount} ACs</span>
            </div>
            <div className="text-sm font-black text-indigo-200 font-mono">
              +{cumulativeMetrics.totalResourceVotes.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">votes</span>
            </div>
          </div>

          {/* Pillar 2: Star Campaigners */}
          <div className={`p-2.5 rounded-xl border transition-all ${
            cumulativeMetrics.activeStarCampaignerDays > 0
              ? 'bg-amber-950/40 border-amber-500/40'
              : 'bg-slate-800/40 border-slate-700/50'
          }`}>
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Star Campaigners
              </span>
              <span className="font-mono text-amber-300">{cumulativeMetrics.activeStarCampaignerDays} days</span>
            </div>
            <div className="text-sm font-black text-amber-200 font-mono">
              +{cumulativeMetrics.totalStarVotes.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">votes</span>
            </div>
          </div>

          {/* Pillar 3: Defections & Rebels */}
          <div className={`p-2.5 rounded-xl border transition-all ${
            cumulativeMetrics.activeDefectionsCount > 0
              ? 'bg-rose-950/40 border-rose-500/40'
              : 'bg-slate-800/40 border-slate-700/50'
          }`}>
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" /> Defections &amp; Rebels
              </span>
              <span className="font-mono text-rose-300">{cumulativeMetrics.activeDefectionsCount} events</span>
            </div>
            <div className="text-sm font-black text-rose-200 font-mono">
              {cumulativeMetrics.totalDefectionNetVotes >= 0 ? '+' : ''}
              {cumulativeMetrics.totalDefectionNetVotes.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">votes</span>
            </div>
          </div>

          {/* Consolidated Combined Lift */}
          <div className="p-2.5 rounded-xl border bg-emerald-950/40 border-emerald-500/40">
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
              <span className="flex items-center gap-1 text-emerald-300">
                <TrendingUp className="w-3 h-3 text-emerald-400" /> Net Flips Gained
              </span>
              <span className="font-mono text-emerald-300 font-black">+{cumulativeMetrics.cumulativeFlipsCount} Flips</span>
            </div>
            <div className="text-sm font-black text-emerald-200 font-mono">
              {cumulativeMetrics.netCombinedVotes >= 0 ? '+' : ''}
              {cumulativeMetrics.netCombinedVotes.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">net votes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
