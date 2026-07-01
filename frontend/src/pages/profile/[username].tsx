import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContexts';
import MainLayout from '@/components/Layout/MainLayout';
import PostCard from '@/components/Post/PostCard';
import { userAPI, postAPI, followAPI, friendRequestAPI } from '@/services/api';
import { PencilIcon, UserPlusIcon, UserMinusIcon, CalendarIcon, AcademicCapIcon, HeartIcon, Squares2X2Icon, VideoCameraIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import EditProfileModal from '@/components/Profile/EditProfileModal';
import Avatar from '@/components/common/Avatar';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;
  const { user: currentUser, updateUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [reels, setReels] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');
  const [isLoading, setIsLoading] = useState(true);
  const [isReelsLoading, setIsReelsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [friendStatus, setFriendStatus] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { if (username) loadProfile(); }, [username]);
  useEffect(() => { if (profile && activeTab === 'reels') loadUserReels(); }, [activeTab, profile]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const res = await userAPI.getProfile(username as string);
      setProfile(res.data.data);
      setIsFollowing(res.data.data.is_following);
      setFriendStatus(res.data.data.friend_status);
      const postsRes = await postAPI.getUserPosts(res.data.data.id);
      setPosts(postsRes.data.data);
    } catch (error) { toast.error('Failed to load profile'); router.push('/feed'); } finally { setIsLoading(false); }
  };

  const loadUserReels = async () => {
    setIsReelsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reels/user/${profile?.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      setReels(data.data || []);
    } catch (error) { console.error('Failed to load reels:', error); } finally { setIsReelsLoading(false); }
  };

  const handleFollow = async () => {
    if (!profile) return;
    setActionLoading(true);
    try {
      if (isFollowing) { await followAPI.unfollow(profile.id); setProfile({ ...profile, followers_count: profile.followers_count - 1 }); setIsFollowing(false); toast.success(`Unfollowed ${profile.username}`); }
      else { await followAPI.follow(profile.id); setProfile({ ...profile, followers_count: profile.followers_count + 1 }); setIsFollowing(true); toast.success(`Following ${profile.username}`); }
    } catch (error) { toast.error('Action failed'); } finally { setActionLoading(false); }
  };

  const handleFriendRequest = async () => {
    if (!profile) return;
    setActionLoading(true);
    try {
      if (friendStatus === 'none') { await friendRequestAPI.send(profile.id); setFriendStatus('pending'); toast.success(`Friend request sent to ${profile.username}`); }
      else if (friendStatus === 'pending') { await friendRequestAPI.reject(profile.id); setFriendStatus('none'); toast.success(`Friend request cancelled`); }
      else if (friendStatus === 'accepted') { await friendRequestAPI.reject(profile.id); setFriendStatus('none'); toast.success(`Unfriended ${profile.username}`); }
    } catch (error) { toast.error('Action failed'); } finally { setActionLoading(false); }
  };

  const getFriendButtonText = () => {
    if (friendStatus === 'none') return 'Add Friend';
    if (friendStatus === 'pending') return 'Cancel Request';
    if (friendStatus === 'accepted') return 'Unfriend';
    return 'Add Friend';
  };

  if (isLoading) return <MainLayout><div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div></MainLayout>;
  if (!profile) return null;

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <Avatar src={profile.profile_picture} alt={profile.username} size={80} className="ring-4 ring-white shadow-lg" fallbackInitials={profile.full_name || profile.username} />
              <div><h1 className="text-2xl font-bold">{profile.full_name || profile.username}</h1><p className="text-gray-500">@{profile.username}</p></div>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              {profile.is_own_profile ? (
                <button onClick={() => setShowEditModal(true)} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"><PencilIcon className="h-5 w-5" /><span>Edit Profile</span></button>
              ) : (
                <>
                  <button onClick={handleFollow} disabled={actionLoading} className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isFollowing ? 'border border-gray-300 hover:bg-gray-50' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
                    {isFollowing ? <><UserMinusIcon className="h-5 w-5" /><span>Unfollow</span></> : <><UserPlusIcon className="h-5 w-5" /><span>Follow</span></>}
                  </button>
                  <button onClick={handleFriendRequest} disabled={actionLoading} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    {friendStatus === 'accepted' ? <UserMinusIcon className="h-5 w-5" /> : <UserPlusIcon className="h-5 w-5" />}<span>{getFriendButtonText()}</span>
                  </button>
                </>
              )}
            </div>
          </div>
          {profile.bio && <p className="mt-4 text-gray-700">{profile.bio}</p>}
          <div className="flex space-x-6 mt-4 pt-4 border-t border-gray-100">
            <span className="font-semibold">{posts.length + reels.length} posts</span>
            <button onClick={() => router.push(`/followers?userId=${profile.id}`)} className="hover:bg-gray-50 px-3 py-1 rounded-lg"><span className="font-semibold">{profile.followers_count}</span> followers</button>
            <button onClick={() => router.push(`/following?userId=${profile.id}`)} className="hover:bg-gray-50 px-3 py-1 rounded-lg"><span className="font-semibold">{profile.following_count}</span> following</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button onClick={() => setActiveTab('posts')} className={`flex items-center space-x-2 px-1 py-3 border-b-2 transition-colors ${activeTab === 'posts' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500'}`}>
            <Squares2X2Icon className="h-5 w-5" /><span>Posts</span><span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{posts.length}</span>
          </button>
          <button onClick={() => setActiveTab('reels')} className={`flex items-center space-x-2 px-1 py-3 border-b-2 transition-colors ${activeTab === 'reels' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500'}`}>
            <VideoCameraIcon className="h-5 w-5" /><span>Reels</span><span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{reels.length}</span>
          </button>
        </div>
      </div>

      {activeTab === 'posts' && (
        <div className="mt-6 space-y-4">
          {posts.length === 0 ? <div className="bg-white rounded-xl p-12 text-center"><p className="text-gray-500">No posts yet</p></div> : posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="mt-6">
          {isReelsLoading ? <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div> : reels.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center"><p className="text-gray-500">No reels yet</p></div>
          ) : (
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {reels.map((reel) => (
                <button key={reel.id} onClick={() => router.push(`/reels/${reel.id}`)} className="relative group aspect-square bg-gray-900 rounded-lg overflow-hidden">
                  <video src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${reel.video_url}`} className="w-full h-full object-cover" muted />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"><VideoCameraIcon className="h-8 w-8 text-white" /></div>
                  <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded-full"><span className="text-white text-xs">{reel.views_count || 0} views</span></div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <EditProfileModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} profile={profile} onUpdate={() => { loadProfile(); if (currentUser && profile.is_own_profile) updateUser({ ...currentUser, ...profile }); }} />
    </MainLayout>
  );
};

export default ProfilePage;