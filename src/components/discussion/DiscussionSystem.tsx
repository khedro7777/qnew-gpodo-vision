
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Paperclip, 
  Image, 
  File,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { useDiscussion } from '@/hooks/useDiscussion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface DiscussionSystemProps {
  groupId: string;
  userRole: string;
  isManager: boolean;
}

const DiscussionSystem = ({ groupId, userRole, isManager }: DiscussionSystemProps) => {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage, isSending } = useDiscussion(groupId);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    try {
      if (selectedFile) {
        // Handle file upload - for now just show filename
        sendMessage({
          content: `File shared: ${selectedFile.name}`,
          messageType: 'file',
          fileUrl: `mock-url-${selectedFile.name}`
        });
        setSelectedFile(null);
      } else {
        sendMessage({
          content: newMessage,
          messageType: 'text'
        });
      }
      setNewMessage('');
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getMessagesByDate = () => {
    const grouped: Record<string, typeof messages> = {};
    messages.forEach(message => {
      const date = formatDate(message.created_at);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    return grouped;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-productivity-blue"></div>
        </div>
      </Card>
    );
  }

  const messagesByDate = getMessagesByDate();

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {Object.entries(messagesByDate).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
                  {date}
                </div>
              </div>

              {/* Messages for this date */}
              {dateMessages.map((message, index) => {
                const isOwnMessage = message.sender_id === user?.id;
                const showAvatar = index === 0 || dateMessages[index - 1].sender_id !== message.sender_id;

                return (
                  <div key={message.id} className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {message.sender_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8 h-8" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex-1 max-w-[70%] ${isOwnMessage ? 'text-right' : ''}`}>
                      {showAvatar && (
                        <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'justify-end' : ''}`}>
                          <span className="text-sm font-medium text-gray-900">
                            {isOwnMessage ? 'You' : message.sender_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(message.created_at)}
                          </span>
                          {!message.is_read && !isOwnMessage && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              New
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className={`rounded-lg px-3 py-2 ${
                        isOwnMessage 
                          ? 'bg-productivity-blue text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        {message.message_type === 'file' ? (
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4" />
                            <span className="text-sm">{message.content}</span>
                            {message.file_url && (
                              <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                                <Download className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4">
        {selectedFile && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <File className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{selectedFile.name}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedFile(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSending}
              className="flex-1"
            />
            
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isSending}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && !selectedFile) || isSending}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </Card>
  );
};

export default DiscussionSystem;
