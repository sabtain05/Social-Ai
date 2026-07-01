import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContexts';
import MainLayout from '@/components/Layout/MainLayout';
import { userAPI, followAPI } from '@/services/api';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const FollowersPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { userId } = router.query;
  const [followers, setFollowers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [targetUser, setTargetUser] = useState<any>(null);

  const targetId = userId || user?.id;

  useEffect(() => {
    if (targetId) {
      loadFollowers();
      loadUserInfo();
    }
  }, [targetId]);

  const loadUserInfo = async () => {
    try {
      const response = await userAPI.getProfile(targetId as string);
      setTargetUser(response.data.data);
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  const loadFollowers = async () => {
    setIsLoading(true);
    try {
      const response = await userAPI.getFollowers(targetId as string);
      setFollowers(response.data.data);
    } catch (error) {
      toast.error('Failed to load followers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowBack = async (followerId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        await followAPI.unfollow(followerId);
      } else {
        await followAPI.follow(followerId);
      }
      loadFollowers();
      toast.success(isFollowing ? 'Unfollowed' : 'Followed back');
    } catch (error) {
      toast.error('Action failed');
    }
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            {targetUser?.full_name || targetUser?.username}'s Followers
          </h1>
          <p className="text-gray-500 mt-1">
            {followers.length} {followers.length === 1 ? 'follower' : 'followers'}
          </p>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : followers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">No followers yet</p>
              <p className="text-sm text-gray-400">
                When someone follows {targetUser?.username}, they'll appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {followers.map((follower) => (
                <div key={follower.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3 flex-1">
                    <button
                      onClick={() => router.push(`/profile/${follower.username}`)}
                      className="flex items-center space-x-3 flex-1"
                    >
                      <Avatar
                        src={follower.profile_picture}
                        alt={follower.username}
                        size={48}
                        fallbackInitials={follower.full_name || follower.username}
                      />
                      <div>
                        <p className="font-semibold text-gray-900 hover:text-primary-600">
                          {follower.full_name || follower.username}
                        </p>
                        <p className="text-sm text-gray-500">@{follower.username}</p>
                        {follower.bio && (
                          <p className="text-xs text-gray-600 line-clamp-1">{follower.bio}</p>
                        )}
                      </div>
                    </button>
                  </div>
                  {follower.id !== user?.id && (
                    <Button
                      variant={follower.is_following_back ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => handleFollowBack(follower.id, follower.is_following_back)}
                    >
                      {follower.is_following_back ? 'Following' : 'Follow Back'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default FollowersPage;