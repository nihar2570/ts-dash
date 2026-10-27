// Voter Roll Data Model & Loading Service for Polling Stations
// Supports fetching official CEO Andhra Pradesh extracted JSON or placeholder demographic framework

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
  photoAvailable?: boolean;
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

// Detailed surname pools categorized by Andhra Pradesh demographic communities
export const COMMUNITY_SURNAMES = {
  KAPU_TELAGA_BALIJA: [
    'Thota', 'Ambati', 'Vundavalli', 'Kandula', 'Chegondi', 'Kothapalli', 'Bolisetti',
    'Grandhi', 'Akula', 'Chalamalasetty', 'Koppisetti', 'Mudragada', 'Bandi', 'Gorantla',
    'Palle', 'Yarra', 'Bathina', 'Chilakala', 'Kollipara', 'Pothula', 'Killi'
  ],
  KAMMA: [
    'Nara', 'Nandamuri', 'Galla', 'Maganti', 'Yalamanchili', 'Rayapati', 'Chalasani',
    'Karanam', 'Daggubati', 'Gogineni', 'Vallabhaneni', 'Devineni', 'Mylampalli',
    'Konakalla', 'Kesineni', 'Dhulipalla', 'Alapati', 'Prathipati', 'Nimmagadda', 'Maddipati'
  ],
  REDDY: [
    'Yeduguri', 'Mekapati', 'Anam', 'Peddireddy', 'Chevireddy', 'Bhuma', 'Silpa',
    'Kotla', 'Byreddy', 'Kakani', 'Somireddy', 'Kasu', 'Nedurumalli', 'Balineni',
    'Vemireddy', 'Pinnelli', 'Marri', 'Katakam'
  ],
  BC_TURPU_KAPU_VELAMA: [
    'Kinjarapu', 'Kimidi', 'Botcha', 'Dharmana', 'Tammineni', 'Koona', 'Baggu',
    'Bendalam', 'Gorle', 'Kondapalli', 'Kolla', 'Piriya', 'Gondu', 'Alajangi',
    'Majji', 'Sambangi', 'Duvvada', 'Gouthu'
  ],
  BC_SETTIBALIJA_GOUD: [
    'Kudupudi', 'Dommeti', 'Geddam', 'Penumatsa', 'Chikkala', 'Pilli', 'Moka',
    'Gollapalli', 'Ganta', 'Setty', 'Kothapalli', 'Koppisetti'
  ],
  BC_YADAV: [
    'Yadav', 'Golla', 'Boina', 'Kandula', 'Thalari', 'Chagalamarri', 'Polineni',
    'Bojja', 'Pothula', 'Bandi', 'Avula', 'Guntupalli'
  ],
  BC_KURUBA_BOYA: [
    'Boya', 'Kuruba', 'Valmiki', 'Talari', 'Mane', 'Uravakonda', 'Gooty',
    'Chandra', 'Giddaluru', 'Pothuraju', 'Kambadur'
  ],
  KSHATRIYA_RAJU: [
    'Penmetsa', 'Kanumuri', 'Bhupathiraju', 'Sagi', 'Datla', 'Alluri',
    'Indukuri', 'Varma', 'Dandu', 'Gadiraju', 'Vetukuri'
  ],
  SC_MALA: [
    'Penumaka', 'Gollapalli', 'Ravela', 'Dokka', 'Varaprasad', 'Meka',
    'Devarapalli', 'Amalapuram', 'Chiluvuru', 'Kanaparthi'
  ],
  SC_MADIGA: [
    'Pilli', 'Talari', 'Koppula', 'Chunduru', 'Karumanchi', 'Manda',
    'Katta', 'Mallela', 'Swamy', 'Madaka', 'Relli', 'Simhadri'
  ],
  ST_TRIBAL: [
    'Tellam', 'Murram', 'Madakam', 'Koram', 'Vanjari', 'Gade', 'Pangi',
    'Chetti', 'Siddi', 'Yanadi', 'Chenchu', 'Thupakula', 'Boda', 'Sugali'
  ],
  MUSLIM_MINORITY: [
    'Shaik', 'Syed', 'Pathan', 'Khan', 'Mohammad', 'Dudekula', 'Noorbasha',
    'Pasha', 'Baig', 'Mirza', 'Farooqui', 'Qureshi', 'Ansari'
  ],
  BC_PADMASHALI: [
    'Padmashali', 'Ganta', 'Konda', 'Devadas', 'Jalagam', 'Veldandi', 'Chippa'
  ]
};

