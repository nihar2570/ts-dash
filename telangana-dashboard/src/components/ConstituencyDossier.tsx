import React, { useState, useMemo } from 'react';
import type { ConstituencyCandidatesData } from '../types';
import { getPartyColor, getPartyBg } from '../types';
import {
  ExternalLink,
  X,
  ShieldAlert,
  ShieldCheck,
  Coins,
  GraduationCap,
  Users,
  Award,
  Vote,
  Filter,
  Search
} from 'lucide-react';

interface ConstituencyDossierProps {
  data: ConstituencyCandidatesData | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ConstituencyDossier: React.FC<ConstituencyDossierProps> = ({
  data,
  isOpen,
  onClose,
}) => {
  const [minVotes, setMinVotes] = useState<number>(1000);
  const [topLimit, setTopLimit] = useState<number | 'ALL'>('ALL');
  const [filterMode, setFilterMode] = useState<'1000' | '5000' | 'all'>('1000');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Column visibility toggles (defaulted to OFF, shown only when toggled ON individually)
  const [showAge, setShowAge] = useState<boolean>(false);
  const [showEducation, setShowEducation] = useState<boolean>(false);
  const [showCriminalCases, setShowCriminalCases] = useState<boolean>(false);
  const [showNetWorth, setShowNetWorth] = useState<boolean>(false);

  // Handle filter preset change
  const handleFilterPreset = (preset: '1000' | '5000' | 'all') => {
    setFilterMode(preset);
    if (preset === '1000') {
      setMinVotes(1000);
    } else if (preset === '5000') {
      setMinVotes(5000);
    } else if (preset === 'all') {
      setMinVotes(0);
    }
  };

  // Filtered and sorted candidate roster
  const filteredCandidates = useMemo(() => {
    if (!data) return [];
    let list = [...data.candidates];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.party.toLowerCase().includes(q) ||
          c.raw_party.toLowerCase().includes(q)
      );
    }

    // Filter by minVotes
    list = list.filter((c) => c.votes >= minVotes || c.is_nota);

    // Limit top X if specified
    if (topLimit !== 'ALL') {
      list = list.slice(0, topLimit);
    }

    return list;
  }, [data, minVotes, topLimit, searchQuery]);

  if (!isOpen || !data) return null;

  const winner = data.candidates[0];
  const runnerUp = data.candidates[1];
  const margin = winner && runnerUp ? winner.votes - runnerUp.votes : 0;
  const marginPct =
    winner && runnerUp && data.total_valid_votes > 0
      ? ((margin / data.total_valid_votes) * 100).toFixed(2)
      : '0.00';

  // ADR Aggregate Statistics for candidates in this AC
  const adrStats = data.candidates.reduce(
    (acc, c) => {
      if (c.myneta) {
        acc.totalCriminalCases += c.myneta.criminal_cases;
        if (c.myneta.criminal_cases > 0) acc.candidatesWithCases += 1;
        if (c.myneta.is_crorepati) acc.crorepatiCount += 1;
        if (c.myneta.total_assets > acc.maxAssets) {
          acc.maxAssets = c.myneta.total_assets;
          acc.maxAssetCand = c.name;
          acc.maxAssetFormatted = c.myneta.total_assets_formatted;
        }
      }
      return acc;
    },
    {
      totalCriminalCases: 0,
      candidatesWithCases: 0,
      crorepatiCount: 0,
      maxAssets: 0,
      maxAssetCand: '',
      maxAssetFormatted: '₹0',
    }
  );

  const openInNewTab = () => {
    const url = `${window.location.origin}${window.location.pathname}?dossier=${data.ac_no}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-indigo-600 text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-md">
                AC #{data.ac_no}
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">{data.ac_name}</h2>
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-medium">
                {data.district} District (33 TS)
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                Lok Sabha: {data.pc_name}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Constituency Election Intelligence Dossier &middot; 2023 Assembly Ballot &middot; MyNeta ADR Disclosures
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openInNewTab}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition-all shadow-xs"
              title="Open full dossier in a standalone browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in New Tab
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-lg transition-all"
              title="Close Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Vote className="w-4 h-4 text-indigo-600" />
                <span>Total Valid Votes</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {data.total_valid_votes.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">Total cast ballot count</div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Victory Margin</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {margin.toLocaleString()}{' '}
                <span className="text-xs font-bold text-slate-500">({marginPct}%)</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Winner: <span className="font-semibold text-slate-800">{winner?.party}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Total Candidates</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {data.total_candidates}
              </div>
              <div className="text-[11px] text-slate-500">
                {data.candidates_above_1000} polled &ge; 1,000 votes
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>ADR MyNeta Profile</span>
              </div>
              <div className="text-lg font-black text-slate-900">
                {adrStats.crorepatiCount}{' '}
                <span className="text-xs font-semibold text-slate-500">Crorepatis</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {adrStats.totalCriminalCases} criminal cases across {adrStats.candidatesWithCases} candidates
              </div>
            </div>
          </div>

          {/* Visual Vote Stack Distribution Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Vote Share Distribution (2023)
              </span>
              <span className="text-slate-500 text-xs">
                Total Contenders: {data.total_candidates} candidates
              </span>
            </div>
            {/* Multi-segment progress bar */}
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              {data.candidates.slice(0, 6).map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: `${c.vote_share}%`,
                    backgroundColor: c.is_nota ? '#94a3b8' : getPartyColor(c.party),
                  }}
                  className="h-full transition-all relative group"
                  title={`${c.name} (${c.party}): ${c.vote_share}% (${c.votes.toLocaleString()} votes)`}
                />
              ))}
            </div>
            {/* Top 4 Legend below progress bar */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs pt-1">
              {data.candidates.slice(0, 4).map((c, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: c.is_nota ? '#94a3b8' : getPartyColor(c.party) }}
                  />
                  <span className="font-semibold text-slate-800">{c.party}:</span>
                  <span className="text-slate-600">{c.vote_share}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Candidate Filter & Control Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-indigo-600" />
                Filter Ballot:
              </span>

              {/* Threshold Presets */}
              <button
                type="button"
                onClick={() => handleFilterPreset('1000')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === '1000'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
                title="Show candidates with at least 1,000 votes"
              >
                &ge; 1,000 Votes (Default)
              </button>

              <button
                type="button"
                onClick={() => handleFilterPreset('5000')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === '5000'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
                title="Show major candidates with at least 5,000 votes"
              >
                &ge; 5,000 Votes
              </button>

              <button
                type="button"
                onClick={() => handleFilterPreset('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === 'all'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
                title="Show all candidates including independents"
              >
                All ({data.total_candidates})
              </button>
            </div>

            {/* Top X limit & Search */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <input
                  type="text"
                  placeholder="Search candidate / party..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent focus:outline-hidden text-xs w-36 sm:w-44"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                    ✕
                  </button>
                )}
              </div>

              {/* Top X Limit */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 font-medium hidden sm:inline">Top:</span>
                <select
                  value={topLimit}
                  onChange={(e) => setTopLimit(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-hidden"
                >
                  <option value="ALL">All</option>
                  <option value="3">Top 3</option>
                  <option value="5">Top 5</option>
                  <option value="10">Top 10</option>
                </select>
              </div>
            </div>
          </div>

          {/* Candidates & MyNeta Disclosures Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2.5 text-xs">
              <span className="font-bold text-slate-700">
                Displaying {filteredCandidates.length} Candidates{' '}
                {filterMode === '1000' && '(polling &ge; 1,000 votes)'}
                {filterMode === '5000' && '(polling &ge; 5,000 votes)'}
              </span>

              {/* Individual Column Toggles */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-500 mr-0.5">
                  Show Columns:
                </span>

                <button
                  type="button"
                  onClick={() => setShowAge((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    showAge
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title="Toggle Age column"
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${showAge ? 'bg-white' : 'bg-slate-300'}`} />
                  Age
                </button>

                <button
                  type="button"
                  onClick={() => setShowEducation((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    showEducation
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title="Toggle Education column"
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${showEducation ? 'bg-white' : 'bg-slate-300'}`} />
                  Education
                </button>

                <button
                  type="button"
                  onClick={() => setShowCriminalCases((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    showCriminalCases
                      ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title="Toggle Criminal Cases column"
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${showCriminalCases ? 'bg-white' : 'bg-slate-300'}`} />
                  Criminal Cases
                </button>

                <button
                  type="button"
                  onClick={() => setShowNetWorth((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    showNetWorth
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title="Toggle Net Worth column"
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${showNetWorth ? 'bg-white' : 'bg-slate-300'}`} />
                  Net Worth
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-3 w-12 text-center">Rank</th>
                    <th className="py-2.5 px-3">Candidate</th>
                    <th className="py-2.5 px-3">Party</th>
                    {showAge && <th className="py-2.5 px-3 text-center">Age</th>}
                    {showEducation && <th className="py-2.5 px-3">Education</th>}
                    <th className="py-2.5 px-3 text-right">Votes</th>
                    <th className="py-2.5 px-3 text-right">Vote Share</th>
                    {showCriminalCases && <th className="py-2.5 px-3 text-center">Criminal Cases</th>}
                    {showNetWorth && <th className="py-2.5 px-3 text-right">Net Worth</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.map((cand) => {
                    const partyColor = cand.is_nota ? '#94a3b8' : getPartyColor(cand.party);
                    const partyBg = cand.is_nota ? '#f1f5f9' : getPartyBg(cand.party);
                    const isWinner = cand.rank === 1;
                    const isRunner = cand.rank === 2;

                    return (
                      <tr
                        key={cand.rank}
                        className={`hover:bg-slate-50 transition-colors ${
                          isWinner ? 'bg-indigo-50/20 font-medium' : ''
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                              isWinner
                                ? 'bg-amber-400 text-slate-900 shadow-xs'
                                : isRunner
                                ? 'bg-slate-200 text-slate-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {cand.rank}
                          </span>
                        </td>

                        {/* Candidate Name */}
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {cand.name}
                            {isWinner && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                                Winner
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Party */}
                        <td className="py-3 px-3">
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-md font-bold text-xs"
                            style={{
                              backgroundColor: partyBg,
                              color: partyColor,
                            }}
                          >
                            {cand.party}
                          </span>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {cand.raw_party}
                          </div>
                        </td>

                        {/* Age (conditional) */}
                        {showAge && (
                          <td className="py-3 px-3 text-center font-medium text-slate-700">
                            {cand.myneta?.age ? `${cand.myneta.age} yrs` : <span className="text-slate-400">—</span>}
                          </td>
                        )}

                        {/* Education (conditional) */}
                        {showEducation && (
                          <td className="py-3 px-3">
                            {cand.myneta?.education ? (
                              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[140px]">{cand.myneta.education}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        )}

                        {/* Votes */}
                        <td className="py-3 px-3 text-right">
                          <div className="font-bold text-slate-900">{cand.votes.toLocaleString()}</div>
                          {cand.postal_votes > 0 ? (
                            <div className="text-[10px] text-slate-400">Postal: {cand.postal_votes}</div>
                          ) : null}
                        </td>

                        {/* Vote Share % */}
                        <td className="py-3 px-3 text-right">
                          <div className="font-bold text-slate-800">{cand.vote_share}%</div>
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full ml-auto mt-1 overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${cand.vote_share}%`, backgroundColor: partyColor }}
                            />
                          </div>
                        </td>

                        {/* Criminal Cases (conditional) */}
                        {showCriminalCases && (
                          <td className="py-3 px-3 text-center">
                            {cand.myneta ? (
                              cand.myneta.criminal_cases === 0 ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  0 (Clean)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                  <ShieldAlert className="w-3 h-3 text-rose-600" />
                                  {cand.myneta.criminal_cases} Cases
                                </span>
                              )
                            ) : (
                              <span className="text-[11px] text-slate-400">—</span>
                            )}
                          </td>
                        )}

                        {/* Net Worth (conditional) */}
                        {showNetWorth && (
                          <td className="py-3 px-3 text-right">
                            {cand.myneta ? (
                              <div>
                                <div className="font-bold text-slate-900 flex items-center justify-end gap-1">
                                  {cand.myneta.net_worth_formatted}
                                  {cand.myneta.is_crorepati && (
                                    <span title="Crorepati candidate">
                                      <Coins className="w-3 h-3 text-amber-500" />
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  Assets: {cand.myneta.total_assets_formatted}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredCandidates.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <p className="font-medium text-sm">No candidates match the specified filter.</p>
                <button
                  onClick={() => {
                    setMinVotes(0);
                    setFilterMode('all');
                    setSearchQuery('');
                  }}
                  className="mt-2 text-indigo-600 hover:underline text-xs font-semibold"
                >
                  Reset filters to show all candidates
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div>
            Data Sources: Election Commission of India (ECI Form 20) &middot; Association for Democratic Reforms (ADR)
          </div>
          <div className="text-slate-400">
            Telangana Assembly Constituency Intelligence Dossier
          </div>
        </div>
      </div>
    </div>
  );
};
