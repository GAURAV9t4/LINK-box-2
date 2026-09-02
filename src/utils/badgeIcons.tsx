import React from 'react';

interface BadgeSvgIconProps {
  name: string;
  className?: string;
  color?: string;
}

/**
 * Suite of modern SVG-based badge icons for directory badges
 * Includes HD, 4K, 4K UHD, Global, Beta, Trending, HOT, Verified, Official, Premium, VIP, PRO, AI, LIVE, FAST, etc.
 */
export const BadgeSvgIcon: React.FC<BadgeSvgIconProps> = ({ name, className = 'w-3 h-3', color }) => {
  const norm = (name || '').toUpperCase().trim();

  // 18+ (Age Restriction 18+ Octagonal/Shield SVG Icon)
  if (norm === '18+' || norm === '18 PLUS' || norm === 'ADULT' || norm === 'MATURE' || norm === 'NSFW') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 8v8" />
        <path d="M8 12h2.5a2 2 0 0 0 0-4H8" />
        <path d="M14 9h3" />
        <path d="M15.5 7.5v3" />
      </svg>
    );
  }

  // HENTAI (Anime Blossom Spark SVG Icon)
  if (norm === 'HENTAI' || norm === 'ECCHI') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }

  // ANIME (Anime Eye & Sparkle SVG Icon)
  if (norm === 'ANIME' || norm === 'OTAKU' || norm === 'ANIME 18+') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
        <path d="m14 10 2-2" />
      </svg>
    );
  }

  // MOVIE (Filmstrip / Cinema SVG Icon)
  if (norm === 'MOVIE' || norm === 'MOVIES' || norm === 'CINEMA' || norm === 'FILM') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18" />
        <line x1="7" x2="7" y1="2" y2="22" />
        <line x1="17" x2="17" y1="2" y2="22" />
        <line x1="2" x2="22" y1="12" y2="12" />
        <line x1="2" x2="7" y1="7" y2="7" />
        <line x1="2" x2="7" y1="17" y2="17" />
        <line x1="17" x2="22" y1="7" y2="7" />
        <line x1="17" x2="22" y1="17" y2="17" />
      </svg>
    );
  }

  // FREE (Tag / Zero Cost Star SVG Icon)
  if (norm === 'FREE' || norm === 'FREEWARE' || norm === 'OPEN') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    );
  }

  // DESHI (Lotus Blossom SVG Icon)
  if (norm === 'DESHI' || norm === 'DESI' || norm === 'INDIA') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="M12 3c-1.5 3-4 6-4 9a4 4 0 0 0 8 0c0-3-2.5-6-4-9Z" />
        <path d="M8 12c-2.5-1-5 0-6 2 2 3 5 2 6-2Z" />
        <path d="M16 12c2.5-1 5 0 6 2-2 3-5 2-6-2Z" />
      </svg>
    );
  }

  // PAID (Dollar / Diamond Subscription SVG Icon)
  if (norm === 'PAID' || norm === 'PREMIUM' || norm === 'VIP' || norm === 'PRO') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    );
  }

  // TELEGRAM (Paper airplane / Telegram send SVG Icon)
  if (norm === 'TELEGRAM' || norm === 'TG' || norm === 'CHANNEL' || norm === 'GROUP') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
    );
  }

  // LIVE SPORTS / SPORTS / LIVE (Trophy / Stadium Antenna SVG Icon)
  if (norm === 'LIVE SPORTS' || norm === 'SPORTS' || norm === 'LIVE TV' || norm === 'LIVE') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45.99-.99 1.01A5 5 0 0 1 4 13.06V4h16v9.06a5 5 0 0 1-5.01 4.95c-.54-.02-.99-.46-.99-1.01v-2.34" />
      </svg>
    );
  }

  // AI TECH / AI / TECH (Microchip & AI Sparkle SVG Icon)
  if (norm === 'AI TECH' || norm === 'AI' || norm === 'TECH' || norm === 'SMART') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M15 9h.01" />
        <path d="m9 15 3-3 3 3" />
        <path d="M9 3v2" />
        <path d="M15 3v2" />
        <path d="M9 19v2" />
        <path d="M15 19v2" />
        <path d="M3 9h2" />
        <path d="M3 15h2" />
        <path d="M19 9h2" />
        <path d="M19 15h2" />
      </svg>
    );
  }

  // CUSTOM (Sparkles / Custom Badge SVG Icon)
  if (norm === 'CUSTOM' || norm === 'VAULT' || norm === 'USER') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    );
  }

  // 1. HD (High Definition SVG Icon)
  if (norm === 'HD' || norm === 'FHD' || norm === '1080P') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="M7 8v8" />
        <path d="M7 12h3" />
        <path d="M10 8v8" />
        <path d="M14 8v8c2 0 3-1 3-4s-1-4-3-4z" />
      </svg>
    );
  }

  // 2. 4K / 4K UHD / 4K HDR (Ultra High Definition SVG Icon)
  if (norm === '4K' || norm === '4K UHD' || norm === '4K HDR' || norm === 'UHD') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <rect x="2" y="4" width="20" height="16" rx="3" />
        <path d="M6 8v5h3v3" />
        <path d="M9 8v5" />
        <path d="M14 8v8" />
        <path d="M18 8l-3.5 4 3.5 4" />
      </svg>
    );
  }

  // 3. GLOBAL (Worldwide Globe with Orbit SVG Icon)
  if (norm === 'GLOBAL' || norm === 'WORLD' || norm === 'INTERNATIONAL') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    );
  }

  // 4. BETA (Science Flask / Experimental Rocket SVG Icon)
  if (norm === 'BETA' || norm === 'TEST' || norm === 'ALPHA' || norm === 'DEV') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
        <path d="M8.5 2h7" />
        <path d="M7 16h10" />
        <circle cx="10" cy="13" r="1" fill="currentColor" />
        <circle cx="14" cy="15" r="1" fill="currentColor" />
      </svg>
    );
  }

  // 5. TRENDING / POPULAR (Rising Trendline with Spark SVG Icon)
  if (norm === 'TRENDING' || norm === 'VIRAL' || norm === 'POPULAR') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    );
  }

  // 6. HOT (Fiery Dynamic Flame SVG Icon)
  if (norm === 'HOT' || norm === 'FIRE') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    );
  }

  // 7. VERIFIED / TRUSTED (Security Shield Check SVG Icon)
  if (norm === 'VERIFIED' || norm === 'TRUSTED') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  }

  // 8. OFFICIAL / VIP (Royal Crown SVG Icon)
  if (norm === 'OFFICIAL' || norm === 'VIP' || norm === 'ROYAL') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z" />
      </svg>
    );
  }

  // 9. PREMIUM (Brilliant Gem Diamond SVG Icon)
  if (norm === 'PREMIUM') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="M6 3h12l4 6-10 12L2 9z" />
        <path d="M11 3L8 9l4 12 4-12-3-6" />
        <path d="M2 9h20" />
      </svg>
    );
  }

  // 10. FAST (Lightning Bolt Speed SVG Icon)
  if (norm === 'FAST' || norm === 'SPEED' || norm === 'TURBO') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }

  // 11. AD-FREE (Shield Shielded Clean SVG Icon)
  if (norm === 'AD-FREE' || norm === 'ADFREE' || norm === 'NO-ADS') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
    );
  }

  // 12. LIVE (Live Broadcast Antenna Wave SVG Icon)
  if (norm === 'LIVE' || norm === 'STREAM' || norm === 'ON-AIR') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="M4.93 19.07A10 10 0 0 1 2 12a10 10 0 0 1 2.93-7.07" />
        <path d="M19.07 4.93A10 10 0 0 1 22 12a10 10 0 0 1-2.93 7.07" />
        <path d="M7.76 16.24A6 6 0 0 1 6 12a6 6 0 0 1 1.76-4.24" />
        <path d="M16.24 7.76A6 6 0 0 1 18 12a6 6 0 0 1-1.76 4.24" />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    );
  }

  // 13. PRO / ULTRA (Pro Star Shield SVG Icon)
  if (norm === 'PRO' || norm === 'ULTRA') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }

  // 14. AI (Neural Network AI Chip SVG Icon)
  if (norm === 'AI' || norm === 'BOT' || norm === 'SMART') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
      </svg>
    );
  }

  // 15. NEW (Glowing Sparkle SVG Icon)
  if (norm === 'NEW' || norm === 'RECENT') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    );
  }

  // 16. APP (Mobile / Tablet App SVG Icon)
  if (norm === 'APP' || norm === 'APK') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    );
  }

  // 17. SAFE / DEBRID (Shield Lock SVG Icon)
  if (norm === 'SAFE' || norm === 'DEBRID' || norm === 'PRIVATE') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );
  }

  // 18. EXCLUSIVE / AWARD (Ribbon Medal SVG Icon)
  if (norm === 'EXCLUSIVE' || norm === 'SPECIAL') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    );
  }

  // 19. COMMUNITY / DIRECT (Users SVG Icon)
  if (norm === 'COMMUNITY' || norm === 'SOCIAL') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  // 20. DUBBED / SUBBED (Audio/Captions SVG Icon)
  if (norm === 'DUBBED' || norm === 'SUBBED') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M10 9H8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2" />
        <path d="M18 9h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2" />
      </svg>
    );
  }

  // 21. MANGA / SCANS (Book Open SVG Icon)
  if (norm === 'MANGA' || norm === 'SCANS') {
    return (
      <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={color ? { color } : undefined}
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    );
  }

  // 22. CUSTOM / DEFAULT (Sparkles fallback SVG Icon)
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={color ? { color } : undefined}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
};

export function getBadgeSvg(badge?: string, className = 'w-2.5 h-2.5'): React.ReactNode {
  if (!badge) return null;
  return <BadgeSvgIcon name={badge} className={className} />;
}
