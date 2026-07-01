import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageUtils';

interface AvatarProps {
  src: string | null | undefined;
  alt: string;
  size?: number;
  className?: string;
  fallbackInitials?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 40, className = '', fallbackInitials }) => {
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (src && !imgError) {
      setImageUrl(getImageUrl(src));
    }
  }, [src, imgError]);

  const getFallbackUrl = () => {
    const name = fallbackInitials || alt || 'User';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials || name.charAt(0))}&background=random&size=${size}&length=2`;
  };

  const finalImageUrl = imgError || !imageUrl ? getFallbackUrl() : imageUrl;
  const isExternalUrl = finalImageUrl.includes('ui-avatars.com');

  return (
    <div className={`relative rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        </div>
      )}
      <Image
        src={finalImageUrl}
        alt={alt}
        fill
        className="object-cover"
        onError={() => { setImgError(true); setIsLoading(false); }}
        onLoad={() => setIsLoading(false)}
        unoptimized={isExternalUrl}
      />
    </div>
  );
};

export default Avatar;