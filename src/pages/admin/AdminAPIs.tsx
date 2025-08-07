
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  Shield,
  Activity,
  Code,
  Settings
} from 'lucide-react';
import { useAPIKeys, useCreateAPIKey, useRevokeAPIKey } from '@/hooks/useAdmin';
import { toast } from 'sonner';

const AdminAPIs = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([]);
  const [newKeyExpiry, setNewKeyExpiry] = useState('never');
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});

  const { data: apiKeys = [], isLoading } = useAPIKeys();
  const createAPIKey = useCreateAPIKey();
  const revokeAPIKey = useRevokeAPIKey();

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }

    if (newKeyPermissions.length === 0) {
      toast.error('Please select at least one permission');
      return;
    }

    try {
      const expiresAt = newKeyExpiry === 'never' ? undefined : 
        new Date(Date.now() + parseInt(newKeyExpiry) * 24 * 60 * 60 * 1000).toISOString();

      await createAPIKey.mutateAsync({
        name: newKeyName,
        permissions: newKeyPermissions,
        expires_at: expiresAt
      });

      setIsCreateDialogOpen(false);
      setNewKeyName('');
      setNewKeyPermissions([]);
      setNewKeyExpiry('never');
    } catch (error) {
      console.error('Create API key error:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const maskKey = (key: string) => {
    return key.slice(0, 8) + '•'.repeat(20) + key.slice(-4);
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setNewKeyPermissions([...newKeyPermissions, permission]);
    } else {
      setNewKeyPermissions(newKeyPermissions.filter(p => p !== permission));
    }
  };

  const getPermissionBadge = (permission: string) => {
    const colors = {
      read: 'bg-green-100 text-green-800',
      write: 'bg-blue-100 text-blue-800',
      admin: 'bg-red-100 text-red-800',
      delete: 'bg-orange-100 text-orange-800'
    };
    return colors[permission as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Management</h1>
          <p className="text-gray-600">Manage API keys and access tokens for the gpodo5 platform</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key with specific permissions
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Production API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>

              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {['read', 'write', 'admin', 'delete'].map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={newKeyPermissions.includes(permission)}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission, checked as boolean)
                        }
                      />
                      <Label htmlFor={permission} className="capitalize">
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Expires</Label>
                <Select value={newKeyExpiry} onValueChange={setNewKeyExpiry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleCreateKey} 
                className="w-full"
                disabled={createAPIKey.isPending}
              >
                {createAPIKey.isPending ? 'Creating...' : 'Create API Key'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys Grid */}
      <div className="grid gap-6">
        {isLoading ? (
          <Card className="p-6">
            <div className="animate-pulse">Loading API keys...</div>
          </Card>
        ) : apiKeys.length === 0 ? (
          <Card className="p-6 text-center">
            <Key className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No API Keys</h3>
            <p className="text-gray-600 mb-4">Create your first API key to get started</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </Card>
        ) : (
          apiKeys.map((apiKey) => (
            <Card key={apiKey.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Key className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{apiKey.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>Created {new Date(apiKey.created_at).toLocaleDateString()}</span>
                      {apiKey.expires_at && (
                        <>
                          <span>•</span>
                          <span>Expires {new Date(apiKey.expires_at).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <Badge className={apiKey.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {apiKey.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="space-y-4">
                {/* API Key Display */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-medium">API Key</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <code className="text-sm font-mono">
                    {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                  </code>
                </div>

                {/* Permissions */}
                <div>
                  <Label className="font-medium mb-2 block">Permissions</Label>
                  <div className="flex flex-wrap gap-2">
                    {apiKey.permissions.map((permission) => (
                      <Badge key={permission} className={getPermissionBadge(permission)}>
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    <Activity className="w-4 h-4 mr-2" />
                    Usage
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => revokeAPIKey.mutate(apiKey.id)}
                    disabled={revokeAPIKey.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Revoke
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* API Documentation */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">API Documentation</h3>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Base URL</h4>
            <code className="text-sm">https://api.gpodo5.com/v1</code>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Authentication</h4>
            <code className="text-sm">Authorization: Bearer YOUR_API_KEY</code>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Get Groups</h4>
              <code className="text-xs">GET /groups</code>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Create Group</h4>
              <code className="text-xs">POST /groups</code>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Get Users</h4>
              <code className="text-xs">GET /users</code>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Update KYC</h4>
              <code className="text-xs">PUT /users/:id/kyc</code>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminAPIs;
