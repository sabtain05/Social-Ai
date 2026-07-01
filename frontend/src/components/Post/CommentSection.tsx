import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContexts';
import { commentAPI } from '@/services/api';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
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

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { loadComments(); }, [postId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const response = await commentAPI.getComments(postId);
      setComments(response.data.data);
    } catch (error) { console.error('Failed to load comments:', error); }
    finally { setIsLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await commentAPI.create(postId, newComment);
      setComments([response.data.data, ...comments]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) { toast.error('Failed to add comment'); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await commentAPI.delete(postId, commentId);
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch (error) { toast.error('Failed to delete comment'); }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." rows={2} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
        <button type="submit" disabled={isSubmitting || !newComment.trim()} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">Post</button>
      </form>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {isLoading ? <div className="text-center py-4 text-gray-500">Loading comments...</div> : comments.length === 0 ? <div className="text-center py-4 text-gray-500">No comments yet. Be the first!</div> : comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3 group">
            <Link href={`/profile/${comment.username}`}><Avatar src={comment.profile_picture} alt={comment.username} size={32} fallbackInitials={comment.full_name || comment.username} /></Link>
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <Link href={`/profile/${comment.username}`}><p className="font-semibold text-sm text-gray-900 hover:text-primary-600">{comment.full_name || comment.username}</p></Link>
                  <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                </div>
                <p className="text-gray-700 text-sm">{comment.content}</p>
              </div>
              {user?.id === comment.user_id && <button onClick={() => handleDelete(comment.id)} className="text-xs text-red-500 hover:text-red-600 mt-1 opacity-0 group-hover:opacity-100">Delete</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;