import type { CasteSurveyDefinition } from './types';

export const PEOPLES_PULSE_SURVEY: CasteSurveyDefinition = {
  id: 'survey_peoples_pulse',
  name: "Survey by People's Pulse Research",
  agency: "People's Pulse Political Research",
  shortLabel: "People's Pulse",
  leadAnalyst: 'G. Murali Krishna & Field Research Team',
  date: 'Post-Lok Sabha Ground Assessment',
  sampleSize: 44800,
  methodology: 'Stratified Random Caste Sampling across 119 Assembly Segments with booth-level verification',
  marginOfError: '±1.8%',
  headlineFinding: 'SC Madiga Sub-Categorization Tilt to BJP (+6.5%) & BC Mudiraj Resentment (+6.0% BRS)',
  narrativeSummary:
    "People's Pulse survey reflects sharp caste realignments. SC Madiga community exhibits a strong shift towards BJP (+6.5%) following the Supreme Court sub-categorization ruling, while SC Mala maintains staunch backing for INC (+5.0%). BC Mudiraj voters demonstrate friction with Congress regarding political representation, swinging +6.0% to BRS and +3.0% to BJP. Muslim minorities consolidate +6.0% behind Congress against NDA consolidation.",
  badgeColor: 'indigo',
  swings: {
    sc_madiga: { INC: -8.0, BRS: 1.5, BJP: 6.5 },
    sc_mala: { INC: 5.0, BRS: -3.5, BJP: -1.5 },
    st_lambada: { INC: 2.0, BRS: -1.0, BJP: -1.0 },
    st_koya_gond: { INC: -2.5, BRS: -1.0, BJP: 3.5 },
    bc_mudiraj: { INC: -9.0, BRS: 6.0, BJP: 3.0 },
    bc_munnuru_kapu: { INC: -6.0, BRS: 2.0, BJP: 4.0 },
    bc_padmashali: { INC: -4.5, BRS: 5.0, BJP: -0.5 },
    bc_goud: { INC: -3.0, BRS: 3.5, BJP: -0.5 },
    bc_yadav: { INC: -4.0, BRS: 4.5, BJP: -0.5 },
    bc_other: { INC: -4.0, BRS: 3.0, BJP: 1.0 },
    minority_muslim: { INC: 6.0, BRS: -6.0, BJP: 0.0 },
    oc_reddy: { INC: 3.0, BRS: -2.0, BJP: -1.0 },
    oc_velama: { INC: -7.0, BRS: 6.0, BJP: 1.0 },
    oc_other: { INC: -2.0, BRS: -1.0, BJP: 3.0 },
  },
};
