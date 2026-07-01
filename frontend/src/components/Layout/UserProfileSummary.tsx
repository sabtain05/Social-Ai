import React from 'react';
import { useAuth } from '@/contexts/AuthContexts';
import Link from 'next/link';
import Avatar from '@/components/common/Avatar';

const UserProfileSummary: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <Link href={`/profile/${user.username}`} className="flex items-center space-x-3">
        <Avatar src={user.profile_picture} alt={user.username} size={48} fallbackInitials={user.full_name || user.username} />
        <div><p className="font-semibold text-gray-900">{user.full_name || user.username}</p><p className="text-sm text-gray-500">@{user.username}</p></div>
      </Link>
    </div>
  );
};

export default UserProfileSummary;