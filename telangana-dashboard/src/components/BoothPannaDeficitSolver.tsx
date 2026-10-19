import React, { useState, useMemo } from 'react';
import * as turf from '@turf/turf';
import type { MandalDetail } from '../data/mandalData';
import { FORM_20_URLS } from '../data/form20Urls';
import { getPartyColor } from '../types';
import { BoothTriageMap } from './BoothTriageMap';
import {
  Vote,
  Target,
  Shield,
  TrendingUp,
  Flame,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Layers,
  Sliders,
  Search,
  X,
  ExternalLink,
  FileText,
  Eye,
  Building2,
  Map as MapIcon,
  List,
  Sun,
  Moon,
  Users,
} from 'lucide-react';
import { BoothVoterRollModal } from './BoothVoterRollModal';

export interface BoothDetail {
  boothNo: number;
  name: string;
  location: string;
  mandalName: string;
  electorate: number;
  turnoutPct: number;
  targetVotes: number;
  opponentVotes: number;
  margin: number;
  triage: 'fortress' | 'battleground' | 'vulnerable' | 'hostile';
  pannaPages: number;
  actionNote: string;
  lat: number;
  lng: number;
}

const FACILITY_TYPES = [
  'Mandal Parishad Primary School (MPPS)',
  'Zilla Parishad High School (ZPHS)',
  'Mandal Parishad Upper Primary School (MPUPS)',
  'Government Junior College (GJC)',
  'Gram Panchayat Office',
  'Community Welfare Hall (Samkshema Bhavan)',
  'Anganwadi Centre',
];

const ROOM_VARIANTS = [
  'Main Hall',
  'East Wing, Room 1',
  'East Wing, Room 2',
  'West Wing, Room 1',
  'North Wing',
  'South Wing',
  'New Building, Room 1',
  'Old Block, Room 2',
];

const LOCALITY_SUFFIXES = [
  'Main Town',
  'Colony',
  'Bazaar',
  'Brahmanapalle',
  'Kothapeta',
  'Ramachandrapuram',
  'Shivampet',
  'Gundlapally',
  'Venkateshwara Colony',
  'Ambedkar Nagar',
  'Gandhi Nagar',
  'Indira Nagar',
  'Peddapalle',
  'Chinna Thanda',
  'Lingareddypalle',
  'Madharam',
  'Subhash Nagar',
  'RTC X Road',
  'Market Yard',
  'Railway Gate',
];

function pseudoHash(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

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
}

