import type {
  CasteSurveyDefinition,
  CasteCommunityKey,
  CasteVoteShare,
} from './types';
import { ALL_CASTE_COMMUNITIES, BASELINE_2023_EXIT_POLL_CASTES } from './types';
import { PEOPLES_PULSE_SURVEY } from './peoplesPulseSurvey';
import { SAS_GROUP_SURVEY } from './sasGroupSurvey';
import { LOK_POLL_SURVEY } from './lokPollSurvey';
import { JANMAT_SURVEY } from './janmatSurvey';
import { CVOTER_SURVEY } from './cvoterSurvey';
import type { PartySwing } from '../../components/SwingStudioModal';

export * from './types';
export { PEOPLES_PULSE_SURVEY } from './peoplesPulseSurvey';
export { SAS_GROUP_SURVEY } from './sasGroupSurvey';
export { LOK_POLL_SURVEY } from './lokPollSurvey';
export { JANMAT_SURVEY } from './janmatSurvey';
export { CVOTER_SURVEY } from './cvoterSurvey';

export const BUILTIN_SURVEYS: CasteSurveyDefinition[] = [
  PEOPLES_PULSE_SURVEY,
  SAS_GROUP_SURVEY,
  LOK_POLL_SURVEY,
  JANMAT_SURVEY,
  CVOTER_SURVEY,
];

const LOCAL_STORAGE_CUSTOM_SURVEYS_KEY = 'ts_dash_configured_caste_surveys';

/**
 * Retrieves all available surveys, overlaying any user-configured edits from localStorage.
 */
export function getAllSurveys(): CasteSurveyDefinition[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_SURVEYS_KEY);
    if (!raw) return BUILTIN_SURVEYS;

    const saved: Record<string, CasteSurveyDefinition> = JSON.parse(raw);
    return BUILTIN_SURVEYS.map((builtin) => {
      if (saved[builtin.id]) {
        return {
          ...builtin,
          ...saved[builtin.id],
          swings: {
            ...builtin.swings,
            ...saved[builtin.id].swings,
          },
        };
      }
      return builtin;
    });
  } catch (err) {
    console.warn('Failed to parse configured surveys from localStorage', err);
    return BUILTIN_SURVEYS;
  }
}

/**
 * Finds a specific survey by its preset ID.
 */
export function getSurveyById(id: string): CasteSurveyDefinition | undefined {
  const surveys = getAllSurveys();
  return surveys.find((s) => s.id === id);
}

/**
 * Checks if a given preset key corresponds to a prefilled caste survey.
 */
export function isSurveyPreset(presetKey: string): boolean {
  return presetKey.startsWith('survey_');
}

/**
 * Persists an edited survey configuration to localStorage.
 */
export function saveSurveyConfig(survey: CasteSurveyDefinition): void {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_SURVEYS_KEY);
    const saved: Record<string, CasteSurveyDefinition> = raw ? JSON.parse(raw) : {};
    saved[survey.id] = survey;
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_SURVEYS_KEY, JSON.stringify(saved));
  } catch (err) {
    console.error('Failed to save survey configuration to localStorage', err);
  }
}

/**
 * Resets a survey back to its authentic default agency data.
 */
export function resetSurveyToBuiltin(id: string): CasteSurveyDefinition | undefined {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_SURVEYS_KEY);
    if (raw) {
      const saved: Record<string, CasteSurveyDefinition> = JSON.parse(raw);
      delete saved[id];
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_SURVEYS_KEY, JSON.stringify(saved));
    }
  } catch (err) {
    console.error('Failed to reset survey in localStorage', err);
  }
  return BUILTIN_SURVEYS.find((s) => s.id === id);
}

/**
 * Calculates absolute projected vote shares for each caste community based on 2023 exit poll + survey swings.
 */
export function calculateProjectedShares(
  swings: Record<CasteCommunityKey, PartySwing>
): Record<CasteCommunityKey, CasteVoteShare> {
  const result = {} as Record<CasteCommunityKey, CasteVoteShare>;

  ALL_CASTE_COMMUNITIES.forEach(({ key }) => {
    const base = BASELINE_2023_EXIT_POLL_CASTES[key];
    const sw = swings[key] || { INC: 0, BRS: 0, BJP: 0 };

    const inc = Math.max(0, Math.min(100, Math.round((base.INC + sw.INC) * 10) / 10));
    const brs = Math.max(0, Math.min(100, Math.round((base.BRS + sw.BRS) * 10) / 10));
    const bjp = Math.max(0, Math.min(100, Math.round((base.BJP + sw.BJP) * 10) / 10));

    result[key] = {
      INC: inc,
      BRS: brs,
      BJP: bjp,
      AIMIM: base.AIMIM || 0,
      OTH: base.OTH || 0,
    };
  });

  return result;
}

/**
 * Exports a survey configuration as a downloadable JSON string.
 */
export function exportSurveyToJson(survey: CasteSurveyDefinition): string {
  const payload = {
    _schema: 'telangana_dashboard_caste_survey_v1',
    exportedAt: new Date().toISOString(),
    survey,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Validates and imports a survey configuration from a JSON string.
 */
export function importSurveyFromJson(jsonString: string): CasteSurveyDefinition {
  const parsed = JSON.parse(jsonString);
  const survey = parsed.survey || parsed;

  if (!survey.id || !survey.name || !survey.swings) {
    throw new Error('Invalid survey JSON: missing required fields (id, name, swings)');
  }

  // Validate that all 14 caste communities are present
  for (const community of ALL_CASTE_COMMUNITIES) {
    if (!survey.swings[community.key]) {
      survey.swings[community.key] = { INC: 0, BRS: 0, BJP: 0 };
    }
  }

  return survey as CasteSurveyDefinition;
}
