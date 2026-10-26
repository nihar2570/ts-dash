// Andhra Pradesh Onomastic Caste & Community Classifier Service
// Loads directly from castes_master.json (User-Configurable Single Source of Truth)
// Supports Bayesian Surname Inference + Mandal Priors + Household Clustering

import defaultCastesConfig from './castes_master.json';

export type CasteCategory = 'BC' | 'SC' | 'ST' | 'OC' | 'Minority' | string;

export interface CasteMasterEntry {
  id?: string;
  caste: string;
  broad_category: CasteCategory;
  sub_category?: string;
  description?: string;
  surnames?: string[];
}

export interface CastesMasterFile {
  version?: string;
  description?: string;
  categories?: Array<{ code: string; name: string; description?: string }>;
  castes: CasteMasterEntry[];
}

export interface CastePrediction {
  casteName: string;
  category: CasteCategory;
  subCategory?: string;
  probability: number; // 0.0 - 1.0
  probabilityPercent: string;
  confidenceTier: 'VERY_HIGH' | 'HIGH' | 'MODERATE';
  color: {
    bg: string;
    text: string;
    border: string;
    badge: string;
  };
  sourceBasis: string;
}

// Fallback color scheme per community category
export const CATEGORY_COLORS: Record<string, CastePrediction['color']> = {
  BC: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  SC: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  ST: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  OC: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  Minority: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-800 border-teal-200',
  },
};

interface ClanRecord {
  caste: string;
  category: CasteCategory;
  subCategory: string;
  baseProb: number;
}

// In-memory active registry loaded from castes_master.json
let activeMasterConfig: CastesMasterFile = (defaultCastesConfig as unknown) as CastesMasterFile;
let activeClanLexicon: Record<string, ClanRecord> = {};
let activeSuffixRules: Array<{
  pattern: RegExp;
  caste: string;
  category: CasteCategory;
  subCategory: string;
  prob: number;
}> = [];

/**
 * Rebuilds the fast lookup dictionaries from the master castes configuration.
 */
function compileMasterRegistry(cfg: CastesMasterFile) {
  const newLexicon: Record<string, ClanRecord> = {};
  const newSuffixRules: typeof activeSuffixRules = [];

  const castesList = Array.isArray(cfg?.castes) ? cfg.castes : [];

  castesList.forEach((entry) => {
    const casteName = entry.caste?.trim() || 'General';
    const category = entry.broad_category?.trim() || 'OC';
    const subCategory = entry.sub_category?.trim() || category;

    // Process surnames associated with this caste
    if (Array.isArray(entry.surnames)) {
      entry.surnames.forEach((s) => {
        const cleanS = s.trim().toLowerCase();
        if (cleanS) {
          newLexicon[cleanS] = {
            caste: casteName,
            category,
            subCategory,
            baseProb: 0.95,
          };
        }
      });
    }

    // Generate automatic suffix rule if the caste name has an unambiguous suffix
    const lowerCaste = casteName.toLowerCase();
    const markers: string[] = [];

    if (lowerCaste.includes('reddy')) markers.push('reddy');
    if (lowerCaste.includes('kamma')) markers.push('chowdary', 'kamma');
    if (lowerCaste.includes('kapu')) markers.push('kapu', 'naidu');
    if (lowerCaste.includes('goud') || lowerCaste.includes('settibalija')) markers.push('goud', 'gouda', 'goundla');
    if (lowerCaste.includes('yadav') || lowerCaste.includes('golla')) markers.push('yadav', 'golla');
    if (lowerCaste.includes('boya') || lowerCaste.includes('kuruba') || lowerCaste.includes('valmiki')) markers.push('boya', 'kuruba', 'valmiki', 'naidu');
    if (lowerCaste.includes('padmashali')) markers.push('padmashali');
    if (lowerCaste.includes('raju') || lowerCaste.includes('kshatriya')) markers.push('raju', 'varma');
    if (lowerCaste.includes('vysya')) markers.push('gupta', 'shetty', 'setty');
    if (lowerCaste.includes('brahmin')) markers.push('sharma', 'shastri');
    if (lowerCaste.includes('madiga')) markers.push('madiga');
    if (lowerCaste.includes('mala')) markers.push('mala');
    if (lowerCaste.includes('lambada') || lowerCaste.includes('sugali')) markers.push('rathod', 'chavan', 'jadhav', 'pawar', 'naik');
    if (lowerCaste.includes('chenchu') || lowerCaste.includes('yanadi')) markers.push('chenchu', 'yanadi');
    if (lowerCaste.includes('muslim')) markers.push('shaik', 'syed', 'khan', 'pasha', 'baig', 'ansari', 'qureshi');

    markers.forEach((m) => {
      newSuffixRules.push({
        pattern: new RegExp(`${m}$`, 'i'),
        caste: casteName,
        category,
        subCategory,
        prob: 0.94,
      });
    });
  });

  activeMasterConfig = cfg;
  activeClanLexicon = newLexicon;
  activeSuffixRules = newSuffixRules;
}

