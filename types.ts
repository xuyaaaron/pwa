export type TabId = 'entry' | 'rankings' | 'team' | 'personal' | 'weekly';

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
  services: { current: number; target: number };
  internal: { current: number; target: number };
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

export interface Record {
  id: string;
  type: 'roadshow' | 'call' | 'report' | 'service' | 'internal';
  member: string;
  date: string;
  institution?: string;
  topic: string;
  reportType?: 'deep' | 'topic';
  serviceType?: 'review' | 'daily_chart' | 'segment';
  interactionType?: 'online' | 'offline';
  isRealRoadshow?: boolean;
  clientName?: string;
  timestamp: number;
}