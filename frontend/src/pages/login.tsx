import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContexts';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/feed');
    } catch (error) { } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center"><div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto"><span className="text-white text-2xl font-bold">SA</span></div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Welcome Back!</h2><p className="text-gray-600">Login to your account</p></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative"><EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Email address" required /></div>
          <div className="relative"><LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Password" required /></div>
          <button type="submit" disabled={isLoading} className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50">{isLoading ? 'Logging in...' : 'Login'}</button>
          <p className="text-center text-sm">Don't have an account? <Link href="/register" className="text-primary-600 hover:underline">Sign up</Link></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;