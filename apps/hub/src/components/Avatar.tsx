"use client";

import { useState } from 'react';
import Image from 'next/image';
import { UserIcon } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClass = sizeClasses[size];

  if (!src || imageError) {
    return (
      <div
        className={`${sizeClass} ${className} rounded-full bg-gray-700 flex items-center justify-center`}
      >
        <UserIcon className="w-1/2 h-1/2 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`${sizeClass} ${className} relative rounded-full overflow-hidden`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}