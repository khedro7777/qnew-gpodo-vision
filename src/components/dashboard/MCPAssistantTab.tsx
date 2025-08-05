
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, AlertTriangle, TrendingUp, FileText, MessageSquare } from 'lucide-react';

const MCPAssistantTab = () => {
  const alerts = [
    {
      id: '1',
      type: 'warning',
      title: 'Supplier Risk Alert',
      message: 'Supplier XYZ has recent negative reviews. Consider additional due diligence.',
      group: 'Tech Supplies Group',
      timestamp: '2025-08-05T10:30:00Z'
    },
    {
      id: '2',
      type: 'info',
      title: 'Market Price Update',
      message: 'Current market price for steel is 15% below your quoted price. Good deal!',
      group: 'Manufacturing Group',
      timestamp: '2025-08-05T08:15:00Z'
    },
    {
      id: '3',
      type: 'success',
      title: 'Contract Analysis Complete',
      message: 'All contract terms appear favorable. No red flags detected.',
      group: 'Export Group',
      timestamp: '2025-08-05T07:45:00Z'
    }
  ];

  const suggestions = [
    {
      id: '1',
      title: 'Optimize Group Formation',
      description: 'Based on your industry, consider forming a group with 8-12 members for better negotiation power.',
      action: 'View Recommendations'
    },
    {
      id: '2',
      title: 'Supplier Diversification',
      description: 'Your current groups rely heavily on Asian suppliers. Consider European alternatives.',
      action: 'Explore Options'
    },
    {
      id: '3',
      title: 'Timing Optimization',
      description: 'Historical data suggests better pricing in Q1. Schedule your next purchase accordingly.',
      action: 'Set Reminder'
    }
  ];

  return (
    <div className="space-y-6">
      {/* MCP Assistant Overview */}
      <Card className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">MCP AI Assistant</h2>
            <p className="text-white/80">Your intelligent business companion</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold">24</p>
            <p className="text-white/80 text-sm">Alerts Generated</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">12</p>
            <p className="text-white/80 text-sm">Groups Monitored</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">96%</p>
            <p className="text-white/80 text-sm">Accuracy Rate</p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Recent Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      alert.type === 'warning' ? 'bg-amber-100 text-amber-800' :
                      alert.type === 'success' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    } border-0 text-xs`}>
                      {alert.type}
                    </Badge>
                    <span className="text-sm text-gray-500">{alert.group}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{alert.title}</h4>
                <p className="text-sm text-gray-600">{alert.message}</p>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            View All Alerts
          </Button>
        </Card>

        {/* Smart Suggestions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Smart Suggestions</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                <Button size="sm" variant="outline">
                  {suggestion.action}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI Chat Interface */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900">Chat with MCP Assistant</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm text-gray-800">
                  Hello! I'm your MCP Assistant. I can help you with group analysis, supplier research, 
                  contract reviews, and market insights. What would you like to know?
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Ask MCP Assistant anything..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button>Send</Button>
        </div>
      </Card>
    </div>
  );
};

export default MCPAssistantTab;
