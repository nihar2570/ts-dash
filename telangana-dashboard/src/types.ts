export type Year = '2014' | '2018' | '2023';

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
  INC: {
    code: 'INC',
    fullName: 'Indian National Congress',
    color: '#0284c7', // Sky / Cyan-Blue
    textColor: '#ffffff',
    bgLight: '#e0f2fe'
  },
  BRS: {
    code: 'BRS',
    fullName: 'Bharat Rashtra Samithi (TRS)',
    color: '#ec4899', // Pink
    textColor: '#ffffff',
    bgLight: '#fce7f3'
  },
  BJP: {
    code: 'BJP',
    fullName: 'Bharatiya Janata Party',
    color: '#f97316', // Saffron / Orange
    textColor: '#ffffff',
    bgLight: '#ffedd5'
  },
  AIMIM: {
    code: 'AIMIM',
    fullName: 'All India Majlis-E-Ittehadul Muslimeen',
    color: '#15803d', // Green
    textColor: '#ffffff',
    bgLight: '#dcfce7'
  },
  TDP: {
    code: 'TDP',
    fullName: 'Telugu Desam Party',
    color: '#eab308', // Yellow
    textColor: '#000000',
    bgLight: '#fef9c3'
  },
  CPI: {
    code: 'CPI',
    fullName: 'Communist Party of India',
    color: '#dc2626', // Red
    textColor: '#ffffff',
    bgLight: '#fee2e2'
  },
  CPM: {
    code: 'CPM',
    fullName: 'CPI (Marxist)',
    color: '#b91c1c', // Dark Red
    textColor: '#ffffff',
    bgLight: '#fee2e2'
  },
  YSRCP: {
    code: 'YSRCP',
    fullName: 'YSR Congress Party',
    color: '#0369a1',
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

export const PASTEL_PARTY_CONFIG: Record<string, PastelPartyScheme> = {
  INC: { fill: '#bae6fd', stroke: '#38bdf8', text: '#0369a1' },     // Sky-200 / Sky-400 / Sky-700
  BRS: { fill: '#fbcfe8', stroke: '#f472b6', text: '#be185d' },     // Pink-200 / Pink-400 / Pink-700
  BJP: { fill: '#fed7aa', stroke: '#fb923c', text: '#c2410c' },     // Orange-200 / Orange-400 / Orange-700
  AIMIM: { fill: '#bbf7d0', stroke: '#4ade80', text: '#15803d' },   // Green-200 / Green-400 / Green-700
  CPI: { fill: '#fecaca', stroke: '#f87171', text: '#b91c1c' },     // Red-200 / Red-400 / Red-700
  CPM: { fill: '#fecaca', stroke: '#f87171', text: '#b91c1c' },
  TDP: { fill: '#fef08a', stroke: '#facc15', text: '#a16207' },     // Yellow-200 / Yellow-400 / Yellow-700
  BSP: { fill: '#c7d2fe', stroke: '#818cf8', text: '#4338ca' },     // Indigo-200 / Indigo-400 / Indigo-700
  YSRCP: { fill: '#bfdbfe', stroke: '#60a5fa', text: '#1d4ed8' },   // Blue-200 / Blue-400 / Blue-700
  AIFB: { fill: '#fed7aa', stroke: '#fb923c', text: '#c2410c' },
  IND: { fill: '#e2e8f0', stroke: '#94a3b8', text: '#334155' },     // Slate-200 / Slate-400 / Slate-700
  OTH: { fill: '#f1f5f9', stroke: '#cbd5e1', text: '#475569' },
};

export function getPastelPartyColor(partyCode: string): PastelPartyScheme {
  return PASTEL_PARTY_CONFIG[partyCode] || PASTEL_PARTY_CONFIG.OTH;
}

export type ViewMode = 'winner' | 'margin' | 'swing' | 'district';

// 33 Districts of Telangana with distinct harmonious shades of grey for fills and borders
export const DISTRICT_GREY_SHADES: Record<string, { fill: string; border: string }> = {
  'Adilabad': { fill: '#cbd5e1', border: '#64748b' },
  'Kumuram Bheem Asifabad': { fill: '#94a3b8', border: '#475569' },
  'Mancherial': { fill: '#e2e8f0', border: '#71717a' },
  'Nirmal': { fill: '#d1d5db', border: '#4b5563' },
  'Nizamabad': { fill: '#cbd5e1', border: '#52525b' },
  'Kamareddy': { fill: '#94a3b8', border: '#334155' },
  'Jagtial': { fill: '#e5e7eb', border: '#64748b' },
  'Peddapalli': { fill: '#d4d4d8', border: '#475569' },
  'Karimnagar': { fill: '#cbd5e1', border: '#3f3f46' },
  'Rajanna Sircilla': { fill: '#a1a1aa', border: '#52525b' },
  'Siddipet': { fill: '#e2e8f0', border: '#64748b' },
  'Medak': { fill: '#cbd5e1', border: '#475569' },
  'Sangareddy': { fill: '#94a3b8', border: '#334155' },
  'Vikarabad': { fill: '#d1d5db', border: '#52525b' },
  'Medchal-Malkajgiri': { fill: '#e4e4e7', border: '#71717a' },
  'Hyderabad': { fill: '#64748b', border: '#334155' },
  'Ranga Reddy': { fill: '#cbd5e1', border: '#475569' },
  'Mahabubnagar': { fill: '#e2e8f0', border: '#64748b' },
  'Narayanpet': { fill: '#94a3b8', border: '#3f3f46' },
  'Jogulamba Gadwal': { fill: '#cbd5e1', border: '#52525b' },
  'Wanaparthy': { fill: '#d4d4d8', border: '#71717a' },
  'Nagarkurnool': { fill: '#94a3b8', border: '#334155' },
  'Nalgonda': { fill: '#e2e8f0', border: '#64748b' },
  'Suryapet': { fill: '#cbd5e1', border: '#475569' },
  'Yadadri Bhuvanagiri': { fill: '#94a3b8', border: '#52525b' },
  'Jangaon': { fill: '#d1d5db', border: '#64748b' },
  'Mahabubabad': { fill: '#cbd5e1', border: '#475569' },
  'Hanamkonda': { fill: '#a1a1aa', border: '#334155' },
  'Warangal': { fill: '#e2e8f0', border: '#52525b' },
  'Jayashankar Bhupalpally': { fill: '#cbd5e1', border: '#64748b' },
  'Mulugu': { fill: '#94a3b8', border: '#475569' },
  'Bhadradri Kothagudem': { fill: '#d1d5db', border: '#52525b' },
  'Khammam': { fill: '#cbd5e1', border: '#334155' }
};

export function getDistrictGrey(districtName: string): string {
  return DISTRICT_GREY_SHADES[districtName]?.fill || '#cbd5e1';
}

export function getDistrictBorderGrey(districtName: string): string {
  return DISTRICT_GREY_SHADES[districtName]?.border || '#64748b';
}

export type ActiveTab = 'results' | 'simulations' | 'actions' | 'booth-data';

export interface CasteProfile {
  sc_madiga: number;
  sc_mala: number;
  st_lambada: number;
  st_koya_gond: number;
  bc_mudiraj: number;
  bc_munnuru_kapu: number;
  bc_padmashali: number;
  bc_goud: number;
  bc_yadav: number;
  bc_other: number;
  minority_muslim: number;
  oc_reddy: number;
  oc_velama: number;
  oc_other: number;
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
  caste_profile: CasteProfile;
  age_profile: AgeProfile;
}

export interface DistrictDemographics {
  district: string;
  sc_pct: number;
  st_pct: number;
  bc_pct: number;
  minority_pct: number;
  oc_pct: number;
}

export interface SeeepcDataset {
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
    incDiff: number;
    brsDiff: number;
    bjpDiff: number;
  };
}


