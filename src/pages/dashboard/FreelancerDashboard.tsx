
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, DollarSign, Clock, Star, Plus } from 'lucide-react';

const FreelancerDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Freelancer Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your services and client projects</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Projects</p>
                    <p className="text-2xl font-bold">7</p>
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
                    <p className="text-2xl font-bold">$3,240</p>
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
                    <p className="text-2xl font-bold">32</p>
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
                    <p className="text-2xl font-bold">4.9</p>
                  </div>
                  <Star className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Services</CardTitle>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Web Development', price: '$50/hr', status: 'Active', orders: 12 },
                      { name: 'UI/UX Design', price: '$40/hr', status: 'Active', orders: 8 },
                      { name: 'Mobile App Development', price: '$60/hr', status: 'Active', orders: 5 }
                    ].map((service, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{service.name}</h4>
                            <p className="text-sm text-gray-600">{service.price} • {service.orders} orders</p>
                            <p className="text-sm text-green-600">{service.status}</p>
                          </div>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Group Project Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: 'E-commerce Platform Development', budget: '$5000-8000', team: '3-4 developers', deadline: '2 months' },
                      { title: 'Mobile App for Startup', budget: '$3000-5000', team: '2-3 developers', deadline: '6 weeks' }
                    ].map((project, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{project.title}</h4>
                            <p className="text-sm text-gray-600">Budget: {project.budget}</p>
                            <p className="text-sm text-gray-600">Team needed: {project.team}</p>
                            <p className="text-sm text-blue-600">Deadline: {project.deadline}</p>
                          </div>
                          <Button size="sm">Apply</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium">New project request</p>
                      <p className="text-gray-600">Logo design - 2 hours ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Payment received</p>
                      <p className="text-gray-600">$450 - 4 hours ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Project completed</p>
                      <p className="text-gray-600">Website redesign - 1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      <span className="font-medium">$3,240</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Earned</span>
                      <span className="font-bold text-green-600">$28,567</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FreelancerDashboard;
