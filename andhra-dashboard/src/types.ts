export type Year = '2014' | '2018' | '2019' | '2023' | '2024';

export interface MyNetaDisclosure {
  criminal_cases: number;
  education: string;
  age: number;
  total_assets: number;
  total_assets_formatted: string;
  liabilities: number;
  liabilities_formatted: string;
  net_worth: number;
  net_worth_formatted: string;
  is_crorepati: boolean;
}

export interface DetailedCandidate {
  rank: number;
  name: string;
  party: string;
  raw_party: string;
  votes: number;
  vote_share: number;
  evm_votes: number;
  postal_votes: number;
  is_nota: boolean;
  deposit_status: 'RETAINED' | 'FORFEITED';
  myneta?: MyNetaDisclosure | null;
}

export interface VotersInfo {
  electors_total: number;
  electors_male: number;
  electors_female: number;
  electors_third_gender: number;
  service_electors?: number;
  overseas_electors?: number;
  voted_total: number;
  voted_male: number;
  voted_female: number;
  voted_third_gender: number;
  voted_postal: number;
  turnout_pct: number;
  rejected_postal_votes: number;
  rejected_evm_votes: number;
  nota_votes: number;
  valid_votes_polled?: number;
  tendered_votes?: number;
}

export interface ConstituencyCandidatesData {
  ac_no: number;
  ac_name: string;
  district: string;
  pc_name: string;
  total_valid_votes: number;
  deposit_threshold_votes: number;
  deposit_threshold_pct: number;
  total_candidates: number;
  candidates_above_1000: number;
  candidates: DetailedCandidate[];
  voters_info?: VotersInfo;
}

export interface CandidateResult {
  candidate: string;
  party: string;
  raw_party: string;
  votes: number;
  vote_share: number;
  myneta?: MyNetaDisclosure | null;
}

export interface SwingInfo {
  prev_party: string;
  status: 'HOLD' | 'GAIN';
  gained_from?: string | null;
}

export interface ConstituencyResult {
  ac_no: number;
  ac_name: string;
  district: string;
  pc_name: string;
  category: string;
  winner: CandidateResult;
  runner_up: CandidateResult;
  margin: number;
  margin_pct: number;
  total_valid_votes: number;
  turnout_pct: number;
  total_electors?: number;
  voters_info?: any;
  swing?: SwingInfo | null;
}

export interface YearSummary {
  total_seats: number;
  seat_tally: Record<string, number>;
  total_valid_votes: number;
  avg_margin: number;
}

export interface ElectionData {
  summary: Record<Year, YearSummary>;
  results: Record<Year, Record<string, ConstituencyResult>>;
}

export interface PartyMeta {
  code: string;
  fullName: string;
  color: string;
  textColor: string;
  bgLight: string;
}

export const PARTY_CONFIG: Record<string, PartyMeta> = {
  TDP: {
    code: 'TDP',
    fullName: 'Telugu Desam Party',
    color: '#eab308', // Vibrant Yellow
    textColor: '#000000',
    bgLight: '#fef9c3'
  },
  YSRCP: {
    code: 'YSRCP',
    fullName: 'YSR Congress Party',
    color: '#1d4ed8', // Royal Blue
    textColor: '#ffffff',
    bgLight: '#dbeafe'
  },
  JSP: {
    code: 'JSP',
    fullName: 'Janasena Party',
    color: '#dc2626', // Crimson Red
    textColor: '#ffffff',
    bgLight: '#fee2e2'
  },
  BJP: {
    code: 'BJP',
    fullName: 'Bharatiya Janata Party',
    color: '#f97316', // Saffron / Orange
    textColor: '#ffffff',
    bgLight: '#ffedd5'
  },
  INC: {
    code: 'INC',
    fullName: 'Indian National Congress',
    color: '#0284c7', // Sky / Cyan-Blue
    textColor: '#ffffff',
    bgLight: '#e0f2fe'
  },
  BSP: {
    code: 'BSP',
    fullName: 'Bahujan Samaj Party',
    color: '#4f46e5',
    textColor: '#ffffff',
    bgLight: '#e0e7ff'
  },
  AIFB: {
    code: 'AIFB',
    fullName: 'All India Forward Bloc',
    color: '#ea580c',
    textColor: '#ffffff',
    bgLight: '#ffedd5'
  },
  IND: {
    code: 'IND',
    fullName: 'Independent',
    color: '#64748b',
    textColor: '#ffffff',
    bgLight: '#f1f5f9'
  },
  OTH: {
    code: 'OTH',
    fullName: 'Other / Regional Parties',
    color: '#94a3b8',
    textColor: '#ffffff',
    bgLight: '#f8fafc'
  }
};

