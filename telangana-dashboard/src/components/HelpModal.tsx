import React, { useState, useEffect } from 'react';
import { X, BarChart3, Sparkles, Target, FileText, HelpCircle, Check, Type } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FONT_SIZE_OPTIONS = [
  { key: '15px', label: 'Compact', sub: '15px', scaleText: 'A--' },
  { key: '16.5px', label: 'Default', sub: '16.5px', scaleText: 'A-' },
  { key: '18px', label: 'Large', sub: '18px', scaleText: 'A' },
  { key: '19.5px', label: 'XL', sub: '19.5px', scaleText: 'A+' },
  { key: '21px', label: '2XL', sub: '21px', scaleText: 'A++' },
];

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [currentFontSize, setCurrentFontSize] = useState<string>('18px');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ts_dash_font_size') || document.documentElement.style.fontSize || '18px';
      setCurrentFontSize(saved.trim());
    }
  }, [isOpen]);

  const handleSelectFontSize = (size: string) => {
    setCurrentFontSize(size);
    document.documentElement.style.fontSize = size;
    try {
      localStorage.setItem('ts_dash_font_size', size);
    } catch {}
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close help modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          Help &amp; Display Settings
        </h2>
        <p className="text-xs text-slate-500 mb-4">Election Intelligence — Quick Reference &amp; Preferences</p>

        {/* Display Text Scaling with 5 Levels & Live Selected State */}
        <section className="mb-5 bg-slate-50/90 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Type className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900">Display Text Scaling</h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Active: {FONT_SIZE_OPTIONS.find(o => o.key === currentFontSize)?.label || currentFontSize}
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            Choose your preferred comfort level across all maps, cards, and simulation tables:
          </p>

          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {FONT_SIZE_OPTIONS.map((opt) => {
              const isSelected = currentFontSize === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectFontSize(opt.key)}
                  className={`py-2 px-1 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm shadow-indigo-600/30 font-black'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                  title={`${opt.label} (${opt.sub})`}
                >
                  <span className="text-xs font-extrabold flex items-center gap-0.5">
                    {opt.scaleText}
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </span>
                  <span className={`text-[10px] font-semibold ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Results & Map */}
        <section className="mb-4">
          <h3 className="text-sm font-bold text-indigo-700 mb-1.5 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" /> Results &amp; Map
          </h3>
          <ul className="text-xs text-slate-700 space-y-1 pl-5 list-disc">
            <li>Select an <strong>election year</strong> (2014, 2018, or 2023) to view that year's data.</li>
            <li>Switch <strong>map view modes</strong>: Party Colors, Margins, or Seat Swings.</li>
            <li><strong>Click a constituency</strong> on the map to see its battle card with historical results.</li>
            <li>Use the <strong>search bar</strong> to find a constituency by name or AC number (press Enter).</li>
            <li>Scroll down to the <strong>Constituency Table</strong> to browse all 119 seats with sortable columns.</li>
            <li>Click <strong>"Full Dossier ↗"</strong> on any constituency for candidate profiles, the <strong>Candidate Personal Equity Decomposer</strong> (#6), and the <strong>Form-20 Polling Station Deficit &amp; Panna Pramukh Solver</strong> (#5).</li>
          </ul>
        </section>

        {/* Simulations */}
        <section className="mb-4">
          <h3 className="text-sm font-bold text-indigo-700 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Simulations (War Room)
          </h3>
          <ul className="text-xs text-slate-700 space-y-1 pl-5 list-disc">
            <li>Adjust <strong>community swing sliders</strong> to model voter shifts across caste & demographic groups.</li>
            <li>View the <strong>projected seat tally</strong> update in real time as you move sliders.</li>
            <li>Open <strong>Swing Studio</strong> for fine-grained party-level and macro swing controls.</li>
            <li>Use the <strong>Advanced Simulation Suite</strong> for turnout-based scenario modeling.</li>
            <li>Click any constituency row to navigate to its dossier.</li>
          </ul>
        </section>

        {/* Actions & Playbook */}
        <section className="mb-4">
          <h3 className="text-sm font-bold text-indigo-700 mb-1.5 flex items-center gap-1.5">
            <Target className="w-4 h-4" /> Actions &amp; Playbook
          </h3>
          <ul className="text-xs text-slate-700 space-y-1 pl-5 list-disc">
            <li>Allocate <strong>campaign resource points</strong> (Digital, Rally, Welfare) per constituency.</li>
            <li>Use the <strong>Star Campaigner Allocator</strong> to assign leaders to priority seats.</li>
            <li>Model <strong>defection/rebel scenarios</strong> and see their impact on seat outcomes.</li>
            <li>Generate an <strong>AI-powered playbook summary</strong> for selected constituencies.</li>
          </ul>
        </section>

        {/* Executive Briefing */}
        <section className="mb-2">
          <h3 className="text-sm font-bold text-indigo-700 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> Executive Briefing
          </h3>
          <ul className="text-xs text-slate-700 space-y-1 pl-5 list-disc">
            <li>Click the dark <strong>"Executive Briefing"</strong> button in the header for a high-level strategic briefing across all constituencies.</li>
            <li>Shows <strong>key metrics, vulnerability analysis, and strategic recommendations</strong> powered by SEEEPC data.</li>
          </ul>
        </section>

        <div className="mt-5 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">Esc</kbd> or click outside to close
        </div>
      </div>
    </div>
  );
};
