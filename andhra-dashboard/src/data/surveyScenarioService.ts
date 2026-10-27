// Survey Scenario Service for Andhra Pradesh Political Simulations
// Manages realistic caste-based surveys from various agencies/groups

import type { PartySwing } from '../components/SwingStudioModal';

export interface CasteSurveyCommunityPref {
  TDP: number;
  JSP: number;
  YSRCP: number;
  INC?: number;
  OTH?: number;
}

export interface CasteSurveyDataset {
  id: string;
  title: string;
  shortTitle: string;
  agency: string;
  leadAnalyst: string;
  conductedDate: string;
  sampleSize: number;
  sampleDistribution?: {
    uttarandhra: number;
    kostaAndhra: number;
    rayalaseema: number;
  };
  marginOfError: string;
  methodology: string;
  executiveSummary: string;
  badgeColor: string;
  badgeIcon: string;
  keyCasteFindings: string[];
  regionalInsights: {
    uttarandhra: string;
    kostaAndhra: string;
    rayalaseema: string;
  };
  projectedTotals: {
    ndaVoteSharePct: number;
    ysrcpVoteSharePct: number;
    incVoteSharePct: number;
    othVoteSharePct: number;
    projectedSeatsNDA: number;
    projectedSeatsYSRCP: number;
    tossUpSeats: number;
  };
  castePreferences: Record<string, CasteSurveyCommunityPref>;
  casteSwings: Record<string, PartySwing>;
  isCustom?: boolean;
}

export interface SurveyCatalogItem {
  id: string;
  filename: string;
  title: string;
  shortTitle: string;
  agency: string;
  conductedDate: string;
  sampleSize: number;
  marginOfError: string;
  badgeColor: string;
  badgeIcon: string;
  projectedTotals: {
    ndaVoteSharePct: number;
    ysrcpVoteSharePct: number;
    projectedSeatsNDA: number;
    projectedSeatsYSRCP: number;
  };
  isCustom?: boolean;
}

export const BASELINE_2024_CASTE_SHARES: Record<string, CasteSurveyCommunityPref> = {
  kapu: { TDP: 36.0, JSP: 50.0, YSRCP: 12.0, INC: 1.0, OTH: 1.0 },
  kamma: { TDP: 85.0, JSP: 2.0, YSRCP: 11.0, INC: 1.0, OTH: 1.0 },
  reddy: { TDP: 17.0, JSP: 4.0, YSRCP: 75.0, INC: 3.0, OTH: 1.0 },
  bc_turpu_kapu: { TDP: 60.0, JSP: 5.0, YSRCP: 33.0, INC: 1.0, OTH: 1.0 },
  bc_yadava: { TDP: 55.0, JSP: 4.0, YSRCP: 39.0, INC: 1.0, OTH: 1.0 },
  bc_kuruba_boya: { TDP: 63.0, JSP: 3.0, YSRCP: 32.0, INC: 1.0, OTH: 1.0 },
  bc_settibalija_goud: { TDP: 53.0, JSP: 12.0, YSRCP: 33.0, INC: 1.0, OTH: 1.0 },
  bc_padmashali: { TDP: 55.0, JSP: 6.0, YSRCP: 36.0, INC: 2.0, OTH: 1.0 },
  bc_other: { TDP: 57.0, JSP: 5.0, YSRCP: 36.0, INC: 1.0, OTH: 1.0 },
  sc_madiga_relli: { TDP: 52.0, JSP: 3.0, YSRCP: 42.0, INC: 2.0, OTH: 1.0 },
  sc_mala: { TDP: 21.0, JSP: 3.0, YSRCP: 69.0, INC: 5.0, OTH: 2.0 },
  st_tribal: { TDP: 37.0, JSP: 5.0, YSRCP: 54.0, INC: 3.0, OTH: 1.0 },
  minority_muslim: { TDP: 24.0, JSP: 3.0, YSRCP: 65.0, INC: 6.0, OTH: 2.0 },
  minority_christian: { TDP: 17.0, JSP: 2.0, YSRCP: 74.0, INC: 5.0, OTH: 2.0 },
};

