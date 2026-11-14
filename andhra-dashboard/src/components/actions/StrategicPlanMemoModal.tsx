import React from 'react';
import { X, Copy, Check, Download } from 'lucide-react';

export interface StrategicPlanMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetParty: string;
  totalAllocated: number;
  totalPointsBudget: number;
  flippedCount: number;
  planMemo: string;
  onCopyPlan: () => void;
  onDownloadPlan: () => void;
  copiedMemo: boolean;
}

export const StrategicPlanMemoModal: React.FC<StrategicPlanMemoModalProps> = ({
  isOpen,
  onClose,
  targetParty,
  totalAllocated,
  totalPointsBudget,
  flippedCount,
  planMemo,
  onCopyPlan,
  onDownloadPlan,
  copiedMemo,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded">
                STRATEGIC PLAN
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {targetParty} Campaign Action Plan
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              {totalAllocated} / {totalPointsBudget} Points Allocated &bull; +{flippedCount} Projected Net Flips
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close strategic plan modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Text Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-900 text-slate-100 font-mono text-xs whitespace-pre-wrap leading-relaxed select-text">
          {planMemo}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">
            Ready to export or distribute to leadership war room
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCopyPlan}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {copiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMemo ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
            </button>

            <button
              type="button"
              onClick={onDownloadPlan}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span>Download (.txt)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
