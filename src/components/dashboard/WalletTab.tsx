
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard, History, Plus, TrendingUp } from 'lucide-react';

const WalletTab = () => {
  const walletData = {
    balance: 2500,
    currency: 'Points',
    monthlySpending: 890,
    rechargeHistory: [
      { id: '1', amount: 1000, date: '2025-08-01', method: 'Credit Card', status: 'completed' },
      { id: '2', amount: 500, date: '2025-07-28', method: 'PayPal', status: 'completed' },
      { id: '3', amount: 2000, date: '2025-07-15', method: 'Bank Transfer', status: 'completed' },
    ],
    transactions: [
      { id: '1', type: 'spent', description: 'Group membership fee', amount: -50, date: '2025-08-05' },
      { id: '2', type: 'spent', description: 'KYCB upload fee', amount: -25, date: '2025-08-04' },
      { id: '3', type: 'earned', description: 'Referral bonus', amount: 100, date: '2025-08-03' },
      { id: '4', type: 'spent', description: 'Document generation', amount: -15, date: '2025-08-02' },
    ]
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-r from-productivity-blue to-productivity-purple text-white">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="w-8 h-8" />
            <Badge className="bg-white/20 text-white border-0">Active</Badge>
          </div>
          <div>
            <p className="text-white/80 text-sm">Current Balance</p>
            <h3 className="text-3xl font-bold">{walletData.balance.toLocaleString()}</h3>
            <p className="text-white/80 text-sm">{walletData.currency}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <span className="text-xs text-gray-500">This Month</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Monthly Spending</p>
            <h3 className="text-2xl font-bold text-gray-900">{walletData.monthlySpending}</h3>
            <p className="text-gray-500 text-sm">Points</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="w-8 h-8 text-blue-500" />
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Recharge
            </Button>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Quick Actions</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline">+100</Button>
              <Button size="sm" variant="outline">+500</Button>
              <Button size="sm" variant="outline">+1000</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recharge History */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Recharge History</h3>
            <History className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {walletData.rechargeHistory.map((recharge) => (
              <div key={recharge.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">+{recharge.amount} Points</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{new Date(recharge.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{recharge.method}</span>
                  </div>
                </div>
                <Badge className={`${
                  recharge.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                } border-0`}>
                  {recharge.status}
                </Badge>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            View All Recharge History
          </Button>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Recent Transactions</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          
          <div className="space-y-3">
            {walletData.transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'earned' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Points Usage Breakdown */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Points Usage Categories</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-900">Group Fees</p>
            <p className="text-2xl font-bold text-blue-600">450</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-900">KYC Services</p>
            <p className="text-2xl font-bold text-green-600">125</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <History className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-900">Documents</p>
            <p className="text-2xl font-bold text-purple-600">215</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-900">Other</p>
            <p className="text-2xl font-bold text-orange-600">100</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletTab;
