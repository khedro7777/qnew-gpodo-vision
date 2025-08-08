import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Users, 
  Globe, 
  Shield, 
  FileText,
  Building2,
  MapPin,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';

interface Step {
  id: string;
  label: string;
  description: string;
}

const steps: Step[] = [
  {
    id: 'details',
    label: 'Group Details',
    description: 'Provide basic information about your group'
  },
  {
    id: 'structure',
    label: 'Group Structure',
    description: 'Define the structure and governance of the group'
  },
  {
    id: 'requirements',
    label: 'Entry Requirements',
    description: 'Set requirements for users to join the group'
  },
  {
    id: 'review',
    label: 'Review & Submit',
    description: 'Review all details and submit your group for approval'
  }
];

const GroupCreationWizard = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    industrySector: '',
    country: '',
    isPublic: true,
    entryPoints: 0,
    kycRequired: false,
    mcpTestRequired: false,
    governanceStructure: '',
    missionStatement: '',
    rulesAndRegulations: ''
  });
  const [submissionProgress, setSubmissionProgress] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setGroupData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to create a group.');
      return;
    }

    // Simulate submission progress
    const interval = setInterval(() => {
      setSubmissionProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 200);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Insert group data into Supabase
      const { data, error } = await supabase
        .from('groups')
        .insert([
          {
            name: groupData.name,
            description: groupData.description,
            industry_sector: groupData.industrySector,
            country: groupData.country,
            is_public: groupData.isPublic,
            entry_points: groupData.entryPoints,
            kyc_required: groupData.kycRequired,
            mcp_test_required: groupData.mcpTestRequired,
            governance_structure: groupData.governanceStructure,
            mission_statement: groupData.missionStatement,
            rules_and_regulations: groupData.rulesAndRegulations,
            created_by: user.id
          }
        ]);

      if (error) {
        throw error;
      }

      toast.success('Group created successfully!');
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group: ' + error.message);
    } finally {
      clearInterval(interval);
      setSubmissionProgress(0);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'details':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Group Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={groupData.name}
                  onChange={handleChange}
                  placeholder="Enter group name"
                />
              </div>
              <div>
                <Label htmlFor="industrySector">Industry Sector</Label>
                <Select
                  onValueChange={(value) => setGroupData(prev => ({ ...prev, industrySector: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Group Description</Label>
              <Textarea
                id="description"
                name="description"
                value={groupData.description}
                onChange={handleChange}
                placeholder="Enter group description"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  onValueChange={(value) => setGroupData(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Group Type</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={groupData.isPublic}
                    onChange={handleChange}
                  />
                  <Label htmlFor="isPublic">Public Group</Label>
                </div>
              </div>
            </div>
          </div>
        );
      case 'structure':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="governanceStructure">Governance Structure</Label>
              <Textarea
                id="governanceStructure"
                name="governanceStructure"
                value={groupData.governanceStructure}
                onChange={handleChange}
                placeholder="Describe the governance structure of the group"
              />
            </div>
            <div>
              <Label htmlFor="missionStatement">Mission Statement</Label>
              <Textarea
                id="missionStatement"
                name="missionStatement"
                value={groupData.missionStatement}
                onChange={handleChange}
                placeholder="Enter the mission statement of the group"
              />
            </div>
            <div>
              <Label htmlFor="rulesAndRegulations">Rules and Regulations</Label>
              <Textarea
                id="rulesAndRegulations"
                name="rulesAndRegulations"
                value={groupData.rulesAndRegulations}
                onChange={handleChange}
                placeholder="Enter the rules and regulations of the group"
              />
            </div>
          </div>
        );
      case 'requirements':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="entryPoints">Entry Points</Label>
              <Input
                type="number"
                id="entryPoints"
                name="entryPoints"
                value={groupData.entryPoints}
                onChange={handleChange}
                placeholder="Enter the number of points required to join"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                id="kycRequired"
                name="kycRequired"
                checked={groupData.kycRequired}
                onChange={handleChange}
              />
              <Label htmlFor="kycRequired">KYC Verification Required</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                id="mcpTestRequired"
                name="mcpTestRequired"
                checked={groupData.mcpTestRequired}
                onChange={handleChange}
              />
              <Label htmlFor="mcpTestRequired">MCP Test Required</Label>
            </div>
          </div>
        );
      case 'review':
        return (
          <div className="space-y-4">
            <Card>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Group Details</h3>
                  <p><strong>Name:</strong> {groupData.name}</p>
                  <p><strong>Description:</strong> {groupData.description}</p>
                  <p><strong>Industry Sector:</strong> {groupData.industrySector}</p>
                  <p><strong>Country:</strong> {groupData.country}</p>
                  <p><strong>Type:</strong> {groupData.isPublic ? 'Public' : 'Private'}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Group Structure</h3>
                  <p><strong>Governance:</strong> {groupData.governanceStructure}</p>
                  <p><strong>Mission:</strong> {groupData.missionStatement}</p>
                  <p><strong>Rules:</strong> {groupData.rulesAndRegulations}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Entry Requirements</h3>
                  <p><strong>Entry Points:</strong> {groupData.entryPoints}</p>
                  <p><strong>KYC Required:</strong> {groupData.kycRequired ? 'Yes' : 'No'}</p>
                  <p><strong>MCP Test Required:</strong> {groupData.mcpTestRequired ? 'Yes' : 'No'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Create New Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a New Group</DialogTitle>
          <DialogDescription>
            Follow these steps to create a new group in the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {index > 0 && (
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                )}
                <div className={`flex items-center ${currentStep === index ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                  {currentStep > index ? (
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                  ) : (
                    <span className="mr-1">{index + 1}</span>
                  )}
                  <span>{step.label}</span>
                </div>
              </div>
            ))}
          </div>
          <Progress value={(currentStep + 1) * (100 / steps.length)} />
        </div>

        {renderStepContent()}

        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          {currentStep === steps.length - 1 ? (
            <Button onClick={handleSubmit} disabled={submissionProgress > 0}>
              {submissionProgress > 0 ? (
                <div className="flex items-center">
                  Submitting...
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                </div>
              ) : (
                'Submit'
              )}
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupCreationWizard;
