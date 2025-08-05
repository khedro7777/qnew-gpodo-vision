
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Webhook, Mail, Smartphone, Settings } from 'lucide-react';

const NotificationsTab = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white">
        <div className="flex items-center gap-4">
          <Bell className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Notifications</h2>
            <p className="text-white/80">Webhooks, Push notifications & Email alerts</p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Real-time alerts on your device</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-0">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-gray-900">Email Alerts</p>
                  <p className="text-sm text-gray-600">Important updates via email</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-0">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Webhook className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-900">Webhooks</p>
                  <p className="text-sm text-gray-600">API callbacks for integrations</p>
                </div>
              </div>
              <Badge className="bg-gray-100 text-gray-800 border-0">Disabled</Badge>
            </div>
          </div>
          
          <Button className="w-full mt-4">
            <Settings className="w-4 h-4 mr-2" />
            Configure Settings
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="font-medium text-blue-900">New group invitation</p>
              <p className="text-sm text-blue-700">You've been invited to join "Export Group"</p>
              <p className="text-xs text-blue-600 mt-1">2 hours ago</p>
            </div>
            
            <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
              <p className="font-medium text-green-900">Vote completed</p>
              <p className="text-sm text-green-700">Supplier selection vote passed</p>
              <p className="text-xs text-green-600 mt-1">1 day ago</p>
            </div>
            
            <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
              <p className="font-medium text-amber-900">Payment reminder</p>
              <p className="text-sm text-amber-700">Group membership fee due soon</p>
              <p className="text-xs text-amber-600 mt-1">2 days ago</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsTab;
