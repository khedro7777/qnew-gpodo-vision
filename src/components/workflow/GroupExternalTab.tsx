
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
      applicantName: 'أحمد محمد علي',
      applicantEmail: 'ahmed.ali@email.com',
      skills: 'Web Development, React, Node.js, MongoDB',
      experience: '4-5 years',
      hourlyRate: '$35/hour',
      availability: 'Full-time',
      coverLetter: 'أنا مطور ويب خبير بخبرة 5 سنوات في تطوير التطبيقات الحديثة. لدي خبرة واسعة في React و Node.js ومهتم بالعمل مع فريقكم...',
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
      applicantName: 'سارة أحمد',
      applicantEmail: 'sara.ahmed@email.com',
      skills: 'Graphic Design, UI/UX, Adobe Creative Suite',
      experience: '2-3 years',
      hourlyRate: '$25/hour',
      availability: 'Part-time',
      coverLetter: 'مصممة جرافيك ومتخصصة في تصميم واجهات المستخدم. لدي شغف بالتصميم الحديث والإبداعي...',
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
      applicantName: 'محمد حسن',
      applicantEmail: 'mohamed.hassan@email.com',
      skills: 'Digital Marketing, SEO, Social Media Management',
      experience: '6-10 years',
      hourlyRate: '$30/hour',
      availability: 'Project-based',
      coverLetter: 'خبير تسويق رقمي بخبرة 8 سنوات في إدارة الحملات التسويقية وتحسين محركات البحث...',
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
      pending: { label: 'معلق', className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'موافق عليه', className: 'bg-green-100 text-green-800' },
      under_review: { label: 'قيد المراجعة', className: 'bg-blue-100 text-blue-800' },
      rejected: { label: 'مرفوض', className: 'bg-red-100 text-red-800' }
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
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6" />
          <div>
            <h2 className="text-2xl font-bold">الأطراف الخارجية</h2>
            <p className="text-gray-600">طلبات العمل الحر والمتعاونين الخارجيين</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-blue-50">
          {filteredApplications.length} طلب
        </Badge>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400" />
          <Input
            placeholder="البحث في الطلبات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <select 
          className="px-3 py-2 border rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">جميع الطلبات</option>
          <option value="pending">معلقة</option>
          <option value="under_review">قيد المراجعة</option>
          <option value="approved">موافق عليها</option>
          <option value="rejected">مرفوضة</option>
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
                      <span>المشاريع المكتملة: {application.completedProjects}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-600" />
                        <span className="text-green-600 font-medium">الأجر: {application.hourlyRate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-600" />
                        <span className="text-blue-600">التفرغ: {application.availability}</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">الخبرة: </span>
                      <span>{application.experience}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>تاريخ التقديم: {new Date(application.submittedAt).toLocaleDateString('ar-AE')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 ml-1" />
                    عرض
                  </Button>
                  {application.attachments.length > 0 && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 ml-1" />
                      الملفات ({application.attachments.length})
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Skills */}
                <div>
                  <h4 className="font-medium mb-2">المهارات والخبرات:</h4>
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
                  <h4 className="font-medium mb-2">خطاب التقديم:</h4>
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
                      الموافقة على الطلب
                    </Button>
                    <Button 
                      onClick={() => handleRejectApplication(application.id)}
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      size="sm"
                    >
                      رفض الطلب
                    </Button>
                  </div>
                )}

                {/* Attachments List */}
                {application.attachments.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">الملفات المرفقة:</h4>
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
          <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد طلبات</h3>
          <p className="text-gray-500">
            {searchTerm ? 'جرب تعديل مصطلحات البحث' : 'لم يتم تقديم أي طلبات للعمل الحر بعد'}
          </p>
        </div>
      )}
    </div>
  );
};

export default GroupExternalTab;
