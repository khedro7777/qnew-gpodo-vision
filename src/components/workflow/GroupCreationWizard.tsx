
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const GroupCreationWizard = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gateway_type: '' as 'purchasing' | 'marketing' | 'suppliers' | 'freelancers' | 'formation' | 'legal' | '',
    max_members: 50,
    is_public: true,
    country_id: '',
    industry_sector_id: ''
  });

  const steps = [
    {
      title: 'Basic Information',
      description: 'Set up your group\'s basic details'
    },
    {
      title: 'Configuration',
      description: 'Configure group settings and preferences'
    },
    {
      title: 'Review',
      description: 'Review and create your group'
    }
  ];

  const gatewayTypes = [
    { value: 'purchasing', label: 'Group Purchasing' },
    { value: 'marketing', label: 'Marketing Collective' },
    { value: 'suppliers', label: 'Supplier Network' },
    { value: 'freelancers', label: 'Freelancer Hub' },
    { value: 'formation', label: 'Company Formation' },
    { value: 'legal', label: 'Legal Services' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateGroup = async () => {
    if (!user) {
      toast.error('You must be logged in to create a group.');
      return;
    }

    setIsLoading(true);
    try {
      const groupData = {
        name: formData.name,
        description: formData.description,
        gateway_type: formData.gateway_type as 'purchasing' | 'marketing' | 'suppliers' | 'freelancers' | 'formation' | 'legal',
        max_members: formData.max_members,
        is_public: formData.is_public,
        country_id: formData.country_id || null,
        industry_sector_id: formData.industry_sector_id || null,
        creator_id: user.id,
        current_members: 1
      };

      const { data, error } = await supabase
        .from('groups')
        .insert([groupData])
        .select()
        .single();

      if (error) {
        console.error('Error creating group:', error);
        toast.error('Failed to create group. Please try again.');
      } else {
        // Add creator as first member
        await supabase
          .from('group_members')
          .insert([{
            group_id: data.id,
            user_id: user.id,
            role: 'admin'
          }]);

        toast.success('Group created successfully!');
        // Reset form or redirect to group page
        setFormData({
          name: '',
          description: '',
          gateway_type: '',
          max_members: 50,
          is_public: true,
          country_id: '',
          industry_sector_id: ''
        });
        setCurrentStep(0);
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your group name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your group's purpose and goals"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gateway_type">Group Type</Label>
              <Select
                value={formData.gateway_type}
                onValueChange={(value: 'purchasing' | 'marketing' | 'suppliers' | 'freelancers' | 'formation' | 'legal') => 
                  setFormData(prev => ({ ...prev, gateway_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select group type" />
                </SelectTrigger>
                <SelectContent>
                  {gatewayTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max_members">Maximum Members</Label>
              <Input
                id="max_members"
                type="number"
                value={formData.max_members}
                onChange={(e) => setFormData(prev => ({ ...prev, max_members: parseInt(e.target.value) }))}
                min="1"
                max="1000"
              />
            </div>

            <div className="space-y-2">
              <Label>Group Visibility</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="public"
                    name="visibility"
                    checked={formData.is_public}
                    onChange={() => setFormData(prev => ({ ...prev, is_public: true }))}
                  />
                  <Label htmlFor="public">Public - Anyone can discover and join</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="private"
                    name="visibility"
                    checked={!formData.is_public}
                    onChange={() => setFormData(prev => ({ ...prev, is_public: false }))}
                  />
                  <Label htmlFor="private">Private - Invitation only</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Group</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">
                  {gatewayTypes.find(t => t.value === formData.gateway_type)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Members:</span>
                <span className="font-medium">{formData.max_members}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Visibility:</span>
                <Badge variant={formData.is_public ? 'default' : 'secondary'}>
                  {formData.is_public ? 'Public' : 'Private'}
                </Badge>
              </div>
            </div>
            {formData.description && (
              <div>
                <span className="text-gray-600">Description:</span>
                <p className="mt-1 text-sm text-gray-800">{formData.description}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Group</CardTitle>
          <CardDescription>
            Follow these steps to set up your new group
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    index < steps.length - 1 ? 'flex-1' : ''
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index <= currentStep
                          ? 'bg-productivity-blue text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-xs mt-1 text-gray-600">
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-px bg-gray-200 mx-4" />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="mt-4" />
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleCreateGroup}
                disabled={isLoading}
                className="bg-productivity-blue hover:bg-productivity-blue/90"
              >
                {isLoading ? 'Creating...' : 'Create Group'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!formData.name || !formData.gateway_type}
                className="bg-productivity-blue hover:bg-productivity-blue/90"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupCreationWizard;
