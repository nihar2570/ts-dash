import React, { useState, useMemo } from 'react';
import {
  Skull,
  Flame,
  HeartCrack,
  ShieldAlert,
  RotateCcw,
  Search,
  Building2,
  AlertTriangle,
  Shield,
  Briefcase,
  GitFork,
  ChevronRight,
  Pin,
  Sparkles,
} from 'lucide-react';
import type { DemographicsDataset } from '../../types';
import {
  RED_PILL_CATEGORIES,
  FRESHNESS_META,
  getTriggersForParty,
  type RedPillCategoryKey,
  type RedPillTrigger,
  type RedPillParty,
  type TriggerFreshness,
} from './redPillMicroTriggers';
import { RedPillTriggerInfoModal } from './RedPillTriggerInfoModal';
import { RedPillSearchTableView } from './RedPillSearchTableView';

export interface RedPillEmotionalMatrixProps {
  demographicsData?: DemographicsDataset;
  selectedAcNo?: number | null;
  onSelectAc?: (acNo: number) => void;
  party?: RedPillParty;
  onSelectParty?: (party: RedPillParty) => void;
}

const getCategoryIcon = (key: RedPillCategoryKey) => {
  switch (key) {
    case 'kinship_dynasty':
      return <HeartCrack className="w-4 h-4 text-rose-400 shrink-0" />;
    case 'spiritual_sacrilege':
      return <Flame className="w-4 h-4 text-amber-400 shrink-0" />;
    case 'elder_matriarch':
      return <Shield className="w-4 h-4 text-indigo-400 shrink-0" />;
    case 'maternal_hearth':
      return <AlertTriangle className="w-4 h-4 text-emerald-400 shrink-0" />;
    case 'property_extortion':
      return <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />;
    case 'satrap_tyranny':
      return <ShieldAlert className="w-4 h-4 text-pink-400 shrink-0" />;
    case 'occupational_dignity':
      return <Briefcase className="w-4 h-4 text-purple-400 shrink-0" />;
    default:
      return <Skull className="w-4 h-4 text-slate-400 shrink-0" />;
  }
};

const CATEGORY_ORDER: RedPillCategoryKey[] = [
  'kinship_dynasty',
  'spiritual_sacrilege',
  'elder_matriarch',
  'maternal_hearth',
  'property_extortion',
  'satrap_tyranny',
  'occupational_dignity',
];

/** Builds a ~5.15% winning trigger selection for a party while strictly excluding saturated replays. */
function buildSmartWinSet(party: RedPillParty): Set<string> {
  const candidates = getTriggersForParty(party)
    .filter((t) => t.freshness !== 'saturated')
    .sort((a, b) => {
      if (a.freshness !== b.freshness) return a.freshness === 'fresh' ? -1 : 1;
      return b.impactPct - a.impactPct;
    });
  const selected = new Set<string>();
  let acc = 0;
  for (const t of candidates) {
    if (acc >= 5.15) break;
    selected.add(t.id);
    acc += t.impactPct;
  }
  return selected;
}

