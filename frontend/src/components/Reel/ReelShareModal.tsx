import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  FacebookShareButton, 
  WhatsappShareButton,
  FacebookIcon, 
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon
} from 'react-share';
import { FaTiktok, FaInstagram, FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface ReelShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  reelUrl: string;
  reelTitle: string;
}

const ReelShareModal: React.FC<ReelShareModalProps> = ({ 
  isOpen, 
  onClose, 
  reelUrl, 
  reelTitle 
}) => {
  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reelUrl);
      toast.success('Link copied to clipboard!');
      onClose();
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareOptions = [
    { name: 'WhatsApp', icon: WhatsappIcon, button: WhatsappShareButton, color: '#25D366' },
    { name: 'Facebook', icon: FacebookIcon, button: FacebookShareButton, color: '#1877f2' },
    { name: 'Twitter', icon: TwitterIcon, button: TwitterShareButton, color: '#1DA1F2' },
    { name: 'Telegram', icon: TelegramIcon, button: TelegramShareButton, color: '#0088cc' },
    { name: 'Email', icon: EmailIcon, button: EmailShareButton, color: '#EA4335' },
  ];

  const handleTikTokShare = () => {
    handleCopyLink();
    toast.success('Link copied! You can now paste it on TikTok');
  };

  const handleInstagramShare = () => {
    handleCopyLink();
    toast.success('Link copied! You can now paste it on Instagram');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Share Reel</h3>
          <button type="button" onClick={onClose} aria-label="Close share modal" title="Close" className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-6 w-6" /></button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {shareOptions.map((option) => {
              const IconComponent = option.icon;
              const ButtonComponent = option.button;
              return (
                <ButtonComponent key={option.name} url={reelUrl} title={reelTitle} className="flex flex-col items-center space-y-2 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group">
                  <IconComponent size={40} round />
                  <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">{option.name}</span>
                </ButtonComponent>
              );
            })}
            
            <button onClick={handleTikTokShare} className="flex flex-col items-center space-y-2 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center"><FaTiktok className="text-white text-xl" /></div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">TikTok</span>
            </button>
            
            <button onClick={handleInstagramShare} className="flex flex-col items-center space-y-2 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 flex items-center justify-center"><FaInstagram className="text-white text-xl" /></div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">Instagram</span>
            </button>
            
            <button onClick={handleCopyLink} className="flex flex-col items-center space-y-2 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center"><FaLink className="text-white text-xl" /></div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">Copy Link</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <p className="text-xs text-gray-500 text-center">Share this reel with your friends!</p>
        </div>
      </div>
    </div>
  );
};

export default ReelShareModal;