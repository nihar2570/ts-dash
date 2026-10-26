import React, { useState, useMemo } from 'react';
import type { DemographicsDataset } from '../types';
import { getPartyColor } from '../types';
import {
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle,
  TrendingDown,
  Sparkles,
  Search,
  ShieldAlert
} from 'lucide-react';

export interface DefectionEvent {
  id: string;
  acNo: number;
  leaderName: string;
  eventType: 'defection' | 'rebel_spoiler';
  fromParty: 'TDP' | 'YSRCP' | 'JSP' | 'BJP' | 'INC';
  toParty: 'TDP' | 'YSRCP' | 'JSP' | 'BJP' | 'IND' | 'INC';
  cadreTransferPct: number; // e.g. 8% of total AC votes moves to toParty
  backlashPct: number; // e.g. 2.5% lost due to anti-defection voter cynicism
  notes: string;
  enabled: boolean;
}

export const PRESET_SCENARIOS: Omit<DefectionEvent, 'id'>[] = [
  {
    acNo: 71, // Gannavaram (Krishna)
    leaderName: 'Sitting MLA Cross-Over & Faction (Gannavaram)',
    eventType: 'defection',
    fromParty: 'YSRCP',
    toParty: 'TDP',
    cadreTransferPct: 9.5,
    backlashPct: 2.5,
    notes: 'High-profile crossing over in Amaravati peri-urban corridor brings mandal corporators to NDA.',
    enabled: true,
  },
  {
    acNo: 91, // Tenali (Guntur)
    leaderName: 'Aggrieved Rebel Aspirant (Tenali)',
    eventType: 'rebel_spoiler',
    fromParty: 'TDP',
    toParty: 'IND',
    cadreTransferPct: 7.5,
    backlashPct: 1.5,
    notes: 'TDP-JSP seat-sharing friction: denied ticket aspirant enters as independent, siphoning alliance votes.',
    enabled: true,
  },
  {
    acNo: 166, // Tirupati (Tirupati)
    leaderName: 'Sitting Municipal Mayor / Ex-MLA Heavyweight',
    eventType: 'defection',
    fromParty: 'YSRCP',
    toParty: 'JSP',
    cadreTransferPct: 10.0,
    backlashPct: 2.0,
    notes: 'Major urban temple city leadership switch consolidates Balija/Kapu and business voter turnout for Janasena.',
    enabled: true,
  },
  {
    acNo: 37, // Pithapuram (Kakinada)
    leaderName: 'Aggrieved Local Constituency In-Charge',
    eventType: 'rebel_spoiler',
    fromParty: 'YSRCP',
    toParty: 'IND',
    cadreTransferPct: 6.8,
    backlashPct: 1.0,
    notes: 'Internal rebellion in YSRCP ranks against centralized party high-command nominee.',
    enabled: true,
  },
  {
    acNo: 175, // Kuppam (Chittoor)
    leaderName: 'Mandal Parishad President Heavyweight (Kuppam)',
    eventType: 'defection',
    fromParty: 'YSRCP',
    toParty: 'TDP',
    cadreTransferPct: 8.5,
    backlashPct: 1.8,
    notes: 'Ground consolidation of village sarpanches strengthens Chandrababu Naidu fortress.',
    enabled: true,
  },
];

export interface DefectionRebelModelerProps {
  data: DemographicsDataset;
  onOpenDossier?: (acNo: number) => void;
  events?: DefectionEvent[];
  onEventsChange?: (events: DefectionEvent[]) => void;
  cumulativeAcImpacts?: Record<number, {
    resourceSwing: number;
    starLift: number;
    totalCumulativeSwing: number;
    cumulativeProjectedMargin: number;
    isCumulativelyFlipped: boolean;
  }>;
}