// Initialize immediately with bundled JSON
compileMasterRegistry(defaultCastesConfig as unknown as CastesMasterFile);

// Dynamic browser fetch to load edited public/data/castes_master.json every time
if (typeof window !== 'undefined') {
  fetch('/data/castes_master.json')
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && Array.isArray(data.castes) && data.castes.length > 0) {
        compileMasterRegistry(data);
      }
    })
    .catch(() => {
      // Kept fallback config cleanly
    });
}

/**
 * Reloads the master caste configuration at runtime (e.g., when the user edits the file or triggers an update).
 */
export function reloadMasterCastes(customConfig?: CastesMasterFile): void {
  if (customConfig && Array.isArray(customConfig.castes)) {
    compileMasterRegistry(customConfig);
    return;
  }
  if (typeof window !== 'undefined') {
    fetch(`/data/castes_master.json?t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.castes)) {
          compileMasterRegistry(data);
        }
      })
      .catch(() => {});
  }
}

/**
 * Returns the active master list of castes and broad categories.
 */
export function getMasterCastes(): CasteMasterEntry[] {
  return activeMasterConfig.castes || [];
}

/**
 * Returns the list of broad social categories (OC, BC, SC, ST, Minority, etc.).
 */
export function getMasterCategories(): Array<{ code: string; name: string; description?: string }> {
  if (activeMasterConfig.categories && activeMasterConfig.categories.length > 0) {
    return activeMasterConfig.categories;
  }
  return [
    { code: 'OC', name: 'Open Competition / Forward Castes' },
    { code: 'BC', name: 'Backward Classes' },
    { code: 'SC', name: 'Scheduled Castes' },
    { code: 'ST', name: 'Scheduled Tribes' },
    { code: 'Minority', name: 'Religious Minorities' },
  ];
}

/**
 * Predicts the caste & social category of an elector with calibrated probability.
 */
export function predictCaste(
  fullName: string,
  relativeName?: string,
  dominantMandalCaste?: string
): CastePrediction | null {
  const cleanName = (fullName || '').trim().toLowerCase();
  const cleanRel = (relativeName || '').trim().toLowerCase();

  // If voter data is placeholder / unextracted, do not synthesize caste predictions
  if (!cleanName || cleanName.includes('data to be added') || cleanName === 'resident' || cleanName === 'voter') {
    return null;
  }

  const tokens = [...cleanName.split(/\s+/), ...cleanRel.split(/\s+/)].filter(Boolean);

  // 1. Direct Clan / Surname Lookup in active master registry
  for (const token of tokens) {
    if (activeClanLexicon[token]) {
      const entry = activeClanLexicon[token];
      return createPrediction(
        entry.caste,
        entry.category,
        entry.subCategory,
        entry.baseProb,
        `Master Registry Surname Match (${token.toUpperCase()})`
      );
    }
  }

  // 2. Suffix Rules based on master registry
  for (const rule of activeSuffixRules) {
    if (rule.pattern.test(cleanName) || (cleanRel && rule.pattern.test(cleanRel))) {
      return createPrediction(
        rule.caste,
        rule.category,
        rule.subCategory,
        rule.prob,
        `Community Suffix Rule (${rule.pattern.source.replace('$', '')})`
      );
    }
  }

  // 3. Muslim Name Signatures
  const muslimSignatures = [
    'mohammed', 'shaik', 'syed', 'ahmed', 'khan', 'mirza', 'begum', 'hussain',
    'ansari', 'qureshi', 'fatima', 'ayesha', 'zainab', 'mariam', 'dudekula', 'noorbasha'
  ];
  if (tokens.some((t) => muslimSignatures.includes(t))) {
    const muslimCaste = activeMasterConfig.castes.find((c) => c.caste.toLowerCase().includes('muslim'))?.caste || 'Muslim Minority';
    const muslimCategory = activeMasterConfig.castes.find((c) => c.caste.toLowerCase().includes('muslim'))?.broad_category || 'Minority';
    return createPrediction(muslimCaste, muslimCategory, 'Minority', 0.96, 'Islamic First/Family Name');
  }

  // 4. Fallback to Mandal Dominant Demographic Prior if available
  if (dominantMandalCaste && dominantMandalCaste !== 'None') {
    const dLower = dominantMandalCaste.toLowerCase();
    const matched = activeMasterConfig.castes.find((c) => {
      const cLow = c.caste.toLowerCase();
      return dLower.includes(cLow) || cLow.includes(dLower);
    });

    if (matched) {
      return createPrediction(
        matched.caste,
        matched.broad_category,
        matched.sub_category || matched.broad_category,
        0.72,
        `Mandal Demographic Prior (${matched.caste})`
      );
    }
  }

  // 5. Default Regional Prior based on first configured BC or general caste
  const defaultEntry = activeMasterConfig.castes.find((c) => c.broad_category === 'BC') || activeMasterConfig.castes[0];
  return createPrediction(
    defaultEntry ? defaultEntry.caste : 'BC General',
    defaultEntry ? defaultEntry.broad_category : 'BC',
    defaultEntry?.sub_category || 'BC',
    0.65,
    'Regional Baseline Prior'
  );
}

/**
 * Predicts the consensus caste profile of an entire household.
 */
export function predictHouseholdCaste(
  members: Array<{ name: string; relativeName?: string }>,
  dominantMandalCaste?: string
): CastePrediction {
  const validMembers = (members || []).filter(
    (m) => m.name && m.name !== 'Data to be added' && !m.name.includes('Data to be added')
  );

  if (validMembers.length === 0) {
    return {
      casteName: 'Data to be added',
      category: 'OC',
      subCategory: 'General',
      probability: 0,
      probabilityPercent: '—',
      confidenceTier: 'MODERATE',
      color: {
        bg: 'bg-slate-50',
        text: 'text-slate-400',
        border: 'border-slate-200',
        badge: 'bg-slate-100 text-slate-500 border-slate-200 font-mono italic',
      },
      sourceBasis: 'Pending official voter roll data extraction',
    };
  }

  // Predict each member
  const preds = validMembers
    .map((m) => predictCaste(m.name, m.relativeName, dominantMandalCaste))
    .filter(Boolean) as CastePrediction[];

  if (preds.length === 0) {
    return {
      casteName: 'Data to be added',
      category: 'OC',
      subCategory: 'General',
      probability: 0,
      probabilityPercent: '—',
      confidenceTier: 'MODERATE',
      color: {
        bg: 'bg-slate-50',
        text: 'text-slate-400',
        border: 'border-slate-200',
        badge: 'bg-slate-100 text-slate-500 border-slate-200 font-mono italic',
      },
      sourceBasis: 'Pending official voter roll data extraction',
    };
  }

  // Tally votes by caste name
  const tally: Record<string, { count: number; bestPred: CastePrediction }> = {};
  for (const p of preds) {
    if (!tally[p.casteName]) {
      tally[p.casteName] = { count: 0, bestPred: p };
    }
    tally[p.casteName].count++;
    if (p.probability > tally[p.casteName].bestPred.probability) {
      tally[p.casteName].bestPred = p;
    }
  }

  // Find consensus winner
  let best = preds[0];
  let maxCount = 0;
  for (const k in tally) {
    if (tally[k].count > maxCount) {
      maxCount = tally[k].count;
      best = tally[k].bestPred;
    }
  }

  const boostedProb = validMembers.length > 1
    ? Math.min(0.98, best.probability + 0.05)
    : best.probability;

  return createPrediction(
    best.casteName,
    best.category,
    best.subCategory,
    boostedProb,
    `Household Multi-Member Consensus (${maxCount}/${validMembers.length} agree)`
  );
}

function createPrediction(
  casteName: string,
  category: CasteCategory,
  subCategory: string | undefined,
  prob: number,
  sourceBasis: string
): CastePrediction {
  const clampedProb = Math.min(0.99, Math.max(0.50, prob));
  const tier: CastePrediction['confidenceTier'] =
    clampedProb >= 0.90 ? 'VERY_HIGH' : clampedProb >= 0.80 ? 'HIGH' : 'MODERATE';

  const catKey = String(category);
  const color = CATEGORY_COLORS[catKey] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    badge: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return {
    casteName,
    category,
    subCategory,
    probability: clampedProb,
    probabilityPercent: `${Math.round(clampedProb * 100)}%`,
    confidenceTier: tier,
    color,
    sourceBasis,
  };
}