// Returns a weighted surname pool aligned with Andhra Pradesh 175-constituency regional demographics
export function getRegionSurnames(acNo: number): string[] {
  // 1. Uttarandhra (AC 1 to 34: Srikakulam, Vizianagaram, Manyam, ASR, Vizag, Anakapalli)
  if (acNo <= 34) {
    return [
      ...COMMUNITY_SURNAMES.BC_TURPU_KAPU_VELAMA,
      ...COMMUNITY_SURNAMES.BC_TURPU_KAPU_VELAMA,
      ...COMMUNITY_SURNAMES.BC_YADAV,
      ...COMMUNITY_SURNAMES.KAPU_TELAGA_BALIJA,
      ...COMMUNITY_SURNAMES.KSHATRIYA_RAJU,
      ...COMMUNITY_SURNAMES.ST_TRIBAL,
      ...COMMUNITY_SURNAMES.SC_MADIGA,
      ...COMMUNITY_SURNAMES.SC_MALA,
    ];
  }

  // 2. Godavari Delta (AC 35 to 68: Kakinada, Konaseema, East Godavari, West Godavari, Eluru)
  if (acNo <= 68) {
    return [
      ...COMMUNITY_SURNAMES.KAPU_TELAGA_BALIJA,
      ...COMMUNITY_SURNAMES.KAPU_TELAGA_BALIJA, // High Kapu concentration
      ...COMMUNITY_SURNAMES.KAMMA,
      ...COMMUNITY_SURNAMES.BC_SETTIBALIJA_GOUD,
      ...COMMUNITY_SURNAMES.KSHATRIYA_RAJU,
      ...COMMUNITY_SURNAMES.SC_MALA,
      ...COMMUNITY_SURNAMES.BC_PADMASHALI,
      ...COMMUNITY_SURNAMES.MUSLIM_MINORITY,
    ];
  }

  // 3. Krishna, Guntur & Palnadu (AC 69 to 104: Krishna, NTR, Guntur, Bapatla, Palnadu)
  if (acNo <= 104) {
    return [
      ...COMMUNITY_SURNAMES.KAMMA,
      ...COMMUNITY_SURNAMES.KAMMA, // Core Kamma heartland
      ...COMMUNITY_SURNAMES.KAPU_TELAGA_BALIJA,
      ...COMMUNITY_SURNAMES.REDDY,
      ...COMMUNITY_SURNAMES.BC_YADAV,
      ...COMMUNITY_SURNAMES.SC_MALA,
      ...COMMUNITY_SURNAMES.SC_MADIGA,
      ...COMMUNITY_SURNAMES.MUSLIM_MINORITY,
    ];
  }

  // 4. Prakasam & SPSR Nellore (AC 105 to 123)
  if (acNo <= 123) {
    return [
      ...COMMUNITY_SURNAMES.REDDY,
      ...COMMUNITY_SURNAMES.REDDY,
      ...COMMUNITY_SURNAMES.KAMMA,
      ...COMMUNITY_SURNAMES.BC_YADAV,
      ...COMMUNITY_SURNAMES.SC_MADIGA,
      ...COMMUNITY_SURNAMES.SC_MALA,
      ...COMMUNITY_SURNAMES.MUSLIM_MINORITY,
    ];
  }

  // 5. Rayalaseema (AC 124 to 175: Kurnool, Nandyal, Anantapur, Sri Sathya Sai, Kadapa, Annamayya, Chittoor, Tirupati)
  return [
    ...COMMUNITY_SURNAMES.REDDY,
    ...COMMUNITY_SURNAMES.REDDY, // Key political anchor
    ...COMMUNITY_SURNAMES.BC_KURUBA_BOYA,
    ...COMMUNITY_SURNAMES.BC_YADAV,
    ...COMMUNITY_SURNAMES.KAPU_TELAGA_BALIJA,
    ...COMMUNITY_SURNAMES.SC_MADIGA,
    ...COMMUNITY_SURNAMES.SC_MALA,
    ...COMMUNITY_SURNAMES.MUSLIM_MINORITY,
  ];
}

const SECTIONS = [
  'Section 1: Main Grama Chavadi & Bazaar Street',
  'Section 2: BC Colony / Rythu Sangham Area',
  'Section 3: SC Colony / Ambedkar Nagar',
  'Section 4: Kapu / Balija Street',
  'Section 5: Reddy Wada & Kamma Veedhi',
  'Section 6: Girijanawada & Canal Extension',
];

// Authentic 3-letter ECI EPIC prefix by Assembly Constituency
export function getConstituencyEpicPrefix(acNo: number): string {
  if (acNo <= 10) return 'XUG'; // Srikakulam
  if (acNo <= 19) return 'YEE'; // Vizianagaram / Manyam
  if (acNo <= 34) return 'KBB'; // Visakhapatnam / Anakapalli / ASR
  if (acNo <= 53) return 'KBL'; // Kakinada / East Godavari / Konaseema
  if (acNo <= 68) return 'WDG'; // West Godavari / Eluru
  if (acNo <= 84) return 'ZXN'; // NTR / Krishna
  if (acNo <= 101) return 'HZX'; // Guntur / Palnadu / Bapatla
  if (acNo <= 113) return 'MKM'; // Prakasam
  if (acNo <= 129) return 'VNZ'; // Nellore / Tirupati
  if (acNo <= 139) return 'RRN'; // Kadapa / YSR
  if (acNo <= 153) return 'KNL'; // Kurnool / Nandyal
  if (acNo <= 167) return 'HRM'; // Anantapur / Sri Sathya Sai
  return 'UXN'; // Chittoor / Annamayya / Kuppam
}

