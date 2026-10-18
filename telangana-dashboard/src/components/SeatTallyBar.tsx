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
    <div className="bg-white rounded-xl px-4 py-3 shadow-xs border border-slate-200 space-y-2">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-black text-slate-900 tracking-wider uppercase">
          {year} Assembly Seat Tally
        </span>
        <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
          Majority mark: {majorityMark} / {totalSeats} seats
        </span>
      </div>

      {/* Primary Stacked Progress Bar */}
      <div className="relative w-full h-6 bg-slate-100 rounded-lg overflow-hidden flex shadow-inner">
        {entries.map(([party, seats]) => {
          const widthPct = (seats / totalSeats) * 100;
          const isMajority = seats >= majorityMark;
          return (
            <div
              key={party}
              style={{
                width: `${widthPct}%`,
                backgroundColor: getPartyColor(party),
              }}
              className="h-full relative group transition-all duration-300 hover:brightness-105 flex items-center justify-center text-white overflow-hidden px-1 select-none"
              title={`${party}: ${seats} seats (${widthPct.toFixed(1)}%)${isMajority ? ' • Majority / Govt' : ''}`}
            >
              {seats >= 4 ? (
                <div className="flex items-center gap-1 font-bold text-xs tracking-tight drop-shadow-xs">
                  <span>{party}</span>
                  <span className="font-mono font-black">{seats}</span>
                </div>
              ) : (
                <span className="font-bold text-[11px] font-mono">{seats}</span>
              )}
            </div>
          );
        })}

        {/* Majority threshold line marker at ~50.4% */}
        <div
          className="absolute top-0 bottom-0 w-[2.5px] bg-slate-950 z-10 shadow-md"
          style={{ left: `${(majorityMark / totalSeats) * 100}%` }}
          title={`Majority Threshold: ${majorityMark} Seats (Halfway mark)`}
        />
      </div>
    </div>
  );
};
