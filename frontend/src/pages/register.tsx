import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContexts';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserIcon, EnvelopeIcon, LockClosedIcon, IdentificationIcon } from '@heroicons/react/24/outline';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', full_name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(formData);
      router.push('/feed');
    } catch (error) { } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center"><div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto"><span className="text-white text-2xl font-bold">SA</span></div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Join the Revolution!</h2><p className="text-gray-600">Where AI meets creativity</p></div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative"><UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input name="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg" placeholder="peter123" required /></div>
          <div className="relative"><IdentificationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input name="full_name" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg" placeholder="Peter Theil" /></div>
          <div className="relative"><EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg" placeholder="user@example.com" required /></div>
          <div className="relative"><LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg" placeholder="Password (min 6 chars)" required /></div>
          <button type="submit" disabled={isLoading} className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50">{isLoading ? 'Creating account...' : 'Sign up'}</button>
          <p className="text-center text-sm">Already have an account? <Link href="/login" className="text-primary-600 hover:underline">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;