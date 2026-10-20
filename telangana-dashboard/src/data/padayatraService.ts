// 1-Click MLA Padayatra Route Planner & Household Talking Points Engine
// Integrates Voter Rolls + Bayesian Caste Classifier + SEEEPC Vol-4 + AC Local Pulse

import type { ElectorRecord } from './voterRollService';
import { predictHouseholdCaste, type CastePrediction } from './casteClassifierService';
import { CONSTITUENCY_TOPICS } from './constituencyTopics';

export interface PadayatraVoter {
  slNo: number;
  epic: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'TG' | 'O';
  isFirstTimeYouth: boolean;
  isSenior: boolean;
  triageTag: 'committed' | 'swing' | 'lean_opp' | 'neutral';
}

export interface PadayatraTalkingPoints {
  openingGreeting: string;
  communityPitch: {
    heading: string;
    points: string[];
    schemeName: string;
  };
  demographicPitch: {
    heading: string;
    points: string[];
  };
  hyperLocalIssue: {
    concern: string;
    pledge: string;
  };
  quickElevatorPitch: string;
}

export interface PadayatraHouseStop {
  stopNumber: number;
  boothNo: number;
  doorNumber: string;
  section: string;
  voterCount: number;
  headOfHouse: string;
  householdCaste: CastePrediction;
  voters: PadayatraVoter[];
  hasYouth: boolean;
  hasSenior: boolean;
  hasWomen: boolean;
  persuadability: 'High Persuadable' | 'Lean Support' | 'Base Fortress' | 'Challenger Lean';
  impactScore: number;
  talkingPoints: PadayatraTalkingPoints;
}

