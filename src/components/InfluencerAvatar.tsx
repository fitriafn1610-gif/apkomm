import React, { useState } from 'react';

interface InfluencerAvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const InfluencerAvatar: React.FC<InfluencerAvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
}) => {
  const [failed, setFailed] = useState(false);

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const sizeClass =
    size === 'sm'
      ? 'w-9 h-9 text-xs'
      : size === 'lg'
        ? 'w-14 h-14 text-base'
        : 'w-11 h-11 text-sm';

  if (!src || failed) {
    return (
      <div
        aria-label={name}
        className={`${sizeClass} rounded-full bg-gradient-to-br from-[#0F1E3D] to-[#4F46E5] text-white font-semibold flex items-center justify-center shrink-0 select-none ${className}`}
      >
        {initials || 'IN'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Foto profil ${name}`}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${sizeClass} rounded-full object-cover border border-slate-200 shrink-0 bg-slate-100 ${className}`}
    />
  );
};
