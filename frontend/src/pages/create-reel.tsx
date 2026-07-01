import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContexts';
import MainLayout from '@/components/Layout/MainLayout';
import { VideoCameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const CreateReelPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [video, setVideo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => { if (!authLoading && !user) router.push('/login'); }, [user, authLoading]);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) { toast.error('Video size should be less than 500MB'); return; }
      if (!file.type.startsWith('video/')) { toast.error('Please select a video file'); return; }
      setVideo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!video) { toast.error('Please select a video'); return; }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('video', video);
    formData.append('description', description);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reels`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
      if (res.ok) { toast.success('Reel uploaded!'); router.push('/reels'); }
      else toast.error('Upload failed');
    } catch (error) { toast.error('Upload failed'); } finally { setIsUploading(false); }
  };

  if (authLoading) return null;
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-6">Create Reel</h1>
          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary-500">
              <VideoCameraIcon className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm text-gray-500">Click to upload video (MP4, max 500MB)</p>
              <input type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" />
            </label>
          ) : (
            <div className="relative">
              <video src={preview} className="w-full rounded-lg max-h-96 object-contain bg-black" controls autoPlay loop />
              <button type="button" aria-label="Remove selected video" onClick={() => { setVideo(null); setPreview(null); }} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          )}
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full mt-4 px-3 py-2 border rounded-lg" placeholder="Description (optional)" maxLength={150} />
          <button onClick={handleUpload} disabled={!video || isUploading} className="w-full mt-4 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">{isUploading ? 'Uploading...' : 'Upload Reel'}</button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateReelPage;