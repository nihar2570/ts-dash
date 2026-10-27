import type { PartySwing } from '../SwingStudioModal';

export type CasteCommunityKey =
  | 'sc_madiga'
  | 'sc_mala'
  | 'st_lambada'
  | 'st_koya_gond'
  | 'bc_mudiraj'
  | 'bc_munnuru_kapu'
  | 'bc_padmashali'
  | 'bc_goud'
  | 'bc_yadav'
  | 'bc_other'
  | 'minority_muslim'
  | 'oc_reddy'
  | 'oc_velama'
  | 'oc_other';

export interface CasteCommunityMeta {
  key: CasteCommunityKey;
  label: string;
  subCategory: string;
  category: 'BC' | 'SC_ST' | 'OC_MIN';
  categoryLabel: string;
  stateShareEst: string;
  decisiveRegions: string;
  politicalContext: string;
}

export const ALL_CASTE_COMMUNITIES: CasteCommunityMeta[] = [
  // Backward Classes (BCs ~50% TS)
  {
    key: 'bc_mudiraj',
    label: 'BC Mudiraj',
    subCategory: 'BC-D (Fisheries, Agriculture & Labor)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    stateShareEst: '~12.2%',
    decisiveRegions: 'Medak, Nizamabad, Karimnagar, Ranga Reddy, Mahabubnagar',
    politicalContext: 'Key swing bloc demanding BC sub-quota and cabinet empowerment',
  },
  {
    key: 'bc_munnuru_kapu',
    label: 'BC Munnuru Kapu',
    subCategory: 'BC-D (Agrarian & Trade)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    stateShareEst: '~10.5%',
    decisiveRegions: 'Karimnagar, Jagtial, Adilabad, Nizamabad, Warangal',
    politicalContext: 'Influential agrarian BC group with strong BJP-BRS contestation',
  },
  {
    key: 'bc_padmashali',
    label: 'BC Padmashali',
    subCategory: 'BC-B (Weavers & Artisans)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    stateShareEst: '~5.8%',
    decisiveRegions: 'Rajanna Sircilla, Yadadri Bhuvanagiri, Warangal, Nalgonda',
    politicalContext: 'Handloom cluster vote; responsive to yarn subsidies and welfare schemes',
  },
  {
    key: 'bc_goud',
    label: 'BC Goud / Ediga',
    subCategory: 'BC-B (Toddy Tapping & Agriculture)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    stateShareEst: '~6.8%',
    decisiveRegions: 'Ranga Reddy, Mahabubnagar, Nalgonda, Medak',
    politicalContext: 'Traditional regional stronghold sensitive to excise policy and welfare',
  },
  {
    key: 'bc_yadav',
    label: 'BC Yadav / Golla-Kuruma',
    subCategory: 'BC-D (Pastoral & Livestock)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    stateShareEst: '~7.2%',
    decisiveRegions: 'Nalgonda, Mahabubnagar, Suryapet, Khammam',
    politicalContext: 'Agrarian pastoral community; key beneficiaries of animal husbandry schemes',
  },
  {
    key: 'bc_other',
    label: 'BC Other (Artisans & MBC)',
    subCategory: 'BC-A & BC-E (Vishwakarma, Perika, Nayee, Vaddera)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    stateShareEst: '~8.5%',
    decisiveRegions: 'Statewide rural and semi-urban artisan clusters',
    politicalContext: 'Most Backward Classes (MBCs) seeking targeted welfare credit and corporations',
  },

  // Scheduled Castes & Scheduled Tribes (SC/ST ~28% TS)
  {
    key: 'sc_madiga',
    label: 'SC Madiga & Sub-castes',
    subCategory: 'Scheduled Caste (A/B Categories)',
    category: 'SC_ST',
    categoryLabel: 'Scheduled Castes & Tribes',
    stateShareEst: '~10.8%',
    decisiveRegions: 'Karimnagar, Warangal, Medak, Nalgonda, Adilabad',
    politicalContext: 'Supreme Court sub-categorization verdict & MRPS movement focal point',
  },
  {
    key: 'sc_mala',
    label: 'SC Mala & Sub-castes',
    subCategory: 'Scheduled Caste (C/D Categories)',
    category: 'SC_ST',
    categoryLabel: 'Scheduled Castes & Tribes',
    stateShareEst: '~6.9%',
    decisiveRegions: 'South Telangana, Khammam, Nalgonda, Mahabubnagar',
    politicalContext: 'Strong loyal base for Congress and Ambedkarite social justice platforms',
  },
  {
    key: 'st_lambada',
    label: 'ST Lambada / Banjara',
    subCategory: 'Scheduled Tribe (Thandas & Rural)',
    category: 'SC_ST',
    categoryLabel: 'Scheduled Castes & Tribes',
    stateShareEst: '~6.2%',
    decisiveRegions: 'Mahabubnagar, Nalgonda, Khammam, Warangal thanda belts',
    politicalContext: 'High-turnout community mobilized by thanda panchayats & Podu land patta titles',
  },
  {
    key: 'st_koya_gond',
    label: 'ST Adivasi Gond & Koya',
    subCategory: 'Scheduled Tribe (Agency & Forest Areas)',
    category: 'SC_ST',
    categoryLabel: 'Scheduled Castes & Tribes',
    stateShareEst: '~3.9%',
    decisiveRegions: 'Adilabad, Kumuram Bheem Asifabad, Mulugu, Bhadrachalam',
    politicalContext: 'Agency 1/70 Act preservation, forest rights (FRA), tribal identity defense',
  },

  // Minorities & Open Categories (OC/MIN ~22% TS)
  {
    key: 'minority_muslim',
    label: 'Muslim Minorities',
    subCategory: 'BC-E & General (Urban & Rural)',
    category: 'OC_MIN',
    categoryLabel: 'Minorities & General',
    stateShareEst: '~12.7%',
    decisiveRegions: 'GHMC Hyderabad, Nizamabad, Karimnagar, Mahabubnagar, Sangareddy',
    politicalContext: 'Decisive minority voting bloc prioritizing secular consolidation and welfare',
  },
  {
    key: 'oc_reddy',
    label: 'OC Reddy',
    subCategory: 'Open Category (Agrarian & Political Leadership)',
    category: 'OC_MIN',
    categoryLabel: 'Minorities & General',
    stateShareEst: '~6.4%',
    decisiveRegions: 'Nalgonda, Mahabubnagar, Ranga Reddy, Khammam',
    politicalContext: 'Dominant agrarian political leadership with ruling party consolidation',
  },
  {
    key: 'oc_velama',
    label: 'OC Velama',
    subCategory: 'Open Category (Political Leadership)',
    category: 'OC_MIN',
    categoryLabel: 'Minorities & General',
    stateShareEst: '~2.6%',
    decisiveRegions: 'Siddipet, Sircilla, Gajwel, Karimnagar, Medak',
    politicalContext: 'Core leadership cadre for regional Telangana politics and BRS loyalty',
  },
  {
    key: 'oc_other',
    label: 'OC Other (Kamma, Brahmin, Vysya)',
    subCategory: 'Open Category (Urban & Settler Communities)',
    category: 'OC_MIN',
    categoryLabel: 'Minorities & General',
    stateShareEst: '~4.5%',
    decisiveRegions: 'GHMC, Kukatpally, Serilingampally, Khammam, Warangal Urban',
    politicalContext: 'Urban middle class, commercial traders, and Andhra settler alignment',
  },
];

