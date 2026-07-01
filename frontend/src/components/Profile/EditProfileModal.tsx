import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { userAPI, institutionAPI } from '@/services/api';
import toast from 'react-hot-toast';
import Avatar from '@/components/common/Avatar';
import InstitutionSearch from './InstitutionSearch';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onUpdate: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, profile, onUpdate }) => {
  const [formData, setFormData] = useState({
    full_name: '', bio: '', gender: '', relationship_status: '', high_school: '', college: '', hobbies: [] as string[], is_private: false,
  });
  const [newHobby, setNewHobby] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        gender: profile.gender || '',
        relationship_status: profile.relationship_status || '',
        high_school: profile.high_school || '',
        college: profile.college || '',
        hobbies: profile.hobbies || [],
        is_private: profile.is_private || false,
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInstitutionChange = (field: 'high_school' | 'college', value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddHobby = () => {
    if (newHobby.trim() && !formData.hobbies.includes(newHobby.trim())) {
      setFormData({ ...formData, hobbies: [...formData.hobbies, newHobby.trim()] });
      setNewHobby('');
    }
  };

  const handleRemoveHobby = (hobby: string) => {
    setFormData({ ...formData, hobbies: formData.hobbies.filter(h => h !== hobby) });
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (profilePicture) {
        const formDataPic = new FormData();
        formDataPic.append('profile_picture', profilePicture);
        await userAPI.updateProfilePicture(formDataPic);
      }
      await userAPI.updateProfile(formData);
      toast.success('Profile updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
          <button onClick={onClose} aria-label="Close edit profile modal" className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-6 w-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <Avatar src={previewUrl || profile?.profile_picture} alt={profile?.username} size={80} fallbackInitials={profile?.full_name || profile?.username} />
              <input type="file" accept="image/*" onChange={handleProfilePictureChange} title="Upload profile picture" aria-label="Upload profile picture" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700" />
            </div>
          </div>

          <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Enter your full name" title="Full name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" /></div>

          <div><label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea name="bio" rows={3} value={formData.bio} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Tell us about yourself..." /></div>

          <div><label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
            </select></div>

          <div><label className="block text-sm font-medium text-gray-700 mb-2">Relationship Status</label>
            <select name="relationship_status" value={formData.relationship_status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Select</option><option value="single">Single</option><option value="in-relationship">In a relationship</option>
              <option value="married">Married</option><option value="complicated">It's complicated</option><option value="divorced">Divorced</option>
            </select></div>

          <InstitutionSearch type="high_school" value={formData.high_school} onChange={(v) => handleInstitutionChange('high_school', v)} placeholder="Search high school..." label="High School" />
          <InstitutionSearch type="college" value={formData.college} onChange={(v) => handleInstitutionChange('college', v)} placeholder="Search college/university..." label="College / University" />

          <div><label className="block text-sm font-medium text-gray-700 mb-2">Hobbies</label>
            <div className="flex space-x-2 mb-2"><input type="text" value={newHobby} onChange={(e) => setNewHobby(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddHobby()} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg" placeholder="Add a hobby..." />
              <button type="button" onClick={handleAddHobby} className="px-4 py-2 bg-primary-600 text-white rounded-lg"><PlusIcon className="h-5 w-5" /></button>
            </div>
            <div className="flex flex-wrap gap-2">{formData.hobbies.map((hobby, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center space-x-2">
                <span>{hobby}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveHobby(hobby)}
                  className="text-gray-500 hover:text-red-500"
                  aria-label={`Remove hobby ${hobby}`}
                  title={`Remove hobby ${hobby}`}
                ><XMarkIcon className="h-4 w-4" /></button>
              </span>
            ))}</div>
          </div>

          <div><label className="flex items-center space-x-3"><input type="checkbox" name="is_private" checked={formData.is_private} onChange={(e) => setFormData({ ...formData, is_private: e.target.checked })} className="h-4 w-4 text-primary-600 rounded" /><span className="text-sm text-gray-700">Private Account</span></label>
            <p className="text-xs text-gray-500 mt-1">Only friends can see your posts</p></div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;