export function getPartyColor(partyCode: string): string {
  return PARTY_CONFIG[partyCode]?.color || PARTY_CONFIG.OTH.color;
}

export function getPartyBg(partyCode: string): string {
  return PARTY_CONFIG[partyCode]?.bgLight || PARTY_CONFIG.OTH.bgLight;
}

export interface PastelPartyScheme {
  fill: string;
  stroke: string;
  text: string;
}

export type MapColorShade = 'medium_dark' | 'very_dark' | 'full_vibrant' | 'soft_light';

export const PASTEL_SHADE_CONFIGS: Record<MapColorShade, Record<string, PastelPartyScheme>> = {
  // 1. Medium Dark Pastel (+20% richer / darker - NEW DEFAULT)
  medium_dark: {
    TDP: { fill: '#fde047', stroke: '#eab308', text: '#854d0e' },     // Rich Yellow-300
    JSP: { fill: '#fca5a5', stroke: '#ef4444', text: '#991b1b' },     // Rich Rose-300
    YSRCP: { fill: '#93c5fd', stroke: '#3b82f6', text: '#1e40af' },   // Rich Blue-300
    BJP: { fill: '#fdba74', stroke: '#f97316', text: '#9a3412' },     // Rich Saffron-300
    INC: { fill: '#7dd3fc', stroke: '#0ea5e9', text: '#075985' },     // Rich Sky-300
    CPI: { fill: '#fca5a5', stroke: '#ef4444', text: '#991b1b' },
    CPM: { fill: '#fca5a5', stroke: '#ef4444', text: '#991b1b' },
    BSP: { fill: '#a5b4fc', stroke: '#6366f1', text: '#3730a3' },
    IND: { fill: '#cbd5e1', stroke: '#64748b', text: '#1e293b' },
    OTH: { fill: '#e2e8f0', stroke: '#94a3b8', text: '#334155' },
  },
  // 2. Very Dark Pastel (+40% deep contrast)
  very_dark: {
    TDP: { fill: '#facc15', stroke: '#ca8a04', text: '#713f12' },     // Deep Yellow-400
    JSP: { fill: '#f87171', stroke: '#dc2626', text: '#7f1d1d' },     // Deep Rose-400
    YSRCP: { fill: '#60a5fa', stroke: '#2563eb', text: '#172554' },   // Deep Blue-400
    BJP: { fill: '#fb923c', stroke: '#ea580c', text: '#7c2d12' },     // Deep Saffron-400
    INC: { fill: '#38bdf8', stroke: '#0284c7', text: '#0c4a6e' },     // Deep Sky-400
    CPI: { fill: '#f87171', stroke: '#dc2626', text: '#7f1d1d' },
    CPM: { fill: '#f87171', stroke: '#dc2626', text: '#7f1d1d' },
    BSP: { fill: '#818cf8', stroke: '#4f46e5', text: '#312e81' },
    IND: { fill: '#94a3b8', stroke: '#475569', text: '#0f172a' },
    OTH: { fill: '#cbd5e1', stroke: '#64748b', text: '#1e293b' },
  },
  // 3. Full Vibrant (100% Saturation)
  full_vibrant: {
    TDP: { fill: '#eab308', stroke: '#ca8a04', text: '#000000' },
    JSP: { fill: '#dc2626', stroke: '#b91c1c', text: '#ffffff' },
    YSRCP: { fill: '#2563eb', stroke: '#1d4ed8', text: '#ffffff' },
    BJP: { fill: '#f97316', stroke: '#c2410c', text: '#ffffff' },
    INC: { fill: '#0ea5e9', stroke: '#0284c7', text: '#ffffff' },
    CPI: { fill: '#dc2626', stroke: '#b91c1c', text: '#ffffff' },
    CPM: { fill: '#dc2626', stroke: '#b91c1c', text: '#ffffff' },
    BSP: { fill: '#6366f1', stroke: '#4f46e5', text: '#ffffff' },
    IND: { fill: '#64748b', stroke: '#475569', text: '#ffffff' },
    OTH: { fill: '#475569', stroke: '#334155', text: '#ffffff' },
  },
  // 4. Soft Light Pastel (Original Light)
  soft_light: {
    TDP: { fill: '#fef08a', stroke: '#facc15', text: '#a16207' },
    JSP: { fill: '#fecaca', stroke: '#f87171', text: '#b91c1c' },
    YSRCP: { fill: '#bfdbfe', stroke: '#60a5fa', text: '#1d4ed8' },
    BJP: { fill: '#fed7aa', stroke: '#fb923c', text: '#c2410c' },
    INC: { fill: '#bae6fd', stroke: '#38bdf8', text: '#0369a1' },
    CPI: { fill: '#fecaca', stroke: '#f87171', text: '#b91c1c' },
    CPM: { fill: '#fecaca', stroke: '#f87171', text: '#b91c1c' },
    BSP: { fill: '#c7d2fe', stroke: '#818cf8', text: '#4338ca' },
    IND: { fill: '#e2e8f0', stroke: '#94a3b8', text: '#334155' },
    OTH: { fill: '#f1f5f9', stroke: '#cbd5e1', text: '#475569' },
  },
};

