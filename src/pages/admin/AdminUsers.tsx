
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Filter, 
  Edit, 
  Ban, 
  CheckCircle, 
  XCircle,
  Calendar,
  Mail,
  Shield,
  Eye,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { useAdminUsers, useUpdateUserStatus, useKYCDocuments, useUpdateKYCStatus } from '@/hooks/useAdmin';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

  const { data: users = [], isLoading: usersLoading } = useAdminUsers();
  const { data: kycDocuments = [], isLoading: kycLoading } = useKYCDocuments();
  const updateUserStatus = useUpdateUserStatus();
  const updateKYCStatus = useUpdateKYCStatus();

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.is_active) ||
                         (statusFilter === 'inactive' && !user.is_active);
    return matchesSearch && matchesStatus;
  });

  const handleUserAction = (userId: string, action: 'activate' | 'deactivate') => {
    updateUserStatus.mutate({ 
      userId, 
      is_active: action === 'activate' 
    });
  };

  const handleKYCAction = (documentId: string, status: 'approved' | 'rejected', notes?: string) => {
    updateKYCStatus.mutate({ 
      documentId, 
      status, 
      reviewer_notes: notes 
    });
  };

  const getUserStatusBadge = (user: any) => {
    if (user.is_active) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const configs = {
      admin: { label: 'Admin', className: 'bg-purple-100 text-purple-800' },
      user: { label: 'User', className: 'bg-blue-100 text-blue-800' },
      api: { label: 'API User', className: 'bg-yellow-100 text-yellow-800' }
    };
    const config = configs[role as keyof typeof configs] || configs.user;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage platform users and their permissions</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-blue-50">
            {users.length} total users
          </Badge>
          <Badge variant="outline" className="bg-green-50">
            {users.filter(u => u.is_active).length} active
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search users by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Grid */}
      <div className="grid gap-4">
        {usersLoading ? (
          <Card className="p-6">
            <div className="animate-pulse">Loading users...</div>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <Card className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'No users registered yet'}
            </p>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{user.full_name || 'No Name'}</h3>
                      {getUserStatusBadge(user)}
                      {getRoleBadge(user.role)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                          {user.email}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Status:</span>
                            <div className="mt-1">{getUserStatusBadge(user)}</div>
                          </div>
                          <div>
                            <span className="font-medium">Role:</span>
                            <div className="mt-1">{getRoleBadge(user.role)}</div>
                          </div>
                          <div>
                            <span className="font-medium">Joined:</span>
                            <div className="mt-1">{new Date(user.created_at).toLocaleDateString()}</div>
                          </div>
                          <div>
                            <span className="font-medium">Email Verified:</span>
                            <div className="mt-1">
                              {user.is_active ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {user.is_active ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUserAction(user.id, 'deactivate')}
                      disabled={updateUserStatus.isPending}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Suspend
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => handleUserAction(user.id, 'activate')}
                      disabled={updateUserStatus.isPending}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Activate
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* KYC Documents Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold">Pending KYC Documents</h3>
          </div>
          <Badge className="bg-yellow-100 text-yellow-800">
            {kycDocuments.filter(doc => doc.status === 'pending').length} pending
          </Badge>
        </div>

        <div className="space-y-4">
          {kycLoading ? (
            <div className="animate-pulse">Loading KYC documents...</div>
          ) : kycDocuments.filter(doc => doc.status === 'pending').length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No pending KYC documents</p>
            </div>
          ) : (
            kycDocuments
              .filter(doc => doc.status === 'pending')
              .slice(0, 5)
              .map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {doc.profiles?.full_name || 'Unknown User'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {doc.profiles?.email} • {doc.document_type} • 
                      Submitted {new Date(doc.submitted_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleKYCAction(doc.id, 'approved')}
                      disabled={updateKYCStatus.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleKYCAction(doc.id, 'rejected', 'Document unclear')}
                      disabled={updateKYCStatus.isPending}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminUsers;