export const RedPillEmotionalMatrix: React.FC<RedPillEmotionalMatrixProps> = ({
  party: controlledParty,
  onSelectParty,
}) => {
  const [internalParty, setInternalParty] = useState<RedPillParty>('TDP_JSP');
  const activeParty = controlledParty ?? internalParty;
  const setParty = (next: RedPillParty) => {
    setInternalParty(next);
    if (onSelectParty) onSelectParty(next);
    setHoveredCat(null);
    setHoveredCluster(null);
    setIsPinned(false);
    setCurrentPage(1);
  };

  // Preserve custom active trigger sets per party; default excludes saturated replays
  const [activeByParty, setActiveByParty] = useState<Record<RedPillParty, Set<string>>>(() => ({
    TDP_JSP: buildSmartWinSet('TDP_JSP'),
    YSRCP: buildSmartWinSet('YSRCP'),
  }));

  const activeTriggerIds = activeByParty[activeParty];
  const updatePartyActiveSet = (updater: (prev: Set<string>) => Set<string>) => {
    setActiveByParty((prevMap) => ({
      ...prevMap,
      [activeParty]: updater(prevMap[activeParty]),
    }));
  };

  // Freshness filter (All | Hide Saturated | Fresh | Reframed | Saturated)
  type FreshnessFilter = 'all' | 'no_saturated' | TriggerFreshness;
  const [freshnessFilter, setFreshnessFilter] = useState<FreshnessFilter>('no_saturated');

  // View toggle: 'tree' (Interactive Hover Tree) vs 'search' (Flat Searchable List)
  const [viewMode, setViewMode] = useState<'tree' | 'search'>('tree');

  // Hover & Pin state for the interactive tree
  const [hoveredCat, setHoveredCat] = useState<RedPillCategoryKey | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null);
  const [isPinned, setIsPinned] = useState<boolean>(false);

  // Search view state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 25;

  // Trigger detail modal
  const [inspectedTrigger, setInspectedTrigger] = useState<RedPillTrigger | null>(null);

  const partyTriggers = useMemo(() => getTriggersForParty(activeParty), [activeParty]);

  const visibleTriggers = useMemo(() => {
    if (freshnessFilter === 'all') return partyTriggers;
    if (freshnessFilter === 'no_saturated') {
      return partyTriggers.filter((t) => t.freshness !== 'saturated');
    }
    return partyTriggers.filter((t) => t.freshness === freshnessFilter);
  }, [partyTriggers, freshnessFilter]);

  const freshnessCounts = useMemo(() => {
    let fresh = 0;
    let reframed = 0;
    let saturated = 0;
    let activeFresh = 0;
    let activeReframed = 0;
    let activeSaturated = 0;
    for (const t of partyTriggers) {
      const on = activeTriggerIds.has(t.id);
      if (t.freshness === 'fresh') {
        fresh++;
        if (on) activeFresh++;
      } else if (t.freshness === 'reframed') {
        reframed++;
        if (on) activeReframed++;
      } else {
        saturated++;
        if (on) activeSaturated++;
      }
    }
    return {
      fresh,
      reframed,
      saturated,
      nonSaturated: fresh + reframed,
      total: partyTriggers.length,
      activeFresh,
      activeReframed,
      activeSaturated,
    };
  }, [partyTriggers, activeTriggerIds]);

  // Build hierarchical tree structure & aggregate live impact
  const {
    categoryStats,
    clustersByCategory,
    triggersByCluster,
    totalShiftPct,
    activeCount,
    projectedSeatsFlipped,
  } = useMemo(() => {
    const catStats: Record<
      RedPillCategoryKey,
      { activeImpact: number; maxImpact: number; activeCount: number; totalCount: number }
    > = {
      kinship_dynasty: { activeImpact: 0, maxImpact: 0, activeCount: 0, totalCount: 0 },
      spiritual_sacrilege: { activeImpact: 0, maxImpact: 0, activeCount: 0, totalCount: 0 },
      elder_matriarch: { activeImpact: 0, maxImpact: 0, activeCount: 0, totalCount: 0 },
      maternal_hearth: { activeImpact: 0, maxImpact: 0, activeCount: 0, totalCount: 0 },
      property_extortion: { activeImpact: 0, maxImpact: 0, activeCount: 0, totalCount: 0 },
      satrap_tyranny: { activeImpact: 0, maxImpact: 0, activeCount: 0, totalCount: 0 },
      occupational_dignity: { activeImpact: 0, maxImpact: 0, activeCount: 0, totalCount: 0 },
    };

    const clusByCat: Record<
      RedPillCategoryKey,
      {
        name: string;
        activeCount: number;
        totalCount: number;
        activeImpact: number;
        maxImpact: number;
      }[]
    > = {
      kinship_dynasty: [],
      spiritual_sacrilege: [],
      elder_matriarch: [],
      maternal_hearth: [],
      property_extortion: [],
      satrap_tyranny: [],
      occupational_dignity: [],
    };

    const clusterLookup: Record<
      string,
      {
        name: string;
        category: RedPillCategoryKey;
        activeCount: number;
        totalCount: number;
        activeImpact: number;
        maxImpact: number;
      }
    > = {};

    const trigByClus: Record<string, RedPillTrigger[]> = {};

    let totalShift = 0;
    let actCount = 0;

    // Count active score across all active party triggers; build visible tree from visibleTriggers
    for (const trigger of partyTriggers) {
      if (activeTriggerIds.has(trigger.id)) {
        actCount++;
        totalShift += trigger.impactPct;
      }
    }

    for (const trigger of visibleTriggers) {
      catStats[trigger.category].totalCount++;
      catStats[trigger.category].maxImpact += trigger.impactPct;

      if (!clusterLookup[trigger.subCluster]) {
        const entry = {
          name: trigger.subCluster,
          category: trigger.category,
          activeCount: 0,
          totalCount: 0,
          activeImpact: 0,
          maxImpact: 0,
        };
        clusterLookup[trigger.subCluster] = entry;
        clusByCat[trigger.category].push(entry);
        trigByClus[trigger.subCluster] = [];
      }

      const clus = clusterLookup[trigger.subCluster];
      clus.totalCount++;
      clus.maxImpact += trigger.impactPct;
      trigByClus[trigger.subCluster].push(trigger);

      if (activeTriggerIds.has(trigger.id)) {
        catStats[trigger.category].activeCount++;
        catStats[trigger.category].activeImpact += trigger.impactPct;
        clus.activeCount++;
        clus.activeImpact += trigger.impactPct;
      }
    }

    totalShift = Number(Math.min(10.0, totalShift).toFixed(2));
    const seats = Math.min(126, Math.round(totalShift * 12.4 + (totalShift >= 5.0 ? 6 : 0)));

    return {
      categoryStats: catStats,
      clustersByCategory: clusByCat,
      triggersByCluster: trigByClus,
      totalShiftPct: totalShift,
      activeCount: actCount,
      projectedSeatsFlipped: seats,
    };
  }, [partyTriggers, visibleTriggers, activeTriggerIds]);

  // Toggle single trigger
  const toggleTrigger = (id: string) => {
    updatePartyActiveSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle all visible triggers in a category
  const toggleCategory = (catKey: RedPillCategoryKey, e: React.MouseEvent) => {
    e.stopPropagation();
    const catTriggers = visibleTriggers.filter((t) => t.category === catKey);
    if (catTriggers.length === 0) return;
    const allActive = catTriggers.every((t) => activeTriggerIds.has(t.id));
    updatePartyActiveSet((prev) => {
      const next = new Set(prev);
      catTriggers.forEach((t) => (allActive ? next.delete(t.id) : next.add(t.id)));
      return next;
    });
  };

  // Toggle all visible triggers in a sub-cluster
  const toggleCluster = (clusterName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const list = triggersByCluster[clusterName] || [];
    if (list.length === 0) return;
    const allActive = list.every((t) => activeTriggerIds.has(t.id));
    updatePartyActiveSet((prev) => {
      const next = new Set(prev);
      list.forEach((t) => (allActive ? next.delete(t.id) : next.add(t.id)));
      return next;
    });
  };

  // Category hover handler
  const handleHoverCategory = (catKey: RedPillCategoryKey) => {
    if (isPinned) return;
    setHoveredCat(catKey);
    const firstCluster = clustersByCategory[catKey]?.[0]?.name || null;
    setHoveredCluster(firstCluster);
  };

  const handleClickCategory = (catKey: RedPillCategoryKey) => {
    if (hoveredCat === catKey && isPinned) {
      setIsPinned(false);
    } else {
      setHoveredCat(catKey);
      const firstCluster = clustersByCategory[catKey]?.[0]?.name || null;
      setHoveredCluster(firstCluster);
      setIsPinned(true);
    }
  };

  const handleTreeMouseLeave = () => {
    if (!isPinned) {
      setHoveredCat(null);
      setHoveredCluster(null);
    }
  };

  const handleFreshnessChange = (nextFilter: FreshnessFilter) => {
    setFreshnessFilter(nextFilter);
    setCurrentPage(1);
    if (hoveredCat) {
      // Ensure hoveredCluster resets safely if filtered out
      setHoveredCluster(null);
    }
  };

  // Search view filtering & pagination
  const filteredTriggers = useMemo(() => {
    if (!searchQuery.trim()) return visibleTriggers;
    const q = searchQuery.toLowerCase();
    return visibleTriggers.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.hook.toLowerCase().includes(q) ||
        t.targetGroup.toLowerCase().includes(q) ||
        t.subCluster.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
    );
  }, [visibleTriggers, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredTriggers.length / pageSize));
  const paginatedTriggers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTriggers.slice(start, start + pageSize);
  }, [filteredTriggers, currentPage]);

  // Active clusters & triggers for the currently hovered branch
  const activeClusters = hoveredCat ? clustersByCategory[hoveredCat] || [] : [];
  const resolvedCluster =
    hoveredCluster && triggersByCluster[hoveredCluster]
      ? hoveredCluster
      : activeClusters[0]?.name || null;
  const activeLeafTriggers = resolvedCluster ? triggersByCluster[resolvedCluster] || [] : [];
  const activeCatIndex = hoveredCat ? CATEGORY_ORDER.indexOf(hoveredCat) : -1;
  const activeClusterIndex = resolvedCluster
    ? activeClusters.findIndex((c) => c.name === resolvedCluster)
    : -1;

  // Compact status verdict tag
  const statusLabel =
    totalShiftPct >= 7.5
      ? { text: 'Landslide Wave', cls: 'text-amber-400 bg-amber-950/60 border-amber-700/50' }
      : totalShiftPct >= 5.0
      ? { text: 'Majority Secured (88+ Seats)', cls: 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50' }
      : totalShiftPct >= 2.5
      ? { text: 'Tipping Point', cls: 'text-cyan-400 bg-cyan-950/60 border-cyan-700/50' }
      : { text: 'Building Rupture', cls: 'text-slate-400 bg-slate-900 border-slate-700' };

  const allNonSatCount = freshnessCounts.nonSaturated;
  const allNonSatActive =
    visibleTriggers.length > 0 && visibleTriggers.every((t) => activeTriggerIds.has(t.id));

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* 1. COMPACT UNIFIED SCOREBOARD, PARTY TOGGLE & STACKED BAR CHART */}
      <div
        id="red-pill-barometer"
        className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl scroll-mt-24"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Title + Toggleable Party Console */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1 rounded-md bg-rose-950 text-rose-400 border border-rose-800/80">
                <Skull className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Moral Rupture Matrix
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusLabel.cls}`}>
                {statusLabel.text}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Toggleable Party Switch */}
              <div
                role="group"
                aria-label="Select Attack / Campaign Perspective"
                className="inline-flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800"
              >
                <button
                  type="button"
                  onClick={() => setParty('TDP_JSP')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeParty === 'TDP_JSP'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeParty === 'TDP_JSP' ? 'bg-slate-950' : 'bg-amber-400'}`} />
                  <span>TDP + JSP + BJP</span>
                </button>
                <button
                  type="button"
                  onClick={() => setParty('YSRCP')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeParty === 'YSRCP'
                      ? 'bg-blue-600 text-white font-black shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeParty === 'YSRCP' ? 'bg-white' : 'bg-blue-500'}`} />
                  <span>YSRCP</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-400">
                {activeParty === 'TDP_JSP'
                  ? 'Anti-Opposition · Fresh & Evergreen Accountability'
                  : 'Anti-Incumbency · Household & Syndicate Rupture'}
              </span>
            </div>
          </div>

          {/* Right Live Numbers + Presets + View Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-3 bg-slate-950/90 px-3.5 py-2 rounded-xl border border-slate-800 font-mono">
              <div>
                <span className="text-[9px] text-slate-400 uppercase block">Vote Shift</span>
                <strong className="text-lg font-black text-rose-400">
                  +{totalShiftPct.toFixed(2)}%
                </strong>
                <span className="text-[10px] text-slate-500"> / 10%</span>
              </div>
              <div className="h-7 w-px bg-slate-800" />
              <div>
                <span className="text-[9px] text-slate-400 uppercase block">Seats Flipped</span>
                <strong className="text-lg font-black text-emerald-400">
                  +{projectedSeatsFlipped}
                </strong>
              </div>
              <div className="h-7 w-px bg-slate-800 hidden sm:block" />
              <div className="hidden sm:block">
                <span className="text-[9px] text-slate-400 uppercase block">Active</span>
                <strong className="text-sm font-bold text-white">
                  {activeCount}
                  <span className="text-slate-500 text-[10px]"> / {freshnessCounts.total}</span>
                </strong>
              </div>
            </div>

            {/* Clean View Toggle + Smart Mix + Max/Reset */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setViewMode(viewMode === 'tree' ? 'search' : 'tree')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  viewMode === 'search'
                    ? 'bg-rose-950 text-rose-200 border-rose-600'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                {viewMode === 'tree' ? (
                  <>
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <span>List ({visibleTriggers.length})</span>
                  </>
                ) : (
                  <>
                    <GitFork className="w-3.5 h-3.5 text-rose-400" />
                    <span>Tree View</span>
                  </>
                )}
              </button>

              <button
                onClick={() => updatePartyActiveSet(() => buildSmartWinSet(activeParty))}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/70 cursor-pointer transition-colors"
                title="Activate highest-yield Fresh + Reframed triggers (~5.15% win mix, skips saturated replays)"
              >
                <Sparkles className="w-3 h-3" />
                <span>5% Smart Mix</span>
              </button>

              <button
                onClick={() =>
                  updatePartyActiveSet(() =>
                    allNonSatActive ? new Set() : new Set(visibleTriggers.map((t) => t.id))
                  )
                }
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition-colors"
                title={allNonSatActive ? 'Clear visible triggers' : 'Activate all triggers currently in filter'}
              >
                {allNonSatActive ? 'Clear' : 'All Shown'}
              </button>

              {activeCount > 0 && (
                <button
                  onClick={() => updatePartyActiveSet(() => new Set())}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer transition-colors"
                  title="Reset all triggers to 0%"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Slim Stacked Horizontal Bar (0% -> 10% with 5% Win Line) */}
        <div className="space-y-1">
          <div className="relative w-full h-7 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex">
            {CATEGORY_ORDER.map((catKey) => {
              const meta = RED_PILL_CATEGORIES[catKey];
              const stats = categoryStats[catKey];
              const pct = (stats.activeImpact / 10.0) * 100;
              if (pct <= 0) return null;

              return (
                <div
                  key={catKey}
                  style={{ width: `${pct}%`, backgroundColor: meta.color }}
                  title={`${meta.shortLabel}: +${stats.activeImpact.toFixed(2)}% (${stats.activeCount}/${stats.totalCount})`}
                  onMouseEnter={() => handleHoverCategory(catKey)}
                  className="h-full transition-all duration-300 hover:brightness-115 border-r border-slate-950/40 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  {pct > 7 && (
                    <span className="text-[10px] font-black text-slate-950 font-mono truncate px-1 select-none">
                      +{stats.activeImpact.toFixed(2)}%
                    </span>
                  )}
                </div>
              );
            })}
            {/* Vertical 5.0% Win Line */}
            <div
              className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)] pointer-events-none z-10"
              title="5.0% Majority Win Threshold (+68 Seats)"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-500 pt-0.5">
            <div className="relative flex-1 h-4 min-w-[200px] select-none">
              <span className="absolute left-0">0%</span>
              <span className="absolute left-[25%] -translate-x-1/2 hidden sm:inline">2.5%</span>
              <span className="absolute left-[50%] -translate-x-1/2 text-emerald-400 font-bold">
                5.0% WIN LINE (+68 Seats)
              </span>
              <span className="absolute left-[75%] -translate-x-1/2 hidden sm:inline">7.5%</span>
              <span className="absolute right-0">10.0%</span>
            </div>
            <div className="hidden lg:flex items-center gap-3 shrink-0 text-[10px]">
              <span className="text-emerald-400">
                Fresh active: <strong>{freshnessCounts.activeFresh}</strong>/{freshnessCounts.fresh}
              </span>
              <span className="text-amber-300">
                Reframed: <strong>{freshnessCounts.activeReframed}</strong>/{freshnessCounts.reframed}
              </span>
              <span className="text-slate-400">
                Saturated: <strong>{freshnessCounts.activeSaturated}</strong>/{freshnessCounts.saturated}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FRESHNESS & SATURATION FILTER BAR + TRIGGER EXPLORER */}
      <div
        id="red-pill-triggers"
        onMouseLeave={viewMode === 'tree' ? handleTreeMouseLeave : undefined}
        className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative scroll-mt-24 overflow-hidden space-y-3"
      >
        {/* Top Toolbar: Freshness Filters + Pin indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80 text-[11px]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 mr-1">
              Message Freshness:
            </span>
            {[
              {
                id: 'no_saturated' as const,
                label: `Active Mix · No Saturated (${allNonSatCount})`,
                activeCls: 'bg-emerald-950 text-emerald-200 border-emerald-600',
              },
              {
                id: 'fresh' as const,
                label: `Fresh Only (${freshnessCounts.fresh})`,
                activeCls: 'bg-emerald-950 text-emerald-300 border-emerald-500',
              },
              {
                id: 'reframed' as const,
                label: `Reframed Evergreen (${freshnessCounts.reframed})`,
                activeCls: 'bg-amber-950 text-amber-200 border-amber-600',
              },
              {
                id: 'saturated' as const,
                label: `Saturated · 0.2× (${freshnessCounts.saturated})`,
                activeCls: 'bg-slate-800 text-slate-200 border-slate-500',
              },
              {
                id: 'all' as const,
                label: `All (${freshnessCounts.total})`,
                activeCls: 'bg-rose-950 text-rose-200 border-rose-600',
              },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => handleFreshnessChange(pill.id)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer border text-[11px] ${
                  freshnessFilter === pill.id
                    ? pill.activeCls
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {viewMode === 'tree' && isPinned && hoveredCat && (
            <button
              onClick={() => {
                setIsPinned(false);
                setHoveredCat(null);
                setHoveredCluster(null);
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-700/60 text-[10px] font-bold cursor-pointer"
            >
              <Pin className="w-3 h-3" />
              <span>Unpin Branch</span>
            </button>
          )}
        </div>

        {/* DEFAULT TREE VIEW */}
        {viewMode === 'tree' && (
          <div className="flex flex-col lg:flex-row items-stretch min-h-[430px]">
            {/* STAGE 0: ROOT NODE (Desktop) */}
            <div className="hidden xl:flex flex-col justify-center shrink-0 w-36">
              <div
                className={`border-2 rounded-xl p-3 text-center space-y-1 shadow-lg bg-gradient-to-br ${
                  activeParty === 'TDP_JSP'
                    ? 'from-amber-950/60 to-slate-900 border-amber-500/60'
                    : 'from-blue-950/60 to-slate-900 border-blue-500/60'
                }`}
              >
                <span className="text-[10px] uppercase font-mono text-slate-300 font-bold block">
                  {activeParty === 'TDP_JSP' ? 'NDA Console' : 'YSRCP Console'}
                </span>
                <div className="text-sm font-black text-white">Moral Rupture</div>
                <div className="text-base font-black text-rose-400 font-mono">
                  +{totalShiftPct.toFixed(2)}%
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {visibleTriggers.length} Unique Hooks
                </div>
              </div>
            </div>

            {/* SVG TRUNK CONNECTORS (Root -> 7 Categories) */}
            <div className="hidden xl:block w-10 shrink-0 relative">
              <svg
                viewBox="0 0 100 700"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
              >
                {CATEGORY_ORDER.map((catKey, i) => {
                  const targetY = (i + 0.5) * 100;
                  const meta = RED_PILL_CATEGORIES[catKey];
                  const isHighlighted = hoveredCat === catKey;
                  const isActive = categoryStats[catKey].activeCount > 0;
                  return (
                    <path
                      key={catKey}
                      d={`M 0 350 C 50 350, 50 ${targetY}, 100 ${targetY}`}
                      fill="none"
                      stroke={isHighlighted ? meta.color : isActive ? `${meta.color}66` : '#1e293b'}
                      strokeWidth={isHighlighted ? 3 : 1.75}
                      className="transition-all duration-200"
                    />
                  );
                })}
              </svg>
            </div>

            {/* STAGE 1: 7 CATEGORY BRANCHES */}
            <div className="w-full lg:w-[260px] shrink-0 flex flex-col justify-between gap-2">
              {CATEGORY_ORDER.map((catKey) => {
                const meta = RED_PILL_CATEGORIES[catKey];
                const stats = categoryStats[catKey];
                const isSelected = hoveredCat === catKey;
                const allOn = stats.totalCount > 0 && stats.activeCount === stats.totalCount;
                const someOn = stats.activeCount > 0;

                return (
                  <div
                    key={catKey}
                    onMouseEnter={() => handleHoverCategory(catKey)}
                    onClick={() => handleClickCategory(catKey)}
                    className={`h-[54px] px-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'bg-slate-800/95 border-slate-500 shadow-lg translate-x-0.5'
                        : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700'
                    }`}
                    style={{
                      borderLeftWidth: '4px',
                      borderLeftColor: meta.color,
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {getCategoryIcon(catKey)}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {meta.shortLabel}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          <span className="text-white font-semibold">
                            +{stats.activeImpact.toFixed(2)}%
                          </span>
                          <span> / {stats.maxImpact.toFixed(2)}%</span>
                          <span className="ml-1.5 text-slate-500">
                            ({stats.activeCount}/{stats.totalCount})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => toggleCategory(catKey, e)}
                        title={allOn ? 'Disable category' : 'Enable entire category'}
                        className={`w-7 h-4 rounded-full relative flex items-center px-0.5 transition-colors cursor-pointer ${
                          allOn
                            ? 'bg-emerald-500'
                            : someOn
                            ? 'bg-amber-500/80'
                            : 'bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full bg-white transition-transform ${
                            allOn || someOn ? 'translate-x-3' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSelected ? 'text-white translate-x-0.5' : 'text-slate-600'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* EXPANDED AREA ON HOVER: STAGES 2 & 3 */}
            {hoveredCat ? (
              <>
                {/* SVG BRANCH CONNECTORS */}
                <div className="hidden lg:block w-12 shrink-0 relative">
                  <svg
                    viewBox="0 0 100 700"
                    preserveAspectRatio="none"
                    className="w-full h-full overflow-visible"
                  >
                    {activeClusters.map((clus, j) => {
                      const startY = (activeCatIndex + 0.5) * 100;
                      const endY = ((j + 0.5) / activeClusters.length) * 700;
                      const catColor = RED_PILL_CATEGORIES[hoveredCat].color;
                      const isClusHover = resolvedCluster === clus.name;

                      return (
                        <path
                          key={clus.name}
                          d={`M 0 ${startY} C 50 ${startY}, 50 ${endY}, 100 ${endY}`}
                          fill="none"
                          stroke={isClusHover ? catColor : `${catColor}66`}
                          strokeWidth={isClusHover ? 3 : 1.75}
                          className="transition-all duration-200"
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* STAGE 2: SUB-CLUSTER BRANCHES */}
                <div className="w-full lg:w-[250px] shrink-0 flex flex-col justify-around gap-3 mt-3 lg:mt-0 animate-in fade-in duration-150">
                  {activeClusters.length === 0 ? (
                    <div className="p-4 rounded-xl border border-dashed border-slate-800 text-xs text-slate-500 text-center">
                      No triggers in this branch match the selected freshness filter.
                    </div>
                  ) : (
                    activeClusters.map((clus) => {
                      const catColor = RED_PILL_CATEGORIES[hoveredCat].color;
                      const isClusSelected = resolvedCluster === clus.name;
                      const allOn = clus.totalCount > 0 && clus.activeCount === clus.totalCount;
                      const someOn = clus.activeCount > 0;

                      return (
                        <div
                          key={clus.name}
                          onMouseEnter={() => {
                            if (!isPinned) setHoveredCluster(clus.name);
                          }}
                          onClick={() => setHoveredCluster(clus.name)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all duration-150 space-y-1.5 ${
                            isClusSelected
                              ? 'bg-slate-800/95 border-slate-500 shadow-lg'
                              : 'bg-slate-900/75 border-slate-800 hover:border-slate-700'
                          }`}
                          style={{
                            borderLeftWidth: '3px',
                            borderLeftColor: isClusSelected ? catColor : '#334155',
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-white leading-snug">
                              {clus.name}
                            </h4>
                            <button
                              onClick={(e) => toggleCluster(clus.name, e)}
                              title={allOn ? 'Disable battlefront' : 'Enable entire battlefront'}
                              className={`w-7 h-4 rounded-full shrink-0 relative flex items-center px-0.5 transition-colors cursor-pointer ${
                                allOn
                                  ? 'bg-emerald-500'
                                  : someOn
                                  ? 'bg-amber-500/80'
                                  : 'bg-slate-700'
                              }`}
                            >
                              <div
                                className={`w-3 h-3 rounded-full bg-white transition-transform ${
                                  allOn || someOn ? 'translate-x-3' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>
                              <strong className="text-white">+{clus.activeImpact.toFixed(2)}%</strong> /{' '}
                              {clus.maxImpact.toFixed(2)}%
                            </span>
                            <span>
                              {clus.activeCount}/{clus.totalCount} items
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* SVG LEAF CONNECTOR */}
                <div className="hidden lg:block w-10 shrink-0 relative">
                  <svg
                    viewBox="0 0 100 700"
                    preserveAspectRatio="none"
                    className="w-full h-full overflow-visible"
                  >
                    {activeClusterIndex >= 0 && (
                      <path
                        d={`M 0 ${((activeClusterIndex + 0.5) / activeClusters.length) * 700} C 50 ${
                          ((activeClusterIndex + 0.5) / activeClusters.length) * 700
                        }, 50 350, 100 350`}
                        fill="none"
                        stroke={RED_PILL_CATEGORIES[hoveredCat].color}
                        strokeWidth={2.5}
                      />
                    )}
                  </svg>
                </div>

                {/* STAGE 3: LEAF MICRO-TRIGGERS PANEL */}
                <div className="flex-1 min-w-0 bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 flex flex-col mt-3 lg:mt-0 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800">
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">
                        Distinct Triggers ({activeLeafTriggers.length})
                      </span>
                      <h4 className="text-xs font-bold text-white truncate">
                        {resolvedCluster || 'No matching triggers'}
                      </h4>
                    </div>

                    {resolvedCluster && (
                      <button
                        onClick={() => toggleCluster(resolvedCluster)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-white border border-slate-700 shrink-0 cursor-pointer"
                      >
                        Toggle Group
                      </button>
                    )}
                  </div>

                  <div className="overflow-y-auto max-h-[370px] space-y-1.5 pr-1">
                    {activeLeafTriggers.map((t) => {
                      const isOn = activeTriggerIds.has(t.id);
                      const fMeta = FRESHNESS_META[t.freshness];
                      return (
                        <div
                          key={t.id}
                          onClick={() => toggleTrigger(t.id)}
                          className={`p-2.5 rounded-lg border flex items-start justify-between gap-2.5 cursor-pointer transition-colors ${
                            isOn
                              ? 'bg-slate-800/80 border-slate-700'
                              : 'bg-slate-950/60 border-slate-800/60 opacity-60 hover:opacity-95'
                          }`}
                        >
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0 ${fMeta.badgeClass}`}
                              >
                                {fMeta.shortLabel}
                              </span>
                              <span className="text-xs font-semibold text-white">
                                {t.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                              {t.hook}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 pt-0.5">
                            <span
                              className={`text-[10px] font-mono font-bold ${
                                t.freshness === 'saturated' ? 'text-slate-400' : 'text-rose-300'
                              }`}
                            >
                              +{t.impactPct.toFixed(2)}%
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setInspectedTrigger(t);
                              }}
                              className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                            >
                              Info
                            </button>
                            <div
                              className={`w-6 h-3.5 rounded-full relative flex items-center px-0.5 transition-colors ${
                                isOn ? 'bg-emerald-500' : 'bg-slate-700'
                              }`}
                            >
                              <div
                                className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                                  isOn ? 'translate-x-2.5' : 'translate-x-0'
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              /* Resting Prompt Before Hovering */
              <div className="flex-1 flex items-center justify-center p-6 mt-3 lg:mt-0 lg:ml-6 border border-dashed border-slate-800 rounded-xl bg-slate-900/30 text-center">
                <div className="max-w-sm space-y-2">
                  <GitFork className="w-8 h-8 text-rose-400/70 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-200">
                    Hover Any Moral Taboo Branch on the Left
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Every trigger is unique and scored for <strong>message freshness</strong>—saturated replays automatically decay to <strong>0.20×</strong>, while reframed evergreen wounds keep <strong>0.85×</strong> punch.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECONDARY FLAT LIST / SEARCH MODE */}
        {viewMode === 'search' && (
          <RedPillSearchTableView
            activeParty={activeParty}
            activeTriggerIds={activeTriggerIds}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            filteredTriggersCount={filteredTriggers.length}
            paginatedTriggers={paginatedTriggers}
            toggleTrigger={toggleTrigger}
            onInspectTrigger={setInspectedTrigger}
          />
        )}
      </div>

      {/* 3. CLEAN TRIGGER INFO MODAL WITH STRATEGY PIVOT NOTE */}
      <RedPillTriggerInfoModal
        trigger={inspectedTrigger}
        onClose={() => setInspectedTrigger(null)}
        isActive={inspectedTrigger ? activeTriggerIds.has(inspectedTrigger.id) : false}
        onToggle={toggleTrigger}
        getCategoryIcon={getCategoryIcon}
      />
    </div>
  );
};

export default RedPillEmotionalMatrix;