export const PASTEL_PARTY_CONFIG = PASTEL_SHADE_CONFIGS.medium_dark;

export function getPastelPartyColor(partyCode: string, shade: MapColorShade = 'medium_dark'): PastelPartyScheme {
  const config = PASTEL_SHADE_CONFIGS[shade] || PASTEL_SHADE_CONFIGS.medium_dark;
  return config[partyCode] || config.OTH;
}

export type ViewMode = 'winner' | 'margin' | 'swing' | 'district';

// 26 Districts of Andhra Pradesh with distinct harmonious shades of grey for fills and borders
export const DISTRICT_GREY_SHADES: Record<string, { fill: string; border: string }> = {
  'Srikakulam': { fill: '#cbd5e1', border: '#64748b' },
  'Vizianagaram': { fill: '#94a3b8', border: '#475569' },
  'Parvathipuram Manyam': { fill: '#e2e8f0', border: '#71717a' },
  'Alluri Sitharama Raju': { fill: '#d1d5db', border: '#4b5563' },
  'Visakhapatnam': { fill: '#cbd5e1', border: '#52525b' },
  'Anakapalli': { fill: '#94a3b8', border: '#334155' },
  'Kakinada': { fill: '#e5e7eb', border: '#64748b' },
  'Dr. B.R. Ambedkar Konaseema': { fill: '#d4d4d8', border: '#475569' },
  'East Godavari': { fill: '#cbd5e1', border: '#3f3f46' },
  'West Godavari': { fill: '#a1a1aa', border: '#52525b' },
  'Eluru': { fill: '#e2e8f0', border: '#64748b' },
  'Krishna': { fill: '#cbd5e1', border: '#475569' },
  'NTR': { fill: '#94a3b8', border: '#334155' },
  'Guntur': { fill: '#d1d5db', border: '#52525b' },
  'Bapatla': { fill: '#e4e4e7', border: '#71717a' },
  'Palnadu': { fill: '#64748b', border: '#334155' },
  'Prakasam': { fill: '#cbd5e1', border: '#475569' },
  'Sri Potti Sriramulu Nellore': { fill: '#e2e8f0', border: '#64748b' },
  'Tirupati': { fill: '#94a3b8', border: '#3f3f46' },
  'Chittoor': { fill: '#cbd5e1', border: '#52525b' },
  'Annamayya': { fill: '#d4d4d8', border: '#71717a' },
  'YSR Kadapa': { fill: '#94a3b8', border: '#334155' },
  'Sri Sathya Sai': { fill: '#e2e8f0', border: '#64748b' },
  'Anantapur': { fill: '#cbd5e1', border: '#475569' },
  'Kurnool': { fill: '#94a3b8', border: '#52525b' },
  'Nandyal': { fill: '#d1d5db', border: '#64748b' },
};

export function getDistrictGrey(districtName: string): string {
  return DISTRICT_GREY_SHADES[districtName]?.fill || '#cbd5e1';
}

