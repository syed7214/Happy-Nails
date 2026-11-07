import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#E9C9BE]/40 via-[#F6F0E9] to-[#3F6B58]/20 text-[#0B3B2E] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Sparkles className="w-6 h-6 text-[#3F6B58] mb-2 opacity-75" />
        <span className="font-serif text-lg italic text-[#0B3B2E]/80">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      decoding="async"
      onError={() => setHasError(true)}
      className={`block ${className}`}
    />
  );
};
