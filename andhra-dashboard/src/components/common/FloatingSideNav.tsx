import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ChevronUp,
  Compass,
  Map,
  Table2,
  Award,
  Building2,
  MapPin,
  PieChart,
  Flame,
  SlidersHorizontal,
  FileText,
  Shield,
} from 'lucide-react';

export interface NavSection {
  id: string;
  label: string;
  shortLabel?: string;
  step?: string;
  icon?: React.ReactNode;
}

interface FloatingSideNavProps {
  sections: NavSection[];
  navTitle?: string;
  className?: string;
  activeSectionId?: string;
  onSelectSection?: (id: string) => void;
}

// Smart contextual fallback icons if none is explicitly provided
function resolveSectionIcon(id: string, label: string): React.ReactNode {
  const text = `${id} ${label}`.toLowerCase();
  if (text.includes('cand') || text.includes('adr')) return <Award className="w-4 h-4" />;
  if (text.includes('mandal')) return <Building2 className="w-4 h-4" />;
  if (text.includes('booth') || text.includes('station')) return <MapPin className="w-4 h-4" />;
  if (text.includes('demo') || text.includes('caste') || text.includes('age')) return <PieChart className="w-4 h-4" />;
  if (text.includes('topic') || text.includes('issue')) return <Flame className="w-4 h-4" />;
  if (text.includes('map')) return <Map className="w-4 h-4" />;
  if (text.includes('table') || text.includes('director')) return <Table2 className="w-4 h-4" />;
  if (text.includes('card') || text.includes('dossier')) return <FileText className="w-4 h-4" />;
  if (text.includes('control') || text.includes('tally') || text.includes('barometer')) return <SlidersHorizontal className="w-4 h-4" />;
  if (text.includes('fortress') || text.includes('defend')) return <Shield className="w-4 h-4" />;
  return <Compass className="w-4 h-4" />;
}

export const FloatingSideNav: React.FC<FloatingSideNavProps> = ({
  sections,
  navTitle = 'NAV',
  className = '',
  activeSectionId,
  onSelectSection,
}) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [isNavHovered, setIsNavHovered] = useState<boolean>(false);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickLockUntilRef = useRef<number>(0);

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsNavHovered(true);
  };

  const handleMouseLeave = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    // Graceful 180ms delay prevents edge-flicker or pop-in/out when crossing boundaries
    leaveTimerRef.current = setTimeout(() => {
      setIsNavHovered(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!sections.length || activeSectionId !== undefined) return;

    const handleScroll = () => {
      if (Date.now() < clickLockUntilRef.current) return;

      // Highlight the bottommost visible section when scrolled to page end on compact views
      const atBottom =
        window.scrollY > 10 &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 16;
      if (atBottom) {
        for (let i = sections.length - 1; i >= 0; i--) {
          if (document.getElementById(sections[i].id)) {
            setActiveSection(sections[i].id);
            return;
          }
        }
      }

      const scrollPosition = window.scrollY + 160;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element) {
          const elementTop = element.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= elementTop) {
            setActiveSection(sections[i].id);
            return;
          }
        }
      }
      if (sections[0]) {
        setActiveSection(sections[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, activeSectionId]);

  const scrollToSection = useCallback((id: string) => {
    setActiveSection(id);
    clickLockUntilRef.current = Date.now() + 700;
    if (onSelectSection) {
      onSelectSection(id);
    }
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, [onSelectSection]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!sections || sections.length === 0) return null;

  return (
    <aside
      aria-label="Section navigation"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-[1050] hidden lg:flex flex-col gap-1.5 bg-white/92 hover:bg-white/98 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/90 shadow-lg hover:shadow-2xl transition-[width,box-shadow,opacity] duration-300 ease-out origin-right select-none ${
        isNavHovered ? 'w-56 opacity-100 ring-2 ring-indigo-500/10 shadow-2xl' : 'w-12 opacity-75 hover:opacity-100'
      } ${className}`}
    >
      {/* Header Banner */}
      <div className="flex items-center px-1.5 py-1 border-b border-slate-100 text-slate-400 overflow-hidden w-full h-7">
        <Compass className={`w-3.5 h-3.5 shrink-0 transition-colors ${isNavHovered ? 'text-indigo-600' : 'text-slate-400'}`} />
        <span
          className={`text-[10px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap overflow-hidden transition-all duration-200 ${
            isNavHovered ? 'max-w-[155px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
          }`}
        >
          {navTitle}
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1 w-full">
        {sections.map((section) => {
          const isActive = activeSectionId !== undefined ? activeSectionId === section.id : activeSection === section.id;
          const icon = section.icon || resolveSectionIcon(section.id, section.label);

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className={`w-full h-9 flex items-center px-2 rounded-xl transition-colors cursor-pointer text-left relative overflow-hidden ${
                isActive
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90'
              }`}
              aria-label={`Jump to ${section.label}`}
            >
              {/* Stable Icon Container */}
              <div className={`w-5 h-5 shrink-0 flex items-center justify-center ${isActive ? 'text-white' : 'text-slate-500'}`}>
                {icon}
              </div>

              {/* Smoothly Expanding Label (Always mounted to avoid layout thrashing) */}
              <span
                className={`text-xs font-semibold whitespace-nowrap overflow-hidden transition-all duration-200 ${
                  isNavHovered
                    ? 'max-w-[155px] opacity-100 ml-2'
                    : 'max-w-0 opacity-0 ml-0 pointer-events-none'
                }`}
              >
                {section.label}
              </span>

              {/* Active Indicator Pip */}
              {isActive && (
                <span
                  className={
                    isNavHovered
                      ? 'w-1.5 h-1.5 rounded-full bg-amber-300 ring-1 ring-white/50 shrink-0 ml-auto'
                      : 'absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 ring-1 ring-white'
                  }
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Scroll To Top Button */}
      <div className="pt-1 border-t border-slate-100 w-full">
        <button
          type="button"
          onClick={scrollToTop}
          className="w-full h-9 flex items-center px-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/80 transition-colors cursor-pointer text-left overflow-hidden"
          aria-label="Scroll to top"
        >
          <div className="w-5 h-5 shrink-0 flex items-center justify-center">
            <ChevronUp className="w-4 h-4 text-slate-400 hover:text-indigo-600 transition-colors" />
          </div>
          <span
            className={`text-xs font-medium text-slate-500 whitespace-nowrap overflow-hidden transition-all duration-200 ${
              isNavHovered ? 'max-w-[155px] opacity-100 ml-2' : 'max-w-0 opacity-0 ml-0 pointer-events-none'
            }`}
          >
            Back to top
          </span>
        </button>
      </div>
    </aside>
  );
};

export default FloatingSideNav;