export interface CasteVoteShare {
  INC: number;
  BRS: number;
  BJP: number;
  AIMIM?: number;
  OTH?: number;
}

export interface CasteSurveyDefinition {
  id: string; // e.g. 'survey_peoples_pulse'
  name: string; // 'Survey by People\'s Pulse'
  agency: string; // 'People\'s Pulse Political Research'
  shortLabel: string; // 'People\'s Pulse'
  leadAnalyst: string;
  date: string; // 'October 2024'
  sampleSize: number; // 44,800
  methodology: string;
  marginOfError: string;
  headlineFinding: string;
  narrativeSummary: string;
  badgeColor: 'indigo' | 'emerald' | 'amber' | 'purple' | 'cyan' | 'rose';
  // ONLY Complete Caste Data (all 14 communities)
  swings: Record<CasteCommunityKey, PartySwing>;
  // Optional pre-calculated surveyed shares
  surveyedShares?: Record<CasteCommunityKey, CasteVoteShare>;
}

export const BASELINE_2023_EXIT_POLL_CASTES: Record<CasteCommunityKey, CasteVoteShare> = {
  sc_madiga: { INC: 44, BRS: 22, BJP: 31, AIMIM: 0, OTH: 3 },
  sc_mala: { INC: 62, BRS: 27, BJP: 8, AIMIM: 0, OTH: 3 },
  st_lambada: { INC: 48, BRS: 42, BJP: 8, AIMIM: 0, OTH: 2 },
  st_koya_gond: { INC: 54, BRS: 33, BJP: 11, AIMIM: 0, OTH: 2 },
  bc_mudiraj: { INC: 29, BRS: 43, BJP: 26, AIMIM: 0, OTH: 2 },
  bc_munnuru_kapu: { INC: 37, BRS: 41, BJP: 20, AIMIM: 0, OTH: 2 },
  bc_padmashali: { INC: 38, BRS: 47, BJP: 13, AIMIM: 0, OTH: 2 },
  bc_goud: { INC: 42, BRS: 45, BJP: 11, AIMIM: 0, OTH: 2 },
  bc_yadav: { INC: 37, BRS: 49, BJP: 12, AIMIM: 0, OTH: 2 },
  bc_other: { INC: 38, BRS: 44, BJP: 16, AIMIM: 0, OTH: 2 },
  minority_muslim: { INC: 65, BRS: 24, BJP: 2, AIMIM: 8, OTH: 1 },
  oc_reddy: { INC: 56, BRS: 33, BJP: 9, AIMIM: 0, OTH: 2 },
  oc_velama: { INC: 28, BRS: 58, BJP: 12, AIMIM: 0, OTH: 2 },
  oc_other: { INC: 42, BRS: 38, BJP: 18, AIMIM: 0, OTH: 2 },
};
