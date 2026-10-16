import React from 'react';
import type { YearSummary } from '../types';
import { getPartyColor } from '../types';

interface SeatTallyBarProps {
  summary: YearSummary;
  year: string;
}

export const SeatTallyBar: React.FC<SeatTallyBarProps> = ({ summary, year }) => {
  const majorityMark = 60; // 119 seats in Telangana
  const totalSeats = 119;
  const entries = Object.entries(summary.seat_tally);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-800 tracking-wide uppercase">
            {year} Assembly Seat Tally
          </span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
            Majority mark: {majorityMark} seats
          </span>
        </div>
        <div className="text-xs text-slate-500">
          Average Victory Margin: <strong className="text-slate-700">{summary.avg_margin.toLocaleString()} votes</strong>
        </div>
      </div>

      {/* Stacked Progress Bar */}
      <div className="relative w-full h-5 bg-slate-100 rounded-full overflow-hidden flex shadow-inner mb-3">
        {entries.map(([party, seats]) => {
          const widthPct = (seats / totalSeats) * 100;
          return (
            <div
              key={party}
              style={{
                width: `${widthPct}%`,
                backgroundColor: getPartyColor(party),
              }}
              className="h-full relative group transition-all duration-300 hover:opacity-90 flex items-center justify-center text-[11px] font-bold text-white overflow-hidden"
              title={`${party}: ${seats} seats (${widthPct.toFixed(1)}%)`}
            >
              {seats >= 4 && <span>{party} {seats}</span>}
            </div>
          );
        })}

        {/* Majority threshold line marker at ~50.4% */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-slate-900 z-10"
          style={{ left: `${(majorityMark / totalSeats) * 100}%` }}
          title="Majority Threshold: 60 Seats"
        />
      </div>

      {/* Party Badges Grid */}
      <div className="flex flex-wrap items-center gap-2">
        {entries.map(([party, seats]) => {
          const isMajority = seats >= majorityMark;
          return (
            <div
              key={party}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isMajority
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-950 shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: getPartyColor(party) }}
              />
              <span className="font-bold">{party}</span>
              <span className="font-extrabold text-slate-900 text-sm">{seats}</span>
              {isMajority && (
                <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold uppercase">
                  Govt
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
