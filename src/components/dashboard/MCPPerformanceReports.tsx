
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MCPPerformanceReportsProps {
  mcpAgent: any;
  onLogActivity: (type: string, description: string, groupId?: string, metadata?: any) => void;
}

const MCPPerformanceReports = ({ mcpAgent, onLogActivity }: MCPPerformanceReportsProps) => {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    loadReports();
  }, [selectedPeriod, selectedGroup]);

  const loadReports = async () => {
    try {
      // Load performance reports with mock data
      const mockReports = [
        {
          id: '1',
          group_id: '1',
          group_name: 'Medical Equipment Purchasing',
          group_number: 'P 105',
          report_period: 'monthly',
          performance_score: 89,
          member_satisfaction: 4.5,
          completed_projects: 3,
          total_savings: 45000,
          active_members: 12,
          created_at: '2024-01-01T00:00:00Z',
          report_data: {
            member_growth: 15,
            project_success_rate: 95,
            average_deal_size: 15000,
            response_time: 2.3
          }
        },
        {
          id: '2',
          group_id: '2',
          group_name: 'Tech Startup Investment',
          group_number: 'I 203',
          report_period: 'monthly',
          performance_score: 76,
          member_satisfaction: 4.2,
          completed_projects: 2,
          total_savings: 125000,
          active_members: 8,
          created_at: '2024-01-01T00:00:00Z',
          report_data: {
            member_growth: 8,
            project_success_rate: 85,
            average_deal_size: 62500,
            response_time: 3.1
          }
        }
      ];

      setReports(mockReports);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const generateReport = async () => {
    try {
      setGeneratingReport(true);
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport = {
        id: Date.now().toString(),
        group_id: selectedGroup,
        group_name: selectedGroup === 'all' ? 'All Groups' : 'Selected Group',
        report_period: selectedPeriod,
        performance_score: Math.floor(Math.random() * 30) + 70,
        member_satisfaction: (Math.random() * 1.5 + 3.5).toFixed(1),
        completed_projects: Math.floor(Math.random() * 5) + 1,
        total_savings: Math.floor(Math.random() * 100000) + 50000,
        active_members: Math.floor(Math.random() * 15) + 5,
        created_at: new Date().toISOString()
      };

      setReports(prev => [newReport, ...prev]);
      
      onLogActivity(
        'report_generated',
        `Generated ${selectedPeriod} performance report`,
        selectedGroup !== 'all' ? selectedGroup : undefined,
        { period: selectedPeriod, score: newReport.performance_score }
      );

      toast.success('Performance report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const exportReport = async (reportId: string) => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;

      // Simulate export
      toast.success(`Report exported: ${report.group_name} - ${report.report_period}`);
      
      onLogActivity(
        'report_exported',
        `Exported report for ${report.group_name}`,
        report.group_id,
        { report_id: reportId }
      );
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (score: number) => {
    return score >= 80 ? 
      <TrendingUp className="w-4 h-4 text-green-500" /> :
      <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Reports Center</h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Groups</option>
            <option value="1">Medical Equipment (P 105)</option>
            <option value="2">Tech Investment (I 203)</option>
          </select>
          
          <Button onClick={generateReport} disabled={generatingReport}>
            <BarChart3 className="w-4 h-4 mr-2" />
            {generatingReport ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-6">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{report.group_name}</CardTitle>
                    {report.group_number && (
                      <Badge className="bg-blue-100 text-blue-800 font-mono">
                        {report.group_number}
                      </Badge>
                    )}
                    <Badge variant="outline" className="capitalize">
                      {report.report_period}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Generated: {new Date(report.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getPerformanceIcon(report.performance_score)}
                  <span className={`text-2xl font-bold ${getPerformanceColor(report.performance_score)}`}>
                    {report.performance_score}%
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-500">Active Members</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{report.active_members}</p>
                  {report.report_data?.member_growth && (
                    <p className="text-xs text-green-600">+{report.report_data.member_growth}% growth</p>
                  )}
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-500">Total Savings</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    ${report.total_savings.toLocaleString()}
                  </p>
                  {report.report_data?.average_deal_size && (
                    <p className="text-xs text-gray-500">
                      Avg: ${report.report_data.average_deal_size.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-500">Completed Projects</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{report.completed_projects}</p>
                  {report.report_data?.project_success_rate && (
                    <p className="text-xs text-green-600">{report.report_data.project_success_rate}% success</p>
                  )}
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-500">Satisfaction</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    {report.member_satisfaction}/5.0
                  </p>
                  <div className="flex justify-center">
                    <Progress 
                      value={report.member_satisfaction * 20} 
                      className="w-16 h-1 mt-1" 
                    />
                  </div>
                </div>
              </div>

              {/* Additional Metrics */}
              {report.report_data && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Additional Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Response Time</span>
                      <span className="text-sm font-medium">{report.report_data.response_time} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Member Growth</span>
                      <span className="text-sm font-medium text-green-600">
                        +{report.report_data.member_growth}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportReport(report.id)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export PDF
                </Button>
                <Button size="sm">
                  <FileText className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reports.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reports Generated</h3>
            <p className="text-gray-500 mb-4">Generate your first performance report to get started</p>
            <Button onClick={generateReport} disabled={generatingReport}>
              Generate Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MCPPerformanceReports;
