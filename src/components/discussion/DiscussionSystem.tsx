
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Reply, 
  ThumbsUp, 
  ThumbsDown, 
  Heart,
  Flag,
  Pin,
  Edit,
  Trash2,
  Search,
  Filter,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface Discussion {
  id: string;
  title: string;
  description: string;
  author: string;
  authorRole: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'closed' | 'archived';
  category: string;
  tags: string[];
  isPinned: boolean;
  replyCount: number;
  participantCount: number;
  reactions: Reactions;
  replies: Reply[];
}

interface Reply {
  id: string;
  content: string;
  author: string;
  authorRole: string;
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
  parentId?: string;
  reactions: Reactions;
  replies: Reply[];
}

interface Reactions {
  like: number;
  dislike: number;
  heart: number;
  userReaction?: 'like' | 'dislike' | 'heart';
}

interface DiscussionSystemProps {
  groupId: string;
  userRole: string;
  isManager: boolean;
}

const DiscussionSystem = ({ groupId, userRole, isManager }: DiscussionSystemProps) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    description: '',
    category: 'general',
    tags: ''
  });
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    loadDiscussions();
  }, [groupId]);

  const loadDiscussions = async () => {
    // Mock data with enhanced discussion features
    const mockDiscussions: Discussion[] = [
      {
        id: '1',
        title: 'Medical Equipment Procurement Strategy',
        description: 'Let\'s discuss our approach to bulk purchasing medical equipment. What are your thoughts on supplier selection criteria?',
        author: 'Dr. Sarah Johnson',
        authorRole: 'Group Manager',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        category: 'procurement',
        tags: ['medical', 'equipment', 'bulk-purchase'],
        isPinned: true,
        replyCount: 12,
        participantCount: 8,
        reactions: { like: 5, dislike: 0, heart: 2 },
        replies: [
          {
            id: '1-1',
            content: 'I think we should prioritize suppliers with ISO certification and good track records.',
            author: 'Michael Chen',
            authorRole: 'Member',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            isEdited: false,
            reactions: { like: 3, dislike: 0, heart: 1 },
            replies: []
          }
        ]
      },
      {
        id: '2',
        title: 'Group Meeting Schedule',
        description: 'Proposing to change our monthly meeting from Mondays to Wednesdays. Please share your availability.',
        author: 'Ahmed Al-Rashid',
        authorRole: 'Member',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'active',
        category: 'logistics',
        tags: ['meetings', 'schedule'],
        isPinned: false,
        replyCount: 6,
        participantCount: 6,
        reactions: { like: 4, dislike: 1, heart: 0 },
        replies: []
      }
    ];

    setDiscussions(mockDiscussions);
  };

  const createDiscussion = async () => {
    try {
      const discussion: Discussion = {
        id: Date.now().toString(),
        title: newDiscussion.title,
        description: newDiscussion.description,
        author: 'Current User',
        authorRole: userRole,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        category: newDiscussion.category,
        tags: newDiscussion.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isPinned: false,
        replyCount: 0,
        participantCount: 1,
        reactions: { like: 0, dislike: 0, heart: 0 },
        replies: []
      };

      setDiscussions(prev => [discussion, ...prev]);
      setShowNewDiscussion(false);
      setNewDiscussion({ title: '', description: '', category: 'general', tags: '' });
      toast.success('Discussion created successfully');
    } catch (error) {
      toast.error('Failed to create discussion');
    }
  };

  const addReply = async (discussionId: string, content: string, parentId?: string) => {
    try {
      const reply: Reply = {
        id: `${discussionId}-${Date.now()}`,
        content,
        author: 'Current User',
        authorRole: userRole,
        createdAt: new Date().toISOString(),
        isEdited: false,
        parentId,
        reactions: { like: 0, dislike: 0, heart: 0 },
        replies: []
      };

      setDiscussions(prev => prev.map(discussion => {
        if (discussion.id === discussionId) {
          const updatedReplies = [...discussion.replies, reply];
          return {
            ...discussion,
            replies: updatedReplies,
            replyCount: discussion.replyCount + 1,
            updatedAt: new Date().toISOString()
          };
        }
        return discussion;
      }));

      setReplyContent('');
      toast.success('Reply added successfully');
    } catch (error) {
      toast.error('Failed to add reply');
    }
  };

  const handleReaction = async (itemId: string, reactionType: 'like' | 'dislike' | 'heart', isReply: boolean = false) => {
    try {
      setDiscussions(prev => prev.map(discussion => {
        if (!isReply && discussion.id === itemId) {
          const currentReaction = discussion.reactions.userReaction;
          const reactions = { ...discussion.reactions };
          
          // Remove previous reaction
          if (currentReaction) {
            reactions[currentReaction]--;
          }
          
          // Add new reaction if different
          if (currentReaction !== reactionType) {
            reactions[reactionType]++;
            reactions.userReaction = reactionType;
          } else {
            delete reactions.userReaction;
          }
          
          return { ...discussion, reactions };
        }
        return discussion;
      }));
    } catch (error) {
      toast.error('Failed to update reaction');
    }
  };

  const togglePin = async (discussionId: string) => {
    if (!isManager) return;
    
    setDiscussions(prev => prev.map(discussion => {
      if (discussion.id === discussionId) {
        return { ...discussion, isPinned: !discussion.isPinned };
      }
      return discussion;
    }));
  };

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || discussion.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['general', 'procurement', 'logistics', 'finance', 'announcements'];

  const getAuthorColor = (role: string) => {
    switch (role) {
      case 'Group Manager': return 'bg-blue-100 text-blue-800';
      case 'Admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Group Discussions</h2>
          <p className="text-gray-600">Collaborate and share ideas with your group</p>
        </div>
        <Button onClick={() => setShowNewDiscussion(true)}>
          <MessageSquare className="w-4 h-4 mr-2" />
          New Discussion
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">Active Discussions</h3>
            <p className="text-2xl font-bold text-blue-600">
              {discussions.filter(d => d.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">Total Participants</h3>
            <p className="text-2xl font-bold text-green-600">
              {discussions.reduce((sum, d) => sum + d.participantCount, 0)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Reply className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold">Total Replies</h3>
            <p className="text-2xl font-bold text-purple-600">
              {discussions.reduce((sum, d) => sum + d.replyCount, 0)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h3 className="font-semibold">Engagement Rate</h3>
            <p className="text-2xl font-bold text-orange-600">92%</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions
          .sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          })
          .map((discussion) => (
            <Card key={discussion.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {discussion.isPinned && <Pin className="w-4 h-4 text-yellow-600" />}
                      <CardTitle className="text-lg">{discussion.title}</CardTitle>
                      <Badge variant="outline">{discussion.category}</Badge>
                      <Badge variant={discussion.status === 'active' ? 'default' : 'secondary'}>
                        {discussion.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {discussion.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{discussion.author}</span>
                        <Badge variant="outline" className={`text-xs ${getAuthorColor(discussion.authorRole)}`}>
                          {discussion.authorRole}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Reply className="w-4 h-4" />
                        <span>{discussion.replyCount} replies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{discussion.participantCount} participants</span>
                      </div>
                    </div>
                  </div>
                  
                  {isManager && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePin(discussion.id)}
                      >
                        <Pin className={`w-4 h-4 ${discussion.isPinned ? 'text-yellow-600' : ''}`} />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-700 mb-4">{discussion.description}</p>
                
                {/* Tags */}
                {discussion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {discussion.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Reactions */}
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction(discussion.id, 'like')}
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{discussion.reactions.like}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction(discussion.id, 'heart')}
                    className="flex items-center gap-1"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{discussion.reactions.heart}</span>
                  </Button>
                </div>

                {/* Recent Replies Preview */}
                {discussion.replies.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {discussion.replies[0].author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{discussion.replies[0].author}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(discussion.replies[0].createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{discussion.replies[0].content}</p>
                  </div>
                )}

                {/* Reply Form */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => addReply(discussion.id, replyContent)}
                    disabled={!replyContent.trim()}
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* New Discussion Modal */}
      {showNewDiscussion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Start New Discussion</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Discussion title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={newDiscussion.description}
                  onChange={(e) => setNewDiscussion(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What would you like to discuss?"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select 
                    value={newDiscussion.category}
                    onChange={(e) => setNewDiscussion(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <Input
                    value={newDiscussion.tags}
                    onChange={(e) => setNewDiscussion(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowNewDiscussion(false)}>
                  Cancel
                </Button>
                <Button onClick={createDiscussion}>
                  Start Discussion
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionSystem;
