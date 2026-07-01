import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContexts';
import { formatDistanceToNow } from 'date-fns';
import { TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Avatar from '@/components/common/Avatar';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  username: string;
  full_name: string;
  profile_picture: string;
}

interface ReelCommentsProps {
  reelId: string;
  onCommentCountUpdate?: (count: number) => void;
}

const ReelComments: React.FC<ReelCommentsProps> = ({ reelId, onCommentCountUpdate }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [reelId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reels/${reelId}/comments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setComments(data.data || []);
      if (onCommentCountUpdate) onCommentCountUpdate(data.data?.length || 0);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reels/${reelId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });
      const data = await res.json();
      setComments([data.data, ...comments]);
      setNewComment('');
      if (onCommentCountUpdate) onCommentCountUpdate(comments.length + 1);
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reels/${reelId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setComments(comments.filter(c => c.id !== commentId));
      if (onCommentCountUpdate) onCommentCountUpdate(comments.length - 1);
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm font-medium"
          >
            Post
          </button>
        </div>
      </form>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500 py-4 text-sm">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3 group">
              <Avatar
                src={comment.profile_picture}
                alt={comment.username}
                size={32}
                fallbackInitials={comment.full_name || comment.username}
              />
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-gray-900">
                      {comment.full_name || comment.username}
                      <span className="font-normal text-gray-500 ml-2 text-xs">
                        @{comment.username}
                      </span>
                    </p>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                </div>
                {user?.id === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-red-500 hover:text-red-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReelComments;