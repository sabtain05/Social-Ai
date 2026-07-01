import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContexts';
import MainLayout from '@/components/Layout/MainLayout';
import { userAPI, friendRequestAPI } from '@/services/api';
import UserCard from '@/components/user/UserCard';
import FriendRequestCard from '@/components/user/FriendRequestCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const FriendsPage: React.FC = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { if (user) loadData(); }, [user, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'friends') { const res = await userAPI.getFriends(user!.id); setFriends(res.data.data); }
      else { const res = await friendRequestAPI.getPending(); setPendingRequests(res.data.data); }
    } catch (error) { console.error('Failed to load data:', error); } finally { setIsLoading(false); }
  };

  const handleAccept = async (requestId: string) => { await friendRequestAPI.accept(requestId); loadData(); };
  const handleReject = async (requestId: string) => { await friendRequestAPI.reject(requestId); loadData(); };

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b"><h1 className="text-2xl font-bold">Friends</h1></div>
        <div className="flex border-b">
          <button onClick={() => setActiveTab('friends')} className={`flex-1 px-4 py-3 text-center font-medium ${activeTab === 'friends' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}>Friends ({friends.length})</button>
          <button onClick={() => setActiveTab('requests')} className={`flex-1 px-4 py-3 text-center font-medium ${activeTab === 'requests' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}}`}>Requests ({pendingRequests.length})</button>
        </div>
        <div className="p-6">
          {isLoading ? <LoadingSpinner /> : activeTab === 'friends' ? friends.map(f => <UserCard key={f.id} user={f} showFollowButton={false} />) : pendingRequests.map(r => <FriendRequestCard key={r.id} request={r} onAccept={() => handleAccept(r.id)} onReject={() => handleReject(r.id)} />)}
          {!isLoading && ((activeTab === 'friends' && friends.length === 0) || (activeTab === 'requests' && pendingRequests.length === 0)) && <div className="text-center py-8 text-gray-500">Nothing to show</div>}
        </div>
      </div>
    </MainLayout>
  );
};

export default FriendsPage;