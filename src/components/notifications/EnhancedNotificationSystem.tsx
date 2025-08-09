
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  Check, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Filter,
  Search,
  Settings,
  BellRing,
  Mail,
  Smartphone,
  MessageSquare,
  Users,
  FileText,
  Vote,
  Scale
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'message' | 'vote' | 'arbitration' | 'system';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'group' | 'personal' | 'system' | 'legal';
  isRead: boolean;
  isStarred: boolean;
  createdAt: string;
  actionUrl?: string;
  actions?: NotificationAction[];
  sender?: string;
  groupId?: string;
  metadata?: Record<string, any>;
}

interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  action: () => void;
}

const EnhancedNotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [notifications, searchTerm, filterType, filterCategory]);

  const loadNotifications = async () => {
    // Mock data with comprehensive notification types
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'New Voting Proposal',
        message: 'A new proposal "Medical Equipment Supplier Selection" requires your vote',
        type: 'vote',
        priority: 'high',
        category: 'group',
        isRead: false,
        isStarred: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        actionUrl: '/group-room/1?tab=voting',
        sender: 'Group Manager',
        groupId: '1',
        actions: [
          {
            id: 'view-proposal',
            label: 'View Proposal',
            type: 'primary',
            action: () => console.log('View proposal')
          },
          {
            id: 'vote-now',
            label: 'Vote Now',
            type: 'secondary',
            action: () => console.log('Vote now')
          }
        ]
      },
      {
        id: '2',
        title: 'New Discussion Reply',
        message: 'Dr. Sarah Johnson replied to "Medical Equipment Procurement Strategy"',
        type: 'message',
        priority: 'normal',
        category: 'group',
        isRead: false,
        isStarred: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sender: 'Dr. Sarah Johnson',
        groupId: '1',
        actions: [
          {
            id: 'view-discussion',
            label: 'View Discussion',
            type: 'primary',
            action: () => console.log('View discussion')
          }
        ]
      },
      {
        id: '3',
        title: 'Arbitration Case Update',
        message: 'Case ARB-2025-001 hearing scheduled for next week',
        type: 'arbitration',
        priority: 'urgent',
        category: 'legal',
        isRead: false,
        isStarred: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        metadata: { caseNumber: 'ARB-2025-001' },
        actions: [
          {
            id: 'view-case',
            label: 'View Case',
            type: 'primary',
            action: () => console.log('View case')
          },
          {
            id: 'download-docs',
            label: 'Download Documents',
            type: 'secondary',
            action: () => console.log('Download documents')
          }
        ]
      },
      {
        id: '4',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur on Sunday at 2:00 AM UTC',
        type: 'system',
        priority: 'normal',
        category: 'system',
        isRead: true,
        isStarred: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];

    setNotifications(mockNotifications);
  };

  const applyFilters = () => {
    let filtered = notifications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      if (filterType === 'unread') {
        filtered = filtered.filter(notification => !notification.isRead);
      } else if (filterType === 'starred') {
        filtered = filtered.filter(notification => notification.isStarred);
      } else {
        filtered = filtered.filter(notification => notification.type === filterType);
      }
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(notification => notification.category === filterCategory);
    }

    setFilteredNotifications(filtered);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({
      ...notification,
      isRead: true
    })));
  };

  const toggleStar = (notificationId: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, isStarred: !notification.isStarred }
        : notification
    ));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'vote': return <Vote className="w-4 h-4 text-purple-500" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'arbitration': return <Scale className="w-4 h-4 text-red-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <X className="w-4 h-4 text-red-500" />;
      case 'system': return <Settings className="w-4 h-4 text-gray-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getNotificationBg = (notification: Notification) => {
    if (!notification.isRead) {
      switch (notification.priority) {
        case 'urgent': return 'bg-red-50 border-red-200';
        case 'high': return 'bg-orange-50 border-orange-200';
        default: return 'bg-blue-50 border-blue-200';
      }
    }
    return 'bg-gray-50 border-gray-200';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      normal: 'bg-blue-100 text-blue-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return colors[priority as keyof typeof colors] || colors.normal;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-gray-700" />
          <div>
            <h2 className="text-2xl font-bold">Notifications</h2>
            <p className="text-gray-600">Stay updated with your group activities</p>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-800">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Types</option>
                <option value="unread">Unread</option>
                <option value="starred">Starred</option>
                <option value="vote">Voting</option>
                <option value="message">Messages</option>
                <option value="arbitration">Arbitration</option>
                <option value="system">System</option>
              </select>
              
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Categories</option>
                <option value="group">Group</option>
                <option value="personal">Personal</option>
                <option value="legal">Legal</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Bell className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Total</p>
            <p className="text-2xl font-bold">{notifications.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BellRing className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Unread</p>
            <p className="text-2xl font-bold">{unreadCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-sm font-medium">High Priority</p>
            <p className="text-2xl font-bold">
              {notifications.filter(n => ['high', 'urgent'].includes(n.priority)).length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Today</p>
            <p className="text-2xl font-bold">
              {notifications.filter(n => 
                new Date(n.createdAt).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-1 p-4">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications found</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      getNotificationBg(notification)
                    } ${!notification.isRead ? 'shadow-sm' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`text-sm font-medium ${
                            notification.isRead ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h4>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge className={`text-xs ${getPriorityBadge(notification.priority)}`}>
                              {notification.priority}
                            </Badge>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-6 h-6 p-0"
                              onClick={() => toggleStar(notification.id)}
                            >
                              <span className={`text-lg ${notification.isStarred ? 'text-yellow-500' : 'text-gray-300'}`}>
                                ★
                              </span>
                            </Button>
                            
                            {!notification.isRead && (
                              <Button
                                onClick={() => markAsRead(notification.id)}
                                variant="ghost"
                                size="sm"
                                className="w-6 h-6 p-0"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            
                            <Button
                              onClick={() => deleteNotification(notification.id)}
                              variant="ghost"
                              size="sm"
                              className="w-6 h-6 p-0 text-red-500 hover:bg-red-50"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className={`text-xs mb-2 ${
                          notification.isRead ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {notification.sender && (
                              <span>from {notification.sender}</span>
                            )}
                            <span>{new Date(notification.createdAt).toLocaleString()}</span>
                          </div>
                          
                          {notification.actions && (
                            <div className="flex gap-2">
                              {notification.actions.map((action) => (
                                <Button
                                  key={action.id}
                                  size="sm"
                                  variant={action.type === 'primary' ? 'default' : 'outline'}
                                  onClick={action.action}
                                  className="text-xs px-2 py-1 h-auto"
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-600">Real-time alerts</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">Daily digest</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <BellRing className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Sound Alerts</p>
                    <p className="text-sm text-gray-600">Audio notifications</p>
                  </div>
                </div>
                <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedNotificationSystem;
