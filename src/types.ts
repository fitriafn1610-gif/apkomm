export type NavSection =
  | 'dashboard'
  | 'influencers'
  | 'sentiment'
  | 'results'
  | 'evaluation'
  | 'settings';

export type SentimentCategory = 'positif' | 'netral' | 'negatif';

export type PartnershipDecision =
  | 'belum_dievaluasi'
  | 'lanjutkan'
  | 'perbaiki_strategi'
  | 'hentikan';

export interface AudienceComment {
  id: string;
  author: string;
  text: string;
  platform: string;
  createdAt: string;
  sentiment: SentimentCategory;
  score: number;
  matchedKeywords: string[];
  isSimulation: boolean;
}

export interface TrendPoint {
  label: string;
  positif: number;
  netral: number;
  negatif: number;
}

export interface EvaluationRecord {
  decision: PartnershipDecision;
  brandFitScore: number;
  messageClarityScore: number;
  audienceTrustScore: number;
  notes: string;
  evaluatedAt: string | null;
  evaluatorName: string;
}

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  platform: string;
  category: string;
  followers: string;
  campaignTitle: string;
  avatarUrl: string;
  notes: string;
  isSimulation: boolean;
  lastAnalyzedAt: string | null;
  comments: AudienceComment[];
  trend: TrendPoint[];
  evaluation: EvaluationRecord;
}

export interface AppSettings {
  brandName: string;
  prLeadName: string;
  positiveThreshold: number;
  negativeAlertThreshold: number;
}

export interface SentimentSummary {
  total: number;
  positifCount: number;
  netralCount: number;
  negatifCount: number;
  positifPct: number;
  netralPct: number;
  negatifPct: number;
  netSentimentScore: number;
  isPositiveImpact: boolean;
  impactLabel: string;
  impactDescription: string;
  recommendationType: 'lanjutkan' | 'perbaiki_strategi';
  topPositiveKeywords: { word: string; count: number }[];
  topNegativeKeywords: { word: string; count: number }[];
}