// Generates customized talking points based on caste, age cohorts, and AC issues
export function generateHouseholdTalkingPoints(
  acNo: number,
  acName: string,
  headName: string,
  castePred: CastePrediction,
  voters: PadayatraVoter[]
): PadayatraTalkingPoints {
  const hasYouth = voters.some((v) => v.isFirstTimeYouth);
  const hasSenior = voters.some((v) => v.isSenior);
  const hasWomen = voters.some((v) => v.gender === 'F');

  const topicData = CONSTITUENCY_TOPICS[acNo];
  const primaryIssue = topicData?.key_issues?.[0];
  const localConcern = topicData?.primary_concern || 'Local infrastructure & civic amenities';

  // 1. Opening Greeting
  const openingGreeting = `Namaskaram ${headName} garu! As your local representative, I am walking through your colony to personally connect with your family.`;

  // 2. Layer 1: Caste & Community Welfare Pitch
  let communityPitch = {
    heading: 'Community Welfare & Empowerment',
    points: [
      'Comprehensive Rythu Bharosa input assistance and timely crop insurance coverage.',
      'Transparent doorstep welfare delivery without any middleman cuts or delays.'
    ],
    schemeName: 'Rythu Bharosa & Social Guarantees'
  };

  const cat = castePred.category;
  const caste = castePred.casteName.toLowerCase();

  if (cat === 'SC') {
    communityPitch = {
      heading: `Dalit Empowerment (${castePred.casteName})`,
      points: [
        'Unconditional Dalit Bandhu financial grant acceleration with single-window sanction.',
        'Dr. B.R. Ambedkar Overseas Education Vidya Nidhi scholarships for higher studies.',
        'Gruha Jyothi free power up to 200 units and 3-acre cultivable land regularization.'
      ],
      schemeName: 'Ambedkar Vidya Nidhi & Gruha Jyothi'
    };
  } else if (cat === 'ST') {
    communityPitch = {
      heading: `Girijan & Tribal Rights (${castePred.casteName})`,
      points: [
        'Immediate settlement of Podu land title deeds (RoFR pattas) with zero harassment.',
        'Special tribal youth skill mission and dedicated ITDA hospital upgrade funding.',
        '10% ST reservation operationalization and free solar agricultural pump sets.'
      ],
      schemeName: 'Podu Land Pattas & Girijan Bandhu'
    };
  } else if (cat === 'BC') {
    if (caste.includes('goud')) {
      communityPitch = {
        heading: 'Goud Community & Toddy Tappers Support',
        points: [
          'Ex-gratia insurance enhancement for tappers and safety climbing gear subsidies.',
          'Neera cafe expansion and waiver of tree tax arrears statewide.',
          'BC Corporation interest-free subsidized enterprise loans up to ₹5 Lakhs.'
        ],
        schemeName: 'Neera & Tappers Welfare Fund'
      };
    } else if (caste.includes('mudiraj')) {
      communityPitch = {
        heading: 'Mudiraj Welfare & Inland Fisheries Support',
        points: [
          'Exclusive fishing rights in local reservoir tanks for Mudiraj cooperative societies.',
          'Subsidized refrigerated transport mopeds and solar fish-drying facilities.',
          'Permanent inclusion in BC-A category representation committee.'
        ],
        schemeName: 'Mudiraj Fisheries & Cooperative Fund'
      };
    } else if (caste.includes('padmashali')) {
      communityPitch = {
        heading: 'Padmashali & Handloom Weavers Security',
        points: [
          'Netanna Bima life insurance coverage and 50% power tariff concession for looms.',
          'Guaranteed yarn subsidy and government bulk procurement of school uniform weaves.',
          'Cheetha Hastha zero-interest working capital loans for master weavers.'
        ],
        schemeName: 'Netanna Bima & Handloom Relief'
      };
    } else if (caste.includes('munnuru') || caste.includes('kapu')) {
      communityPitch = {
        heading: 'Agrarian & Munnuru Kapu Economic Growth',
        points: [
          '₹2 Lakh complete agricultural crop loan waiver in a single disbursement.',
          'Comprehensive MSP procurement guarantee for chillies, cotton, and paddy.',
          'Munnuru Kapu community bhavan sanction and professional education loans.'
        ],
        schemeName: 'Crop Loan Waiver & Rythu Bharosa'
      };
    } else if (caste.includes('yadav') || caste.includes('kuruma')) {
      communityPitch = {
        heading: 'Yadav & Kuruma Livestock Security',
        points: [
          'Subsidized sheep rearing distribution units with direct bank benefit transfer.',
          'Mobile veterinary clinics at village doorsteps and free green fodder seeds.',
          'Golla Kuruma community economic federation credit lines.'
        ],
        schemeName: 'Sheep Rearing & Dairy Incentive'
      };
    } else {
      communityPitch = {
        heading: `Backward Classes Development (${castePred.casteName})`,
        points: [
          'Dedicated BC sub-plan budget allocation matching exact population census share.',
          'Mahatma Jyotirao Phule residential overseas fellowship and free college hostel beds.',
          'Subsidized modern toolkits and micro-finance for artisanal trades.'
        ],
        schemeName: 'Phule BC Welfare Mission'
      };
    }
  } else if (cat === 'Minority') {
    communityPitch = {
      heading: 'Minority Welfare & Upliftment',
      points: [
        'Shaadi Mubarak ₹1,00,116 financial support without procedural delays.',
        'TMREIS minority residential schools infrastructure boost and coaching centres.',
        'Imam and Mouzan monthly honorarium increase and Wakf property protection.'
      ],
      schemeName: 'Shaadi Mubarak & TMREIS Mission'
    };
  } else {
    // OC Communities (Reddy, Velama, Others)
    communityPitch = {
      heading: 'Agrarian Stability & Rural Enterprise',
      points: [
        '₹15,000/acre Rythu Bharosa financial aid covering tenant farmers.',
        'Continuous 24x7 agricultural power supply and completed canal distributaries.',
        'Full fee reimbursement and corporate hospital Arogyasri coverage up to ₹10 Lakhs.'
      ],
      schemeName: 'Rythu Bharosa & Arogyasri Expansion'
    };
  }

  // 3. Layer 2: Demographic / Age Cohort Pitch
  const demoPoints: string[] = [];
  if (hasYouth) {
    demoPoints.push('TSPSC annual job calendar guarantee with strict paper leak prevention.');
    demoPoints.push('Rajiv Yuva Kiranalu skill centers and subsidized IT enterprise startup kits.');
  }
  if (hasWomen) {
    demoPoints.push('Mahalakshmi ₹2,500/month financial aid and ₹500 subsidized gas cylinders.');
    demoPoints.push('Zero-fare free travel in TSRTC Palle Velugu & Express buses statewide.');
  }
  if (hasSenior) {
    demoPoints.push('Cheyutha monthly social security pension enhancement to ₹4,000/month.');
    demoPoints.push('Free doorstep prescription medicine delivery for chronic elderly illnesses.');
  }
  if (demoPoints.length === 0) {
    demoPoints.push('24x7 uninterrupted power and doorstep civic governance services.');
  }

  const demographicPitch = {
    heading: 'Family & Generational Commitments',
    points: demoPoints
  };

  // 4. Layer 3: Hyper-Local AC Issue
  const hyperLocalIssue = {
    concern: localConcern,
    pledge: primaryIssue
      ? `${primaryIssue.title}: ${primaryIssue.description}`
      : `Immediate resolution of drinking water pipelines and underground drainage works in ${acName}.`
  };

  // 5. Quick Elevator Pitch (10-second summary)
  const quickElevatorPitch = `${communityPitch.schemeName} support for your household, ${
    hasYouth ? 'TSPSC job calendar for your children, ' : ''
  }${hasWomen ? 'Mahalakshmi gas & bus savings, ' : ''}and resolving ${localConcern.toLowerCase()} in ${acName}.`;

  return {
    openingGreeting,
    communityPitch,
    demographicPitch,
    hyperLocalIssue,
    quickElevatorPitch,
  };
}

