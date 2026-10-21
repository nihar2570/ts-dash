import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle,
  ExternalLink,
  Handshake,
} from 'lucide-react';
import type { ActiveScenarioBridge } from '../types';

interface ScenarioBridgeRibbonProps {
  bridge: ActiveScenarioBridge;
  activeTab: string;
  onExportToActions: () => void;
  onNavigateToWhatIf: (category: 'caste_blocs' | 'coalition' | 'turnout' | 'anti_incumbency' | 'target_60') => void;
  onUnlinkScenario: () => void;
  actionsSeats?: {
    INC: number;
    BRS: number;
    BJP: number;
    AIMIM: number;
    coalitionCombined: number;
    flipsCount: number;
  };
}

export const ScenarioBridgeRibbon: React.FC<ScenarioBridgeRibbonProps> = ({
  bridge,
  activeTab,
  onExportToActions,
  onNavigateToWhatIf,
  onUnlinkScenario,
  actionsSeats,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Coalition Combined Total
  const isCoalition = bridge.id === 'bjp_trs_alliance' || bridge.id === 'bjp_trs_merger';
  const baselineCoalitionSeats = (bridge.tally.counts.BRS || 0) + (bridge.tally.counts.BJP || 0);

  // Dynamic actionsSeats when viewing actions tab
  const displayCoalitionSeats =
    activeTab === 'actions' && actionsSeats
      ? actionsSeats.coalitionCombined
      : baselineCoalitionSeats;

  const coalitionDiff = displayCoalitionSeats - baselineCoalitionSeats;

  const displayIncSeats =
    activeTab === 'actions' && actionsSeats
      ? actionsSeats.INC
      : bridge.tally.counts.INC || 0;

  const incDiff = displayIncSeats - (bridge.tally.counts.INC || 0);

  // High-contrast color palette for Dark Executive Command Strip
  const getWhatIfTheme = (category: string) => {
    switch (category) {
      case 'coalition':
        return {
          pill: 'bg-purple-950/80 hover:bg-purple-900/90 text-purple-200 border-purple-500/50 hover:border-purple-400',
          dot: 'bg-purple-400',
          badge: 'bg-purple-900/60 text-purple-300 border-purple-700/60',
        };
      case 'caste_blocs':
        return {
          pill: 'bg-amber-950/80 hover:bg-amber-900/90 text-amber-200 border-amber-500/50 hover:border-amber-400',
          dot: 'bg-amber-400',
          badge: 'bg-amber-900/60 text-amber-300 border-amber-700/60',
        };
      case 'turnout':
        return {
          pill: 'bg-sky-950/80 hover:bg-sky-900/90 text-sky-200 border-sky-500/50 hover:border-sky-400',
          dot: 'bg-sky-400',
          badge: 'bg-sky-900/60 text-sky-300 border-sky-700/60',
        };
      case 'anti_incumbency':
        return {
          pill: 'bg-rose-950/80 hover:bg-rose-900/90 text-rose-200 border-rose-500/50 hover:border-rose-400',
          dot: 'bg-rose-400',
          badge: 'bg-rose-900/60 text-rose-300 border-rose-700/60',
        };
      case 'target_60':
        return {
          pill: 'bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-200 border-emerald-500/50 hover:border-emerald-400',
          dot: 'bg-emerald-400',
          badge: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60',
        };
      default:
        return {
          pill: 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600',
          dot: 'bg-slate-400',
          badge: 'bg-slate-800 text-slate-400 border-slate-700',
        };
    }
  };

  // ==========================================
  // COLLAPSED MINIMAL VIEW (FULL WIDTH DARK)
  // ==========================================
  if (isCollapsed) {
    return (
      <div className="sticky top-[58px] z-[1050] w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-md transition-all">
        <div className="w-full px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-slate-400 uppercase tracking-wider font-extrabold text-[10px] hidden sm:inline">
              Scenario:
            </span>
            <span className="font-black text-white truncate">
              {bridge.name}
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>

            {/* Compact Numbers */}
            <div className="hidden sm:flex items-center gap-2 font-mono font-bold">
              {isCoalition ? (
                <span className="px-2 py-0.5 rounded-md bg-purple-950/90 text-purple-200 border border-purple-700/60 flex items-center gap-1.5 font-black text-xs">
                  <Handshake className="w-3 h-3 text-purple-400" />
                  <span>BRS+BJP: {displayCoalitionSeats}</span>
                  {activeTab === 'actions' && coalitionDiff !== 0 && (
                    <span className={`text-[10px] px-1 rounded font-mono ${coalitionDiff < 0 ? 'bg-emerald-900/80 text-emerald-300' : 'bg-purple-900/80 text-purple-300'}`}>
                      {coalitionDiff < 0 ? `${coalitionDiff}` : `+${coalitionDiff}`}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-slate-300 text-xs">
                  BRS: {bridge.tally.counts.BRS || 0} • BJP: {bridge.tally.counts.BJP || 0}
                </span>
              )}

              <span className="px-2 py-0.5 rounded-md bg-sky-950/90 text-sky-200 border border-sky-700/60 flex items-center gap-1.5 font-black text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>INC: {displayIncSeats}</span>
                {activeTab === 'actions' && incDiff !== 0 && (
                  <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-1 rounded font-mono">
                    +{incDiff}
                  </span>
                )}
              </span>
            </div>

            <span className="text-[10px] font-extrabold bg-slate-900 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-900/60 shrink-0">
              {bridge.whatIfs.length} Levers Active
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeTab === 'simulations' && !bridge.isExportedToActions && (
              <button
                onClick={onExportToActions}
                className="px-3 py-1 text-xs bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <span>Export to Actions</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            {activeTab === 'actions' && (
              <button
                onClick={onUnlinkScenario}
                className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-lg transition-colors cursor-pointer border border-slate-700"
                title="Revert Actions to 2023 actual election baseline"
              >
                Reset to 2023
              </button>
            )}

            <button
              onClick={() => setIsCollapsed(false)}
              className="px-2 py-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold border border-slate-800"
              title="Expand full scenario carrier details"
            >
              <span>Expand</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // EXPANDED COMMAND VIEW (FULL WIDTH DARK)
  // ==========================================
  return (
    <div className="sticky top-[58px] z-[1050] w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90 shadow-lg text-slate-100 transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 space-y-2.5">
        
        {/* Tier 1: Identity, Real-Time Mandate Barometer & Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Active Scenario Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-400 shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Active Scenario:
                </span>
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight leading-none">
                  {bridge.name}
                </h3>
                {bridge.isExportedToActions ? (
                  <span className="flex items-center gap-1 text-[10px] font-black font-mono bg-emerald-950/90 text-emerald-300 border border-emerald-600/60 px-2 py-0.5 rounded-full shadow-xs">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    Active in Field Playbook
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold font-mono bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 px-2 py-0.5 rounded-full">
                    War Room Model
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Dynamic simulation baseline • {bridge.whatIfs.length} political levers applied below
              </p>
            </div>
          </div>

          {/* Right: Barometers & Quick Action Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* Live Seat Barometer Strip */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs font-mono font-bold shadow-inner">
              
              {/* BRS + BJP Coalition Combined Box */}
              {isCoalition ? (
                <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-purple-600/60 text-purple-200 flex items-center gap-1.5 shadow-xs">
                  <Handshake className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[11px] font-extrabold text-purple-300">BRS+BJP:</span>
                  <span className="text-base font-black text-white leading-none">{displayCoalitionSeats}</span>
                  {activeTab === 'actions' && coalitionDiff !== 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                      coalitionDiff < 0 ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/60' : 'bg-purple-900/80 text-purple-300 border border-purple-700/60'
                    }`}>
                      {coalitionDiff < 0 ? `${coalitionDiff}` : `+${coalitionDiff}`}
                    </span>
                  )}
                  <span className="text-[10px] text-purple-400/90 font-normal hidden lg:inline">
                    ({actionsSeats?.BRS ?? bridge.tally.counts.BRS} BRS + {actionsSeats?.BJP ?? bridge.tally.counts.BJP} BJP)
                  </span>
                </div>
              ) : (
                <>
                  <div className="px-2 py-1 rounded-lg bg-slate-950 border border-pink-700/50 text-pink-300 flex items-center gap-1">
                    <span className="text-[11px] font-bold">BRS:</span>
                    <span className="text-sm font-black text-white">{actionsSeats?.BRS ?? bridge.tally.counts.BRS ?? 0}</span>
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-slate-950 border border-amber-700/50 text-amber-300 flex items-center gap-1">
                    <span className="text-[11px] font-bold">BJP:</span>
                    <span className="text-sm font-black text-white">{actionsSeats?.BJP ?? bridge.tally.counts.BJP ?? 0}</span>
                  </div>
                </>
              )}

              {/* INC Box (Perspective Target) */}
              <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-sky-500/60 text-sky-200 flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="text-[11px] font-extrabold text-sky-300">INC:</span>
                <span className="text-base font-black text-white leading-none">{displayIncSeats}</span>
                {activeTab === 'actions' && incDiff !== 0 && (
                  <span className="text-[10px] bg-emerald-900/90 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-700/60 font-mono">
                    +{incDiff}
                  </span>
                )}
              </div>

              {/* AIMIM Box */}
              <div className="px-2 py-1 rounded-lg bg-slate-950 border border-emerald-700/40 text-emerald-300 flex items-center gap-1 hidden sm:flex">
                <span className="text-[11px] font-bold text-emerald-400">AIMIM:</span>
                <span className="text-sm font-black text-white">{actionsSeats?.AIMIM ?? bridge.tally.counts.AIMIM ?? 0}</span>
              </div>
            </div>

            {/* Context CTAs */}
            {activeTab === 'simulations' ? (
              <button
                onClick={onExportToActions}
                className="px-3.5 py-2 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-xs rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer flex items-center gap-1.5 group shrink-0"
                title="Transfer this simulation base into Actions & Playbook to allocate ground resources on top"
              >
                <span>Export to Actions</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => onNavigateToWhatIf('coalition')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-700/50 hover:border-indigo-500 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Sliders className="w-3 h-3 text-indigo-400" />
                  <span>Modify What-Ifs</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  onClick={onUnlinkScenario}
                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  title="Unlink simulation scenario and restore 2023 actual results baseline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to 2023</span>
                </button>
              </div>
            )}

            {/* Minimize / Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-700 shrink-0"
              title="Minimize sticky bar"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tier 2: Multi-Line Active Levers Grid */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Active Levers ({bridge.whatIfs.length}):</span>
            </div>

            {bridge.whatIfs.map((w) => {
              const theme = getWhatIfTheme(w.category);
              return (
                <button
                  key={w.id}
                  onClick={() => onNavigateToWhatIf(w.category)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs border ${theme.pill}`}
                  title={`Click to adjust ${w.label} in ${w.category.replace('_', ' ')} (${w.detail})`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                  <span className="font-semibold">{w.label}:</span>
                  <span className="text-[11px] font-mono opacity-90">{w.detail}</span>
                  <span className="text-[10px] opacity-60 font-mono ml-0.5">↗</span>
                </button>
              );
            })}

            {bridge.whatIfs.length === 0 && (
              <span className="text-xs text-slate-400 italic">
                Standard baseline (no custom what-ifs applied)
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
