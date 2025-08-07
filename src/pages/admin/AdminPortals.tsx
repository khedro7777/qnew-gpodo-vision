
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, Settings, Eye, EyeOff } from 'lucide-react';

// Define the portal settings structure that matches our JSON
interface PortalConfig {
  visible: boolean;
  enable_create_group?: boolean;
  enable_voting?: boolean;
  enable_dynamic_discounts?: boolean;
  enable_company_builder?: boolean;
  enable_advisor_election?: boolean;
}

interface PortalSettings {
  group_buying: PortalConfig;
  supplier_offers: PortalConfig;
  freelance: PortalConfig;
  investment: PortalConfig;
  [key: string]: PortalConfig;
}

const AdminPortals = () => {
  const [settings, setSettings] = useState<PortalSettings | null>(null);
  const queryClient = useQueryClient();

  // Fetch current portal settings
  const { data: portalData, isLoading } = useQuery({
    queryKey: ['portal-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('setting_value')
        .eq('setting_key', 'portal_visibility')
        .single();
      
      if (error) throw error;
      return data.setting_value as unknown as PortalSettings;
    },
  });

  // Update settings state when data is loaded
  useEffect(() => {
    if (portalData) {
      setSettings(portalData);
    }
  }, [portalData]);

  // Save portal settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: PortalSettings) => {
      const { error } = await supabase
        .from('platform_settings')
        .update({ 
          setting_value: newSettings as any,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', 'portal_visibility');
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Portal settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ['portal-settings'] });
    },
    onError: (error: any) => {
      toast.error('Failed to update settings: ' + error.message);
    },
  });

  const handleTogglePortal = (portalKey: string, field: keyof PortalConfig, value: boolean) => {
    if (!settings) return;
    
    const newSettings = {
      ...settings,
      [portalKey]: {
        ...settings[portalKey],
        [field]: value
      }
    };
    
    setSettings(newSettings);
  };

  const handleSaveSettings = () => {
    if (settings) {
      updateSettingsMutation.mutate(settings);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return <div className="p-6">No settings found</div>;
  }

  const portals = [
    {
      key: 'group_buying',
      title: '🛒 Group Buying Portal',
      description: 'Collective purchasing and negotiation features',
      features: [
        { key: 'enable_create_group', label: 'Allow Group Creation' },
        { key: 'enable_voting', label: 'Enable Voting System' }
      ]
    },
    {
      key: 'supplier_offers',
      title: '🏭 Supplier Offers Portal', 
      description: 'Supplier marketplace and offers management',
      features: [
        { key: 'enable_dynamic_discounts', label: 'Dynamic Discounts' }
      ]
    },
    {
      key: 'freelance',
      title: '👨‍💻 Freelancer Portal',
      description: 'Freelancer services and team formation',
      features: []
    },
    {
      key: 'investment',
      title: '💰 Investment Portal',
      description: 'Investment groups and company formation',
      features: [
        { key: 'enable_company_builder', label: 'Company Builder' },
        { key: 'enable_advisor_election', label: 'Advisor Elections' }
      ]
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portal Management</h1>
          <p className="text-gray-600 mt-2">Control portal visibility and features</p>
        </div>
        <Button 
          onClick={handleSaveSettings}
          disabled={updateSettingsMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {portals.map((portal) => {
          const portalSettings = settings[portal.key];
          
          return (
            <Card key={portal.key} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{portal.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {portalSettings?.visible ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    <Switch
                      checked={portalSettings?.visible || false}
                      onCheckedChange={(checked) => 
                        handleTogglePortal(portal.key, 'visible', checked)
                      }
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">{portal.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Feature toggles */}
                {portal.features.map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">
                      {feature.label}
                    </Label>
                    <Switch
                      checked={portalSettings?.[feature.key as keyof PortalConfig] as boolean || false}
                      onCheckedChange={(checked) => 
                        handleTogglePortal(portal.key, feature.key as keyof PortalConfig, checked)
                      }
                      disabled={!portalSettings?.visible}
                    />
                  </div>
                ))}
                
                {portal.features.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No additional features to configure</p>
                )}
              </CardContent>
              
              {!portalSettings?.visible && (
                <div className="absolute inset-0 bg-gray-100/50 rounded-lg"></div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Live Configuration Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
            {JSON.stringify(settings, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPortals;
