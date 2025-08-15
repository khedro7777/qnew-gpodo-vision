
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useSupplierPanel } from '@/hooks/useSupplierPanel';
import { 
  CreditCard,
  Shield,
  Save,
  CheckCircle,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';

interface EnhancedPayPalSettingsProps {
  paymentSettings?: any;
}

export const EnhancedPayPalSettings = ({ paymentSettings }: EnhancedPayPalSettingsProps) => {
  const { updatePaymentSettings, isUpdatingSettings } = useSupplierPanel();
  const [showSecret, setShowSecret] = useState(false);
  const [formData, setFormData] = useState({
    paypal_email: paymentSettings?.paypal_email || '',
    paypal_client_id: paymentSettings?.paypal_client_id || '',
    paypal_client_secret: paymentSettings?.paypal_client_secret || '',
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

  const isConfigured = formData.paypal_email && formData.paypal_client_id;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Enhanced PayPal Configuration
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure your PayPal credentials for automatic payment processing
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Complete PayPal integration requires both Client ID and Client Secret for advanced features like automatic payment processing and refunds.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label htmlFor="paypal_email">PayPal Business Email *</Label>
              <Input
                id="paypal_email"
                type="email"
                placeholder="your-business@paypal.com"
                value={formData.paypal_email}
                onChange={(e) => handleInputChange('paypal_email', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                The email address associated with your PayPal business account
              </p>
            </div>

            <div>
              <Label htmlFor="paypal_client_id">PayPal Client ID *</Label>
              <Input
                id="paypal_client_id"
                type="text"
                placeholder="Your PayPal App Client ID"
                value={formData.paypal_client_id}
                onChange={(e) => handleInputChange('paypal_client_id', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Found in your PayPal Developer Dashboard under "My Apps & Credentials"
              </p>
            </div>

            <div>
              <Label htmlFor="paypal_client_secret">PayPal Client Secret *</Label>
              <div className="relative">
                <Input
                  id="paypal_client_secret"
                  type={showSecret ? "text" : "password"}
                  placeholder="Your PayPal App Client Secret"
                  value={formData.paypal_client_secret}
                  onChange={(e) => handleInputChange('paypal_client_secret', e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Keep this secret secure - it's used for server-side payment processing
              </p>
            </div>
          </div>

          {isConfigured && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                PayPal integration is fully configured and ready for automatic payment processing.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center pt-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">All credentials are encrypted</span>
            </div>
            
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
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Integration Status */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold mb-3">Integration Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Business Email</span>
              <Badge variant={formData.paypal_email ? 'default' : 'secondary'}>
                {formData.paypal_email ? 'Configured' : 'Required'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Client ID</span>
              <Badge variant={formData.paypal_client_id ? 'default' : 'secondary'}>
                {formData.paypal_client_id ? 'Configured' : 'Required'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Client Secret</span>
              <Badge variant={formData.paypal_client_secret ? 'default' : 'secondary'}>
                {formData.paypal_client_secret ? 'Configured' : 'Required'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
