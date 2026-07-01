import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContexts';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) router.push('/feed');
      else router.push('/welcome');
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-pulse">
          <span className="text-white text-3xl font-bold">SA</span>
        </div>
        <div className="mt-6"><div className="w-16 h-16 mx-auto relative"><div className="absolute inset-0 rounded-full border-4 border-primary-200"></div><div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin"></div></div>
        <p className="mt-4 text-gray-600 font-medium">Loading Social Ai...</p><p className="text-sm text-gray-400 mt-1">Your creative space awaits</p></div>
      </div>
    </div>
  );
}