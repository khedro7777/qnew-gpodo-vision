
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Clock,
  Building,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MCPOfferAnalyzerProps {
  mcpAgent: any;
  onLogActivity: (type: string, description: string, groupId?: string, metadata?: any) => void;
}

const MCPOfferAnalyzer = ({ mcpAgent, onLogActivity }: MCPOfferAnalyzerProps) => {
  const [offers, setOffers] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      // Load offers with mock data
      const mockOffers = [
        {
          id: '1',
          type: 'supplier',
          group_id: '1',
          group_name: 'Medical Equipment Purchasing',
          group_number: 'P 105',
          submitter_name: 'MedTech Solutions',
          submitter_company: 'MedTech Solutions Ltd',
          title: 'Advanced MRI Equipment Package',
          price: 450000,
          delivery_time: '6 weeks',
          warranty: '3 years',
          submitted_at: '2024-01-20T10:30:00Z',
          status: 'pending',
          risk_score: 25,
          market_comparison: 'competitive',
          savings_potential: 15000
        },
        {
          id: '2',
          type: 'freelancer',
          group_id: '2',
          group_name: 'Tech Startup Investment',
          group_number: 'I 203',
          submitter_name: 'Sarah Johnson',
          submitter_company: 'Freelancer',
          title: 'Full-Stack Developer Services',
          price: 5000,
          delivery_time: '2 weeks',
          experience: '5+ years',
          submitted_at: '2024-01-19T14:15:00Z',
          status: 'pending',
          risk_score: 10,
          market_comparison: 'below_market',
          savings_potential: 2000
        }
      ];

      setOffers(mockOffers);
    } catch (error) {
      console.error('Error loading offers:', error);
    }
  };

  const analyzeOffer = async (offer: any) => {
    try {
      setSelectedOffer(offer);
      
      // Simulate AI analysis
      const analysisResult = {
        overall_score: Math.floor(Math.random() * 40) + 60, // 60-100
        risk_assessment: {
          financial_risk: Math.floor(Math.random() * 30) + 10,
          delivery_risk: Math.floor(Math.random() * 25) + 5,
          quality_risk: Math.floor(Math.random() * 20) + 5
        },
        market_analysis: {
          price_comparison: offer.market_comparison,
          similar_offers: Math.floor(Math.random() * 10) + 5,
          average_market_price: offer.price * (1 + (Math.random() - 0.5) * 0.3)
        },
        recommendations: [
          'Request additional warranty coverage',
          'Negotiate payment terms',
          'Verify supplier credentials',
          'Consider bulk discount opportunities'
        ],
        compliance_check: {
          legal_requirements: 'passed',
          industry_standards: 'passed',
          group_policies: 'passed'
        }
      };

      setAnalysis(analysisResult);
      
      onLogActivity(
        'offer_analyzed',
        `Analyzed ${offer.type} offer from ${offer.submitter_name}`,
        offer.group_id,
        { offer_id: offer.id, analysis_score: analysisResult.overall_score }
      );

      toast.success('Offer analysis completed');
    } catch (error) {
      console.error('Error analyzing offer:', error);
      toast.error('Failed to analyze offer');
    }
  };

  const approveOffer = async (offerId: string) => {
    try {
      // Update offer status
      setOffers(prev => prev.map(offer => 
        offer.id === offerId 
          ? { ...offer, status: 'approved' }
          : offer
      ));

      const offer = offers.find(o => o.id === offerId);
      onLogActivity(
        'offer_approved',
        `Approved offer from ${offer?.submitter_name}`,
        offer?.group_id,
        { offer_id: offerId }
      );

      toast.success('Offer approved successfully');
    } catch (error) {
      console.error('Error approving offer:', error);
      toast.error('Failed to approve offer');
    }
  };

  const rejectOffer = async (offerId: string) => {
    try {
      // Update offer status
      setOffers(prev => prev.map(offer => 
        offer.id === offerId 
          ? { ...offer, status: 'rejected' }
          : offer
      ));

      const offer = offers.find(o => o.id === offerId);
      onLogActivity(
        'offer_rejected',
        `Rejected offer from ${offer?.submitter_name}`,
        offer?.group_id,
        { offer_id: offerId }
      );

      toast.success('Offer rejected');
    } catch (error) {
      console.error('Error rejecting offer:', error);
      toast.error('Failed to reject offer');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 20) return 'text-green-600';
    if (score <= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Offer Analysis Center</h2>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">
            {offers.filter(o => o.status === 'pending').length} Pending Analysis
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Offers List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Submitted Offers</h3>
          
          {offers.map((offer) => (
            <Card key={offer.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {offer.type === 'supplier' ? 
                        <Building className="w-4 h-4 text-purple-500" /> :
                        <User className="w-4 h-4 text-orange-500" />
                      }
                      <h4 className="font-semibold">{offer.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{offer.submitter_name}</p>
                    <p className="text-xs text-gray-500">{offer.group_name} ({offer.group_number})</p>
                  </div>
                  <Badge className={getStatusColor(offer.status)}>
                    {offer.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-green-500" />
                      <span className="text-sm font-medium">${offer.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span className="text-sm">{offer.delivery_time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Risk Score:</span>
                    <span className={`text-xs font-medium ${getRiskColor(offer.risk_score)}`}>
                      {offer.risk_score}%
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => analyzeOffer(offer)}
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Analyze
                    </Button>
                    {offer.status === 'pending' && (
                      <>
                        <Button 
                          size="sm"
                          onClick={() => approveOffer(offer.id)}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => rejectOffer(offer.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analysis Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI Analysis Results</h3>
          
          {selectedOffer && analysis ? (
            <div className="space-y-4">
              {/* Overall Score */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Overall Score</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {analysis.overall_score}/100
                    </div>
                  </div>
                  <Progress value={analysis.overall_score} className="h-2" />
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Financial Risk</span>
                    <span className={`text-sm font-medium ${getRiskColor(analysis.risk_assessment.financial_risk)}`}>
                      {analysis.risk_assessment.financial_risk}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Delivery Risk</span>
                    <span className={`text-sm font-medium ${getRiskColor(analysis.risk_assessment.delivery_risk)}`}>
                      {analysis.risk_assessment.delivery_risk}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Quality Risk</span>
                    <span className={`text-sm font-medium ${getRiskColor(analysis.risk_assessment.quality_risk)}`}>
                      {analysis.risk_assessment.quality_risk}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Market Analysis */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Market Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Price Comparison</span>
                    <div className="flex items-center gap-1">
                      {analysis.market_analysis.price_comparison === 'competitive' ? 
                        <TrendingUp className="w-3 h-3 text-blue-500" /> :
                        <TrendingDown className="w-3 h-3 text-green-500" />
                      }
                      <span className="text-sm capitalize">{analysis.market_analysis.price_comparison}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Similar Offers</span>
                    <span className="text-sm">{analysis.market_analysis.similar_offers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Market Average</span>
                    <span className="text-sm">${analysis.market_analysis.average_market_price.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Compliance Check */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Compliance Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Legal Requirements</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Industry Standards</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Group Policies</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">No Analysis Selected</h4>
                <p className="text-gray-500">Select an offer to view AI analysis results</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MCPOfferAnalyzer;
