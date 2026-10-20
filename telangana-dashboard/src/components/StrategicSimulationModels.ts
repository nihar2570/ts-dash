export interface CoalitionSettings {
  brsToBjpTransferPct: number; // e.g. 75% BRS cadre transfer to BJP candidate in BJP-allotted ACs
  bjpToBrsTransferPct: number; // e.g. 65% BJP cadre transfer to BRS candidate in BRS-allotted ACs
  rebelLeakagePct: number;     // e.g. 15% disgruntled cadre rebel and leak to Congress
}

export const DEFAULT_COALITION_SETTINGS: CoalitionSettings = {
  brsToBjpTransferPct: 75,
  bjpToBrsTransferPct: 65,
  rebelLeakagePct: 15,
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
