import React, { useState, useMemo } from 'react';
import type { DemographicsDataset, CasteProfile } from '../types';
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
  code: string; // e.g. "A1", "A2", "B1", "B2", "C1", "M1"
  party: 'TDP' | 'YSRCP' | 'JSP' | 'BJP';
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
  // --- TELUGU DESAM PARTY (TDP) ---
  // ==========================================
  {
    id: 'tdp_a1',
    code: 'A1',
    party: 'TDP',
    tier: 'A',
    designation: 'A1 • N. Chandrababu Naidu (CM / Visionary)',
    caste: 'Kamma / Urban BC Alliances',
    casteKey: 'kamma',
    subCastes: ['kamma', 'bc_yadava', 'youth_18_25'],
    keyStrength: 'Mega-rally draw, Super Six governance guarantees, Amaravati resurrection, industrial investor confidence',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 0.95,
    resonanceZones: 'Statewide, Krishna, Guntur, Amaravati, Kuppam & Rayalaseema',
    avatarBg: 'bg-yellow-500',
  },
  {
    id: 'tdp_a2',
    code: 'A2',
    party: 'TDP',
    tier: 'A',
    designation: 'A2 • Nara Lokesh (IT & HRD Minister)',
    caste: 'Kamma & Youth Corridors',
    casteKey: 'kamma',
    subCastes: ['kamma', 'youth_18_25', 'bc_turpu_kapu'],
    keyStrength: 'Yuva Galam padayatra connect, mega DSC teacher job recruitment, Red Book anti-corruption governance',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 0.88,
    resonanceZones: 'Mangalagiri, Uttarandhra, Rayalaseema youth belt',
    avatarBg: 'bg-amber-600',
  },
  {
    id: 'tdp_b1',
    code: 'B1',
    party: 'TDP',
    tier: 'B',
    designation: 'B1 • K. Atchannaidu (Agri & BC Welfare Minister)',
    caste: 'BC Turpu Kapu',
    casteKey: 'bc_turpu_kapu',
    subCastes: ['bc_turpu_kapu', 'bc_yadava', 'bc_settibalija_goud'],
    keyStrength: 'Agrarian BC consolidation, rythu welfare subsidy releases, fiery vernacular orator',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.38,
    resonanceZones: 'Srikakulam, Vizianagaram, Tekkali & North Coastal Andhra',
    avatarBg: 'bg-indigo-600',
  },
  {
    id: 'tdp_b2',
    code: 'B2',
    party: 'TDP',
    tier: 'B',
    designation: 'B2 • Payyavula Keshav (Finance Minister)',
    caste: 'Rayalaseema Agrarian / BC Allies',
    casteKey: 'bc_kuruba_boya',
    subCastes: ['bc_kuruba_boya', 'bc_yadava', 'reddy'],
    keyStrength: 'Rayalaseema drought management, Handri-Neeva irrigation channel delivery, fiscal credibility',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.36,
    resonanceZones: 'Anantapur, Uravakonda, Kurnool, Kadapa',
    avatarBg: 'bg-emerald-600',
  },
  {
    id: 'tdp_c1',
    code: 'C1',
    party: 'TDP',
    tier: 'C',
    designation: 'C1 • Telugu Yuvatha / Ground Cadre Captain',
    caste: 'BC & Mixed Ground Cadre',
    casteKey: 'bc_yadava',
    subCastes: ['bc_yadava', 'bc_settibalija_goud', 'youth_18_25'],
    keyStrength: 'Panna pramukh booth committees, intensive door-to-door welfare verification, booth agent training',
    totalDays: 90,
    stepDays: 5,
    maxDaysPerAc: 30,
    suggestedDays: 15,
    voteLiftPerDayPct: 0.13,
    resonanceZones: 'Village polling stations, mandal headquarters across 175 ACs',
    avatarBg: 'bg-slate-700',
  },
  {
    id: 'tdp_m1',
    code: 'M1',
    party: 'TDP',
    tier: 'M',
    designation: 'M1 • Nandamuri Balakrishna (Tollywood Legend & MLA)',
    caste: 'Tollywood Cinema Mass Base & Youth',
    casteKey: 'kamma',
    subCastes: ['kamma', 'youth_18_25', 'bc_kuruba_boya'],
    keyStrength: 'Unrivaled mass cinema craze, electric dialogue delivery, NTR legacy sentiment, pulls non-political voters',
    totalDays: 14,
    stepDays: 1,
    maxDaysPerAc: 3,
    suggestedDays: 1,
    voteLiftPerDayPct: 2.30,
    resonanceZones: 'Hindupur, Rayalaseema, Guntur, Krishna mass urban centers',
    avatarBg: 'bg-yellow-600',
    isOutsideIcon: true,
  },

  // ==========================================
  // --- JANASENA PARTY (JSP) ---
  // ==========================================
  {
    id: 'jsp_a1',
    code: 'A1',
    party: 'JSP',
    tier: 'A',
    designation: 'A1 • Pawan Kalyan (Deputy CM / Janasenani)',
    caste: 'Kapu / Balija / Telaga & Youth Icon',
    casteKey: 'kapu',
    subCastes: ['kapu', 'youth_18_25', 'bc_settibalija_goud'],
    keyStrength: 'Frenzied youth appeal, Sanatana Dharma pitch, anti-vendetta self-respect crusade, clean sweep in 21 ACs',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 1.15,
    resonanceZones: 'East & West Godavari, Pithapuram, Visakhapatnam, Kakinada, Tirupati',
    avatarBg: 'bg-red-600',
  },
  {
    id: 'jsp_b1',
    code: 'B1',
    party: 'JSP',
    tier: 'B',
    designation: 'B1 • Nadendla Manohar (Civil Supplies Minister)',
    caste: 'Coastal Urban & BC Allies',
    casteKey: 'kapu',
    subCastes: ['kapu', 'kamma', 'minority_muslim'],
    keyStrength: 'Paddy procurement & PDS transparency, cadre negotiation, NDA alliance synergy management',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.36,
    resonanceZones: 'Tenali, Guntur, Krishna, Godavari belt',
    avatarBg: 'bg-rose-700',
  },
  {
    id: 'jsp_c1',
    code: 'C1',
    party: 'JSP',
    tier: 'C',
    designation: 'C1 • Janasainik Youth & Veera Mahila Cadre',
    caste: 'Kapu & Social Media Youth',
    casteKey: 'kapu',
    subCastes: ['kapu', 'youth_18_25'],
    keyStrength: 'Social media virality, grassroots village volunteer vigil, female voter connect',
    totalDays: 90,
    stepDays: 5,
    maxDaysPerAc: 30,
    suggestedDays: 15,
    voteLiftPerDayPct: 0.14,
    resonanceZones: 'Coastal Andhra rural hamlets, urban colleges',
    avatarBg: 'bg-red-800',
  },
  {
    id: 'jsp_m1',
    code: 'M1',
    party: 'JSP',
    tier: 'M',
    designation: 'M1 • Mega Family Cultural Icon / Tollywood Orator',
    caste: 'Cinema Fandom & Youth Non-Caste',
    casteKey: 'youth_18_25',
    subCastes: ['youth_18_25', 'kapu'],
    keyStrength: 'Massive highway bike rallies, youth festival crowd puller, pop cultural resonance',
    totalDays: 12,
    stepDays: 1,
    maxDaysPerAc: 3,
    suggestedDays: 1,
    voteLiftPerDayPct: 2.20,
    resonanceZones: 'Bhimavaram, Rajahmundry, Vijayawada, Gajuwaka',
    avatarBg: 'bg-rose-600',
    isOutsideIcon: true,
  },

  // ==========================================
  // --- YSR CONGRESS PARTY (YSRCP) ---
  // ==========================================
  {
    id: 'ysrcp_a1',
    code: 'A1',
    party: 'YSRCP',
    tier: 'A',
    designation: 'A1 • Y.S. Jagan Mohan Reddy (President / Ex-CM)',
    caste: 'Reddy / SC Mala & Christian Minorities',
    casteKey: 'reddy',
    subCastes: ['reddy', 'sc_mala', 'minority_christian'],
    keyStrength: 'Direct Benefit Transfer (DBT) beneficiary connect, Navaratnalu welfare loyalty, defiant anti-establishment fight',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 0.92,
    resonanceZones: 'Pulivendula, Kadapa, Kurnool, Nellore, Prakasam',
    avatarBg: 'bg-sky-700',
  },
  {
    id: 'ysrcp_a2',
    code: 'A2',
    party: 'YSRCP',
    tier: 'A',
    designation: 'A2 • Senior YSRCP State Campaigner',
    caste: 'Reddy & Minorities',
    casteKey: 'reddy',
    subCastes: ['reddy', 'minority_muslim', 'minority_christian'],
    keyStrength: 'Odarpu yatra sentiment, emotional defense against TDP Red Book police harassment',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 0.85,
    resonanceZones: 'Rayalaseema, Guntur Rural, Bapatla',
    avatarBg: 'bg-blue-800',
  },
  {
    id: 'ysrcp_b1',
    code: 'B1',
    party: 'YSRCP',
    tier: 'B',
    designation: 'B1 • Botcha Satyanarayana (Senior BC Uttarandhra Strongman)',
    caste: 'BC Turpu Kapu',
    casteKey: 'bc_turpu_kapu',
    subCastes: ['bc_turpu_kapu', 'bc_yadava'],
    keyStrength: 'Deep North Coastal backward class networks, Cheepurupalli strongman, faction management',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.38,
    resonanceZones: 'Vizianagaram, Visakhapatnam, Srikakulam',
    avatarBg: 'bg-teal-700',
  },
  {
    id: 'ysrcp_b2',
    code: 'B2',
    party: 'YSRCP',
    tier: 'B',
    designation: 'B2 • Peddireddy Ramachandra Reddy (Rayalaseema Pillar)',
    caste: 'Reddy',
    casteKey: 'reddy',
    subCastes: ['reddy', 'bc_kuruba_boya'],
    keyStrength: 'Chittoor-Punganur factional mastery, local sarpanch loyalty, resource deployment',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.36,
    resonanceZones: 'Chittoor, Punganur, Pileru, Tirupati rural',
    avatarBg: 'bg-indigo-800',
  },
  {
    id: 'ysrcp_c1',
    code: 'C1',
    party: 'YSRCP',
    tier: 'C',
    designation: 'C1 • YSRCP Mandal Convener / Village Secretariat Cadre',
    caste: 'SC & Rural BC Volunteers',
    casteKey: 'sc_mala',
    subCastes: ['sc_mala', 'sc_madiga_relli', 'bc_yadava'],
    keyStrength: 'Door-to-door welfare pension verification, volunteer network mobilization, booth-level defensive vigil',
    totalDays: 90,
    stepDays: 5,
    maxDaysPerAc: 30,
    suggestedDays: 15,
    voteLiftPerDayPct: 0.13,
    resonanceZones: 'Rural village secretariats across 175 ACs',
    avatarBg: 'bg-slate-800',
  },
  {
    id: 'ysrcp_m1',
    code: 'M1',
    party: 'YSRCP',
    tier: 'M',
    designation: 'M1 • Cultural Balladeer & YSR Welfare Singer',
    caste: 'Dalit Folk & Rural Agrarian Identity',
    casteKey: 'sc_mala',
    subCastes: ['sc_mala', 'minority_christian'],
    keyStrength: 'Heartfelt rural songs praising YSR Rajanna welfare schemes, emotional crowd gatherings',
    totalDays: 14,
    stepDays: 1,
    maxDaysPerAc: 3,
    suggestedDays: 1,
    voteLiftPerDayPct: 2.10,
    resonanceZones: 'Rayalaseema & Palnadu rural mandals',
    avatarBg: 'bg-sky-800',
    isOutsideIcon: true,
  },

  // ==========================================
  // --- BHARATIYA JANATA PARTY (BJP) ---
  // ==========================================
  {
    id: 'bjp_a1',
    code: 'A1',
    party: 'BJP',
    tier: 'A',
    designation: 'A1 • Daggubati Purandeswari (AP BJP President)',
    caste: 'Kamma / Urban Middle Class',
    casteKey: 'kamma',
    subCastes: ['kamma', 'youth_18_25', 'minority_muslim'],
    keyStrength: 'NTR daughter heritage sentiment, central Modi government development credentials, clean public image',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 0.86,
    resonanceZones: 'Rajahmundry, Visakhapatnam, Vijayawada Urban',
    avatarBg: 'bg-orange-600',
  },
  {
    id: 'bjp_b1',
    code: 'B1',
    party: 'BJP',
    tier: 'B',
    designation: 'B1 • CM Ramesh / Sujana Chowdary (MP / Leader)',
    caste: 'Reddy / Kamma Industrial Base',
    casteKey: 'reddy',
    subCastes: ['reddy', 'kamma'],
    keyStrength: 'Central project clearance narrative, industrial investments in Rayalaseema & Visakhapatnam',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.35,
    resonanceZones: 'Anakapalli, Vijayawada West, Jammalamadugu, Dharmavaram',
    avatarBg: 'bg-amber-600',
  },
  {
    id: 'bjp_c1',
    code: 'C1',
    party: 'BJP',
    tier: 'C',
    designation: 'C1 • RSS Sangathan Mantri & District In-Charge',
    caste: 'Urban BC & Nationalist Cadre',
    casteKey: 'bc_yadava',
    subCastes: ['bc_yadava', 'youth_18_25'],
    keyStrength: 'Disciplined shakha-level booth deployment, temple committee consolidation',
    totalDays: 90,
    stepDays: 5,
    maxDaysPerAc: 30,
    suggestedDays: 15,
    voteLiftPerDayPct: 0.12,
    resonanceZones: 'Urban & semi-urban constituencies in Coastal AP',
    avatarBg: 'bg-orange-800',
  },
];

