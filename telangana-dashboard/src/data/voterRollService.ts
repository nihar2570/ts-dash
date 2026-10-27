// Voter Roll Data Model & Loading Service for Polling Stations
// Supports fetching official CEO Telangana extracted JSON or deterministic demographic generation

export interface ElectorRecord {
  slNo: number;
  epic: string;
  name: string;
  relativeName: string;
  relationType: 'F' | 'H' | 'M' | 'W' | 'O'; // Father, Husband, Mother, Wife, Other
  houseNo: string;
  age: number;
  gender: 'M' | 'F' | 'TG';
  section: string;
  pannaPage: number;
  triageTag: 'committed' | 'swing' | 'lean_opp' | 'neutral';
}

export interface BoothVoterRollSummary {
  acNo: number;
  boothNo: number;
  boothName: string;
  mandalName: string;
  totalElectors: number;
  maleCount: number;
  femaleCount: number;
  tgCount: number;
  firstTimeCount: number; // 18-25
  youngCount: number; // 26-40
  middleCount: number; // 41-60
  seniorCount: number; // 60+
  householdCount: number;
  totalPages: number;
  roll2026Url?: string;
  roll2026Pages?: number;
  roll2026SizeKb?: number;
  is2026OfficialRoll?: boolean;
  isAuthenticExtract?: boolean;
  roll_source?: {
    year?: number;
    revision?: string;
    url?: string;
    pdf_pages?: number;
    pdf_size_mb?: number;
  };
  electors: ElectorRecord[];
}

export function invalidateBoothCache(acNo: number, boothNo: number): void {
  const cacheKey = `${acNo}_${boothNo}`;
  boothRollCache.delete(cacheKey);
}

// Pseudo-random hash for deterministic reproducibility
function pseudoHash(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Detailed surname pools categorized by community
const COMMUNITY_SURNAMES = {
  MUSLIM_MINORITY: [
    'Mohammed', 'Shaik', 'Syed', 'Ahmed', 'Khan', 'Mirza', 'Begum', 'Hussain',
    'Qureshi', 'Ansari', 'Siddiqui', 'Farooqui', 'Ali', 'Owaisi', 'Pasha', 'Baig'
  ],
  ST_ADIVASI_GOND: [
    'Mesram', 'Athram', 'Todsam', 'Marsakola', 'Kanaka', 'Soyam', 'Madavi', 'Kodapa'
  ],
  ST_LAMBADA: [
    'Rathod', 'Jadhav', 'Pawar', 'Chavan', 'Banoth', 'Guguloth', 'Dharavath', 'Boda'
  ],
  SC_MADIGA: [
    'Durgam', 'Kommu', 'Koppula', 'Bhatti', 'Manda', 'Errolla', 'Kasipeta', 'Devarapalli'
  ],
  SC_MALA: [
    'Nallala', 'Ravula', 'Jogu', 'Dasari', 'Palvai', 'Gundla', 'Bandi'
  ],
  BC_MUNNURU_KAPU: [
    'Patel', 'Kasarla', 'Vangala', 'Gaddam', 'Thota', 'Burra', 'Munnuru', 'Gangula'
  ],
  BC_GOUD: [
    'Goud', 'Kura', 'Bojja', 'Pendyala', 'Malyala', 'Chunchu', 'Goundla'
  ],
  BC_MUDIRAJ: [
    'Mudiraj', 'Mudhiraj', 'Bollam', 'Pilli', 'Talari', 'Singam', 'Banda'
  ],
  BC_PADMASHALI: [
    'Padmashali', 'Ganta', 'Konda', 'Devadas', 'Jalagam', 'Veldandi'
  ],
  BC_YADAV: [
    'Yadav', 'Golla', 'Kuruma', 'Bollu', 'Alimineti'
  ],
  OC_REDDY: [
    'Reddy', 'Komatireddy', 'Kunduru', 'Challa', 'Singireddy', 'Marri', 'Gavinolla'
  ],
  OC_VELAMA: [
    'Rao', 'Kalvakuntla', 'Jupally', 'Pocharam', 'Katipally', 'Vemula'
  ]
};

// Returns a weighted surname pool aligned with SEEEPC Vol-4 constituency demographics
function getRegionSurnames(acNo: number): string[] {
  // 1. High Muslim Minority constituencies (Hyderabad Old City & urban pockets)
  const isHighMinority = [58, 63, 64, 66, 67, 68, 69, 12, 17, 71].includes(acNo);
  if (isHighMinority) {
    return [
      ...COMMUNITY_SURNAMES.MUSLIM_MINORITY,
      ...COMMUNITY_SURNAMES.MUSLIM_MINORITY, // 2x weight for ~60% SEEEPC
      ...COMMUNITY_SURNAMES.BC_MUDIRAJ,
      ...COMMUNITY_SURNAMES.BC_GOUD,
      ...COMMUNITY_SURNAMES.OC_REDDY,
      ...COMMUNITY_SURNAMES.SC_MADIGA
    ];
  }

  // 2. ST Reserved / High ST Agency Belts (Boath, Asifabad, Khanapur, Pinapaka, Yellandu, Aswaraopeta, etc.)
  const isSTBelt = [1, 5, 6, 83, 110, 111, 119].includes(acNo);
  if (isSTBelt) {
    return [
      ...COMMUNITY_SURNAMES.ST_ADIVASI_GOND,
      ...COMMUNITY_SURNAMES.ST_LAMBADA,
      ...COMMUNITY_SURNAMES.ST_ADIVASI_GOND, // 2x weight
      ...COMMUNITY_SURNAMES.SC_MADIGA,
      ...COMMUNITY_SURNAMES.BC_MUNNURU_KAPU,
      ...COMMUNITY_SURNAMES.BC_GOUD,
      ...COMMUNITY_SURNAMES.OC_REDDY
    ];
  }

  // 3. SC Reserved Belts (Chennur, Bellampalle, Dharmapuri, Choppadandi, Manakondur, Andole, Zahirabad, etc.)
  const isSCBelt = [2, 3, 22, 31, 32, 33, 48, 50, 75, 82, 88, 102, 105, 114].includes(acNo);
  if (isSCBelt) {
    return [
      ...COMMUNITY_SURNAMES.SC_MADIGA,
      ...COMMUNITY_SURNAMES.SC_MALA,
      ...COMMUNITY_SURNAMES.SC_MADIGA, // 2x weight
      ...COMMUNITY_SURNAMES.BC_GOUD,
      ...COMMUNITY_SURNAMES.BC_MUDIRAJ,
      ...COMMUNITY_SURNAMES.BC_PADMASHALI,
      ...COMMUNITY_SURNAMES.BC_MUNNURU_KAPU,
      ...COMMUNITY_SURNAMES.OC_REDDY
    ];
  }

  // 4. North & Central BC Belts (Karimnagar, Warangal, Sircilla, Jagtial, Nizamabad)
  if (acNo <= 42) {
    return [
      ...COMMUNITY_SURNAMES.BC_MUNNURU_KAPU,
      ...COMMUNITY_SURNAMES.BC_PADMASHALI,
      ...COMMUNITY_SURNAMES.BC_GOUD,
      ...COMMUNITY_SURNAMES.BC_MUDIRAJ,
      ...COMMUNITY_SURNAMES.SC_MADIGA,
      ...COMMUNITY_SURNAMES.SC_MALA,
      ...COMMUNITY_SURNAMES.OC_REDDY,
      ...COMMUNITY_SURNAMES.OC_VELAMA,
      ...COMMUNITY_SURNAMES.MUSLIM_MINORITY
    ];
  }

  // 5. South & Agrarian Belts (Nalgonda, Suryapet, Mahbubnagar, Khammam)
  return [
    ...COMMUNITY_SURNAMES.OC_REDDY,
    ...COMMUNITY_SURNAMES.BC_YADAV,
    ...COMMUNITY_SURNAMES.BC_GOUD,
    ...COMMUNITY_SURNAMES.BC_MUDIRAJ,
    ...COMMUNITY_SURNAMES.SC_MADIGA,
    ...COMMUNITY_SURNAMES.SC_MALA,
    ...COMMUNITY_SURNAMES.ST_LAMBADA,
    ...COMMUNITY_SURNAMES.MUSLIM_MINORITY
  ];
}

const MALE_FIRST_NAMES = [
  'Harish', 'Konappa', 'Srinivas', 'Venkat', 'Ramesh', 'Rajesh', 'Satyanarayana',
  'Laxman', 'Thirupathi', 'Anjaiah', 'Shankar', 'Mallaiah', 'Somanna', 'Bapu',
  'Pocham', 'Lingaiah', 'Mohan', 'Ravi', 'Suresh', 'Bhaskar', 'Anand', 'Sai',
  'Devender', 'Mallesh', 'Chandu', 'Ramu', 'Raju', 'Ashok', 'Nagaraju', 'Prabhakar',
  'Bheem Rao', 'Nagender', 'Sambaiah', 'Rajamouli', 'Venkanna', 'Kishan', 'Santosh'
];

const FEMALE_FIRST_NAMES = [
  'Laxmi', 'Renuka', 'Padma', 'Rajitha', 'Kavitha', 'Sunitha', 'Srilatha', 'Anitha',
  'Lavanya', 'Swapna', 'Poshamani', 'Pochamma', 'Mallamma', 'Bheemakka', 'Gangamma',
  'Savithri', 'Sujatha', 'Sharadha', 'Sailaja', 'Lalitha', 'Parvathi', 'Yellamma',
  'Bhagya', 'Sandhya', 'Devaki', 'Gowramma', 'Suguna', 'Mankamma', 'Radha', 'Pushpa'
];

const SECTIONS = [
  'Section 1: Main Grama Basti',
  'Section 2: Harijan Colony',
  'Section 3: Adivasi Gond Gudem',
  'Section 4: BC Colony, Bazaar Street',
  'Section 5: Patel Wada & Bus Stand Area',
  'Section 6: Old Village Extension',
];

// Generates a demographic-accurate voter roll for a booth
export function generateBoothVoterRoll(
  acNo: number,
  boothNo: number,
  boothName: string,
  mandalName: string,
  targetCount: number = 850
): BoothVoterRollSummary {
  const electors: ElectorRecord[] = [];
  const total = Math.max(450, Math.min(1400, targetCount));

  // Determine household structures
  let currentSl = 1;
  let houseIdx = 1;
  const surnames = getRegionSurnames(acNo);

  while (currentSl <= total) {
    const houseSeed = acNo * 100003 + boothNo * 1009 + houseIdx * 73;
    const surnameIdx = Math.floor(pseudoHash(houseSeed + 1) * surnames.length);
    const surname = surnames[surnameIdx];
    const sectionIdx = Math.floor(pseudoHash(houseSeed + 2) * SECTIONS.length);
    const section = SECTIONS[sectionIdx];

    const wardNo = Math.floor(houseIdx / 45) + 1;
    const doorNumber = `${wardNo}-${(houseIdx % 90) + 1}${pseudoHash(houseSeed + 3) > 0.75 ? '/A' : ''}`;

    // Family size: 2 to 5 voters per household
    const familySize = Math.min(
      total - currentSl + 1,
      Math.floor(pseudoHash(houseSeed + 4) * 4) + 2
    );

    // Head of household (Male, 45-72)
    const headAge = 44 + Math.floor(pseudoHash(houseSeed + 5) * 26);
    const headMaleName = MALE_FIRST_NAMES[Math.floor(pseudoHash(houseSeed + 6) * MALE_FIRST_NAMES.length)];
    const headFatherName = MALE_FIRST_NAMES[Math.floor(pseudoHash(houseSeed + 7) * MALE_FIRST_NAMES.length)];

    const headEpicNum = 1000000 + Math.floor(pseudoHash(houseSeed + 8) * 8999999);
    const headEpic = `ZTK${headEpicNum}`;

    const headTriageRoll = pseudoHash(houseSeed + 9);
    const headTriage: 'committed' | 'swing' | 'lean_opp' | 'neutral' =
      headTriageRoll < 0.35 ? 'committed' : headTriageRoll < 0.65 ? 'swing' : headTriageRoll < 0.85 ? 'lean_opp' : 'neutral';

    electors.push({
      slNo: currentSl,
      epic: headEpic,
      name: `${surname} ${headMaleName}`,
      relativeName: `${surname} ${headFatherName}`,
      relationType: 'F',
      houseNo: doorNumber,
      age: headAge,
      gender: 'M',
      section,
      pannaPage: Math.ceil(currentSl / 50),
      triageTag: headTriage,
    });
    currentSl++;

    // Spouse (Female, headAge - 5 to + 1)
    if (familySize >= 2 && currentSl <= total) {
      const spouseAge = Math.max(18, headAge - Math.floor(pseudoHash(houseSeed + 10) * 6) - 1);
      const spouseName = FEMALE_FIRST_NAMES[Math.floor(pseudoHash(houseSeed + 11) * FEMALE_FIRST_NAMES.length)];
      const spouseEpicNum = 1000000 + Math.floor(pseudoHash(houseSeed + 12) * 8999999);
      const spouseEpic = `ZTK${spouseEpicNum}`;

      electors.push({
        slNo: currentSl,
        epic: spouseEpic,
        name: `${surname} ${spouseName}`,
        relativeName: `${surname} ${headMaleName}`,
        relationType: 'H',
        houseNo: doorNumber,
        age: spouseAge,
        gender: 'F',
        section,
        pannaPage: Math.ceil(currentSl / 50),
        triageTag: headTriage, // Families tend to lean together
      });
      currentSl++;
    }

    // Children / Young Adults in the household
    for (let c = 3; c <= familySize; c++) {
      if (currentSl > total) break;
      const childSeed = houseSeed + c * 31;
      const isMaleChild = pseudoHash(childSeed + 1) > 0.48;
      const childAge = Math.max(18, Math.min(38, headAge - 20 - Math.floor(pseudoHash(childSeed + 2) * 8)));
      const childName = isMaleChild
        ? MALE_FIRST_NAMES[Math.floor(pseudoHash(childSeed + 3) * MALE_FIRST_NAMES.length)]
        : FEMALE_FIRST_NAMES[Math.floor(pseudoHash(childSeed + 4) * FEMALE_FIRST_NAMES.length)];
      const childEpicNum = 1000000 + Math.floor(pseudoHash(childSeed + 5) * 8999999);
      const childEpic = `ZTK${childEpicNum}`;

      // Young voters can be swing
      const childTriageRoll = pseudoHash(childSeed + 6);
      const childTriage: 'committed' | 'swing' | 'lean_opp' | 'neutral' =
        childAge <= 25 && childTriageRoll > 0.5 ? 'swing' : headTriage;

      electors.push({
        slNo: currentSl,
        epic: childEpic,
        name: `${surname} ${childName}`,
        relativeName: `${surname} ${headMaleName}`,
        relationType: 'F',
        houseNo: doorNumber,
        age: childAge,
        gender: isMaleChild ? 'M' : 'F',
        section,
        pannaPage: Math.ceil(currentSl / 50),
        triageTag: childTriage,
      });
      currentSl++;
    }

    houseIdx++;
  }

  // Calculate demographics
  let maleCount = 0;
  let femaleCount = 0;
  let tgCount = 0;
  let firstTimeCount = 0;
  let youngCount = 0;
  let middleCount = 0;
  let seniorCount = 0;

  for (const e of electors) {
    if (e.gender === 'M') maleCount++;
    else if (e.gender === 'F') femaleCount++;
    else tgCount++;

    if (e.age <= 25) firstTimeCount++;
    else if (e.age <= 40) youngCount++;
    else if (e.age <= 60) middleCount++;
    else seniorCount++;
  }

  const uniqueHouses = new Set(electors.map((e) => e.houseNo)).size;
  const totalPages = Math.ceil(electors.length / 50);

  return {
    acNo,
    boothNo,
    boothName,
    mandalName,
    totalElectors: electors.length,
    maleCount,
    femaleCount,
    tgCount,
    firstTimeCount,
    youngCount,
    middleCount,
    seniorCount,
    householdCount: uniqueHouses,
    totalPages,
    electors,
  };
}

// In-memory cache for ultra-fast instant booth inspection
const boothRollCache = new Map<string, BoothVoterRollSummary>();

// Loads voter rolls: checks in-memory cache first, checks authentic JSON, falls back to deterministic generator
export async function fetchBoothVoters(
  acNo: number,
  boothNo: number,
  boothName: string,
  mandalName: string,
  electorateCount: number = 850,
  forceReload: boolean = false
): Promise<BoothVoterRollSummary> {
  const cacheKey = `${acNo}_${boothNo}`;
  if (forceReload) {
    boothRollCache.delete(cacheKey);
  } else if (boothRollCache.has(cacheKey)) {
    return boothRollCache.get(cacheKey)!;
  }

  // 1. Check if authentic extracted voter file exists
  try {
    const voterFileRes = await fetch(`/data/voters/ac_${acNo}/booth_${boothNo}.json?v=${Date.now()}`);
    if (voterFileRes.ok) {
      const contentType = voterFileRes.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await voterFileRes.json();
        if (data && Array.isArray(data.electors) && data.electors.length > 0) {
          data.isAuthenticExtract = true;
          boothRollCache.set(cacheKey, data);
          return data;
        }
      }
    }
  } catch {
    // fallback
  }

  // 2. Generates calibrated demographic, household & caste profile in sub-millisecond
  const roll = generateBoothVoterRoll(acNo, boothNo, boothName, mandalName, electorateCount);
  boothRollCache.set(cacheKey, roll);
  return roll;
}

