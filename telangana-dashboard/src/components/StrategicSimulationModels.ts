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

export interface GroundCrisisSettings {
  hydraUrbanBacklash: number;       // 0% to 8% vote penalty against INC in GHMC/Ranga Reddy urban ACs
  aimimNorthExpansion: boolean;     // fields candidates in 10 minority-rich North TS ACs (splits minority vote)
  edCbiFundingChoke: boolean;       // -2% campaign finance penalty in tight margin ACs (<8,000 votes)
  youthUnrestShift: number;         // 0% to 10% shift of Youth (18-25) away from INC (Ashok Nagar / Group-1)
  autoDriverDiscontent: boolean;    // -1.5% urban fringe penalty from 6.5L auto driver families
  lagacherlaLandBacklash: boolean;  // -4% ST Lambada / rural landholder swing in Kodangal & South TS
}

export const DEFAULT_GROUND_CRISIS_SETTINGS: GroundCrisisSettings = {
  hydraUrbanBacklash: 0,
  aimimNorthExpansion: false,
  edCbiFundingChoke: false,
  youthUnrestShift: 0,
  autoDriverDiscontent: false,
  lagacherlaLandBacklash: false,
};

// 10 North Telangana & Semi-Urban Seats with high minority concentration targeted by AIMIM expansion
export const AIMIM_NORTH_EXPANSION_AC_NOS = new Set([
  7,   // Adilabad
  9,   // Nirmal
  10,  // Mudhole
  12,  // Bodhan
  17,  // Nizamabad (Urban)
  20,  // Koratla
  26,  // Karimnagar
  39,  // Sangareddy
  74,  // Mahbubnagar
  106, // Warangal East
]);

// Kodangal & Southern Tribal / Rural Landholder belt
export const LAGACHERLA_ZONE_AC_NOS = new Set([
  72, // Kodangal (CM Revanth Reddy's constituency / Lagacherla village)
  73, // Narayanpet
  74, // Mahbubnagar
  75, // Jadcherla
  83, // Kalwakurthy
  84, // Shadnagar
  85, // Kollapur
]);