export const DefectionRebelModeler: React.FC<DefectionRebelModelerProps> = ({
  data,
  onOpenDossier,
  events: externalEvents,
  onEventsChange,
  cumulativeAcImpacts,
}) => {
  const [internalEvents, setInternalEvents] = useState<DefectionEvent[]>(() =>
    PRESET_SCENARIOS.map((s, idx) => ({ ...s, id: `preset_${idx + 1}` }))
  );

  const events = externalEvents !== undefined ? externalEvents : internalEvents;
  const setEvents = (updater: React.SetStateAction<DefectionEvent[]>) => {
    if (onEventsChange) {
      if (typeof updater === 'function') {
        const next = updater(events);
        onEventsChange(next);
      } else {
        onEventsChange(updater);
      }
    } else {
      setInternalEvents(updater);
    }
  };

  // New Event Form State
  const [formAcNo, setFormAcNo] = useState<number>(175); // Default to Kuppam (#175)
  const [formType, setFormType] = useState<'defection' | 'rebel_spoiler'>('defection');
  const [formLeaderName, setFormLeaderName] = useState('Senior Constituency Heavyweight');
  const [formFromParty, setFormFromParty] = useState<'TDP' | 'YSRCP' | 'JSP' | 'BJP'>('YSRCP');
  const [formToParty, setFormToParty] = useState<'TDP' | 'YSRCP' | 'JSP' | 'BJP' | 'IND'>('TDP');
  const [formCadreTransfer, setFormCadreTransfer] = useState<number>(8.0);
  const [formBacklash, setFormBacklash] = useState<number>(2.5);
  const [formNotes, setFormNotes] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Add event
  const handleAddEvent = () => {
    const newEvent: DefectionEvent = {
      id: `evt_${Date.now()}`,
      acNo: formAcNo,
      leaderName: formLeaderName.trim() || 'Constituency Leader',
      eventType: formType,
      fromParty: formFromParty,
      toParty: formType === 'rebel_spoiler' ? 'IND' : formToParty,
      cadreTransferPct: formCadreTransfer,
      backlashPct: formBacklash,
      notes: formNotes || (formType === 'defection' ? 'Cross-party defection' : 'Rebel independent spoiler'),
      enabled: true,
    };

    setEvents((prev) => [newEvent, ...prev]);
    setIsFormOpen(false);
    setFormNotes('');
  };

  // Toggle event enabled
  const toggleEvent = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, enabled: !e.enabled } : e))
    );
  };

  // Delete event
  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Reset to default presets
  const handleReset = () => {
    setEvents(PRESET_SCENARIOS.map((s, idx) => ({ ...s, id: `preset_${idx + 1}` })));
  };

  // Clear all
  const handleClearAll = () => {
    setEvents([]);
  };

  // Compute live impacts for each event
  const analyzedEvents = useMemo(() => {
    return events.map((evt) => {
      const ac = data.constituencies[evt.acNo];
      if (!ac) return null;

      const baselineWinner = ac.winner_2023.party;
      const baselineMargin = ac.margin_2023;
      const totalEstimatedVotes = 185000;

      // Transfer votes
      const transferredVotes = Math.round((evt.cadreTransferPct / 100) * totalEstimatedVotes);
      const backlashVotes = Math.round((evt.backlashPct / 100) * totalEstimatedVotes);

      // Baseline winner vote estimate ~ 85,000, runner ~ 75,000
      let projectedWinner = baselineWinner;
      let projectedMargin = baselineMargin;
      let isFlipped = false;
      let flipWinner = '';

      if (evt.enabled) {
        if (evt.eventType === 'defection') {
          // If fromParty was the winner and toParty was the runner-up:
          if (baselineWinner === evt.fromParty && ac.runner_up_2023.party === evt.toParty) {
            // Net shift = 2 * transferredVotes + backlash
            const totalSwing = (2 * transferredVotes) + backlashVotes;
            projectedMargin = baselineMargin - totalSwing;
            if (projectedMargin < 0) {
              isFlipped = true;
              projectedWinner = evt.toParty;
              projectedMargin = Math.abs(projectedMargin);
              flipWinner = evt.toParty;
            }
          } else if (ac.runner_up_2023.party === evt.fromParty && baselineWinner === evt.toParty) {
            // Target party was already winning, margin expands
            projectedMargin = baselineMargin + (2 * transferredVotes) + backlashVotes;
          } else {
            // General shift
            const totalShift = transferredVotes + backlashVotes;
            if (baselineWinner === evt.fromParty && totalShift > baselineMargin) {
              isFlipped = true;
              projectedWinner = evt.toParty;
              flipWinner = evt.toParty;
              projectedMargin = totalShift - baselineMargin;
            }
          }
        } else {
          // Rebel spoiler: Siphons votes from fromParty
          if (baselineWinner === evt.fromParty) {
            const loss = transferredVotes + backlashVotes;
            projectedMargin = baselineMargin - loss;
            if (projectedMargin < 0) {
              isFlipped = true;
              projectedWinner = ac.runner_up_2023.party;
              flipWinner = ac.runner_up_2023.party;
              projectedMargin = Math.abs(projectedMargin);
            }
          } else {
            // Rebel from the runner-up makes winner win bigger
            projectedMargin = baselineMargin + transferredVotes;
          }
        }
      }

      return {
        ...evt,
        acName: ac.ac_name,
        district: ac.district,
        baselineWinner,
        baselineRunner: ac.runner_up_2023.party,
        baselineMargin,
        transferredVotes,
        backlashVotes,
        projectedWinner,
        projectedMargin,
        isFlipped,
        flipWinner,
      };
    }).filter(Boolean) as (DefectionEvent & {
      acName: string;
      district: string;
      baselineWinner: string;
      baselineRunner: string;
      baselineMargin: number;
      transferredVotes: number;
      backlashVotes: number;
      projectedWinner: string;
      projectedMargin: number;
      isFlipped: boolean;
      flipWinner: string;
    })[];
  }, [events, data]);

  // Summary counts
  const totalFlippedCount = useMemo(() => {
    return analyzedEvents.filter((e) => e.enabled && e.isFlipped).length;
  }, [analyzedEvents]);

  const activeCount = useMemo(() => {
    return analyzedEvents.filter((e) => e.enabled).length;
  }, [analyzedEvents]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (!searchFilter.trim()) return analyzedEvents;
    const q = searchFilter.toLowerCase();
    return analyzedEvents.filter(
      (e) =>
        e.acName.toLowerCase().includes(q) ||
        e.district.toLowerCase().includes(q) ||
        e.leaderName.toLowerCase().includes(q) ||
        e.fromParty.toLowerCase().includes(q) ||
        e.toParty.toLowerCase().includes(q)
    );
  }, [analyzedEvents, searchFilter]);

  const allConstituencyOptions = useMemo(() => {
    return Object.values(data.constituencies).sort((a, b) => a.ac_no - b.ac_no);
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-rose-500 text-white font-mono text-xs font-black px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                <AlertTriangle className="w-3.5 h-3.5" /> DEFECTION ENGINE
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                Defection &amp; Rebel Spoiler Engine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Candidate Crossover &amp; Rebel Impact Modeler
            </h2>
            <p className="text-xs text-slate-400">
              Simulate sitting MLA floor-crossings, heavyweight defections, and aggrieved party rebels fighting as independents to measure live seat flips.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isFormOpen ? 'Close Builder' : 'Add Custom Defection'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              title="Reset to historical presets"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 font-semibold mb-1">Active Defection Events</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{activeCount}</span>
              <span className="text-xs text-slate-400">/ {events.length} Modeled</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Cross-party transfers</div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 font-semibold mb-1">Seats Flipped to Rival</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-400">+{totalFlippedCount}</span>
              <span className="text-xs text-slate-400">Flips</span>
            </div>
            <div className="text-[11px] text-rose-300 font-medium flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3" /> Due to defections/rebels
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 font-semibold mb-1">Average Cadre Vote Base</div>
            <div className="text-2xl font-black text-amber-400">8.4%</div>
            <div className="text-[11px] text-slate-400 mt-1">~15,500 votes / leader</div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 font-semibold mb-1">Anti-Defection Backlash</div>
            <div className="text-2xl font-black text-sky-400">2.4%</div>
            <div className="text-[11px] text-slate-400 mt-1">Voter cynicism penalty</div>
          </div>
        </div>
      </div>

      {/* Custom Defection Builder Modal / Collapsible Form */}
      {isFormOpen && (
        <div className="bg-white p-5 rounded-2xl border-2 border-indigo-500 shadow-md space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Configure Defection or Rebel Event
            </h3>
            <span className="text-xs text-slate-500">Simulate localized candidate dynamics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {/* Target AC */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Select Constituency:</label>
              <select
                value={formAcNo}
                onChange={(e) => setFormAcNo(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                {allConstituencyOptions.map((ac) => (
                  <option key={ac.ac_no} value={ac.ac_no}>
                    #{ac.ac_no} {ac.ac_name} ({ac.district}) - Won by {ac.winner_2023.party} (+{ac.margin_2023})
                  </option>
                ))}
              </select>
            </div>

            {/* Event Type */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Event Classification:</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setFormType('defection')}
                  className={`p-2 rounded-lg font-bold border cursor-pointer text-center ${
                    formType === 'defection'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Party Defection
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('rebel_spoiler')}
                  className={`p-2 rounded-lg font-bold border cursor-pointer text-center ${
                    formType === 'rebel_spoiler'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Rebel Spoiler
                </button>
              </div>
            </div>

            {/* Leader Name / Designation */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Leader / Candidate Title:</label>
              <input
                type="text"
                value={formLeaderName}
                onChange={(e) => setFormLeaderName(e.target.value)}
                placeholder="e.g. Sitting MLA / Ex-Minister"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
              />
            </div>

            {/* From Party */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Originating Party:</label>
              <select
                value={formFromParty}
                onChange={(e) => setFormFromParty(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
              >
                <option value="YSRCP">YSRCP (YSR Congress Party)</option>
                <option value="TDP">TDP (Telugu Desam Party)</option>
                <option value="JSP">JSP (Janasena Party)</option>
                <option value="BJP">BJP (Bharatiya Janata Party)</option>
              </select>
            </div>

            {/* To Party */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">
                {formType === 'defection' ? 'Destination Party:' : 'Running As:'}
              </label>
              {formType === 'defection' ? (
                <select
                  value={formToParty}
                  onChange={(e) => setFormToParty(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
                >
                  <option value="TDP">TDP</option>
                  <option value="YSRCP">YSRCP</option>
                  <option value="JSP">JSP</option>
                  <option value="BJP">BJP</option>
                </select>
              ) : (
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700 font-bold border border-slate-200">
                  IND (Independent Rebel Candidate)
                </div>
              )}
            </div>

            {/* Cadre Base Transfer Slider */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Personal Vote Base:</span>
                <span className="font-mono text-indigo-600">{formCadreTransfer}%</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="20.0"
                step="0.5"
                value={formCadreTransfer}
                onChange={(e) => setFormCadreTransfer(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500">
                ~{Math.round((formCadreTransfer / 100) * 185000).toLocaleString()} votes transferred
              </div>
            </div>

            {/* Anti-Defection Backlash */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Voter Backlash Penalty:</span>
                <span className="font-mono text-rose-600">{formBacklash}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.5"
                value={formBacklash}
                onChange={(e) => setFormBacklash(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500">
                ~{Math.round((formBacklash / 100) * 185000).toLocaleString()} penalty votes
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700">Tactical Strategic Rationale:</label>
              <input
                type="text"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="e.g. Caste elders consolidate behind rebel, leaving official candidate exposed"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddEvent}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Add to Defection Registry
            </button>
          </div>
        </div>
      )}

      {/* Events Registry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
            Active Defection &amp; Rebel Registry ({filteredEvents.length} Events)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by AC, Leader or Party..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500 w-52"
            />
          </div>

          <button
            onClick={handleClearAll}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((evt) => {
          const fromColor = getPartyColor(evt.fromParty);
          const toColor = evt.toParty === 'IND' ? '#64748b' : getPartyColor(evt.toParty);

          return (
            <div
              key={evt.id}
              className={`p-4 rounded-xl border transition-all ${
                !evt.enabled
                  ? 'opacity-60 bg-slate-50 border-slate-200'
                  : evt.isFlipped
                  ? 'bg-rose-50/50 border-rose-300 ring-2 ring-rose-500/10 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-900 text-white px-1.5 py-0.2 rounded">
                      #{evt.acNo}
                    </span>
                    <h4 className="font-black text-slate-900 text-sm">{evt.acName}</h4>
                    <span className="text-[11px] text-slate-500">{evt.district}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-1">
                    {evt.leaderName}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={evt.enabled}
                    onChange={() => toggleEvent(evt.id)}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    title="Enable/disable this defection scenario"
                  />
                  <button
                    onClick={() => deleteEvent(evt.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                    title="Remove event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Transfer Flow Diagram */}
              <div className="py-2.5 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="px-2 py-0.5 rounded font-black text-xs text-white"
                      style={{ backgroundColor: fromColor }}
                    >
                      {evt.fromParty}
                    </span>
                    <span className="text-slate-400 text-[11px]">(Base)</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 font-bold text-xs">
                    <ArrowRight className="w-4 h-4 text-indigo-600" />
                    <span className="text-indigo-600 font-mono">+{evt.cadreTransferPct}%</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className="px-2 py-0.5 rounded font-black text-xs text-white"
                      style={{ backgroundColor: toColor }}
                    >
                      {evt.toParty}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {evt.eventType === 'defection' ? '(Recipient)' : '(Rebel IND)'}
                    </span>
                  </div>
                </div>

                {/* Mathematical Swing Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-500">Transferred Cadre Votes:</span>
                    <div className="font-mono font-bold text-slate-900">
                      +{evt.transferredVotes.toLocaleString()} votes
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Voter Backlash Penalty:</span>
                    <div className="font-mono font-bold text-rose-600">
                      -{evt.backlashVotes.toLocaleString()} votes
                    </div>
                  </div>
                </div>

                {/* Result impact badge */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-600">
                    2023: Won by <strong>{evt.baselineWinner}</strong> (+{evt.baselineMargin.toLocaleString()})
                  </div>

                  {evt.isFlipped ? (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded-md text-[11px] font-black flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-rose-600" />
                      FLIPPED TO {evt.projectedWinner} (+{evt.projectedMargin.toLocaleString()})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[11px] font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      {evt.projectedWinner} HELD (+{evt.projectedMargin.toLocaleString()})
                    </span>
                  )}
                </div>

                {evt.notes && (
                  <p className="text-[10px] text-slate-500 italic border-t border-slate-100 pt-1.5">
                    "{evt.notes}"
                  </p>
                )}

                {/* Cumulative Campaign Action Compound Margin */}
                {cumulativeAcImpacts && cumulativeAcImpacts[evt.acNo] && (cumulativeAcImpacts[evt.acNo].resourceSwing > 0 || cumulativeAcImpacts[evt.acNo].starLift > 0) && (
                  <div className="p-2 rounded-lg bg-indigo-50/80 border border-indigo-200 text-[11px] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-indigo-950 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Cumulative AC Margin:</span>
                    </div>
                    <div className="text-right font-mono font-black">
                      <span className={cumulativeAcImpacts[evt.acNo].cumulativeProjectedMargin > 0 ? 'text-emerald-700' : 'text-slate-800'}>
                        {cumulativeAcImpacts[evt.acNo].cumulativeProjectedMargin > 0
                          ? `+${cumulativeAcImpacts[evt.acNo].cumulativeProjectedMargin.toLocaleString()} (INC WIN)`
                          : `${cumulativeAcImpacts[evt.acNo].cumulativeProjectedMargin.toLocaleString()} (Deficit)`}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {evt.eventType === 'defection' ? '🔄 Party Defection' : '⚡ Rebel Spoiler'}
                </span>

                {onOpenDossier && (
                  <button
                    onClick={() => onOpenDossier(evt.acNo)}
                    className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                  >
                    Constituency Dossier ↗
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
