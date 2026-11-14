import React from 'react';
import { Search, HelpCircle, Printer } from 'lucide-react';
import type { Year, ViewMode, DemographicsDataset, ElectionData, ActiveTab } from '../types';
import { useDashboard } from '../context/DashboardContext';

interface HeaderBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedYear: Year;
  setSelectedYear: (year: Year) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  electionData: ElectionData | null;
  setSelectedAcNo?: (acNo: number) => void;
  onOpenDossier?: (acNo: number) => void;
  demographicsData?: DemographicsDataset | null;
  setIsExecutiveBriefingOpen?: (open: boolean) => void;
  onHelpOpen: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeTab,
  setActiveTab,
  selectedYear: _selectedYear,
  setSelectedYear: _setSelectedYear,
  viewMode: _viewMode,
  setViewMode: _setViewMode,
  electionData: _electionData,
  setSelectedAcNo: _setSelectedAcNo,
  onOpenDossier: _onOpenDossier,
  demographicsData: _demographicsData,
  setIsExecutiveBriefingOpen: _setIsExecutiveBriefingOpen,
  onHelpOpen,
}) => {
  const { setIsCommandPaletteOpen } = useDashboard();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-[1100] shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-500 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-xs shrink-0">
              EI
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                Election Intelligence
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Andhra Pradesh &middot; 175 Constituencies War Room
              </p>
            </div>
          </div>

          {/* Central tab switcher: Arranged into two distinct functional groups */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
            {/* Group 1: Ground & Constituency Intelligence */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs gap-0.5 shrink-0">
              <span className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-400 select-none hidden xl:inline-block">
                Ground
              </span>

              {/* 1. Results & Map */}
              <button
                onClick={() => setActiveTab('results')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'results'
                    ? 'bg-white text-indigo-700 shadow-xs font-black ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Historical Election Results & Choropleth Map"
              >
                <span>📊 Results &amp; Map</span>
              </button>

              {/* 2. AC Dossier (Standalone Tab) */}
              <button
                onClick={() => setActiveTab('dossier')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'dossier'
                    ? 'bg-white text-indigo-700 shadow-xs font-black ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Constituency Dossier: Candidate Affidavits, Caste Demographics & Turnout Swings"
              >
                <span>🏛️ AC Dossier</span>
              </button>

              {/* 3. Voter Rolls & Polling Stations (Ground Execution) */}
              <button
                onClick={() => setActiveTab('booth-data')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'booth-data'
                    ? 'bg-white text-indigo-700 shadow-xs font-black ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="E-Panna Sheet, Polling Station Triage & Padayatra Street Routes"
              >
                <span>📋 Voter Rolls</span>
              </button>
            </div>

            {/* Subtle Divider */}
            <div className="h-6 w-px bg-slate-200 shrink-0 hidden md:block" />

            {/* Group 2: War Room & Strategic Action */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs gap-0.5 shrink-0">
              <span className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-400 select-none hidden xl:inline-block">
                Strategy
              </span>

              {/* 4. Simulations (Forward Forecasts) */}
              <button
                onClick={() => setActiveTab('simulations')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'simulations'
                    ? 'bg-white text-indigo-700 shadow-xs font-black ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Chief Advisor What-If Scenarios & Assembly Majority Barometer"
              >
                <span>🔮 Simulations</span>
              </button>

              {/* 5. Playbook & Actions (Strategy & Allocation) */}
              <button
                onClick={() => setActiveTab('actions')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'actions'
                    ? 'bg-white text-indigo-700 shadow-xs font-black ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Campaign Playbook: Star Campaigners, Resource Allocator & Defection Modeler"
              >
                <span>🎯 Playbook</span>
              </button>

              {/* 6. Voter Reach & Cadence (Audience & Messaging) */}
              <button
                onClick={() => setActiveTab('reach')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'reach'
                    ? 'bg-white text-indigo-700 shadow-xs font-black ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Statewide Caste & Age Micro-Targeting and 5-10 Touch Campaign Cadence"
              >
                <span>📢 Voter Reach</span>
              </button>
            </div>
          </div>

          {/* Top Right Corner: Compact Icons by default, expand with label on hover */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Search Icon Trigger for Command Palette (Ctrl + K / /) */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="group relative flex items-center h-8 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-all duration-300 ease-out cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 overflow-hidden shrink-0"
              title="Search constituencies, castes, and tools (Ctrl + K / /)"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-slate-600 group-hover:text-slate-900 shrink-0 transition-transform duration-200 group-hover:scale-105" />
              <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1.5 whitespace-nowrap text-xs font-bold transition-all duration-300 ease-out overflow-hidden text-slate-800">
                Search
              </span>
            </button>

            {/* Print / Save PDF Button */}
            <button
              onClick={() => window.print()}
              className="group relative flex items-center h-8 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-all duration-300 ease-out cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 overflow-hidden print:hidden shrink-0"
              title="Print Page or Save as PDF"
              aria-label="Print"
            >
              <Printer className="w-4 h-4 text-slate-600 group-hover:text-slate-900 shrink-0 transition-transform duration-200 group-hover:scale-105" />
              <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1.5 whitespace-nowrap text-xs font-bold transition-all duration-300 ease-out overflow-hidden text-slate-800">
                Print
              </span>
            </button>

            {/* Thorough Help & Knowledge Base Modal Trigger */}
            <button
              onClick={onHelpOpen}
              className="group relative flex items-center h-8 px-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all duration-300 ease-out cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 overflow-hidden shrink-0"
              title="Comprehensive War Room Manual, Mandate Architecture, Demographic Playbooks & Tactical Solvers (?)"
              aria-label="Help & Guides"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600 group-hover:text-indigo-800 shrink-0 transition-transform duration-200 group-hover:scale-105" />
              <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1.5 whitespace-nowrap text-xs font-bold transition-all duration-300 ease-out overflow-hidden text-indigo-900">
                Help &amp; Guides
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
