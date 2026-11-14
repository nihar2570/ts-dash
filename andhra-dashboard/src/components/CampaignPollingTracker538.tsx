import React, { useState, useMemo, useCallback } from 'react';
import { Vote, Sparkles, CheckCircle2 } from 'lucide-react';
import type { SimulatedConstituencyResult } from '../types';

export interface CampaignPollingTrackerProps {
  activePreset?: string;
  simulatedResults?: SimulatedConstituencyResult[];
  onApplyPreset?: (presetKey: string) => void;
}

interface SimulatedSurvey {
  id: string;
  agency: string;
  date: string;
  sampleSize: number;
  moe: string;
  t: number; // 0.0 (May 2024) to 1.0 (May 2029 General Election)
  ndaVote: number;
  ysrcpVote: number;
}

interface ScenarioTrajectory {
  id: string;
  name: string;
  shortLabel: string;
  swingLabel: string;
  description: string;
  winnerParty: 'NDA' | 'YSRCP';
  projectedSeatsText: string;
  // 6 calibrated control points across [2024, 2025, 2026, 2027, 2028, 2029]
  ndaPoints: number[];
  ysrcpPoints: number[];
  ndaFinal: number;
  ysrcpFinal: number;
  isConsensus?: boolean;
}

// 8 Calibrated Political Scenarios simulated from May 2024 actual results through to May 2029
// Real 2024 Baseline: NDA 56.5% (TDP 45.6% + JSP 8.5% + BJP 2.4%), YSRCP 39.4%
const SCENARIO_TRAJECTORIES: ScenarioTrajectory[] = [
  {
    id: 'consensus_baseline',
    name: 'Consensus Polling Average (Current Drift -2.5%)',
    shortLabel: 'Consensus Drift (-2.5%)',
    swingLabel: '-2.5% NDA',
    winnerParty: 'NDA',
    projectedSeatsText: 'NDA Majority (138–146 Seats)',
    description: 'Current statewide polling trajectory: mild natural incumbency wear with comfortable 2029 NDA majority.',
    ndaPoints: [56.5, 55.6, 54.9, 54.4, 54.2, 54.0],
    ysrcpPoints: [39.4, 40.0, 40.3, 40.6, 40.7, 40.8],
    ndaFinal: 54.0,
    ysrcpFinal: 40.8,
    isConsensus: true,
  },
  {
    id: 'super_six_surge',
    name: 'Amaravati Capital & Super-Six Surge (+1.5%)',
    shortLabel: 'Amaravati Surge (+1.5%)',
    swingLabel: '+1.5% NDA',
    winnerParty: 'NDA',
    projectedSeatsText: 'NDA Supermajority (155–165 Seats)',
    description: 'Rapid capital delivery, industrial investments, and DBT execution expand NDA dominance into 2029.',
    ndaPoints: [56.5, 56.8, 57.2, 57.6, 57.8, 58.0],
    ysrcpPoints: [39.4, 39.0, 38.4, 37.8, 37.3, 37.0],
    ndaFinal: 58.0,
    ysrcpFinal: 37.0,
  },
  {
    id: 'mild_anti_incumbency',
    name: 'Moderate Anti-Incumbency Erosion (-5.0%)',
    shortLabel: 'Mild Anti-Incumbency (-5.0%)',
    swingLabel: '-5.0% NDA',
    winnerParty: 'NDA',
    projectedSeatsText: 'NDA Moderate Majority (112–122 Seats)',
    description: 'Natural 5-year anti-incumbency fatigue trims NDA lead by 5 points by 2029.',
    ndaPoints: [56.5, 55.4, 54.3, 53.2, 52.3, 51.5],
    ysrcpPoints: [39.4, 40.2, 41.0, 41.6, 42.1, 42.5],
    ndaFinal: 51.5,
    ysrcpFinal: 42.5,
  },
  {
    id: 'welfare_backlash_wave',
    name: '2019-Style Pro-Welfare Surge (YSRCP Comeback)',
    shortLabel: 'Welfare Wave (YSRCP Win)',
    swingLabel: '+8.8% YSRCP',
    winnerParty: 'YSRCP',
    projectedSeatsText: 'YSRCP Clear Majority (104–116 Seats)',
    description: 'Rural welfare nostalgia, farm compensation frustration, and Navaratnalu sentiment trigger an 8.8% surge, returning YSRCP to power.',
    ndaPoints: [56.5, 54.8, 52.4, 49.5, 47.0, 45.5],
    ysrcpPoints: [39.4, 41.2, 43.6, 45.8, 47.4, 48.2],
    ndaFinal: 45.5,
    ysrcpFinal: 48.2,
  },
  {
    id: 'jsp_breakaway_split',
    name: 'JSP Exits Coalition / 3-Way Contest (YSRCP Win)',
    shortLabel: 'JSP Split (YSRCP Win)',
    swingLabel: 'Opposition Split',
    winnerParty: 'YSRCP',
    projectedSeatsText: 'YSRCP Majority (98–108 Seats)',
    description: 'Pawan Kalyan exits NDA in 2027 to contest independently. The split anti-YSRCP vote hands YSRCP a clean legislative majority.',
    ndaPoints: [56.5, 54.6, 51.8, 46.2, 43.5, 42.0],
    ysrcpPoints: [39.4, 40.5, 41.8, 43.0, 44.0, 44.8],
    ndaFinal: 42.0,
    ysrcpFinal: 44.8,
  },
  {
    id: 'dalit_minority_consolidation',
    name: 'Minority & Dalit Polarized Shift (YSRCP Edge)',
    shortLabel: 'Minority Shift (YSRCP Edge)',
    swingLabel: '+7.6% YSRCP',
    winnerParty: 'YSRCP',
    projectedSeatsText: 'YSRCP Narrow Majority (90–98 Seats)',
    description: 'Central policy backlash and SC sub-categorization tensions consolidate Minority and Dalit blocks behind YSRCP, flipping Rayalaseema.',
    ndaPoints: [56.5, 55.0, 53.2, 50.8, 48.2, 46.2],
    ysrcpPoints: [39.4, 40.8, 42.4, 44.2, 45.8, 47.0],
    ndaFinal: 46.2,
    ysrcpFinal: 47.0,
  },
  {
    id: 'coalition_friction',
    name: 'Coalition Friction & JSP Seat Ultimatum (-6.5%)',
    shortLabel: 'Coalition Friction (-6.5%)',
    swingLabel: '-6.5% NDA',
    winnerParty: 'NDA',
    projectedSeatsText: 'NDA Razor-Thin Majority (94–102 Seats)',
    description: 'Kapu-Kamma friction and ticket distribution discord push NDA down to the critical 50% mark by 2029.',
    ndaPoints: [56.5, 55.2, 53.8, 52.2, 51.0, 50.0],
    ysrcpPoints: [39.4, 40.3, 41.4, 42.4, 43.2, 43.8],
    ndaFinal: 50.0,
    ysrcpFinal: 43.8,
  },
  {
    id: 'max_crisis_stress',
    name: 'Full Ground Crisis & Fiscal Freeze (-10.0%)',
    shortLabel: 'Dead Heat Crisis (-10.0%)',
    swingLabel: '-10.0% NDA',
    winnerParty: 'NDA',
    projectedSeatsText: 'Hung Assembly / Dead Heat (87–89 Seats each)',
    description: 'Severe fiscal overdraft freeze, caste quota disputes, and leadership arrest produce a 2029 photo-finish dead heat.',
    ndaPoints: [56.5, 54.4, 52.0, 49.8, 48.0, 46.5],
    ysrcpPoints: [39.4, 40.9, 42.6, 44.0, 45.2, 46.2],
    ndaFinal: 46.5,
    ysrcpFinal: 46.2,
  },
];

