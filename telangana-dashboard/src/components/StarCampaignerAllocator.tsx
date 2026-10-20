import React, { useState, useMemo } from 'react';
import type { SeeepcDataset, CasteProfile } from '../types';
import { getPartyColor } from '../types';
import {
  Star,
  Sparkles,
  RotateCcw,
  CheckCircle,
  Calendar,
  Search,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Info,
  Film,
} from 'lucide-react';

export type CampaignerTier = 'A' | 'B' | 'C' | 'M';

export interface TierConfig {
  tier: CampaignerTier;
  title: string;
  role: string;
  durationLabel: string; // e.g. "1–2 Days per AC"
  stepDays: number;
  maxDaysPerAc: number;
  suggestedSquadDays: number;
  totalDays: number;
  voteLiftPerDayPct: number; // base impact per day
  badgeBg: string;
  badgeText: string;
  borderClr: string;
}

export const TIER_METADATA: Record<CampaignerTier, TierConfig> = {
  A: {
    tier: 'A',
    title: 'Class A • Top Leadership',
    role: 'Chief Minister / National Star Orator',
    durationLabel: '1–2 Days per AC (Mega Blitz)',
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedSquadDays: 2,
    totalDays: 20,
    voteLiftPerDayPct: 0.92, // ~1.84% for 2 days
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    borderClr: 'border-amber-300',
  },
  B: {
    tier: 'B',
    title: 'Class B • Cabinet Ministers',
    role: 'Cabinet Minister / Ex-Minister / MP',
    durationLabel: '3–7 Days per AC (Mandal Padayatra)',
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedSquadDays: 7,
    totalDays: 45,
    voteLiftPerDayPct: 0.38, // ~2.66% for 7 days
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-900',
    borderClr: 'border-indigo-300',
  },
  C: {
    tier: 'C',
    title: 'Class C • Ground Cadre',
    role: 'MLA / Ex-MLA / DCC President',
    durationLabel: '10–30 Days per AC (Ground Camp)',
    stepDays: 5,
    maxDaysPerAc: 30,
    suggestedSquadDays: 15,
    totalDays: 90,
    voteLiftPerDayPct: 0.13, // ~1.95% for 15 days, ~3.9% for 30 days
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    borderClr: 'border-emerald-300',
  },
  M: {
    tier: 'M',
    title: 'Class M • Cultural & Outside Icons',
    role: 'Tollywood Movie Star / Caste Icon / Cultural Mascot',
    durationLabel: '1–2 Days per AC (Mega Roadshow)',
    stepDays: 1,
    maxDaysPerAc: 3,
    suggestedSquadDays: 1,
    totalDays: 12,
    voteLiftPerDayPct: 2.20, // 2.20% for 1 mega roadshow day
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-900',
    borderClr: 'border-purple-300',
  },
};

export interface CampaignerProfile {
  id: string;
  code: string; // e.g. "A1", "A2", "B1", "B2", "B3", "C1", "C2", "M1", "M2"
  party: 'INC' | 'BRS' | 'BJP';
  tier: CampaignerTier;
  designation: string;
  caste: string;
  casteKey: string; // key in caste_profile
  subCastes: string[];
  keyStrength: string;
  totalDays: number;
  stepDays: number;
  maxDaysPerAc: number;
  suggestedDays: number;
  voteLiftPerDayPct: number;
  resonanceZones: string;
  avatarBg: string;
  isOutsideIcon?: boolean;
}

