import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContexts';
import MainLayout from '@/components/Layout/MainLayout';
import PostCreator from '@/components/Post/PostCreator';
import PostCard from '@/components/Post/PostCard';
import { postAPI } from '@/services/api';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const FeedPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => { if (!authLoading && !user) router.push('/login'); }, [user, authLoading]);
  useEffect(() => { if (user) loadPosts(); }, [user, page]);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const response = await postAPI.getFeed(page, 10);
      const newPosts = response.data.data.posts;
      setPosts(page === 1 ? newPosts : [...posts, ...newPosts]);
      setHasMore(newPosts.length === 10);
    } catch (error) { toast.error('Failed to load feed'); } finally { setIsLoading(false); }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
    if (bottom && hasMore && !isLoading) setPage(prev => prev + 1);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  if (!user) return null;

  return (
    <MainLayout>
      <div className="space-y-6" onScroll={handleScroll}>
        <PostCreator onPostCreated={() => { setPage(1); loadPosts(); }} />
        {posts.map((post) => <PostCard key={post.id} post={post} onDelete={() => setPosts(posts.filter(p => p.id !== post.id))} />)}
        {isLoading && page > 1 && <div className="text-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></div>}
        {!hasMore && posts.length > 0 && <div className="text-center py-4 text-gray-500">You've seen all posts</div>}
        {!isLoading && posts.length === 0 && <div className="bg-white rounded-xl p-8 text-center"><p className="text-gray-500">No posts to show. Follow some users!</p></div>}
      </div>
    </MainLayout>
  );
};

export default FeedPage;