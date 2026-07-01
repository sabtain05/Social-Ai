import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContexts';
import MainLayout from '@/components/Layout/MainLayout';
import { notificationAPI } from '@/services/api';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { HeartIcon, ChatBubbleLeftIcon, UserPlusIcon, UserGroupIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { if (user) loadNotifications(); }, [user]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try { const res = await notificationAPI.getNotifications(); setNotifications(res.data.data.notifications || []); } catch (error) { console.error('Failed to load notifications:', error); } finally { setIsLoading(false); }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <HeartIcon className="h-6 w-6 text-red-500" />;
      case 'comment': return <ChatBubbleLeftIcon className="h-6 w-6 text-blue-500" />;
      case 'follow': return <UserPlusIcon className="h-6 w-6 text-green-500" />;
      case 'friend_request': return <UserGroupIcon className="h-6 w-6 text-yellow-500" />;
      case 'friend_accept': return <CheckBadgeIcon className="h-6 w-6 text-purple-500" />;
      default: return <HeartIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b"><h1 className="text-2xl font-bold">Notifications</h1></div>
        <div className="divide-y">
          {isLoading ? <div className="p-8 text-center"><LoadingSpinner /></div> : notifications.length === 0 ? <div className="p-12 text-center text-gray-500">No notifications yet</div> : notifications.map(n => (
            <div key={n.id} className={`p-4 hover:bg-gray-50 transition ${!n.is_read ? 'bg-primary-50' : ''}`}>
              <div className="flex items-start space-x-3"><div className="flex-shrink-0">{getIcon(n.type)}</div><div><p className={`text-gray-800 ${!n.is_read ? 'font-semibold' : ''}`}>{n.content}</p><p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;