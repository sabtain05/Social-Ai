import React, { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContexts';
import { likeAPI, postAPI, shareAPI } from '@/services/api';
import toast from 'react-hot-toast';
import ShareModal from './ShareModal';
import CommentSection from './CommentSection';
import Avatar from '@/components/common/Avatar';
import { getImageUrl } from '@/utils/imageUtils';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    username: string;
    full_name: string;
    profile_picture: string;
    is_liked: boolean;
    likes_count: number;
    comments_count: number;
    shares_count: number;
    privacy: string;
    image_url?: string | null;
  };
  onDelete?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLike = async () => {
    try {
      const response = await likeAPI.toggle(post.id);
      setIsLiked(response.data.data.liked);
      setLikesCount(response.data.data.likes_count);
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setIsDeleting(true);
    try {
      await postAPI.delete(post.id);
      toast.success('Post deleted successfully');
      if (onDelete) onDelete();
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async (platform: string) => {
    try {
      await shareAPI.track(post.id, platform);
      if (platform !== 'copy_link') {
        toast.success(`Shared to ${platform}`);
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const imageUrl = post.image_url ? getImageUrl(post.image_url) : null;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <Link href={`/profile/${post.username}`} className="flex items-center space-x-3 flex-1">
            <Avatar src={post.profile_picture} alt={post.username} size={40} fallbackInitials={post.full_name || post.username} />
            <div>
              <p className="font-semibold text-gray-900 hover:text-primary-600">{post.full_name || post.username}</p>
              <p className="text-sm text-gray-500">@{post.username} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</p>
            </div>
          </Link>
          {user?.id === post.user_id && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete post"
              aria-label="Delete post"
              className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="mt-3"><p className="text-gray-800 whitespace-pre-wrap break-words">{post.content}</p></div>

        {imageUrl && !imageError && (
          <div className="mt-3 rounded-lg overflow-hidden bg-gray-100">
            <img src={imageUrl} alt="Post content" className="w-full max-h-96 object-contain" onError={() => setImageError(true)} />
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center space-x-6 text-sm text-gray-500">
          <button onClick={handleLike} className="flex items-center space-x-1 hover:text-primary-600 group">
            {isLiked ? <HeartIconSolid className="h-5 w-5 text-red-500" /> : <HeartIcon className="h-5 w-5 group-hover:text-red-500" />}
            <span className={isLiked ? 'text-red-500' : ''}>{likesCount}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-1 hover:text-primary-600">
            <ChatBubbleLeftIcon className="h-5 w-5" /><span>{post.comments_count}</span>
          </button>
          <button onClick={() => setShowShareModal(true)} className="flex items-center space-x-1 hover:text-primary-600">
            <ShareIcon className="h-5 w-5" /><span>{post.shares_count || 0}</span>
          </button>
        </div>

        {showComments && <div className="mt-4 pt-4 border-t border-gray-100"><CommentSection postId={post.id} /></div>}
      </div>

      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} onShare={handleShare} postContent={post.content.substring(0, 100)} />
    </>
  );
};

export default PostCard;