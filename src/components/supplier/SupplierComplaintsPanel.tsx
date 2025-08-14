
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Complaint, useSupplierPanel } from '@/hooks/useSupplierPanel';
import { 
  MessageSquare, 
  Send, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  User,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SupplierComplaintsPanelProps {
  complaints: Complaint[];
}

export const SupplierComplaintsPanel: React.FC<SupplierComplaintsPanelProps> = ({ complaints }) => {
  const { replyToComplaint, isReplying } = useSupplierPanel();
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReply = async (complaintId: string) => {
    if (!replyText.trim()) return;
    
    try {
      replyToComplaint({ id: complaintId, supplier_reply: replyText });
      setReplyText('');
      setSelectedComplaint(null);
    } catch (error) {
      console.error('Error replying to complaint:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'escalated':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'escalated': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openComplaints = complaints.filter(c => c.status === 'open').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'in_progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{openComplaints}</div>
                <div className="text-sm text-muted-foreground">Open</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{inProgressComplaints}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{resolvedComplaints}</div>
                <div className="text-sm text-muted-foreground">Resolved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{complaints.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search complaints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(complaint.status)}
                      <CardTitle className="text-lg">{complaint.subject}</CardTitle>
                      <Badge className={getStatusColor(complaint.status)}>
                        {complaint.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>#{complaint.complaint_number}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}</span>
                      {complaint.offer_id && (
                        <>
                          <span>•</span>
                          <span>Related to offer</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Original Complaint */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">Customer Complaint</span>
                  </div>
                  <p className="text-sm">{complaint.message}</p>
                  {complaint.attachments && complaint.attachments.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-muted-foreground">
                        {complaint.attachments.length} attachment(s)
                      </span>
                    </div>
                  )}
                </div>

                {/* Supplier Reply (if exists) */}
                {complaint.supplier_reply && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Your Reply</span>
                    </div>
                    <p className="text-sm">{complaint.supplier_reply}</p>
                  </div>
                )}

                {/* Admin Notes (if exists) */}
                {complaint.admin_notes && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">Admin Notes</span>
                    </div>
                    <p className="text-sm">{complaint.admin_notes}</p>
                  </div>
                )}

                {/* Reply Section */}
                {complaint.status === 'open' && (
                  <div className="border-t pt-4">
                    {selectedComplaint === complaint.id ? (
                      <div className="space-y-3">
                        <Label htmlFor={`reply-${complaint.id}`}>Your Reply</Label>
                        <Textarea
                          id={`reply-${complaint.id}`}
                          placeholder="Type your response to the customer..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleReply(complaint.id)}
                            disabled={isReplying || !replyText.trim()}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            {isReplying ? 'Sending...' : 'Send Reply'}
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              setSelectedComplaint(null);
                              setReplyText('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => setSelectedComplaint(complaint.id)}
                        variant="outline"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Reply to Customer
                      </Button>
                    )}
                  </div>
                )}

                {complaint.status === 'resolved' && (
                  <div className="text-center py-4 text-green-600">
                    <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">Complaint Resolved</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery || statusFilter !== 'all' ? 'No complaints found' : 'No complaints yet'}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search filters'
                  : 'Great! You have no customer complaints at the moment.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