export const CAMPAIGNER_PROFILES: CampaignerProfile[] = [
  // ==========================================
  // --- CONGRESS (INC) LEADERSHIP & ICONS ---
  // ==========================================
  {
    id: 'inc_a1',
    code: 'A1',
    party: 'INC',
    tier: 'A',
    designation: 'A1 • Chief Minister / Star Orator',
    caste: 'OC Reddy',
    casteKey: 'oc_reddy',
    subCastes: ['oc_reddy', 'youth_18_25', 'bc_mudiraj'],
    keyStrength: 'Massive mega-rally draw, anti-opposition welfare narrative, state media spotlight',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 0.92,
    resonanceZones: 'South Telangana, Palamuru, Medak, Rural BCs',
    avatarBg: 'bg-sky-600',
  },
  {
    id: 'inc_a2',
    code: 'A2',
    party: 'INC',
    tier: 'A',
    designation: 'A2 • Dy. CM / Senior State Campaigner',
    caste: 'SC Madiga',
    casteKey: 'sc_madiga',
    subCastes: ['sc_madiga', 'sc_mala', 'st_lambada'],
    keyStrength: 'Dalit empowerment voice, social justice & SC sub-categorization guarantee',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 0.88,
    resonanceZones: 'Khammam, Warangal, Nalgonda, SC Reserve Constituencies',
    avatarBg: 'bg-purple-600',
  },
  {
    id: 'inc_b1',
    party: 'INC',
    code: 'B1',
    tier: 'B',
    designation: 'B1 • Cabinet Minister (BC Mudiraj / Goud)',
    caste: 'BC Mudiraj & Goud',
    casteKey: 'bc_mudiraj',
    subCastes: ['bc_mudiraj', 'bc_goud', 'bc_yadav'],
    keyStrength: 'BC community mobilization, caste welfare corporations, artisanal vocations',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.38,
    resonanceZones: 'North Telangana, Nizamabad, Karimnagar, Medak Rural',
    avatarBg: 'bg-blue-600',
  },
  {
    id: 'inc_b2',
    party: 'INC',
    code: 'B2',
    tier: 'B',
    designation: 'B2 • Cabinet Minister (ST Lambada / Tribal Affairs)',
    caste: 'ST Lambada',
    casteKey: 'st_lambada',
    subCastes: ['st_lambada', 'st_koya_gond'],
    keyStrength: 'Tribal thanda consolidation, Podu forest land pattas, agency welfare connect',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.38,
    resonanceZones: 'Adilabad, Mahabubabad, Khammam agency, ST Seats',
    avatarBg: 'bg-emerald-600',
  },
  {
    id: 'inc_b3',
    party: 'INC',
    code: 'B3',
    tier: 'B',
    designation: 'B3 • Senior Minister (Minorities & Urban Affairs)',
    caste: 'Muslim Minority / Urban OC',
    casteKey: 'minority_muslim',
    subCastes: ['minority_muslim', 'youth_18_25', 'bc_padmashali'],
    keyStrength: 'Minority & secular consolidation, urban middle-class infrastructure assurances',
    totalDays: 35,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.36,
    resonanceZones: 'GHMC, Bodhan, Sangareddy, Nizamabad Urban',
    avatarBg: 'bg-teal-600',
  },
  {
    id: 'inc_c1',
    party: 'INC',
    code: 'C1',
    tier: 'C',
    designation: 'C1 • Ground MLA / Agrarian Cadre Anchor',
    caste: 'BC Munnuru Kapu & BC Other',
    casteKey: 'bc_munnuru_kapu',
    subCastes: ['bc_munnuru_kapu', 'bc_other', 'bc_padmashali'],
    keyStrength: 'Relentless village camp, booth-level panna pramukh coordination',
    totalDays: 90,
    stepDays: 5,
    maxDaysPerAc: 30,
    suggestedDays: 15,
    voteLiftPerDayPct: 0.13,
    resonanceZones: 'Karimnagar, Warangal, Adilabad rural agrarian belts',
    avatarBg: 'bg-indigo-700',
  },
  {
    id: 'inc_c2',
    party: 'INC',
    code: 'C2',
    tier: 'C',
    designation: 'C2 • DCC Chief / Ex-MLA Booth Mastermind',
    caste: 'SC Mala & Local BCs',
    casteKey: 'sc_mala',
    subCastes: ['sc_mala', 'sc_madiga', 'youth_18_25'],
    keyStrength: 'Continuous door-to-door booth mobilization and local faction management',
    totalDays: 90,
    stepDays: 5,
    maxDaysPerAc: 30,
    suggestedDays: 15,
    voteLiftPerDayPct: 0.125,
    resonanceZones: 'Nalgonda, Khammam, Mahabubnagar interior',
    avatarBg: 'bg-amber-700',
  },
  // --- CLASS M: OUTSIDE / MOVIE / CULTURAL ICONS (CONGRESS ALIGNED) ---
  {
    id: 'inc_m1',
    party: 'INC',
    code: 'M1',
    tier: 'M',
    designation: 'M1 • Tollywood Youth Star / Pop Icon',
    caste: 'Youth (18–35) & Neutral Non-Caste',
    casteKey: 'youth_18_25',
    subCastes: ['youth_18_25', 'age_26_40', 'oc_other'],
    keyStrength: 'Massive viral fan roadshows, electric youth engagement, pulls neutral fence-sitters',
    totalDays: 12,
    stepDays: 1,
    maxDaysPerAc: 3,
    suggestedDays: 1,
    voteLiftPerDayPct: 2.25,
    resonanceZones: 'GHMC, Tier-2 Urban hubs (Warangal, Karimnagar, Nizamabad), College corridors',
    avatarBg: 'bg-fuchsia-600',
    isOutsideIcon: true,
  },
  {
    id: 'inc_m2',
    party: 'INC',
    code: 'M2',
    tier: 'M',
    designation: 'M2 • Folk Balladeer & Dhoom-Dham Cultural Mascot',
    caste: 'Telangana Cultural / SC/ST & BC Folk Identity',
    casteKey: 'bc_mudiraj',
    subCastes: ['bc_mudiraj', 'sc_madiga', 'st_lambada', 'bc_goud'],
    keyStrength: 'High emotional connect via Telangana struggle songs, rural women & farmer tears, thanda festivals',
    totalDays: 14,
    stepDays: 1,
    maxDaysPerAc: 3,
    suggestedDays: 1,
    voteLiftPerDayPct: 2.10,
    resonanceZones: 'North & South Telangana rural hamlets, tribal agency pockets',
    avatarBg: 'bg-rose-600',
    isOutsideIcon: true,
  },

  // ==========================================
  // --- BRS (OPPOSITION BENCHMARK) ---
  // ==========================================
  {
    id: 'brs_a1',
    code: 'A1',
    party: 'BRS',
    tier: 'A',
    designation: 'A1 • Party President / Ex-CM',
    caste: 'OC Velama',
    casteKey: 'oc_velama',
    subCastes: ['oc_velama', 'bc_mudiraj', 'sc_madiga'],
    keyStrength: 'Telangana sentiment, mega-rally emotional appeal, Rythu Bandhu legacy',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 0.92,
    resonanceZones: 'Statewide rural, Medak, Gajwel',
    avatarBg: 'bg-pink-600',
  },
  {
    id: 'brs_b1',
    code: 'B1',
    party: 'BRS',
    tier: 'B',
    designation: 'B1 • Ex-Minister / Cadre Troubleshooter',
    caste: 'BC / OC Velama',
    casteKey: 'bc_mudiraj',
    subCastes: ['bc_mudiraj', 'bc_goud'],
    keyStrength: 'Intensive mandal-level booth repair & rural cadre energizer',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.38,
    resonanceZones: 'North Telangana, Siddipet, Sircilla',
    avatarBg: 'bg-rose-600',
  },
  {
    id: 'brs_c1',
    code: 'C1',
    party: 'BRS',
    tier: 'C',
    designation: 'C1 • Senior Ex-MLA / ZP Chairperson',
    caste: 'BC Munnuru Kapu & SCs',
    casteKey: 'bc_munnuru_kapu',
    subCastes: ['bc_munnuru_kapu', 'sc_madiga'],
    keyStrength: 'Constituency ground camp, farmer grievance consolidation',
    totalDays: 90,
    stepDays: 5,
    maxDaysPerAc: 30,
    suggestedDays: 15,
    voteLiftPerDayPct: 0.13,
    resonanceZones: 'Rural North and Central TS',
    avatarBg: 'bg-purple-700',
  },
  {
    id: 'brs_m1',
    code: 'M1',
    party: 'BRS',
    tier: 'M',
    designation: 'M1 • Telangana Folk Poet & Agitation Icon',
    caste: 'Cultural BC & Agitation Veterans',
    casteKey: 'bc_mudiraj',
    subCastes: ['bc_mudiraj', 'youth_18_25'],
    keyStrength: 'Resurrects 2014 statehood agitation nostalgia, farmer emotional appeal',
    totalDays: 12,
    stepDays: 1,
    maxDaysPerAc: 3,
    suggestedDays: 1,
    voteLiftPerDayPct: 2.15,
    resonanceZones: 'Rural Telangana agitation heartlands',
    avatarBg: 'bg-pink-700',
    isOutsideIcon: true,
  },

  // ==========================================
  // --- BJP ---
  // ==========================================
  {
    id: 'bjp_a1',
    code: 'A1',
    party: 'BJP',
    tier: 'A',
    designation: 'A1 • Union Minister / National Star Orator',
    caste: 'OC Reddy / BC Munnuru Kapu',
    casteKey: 'bc_munnuru_kapu',
    subCastes: ['bc_munnuru_kapu', 'oc_reddy'],
    keyStrength: 'National security pitch, central Modi welfare schemes, Hindu consolidation',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 0.85,
    resonanceZones: 'GHMC, Nizamabad, Karimnagar, Adilabad',
    avatarBg: 'bg-amber-600',
  },
  {
    id: 'bjp_b1',
    code: 'B1',
    party: 'BJP',
    tier: 'B',
    designation: 'B1 • State General Secretary / MP',
    caste: 'SC Madiga / BC Goud',
    casteKey: 'sc_madiga',
    subCastes: ['sc_madiga', 'bc_goud'],
    keyStrength: 'Mandal padayatra, Madiga sub-categorization advocacy',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.36,
    resonanceZones: 'Northern Telangana & SC seats',
    avatarBg: 'bg-orange-600',
  },
  {
    id: 'bjp_c1',
    code: 'C1',
    party: 'BJP',
    tier: 'C',
    designation: 'C1 • District President / Ex-MLA',
    caste: 'BC & Urban OC',
    casteKey: 'bc_mudiraj',
    subCastes: ['bc_mudiraj', 'bc_yadav'],
    keyStrength: 'Continuous ground presence, booth committee activation',
    totalDays: 90,
    stepDays: 5,
    maxDaysPerAc: 30,
    suggestedDays: 15,
    voteLiftPerDayPct: 0.12,
    resonanceZones: 'Urban & Semi-urban pockets',
    avatarBg: 'bg-amber-700',
  },
  {
    id: 'bjp_m1',
    code: 'M1',
    party: 'BJP',
    tier: 'M',
    designation: 'M1 • Veteran Cinema Star & Nationalist Icon',
    caste: 'Urban OC / BC Kapu',
    casteKey: 'oc_other',
    subCastes: ['youth_18_25', 'bc_munnuru_kapu'],
    keyStrength: 'High voltage roadshow, middle-class and patriotic youth turnout',
    totalDays: 12,
    stepDays: 1,
    maxDaysPerAc: 3,
    suggestedDays: 1,
    voteLiftPerDayPct: 2.10,
    resonanceZones: 'Secunderabad, Malkajgiri, Karimnagar urban',
    avatarBg: 'bg-orange-700',
    isOutsideIcon: true,
  },
];

