import React from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  type RedPillTrigger,
  type RedPillParty,
  RED_PILL_CATEGORIES,
  FRESHNESS_META,
} from './redPillMicroTriggers';

export interface RedPillSearchTableViewProps {
  activeParty: RedPillParty;
  activeTriggerIds: Set<string>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  filteredTriggersCount: number;
  paginatedTriggers: RedPillTrigger[];
  toggleTrigger: (id: string) => void;
  onInspectTrigger: (trigger: RedPillTrigger) => void;
}

export const RedPillSearchTableView: React.FC<RedPillSearchTableViewProps> = ({
  activeParty,
  activeTriggerIds,
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  totalPages,
  filteredTriggersCount,
  paginatedTriggers,
  toggleTrigger,
  onInspectTrigger,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={`Search ${activeParty === 'TDP_JSP' ? 'NDA' : 'YSRCP'} triggers (e.g., Super Six, Sand, Laddu, Viveka, Pension)...`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>
            {filteredTriggersCount} matches &middot; Page {currentPage}/{totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
        {paginatedTriggers.map((t) => {
          const isOn = activeTriggerIds.has(t.id);
          const meta = RED_PILL_CATEGORIES[t.category];
          const fMeta = FRESHNESS_META[t.freshness];
          return (
            <div
              key={t.id}
              onClick={() => toggleTrigger(t.id)}
              className={`px-3 py-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/60 transition-colors ${
                isOn ? '' : 'opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: meta.color }}
                />
                <span
                  className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0 ${fMeta.badgeClass}`}
                >
                  {fMeta.shortLabel}
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{t.title}</div>
                  <div className="text-[10.5px] text-slate-400 truncate italic">
                    {t.subCluster} &middot; {t.targetGroup}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInspectTrigger(t);
                  }}
                  className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Info
                </button>
                <span className="text-[11px] font-mono font-bold text-rose-300">
                  +{t.impactPct.toFixed(2)}%
                </span>
                <div
                  className={`w-7 h-4 rounded-full relative flex items-center px-0.5 transition-colors ${
                    isOn ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      isOn ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
