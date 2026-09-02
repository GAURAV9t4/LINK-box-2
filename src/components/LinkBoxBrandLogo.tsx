import React from 'react';

interface LinkBoxBrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showSubtitle?: boolean;
  showIcon?: boolean;
  className?: string;
}

export const LinkBoxBrandLogo: React.FC<LinkBoxBrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  showIcon = true,
  className = '',
}) => {
  // Dimensions & typography scaling
  const config = {
    sm: { iconSize: 28, textClass: 'text-sm font-black', subClass: 'text-[8px]', gap: 'gap-2' },
    md: { iconSize: 40, textClass: 'text-lg sm:text-xl font-black', subClass: 'text-[9px] sm:text-[10px]', gap: 'gap-2.5' },
    lg: { iconSize: 56, textClass: 'text-2xl sm:text-3xl font-black', subClass: 'text-[11px] sm:text-xs', gap: 'gap-3.5' },
    xl: { iconSize: 76, textClass: 'text-3xl sm:text-4xl lg:text-5xl font-black', subClass: 'text-xs sm:text-sm', gap: 'gap-4' },
    hero: { iconSize: 110, textClass: 'text-4xl sm:text-6xl lg:text-7xl font-black', subClass: 'text-xs sm:text-base', gap: 'gap-5' },
  }[size];

  return (
    <div className={`inline-flex items-center ${config.gap} select-none ${className}`}>
      {/* 3D Glowing Cube & Chain Link Isometric Icon */}
      {showIcon && (
        <div 
          className="relative shrink-0 flex items-center justify-center"
          style={{ width: config.iconSize, height: config.iconSize }}
        >
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_0_24px_rgba(168,85,247,0.55)]"
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="cubeGradientCyanPurple" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="45%" stopColor="#818cf8" />
                <stop offset="85%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#e879f9" />
              </linearGradient>

              <linearGradient id="chainGradient" x1="0" y1="180" x2="200" y2="20" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="30%" stopColor="#38bdf8" />
                <stop offset="70%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>

              <linearGradient id="glowFilter" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#4facfe" stopOpacity="0.8" />
              </linearGradient>

              {/* Drop Shadow Glow */}
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Ambient Glow */}
            <circle cx="100" cy="100" r="70" fill="url(#cubeGradientCyanPurple)" opacity="0.12" />

            {/* 3D Wireframe / Isometric Cube Structure */}
            {/* Top Face */}
            <polygon
              points="100,32 154,63 100,94 46,63"
              stroke="url(#cubeGradientCyanPurple)"
              strokeWidth="5.5"
              strokeLinejoin="round"
              fill="none"
              opacity="0.9"
            />

            {/* Left Face */}
            <polygon
              points="46,63 100,94 100,158 46,127"
              stroke="url(#cubeGradientCyanPurple)"
              strokeWidth="5.5"
              strokeLinejoin="round"
              fill="none"
              opacity="0.9"
            />

            {/* Right Face */}
            <polygon
              points="100,94 154,63 154,127 100,158"
              stroke="url(#cubeGradientCyanPurple)"
              strokeWidth="5.5"
              strokeLinejoin="round"
              fill="none"
              opacity="0.9"
            />

            {/* Inner isometric depth line */}
            <line
              x1="100"
              y1="94"
              x2="100"
              y2="158"
              stroke="url(#cubeGradientCyanPurple)"
              strokeWidth="4"
              opacity="0.7"
            />

            {/* Intertwined Chain Link 1 (Lower Left to Center) */}
            <path
              d="M 28 140 C 20 126 30 110 46 102 L 80 82 C 94 74 110 82 118 96 C 126 110 118 126 104 134 L 70 154 C 56 162 40 154 28 140 Z"
              stroke="url(#chainGradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#neonGlow)"
            />

            {/* Intertwined Chain Link 2 (Center to Upper Right) */}
            <path
              d="M 88 106 C 80 92 90 76 106 68 L 140 48 C 154 40 170 48 178 62 C 186 76 178 92 164 100 L 130 120 C 116 128 100 120 88 106 Z"
              stroke="url(#chainGradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#neonGlow)"
            />

            {/* Sparkles / Ambient Tech Stars */}
            <path
              d="M 180 160 Q 185 160 185 155 Q 185 160 190 160 Q 185 160 185 165 Q 185 160 180 160 Z"
              fill="#a855f7"
            />
            <path
              d="M 18 42 Q 22 42 22 38 Q 22 42 26 42 Q 22 42 22 46 Q 22 42 18 42 Z"
              fill="#38bdf8"
            />
          </svg>
        </div>
      )}

      {/* Brand Typography (LINK BOX & Subtitle) */}
      <div className="flex flex-col text-left">
        <div className={`tracking-wider uppercase text-white font-mono leading-none ${config.textClass}`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-200 to-purple-400 drop-shadow-[0_2px_12px_rgba(168,85,247,0.4)]">
            LINK BOX
          </span>
        </div>

        {showSubtitle && (
          <div className={`font-mono font-bold tracking-[0.24em] uppercase text-zinc-300/85 mt-1 leading-none ${config.subClass}`}>
            YOUR CONNECTED PORTAL
          </div>
        )}
      </div>
    </div>
  );
};
