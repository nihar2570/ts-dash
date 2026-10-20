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
} from 'lucide-react';
import type { ActiveScenarioBridge } from '../types';

interface ScenarioBridgeRibbonProps {
  bridge: ActiveScenarioBridge;
  activeTab: string;
  onExportToActions: () => void;
  onNavigateToWhatIf: (category: 'caste_blocs' | 'coalition' | 'turnout' | 'anti_incumbency' | 'target_60') => void;
  onUnlinkScenario: () => void;
}

export const ScenarioBridgeRibbon: React.FC<ScenarioBridgeRibbonProps> = ({
  bridge,
  activeTab,
  onExportToActions,
  onNavigateToWhatIf,
  onUnlinkScenario,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Coalition Combined Total
  const isCoalition = bridge.id === 'bjp_trs_alliance' || bridge.id === 'bjp_trs_merger';
  const coalitionSeats = (bridge.tally.counts.BRS || 0) + (bridge.tally.counts.BJP || 0);

  if (isCollapsed) {
    return (
      <div className="sticky top-[58px] z-30 bg-white/95 backdrop-blur-md border-b border-indigo-200 px-3 sm:px-6 py-1.5 shadow-2xs flex items-center justify-between transition-all">
        <div className="flex items-center gap-2 text-xs truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-slate-900 truncate">
            {bridge.name}
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline font-mono font-bold text-slate-700">
            {isCoalition ? (
              <span className="text-purple-700 font-black">BRS+BJP {coalitionSeats}</span>
            ) : (
              <span>BRS {bridge.tally.counts.BRS || 0} • BJP {bridge.tally.counts.BJP || 0}</span>
            )}
            {' '}| INC {bridge.tally.counts.INC || 0}
          </span>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-indigo-200">
            {bridge.whatIfs.length} What-Ifs Active
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeTab === 'simulations' && !bridge.isExportedToActions && (
            <button
              onClick={onExportToActions}
              className="px-2.5 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>Export to Actions</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {activeTab === 'actions' && (
            <button
              onClick={onUnlinkScenario}
              className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg transition-colors cursor-pointer border border-slate-200"
              title="Revert Actions to 2023 actual election baseline"
            >
              Reset to 2023
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-0.5 text-xs font-semibold"
            title="Expand scenario details"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-[58px] z-30 bg-white/95 backdrop-blur-md border-b border-indigo-200 px-3 sm:px-6 py-2.5 shadow-xs transition-all">
      <div className="flex flex-col gap-2">
        {/* Top Line: Scenario Anchor + Live Barometer + Primary Action */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Active Scenario Base:
              </span>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                {bridge.name}
              </h3>
            </div>

            {bridge.isExportedToActions ? (
              <span className="flex items-center gap-1 text-[11px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full shadow-2xs">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                Active in Field Playbook
              </span>
            ) : (
              <span className="text-[11px] font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                Simulating in War Room
              </span>
            )}
          </div>

          {/* Center-Right: Seat Barometer & CTAs */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Live Tally Badges */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono font-bold">
              {isCoalition ? (
                <div className="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1 font-black">
                  <span>BRS+BJP:</span>
                  <span className="text-sm">{coalitionSeats}</span>
                  <span className="text-[10px] text-purple-700 font-normal">
                    ({bridge.tally.counts.BRS} BRS + {bridge.tally.counts.BJP} BJP)
                  </span>
                </div>
              ) : (
                <>
                  <div className="px-1.5 py-0.5 text-pink-700">
                    BRS: <span className="font-black text-slate-900">{bridge.tally.counts.BRS || 0}</span>
                  </div>
                  <div className="px-1.5 py-0.5 text-amber-700">
                    BJP: <span className="font-black text-slate-900">{bridge.tally.counts.BJP || 0}</span>
                  </div>
                </>
              )}
              <div className="px-1.5 py-0.5 text-sky-700">
                INC: <span className="font-black text-slate-900">{bridge.tally.counts.INC || 0}</span>
              </div>
              <div className="px-1.5 py-0.5 text-emerald-700">
                AIMIM: <span className="font-black text-slate-900">{bridge.tally.counts.AIMIM || 0}</span>
              </div>
            </div>

            {/* Actions CTA */}
            {activeTab === 'simulations' ? (
              <button
                onClick={onExportToActions}
                className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 group"
                title="Transfer this simulation base into Actions & Playbook to allocate resources on top"
              >
                <span>Export to Actions &amp; Playbook</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigateToWhatIf('coalition')}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Modify in Simulations</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={onUnlinkScenario}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  title="Unlink simulation scenario and restore 2023 actual results baseline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to 2023 Baseline</span>
                </button>
              </div>
            )}

            {/* Collapse Button */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Minimize to top bar"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Line: Interactive Clickable What-If Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 pt-0.5 max-w-full">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-indigo-600" />
            Active What-Ifs:
          </span>

          <div className="flex items-center gap-1.5 flex-nowrap">
            {bridge.whatIfs.map((w) => (
              <button
                key={w.id}
                onClick={() => onNavigateToWhatIf(w.category)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 group shadow-2xs"
                title={`Click to jump to ${w.label} settings (${w.detail})`}
              >
                <span>{w.label}</span>
                <span className="text-[10px] text-slate-400 group-hover:text-indigo-600 font-mono">
                  ⚙️
                </span>
              </button>
            ))}

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

