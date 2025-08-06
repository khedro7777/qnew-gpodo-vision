
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit3,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const UserProfile = () => {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    company_name: profile?.company_name || '',
    phone: profile?.phone || '',
    industry_sector: profile?.industry_sector || '',
    country_code: profile?.country_code || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      company_name: profile?.company_name || '',
      phone: profile?.phone || '',
      industry_sector: profile?.industry_sector || '',
      country_code: profile?.country_code || '',
    });
    setIsEditing(false);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusBadge = () => {
    if (profile?.kyc_status === 'approved') {
      return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
    }
    return <Badge variant="outline">Pending Verification</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} className="gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="text-center space-y-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {profile?.full_name || 'User'}
                    </h3>
                    <p className="text-gray-600">{profile?.email}</p>
                    <div className="mt-2">
                      {getStatusBadge()}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {profile?.company_name && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{profile.company_name}</span>
                      </div>
                    )}
                    {profile?.industry_sector && (
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>{profile.industry_sector}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(profile?.created_at || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Account Stats */}
              <Card className="p-6 mt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Account Statistics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Points Balance</span>
                    <span className="font-medium">{profile?.points || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Status</span>
                    <span className="font-medium capitalize">{profile?.kyc_status || 'pending'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Type</span>
                    <span className="font-medium capitalize">{profile?.role || 'user'}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h4 className="font-semibold text-gray-900 mb-6">Profile Information</h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{profile?.full_name || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{profile?.email}</span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{profile?.phone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    {isEditing ? (
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                        placeholder="Enter your company name"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span>{profile?.company_name || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  {/* Industry Sector */}
                  <div className="space-y-2">
                    <Label htmlFor="industry_sector">Industry Sector</Label>
                    {isEditing ? (
                      <Input
                        id="industry_sector"
                        value={formData.industry_sector}
                        onChange={(e) => handleInputChange('industry_sector', e.target.value)}
                        placeholder="Enter your industry sector"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span>{profile?.industry_sector || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="country_code">Country</Label>
                    {isEditing ? (
                      <Input
                        id="country_code"
                        value={formData.country_code}
                        onChange={(e) => handleInputChange('country_code', e.target.value)}
                        placeholder="Enter your country code"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{profile?.country_code || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Verification Status */}
              <Card className="p-6 mt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Account Verification</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">KYC Verification</p>
                        <p className="text-sm text-gray-600">Verify your identity to unlock all features</p>
                      </div>
                    </div>
                    {getStatusBadge()}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
