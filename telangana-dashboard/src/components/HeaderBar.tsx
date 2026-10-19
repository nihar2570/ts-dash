import React, { useState } from 'react';
import { Search, HelpCircle, FileText } from 'lucide-react';
import type { Year, ViewMode, SeeepcDataset, ElectionData, ActiveTab } from '../types';

interface HeaderBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedYear: Year;
  setSelectedYear: (year: Year) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  electionData: ElectionData | null;
  setSelectedAcNo: (acNo: number) => void;
  onOpenDossier?: (acNo: number) => void;
  seeepcData?: SeeepcDataset | null;
  setIsExecutiveBriefingOpen: (open: boolean) => void;
  onHelpOpen: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeTab,
  setActiveTab,
  selectedYear,
  setSelectedYear,
  viewMode,
  setViewMode,
  electionData,
  setSelectedAcNo,
  onOpenDossier,
  seeepcData,
  setIsExecutiveBriefingOpen,
  onHelpOpen,
}) => {
  const [search, setSearch] = useState('');

  const years: Year[] = ['2014', '2018', '2023'];

  const handleAcSearch = () => {
    if (!electionData) return;
    const yearResults = electionData.results[selectedYear] || {};
    const matches = Object.entries(yearResults).find(
      ([, res]) =>
        res.ac_name.toLowerCase().includes(search.toLowerCase()) ||
        String(res.ac_no) === search.trim()
    );
    if (matches) {
      const acNo = Number(matches[0]);
      setSelectedAcNo(acNo);
      if (onOpenDossier) {
        onOpenDossier(acNo);
      }
    }
  };

  // Press Enter triggers search
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAcSearch();
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-[1100] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Brand */}
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

          {/* Central tab switcher */}
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
              <span
                className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.2 rounded-full border border-indigo-200 font-extrabold"
                title="Socio-Economic, Educational, Employment, Population & Caste Survey (SEEEPC)"
              >
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

          {/* Right side: Executive Briefing, Help */}
          <div className="flex items-center gap-3">
            {seeepcData && (
              <button
                onClick={() => setIsExecutiveBriefingOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs border border-slate-700 transition-all cursor-pointer"
                title="Open 1-Click Executive Strategy Briefing"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Executive Briefing</span>
              </button>
            )}
            <button
              onClick={onHelpOpen}
              className="p-2 rounded-full hover:bg-slate-200 focus:outline-none"
              title="Help &amp; Usage Guide"
            >
              <HelpCircle className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Sub-bar for Results tab: Year/Map view + Search */}
        {activeTab === 'results' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 mt-2 border-t border-slate-100">
            {/* Year selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Election Year:</span>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
                {years.map((y) => (
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

            {/* Map view mode */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Map View:</span>
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
                  Seat Swings
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

            {/* AC Search */}
            <div className="relative w-48">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search AC # or name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={onKeyDown}
                className="w-full text-xs pl-9 pr-2 py-1.5 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