// Helper: Recommend an ideal tiered squad (A + B + C + M) customized to an AC's caste demographics
export function getConstituencySquadRecommendation(
  casteProfile: CasteProfile | Record<string, number>,
  reservation?: string,
  party: 'INC' | 'BRS' | 'BJP' = 'INC'
) {
  const sorted = Object.entries(casteProfile).sort((a, b) => (b[1] as number) - (a[1] as number));
  const dominant = sorted[0];
  const second = sorted[1];

  const readableCaste: Record<string, string> = {
    sc_madiga: 'SC Madiga',
    sc_mala: 'SC Mala',
    st_lambada: 'ST Lambada',
    st_koya_gond: 'ST Koya/Gond',
    bc_mudiraj: 'BC Mudiraj',
    bc_munnuru_kapu: 'BC Munnuru Kapu',
    bc_padmashali: 'BC Padmashali',
    bc_goud: 'BC Goud',
    bc_yadav: 'BC Yadav',
    bc_other: 'BC Other',
    minority_muslim: 'Muslim Minorities',
    oc_reddy: 'OC Reddy',
    oc_velama: 'OC Velama',
    oc_other: 'OC Other',
  };

  const topCasteName = readableCaste[dominant[0]] || dominant[0];
  const secondCasteName = readableCaste[second?.[0]] || second?.[0] || '';

  // Select optimal tier recommendations
  let recommendedA = 'A1';
  let recommendedB = 'B1';
  let recommendedC = 'C1';
  let recommendedM = 'M1';
  let strategyBrief = '';

  if (reservation === 'SC' || dominant[0] === 'sc_madiga' || second?.[0] === 'sc_madiga') {
    recommendedA = party === 'INC' ? 'A2' : 'A1';
    recommendedB = 'B1';
    recommendedC = party === 'INC' ? 'C2' : 'C1';
    recommendedM = party === 'INC' ? 'M2' : 'M1';
    strategyBrief = `High SC Dalit presence (${dominant[1]}% ${topCasteName}). Deploy A2 (SC Madiga leadership) for 1–2 day blitz, B1 for BC consolidation, C2 for 30-day village booth grip, plus M2 (Folk/Cultural Icon) for an emotional thanda/colony roadshow.`;
  } else if (reservation === 'ST' || dominant[0] === 'st_lambada' || dominant[0] === 'st_koya_gond') {
    recommendedA = 'A1';
    recommendedB = party === 'INC' ? 'B2' : 'B1';
    recommendedC = 'C1';
    recommendedM = party === 'INC' ? 'M2' : 'M1';
    strategyBrief = `Strong Tribal/Adivasi concentration (${dominant[1]}% ${topCasteName}). Deploy A1 for massive general turnout, B2 (ST Lambada cabinet face) for 1-week thanda outreach, C1 for 30-day village camp, and M2 (Dhoom-Dham Cultural Balladeer) to galvanize forest communities.`;
  } else if (dominant[0] === 'minority_muslim' || dominant[1] >= 18) {
    recommendedA = 'A1';
    recommendedB = party === 'INC' ? 'B3' : 'B1';
    recommendedC = 'C1';
    recommendedM = 'M1';
    strategyBrief = `Significant Minority presence (${dominant[1]}% ${topCasteName}). Deploy A1 mega-rally + B3 (Minority/Urban minister) for 1-week civic trust meetings, paired with C1 ground workers and M1 (Tollywood Star) to bring out secular youth fence-sitters.`;
  } else {
    recommendedA = 'A1';
    recommendedB = 'B1';
    recommendedC = 'C1';
    recommendedM = 'M1';
    strategyBrief = `Agrarian & Backward Class core (${dominant[1]}% ${topCasteName}, ${second?.[1] || 0}% ${secondCasteName}). Deploy A1 for anti-opposition wave, B1 (BC Minister) for 1-week caste mandal outreach, C1 for 30-day village booth saturation, and M1 (Youth Film Star) for a viral town roadshow.`;
  }

  return {
    topCasteName,
    topCastePct: dominant[1],
    secondCasteName,
    secondCastePct: second?.[1] || 0,
    recommendedA,
    recommendedB,
    recommendedC,
    recommendedM,
    strategyBrief,
    combinedPotentialLiftPct: 10.6, // A (1.85%) + B (2.65%) + C (3.90%) + M (2.25%)
  };
}