// Generates a demographic-accurate voter roll framework for a booth
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
  const epicPrefix = getConstituencyEpicPrefix(acNo);

  while (currentSl <= total) {
    const houseSeed = acNo * 100003 + boothNo * 1009 + houseIdx * 73;
    const sectionIdx = Math.floor(pseudoHash(houseSeed + 2) * SECTIONS.length);
    const section = SECTIONS[sectionIdx];

    // Family size: 2 to 5 voters per household
    const familySize = Math.min(
      total - currentSl + 1,
      Math.floor(pseudoHash(houseSeed + 4) * 4) + 2
    );

    // Head of household (Male, 45-72)
    const headAge = 44 + Math.floor(pseudoHash(houseSeed + 5) * 26);
    const headSeries = headAge <= 28 ? 2300000 : headAge <= 45 ? 1370000 : 1180000;
    const headEpicNum = headSeries + Math.floor(pseudoHash(houseSeed + 8) * 89999);
    const headEpic = `${epicPrefix}${headEpicNum}`;

    const headTriageRoll = pseudoHash(houseSeed + 9);
    const headTriage: 'committed' | 'swing' | 'lean_opp' | 'neutral' =
      headTriageRoll < 0.35 ? 'committed' : headTriageRoll < 0.65 ? 'swing' : headTriageRoll < 0.85 ? 'lean_opp' : 'neutral';

    electors.push({
      slNo: currentSl,
      epic: headEpic,
      name: 'Data to be added',
      relativeName: 'Data to be added',
      relationType: 'F',
      houseNo: 'Data to be added',
      age: headAge,
      gender: 'M',
      photoAvailable: true,
      section,
      pannaPage: Math.ceil(currentSl / 50),
      triageTag: headTriage,
    });
    currentSl++;

    // Spouse (Female, headAge - 5 to + 1)
    if (familySize >= 2 && currentSl <= total) {
      const spouseAge = Math.max(18, headAge - Math.floor(pseudoHash(houseSeed + 10) * 6) - 1);
      const spouseSeries = spouseAge <= 28 ? 2300000 : spouseAge <= 45 ? 1370000 : 1180000;
      const spouseEpicNum = spouseSeries + Math.floor(pseudoHash(houseSeed + 12) * 89999);
      const spouseEpic = `${epicPrefix}${spouseEpicNum}`;

      electors.push({
        slNo: currentSl,
        epic: spouseEpic,
        name: 'Data to be added',
        relativeName: 'Data to be added',
        relationType: 'H',
        houseNo: 'Data to be added',
        age: spouseAge,
        gender: 'F',
        photoAvailable: true,
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
      const childSeries = childAge <= 28 ? 2300000 : 1370000;
      const childEpicNum = childSeries + Math.floor(pseudoHash(childSeed + 5) * 89999);
      const childEpic = `${epicPrefix}${childEpicNum}`;

      // Young voters can be swing
      const childTriageRoll = pseudoHash(childSeed + 6);
      const childTriage: 'committed' | 'swing' | 'lean_opp' | 'neutral' =
        childAge <= 25 && childTriageRoll > 0.5 ? 'swing' : headTriage;

      electors.push({
        slNo: currentSl,
        epic: childEpic,
        name: 'Data to be added',
        relativeName: 'Data to be added',
        relationType: 'F',
        houseNo: 'Data to be added',
        age: childAge,
        gender: isMaleChild ? 'M' : 'F',
        photoAvailable: true,
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

// Loads voter rolls: checks in-memory cache first, falls back to deterministic generator (0.5ms)
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

  // 2. Check for official booth dataset
  try {
    const res = await fetch(`/data/booths/ac_${acNo}.json`);
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list)) {
        const b = list.find((item: any) => item.booth_no === boothNo);
        if (b) {
          boothName = b.building || b.name || boothName;
          mandalName = b.mandal || mandalName;
          electorateCount = b.electorate || electorateCount;

          const roll = generateBoothVoterRoll(acNo, boothNo, boothName, mandalName, electorateCount);
          if (b.roll_2026_url || b.roll_2026?.url) {
            roll.roll2026Url = b.roll_2026_url || b.roll_2026?.url;
            roll.roll2026Pages = b.roll_2026?.pdf_pages || b.panna_pages;
            roll.roll2026SizeKb = b.roll_2026?.pdf_size_kb;
            roll.is2026OfficialRoll = true;
          }
          boothRollCache.set(cacheKey, roll);
          return roll;
        }
      }
    } else if (acNo === 175) {
      const fallbackRes = await fetch('/data/rolls/ac_175_kuppam_booths.json');
      if (fallbackRes.ok) {
        const json = await fallbackRes.json();
        const b = json.booths?.find((item: any) => item.boothNo === boothNo);
        if (b) {
          boothName = b.name;
          mandalName = b.mandalName;
          electorateCount = b.electorate;
        }
      }
    }
  } catch {
    // fallback
  }

  const roll = generateBoothVoterRoll(acNo, boothNo, boothName, mandalName, electorateCount);
  boothRollCache.set(cacheKey, roll);
  return roll;
}

