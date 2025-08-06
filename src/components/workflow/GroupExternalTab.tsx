
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  Eye, 
  Download, 
  Calendar,
  DollarSign,
  Clock,
  Mail,
  Star,
  Briefcase
} from 'lucide-react';

interface GroupExternalTabProps {
  groupId: string;
  userRole: string;
}

const GroupExternalTab = ({ groupId, userRole }: GroupExternalTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock freelancer applications - in real app this would come from database
  const freelancerApplications = [
    {
      id: '1',
      applicantName: 'Ahmed Mohamed Ali',
      applicantEmail: 'ahmed.ali@email.com',
      skills: 'Web Development, React, Node.js, MongoDB',
      experience: '4-5 years',
      hourlyRate: '$35/hour',
      availability: 'Full-time',
      coverLetter: 'I am an experienced web developer with 5 years of experience in developing modern applications. I have extensive experience in React and Node.js and am interested in working with your team...',
      status: 'pending',
      submittedAt: '2024-01-20T10:30:00Z',
      rating: 4.8,
      completedProjects: 23,
      attachments: [
        { name: 'portfolio.pdf', size: '2.1MB' },
        { name: 'resume.pdf', size: '850KB' }
      ]
    },
    {
      id: '2',
      applicantName: 'Sarah Ahmed',
      applicantEmail: 'sara.ahmed@email.com',
      skills: 'Graphic Design, UI/UX, Adobe Creative Suite',
      experience: '2-3 years',
      hourlyRate: '$25/hour',
      availability: 'Part-time',
      coverLetter: 'Graphic designer specializing in user interface design. I have a passion for modern and creative design...',
      status: 'approved',
      submittedAt: '2024-01-18T14:15:00Z',
      rating: 4.9,
      completedProjects: 15,
      attachments: [
        { name: 'design_portfolio.pdf', size: '4.2MB' },
        { name: 'cv.docx', size: '1.1MB' }
      ]
    },
    {
      id: '3',
      applicantName: 'Mohamed Hassan',
      applicantEmail: 'mohamed.hassan@email.com',
      skills: 'Digital Marketing, SEO, Social Media Management',
      experience: '6-10 years',
      hourlyRate: '$30/hour',
      availability: 'Project-based',
      coverLetter: 'Digital marketing expert with 8 years of experience in managing marketing campaigns and search engine optimization...',
      status: 'under_review',
      submittedAt: '2024-01-19T09:45:00Z',
      rating: 4.7,
      completedProjects: 31,
      attachments: [
        { name: 'marketing_cases.pdf', size: '3.5MB' }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    const configs = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Approved', className: 'bg-green-100 text-green-800' },
      under_review: { label: 'Under Review', className: 'bg-blue-100 text-blue-800' },
      rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' }
    };
    
    const config = configs[status as keyof typeof configs] || configs.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const filteredApplications = freelancerApplications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.skills.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveApplication = (applicationId: string) => {
    console.log('Approving application:', applicationId);
    // In real app, this would update the application status
  };

  const handleRejectApplication = (applicationId: string) => {
    console.log('Rejecting application:', applicationId);
    // In real app, this would update the application status
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6" />
          <div>
            <h2 className="text-2xl font-bold">External Parties</h2>
            <p className="text-gray-600">Freelance applications and external collaborators</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-blue-50">
          {filteredApplications.length} applications
        </Badge>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          className="px-3 py-2 border rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Applications</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                    <CardTitle className="text-lg">{application.applicantName}</CardTitle>
                    {getStatusBadge(application.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>{application.applicantEmail}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{application.rating}/5</span>
                      </div>
                      <span>Completed Projects: {application.completedProjects}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-600" />
                        <span className="text-green-600 font-medium">Rate: {application.hourlyRate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-600">Availability: {application.availability}</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Experience: </span>
                      <span>{application.experience}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Submitted: {new Date(application.submittedAt).toLocaleDateString('en-US')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {application.attachments.length > 0 && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Files ({application.attachments.length})
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Skills */}
                <div>
                  <h4 className="font-medium mb-2">Skills & Experience:</h4>
                  <div className="flex flex-wrap gap-2">
                    {application.skills.split(', ').map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <h4 className="font-medium mb-2">Cover Letter:</h4>
                  <p className="text-gray-600 text-sm">{application.coverLetter}</p>
                </div>

                {/* Action Buttons for Managers */}
                {(userRole === 'founder' || userRole === 'manager') && application.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      onClick={() => handleApproveApplication(application.id)}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      Approve Application
                    </Button>
                    <Button 
                      onClick={() => handleRejectApplication(application.id)}
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      size="sm"
                    >
                      Reject Application
                    </Button>
                  </div>
                )}

                {/* Attachments List */}
                {application.attachments.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Attachments:</h4>
                    <div className="space-y-1">
                      {application.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{attachment.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">({attachment.size})</span>
                            <Button variant="ghost" size="sm">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Applications Found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'No freelance applications have been submitted yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default GroupExternalTab;
