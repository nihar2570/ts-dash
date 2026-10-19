export interface WelfareSettings {
  mahalakshmiPct: number;    // 0 to 100% execution (Default 75%). Drives women & BC Padmashali/SC Mala retention
  rythuBharosaPct: number;   // 0 to 100% execution (Default 70%). Drives agrarian farmer swing in rural belts
  loanWaiverPct: number;     // 0 to 100% execution (Default 65%). Drives small/marginal farmer retention (up to 2L waiver)
  gruhaJyothiPct: number;    // 0 to 100% execution (Default 85%). Zero bill 200 units power (urban slums & rural poor)
  indirammaIndluPct: number; // 0 to 100% execution (Default 40%). Housing grant rollout for rural homeless
}

export const DEFAULT_WELFARE_SETTINGS: WelfareSettings = {
  mahalakshmiPct: 75,
  rythuBharosaPct: 70,
  loanWaiverPct: 65,
  gruhaJyothiPct: 85,
  indirammaIndluPct: 40,
};

export interface MlaFatigueSettings {
  replaceIncumbentPct: number;     // 0 to 50 sitting MLAs dropped for fresh faces
  unpopularMlaPenalty: number;     // -8% to 0% fatigue penalty if retained
  freshFaceBoost: number;          // 0% to +8% brand recovery if new face nominated
  targetParty: 'INC' | 'BRS' | 'BJP'; // Party applying ticket distribution surgery
}

export const DEFAULT_MLA_FATIGUE_SETTINGS: MlaFatigueSettings = {
  replaceIncumbentPct: 0,
  unpopularMlaPenalty: -4.5,
  freshFaceBoost: 4.0,
  targetParty: 'INC',
};

export interface CannibalizationSettings {
  sourceParty: 'BRS' | 'INC' | 'BJP';
  bleedPct: number;                // 0% to 15% vote share shed
  destinationRatio: {             // How the bleed splits among opponents
    toBjp: number;                 // e.g. 60%
    toInc: number;                 // e.g. 40%
    toBrs: number;                 // e.g. 0%
  };
  regionBias: 'ALL' | 'NORTH_TS' | 'SOUTH_TS' | 'GHMC_URBAN';
}

export const DEFAULT_CANNIBALIZATION_SETTINGS: CannibalizationSettings = {
  sourceParty: 'BRS',
  bleedPct: 0,
  destinationRatio: {
    toBjp: 60,
    toInc: 40,
    toBrs: 0,
  },
  regionBias: 'ALL',
};

export const NORTH_TS_DISTRICTS = new Set([
  'Adilabad',
  'Kumuram Bheem Asifabad',
  'Mancherial',
  'Nirmal',
  'Nizamabad',
  'Kamareddy',
  'Jagtial',
  'Peddapalli',
  'Karimnagar',
  'Rajanna Sircilla',
]);

export const SOUTH_TS_DISTRICTS = new Set([
  'Mahabubnagar',
  'Narayanpet',
  'Jogulamba Gadwal',
  'Wanaparthy',
  'Nagarkurnool',
  'Nalgonda',
  'Suryapet',
  'Yadadri Bhuvanagiri',
  'Khammam',
  'Bhadradri Kothagudem',
]);

export const GHMC_URBAN_DISTRICTS = new Set([
  'Hyderabad',
  'Medchal-Malkajgiri',
  'Ranga Reddy',
]);

