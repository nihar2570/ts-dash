import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Users,
  Calendar,
  MapPin,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { FloatingSideNav, type NavSection } from './common/FloatingSideNav';
import { OnDemandVoterExtractorModal } from './OnDemandVoterExtractorModal';
import { CONSTITUENCY_MANDALS, type MandalDetail } from '../data/mandalData';
import { fetchBoothVoters, getOfficialSir2026PdfUrl, type BoothVoterRollSummary, type ElectorRecord } from '../data/voterRollService';
import {
  predictCaste,
  type CasteCategory,
  type CastePrediction,
} from '../data/casteClassifierService';
import { planPadayatraRoute, type PadayatraHouseStop } from '../data/padayatraService';
import { AcPadayatraPlannerView } from './AcPadayatraPlannerView';
import type { DemographicsDataset, ConstituencyDemographics } from '../types';
import { BoothDirectorySidebar } from './booth/BoothDirectorySidebar';
import { BoothWorkspaceHeader } from './booth/BoothWorkspaceHeader';
import { BoothVoterTable } from './booth/BoothVoterTable';
import { PannaPramukhSheet } from './booth/PannaPramukhSheet';
import { HouseholdClusterView } from './booth/HouseholdClusterView';
import { PadayatraRouteView } from './booth/PadayatraRouteView';

