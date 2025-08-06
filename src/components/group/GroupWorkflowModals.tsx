
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileUpload from '@/components/ui/file-upload';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { MessageCircle, Briefcase, Building } from 'lucide-react';

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  type: 'contact' | 'supplier' | 'freelancer';
}

const GroupWorkflowModals = ({ isOpen, onClose, groupId, type }: WorkflowModalProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    companyName: '',
    offerTitle: '',
    price: '',
    deliveryTime: '',
    skills: '',
    experience: '',
    hourlyRate: '',
    availability: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to submit');
      return;
    }

    setLoading(true);
    
    try {
      // Mock submission - in real app this would upload files and send to group inbox
      console.log('Submitting to group:', groupId);
      console.log('Type:', type);
      console.log('Form data:', formData);
      console.log('Files:', files);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const messages = {
        contact: 'Your message has been sent to the group admin',
        supplier: 'Your supplier offer has been submitted successfully',
        freelancer: 'Your freelancer application has been submitted successfully'
      };

      toast.success(messages[type]);
      onClose();
      resetForm();
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      message: '',
      companyName: '',
      offerTitle: '',
      price: '',
      deliveryTime: '',
      skills: '',
      experience: '',
      hourlyRate: '',
      availability: ''
    });
    setFiles([]);
  };

  const getModalConfig = () => {
    switch (type) {
      case 'contact':
        return {
          title: 'Contact Group Admin',
          icon: <MessageCircle className="w-5 h-5" />,
          submitText: 'Send Message'
        };
      case 'supplier':
        return {
          title: 'Submit Supplier Offer',
          icon: <Building className="w-5 h-5" />,
          submitText: 'Submit Offer'
        };
      case 'freelancer':
        return {
          title: 'Apply as Freelancer',
          icon: <Briefcase className="w-5 h-5" />,
          submitText: 'Submit Application'
        };
      default:
        return { title: '', icon: null, submitText: '' };
    }
  };

  const config = getModalConfig();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {config.icon}
            {config.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Admin Form */}
          {type === 'contact' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Enter subject"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  required
                />
              </div>
            </>
          )}

          {/* Supplier Offer Form */}
          {type === 'supplier' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Your company name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offerTitle">Offer Title</Label>
                <Input
                  id="offerTitle"
                  value={formData.offerTitle}
                  onChange={(e) => handleInputChange('offerTitle', e.target.value)}
                  placeholder="Brief description of your offer"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="$0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryTime">Delivery Time</Label>
                  <Select onValueChange={(value) => handleInputChange('deliveryTime', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-3 days">1-3 days</SelectItem>
                      <SelectItem value="1 week">1 week</SelectItem>
                      <SelectItem value="2 weeks">2 weeks</SelectItem>
                      <SelectItem value="1 month">1 month</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Offer Details</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Describe your products/services, terms, and conditions..."
                  rows={4}
                  required
                />
              </div>
            </>
          )}

          {/* Freelancer Application Form */}
          {type === 'freelancer' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills & Expertise</Label>
                <Input
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  placeholder="e.g., Web Development, Graphic Design, Marketing"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Select onValueChange={(value) => handleInputChange('experience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="2-3">2-3 years</SelectItem>
                    <SelectItem value="4-5">4-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate</Label>
                  <Input
                    id="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    placeholder="$0/hour"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select onValueChange={(value) => handleInputChange('availability', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="project-based">Project-based</SelectItem>
                      <SelectItem value="weekends">Weekends only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Cover Letter</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us about your experience and why you're interested in this group..."
                  rows={4}
                  required
                />
              </div>
            </>
          )}

          {/* File Upload Section */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <FileUpload
              onFilesChange={setFiles}
              maxFiles={5}
              acceptedTypes={['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx']}
              maxSizeInMB={10}
            />
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, PDF, DOC, DOCX, XLS, XLSX (max 10MB each)
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Submitting...' : config.submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GroupWorkflowModals;
