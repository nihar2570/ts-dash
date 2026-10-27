import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Users,
  FileText,
  Layers,
  Home,
  Check,
  Copy,
  Printer,
  ChevronLeft,
  ChevronRight,
  Building,
  Footprints,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Compass,
  Calendar,
  LayoutGrid,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';
import { OnDemandVoterExtractorModal } from './OnDemandVoterExtractorModal';
import { CONSTITUENCY_MANDALS, type MandalDetail } from '../data/mandalData';
import { fetchBoothVoters, type BoothVoterRollSummary, type ElectorRecord } from '../data/voterRollService';
import {
  predictCaste,
  predictHouseholdCaste,
  type CasteCategory,
  type CastePrediction,
} from '../data/casteClassifierService';
import { planPadayatraRoute, type PadayatraHouseStop } from '../data/padayatraService';
import { AcPadayatraPlannerView } from './AcPadayatraPlannerView';
import type { DemographicsDataset, ConstituencyDemographics } from '../types';

export interface AcItem {
  ac_no: number;
  ac_name: string;
  district: string;
  reservation?: 'GEN' | 'SC' | 'ST';
  winnerParty?: string;
  margin?: number;
}

interface BoothDataViewProps {
  selectedAcNo: number;
  onSelectAc: (acNo: number) => void;
  initialBoothNo?: number;
  onSelectBooth?: (boothNo: number) => void;
  initialViewMode?: 'table' | 'panna' | 'household' | 'padayatra' | 'ac-plan';
  demographicsData?: DemographicsDataset | null;
}

/**
 * Formats household member voter names by omitting the redundant family surname.
 * For Telugu voter rolls, the surname (intiperu) is typically the first word.
 * If a voter has a different surname from the household head, their full name is preserved.
 */
function formatHouseholdMembers(headOfHouse: string, voters: Array<{ name: string }>): string {
  const headTrimmed = headOfHouse.trim();
  const firstSpaceIdx = headTrimmed.indexOf(' ');
  const familySurname = firstSpaceIdx > 0 ? headTrimmed.slice(0, firstSpaceIdx).trim() : '';

  return voters
    .map((v) => {
      const vName = v.name.trim();
      if (!familySurname) return vName;

      const lowerVName = vName.toLowerCase();
      const lowerSurname = familySurname.toLowerCase();
      if (lowerVName.startsWith(lowerSurname + ' ')) {
        const givenName = vName.slice(familySurname.length).trim();
        return givenName || vName;
      }
      return vName;
    })
    .join(', ');
}