// Historical and field surveys plotted across the 2024-2029 timeline
const SIMULATED_SURVEYS: SimulatedSurvey[] = [
  { id: 's1', agency: 'Post-Poll Mood Benchmark', date: 'Aug 2024', sampleSize: 22000, moe: '±2.1%', t: 0.05, ndaVote: 56.2, ysrcpVote: 39.8 },
  { id: 's2', agency: 'Lok Poll Wave 1', date: 'Nov 2024', sampleSize: 18500, moe: '±2.4%', t: 0.10, ndaVote: 55.4, ysrcpVote: 40.2 },
  { id: 's3', agency: 'Karvy Insights', date: 'Feb 2025', sampleSize: 14000, moe: '±2.6%', t: 0.15, ndaVote: 54.8, ysrcpVote: 40.5 },
  { id: 's4', agency: 'Matrize Research', date: 'May 2025', sampleSize: 24000, moe: '±2.0%', t: 0.20, ndaVote: 55.1, ysrcpVote: 39.9 },
  { id: 's5', agency: 'Jan Ki Baat', date: 'Aug 2025', sampleSize: 15200, moe: '±2.5%', t: 0.25, ndaVote: 54.2, ysrcpVote: 41.1 },
  { id: 's6', agency: 'C-Voter Tracker 1', date: 'Nov 2025', sampleSize: 32400, moe: '±1.8%', t: 0.30, ndaVote: 53.6, ysrcpVote: 41.8 },
  { id: 's7', agency: 'VMR Research', date: 'Feb 2026', sampleSize: 19800, moe: '±2.2%', t: 0.35, ndaVote: 54.5, ysrcpVote: 40.3 },
  { id: 's8', agency: 'South First-Dakshin', date: 'May 2026', sampleSize: 22000, moe: '±2.1%', t: 0.40, ndaVote: 53.9, ysrcpVote: 41.2 },
  { id: 's9', agency: "People's Pulse Wave 1", date: 'Aug 2026', sampleSize: 41200, moe: '±1.6%', t: 0.45, ndaVote: 54.4, ysrcpVote: 40.6 },
  { id: 's10', agency: 'NewsX-Polstrat', date: 'Nov 2026', sampleSize: 18000, moe: '±2.3%', t: 0.50, ndaVote: 54.8, ysrcpVote: 39.8 },
  { id: 's11', agency: 'Times Now-JVC', date: 'May 2027', sampleSize: 26500, moe: '±2.0%', t: 0.60, ndaVote: 53.7, ysrcpVote: 41.5 },
  { id: 's12', agency: 'Republic-Matrize', date: 'Nov 2027', sampleSize: 35000, moe: '±1.7%', t: 0.70, ndaVote: 54.6, ysrcpVote: 40.1 },
  { id: 's13', agency: 'Axis My India Mid-Term', date: 'May 2028', sampleSize: 48000, moe: '±1.5%', t: 0.80, ndaVote: 54.2, ysrcpVote: 40.5 },
  { id: 's14', agency: 'ETG Research Pre-Poll', date: 'Nov 2028', sampleSize: 38000, moe: '±1.6%', t: 0.90, ndaVote: 54.1, ysrcpVote: 40.7 },
  { id: 's15', agency: "Today's Chanakya 2029 Final", date: 'Apr 2029', sampleSize: 52000, moe: '±1.4%', t: 0.98, ndaVote: 54.0, ysrcpVote: 40.8 },
];

