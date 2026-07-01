import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContexts';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon, ArrowLeftIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import Avatar from '@/components/common/Avatar';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const VolumeUpIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>);
const VolumeOffIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0 1.5-1.5 3-3 3" /></svg>);

const SingleReelPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [reel, setReel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { if (id) { loadReel(); loadComments(); } }, [id]);

  const loadReel = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reels/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setReel(data.data);
      setIsLiked(data.data.is_liked);
      setLikesCount(data.data.likes_count);
    } catch (error) { toast.error('Failed to load reel'); router.push('/reels'); } finally { setIsLoading(false); }
  };

  const loadComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reels/${id}/comments`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setComments(data.data || []);
    } catch (error) { console.error('Failed to load comments:', error); }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reels/${id}/like`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setIsLiked(data.data.liked);
      setLikesCount(data.data.likes_count);
    } catch (error) { toast.error('Failed to like reel'); }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reels/${id}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ content: newComment }) });
      const data = await res.json();
      setComments([data.data, ...comments]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) { toast.error('Failed to add comment'); }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reels/${id}/comments/${commentId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch (error) { toast.error('Failed to delete comment'); }
  };

  const togglePlayPause = () => { if (videoRef.current) { if (isPlaying) videoRef.current.pause(); else videoRef.current.play(); setIsPlaying(!isPlaying); } };
  const toggleMute = () => { if (videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(!isMuted); } };

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-black"><LoadingSpinner size="lg" /></div>;
  if (!reel) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col lg:flex-row">
      <button onClick={() => router.back()} title="Go back" aria-label="Go back" className="absolute top-4 left-4 z-10 p-2 bg-black/50 rounded-full text-white"><ArrowLeftIcon className="h-6 w-6" /></button>
      <div className="flex-1 bg-black flex items-center justify-center relative">
        <video ref={videoRef} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${reel.video_url}`} className="max-h-full w-full object-contain" autoPlay loop playsInline onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
        <button onClick={togglePlayPause} className="absolute inset-0 flex items-center justify-center">{!isPlaying && <div className="bg-black/50 rounded-full p-4"><PlayIcon className="h-12 w-12 text-white" /></div>}</button>
      </div>
      <div className="w-full lg:w-96 bg-white flex flex-col">
        <div className="p-4 border-b"><div className="flex items-center space-x-3"><Avatar src={reel.profile_picture} alt={reel.username} size={40} /><div><p className="font-semibold">{reel.full_name || reel.username}<span className="text-gray-500 text-sm ml-2">@{reel.username}</span></p></div></div></div>
        <div className="p-4 border-b"><p>{reel.description || 'No description'}</p><div className="flex items-center space-x-4 mt-2 text-sm text-gray-500"><span>🎵 Original Audio</span><span>{reel.views_count || 0} views</span></div></div>
        <div className="p-4 border-b flex items-center space-x-6">
          <button onClick={handleLike} className="flex items-center space-x-2">{isLiked ? <HeartIconSolid className="h-7 w-7 text-red-500" /> : <HeartIcon className="h-7 w-7" />}<span>{likesCount}</span></button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-2"><ChatBubbleLeftIcon className="h-7 w-7" /><span>{reel.comments_count}</span></button>
          <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="flex items-center space-x-2"><ShareIcon className="h-7 w-7" /><span>Share</span></button>
          <button onClick={toggleMute}>{isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}</button>
        </div>
        {showComments && (
          <div className="flex-1 overflow-y-auto p-4">
            <form onSubmit={handleAddComment} className="mb-4 flex space-x-2"><input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" /><button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">Post</button></form>
            <div className="space-y-3">
              {comments.map(comment => (
                <div key={comment.id} className="flex space-x-3 group">
                  <Avatar src={comment.profile_picture} alt={comment.username} size={32} />
                  <div className="flex-1"><p className="font-semibold text-sm">{comment.full_name || comment.username}<span className="text-gray-500 text-xs ml-2">@{comment.username}</span></p><p className="text-gray-700 text-sm">{comment.content}</p></div>
                  {user?.id === comment.user_id && <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500 text-xs opacity-0 group-hover:opacity-100">Delete</button>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleReelPage;