import React from 'react';
import { FacebookIcon, WhatsappIcon } from 'react-share';
import { FaInstagram, FaLink, FaTwitter, FaTelegram } from 'react-icons/fa';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (platform: string) => void;
  postContent?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onShare, postContent }) => {
  if (!isOpen) return null;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    onShare('copy_link');
    toast.success('Link copied!');
    onClose();
  };

  const shareOptions = [
    { name: 'WhatsApp', icon: WhatsappIcon, platform: 'whatsapp' },
    { name: 'Facebook', icon: FacebookIcon, platform: 'facebook' },
    { name: 'Twitter', icon: FaTwitter, platform: 'twitter' },
    { name: 'Telegram', icon: FaTelegram, platform: 'telegram' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Share Post</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-6 w-6" /></button>
        </div>
        {postContent && <div className="p-4 bg-gray-50 border-b border-gray-200"><p className="text-sm text-gray-600 line-clamp-2">"{postContent}"</p></div>}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {shareOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button key={option.name} onClick={() => { onShare(option.platform); onClose(); }} className="flex flex-col items-center space-y-2 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group">
                  <Icon size={40} round className="group-hover:scale-105 transition" />
                  <span className="text-xs font-medium text-gray-700">{option.name}</span>
                </button>
              );
            })}
            <button onClick={handleCopyLink} className="flex flex-col items-center space-y-2 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
              <FaLink size={40} className="text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;