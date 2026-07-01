import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContexts';
import { 
  HomeIcon, UserIcon, UsersIcon, UserGroupIcon, BellIcon, 
  ArrowLeftOnRectangleIcon, VideoCameraIcon 
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, UserIcon as UserIconSolid, 
  UsersIcon as UsersIconSolid, UserGroupIcon as UserGroupIconSolid, 
  BellIcon as BellIconSolid, VideoCameraIcon as VideoCameraIconSolid 
} from '@heroicons/react/24/solid';
import Image from 'next/image';
import SearchBar from './SearchBar';
import UserProfileSummary from './UserProfileSummary';
import Footer from './Footer';
import { notificationAPI } from '@/services/api';
import toast from 'react-hot-toast';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.data.data.unread_count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const isActive = (path: string) => router.pathname === path;

  const navigation = [
    { name: 'Home', href: '/feed', icon: HomeIcon, activeIcon: HomeIconSolid },
    { name: 'Reels', href: '/reels', icon: VideoCameraIcon, activeIcon: VideoCameraIconSolid },
    { name: 'Profile', href: `/profile/${user?.username}`, icon: UserIcon, activeIcon: UserIconSolid },
    { name: 'Friends', href: '/friends', icon: UsersIcon, activeIcon: UsersIconSolid },
    { name: 'Followers', href: '/followers', icon: UserGroupIcon, activeIcon: UserGroupIconSolid },
    { name: 'Notifications', href: '/notifications', icon: BellIcon, activeIcon: BellIconSolid, badge: unreadCount },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <Link href="/feed" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 relative flex-shrink-0">
                  <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-lg object-contain" priority />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Social Ai</span>
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <SearchBar />
            </div>

            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const Icon = isActive(item.href) ? item.activeIcon : item.icon;
                  return (
                    <Link key={item.name} href={item.href} className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${isActive(item.href) ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && item.badge > 0 && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{item.badge}</span>}
                    </Link>
                  );
                })}
                
                <div className="border-t border-gray-200 my-2"></div>
                
                <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors group">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 group-hover:text-red-500" />
                  <span className="group-hover:text-red-500">Logout</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Center Section */}
          <main className="lg:col-span-6 space-y-6">{children}</main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            <UserProfileSummary />
            <Footer />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;