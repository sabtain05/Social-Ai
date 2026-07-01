import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { userAPI } from '@/services/api';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Avatar from '@/components/common/Avatar';

interface User {
  id: string;
  username: string;
  full_name: string;
  profile_picture: string;
  bio?: string;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await userAPI.searchUsers(query);
        setResults(response.data.data);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleUserClick = (username: string) => {
    setShowResults(false);
    setQuery('');
    router.push(`/profile/${username}`);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input type="text" placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => query.trim().length >= 2 && setShowResults(true)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>
      {showResults && (results.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {isLoading ? <div className="p-4 text-center text-gray-500">Searching...</div> : results.length > 0 ? results.map((user) => (
            <button key={user.id} onClick={() => handleUserClick(user.username)} className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors text-left">
              <Avatar src={user.profile_picture} alt={user.username} size={40} fallbackInitials={user.full_name || user.username} />
              <div><p className="font-medium text-gray-900">{user.full_name || user.username}</p><p className="text-sm text-gray-500">@{user.username}</p></div>
            </button>
          )) : query.trim().length >= 2 && <div className="p-4 text-center text-gray-500">No users found</div>}
        </div>
      )}
    </div>
  );
};

export default SearchBar;