// Bundled Fallback Datasets (6 Pre-filled Realistic Agency Surveys)
export const BUNDLED_SURVEYS: Record<string, CasteSurveyDataset> = {
  survey_peoples_pulse_2026: {
    id: 'survey_peoples_pulse_2026',
    title: "Survey by People's Pulse",
    shortTitle: "People's Pulse 2026",
    agency: "People's Pulse Research Organization",
    leadAnalyst: "G. Murthy & Field Research Team",
    conductedDate: "February 2026",
    sampleSize: 54200,
    sampleDistribution: { uttarandhra: 10840, kostaAndhra: 24390, rayalaseema: 18970 },
    marginOfError: "± 1.8%",
    methodology: "Multistage Stratified Purposive Random Sampling across all 175 ACs with face-to-face CAPI surveys across 4 polling booths per mandal.",
    executiveSummary: "Ground caste tracker reveals rock-solid NDA coalition cohesion in Coastal Andhra and strong BC retention in Rayalaseema. Sub-categorization dividend among SC Madigas sustains NDA edge, offsetting minor rural welfare delivery friction.",
    badgeColor: "emerald",
    badgeIcon: "BarChart3",
    keyCasteFindings: [
      "Kapu-Balija-Telaga alliance consolidation remains resilient at 85% combined NDA preference under Pawan Kalyan's leadership.",
      "BC Kuruba/Boya in Rayalaseema and Turpu Kapu in Uttarandhra show over 58-62% loyalty to TDP.",
      "SC Madiga community leans 51% NDA following Supreme Court sub-categorization momentum, contrasting with SC Mala consolidation behind YSRCP (67%).",
      "Reddy bastion holds firm for YSRCP at 74% preference across Kadapa, Kurnool, and Palnadu."
    ],
    regionalInsights: {
      uttarandhra: "BC Turpu Kapu and Yadava blocs hold firmly with TDP-JSP; Srikakulam and Vizianagaram maintain 85%+ NDA sweep probability.",
      kostaAndhra: "Godavari delta Kapu-Kamma-Settibalija alliance intact. Aquaculture farmers voice moderate tariff discontent but vote intention remains allied.",
      rayalaseema: "Fierce factional fights in Kadapa and Kurnool; TDP Kuruba-Boya mobilization counters YSRCP Reddy consolidation."
    },
    projectedTotals: {
      ndaVoteSharePct: 53.8,
      ysrcpVoteSharePct: 41.2,
      incVoteSharePct: 2.8,
      othVoteSharePct: 2.2,
      projectedSeatsNDA: 154,
      projectedSeatsYSRCP: 21,
      tossUpSeats: 14
    },
    castePreferences: {
      kapu: { TDP: 36.0, JSP: 49.0, YSRCP: 13.0, INC: 1.0, OTH: 1.0 },
      kamma: { TDP: 84.0, JSP: 2.0, YSRCP: 12.0, INC: 1.0, OTH: 1.0 },
      reddy: { TDP: 17.0, JSP: 4.0, YSRCP: 74.0, INC: 4.0, OTH: 1.0 },
      bc_turpu_kapu: { TDP: 58.0, JSP: 6.0, YSRCP: 34.0, INC: 1.0, OTH: 1.0 },
      bc_yadava: { TDP: 53.0, JSP: 5.0, YSRCP: 40.0, INC: 1.0, OTH: 1.0 },
      bc_kuruba_boya: { TDP: 62.0, JSP: 3.0, YSRCP: 33.0, INC: 1.0, OTH: 1.0 },
      bc_settibalija_goud: { TDP: 52.0, JSP: 11.0, YSRCP: 35.0, INC: 1.0, OTH: 1.0 },
      bc_padmashali: { TDP: 54.0, JSP: 6.0, YSRCP: 37.0, INC: 2.0, OTH: 1.0 },
      bc_other: { TDP: 56.0, JSP: 5.0, YSRCP: 37.0, INC: 1.0, OTH: 1.0 },
      sc_madiga_relli: { TDP: 51.0, JSP: 3.0, YSRCP: 43.0, INC: 2.0, OTH: 1.0 },
      sc_mala: { TDP: 22.0, JSP: 3.0, YSRCP: 67.0, INC: 6.0, OTH: 2.0 },
      st_tribal: { TDP: 36.0, JSP: 6.0, YSRCP: 54.0, INC: 3.0, OTH: 1.0 },
      minority_muslim: { TDP: 25.0, JSP: 3.0, YSRCP: 64.0, INC: 6.0, OTH: 2.0 },
      minority_christian: { TDP: 18.0, JSP: 2.0, YSRCP: 73.0, INC: 5.0, OTH: 2.0 }
    },
    casteSwings: {
      kapu: { TDP: 0.0, YSRCP: 1.0, JSP: -1.0 },
      kamma: { TDP: -1.0, YSRCP: 1.0, JSP: 0.0 },
      reddy: { TDP: 0.0, YSRCP: -1.0, JSP: 0.0 },
      bc_turpu_kapu: { TDP: -2.0, YSRCP: 1.0, JSP: 1.0 },
      bc_yadava: { TDP: -2.0, YSRCP: 1.0, JSP: 1.0 },
      bc_kuruba_boya: { TDP: -1.0, YSRCP: 1.0, JSP: 0.0 },
      bc_settibalija_goud: { TDP: -1.0, YSRCP: 2.0, JSP: -1.0 },
      bc_padmashali: { TDP: -1.0, YSRCP: 1.0, JSP: 0.0 },
      bc_other: { TDP: -1.0, YSRCP: 1.0, JSP: 0.0 },
      sc_madiga_relli: { TDP: -1.0, YSRCP: 1.0, JSP: 0.0 },
      sc_mala: { TDP: 1.0, YSRCP: -2.0, JSP: 0.0 },
      st_tribal: { TDP: -1.0, YSRCP: 0.0, JSP: 1.0 },
      minority_muslim: { TDP: 1.0, YSRCP: -1.0, JSP: 0.0 },
      minority_christian: { TDP: 1.0, YSRCP: -1.0, JSP: 0.0 }
    }
  },
  survey_lok_poll_2026: {
    id: 'survey_lok_poll_2026',
    title: "Survey by Lok Poll",
    shortTitle: "Lok Poll Field Study",
    agency: "Lok Poll Strategic Research Group",
    leadAnalyst: "S. K. Rao & Demographic Cell",
    conductedDate: "January 2026",
    sampleSize: 42800,
    sampleDistribution: { uttarandhra: 8560, kostaAndhra: 20116, rayalaseema: 14124 },
    marginOfError: "± 2.1%",
    methodology: "Constituency-stratified cross-sectional polling with booth-level quota sampling weighted by 2024 voter turnout registers.",
    executiveSummary: "Lok Poll highlights emergent rural-urban divergence. While urban centers strongly support NDA infrastructure policies, agrarian BC Yadava and tenant farmer segments express price-rise concerns, shifting 3-4% votes to YSRCP in rural pockets.",
    badgeColor: "blue",
    badgeIcon: "Target",
    keyCasteFindings: [
      "BC Yadava and Padmashali segments register a +3.5% swing back toward YSRCP driven by handloom distress and cattle feed costs.",
      "Kapu youth show passionate backing for Janasena, but seat-level TDP coordination friction is noted in 18 Coastal constituencies.",
      "Reddy vote in Palnadu and Prakasam polarizes heavily (77% YSRCP), neutralizing NDA gains from defection politics.",
      "Christian and Muslim minorities remain overwhelmingly anchored with YSRCP (70%+ preference)."
    ],
    regionalInsights: {
      uttarandhra: "NDA remains ahead, but Visakhapatnam industrial belt shows sensitivity over steel plant disinvestment rhetoric.",
      kostaAndhra: "TDP retains command in Krishna, Guntur, and Godavari, but rural margin of victory contracts by 4,000 votes per seat.",
      rayalaseema: "YSRCP shows defensive resilience in Kadapa, Annamayya, and Kurnool rural mandals."
    },
    projectedTotals: {
      ndaVoteSharePct: 51.5,
      ysrcpVoteSharePct: 43.6,
      incVoteSharePct: 2.7,
      othVoteSharePct: 2.2,
      projectedSeatsNDA: 142,
      projectedSeatsYSRCP: 33,
      tossUpSeats: 22
    },
    castePreferences: {
      kapu: { TDP: 34.0, JSP: 46.0, YSRCP: 18.0, INC: 1.0, OTH: 1.0 },
      kamma: { TDP: 82.0, JSP: 2.0, YSRCP: 14.0, INC: 1.0, OTH: 1.0 },
      reddy: { TDP: 15.0, JSP: 3.0, YSRCP: 77.0, INC: 4.0, OTH: 1.0 },
      bc_turpu_kapu: { TDP: 56.0, JSP: 5.0, YSRCP: 37.0, INC: 1.0, OTH: 1.0 },
      bc_yadava: { TDP: 48.0, JSP: 4.0, YSRCP: 46.0, INC: 1.0, OTH: 1.0 },
      bc_kuruba_boya: { TDP: 58.0, JSP: 3.0, YSRCP: 37.0, INC: 1.0, OTH: 1.0 },
      bc_settibalija_goud: { TDP: 49.0, JSP: 10.0, YSRCP: 39.0, INC: 1.0, OTH: 1.0 },
      bc_padmashali: { TDP: 48.0, JSP: 5.0, YSRCP: 44.0, INC: 2.0, OTH: 1.0 },
      bc_other: { TDP: 53.0, JSP: 4.0, YSRCP: 41.0, INC: 1.0, OTH: 1.0 },
      sc_madiga_relli: { TDP: 47.0, JSP: 3.0, YSRCP: 47.0, INC: 2.0, OTH: 1.0 },
      sc_mala: { TDP: 19.0, JSP: 3.0, YSRCP: 71.0, INC: 5.0, OTH: 2.0 },
      st_tribal: { TDP: 34.0, JSP: 5.0, YSRCP: 57.0, INC: 3.0, OTH: 1.0 },
      minority_muslim: { TDP: 22.0, JSP: 3.0, YSRCP: 67.0, INC: 6.0, OTH: 2.0 },
      minority_christian: { TDP: 15.0, JSP: 2.0, YSRCP: 76.0, INC: 5.0, OTH: 2.0 }
    },
    casteSwings: {
      kapu: { TDP: -2.0, YSRCP: 6.0, JSP: -4.0 },
      kamma: { TDP: -3.0, YSRCP: 3.0, JSP: 0.0 },
      reddy: { TDP: -2.0, YSRCP: 2.0, JSP: -1.0 },
      bc_turpu_kapu: { TDP: -4.0, YSRCP: 4.0, JSP: 0.0 },
      bc_yadava: { TDP: -7.0, YSRCP: 7.0, JSP: 0.0 },
      bc_kuruba_boya: { TDP: -5.0, YSRCP: 5.0, JSP: 0.0 },
      bc_settibalija_goud: { TDP: -4.0, YSRCP: 6.0, JSP: -2.0 },
      bc_padmashali: { TDP: -7.0, YSRCP: 8.0, JSP: -1.0 },
      bc_other: { TDP: -4.0, YSRCP: 5.0, JSP: -1.0 },
      sc_madiga_relli: { TDP: -5.0, YSRCP: 5.0, JSP: 0.0 },
      sc_mala: { TDP: -2.0, YSRCP: 2.0, JSP: 0.0 },
      st_tribal: { TDP: -3.0, YSRCP: 3.0, JSP: 0.0 },
      minority_muslim: { TDP: -2.0, YSRCP: 2.0, JSP: 0.0 },
      minority_christian: { TDP: -2.0, YSRCP: 2.0, JSP: 0.0 }
    }
  },
  survey_sib_intelligence_2026: {
    id: 'survey_sib_intelligence_2026',
    title: "Survey by SIB (State Intelligence Bureau)",
    shortTitle: "State Intelligence Pulse",
    agency: "Special Intelligence Bureau (Administrative Assessment)",
    leadAnalyst: "SIB Field Stations & District Special Branches",
    conductedDate: "February 2026",
    sampleSize: 68000,
    sampleDistribution: { uttarandhra: 13600, kostaAndhra: 31280, rayalaseema: 23120 },
    marginOfError: "± 1.2%",
    methodology: "Triangulated Administrative Beat Assessment synthesizing 37,088 polling station reports, Mandal Revenue Officer feedback, and caste association resolutions.",
    executiveSummary: "Confidential state intelligence assessment confirms robust pro-governance momentum. Law & order stability, Amaravati construction resumption, and targeted BC welfare corporations deliver strong electoral dividends across 23 out of 26 districts.",
    badgeColor: "amber",
    badgeIcon: "Shield",
    keyCasteFindings: [
      "BC community approval rating stands at peak 63% statewide, anchored by dedicated sub-caste welfare federation allocations.",
      "Pawan Kalyan's Deputy CM stature generates an unprecedented 88% consolidation of Kapu, Balija, and Telaga youth behind the NDA banner.",
      "Tirupati temple administration reforms generate strong devotional consolidation (+4.5% Hindu voter surge in Rayalaseema pilgrim corridors).",
      "YSRCP retains hardcore cadre support in 11-15 factional constituencies, but lacks breakthrough momentum in floating BC swing segments."
    ],
    regionalInsights: {
      uttarandhra: "Zero viable opposition mobilization detected; Uttarandhra is projected as an absolute NDA sweep (34/34 seats).",
      kostaAndhra: "Capital region economic revitalization radiating through Krishna, Guntur, and Bapatla. YSRCP limited to single isolated seats.",
      rayalaseema: "Kurnool, Anantapur, and Chittoor show decisive NDA dominance (75%+ seat share); Kadapa remains fiercely contested."
    },
    projectedTotals: {
      ndaVoteSharePct: 55.6,
      ysrcpVoteSharePct: 39.8,
      incVoteSharePct: 2.4,
      othVoteSharePct: 2.2,
      projectedSeatsNDA: 160,
      projectedSeatsYSRCP: 15,
      tossUpSeats: 8
    },
    castePreferences: {
      kapu: { TDP: 38.0, JSP: 50.0, YSRCP: 10.0, INC: 1.0, OTH: 1.0 },
      kamma: { TDP: 87.0, JSP: 2.0, YSRCP: 9.0, INC: 1.0, OTH: 1.0 },
      reddy: { TDP: 21.0, JSP: 4.0, YSRCP: 71.0, INC: 3.0, OTH: 1.0 },
      bc_turpu_kapu: { TDP: 62.0, JSP: 6.0, YSRCP: 30.0, INC: 1.0, OTH: 1.0 },
      bc_yadava: { TDP: 57.0, JSP: 5.0, YSRCP: 36.0, INC: 1.0, OTH: 1.0 },
      bc_kuruba_boya: { TDP: 65.0, JSP: 3.0, YSRCP: 30.0, INC: 1.0, OTH: 1.0 },
      bc_settibalija_goud: { TDP: 54.0, JSP: 12.0, YSRCP: 32.0, INC: 1.0, OTH: 1.0 },
      bc_padmashali: { TDP: 57.0, JSP: 6.0, YSRCP: 34.0, INC: 2.0, OTH: 1.0 },
      bc_other: { TDP: 59.0, JSP: 5.0, YSRCP: 34.0, INC: 1.0, OTH: 1.0 },
      sc_madiga_relli: { TDP: 54.0, JSP: 3.0, YSRCP: 40.0, INC: 2.0, OTH: 1.0 },
      sc_mala: { TDP: 25.0, JSP: 3.0, YSRCP: 65.0, INC: 5.0, OTH: 2.0 },
      st_tribal: { TDP: 39.0, JSP: 6.0, YSRCP: 51.0, INC: 3.0, OTH: 1.0 },
      minority_muslim: { TDP: 27.0, JSP: 4.0, YSRCP: 62.0, INC: 5.0, OTH: 2.0 },
      minority_christian: { TDP: 20.0, JSP: 3.0, YSRCP: 71.0, INC: 4.0, OTH: 2.0 }
    },
    casteSwings: {
      kapu: { TDP: 2.0, YSRCP: -2.0, JSP: 0.0 },
      kamma: { TDP: 2.0, YSRCP: -2.0, JSP: 0.0 },
      reddy: { TDP: 4.0, YSRCP: -4.0, JSP: 0.0 },
      bc_turpu_kapu: { TDP: 2.0, YSRCP: -3.0, JSP: 1.0 },
      bc_yadava: { TDP: 2.0, YSRCP: -3.0, JSP: 1.0 },
      bc_kuruba_boya: { TDP: 2.0, YSRCP: -2.0, JSP: 0.0 },
      bc_settibalija_goud: { TDP: 1.0, YSRCP: -1.0, JSP: 0.0 },
      bc_padmashali: { TDP: 2.0, YSRCP: -2.0, JSP: 0.0 },
      bc_other: { TDP: 2.0, YSRCP: -2.0, JSP: 0.0 },
      sc_madiga_relli: { TDP: 2.0, YSRCP: -2.0, JSP: 0.0 },
      sc_mala: { TDP: 4.0, YSRCP: -4.0, JSP: 0.0 },
      st_tribal: { TDP: 2.0, YSRCP: -3.0, JSP: 1.0 },
      minority_muslim: { TDP: 3.0, YSRCP: -3.0, JSP: 1.0 },
      minority_christian: { TDP: 3.0, YSRCP: -3.0, JSP: 1.0 }
    }
  },
  survey_ipac_field_wing_2026: {
    id: 'survey_ipac_field_wing_2026',
    title: "Survey by IPAC Field Wing",
    shortTitle: "IPAC War Room Pulse",
    agency: "Indian Political Action Committee (Field Strategy Wing)",
    leadAnalyst: "War Room Analytics & Grassroots Cadre Survey",
    conductedDate: "February 2026",
    sampleSize: 85000,
    sampleDistribution: { uttarandhra: 17000, kostaAndhra: 39100, rayalaseema: 28900 },
    marginOfError: "± 1.5%",
    methodology: "Direct Beneficiary Outreach tracking household Direct Benefit Transfer (DBT) saturation, pension distribution satisfaction, and local MLA grievance registers.",
    executiveSummary: "Internal opposition war room scenario modeling high vulnerability for NDA in rural agrarian segments. Escalating electricity bills, pesticide inflation, and Super Six execution bottlenecks provide an electoral runway for YSRCP recovery in 50+ seats.",
    badgeColor: "rose",
    badgeIcon: "Flame",
    keyCasteFindings: [
      "SC Mala and Christian minority consolidation behind YSRCP peaks at 76-78%, operating as an unshakeable base.",
      "Reddy solidarity hardens to 81% in Rayalaseema, with cadre energized by perceived administrative vendettas.",
      "BC Yadava and Kuruba communities in rainfed mandals report delayed Rythu Bharosa / crop compensation, narrowing the NDA lead to single digits.",
      "Kapu solidarity with TDP exhibits localized fissures where Janasena cadre was denied constituency nomination tickets."
    ],
    regionalInsights: {
      uttarandhra: "Tribal agency tracts (Araku, Paderu, Kurupam) swing decisively toward YSRCP over mining and displacement anxieties.",
      kostaAndhra: "Aquaculture belts in Konaseema and Bapatla register high economic friction; YSRCP eyes 15 flip opportunities.",
      rayalaseema: "YSRCP internal model projects 28 seats in Rayalaseema if agrarian water grievance campaign sustains momentum."
    },
    projectedTotals: {
      ndaVoteSharePct: 48.9,
      ysrcpVoteSharePct: 46.2,
      incVoteSharePct: 2.6,
      othVoteSharePct: 2.3,
      projectedSeatsNDA: 118,
      projectedSeatsYSRCP: 57,
      tossUpSeats: 35
    },
    castePreferences: {
      kapu: { TDP: 31.0, JSP: 43.0, YSRCP: 23.0, INC: 2.0, OTH: 1.0 },
      kamma: { TDP: 80.0, JSP: 2.0, YSRCP: 16.0, INC: 1.0, OTH: 1.0 },
      reddy: { TDP: 13.0, JSP: 3.0, YSRCP: 81.0, INC: 2.0, OTH: 1.0 },
      bc_turpu_kapu: { TDP: 53.0, JSP: 5.0, YSRCP: 40.0, INC: 1.0, OTH: 1.0 },
      bc_yadava: { TDP: 45.0, JSP: 4.0, YSRCP: 49.0, INC: 1.0, OTH: 1.0 },
      bc_kuruba_boya: { TDP: 54.0, JSP: 3.0, YSRCP: 41.0, INC: 1.0, OTH: 1.0 },
      bc_settibalija_goud: { TDP: 46.0, JSP: 9.0, YSRCP: 43.0, INC: 1.0, OTH: 1.0 },
      bc_padmashali: { TDP: 45.0, JSP: 5.0, YSRCP: 47.0, INC: 2.0, OTH: 1.0 },
      bc_other: { TDP: 50.0, JSP: 4.0, YSRCP: 44.0, INC: 1.0, OTH: 1.0 },
      sc_madiga_relli: { TDP: 44.0, JSP: 3.0, YSRCP: 51.0, INC: 1.0, OTH: 1.0 },
      sc_mala: { TDP: 17.0, JSP: 2.0, YSRCP: 76.0, INC: 4.0, OTH: 1.0 },
      st_tribal: { TDP: 31.0, JSP: 4.0, YSRCP: 61.0, INC: 3.0, OTH: 1.0 },
      minority_muslim: { TDP: 20.0, JSP: 2.0, YSRCP: 72.0, INC: 5.0, OTH: 1.0 },
      minority_christian: { TDP: 14.0, JSP: 2.0, YSRCP: 78.0, INC: 5.0, OTH: 1.0 }
    },
    casteSwings: {
      kapu: { TDP: -5.0, YSRCP: 11.0, JSP: -7.0 },
      kamma: { TDP: -5.0, YSRCP: 5.0, JSP: 0.0 },
      reddy: { TDP: -4.0, YSRCP: 6.0, JSP: -1.0 },
      bc_turpu_kapu: { TDP: -7.0, YSRCP: 7.0, JSP: 0.0 },
      bc_yadava: { TDP: -10.0, YSRCP: 10.0, JSP: 0.0 },
      bc_kuruba_boya: { TDP: -9.0, YSRCP: 9.0, JSP: 0.0 },
      bc_settibalija_goud: { TDP: -7.0, YSRCP: 10.0, JSP: -3.0 },
      bc_padmashali: { TDP: -10.0, YSRCP: 11.0, JSP: -1.0 },
      bc_other: { TDP: -7.0, YSRCP: 8.0, JSP: -1.0 },
      sc_madiga_relli: { TDP: -8.0, YSRCP: 9.0, JSP: 0.0 },
      sc_mala: { TDP: -4.0, YSRCP: 7.0, JSP: -1.0 },
      st_tribal: { TDP: -6.0, YSRCP: 7.0, JSP: -1.0 },
      minority_muslim: { TDP: -4.0, YSRCP: 7.0, JSP: -1.0 },
      minority_christian: { TDP: -3.0, YSRCP: 4.0, JSP: 0.0 }
    }
  },
  survey_atma_sakshi_2026: {
    id: 'survey_atma_sakshi_2026',
    title: "Survey by Atma Sakshi (CPS)",
    shortTitle: "Atma Sakshi Caste Index",
    agency: "Atma Sakshi Group / Center for Poll Strategies (CPS)",
    leadAnalyst: "B. Murthy & Polling Council",
    conductedDate: "January 2026",
    sampleSize: 46500,
    sampleDistribution: { uttarandhra: 9300, kostaAndhra: 21390, rayalaseema: 15810 },
    marginOfError: "± 2.0%",
    methodology: "Micro-caste household interviews stratified across 26 district headquarters, mandal centers, and interior gram panchayats.",
    executiveSummary: "Atma Sakshi's granular caste arithmetic index projects an enduring NDA majority of 148 seats. The alliance's social coalition of BCs + Kapus + Kammas commands overwhelming numeric superiority over YSRCP's Reddy + SC Mala + Minority axis.",
    badgeColor: "indigo",
    badgeIcon: "Scale",
    keyCasteFindings: [
      "BCs represent 49.5% of the electorate and back the NDA coalition by an aggregate 57% to 37% margin.",
      "Coastal Andhra Kapus vote 83% for the NDA alliance, completely shutting out YSRCP in East Godavari, West Godavari, and Kakinada.",
      "Madiga sub-categorization momentum successfully splits the SC bloc, denying YSRCP its customary unanimous Dalit sweep.",
      "YSRCP retains competitive viability exclusively in seats where Reddy + SC Mala + Muslim share exceeds 42% of registered electors."
    ],
    regionalInsights: {
      uttarandhra: "NDA dominates 31 of 34 seats with formidable Turpu Kapu and Yadava community mobilization.",
      kostaAndhra: "Total sweep in Konaseema, Godavari, and Krishna; YSRCP struggles to register on the board.",
      rayalaseema: "Competitive dogfight in 18 seats; TDP Kuruba-Valmiki bloc delivers key upsets in Anantapur and Kurnool."
    },
    projectedTotals: {
      ndaVoteSharePct: 53.1,
      ysrcpVoteSharePct: 42.1,
      incVoteSharePct: 2.7,
      othVoteSharePct: 2.1,
      projectedSeatsNDA: 148,
      projectedSeatsYSRCP: 27,
      tossUpSeats: 18
    },
    castePreferences: {
      kapu: { TDP: 35.0, JSP: 48.0, YSRCP: 15.0, INC: 1.0, OTH: 1.0 },
      kamma: { TDP: 83.0, JSP: 2.0, YSRCP: 13.0, INC: 1.0, OTH: 1.0 },
      reddy: { TDP: 16.0, JSP: 4.0, YSRCP: 75.0, INC: 4.0, OTH: 1.0 },
      bc_turpu_kapu: { TDP: 57.0, JSP: 6.0, YSRCP: 35.0, INC: 1.0, OTH: 1.0 },
      bc_yadava: { TDP: 51.0, JSP: 5.0, YSRCP: 42.0, INC: 1.0, OTH: 1.0 },
      bc_kuruba_boya: { TDP: 60.0, JSP: 3.0, YSRCP: 35.0, INC: 1.0, OTH: 1.0 },
      bc_settibalija_goud: { TDP: 51.0, JSP: 11.0, YSRCP: 36.0, INC: 1.0, OTH: 1.0 },
      bc_padmashali: { TDP: 52.0, JSP: 6.0, YSRCP: 39.0, INC: 2.0, OTH: 1.0 },
      bc_other: { TDP: 55.0, JSP: 5.0, YSRCP: 38.0, INC: 1.0, OTH: 1.0 },
      sc_madiga_relli: { TDP: 50.0, JSP: 3.0, YSRCP: 45.0, INC: 1.0, OTH: 1.0 },
      sc_mala: { TDP: 20.0, JSP: 3.0, YSRCP: 70.0, INC: 5.0, OTH: 2.0 },
      st_tribal: { TDP: 35.0, JSP: 5.0, YSRCP: 56.0, INC: 3.0, OTH: 1.0 },
      minority_muslim: { TDP: 23.0, JSP: 3.0, YSRCP: 66.0, INC: 6.0, OTH: 2.0 },
      minority_christian: { TDP: 16.0, JSP: 2.0, YSRCP: 75.0, INC: 5.0, OTH: 2.0 }
    },
    casteSwings: {
      kapu: { TDP: -1.0, YSRCP: 3.0, JSP: -2.0 },
      kamma: { TDP: -2.0, YSRCP: 2.0, JSP: 0.0 },
      reddy: { TDP: -1.0, YSRCP: 0.0, JSP: 0.0 },
      bc_turpu_kapu: { TDP: -3.0, YSRCP: 2.0, JSP: 1.0 },
      bc_yadava: { TDP: -4.0, YSRCP: 3.0, JSP: 1.0 },
      bc_kuruba_boya: { TDP: -3.0, YSRCP: 3.0, JSP: 0.0 },
      bc_settibalija_goud: { TDP: -2.0, YSRCP: 3.0, JSP: -1.0 },
      bc_padmashali: { TDP: -3.0, YSRCP: 3.0, JSP: 0.0 },
      bc_other: { TDP: -2.0, YSRCP: 2.0, JSP: 0.0 },
      sc_madiga_relli: { TDP: -2.0, YSRCP: 3.0, JSP: 0.0 },
      sc_mala: { TDP: -1.0, YSRCP: 1.0, JSP: 0.0 },
      st_tribal: { TDP: -2.0, YSRCP: 2.0, JSP: 0.0 },
      minority_muslim: { TDP: -1.0, YSRCP: 1.0, JSP: 0.0 },
      minority_christian: { TDP: -1.0, YSRCP: 1.0, JSP: 0.0 }
    }
  },
  survey_cvoter_macro_2026: {
    id: 'survey_cvoter_macro_2026',
    title: "Survey by C-Voter / Macro Pulse",
    shortTitle: "C-Voter AP Macro Tracker",
    agency: "C-Voter International & State Opinion Council",
    leadAnalyst: "Yashwant Deshmukh & Polling Desk",
    conductedDate: "February 2026",
    sampleSize: 38500,
    sampleDistribution: { uttarandhra: 7700, kostaAndhra: 17710, rayalaseema: 13090 },
    marginOfError: "± 2.2%",
    methodology: "Computer-Assisted Telephonic Interviews (CATI) blended with probability-proportional-to-size (PPS) in-person booth intercept interviews across all 26 districts.",
    executiveSummary: "National polling benchmark affirms double-engine NDA stability in Andhra Pradesh. Chandrababu Naidu's administrative governance rating stands at 61% net positive, with Pawan Kalyan emerging as the highest-rated youth political figure.",
    badgeColor: "cyan",
    badgeIcon: "Globe",
    keyCasteFindings: [
      "Cross-caste youth (18-29) preference for NDA stands at 64%, driven by skill census and IT investment announcements.",
      "Women voters (Aadabidda Nidhi beneficiaries) favor NDA by +11% margin over YSRCP across Coastal districts.",
      "BC Settibalija, Agnikula Fishermen, and Turpu Kapu vote consolidation remains solid above 56%.",
      "YSRCP experiences voter fatigue among urban lower middle-class, but retains intense loyalty in rural Dalit wadas."
    ],
    regionalInsights: {
      uttarandhra: "NDA holds dominant 32-seat projection in North Coastal AP.",
      kostaAndhra: "Industrial corridors from Amaravati to Visakhapatnam show strong positive governance sentiment.",
      rayalaseema: "TDP-JSP alliance matches YSRCP vote-for-vote in Kurnool and Kadapa rural belts."
    },
    projectedTotals: {
      ndaVoteSharePct: 53.5,
      ysrcpVoteSharePct: 41.5,
      incVoteSharePct: 2.8,
      othVoteSharePct: 2.2,
      projectedSeatsNDA: 150,
      projectedSeatsYSRCP: 25,
      tossUpSeats: 16
    },
    castePreferences: {
      kapu: { TDP: 35.0, JSP: 49.0, YSRCP: 14.0, INC: 1.0, OTH: 1.0 },
      kamma: { TDP: 84.0, JSP: 2.0, YSRCP: 12.0, INC: 1.0, OTH: 1.0 },
      reddy: { TDP: 17.0, JSP: 4.0, YSRCP: 74.0, INC: 4.0, OTH: 1.0 },
      bc_turpu_kapu: { TDP: 58.0, JSP: 6.0, YSRCP: 34.0, INC: 1.0, OTH: 1.0 },
      bc_yadava: { TDP: 52.0, JSP: 5.0, YSRCP: 41.0, INC: 1.0, OTH: 1.0 },
      bc_kuruba_boya: { TDP: 61.0, JSP: 3.0, YSRCP: 34.0, INC: 1.0, OTH: 1.0 },
      bc_settibalija_goud: { TDP: 52.0, JSP: 11.0, YSRCP: 35.0, INC: 1.0, OTH: 1.0 },
      bc_padmashali: { TDP: 53.0, JSP: 6.0, YSRCP: 38.0, INC: 2.0, OTH: 1.0 },
      bc_other: { TDP: 55.0, JSP: 5.0, YSRCP: 38.0, INC: 1.0, OTH: 1.0 },
      sc_madiga_relli: { TDP: 51.0, JSP: 3.0, YSRCP: 44.0, INC: 1.0, OTH: 1.0 },
      sc_mala: { TDP: 21.0, JSP: 3.0, YSRCP: 68.0, INC: 6.0, OTH: 2.0 },
      st_tribal: { TDP: 36.0, JSP: 5.0, YSRCP: 55.0, INC: 3.0, OTH: 1.0 },
      minority_muslim: { TDP: 24.0, JSP: 3.0, YSRCP: 65.0, INC: 6.0, OTH: 2.0 },
      minority_christian: { TDP: 17.0, JSP: 2.0, YSRCP: 74.0, INC: 5.0, OTH: 2.0 }
    },
    casteSwings: {
      kapu: { TDP: -1.0, YSRCP: 2.0, JSP: -1.0 },
      kamma: { TDP: -1.0, YSRCP: 1.0, JSP: 0.0 },
      reddy: { TDP: 0.0, YSRCP: -1.0, JSP: 0.0 },
      bc_turpu_kapu: { TDP: -2.0, YSRCP: 1.0, JSP: 1.0 },
      bc_yadava: { TDP: -3.0, YSRCP: 2.0, JSP: 1.0 },
      bc_kuruba_boya: { TDP: -2.0, YSRCP: 2.0, JSP: 0.0 },
      bc_settibalija_goud: { TDP: -1.0, YSRCP: 2.0, JSP: -1.0 },
      bc_padmashali: { TDP: -2.0, YSRCP: 2.0, JSP: 0.0 },
      bc_other: { TDP: -2.0, YSRCP: 2.0, JSP: 0.0 },
      sc_madiga_relli: { TDP: -1.0, YSRCP: 2.0, JSP: 0.0 },
      sc_mala: { TDP: 0.0, YSRCP: -1.0, JSP: 0.0 },
      st_tribal: { TDP: -1.0, YSRCP: 1.0, JSP: 0.0 },
      minority_muslim: { TDP: 0.0, YSRCP: 0.0, JSP: 0.0 },
      minority_christian: { TDP: 0.0, YSRCP: 0.0, JSP: 0.0 }
    }
  }
};

