import React, { useState } from 'react';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface AISuggestionsProps {
  suggestions: Array<{ style: string; text: string }>;
  onSelect: (suggestion: string, index: number) => void;
  onClose: () => void;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ suggestions, onSelect, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const getStyleColor = (style: string) => {
    const colors: Record<string, string> = {
      casual: 'bg-blue-50 text-blue-700 border-blue-200',
      motivational: 'bg-green-50 text-green-700 border-green-200',
      creative: 'bg-purple-50 text-purple-700 border-purple-200',
      funny: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      emotional: 'bg-pink-50 text-pink-700 border-pink-200',
    };
    return colors[style.toLowerCase()] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-4 border border-primary-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2"><SparklesIcon className="h-5 w-5 text-primary-600" /><h3 className="font-semibold text-gray-900">AI Suggestions</h3></div>
        <button onClick={onClose} title="Close suggestions" aria-label="Close suggestions" className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-5 w-5" /></button>
      </div>
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedIndex === index ? 'ring-2 ring-primary-500' : 'hover:shadow-md'} ${getStyleColor(suggestion.style)}`} onClick={() => setSelectedIndex(index)}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs font-medium uppercase">{suggestion.style}</span></div>
            <p className="text-sm mb-2">{suggestion.text}</p>
            <button onClick={(e) => { e.stopPropagation(); onSelect(suggestion.text, index); }} className="text-xs font-medium text-primary-600 hover:text-primary-700">Use this version</button>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">AI suggestions maintain your original intent while making it more engaging</p>
    </div>
  );
};

export default AISuggestions;