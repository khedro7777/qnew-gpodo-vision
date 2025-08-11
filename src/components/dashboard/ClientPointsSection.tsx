
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, Gift, Clock, Zap } from 'lucide-react';
import { BuyPointsButton } from '@/components/wallet/BuyPointsButton';

export const ClientPointsSection = () => {
  // Mock data - in real app this would come from API
  const pointsData = {
    balance: 2500,
    monthlyUsage: 850,
    totalEarned: 15000,
    expiryDate: '2024-12-31',
    recentTransactions: [
      { id: '1', type: 'spent', description: 'Published group offer', amount: -100, date: '2025-01-08' },
      { id: '2', type: 'earned', description: 'Referral bonus', amount: 50, date: '2025-01-07' },
      { id: '3', type: 'spent', description: 'Featured listing upgrade', amount: -200, date: '2025-01-06' },
      { id: '4', type: 'earned', description: 'Successful deal completion', amount: 300, date: '2025-01-05' },
    ]
  };

  const pointsUsage = [
    { category: 'Publish Offers', points: 100, description: 'Cost per offer published' },
    { category: 'Featured Listings', points: 200, description: 'Boost visibility for 30 days' },
    { category: 'Premium Support', points: 50, description: 'Priority customer service' },
    { category: 'Analytics Dashboard', points: 150, description: 'Advanced performance metrics' },
  ];

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Points</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pointsData.balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Expires on {new Date(pointsData.expiryDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pointsData.monthlyUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <Gift className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pointsData.totalEarned.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Points Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <BuyPointsButton 
              currentPoints={pointsData.balance}
              size="lg"
            />
            <Button variant="outline" size="lg">
              <Gift className="w-4 h-4 mr-2" />
              Redeem Code
            </Button>
            <Button variant="outline" size="lg">
              <TrendingUp className="w-4 h-4 mr-2" />
              View History
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Points Usage Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Points Usage Guide</CardTitle>
            <p className="text-sm text-muted-foreground">
              How you can spend your points on the platform
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pointsUsage.map((usage, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{usage.category}</div>
                    <div className="text-sm text-muted-foreground">{usage.description}</div>
                  </div>
                  <Badge variant="outline" className="font-semibold">
                    {usage.points} pts
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pointsData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
