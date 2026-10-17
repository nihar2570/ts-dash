import { useState, useEffect } from 'react';
import type {
  ElectionData,
  Year,
  ViewMode,
  ConstituencyCandidatesData,
  ActiveTab,
  SeeepcDataset,
} from './types';
import { TelanganaMap } from './components/TelanganaMap';
import { SeatTallyBar } from './components/SeatTallyBar';
import { ConstituencyCard } from './components/ConstituencyCard';
import { ConstituencyTable } from './components/ConstituencyTable';
import { ConstituencyDossier } from './components/ConstituencyDossier';
import { SimulationsView } from './components/SimulationsView';
import { ActionsView } from './components/ActionsView';
import { ExecutiveBriefingModal } from './components/ExecutiveBriefingModal';
import { MapPin, FileText } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('results');
  const [selectedYear, setSelectedYear] = useState<Year>('2023');
  const [viewMode, setViewMode] = useState<ViewMode>('winner');
  const [isExecutiveBriefingOpen, setIsExecutiveBriefingOpen] = useState(false);
  const [selectedAcNo, setSelectedAcNo] = useState<number | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const dossierParam = params.get('dossier');
      if (dossierParam) {
        const ac = parseInt(dossierParam, 10);
        if (!isNaN(ac) && ac >= 1 && ac <= 119) return ac;
      }
    }
    return 40; // Default to Gajwel (#40)
  });

  const [electionData, setElectionData] = useState<ElectionData | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<any | null>(null);
  const [districtGeoJsonData, setDistrictGeoJsonData] = useState<any | null>(null);
  const [candidatesData, setCandidatesData] = useState<Record<string, ConstituencyCandidatesData> | null>(null);
  const [seeepcData, setSeeepcData] = useState<SeeepcDataset | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.has('dossier');
    }
    return false;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [geoRes, electRes, distRes, candRes, seeepcRes] = await Promise.all([
          fetch('/data/telangana_assembly.geojson'),
          fetch('/data/telangana_elections.json'),
          fetch('/data/telangana_districts.geojson').catch(() => null),
          fetch('/data/telangana_candidates_2023.json').catch(() => null),
          fetch('/data/telangana_seeepc_demographics.json').catch(() => null),
        ]);

        if (!geoRes.ok || !electRes.ok) {
          throw new Error('Failed to load local election or map data.');
        }

        const geo = await geoRes.json();
        const elect = await electRes.json();
        const dist = distRes && distRes.ok ? await distRes.json() : null;
        const cand = candRes && candRes.ok ? await candRes.json() : null;
        const seeepc = seeepcRes && seeepcRes.ok ? await seeepcRes.json() : null;

        setGeoJsonData(geo);
        setElectionData(elect);
        setDistrictGeoJsonData(dist);
        setCandidatesData(cand);
        setSeeepcData(seeepc);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading dashboard data');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-lg font-bold tracking-wider">Loading Telangana Election Intelligence...</div>
        <div className="text-xs text-slate-400">Loading 119 constituencies & 2014-2023 historical records</div>
      </div>
    );
  }

  if (error || !electionData || !geoJsonData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl border border-rose-200 shadow-md max-w-md text-center">
          <div className="text-rose-600 font-bold mb-2">Failed to load datasets</div>
          <div className="text-xs text-slate-600 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentYearResults = electionData.results[selectedYear] || {};
  const currentSummary = electionData.summary[selectedYear];

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 pb-12">
      {/* Navbar / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-[1100] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: Title & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-pink-500 rounded-lg flex items-center justify-center text-white font-black text-base shadow-xs">
                TS
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  Telangana Election Intelligence
                </h1>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Interactive Historical Map &amp; Analytics across 119 Constituencies
                </p>
              </div>
            </div>

            {/* Center: Primary Tab Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs">
              <button
                onClick={() => setActiveTab('results')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'results'
                    ? 'bg-white text-indigo-700 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>📊 Results &amp; Map</span>
              </button>

              <button
                onClick={() => setActiveTab('simulations')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'simulations'
                    ? 'bg-white text-indigo-700 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🔮 Simulations (War Room)</span>
                <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.2 rounded-full border border-indigo-200 font-extrabold">
                  SEEEPC
                </span>
              </button>

              <button
                onClick={() => setActiveTab('actions')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'actions'
                    ? 'bg-white text-indigo-700 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🎯 Actions &amp; Playbook</span>
              </button>
            </div>

            {/* Right: Feature #11 Global Executive Dossier */}
            {seeepcData && (
              <button
                onClick={() => setIsExecutiveBriefingOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs border border-slate-700 transition-all cursor-pointer"
                title="Open 1-Click Executive Intelligence Briefing Dossier"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Executive Dossier</span>
              </button>
            )}
          </div>

          {/* Sub-bar for Results Tab: Year Selector & Map View Modes */}
          {activeTab === 'results' && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 mt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Election Year:
                </span>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
                  {(['2014', '2018', '2023'] as Year[]).map((y) => (
                    <button
                      key={y}
                      onClick={() => setSelectedYear(y)}
                      className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                        selectedYear === y
                          ? 'bg-white text-indigo-600 shadow-xs font-extrabold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Map View:
                </span>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
                  <button
                    onClick={() => setViewMode('winner')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      viewMode === 'winner'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Party Colors
                  </button>
                  <button
                    onClick={() => setViewMode('margin')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      viewMode === 'margin'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Margins
                  </button>
                  <button
                    onClick={() => setViewMode('swing')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      viewMode === 'swing'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    disabled={selectedYear === '2014'}
                    title={selectedYear === '2014' ? 'No prior election in state history' : 'Seat flip comparison'}
                  >
                    Swings
                  </button>
                  <button
                    onClick={() => setViewMode('district')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      viewMode === 'district'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="View 33 districts in shades of grey"
                  >
                    33 Districts
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-5">
        {activeTab === 'results' && (
          <>
            {/* Seat Tally Progress Bar */}
            {currentSummary && (
              <SeatTallyBar summary={currentSummary} year={selectedYear} />
            )}

            {/* Map + Battle Card Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Map Column (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    Constituency Map ({selectedYear})
                  </span>
                  <span>Click a constituency to lock history card</span>
                </div>

                <div className="h-[620px]">
                  <TelanganaMap
                    geoJsonData={geoJsonData}
                    districtGeoJsonData={districtGeoJsonData}
                    yearResults={currentYearResults}
                    selectedAcNo={selectedAcNo}
                    onSelectAc={setSelectedAcNo}
                    viewMode={viewMode}
                    selectedYear={selectedYear}
                    seeepcData={seeepcData}
                  />
                </div>
              </div>

              {/* Battle Card Column (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <ConstituencyCard
                  selectedAcNo={selectedAcNo}
                  allYearsData={electionData.results}
                  activeYear={selectedYear}
                  candidateData={candidatesData && selectedAcNo ? candidatesData[String(selectedAcNo)] : null}
                  onOpenDossier={() => setIsDossierOpen(true)}
                />
              </div>
            </div>

            {/* Constituency Leaderboard & Search Directory */}
            <div className="pt-2">
              <ConstituencyTable
                results={currentYearResults}
                selectedAcNo={selectedAcNo}
                onSelectAc={setSelectedAcNo}
                year={selectedYear}
                onOpenDossier={(acNo) => {
                  setSelectedAcNo(acNo);
                  setIsDossierOpen(true);
                }}
              />
            </div>
          </>
        )}

        {/* Simulations Tab: War Room & Inverse-Margin Bubble Chart */}
        {activeTab === 'simulations' && seeepcData && (
          <SimulationsView
            data={seeepcData}
            onNavigateToActions={(acNo) => {
              if (acNo) setSelectedAcNo(acNo);
              setActiveTab('actions');
            }}
            onSelectConstituencyDossier={(acNo) => {
              setSelectedAcNo(acNo);
              setIsDossierOpen(true);
            }}
          />
        )}

        {/* Actions Tab: Campaign Playbook & Strategic Point Allocator */}
        {activeTab === 'actions' && seeepcData && (
          <ActionsView
            data={seeepcData}
            initialSelectedAc={selectedAcNo}
            onOpenDossier={(acNo) => {
              setSelectedAcNo(acNo);
              setIsDossierOpen(true);
            }}
          />
        )}
      </main>

      {/* Interactive Constituency Dossier Modal / View */}
      <ConstituencyDossier
        data={candidatesData && selectedAcNo ? candidatesData[String(selectedAcNo)] : null}
        isOpen={isDossierOpen}
        seeepcData={seeepcData}
        onClose={() => {
          setIsDossierOpen(false);
          const url = new URL(window.location.href);
          if (url.searchParams.has('dossier')) {
            url.searchParams.delete('dossier');
            window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
          }
        }}
      />

      {/* Feature #11: Global Executive Intelligence Briefing Modal */}
      {seeepcData && (
        <ExecutiveBriefingModal
          isOpen={isExecutiveBriefingOpen}
          onClose={() => setIsExecutiveBriefingOpen(false)}
          data={seeepcData}
          targetParty="INC"
        />
      )}
    </div>
  );
};

export default App;
