
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RiskAssessment, RiskAlert, RiskScore, RiskLevel, MitigationStrategy } from '@/types/market';

const mockRiskAssessment: RiskAssessment = {
  overall: 'medium',
  score: 65,
  lastUpdated: new Date(),
  factors: [
    {
      type: 'Financial',
      level: 'medium',
      description: 'Moderate exposure to payment defaults',
      impact: 0.7,
      likelihood: 0.3
    },
    {
      type: 'Operational',
      level: 'low',
      description: 'Strong operational processes in place',
      impact: 0.4,
      likelihood: 0.2
    },
    {
      type: 'Security',
      level: 'high',
      description: 'Recent increase in cyber threats',
      impact: 0.9,
      likelihood: 0.4
    }
  ],
  recommendations: [
    'Implement additional security measures',
    'Diversify payment methods',
    'Regular risk assessment reviews'
  ],
  requiredActions: [
    'Update security protocols within 30 days',
    'Conduct team security training'
  ],
  monitoringFrequency: 'weekly'
};

const mockAlerts: RiskAlert[] = [
  {
    id: '1',
    type: 'security',
    severity: 'high',
    message: 'Unusual login activity detected for user account',
    userId: 'user-123',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    resolved: false
  },
  {
    id: '2',
    type: 'financial',
    severity: 'medium',
    message: 'Payment delay risk identified for Group Project Alpha',
    groupId: 'group-456',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    resolved: false
  }
];

export const useRiskManagement = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('7d');

  const { data: riskAssessment, isLoading: assessmentLoading } = useQuery({
    queryKey: ['risk-assessment'],
    queryFn: async () => {
      console.log('Fetching risk assessment');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockRiskAssessment;
    },
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['risk-alerts', selectedTimeframe],
    queryFn: async () => {
      console.log('Fetching risk alerts for timeframe:', selectedTimeframe);
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAlerts;
    },
  });

  const assessUserRisk = async (userId: string): Promise<RiskAssessment> => {
    console.log('Assessing risk for user:', userId);
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockRiskAssessment;
  };

  const evaluateTransactionRisk = async (transaction: any): Promise<RiskScore> => {
    console.log('Evaluating transaction risk:', transaction);
    return {
      score: 35,
      level: 'low' as RiskLevel,
      factors: ['Verified parties', 'Standard amount', 'Secure payment method'],
      confidence: 0.87
    };
  };

  const suggestMitigation = async (riskType: string): Promise<MitigationStrategy[]> => {
    const strategies: { [key: string]: MitigationStrategy[] } = {
      security: [
        {
          strategy: 'Enable Two-Factor Authentication',
          description: 'Add an extra layer of security to user accounts',
          priority: 'high',
          effort: 'low',
          effectiveness: 0.85
        },
        {
          strategy: 'Implement Rate Limiting',
          description: 'Prevent brute force attacks and API abuse',
          priority: 'medium',
          effort: 'medium',
          effectiveness: 0.70
        }
      ],
      financial: [
        {
          strategy: 'Escrow Payment System',
          description: 'Hold payments until work completion',
          priority: 'high',
          effort: 'high',
          effectiveness: 0.90
        },
        {
          strategy: 'Credit Scoring Integration',
          description: 'Assess payment reliability before transactions',
          priority: 'medium',
          effort: 'medium',
          effectiveness: 0.75
        }
      ]
    };

    return strategies[riskType] || [];
  };

  const getRiskColor = (level: RiskLevel): string => {
    const colors = {
      very_low: 'text-green-600',
      low: 'text-green-500',
      medium: 'text-yellow-500',
      high: 'text-orange-500',
      very_high: 'text-red-600'
    };
    return colors[level];
  };

  const getRiskBgColor = (level: RiskLevel): string => {
    const colors = {
      very_low: 'bg-green-100',
      low: 'bg-green-50',
      medium: 'bg-yellow-50',
      high: 'bg-orange-50',
      very_high: 'bg-red-50'
    };
    return colors[level];
  };

  return {
    riskAssessment,
    alerts,
    assessmentLoading,
    alertsLoading,
    selectedTimeframe,
    setSelectedTimeframe,
    assessUserRisk,
    evaluateTransactionRisk,
    suggestMitigation,
    getRiskColor,
    getRiskBgColor
  };
};