const BOOTH_SECTIONS: NavSection[] = [
  {
    id: 'booth-header',
    label: 'Constituency & Plan Selector',
    shortLabel: 'AC Header',
    icon: <MapPin className="w-4 h-4" />,
  },
  {
    id: 'booth-catalog',
    label: 'Polling Station Directory',
    shortLabel: 'Booths',
    icon: <Layers className="w-4 h-4" />,
  },
  {
    id: 'booth-workspace',
    label: 'Booth Intelligence & Filters',
    shortLabel: 'Filters',
    icon: <FileSpreadsheet className="w-4 h-4" />,
  },
  {
    id: 'booth-records',
    label: 'Voter Roll & Panna Register',
    shortLabel: 'Electors',
    icon: <Users className="w-4 h-4" />,
  },
];

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
  const [selectedPage] = useState<number | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'panna' | 'household' | 'padayatra' | 'ac-plan'>(() => {
    if (initialViewMode) return initialViewMode;
    if (typeof window !== 'undefined') {
      const v = new URLSearchParams(window.location.search).get('view');
      if (v === 'padayatra' || v === 'panna' || v === 'household' || v === 'table' || v === 'ac-plan') {
        return v as any;
      }
    }
    return 'panna';
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
  const pageSize = 30;

  // Local state for interactive voter triage tag adjustments
  const [voterTags, setVoterTags] = useState<Record<string, ElectorRecord['triageTag']>>({});

  // Active booth voter roll data & loading state
  const [data, setData] = useState<BoothVoterRollSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExtractorModal, setShowExtractorModal] = useState(false);

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
      .then((d) => {
        if (!isCancelled && d && Array.isArray(d) && d.length > 0) {
          setOfficialBooths(d);
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
        const cleanStr = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
        const matchedMandal = mandals.find((m) => cleanStr(m.name) === cleanStr(bMandal));
        return {
          boothNo: bNo,
          name: b.name || `Polling Station #${bNo}`,
          building: b.building || '',
          locality: b.locality || '',
          mandalName: matchedMandal?.name || bMandal,
          electorate: b.electorate || 900,
          dominantCaste: matchedMandal?.dominant_caste || mandals[0]?.dominant_caste || 'BC',
          lat: b.lat,
          lng: b.lng,
          isAuthenticExtract: b.isAuthenticExtract || false,
          roll2026Url: b.roll_2026_url || b.roll_2026?.url || getOfficialSir2026PdfUrl(selectedAcNo, bNo),
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
      dominantCaste: string;
      lat?: number;
      lng?: number;
      isAuthenticExtract?: boolean;
      roll2026Url?: string;
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
          roll2026Url: getOfficialSir2026PdfUrl(selectedAcNo, currentNo),
        });
        currentNo++;
      }
    });

    return list;
  }, [officialBooths, mandals, selectedAcNo]);

  // Filtered booth list based on user search & mandal filter
  const filteredBoothsList = useMemo(() => {
    return allBoothsInAc.filter((b) => {
      const matchesMandal =
        boothFilterMandal === 'ALL' ||
        b.mandalName.toLowerCase() === boothFilterMandal.toLowerCase();
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
          (pred && pred.primaryBloc.toLowerCase().includes(q)) ||
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
        const matchesCaste =
          stop.householdCaste.casteName.toLowerCase().includes(q) ||
          stop.householdCaste.primaryBloc.toLowerCase().includes(q);
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

  // Dominant caste welfare schemes for the master cheat sheet
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

  const toggleVoterTag = (epic: string, currentTag?: ElectorRecord['triageTag']) => {
    const active = voterTags[epic] || currentTag || 'neutral';
    const cycle: Record<ElectorRecord['triageTag'], ElectorRecord['triageTag']> = {
      committed: 'swing',
      swing: 'lean_opp',
      lean_opp: 'neutral',
      neutral: 'committed',
    };
    setVoterTags((prev) => ({ ...prev, [epic]: cycle[active] }));
  };

  return (
    <div className="space-y-4 relative">
      {/* Floating Vertical Section Navigation */}
      <FloatingSideNav sections={BOOTH_SECTIONS} />

      {/* Top Banner: Constituency Selector Bar */}
      <div id="booth-header" className="scroll-mt-24 bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-xs shrink-0">
            #{selectedAcNo}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-black text-slate-900 tracking-tight whitespace-nowrap">
                {currentAc.ac_name}
              </h2>
              {currentAc.district && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200 whitespace-nowrap">
                  {currentAc.district}
                </span>
              )}
              {currentAc.reservation && currentAc.reservation !== 'GEN' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 whitespace-nowrap">
                  {currentAc.reservation}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 truncate">
              Statewide E-Panna &amp; Polling Station Roster Explorer &middot;{' '}
              <strong className="text-slate-800">{totalBoothsInAc} Total Polling Stations</strong>
            </p>
          </div>
        </div>

        {/* AC Search & Switcher & Padayatra Plan Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'ac-plan' ? 'table' : 'ac-plan')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs whitespace-nowrap shrink-0 ${
              viewMode === 'ac-plan'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black ring-2 ring-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
            }`}
            title="15 / 30 / 60 / 90-Day AC-Wide Padayatra Campaign Itinerary"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-800" />
            <span>{viewMode === 'ac-plan' ? '← Single Booth Roll' : 'Padayatra Plan'}</span>
          </button>

          <div className="relative w-44 sm:w-52">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Jump to AC..."
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
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-bold focus:outline-hidden cursor-pointer whitespace-nowrap max-w-[220px]"
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
        <div id="booth-workspace" className="scroll-mt-24">
          <AcPadayatraPlannerView
            acNo={selectedAcNo}
            acName={currentAc.ac_name}
            targetParty={['TDP', 'JSP', 'BJP'].includes(currentAc.winnerParty || '') ? currentAc.winnerParty : 'TDP'}
            onOpenBoothPadayatra={(boothNo) => {
              handleSelectBooth(boothNo);
              setViewMode('padayatra');
            }}
          />
        </div>
      ) : (
        /* Main Layout: 2 Columns (Left: Booth Selector Sidebar, Right: E-Panna / Roll Workspace) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 print:block">
          {/* Left Column: Booth Catalog (3 cols) */}
          <BoothDirectorySidebar
            filteredBoothsList={filteredBoothsList}
            allBoothsCount={allBoothsInAc.length}
            selectedBoothNo={selectedBoothNo}
            onSelectBooth={handleSelectBooth}
            boothSearch={boothSearch}
            setBoothSearch={setBoothSearch}
            mandals={mandals}
            boothFilterMandal={boothFilterMandal}
            setBoothFilterMandal={setBoothFilterMandal}
            selectedAcNo={selectedAcNo}
          />

          {/* Right Column: E-Panna & Roll Register Workspace (9 cols) */}
          <div className="lg:col-span-9 space-y-3 print:w-full print:block">
            {/* Active Booth Workspace Header & Filter Controls */}
            <div id="booth-workspace" className="scroll-mt-24">
              <BoothWorkspaceHeader
                data={data}
                selectedBoothNo={selectedBoothNo}
                totalBoothsInAc={totalBoothsInAc}
                activeBoothMeta={activeBoothMeta}
                selectedAcNo={selectedAcNo}
                currentAcName={currentAc.ac_name}
                isAcFullyExtracted={isAcFullyExtracted}
                onOpenExtractorModal={() => setShowExtractorModal(true)}
                casteSummary={casteSummary}
                viewMode={viewMode}
                setViewMode={setViewMode}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                genderFilter={genderFilter}
                setGenderFilter={setGenderFilter}
                ageCohort={ageCohort}
                setAgeCohort={setAgeCohort}
                casteCategoryFilter={casteCategoryFilter}
                setCasteCategoryFilter={setCasteCategoryFilter}
                setCurrentPage={setCurrentPage}
                filteredCount={filteredElectors.length}
              />
            </div>

            {/* View Content */}
            <div id="booth-records" className="scroll-mt-24 p-3 bg-slate-50/50 rounded-b-xl border border-t-0 border-slate-200">
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
                    }}
                    className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : viewMode === 'table' ? (
                /* ROLL TABLE VIEW */
                <BoothVoterTable
                  paginatedElectors={paginatedElectors}
                  voterTags={voterTags}
                  casteMap={casteMap}
                  copiedEpic={copiedEpic}
                  onCopyEpic={handleCopyEpic}
                  onToggleVoterTag={toggleVoterTag}
                  currentPage={currentPage}
                  totalPaginationPages={totalPaginationPages}
                  setCurrentPage={setCurrentPage}
                  filteredCount={filteredElectors.length}
                />
              ) : viewMode === 'panna' ? (
                /* PANNA PRAMUKH VIEW */
                <PannaPramukhSheet
                  pannaGroups={pannaGroups}
                  voterTags={voterTags}
                  casteMap={casteMap}
                />
              ) : viewMode === 'padayatra' ? (
                /* MLA PADAYATRA ROUTE & KEY TALKING POINTS */
                <PadayatraRouteView
                  padayatraMode={padayatraMode}
                  setPadayatraMode={setPadayatraMode}
                  boothNo={activeBoothMeta?.boothNo || selectedBoothNo}
                  mandalName={activeBoothMeta?.mandalName}
                  currentAcName={currentAc.ac_name}
                  visitedDoors={visitedDoors}
                  toggleVisitedDoor={toggleVisitedDoor}
                  setVisitedDoors={setVisitedDoors}
                  padayatraMetrics={padayatraMetrics}
                  padayatraLayout={padayatraLayout}
                  setPadayatraLayout={setPadayatraLayout}
                  padayatraPersuadabilityFilter={padayatraPersuadabilityFilter}
                  setPadayatraPersuadabilityFilter={setPadayatraPersuadabilityFilter}
                  padayatraVisitedFilter={padayatraVisitedFilter}
                  setPadayatraVisitedFilter={setPadayatraVisitedFilter}
                  showBoothCheatSheet={showBoothCheatSheet}
                  setShowBoothCheatSheet={setShowBoothCheatSheet}
                  boothKeySchemes={boothKeySchemes}
                  padayatraStops={padayatraStops}
                  filteredPadayatraStops={filteredPadayatraStops}
                  copiedTalkingPointDoor={copiedTalkingPointDoor}
                  handleCopyPadayatraScript={handleCopyPadayatraScript}
                  handleShareWhatsApp={handleShareWhatsApp}
                  expandedCardPitch={expandedCardPitch}
                  toggleCardPitch={toggleCardPitch}
                  expandedDoorDetails={expandedDoorDetails}
                  toggleExpandDoor={toggleExpandDoor}
                />
              ) : (
                /* HOUSEHOLD / DOOR-TO-DOOR VIEW */
                <HouseholdClusterView
                  householdGroups={householdGroups}
                  dominantCaste={activeBoothMeta?.dominantCaste}
                  casteMap={casteMap}
                />
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