// Helper: Recommend an ideal tiered squad (A + B + C + M) customized to an AC's caste demographics
export function getConstituencySquadRecommendation(
  casteProfile: CasteProfile | Record<string, number>,
  reservation?: string,
  party: 'TDP' | 'YSRCP' | 'JSP' | 'BJP' = 'TDP'
) {
  const sorted = Object.entries(casteProfile).sort((a, b) => (b[1] as number) - (a[1] as number));
  const dominant = sorted[0];
  const second = sorted[1];

  const readableCaste: Record<string, string> = {
    kapu: 'Kapu / Balija / Telaga',
    kamma: 'Kamma',
    reddy: 'Reddy',
    bc_turpu_kapu: 'BC Turpu Kapu',
    bc_yadava: 'BC Yadava',
    bc_kuruba_boya: 'BC Kuruba / Boya',
    bc_settibalija_goud: 'BC Settibalija / Goud',
    bc_padmashali: 'BC Padmashali',
    bc_other: 'BC Other',
    sc_madiga_relli: 'SC Madiga / Relli',
    sc_mala: 'SC Mala',
    st_tribal: 'ST Tribals',
    minority_muslim: 'Muslim Minorities',
    minority_christian: 'Christian Minorities',
  };

  const topCasteName = readableCaste[dominant[0]] || dominant[0];
  const secondCasteName = readableCaste[second?.[0]] || second?.[0] || '';

  // Select optimal tier recommendations
  let recommendedA = 'A1';
  let recommendedB = 'B1';
  let recommendedC = 'C1';
  let recommendedM = 'M1';
  let strategyBrief = '';

  if (dominant[0] === 'kapu' || second?.[0] === 'kapu') {
    recommendedA = party === 'JSP' ? 'A1' : 'A1';
    recommendedB = 'B1';
    recommendedC = party === 'JSP' ? 'C1' : 'C1';
    recommendedM = party === 'TDP' ? 'M1' : 'M1';
    strategyBrief = `High Kapu / Balija presence (${dominant[1]}% ${topCasteName}). Deploy A1 (Pawan Kalyan / Chandrababu Naidu) for joint alliance consolidation, B1 for BC harmony, and M1 for mass youth turnouts.`;
  } else if (dominant[0] === 'reddy' || second?.[0] === 'reddy') {
    recommendedA = party === 'YSRCP' ? 'A1' : 'A1';
    recommendedB = party === 'TDP' ? 'B2' : 'B2';
    recommendedC = 'C1';
    recommendedM = 'M1';
    strategyBrief = `Traditional Reddy agrarian heartland (${dominant[1]}% ${topCasteName}). Deploy A1 for high-stakes leadership showdown, B2 (Rayalaseema irrigation minister) for canal water assurances, and C1 for booth-level panna pramukh vigilance.`;
  } else if (dominant[0] === 'bc_turpu_kapu' || second?.[0] === 'bc_turpu_kapu') {
    recommendedA = 'A1';
    recommendedB = 'B1';
    recommendedC = 'C1';
    recommendedM = 'M1';
    strategyBrief = `North Coastal Uttarandhra stronghold (${dominant[1]}% ${topCasteName}). Deploy B1 (K. Atchannaidu / Botcha) for caste kinship outreach, A1 for mega infrastructure commitments, and C1 for mandal mobilization.`;
  } else if (reservation === 'SC' || dominant[0] === 'sc_madiga_relli' || dominant[0] === 'sc_mala') {
    recommendedA = 'A1';
    recommendedB = 'B1';
    recommendedC = 'C1';
    recommendedM = 'M1';
    strategyBrief = `Reserved SC Constituency (${dominant[1]}% ${topCasteName}). Deploy A1 with statutory sub-categorization and free power welfare guarantees, paired with local C1 cadre and M1 cultural roadshows.`;
  } else {
    recommendedA = 'A1';
    recommendedB = 'B1';
    recommendedC = 'C1';
    recommendedM = 'M1';
    strategyBrief = `Backward Class & Agrarian Core (${dominant[1]}% ${topCasteName}, ${second?.[1] || 0}% ${secondCasteName}). Deploy A1 for Super Six welfare blitz, B1 for artisanal BC mandal reach, and M1 (Cinema Icon) for viral town roadshows.`;
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
    combinedPotentialLiftPct: 10.8,
  };
}

export interface StarCampaignerAllocatorProps {
  data: DemographicsDataset;
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
  // Party toggle: defaults to TDP across Andhra Pradesh
  const [selectedParty, setSelectedParty] = useState<'TDP' | 'YSRCP' | 'JSP' | 'BJP'>('TDP');
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
                onClick={() => setSelectedParty('TDP')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedParty === 'TDP'
                    ? 'bg-yellow-500 text-slate-950 shadow-xs font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-slate-950" />
                TDP
              </button>
              <button
                onClick={() => setSelectedParty('YSRCP')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedParty === 'YSRCP'
                    ? 'bg-sky-700 text-white shadow-xs font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white" />
                YSRCP
              </button>
              <button
                onClick={() => setSelectedParty('JSP')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedParty === 'JSP'
                    ? 'bg-red-600 text-white shadow-xs font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white" />
                JSP
              </button>
              <button
                onClick={() => setSelectedParty('BJP')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedParty === 'BJP'
                    ? 'bg-orange-600 text-white shadow-xs font-black'
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
            <strong className="text-white font-bold">{selectedParty} Strategic Campaign Plan</strong>
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
              All 175
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
