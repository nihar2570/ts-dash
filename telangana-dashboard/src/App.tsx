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
import { MapPin } from 'lucide-react';
import { HelpModal } from './components/HelpModal';
import { HeaderBar } from './components/HeaderBar';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('results');
  const [selectedYear, setSelectedYear] = useState<Year>('2023');
  const [viewMode, setViewMode] = useState<ViewMode>('winner');
  const [isExecutiveBriefingOpen, setIsExecutiveBriefingOpen] = useState(false);
const [helpOpen, setHelpOpen] = useState(false);
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
  const isDossierRoute = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('dossier');

  const handleOpenDossier = (acNo: number, tab?: string) => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('dossier', String(acNo));
    if (tab) url.searchParams.set('tab', tab);
    window.open(url.toString(), '_blank');
  };
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

  const allConstituenciesList = electionData
    ? Object.values(electionData.results['2023'] || {})
        .map((r) => ({
          ac_no: r.ac_no,
          ac_name: r.ac_name,
          district: r.district,
        }))
        .sort((a, b) => a.ac_no - b.ac_no)
    : [];

  // Standalone Full-Page Dossier Mode (when loaded with ?dossier=<ac_no>)
  if (isDossierRoute && candidatesData && selectedAcNo) {
    return (
      <ConstituencyDossier
        data={candidatesData[String(selectedAcNo)] || null}
        isOpen={true}
        seeepcData={seeepcData}
        geoJsonData={geoJsonData}
        allConstituencies={allConstituenciesList}
        electionData={electionData}
        onSelectAc={(acNo) => {
          setSelectedAcNo(acNo);
          const url = new URL(window.location.href);
          url.searchParams.set('dossier', String(acNo));
          window.history.replaceState({}, '', url.pathname + url.search);
        }}
        onClose={() => {
          const url = new URL(window.location.href);
          url.searchParams.delete('view');
          url.searchParams.delete('dossier');
          url.searchParams.delete('tab');
          window.location.href = url.pathname + (url.search ? url.search : '');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 pb-12">
      {/* Navbar / Header */}
      <HeaderBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        viewMode={viewMode}
        setViewMode={setViewMode}
        electionData={electionData}
        setSelectedAcNo={setSelectedAcNo}
        onOpenDossier={(acNo) => handleOpenDossier(acNo)}
        seeepcData={seeepcData}
        setIsExecutiveBriefingOpen={setIsExecutiveBriefingOpen}
        onHelpOpen={() => setHelpOpen(true)}
      />

      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

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
                  onOpenDossier={(acNo) => handleOpenDossier(acNo || selectedAcNo || 40)}
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
                onOpenDossier={(acNo) => handleOpenDossier(acNo)}
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
            onSelectConstituencyDossier={(acNo) => handleOpenDossier(acNo)}
          />
        )}

        {/* Actions Tab: Campaign Playbook & Strategic Point Allocator */}
        {activeTab === 'actions' && seeepcData && (
          <ActionsView
            data={seeepcData}
            initialSelectedAc={selectedAcNo}
            onOpenDossier={(acNo) => handleOpenDossier(acNo)}
          />
        )}
      </main>

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
