
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, Globe, Lock, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import type { GatewayType } from '@/types';

interface GroupCreationData {
  name: string;
  description: string;
  gateway_type: GatewayType;
  is_public: boolean;
  max_members: number;
  entry_points: number;
  requires_kyc: boolean;
  requires_mcp_test: boolean;
  industry_sector?: string;
  country?: string;
}

const GroupCreationWizard = ({ onComplete }: { onComplete: () => void }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<GroupCreationData>({
    name: '',
    description: '',
    gateway_type: 'purchasing',
    is_public: true,
    max_members: 50,
    entry_points: 0,
    requires_kyc: false,
    requires_mcp_test: false
  });

  const gatewayOptions = [
    { value: 'purchasing', label: 'Cooperative Purchasing', icon: '🛒', desc: 'Group buying for better prices' },
    { value: 'marketing', label: 'Cooperative Marketing', icon: '📢', desc: 'Joint marketing campaigns' },
    { value: 'company', label: 'Company Formation', icon: '🏢', desc: 'Start a company together' },
    { value: 'investment', label: 'Investment Groups', icon: '💰', desc: 'Pool resources for investments' },
    { value: 'suppliers', label: 'Suppliers', icon: '🏭', desc: 'Connect with suppliers' },
    { value: 'freelancers', label: 'Freelancers', icon: '👨‍💻', desc: 'Find skilled freelancers' },
    { value: 'teams', label: 'Freelancer Teams', icon: '👥', desc: 'Collaborate in teams' },
    { value: 'services', label: 'Service Providers', icon: '🔧', desc: 'Professional services' },
    { value: 'products', label: 'Product Listings', icon: '📦', desc: 'Marketplace for products' },
    { value: 'arbitration', label: 'Arbitration & Documentation', icon: '⚖️', desc: 'Legal dispute resolution' },
    { value: 'requests', label: 'Arbitration Requests', icon: '📋', desc: 'Submit arbitration requests' },
    { value: 'negotiation', label: 'Smart Negotiation Tools', icon: '🤝', desc: 'AI-powered negotiations' }
  ];

  const handleInputChange = (field: keyof GroupCreationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createGroup = async () => {
    if (!user) {
      toast.error('Please log in to create a group');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert({
          ...formData,
          creator_id: user.id,
          status: 'active',
          current_members: 1
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as founder
      await supabase
        .from('group_members')
        .insert({
          group_id: data.id,
          user_id: user.id,
          role: 'founder',
          status: 'active'
        });

      toast.success('Group created successfully!');
      onComplete();
      
    } catch (error: any) {
      console.error('Create group error:', error);
      toast.error('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
              <p className="text-gray-600">Let's start with the basics of your group</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your group name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your group's purpose and goals"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gateway Type</label>
                <Select value={formData.gateway_type} onValueChange={(value) => handleInputChange('gateway_type', value as GatewayType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gateway type" />
                  </SelectTrigger>
                  <SelectContent>
                    {gatewayOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <span>{option.icon}</span>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.desc}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Group Settings</h2>
              <p className="text-gray-600">Configure how your group operates</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                <div className="flex gap-4">
                  <Button
                    variant={formData.is_public ? "default" : "outline"}
                    onClick={() => handleInputChange('is_public', true)}
                    className="flex-1 flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    Public
                  </Button>
                  <Button
                    variant={!formData.is_public ? "default" : "outline"}
                    onClick={() => handleInputChange('is_public', false)}
                    className="flex-1 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Private
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Members</label>
                <Input
                  type="number"
                  value={formData.max_members}
                  onChange={(e) => handleInputChange('max_members', parseInt(e.target.value))}
                  min={2}
                  max={1000}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Entry Points Required</label>
                <Input
                  type="number"
                  value={formData.entry_points}
                  onChange={(e) => handleInputChange('entry_points', parseInt(e.target.value))}
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">Points required for members to join this group</p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Requirements</h2>
              <p className="text-gray-600">Set member requirements for your group</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">KYC Verification Required</h3>
                  <p className="text-sm text-gray-500">Members must complete identity verification</p>
                </div>
                <Button
                  variant={formData.requires_kyc ? "default" : "outline"}
                  onClick={() => handleInputChange('requires_kyc', !formData.requires_kyc)}
                  size="sm"
                >
                  {formData.requires_kyc ? 'Required' : 'Optional'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">MCP Test Required</h3>
                  <p className="text-sm text-gray-500">Members must pass MCP skills assessment</p>
                </div>
                <Button
                  variant={formData.requires_mcp_test ? "default" : "outline"}
                  onClick={() => handleInputChange('requires_mcp_test', !formData.requires_mcp_test)}
                  size="sm"
                >
                  {formData.requires_mcp_test ? 'Required' : 'Optional'}
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Review Your Group</h3>
              <Card className="p-4 bg-gray-50">
                <div className="space-y-2">
                  <div><strong>Name:</strong> {formData.name}</div>
                  <div><strong>Type:</strong> {gatewayOptions.find(g => g.value === formData.gateway_type)?.label}</div>
                  <div><strong>Visibility:</strong> {formData.is_public ? 'Public' : 'Private'}</div>
                  <div><strong>Max Members:</strong> {formData.max_members}</div>
                  <div><strong>Entry Points:</strong> {formData.entry_points}</div>
                  <div className="flex gap-2 mt-2">
                    {formData.requires_kyc && <Badge variant="secondary">KYC Required</Badge>}
                    {formData.requires_mcp_test && <Badge variant="secondary">MCP Test Required</Badge>}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step <= currentStep
                  ? 'bg-productivity-blue text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 ${step < currentStep ? 'bg-productivity-blue' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < 3 ? (
          <Button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!formData.name || !formData.gateway_type}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={createGroup}
            disabled={loading || !formData.name}
          >
            {loading ? 'Creating...' : 'Create Group'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default GroupCreationWizard;
