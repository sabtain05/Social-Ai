import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContexts';
import { useRouter } from 'next/router';
import { HeartIcon, ChatBubbleLeftIcon, ShareIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import Avatar from '@/components/common/Avatar';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const VolumeUpIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>);
const VolumeOffIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0 1.5-1.5 3-3 3" /></svg>);

const ReelsPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [reels, setReels] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const [playingStates, setPlayingStates] = useState<{ [key: string]: boolean }>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => { fetchReels(); }, []);

  const fetchReels = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reels/feed?cursor=${nextCursor || ''}&limit=5`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.data?.reels?.length) {
        setReels(prev => [...prev, ...data.data.reels]);
        setNextCursor(data.data.nextCursor);
        setHasMore(data.data.hasMore);
      } else setHasMore(false);
    } catch (error) { console.error('Error fetching reels:', error); }
    finally { setIsLoading(false); isLoadingRef.current = false; }
  }, [nextCursor, hasMore]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 200 && !isLoadingRef.current && hasMore) fetchReels();
  }, [fetchReels, hasMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) container.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const videoId = entry.target.getAttribute('data-reel-id');
        if (!videoId) return;
        if (entry.isIntersecting) {
          const video = videoRefs.current[videoId];
          if (video && playingStates[videoId] !== false) { video.play(); setPlayingStates(prev => ({ ...prev, [videoId]: true })); }
          const index = reels.findIndex(r => r.id === videoId);
          if (index !== -1 && index !== currentIndex) setCurrentIndex(index);
        } else {
          const video = videoRefs.current[videoId];
          if (video) { video.pause(); setPlayingStates(prev => ({ ...prev, [videoId]: false })); }
        }
      });
    }, { threshold: 0.6 });
    Object.keys(videoRefs.current).forEach(reelId => { if (videoRefs.current[reelId]) observer.observe(videoRefs.current[reelId]!); });
    return () => observer.disconnect();
  }, [reels, currentIndex, playingStates]);

  const handleLike = async (reelId: string, index: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reels/${reelId}/like`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setReels(prev => { const newReels = [...prev]; newReels[index] = { ...newReels[index], is_liked: data.data.liked, likes_count: data.data.likes_count }; return newReels; });
    } catch (error) { toast.error('Failed to like reel'); }
  };

  const toggleMute = (reelId: string) => { const video = videoRefs.current[reelId]; if (video) { video.muted = !video.muted; setMuted(video.muted); } };
  const togglePlayPause = (reelId: string) => { const video = videoRefs.current[reelId]; if (video) { if (video.paused) video.play(); else video.pause(); setPlayingStates(prev => ({ ...prev, [reelId]: !prev[reelId] })); } };

  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
      {reels.map((reel, index) => (
        <div key={reel.id} className="relative h-screen w-full snap-start flex items-center justify-center bg-black">
          <video ref={el => { if (el) videoRefs.current[reel.id] = el; }} data-reel-id={reel.id} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${reel.video_url}`} className="h-full w-full object-contain" loop playsInline muted={muted} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />
          <button onClick={() => togglePlayPause(reel.id)} className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-auto">
            {!playingStates[reel.id] && <div className="bg-black/50 rounded-full p-4"><PlayIcon className="h-12 w-12 text-white" /></div>}
          </button>
          <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6 pointer-events-auto z-10">
            <button onClick={() => handleLike(reel.id, index)} className="flex flex-col items-center">
              {reel.is_liked ? <HeartIconSolid className="h-8 w-8 text-red-500" /> : <HeartIcon className="h-8 w-8 text-white hover:text-red-500" />}
              <span className="text-white text-xs mt-1">{reel.likes_count || 0}</span>
            </button>
            <button className="flex flex-col items-center"><ChatBubbleLeftIcon className="h-8 w-8 text-white" /><span className="text-white text-xs mt-1">{reel.comments_count || 0}</span></button>
            <button onClick={() => router.push(`/reels/${reel.id}`)} className="flex flex-col items-center"><ShareIcon className="h-8 w-8 text-white" /><span className="text-white text-xs mt-1">Share</span></button>
            <button onClick={() => toggleMute(reel.id)}>{muted ? <VolumeOffIcon /> : <VolumeUpIcon />}</button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto">
            <div className="flex items-center space-x-3 mb-2">
              <Avatar src={reel.profile_picture} alt={reel.username} size={40} fallbackInitials={reel.full_name || reel.username} />
              <div><p className="text-white font-semibold">{reel.full_name || reel.username}<span className="text-white/70 text-sm ml-2">@{reel.username}</span></p></div>
            </div>
            {reel.description && <p className="text-white text-sm">{reel.description}</p>}
            <div className="flex items-center space-x-4 mt-2 text-white/60 text-xs"><span>Original Audio</span><span>{reel.views_count || 0} views</span></div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 z-20"><div className={`h-full bg-primary-500 transition-all duration-100 ${index === currentIndex ? 'w-full opacity-100' : 'w-0 opacity-0'}`} /></div>
        </div>
      ))}
      {isLoading && <div className="h-screen w-full flex items-center justify-center bg-black"><LoadingSpinner size="lg" /></div>}
      {!hasMore && reels.length > 0 && <div className="h-20 flex items-center justify-center bg-black"><p className="text-white/60">You've seen all reels!</p></div>}
    </div>
  );
};

export default ReelsPage;