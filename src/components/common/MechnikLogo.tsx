import React from 'react';

interface MechnikLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'light' | 'dark' | 'auto';
  className?: string;
  stacked?: boolean;
}

export const MechnikLogo: React.FC<MechnikLogoProps> = ({
  size = 'md',
  showTagline = true,
  variant = 'auto',
  className = '',
  stacked = false
}) => {
  // Stacked version (ideal for Auth / Role Login splash)
  if (stacked || size === 'xl') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <img
          src="/mechnik_logo_stacked_hd.png"
          alt="MECHNIK — YOUR VEHICLE • OUR CARE"
          className="h-24 sm:h-28 w-auto object-contain transition-transform group-hover:scale-105"
        />
      </div>
    );
  }

  // Light variant on dark backgrounds (e.g. dark footer, dark hero)
  if (variant === 'light') {
    const sizeMap = {
      sm: { emblem: 'h-6', text: 'text-lg', tagline: 'text-[7px]' },
      md: { emblem: 'h-8 sm:h-9', text: 'text-xl sm:text-2xl', tagline: 'text-[8px]' },
      lg: { emblem: 'h-11 sm:h-12', text: 'text-3xl', tagline: 'text-[10px]' }
    };
    const s = sizeMap[size as 'sm' | 'md' | 'lg'] || sizeMap.md;

    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <img
          src="/mechnik_emblem.png"
          alt="MECHNIK"
          className={`${s.emblem} w-auto object-contain flex-shrink-0`}
        />
        <div className="flex flex-col justify-center">
          <div className="flex items-center tracking-tight leading-none">
            <span className={`${s.text} font-black text-white tracking-tight`}>MECH</span>
            <span className={`${s.text} font-black text-mechnik-500 tracking-tight`}>NIK</span>
          </div>
          {showTagline && (
            <p className={`${s.tagline} font-bold tracking-[0.16em] text-slate-300 uppercase mt-0.5 whitespace-nowrap`}>
              YOUR VEHICLE • OUR CARE
            </p>
          )}
        </div>
      </div>
    );
  }

  // Standard horizontal logo with provided assets (Navbar, modal headers)
  const sizeClasses = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-10',
    lg: 'h-12 sm:h-14'
  };

  const imgHeight = sizeClasses[size as 'sm' | 'md' | 'lg'] || sizeClasses.md;

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/mechnik_logo.png"
        alt="MECHNIK — YOUR VEHICLE • OUR CARE"
        className={`${imgHeight} w-auto object-contain transition-transform group-hover:scale-[1.02] flex-shrink-0`}
      />
    </div>
  );
};
