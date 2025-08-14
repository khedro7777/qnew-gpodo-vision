
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useSupplierPanel, Complaint } from '@/hooks/useSupplierPanel';
import { MessageCircle, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface ComplaintsListProps {
  complaints: Complaint[];
}

const ComplaintsList = ({ complaints }: ComplaintsListProps) => {
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const { replyToComplaint, isReplying } = useSupplierPanel();

  const handleReply = (complaintId: string) => {
    const replyText = replyTexts[complaintId];
    if (!replyText?.trim()) return;

    replyToComplaint({ id: complaintId, supplier_reply: replyText });
    setReplyTexts({ ...replyTexts, [complaintId]: '' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (complaints.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No complaints yet</h3>
          <p className="text-muted-foreground">
            All your customers are happy! Complaints will appear here when submitted.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {complaints.map((complaint) => (
        <Card key={complaint.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {getStatusIcon(complaint.status)}
                <div>
                  <CardTitle className="text-lg">{complaint.subject}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Complaint #{complaint.complaint_number}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(complaint.status)}>
                {complaint.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Customer Message:</h4>
              <p className="text-muted-foreground bg-muted p-3 rounded-md">
                {complaint.message}
              </p>
            </div>

            {complaint.supplier_reply && (
              <div>
                <h4 className="font-medium mb-2">Your Reply:</h4>
                <p className="text-muted-foreground bg-blue-50 p-3 rounded-md border-l-4 border-blue-500">
                  {complaint.supplier_reply}
                </p>
              </div>
            )}

            {complaint.status === 'open' && (
              <div className="space-y-3">
                <h4 className="font-medium">Reply to Customer:</h4>
                <Textarea
                  placeholder="Type your response to the customer..."
                  value={replyTexts[complaint.id] || ''}
                  onChange={(e) => 
                    setReplyTexts({ ...replyTexts, [complaint.id]: e.target.value })
                  }
                  rows={3}
                />
                <Button
                  onClick={() => handleReply(complaint.id)}
                  disabled={!replyTexts[complaint.id]?.trim() || isReplying}
                >
                  {isReplying ? 'Sending...' : 'Send Reply'}
                </Button>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Created: {new Date(complaint.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ComplaintsList;