const CUSTOM_SURVEYS_STORAGE_KEY = 'ap_custom_caste_surveys';

export async function fetchSurveysCatalog(): Promise<SurveyCatalogItem[]> {
  try {
    const res = await fetch('/data/surveys/index.json');
    if (res.ok) {
      const data = await res.json();
      const serverSurveys: SurveyCatalogItem[] = data.surveys || [];
      const customSurveys = getCustomSurveys().map((s) => ({
        id: s.id,
        filename: `${s.id}.json`,
        title: s.title,
        shortTitle: s.shortTitle,
        agency: s.agency,
        conductedDate: s.conductedDate,
        sampleSize: s.sampleSize,
        marginOfError: s.marginOfError,
        badgeColor: s.badgeColor,
        badgeIcon: s.badgeIcon,
        projectedTotals: s.projectedTotals,
        isCustom: true,
      }));
      return [...serverSurveys, ...customSurveys];
    }
  } catch (err) {
    console.warn('Failed to fetch /data/surveys/index.json, using bundled catalog', err);
  }

  // Fallback to bundled surveys
  const bundled = Object.values(BUNDLED_SURVEYS).map((s) => ({
    id: s.id,
    filename: `${s.id.replace('survey_', '')}.json`,
    title: s.title,
    shortTitle: s.shortTitle,
    agency: s.agency,
    conductedDate: s.conductedDate,
    sampleSize: s.sampleSize,
    marginOfError: s.marginOfError,
    badgeColor: s.badgeColor,
    badgeIcon: s.badgeIcon,
    projectedTotals: s.projectedTotals,
  }));

  const customSurveys = getCustomSurveys().map((s) => ({
    id: s.id,
    filename: `${s.id}.json`,
    title: s.title,
    shortTitle: s.shortTitle,
    agency: s.agency,
    conductedDate: s.conductedDate,
    sampleSize: s.sampleSize,
    marginOfError: s.marginOfError,
    badgeColor: s.badgeColor,
    badgeIcon: s.badgeIcon,
    projectedTotals: s.projectedTotals,
    isCustom: true,
  }));

  return [...bundled, ...customSurveys];
}

