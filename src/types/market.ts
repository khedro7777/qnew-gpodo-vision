
export interface MarketNavigator {
  getTrends(industry: string): Promise<MarketTrend[]>;
  getPriceInsights(category: string): Promise<PriceInsight[]>;
  getOpportunities(userProfile: UserProfile): Promise<Opportunity[]>;
  getCompetitorAnalysis(business: BusinessInfo): Promise<CompetitorAnalysis>;
}

export interface MarketTrend {
  id: string;
  trend: string;
  industry: string;
  growth: number;
  timeframe: string;
  confidence: number;
  sources: DataSource[];
  aiInsights: string[];
  icon: string;
  color: string;
}

export interface PriceInsight {
  id: string;
  category: string;
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  trend: 'rising' | 'falling' | 'stable';
  recommendations: string[];
  lastUpdated: Date;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  market: string;
  potential: number;
  difficulty: 'low' | 'medium' | 'high';
  timeToMarket: number;
  estimatedRevenue: number;
  matchScore: number;
}

export interface CompetitorAnalysis {
  id: string;
  competitors: Competitor[];
  marketPosition: string;
  strengths: string[];
  weaknesses: string[];
  threats: string[];
  opportunities: string[];
}

export interface Competitor {
  name: string;
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
}

export interface DataSource {
  name: string;
  url: string;
  reliability: number;
}

export interface UserProfile {
  id: string;
  industry: string;
  skills: string[];
  interests: string[];
  experience: number;
}

export interface BusinessInfo {
  name: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large';
  location: string;
  products: string[];
}

// Risk Management Types
export interface RiskEngine {
  assessUserRisk(userId: string): Promise<RiskAssessment>;
  evaluateTransactionRisk(transaction: Transaction): Promise<RiskScore>;
  monitorGroupActivity(groupId: string): Promise<RiskAlert[]>;
  suggestMitigation(risk: Risk): Promise<MitigationStrategy[]>;
}

export interface RiskAssessment {
  overall: RiskLevel;
  factors: RiskFactor[];
  recommendations: string[];
  requiredActions: string[];
  monitoringFrequency: 'daily' | 'weekly' | 'monthly';
  score: number;
  lastUpdated: Date;
}

export type RiskLevel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';

export interface RiskFactor {
  type: string;
  level: RiskLevel;
  description: string;
  impact: number;
  likelihood: number;
}

export interface RiskAlert {
  id: string;
  type: 'security' | 'financial' | 'operational' | 'compliance';
  severity: RiskLevel;
  message: string;
  groupId?: string;
  userId?: string;
  timestamp: Date;
  resolved: boolean;
}

export interface RiskScore {
  score: number;
  level: RiskLevel;
  factors: string[];
  confidence: number;
}

export interface Risk {
  id: string;
  type: string;
  level: RiskLevel;
  description: string;
}

export interface MitigationStrategy {
  strategy: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  effectiveness: number;
}

export interface Transaction {
  id: string;
  amount: number;
  fromUserId: string;
  toUserId: string;
  type: string;
  timestamp: Date;
  status: string;
}
