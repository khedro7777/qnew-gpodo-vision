
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, DollarSign, Clock, Star, Plus, TrendingUp, Users, Calendar, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

const FreelancerDashboardTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const navigate = useNavigate();

  // Mock data for freelancer services and projects
  const freelancerStats = {
    activeProjects: 7,
    monthlyEarnings: 3240,
    hoursThisWeek: 32,
    rating: 4.9,
    completedProjects: 45,
    totalEarnings: 28567
  };

  const myServices = [
    { 
      id: '1',
      name: 'Web Development', 
      price: '$50/hr', 
      status: 'active', 
      orders: 12,
      revenue: 2400,
      category: 'development'
    },
    { 
      id: '2',
      name: 'UI/UX Design', 
      price: '$40/hr', 
      status: 'active', 
      orders: 8,
      revenue: 1800,
      category: 'design'
    },
    { 
      id: '3',
      name: 'Mobile App Development', 
      price: '$60/hr', 
      status: 'paused', 
      orders: 5,
      revenue: 3200,
      category: 'development'
    }
  ];

  const groupOpportunities = [
    { 
      id: '1',
      title: 'E-commerce Platform Development', 
      budget: '$5000-8000', 
      team: '3-4 developers', 
      deadline: '2 months',
      skills: ['React', 'Node.js', 'MongoDB'],
      applicants: 12,
      maxApplicants: 20,
      category: 'development',
      urgency: 'high'
    },
    { 
      id: '2',
      title: 'Mobile App for Startup', 
      budget: '$3000-5000', 
      team: '2-3 developers', 
      deadline: '6 weeks',
      skills: ['React Native', 'Firebase'],
      applicants: 8,
      maxApplicants: 15,
      category: 'mobile',
      urgency: 'medium'
    },
    { 
      id: '3',
      title: 'AI Dashboard Design', 
      budget: '$2000-3500', 
      team: '1-2 designers', 
      deadline: '4 weeks',
      skills: ['Figma', 'AI/ML UI', 'Prototyping'],
      applicants: 15,
      maxApplicants: 18,
      category: 'design',
      urgency: 'low'
    }
  ];

  const recentActivity = [
    { type: 'project_request', message: 'New project request - Logo design', time: '2 hours ago' },
    { type: 'payment', message: 'Payment received - $450', time: '4 hours ago' },
    { type: 'completion', message: 'Project completed - Website redesign', time: '1 day ago' },
    { type: 'application', message: 'Applied to E-commerce project', time: '2 days ago' }
  ];

  const filteredOpportunities = groupOpportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || opportunity.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'urgent' && opportunity.urgency === 'high') ||
                         (selectedStatus === 'available' && opportunity.applicants < opportunity.maxApplicants);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold">{freelancerStats.activeProjects}</p>
                <p className="text-xs text-green-600">+2 this week</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Earnings</p>
                <p className="text-2xl font-bold">${freelancerStats.monthlyEarnings.toLocaleString()}</p>
                <p className="text-xs text-green-600">+12% vs last month</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hours This Week</p>
                <p className="text-2xl font-bold">{freelancerStats.hoursThisWeek}</p>
                <p className="text-xs text-blue-600">8h left to goal</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-2xl font-bold">{freelancerStats.rating}</p>
                <p className="text-xs text-orange-600">45 reviews</p>
              </div>
              <Star className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* My Services */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Services</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myServices.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{service.name}</h4>
                          <Badge className={getStatusColor(service.status)}>
                            {service.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">{service.price}</span>
                          </div>
                          <div>
                            <span>{service.orders} orders</span>
                          </div>
                          <div>
                            <span>${service.revenue} revenue</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Group Project Opportunities */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Group Project Opportunities</CardTitle>
                <Button variant="outline" onClick={() => navigate('/freelancer')}>
                  View All
                </Button>
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search projects or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOpportunities.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{project.title}</h4>
                          <Badge className={getUrgencyColor(project.urgency)}>
                            {project.urgency} priority
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Budget:</span> {project.budget}
                          </div>
                          <div>
                            <span className="font-medium">Team:</span> {project.team}
                          </div>
                          <div>
                            <span className="font-medium">Deadline:</span> {project.deadline}
                          </div>
                          <div>
                            <span className="font-medium">Applications:</span> {project.applicants}/{project.maxApplicants}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(project.applicants / project.maxApplicants) * 100}%` }}
                          />
                        </div>
                      </div>
                      <Button size="sm" className="ml-4">Apply</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="text-sm border-b pb-2 last:border-b-0">
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Earnings Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="font-medium">$840</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-medium">${freelancerStats.monthlyEarnings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Earned</span>
                  <span className="font-bold text-green-600">${freelancerStats.totalEarnings.toLocaleString()}</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Monthly Goal</span>
                    <span>81%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '81%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Service
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Projects
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Join Group Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboardTab;
