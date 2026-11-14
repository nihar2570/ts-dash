import React, { useState, useMemo, useEffect } from 'react';
import type { MandalDetail } from '../data/mandalData';
import { FORM_20_URLS } from '../data/form20Urls';
import { getPartyColor } from '../types';
import { BoothTriageMap } from './BoothTriageMap';
import {
  Vote,
  Search,
  X,
  ExternalLink,
  FileText,
  Building2,
  Map as MapIcon,
  List,
  Sun,
  Moon,
  Flame,
  Shield,
} from 'lucide-react';
import { BoothVoterRollModal } from './BoothVoterRollModal';
import {
  type BoothDetail,
  generateAllBooths,
} from '../services/boothSolverEngine';
import { BoothPannaKPIs } from './booth/BoothPannaKPIs';
import { BoothRosterList } from './booth/BoothRosterList';

export type { BoothDetail };

interface BoothPannaDeficitSolverProps {
  acNo: number;
  acName: string;
  district: string;
  mandals: MandalDetail[];
  totalValidVotes: number;
  winnerParty: string;
  winnerCandidate: string;
  winnerVotes: number;
  runnerParty: string;
  runnerCandidate: string;
  runnerVotes: number;
  geoJsonData?: any;
  standaloneMapOnly?: boolean;
  onNavigateToBoothData?: (acNo: number, boothNo?: number, viewMode?: string) => void;
}

