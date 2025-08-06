
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Inbox,
  MessageCircle, 
  Building, 
  Briefcase,
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Reply
} from 'lucide-react';
import ReplyModal from './ReplyModal';
import { toast } from 'sonner';

interface GroupInboxProps {
  groupId: string;
  userRole: string;
}

const GroupInbox = ({ groupId, userRole }: GroupInboxProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  // Mock inbox messages - in real app this would come from database
  const messages = [
    {
      id: '1',
      type: 'contact',
      subject: 'Question about group purchasing terms',
      sender: 'Ahmed Al-Rashid',
      senderId: 'user-123',
      company: 'Tech Solutions LLC',
      submittedAt: '2024-01-20T10:30:00Z',
      status: 'unread',
      hasAttachments: false,
      preview: 'I would like to know more about the payment terms for bulk orders...'
    },
    {
      id: '2',
      type: 'supplier',
      subject: 'Medical Equipment Supply Offer',
      sender: 'Sarah Medical Corp',
      senderId: 'supplier-456',
      company: 'Sarah Medical Corp',
      submittedAt: '2024-01-19T14:15:00Z',
      status: 'read',
      hasAttachments: true,
      price: '$45,000',
      deliveryTime: '2 weeks',
      preview: 'We offer high-quality medical equipment with 3-year warranty...'
    },
    {
      id: '3',
      type: 'freelancer',
      subject: 'Web Developer Application',
      sender: 'Mohammed Hassan',
      senderId: 'freelancer-789',
      company: 'Freelancer',
      submittedAt: '2024-01-18T09:45:00Z',
      status: 'read',
      hasAttachments: true,
      hourlyRate: '$25/hour',
      availability: 'Full-time',
      preview: 'Experienced full-stack developer with 5+ years experience...'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <MessageCircle className="w-4 h-4" />;
      case 'supplier':
        return <Building className="w-4 h-4" />;
      case 'freelancer':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const configs = {
      contact: { label: 'Contact', className: 'bg-blue-100 text-blue-800' },
      supplier: { label: 'Supplier Offer', className: 'bg-purple-100 text-purple-800' },
      freelancer: { label: 'Freelancer', className: 'bg-orange-100 text-orange-800' }
    };
    
    const config = configs[type as keyof typeof configs] || configs.contact;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleReply = (message: any) => {
    setSelectedMessage(message);
    setReplyModalOpen(true);
  };

  const handleSendReply = async (replyData: any) => {
    try {
      // In real app, this would send to backend API
      console.log('Sending reply:', replyData);
      
      // Mark original message as read if it wasn't
      const messageIndex = messages.findIndex(m => m.id === replyData.originalMessageId);
      if (messageIndex !== -1 && messages[messageIndex].status === 'unread') {
        messages[messageIndex].status = 'read';
      }
      
      toast.success('Reply sent successfully');
    } catch (error) {
      console.error('Send reply error:', error);
      throw error;
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || message.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Inbox className="w-6 h-6" />
          <div>
            <h2 className="text-2xl font-bold">Group Inbox</h2>
            <p className="text-gray-600">Messages and submissions from group members</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-blue-50">
          {messages.filter(m => m.status === 'unread').length} unread
        </Badge>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          className="px-3 py-2 border rounded-md"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Messages</option>
          <option value="contact">Contact Messages</option>
          <option value="supplier">Supplier Offers</option>
          <option value="freelancer">Freelancer Applications</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className={`${message.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeIcon(message.type)}
                    <CardTitle className="text-lg">{message.subject}</CardTitle>
                    {getTypeBadge(message.type)}
                    {message.status === 'unread' && (
                      <Badge className="bg-blue-100 text-blue-800">New</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>From: {message.sender}</span>
                    <span>Company: {message.company}</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(message.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReply(message)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Reply className="w-4 h-4 mr-1" />
                    Reply
                  </Button>
                  {message.hasAttachments && (
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Files
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-gray-600 mb-3">{message.preview}</p>
              
              {/* Additional Info for Different Types */}
              {message.type === 'supplier' && (
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600 font-medium">Price: {message.price}</span>
                  <span className="text-blue-600">Delivery: {message.deliveryTime}</span>
                </div>
              )}
              
              {message.type === 'freelancer' && (
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600 font-medium">Rate: {message.hourlyRate}</span>
                  <span className="text-blue-600">Availability: {message.availability}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center py-12">
          <Inbox className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No messages found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'No messages or submissions yet'}
          </p>
        </div>
      )}

      {/* Reply Modal */}
      <ReplyModal
        isOpen={replyModalOpen}
        onClose={() => {
          setReplyModalOpen(false);
          setSelectedMessage(null);
        }}
        message={selectedMessage}
        groupId={groupId}
        onReply={handleSendReply}
      />
    </div>
  );
};

export default GroupInbox;
