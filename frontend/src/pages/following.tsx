import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContexts';
import MainLayout from '@/components/Layout/MainLayout';
import { userAPI, followAPI } from '@/services/api';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const FollowingPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { userId } = router.query;
  const [following, setFollowing] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [targetUser, setTargetUser] = useState<any>(null);

  const targetId = userId || user?.id;

  useEffect(() => {
    if (targetId) {
      loadFollowing();
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

  const loadFollowing = async () => {
    setIsLoading(true);
    try {
      const response = await userAPI.getFollowing(targetId as string);
      setFollowing(response.data.data);
    } catch (error) {
      toast.error('Failed to load following');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async (userIdToUnfollow: string) => {
    try {
      await followAPI.unfollow(userIdToUnfollow);
      setFollowing(following.filter(f => f.id !== userIdToUnfollow));
      toast.success('Unfollowed successfully');
    } catch (error) {
      toast.error('Failed to unfollow');
    }
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            {targetUser?.full_name || targetUser?.username} Following
          </h1>
          <p className="text-gray-500 mt-1">
            Following {following.length} {following.length === 1 ? 'user' : 'users'}
          </p>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : following.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">Not following anyone yet</p>
              <p className="text-sm text-gray-400">
                When {targetUser?.username} follows someone, they'll appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {following.map((followedUser) => (
                <div key={followedUser.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() => router.push(`/profile/${followedUser.username}`)}
                    className="flex items-center space-x-3 flex-1"
                  >
                    <Avatar
                      src={followedUser.profile_picture}
                      alt={followedUser.username}
                      size={48}
                      fallbackInitials={followedUser.full_name || followedUser.username}
                    />
                    <div>
                      <p className="font-semibold text-gray-900 hover:text-primary-600">
                        {followedUser.full_name || followedUser.username}
                      </p>
                      <p className="text-sm text-gray-500">@{followedUser.username}</p>
                      {followedUser.bio && (
                        <p className="text-xs text-gray-600 line-clamp-1">{followedUser.bio}</p>
                      )}
                    </div>
                  </button>
                  {followedUser.id !== user?.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnfollow(followedUser.id)}
                    >
                      Unfollow
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

export default FollowingPage;