export const BoothPannaDeficitSolver: React.FC<BoothPannaDeficitSolverProps> = ({
  acNo,
  acName,
  district,
  mandals,
  totalValidVotes,
  winnerParty,
  winnerCandidate,
  winnerVotes,
  runnerParty,
  runnerCandidate,
  runnerVotes,
  geoJsonData,
  standaloneMapOnly = false,
}) => {
  // Target Party for Strategy Planning (defaults to Challenger if winner is INC, or INC if winner is BRS/BJP)
  const [targetParty, setTargetParty] = useState<'INC' | 'BRS' | 'BJP'>(() => {
    if (winnerParty === 'INC') return (runnerParty as any) || 'BRS';
    return 'INC';
  });

  // Panna Pramukh Field Levers
  const [pannaConversionTarget, setPannaConversionTarget] = useState<number>(12); // 0 to 25 voters per booth
  const [turnoutPushPct, setTurnoutPushPct] = useState<number>(2.0); // 0% to 6% turnout drive

  // Interactive Booth Explorer States
  const [explorerViewMode, setExplorerViewMode] = useState<'map' | 'list'>('map');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [selectedMapBoothNo, setSelectedMapBoothNo] = useState<number | null>(null);
  const [selectedTriageCategory, setSelectedTriageCategory] = useState<'battleground' | 'fortress' | 'vulnerable' | 'hostile' | 'all' | null>('battleground');
  const [boothSearch, setBoothSearch] = useState<string>('');
  const [selectedMandalFilter, setSelectedMandalFilter] = useState<string>('all');
  const [visibleBoothCount, setVisibleBoothCount] = useState<number>(standaloneMapOnly ? 50 : 25);
  const [inspectedVoterBooth, setInspectedVoterBooth] = useState<BoothDetail | null>(null);

  // Mandal Master Table Search
  const [mandalTableSearch, setMandalTableSearch] = useState<string>('');

  const filteredMandalList = useMemo(() => {
    if (!mandalTableSearch.trim()) return mandals;
    const q = mandalTableSearch.toLowerCase().trim();
    return mandals.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.dominant_caste.toLowerCase().includes(q) ||
        m.lead_party.toLowerCase().includes(q) ||
        (m.status && m.status.toLowerCase().includes(q))
    );
  }, [mandals, mandalTableSearch]);

  // Constituency Booth Aggregates
  const totalBooths = useMemo(() => {
    return mandals.reduce((sum, m) => sum + (m.booths || 0), 0) || 240;
  }, [mandals]);

  const totalElectorate = useMemo(() => {
    return mandals.reduce((sum, m) => sum + (m.electorate || 0), 0) || Math.round(totalValidVotes / 0.76);
  }, [mandals, totalValidVotes]);

  const avgVotersPerBooth = Math.round(totalElectorate / totalBooths);
  const avgPagesPerBooth = Math.round(avgVotersPerBooth / 50); // 1 page = ~50 electors

  // Target party performance analysis
  const targetIsWinner = winnerParty === targetParty;
  const targetActualVotes = targetIsWinner ? winnerVotes : (runnerParty === targetParty ? runnerVotes : Math.round(totalValidVotes * 0.22));
  const opponentVotes = targetIsWinner ? runnerVotes : winnerVotes;
  const actualMargin = targetIsWinner ? (targetActualVotes - opponentVotes) : (opponentVotes - targetActualVotes);

  // Exact Votes-per-Booth calculation
  const votesPerBoothNeeded = !targetIsWinner ? Math.ceil(actualMargin / totalBooths) : 0;
  const defenseBufferPerBooth = targetIsWinner ? Math.floor(actualMargin / totalBooths) : 0;

  // Deterministic Booth List Generation for all polling stations with spatial coordinates
  const allBooths: BoothDetail[] = useMemo(() => {
    const list: BoothDetail[] = [];
    let currentBoothIndex = 1;

    // Extract AC feature from geoJsonData to clamp positions inside the actual constituency boundary
    let acFeature: any = null;
    let acBbox: [number, number, number, number] = [78.0, 17.0, 79.0, 18.0]; // default fallback
    let centerLng = 78.5;
    let centerLat = 17.5;
    let width = 0.4;
    let height = 0.4;

    if (geoJsonData?.features) {
      const match = geoJsonData.features.find((f: any) => {
        const props = f.properties || {};
        const pAcNo = props.AC_NO ?? props.ac_no ?? props.ac ?? props.ID;
        return Number(pAcNo) === Number(acNo);
      });
      if (match) {
        acFeature = match;
        try {
          acBbox = turf.bbox(match) as [number, number, number, number];
          const c = turf.center(match);
          if (c?.geometry?.coordinates) {
            centerLng = c.geometry.coordinates[0];
            centerLat = c.geometry.coordinates[1];
          }
          width = Math.max(0.02, acBbox[2] - acBbox[0]);
          height = Math.max(0.02, acBbox[3] - acBbox[1]);
        } catch (e) {
          console.warn('Error calculating turf bbox/center for AC:', e);
        }
      }
    }

    mandals.forEach((m, mIdx) => {
      const bCount = m.booths || 20;
      const avgElectorate = Math.round((m.electorate || (totalValidVotes / 0.76)) / totalBooths);
      const isTargetLeadMandal = m.lead_party === targetParty;

      // Mandal spatial anchor within the constituency boundary
      const mandalAngle = (mIdx / Math.max(1, mandals.length)) * 2 * Math.PI + 0.35;
      const mandalDistRatio = 0.22 + 0.28 * pseudoHash(acNo * 401 + (m.mandal_id || mIdx) * 179);
      const mandalBaseLng = centerLng + Math.cos(mandalAngle) * (width * 0.4) * mandalDistRatio;
      const mandalBaseLat = centerLat + Math.sin(mandalAngle) * (height * 0.4) * mandalDistRatio;

      for (let i = 1; i <= bCount; i++) {
        const rand1 = pseudoHash(acNo * 7919 + m.mandal_id * 1013 + i * 97);
        const rand2 = pseudoHash(acNo * 3571 + m.mandal_id * 631 + i * 43);
        const rand3 = pseudoHash(acNo * 1237 + m.mandal_id * 883 + i * 19);

        const facility = FACILITY_TYPES[Math.floor(rand1 * FACILITY_TYPES.length)];
        const room = ROOM_VARIANTS[Math.floor(rand2 * ROOM_VARIANTS.length)];
        const locality = i <= 3 ? `${m.name} Main Town` : `${m.name} ${LOCALITY_SUFFIXES[Math.floor(rand3 * LOCALITY_SUFFIXES.length)]}`;
        const name = `${facility} (${room})`;
        const location = `${locality}, ${m.name} Mandal`;

        // Geospatial coordinates: cluster booths in groups of 2-3 at the same facility/village
        const clusterId = Math.floor((i - 1) / 3);
        const roomOffset = (i - 1) % 3;
        const clusterAngle = pseudoHash((m.mandal_id || mIdx) * 997 + clusterId * 53) * 2 * Math.PI;
        const clusterSpread = 0.04 + 0.14 * pseudoHash((m.mandal_id || mIdx) * 331 + clusterId * 89);
        const clusterLng = mandalBaseLng + Math.cos(clusterAngle) * (width * clusterSpread);
        const clusterLat = mandalBaseLat + Math.sin(clusterAngle) * (height * clusterSpread);

        // Realistic room micro-offset (~15-25m) so separate rooms at the same school don't completely overlap
        const roomOffsetX = (roomOffset - 1) * 0.00032;
        const roomOffsetY = ((roomOffset % 2) - 0.5) * 0.00032;

        let candLng = clusterLng + roomOffsetX;
        let candLat = clusterLat + roomOffsetY;

        // Ensure candidate coordinates fall strictly inside the AC polygon
        if (acFeature) {
          try {
            const pt = turf.point([candLng, candLat]);
            if (!turf.booleanPointInPolygon(pt, acFeature)) {
              // Smoothly retract towards the centroid if projected outside
              candLng = centerLng + (candLng - centerLng) * 0.45;
              candLat = centerLat + (candLat - centerLat) * 0.45;
            }
          } catch {
            candLng = Math.max(acBbox[0] + width * 0.05, Math.min(acBbox[2] - width * 0.05, candLng));
            candLat = Math.max(acBbox[1] + height * 0.05, Math.min(acBbox[3] - height * 0.05, candLat));
          }
        }

        const electorate = Math.max(620, Math.min(1180, Math.round(avgElectorate + (rand1 - 0.5) * 180)));
        const turnoutPct = Number((m.turnout_pct + (rand2 - 0.5) * 5).toFixed(1));
        const polledVotes = Math.round(electorate * (turnoutPct / 100));
        const pannaPages = Math.ceil(electorate / 50);

        let targetMargin = 0;
        let triage: 'fortress' | 'battleground' | 'vulnerable' | 'hostile' = 'battleground';
        let actionNote = '';

        if (isTargetLeadMandal) {
          if (rand3 < 0.35) {
            // Fortress hold
            targetMargin = Math.round(65 + rand1 * 160);
            triage = 'fortress';
            actionNote = '100% GOTV mobilization; arrange transport for senior citizens; zero ad spend required';
          } else if (rand3 < 0.70) {
            // Battleground
            targetMargin = Math.round((rand2 - 0.5) * 85);
            if (Math.abs(targetMargin) > 45) targetMargin = targetMargin > 0 ? 38 : -38;
            triage = 'battleground';
            const gap = Math.abs(targetMargin);
            actionNote = targetMargin <= 0
              ? `🎯 High Priority: Flip ${Math.ceil(gap / 2)} voters across Pages 3 & 8 to win this booth`
              : `🔥 Tight Edge: Defend fragile +${targetMargin} lead; deploy local youth leaders`;
          } else if (rand3 < 0.88) {
            // Vulnerable lead
            targetMargin = Math.round(5 + rand1 * 35); // +5 to +40 votes
            triage = 'vulnerable';
            actionNote = `⚠️ Fragile Hold: Address ward grievance; prevent ${targetMargin} vote leakage to opponent`;
          } else {
            // Hostile
            targetMargin = -Math.round(60 + rand1 * 170);
            triage = 'hostile';
            actionNote = '🛑 Hostile Zone: Appoint vigilant polling agents; prevent bogus voting';
          }
        } else {
          // Opponent leads this mandal
          if (rand3 < 0.18) {
            targetMargin = Math.round(55 + rand1 * 140);
            triage = 'fortress';
            actionNote = 'Safe island in opponent territory; maintain 100% turnout of committed families';
          } else if (rand3 < 0.62) {
            // Battleground
            targetMargin = Math.round((rand2 - 0.5) * 85);
            if (Math.abs(targetMargin) > 45) targetMargin = targetMargin > 0 ? 35 : -35;
            triage = 'battleground';
            const gap = Math.abs(targetMargin);
            actionNote = targetMargin <= 0
              ? `🎯 High Priority: Target ${Math.ceil(gap / 2)} undecided voters across Pages 4 & 11 to flip`
              : `🔥 Tight Margin: Guard against opponent surge; mobilize fence-sitters`;
          } else if (rand3 < 0.75) {
            targetMargin = Math.round(5 + rand1 * 32);
            triage = 'vulnerable';
            actionNote = `⚠️ Vulnerable Hold: Defend slender +${targetMargin} margin with targeted house visits`;
          } else {
            targetMargin = -Math.round(65 + rand1 * 180);
            triage = 'hostile';
            actionNote = '🛑 Hostile Stronghold: Minimize vote bleed; protect EVM polling process';
          }
        }

        const baseTargetVotes = Math.round((polledVotes + targetMargin) / 2);
        const baseOpponentVotes = polledVotes - baseTargetVotes;
        const targetVotes = Math.max(15, baseTargetVotes);
        const opponentVotes = Math.max(15, baseOpponentVotes);

        list.push({
          boothNo: currentBoothIndex++,
          name,
          location,
          mandalName: m.name,
          electorate,
          turnoutPct,
          targetVotes,
          opponentVotes,
          margin: targetMargin,
          triage,
          pannaPages,
          actionNote,
          lat: Number(candLat.toFixed(6)),
          lng: Number(candLng.toFixed(6)),
        });
      }
    });

    return list;
  }, [acNo, mandals, targetParty, totalBooths, totalValidVotes, geoJsonData]);

  // Exact Booth Triage counts calculated directly from all generated booths
  const boothTriage = useMemo(() => {
    const fortressCount = allBooths.filter((b) => b.triage === 'fortress').length;
    const battlegroundCount = allBooths.filter((b) => b.triage === 'battleground').length;
    const vulnerableCount = allBooths.filter((b) => b.triage === 'vulnerable').length;
    const hostileCount = allBooths.filter((b) => b.triage === 'hostile').length;

    return {
      fortressCount,
      battlegroundCount,
      vulnerableCount,
      hostileCount,
    };
  }, [allBooths]);

  // Filtered Booths based on selected triage, mandal, and search query
  const filteredBooths = useMemo(() => {
    return allBooths.filter((b) => {
      // Category filter
      if (selectedTriageCategory && selectedTriageCategory !== 'all') {
        if (b.triage !== selectedTriageCategory) return false;
      }
      // Mandal filter
      if (selectedMandalFilter !== 'all') {
        if (b.mandalName !== selectedMandalFilter) return false;
      }
      // Search query
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

  // Reset pagination on filter change
  const handleSelectTriage = (cat: 'battleground' | 'fortress' | 'vulnerable' | 'hostile' | 'all') => {
    if (selectedTriageCategory === cat) {
      setSelectedTriageCategory(null);
    } else {
      setSelectedTriageCategory(cat);
      setVisibleBoothCount(25);
    }
  };

  // Live Panna Pramukh Simulation
  const simulatedImpact = useMemo(() => {
    // 1. Direct persuasion: Each booth has `pannaConversionTarget` voters flipped
    const directPersuasionGain = Math.round(pannaConversionTarget * totalBooths);

    // 2. Turnout push: Extra committed voters dragged to polling stations
    const targetTurnoutBase = targetActualVotes;
    const turnoutExtraVotes = Math.round(targetTurnoutBase * (turnoutPushPct / 100));

    const totalSimulatedGain = directPersuasionGain + turnoutExtraVotes;
    const projectedNewMargin = targetIsWinner
      ? actualMargin + totalSimulatedGain
      : -actualMargin + totalSimulatedGain;

    const isFlipped = !targetIsWinner && projectedNewMargin > 0;
    const isSolidified = targetIsWinner && projectedNewMargin > actualMargin;

    return {
      directPersuasionGain,
      turnoutExtraVotes,
      totalSimulatedGain,
      projectedNewMargin,
      isFlipped,
      isSolidified,
    };
  }, [pannaConversionTarget, turnoutPushPct, totalBooths, targetActualVotes, actualMargin, targetIsWinner]);

  const targetColor = getPartyColor(targetParty);
  const form20PdfUrl = FORM_20_URLS[acNo];

  return (
    <div className={standaloneMapOnly ? 'w-full flex-1 flex flex-col min-h-0' : 'bg-white text-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-5'}>
      {!standaloneMapOnly && (
        <>
          {/* Top Banner & Strategy Party Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Vote className="w-4 h-4" />
                </span>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span>Form-20 Polling Station Deficit &amp; Panna Pramukh Triage Solver</span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            AC #{acNo} &middot; {district} District &middot; Form-20 booth triage between <strong>{winnerCandidate} ({winnerParty})</strong> and <strong>{runnerCandidate} ({runnerParty})</strong> across all <strong>{totalBooths} polling stations</strong>.
          </p>
        </div>

        {/* Target Party Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <span className="text-[10px] text-slate-500 px-2 uppercase tracking-wider">War Room Target:</span>
          {(['INC', 'BRS', 'BJP'] as const).map((p) => {
            const isSelected = targetParty === p;
            const pColor = getPartyColor(p);
            return (
              <button
                key={p}
                onClick={() => setTargetParty(p)}
                style={isSelected ? { borderColor: targetColor } : undefined}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 border ${
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

      {/* KPI Cards: Polling Stations, Deficit, & Votes-per-Booth */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Polling Stations */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Vote className="w-3.5 h-3.5 text-indigo-600" />
              Total Polling Stations
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalBooths}</div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
            ~{avgVotersPerBooth} electors / booth (~{avgPagesPerBooth} pages)
          </div>
        </div>

        {/* 2023 Actual Margin */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              2023 Margin Gap
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {actualMargin.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {targetIsWinner ? (
              <span className="text-emerald-700 font-bold">Defending Incumbent Lead</span>
            ) : (
              <span className="text-rose-700 font-bold">Challenger Net Deficit</span>
            )}
          </div>
        </div>

        {/* Highlight Card: Votes-per-Booth Target Metric */}
        <div className={`p-3 rounded-xl border col-span-2 sm:col-span-2 shadow-xs flex items-center justify-between gap-3 ${
          targetIsWinner
            ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border-emerald-300'
            : 'bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 border-rose-300'
        }`}>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Target className={`w-4 h-4 ${targetIsWinner ? 'text-emerald-600' : 'text-rose-600'}`} />
              {targetIsWinner ? 'Constituency Defense Buffer' : 'Panna Pramukh Flip Target'}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-0.5 flex items-baseline gap-2">
              <span>{targetIsWinner ? `+${defenseBufferPerBooth}` : `+${votesPerBoothNeeded}`}</span>
              <span className="text-xs font-normal text-slate-600">votes / booth</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {targetIsWinner
                ? `You have a comfortable buffer of ${defenseBufferPerBooth} votes ahead in every booth across ${acName}.`
                : `Flipping just ${votesPerBoothNeeded} undecided voters per polling station wins this entire constituency!`}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
              targetIsWinner ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
            }`}>
              {targetIsWinner ? 'DEFENSE ACTIVE' : 'FLIP ROADMAP'}
            </span>
          </div>
        </div>
      </div>

      {/* Form-20 Booth Triage Segmentation (Interactive Cards) */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Form-20 Booth Triage Matrix (Click Category to View Booth Names)
            </span>
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            Click any card below to inspect individual polling station names
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
          {/* 1. Fortress Booths */}
          <button
            onClick={() => handleSelectTriage('fortress')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedTriageCategory === 'fortress'
                ? 'bg-emerald-100/80 border-emerald-500 ring-2 ring-emerald-400 shadow-sm'
                : 'bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> 1. Fortress Booths
              </span>
              <span className="font-mono font-black text-slate-900">{boothTriage.fortressCount}</span>
            </div>
            <div className="text-[10px] text-slate-500">&gt;60% Loyal Vote Share</div>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200 text-slate-600">
              <span className="text-emerald-700 font-semibold">100% GOTV transport</span>
              <span className="text-[10px] text-indigo-600 font-medium flex items-center gap-0.5">
                {selectedTriageCategory === 'fortress' ? 'Viewing ▼' : 'View →'}
              </span>
            </div>
          </button>

          {/* 2. Battleground / Swing Booths */}
          <button
            onClick={() => handleSelectTriage('battleground')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedTriageCategory === 'battleground'
                ? 'bg-amber-100/80 border-amber-500 ring-2 ring-amber-400 shadow-sm'
                : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-800 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-600" /> 2. Battleground Booths
              </span>
              <span className="font-mono font-black text-slate-900">{boothTriage.battlegroundCount}</span>
            </div>
            <div className="text-[10px] text-amber-700 font-semibold">&le; 45 votes margin (Priority 1)</div>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200 text-slate-600">
              <span className="text-amber-800 font-semibold">Panna Saturation Target</span>
              <span className="text-[10px] text-amber-700 font-bold flex items-center gap-0.5">
                {selectedTriageCategory === 'battleground' ? 'Viewing ▼' : 'View →'}
              </span>
            </div>
          </button>

          {/* 3. Vulnerable / Thin Lead Booths */}
          <button
            onClick={() => handleSelectTriage('vulnerable')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedTriageCategory === 'vulnerable'
                ? 'bg-yellow-100/80 border-yellow-500 ring-2 ring-yellow-400 shadow-sm'
                : 'bg-white border-slate-200 hover:border-yellow-400 hover:bg-yellow-50/50 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-yellow-800 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" /> 3. Vulnerable Holds
              </span>
              <span className="font-mono font-black text-slate-900">{boothTriage.vulnerableCount}</span>
            </div>
            <div className="text-[10px] text-slate-500">Thin leads (1–40 votes)</div>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200 text-slate-600">
              <span className="text-yellow-700">Grievance Redressal</span>
              <span className="text-[10px] text-indigo-600 font-medium flex items-center gap-0.5">
                {selectedTriageCategory === 'vulnerable' ? 'Viewing ▼' : 'View →'}
              </span>
            </div>
          </button>

          {/* 4. Hostile Booths */}
          <button
            onClick={() => handleSelectTriage('hostile')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedTriageCategory === 'hostile'
                ? 'bg-rose-100/80 border-rose-500 ring-2 ring-rose-400 shadow-sm'
                : 'bg-white border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-rose-800 flex items-center gap-1">
                🛑 4. Hostile Fortresses
              </span>
              <span className="font-mono font-black text-slate-900">{boothTriage.hostileCount}</span>
            </div>
            <div className="text-[10px] text-slate-500">&gt;60% Opponent Dominance</div>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200 text-slate-600">
              <span className="text-rose-700">EVM Vigilance</span>
              <span className="text-[10px] text-indigo-600 font-medium flex items-center gap-0.5">
                {selectedTriageCategory === 'hostile' ? 'Viewing ▼' : 'View →'}
              </span>
            </div>
          </button>
        </div>
      </div>
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
                Polling Station Names &amp; Field Roster ({filteredBooths.length} stations)
              </span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-mono border border-indigo-500/30">
                Target: {targetParty}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Target Party Switcher (shown directly on standalone map view) */}
              {standaloneMapOnly && (
                <div className={`flex items-center gap-1 p-0.5 rounded-lg border text-xs font-bold ${
                  theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}>
                  <span className={`text-[10px] px-1.5 uppercase font-semibold ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Target:
                  </span>
                  {(['INC', 'BRS', 'BJP'] as const).map((p) => {
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

              {/* Explorer View Mode Switcher */}
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

              {/* Full Page in New Tab Button (hidden in standalone map mode) */}
              {!standaloneMapOnly && (
                <button
                  type="button"
                  onClick={() => {
                    const url = new URL(window.location.origin + window.location.pathname);
                    url.searchParams.set('dossier', String(acNo));
                    url.searchParams.set('view', 'booth-map');
                    window.open(url.toString(), '_blank');
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 shadow-2xs'
                      : 'bg-slate-800 hover:bg-indigo-900/60 text-slate-200 hover:text-white border-slate-700 shadow-xs'
                  }`}
                  title="Open Polling Station Triage Map Box in dedicated standalone tab"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Open Full Page Map ↗</span>
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

                {/* Form-20 PDF Link if available */}
                {form20PdfUrl && (
                  <a
                    href={form20PdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-lg border transition-colors ${
                      theme === 'light'
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                        : 'bg-slate-800 hover:bg-indigo-900/60 text-slate-300 hover:text-white border-slate-700'
                    }`}
                    title="Open certified Form-20 polling station result sheet from CEO Telangana"
                  >
                    <FileText className="w-3.5 h-3.5 text-rose-400" />
                    <span className="hidden md:inline">CEO Form-20 PDF</span>
                    <span className="md:hidden">PDF</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Filter Buttons & Search */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
              {/* Category selector pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => handleSelectTriage('battleground')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                    selectedTriageCategory === 'battleground'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                      : theme === 'light'
                      ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>Battleground ({boothTriage.battlegroundCount})</span>
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
                >
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>Fortress ({boothTriage.fortressCount})</span>
                </button>
                <button
                  onClick={() => handleSelectTriage('vulnerable')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                    selectedTriageCategory === 'vulnerable'
                      ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-xs'
                      : theme === 'light'
                      ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                  <span>Vulnerable ({boothTriage.vulnerableCount})</span>
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
                >
                  <span>🛑 Hostile ({boothTriage.hostileCount})</span>
                </button>
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
                  <span>All ({totalBooths})</span>
                </button>
              </div>

              {/* Mandal Dropdown & Search Input */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Mandal Filter */}
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

                {/* Search Box */}
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

            {/* Polling Station Map / List Content Display */}
            {explorerViewMode === 'map' ? (
              <div id="booth-triage-map-container" className={standaloneMapOnly ? 'pt-1 flex-1 flex flex-col min-h-0 h-full' : 'pt-1'}>
                <BoothTriageMap
                  acNo={acNo}
                  acName={acName}
                  district={district}
                  targetParty={targetParty}
                  booths={filteredBooths}
                  geoJsonData={geoJsonData}
                  selectedTriageCategory={selectedTriageCategory}
                  onSelectTriageCategory={handleSelectTriage}
                  selectedBoothNo={selectedMapBoothNo}
                  onSelectBooth={(b) => setSelectedMapBoothNo(b ? b.boothNo : null)}
                  onViewVoterRoll={(b) => setInspectedVoterBooth(b)}
                  theme={theme}
                  onThemeChange={setTheme}
                  isFullPageMap={standaloneMapOnly}
                />
              </div>
            ) : (
              <div className={standaloneMapOnly ? 'flex-1 flex flex-col min-h-0 pt-1' : 'pt-1'}>
                {/* Polling Station List Display */}
                <div
                  className={`space-y-2 overflow-y-auto pr-1 ${
                    standaloneMapOnly ? 'flex-1 min-h-0' : 'max-h-96'
                  }`}
                >
                  {filteredBooths.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No polling stations match the current filter or search criteria.
                    </div>
                  ) : (
                    filteredBooths.slice(0, visibleBoothCount).map((b) => {
                      const isBattleground = b.triage === 'battleground';
                      const isFortress = b.triage === 'fortress';
                      const isVulnerable = b.triage === 'vulnerable';
                      const isLead = b.margin > 0;
                      const opponentParty = winnerParty === targetParty ? runnerParty : winnerParty;

                      return (
                        <div
                          key={b.boothNo}
                          className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
                            isBattleground
                              ? theme === 'light'
                                ? 'bg-amber-50/80 border-amber-300 hover:border-amber-500 shadow-2xs'
                                : 'bg-slate-950/80 border-amber-500/40 hover:border-amber-400'
                              : isFortress
                              ? theme === 'light'
                                ? 'bg-emerald-50/80 border-emerald-300 hover:border-emerald-500 shadow-2xs'
                                : 'bg-slate-950/80 border-emerald-500/30 hover:border-emerald-400'
                              : isVulnerable
                              ? theme === 'light'
                                ? 'bg-yellow-50/80 border-yellow-300 hover:border-yellow-500 shadow-2xs'
                                : 'bg-slate-950/80 border-amber-700/30 hover:border-amber-500'
                              : theme === 'light'
                              ? 'bg-rose-50/80 border-rose-300 hover:border-rose-500 shadow-2xs'
                              : 'bg-slate-950/80 border-rose-900/30 hover:border-rose-500'
                          }`}
                        >
                          {/* Top Row: Station No, Name, Location & Status Badge */}
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                                    theme === 'light'
                                      ? 'bg-slate-200 text-slate-800 border-slate-300'
                                      : 'bg-slate-800 text-amber-300 border-slate-700'
                                  }`}
                                >
                                  PS #{b.boothNo}
                                </span>
                                <span
                                  className={`font-bold text-xs sm:text-sm ${
                                    theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                                  }`}
                                >
                                  {b.name}
                                </span>
                              </div>
                              <p className={`text-[11px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                                📍 {b.location} &middot;{' '}
                                <span className={`font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                                  {b.mandalName} Mandal
                                </span>
                              </p>
                            </div>

                            {/* Status Badge & Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setInspectedVoterBooth(b)}
                                className={`px-2 py-0.5 rounded border text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                                  theme === 'light'
                                    ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                                    : 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border-indigo-700'
                                }`}
                                title="Inspect individual voter names, EPIC IDs, and Panna pages"
                              >
                                <Users className="w-3 h-3 text-indigo-500" />
                                <span>Voters ({b.electorate})</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedMapBoothNo(b.boothNo);
                                  setExplorerViewMode('map');
                                  setTimeout(() => {
                                    const mapElem = document.getElementById('booth-triage-map-container');
                                    if (mapElem) {
                                      mapElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }
                                  }, 80);
                                }}
                                className={`px-2 py-0.5 rounded border text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                                  theme === 'light'
                                    ? 'bg-white hover:bg-slate-100 text-indigo-700 border-slate-300'
                                    : 'bg-slate-800 hover:bg-indigo-900/60 text-indigo-300 hover:text-white border-slate-700'
                                }`}
                                title="Locate and fly into this booth on the Geospatial Map"
                              >
                                <MapIcon className="w-3 h-3 text-amber-500" />
                                <span>Locate on Map</span>
                              </button>
                              <span
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${
                                  isBattleground
                                    ? 'bg-amber-500/20 text-amber-600 border-amber-500/40'
                                    : isFortress
                                    ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40'
                                    : isVulnerable
                                    ? 'bg-amber-400/20 text-amber-700 border-amber-400/40'
                                    : 'bg-rose-500/20 text-rose-600 border-rose-500/40'
                                }`}
                              >
                                {isBattleground
                                  ? '🔥 Battleground (≤45 votes)'
                                  : isFortress
                                  ? '🏰 Fortress Hold'
                                  : isVulnerable
                                  ? '⚠️ Vulnerable Hold'
                                  : '🛑 Hostile Stronghold'}
                              </span>
                            </div>
                          </div>

                          {/* Middle Row: Form-20 Votes, Electorate, Margin */}
                          <div
                            className={`grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t text-[11px] ${
                              theme === 'light' ? 'border-slate-200 text-slate-700' : 'border-slate-800/80 text-slate-200'
                            }`}
                          >
                            <div>
                              <span
                                className={`block text-[10px] uppercase ${
                                  theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                                }`}
                              >
                                Registered Electors
                              </span>
                              <span
                                className={`font-mono font-bold ${
                                  theme === 'light' ? 'text-slate-900' : 'text-white'
                                }`}
                              >
                                {b.electorate}
                              </span>
                              <span className={`text-[10px] ml-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                                ({b.pannaPages} pages)
                              </span>
                            </div>

                            <div>
                              <span
                                className={`block text-[10px] uppercase ${
                                  theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                                }`}
                              >
                                Voter Turnout
                              </span>
                              <span className={`font-mono font-bold ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'}`}>
                                {b.turnoutPct}%
                              </span>
                              <span className={`text-[10px] ml-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                                polled
                              </span>
                            </div>

                            <div>
                              <span
                                className={`block text-[10px] uppercase ${
                                  theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                                }`}
                              >
                                Form-20 Polled Votes
                              </span>
                              <span className="font-mono">
                                <strong style={{ color: targetColor }}>
                                  {targetParty}: {b.targetVotes}
                                </strong>{' '}
                                vs {opponentParty}: {b.opponentVotes}
                              </span>
                            </div>

                            <div>
                              <span
                                className={`block text-[10px] uppercase ${
                                  theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                                }`}
                              >
                                Margin Gap
                              </span>
                              <span
                                className={`font-mono font-bold ${
                                  isLead ? 'text-emerald-600' : 'text-rose-600'
                                }`}
                              >
                                {isLead ? `+${b.margin} lead` : `${b.margin} deficit`}
                              </span>
                            </div>
                          </div>

                          {/* Bottom Row: Panna Pramukh Field Directive */}
                          <div
                            className={`pt-1.5 border-t flex items-center justify-between text-[11px] ${
                              theme === 'light' ? 'border-slate-200 text-slate-700' : 'border-slate-800/60 text-slate-300'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>
                                <strong>Panna Directive:</strong> {b.actionNote}
                              </span>
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Pagination / Show More */}
                {filteredBooths.length > visibleBoothCount && (
                  <div
                    className={`pt-2 border-t flex justify-between items-center text-xs shrink-0 ${
                      theme === 'light' ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-mono text-[11px]">
                      Showing {visibleBoothCount} of {filteredBooths.length} stations
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setVisibleBoothCount((prev) => Math.min(filteredBooths.length, prev + 25))}
                        className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer text-xs font-medium ${
                          theme === 'light'
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                            : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                        }`}
                      >
                        Load 25 More
                      </button>
                      <button
                        onClick={() => setVisibleBoothCount(filteredBooths.length)}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer text-xs font-bold"
                      >
                        Show All ({filteredBooths.length})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      {!standaloneMapOnly && (
        <>
          {/* Interactive Panna Pramukh Field Simulator */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Panna Pramukh Field Mobilization Simulator
                </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Adjust booth-level voter conversion and turnout drives
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lever 1: Panna Undecided Conversion Target */}
          <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 font-medium">
                Voters Converted per Polling Station:
              </span>
              <span className="font-mono font-black text-emerald-700 text-sm">
                +{pannaConversionTarget} voters / booth
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={pannaConversionTarget}
              onChange={(e) => setPannaConversionTarget(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 (Passive)</span>
              <span>12 (~1 voter/page)</span>
              <span>25 (Full Saturation)</span>
            </div>

            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-mono">
              Yield: <strong className="text-slate-900">+{simulatedImpact.directPersuasionGain.toLocaleString()} votes</strong> across {totalBooths} booths
            </div>
          </div>

          {/* Lever 2: Turnout Push among Committed Supporters */}
          <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-700 font-medium">
                Target Voter Turnout Mobilization Push:
              </span>
              <span className="font-mono font-black text-indigo-700 text-sm">
                +{turnoutPushPct}% turnout lift
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="6"
              step="0.5"
              value={turnoutPushPct}
              onChange={(e) => setTurnoutPushPct(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Baseline Turnout)</span>
              <span>+3.0% (Mandal Push)</span>
              <span>+6.0% (Hyper-Mobilization)</span>
            </div>

            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-mono">
              Yield: <strong className="text-slate-900">+{simulatedImpact.turnoutExtraVotes.toLocaleString()} extra votes</strong> pulled to booths
            </div>
          </div>
        </div>

        {/* Live Simulation Outcome Banner */}
        <div className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 transition-all ${
          simulatedImpact.isFlipped
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
            : targetIsWinner
            ? 'bg-indigo-50 border-indigo-300 text-indigo-950 shadow-xs'
            : 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-xs'
        }`}>
          <div className="flex items-center gap-2.5">
            {simulatedImpact.isFlipped ? (
              <Sparkles className="w-6 h-6 text-emerald-600 shrink-0 animate-bounce" />
            ) : targetIsWinner ? (
              <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
            ) : (
              <Target className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-900">
                {simulatedImpact.isFlipped
                  ? `🎉 SEAT FLIPPED TO ${targetParty}!`
                  : targetIsWinner
                  ? `🛡️ ${targetParty} DEFENSE FORTIFIED`
                  : `⚠️ STILL SHORT BY ${Math.abs(simulatedImpact.projectedNewMargin).toLocaleString()} VOTES`}
              </div>
              <p className="text-[11px] text-slate-700 opacity-90">
                {simulatedImpact.isFlipped
                  ? `By delivering +${pannaConversionTarget} voters per booth and +${turnoutPushPct}% turnout, ${targetParty} overturns the ${actualMargin.toLocaleString()} deficit to win by ${simulatedImpact.projectedNewMargin.toLocaleString()} votes!`
                  : targetIsWinner
                  ? `Panna mobilization expands ${targetParty}'s lead from ${actualMargin.toLocaleString()} to ${simulatedImpact.projectedNewMargin.toLocaleString()} votes.`
                  : `Need an extra +${Math.ceil(Math.abs(simulatedImpact.projectedNewMargin) / totalBooths)} votes per booth to cross the finish line.`}
              </p>
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Votes Mobilized</div>
            <div className="text-xl font-black text-slate-900">
              +{simulatedImpact.totalSimulatedGain.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Mandal-by-Mandal Master Ground Roster & Panna Quota Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">
              📋 Mandal Ground Roster &amp; Panna Pramukh Allocation ({filteredMandalList.length} Mandals)
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-mono font-bold">
              Live Field Allocation
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search mandal, caste, party..."
                value={mandalTableSearch}
                onChange={(e) => setMandalTableSearch(e.target.value)}
                className="w-48 sm:w-56 bg-white border border-slate-300 rounded-lg pl-8 pr-7 py-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden"
              />
              {mandalTableSearch && (
                <button
                  onClick={() => setMandalTableSearch('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              Quota: {pannaConversionTarget} / booth
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <th className="py-2.5 px-3">Mandal / Circle</th>
                <th className="py-2.5 px-3 text-right">Booths</th>
                <th className="py-2.5 px-3 text-right">Electorate</th>
                <th className="py-2.5 px-3 text-right">Turnout %</th>
                <th className="py-2.5 px-3 text-right">2023 Lead Margin</th>
                <th className="py-2.5 px-3">Dominant Community</th>
                <th className="py-2.5 px-3 text-center">Field Status</th>
                <th className="py-2.5 px-3 text-right font-bold text-emerald-700">Assigned Panna Quota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredMandalList.map((m) => {
                const pannaQuota = Math.round(m.booths * pannaConversionTarget);
                const mColor = getPartyColor(m.lead_party);
                const isTossUp = m.status === 'TOSS_UP';
                const dotCount = Math.min(4, Math.max(1, m.margin < 1000 ? 1 : m.margin < 2000 ? 2 : m.margin < 3500 ? 3 : 4));

                return (
                  <tr key={m.mandal_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900 font-sans">{m.name}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-mono">{m.booths}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-mono">{m.electorate ? m.electorate.toLocaleString() : '—'}</td>
                    <td className="py-2.5 px-3 text-right text-indigo-700 font-bold font-mono">{m.turnout_pct}%</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Lead Intensity Dots */}
                        <div
                          className="flex items-center gap-1 shrink-0"
                          title={`Lead intensity: +${m.margin.toLocaleString()} votes (${dotCount} / 4)`}
                        >
                          {Array.from({ length: dotCount }).map((_, dotIdx) => (
                            <span
                              key={dotIdx}
                              className="w-1.5 h-1.5 rounded-full inline-block shadow-xs"
                              style={{ backgroundColor: mColor }}
                            />
                          ))}
                        </div>
                        <span style={{ color: mColor }}>
                          {m.lead_party} +{m.margin.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-sans">
                      <span className="font-medium text-slate-900">{m.dominant_caste}</span>{' '}
                      <span className="text-[10px] text-slate-400 font-mono">({m.dominant_caste_pct}%)</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {isTossUp ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          TOSS-UP
                        </span>
                      ) : (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold border"
                          style={{
                            backgroundColor: `${mColor}15`,
                            color: mColor,
                            borderColor: `${mColor}35`,
                          }}
                        >
                          {m.status.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-emerald-700">
                      +{pannaQuota.toLocaleString()} votes
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
        </>
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
          form20Margin={inspectedVoterBooth.margin}
          leadParty={
            inspectedVoterBooth.margin >= 0
              ? targetParty
              : winnerParty === targetParty
              ? runnerParty
              : winnerParty
          }
          triage={inspectedVoterBooth.triage}
        />
      )}
    </div>
  );
};
