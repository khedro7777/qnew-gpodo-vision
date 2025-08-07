
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, UserPlus, Filter } from 'lucide-react';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock user data
  const users = [
    {
      id: '1',
      email: 'john@example.com',
      fullName: 'John Smith',
      company: 'Tech Corp',
      role: 'user',
      kycStatus: 'approved',
      isVerified: true,
      createdAt: '2024-01-15',
      lastLogin: '2024-01-20'
    },
    {
      id: '2',
      email: 'sarah@supplier.com',
      fullName: 'Sarah Johnson',
      company: 'Supply Co',
      role: 'supplier',
      kycStatus: 'pending',
      isVerified: false,
      createdAt: '2024-01-18',
      lastLogin: '2024-01-19'
    },
    {
      id: '3',
      email: 'mike@freelance.com',
      fullName: 'Mike Davis',
      company: 'Freelancer',
      role: 'freelancer',
      kycStatus: 'rejected',
      isVerified: false,
      createdAt: '2024-01-20',
      lastLogin: '2024-01-21'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'supplier':
        return 'bg-blue-100 text-blue-800';
      case 'freelancer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage platform users and permissions</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Users</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.company}</TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.kycStatus)}>
                      {user.kycStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isVerified ? (
                      <Badge className="bg-green-100 text-green-800">Yes</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem>Suspend</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