export const CampaignPollingTracker538: React.FC<CampaignPollingTrackerProps> = ({
  activePreset: _activePreset,
  simulatedResults: _simulatedResults = [],
  onApplyPreset: _onApplyPreset,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [hoveredScenarioId, setHoveredScenarioId] = useState<string | null>(null);

  // Active highlighted scenario (either clicked or hovered)
  const activeScenarioId = hoveredScenarioId || selectedScenarioId;

  // --- Nate Silver 538 SVG Chart Geometry ---
  const svgWidth = 940;
  const svgHeight = 350;
  const paddingLeft = 55;
  const paddingRight = 175;
  const paddingTop = 44;
  const paddingBottom = 48;
  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  const minY = 32;
  const maxY = 62;

  const valToY = useCallback((v: number) => {
    const clamped = Math.max(minY, Math.min(maxY, v));
    const fraction = (clamped - minY) / (maxY - minY);
    return paddingTop + chartH - fraction * chartH;
  }, [chartH, paddingTop]);

  // Convert surveys into SVG scatter points
  const chartPoints = useMemo(() => {
    return SIMULATED_SURVEYS.map((s) => {
      const x = paddingLeft + s.t * chartW;
      const lead = Number((s.ndaVote - s.ysrcpVote).toFixed(1));
      const radius = 3.8 + Math.min(2.2, (s.sampleSize / 50000) * 2.2);

      return {
        ...s,
        lead,
        x,
        yNda: valToY(s.ndaVote),
        yYsrcp: valToY(s.ysrcpVote),
        radius,
      };
    });
  }, [chartW, paddingLeft, valToY]);

  // Helper to build smooth cubic bezier curve through control points
  const buildBezierFromPoints = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  // Pre-calculate SVG bezier curves for each scenario trajectory spanning 2024 to 2029
  const scenarioPaths = useMemo(() => {
    return SCENARIO_TRAJECTORIES.map((scenario) => {
      const ndaCoords = scenario.ndaPoints.map((vote, idx) => {
        const t = idx / (scenario.ndaPoints.length - 1);
        return { x: paddingLeft + t * chartW, y: valToY(vote) };
      });
      const ysrcpCoords = scenario.ysrcpPoints.map((vote, idx) => {
        const t = idx / (scenario.ysrcpPoints.length - 1);
        return { x: paddingLeft + t * chartW, y: valToY(vote) };
      });

      return {
        ...scenario,
        ndaPath: buildBezierFromPoints(ndaCoords),
        ysrcpPath: buildBezierFromPoints(ysrcpCoords),
        finalX: paddingLeft + chartW,
        finalY_nda: valToY(scenario.ndaFinal),
        finalY_ysrcp: valToY(scenario.ysrcpFinal),
      };
    });
  }, [chartW, paddingLeft, valToY]);

  const yGridLines = [35, 40, 45, 50, 55, 60];

  // Periodic timeline labels for X-axis spanning May 2024 to May 2029 (5-Year Mandate)
  const timelineTicks = [
    { primaryLabel: 'May 2024', subLabel: 'ECI Actual', t: 0.00, isAnchor: true },
    { primaryLabel: '2025', subLabel: 'Yr 1', t: 0.20 },
    { primaryLabel: '2026', subLabel: 'Yr 2', t: 0.40 },
    { primaryLabel: '2027', subLabel: 'Yr 3', t: 0.60 },
    { primaryLabel: '2028', subLabel: 'Yr 4', t: 0.80 },
    { primaryLabel: 'May 2029', subLabel: 'Election', t: 1.00, isEnd: true },
  ];

  const hoveredPoint = hoveredIndex !== null ? chartPoints[hoveredIndex] : null;

  return (
    <div className="bg-slate-950/95 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-lg space-y-4 animate-in fade-in duration-150">
      {/* Header & Scenario Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Vote className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-wide">
                Vote Share Journey: 2024 Real Result &rarr; 2029 Mandate Scenarios
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700/60">
                2024 Baseline &rarr; 2029 Horizon
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Starts from May 2024 actual results and models full 5-year trajectories, including competitive YSRCP resurgence &amp; victory pathways.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-bold flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 rounded bg-amber-400 inline-block ring-2 ring-amber-400/20" />
            <span className="text-amber-200">NDA Trajectories</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 rounded bg-sky-400 inline-block ring-2 ring-sky-400/20" />
            <span className="text-sky-200">YSRCP Trajectories</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500/60 inline-block" />
            <span className="text-slate-400">Muted Survey Dots</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <span className="w-3 border-t-2 border-dashed border-slate-500 inline-block" />
            <span>50% Majority Threshold</span>
          </div>
        </div>
      </div>

      {/* Multi-line Scenario Selector Tabs (Multi-line wrap, no scrollbars) */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-1 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Scenarios:</span>
        </span>

        <button
          onClick={() => {
            setSelectedScenarioId(null);
            setHoveredScenarioId(null);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
            !activeScenarioId
              ? 'bg-slate-800 text-white border-slate-600 shadow-xs'
              : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800'
          }`}
        >
          All 8 Scenario Lines
        </button>

        {SCENARIO_TRAJECTORIES.map((sc) => {
          const isSelected = activeScenarioId === sc.id;
          const isYsrcpWin = sc.winnerParty === 'YSRCP';

          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenarioId(isSelected ? null : sc.id)}
              onMouseEnter={() => setHoveredScenarioId(sc.id)}
              onMouseLeave={() => setHoveredScenarioId(null)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all border flex items-center gap-1.5 ${
                isSelected
                  ? isYsrcpWin
                    ? 'bg-sky-950 text-sky-200 border-sky-500 shadow-xs ring-1 ring-sky-500/30 font-black'
                    : 'bg-amber-950 text-amber-200 border-amber-600 shadow-xs ring-1 ring-amber-500/30 font-black'
                  : isYsrcpWin
                  ? 'bg-sky-950/40 text-sky-300 hover:bg-sky-900/60 border-sky-800/60'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-850 hover:text-white border-slate-800'
              }`}
            >
              <span>{sc.shortLabel}</span>
              <span
                className={`text-[10px] font-mono px-1 py-0.2 rounded border ${
                  isYsrcpWin
                    ? 'bg-sky-900/60 text-sky-300 border-sky-700'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isYsrcpWin ? `${sc.ysrcpFinal}% YSRCP` : `${sc.ndaFinal}% NDA`}
              </span>
            </button>
          );
        })}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
          style={{ minHeight: '280px' }}
        >
          <defs>
            {/* Soft Glow Filter for active trajectory */}
            <filter id="activeLineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Lines & Y-Axis Labels */}
          {yGridLines.map((v) => {
            const y = valToY(v);
            const is50 = v === 50;
            return (
              <g key={v}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={paddingLeft + chartW}
                  y2={y}
                  stroke={is50 ? '#64748b' : '#1e293b'}
                  strokeWidth={is50 ? 1.5 : 1}
                  strokeDasharray={is50 ? '4 3' : '2 2'}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className={`text-[10px] font-mono font-bold ${
                    is50 ? 'fill-slate-200' : 'fill-slate-400'
                  }`}
                >
                  {v}%
                </text>
              </g>
            );
          })}

          {/* Timeline X-Axis Periodic Guidelines & Non-Overlapping Labels */}
          {timelineTicks.map((tick) => {
            const x = paddingLeft + tick.t * chartW;
            const isAnchor = tick.isAnchor;
            const isEnd = tick.isEnd;

            return (
              <g key={tick.primaryLabel}>
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={paddingTop + chartH}
                  stroke={isAnchor ? '#d97706' : isEnd ? '#6366f1' : '#1e293b'}
                  strokeWidth={isAnchor || isEnd ? 1.5 : 1}
                  strokeDasharray={isAnchor || isEnd ? undefined : '2 3'}
                />
                {/* Primary Year Label */}
                <text
                  x={x}
                  y={paddingTop + chartH + 15}
                  textAnchor="middle"
                  className={`text-[10px] font-mono font-bold ${
                    isAnchor
                      ? 'fill-amber-400 font-black'
                      : isEnd
                      ? 'fill-indigo-300 font-black'
                      : 'fill-slate-300 font-bold'
                  }`}
                >
                  {tick.primaryLabel}
                </text>
                {/* Secondary Sub Label */}
                <text
                  x={x}
                  y={paddingTop + chartH + 26}
                  textAnchor="middle"
                  className={`text-[8px] font-mono uppercase tracking-wider ${
                    isAnchor
                      ? 'fill-amber-500/80 font-bold'
                      : isEnd
                      ? 'fill-indigo-400/80 font-bold'
                      : 'fill-slate-500'
                  }`}
                >
                  {tick.subLabel}
                </text>
              </g>
            );
          })}

          {/* Real 2024 ECI Baseline Origin Pin (May 2024) - Generous width to prevent text overflow */}
          <g transform={`translate(${paddingLeft}, ${paddingTop - 18})`}>
            <rect
              x={-4}
              y={-14}
              width={246}
              height={20}
              rx={5}
              fill="#78350f"
              stroke="#d97706"
              strokeWidth={1}
            />
            <text
              x={119}
              y={0}
              textAnchor="middle"
              className="text-[10px] font-mono font-black fill-amber-200"
            >
              2024 Actual: NDA 56.5% | YSRCP 39.4%
            </text>
          </g>

          {/* 2029 Mandate Finish Marker Flag */}
          <g transform={`translate(${paddingLeft + chartW}, ${paddingTop - 18})`}>
            <rect
              x={-108}
              y={-14}
              width={108}
              height={20}
              rx={5}
              fill="#1e1b4b"
              stroke="#6366f1"
              strokeWidth={1}
            />
            <text
              x={-54}
              y={0}
              textAnchor="middle"
              className="text-[10px] font-mono font-black fill-indigo-200"
            >
              2029 Horizon &rarr;
            </text>
          </g>

          {/* Multiple Scenario Trajectory Lines (The Fan / Spaghetti Cone to 2029) */}
          {scenarioPaths.map((sc) => {
            const isHighlighted = activeScenarioId === sc.id;
            const isFaded = activeScenarioId !== null && !isHighlighted;
            const isConsensus = sc.isConsensus;
            const isYsrcpWin = sc.winnerParty === 'YSRCP';

            // Stroke styling
            const strokeWidth = isHighlighted ? 3.5 : isConsensus ? 3.0 : 1.75;
            const strokeOpacity = isHighlighted ? 1.0 : isFaded ? 0.2 : isConsensus ? 0.9 : 0.55;

            return (
              <g
                key={sc.id}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredScenarioId(sc.id)}
                onMouseLeave={() => setHoveredScenarioId(null)}
                onClick={() => setSelectedScenarioId(activeScenarioId === sc.id ? null : sc.id)}
              >
                {/* Invisible Hover Path for Easy Selection */}
                <path
                  d={sc.ndaPath}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={14}
                />

                {/* NDA Trajectory Line */}
                <path
                  d={sc.ndaPath}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth={strokeWidth}
                  strokeOpacity={strokeOpacity}
                  strokeLinecap="round"
                  filter={isHighlighted ? 'url(#activeLineGlow)' : undefined}
                />

                {/* YSRCP Trajectory Line (Curves gracefully over NDA in win scenarios) */}
                <path
                  d={sc.ysrcpPath}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={strokeWidth}
                  strokeOpacity={strokeOpacity}
                  strokeLinecap="round"
                  filter={isHighlighted ? 'url(#activeLineGlow)' : undefined}
                />

                {/* Endcap Dots & Badges for each scenario in 2029 */}
                <circle
                  cx={sc.finalX}
                  cy={sc.finalY_nda}
                  r={isHighlighted ? 4.5 : 3.0}
                  fill="#f59e0b"
                  fillOpacity={strokeOpacity}
                  stroke="#020617"
                  strokeWidth={1}
                />
                <circle
                  cx={sc.finalX}
                  cy={sc.finalY_ysrcp}
                  r={isHighlighted ? 4.5 : 3.0}
                  fill="#38bdf8"
                  fillOpacity={strokeOpacity}
                  stroke="#020617"
                  strokeWidth={1}
                />

                {/* Right Margin Endcap Labels for 2029 projection */}
                {(isHighlighted || isConsensus) && (
                  <g transform={`translate(${sc.finalX + 12}, 0)`}>
                    {/* YSRCP 2029 Badge */}
                    <rect
                      x={0}
                      y={sc.finalY_ysrcp - 11}
                      width={140}
                      height={22}
                      rx={5}
                      fill={isYsrcpWin ? '#0369a1' : '#0c4a6e'}
                      stroke={isYsrcpWin ? '#38bdf8' : '#0284c7'}
                      strokeWidth={isYsrcpWin ? 1.5 : 1}
                    />
                    <text
                      x={70}
                      y={sc.finalY_ysrcp + 4}
                      textAnchor="middle"
                      className={`text-[10px] font-mono font-black ${
                        isYsrcpWin ? 'fill-white' : 'fill-sky-200'
                      }`}
                    >
                      YSRCP {sc.ysrcpFinal}% {isYsrcpWin ? '★ WIN' : ''}
                    </text>

                    {/* NDA 2029 Badge */}
                    <rect
                      x={0}
                      y={sc.finalY_nda - 11}
                      width={140}
                      height={22}
                      rx={5}
                      fill={!isYsrcpWin ? '#78350f' : '#451a03'}
                      stroke={!isYsrcpWin ? '#d97706' : '#92400e'}
                      strokeWidth={!isYsrcpWin ? 1.5 : 1}
                    />
                    <text
                      x={70}
                      y={sc.finalY_nda + 4}
                      textAnchor="middle"
                      className={`text-[10px] font-mono font-black ${
                        !isYsrcpWin ? 'fill-amber-200' : 'fill-amber-400/80'
                      }`}
                    >
                      NDA {sc.ndaFinal}% ({sc.swingLabel})
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Muted Grey Survey Dots (Background empirical observations) */}
          {chartPoints.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;

            return (
              <g
                key={`dots-${pt.id}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Hit Area */}
                <rect
                  x={pt.x - 12}
                  y={paddingTop}
                  width={24}
                  height={chartH}
                  fill="transparent"
                />

                {/* Vertical Guide when Hovered */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingTop}
                    x2={pt.x}
                    y2={paddingTop + chartH}
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                  />
                )}

                {/* Muted Grey NDA Survey Dot (Soft slate by default, lights up on hover) */}
                <circle
                  cx={pt.x}
                  cy={pt.yNda}
                  r={isHovered ? pt.radius + 3 : pt.radius - 0.5}
                  fill={isHovered ? '#f59e0b' : '#64748b'}
                  fillOpacity={isHovered ? 1.0 : 0.45}
                  stroke={isHovered ? '#ffffff' : '#334155'}
                  strokeWidth={isHovered ? 2 : 1}
                  className="transition-all duration-150"
                />

                {/* Muted Grey YSRCP Survey Dot (Soft slate by default, lights up on hover) */}
                <circle
                  cx={pt.x}
                  cy={pt.yYsrcp}
                  r={isHovered ? pt.radius + 3 : pt.radius - 0.5}
                  fill={isHovered ? '#38bdf8' : '#64748b'}
                  fillOpacity={isHovered ? 1.0 : 0.45}
                  stroke={isHovered ? '#ffffff' : '#334155'}
                  strokeWidth={isHovered ? 2 : 1}
                  className="transition-all duration-150"
                />

                {/* Value Tags when Hovered */}
                {isHovered && (
                  <>
                    <text
                      x={pt.x}
                      y={pt.yNda - pt.radius - 4}
                      textAnchor="middle"
                      className="text-[10px] font-mono font-bold fill-amber-300 drop-shadow-md select-none"
                    >
                      {pt.ndaVote}%
                    </text>
                    <text
                      x={pt.x}
                      y={pt.yYsrcp + pt.radius + 12}
                      textAnchor="middle"
                      className="text-[10px] font-mono font-bold fill-sky-300 drop-shadow-md select-none"
                    >
                      {pt.ysrcpVote}%
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Real 2024 Origin Pins (May 2024 Actual Baseline) */}
          <g>
            {/* NDA Origin Pin */}
            <circle
              cx={paddingLeft}
              cy={valToY(56.5)}
              r={5.5}
              fill="#f59e0b"
              stroke="#ffffff"
              strokeWidth={2}
            />
            {/* YSRCP Origin Pin */}
            <circle
              cx={paddingLeft}
              cy={valToY(39.4)}
              r={5.5}
              fill="#38bdf8"
              stroke="#ffffff"
              strokeWidth={2}
            />
          </g>
        </svg>

        {/* Interactive Floating Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute pointer-events-none z-20 bg-slate-900 border border-slate-700 rounded-xl p-2.5 shadow-2xl text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100"
            style={{
              left: `${Math.min(75, Math.max(15, (hoveredPoint.x / svgWidth) * 100))}%`,
              top: '12px',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1">
              <strong className="text-white font-bold">{hoveredPoint.agency}</strong>
              <span className="text-[10px] text-slate-400 font-mono">{hoveredPoint.date}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[11px] font-mono">
              <span className="text-amber-400 font-bold">NDA: {hoveredPoint.ndaVote}%</span>
              <span className="text-sky-400 font-bold">YSRCP: {hoveredPoint.ysrcpVote}%</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
              <span>
                Lead: <strong className="text-emerald-400 font-mono">+{hoveredPoint.lead}% NDA</strong>
              </span>
              <span>
                Sample: <strong className="text-slate-300 font-mono">{hoveredPoint.sampleSize.toLocaleString()}</strong> ({hoveredPoint.moe})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Active Scenario 2029 Projection Summary Card */}
      {activeScenarioId && (
        <div
          className={`border rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-100 ${
            SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.winnerParty === 'YSRCP'
              ? 'bg-sky-950/70 border-sky-800/80'
              : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.winnerParty ===
                  'YSRCP'
                    ? 'bg-sky-400'
                    : 'bg-amber-400'
                }`}
              />
              <h5 className="text-xs font-bold text-white">
                {SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.name}
              </h5>
              <span
                className={`text-[10px] font-mono px-2 py-0.2 rounded font-black border flex items-center gap-1 ${
                  SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.winnerParty ===
                  'YSRCP'
                    ? 'bg-sky-900 text-sky-200 border-sky-600'
                    : 'bg-indigo-950 text-indigo-300 border-indigo-800'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>
                  {SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.projectedSeatsText}
                </span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.description}
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span
              className={
                SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.winnerParty ===
                'YSRCP'
                  ? 'text-sky-300 font-black text-sm'
                  : 'text-sky-300 font-bold'
              }
            >
              2029 YSRCP: {SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.ysrcpFinal}%
            </span>
            <span className="text-slate-600">&middot;</span>
            <span
              className={
                SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.winnerParty === 'NDA'
                  ? 'text-amber-300 font-black text-sm'
                  : 'text-amber-400/80 font-bold'
              }
            >
              2029 NDA: {SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.ndaFinal}%
            </span>
            <span className="text-slate-600">&middot;</span>
            <span
              className={`font-black ${
                SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.winnerParty ===
                'YSRCP'
                  ? 'text-sky-400'
                  : 'text-emerald-400'
              }`}
            >
              {SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.winnerParty === 'YSRCP'
                ? `+${Number(
                    (
                      (SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.ysrcpFinal ||
                        0) -
                      (SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.ndaFinal || 0)
                    ).toFixed(1)
                  )}% YSRCP WIN`
                : `+${Number(
                    (
                      (SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.ndaFinal ||
                        0) -
                      (SCENARIO_TRAJECTORIES.find((s) => s.id === activeScenarioId)?.ysrcpFinal ||
                        0)
                    ).toFixed(1)
                  )}% NDA WIN`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignPollingTracker538;
