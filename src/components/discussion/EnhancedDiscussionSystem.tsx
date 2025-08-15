
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Search,
  Filter,
  Users,
  Pin,
  Heart,
  Reply,
  MoreHorizontal,
  Image,
  File,
  Calendar,
  Hash,
  Lock,
  Globe,
  XCircle
} from 'lucide-react';
import { useDiscussion } from '@/hooks/useDiscussion';
import { useAuth } from '@/contexts/AuthContext';

interface EnhancedDiscussionSystemProps {
  groupId: string;
  userRole: string;
  isManager: boolean;
}

const EnhancedDiscussionSystem = ({ groupId, userRole, isManager }: EnhancedDiscussionSystemProps) => {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage, isSending } = useDiscussion(groupId);
  
  const [activeTab, setActiveTab] = useState('all');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    sendMessage({
      content: newMessage,
      messageType: 'text'
    });
    
    setNewMessage('');
    setReplyTo(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock file upload - in real implementation, upload to storage first
      sendMessage({
        content: `Shared file: ${file.name}`,
        messageType: 'file',
        fileUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchTerm === '' || 
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case 'files':
        return message.message_type === 'file' && matchesSearch;
      case 'mentions':
        return message.content.includes(`@${user?.email}`) && matchesSearch;
      case 'starred':
        // Mock starred messages - in real implementation, track in database
        return false && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  if (isLoading) {
    return (
      <Card className="h-[600px]">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Group Discussion</h2>
          <p className="text-muted-foreground">Collaborate and communicate with group members</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            {messages.length > 0 ? 
              `${new Set(messages.map(m => m.sender_id)).size} participants` : 
              'No participants'}
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => setIsSearching(!isSearching)}>
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearching && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search messages, files, or participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discussion Interface */}
      <Card className="h-[700px] flex flex-col">
        <CardHeader className="pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                All ({messages.length})
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-2">
                <File className="w-4 h-4" />
                Files ({messages.filter(m => m.message_type === 'file').length})
              </TabsTrigger>
              <TabsTrigger value="mentions" className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Mentions (0)
              </TabsTrigger>
              <TabsTrigger value="starred" className="flex items-center gap-2">
                <Pin className="w-4 h-4" />
                Starred (0)
              </TabsTrigger>
              <TabsTrigger value="threads" className="flex items-center gap-2">
                <Reply className="w-4 h-4" />
                Threads (0)
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    {searchTerm ? 'No messages found' : 'No messages yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? 'Try adjusting your search terms'
                      : 'Start the conversation by sending the first message'}
                  </p>
                </div>
              ) : (
                filteredMessages.map((message, index) => {
                  const isOwnMessage = message.sender_id === user?.id;
                  const showAvatar = index === 0 || 
                    filteredMessages[index - 1].sender_id !== message.sender_id;
                  
                  return (
                    <div key={message.id} className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                      <div className="flex-shrink-0">
                        {showAvatar ? (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {message.sender_name?.charAt(0)?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-8 h-8" />
                        )}
                      </div>
                      
                      <div className={`flex-1 max-w-[80%] ${isOwnMessage ? 'text-right' : ''}`}>
                        {showAvatar && (
                          <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'justify-end' : ''}`}>
                            <span className="text-sm font-medium text-foreground">
                              {message.sender_name || 'Unknown User'}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {isOwnMessage ? 'You' : userRole}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(message.created_at)}
                            </span>
                          </div>
                        )}
                        
                        <div className={`rounded-lg p-3 ${
                          isOwnMessage 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          {message.message_type === 'file' ? (
                            <div className="flex items-center gap-2">
                              <File className="w-4 h-4" />
                              <span className="text-sm">{message.content}</span>
                              {message.file_url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(message.file_url, '_blank')}
                                >
                                  View
                                </Button>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          )}
                        </div>
                        
                        <div className={`flex items-center gap-2 mt-1 ${isOwnMessage ? 'justify-end' : ''}`}>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <Heart className="w-3 h-3" />
                            <span className="text-xs ml-1">0</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2"
                            onClick={() => setReplyTo(message.id)}
                          >
                            <Reply className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Reply Context */}
          {replyTo && (
            <div className="px-4 py-2 bg-muted/50 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Replying to message
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyTo(null)}
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-[60px] resize-none"
                  disabled={isSending}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="*/*"
                />
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSending}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="min-w-[44px]"
                >
                  {isSending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDiscussionSystem;
