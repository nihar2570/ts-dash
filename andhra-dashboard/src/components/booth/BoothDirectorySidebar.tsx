import React from 'react';
import { Search, Building } from 'lucide-react';
import type { MandalDetail } from '../../data/mandalData';

export interface BoothSidebarItem {
  boothNo: number;
  name: string;
  mandalName?: string;
  electorate: number;
  winnerParty?: string;
  margin?: number;
  swingVs2019?: number;
  [key: string]: any;
}

interface BoothDirectorySidebarProps {
  filteredBoothsList: BoothSidebarItem[];
  allBoothsCount: number;
  selectedBoothNo: number;
  onSelectBooth: (boothNo: number) => void;
  boothSearch: string;
  setBoothSearch: (val: string) => void;
  mandals: MandalDetail[];
  boothFilterMandal: string;
  setBoothFilterMandal: (val: string) => void;
  selectedAcNo?: number;
}

export const BoothDirectorySidebar: React.FC<BoothDirectorySidebarProps> = ({
  filteredBoothsList,
  allBoothsCount,
  selectedBoothNo,
  onSelectBooth,
  boothSearch,
  setBoothSearch,
  mandals,
  boothFilterMandal,
  setBoothFilterMandal,
  selectedAcNo: _selectedAcNo = 1,
}) => {
  return (
    <div id="booth-catalog" className="lg:col-span-3 space-y-3 print:hidden scroll-mt-24">
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-indigo-600" />
            Booth Directory
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {filteredBoothsList.length === allBoothsCount
              ? `${allBoothsCount} booths`
              : `${filteredBoothsList.length} of ${allBoothsCount} booths`}
          </span>
        </div>

        {/* Booth Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search booth no. or school..."
            value={boothSearch}
            onChange={(e) => setBoothSearch(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-slate-900"
          />
        </div>

        {/* Mandal Filter */}
        {mandals.length > 0 && (
          <div className="space-y-1.5">
            <select
              value={boothFilterMandal}
              onChange={(e) => setBoothFilterMandal(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium cursor-pointer"
            >
              <option value="ALL">All Mandals ({mandals.length})</option>
              {mandals.map((m) => (
                <option key={m.mandal_id} value={m.name}>
                  {m.name} ({m.booths} booths)
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-1 pt-0.5">
              <button
                type="button"
                onClick={() => setBoothFilterMandal('ALL')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                  boothFilterMandal === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {mandals.map((m) => {
                const isSelected = boothFilterMandal.toLowerCase() === m.name.toLowerCase();
                return (
                  <button
                    key={m.mandal_id}
                    type="button"
                    onClick={() => setBoothFilterMandal(isSelected ? 'ALL' : m.name)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer truncate max-w-[90px] ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title={`${m.name} (${m.booths} booths)`}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Scrollable Booth List */}
        <div className="max-h-[640px] overflow-y-auto space-y-1.5 pr-1">
          {filteredBoothsList.map((b) => {
            const isSelected = b.boothNo === selectedBoothNo;
            return (
              <div
                key={b.boothNo}
                onClick={() => onSelectBooth(b.boothNo)}
                className={`w-full text-left p-2 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-400 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-bold text-slate-900 font-mono">
                      Booth #{b.boothNo}
                    </span>
                    {b.winnerParty && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1 py-0.2 rounded border shrink-0 ${
                          b.winnerParty === 'TDP'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : b.winnerParty === 'YSRCP'
                            ? 'bg-blue-100 text-blue-900 border-blue-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {b.winnerParty} {b.margin ? `+${b.margin}` : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {b.swingVs2019 !== undefined && !isNaN(b.swingVs2019) && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1 rounded flex items-center gap-0.5 ${
                          b.swingVs2019 >= 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                        title="5-Year TDP vote swing vs 2019"
                      >
                        {b.swingVs2019 >= 0 ? `+${b.swingVs2019.toFixed(0)}%` : `${b.swingVs2019.toFixed(0)}%`}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-500">
                      {b.electorate}v
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 mt-0.5 gap-2">
                  <p className="truncate" title={b.name}>
                    {b.name.replace(`Polling Station #${b.boothNo} - `, '')}
                  </p>
                  {b.mandalName && (
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                      {b.mandalName}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
