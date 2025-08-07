
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface PortalSettings {
  group_buying: {
    visible: boolean;
    enable_create_group: boolean;
    enable_voting: boolean;
  };
  supplier_offers: {
    visible: boolean;
    enable_dynamic_discounts: boolean;
  };
  freelance: {
    visible: boolean;
  };
  investment: {
    visible: boolean;
    enable_company_builder: boolean;
    enable_advisor_election: boolean;
  };
}

const AdminPortals = () => {
  const [settings, setSettings] = useState<PortalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('setting_value')
        .eq('setting_key', 'portal_visibility')
        .single();

      if (error) throw error;
      setSettings(data.setting_value as PortalSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load portal settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('platform_settings')
        .update({ setting_value: settings })
        .eq('setting_key', 'portal_visibility');

      if (error) throw error;
      toast.success('Portal settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (portal: keyof PortalSettings, key: string, value: boolean) => {
    if (!settings) return;
    
    setSettings(prev => ({
      ...prev!,
      [portal]: {
        ...prev![portal],
        [key]: value
      }
    }));
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!settings) {
    return <div className="p-6">Failed to load settings</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Portal Management</h2>
          <p className="text-gray-600">Control portal visibility and features</p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Group Buying Portal */}
        <Card>
          <CardHeader>
            <CardTitle>Group Buying Portal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Portal Visible</label>
              <Switch
                checked={settings.group_buying.visible}
                onCheckedChange={(checked) => updateSetting('group_buying', 'visible', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Group Creation</label>
              <Switch
                checked={settings.group_buying.enable_create_group}
                onCheckedChange={(checked) => updateSetting('group_buying', 'enable_create_group', checked)}
                disabled={!settings.group_buying.visible}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Voting</label>
              <Switch
                checked={settings.group_buying.enable_voting}
                onCheckedChange={(checked) => updateSetting('group_buying', 'enable_voting', checked)}
                disabled={!settings.group_buying.visible}
              />
            </div>
          </CardContent>
        </Card>

        {/* Supplier Offers Portal */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Offers Portal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Portal Visible</label>
              <Switch
                checked={settings.supplier_offers.visible}
                onCheckedChange={(checked) => updateSetting('supplier_offers', 'visible', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Dynamic Discounts</label>
              <Switch
                checked={settings.supplier_offers.enable_dynamic_discounts}
                onCheckedChange={(checked) => updateSetting('supplier_offers', 'enable_dynamic_discounts', checked)}
                disabled={!settings.supplier_offers.visible}
              />
            </div>
          </CardContent>
        </Card>

        {/* Freelance Portal */}
        <Card>
          <CardHeader>
            <CardTitle>Freelance Portal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Portal Visible</label>
              <Switch
                checked={settings.freelance.visible}
                onCheckedChange={(checked) => updateSetting('freelance', 'visible', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Investment Portal */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Portal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Portal Visible</label>
              <Switch
                checked={settings.investment.visible}
                onCheckedChange={(checked) => updateSetting('investment', 'visible', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Company Builder</label>
              <Switch
                checked={settings.investment.enable_company_builder}
                onCheckedChange={(checked) => updateSetting('investment', 'enable_company_builder', checked)}
                disabled={!settings.investment.visible}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Advisor Election</label>
              <Switch
                checked={settings.investment.enable_advisor_election}
                onCheckedChange={(checked) => updateSetting('investment', 'enable_advisor_election', checked)}
                disabled={!settings.investment.visible}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPortals;
