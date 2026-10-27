import type { CasteSurveyDefinition } from './types';

export const CVOTER_SURVEY: CasteSurveyDefinition = {
  id: 'survey_cvoter_hc',
  name: 'Survey by CVoter / Hyderabad Circle',
  agency: 'Centre for Voting Opinion & Trends (CVoter)',
  shortLabel: 'CVoter / HC',
  leadAnalyst: 'Yashwant Deshmukh & State Polling Desk',
  date: 'Quarterly Telangana Social Coalition Tracker',
  sampleSize: 41000,
  methodology: 'Dual-frame CATI + Face-to-Face probability sampling across urban and rural ACs',
  marginOfError: '±1.9%',
  headlineFinding: 'Triangular Polarization: BJP Expansion Among Madiga (+7.5%) & Munnuru Kapu (+6.5%)',
  narrativeSummary:
    'CVoter data indicates acute three-cornered fragmentation. The Bharatiya Janata Party makes its strongest gains among SC Madiga (+7.5%), BC Munnuru Kapu (+6.5%), and urban OC Others (+5.0%), creating substantial pressure in North Telangana and the GHMC outer ring. Meanwhile, Congress consolidates Muslim Minorities (+9.0%) and SC Mala (+5.0%), maintaining a firewall in the southern and tribal belt.',
  badgeColor: 'cyan',
  swings: {
    sc_madiga: { INC: -8.0, BRS: 0.5, BJP: 7.5 },
    sc_mala: { INC: 5.0, BRS: -3.5, BJP: -1.5 },
    st_lambada: { INC: 3.5, BRS: -2.5, BJP: -1.0 },
    st_koya_gond: { INC: -1.5, BRS: -1.5, BJP: 3.0 },
    bc_mudiraj: { INC: -9.0, BRS: 5.0, BJP: 4.0 },
    bc_munnuru_kapu: { INC: -8.0, BRS: 1.5, BJP: 6.5 },
    bc_padmashali: { INC: -4.0, BRS: 4.5, BJP: -0.5 },
    bc_goud: { INC: -3.5, BRS: 3.0, BJP: 0.5 },
    bc_yadav: { INC: -4.0, BRS: 4.0, BJP: 0.0 },
    bc_other: { INC: -3.5, BRS: 2.0, BJP: 1.5 },
    minority_muslim: { INC: 9.0, BRS: -8.0, BJP: -1.0 },
    oc_reddy: { INC: 4.0, BRS: -2.5, BJP: -1.5 },
    oc_velama: { INC: -6.5, BRS: 5.5, BJP: 1.0 },
    oc_other: { INC: -3.5, BRS: -1.5, BJP: 5.0 },
  },
};
