import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { institutionAPI } from '@/services/api';

interface Institution {
  id: number; name: string; type: string; country: string; city: string; is_pakistani: boolean;
}

interface InstitutionSearchProps {
  type: 'high_school' | 'college';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const InstitutionSearch: React.FC<InstitutionSearchProps> = ({ type, value, onChange, placeholder, label }) => {
  const [query, setQuery] = useState(value);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.trim().length < 2) { setInstitutions([]); return; }
      setIsLoading(true);
      try {
        const response = await institutionAPI.search(query, type);
        setInstitutions(response.data.data);
        setShowDropdown(true);
      } catch (error) { console.error('Search error:', error); }
      finally { setIsLoading(false); }
    };
    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query, type]);

  const handleSelect = (inst: Institution) => {
    setQuery(inst.name);
    onChange(inst.name);
    setShowDropdown(false);
  };

  const getTypeLabel = (t: string) => {
    if (t === 'high_school') return 'High School';
    if (t === 'college') return 'College';
    if (t === 'university') return 'University';
    return t;
  };

  return (
    <div ref={dropdownRef} className="relative">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => query.trim().length >= 2 && setShowDropdown(true)} placeholder={placeholder} className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
        {query && <button onClick={() => { setQuery(''); onChange(''); setInstitutions([]); }} className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-label="Clear search"><XMarkIcon className="h-5 w-5 text-gray-400" /></button>}
      </div>
      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
          {isLoading ? <div className="p-4 text-center text-gray-500">Searching...</div> : institutions.length > 0 ? institutions.map(inst => (
            <button key={inst.id} onClick={() => handleSelect(inst)} className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
              <p className="font-medium text-gray-900">{inst.name}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${inst.type === 'high_school' ? 'bg-blue-100 text-blue-700' : inst.type === 'college' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>{getTypeLabel(inst.type)}</span>
                {inst.country && <span className="text-xs text-gray-500">📍 {inst.country}{inst.city && `, ${inst.city}`}</span>}
                {inst.is_pakistani && <span className="text-xs text-green-600">🇵🇰 Pakistani</span>}
              </div>
            </button>
          )) : query.trim().length >= 2 && <div className="p-4 text-center text-gray-500">No institutions found.<br/>You can type manually.</div>}
        </div>
      )}
    </div>
  );
};

export default InstitutionSearch;