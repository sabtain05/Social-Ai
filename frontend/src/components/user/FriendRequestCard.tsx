import React from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';

interface FriendRequestCardProps {
  request: { id: string; sender_id: string; username: string; full_name: string; profile_picture: string };
  onAccept: () => void;
  onReject: () => void;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({ request, onAccept, onReject }) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
      <Link href={`/profile/${request.username}`} className="flex items-center space-x-3 flex-1">
        <Avatar src={request.profile_picture} alt={request.username} size={48} fallbackInitials={request.full_name || request.username} />
        <div><p className="font-semibold text-gray-900">{request.full_name || request.username}</p><p className="text-sm text-gray-500">@{request.username}</p></div>
      </Link>
      <div className="flex space-x-2"><Button variant="primary" size="sm" onClick={onAccept}>Accept</Button><Button variant="outline" size="sm" onClick={onReject}>Reject</Button></div>
    </div>
  );
};

export default FriendRequestCard;