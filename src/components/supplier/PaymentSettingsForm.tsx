
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupplierPanel, SupplierPaymentSettings } from '@/hooks/useSupplierPanel';
import { toast } from 'sonner';

interface PaymentSettingsFormProps {
  paymentSettings?: SupplierPaymentSettings | null;
}

export const PaymentSettingsForm: React.FC<PaymentSettingsFormProps> = ({ paymentSettings }) => {
  const { updatePaymentSettings, isUpdatingSettings } = useSupplierPanel();

  const [formData, setFormData] = useState({
    paypal_email: '',
    paypal_client_id: '',
    crypto_wallet_btc: '',
    crypto_wallet_eth: '',
    crypto_wallet_usdt: '',
  });

  useEffect(() => {
    if (paymentSettings) {
      setFormData({
        paypal_email: paymentSettings.paypal_email || '',
        paypal_client_id: paymentSettings.paypal_client_id || '',
        crypto_wallet_btc: paymentSettings.crypto_wallet_btc || '',
        crypto_wallet_eth: paymentSettings.crypto_wallet_eth || '',
        crypto_wallet_usdt: paymentSettings.crypto_wallet_usdt || '',
      });
    }
  }, [paymentSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      updatePaymentSettings(formData);
    } catch (error) {
      console.error('Error updating payment settings:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">PayPal Settings</h3>
            
            <div>
              <Label htmlFor="paypal_email">PayPal Email</Label>
              <Input
                id="paypal_email"
                type="email"
                value={formData.paypal_email}
                onChange={(e) => setFormData({ ...formData, paypal_email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <Label htmlFor="paypal_client_id">PayPal Client ID</Label>
              <Input
                id="paypal_client_id"
                value={formData.paypal_client_id}
                onChange={(e) => setFormData({ ...formData, paypal_client_id: e.target.value })}
                placeholder="Your PayPal Client ID"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cryptocurrency Wallets</h3>
            
            <div>
              <Label htmlFor="crypto_wallet_btc">Bitcoin Wallet Address</Label>
              <Input
                id="crypto_wallet_btc"
                value={formData.crypto_wallet_btc}
                onChange={(e) => setFormData({ ...formData, crypto_wallet_btc: e.target.value })}
                placeholder="Your BTC wallet address"
              />
            </div>

            <div>
              <Label htmlFor="crypto_wallet_eth">Ethereum Wallet Address</Label>
              <Input
                id="crypto_wallet_eth"
                value={formData.crypto_wallet_eth}
                onChange={(e) => setFormData({ ...formData, crypto_wallet_eth: e.target.value })}
                placeholder="Your ETH wallet address"
              />
            </div>

            <div>
              <Label htmlFor="crypto_wallet_usdt">USDT Wallet Address</Label>
              <Input
                id="crypto_wallet_usdt"
                value={formData.crypto_wallet_usdt}
                onChange={(e) => setFormData({ ...formData, crypto_wallet_usdt: e.target.value })}
                placeholder="Your USDT wallet address"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isUpdatingSettings}>
              {isUpdatingSettings ? 'Updating...' : 'Update Settings'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