export const BoothDataView: React.FC<BoothDataViewProps> = ({
  selectedAcNo,
  onSelectAc,
  initialBoothNo,
  onSelectBooth,
  initialViewMode,
  demographicsData,
}) => {
  // AC selection & search
  const [acSearchQuery, setAcSearchQuery] = useState('');
  const [selectedBoothNo, setSelectedBoothNo] = useState<number>(() => {
    if (initialBoothNo && initialBoothNo >= 1) return initialBoothNo;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const b = parseInt(params.get('booth') || '', 10);
      if (!isNaN(b) && b >= 1) return b;
    }
    return 1;
  });

  useEffect(() => {
    if (initialBoothNo && initialBoothNo >= 1) {
      setSelectedBoothNo(initialBoothNo);
    }
  }, [initialBoothNo]);

  const handleSelectBooth = (boothNo: number) => {
    setSelectedBoothNo(boothNo);
    if (onSelectBooth) onSelectBooth(boothNo);
  };

  const [boothFilterMandal, setBoothFilterMandal] = useState<string>('ALL');
  const [boothSearch, setBoothSearch] = useState<string>('');

  // Elector Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'M' | 'F'>('ALL');
  const [ageCohort, setAgeCohort] = useState<'ALL' | '18-25' | '26-40' | '41-60' | '60+'>('ALL');
  const [casteCategoryFilter, setCasteCategoryFilter] = useState<'ALL' | CasteCategory>('ALL');
  const [selectedPage, setSelectedPage] = useState<number | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'panna' | 'household' | 'padayatra' | 'ac-plan'>(() => {
    if (initialViewMode) return initialViewMode;
    if (typeof window !== 'undefined') {
      const v = new URLSearchParams(window.location.search).get('view');
      if (v === 'padayatra' || v === 'panna' || v === 'household' || v === 'table' || v === 'ac-plan') {
        return v as any;
      }
    }
    return 'table';
  });
  const [copiedEpic, setCopiedEpic] = useState<string | null>(null);

  // Padayatra Route Planner state
  const [padayatraMode, setPadayatraMode] = useState<'strategic_swing' | 'sequential_street'>('strategic_swing');
  const [visitedDoors, setVisitedDoors] = useState<Set<string>>(() => new Set());
  const [padayatraPersuadabilityFilter, setPadayatraPersuadabilityFilter] = useState<string>('ALL');
  const [padayatraVisitedFilter, setPadayatraVisitedFilter] = useState<'ALL' | 'PENDING' | 'VISITED'>('ALL');
  const [copiedTalkingPointDoor, setCopiedTalkingPointDoor] = useState<string | null>(null);
  const [expandedDoorDetails, setExpandedDoorDetails] = useState<Set<string>>(new Set());
  const [padayatraLayout, setPadayatraLayout] = useState<'sheet' | 'cards'>('sheet');
  const [showBoothCheatSheet, setShowBoothCheatSheet] = useState<boolean>(true);
  const [expandedCardPitch, setExpandedCardPitch] = useState<Set<string>>(new Set());

  const toggleCardPitch = (doorNo: string) => {
    setExpandedCardPitch((prev) => {
      const next = new Set(prev);
      if (next.has(doorNo)) {
        next.delete(doorNo);
      } else {
        next.add(doorNo);
      }
      return next;
    });
  };

  const toggleVisitedDoor = (doorNo: string) => {
    setVisitedDoors((prev) => {
      const next = new Set(prev);
      if (next.has(doorNo)) {
        next.delete(doorNo);
      } else {
        next.add(doorNo);
      }
      return next;
    });
  };

  const toggleExpandDoor = (doorNo: string) => {
    setExpandedDoorDetails((prev) => {
      const next = new Set(prev);
      if (next.has(doorNo)) {
        next.delete(doorNo);
      } else {
        next.add(doorNo);
      }
      return next;
    });
  };

  // Pagination for table view
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // Local state for interactive voter triage tag adjustments
  const [voterTags, setVoterTags] = useState<Record<string, ElectorRecord['triageTag']>>({});

  // Active booth voter roll data & loading state
  const [data, setData] = useState<BoothVoterRollSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExtractorModal, setShowExtractorModal] = useState(false);

  const handleReloadBoothVoters = () => {
    if (activeBoothMeta) {
      setLoading(true);
      fetchBoothVoters(
        selectedAcNo,
        activeBoothMeta.boothNo,
        activeBoothMeta.name,
        activeBoothMeta.mandalName,
        activeBoothMeta.electorate,
        true
      ).then((res) => {
        setData(res);
        setLoading(false);
      });
    }
  };

  // All 175 AC list
  const acList: AcItem[] = useMemo(() => {
    if (!demographicsData?.constituencies) {
      return Array.from({ length: 175 }, (_, i) => ({
        ac_no: i + 1,
        ac_name: `Constituency #${i + 1}`,
        district: 'Andhra Pradesh',
      }));
    }
    return Object.values(demographicsData.constituencies).map((c: ConstituencyDemographics) => ({
      ac_no: c.ac_no,
      ac_name: c.ac_name,
      district: c.district,
      reservation: c.reservation,
      winnerParty: c.winner_2023.party,
      margin: c.margin_2023,
    }));
  }, [demographicsData]);

  const currentAc = useMemo((): AcItem => {
    return (
      acList.find((c: AcItem) => c.ac_no === selectedAcNo) ||
      acList[0] || {
        ac_no: selectedAcNo,
        ac_name: `Constituency #${selectedAcNo}`,
        district: 'Andhra Pradesh',
      }
    );
  }, [acList, selectedAcNo]);

  // Official extracted polling stations for the selected AC
  const [officialBooths, setOfficialBooths] = useState<any[]>([]);

  useEffect(() => {
    let isCancelled = false;
    fetch(`/data/booths/ac_${selectedAcNo}.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isCancelled && data && Array.isArray(data) && data.length > 0) {
          setOfficialBooths(data);
        } else if (!isCancelled) {
          setOfficialBooths([]);
        }
      })
      .catch(() => {
        if (!isCancelled) setOfficialBooths([]);
      });
    return () => {
      isCancelled = true;
    };
  }, [selectedAcNo]);

  // Mandals for the currently selected AC
  const mandals: MandalDetail[] = useMemo(() => {
    return CONSTITUENCY_MANDALS[selectedAcNo] || [];
  }, [selectedAcNo]);

  // Total booths across all mandals
  const totalBoothsInAc = useMemo(() => {
    if (officialBooths.length > 0) return officialBooths.length;
    return mandals.reduce((sum, m) => sum + (m.booths || 0), 0) || 240;
  }, [officialBooths, mandals]);

  // Check if all booths for this AC are fully extracted
  const isAcFullyExtracted = useMemo(() => {
    if (selectedAcNo === 175) return true;
    if (officialBooths.length === 0) return false;
    return officialBooths.length > 0 && officialBooths.every((b) => b.isAuthenticExtract);
  }, [selectedAcNo, officialBooths]);

  // Flattened booth catalog for the AC
  const allBoothsInAc = useMemo(() => {
    if (officialBooths.length > 0) {
      return officialBooths.map((b) => {
        const bNo = b.booth_no || b.boothNo;
        const bMandal = b.mandal || mandals[0]?.name || 'Constituency Mandal';
        const matchedMandal = mandals.find((m) => m.name.toLowerCase() === bMandal.toLowerCase());
        return {
          boothNo: bNo,
          name: b.name || `Polling Station #${bNo}`,
          building: b.building || '',
          locality: b.locality || '',
          mandalName: bMandal,
          electorate: b.electorate || 900,
          totalVotes: b.total_votes || 720,
          turnoutPct: b.turnout_pct || 80.0,
          winnerParty: b.winner_party || 'TDP',
          margin: b.margin || 0,
          marginPct: b.margin_pct || 0,
          tier: b.tier || 'STRONGHOLD',
          dominantCaste: matchedMandal?.dominant_caste || mandals[0]?.dominant_caste || 'BC',
          leadParty: b.winner_party || matchedMandal?.lead_party || 'TDP',
          lat: b.lat,
          lng: b.lng,
          isAuthenticExtract: b.isAuthenticExtract || false,
        };
      });
    }

    const list: Array<{
      boothNo: number;
      name: string;
      building?: string;
      locality?: string;
      mandalName: string;
      electorate: number;
      totalVotes?: number;
      turnoutPct?: number;
      winnerParty?: string;
      margin?: number;
      marginPct?: number;
      tier?: string;
      dominantCaste: string;
      leadParty: string;
      lat?: number;
      lng?: number;
      isAuthenticExtract?: boolean;
    }> = [];

    let currentNo = 1;
    mandals.forEach((m) => {
      const bCount = m.booths || 20;
      const avgElectorate = Math.round((m.electorate || 16000) / Math.max(1, bCount));

      for (let i = 1; i <= bCount; i++) {
        list.push({
          boothNo: currentNo,
          name: `Polling Station #${currentNo} - ${m.name} Primary School (${i % 2 === 1 ? 'East' : 'West'} Room)`,
          mandalName: m.name,
          electorate: avgElectorate,
          dominantCaste: m.dominant_caste,
          leadParty: m.lead_party,
        });
        currentNo++;
      }
    });

    return list;
  }, [officialBooths, mandals]);

  // Filtered booth list based on user search & mandal filter
  const filteredBoothsList = useMemo(() => {
    return allBoothsInAc.filter((b) => {
      const matchesMandal = boothFilterMandal === 'ALL' || b.mandalName === boothFilterMandal;
      const matchesSearch =
        !boothSearch.trim() ||
        String(b.boothNo) === boothSearch.trim() ||
        b.name.toLowerCase().includes(boothSearch.toLowerCase()) ||
        b.mandalName.toLowerCase().includes(boothSearch.toLowerCase());
      return matchesMandal && matchesSearch;
    });
  }, [allBoothsInAc, boothFilterMandal, boothSearch]);

  const activeBoothMeta = useMemo(() => {
    return (
      allBoothsInAc.find((b) => b.boothNo === selectedBoothNo) ||
      allBoothsInAc[0] || {
        boothNo: selectedBoothNo,
        name: `Polling Station #${selectedBoothNo}`,
        mandalName: mandals[0]?.name || 'Constituency Mandal',
        electorate: 850,
        dominantCaste: mandals[0]?.dominant_caste || 'BC',
        leadParty: mandals[0]?.lead_party || 'INC',
      }
    );
  }, [allBoothsInAc, selectedBoothNo, mandals]);

  // Load booth data when selectedAcNo or selectedBoothNo changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    if (activeBoothMeta) {
      fetchBoothVoters(
        selectedAcNo,
        activeBoothMeta.boothNo,
        activeBoothMeta.name,
        activeBoothMeta.mandalName,
        activeBoothMeta.electorate
      ).then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
          setCurrentPage(1);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [selectedAcNo, activeBoothMeta]);

  // Precompute onomastic caste predictions for all electors
  const casteMap = useMemo(() => {
    if (!data) return new Map<string, CastePrediction>();
    const map = new Map<string, CastePrediction>();
    const dominantCaste = activeBoothMeta?.dominantCaste;
    for (const e of data.electors) {
      const pred = predictCaste(e.name, e.relativeName, dominantCaste);
      if (pred) {
        map.set(e.epic, pred);
      }
    }
    return map;
  }, [data, activeBoothMeta]);

  // Aggregate booth-level estimated community composition
  const casteSummary = useMemo(() => {
    const counts: Record<CasteCategory, number> = { BC: 0, SC: 0, ST: 0, OC: 0, Minority: 0 };
    if (!data || data.electors.length === 0) return counts;
    for (const e of data.electors) {
      const pred = casteMap.get(e.epic);
      if (pred) counts[pred.category]++;
    }
    return counts;
  }, [data, casteMap]);

  // Filtered electors
  const filteredElectors = useMemo(() => {
    if (!data) return [];
    let list = data.electors;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((e) => {
        const pred = casteMap.get(e.epic);
        return (
          e.name.toLowerCase().includes(q) ||
          e.relativeName.toLowerCase().includes(q) ||
          e.epic.toLowerCase().includes(q) ||
          e.houseNo.toLowerCase().includes(q) ||
          e.section.toLowerCase().includes(q) ||
          (pred && pred.casteName.toLowerCase().includes(q)) ||
          (pred && pred.category.toLowerCase() === q)
        );
      });
    }

    if (genderFilter !== 'ALL') {
      list = list.filter((e) => e.gender === genderFilter);
    }

    if (ageCohort !== 'ALL') {
      if (ageCohort === '18-25') list = list.filter((e) => e.age >= 18 && e.age <= 25);
      else if (ageCohort === '26-40') list = list.filter((e) => e.age >= 26 && e.age <= 40);
      else if (ageCohort === '41-60') list = list.filter((e) => e.age >= 41 && e.age <= 60);
      else if (ageCohort === '60+') list = list.filter((e) => e.age > 60);
    }

    if (casteCategoryFilter !== 'ALL') {
      list = list.filter((e) => {
        const pred = casteMap.get(e.epic);
        return pred?.category === casteCategoryFilter;
      });
    }

    if (selectedPage !== 'ALL') {
      list = list.filter((e) => e.pannaPage === selectedPage);
    }

    return list;
  }, [data, searchQuery, genderFilter, ageCohort, casteCategoryFilter, selectedPage, casteMap]);

  // Paginated view for table
  const paginatedElectors = useMemo(() => {
    if (viewMode === 'panna' || viewMode === 'household') {
      return filteredElectors;
    }
    const start = (currentPage - 1) * pageSize;
    return filteredElectors.slice(start, start + pageSize);
  }, [filteredElectors, currentPage, pageSize, viewMode]);

  const totalPaginationPages = Math.ceil(filteredElectors.length / pageSize) || 1;

  // Household grouping
  const householdGroups = useMemo(() => {
    const map = new Map<string, { houseNo: string; section: string; members: ElectorRecord[] }>();
    for (const e of filteredElectors) {
      if (!map.has(e.houseNo)) {
        map.set(e.houseNo, { houseNo: e.houseNo, section: e.section, members: [] });
      }
      map.get(e.houseNo)!.members.push(e);
    }
    return Array.from(map.values());
  }, [filteredElectors]);

  // Panna grouping
  const pannaGroups = useMemo(() => {
    const pages = new Map<number, ElectorRecord[]>();
    for (const e of filteredElectors) {
      if (!pages.has(e.pannaPage)) {
        pages.set(e.pannaPage, []);
      }
      pages.get(e.pannaPage)!.push(e);
    }
    return Array.from(pages.entries())
      .sort(([a], [b]) => a - b)
      .map(([pageNum, members]) => ({ pageNum, members }));
  }, [filteredElectors]);

  // Padayatra Sequenced Stops & Metrics
  const padayatraStops = useMemo(() => {
    if (!data || data.electors.length === 0) return [];
    return planPadayatraRoute(
      selectedAcNo,
      currentAc.ac_name,
      activeBoothMeta?.boothNo || selectedBoothNo,
      data.electors,
      padayatraMode,
      activeBoothMeta?.dominantCaste
    );
  }, [data, selectedAcNo, currentAc.ac_name, activeBoothMeta, selectedBoothNo, padayatraMode]);

  // Filtered padayatra stops based on user filters
  const filteredPadayatraStops = useMemo(() => {
    return padayatraStops.filter((stop) => {
      if (padayatraPersuadabilityFilter !== 'ALL' && stop.persuadability !== padayatraPersuadabilityFilter) {
        return false;
      }
      const isVisited = visitedDoors.has(stop.doorNumber);
      if (padayatraVisitedFilter === 'PENDING' && isVisited) return false;
      if (padayatraVisitedFilter === 'VISITED' && !isVisited) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesDoor = stop.doorNumber.toLowerCase().includes(q);
        const matchesHead = stop.headOfHouse.toLowerCase().includes(q);
        const matchesCaste = stop.householdCaste.casteName.toLowerCase().includes(q);
        const matchesVoter = stop.voters.some((v) => v.name.toLowerCase().includes(q) || v.epic.toLowerCase().includes(q));
        if (!matchesDoor && !matchesHead && !matchesCaste && !matchesVoter) return false;
      }
      return true;
    });
  }, [padayatraStops, padayatraPersuadabilityFilter, padayatraVisitedFilter, visitedDoors, searchQuery]);

  const padayatraMetrics = useMemo(() => {
    const totalStops = padayatraStops.length;
    const totalVoters = padayatraStops.reduce((sum, s) => sum + s.voterCount, 0);
    const visitedCount = padayatraStops.filter((s) => visitedDoors.has(s.doorNumber)).length;
    const criticalSwingCount = padayatraStops.filter((s) => s.persuadability === 'High Persuadable').length;
    const youthHomes = padayatraStops.filter((s) => s.hasYouth).length;
    const womenHomes = padayatraStops.filter((s) => s.hasWomen).length;
    const estMinutes = Math.round(totalStops * 3.5);
    const progressPct = totalStops > 0 ? Math.round((visitedCount / totalStops) * 100) : 0;
    return {
      totalStops,
      totalVoters,
      visitedCount,
      criticalSwingCount,
      youthHomes,
      womenHomes,
      estMinutes,
      progressPct,
    };
  }, [padayatraStops, visitedDoors]);

  // Dominant caste welfare schemes for the master cheat sheet (displayed ONCE for the booth)
  const boothKeySchemes = useMemo(() => {
    const list: Array<{ caste: string; scheme: string; points: string[] }> = [];
    if (!data || padayatraStops.length === 0) return list;

    const casteCounts = new Map<string, number>();
    padayatraStops.forEach((s) => {
      const c = s.householdCaste.casteName;
      casteCounts.set(c, (casteCounts.get(c) || 0) + 1);
    });

    const sortedCastes = Array.from(casteCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    sortedCastes.forEach(([casteName]) => {
      const sampleStop = padayatraStops.find((s) => s.householdCaste.casteName === casteName);
      if (sampleStop) {
        list.push({
          caste: casteName,
          scheme: sampleStop.talkingPoints.communityPitch.schemeName,
          points: sampleStop.talkingPoints.communityPitch.points,
        });
      }
    });

    return list;
  }, [padayatraStops, data]);

  const handleCopyPadayatraScript = (stop: PadayatraHouseStop) => {
    const text = `🚶‍♂️ MLA Padayatra Door Brief
Door #${stop.doorNumber} | ${stop.section}
Head: ${stop.headOfHouse} (${stop.householdCaste.casteName} - ${stop.householdCaste.probabilityPercent})
Electors: ${stop.voterCount} voters (${stop.persuadability})

🗣️ Talking Points:
1. ${stop.talkingPoints.communityPitch.heading}:
${stop.talkingPoints.communityPitch.points.map((p) => `• ${p}`).join('\n')}

2. Family/Generational:
${stop.talkingPoints.demographicPitch.points.map((p) => `• ${p}`).join('\n')}

3. Local ${currentAc.ac_name} Issue:
• ${stop.talkingPoints.hyperLocalIssue.concern}: ${stop.talkingPoints.hyperLocalIssue.pledge}

⚡ Quick 10s Pitch:
"${stop.talkingPoints.quickElevatorPitch}"`;

    navigator.clipboard?.writeText(text);
    setCopiedTalkingPointDoor(stop.doorNumber);
    setTimeout(() => setCopiedTalkingPointDoor(null), 2500);
  };

  const handleShareWhatsApp = (stop: PadayatraHouseStop) => {
    const text = `🚶‍♂️ *MLA Padayatra Brief - Polling Station #${stop.boothNo || activeBoothMeta?.boothNo || selectedBoothNo}*
*Door #${stop.doorNumber}* | ${stop.section}
*Head:* ${stop.headOfHouse} (${stop.householdCaste.casteName} ~ ${stop.householdCaste.probabilityPercent})
*Electors:* ${stop.voterCount} (${stop.persuadability})

🏛️ *Community Focus (${stop.talkingPoints.communityPitch.schemeName}):*
${stop.talkingPoints.communityPitch.points.map((p) => `• ${p}`).join('\n')}

👥 *Family/Cohort:*
${stop.talkingPoints.demographicPitch.points.map((p) => `• ${p}`).join('\n')}

📍 *AC Issue (${currentAc.ac_name}):*
• ${stop.talkingPoints.hyperLocalIssue.pledge}

⚡ *10-sec Elevator Pitch:*
"${stop.talkingPoints.quickElevatorPitch}"`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyEpic = (epic: string) => {
    navigator.clipboard?.writeText(epic);
    setCopiedEpic(epic);
    setTimeout(() => setCopiedEpic(null), 2000);
  };

  const toggleVoterTag = (epic: string, currentTag: ElectorRecord['triageTag']) => {
    const active = voterTags[epic] || currentTag;
    const cycle: Record<ElectorRecord['triageTag'], ElectorRecord['triageTag']> = {
      committed: 'swing',
      swing: 'lean_opp',
      lean_opp: 'neutral',
      neutral: 'committed',
    };
    setVoterTags((prev) => ({ ...prev, [epic]: cycle[active] }));
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Constituency Selector Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-xs shrink-0">
            #{selectedAcNo}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                {currentAc.ac_name}
              </h2>
              {currentAc.district && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                  {currentAc.district}
                </span>
              )}
              {currentAc.reservation && currentAc.reservation !== 'GEN' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                  {currentAc.reservation}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Statewide E-Panna &amp; Polling Station Roster Explorer &middot;{' '}
              <strong className="text-slate-800">{totalBoothsInAc} Total Polling Stations</strong>
            </p>
          </div>
        </div>

        {/* AC Search & Switcher & 30/60/90 Campaign Switcher */}
        <div className="flex items-center gap-2 flex-1 max-w-xl justify-end flex-wrap">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'ac-plan' ? 'table' : 'ac-plan')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0 ${
              viewMode === 'ac-plan'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black ring-2 ring-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
            }`}
            title="15 / 30 / 60 / 90-Day AC-Wide Padayatra Campaign Itinerary"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-800" />
            <span>{viewMode === 'ac-plan' ? '← Single Booth Roll Mode' : 'Whole AC (15/30/60/90d) Plan'}</span>
          </button>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Jump to AC (e.g. Kuppam, 175, Mangalagiri, Pithapuram)..."
              value={acSearchQuery}
              onChange={(e) => setAcSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <select
            value={selectedAcNo}
            onChange={(e) => {
              const ac = Number(e.target.value);
              onSelectAc(ac);
              setSelectedBoothNo(1);
            }}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-bold focus:outline-hidden cursor-pointer"
          >
            {acList
              .filter(
                (c: AcItem) =>
                  !acSearchQuery.trim() ||
                  c.ac_name.toLowerCase().includes(acSearchQuery.toLowerCase()) ||
                  String(c.ac_no) === acSearchQuery.trim()
              )
              .map((c: AcItem) => (
                <option key={c.ac_no} value={c.ac_no}>
                  AC #{c.ac_no} {c.ac_name} ({c.district})
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Main Content Area: AC-Wide Planner OR Single Booth Roll Explorer */}
      {viewMode === 'ac-plan' ? (
        <AcPadayatraPlannerView
          acNo={selectedAcNo}
          acName={currentAc.ac_name}
          targetParty={currentAc.winnerParty || 'INC'}
          onOpenBoothPadayatra={(boothNo) => {
            handleSelectBooth(boothNo);
            setViewMode('padayatra');
          }}
        />
      ) : (
        /* Main Layout: 2 Columns (Left: Booth Selector Sidebar, Right: E-Panna / Roll Workspace) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 print:block">
        {/* Left Column: Booth Catalog (3 cols) */}
        <div className="lg:col-span-3 space-y-3 print:hidden">
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-indigo-600" />
                Polling Stations ({filteredBoothsList.length})
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Total: {allBoothsInAc.length}
              </span>
            </div>

            {/* Booth Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search booth no. or school..."
                value={boothSearch}
                onChange={(e) => setBoothSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-slate-900"
              />
            </div>

            {/* Mandal Filter */}
            {mandals.length > 0 && (
              <select
                value={boothFilterMandal}
                onChange={(e) => setBoothFilterMandal(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium cursor-pointer"
              >
                <option value="ALL">All Mandals ({mandals.length})</option>
                {mandals.map((m) => (
                  <option key={m.mandal_id} value={m.name}>
                    {m.name} ({m.booths} booths)
                  </option>
                ))}
              </select>
            )}

            {/* Scrollable Booth List */}
            <div className="max-h-[640px] overflow-y-auto space-y-1.5 pr-1">
              {filteredBoothsList.map((b) => {
                const isSelected = b.boothNo === selectedBoothNo;
                return (
                  <button
                    key={b.boothNo}
                    type="button"
                    onClick={() => handleSelectBooth(b.boothNo)}
                    className={`w-full text-left p-2 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-400 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 font-mono">
                        Booth #{b.boothNo}
                      </span>
                      <div className="flex items-center gap-1">
                        {b.winnerParty && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                              b.tier === 'STRONGHOLD'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.tier === 'LEAN'
                                ? 'bg-blue-100 text-blue-800'
                                : b.tier === 'BATTLEGROUND_TOSS_UP'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {b.winnerParty} +{b.marginPct}%
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-500">
                          {b.electorate}v
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5" title={b.name}>
                      {b.name.replace(`Polling Station #${b.boothNo} - `, '')}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span className="truncate max-w-[110px]">{b.mandalName}</span>
                      <div className="flex items-center gap-1">
                        {b.isAuthenticExtract && (
                          <span className="text-[9px] font-mono px-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                            ✓ SIR 2026
                          </span>
                        )}
                        {b.lat && b.lng && (
                          <span className="text-[9px] font-mono text-indigo-500">
                            📍 GPS
                          </span>
                        )}
                        <span className="text-[9px] px-1 rounded bg-slate-200 text-slate-700 font-medium">
                          {b.dominantCaste}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: E-Panna & Roll Register Workspace (9 cols) */}
        <div className="lg:col-span-9 space-y-3 print:w-full print:block">
          {/* Active Booth Summary Header */}
          {data && (
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                      Booth #{data.boothNo} of {totalBoothsInAc}
                    </span>
                    <h3 className="text-sm font-black text-slate-900">
                      {data.boothName}
                    </h3>
                    {activeBoothMeta?.lat && activeBoothMeta?.lng && (
                      <a
                        href={`https://www.google.com/maps?q=${activeBoothMeta.lat},${activeBoothMeta.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md font-mono hover:underline"
                        title="Open Polling Station Location on Google Maps"
                      >
                        📍 {activeBoothMeta.lat.toFixed(4)}, {activeBoothMeta.lng.toFixed(4)} ↗
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                    <span>Mandal: <strong className="text-slate-700">{data.mandalName}</strong></span>
                    <span>&middot;</span>
                    <span>Constituency: <strong className="text-slate-700">AC #{selectedAcNo} {currentAc.ac_name}</strong></span>
                    {activeBoothMeta?.winnerParty && (
                      <>
                        <span>&middot;</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-200">
                          2024 Form 20: <strong className="text-slate-900">{activeBoothMeta.winnerParty}</strong> (+{activeBoothMeta.marginPct}% margin, {activeBoothMeta.totalVotes} votes cast)
                        </span>
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {isAcFullyExtracted ? (
                    <button
                      type="button"
                      disabled
                      className="px-3 py-1.5 rounded-lg border border-emerald-400/40 bg-emerald-50 text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs opacity-90 cursor-default"
                      title="Official 2026 Special Intensive Revision Draft Roll is fully extracted and active for all 205 booths in Kuppam AC"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>✓ 2026 SIR Roll Active (All 205 Booths Extracted)</span>
                    </button>
                  ) : data.isAuthenticExtract ? (
                    <button
                      type="button"
                      onClick={() => setShowExtractorModal(true)}
                      className="px-2.5 py-1.5 rounded-lg border border-emerald-400 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      title="Authentic Official ECI 2026 Voter Roll is loaded. Click to inspect or re-extract."
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>✓ Authentic ECI Roll</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowExtractorModal(true)}
                      className="px-3 py-1.5 rounded-lg border border-amber-500 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg cursor-pointer animate-pulse"
                      title="Extract authentic voter list directly from 2026 ECI Draft Roll PDF in-memory"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current text-slate-950" />
                      <span>⚡ Extract Official Voters (On-Demand)</span>
                    </button>
                  )}

                  {data.roll2026Url && (
                    <a
                      href={data.roll2026Url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      title="View Official CEO / ECI 2026 Special Intensive Revision Draft Roll PDF"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>2026 PDF ({data.totalPages} Pannas) ↗</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="Print E-Roll Register"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Total Electors</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {data.totalElectors}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Gender Split</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {data.femaleCount} F / {data.maleCount} M
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Households</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {data.householdCount} doors
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Panna Pages</span>
                  <span className="font-mono font-bold text-purple-700 text-xs">
                    {data.totalPages} Pages (50/p)
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Est. Community Mix</span>
                  {casteSummary.BC + casteSummary.SC + casteSummary.ST + casteSummary.OC + casteSummary.Minority > 0 ? (
                    <div className="flex items-center gap-1 text-[10px] font-mono font-bold truncate">
                      <span className="text-blue-700">{data.totalElectors ? Math.round((casteSummary.BC / data.totalElectors) * 100) : 0}% BC</span>
                      <span>·</span>
                      <span className="text-purple-700">{data.totalElectors ? Math.round((casteSummary.SC / data.totalElectors) * 100) : 0}% SC</span>
                      <span>·</span>
                      <span className="text-amber-700">{data.totalElectors ? Math.round((casteSummary.ST / data.totalElectors) * 100) : 0}% ST</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-mono italic text-[10px]">Data to be added</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Elector Workspace Card */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            {/* Tier 1: View Mode Tabs */}
            <div className="bg-slate-50/70 border-b border-slate-200 px-3.5 pt-2 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 border-t border-x ${
                    viewMode === 'table'
                      ? 'bg-white text-indigo-700 border-slate-200 -mb-px shadow-2xs font-black'
                      : 'bg-transparent text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>E-Roll Register</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('panna')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 border-t border-x ${
                    viewMode === 'panna'
                      ? 'bg-white text-emerald-700 border-slate-200 -mb-px shadow-2xs font-black'
                      : 'bg-transparent text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/60'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Panna Pages</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('household')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 border-t border-x ${
                    viewMode === 'household'
                      ? 'bg-white text-amber-700 border-slate-200 -mb-px shadow-2xs font-black'
                      : 'bg-transparent text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/60'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Door-to-Door</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('padayatra')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 border-t border-x ${
                    viewMode === 'padayatra'
                      ? 'bg-white text-amber-900 border-amber-300 -mb-px shadow-2xs font-black ring-1 ring-amber-300'
                      : 'bg-amber-50/60 text-amber-900 hover:bg-amber-100/80 border-transparent'
                  }`}
                  title="1-Click MLA Padayatra Sequenced Route & Household Talking Points"
                >
                  <Footprints className="w-3.5 h-3.5 text-amber-600" />
                  <span>🚶‍♂️ Booth Padayatra Script</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 font-mono pb-2 hidden sm:block">
                Booth #{data?.boothNo || selectedBoothNo} &middot; {data?.totalElectors || 0} Voters ({data?.householdCount || 0} Doors)
              </div>
            </div>

            {/* Tier 2: Elector Filter Controls (Shown for Table, Panna, & Door-to-Door views) */}
            {viewMode !== 'padayatra' && (
              <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-1 min-w-[280px] flex-wrap">
                  {/* Search box with ample width */}
                  <div className="relative w-64 max-w-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search EPIC, panna page..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-8 pr-6 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs shrink-0">
                    {(['ALL', 'M', 'F'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setGenderFilter(g);
                          setCurrentPage(1);
                        }}
                        className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                          genderFilter === g
                            ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {g === 'ALL' ? 'All' : g === 'M' ? 'M' : 'F'}
                      </button>
                    ))}
                  </div>

                  {/* Community */}
                  <select
                    value={casteCategoryFilter}
                    onChange={(e) => {
                      setCasteCategoryFilter(e.target.value as 'ALL' | CasteCategory);
                      setCurrentPage(1);
                    }}
                    className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-slate-700 font-medium cursor-pointer"
                  >
                    <option value="ALL">All Communities</option>
                    <option value="BC">BC ({casteSummary.BC}) · {data ? Math.round((casteSummary.BC / data.totalElectors) * 100) : 0}%</option>
                    <option value="SC">SC ({casteSummary.SC}) · {data ? Math.round((casteSummary.SC / data.totalElectors) * 100) : 0}%</option>
                    <option value="ST">ST ({casteSummary.ST}) · {data ? Math.round((casteSummary.ST / data.totalElectors) * 100) : 0}%</option>
                    <option value="OC">OC ({casteSummary.OC}) · {data ? Math.round((casteSummary.OC / data.totalElectors) * 100) : 0}%</option>
                    <option value="Minority">Minority ({casteSummary.Minority}) · {data ? Math.round((casteSummary.Minority / data.totalElectors) * 100) : 0}%</option>
                  </select>

                  {/* Age */}
                  <select
                    disabled
                    className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-400 cursor-not-allowed"
                    title="Age data to be added from official rolls"
                  >
                    <option value="ALL">Age: Data to be added</option>
                  </select>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  Showing {filteredElectors.length} of {data?.totalElectors || 0} electors
                </div>
              </div>
            )}

            {/* View Content */}
            <div className="p-3 bg-slate-50/50">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-3">
                  <div className="w-7 h-7 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-semibold">Loading voter roll for Booth #{selectedBoothNo}...</p>
                </div>
              ) : filteredElectors.length === 0 ? (
                <div className="h-56 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Users className="w-7 h-7 stroke-1" />
                  <p className="text-xs font-semibold">No electors match current filters.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setGenderFilter('ALL');
                      setAgeCohort('ALL');
                      setCasteCategoryFilter('ALL');
                      setSelectedPage('ALL');
                    }}
                    className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : viewMode === 'table' ? (
                /* ROLL TABLE VIEW */
                <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3 w-12 text-center">Sl</th>
                        <th className="py-2.5 px-3 w-28 font-mono">EPIC</th>
                        <th className="py-2.5 px-3">Elector Name</th>
                        <th className="py-2.5 px-3 w-36">Est. Community</th>
                        <th className="py-2.5 px-3">Relative Name</th>
                        <th className="py-2.5 px-3 w-20">Door</th>
                        <th className="py-2.5 px-3 w-28 text-center">Age</th>
                        <th className="py-2.5 px-3 w-14 text-center">Gender</th>
                        <th className="py-2.5 px-3 w-16 text-center">Panna</th>
                        <th className="py-2.5 px-3 w-28 text-center">Field Tag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {paginatedElectors.map((e) => {
                        const tag = voterTags[e.epic] || e.triageTag;
                        const pred = casteMap.get(e.epic);
                        return (
                          <tr key={e.epic} className="hover:bg-indigo-50/40 transition-colors">
                            <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">
                              {e.slNo}
                            </td>
                            <td className="py-2 px-3 font-mono font-semibold text-slate-900">
                              <div className="flex items-center gap-1">
                                <span className="text-[11px]">{e.epic}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyEpic(e.epic)}
                                  className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                                  title="Copy EPIC ID"
                                >
                                  {copiedEpic === e.epic ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="py-2 px-3 font-bold text-slate-900">
                              {e.name === 'Data to be added' ? (
                                <span className="text-slate-400 font-mono italic font-normal text-[11px]">Data to be added</span>
                              ) : (
                                <span>{e.name}</span>
                              )}
                            </td>
                            <td className="py-2 px-3">
                              {pred ? (
                                <div className="flex items-center gap-1.5" title={`Source: ${pred.sourceBasis} (${pred.confidenceTier} confidence)`}>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${pred.color.badge}`}>
                                    {pred.casteName}
                                  </span>
                                  <span className="font-mono text-[10px] font-semibold text-slate-500">
                                    {pred.probabilityPercent}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-400 font-mono text-[10px] italic">Data to be added</span>
                              )}
                            </td>
                            <td className="py-2 px-3 text-slate-600">
                              {e.relativeName === 'Data to be added' ? (
                                <span className="text-slate-400 font-mono italic text-[11px]">Data to be added</span>
                              ) : (
                                <>
                                  <span className="text-[10px] text-slate-400 font-mono mr-1">
                                    ({e.relationType}/o)
                                  </span>
                                  {e.relativeName}
                                </>
                              )}
                            </td>
                            <td className="py-2 px-3 font-mono font-medium text-slate-700">
                              {e.houseNo === 'Data to be added' ? (
                                <span className="text-slate-400 font-mono italic text-[10px]">Data to be added</span>
                              ) : (
                                e.houseNo
                              )}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span className="text-[10px] text-slate-400 font-mono italic">
                                Data to be added
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${e.gender === 'F' ? 'bg-pink-100 text-pink-700 border border-pink-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                {e.gender}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-500">
                              P.{e.pannaPage}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => toggleVoterTag(e.epic, e.triageTag)}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer ${
                                  tag === 'committed'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : tag === 'swing'
                                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                                    : tag === 'lean_opp'
                                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                                    : 'bg-slate-100 text-slate-600 border-slate-300'
                                }`}
                              >
                                {tag === 'committed' ? '✓ Committed' : tag === 'swing' ? '⚡ Swing' : tag === 'lean_opp' ? '✕ Opponent' : '○ Neutral'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : viewMode === 'panna' ? (
                /* PANNA PRAMUKH VIEW */
                <div className="space-y-3">
                  {pannaGroups.map((group) => (
                    <div key={group.pageNum} className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                      <div className="px-3.5 py-2 bg-gradient-to-r from-emerald-950 to-slate-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-emerald-400" />
                          <span className="font-bold text-xs font-mono">
                            Panna Page #{group.pageNum}
                          </span>
                          <span className="text-[11px] text-slate-300">
                            ({group.members.length} Electors)
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-300">
                          Sl #{group.members[0]?.slNo} – #{group.members[group.members.length - 1]?.slNo}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2.5">
                        {group.members.map((e) => {
                          const tag = voterTags[e.epic] || e.triageTag;
                          const pred = casteMap.get(e.epic);
                          return (
                            <div key={e.epic} className="p-2 rounded-lg border border-slate-200 bg-slate-50/60 text-xs space-y-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <span className="font-mono text-[9px] text-slate-400 block">
                                    Sl #{e.slNo} &middot; {e.epic}
                                  </span>
                                  <div className="font-bold text-slate-900 text-xs">
                                    {e.name === 'Data to be added' ? (
                                      <span className="text-slate-400 font-mono italic font-normal text-[11px]">Data to be added</span>
                                    ) : (
                                      e.name
                                    )}
                                  </div>
                                </div>
                                <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${tag === 'committed' ? 'bg-emerald-100 text-emerald-800' : tag === 'swing' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>
                                  {tag.toUpperCase()}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {e.relativeName === 'Data to be added' ? (
                                  <span className="text-slate-400 font-mono italic">Data to be added</span>
                                ) : (
                                  `${e.relationType}/o ${e.relativeName}`
                                )}
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                                <span>Door: {e.houseNo === 'Data to be added' ? <span className="text-slate-400 font-mono italic font-normal">Data to be added</span> : <strong>{e.houseNo}</strong>}</span>
                                {pred ? (
                                  <span className={`px-1 py-0.2 rounded font-bold text-[9px] border ${pred.color.badge}`} title={pred.sourceBasis}>
                                    {pred.casteName} ({pred.probabilityPercent})
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-mono text-[9px] italic">Data to be added</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : viewMode === 'padayatra' ? (
                /* MLA PADAYATRA ROUTE & KEY TALKING POINTS */
                <div className="space-y-4">
                  {/* Padayatra Route Controls & KPI Summary Header */}
                  <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white rounded-xl p-4 shadow-sm border border-amber-500/30 space-y-3 print:hidden">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Footprints className="w-3.5 h-3.5" />
                            1-Click MLA Padayatra Route Planner
                          </span>
                          <span className="text-xs text-amber-300 font-mono">
                            Polling Station #{activeBoothMeta?.boothNo || selectedBoothNo} ({activeBoothMeta?.mandalName})
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100">
                          {padayatraMode === 'strategic_swing'
                            ? '🎯 Strategic Swing Focus: Ranked by electoral impact & persuadability yield'
                            : '🚶 Sequential Street Walking Path: Consecutive door order (minimizes walking distance)'}
                        </h4>
                      </div>

                      {/* Route Mode Switcher */}
                      <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-amber-400/30 text-xs">
                        <button
                          type="button"
                          onClick={() => setPadayatraMode('strategic_swing')}
                          className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            padayatraMode === 'strategic_swing'
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'text-amber-200 hover:text-white'
                          }`}
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>Strategic Swing</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPadayatraMode('sequential_street')}
                          className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            padayatraMode === 'sequential_street'
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'text-amber-200 hover:text-white'
                          }`}
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>Street Sequence</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar & Real-time Walking Tracker */}
                    <div className="pt-2 border-t border-amber-500/20 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-200 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Padayatra Progress: <strong className="text-white font-mono">{padayatraMetrics.visitedCount}</strong> of <strong className="text-white font-mono">{padayatraMetrics.totalStops}</strong> doors visited ({padayatraMetrics.progressPct}%)
                        </span>
                        {padayatraMetrics.visitedCount > 0 && (
                          <button
                            type="button"
                            onClick={() => setVisitedDoors(new Set())}
                            className="text-[11px] text-amber-300 hover:text-amber-100 underline cursor-pointer"
                          >
                            Reset Checklist
                          </button>
                        )}
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-amber-500/20">
                        <div
                          className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-300"
                          style={{ width: `${padayatraMetrics.progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Metrics Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-amber-500/20 text-xs">
                      <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">
                        <span className="text-[10px] text-amber-300/80 block uppercase">Total Route Stops</span>
                        <span className="text-sm font-black font-mono text-white">{padayatraMetrics.totalStops} Doors</span>
                      </div>
                      <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">
                        <span className="text-[10px] text-amber-300/80 block uppercase">Electors Covered</span>
                        <span className="text-sm font-black font-mono text-white">{padayatraMetrics.totalVoters} Voters</span>
                      </div>
                      <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">
                        <span className="text-[10px] text-amber-300/80 block uppercase">Critical Swing Homes</span>
                        <span className="text-sm font-black font-mono text-amber-300">{padayatraMetrics.criticalSwingCount}</span>
                      </div>
                      <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">
                        <span className="text-[10px] text-amber-300/80 block uppercase">Youth (18–25) Homes</span>
                        <span className="text-sm font-black font-mono text-indigo-300">{padayatraMetrics.youthHomes}</span>
                      </div>
                      <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">
                        <span className="text-[10px] text-amber-300/80 block uppercase">Women Voters Homes</span>
                        <span className="text-sm font-black font-mono text-pink-300">{padayatraMetrics.womenHomes}</span>
                      </div>
                      <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">
                        <span className="text-[10px] text-amber-300/80 block uppercase">Est. Walk Duration</span>
                        <span className="text-sm font-black font-mono text-emerald-300">~{padayatraMetrics.estMinutes} mins</span>
                      </div>
                    </div>
                  </div>

                  {/* Padayatra Toolbar: Layout Switcher, Filters & Print Walking Sheet */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Layout Switcher */}
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs shrink-0">
                        <button
                          type="button"
                          onClick={() => setPadayatraLayout('sheet')}
                          className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            padayatraLayout === 'sheet'
                              ? 'bg-white text-indigo-700 shadow-2xs font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>Walking Sheet (Compact)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPadayatraLayout('cards')}
                          className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            padayatraLayout === 'cards'
                              ? 'bg-white text-indigo-700 shadow-2xs font-black'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                          <span>Stop Cards</span>
                        </button>
                      </div>

                      {/* Filters */}
                      <select
                        value={padayatraPersuadabilityFilter}
                        onChange={(e) => setPadayatraPersuadabilityFilter(e.target.value)}
                        className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-700 font-medium cursor-pointer"
                      >
                        <option value="ALL">All Persuadability</option>
                        <option value="High Persuadable">⚡ High Persuadable</option>
                        <option value="Lean Support">🎯 Lean Support</option>
                        <option value="Base Fortress">🛡️ Base Fortress</option>
                        <option value="Challenger Lean">⚠️ Challenger Lean</option>
                      </select>

                      <select
                        value={padayatraVisitedFilter}
                        onChange={(e) => setPadayatraVisitedFilter(e.target.value as 'ALL' | 'PENDING' | 'VISITED')}
                        className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-700 font-medium cursor-pointer"
                      >
                        <option value="ALL">All Doors ({padayatraStops.length})</option>
                        <option value="PENDING">Pending Walk ({padayatraStops.length - visitedDoors.size})</option>
                        <option value="VISITED">Visited ({visitedDoors.size})</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setShowBoothCheatSheet((prev) => !prev)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                          showBoothCheatSheet
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        <span>{showBoothCheatSheet ? 'Hide Master Brief' : 'Show Master Brief'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3 py-1 bg-slate-900 hover:bg-black text-amber-300 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                        title="Print clean 2-page walking sheet for field volunteers"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Walking Sheet</span>
                      </button>
                    </div>
                  </div>

                  {/* Master Booth Talking Points Reference Brief (Displayed ONCE for the whole booth) */}
                  {showBoothCheatSheet && (
                    <div className="bg-white rounded-xl border border-indigo-100 p-3.5 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                            Master Field Reference
                          </span>
                          <h4 className="text-xs font-black text-slate-900">
                            Booth #{activeBoothMeta?.boothNo || selectedBoothNo} Core Campaign Talking Points
                          </h4>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Use these core pillars as needed across all doors
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        {/* Pillar 1: Dominant Caste Welfare Schemes */}
                        <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 space-y-1.5">
                          <span className="text-[10px] font-black text-blue-900 uppercase tracking-wide flex items-center gap-1">
                            🏛️ Key Community Schemes in this Booth:
                          </span>
                          <div className="space-y-1.5">
                            {boothKeySchemes.map((s, idx) => (
                              <div key={idx} className="text-[11px] text-slate-800">
                                <strong className="text-blue-800 font-bold">{s.caste}:</strong> {s.scheme} &middot;{' '}
                                <span className="text-slate-600">{s.points[0]}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Pillar 2: Demographic / Family Guarantees */}
                        <div className="p-2.5 bg-pink-50/50 rounded-lg border border-pink-100 space-y-1.5">
                          <span className="text-[10px] font-black text-pink-900 uppercase tracking-wide flex items-center gap-1">
                            👥 Demographic Guarantees:
                          </span>
                          <ul className="space-y-1 text-[11px] text-slate-700">
                            <li>
                              <strong className="text-pink-800">Youth (18–25):</strong> APPSC annual job calendar &amp; Mega DSC recruitment drive.
                            </li>
                            <li>
                              <strong className="text-pink-800">Women:</strong> Aadabidda Nidhi ₹1,500/m aid, Deepam 3 gas cylinders &amp; free bus travel.
                            </li>
                            <li>
                              <strong className="text-pink-800">Seniors (60+):</strong> NTR Bharosa monthly social security pension to ₹4,000.
                            </li>
                          </ul>
                        </div>

                        {/* Pillar 3: Local Constituency Issue */}
                        <div className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-100 space-y-1.5">
                          <span className="text-[10px] font-black text-amber-900 uppercase tracking-wide flex items-center gap-1">
                            📍 Local Ground Concern ({currentAc.ac_name}):
                          </span>
                          <p className="text-[11px] text-slate-900 font-bold">
                            {padayatraStops[0]?.talkingPoints?.hyperLocalIssue?.concern || 'Local infrastructure & civic amenities'}
                          </p>
                          <p className="text-[11px] text-slate-600">
                            {padayatraStops[0]?.talkingPoints?.hyperLocalIssue?.pledge || 'Prioritize development and community welfare funds'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VIEW MODE 1: COMPACT FIELD WALKING SHEET (ROSTER TABLE) */}
                  {padayatraLayout === 'sheet' ? (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-2.5 px-3 w-10 text-center">✓</th>
                            <th className="py-2.5 px-3 w-12 text-center font-mono">Stop</th>
                            <th className="py-2.5 px-3 w-20 font-mono">Door</th>
                            <th className="py-2.5 px-3 min-w-[200px]">Head of Household</th>
                            <th className="py-2.5 px-3 w-44 whitespace-nowrap">Est. Caste</th>
                            <th className="py-2.5 px-3 w-16 text-center">Voters</th>
                            <th className="py-2.5 px-3 w-24 text-center whitespace-nowrap">Triage</th>
                            <th className="py-2.5 px-3 w-32 text-center hidden print:table-cell">Field Notes</th>
                            <th className="py-2.5 px-3 w-28 text-center print:hidden whitespace-nowrap pr-4">Action</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-800">
                          {filteredPadayatraStops.map((stop) => {
                            const isVisited = visitedDoors.has(stop.doorNumber);
                            return (
                              <React.Fragment key={stop.doorNumber}>
                                {/* Row 1: Household Roster Details */}
                                <tr
                                  className={`transition-colors hover:bg-slate-50/80 ${
                                    isVisited ? 'bg-emerald-50/30' : 'bg-white'
                                  }`}
                                >
                                  <td className="pt-2.5 pb-1 px-3 text-center">
                                    <input
                                      type="checkbox"
                                      checked={isVisited}
                                      onChange={() => toggleVisitedDoor(stop.doorNumber)}
                                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-3.5 h-3.5 print:hidden"
                                    />
                                    <span className="hidden print:inline-block w-3.5 h-3.5 border border-slate-400 rounded-xs" />
                                  </td>
                                  <td className="pt-2.5 pb-1 px-3 text-center font-mono font-bold text-slate-600">
                                    #{stop.stopNumber}
                                  </td>
                                  <td className="pt-2.5 pb-1 px-3 font-mono font-bold text-slate-900">
                                    {stop.doorNumber}
                                  </td>
                                  <td className="pt-2.5 pb-1 px-3 min-w-[200px]">
                                    <div className="font-bold text-slate-900">{stop.headOfHouse}</div>
                                    <div className="text-[10px] text-slate-500 font-medium truncate max-w-md">
                                      {formatHouseholdMembers(stop.headOfHouse, stop.voters)}
                                    </div>
                                  </td>
                                  <td className="pt-2.5 pb-1 px-3 whitespace-nowrap">
                                    <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${stop.householdCaste.color.badge}`}>
                                        {stop.householdCaste.casteName}
                                      </span>
                                      <span className="text-[9px] font-mono text-slate-500 font-semibold whitespace-nowrap">
                                        {stop.householdCaste.probabilityPercent}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="pt-2.5 pb-1 px-3 text-center font-mono font-bold">
                                    <span>{stop.voterCount}</span>
                                    <div className="flex justify-center gap-0.5 mt-0.5">
                                      {stop.hasYouth && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Youth in home" />}
                                      {stop.hasWomen && <span className="w-1.5 h-1.5 rounded-full bg-pink-500" title="Women in home" />}
                                      {stop.hasSenior && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" title="Senior in home" />}
                                    </div>
                                  </td>
                                  <td className="pt-2.5 pb-1 px-3 text-center whitespace-nowrap">
                                    <span
                                      className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                        stop.persuadability === 'High Persuadable'
                                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                                          : stop.persuadability === 'Lean Support'
                                          ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                                          : stop.persuadability === 'Base Fortress'
                                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                          : 'bg-rose-100 text-rose-900 border-rose-300'
                                      }`}
                                    >
                                      {stop.persuadability === 'High Persuadable'
                                        ? '⚡ Swing'
                                        : stop.persuadability === 'Lean Support'
                                        ? '🎯 Lean'
                                        : stop.persuadability === 'Base Fortress'
                                        ? '🛡️ Fortress'
                                        : 'Challenger'}
                                    </span>
                                  </td>
                                  <td className="pt-2.5 pb-1 px-3 hidden print:table-cell text-slate-300 font-mono text-[9px] text-center">
                                    ________________
                                  </td>
                                  <td className="pt-2.5 pb-1 px-3 text-center print:hidden pr-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleShareWhatsApp(stop)}
                                        className="p-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                                        title="Share household brief on WhatsApp"
                                      >
                                        <Share2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyPadayatraScript(stop)}
                                        className="p-1.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                                        title="Copy script"
                                      >
                                        {copiedTalkingPointDoor === stop.doorNumber ? (
                                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                                {/* Row 2: Personalized Doorway Hook (Full Row) */}
                                <tr
                                  className={`transition-colors border-b border-slate-200 ${
                                    isVisited ? 'bg-emerald-50/20' : 'bg-white hover:bg-slate-50/50'
                                  }`}
                                >
                                  <td colSpan={8} className="pt-0.5 pb-2.5 px-3 pr-4">
                                    <div className="flex items-start sm:items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50/60 border border-amber-200/70 text-slate-800 print:bg-white print:border-slate-300">
                                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded border border-amber-300 shrink-0 print:border-slate-400 print:text-slate-900 print:bg-slate-100">
                                        <Sparkles className="w-3 h-3 text-amber-600 print:hidden" />
                                        Personalized Doorway Hook
                                      </span>
                                      <p className="text-[11px] text-slate-800 font-medium italic leading-relaxed min-w-0">
                                        &ldquo;{stop.talkingPoints.quickElevatorPitch}&rdquo;
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    /* VIEW MODE 2: STOP CARDS (COMPACT WITH EXPANDABLE DETAILS) */
                    <div className="space-y-2.5">
                      {filteredPadayatraStops.map((stop) => {
                        const isVisited = visitedDoors.has(stop.doorNumber);
                        const isExpandedPitch = expandedCardPitch.has(stop.doorNumber);
                        const isExpandedVoters = expandedDoorDetails.has(stop.doorNumber);
                        return (
                          <div
                            key={stop.doorNumber}
                            className={`bg-white rounded-xl border transition-all shadow-2xs overflow-hidden ${
                              isVisited
                                ? 'border-emerald-300 bg-emerald-50/20 opacity-80'
                                : stop.persuadability === 'High Persuadable'
                                ? 'border-amber-300 ring-1 ring-amber-200'
                                : 'border-slate-200'
                            }`}
                          >
                            <div className="p-3 space-y-2">
                              {/* Row 1: Header & Quick Status */}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-900 text-amber-300">
                                    Stop #{stop.stopNumber}
                                  </span>
                                  <span className="font-bold text-sm text-slate-900">
                                    Door #{stop.doorNumber}
                                  </span>
                                  <span className="text-xs text-slate-500 font-medium">
                                    Head: <strong className="text-slate-800">{stop.headOfHouse}</strong>
                                  </span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stop.householdCaste.color.badge}`}>
                                    {stop.householdCaste.casteName} ({stop.householdCaste.probabilityPercent})
                                  </span>
                                  <span
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                      stop.persuadability === 'High Persuadable'
                                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                                        : stop.persuadability === 'Lean Support'
                                        ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                                        : stop.persuadability === 'Base Fortress'
                                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                        : 'bg-rose-100 text-rose-900 border-rose-300'
                                    }`}
                                  >
                                    {stop.persuadability}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleShareWhatsApp(stop)}
                                    className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                  >
                                    <Share2 className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => toggleVisitedDoor(stop.doorNumber)}
                                    className={`px-2 py-1 rounded font-bold text-[11px] flex items-center gap-1 border cursor-pointer ${
                                      isVisited
                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                                    }`}
                                  >
                                    <CheckCircle2 className={`w-3 h-3 ${isVisited ? 'text-emerald-600' : 'text-slate-400'}`} />
                                    <span>{isVisited ? 'Visited ✓' : 'Mark Visited'}</span>
                                  </button>
                                </div>
                              </div>

                              {/* Row 2: Personalized 1-Liner Doorway Hook */}
                              <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-200/60 text-xs flex items-start justify-between gap-2">
                                <p className="text-slate-800 font-medium italic text-[11px]">
                                  &ldquo;{stop.talkingPoints.openingGreeting} {stop.talkingPoints.quickElevatorPitch}&rdquo;
                                </p>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandDoor(stop.doorNumber)}
                                    className="text-[10px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                                  >
                                    {isExpandedVoters ? 'Hide Voters' : `${stop.voterCount} Voters`}
                                  </button>
                                  <span className="text-slate-300">&middot;</span>
                                  <button
                                    type="button"
                                    onClick={() => toggleCardPitch(stop.doorNumber)}
                                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                                  >
                                    {isExpandedPitch ? 'Hide Schemes ▲' : 'View Schemes ▼'}
                                  </button>
                                </div>
                              </div>

                              {/* Collapsible Voters Strip */}
                              {isExpandedVoters && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                                  {stop.voters.map((v) => (
                                    <div key={v.epic} className="p-1 rounded bg-white border border-slate-200 text-[11px]">
                                      <span className="font-bold text-slate-800 block truncate">
                                        {v.name === 'Data to be added' ? <span className="text-slate-400 font-mono italic font-normal">Data to be added</span> : v.name}
                                      </span>
                                      <span className="font-mono text-[9px] text-slate-500">({v.gender}) &middot; <span className="text-slate-400 italic">Data to be added</span> &middot; {v.triageTag}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Collapsible Full Talking Points Details */}
                              {isExpandedPitch && (
                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-blue-700 uppercase">
                                      🏛️ {stop.talkingPoints.communityPitch.heading}
                                    </span>
                                    <p className="text-[11px] text-slate-600">{stop.talkingPoints.communityPitch.points[0]}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-pink-700 uppercase">
                                      👥 Family Focus
                                    </span>
                                    <p className="text-[11px] text-slate-600">{stop.talkingPoints.demographicPitch.points[0]}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-amber-700 uppercase">
                                      📍 Local Concern
                                    </span>
                                    <p className="text-[11px] text-slate-600">{stop.talkingPoints.hyperLocalIssue.pledge}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* HOUSEHOLD / DOOR-TO-DOOR VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {householdGroups.map((h) => {
                    const hCaste = predictHouseholdCaste(h.members, activeBoothMeta?.dominantCaste);
                    return (
                      <div key={h.houseNo} className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <Home className="w-3.5 h-3.5 text-amber-600" />
                            <span className="font-mono font-bold text-xs text-slate-900">
                              Door #{h.houseNo}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${hCaste.color.badge}`}>
                              {hCaste.casteName} · {hCaste.probabilityPercent}
                            </span>
                            <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded-full">
                              {h.members.length}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          {h.members.map((m) => {
                            const pred = casteMap.get(m.epic);
                            return (
                              <div key={m.epic} className="flex items-center justify-between text-xs py-0.5 px-1 rounded bg-slate-50">
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold text-slate-800 text-[11px]">
                                    {m.name === 'Data to be added' ? <span className="text-slate-400 font-mono italic font-normal">Data to be added</span> : m.name}
                                  </span>
                                  {pred && (
                                    <span className={`text-[8px] px-1 rounded font-medium border ${pred.color.badge}`}>
                                      {pred.casteName}
                                    </span>
                                  )}
                                </div>
                                <span className="font-mono text-[9px] text-slate-500">
                                  ({m.gender}) &middot; <span className="text-slate-400 italic">Data to be added</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {viewMode === 'table' && totalPaginationPages > 1 && (
              <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing {paginatedElectors.length} of {filteredElectors.length} electors (Page {currentPage} of {totalPaginationPages})
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs">
                    {currentPage} / {totalPaginationPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPaginationPages, p + 1))}
                    disabled={currentPage === totalPaginationPages}
                    className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* On-Demand ECI Voter Roll Extractor Modal */}
      <OnDemandVoterExtractorModal
        isOpen={showExtractorModal}
        onClose={() => setShowExtractorModal(false)}
        acNo={selectedAcNo}
        acName={currentAc?.ac_name}
        boothNo={activeBoothMeta.boothNo}
        boothName={activeBoothMeta.name}
        mandalName={activeBoothMeta.mandalName}
        electorate={activeBoothMeta.electorate}
        isAlreadyExtracted={Boolean(data?.isAuthenticExtract)}
        isAcFullyExtracted={isAcFullyExtracted}
        officialRollUrl={data?.roll2026Url}
        onExtractionSuccess={handleReloadBoothVoters}
      />
    </div>
  );
};

