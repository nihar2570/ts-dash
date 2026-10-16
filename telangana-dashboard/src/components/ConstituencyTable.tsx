import React, { useState, useMemo } from 'react';
import type { ConstituencyResult, Year } from '../types';
import { getPartyColor } from '../types';
import { Search, ArrowUpDown } from 'lucide-react';

interface ConstituencyTableProps {
  results: Record<string, ConstituencyResult>;
  selectedAcNo: number | null;
  onSelectAc: (acNo: number) => void;
  year: Year;
  onOpenDossier?: (acNo: number) => void;
}

export const ConstituencyTable: React.FC<ConstituencyTableProps> = ({
  results,
  selectedAcNo,
  onSelectAc,
  year,
  onOpenDossier,
}) => {
  const [search, setSearch] = useState('');
  const [selectedParty, setSelectedParty] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [sortBy, setSortBy] = useState<'ac_no' | 'margin_asc' | 'margin_desc' | 'votes'>('ac_no');

  const list = useMemo(() => Object.values(results), [results]);

  const districts = useMemo(() => {
    const s = new Set<string>();
    list.forEach((r) => {
      if (r.district) s.add(r.district);
    });
    return Array.from(s).sort();
  }, [list]);

  const parties = useMemo(() => {
    const s = new Set<string>();
    list.forEach((r) => {
      if (r.winner?.party) s.add(r.winner.party);
    });
    return Array.from(s).sort();
  }, [list]);

  const filteredAndSorted = useMemo(() => {
    return list
      .filter((r) => {
        const matchesSearch =
          r.ac_name.toLowerCase().includes(search.toLowerCase()) ||
          r.winner.candidate.toLowerCase().includes(search.toLowerCase()) ||
          r.district.toLowerCase().includes(search.toLowerCase()) ||
          String(r.ac_no) === search.trim();

        const matchesParty = selectedParty === 'ALL' || r.winner.party === selectedParty;
        const matchesDistrict = selectedDistrict === 'ALL' || r.district === selectedDistrict;

        return matchesSearch && matchesParty && matchesDistrict;
      })
      .sort((a, b) => {
        if (sortBy === 'margin_asc') return a.margin - b.margin;
        if (sortBy === 'margin_desc') return b.margin - a.margin;
        if (sortBy === 'votes') return b.winner.votes - a.winner.votes;
        return a.ac_no - b.ac_no;
      });
  }, [list, search, selectedParty, selectedDistrict, sortBy]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Controls */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
              {year} Constituency Directory ({filteredAndSorted.length} / 119)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="ac_no">Sort: AC Number (1-119)</option>
                <option value="margin_asc">Sort: Tightest Margin (Battlegrounds)</option>
                <option value="margin_desc">Sort: Highest Margin (Landslides)</option>
                <option value="votes">Sort: Highest Votes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search AC name, candidate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
            />
          </div>

          {/* Party Filter */}
          <div className="relative">
            <select
              value={selectedParty}
              onChange={(e) => setSelectedParty(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm cursor-pointer"
            >
              <option value="ALL">All Winning Parties ({list.length})</option>
              {parties.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm cursor-pointer"
            >
              <option value="ALL">All Districts ({districts.length})</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 w-16"># AC</th>
              <th className="py-2.5 px-3">Constituency</th>
              <th className="py-2.5 px-3">District</th>
              <th className="py-2.5 px-3">Winner</th>
              <th className="py-2.5 px-3">Party</th>
              <th className="py-2.5 px-3">Runner-Up</th>
              <th className="py-2.5 px-3 text-right">Margin</th>
              <th className="py-2.5 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAndSorted.map((r) => {
              const isSelected = selectedAcNo === r.ac_no;
              const partyColor = getPartyColor(r.winner.party);

              return (
                <tr
                  key={r.ac_no}
                  onClick={() => onSelectAc(r.ac_no)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 font-medium'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono text-slate-500">{r.ac_no}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    <div className="flex items-center justify-between gap-1">
                      <span>{r.ac_name}</span>
                      {onOpenDossier && year === '2023' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDossier(r.ac_no);
                          }}
                          className="opacity-0 group-hover:opacity-100 hover:opacity-100 text-[10px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200 transition-opacity flex items-center gap-0.5 cursor-pointer font-bold"
                          title="Open full candidate dossier"
                        >
                          Dossier ↗
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">{r.district}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900 truncate max-w-[150px]">
                    {r.winner.candidate}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[11px]"
                      style={{
                        backgroundColor: `${partyColor}18`,
                        color: partyColor,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: partyColor }}
                      />
                      {r.winner.party}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 truncate max-w-[140px]">
                    {r.runner_up.party} - {r.runner_up.candidate.split(' ')[0]}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">
                    <span className="text-slate-900">{r.margin.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 block">({r.margin_pct}%)</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {r.swing ? (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          r.swing.status === 'GAIN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {r.swing.status === 'GAIN' ? 'GAIN' : 'HOLD'}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