export function getDistrictBorderGrey(districtName: string): string {
  return DISTRICT_GREY_SHADES[districtName]?.border || '#64748b';
}

export type ActiveTab = 'results' | 'dossier' | 'booth-data' | 'simulations' | 'actions' | 'reach';

export interface CasteProfile {
  // Andhra Pradesh 14-Segment Demographics Profile
  kapu: number;
  kamma: number;
  reddy: number;
  bc_turpu_kapu: number;
  bc_yadava: number;
  bc_kuruba_boya: number;
  bc_settibalija_goud: number;
  bc_padmashali: number;
  bc_other: number;
  sc_madiga_relli: number;
  sc_mala: number;
  st_tribal: number;
  minority_muslim: number;
  minority_christian: number;

  // Legacy fallback keys (optional)
  sc_madiga?: number;
  st_lambada?: number;
  st_koya_gond?: number;
  bc_mudiraj?: number;
  bc_munnuru_kapu?: number;
  bc_goud?: number;
  bc_yadav?: number;
  oc_reddy?: number;
  oc_velama?: number;
  oc_other?: number;
}

export interface AgeProfile {
  youth_18_25: number;
  age_26_40: number;
  age_41_60: number;
  age_60_plus: number;
}

export interface ConstituencyDemographics {
  ac_no: number;
  ac_name: string;
  district: string;
  pc_name: string;
  reservation: 'GEN' | 'SC' | 'ST';
  winner_2023: CandidateResult;
  runner_up_2023: CandidateResult;
  margin_2023: number;
  margin_pct_2023: number;
  total_votes_2023: number;
  total_electors?: number;
  turnout_pct?: number;
  caste_profile: CasteProfile;
  age_profile: AgeProfile;
  voters_info?: any;
}

export interface DistrictDemographics {
  district: string;
  sc_pct: number;
  st_pct: number;
  bc_pct: number;
  minority_pct: number;
  oc_pct: number;
}

export interface DemographicsDataset {
  metadata: {
    source: string;
    document: string;
    description: string;
    state_total_population: number;
    state_total_households: number;
  };
  state_demographics: {
    sc_pct: number;
    st_pct: number;
    bc_pct: number;
    minority_pct: number;
    oc_pct: number;
  };
  districts: Record<string, DistrictDemographics>;
  baseline_exit_poll: Record<string, Record<string, number>>;
  constituencies: Record<string, ConstituencyDemographics>;
}

export interface SimulatedConstituencyResult {
  ac_no: number;
  ac_name: string;
  district: string;
  reservation: 'GEN' | 'SC' | 'ST';
  votes_2023: {
    winner_party: string;
    runner_party: string;
    margin: number;
    margin_pct: number;
  };
  simulated: {
    winner_party: string;
    runner_party: string;
    winner_votes: number;
    runner_votes: number;
    margin: number;
    margin_pct: number;
    party_votes: Record<string, number>;
    is_flipped: boolean;
    flipped_from?: string;
  };
  key_demographic: string;
  key_demographic_pct: number;
  battleground_tier: 'TOSS_UP' | 'LEAN' | 'SOLID';
}

export interface CampaignActionItem {
  ac_no: number;
  ac_name: string;
  district: string;
  target_community: string;
  target_community_pct: number;
  current_margin: number;
  current_winner: string;
  target_party: string;
  allocated_points: number; // 0 - 100
  ad_focus: string;
  recommended_channel: string;
  star_campaigner_recommended: boolean;
  projected_vote_swing: number;
  projected_new_margin: number;
  flipped_with_action: boolean;
}

export interface ScenarioWhatIfItem {
  id: string;
  label: string;
  category: 'caste_blocs' | 'coalition' | 'turnout' | 'anti_incumbency' | 'target_60';
  detail: string;
}

export interface ActiveScenarioBridge {
  id: string;
  name: string;
  description: string;
  isExportedToActions: boolean;
  timestamp: number;
  whatIfs: ScenarioWhatIfItem[];
  simulatedResults: SimulatedConstituencyResult[];
  tally: {
    counts: Record<string, number>;
    flippedCount: number;
    tossUpCount: number;
    tdpDiff?: number;
    ysrcpDiff?: number;
    jspDiff?: number;
    bjpDiff?: number;
    incDiff?: number;
  };
}