export const BoothPannaDeficitSolver: React.FC<BoothPannaDeficitSolverProps> = ({
  acNo,
  acName,
  district,
  mandals,
  totalValidVotes,
  winnerParty,
  winnerCandidate: _winnerCandidate,
  winnerVotes,
  runnerParty,
  runnerCandidate: _runnerCandidate,
  runnerVotes,
  geoJsonData,
  standaloneMapOnly = false,
  onNavigateToBoothData,
}) => {
  // Helper to determine NDA default party: TDP, JSP, or BJP
  const getNdaDefaultParty = (winner?: string, runner?: string): 'TDP' | 'YSRCP' | 'JSP' | 'BJP' | 'INC' => {
    if (winner === 'TDP' || winner === 'JSP' || winner === 'BJP') return winner;
    if (runner === 'TDP' || runner === 'JSP' || runner === 'BJP') return runner;
    return 'TDP';
  };

  // Target Party for Strategy Planning - default TDP/NDA always
  const [targetParty, setTargetParty] = useState<'TDP' | 'YSRCP' | 'JSP' | 'BJP' | 'INC'>(() => {
    return getNdaDefaultParty(winnerParty, runnerParty);
  });

  // Keep war room target defaulted to TDP / NDA alliance whenever constituency changes
  useEffect(() => {
    setTargetParty(getNdaDefaultParty(winnerParty, runnerParty));
  }, [acNo, winnerParty, runnerParty]);


  // Interactive Booth Explorer States
  const [explorerViewMode, setExplorerViewMode] = useState<'map' | 'list'>('map');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [selectedMapBoothNo, setSelectedMapBoothNo] = useState<number | null>(null);
  const [selectedTriageCategory, setSelectedTriageCategory] = useState<'battleground' | 'fortress' | 'vulnerable' | 'hostile' | 'all' | null>('all');
  const [boothSearch, setBoothSearch] = useState<string>('');
  const [selectedMandalFilter, setSelectedMandalFilter] = useState<string>('all');
  const [visibleBoothCount, setVisibleBoothCount] = useState<number>(standaloneMapOnly ? 50 : 25);
  const [inspectedVoterBooth, setInspectedVoterBooth] = useState<BoothDetail | null>(null);
  const [officialBoothData, setOfficialBoothData] = useState<BoothDetail[] | null>(null);
  const [_isOfficialRoll, setIsOfficialRoll] = useState<boolean>(false);

  // Ingest official Form-20 booth roll if available
  useEffect(() => {
    let isMounted = true;

    fetch(`/data/booths/ac_${acNo}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((rawBooths) => {
        if (!isMounted) return;
        if (rawBooths && Array.isArray(rawBooths) && rawBooths.length > 0) {
          const mapped: BoothDetail[] = rawBooths.map((b: any) => {
            const electorate = b.electorate || 900;
            const cleanStr = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
            const matchedMandal = mandals?.find((m) => cleanStr(m.name) === cleanStr(b.mandal || ''));
            const mName = matchedMandal?.name || b.mandal || district;
            const locName = b.locality || b.name;
            const bName = b.building || b.name;

            const acTurnout = totalValidVotes > 0 ? totalValidVotes / Math.max(1, rawBooths.length * 850) : 0.80;
            const fallbackTurnoutPct = Math.round(Math.min(0.92, Math.max(0.65, acTurnout)) * 100);
            const targetShare = totalValidVotes > 0
              ? (targetParty === winnerParty ? winnerVotes / totalValidVotes : (targetParty === runnerParty ? runnerVotes / totalValidVotes : 0.45))
              : 0.50;
            const oppShare = 1 - targetShare;
            const estVotes = Math.round(electorate * Math.min(0.92, Math.max(0.65, acTurnout)));

            const hasJsonVotes = b.votes && typeof b.margin === 'number';
            const winnerPartyBooth = b.winner_party || (hasJsonVotes && b.votes[winnerParty] >= b.votes[runnerParty] ? winnerParty : runnerParty);
            const isTargetWinner = winnerPartyBooth === targetParty;
            const targetVotes = hasJsonVotes ? (b.votes[targetParty] || 0) : Math.round(estVotes * targetShare);
            const opponentVotes = hasJsonVotes ? (b.total_votes - targetVotes) : Math.round(estVotes * oppShare);
            const margin = hasJsonVotes ? (isTargetWinner ? b.margin : -b.margin) : (targetVotes - opponentVotes);
            
            // 3-Tier Tactical Triage: 'fortress' (Stronghold) | 'battleground' (Contestable / Swing) | 'hostile' (Opponent Turf)
            let triage: 'fortress' | 'battleground' | 'hostile' = 'battleground';
            const rawTriage = String(b.triage || '').toLowerCase().trim();
            const absMargin = Math.abs(margin);

            if (isTargetWinner) {
              // Target party leads in this polling station
              // If lead is decisive (>35 votes, >6% margin, or marked fortress/secure) -> Stronghold
              if (rawTriage === 'fortress') {
                triage = 'fortress';
              } else if (rawTriage === 'battleground' || rawTriage === 'toss_up') {
                triage = 'battleground';
              } else if (absMargin > 35 || (b.margin_pct && b.margin_pct > 6.0) || rawTriage === 'secure') {
                triage = 'fortress';
              } else {
                triage = 'battleground';
              }
            } else {
              // Opponent leads in this polling station
              // If opponent lead is decisive (>35 votes, >6% margin, or marked hostile/secure-for-opp) -> Opponent Turf
              // Narrow deficit (<=35 votes or <=6% margin) -> Battleground (high-priority flip targets)
              if (rawTriage === 'hostile') {
                triage = 'hostile';
              } else if (rawTriage === 'battleground' || rawTriage === 'toss_up') {
                triage = 'battleground';
              } else if (absMargin > 35 || (b.margin_pct && b.margin_pct > 6.0) || (rawTriage === 'secure' && !isTargetWinner)) {
                triage = 'hostile';
              } else {
                triage = 'battleground';
              }
            }

            let actionNote = '';
            if (triage === 'fortress') {
              actionNote = 'Solid stronghold. Focus on voter mobilization & transport assistance.';
            } else if (triage === 'battleground') {
              actionNote = margin >= 0
                ? 'Competitive edge. Deploy youth influencers and ward committee leaders.'
                : 'Flip target. High-priority outreach on local civic grievances.';
            } else {
              actionNote = 'Opponent bastion. Target swing electors with flagship welfare pamphlets.';
            }

            return {
              boothNo: b.booth_no,
              name: bName,
              location: `${locName}, ${mName} Mandal`,
              mandalName: mName,
              electorate,
              turnoutPct: b.turnout_pct || fallbackTurnoutPct,
              targetVotes,
              opponentVotes,
              margin,
              triage,
              pannaPages: b.panna_pages || Math.ceil(electorate / 30),
              actionNote,
              lat: b.lat,
              lng: b.lng,
              candidates: b.candidates || undefined,
              winnerParty: winnerPartyBooth,
              femaleElectors: b.female_electors,
              maleElectors: b.male_electors,
              form20Source: b.form20_source,
              form20Verified: b.form20_verified,
            };
          }).filter((b: any) => typeof b.lat === 'number' && typeof b.lng === 'number' && !isNaN(b.lat) && !isNaN(b.lng));

          if (mapped.length > 0) {
            setOfficialBoothData(mapped);
            setIsOfficialRoll(true);
            return;
          }
        }

        const fallbackPath = acNo === 175 ? '/data/rolls/ac_175_kuppam_booths.json' : `/data/rolls/ac_${acNo}_booths.json`;
        fetch(fallbackPath)
          .then((r) => (r.ok ? r.json() : null))
          .then((json) => {
            if (isMounted && json && json.booths && json.booths.length > 0) {
              setOfficialBoothData(json.booths);
              setIsOfficialRoll(true);
            } else if (isMounted) {
              setOfficialBoothData(null);
              setIsOfficialRoll(false);
            }
          })
          .catch(() => {
            if (isMounted) {
              setOfficialBoothData(null);
              setIsOfficialRoll(false);
            }
          });
      })
      .catch(() => {
        if (isMounted) {
          setOfficialBoothData(null);
          setIsOfficialRoll(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [acNo, targetParty, winnerParty, runnerParty, district, mandals, totalValidVotes, winnerVotes, runnerVotes]);

  // Constituency Booth Aggregates
  const totalBooths = useMemo(() => {
    return officialBoothData?.length || mandals.reduce((sum, m) => sum + (m.booths || 0), 0) || 240;
  }, [officialBoothData, mandals]);

  const totalElectorate = useMemo(() => {
    return mandals.reduce((sum, m) => sum + (m.electorate || 0), 0) || Math.round(totalValidVotes / 0.76);
  }, [mandals, totalValidVotes]);

  const avgVotersPerBooth = Math.round(totalElectorate / totalBooths);

  // Target party performance analysis
  const targetIsWinner = winnerParty === targetParty;
  const targetActualVotes = targetIsWinner ? winnerVotes : (runnerParty === targetParty ? runnerVotes : Math.round(totalValidVotes * 0.22));
  const opponentVotes = targetIsWinner ? runnerVotes : winnerVotes;
  const actualMargin = targetIsWinner ? (targetActualVotes - opponentVotes) : (opponentVotes - targetActualVotes);

  // Generate / format booths
  const allBooths = useMemo(() => {
    return generateAllBooths({
      acNo,
      mandals,
      totalValidVotes,
      targetParty,
      winnerParty,
      runnerParty,
      totalBooths,
      geoJsonData,
      officialBoothData,
    });
  }, [acNo, mandals, totalValidVotes, targetParty, winnerParty, runnerParty, totalBooths, geoJsonData, officialBoothData]);

  // Exact Booth Triage counts
  const boothTriage = useMemo(() => {
    return {
      fortressCount: allBooths.filter((b) => b.triage === 'fortress').length,
      battlegroundCount: allBooths.filter((b) => b.triage === 'battleground').length,
      hostileCount: allBooths.filter((b) => b.triage === 'hostile').length,
    };
  }, [allBooths]);

  // Filtered Booths
  const filteredBooths = useMemo(() => {
    return allBooths.filter((b) => {
      if (selectedTriageCategory && selectedTriageCategory !== 'all') {
        if (b.triage !== selectedTriageCategory) return false;
      }
      if (selectedMandalFilter !== 'all') {
        if (b.mandalName.toLowerCase() !== selectedMandalFilter.toLowerCase()) return false;
      }
      if (boothSearch.trim()) {
        const q = boothSearch.toLowerCase().trim();
        const matchesNo = `ps #${b.boothNo}`.includes(q) || `${b.boothNo}` === q;
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesLoc = b.location.toLowerCase().includes(q);
        const matchesMandal = b.mandalName.toLowerCase().includes(q);
        if (!matchesNo && !matchesName && !matchesLoc && !matchesMandal) return false;
      }
      return true;
    });
  }, [allBooths, selectedTriageCategory, selectedMandalFilter, boothSearch]);

  const handleSelectTriage = (cat: 'battleground' | 'fortress' | 'hostile' | 'all') => {
    if (selectedTriageCategory === cat) {
      setSelectedTriageCategory('all');
    } else {
      setSelectedTriageCategory(cat);
      setVisibleBoothCount(25);
    }
  };


  const targetColor = getPartyColor(targetParty);
  const form20PdfUrl = FORM_20_URLS[acNo];

  return (
    <div className={standaloneMapOnly ? 'w-full flex-1 flex flex-col min-h-0' : 'bg-white text-slate-800 rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs space-y-3.5'}>
      {!standaloneMapOnly && (
        <>
          {/* Top Header & Strategy Party Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-200 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                <Vote className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-black text-slate-900">
                Form-20 Polling Station Deficit &amp; Panna Pramukh Triage Solver
              </h3>
            </div>

            {/* Target Party Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <span className="text-[10px] text-slate-500 px-1.5 uppercase tracking-wider">War Room Target:</span>
              {(['TDP', 'JSP', 'BJP', 'YSRCP', 'INC'] as const).map((p) => {
                const isSelected = targetParty === p;
                const pColor = getPartyColor(p);
                return (
                  <button
                    key={p}
                    onClick={() => setTargetParty(p)}
                    style={isSelected ? { borderColor: targetColor } : undefined}
                    className={`px-2.5 py-0.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 border ${
                      isSelected ? 'bg-white text-slate-900 shadow-xs font-black border-slate-300' : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pColor }} />
                    <span>{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compact Ground Intelligence Strip */}
          <BoothPannaKPIs
            totalBooths={totalBooths}
            totalMandals={mandals.length}
            avgVotersPerBooth={avgVotersPerBooth}
            actualMargin={actualMargin}
            targetIsWinner={targetIsWinner}
            targetParty={targetParty}
            battlegroundCount={boothTriage.battlegroundCount}
            strongholdCount={boothTriage.fortressCount}
          />
        </>
      )}

      {/* Selected Polling Station Drilldown Explorer Panel */}
      {(selectedTriageCategory || standaloneMapOnly) && (
        <div
          className={`border rounded-xl p-3 sm:p-4 space-y-3 shadow-inner transition-colors ${
            standaloneMapOnly ? 'mt-0 w-full flex-1 flex flex-col min-h-0 shadow-sm' : 'mt-3'
          } ${
            theme === 'light'
              ? 'bg-white border-slate-200 text-slate-800 shadow-sm'
              : 'bg-slate-900/95 border-indigo-500/30 text-white'
          }`}
        >
          {/* Header & Filter Controls */}
          <div
            className={`flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b shrink-0 ${
              theme === 'light' ? 'border-slate-200' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 className={`w-4 h-4 ${theme === 'light' ? 'text-indigo-600' : 'text-amber-400'}`} />
              <span className={`text-xs sm:text-sm font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                Polling Stations
              </span>
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToBoothData) {
                    onNavigateToBoothData(acNo, 1, 'ac-plan');
                  } else {
                    const url = new URL(window.location.origin + window.location.pathname);
                    url.searchParams.set('tab', 'booth-data');
                    url.searchParams.set('ac', String(acNo));
                    url.searchParams.set('view', 'ac-plan');
                    window.open(url.toString(), '_blank');
                  }
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                  theme === 'light'
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-amber-950/80 hover:bg-amber-900 text-amber-200 border-amber-600'
                }`}
                title="Open 30/60/90-Day AC-Wide Padayatra Campaign Itinerary"
              >
                <span>🚶‍♂️ AC Padayatra Plan ↗</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {standaloneMapOnly && (
                <div className={`flex items-center gap-1 p-0.5 rounded-lg border text-xs font-bold ${
                  theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}>
                  <span className={`text-[10px] px-1.5 uppercase font-semibold ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Target:
                  </span>
                  {(['TDP', 'JSP', 'BJP', 'YSRCP', 'INC'] as const).map((p) => {
                    const isSelected = targetParty === p;
                    const pColor = getPartyColor(p);
                    return (
                      <button
                        key={p}
                        onClick={() => setTargetParty(p)}
                        className={`px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 text-xs ${
                          isSelected
                            ? theme === 'light'
                              ? 'bg-white text-slate-900 shadow-xs font-black border border-slate-200'
                              : 'bg-slate-800 text-white shadow-xs font-black border border-slate-600'
                            : theme === 'light'
                            ? 'text-slate-600 hover:text-slate-900'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pColor }} />
                        <span>{p}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* View Mode */}
              <div
                className={`flex items-center p-0.5 rounded-lg border ${
                  theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExplorerViewMode('map')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    explorerViewMode === 'map'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Interactive Geospatial Map of Polling Stations"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Map View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExplorerViewMode('list')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    explorerViewMode === 'list'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : theme === 'light'
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tabular Polling Station Roster List"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Roster List</span>
                </button>
              </div>

              {!standaloneMapOnly && (
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToBoothData) {
                      onNavigateToBoothData(acNo, selectedMapBoothNo || undefined);
                    } else {
                      const url = new URL(window.location.origin + window.location.pathname);
                      url.searchParams.set('tab', 'booth-data');
                      url.searchParams.set('ac', String(acNo));
                      if (selectedMapBoothNo) url.searchParams.set('booth', String(selectedMapBoothNo));
                      window.open(url.toString(), '_blank');
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 shadow-2xs'
                      : 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 hover:text-white border-indigo-700 shadow-xs'
                  }`}
                  title="Open dedicated standalone tab for Polling Station Rolls"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Open Rolls ↗</span>
                </button>
              )}

              {/* Theme Switcher Toggle */}
              <button
                type="button"
                onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                  theme === 'light'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200 shadow-2xs'
                    : 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
                }`}
                title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
              </button>

              {/* Form-20 PDF Link */}
              {form20PdfUrl && (
                <a
                  href={form20PdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors ${
                    theme === 'light'
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      : 'bg-slate-800 hover:bg-indigo-900/60 text-slate-300 hover:text-white border-slate-700'
                  }`}
                  title="Open certified Form-20 polling station result sheet from CEO Andhra Pradesh"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-400" />
                  <span>Form-20 PDF ↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Filter Buttons & Search */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleSelectTriage('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                  selectedTriageCategory === 'all'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-xs'
                    : theme === 'light'
                    ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                <span>All Stations ({totalBooths})</span>
              </button>
              <button
                onClick={() => handleSelectTriage('battleground')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                  selectedTriageCategory === 'battleground'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                    : theme === 'light'
                    ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Filter for Battleground booths decided by ≤45 votes"
              >
                <Flame className="w-3 h-3 text-amber-500" />
                <span>Battlegrounds ({boothTriage.battlegroundCount})</span>
              </button>
              <button
                onClick={() => handleSelectTriage('fortress')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                  selectedTriageCategory === 'fortress'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs'
                    : theme === 'light'
                    ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Filter for Stronghold booths with >60% vote share"
              >
                <Shield className="w-3 h-3 text-emerald-500" />
                <span>Strongholds ({boothTriage.fortressCount})</span>
              </button>
              <button
                onClick={() => handleSelectTriage('hostile')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                  selectedTriageCategory === 'hostile'
                    ? 'bg-rose-500 text-white border-rose-400 shadow-xs'
                    : theme === 'light'
                    ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Filter for Opponent Bastion booths"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                <span>Opponent Turf ({boothTriage.hostileCount})</span>
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedMandalFilter}
                onChange={(e) => {
                  setSelectedMandalFilter(e.target.value);
                  setVisibleBoothCount(25);
                }}
                className={`border rounded-lg px-2.5 py-1 text-xs focus:outline-hidden ${
                  theme === 'light'
                    ? 'bg-slate-50 border-slate-300 text-slate-800'
                    : 'bg-slate-950 border-slate-700 text-slate-200'
                }`}
              >
                <option value="all">All Mandals ({mandals.length})</option>
                {mandals.map((m) => (
                  <option key={m.mandal_id} value={m.name}>
                    {m.name} ({m.booths} booths)
                  </option>
                ))}
              </select>

              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search booth #, school, village..."
                  value={boothSearch}
                  onChange={(e) => {
                    setBoothSearch(e.target.value);
                    setVisibleBoothCount(25);
                  }}
                  className={`w-full border rounded-lg pl-8 pr-7 py-1 text-xs focus:outline-hidden ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400'
                      : 'bg-slate-950 border-slate-700 text-slate-200 placeholder-slate-500'
                  }`}
                />
                {boothSearch && (
                  <button
                    onClick={() => setBoothSearch('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Polling Station Map or List Content */}
          {explorerViewMode === 'map' ? (
            <div id="booth-triage-map-container" className={standaloneMapOnly ? 'pt-1 flex-1 flex flex-col min-h-0 h-full' : 'pt-1'}>
              <BoothTriageMap
                acNo={acNo}
                acName={acName}
                district={district}
                targetParty={targetParty}
                booths={filteredBooths}
                geoJsonData={geoJsonData}
                selectedTriageCategory={selectedTriageCategory as any}
                onSelectTriageCategory={handleSelectTriage as any}
                selectedBoothNo={selectedMapBoothNo}
                onSelectBooth={(b) => setSelectedMapBoothNo(b ? b.boothNo : null)}
                onViewVoterRoll={(b) => setInspectedVoterBooth(b)}
                onOpenStandaloneBooth={(b) => {
                  if (onNavigateToBoothData) {
                    onNavigateToBoothData(acNo, b.boothNo);
                  } else {
                    const url = new URL(window.location.origin + window.location.pathname);
                    url.searchParams.set('tab', 'booth-data');
                    url.searchParams.set('ac', String(acNo));
                    url.searchParams.set('booth', String(b.boothNo));
                    window.open(url.toString(), '_blank');
                  }
                }}
                theme={theme}
                onThemeChange={setTheme}
                isFullPageMap={standaloneMapOnly}
              />
            </div>
          ) : (
            <BoothRosterList
              filteredBooths={filteredBooths}
              visibleBoothCount={visibleBoothCount}
              setVisibleBoothCount={setVisibleBoothCount}
              theme={theme}
              acNo={acNo}
              targetParty={targetParty}
              targetColor={targetColor}
              winnerParty={winnerParty}
              runnerParty={runnerParty}
              standaloneMapOnly={standaloneMapOnly}
              onNavigateToBoothData={onNavigateToBoothData}
              onSelectMapBooth={(bNo) => {
                setSelectedMapBoothNo(bNo);
                setExplorerViewMode('map');
                setTimeout(() => {
                  const mapElem = document.getElementById('booth-triage-map-container');
                  if (mapElem) {
                    mapElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 80);
              }}
            />
          )}
        </div>
      )}


      {/* Booth E-Roll & Panna Register Modal */}
      {inspectedVoterBooth && (
        <BoothVoterRollModal
          isOpen={!!inspectedVoterBooth}
          onClose={() => setInspectedVoterBooth(null)}
          acNo={acNo}
          acName={acName}
          district={district}
          boothNo={inspectedVoterBooth.boothNo}
          boothName={inspectedVoterBooth.name}
          mandalName={inspectedVoterBooth.mandalName}
          electorateCount={inspectedVoterBooth.electorate}
        />
      )}
    </div>
  );
};