export async function fetchSurveyById(surveyId: string): Promise<CasteSurveyDataset> {
  // Check custom surveys first
  const custom = getCustomSurveys().find((s) => s.id === surveyId);
  if (custom) return custom;

  // Try fetching from server public folder
  try {
    const cleanId = surveyId.replace('survey_', '');
    const res = await fetch(`/data/surveys/${cleanId}.json`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn(`Failed to fetch /data/surveys/${surveyId}.json, falling back to bundled`, err);
  }

  // Fallback to bundled
  if (BUNDLED_SURVEYS[surveyId]) {
    return BUNDLED_SURVEYS[surveyId];
  }

  return BUNDLED_SURVEYS.survey_peoples_pulse_2026;
}

export function getCustomSurveys(): CasteSurveyDataset[] {
  try {
    const raw = localStorage.getItem(CUSTOM_SURVEYS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomSurvey(survey: CasteSurveyDataset): void {
  try {
    const existing = getCustomSurveys();
    const filtered = existing.filter((s) => s.id !== survey.id);
    filtered.push({ ...survey, isCustom: true });
    localStorage.setItem(CUSTOM_SURVEYS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to save custom survey to localStorage', err);
  }
}

export function deleteCustomSurvey(surveyId: string): void {
  try {
    const existing = getCustomSurveys();
    const filtered = existing.filter((s) => s.id !== surveyId);
    localStorage.setItem(CUSTOM_SURVEYS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete custom survey from localStorage', err);
  }
}

export function exportSurveyAsJsonFile(survey: CasteSurveyDataset): void {
  const jsonStr = JSON.stringify(survey, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${survey.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Convert user modified caste preferences back to swings relative to 2024 baseline
export function calculateSwingsFromPreferences(
  prefs: Record<string, CasteSurveyCommunityPref>
): Record<string, PartySwing> {
  const swings: Record<string, PartySwing> = {};
  Object.entries(prefs).forEach(([commKey, pref]) => {
    const base = BASELINE_2024_CASTE_SHARES[commKey] || { TDP: 45, JSP: 10, YSRCP: 42, INC: 2, OTH: 1 };
    swings[commKey] = {
      TDP: Math.round((pref.TDP - base.TDP) * 10) / 10,
      YSRCP: Math.round((pref.YSRCP - base.YSRCP) * 10) / 10,
      JSP: Math.round((pref.JSP - base.JSP) * 10) / 10,
    };
  });
  return swings;
}
