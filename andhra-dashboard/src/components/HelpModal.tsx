import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Target,
  Check,
  Type,
  Users,
  Search,
  BookOpen,
  Keyboard,
  Shield,
  Layers,
  FileSpreadsheet,
  Award,
  Zap,
  Palette,
} from 'lucide-react';
import { useDashboard, MAP_SHADE_OPTIONS } from '../context/DashboardContext';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type HelpTab = 'overview' | 'tabs' | 'demographics' | 'solvers' | 'shortcuts' | 'display';

const FONT_SIZE_OPTIONS = [
  { key: '15px', label: 'Compact', sub: '15px', scaleText: 'A--' },
  { key: '16.5px', label: 'Default', sub: '16.5px', scaleText: 'A-' },
  { key: '18px', label: 'Large', sub: '18px', scaleText: 'A' },
  { key: '19.5px', label: 'XL', sub: '19.5px', scaleText: 'A+' },
  { key: '21px', label: '2XL', sub: '21px', scaleText: 'A++' },
];

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { mapColorShade, setMapColorShade } = useDashboard();
  const [activeTab, setActiveTab] = useState<HelpTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFontSize, setCurrentFontSize] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('ts_dash_font_size') || document.documentElement.style.fontSize || '18px').trim();
    }
    return '18px';
  });

  const handleSelectFontSize = (size: string) => {
    setCurrentFontSize(size);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('font-size', size);
    }
    try {
      localStorage.setItem('ts_dash_font_size', size);
    } catch {}
  };

  const tabs: { key: HelpTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'overview', label: 'Mandate & Overview', icon: Shield },
    { key: 'tabs', label: '6 War Room Tabs', icon: Layers },
    { key: 'demographics', label: 'Caste Equations', icon: Users },
    { key: 'solvers', label: 'Tactical Solvers', icon: Target },
    { key: 'shortcuts', label: 'Shortcuts & Hotkeys', icon: Keyboard },
    { key: 'display', label: 'Display & Font Scaling', icon: Type },
  ];

  // Filter content if search query is active
  const q = searchQuery.toLowerCase().trim();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[3200] flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[92vh] overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                AP 175 AC STRATEGIC WAR ROOM &middot; PLATFORM KNOWLEDGE BASE
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                Election Intelligence &amp; Tactical Manual
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close help modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Header: Search bar & Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 py-3 space-y-3 shrink-0">
          {/* Quick Search in Help */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics (e.g., Kapu, Panna Pramukh, Super Six, Margin, Defections, Shortcuts)..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tab Navigation Pill Bar (Multi-line wrap) */}
          <div className="flex flex-wrap items-center gap-1.5 pb-0.5">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-black'
                      : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-slate-800 text-xs leading-relaxed">
          
          {/* TAB 1: OVERVIEW & 2024 MANDATE */}
          {(activeTab === 'overview' || q) && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-500" />
                  Andhra Pradesh 2024 Mandate Architecture &amp; Electoral Geography
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  175 Assembly Constituencies &middot; 88 Majority Benchmark &middot; 26 Administrative Districts
                </p>
              </div>

              {/* 2024 Mandate Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-amber-800">NDA Alliance</div>
                  <div className="text-2xl font-black text-amber-600 font-mono mt-0.5">164 Seats</div>
                  <div className="text-[10px] text-amber-700 mt-0.5">+76 Supermajority Buffer</div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-yellow-800">TDP (Ruling Anchor)</div>
                  <div className="text-2xl font-black text-yellow-600 font-mono mt-0.5">135 Seats</div>
                  <div className="text-[10px] text-yellow-700 mt-0.5">77.1% Assembly Share</div>
                </div>

                <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-rose-800">Janasena (JSP)</div>
                  <div className="text-2xl font-black text-rose-600 font-mono mt-0.5">21 / 21</div>
                  <div className="text-[10px] text-rose-700 mt-0.5">100% Strike Rate Record</div>
                </div>

                <div className="bg-slate-100 border border-slate-200 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-600">YSRCP (Opposition)</div>
                  <div className="text-2xl font-black text-slate-700 font-mono mt-0.5">11 Seats</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">-140 Net Seat Loss</div>
                </div>
              </div>

              {/* Electoral Geography Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    Coastal Andhra (Kosta + Uttarandhra) &mdash; 123 Seats
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Spans 18 districts along the Bay of Bengal from Srikakulam to Nellore. Characterized by high agricultural fertility (Godavari &amp; Krishna deltas), booming urban hubs (Visakhapatnam, Vijayawada, Guntur), and heavy consolidation among Kapu, Kamma, and BC Turpu Kapu / Settibalija communities.
                  </p>
                  <div className="text-[10px] font-mono text-indigo-700 bg-indigo-50 p-1.5 rounded border border-indigo-100">
                    2024 Outcome: NDA won 120 of 123 seats (97.5% sweep rate).
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    Rayalaseema Region &mdash; 52 Seats
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Encompasses 8 arid, agrarian districts: Kurnool, Nandyal, Anantapur, Sri Sathya Sai, YSR Kadapa, Annamayya, Tirupati, and Chittoor. Dominated by Reddy agrarian leadership, Kuruba/Boya BC communities, and weavers (Padmashali). Historically a YSRCP stronghold, flipped decisively in 2024.
                  </p>
                  <div className="text-[10px] font-mono text-rose-700 bg-rose-50 p-1.5 rounded border border-rose-100">
                    2024 Outcome: NDA won 44 of 52 seats; YSRCP held 8 seats (including Pulivendula).
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 6 WAR ROOM TABS */}
          {(activeTab === 'tabs' || q) && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  The 6 Core War Room Tabs across 2 Functional Groups
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Partitioned into Ground &amp; Constituency Intelligence (Ground Truth) and War Room &amp; Strategy (Intervention)
                </p>
              </div>

              {/* Group 1: Ground & Constituency Intelligence */}
              <div className="space-y-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 flex items-center gap-1.5">
                  <span>Ground &amp; Constituency Intelligence (Anatomy &amp; Facts)</span>
                </div>

                {/* 1. Results & Map */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold text-[10px]">1</span>
                      📊 Results &amp; Map (Historical Ground Truth)
                    </h4>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">Hotkey: 1</kbd>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Interactive choropleth map and 175-constituency directory across 2014, 2019, and 2024 elections. Switch between <strong>Party Colors</strong>, <strong>Victory Margins</strong> (highlights seats won by &lt;10k votes), and <strong>Seat Swings</strong>. Click any constituency to inspect its battle card and voter trends.
                  </p>
                </div>

                {/* 2. AC Dossier */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold text-[10px]">2</span>
                      🏛️ AC Dossier (Candidate Roster &amp; Affidavits)
                    </h4>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">Hotkey: 2</kbd>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Full-page constituency dossier. Inspect candidate wealth, educational qualifications, criminal affidavits, local issue priorities, mandal circles, and demographic caste share for any selected constituency with an instant dropdown switcher.
                  </p>
                </div>

                {/* 3. Voter Rolls & Booths */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold text-[10px]">3</span>
                      📋 Voter Rolls &amp; E-Panna Booth Data
                    </h4>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">Hotkey: 3</kbd>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Hyper-local booth and polling station operations across all 45,791 booths. Inspect certified Form-20 numbers, polling station buildings, onomastic surname clusters, and assign field targets using the <strong>Panna Pramukh (Page Committee) Deficit Solver</strong> down to 30-voter pages.
                  </p>
                </div>
              </div>

              {/* Group 2: War Room & Strategy */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 flex items-center gap-1.5">
                  <span>War Room &amp; Strategy (Intervention &amp; Forecasting)</span>
                </div>

                {/* 4. Simulations */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-[10px]">4</span>
                      🔮 Simulations &amp; What-If Scenarios
                    </h4>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">Hotkey: 4</kbd>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Senior Chief-Advisor forecasting suite. Dial community swing percentages across 14 caste and demographic blocs to observe projected seat outcomes on the <strong>Live Assembly Majority Barometer</strong>. Features the <strong>Inverse-Margin Bubble Chart</strong> and the <strong>Scenario Bridge Ribbon</strong> to export scenario assumptions into the Playbook.
                  </p>
                </div>

                {/* 5. Playbook & Actions */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-[10px]">5</span>
                      🎯 Playbook &amp; Campaign Actions
                    </h4>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">Hotkey: 5</kbd>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Tactical campaign execution center. Allocate <strong>Resource Points</strong> (Digital Blitz, Field Rallies, Welfare beneficiary drives) across battlegrounds. Deploy <strong>Star Campaigners</strong> (Chandrababu Naidu, Pawan Kalyan, Nara Lokesh, Purandeswari) and model the vote-splintering impact of independent and factional rebels in the <strong>Defection Modeler</strong>.
                  </p>
                </div>

                {/* 6. Voter Reach */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-[10px]">6</span>
                      📢 Voter Reach &amp; Micro-Targeting
                    </h4>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">Hotkey: 6</kbd>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Audience segmentation engine cross-tabulating <strong>Caste &times; Age</strong> (18&ndash;25 Gen Z first-timers, 26&ndash;40 Millennials, 41&ndash;55 Middle Age, 56+ Seniors). Maps channel touchpoints (WhatsApp Communities, Door-to-Door, Mega Rallies, Local Cable/IVR) with priority issues (Unemployment, Polavaram/Irrigation, Amaravati, Welfare Subsidies) and a 5&ndash;10 touch campaign cadence.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CASTE & DEMOGRAPHIC EQUATIONS */}
          {(activeTab === 'demographics' || q) && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Demographic Playbook &amp; Andhra Pradesh Caste Equations
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Deep demographic profiles of all 14 voting blocs driving the 175 assembly seats
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Kapu / Balija */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Kapu / Balija / Telaga</span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono font-bold text-[10px]">~22% State Share</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Decisive kingmaker community across East Godavari, West Godavari, Krishna, Guntur, and Rayalaseema Balija belts. Pawan Kalyan&apos;s Janasena alignment ensures high strike rates; preserving coalition synergy with TDP is critical to maintaining supermajority buffers.
                  </p>
                </div>

                {/* BC Turpu Kapu */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">BC Turpu Kapu</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold text-[10px]">~7% (Uttarandhra)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Dominant agrarian community in Srikakulam and Vizianagaram. Highly responsive to local irrigation initiatives, welfare delivery, and BC representation in government bodies.
                  </p>
                </div>

                {/* BC Yadava & Kuruba/Boya */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">BC Yadava &amp; Kuruba / Boya</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">~14% State Share</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Core backbone across Rayalaseema (Anantapur, Kurnool) and coastal pastoral belts. Critical to neutralizing traditional opposition holds; key demands center on animal husbandry, rural credit, and water security.
                  </p>
                </div>

                {/* BC Settibalija / Goud */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">BC Settibalija / Goud</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-[10px]">~5% (Delta Belt)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Influential in Konaseema, Kakinada, and coastal tracts. Traditional toddy-tapper, small business, and artisan roots; pivotal in high-turnout delta elections.
                  </p>
                </div>

                {/* Reddy Community */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Reddy Community</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono font-bold text-[10px]">~11-12% State Share</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Historically dominant political and agrarian leadership across Rayalaseema (Kadapa, Kurnool) and Palnadu/Nellore. Factions frequently split between parties based on local candidate equity.
                  </p>
                </div>

                {/* Kamma Community */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Kamma Community</span>
                    <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 font-mono font-bold text-[10px]">~5-6% State Share</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Traditional entrepreneurial, commercial, and agricultural foundation for TDP in Krishna, Guntur, and Godavari. High voter participation and civic organizing capability.
                  </p>
                </div>

                {/* SC Communities (Mala & Madiga) */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">SC Mala &amp; SC Madiga / Relli</span>
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold text-[10px]">~17% (29 Reserved ACs)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Determines outcomes in all 29 SC-reserved constituencies. Highly sensitive to welfare saturation (Super Six), social justice delivery, and sub-categorization commitments.
                  </p>
                </div>

                {/* Minorities (Muslims & Christians) */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Minority Blocs (Muslim &amp; Christian)</span>
                    <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono font-bold text-[10px]">~11% Combined</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Concentrated in Rayalaseema urban hubs (Kurnool, Kadapa, Adoni, Nandyal) and coastal delta congregations. Key issues center on minority welfare, educational stipends, and community autonomy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STRATEGIC SOLVERS */}
          {(activeTab === 'solvers' || q) && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-rose-600" />
                  Built-In Strategic Solvers &amp; Decision Engines
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quantitative algorithms designed to solve victory deficits and optimize field resource deployment
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <Award className="w-4 h-4 text-indigo-600" />
                    Candidate Personal Equity Decomposer (#6)
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Located in the Full Constituency Dossier. Decouples a candidate&apos;s personal brand equity (local philanthropy, accessibility, community goodwill) from their party symbol baseline. Shows whether the candidate added positive value (+EV) or acted as a drag on party baseline.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    Form-20 Deficit &amp; Panna Pramukh Solver (#5)
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Calculates the exact number of net votes needed per polling booth and per 30-voter page to overcome an opposition victory margin. Generates actionable target quotas for local page-in-charge (Panna Pramukh) karyakartas.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <Zap className="w-4 h-4 text-amber-600" />
                    Super Six Welfare Saturation Tracker
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Audits constituency-level delivery of the NDA Government&apos;s flagship welfare pledges: <em>Thalliki Vandanam</em> (₹15,000/student), <em>Deepam 2.0</em> (3 free gas cylinders/year), <em>Annadata</em> (₹20,000 farmer income support), <em>Aadabidda Nidhi</em> (₹1,500/month), <em>Youth Allowance</em> (₹3,000/month), and <em>Free RTC Bus Travel</em> for women.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <Shield className="w-4 h-4 text-rose-600" />
                    NDA Floating HUD &amp; 1-Click Briefing
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Persistent bottom dock displaying real-time NDA seat totals (164/175) and supermajority buffer (+76). Features 1-click generation of the C-Suite Strategy Briefing and formatted WhatsApp/Signal memos ready for instant war room broadcast.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KEYBOARD SHORTCUTS */}
          {(activeTab === 'shortcuts' || q) && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-indigo-600" />
                  Keyboard Shortcuts &amp; Power Navigation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Execute key war room actions instantaneously without touching the mouse
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Command Palette Search (175 ACs &amp; Tools)</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    Ctrl + K / ⌘K
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Quick Search Slash Hotkey</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    /
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Jump to 📊 Results &amp; Map</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    1
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Jump to 🏛️ AC Dossier</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    2
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Jump to 📋 Voter Rolls &amp; E-Panna</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    3
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Jump to 🔮 Simulations &amp; Barometer</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    4
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Jump to 🎯 Playbook &amp; Actions</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    5
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Jump to 📢 Voter Reach &amp; Targeting</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    6
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Fullscreen War Room Zen Mode</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    Z
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Open this Help &amp; Knowledge Base</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    ?
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Close Active Modal / Dropdown</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    Esc
                  </kbd>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: DISPLAY PREFERENCES */}
          {(activeTab === 'display' || q) && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Type className="w-4 h-4 text-indigo-600" />
                  Display Preferences &amp; Font Scaling
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tune text size and density for large projector displays, laptops, or tablets
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Application Text Size Scale</div>
                    <div className="text-[11px] text-slate-500">Persists automatically across sessions</div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Active: {FONT_SIZE_OPTIONS.find(o => o.key === currentFontSize)?.label || currentFontSize}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 pt-1">
                  {FONT_SIZE_OPTIONS.map((opt) => {
                    const isSelected = currentFontSize === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleSelectFontSize(opt.key)}
                        className={`py-3 px-2 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1 border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm shadow-indigo-600/30 font-black'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-sm font-extrabold flex items-center gap-1">
                          {opt.scaleText}
                          {isSelected && <Check className="w-3 h-3" />}
                        </span>
                        <span className={`text-[10px] font-semibold ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {opt.label}
                        </span>
                        <span className={`text-[9px] font-mono ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {opt.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Map Pastel Color Shade & Contrast Picker */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-indigo-600" />
                      Map Baseline Shade &amp; Contrast
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Adjust pastel darkness and saturation for electoral baseline maps
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Active: {MAP_SHADE_OPTIONS.find((o) => o.key === mapColorShade)?.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                  {MAP_SHADE_OPTIONS.map((opt) => {
                    const isSelected = mapColorShade === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setMapColorShade(opt.key)}
                        className={`p-3 rounded-xl transition-all cursor-pointer flex flex-col items-start gap-2 border text-left ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm shadow-indigo-600/30'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {opt.badge}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>

                        {/* Color preview swatches: TDP, JSP, YSRCP, BJP */}
                        <div className="flex items-center gap-1.5 w-full py-0.5">
                          {opt.previewColors.map((hex, i) => (
                            <span
                              key={i}
                              className="h-3 flex-1 rounded border border-black/10 shadow-2xs"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>

                        <div>
                          <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {opt.label}
                          </div>
                          <div className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-500'} mt-0.5`}>
                            {opt.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tip: Press <kbd className="font-mono font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">Ctrl + K</kbd> anywhere to search constituencies, castes &amp; tools.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