// Generates the sequenced Padayatra route for a booth
export function planPadayatraRoute(
  acNo: number,
  acName: string,
  boothNo: number,
  electors: ElectorRecord[],
  mode: 'strategic_swing' | 'sequential_street' = 'strategic_swing',
  dominantCaste?: string
): PadayatraHouseStop[] {
  // Group electors by house number
  const houseMap = new Map<string, ElectorRecord[]>();
  for (const elector of electors) {
    const key = elector.houseNo.trim() || 'General';
    if (!houseMap.has(key)) {
      houseMap.set(key, []);
    }
    houseMap.get(key)!.push(elector);
  }

  const stops: PadayatraHouseStop[] = [];

  for (const [doorNumber, members] of houseMap.entries()) {
    // Determine head of house (oldest male, or oldest female)
    const sortedMembers = [...members].sort((a, b) => b.age - a.age);
    const head = sortedMembers.find((m) => m.gender === 'M') || sortedMembers[0];
    const headName = head ? head.name : 'Resident';

    // Household caste consensus
    const householdCaste = predictHouseholdCaste(members, dominantCaste);

    // Padayatra voters
    const padayatraVoters: PadayatraVoter[] = members.map((m) => ({
      slNo: m.slNo,
      epic: m.epic,
      name: m.name,
      age: m.age,
      gender: m.gender,
      isFirstTimeYouth: m.age >= 18 && m.age <= 25,
      isSenior: m.age >= 60,
      triageTag: m.triageTag || 'neutral',
    }));

    const hasYouth = padayatraVoters.some((v) => v.isFirstTimeYouth);
    const hasSenior = padayatraVoters.some((v) => v.isSenior);
    const hasWomen = padayatraVoters.some((v) => v.gender === 'F');

    // Persuadability analysis
    const swingCount = padayatraVoters.filter((v) => v.triageTag === 'swing' || v.triageTag === 'neutral').length;
    const committedCount = padayatraVoters.filter((v) => v.triageTag === 'committed').length;
    const leanOppCount = padayatraVoters.filter((v) => v.triageTag === 'lean_opp').length;

    let persuadability: PadayatraHouseStop['persuadability'] = 'High Persuadable';
    if (swingCount >= 2) persuadability = 'High Persuadable';
    else if (committedCount > leanOppCount) persuadability = 'Base Fortress';
    else if (leanOppCount > committedCount) persuadability = 'Challenger Lean';
    else persuadability = 'Lean Support';

    // Strategic Impact Score (0 - 100)
    // Higher score = visit earlier in strategic mode
    let impactScore = members.length * 15; // +15 per voter in house
    if (persuadability === 'High Persuadable') impactScore += 40;
    else if (persuadability === 'Lean Support') impactScore += 25;
    else if (persuadability === 'Challenger Lean') impactScore += 15;
    else impactScore += 10;

    if (hasYouth) impactScore += 10;
    if (hasWomen) impactScore += 5;

    const talkingPoints = generateHouseholdTalkingPoints(
      acNo,
      acName,
      headName,
      householdCaste,
      padayatraVoters
    );

    stops.push({
      stopNumber: 0, // Assigned after sorting
      boothNo,
      doorNumber,
      section: head?.section || 'Main Grama Basti',
      voterCount: members.length,
      headOfHouse: headName,
      householdCaste,
      voters: padayatraVoters,
      hasYouth,
      hasSenior,
      hasWomen,
      persuadability,
      impactScore,
      talkingPoints,
    });
  }

  // Sort stops based on selected mode
  if (mode === 'strategic_swing') {
    // Sort descending by impact score
    stops.sort((a, b) => b.impactScore - a.impactScore);
  } else {
    // Sequential door number sorting (e.g. 1-1, 1-2, 1-10, 2-1...)
    stops.sort((a, b) => {
      const partsA = a.doorNumber.split(/[-/]/).map((p) => parseInt(p, 10) || 0);
      const partsB = b.doorNumber.split(/[-/]/).map((p) => parseInt(p, 10) || 0);
      if (partsA[0] !== partsB[0]) return partsA[0] - partsB[0];
      return (partsA[1] || 0) - (partsB[1] || 0);
    });
  }

  // Assign sequential stop numbers
  stops.forEach((stop, index) => {
    stop.stopNumber = index + 1;
  });

  return stops;
}
