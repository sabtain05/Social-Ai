import React from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';

interface UserCardProps {
  user: { id: string; username: string; full_name: string; profile_picture: string; bio?: string };
  onFollow?: () => void;
  isFollowing?: boolean;
  showFollowButton?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, onFollow, isFollowing = false, showFollowButton = true }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
      <Link href={`/profile/${user.username}`} className="flex items-center space-x-3 flex-1">
        <Avatar src={user.profile_picture} alt={user.username} size={48} fallbackInitials={user.full_name || user.username} />
        <div>
          <p className="font-semibold text-gray-900 hover:text-primary-600">{user.full_name || user.username}</p>
          <p className="text-sm text-gray-500">@{user.username}</p>
          {user.bio && <p className="text-xs text-gray-600 line-clamp-1">{user.bio}</p>}
        </div>
      </Link>
      {showFollowButton && onFollow && <Button variant={isFollowing ? 'outline' : 'primary'} size="sm" onClick={onFollow}>{isFollowing ? 'Unfollow' : 'Follow'}</Button>}
    </div>
  );
};

export default UserCard;