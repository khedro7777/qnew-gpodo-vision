
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Reply, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useSupplierPanel, Complaint } from '@/hooks/useSupplierPanel';

interface ComplaintsListProps {
  complaints: Complaint[];
}

export const ComplaintsList: React.FC<ComplaintsListProps> = ({ complaints }) => {
  const { replyToComplaint, isReplying } = useSupplierPanel();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'escalated': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReply = async (complaintId: string) => {
    if (!replyText.trim()) return;
    
    try {
      await replyToComplaint({ id: complaintId, supplier_reply: replyText });
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      console.error('Error replying to complaint:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Complaints & Issues
        </CardTitle>
      </CardHeader>
      <CardContent>
        {complaints.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No complaints yet</p>
            <p className="text-sm text-gray-500">Keep up the great work!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(complaint.status)}
                      <h3 className="font-semibold">{complaint.complaint_number}</h3>
                      <Badge className={getStatusColor(complaint.status)}>
                        {complaint.status}
                      </Badge>
                    </div>
                    <p className="font-medium text-gray-900">{complaint.subject}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <p className="text-gray-800">{complaint.message}</p>
                </div>

                {complaint.attachments && complaint.attachments.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                    <div className="flex gap-2">
                      {complaint.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Attachment {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {complaint.supplier_reply && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <p className="text-sm font-medium text-blue-800 mb-1">Your Reply:</p>
                    <p className="text-blue-800">{complaint.supplier_reply}</p>
                  </div>
                )}

                {complaint.status !== 'resolved' && (
                  <div className="mt-3">
                    {replyingTo === complaint.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleReply(complaint.id)}
                            disabled={isReplying || !replyText.trim()}
                            size="sm"
                          >
                            <Reply className="w-4 h-4 mr-2" />
                            {isReplying ? 'Sending...' : 'Send Reply'}
                          </Button>
                          <Button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setReplyingTo(complaint.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
