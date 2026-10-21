import React, { useState, useMemo } from 'react';
import {
  Footprints,
  ArrowRight,
  Target,
  Clock,
  Printer,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import {
  generateAcPadayatraPlan,
  type CampaignDuration,
} from '../data/acPadayatraPlanService';

interface AcPadayatraPlannerViewProps {
  acNo: number;
  acName: string;
  targetParty?: string;
  onOpenBoothPadayatra: (boothNo: number) => void;
}

export const AcPadayatraPlannerView: React.FC<AcPadayatraPlannerViewProps> = ({
  acNo,
  acName,
  targetParty = 'INC',
  onOpenBoothPadayatra,
}) => {
  const [duration, setDuration] = useState<CampaignDuration>(30);
  const [selectedMandalFilter, setSelectedMandalFilter] = useState<string>('ALL');
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('ALL');
  const [expandedDay, setExpandedDay] = useState<number | null>(1); // Day 1 expanded by default
  const [searchDayQuery, setSearchDayQuery] = useState<string>('');

  // Generate Plan
  const plan = useMemo(() => {
    return generateAcPadayatraPlan(acNo, acName, duration, targetParty);
  }, [acNo, acName, duration, targetParty]);

  // Filtered Days
  const filteredDays = useMemo(() => {
    return plan.days.filter((d) => {
      if (selectedMandalFilter !== 'ALL' && d.mandalName !== selectedMandalFilter) {
        return false;
      }
      if (selectedPhaseFilter !== 'ALL' && d.phase !== selectedPhaseFilter) {
        return false;
      }
      if (searchDayQuery.trim()) {
        const q = searchDayQuery.toLowerCase().trim();
        const matchesDay = `day ${d.dayNumber}`.includes(q) || String(d.dayNumber) === q;
        const matchesMandal = d.mandalName.toLowerCase().includes(q);
        const matchesLocality = d.villageOrSector.toLowerCase().includes(q);
        const matchesTheme = d.dayTheme.toLowerCase().includes(q);
        const matchesBooth = d.sessions.some(
          (s) => String(s.boothNo) === q || s.boothName.toLowerCase().includes(q)
        );
        if (!matchesDay && !matchesMandal && !matchesLocality && !matchesTheme && !matchesBooth) {
          return false;
        }
      }
      return true;
    });
  }, [plan.days, selectedMandalFilter, selectedPhaseFilter, searchDayQuery]);

  return (
    <div className="space-y-4">
      {/* Hero Header & Duration Selector */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-amber-500/30 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5" />
                AC-Wide Campaign Itinerary
              </span>
              <span className="text-xs text-amber-300 font-mono">
                AC #{acNo} {acName} &middot; {plan.strategySummary.totalBoothsInAc} Total Polling Stations
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-100">
              MLA 15 / 30 / 60 / 90-Day Padayatra &amp; Door-to-Door Campaign Planner
            </h3>
            <p className="text-xs text-amber-200/90 max-w-2xl">
              Constituency-wide walking calendar. Inside every visited booth, the MLA walks sequentially door-to-door without skipping neighbors. Crucial battlegrounds are saturated with multiple visits while safe strongholds and hostile zones are optimized.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-amber-200 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Print Campaign Itinerary"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Roster</span>
            </button>
          </div>
        </div>

        {/* 15 / 30 / 60 / 90 Days Master Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-amber-500/20">
          <button
            type="button"
            onClick={() => {
              setDuration(15);
              setExpandedDay(1);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              duration === 15
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-300'
                : 'bg-black/30 hover:bg-black/50 text-white border-amber-500/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-sm font-mono">⚡ 15 Days</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                duration === 15 ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'
              }`}>
                Rapid Strike
              </span>
            </div>
            <p className={`text-xs mt-1 font-medium ${duration === 15 ? 'text-slate-900' : 'text-slate-300'}`}>
              Final fortnight sprint. 100% focused on razor-thin swing battlegrounds. Fortresses delegated to ward corporators; hostile turf skipped.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setDuration(30);
              setExpandedDay(1);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              duration === 30
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-300'
                : 'bg-black/30 hover:bg-black/50 text-white border-amber-500/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-sm font-mono">⚡ 30 Days</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                duration === 30 ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'
              }`}>
                Battleground Blitz
              </span>
            </div>
            <p className={`text-xs mt-1 font-medium ${duration === 30 ? 'text-slate-900' : 'text-slate-300'}`}>
              High intensity. Skips comfortable strongholds &amp; avoids deep hostile turf. Focuses 100% on swing booths, hitting critical battlegrounds 2x!
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setDuration(60);
              setExpandedDay(1);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              duration === 60
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-300'
                : 'bg-black/30 hover:bg-black/50 text-white border-amber-500/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-sm font-mono">🎯 60 Days</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                duration === 60 ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'
              }`}>
                Balanced Saturation
              </span>
            </div>
            <p className={`text-xs mt-1 font-medium ${duration === 60 ? 'text-slate-900' : 'text-slate-300'}`}>
              Covers all winnable and leaning booths. Top battlegrounds are visited 2 to 3 times, moderate fortresses visited once, hostile strongholds bypassed.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setDuration(90);
              setExpandedDay(1);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              duration === 90
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-300'
                : 'bg-black/30 hover:bg-black/50 text-white border-amber-500/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-sm font-mono">🗺️ 90 Days</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                duration === 90 ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'
              }`}>
                Full AC Footprint
              </span>
            </div>
            <p className={`text-xs mt-1 font-medium ${duration === 90 ? 'text-slate-900' : 'text-slate-300'}`}>
              Complete saturation. Every single booth in the AC is walked door-to-door at least once. Battleground colonies visited 3 times across 3 phases!
            </p>
          </button>
        </div>

        {/* Strategy Rationale & Metrics Strip */}
        <div className="bg-black/40 p-3 rounded-xl border border-amber-500/20 space-y-2.5">
          <div className="flex items-start gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-100 font-medium">
              <strong>Campaign Strategy Rationale:</strong> {plan.strategySummary.rationale}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 border-t border-amber-500/20 text-xs">
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-[10px] text-amber-300/80 uppercase block">Campaign Duration</span>
              <span className="font-mono font-black text-sm text-white">{plan.strategySummary.totalDays} Days</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-[10px] text-amber-300/80 uppercase block">Total Sessions</span>
              <span className="font-mono font-black text-sm text-white">{plan.strategySummary.totalBoothSessions} Sessions</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-[10px] text-amber-300/80 uppercase block">Unique Stations</span>
              <span className="font-mono font-black text-sm text-amber-300">
                {plan.strategySummary.uniqueBoothsVisited} / {plan.strategySummary.totalBoothsInAc}
              </span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-[10px] text-amber-300/80 uppercase block">Battleground Coverage</span>
              <span className="font-mono font-black text-sm text-emerald-400">{plan.strategySummary.battlegroundCoveragePct}%</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-[10px] text-amber-300/80 uppercase block">Repeat Battleground Visits</span>
              <span className="font-mono font-black text-sm text-indigo-300">
                {plan.strategySummary.boothsVisitedTwice + plan.strategySummary.boothsVisitedThrice} Visits
              </span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-[10px] text-amber-300/80 uppercase block">Est. Doors Knocked</span>
              <span className="font-mono font-black text-sm text-white">~{plan.strategySummary.totalDoorsKnocked.toLocaleString()}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-[10px] text-amber-300/80 uppercase block">Voters Reached</span>
              <span className="font-mono font-black text-sm text-white">~{plan.strategySummary.totalVotersContacted.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mandal Breakdown & Filter Ribbon */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700">Filter By Mandal:</span>
            <div className="flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedMandalFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedMandalFilter === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Mandals ({plan.mandalBreakdown.length})
              </button>
              {plan.mandalBreakdown.map((m) => (
                <button
                  key={m.mandalName}
                  type="button"
                  onClick={() => setSelectedMandalFilter(m.mandalName)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedMandalFilter === m.mandalName
                      ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {m.mandalName} ({m.scheduledSessions} visits)
                </button>
              ))}
            </div>
          </div>

          {/* Phase Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedPhaseFilter}
              onChange={(e) => setSelectedPhaseFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 font-medium cursor-pointer"
            >
              <option value="ALL">All Campaign Phases</option>
              <option value="Phase 1: Broad Ground Connect">Phase 1: Broad Ground Connect</option>
              <option value="Phase 2: Battleground Deep Dive">Phase 2: Battleground Deep Dive</option>
              <option value="Phase 3: Final Mobilization Blitz">Phase 3: Final Mobilization Blitz</option>
            </select>
          </div>
        </div>

        {/* Quick Search */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
          <span>
            Showing <strong className="text-slate-900">{filteredDays.length}</strong> of{' '}
            <strong className="text-slate-900">{plan.days.length}</strong> campaign days
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchDayQuery}
              onChange={(e) => setSearchDayQuery(e.target.value)}
              placeholder="Search day, mandal, booth..."
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span className="font-mono text-[11px] text-slate-400 hidden sm:inline">
              Consecutive street walking rule applied
            </span>
          </div>
        </div>
      </div>

      {/* Day-by-Day Itinerary Timeline */}
      <div className="space-y-3">
        {filteredDays.map((day) => {
          const isExpanded = expandedDay === day.dayNumber;
          return (
            <div
              key={day.dayNumber}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
            >
              {/* Day Header Accordion Toggle */}
              <div
                onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                className={`p-3.5 flex flex-wrap items-center justify-between gap-3 cursor-pointer transition-colors ${
                  isExpanded ? 'bg-amber-50/50 border-b border-amber-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="bg-slate-900 text-amber-400 font-mono font-black text-xs px-2.5 py-1 rounded-lg">
                    Day #{day.dayNumber}
                  </span>
                  <span className="font-bold text-sm text-slate-900">
                    {day.mandalName} &middot; <span className="text-slate-600 font-medium">{day.villageOrSector}</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      day.phase === 'Phase 1: Broad Ground Connect'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : day.phase === 'Phase 2: Battleground Deep Dive'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {day.phase}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-[11px] font-bold text-slate-700 block">{day.dayTheme}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      ~{day.totalDayDoors} Doors &middot; ~{day.totalDayVoters} Electors
                    </span>
                  </div>

                  <button
                    type="button"
                    className="p-1 rounded-md hover:bg-slate-200 text-slate-500 cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Day Details (Morning & Evening Sessions) */}
              {isExpanded && (
                <div className="p-4 space-y-3 bg-slate-50/40">
                  {/* Theme & Talking Point Banner */}
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-start gap-2 text-xs">
                    <Target className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">{day.dayTheme}</span>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        <strong className="text-slate-700">Daily Panna Talking Point:</strong> {day.keyTalkingPoint}
                      </p>
                    </div>
                  </div>

                  {/* 2 Sessions Grid: Morning & Evening */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {day.sessions.map((session, sIdx) => {
                      const isMorning = sIdx === 0;
                      return (
                        <div
                          key={sIdx}
                          className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-2.5 flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            {/* Session Header */}
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <div className="flex items-center gap-1.5">
                                <Clock className={`w-3.5 h-3.5 ${isMorning ? 'text-amber-500' : 'text-indigo-500'}`} />
                                <span className="font-bold text-xs text-slate-900">
                                  {session.sessionType}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                    session.triage === 'battleground'
                                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                                      : session.triage === 'vulnerable'
                                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                                      : session.triage === 'fortress'
                                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                      : 'bg-slate-100 text-slate-700 border-slate-300'
                                  }`}
                                >
                                  {session.triage === 'battleground'
                                    ? '🔥 Battleground'
                                    : session.triage === 'vulnerable'
                                    ? '⚠️ Vulnerable Hold'
                                    : session.triage === 'fortress'
                                    ? '🏰 Fortress'
                                    : 'Hostile Turf'}
                                </span>

                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  Round #{session.visitIteration}
                                </span>
                              </div>
                            </div>

                            {/* Booth Details */}
                            <div>
                              <div className="text-xs font-bold text-slate-900">
                                {session.boothName}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                Mandal: <strong className="text-slate-700">{session.mandalName}</strong> &middot;{' '}
                                Locality: <strong className="text-slate-700">{session.locality}</strong>
                              </div>
                            </div>

                            {/* Walking Rule & Demographic Target */}
                            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1.5 text-xs">
                              <div className="text-[11px] text-slate-700">
                                <span className="font-semibold text-slate-900">🚶 Walking Rule: </span>
                                {session.walkingStrategy}
                              </div>
                              <div className="text-[11px] text-slate-700">
                                <span className="font-semibold text-slate-900">👥 Target Voters: </span>
                                {session.targetDemographic} (~{session.targetDoors} doors, ~{session.targetVoters} voters)
                              </div>
                              <div className="text-[11px] text-slate-700">
                                <span className="font-semibold text-slate-900">🎯 Directive: </span>
                                {session.tacticalDirective}
                              </div>
                            </div>
                          </div>

                          {/* 1-Click Bridge to Booth Door-to-Door Route */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-mono">
                              Polling Station #{session.boothNo}
                            </span>
                            <button
                              type="button"
                              onClick={() => onOpenBoothPadayatra(session.boothNo)}
                              className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                              title="Load full voter roll, sequential door route & household talking points for this booth"
                            >
                              <span>Open Booth Doors &amp; Talking Points</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

