import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContexts';
import { postAPI, aiAPI } from '@/services/api';
import { SparklesIcon, PhotoIcon, GlobeAltIcon, UserGroupIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import AISuggestions from './AISuggestions';
import Avatar from '@/components/common/Avatar';

interface PostCreatorProps {
  onPostCreated?: () => void;
}

const PostCreator: React.FC<PostCreatorProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { toast.error('Image size should be less than 50MB'); return; }
      if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setSelectedImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (finalContent?: string) => {
    const postContent = finalContent || content;
    if (!postContent.trim() && !selectedImage) {
      toast.error('Please write something or add an image');
      return;
    }
    setIsSubmitting(true);
    try {
      await postAPI.create({ content: postContent || '📸', privacy, original_content: content, ai_improved: !!finalContent, image: selectedImage });
      toast.success('Post created!');
      setContent('');
      setSelectedImage(null);
      setSelectedImageFile(null);
      setShowAISuggestions(false);
      setAISuggestions(null);
      if (onPostCreated) onPostCreated();
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImproveWithAI = async () => {
    if (!content.trim()) { toast.error('Please write something to improve'); return; }
    setIsGeneratingAI(true);
    try {
      const response = await aiAPI.improve(content);
      setAISuggestions(response.data.data);
      setShowAISuggestions(true);
      toast.success('AI suggestions ready!');
    } catch (error) {
      toast.error('Failed to generate AI suggestions');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string, index: number) => handleSubmit(suggestion);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-3 mb-4">
        <Avatar src={user?.profile_picture} alt={user?.username || 'User'} size={40} fallbackInitials={user?.full_name || user?.username} />
        <div>
          <p className="font-semibold text-gray-900">{user?.full_name || user?.username}</p>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            {privacy === 'public' ? <><GlobeAltIcon className="h-4 w-4" /><span>Public</span></> : <><UserGroupIcon className="h-4 w-4" /><span>Friends</span></>}
          </div>
        </div>
      </div>

      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's on your mind?" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />

      {selectedImage && (
        <div className="mt-3 relative">
          <img src={selectedImage} alt="Preview" className="max-h-64 w-full object-contain rounded-lg" />
          <button onClick={handleRemoveImage} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"><XMarkIcon className="h-5 w-5" /></button>
        </div>
      )}

      {showAISuggestions && aiSuggestions && <div className="mt-4"><AISuggestions suggestions={aiSuggestions.versions} onSelect={handleSelectSuggestion} onClose={() => setShowAISuggestions(false)} /></div>}

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={handleImproveWithAI} disabled={isGeneratingAI || !content.trim()} className="flex items-center space-x-2 px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg">
            <SparklesIcon className="h-5 w-5" /><span>{isGeneratingAI ? 'Generating...' : 'Improve with AI'}</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            <PhotoIcon className="h-5 w-5" /><span>Photo</span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
        </div>
        <div className="flex items-center space-x-3">
          <select value={privacy} onChange={(e) => setPrivacy(e.target.value as 'public' | 'friends')} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="public">Public</option><option value="friends">Friends</option>
          </select>
          <button onClick={() => handleSubmit()} disabled={isSubmitting || (!content.trim() && !selectedImage)} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCreator;