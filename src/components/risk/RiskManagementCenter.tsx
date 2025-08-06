
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  BarChart3,
  Settings
} from 'lucide-react';
import { useRiskManagement } from '@/hooks/useRiskManagement';
import { Skeleton } from '@/components/ui/skeleton';

const RiskManagementCenter = () => {
  const {
    riskAssessment,
    alerts,
    assessmentLoading,
    alertsLoading,
    selectedTimeframe,
    setSelectedTimeframe,
    getRiskColor,
    getRiskBgColor
  } = useRiskManagement();

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'very_low':
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'high':
      case 'very_high':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Shield className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Risk Management Center</h2>
          <p className="text-gray-600">Monitor and manage platform risks</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Risk</p>
                {assessmentLoading ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className={`text-lg font-bold capitalize ${getRiskColor(riskAssessment?.overall || 'medium')}`}>
                    {riskAssessment?.overall}
                  </p>
                )}
              </div>
              <Shield className={`w-8 h-8 ${getRiskColor(riskAssessment?.overall || 'medium')}`} />
            </div>
            {!assessmentLoading && riskAssessment && (
              <div className="mt-2">
                <Progress value={riskAssessment.score} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Score: {riskAssessment.score}/100</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-lg font-bold text-orange-600">
                  {alertsLoading ? '-' : alerts?.filter(a => !a.resolved).length || 0}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved Today</p>
                <p className="text-lg font-bold text-green-600">
                  {alertsLoading ? '-' : alerts?.filter(a => a.resolved).length || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Risk Trend</p>
                <p className="text-lg font-bold text-blue-600">Stable</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assessment" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assessment">Risk Assessment</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Factors Analysis</CardTitle>
              <CardDescription>Detailed breakdown of risk factors</CardDescription>
            </CardHeader>
            <CardContent>
              {assessmentLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {riskAssessment?.factors.map((factor, index) => (
                    <div key={index} className={`p-4 rounded-lg ${getRiskBgColor(factor.level)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getRiskIcon(factor.level)}
                          <h4 className="font-semibold">{factor.type}</h4>
                        </div>
                        <Badge variant="outline" className={getRiskColor(factor.level)}>
                          {factor.level.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{factor.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Impact:</span>
                          <Progress value={factor.impact * 100} className="mt-1 h-2" />
                        </div>
                        <div>
                          <span className="text-gray-600">Likelihood:</span>
                          <Progress value={factor.likelihood * 100} className="mt-1 h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>AI-powered risk mitigation suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {riskAssessment?.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Alerts</CardTitle>
              <CardDescription>Active risk alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              {alertsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts?.filter(alert => !alert.resolved).map(alert => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        {getRiskIcon(alert.severity)}
                        <div>
                          <h4 className="font-medium text-gray-900">{alert.message}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {alert.timestamp.toLocaleString()}
                            </span>
                            <Badge variant="outline" className="capitalize">
                              {alert.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Investigate
                        </Button>
                        <Button variant="default" size="sm">
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                  {alerts?.filter(alert => !alert.resolved).length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                      <h3 className="font-medium text-gray-900">All Clear!</h3>
                      <p className="text-sm text-gray-600">No active risk alerts at the moment.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Risk Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Risk trend analytics coming soon</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Security', 'Financial', 'Operational', 'Compliance'].map((category) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }} />
                        </div>
                        <span className="text-xs text-gray-600 w-8">60%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskManagementCenter;
