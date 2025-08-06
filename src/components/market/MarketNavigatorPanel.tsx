
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Target, DollarSign, BarChart3, Lightbulb, ArrowUpRight } from 'lucide-react';
import { useMarketNavigator } from '@/hooks/useMarketNavigator';
import { Skeleton } from '@/components/ui/skeleton';

const MarketNavigatorPanel = () => {
  const {
    trends,
    opportunities,
    trendsLoading,
    opportunitiesLoading,
    selectedIndustry,
    setSelectedIndustry
  } = useMarketNavigator();

  const industries = ['All', 'Technology', 'Manufacturing', 'Healthcare', 'Finance', 'Retail'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Market Navigator</h2>
          <p className="text-gray-600">AI-powered market insights and opportunities</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Market Trends
            </CardTitle>
            <CardDescription>
              Latest market trends with AI insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trendsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              trends?.map(trend => (
                <div key={trend.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{trend.icon}</span>
                      <h4 className="font-semibold text-gray-900">{trend.trend}</h4>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      +{trend.growth}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>📈 {trend.timeframe}</span>
                      <span>🎯 {Math.round(trend.confidence * 100)}% confidence</span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">AI Insights:</p>
                      {trend.aiInsights.slice(0, 2).map((insight, idx) => (
                        <p key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3 text-yellow-500" />
                          {insight}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Market Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Market Opportunities
            </CardTitle>
            <CardDescription>
              Personalized opportunities based on your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {opportunitiesLoading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                ))}
              </div>
            ) : (
              opportunities?.map(opportunity => (
                <div key={opportunity.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{opportunity.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {opportunity.matchScore}% match
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-gray-500">Potential</p>
                      <p className="font-medium text-blue-600">{opportunity.potential}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Timeline</p>
                      <p className="font-medium">{opportunity.timeToMarket}mo</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Revenue Est.</p>
                      <p className="font-medium text-green-600">
                        ${(opportunity.estimatedRevenue / 1000).toFixed(0)}k
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="mt-3">
                    Explore Opportunity
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Market Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Market Insights Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Market Size</h3>
              <p className="text-2xl font-bold text-green-600 mt-1">$2.4B</p>
              <p className="text-sm text-gray-600">Total addressable market</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Growth Rate</h3>
              <p className="text-2xl font-bold text-blue-600 mt-1">+18.5%</p>
              <p className="text-sm text-gray-600">Year over year</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Opportunities</h3>
              <p className="text-2xl font-bold text-purple-600 mt-1">12</p>
              <p className="text-sm text-gray-600">High-potential matches</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketNavigatorPanel;
