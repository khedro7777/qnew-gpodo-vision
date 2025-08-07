
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Plus, Minus, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
import { Skeleton } from '@/components/ui/skeleton';

const WalletBalance = () => {
  const { user } = useAuth();
  const { balance, transactions, isLoading } = useWallet(user?.id);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            <CardTitle>محفظتي</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-productivity-blue" />
            <CardTitle>محفظتي</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 ml-1" />
              إيداع
            </Button>
            <Button size="sm" variant="outline">
              <Minus className="w-4 h-4 ml-1" />
              سحب
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-productivity-blue mb-1">
            {balance.toFixed(2)} ر.س
          </div>
          <p className="text-sm text-muted-foreground">الرصيد الحالي</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm">المعاملات الأخيرة</h4>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              لا توجد معاملات
            </p>
          ) : (
            <div className="space-y-2">
              {transactions.slice(0, 5).map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {transaction.description || 'معاملة'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  <div className={`font-medium text-sm ${
                    transaction.type === 'credit' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}
                    {Math.abs(transaction.amount).toFixed(2)} ر.س
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletBalance;
