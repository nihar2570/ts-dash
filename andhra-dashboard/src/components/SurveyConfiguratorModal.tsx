import React, { useState, useEffect } from 'react';
import {
  X,
  RotateCcw,
  Save,
  Download,
  CheckCircle2,
  Sliders,
  ChevronDown,
  Info,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
} from 'lucide-react';
import type { CasteSurveyDataset, CasteSurveyCommunityPref } from '../data/surveyScenarioService';
import {
  saveCustomSurvey,
  exportSurveyAsJsonFile,
  calculateSwingsFromPreferences,
  BASELINE_2024_CASTE_SHARES,
  BUNDLED_SURVEYS,
} from '../data/surveyScenarioService';
import type { PartySwing } from './SwingStudioModal';

export const READABLE_COMMUNITY_LABELS: Record<string, { label: string; group: string; shareOfElectors: string }> = {
  kapu: { label: 'Kapu / Balija / Telaga', group: 'OC / Agrarian & Urban', shareOfElectors: '~15.2%' },
  kamma: { label: 'Kamma', group: 'OC / Agrarian & Industrial', shareOfElectors: '~4.8%' },
  reddy: { label: 'Reddy', group: 'OC / Agrarian & Factional', shareOfElectors: '~6.5%' },
  bc_turpu_kapu: { label: 'BC Turpu Kapu', group: 'BC-D / North Coastal', shareOfElectors: '~7.2%' },
  bc_yadava: { label: 'BC Yadava / Golla', group: 'BC-D / Pastoralist & Agrarian', shareOfElectors: '~8.1%' },
  bc_kuruba_boya: { label: 'BC Kuruba / Boya / Valmiki', group: 'BC-A / Rayalaseema Kingmakers', shareOfElectors: '~9.4%' },
  bc_settibalija_goud: { label: 'BC Settibalija / Goud / Ediga', group: 'BC-B / Coastal & Rayalaseema', shareOfElectors: '~5.8%' },
  bc_padmashali: { label: 'BC Padmashali / Weavers', group: 'BC-B / Artisan & Weavers', shareOfElectors: '~3.4%' },
  bc_other: { label: 'Other BC Communities', group: 'BC / Artisan, Service & Fishermen', shareOfElectors: '~15.1%' },
  sc_madiga_relli: { label: 'SC Madiga / Relli', group: 'SC / Sub-categorized', shareOfElectors: '~8.9%' },
  sc_mala: { label: 'SC Mala', group: 'SC / Coastal & Central', shareOfElectors: '~8.3%' },
  st_tribal: { label: 'ST Agency Tribals / Sugali', group: 'ST / Agency & Plains', shareOfElectors: '~5.5%' },
  minority_muslim: { label: 'Muslim Minorities', group: 'Minority / Shaik, Dudekula', shareOfElectors: '~7.3%' },
  minority_christian: { label: 'Christian Minorities', group: 'Minority / Coastal & Rayalaseema', shareOfElectors: '~2.8%' },
};

interface SurveyConfiguratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSurvey: CasteSurveyDataset;
  allSurveys: CasteSurveyDataset[];
  onSelectSurvey: (survey: CasteSurveyDataset) => void;
  onApplySwings: (swings: Record<string, PartySwing>, updatedSurvey?: CasteSurveyDataset) => void;
}

