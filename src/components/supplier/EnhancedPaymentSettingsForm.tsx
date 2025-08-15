
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { 
  CreditCard,
  Bitcoin,
  Shield,
  Save,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface PaymentSettingsProps {
  paymentSettings?: any;
}

export const EnhancedPaymentSettingsForm = ({ paymentSettings }: PaymentSettingsProps) => {
  const { updatePaymentSettings, isUpdatingSettings } = useSupplierPanel();
  const [formData, setFormData] = useState({
    paypal_email: paymentSettings?.paypal_email || '',
    paypal_client_id: paymentSettings?.paypal_client_id || '',
    crypto_wallet_btc: paymentSettings?.crypto_wallet_btc || '',
    crypto_wallet_eth: paymentSettings?.crypto_wallet_eth || '',
    crypto_wallet_usdt: paymentSettings?.crypto_wallet_usdt || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentSettings(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Settings
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure your payment methods to receive payments from buyers
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PayPal Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">PayPal Integration</h3>
                <Badge variant="secondary">Recommended</Badge>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  PayPal integration allows automatic payment processing. PayPal Client ID is optional for basic payments.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paypal_email">PayPal Email *</Label>
                  <Input
                    id="paypal_email"
                    type="email"
                    placeholder="your-paypal@email.com"
                    value={formData.paypal_email}
                    onChange={(e) => handleInputChange('paypal_email', e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email address associated with your PayPal account
                  </p>
                </div>

                <div>
                  <Label htmlFor="paypal_client_id">PayPal Client ID (Optional)</Label>
                  <Input
                    id="paypal_client_id"
                    type="text"
                    placeholder="PayPal Client ID for advanced features"
                    value={formData.paypal_client_id}
                    onChange={(e) => handleInputChange('paypal_client_id', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional: For advanced PayPal integrations
                  </p>
                </div>
              </div>

              {formData.paypal_email && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">PayPal configuration ready</span>
                </div>
              )}
            </div>

            {/* Cryptocurrency Wallets */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bitcoin className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Cryptocurrency Wallets</h3>
                <Badge variant="outline">Optional</Badge>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Add your cryptocurrency wallet addresses to receive payments in crypto. All addresses are encrypted and stored securely.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="crypto_wallet_btc">Bitcoin (BTC) Wallet Address</Label>
                  <Input
                    id="crypto_wallet_btc"
                    type="text"
                    placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                    value={formData.crypto_wallet_btc}
                    onChange={(e) => handleInputChange('crypto_wallet_btc', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="crypto_wallet_eth">Ethereum (ETH) Wallet Address</Label>
                  <Input
                    id="crypto_wallet_eth"
                    type="text"
                    placeholder="0x742d35Cc6664C02e6f5B2F22F6f6B72b3c5b5b5b"
                    value={formData.crypto_wallet_eth}
                    onChange={(e) => handleInputChange('crypto_wallet_eth', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="crypto_wallet_usdt">Tether (USDT) Wallet Address</Label>
                  <Input
                    id="crypto_wallet_usdt"
                    type="text"
                    placeholder="USDT wallet address"
                    value={formData.crypto_wallet_usdt}
                    onChange={(e) => handleInputChange('crypto_wallet_usdt', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isUpdatingSettings || !formData.paypal_email}
                className="min-w-[120px]"
              >
                {isUpdatingSettings ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>PayPal</span>
              </div>
              <Badge variant={formData.paypal_email ? 'default' : 'secondary'}>
                {formData.paypal_email ? 'Configured' : 'Not Configured'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bitcoin className="w-4 h-4" />
                <span>Bitcoin</span>
              </div>
              <Badge variant={formData.crypto_wallet_btc ? 'default' : 'secondary'}>
                {formData.crypto_wallet_btc ? 'Configured' : 'Not Configured'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bitcoin className="w-4 h-4" />
                <span>Ethereum</span>
              </div>
              <Badge variant={formData.crypto_wallet_eth ? 'default' : 'secondary'}>
                {formData.crypto_wallet_eth ? 'Configured' : 'Not Configured'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bitcoin className="w-4 h-4" />
                <span>Tether (USDT)</span>
              </div>
              <Badge variant={formData.crypto_wallet_usdt ? 'default' : 'secondary'}>
                {formData.crypto_wallet_usdt ? 'Configured' : 'Not Configured'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
