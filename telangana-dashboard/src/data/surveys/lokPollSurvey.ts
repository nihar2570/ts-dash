import type { CasteSurveyDefinition } from './types';

export const LOK_POLL_SURVEY: CasteSurveyDefinition = {
  id: 'survey_lok_poll',
  name: 'Survey by Lok Poll',
  agency: 'Lok Poll & Political Insight Network',
  shortLabel: 'Lok Poll',
  leadAnalyst: 'A. R. Srinivas & Data Analytics Unit',
  date: 'Statewide Semi-Annual Caste Audit',
  sampleSize: 51600,
  methodology: 'Multi-stage stratified systematic sampling across all 119 constituencies and 33 districts',
  marginOfError: '±1.6%',
  headlineFinding: 'Congress Consolidates Minorities (+8.0%), Mala (+6.0%) & Lambada (+4.5%); BRS Rebounds in Rural BCs',
  narrativeSummary:
    'Lok Poll finds a highly bifurcated social coalition. The ruling Congress has fortified its lead among Muslim Minorities (+8.0%), SC Mala (+6.0%), ST Lambada (+4.5%), and OC Reddy (+4.0%). Conversely, BRS demonstrates resilience in rural BC heartlands, gaining +4.0% in Yadav, +4.0% in Padmashali, and +4.0% in Mudiraj. BJP expands primarily in urban and semi-urban pockets among SC Madiga (+4.0%) and OC Others (+4.0%).',
  badgeColor: 'purple',
  swings: {
    sc_madiga: { INC: -5.0, BRS: 1.0, BJP: 4.0 },
    sc_mala: { INC: 6.0, BRS: -4.0, BJP: -2.0 },
    st_lambada: { INC: 4.5, BRS: -3.5, BJP: -1.0 },
    st_koya_gond: { INC: 3.0, BRS: -2.0, BJP: -1.0 },
    bc_mudiraj: { INC: -6.0, BRS: 4.0, BJP: 2.0 },
    bc_munnuru_kapu: { INC: -4.0, BRS: 1.5, BJP: 2.5 },
    bc_padmashali: { INC: -4.0, BRS: 4.0, BJP: 0.0 },
    bc_goud: { INC: -3.0, BRS: 3.5, BJP: -0.5 },
    bc_yadav: { INC: -3.5, BRS: 4.0, BJP: -0.5 },
    bc_other: { INC: -2.0, BRS: 2.0, BJP: 0.0 },
    minority_muslim: { INC: 8.0, BRS: -7.5, BJP: -0.5 },
    oc_reddy: { INC: 4.0, BRS: -3.0, BJP: -1.0 },
    oc_velama: { INC: -5.0, BRS: 5.0, BJP: 0.0 },
    oc_other: { INC: -2.5, BRS: -1.5, BJP: 4.0 },
  },
};