export const SurveyConfiguratorModal: React.FC<SurveyConfiguratorModalProps> = ({
  isOpen,
  onClose,
  activeSurvey,
  allSurveys,
  onSelectSurvey,
  onApplySwings,
}) => {
  const [preferences, setPreferences] = useState<Record<string, CasteSurveyCommunityPref>>({});
  const [customTitle, setCustomTitle] = useState<string>('');
  const [showSavePrompt, setShowSavePrompt] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'SLIDERS' | 'FINDINGS' | 'METHODOLOGY'>('SLIDERS');

  // Initialize preferences when survey changes
  useEffect(() => {
    if (activeSurvey) {
      setPreferences(JSON.parse(JSON.stringify(activeSurvey.castePreferences)));
      setCustomTitle(`${activeSurvey.shortTitle} (Custom Tuned)`);
    }
  }, [activeSurvey]);

  if (!isOpen || !activeSurvey) return null;

  // Handle preference slider change for a caste
  const handlePreferenceChange = (commKey: string, party: 'TDP' | 'JSP' | 'YSRCP', delta: number) => {
    setPreferences((prev) => {
      const current = prev[commKey] || { TDP: 40, JSP: 10, YSRCP: 45, INC: 3, OTH: 2 };
      const updated = { ...current };

      if (party === 'TDP' || party === 'JSP') {
        // Shifting toward / away from NDA
        const newPartyVal = Math.max(5, Math.min(90, Math.round(delta)));
        const shift = newPartyVal - current[party];
        updated[party] = newPartyVal;
        // Offset inversely from YSRCP
        updated.YSRCP = Math.max(5, Math.min(90, Math.round(current.YSRCP - shift)));
      } else if (party === 'YSRCP') {
        const newYsrcpVal = Math.max(5, Math.min(90, Math.round(delta)));
        const shift = newYsrcpVal - current.YSRCP;
        updated.YSRCP = newYsrcpVal;
        // Offset inversely from TDP / JSP proportionally
        const totalNda = current.TDP + current.JSP;
        if (totalNda > 0) {
          const tdpRatio = current.TDP / totalNda;
          const jspRatio = current.JSP / totalNda;
          updated.TDP = Math.max(5, Math.min(90, Math.round(current.TDP - shift * tdpRatio)));
          updated.JSP = Math.max(2, Math.min(50, Math.round(current.JSP - shift * jspRatio)));
        }
      }

      return {
        ...prev,
        [commKey]: updated,
      };
    });
  };

  // Reset to original preset values
  const handleReset = () => {
    if (BUNDLED_SURVEYS[activeSurvey.id]) {
      setPreferences(JSON.parse(JSON.stringify(BUNDLED_SURVEYS[activeSurvey.id].castePreferences)));
    } else {
      setPreferences(JSON.parse(JSON.stringify(activeSurvey.castePreferences)));
    }
  };

  // Apply to active simulation
  const handleApply = () => {
    const computedSwings = calculateSwingsFromPreferences(preferences);
    const updatedSurvey: CasteSurveyDataset = {
      ...activeSurvey,
      castePreferences: preferences,
      casteSwings: computedSwings,
    };
    onApplySwings(computedSwings, updatedSurvey);
    onClose();
  };

  // Save as Custom Survey
  const handleSaveCustom = () => {
    if (!customTitle.trim()) return;
    const computedSwings = calculateSwingsFromPreferences(preferences);
    const customSurvey: CasteSurveyDataset = {
      ...activeSurvey,
      id: `custom_survey_${Date.now()}`,
      title: customTitle.trim(),
      shortTitle: customTitle.trim(),
      agency: `Custom Strategy Model (based on ${activeSurvey.shortTitle})`,
      conductedDate: 'Configured Live',
      castePreferences: preferences,
      casteSwings: computedSwings,
      isCustom: true,
    };
    saveCustomSurvey(customSurvey);
    setShowSavePrompt(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 2500);
    onSelectSurvey(customSurvey);
  };

  // Download JSON
  const handleDownload = () => {
    const computedSwings = calculateSwingsFromPreferences(preferences);
    const downloadSurvey: CasteSurveyDataset = {
      ...activeSurvey,
      castePreferences: preferences,
      casteSwings: computedSwings,
    };
    exportSurveyAsJsonFile(downloadSurvey);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 border border-indigo-400/30 rounded-xl">
              <Sliders className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">{activeSurvey.title}</h2>
                <span className="text-[11px] bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-mono px-2 py-0.5 rounded-full font-bold">
                  {activeSurvey.sampleSize?.toLocaleString()} Sample
                </span>
                {activeSurvey.isCustom && (
                  <span className="text-[11px] bg-amber-500/30 text-amber-200 border border-amber-400/30 font-mono px-2 py-0.5 rounded-full font-bold">
                    Custom Tuned
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-200/80">
                {activeSurvey.agency} &bull; Margin of Error: {activeSurvey.marginOfError} &bull; Field: {activeSurvey.conductedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Switcher Dropdown */}
            <div className="relative">
              <select
                value={activeSurvey.id}
                onChange={(e) => {
                  const target = allSurveys.find((s) => s.id === e.target.value);
                  if (target) onSelectSurvey(target);
                }}
                className="bg-slate-800/90 text-xs text-indigo-100 border border-indigo-400/30 rounded-lg px-3 py-1.5 font-bold cursor-pointer hover:bg-slate-700 transition-colors pr-7 appearance-none"
              >
                {allSurveys.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-indigo-300 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('SLIDERS')}
              className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'SLIDERS'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Caste Demography Sliders (14 Communities)</span>
            </button>
            <button
              onClick={() => setActiveTab('FINDINGS')}
              className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'FINDINGS'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Key Field Findings &amp; Regional Analysis</span>
            </button>
            <button
              onClick={() => setActiveTab('METHODOLOGY')}
              className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'METHODOLOGY'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Methodology &amp; Sampling Audit</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset all community sliders back to official survey report"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-2.5 py-1 text-xs text-indigo-700 hover:bg-indigo-100 rounded-md font-bold flex items-center gap-1 cursor-pointer transition-colors border border-indigo-200"
              title="Export this survey configuration as JSON"
            >
              <Download className="w-3 h-3" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {saveSuccessNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Custom survey successfully saved! It is now loaded into your active session.</span>
            </div>
          )}

          {activeTab === 'SLIDERS' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-start justify-between gap-4 text-xs text-indigo-950">
                <div className="space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-indigo-900">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Real-Time Caste Preference Tuner:</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    Adjust the vote share sliders for any community below. The war room simulation engine dynamically maps these shifts against the 2026 voter rolls across all 175 constituencies.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-1 rounded border border-amber-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span>NDA (TDP+JSP)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-900 bg-sky-100 px-2 py-1 rounded border border-sky-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" />
                    <span>YSRCP</span>
                  </div>
                </div>
              </div>

              {/* Grid of 14 Caste Communities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {Object.entries(READABLE_COMMUNITY_LABELS).map(([commKey, meta]) => {
                  const currentPref = preferences[commKey] || { TDP: 40, JSP: 10, YSRCP: 45, INC: 3, OTH: 2 };
                  const ndaTotal = (currentPref.TDP || 0) + (currentPref.JSP || 0);
                  const ysrcpTotal = currentPref.YSRCP || 0;
                  const basePref = BASELINE_2024_CASTE_SHARES[commKey] || { TDP: 40, JSP: 10, YSRCP: 45 };
                  const baseNda = (basePref.TDP || 0) + (basePref.JSP || 0);
                  const ndaDiff = Math.round((ndaTotal - baseNda) * 10) / 10;

                  return (
                    <div
                      key={commKey}
                      className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs hover:border-indigo-300 transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-slate-900">{meta.label}</h4>
                            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                              {meta.shareOfElectors}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">{meta.group}</span>
                        </div>

                        <div className="flex items-center gap-2 text-right shrink-0">
                          <span className="text-[11px] font-mono font-black text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            NDA: {ndaTotal}%
                          </span>
                          <span className="text-[11px] font-mono font-black text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                            YSR: {ysrcpTotal}%
                          </span>
                          {ndaDiff !== 0 && (
                            <span
                              className={`text-[10px] font-mono font-bold px-1 rounded ${
                                ndaDiff > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {ndaDiff > 0 ? `+${ndaDiff}%` : `${ndaDiff}%`}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Visual Bar */}
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                        <div
                          style={{ width: `${Math.min(100, Math.max(0, ndaTotal))}%` }}
                          className="bg-amber-500 h-full transition-all duration-300"
                        />
                        <div
                          style={{ width: `${Math.min(100, Math.max(0, ysrcpTotal))}%` }}
                          className="bg-sky-600 h-full transition-all duration-300"
                        />
                        <div
                          style={{
                            width: `${Math.max(0, 100 - (ndaTotal + ysrcpTotal))}%`,
                          }}
                          className="bg-slate-300 h-full"
                        />
                      </div>

                      {/* Slider Controls */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-0.5">
                            <span className="font-semibold text-amber-800">TDP Component:</span>
                            <span className="font-mono font-bold">{currentPref.TDP}%</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="90"
                            step="1"
                            value={currentPref.TDP}
                            onChange={(e) => handlePreferenceChange(commKey, 'TDP', parseFloat(e.target.value))}
                            className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-0.5">
                            <span className="font-semibold text-sky-800">YSRCP Preference:</span>
                            <span className="font-mono font-bold">{currentPref.YSRCP}%</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="90"
                            step="1"
                            value={currentPref.YSRCP}
                            onChange={(e) => handlePreferenceChange(commKey, 'YSRCP', parseFloat(e.target.value))}
                            className="w-full accent-sky-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'FINDINGS' && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-indigo-600" />
                  <span>Executive Assessment Summary</span>
                </h3>
                <p className="text-xs text-slate-800 leading-relaxed font-serif">
                  {activeSurvey.executiveSummary}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Key Caste Demographic Findings</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeSurvey.keyCasteFindings?.map((finding, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 flex items-start gap-2.5 shadow-2xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{finding}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>Tri-Zone Regional Strategic Breakdown</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block">
                      Uttarandhra (34 ACs)
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {activeSurvey.regionalInsights?.uttarandhra}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                      Kosta Andhra (89 ACs)
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {activeSurvey.regionalInsights?.kostaAndhra}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                      Rayalaseema (52 ACs)
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {activeSurvey.regionalInsights?.rayalaseema}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'METHODOLOGY' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Polling Methodology &amp; Protocol
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeSurvey.methodology}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Total Respondents</span>
                  <p className="text-lg font-black text-indigo-900 font-mono">
                    {activeSurvey.sampleSize?.toLocaleString()}
                  </p>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Margin of Error</span>
                  <p className="text-lg font-black text-slate-800 font-mono">
                    {activeSurvey.marginOfError}
                  </p>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Constituencies Covered</span>
                  <p className="text-lg font-black text-emerald-800 font-mono">
                    175 / 175 ACs
                  </p>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Field Study Window</span>
                  <p className="text-lg font-black text-slate-800 font-mono">
                    {activeSurvey.conductedDate}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {!showSavePrompt ? (
              <button
                onClick={() => setShowSavePrompt(true)}
                className="px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-200 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-300"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save as Custom Scenario...</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Custom Scenario Name..."
                  className="px-2.5 py-1 text-xs border border-indigo-400 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={handleSaveCustom}
                  className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSavePrompt(false)}
                  className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5 ring-2 ring-indigo-400/40"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Survey Matrix to 175 ACs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
