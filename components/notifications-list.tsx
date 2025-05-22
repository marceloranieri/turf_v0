"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Bell, Clock, Loader2, User, MessageSquare, Heart, Repeat, AtSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Notification types
type NotificationType = 'follow' | 'like' | 'mention' | 'reply' | 'repost';

interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  actor_name: string;
  actor_avatar?: string;
  type: NotificationType;
  topic_id?: string;
  topic_name?: string;
  message_id?: string;
  message_text?: string;
  read: boolean;
  created_at: string;
}

// Icon for different notification types
const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case 'follow':
      return <User className="h-4 w-4" />;
    case 'like':
      return <Heart className="h-4 w-4 text-red-500" />;
    case 'mention':
      return <AtSign className="h-4 w-4 text-blue-500" />;
    case 'reply':
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    case 'repost':
      return <Repeat className="h-4 w-4 text-purple-500" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

// Notification content based on type
const NotificationContent = ({ notification }: { notification: Notification }) => {
  const { type, actor_name, topic_name, message_text } = notification;
  
  switch (type) {
    case 'follow':
      return (
        <p>
          <span className="font-semibold">@{actor_name}</span> followed you
        </p>
      );
    case 'like':
      return (
        <p>
          <span className="font-semibold">@{actor_name}</span> liked your message in <span className="font-semibold">{topic_name}</span>
          {message_text && <span className="block text-sm text-muted-foreground mt-1 line-clamp-1">{message_text}</span>}
        </p>
      );
    case 'mention':
      return (
        <p>
          <span className="font-semibold">@{actor_name}</span> mentioned you in <span className="font-semibold">{topic_name}</span>
          {message_text && <span className="block text-sm text-muted-foreground mt-1 line-clamp-1">{message_text}</span>}
        </p>
      );
    case 'reply':
      return (
        <p>
          <span className="font-semibold">@{actor_name}</span> replied to your message in <span className="font-semibold">{topic_name}</span>
          {message_text && <span className="block text-sm text-muted-foreground mt-1 line-clamp-1">{message_text}</span>}
        </p>
      );
    case 'repost':
      return (
        <p>
          <span className="font-semibold">@{actor_name}</span> reposted your message in <span className="font-semibold">{topic_name}</span>
          {message_text && <span className="block text-sm text-muted-foreground mt-1 line-clamp-1">{message_text}</span>}
        </p>
      );
    default:
      return (
        <p>You have a new notification from <span className="font-semibold">@{actor_name}</span></p>
      );
  }
};

// NotificationItem component
const NotificationItem = ({ notification, onMarkRead }: { notification: Notification; onMarkRead: (id: string) => void }) => {
  const { id, actor_avatar, actor_name, created_at, read, type, topic_id } = notification;
  
  // Link destination based on notification type
  const getDestination = () => {
    if (type === 'follow') {
      return `/profile/${actor_name}`;
    } else if (topic_id) {
      return `/topics/${topic_id}`;
    }
    return '#';
  };
  
  return (
    <div className={`p-4 flex items-start gap-3 ${read ? 'bg-background' : 'bg-muted/30'}`}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={actor_avatar || ''} alt={actor_name} />
        <AvatarFallback>{actor_name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <Link href={getDestination()} onClick={() => !read && onMarkRead(id)}>
          <div className="flex items-center gap-2 mb-1">
            <NotificationIcon type={type} />
            <NotificationContent notification={notification} />
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </div>
        </Link>
      </div>
      {!read && (
        <div className="flex-shrink-0">
          <div className="h-2 w-2 rounded-full bg-primary" />
        </div>
      )}
    </div>
  );
};

// Loading skeleton
const NotificationSkeleton = () => (
  <div className="p-4 flex items-start gap-3">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

// Main NotificationsList component
export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  
  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        return;
      }
      
      const userId = session.session.user.id;
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        throw error;
      }
      
      setNotifications(data as Notification[]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        return;
      }
      
      const userId = session.session.user.id;
      
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
      
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Setup real-time subscription and initial load
  useEffect(() => {
    fetchNotifications();
    
    // Subscribe to changes
    const channel = supabase
      .channel('notification-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
      }, () => {
        fetchNotifications();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Notifications</h2>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      
      <div className="divide-y border rounded-md">
        {loading ? (
          Array(5)
            .fill(0)
            .map((_, index) => <NotificationSkeleton key={index} />)
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              When someone follows you, likes or replies to your messages, you'll see it here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationsList; 