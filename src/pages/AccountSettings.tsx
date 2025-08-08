
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  CreditCard, 
  Key,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const AccountSettings = () => {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    activityStatus: true,
    dataSharing: false,
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success('Notification preferences updated');
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    toast.success('Privacy settings updated');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account preferences and security settings</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <nav className="space-y-2">
                  <div className="flex items-center gap-3 p-2 bg-blue-50 text-blue-700 rounded-md">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm font-medium">General</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Security</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                    <Bell className="w-4 h-4" />
                    <span className="text-sm">Notifications</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">Privacy</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-md cursor-pointer">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">Billing</span>
                  </div>
                </nav>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Account Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Account ID</Label>
                      <Input value={user?.id || ''} readOnly className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input value={profile?.email || ''} readOnly className="bg-gray-50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <Input value={profile?.role?.toUpperCase() || 'USER'} readOnly className="bg-gray-50" />
                  </div>
                </div>
              </Card>

              {/* Notification Settings */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-600">Receive browser push notifications</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Receive important updates via SMS</p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Communications</p>
                      <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                    />
                  </div>
                </div>
              </Card>

              {/* Privacy Settings */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                    </div>
                    <Switch
                      checked={privacy.profileVisibility}
                      onCheckedChange={(checked) => handlePrivacyChange('profileVisibility', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Activity Status</p>
                      <p className="text-sm text-gray-600">Show when you're online</p>
                    </div>
                    <Switch
                      checked={privacy.activityStatus}
                      onCheckedChange={(checked) => handlePrivacyChange('activityStatus', checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Sharing</p>
                      <p className="text-sm text-gray-600">Share anonymized data for platform improvement</p>
                    </div>
                    <Switch
                      checked={privacy.dataSharing}
                      onCheckedChange={(checked) => handlePrivacyChange('dataSharing', checked)}
                    />
                  </div>
                </div>
              </Card>

              {/* Security Settings */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                <div className="space-y-4">
                  <Button className="w-full justify-start gap-3" variant="outline">
                    <Key className="w-4 h-4" />
                    Change Password
                  </Button>
                  <Button className="w-full justify-start gap-3" variant="outline">
                    <Shield className="w-4 h-4" />
                    Two-Factor Authentication
                  </Button>
                  <Button className="w-full justify-start gap-3" variant="outline">
                    <CreditCard className="w-4 h-4" />
                    Connected Apps
                  </Button>
                </div>
              </Card>

              {/* Danger Zone */}
              <Card className="p-6 border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-900">Delete Account</p>
                        <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="destructive" size="sm" className="gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountSettings;
