
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MarketTrend, PriceInsight, Opportunity, CompetitorAnalysis, UserProfile, BusinessInfo } from '@/types/market';

// Mock data for demonstration
const mockTrends: MarketTrend[] = [
  {
    id: '1',
    trend: 'AI-Powered Business Automation',
    industry: 'Technology',
    growth: 23.5,
    timeframe: '2024-2025',
    confidence: 0.89,
    sources: [
      { name: 'McKinsey Global Institute', url: '#', reliability: 0.95 },
      { name: 'World Economic Forum', url: '#', reliability: 0.92 }
    ],
    aiInsights: [
      'High demand for AI integration in SMEs',
      'Significant ROI potential in process automation',
      'Growing skill gap presents opportunity'
    ],
    icon: '🤖',
    color: 'text-blue-600'
  },
  {
    id: '2',
    trend: 'Sustainable Supply Chains',
    industry: 'Manufacturing',
    growth: 18.2,
    timeframe: '2024-2026',
    confidence: 0.82,
    sources: [
      { name: 'Deloitte Insights', url: '#', reliability: 0.88 },
      { name: 'BCG Research', url: '#', reliability: 0.90 }
    ],
    aiInsights: [
      'ESG requirements driving market shift',
      'Carbon neutral logistics gaining traction',
      'Premium pricing for sustainable options'
    ],
    icon: '♻️',
    color: 'text-green-600'
  },
  {
    id: '3',
    trend: 'Remote Collaboration Tools',
    industry: 'Software',
    growth: 15.7,
    timeframe: '2024',
    confidence: 0.91,
    sources: [
      { name: 'Gartner', url: '#', reliability: 0.93 },
      { name: 'Forrester', url: '#', reliability: 0.89 }
    ],
    aiInsights: [
      'Hybrid work models becoming permanent',
      'Integration with AI assistants essential',
      'Security and compliance top priorities'
    ],
    icon: '💻',
    color: 'text-purple-600'
  }
];

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'AI Consulting for SMEs',
    description: 'Help small businesses integrate AI solutions',
    market: 'Technology Consulting',
    potential: 85,
    difficulty: 'medium',
    timeToMarket: 3,
    estimatedRevenue: 150000,
    matchScore: 92
  },
  {
    id: '2',
    title: 'Sustainable Packaging Solutions',
    description: 'Eco-friendly packaging for e-commerce',
    market: 'Green Technology',
    potential: 78,
    difficulty: 'high',
    timeToMarket: 6,
    estimatedRevenue: 250000,
    matchScore: 87
  }
];

export const useMarketNavigator = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('Technology');

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['market-trends', selectedIndustry],
    queryFn: async () => {
      // Mock API call
      console.log('Fetching market trends for:', selectedIndustry);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockTrends.filter(trend => trend.industry === selectedIndustry || selectedIndustry === 'All');
    },
  });

  const { data: opportunities, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['market-opportunities'],
    queryFn: async () => {
      console.log('Fetching market opportunities');
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockOpportunities;
    },
  });

  const getTrends = async (industry: string): Promise<MarketTrend[]> => {
    setSelectedIndustry(industry);
    return mockTrends.filter(trend => trend.industry === industry);
  };

  const getPriceInsights = async (category: string): Promise<PriceInsight[]> => {
    // Mock implementation
    return [
      {
        id: '1',
        category,
        averagePrice: 1500,
        priceRange: { min: 800, max: 2500 },
        trend: 'rising',
        recommendations: ['Consider bulk purchasing', 'Lock in current rates'],
        lastUpdated: new Date()
      }
    ];
  };

  const getOpportunities = async (userProfile: UserProfile): Promise<Opportunity[]> => {
    return mockOpportunities.filter(opp => 
      userProfile.interests.some(interest => 
        opp.description.toLowerCase().includes(interest.toLowerCase())
      )
    );
  };

  const getCompetitorAnalysis = async (business: BusinessInfo): Promise<CompetitorAnalysis> => {
    return {
      id: '1',
      competitors: [
        {
          name: 'TechCorp',
          marketShare: 25,
          strengths: ['Strong brand', 'Large customer base'],
          weaknesses: ['High prices', 'Slow innovation'],
          pricing: 'Premium'
        }
      ],
      marketPosition: 'Growing challenger',
      strengths: ['Agile development', 'Customer focus'],
      weaknesses: ['Limited resources', 'Brand recognition'],
      threats: ['Market saturation', 'Economic downturn'],
      opportunities: ['Emerging markets', 'Technology partnerships']
    };
  };

  return {
    trends,
    opportunities,
    trendsLoading,
    opportunitiesLoading,
    selectedIndustry,
    setSelectedIndustry,
    getTrends,
    getPriceInsights,
    getOpportunities,
    getCompetitorAnalysis
  };
};