export interface StarCampaignerAllocatorProps {
  data: SeeepcDataset;
  onOpenDossier?: (acNo: number) => void;
  allocations?: Record<string, Record<number, number>>;
  onAllocationsChange?: (allocations: Record<string, Record<number, number>>) => void;
  cumulativeAcImpacts?: Record<number, {
    resourceSwing: number;
    defectionShift: number;
    totalCumulativeSwing: number;
    cumulativeProjectedMargin: number;
    isCumulativelyFlipped: boolean;
  }>;
}

export const StarCampaignerAllocator: React.FC<StarCampaignerAllocatorProps> = ({
  data,
  onOpenDossier,
  allocations: externalAllocations,
  onAllocationsChange,
  cumulativeAcImpacts,
}) => {
  // Party toggle: defaults to INC (Congress)
  const [selectedParty, setSelectedParty] = useState<'INC' | 'BRS' | 'BJP'>('INC');
  const [filterType, setFilterType] = useState<'battleground' | 'all' | 'flipped'>('battleground');
  const [battlegroundMarginThreshold, setBattlegroundMarginThreshold] = useState<number>(8000);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAcNo, setExpandedAcNo] = useState<number | null>(null);

  // Allocations store: { [campaignerId]: { [acNo]: daysCount } }
  const [internalAllocations, setInternalAllocations] = useState<Record<string, Record<number, number>>>({});

  const allocations = externalAllocations !== undefined ? externalAllocations : internalAllocations;
  const setAllocations = (updater: React.SetStateAction<Record<string, Record<number, number>>>) => {
    if (onAllocationsChange) {
      if (typeof updater === 'function') {
        const next = updater(allocations);
        onAllocationsChange(next);
      } else {
        onAllocationsChange(updater);
      }
    } else {
      setInternalAllocations(updater);
    }
  };

  // Filter available campaigners for active party
  const partyCampaigners = useMemo(
    () => CAMPAIGNER_PROFILES.filter((c) => c.party === selectedParty),
    [selectedParty]
  );

  // Calculate used days per campaigner
  const campaignerStats = useMemo(() => {
    const stats: Record<string, { usedDays: number; remainingDays: number }> = {};
    partyCampaigners.forEach((camp) => {
      const seatMap = allocations[camp.id] || {};
      const usedDays = Object.values(seatMap).reduce((sum, days) => sum + days, 0);
      stats[camp.id] = {
        usedDays,
        remainingDays: Math.max(0, camp.totalDays - usedDays),
      };
    });
    return stats;
  }, [partyCampaigners, allocations]);

  // Adjust days count for a campaigner in an AC
  const handleDayChange = (campaignerId: string, acNo: number, delta: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const camp = CAMPAIGNER_PROFILES.find((c) => c.id === campaignerId);
    if (!camp) return;

    const currentDays = allocations[campaignerId]?.[acNo] || 0;
    const nextDays = Math.max(0, currentDays + delta);
    if (nextDays > camp.maxDaysPerAc) return;

    const stats = campaignerStats[campaignerId];
    if (delta > 0 && stats && stats.remainingDays < delta) {
      return; // Not enough days left in quota
    }

    setAllocations((prev) => {
      const campMap = { ...(prev[campaignerId] || {}) };
      if (nextDays === 0) {
        delete campMap[acNo];
      } else {
        campMap[acNo] = nextDays;
      }
      return {
        ...prev,
        [campaignerId]: campMap,
      };
    });
  };

  // Reset allocations for active party
  const handleResetParty = () => {
    setAllocations((prev) => {
      const updated = { ...prev };
      partyCampaigners.forEach((c) => {
        delete updated[c.id];
      });
      return updated;
    });
  };

  // Automated 1-Click Integrated Squad Deployment
  // Deploys balanced A + B + C + M combination to highest priority battleground deficit seats in days
  const handleAutoDeploySquads = () => {
    const acList = Object.values(data.constituencies);
    // Find closest battleground seats where selected party is defending or trailing
    const targets = acList
      .filter((ac) => ac.runner_up_2023.party === selectedParty || ac.winner_2023.party === selectedParty)
      .sort((a, b) => a.margin_2023 - b.margin_2023)
      .slice(0, 10);

    setAllocations((prev) => {
      const updated = { ...prev };
      partyCampaigners.forEach((camp) => {
        updated[camp.id] = { ...(updated[camp.id] || {}) };
      });

      targets.forEach((ac) => {
        const squad = getConstituencySquadRecommendation(ac.caste_profile, ac.reservation, selectedParty);
        // Find matching profiles
        const aProfile = partyCampaigners.find((c) => c.tier === 'A' && c.code === squad.recommendedA) || partyCampaigners.find((c) => c.tier === 'A');
        const bProfile = partyCampaigners.find((c) => c.tier === 'B' && c.code === squad.recommendedB) || partyCampaigners.find((c) => c.tier === 'B');
        const cProfile = partyCampaigners.find((c) => c.tier === 'C' && c.code === squad.recommendedC) || partyCampaigners.find((c) => c.tier === 'C');
        const mProfile = partyCampaigners.find((c) => c.tier === 'M' && c.code === squad.recommendedM) || partyCampaigners.find((c) => c.tier === 'M');

        [aProfile, bProfile, cProfile, mProfile].forEach((prof) => {
          if (!prof) return;
          const currentMap = updated[prof.id];
          const usedDays = Object.values(currentMap).reduce((s, v) => s + v, 0);
          const neededDays = prof.suggestedDays;
          if (prof.totalDays - usedDays >= neededDays && !currentMap[ac.ac_no]) {
            currentMap[ac.ac_no] = neededDays;
          }
        });
      });

      return updated;
    });
  };

  // Compute live constituency metrics
  const constituencyList = useMemo(() => {
    return Object.values(data.constituencies).map((ac) => {
      const winner = ac.winner_2023.party;
      const margin = ac.margin_2023;
      const isPartyWinner = winner === selectedParty;
      const estimatedTotalVotes = ac.total_votes_2023 || 185000;

      // Calculate total vote lift from all deployed campaigners of the selected party
      let totalLiftPct = 0;
      const deployedDetails: { camp: CampaignerProfile; days: number; liftPct: number }[] = [];

      partyCampaigners.forEach((camp) => {
        const days = allocations[camp.id]?.[ac.ac_no] || 0;
        if (days > 0) {
          const lift = Math.min(6.0, days * camp.voteLiftPerDayPct);
          totalLiftPct += lift;
          deployedDetails.push({
            camp,
            days,
            liftPct: lift,
          });
        }
      });

      const totalVoteLiftCount = Math.round((totalLiftPct / 100) * estimatedTotalVotes);
      const newMargin = isPartyWinner ? margin + totalVoteLiftCount : -margin + totalVoteLiftCount;
      const isFlippedToWin = !isPartyWinner && newMargin > 0;
      const isDefended = isPartyWinner && totalLiftPct > 0;

      // Recommended A + B + C + M squad for this AC's demographic
      const squadRec = getConstituencySquadRecommendation(ac.caste_profile, ac.reservation, selectedParty);

      return {
        ac_no: ac.ac_no,
        ac_name: ac.ac_name,
        district: ac.district,
        pc_name: ac.pc_name,
        reservation: ac.reservation,
        caste_profile: ac.caste_profile,
        winner_2023: winner,
        runner_up_2023: ac.runner_up_2023.party,
        margin_2023: margin,
        isPartyWinner,
        totalLiftPct,
        totalVoteLiftCount,
        newMargin,
        isFlippedToWin,
        isDefended,
        deployedDetails,
        squadRec,
      };
    });
  }, [data, selectedParty, partyCampaigners, allocations]);

  // Aggregate stats
  const totalSeatsFlipped = useMemo(() => {
    return constituencyList.filter((c) => c.isFlippedToWin).length;
  }, [constituencyList]);

  const totalVotesGained = useMemo(() => {
    return constituencyList.reduce((sum, c) => sum + c.totalVoteLiftCount, 0);
  }, [constituencyList]);

  const totalSeatsCovered = useMemo(() => {
    return constituencyList.filter((c) => c.deployedDetails.length > 0).length;
  }, [constituencyList]);

  // Filtered view
  const filteredList = useMemo(() => {
    return constituencyList
      .filter((c) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = c.ac_name.toLowerCase().includes(q);
          const matchesDist = c.district.toLowerCase().includes(q);
          const matchesNo = c.ac_no.toString().includes(q);
          if (!matchesName && !matchesDist && !matchesNo) return false;
        }

        if (filterType === 'battleground') {
          return c.margin_2023 <= battlegroundMarginThreshold;
        }
        if (filterType === 'flipped') {
          return c.isFlippedToWin || c.deployedDetails.length > 0;
        }
        return true;
      })
      .sort((a, b) => a.margin_2023 - b.margin_2023);
  }, [constituencyList, filterType, battlegroundMarginThreshold, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Top Banner: Tiered Campaigner Roster & Party Switcher */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800 space-y-4">
        {/* Row 1: Title, Party Toggle & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 font-mono text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                <Star className="w-3 h-3 fill-slate-950" /> STRATEGIC CAMPAIGNERS
              </span>
              <span className="text-xs text-slate-400">
                Class A (CM) • Class B (Ministers) • Class C (MLAs) • Class M (Movie Stars &amp; Cultural Icons)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
              Leadership Deployment &amp; Demographic Match Plan
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Party Switcher Toggle */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs font-bold">
              <button
                onClick={() => setSelectedParty('INC')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedParty === 'INC'
                    ? 'bg-sky-600 text-white shadow-xs font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white" />
                Congress (INC)
              </button>
              <button
                onClick={() => setSelectedParty('BRS')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedParty === 'BRS'
                    ? 'bg-pink-600 text-white shadow-xs font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white" />
                BRS
              </button>
              <button
                onClick={() => setSelectedParty('BJP')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedParty === 'BJP'
                    ? 'bg-amber-600 text-white shadow-xs font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white" />
                BJP
              </button>
            </div>

            <button
              onClick={handleAutoDeploySquads}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              title="Automatically deploy complementary A+B+C+M squads to top battlegrounds"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              1-Click Smart Squad Plan
            </button>

            <button
              onClick={handleResetParty}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
              title="Reset all campaign days for this party"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Four Tier Class Cards (A, B, C, M) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(['A', 'B', 'C', 'M'] as CampaignerTier[]).map((tierKey) => {
            const meta = TIER_METADATA[tierKey];
            const profilesInTier = partyCampaigners.filter((p) => p.tier === tierKey);
            const totalTierDaysUsed = profilesInTier.reduce(
              (sum, p) => sum + (campaignerStats[p.id]?.usedDays || 0),
              0
            );
            const totalTierDays = profilesInTier.reduce((sum, p) => sum + p.totalDays, 0);

            return (
              <div
                key={tierKey}
                className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black px-2 py-0.5 rounded font-mono ${meta.badgeBg} ${meta.badgeText}`}>
                      Class {tierKey}
                    </span>
                    <span className="text-[10px] text-amber-300 font-mono font-bold">
                      +{meta.voteLiftPerDayPct}% / Day
                    </span>
                  </div>
                  <div className="font-bold text-white text-xs leading-snug line-clamp-1">{meta.role}</div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-0.5">
                    <span>{meta.durationLabel}</span>
                    <span className="font-mono text-[10px] text-slate-300">{totalTierDaysUsed} / {totalTierDays}d deployed</span>
                  </div>
                </div>

                {/* Profiles in this tier */}
                <div className="pt-2 border-t border-slate-700/60 flex flex-wrap gap-1">
                  {profilesInTier.map((prof) => {
                    const stats = campaignerStats[prof.id];
                    return (
                      <div
                        key={prof.id}
                        className="bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 text-[10px] flex items-center justify-between gap-1.5 flex-1 min-w-[100px]"
                        title={`${prof.designation} (${prof.caste})`}
                      >
                        <div className="truncate">
                          <span className="font-black text-amber-400 mr-1">{prof.code}</span>
                          <span className="text-slate-200 text-[9px] font-bold truncate">{prof.caste}</span>
                        </div>
                        <span className="font-mono text-slate-400 text-[9px] shrink-0">
                          {stats?.remainingDays || 0}d
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 3: Deployment KPI Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Selected Party:</span>
            <strong className="text-white font-bold">{selectedParty === 'INC' ? 'Congress (INC)' : selectedParty} Leadership Plan</strong>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <div>
              <span className="text-slate-400">Target Seats Covered: </span>
              <strong className="text-amber-400 font-mono font-black">{totalSeatsCovered}</strong>
            </div>
            <div>
              <span className="text-slate-400">Projected Flips: </span>
              <strong className="text-emerald-400 font-mono font-black">+{totalSeatsFlipped}</strong>
            </div>
            <div>
              <span className="text-slate-400">Total Net Votes Mobilized: </span>
              <strong className="text-sky-400 font-mono font-black">+{totalVotesGained.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
            Constituency Campaign Schedule &amp; Caste Demographic Squad Recommendations
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search AC or District..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 w-44"
            />
          </div>

          {/* Battleground Margin Threshold Input */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-xs">
            <span className="text-slate-500 font-semibold text-[11px]">Margin &le;</span>
            <input
              type="number"
              min="500"
              max="50000"
              step="500"
              value={battlegroundMarginThreshold}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setBattlegroundMarginThreshold(isNaN(val) ? 0 : Math.max(0, val));
                setFilterType('battleground');
              }}
              className="w-16 px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-xs text-slate-900 text-right focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
            <span className="text-slate-400 text-[10px]">votes</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setFilterType('battleground')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'battleground'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Battlegrounds ({filteredList.length})
            </button>
            <button
              onClick={() => setFilterType('flipped')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'flipped'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Flipped / Scheduled
            </button>
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All 119
            </button>
          </div>
        </div>
      </div>

      {/* Single Collapsible Card List */}
      <div className="space-y-2">
        {filteredList.map((c) => {
          const isExpanded = expandedAcNo === c.ac_no;
          const hasDeployments = c.deployedDetails.length > 0;
          const isFlipped = c.isFlippedToWin;
          const winnerColor = getPartyColor(c.winner_2023);

          return (
            <div
              key={c.ac_no}
              className={`bg-white rounded-xl border transition-all ${
                isFlipped
                  ? 'border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                  : hasDeployments
                  ? 'border-amber-300 ring-1 ring-amber-400/20 shadow-2xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Compact 1-Line Row Summary */}
              <div
                onClick={() => setExpandedAcNo(isExpanded ? null : c.ac_no)}
                className="p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
              >
                {/* 1. AC No + Name + District */}
                <div className="flex items-center gap-2.5 min-w-[170px]">
                  <span className="font-mono text-xs font-black bg-slate-900 text-white px-2 py-0.5 rounded">
                    #{c.ac_no}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1.5">
                      {c.ac_name}
                      {c.reservation && c.reservation !== 'GEN' && (
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono font-bold">
                          {c.reservation}
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-500">{c.district}</span>
                  </div>
                </div>

                {/* 2. Recommended Squad Archetype Badge */}
                <div className="hidden lg:flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Ideal Squad:</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-amber-600" />
                    {c.squadRec.recommendedA} + {c.squadRec.recommendedB} + {c.squadRec.recommendedC} + {c.squadRec.recommendedM}
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    ({c.squadRec.topCasteName} {c.squadRec.topCastePct}%)
                  </span>
                </div>

                {/* 3. 2023 Baseline Result vs Projected Outcome */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="text-right hidden sm:block">
                    <div className="text-slate-400 text-[10px]">2023 Result</div>
                    <div className="font-bold">
                      <span style={{ color: winnerColor }}>{c.winner_2023}</span>{' '}
                      <span className="text-slate-500 font-mono">+{c.margin_2023.toLocaleString()}</span>
                    </div>
                  </div>

                  {isFlipped ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-black flex items-center gap-1 shadow-2xs">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      FLIPPED (+{c.newMargin.toLocaleString()})
                    </span>
                  ) : c.isPartyWinner ? (
                    <span className="px-2.5 py-1 bg-sky-100 text-sky-800 border border-sky-300 rounded-lg text-xs font-bold">
                      Defended (+{c.newMargin.toLocaleString()})
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold">
                      Deficit: -{Math.abs(c.newMargin).toLocaleString()}
                    </span>
                  )}

                  {/* Cumulative Compounded Actions Badge */}
                  {cumulativeAcImpacts && cumulativeAcImpacts[c.ac_no] && (cumulativeAcImpacts[c.ac_no].resourceSwing > 0 || cumulativeAcImpacts[c.ac_no].defectionShift !== 0) && (
                    <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-950">
                      <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
                      <span>Cumulative:</span>
                      <span className={`font-mono font-black ${cumulativeAcImpacts[c.ac_no].cumulativeProjectedMargin > 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                        {cumulativeAcImpacts[c.ac_no].cumulativeProjectedMargin > 0
                          ? `+${cumulativeAcImpacts[c.ac_no].cumulativeProjectedMargin.toLocaleString()} (WIN)`
                          : `${cumulativeAcImpacts[c.ac_no].cumulativeProjectedMargin.toLocaleString()}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* 4. Active Deployed Squad Pills & Expand Chevron */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    {c.deployedDetails.length > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        +{c.totalLiftPct.toFixed(1)}% lift ({c.deployedDetails.map((d) => `${d.camp.code}: ${d.days}d`).join(', ')})
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">No days scheduled</span>
                    )}
                  </div>

                  <button className="text-slate-400 hover:text-slate-700 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Collapsed Drawer (Revealed on Click): Campaigner Class Days Allocator + Recommendation */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/60 rounded-b-xl text-xs space-y-3 animate-in fade-in duration-150">
                  {/* Strategic caste recommendation statement */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 mb-1">
                      <Info className="w-4 h-4 text-indigo-600" />
                      Caste Demographics &amp; Strategic Deployment Requirement for {c.ac_name}
                    </div>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      {c.squadRec.strategyBrief}
                    </p>
                  </div>

                  {/* Allocation Table for Campaigners of Selected Party */}
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="px-3 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between font-bold text-slate-700 text-[11px]">
                      <span>Deploy Campaigner Classes (1–2d CM Blitz, 3–7d Minister Mandal, 10–30d MLA Ground, 1d Mega Star Roadshow)</span>
                      <span>Days &amp; Impact</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {partyCampaigners.map((prof) => {
                        const currentDays = allocations[prof.id]?.[c.ac_no] || 0;
                        const stats = campaignerStats[prof.id];
                        const liftPct = Math.min(6.0, currentDays * prof.voteLiftPerDayPct);
                        const isRecommended =
                          prof.code === c.squadRec.recommendedA ||
                          prof.code === c.squadRec.recommendedB ||
                          prof.code === c.squadRec.recommendedC ||
                          prof.code === c.squadRec.recommendedM;

                        return (
                          <div
                            key={prof.id}
                            className={`p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs transition-colors ${
                              currentDays > 0 ? 'bg-amber-50/40' : 'hover:bg-slate-50'
                            }`}
                          >
                            {/* Profile details */}
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`font-mono text-xs font-black px-2 py-0.5 rounded ${
                                  TIER_METADATA[prof.tier].badgeBg
                                } ${TIER_METADATA[prof.tier].badgeText}`}
                              >
                                Class {prof.tier} • {prof.code}
                              </span>

                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{prof.designation}</span>
                                  {isRecommended && (
                                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-black uppercase tracking-wide">
                                      Recommended
                                    </span>
                                  )}
                                  {prof.isOutsideIcon && (
                                    <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-black uppercase tracking-wide flex items-center gap-0.5">
                                      <Film className="w-2.5 h-2.5" /> Outside Star Icon
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  Appeal: <strong>{prof.caste}</strong> • +{prof.voteLiftPerDayPct}% lift/day (up to {prof.maxDaysPerAc}d)
                                </div>
                              </div>
                            </div>

                            {/* Stepper + Days impact */}
                            <div className="flex items-center gap-3">
                              {currentDays > 0 && (
                                <span className="font-mono text-[11px] font-bold text-emerald-700">
                                  +{liftPct.toFixed(2)}% lift
                                </span>
                              )}

                              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                                <button
                                  onClick={(e) => handleDayChange(prof.id, c.ac_no, -prof.stepDays, e)}
                                  disabled={currentDays <= 0}
                                  className="w-6 h-6 rounded bg-white border border-slate-300 disabled:opacity-30 hover:bg-slate-200 font-bold text-slate-700 text-xs flex items-center justify-center cursor-pointer shadow-2xs"
                                  title={`Remove ${prof.stepDays} day(s)`}
                                >
                                  -
                                </button>
                                <span className="font-mono font-bold text-xs text-slate-900 w-16 text-center">
                                  {currentDays} {currentDays === 1 ? 'day' : 'days'}
                                </span>
                                <button
                                  onClick={(e) => handleDayChange(prof.id, c.ac_no, prof.stepDays, e)}
                                  disabled={
                                    currentDays + prof.stepDays > prof.maxDaysPerAc ||
                                    (stats && stats.remainingDays < prof.stepDays)
                                  }
                                  className="w-6 h-6 rounded bg-amber-500 disabled:opacity-30 hover:bg-amber-400 font-black text-slate-950 text-xs flex items-center justify-center cursor-pointer shadow-2xs"
                                  title={`Add ${prof.stepDays} day(s)`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary & AC Dossier Link */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Total Scheduled: <strong>{c.deployedDetails.reduce((s, d) => s + d.days, 0)} days</strong> across all classes
                    </span>
                    {onOpenDossier && (
                      <button
                        onClick={() => onOpenDossier(c.ac_no)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                      >
                        Inspect Full AC Dossier ↗
                      </button>
                    )}
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
