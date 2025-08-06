
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/ui/file-upload';
import { 
  Send,
  Paperclip,
  X,
  MessageCircle,
  Building,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: any;
  groupId: string;
  onReply: (replyData: any) => void;
}

const ReplyModal = ({ isOpen, onClose, message, groupId, onReply }: ReplyModalProps) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (message) {
      setSubject(`Re: ${message.subject}`);
    }
  }, [message]);

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
      contact: { label: 'Contact Reply', className: 'bg-blue-100 text-blue-800' },
      supplier: { label: 'Supplier Reply', className: 'bg-purple-100 text-purple-800' },
      freelancer: { label: 'Freelancer Reply', className: 'bg-orange-100 text-orange-800' }
    };
    
    const config = configs[type as keyof typeof configs] || configs.contact;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setIsSubmitting(true);

    try {
      const replyData = {
        originalMessageId: message.id,
        recipientId: message.senderId,
        recipientName: message.sender,
        recipientCompany: message.company,
        subject,
        content,
        attachments: attachments.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })),
        type: 'reply',
        originalType: message.type,
        groupId,
        sentAt: new Date().toISOString()
      };

      await onReply(replyData);
      
      toast.success('Reply sent successfully');
      
      // Reset form
      setSubject('');
      setContent('');
      setAttachments([]);
      onClose();
      
    } catch (error) {
      console.error('Reply error:', error);
      toast.error('Failed to send reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (files: File[]) => {
    setAttachments(files);
  };

  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Reply to Message
          </DialogTitle>
        </DialogHeader>

        {/* Original Message Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-2">
            {getTypeIcon(message.type)}
            <span className="font-medium">Original Message:</span>
            {getTypeBadge(message.type)}
          </div>
          
          <div className="text-sm space-y-1">
            <div><strong>From:</strong> {message.sender} ({message.company})</div>
            <div><strong>Subject:</strong> {message.subject}</div>
            <div className="bg-white p-2 rounded border">
              <p className="text-gray-600 line-clamp-3">{message.preview}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject */}
          <div>
            <label htmlFor="reply-subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <Input
              id="reply-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Reply subject..."
              required
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="reply-content" className="block text-sm font-medium text-gray-700 mb-1">
              Reply Message *
            </label>
            <Textarea
              id="reply-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your reply message here..."
              rows={6}
              required
            />
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Paperclip className="w-4 h-4 inline mr-1" />
              Attachments (Optional)
            </label>
            <FileUpload
              onFileChange={handleFileChange}
              maxFiles={5}
              maxSizeMB={10}
              acceptedTypes={['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Reply
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyModal;
