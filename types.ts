export type TabId = 'entry' | 'rankings' | 'team' | 'personal';

export interface Analyst {
  id: string;
  name: string;
  englishName?: string;
  role: string;
  avatarColor: string;
  progress: number;
  roadshows: { current: number; target: number };
  calls: { current: number; target: number };
  reports: { current: number; target: number };
  status?: 'warning' | 'stable' | 'normal';
  percentile: number;
  incomeRank?: number;
}

export interface TeamStats {
  roadshowProgress: number;
  roadshowTotal: number;
  roadshowTarget: number;
  reportsCompleted: number;
  reportsTarget: number;
  callsCompleted: number;
  callsTarget: number;
  incomeTrend: { week: string; rank: number }[];
}