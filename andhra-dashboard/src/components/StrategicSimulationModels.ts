// Andhra Pradesh Strategic Simulation Models & Political Parameters

export interface CoalitionSettings {
  tdpToJspTransferPct: number; // e.g. 85% TDP cadre transfer to JSP candidates in JSP-allotted ACs
  jspToTdpTransferPct: number; // e.g. 80% JSP cadre transfer to TDP candidates in TDP-allotted ACs
  ndaToBjpTransferPct: number; // e.g. 75% NDA alliance transfer in BJP-allotted ACs
  rebelLeakagePct: number;     // e.g. 12% disgruntled cadre who rebel and vote for YSRCP opposition
}

export const DEFAULT_COALITION_SETTINGS: CoalitionSettings = {
  tdpToJspTransferPct: 85,
  jspToTdpTransferPct: 80,
  ndaToBjpTransferPct: 75,
  rebelLeakagePct: 12,
};

export interface MlaFatigueSettings {
  replaceIncumbentPct: number;     // 0 to 50 sitting MLAs dropped for fresh faces
  unpopularMlaPenalty: number;     // -8% to 0% fatigue penalty if retained
  freshFaceBoost: number;          // 0% to +8% brand recovery if new face nominated
  targetParty: 'TDP' | 'YSRCP' | 'JSP'; // Party applying ticket distribution surgery
}

export const DEFAULT_MLA_FATIGUE_SETTINGS: MlaFatigueSettings = {
  replaceIncumbentPct: 0,
  unpopularMlaPenalty: -4.5,
  freshFaceBoost: 4.0,
  targetParty: 'TDP',
};

// Andhra Pradesh 26 Reorganized Districts across 3 Key Geographic Zones
export const UTTARANDHRA_DISTRICTS = new Set([
  'Srikakulam',
  'Vizianagaram',
  'Parvathipuram Manyam',
  'Alluri Sitharama Raju',
  'Visakhapatnam',
  'Anakapalli',
]);

export const KOSTA_ANDHRA_DISTRICTS = new Set([
  'Kakinada',
  'Dr. B.R. Ambedkar Konaseema',
  'East Godavari',
  'West Godavari',
  'Eluru',
  'Krishna',
  'NTR',
  'Guntur',
  'Bapatla',
  'Palnadu',
  'Prakasam',
  'Sri Potti Sriramulu Nellore',
]);

export const RAYALASEEMA_DISTRICTS = new Set([
  'Tirupati',
  'Chittoor',
  'Annamayya',
  'YSR Kadapa',
  'Sri Sathya Sai',
  'Anantapur',
  'Kurnool',
  'Nandyal',
]);

export interface GroundCrisisSettings {
  amaravatiPaceSlowdown: number;      // 0% to 6% swing penalty in Guntur, NTR, Krishna capital region
  superSixFiscalFriction: boolean;    // -2.5% rural welfare delivery delay penalty
  vizagSteelPlantBacklash: boolean;   // -4.0% urban penalty across Visakhapatnam/Anakapalli (7 ACs)
  redBookPolarization: boolean;       // Law & order / vendetta perception penalty in factional seats
  tdpJspCadreClash: number;           // 0% to 8% friction penalty between TDP and Janasena grassroots
  rayalaseemaWaterGrievance: boolean; // -3.5% agrarian drought & irrigation penalty in Rayalaseema
}

export const DEFAULT_GROUND_CRISIS_SETTINGS: GroundCrisisSettings = {
  amaravatiPaceSlowdown: 0,
  superSixFiscalFriction: false,
  vizagSteelPlantBacklash: false,
  redBookPolarization: false,
  tdpJspCadreClash: 0,
  rayalaseemaWaterGrievance: false,
};

// 7 ACs in the Visakhapatnam Urban Industrial Belt affected by Steel Plant privatization
export const VIZAG_STEEL_PLANT_AC_NOS = new Set([
  20, // Bheemili
  21, // Visakhapatnam East
  22, // Visakhapatnam South
  23, // Visakhapatnam North
  24, // Visakhapatnam West
  25, // Gajuwaka (Steel Plant core)
  31, // Pendurthi
]);

// 18 ACs in Amaravati Capital Region (Guntur, NTR, Krishna)
export const AMARAVATI_CORE_AC_NOS = new Set([
  71, // Gannavaram (Krishna)
  78, // Penamaluru
  79, // Vijayawada West
  80, // Vijayawada Central
  81, // Vijayawada East
  82, // Mylavaram
  86, // Tadikonda (Amaravati core)
  87, // Mangalagiri (Amaravati core)
  88, // Ponnur
  91, // Tenali
  94, // Guntur West
  95, // Guntur East
]);

// 21 ACs Contested and Won by Janasena (JSP) in 2024
export const JSP_SEATS_2024 = new Set([
  10, // Palakonda (ST)
  17, // Nellimarla
  22, // Visakhapatnam South
  30, // Anakapalli
  31, // Pendurthi
  32, // Elamanchili
  37, // Pithapuram (Pawan Kalyan)
  38, // Kakinada Rural
  45, // Razole (SC)
  46, // Gannavaram (SC)
  49, // Rajanagaram
  55, // Nidadavole
  58, // Narasapuram
  59, // Bhimavaram
  62, // Tadepalligudem
  63, // Unguturu
  67, // Polavaram (ST)
  76, // Avanigadda
  91, // Tenali
  127, // Kodur (SC)
  166, // Tirupati
]);

// 10 ACs Contested by BJP in 2024 (won 8)
export const BJP_SEATS_2024 = new Set([
  7,   // Etcherla
  23,  // Visakhapatnam North
  40,  // Anaparthy
  73,  // Kaikalur
  79,  // Vijayawada West
  120, // Gudur (SC)
  124, // Badvel (SC)
  131, // Jammalamadugu
  145, // Adoni
  159, // Dharmavaram
]);
