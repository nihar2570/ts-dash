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
    TDP?: number;
    YSRCP?: number;
    JSP?: number;
    BJP?: number;
    INC?: number;
    coalitionCombined?: number;
    flipsCount?: number;
    [key: string]: any;
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

  // NDA Coalition Combined Total (TDP + JSP + BJP)
  const baselineNdaSeats =
    (bridge.tally.counts.TDP || 0) +
    (bridge.tally.counts.JSP || 0) +
    (bridge.tally.counts.BJP || 0);

  // Dynamic actionsSeats when viewing actions tab
  const displayNdaSeats =
    activeTab === 'actions' && actionsSeats && actionsSeats.coalitionCombined !== undefined
      ? actionsSeats.coalitionCombined
      : baselineNdaSeats;

  const ndaDiff = displayNdaSeats - baselineNdaSeats;

  const displayYsrcpSeats =
    activeTab === 'actions' && actionsSeats && actionsSeats.YSRCP !== undefined
      ? actionsSeats.YSRCP
      : bridge.tally.counts.YSRCP || 0;

  const ysrcpDiff = displayYsrcpSeats - (bridge.tally.counts.YSRCP || 0);

  const displayTdpSeats =
    activeTab === 'actions' && actionsSeats && actionsSeats.TDP !== undefined
      ? actionsSeats.TDP
      : bridge.tally.counts.TDP || 0;

  const displayJspSeats =
    activeTab === 'actions' && actionsSeats && actionsSeats.JSP !== undefined
      ? actionsSeats.JSP
      : bridge.tally.counts.JSP || 0;

  const displayBjpSeats =
    activeTab === 'actions' && actionsSeats && actionsSeats.BJP !== undefined
      ? actionsSeats.BJP
      : bridge.tally.counts.BJP || 0;

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
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-slate-400 uppercase tracking-wider font-extrabold text-[10px] hidden sm:inline">
              Scenario:
            </span>
            <span className="font-black text-white truncate">
              {bridge.name}
            </span>
            <span className="hidden sm:inline text-slate-700">|</span>

            {/* Compact Numbers */}
            <div className="hidden sm:flex items-center gap-2 font-mono font-bold">
              <span className="px-2 py-0.5 rounded-md bg-amber-950/90 text-amber-200 border border-amber-700/60 flex items-center gap-1.5 font-black text-xs">
                <Handshake className="w-3 h-3 text-amber-400" />
                <span>NDA: {displayNdaSeats}</span>
                {activeTab === 'actions' && ndaDiff !== 0 && (
                  <span className={`text-[10px] px-1 rounded font-mono ${ndaDiff < 0 ? 'bg-rose-900/80 text-rose-300' : 'bg-emerald-900/80 text-emerald-300'}`}>
                    {ndaDiff < 0 ? `${ndaDiff}` : `+${ndaDiff}`}
                  </span>
                )}
              </span>

              <span className="px-2 py-0.5 rounded-md bg-sky-950/90 text-sky-200 border border-sky-700/60 flex items-center gap-1.5 font-black text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                <span>YSRCP: {displayYsrcpSeats}</span>
                {activeTab === 'actions' && ysrcpDiff !== 0 && (
                  <span className={`text-[10px] px-1 rounded font-mono ${ysrcpDiff > 0 ? 'bg-emerald-900/80 text-emerald-300' : 'bg-rose-900/80 text-rose-300'}`}>
                    {ysrcpDiff > 0 ? `+${ysrcpDiff}` : ysrcpDiff}
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
                title="Revert Actions to 2024 actual election baseline"
              >
                Reset to 2024
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
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
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
                Dynamic simulation baseline &middot; 175 ACs &middot; {bridge.whatIfs.length} political levers applied
              </p>
            </div>
          </div>

          {/* Right: Barometers & Quick Action Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* Live Seat Barometer Strip */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs font-mono font-bold shadow-inner">
              
              {/* NDA Coalition Combined Box */}
              <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-amber-600/60 text-amber-200 flex items-center gap-1.5 shadow-xs">
                <Handshake className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-extrabold text-amber-300">NDA (88 Maj):</span>
                <span className="text-base font-black text-white leading-none">{displayNdaSeats}</span>
                {activeTab === 'actions' && ndaDiff !== 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                    ndaDiff < 0 ? 'bg-rose-900/80 text-rose-300 border border-rose-700/60' : 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/60'
                  }`}>
                    {ndaDiff < 0 ? `${ndaDiff}` : `+${ndaDiff}`}
                  </span>
                )}
                <span className="text-[10px] text-amber-400/90 font-normal hidden lg:inline">
                  (TDP {displayTdpSeats} + JSP {displayJspSeats} + BJP {displayBjpSeats})
                </span>
              </div>

              {/* TDP Box */}
              <div className="px-2 py-1 rounded-lg bg-slate-950 border border-yellow-600/50 text-yellow-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
                <span className="text-[11px] font-bold">TDP:</span>
                <span className="text-sm font-black text-white">{displayTdpSeats}</span>
              </div>

              {/* YSRCP Box */}
              <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-sky-500/60 text-sky-200 flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#004B87]" />
                <span className="text-[11px] font-extrabold text-sky-300">YSRCP:</span>
                <span className="text-base font-black text-white leading-none">{displayYsrcpSeats}</span>
                {activeTab === 'actions' && ysrcpDiff !== 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border font-mono ${
                    ysrcpDiff > 0 ? 'bg-emerald-900/90 text-emerald-300 border-emerald-700/60' : 'bg-rose-900/90 text-rose-300 border-rose-700/60'
                  }`}>
                    {ysrcpDiff > 0 ? `+${ysrcpDiff}` : ysrcpDiff}
                  </span>
                )}
              </div>

              {/* JSP Box */}
              <div className="px-2 py-1 rounded-lg bg-slate-950 border border-rose-700/50 text-rose-300 flex items-center gap-1 hidden sm:flex">
                <span className="w-2 h-2 rounded-full bg-[#E61A24]" />
                <span className="text-[11px] font-bold text-rose-400">JSP:</span>
                <span className="text-sm font-black text-white">{displayJspSeats}</span>
              </div>

              {/* BJP Box */}
              <div className="px-2 py-1 rounded-lg bg-slate-950 border border-orange-700/50 text-orange-300 flex items-center gap-1 hidden md:flex">
                <span className="w-2 h-2 rounded-full bg-[#FF9933]" />
                <span className="text-[11px] font-bold text-orange-400">BJP:</span>
                <span className="text-sm font-black text-white">{displayBjpSeats}</span>
              </div>
            </div>

            {/* Context CTAs */}
            {activeTab === 'simulations' ? (
              <button
                onClick={onExportToActions}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-600 via-indigo-600 to-purple-600 hover:from-amber-700 hover:to-purple-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 group shrink-0"
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
                  title="Unlink simulation scenario and restore 2024 actual results baseline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to 2024</span>
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
