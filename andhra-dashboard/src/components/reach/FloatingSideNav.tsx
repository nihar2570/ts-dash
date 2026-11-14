import React from 'react';
import {
  Globe2,
  Users,
  Flame,
  BarChart3,
  Calendar,
  Flag,
  Trophy,
  Zap,
  Compass,
} from 'lucide-react';
import { FloatingSideNav as CommonFloatingSideNav, type NavSection } from '../common/FloatingSideNav';

export { type NavSection };

export const BLUE_PILL_SECTIONS: NavSection[] = [
  {
    id: 'reach-overview',
    label: 'Overview',
    shortLabel: 'Overview',
    icon: <Globe2 className="w-4 h-4" />,
  },
  {
    id: 'reach-routes',
    label: 'Strategy Route',
    shortLabel: 'Routes',
    icon: <Compass className="w-4 h-4" />,
  },
  {
    id: 'reach-party',
    label: 'Campaign Party',
    shortLabel: 'Party',
    icon: <Flag className="w-4 h-4" />,
  },
  {
    id: 'reach-cohort',
    label: 'Community & Age',
    shortLabel: 'Cohort',
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: 'reach-verdict',
    label: 'Persuadability',
    shortLabel: 'Verdict',
    icon: <Flame className="w-4 h-4" />,
  },
  {
    id: 'reach-issues',
    label: 'Issue Salience',
    shortLabel: 'Issues',
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: 'reach-cadence',
    label: '5–10 Touch Cadence',
    shortLabel: 'Cadence',
    icon: <Calendar className="w-4 h-4" />,
  },
];

export const RED_PILL_SECTIONS: NavSection[] = [
  {
    id: 'reach-overview',
    label: 'Overview',
    shortLabel: 'Overview',
    icon: <Globe2 className="w-4 h-4" />,
  },
  {
    id: 'reach-routes',
    label: 'Strategy Route',
    shortLabel: 'Routes',
    icon: <Compass className="w-4 h-4" />,
  },
  {
    id: 'red-pill-barometer',
    label: 'Vote Shift Barometer',
    shortLabel: 'Barometer',
    icon: <Trophy className="w-4 h-4" />,
  },
  {
    id: 'red-pill-triggers',
    label: 'Interactive Taboo Tree',
    shortLabel: 'Taboo Tree',
    icon: <Zap className="w-4 h-4" />,
  },
];

interface FloatingSideNavProps {
  sections?: NavSection[];
  activeRoute?: 'blue_pill' | 'red_pill';
  navTitle?: string;
}

export const FloatingSideNav: React.FC<FloatingSideNavProps> = ({
  sections,
  activeRoute = 'blue_pill',
  navTitle,
}) => {
  const resolvedSections = sections || (activeRoute === 'red_pill' ? RED_PILL_SECTIONS : BLUE_PILL_SECTIONS);
  const resolvedNavTitle = navTitle || (activeRoute === 'red_pill' ? 'RED PILL' : 'BLUE PILL');

  return <CommonFloatingSideNav sections={resolvedSections} navTitle={resolvedNavTitle} />;
};

export default FloatingSideNav;
