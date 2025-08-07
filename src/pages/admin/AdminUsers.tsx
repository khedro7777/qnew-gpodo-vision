
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAdminUsers, useUpdateUserStatus, useKYCDocuments, useUpdateKYCStatus } from '@/hooks/useAdmin';
import { Search, UserCheck, UserX, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKYCDoc, setSelectedKYCDoc] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: kycDocuments, isLoading: kycLoading } = useKYCDocuments();
  const updateUserStatus = useUpdateUserStatus();
  const updateKYCStatus = useUpdateKYCStatus();

  // Filter users based on search term
  const filteredUsers = users?.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserStatus.mutateAsync({ 
        userId, 
        is_active: !currentStatus 
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleKYCAction = async (documentId: string, status: 'approved' | 'rejected') => {
    try {
      await updateKYCStatus.mutateAsync({
        documentId,
        status,
        reviewer_notes: reviewNotes
      });
      setSelectedKYCDoc(null);
      setReviewNotes('');
      toast.success(`KYC document ${status} successfully`);
    } catch (error) {
      console.error('Error updating KYC status:', error);
    }
  };

  const getUserRole = (role: string) => {
    const roleMap: Record<string, { label: string; variant: any }> = {
      admin: { label: 'Admin', variant: 'destructive' },
      user: { label: 'User', variant: 'default' },
      api: { label: 'API User', variant: 'secondary' },
      supplier: { label: 'Supplier', variant: 'outline' }
    };
    return roleMap[role] || { label: 'Unknown', variant: 'default' };
  };

  const getKYCStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      case 'submitted': return 'outline';
      default: return 'default';
    }
  };

  // Helper function to safely get profile data
  const getProfileData = (profiles: any) => {
    if (!profiles) return { email: 'Email not available', full_name: 'Name not available' };
    if (typeof profiles === 'object' && 'email' in profiles && 'full_name' in profiles) {
      return {
        email: profiles.email || 'Email not available',
        full_name: profiles.full_name || 'Name not available'
      };
    }
    return { email: 'Email not available', full_name: 'Name not available' };
  };

  if (usersLoading || kycLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading admin data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="kyc">KYC Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
              <CardDescription>
                Manage user accounts, roles, and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const roleInfo = getUserRole(user.role);
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{user.full_name || 'Not provided'}</TableCell>
                        <TableCell>
                          <Badge variant={roleInfo.variant as any}>
                            {roleInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? 'default' : 'destructive'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant={user.is_active ? 'destructive' : 'default'}
                            size="sm"
                            onClick={() => handleStatusToggle(user.id, user.is_active)}
                            disabled={updateUserStatus.isPending}
                          >
                            {user.is_active ? (
                              <>
                                <UserX className="w-4 h-4 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KYC Document Reviews</CardTitle>
              <CardDescription>
                Review and approve user KYC documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Email</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kycDocuments?.map((doc) => {
                    const profileData = getProfileData(doc.profiles);
                    return (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          {profileData.email}
                        </TableCell>
                        <TableCell>
                          {profileData.full_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {doc.document_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getKYCStatusVariant(doc.status)}>
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(doc.submitted_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedKYCDoc(doc)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>KYC Document Review</DialogTitle>
                              </DialogHeader>
                              {selectedKYCDoc && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Document Type</label>
                                      <p className="text-sm text-gray-600">{selectedKYCDoc.document_type}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Status</label>
                                      <Badge variant={getKYCStatusVariant(selectedKYCDoc.status)}>
                                        {selectedKYCDoc.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="text-sm font-medium">Document File</label>
                                    <div className="mt-2">
                                      <a
                                        href={selectedKYCDoc.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline"
                                      >
                                        {selectedKYCDoc.file_name}
                                      </a>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium">Reviewer Notes</label>
                                    <Textarea
                                      value={reviewNotes}
                                      onChange={(e) => setReviewNotes(e.target.value)}
                                      placeholder="Add notes about your review decision..."
                                      className="mt-2"
                                    />
                                  </div>

                                  {selectedKYCDoc.status === 'pending' && (
                                    <div className="flex space-x-2">
                                      <Button
                                        onClick={() => handleKYCAction(selectedKYCDoc.id, 'approved')}
                                        disabled={updateKYCStatus.isPending}
                                        className="flex-1"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleKYCAction(selectedKYCDoc.id, 'rejected')}
                                        disabled={updateKYCStatus.isPending}
                                        className="flex-1"
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUsers;
