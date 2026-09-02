import React from 'react';
import { BadgeType, LinkItem, BadgeColorConfig } from '../types';
import { BadgeSvgIcon, getBadgeSvg } from './badgeIcons';

export { BadgeSvgIcon, getBadgeSvg };

const STORAGE_KEY_BADGE_COLORS = 'linkbox_custom_badge_colors_v2';

/**
 * Master catalog of default color coding for each badge type.
 * Provides high-contrast, visually pleasing colors with SVG icon pairing.
 */
export const DEFAULT_BADGE_COLORS: Record<string, BadgeColorConfig> = {
  '18+': {
    badge: '18+',
    bg: '#450a0a',
    text: '#fca5a5',
    border: '#dc2626',
    iconColor: '#ef4444',
    glow: 'rgba(220, 38, 38, 0.45)',
  },
  'HENTAI': {
    badge: 'HENTAI',
    bg: '#4a044e',
    text: '#f472b6',
    border: '#db2777',
    iconColor: '#ec4899',
    glow: 'rgba(219, 39, 119, 0.4)',
  },
  'Hentai': {
    badge: 'Hentai',
    bg: '#4a044e',
    text: '#f472b6',
    border: '#db2777',
    iconColor: '#ec4899',
    glow: 'rgba(219, 39, 119, 0.4)',
  },
  'Anime': {
    badge: 'Anime',
    bg: '#3b0764',
    text: '#e9d5ff',
    border: '#a855f7',
    iconColor: '#c084fc',
    glow: 'rgba(168, 85, 247, 0.4)',
  },
  'ANIME': {
    badge: 'ANIME',
    bg: '#3b0764',
    text: '#e9d5ff',
    border: '#a855f7',
    iconColor: '#c084fc',
    glow: 'rgba(168, 85, 247, 0.4)',
  },
  'Movie': {
    badge: 'Movie',
    bg: '#172554',
    text: '#93c5fd',
    border: '#2563eb',
    iconColor: '#60a5fa',
    glow: 'rgba(37, 99, 235, 0.4)',
  },
  'MOVIE': {
    badge: 'MOVIE',
    bg: '#172554',
    text: '#93c5fd',
    border: '#2563eb',
    iconColor: '#60a5fa',
    glow: 'rgba(37, 99, 235, 0.4)',
  },
  'Official': {
    badge: 'Official',
    bg: '#3b0764',
    text: '#d8b4fe',
    border: '#a855f7',
    iconColor: '#c084fc',
    glow: 'rgba(168, 85, 247, 0.4)',
  },
  'OFFICIAL': {
    badge: 'OFFICIAL',
    bg: '#3b0764',
    text: '#d8b4fe',
    border: '#a855f7',
    iconColor: '#c084fc',
    glow: 'rgba(168, 85, 247, 0.4)',
  },
  'Free': {
    badge: 'Free',
    bg: '#064e3b',
    text: '#6ee7b7',
    border: '#10b981',
    iconColor: '#34d399',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  'FREE': {
    badge: 'FREE',
    bg: '#064e3b',
    text: '#6ee7b7',
    border: '#10b981',
    iconColor: '#34d399',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  'App': {
    badge: 'App',
    bg: '#042f2e',
    text: '#5eead4',
    border: '#14b8a6',
    iconColor: '#2dd4bf',
    glow: 'rgba(20, 184, 166, 0.35)',
  },
  'APP': {
    badge: 'APP',
    bg: '#042f2e',
    text: '#5eead4',
    border: '#14b8a6',
    iconColor: '#2dd4bf',
    glow: 'rgba(20, 184, 166, 0.35)',
  },
  '4K': {
    badge: '4K',
    bg: '#451a03',
    text: '#fde047',
    border: '#eab308',
    iconColor: '#facc15',
    glow: 'rgba(234, 179, 8, 0.4)',
  },
  '4K UHD': {
    badge: '4K UHD',
    bg: '#451a03',
    text: '#fde047',
    border: '#ca8a04',
    iconColor: '#facc15',
    glow: 'rgba(202, 138, 4, 0.4)',
  },
  '4K HDR': {
    badge: '4K HDR',
    bg: '#3f1702',
    text: '#fef08a',
    border: '#f59e0b',
    iconColor: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.4)',
  },
  'HD': {
    badge: 'HD',
    bg: '#18181b',
    text: '#e4e4e7',
    border: '#3f3f46',
    iconColor: '#a1a1aa',
    glow: 'rgba(161, 161, 170, 0.25)',
  },
  'Deshi': {
    badge: 'Deshi',
    bg: '#451a03',
    text: '#fdba74',
    border: '#f97316',
    iconColor: '#ea580c',
    glow: 'rgba(249, 115, 22, 0.4)',
  },
  'DESHI': {
    badge: 'DESHI',
    bg: '#451a03',
    text: '#fdba74',
    border: '#f97316',
    iconColor: '#ea580c',
    glow: 'rgba(249, 115, 22, 0.4)',
  },
  'Manga': {
    badge: 'Manga',
    bg: '#451a03',
    text: '#fed7aa',
    border: '#ea580c',
    iconColor: '#f97316',
    glow: 'rgba(234, 88, 12, 0.4)',
  },
  'MANGA': {
    badge: 'MANGA',
    bg: '#451a03',
    text: '#fed7aa',
    border: '#ea580c',
    iconColor: '#f97316',
    glow: 'rgba(234, 88, 12, 0.4)',
  },
  'Paid': {
    badge: 'Paid',
    bg: '#422006',
    text: '#fef08a',
    border: '#eab308',
    iconColor: '#facc15',
    glow: 'rgba(234, 179, 8, 0.45)',
  },
  'PAID': {
    badge: 'PAID',
    bg: '#422006',
    text: '#fef08a',
    border: '#eab308',
    iconColor: '#facc15',
    glow: 'rgba(234, 179, 8, 0.45)',
  },
  'Telegram': {
    badge: 'Telegram',
    bg: '#082f49',
    text: '#7dd3fc',
    border: '#0284c7',
    iconColor: '#38bdf8',
    glow: 'rgba(2, 132, 199, 0.4)',
  },
  'TELEGRAM': {
    badge: 'TELEGRAM',
    bg: '#082f49',
    text: '#7dd3fc',
    border: '#0284c7',
    iconColor: '#38bdf8',
    glow: 'rgba(2, 132, 199, 0.4)',
  },
  'Live Sports': {
    badge: 'Live Sports',
    bg: '#450a0a',
    text: '#fca5a5',
    border: '#dc2626',
    iconColor: '#ef4444',
    glow: 'rgba(220, 38, 38, 0.45)',
  },
  'LIVE SPORTS': {
    badge: 'LIVE SPORTS',
    bg: '#450a0a',
    text: '#fca5a5',
    border: '#dc2626',
    iconColor: '#ef4444',
    glow: 'rgba(220, 38, 38, 0.45)',
  },
  'AI Tech': {
    badge: 'AI Tech',
    bg: '#042f2e',
    text: '#6ee7b7',
    border: '#059669',
    iconColor: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  'AI TECH': {
    badge: 'AI TECH',
    bg: '#042f2e',
    text: '#6ee7b7',
    border: '#059669',
    iconColor: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  'Custom': {
    badge: 'Custom',
    bg: '#3b0764',
    text: '#e9d5ff',
    border: '#9333ea',
    iconColor: '#c084fc',
    glow: 'rgba(147, 51, 234, 0.45)',
  },
  'CUSTOM': {
    badge: 'CUSTOM',
    bg: '#3b0764',
    text: '#e9d5ff',
    border: '#9333ea',
    iconColor: '#c084fc',
    glow: 'rgba(147, 51, 234, 0.45)',
  },
  'Dubbed': {
    badge: 'Dubbed',
    bg: '#1e1b4b',
    text: '#c7d2fe',
    border: '#4f46e5',
    iconColor: '#818cf8',
    glow: 'rgba(79, 70, 229, 0.35)',
  },
  'Subbed': {
    badge: 'Subbed',
    bg: '#0c4a6e',
    text: '#bae6fd',
    border: '#0284c7',
    iconColor: '#38bdf8',
    glow: 'rgba(2, 132, 199, 0.35)',
  },
  'Live': {
    badge: 'Live',
    bg: '#450a0a',
    text: '#fca5a5',
    border: '#ef4444',
    iconColor: '#f87171',
    glow: 'rgba(239, 68, 68, 0.45)',
  },
  'LIVE': {
    badge: 'LIVE',
    bg: '#450a0a',
    text: '#fca5a5',
    border: '#ef4444',
    iconColor: '#f87171',
    glow: 'rgba(239, 68, 68, 0.45)',
  },
  'Global': {
    badge: 'Global',
    bg: '#082f49',
    text: '#38bdf8',
    border: '#0284c7',
    iconColor: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.35)',
  },
  'Beta': {
    badge: 'Beta',
    bg: '#431407',
    text: '#fb923c',
    border: '#ea580c',
    iconColor: '#f97316',
    glow: 'rgba(234, 88, 12, 0.35)',
  },
  'BETA': {
    badge: 'BETA',
    bg: '#431407',
    text: '#fb923c',
    border: '#ea580c',
    iconColor: '#f97316',
    glow: 'rgba(234, 88, 12, 0.35)',
  },
  'Trending': {
    badge: 'Trending',
    bg: '#4c0519',
    text: '#fb7185',
    border: '#e11d48',
    iconColor: '#f43f5e',
    glow: 'rgba(225, 29, 72, 0.4)',
  },
  'HOT': {
    badge: 'HOT',
    bg: '#4c0519',
    text: '#fda4af',
    border: '#f43f5e',
    iconColor: '#fb7185',
    glow: 'rgba(244, 63, 94, 0.4)',
  },
  'Verified': {
    badge: 'Verified',
    bg: '#172554',
    text: '#93c5fd',
    border: '#3b82f6',
    iconColor: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.35)',
  },
  'TRUSTED': {
    badge: 'TRUSTED',
    bg: '#172554',
    text: '#93c5fd',
    border: '#3b82f6',
    iconColor: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.35)',
  },
  'Premium': {
    badge: 'Premium',
    bg: '#451a03',
    text: '#fde68a',
    border: '#d97706',
    iconColor: '#fbbf24',
    glow: 'rgba(217, 119, 6, 0.4)',
  },
  'VIP': {
    badge: 'VIP',
    bg: '#422006',
    text: '#fef08a',
    border: '#eab308',
    iconColor: '#fde047',
    glow: 'rgba(234, 179, 8, 0.45)',
  },
  'PRO': {
    badge: 'PRO',
    bg: '#1e1b4b',
    text: '#bfdbfe',
    border: '#3b82f6',
    iconColor: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.35)',
  },
  'ULTRA': {
    badge: 'ULTRA',
    bg: '#2e1065',
    text: '#e9d5ff',
    border: '#9333ea',
    iconColor: '#c084fc',
    glow: 'rgba(147, 51, 234, 0.4)',
  },
  'AI': {
    badge: 'AI',
    bg: '#1e1b4b',
    text: '#c7d2fe',
    border: '#6366f1',
    iconColor: '#818cf8',
    glow: 'rgba(99, 102, 241, 0.4)',
  },
  'AD-FREE': {
    badge: 'AD-FREE',
    bg: '#022c22',
    text: '#6ee7b7',
    border: '#10b981',
    iconColor: '#34d399',
    glow: 'rgba(16, 185, 129, 0.35)',
  },
  'MOD': {
    badge: 'MOD',
    bg: '#4c0519',
    text: '#fecdd3',
    border: '#e11d48',
    iconColor: '#fb7185',
    glow: 'rgba(225, 29, 72, 0.35)',
  },
  'SAFE': {
    badge: 'SAFE',
    bg: '#064e3b',
    text: '#6ee7b7',
    border: '#10b981',
    iconColor: '#34d399',
    glow: 'rgba(16, 185, 129, 0.35)',
  },
  'EXCLUSIVE': {
    badge: 'EXCLUSIVE',
    bg: '#4c0519',
    text: '#fecdd3',
    border: '#be123c',
    iconColor: '#fb7185',
    glow: 'rgba(190, 18, 60, 0.4)',
  },
  'COMMUNITY': {
    badge: 'COMMUNITY',
    bg: '#083344',
    text: '#a5f3fc',
    border: '#0891b2',
    iconColor: '#38bdf8',
    glow: 'rgba(8, 145, 178, 0.35)',
  },
  'DIRECT': {
    badge: 'DIRECT',
    bg: '#082f49',
    text: '#bae6fd',
    border: '#0284c7',
    iconColor: '#38bdf8',
    glow: 'rgba(2, 132, 199, 0.35)',
  },
  'DUBBED': {
    badge: 'DUBBED',
    bg: '#1e1b4b',
    text: '#c7d2fe',
    border: '#4f46e5',
    iconColor: '#818cf8',
    glow: 'rgba(79, 70, 229, 0.35)',
  },
  'SUBBED': {
    badge: 'SUBBED',
    bg: '#0c4a6e',
    text: '#bae6fd',
    border: '#0284c7',
    iconColor: '#38bdf8',
    glow: 'rgba(2, 132, 199, 0.35)',
  },
  'SCANS': {
    badge: 'SCANS',
    bg: '#4a044e',
    text: '#f0abfc',
    border: '#c026d3',
    iconColor: '#e879f9',
    glow: 'rgba(192, 38, 211, 0.35)',
  },
  'NEW': {
    badge: 'NEW',
    bg: '#064e3b',
    text: '#6ee7b7',
    border: '#10b981',
    iconColor: '#34d399',
    glow: 'rgba(16, 185, 129, 0.45)',
  },
  'PRIVATE': {
    badge: 'PRIVATE',
    bg: '#18181b',
    text: '#d4d4d8',
    border: '#52525b',
    iconColor: '#a1a1aa',
    glow: 'rgba(113, 113, 122, 0.25)',
  },
};

/**
 * Retrieves custom badge color palette stored by the user.
 */
export function getCustomBadgeColors(): Record<string, BadgeColorConfig> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_BADGE_COLORS);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_BADGE_COLORS, ...parsed };
    }
  } catch {
    // Fallback to default
  }
  return DEFAULT_BADGE_COLORS;
}

/**
 * Saves a customized color coding for a specific badge type.
 */
export function saveCustomBadgeColor(badge: string, config: Partial<BadgeColorConfig>): void {
  try {
    const current = getCustomBadgeColors();
    const existing = current[badge] || DEFAULT_BADGE_COLORS[badge] || {
      badge,
      bg: '#18181b',
      text: '#e4e4e7',
      border: '#3f3f46',
      iconColor: '#a1a1aa',
      glow: 'rgba(161, 161, 170, 0.25)',
    };

    const updated: Record<string, BadgeColorConfig> = {
      ...current,
      [badge]: {
        ...existing,
        ...config,
        badge,
      },
    };

    localStorage.setItem(STORAGE_KEY_BADGE_COLORS, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

/**
 * Resets all badge colors to defaults.
 */
export function resetBadgeColors(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_BADGE_COLORS);
  } catch {
    // ignore
  }
}

/**
 * Returns the resolved styling config (bg, text, border, glow, iconColor) for any badge.
 */
export function getBadgeColorConfig(badge?: string): BadgeColorConfig {
  if (!badge) {
    return {
      badge: '',
      bg: '#18181b',
      text: '#a1a1aa',
      border: '#27272a',
      iconColor: '#71717a',
    };
  }

  const customMap = getCustomBadgeColors();
  const normalized = badge.trim();
  const direct = customMap[normalized] || customMap[normalized.toUpperCase()];
  if (direct) return direct;

  const defaultDirect = DEFAULT_BADGE_COLORS[normalized] || DEFAULT_BADGE_COLORS[normalized.toUpperCase()];
  if (defaultDirect) return defaultDirect;

  // Generic fallback
  return {
    badge: normalized,
    bg: '#18181b',
    text: '#d4d4d8',
    border: '#3f3f46',
    iconColor: '#a1a1aa',
    glow: 'rgba(161, 161, 170, 0.2)',
  };
}

/**
 * Preset Color Palettes for quick one-click badge theming
 */
export const BADGE_THEME_PRESETS: { name: string; bg: string; text: string; border: string; glow: string }[] = [
  { name: 'Neon Cyber Blue', bg: '#082f49', text: '#38bdf8', border: '#0284c7', glow: 'rgba(56, 189, 248, 0.4)' },
  { name: 'Royal Gold Luxury', bg: '#451a03', text: '#fde047', border: '#eab308', glow: 'rgba(234, 179, 8, 0.4)' },
  { name: 'Emerald Matrix', bg: '#022c22', text: '#6ee7b7', border: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  { name: 'Crimson Flame', bg: '#4c0519', text: '#fda4af', border: '#e11d48', glow: 'rgba(225, 29, 72, 0.4)' },
  { name: 'Ultraviolet Purple', bg: '#3b0764', text: '#d8b4fe', border: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
  { name: 'Electric Orange', bg: '#431407', text: '#fdba74', border: '#ea580c', glow: 'rgba(234, 88, 12, 0.4)' },
  { name: 'Frost Platinum', bg: '#18181b', text: '#f4f4f5', border: '#71717a', glow: 'rgba(244, 244, 245, 0.25)' },
];

/**
 * Automatically assigns dynamic badges (e.g. 'Verified', 'HD', '4K', 'Global', 'Beta', 'Trending', 'HOT', 'FAST', 'AD-FREE')
 * based on deep metadata analysis, completely replacing 'none' or missing badge states.
 */
export function determineDynamicBadge(link: Partial<LinkItem>): BadgeType {
  const category = (link.category || '').toLowerCase();
  const title = (link.title || '').toLowerCase();
  const domain = (link.domain || link.url || '').toLowerCase();
  const desc = (link.description || '').toLowerCase();
  const tags = (link.tags || []).map((t) => t.toLowerCase().replace(/^#/, ''));
  const currentBadge = link.badge ? link.badge.toString().trim() : '';
  const currentBadgeUpper = currentBadge.toUpperCase();

  // 1. Custom user link
  if (link.isCustom) {
    return 'Custom';
  }

  // 2. 18+ & Mature & Hentai Platforms
  const is18PlusCategory = category === '18+' || category === 'adult' || category === '18plus' || tags.includes('18+') || tags.includes('adult') || tags.includes('mature');
  const isHentaiContent = tags.includes('hentai') || domain.includes('hentai') || domain.includes('hanime') || domain.includes('nhentai') || title.includes('hentai');
  
  if (isHentaiContent) {
    return 'Hentai';
  }
  if (is18PlusCategory) {
    return '18+';
  }

  // 3. Telegram channels / groups
  if (link.telegramGroup || category === 'telegram' || domain.includes('t.me') || domain.includes('telegram')) {
    return 'Telegram';
  }

  // 4. Paid & Official Premium Platforms
  const officialDomains = [
    'netflix.com', 'disneyplus.com', 'primevideo.com', 'amazon.com',
    'auth.hulu.com', 'hulu.com', 'max.com', 'hbomax.com', 'tv.apple.com', 'apple.com',
    'paramountplus.com', 'peacocktv.com', 'shudder.com', 'mgmplus.com',
    'amcplus.com', 'crunchyroll.com', 'viki.com', 'sonyliv.com',
    'hotstar.com', 'aha.video', 'zee5.com', 'jiocinema.com', 'spotify.com'
  ];
  const isOfficial = currentBadgeUpper === 'OFFICIAL' || category === 'paid' ||
    tags.includes('official') || tags.includes('premium') || officialDomains.some((pd) => domain.includes(pd));

  if (isOfficial) {
    return 'Official';
  }

  // 5. Manga & Comics
  if (category === 'manga' || category === 'comics' || category === 'books' || tags.includes('manga') || tags.includes('manhwa') || domain.includes('manga') || title.includes('manga')) {
    return 'Manga';
  }

  // 6. Live Sports & Live TV
  if (category === 'sports' || category === 'livetv' || tags.includes('sports') || tags.includes('live tv') || tags.includes('cricket') || tags.includes('football')) {
    return 'Live Sports';
  }

  // 7. AI Tech & Tools
  if (category === 'tech' || tags.includes('ai') || tags.includes('tech') || domain.includes('openai') || domain.includes('anthropic') || domain.includes('gemini')) {
    return 'AI Tech';
  }

  // 8. Dedicated Mobile / Web Apps
  if (category === 'apps' || tags.includes('apk') || tags.includes('android') || tags.includes('ios') || domain.includes('apk') || title.includes(' apk') || title.includes(' app')) {
    return 'App';
  }

  // 9. Anime platforms
  if (category === 'anime' || tags.includes('anime') || tags.includes('otaku') || domain.includes('anime')) {
    return 'Anime';
  }

  // 10. 4K UHD Cinema Hubs
  const is4K = title.includes('4k') || desc.includes('4k') || tags.includes('4k') || tags.includes('4k uhd') ||
    domain.includes('vegamovies') || domain.includes('bollyflix');
  if (is4K) {
    return '4K';
  }

  // 11. Movie & Cinema Hubs
  if (category === 'movies' || category === 'cinema' || tags.includes('movies') || tags.includes('movie') || domain.includes('movie') || domain.includes('flix')) {
    return 'Movie';
  }

  // 12. Fallback based on category
  switch (category) {
    case 'movies':
      return 'Movie';
    case 'anime':
      return 'Anime';
    case 'manga':
    case 'books':
      return 'Manga';
    case 'sports':
    case 'livetv':
      return 'Live Sports';
    case 'apps':
      return 'App';
    case 'tech':
      return 'AI Tech';
    case 'telegram':
      return 'Telegram';
    case 'paid':
      return 'Paid';
    case '18+':
    case 'adult':
    case '18plus':
      return '18+';
    default:
      return 'Free';
  }
}

// Master list of allowed and clean badges in strict tiered order
export const CLEAN_BADGES_LIST: string[] = [
  'Official',
  'Custom',
  'Paid',
  'Free',
  'App',
  'Movie',
  'Anime',
  'Manga',
  'Live Sports',
  'Telegram',
  'AI Tech',
  '18+',
  'Hentai',
  '4K',
  'HD',
  'Deshi',
  'Dubbed',
  'Subbed',
];

/**
 * Computes all applicable multi-badges for a link based on the strict tiered system:
 * 
 * Tier 1 - Platform / Origin:
 * - Official streaming apps or links -> 'Official' badge
 * - Custom user added links -> 'Custom' badge (with full category auto-generated badges!)
 * - Telegram groups / channels -> 'Telegram' badge
 * 
 * Tier 2 - Access & Pricing:
 * - Paid / Premium -> 'Paid' badge
 * - Free material -> 'Free' badge
 * 
 * Tier 3 - Content Category:
 * - Dedicated Apps (APKs, Android, iOS) -> 'App' badge
 * - Movies & Cinema platforms -> 'Movie' badge
 * - Anime platforms -> 'Anime' badge
 * - Manga / Comics -> 'Manga' badge
 * - Live Sports & Live TV -> 'Live Sports' badge
 * - AI & Tech tools -> 'AI Tech' badge
 * - 18+ category / content -> '18+' badge
 * - Hentai material -> '18+' AND 'Hentai' badges
 * - Deshi / Dubbed / Subbed tags
 * 
 * Tier 4 - Resolution & Quality:
 * - 4K content -> '4K' badge
 * - HD content -> 'HD' badge
 * 
 * Filters out all unwanted legacy badges (Fast, Trusted, New, Hot, 1080HD, Dolby, etc.)
 */
export function getLinkBadges(link: Partial<LinkItem>): string[] {
  const result: string[] = [];
  const category = (link.category || '').toLowerCase();
  const title = (link.title || '').toLowerCase();
  const domain = (link.domain || link.url || '').toLowerCase();
  const desc = (link.description || '').toLowerCase();
  const tags = (link.tags || []).map((t) => t.toLowerCase().replace(/^#/, ''));
  const rawBadge = link.badge ? link.badge.toString().trim() : '';
  const rawBadgeUpper = rawBadge.toUpperCase();

  // If link has existing multiple badges, incorporate valid ones
  if (Array.isArray(link.badges) && link.badges.length > 0) {
    link.badges.forEach((b) => {
      if (b && !result.includes(b)) {
        result.push(b);
      }
    });
  }

  // 1. Custom badge: Auto for all custom links
  if (link.isCustom) {
    if (!result.some((b) => b.toUpperCase() === 'CUSTOM')) {
      result.push('Custom');
    }
  }

  // 2. Official vs Free vs Paid identification
  const officialDomains = [
    'netflix.com', 'disneyplus.com', 'primevideo.com', 'amazon.com',
    'auth.hulu.com', 'hulu.com', 'max.com', 'hbomax.com', 'tv.apple.com', 'apple.com',
    'paramountplus.com', 'peacocktv.com', 'shudder.com', 'mgmplus.com',
    'amcplus.com', 'crunchyroll.com', 'viki.com', 'sonyliv.com',
    'hotstar.com', 'aha.video', 'zee5.com', 'jiocinema.com', 'ullu.app', 'altt.co.in',
    'spotify.com', 'arte.tv', 'tf1.fr', 'tv5monde.com', 'zdf.de', 'bbc.co.uk'
  ];
  const isOfficial = rawBadgeUpper === 'OFFICIAL' || rawBadgeUpper === 'PREMIUM' || category === 'paid' ||
    tags.includes('official') || tags.includes('premium') || officialDomains.some((d) => domain.includes(d));

  const isPaid = category === 'paid' || rawBadgeUpper === 'PAID' || rawBadgeUpper === 'PREMIUM' ||
    rawBadgeUpper === 'VIP' || rawBadgeUpper === 'PRO' || (isOfficial && !domain.includes('arte.tv') && !domain.includes('zdf.de'));

  if (isOfficial) {
    if (!result.some((b) => b.toUpperCase() === 'OFFICIAL')) {
      result.push('Official');
    }
  }

  if (isPaid) {
    if (!result.some((b) => b.toUpperCase() === 'PAID')) {
      result.push('Paid');
    }
  } else {
    // If not paid, all free material gets the Free badge
    const isFree = rawBadgeUpper === 'FREE' || tags.includes('free') || tags.includes('freeware') ||
      category === 'free' || (!isPaid && category !== 'paid');
    if (isFree && !result.some((b) => b.toUpperCase() === 'FREE')) {
      result.push('Free');
    }
  }

  // 3. 18+ & Hentai identification
  const is18Plus = category === '18+' || category === 'adult' || category === '18plus' ||
    rawBadgeUpper === '18+' || rawBadgeUpper === 'HENTAI' || tags.includes('18+') || tags.includes('adult') ||
    tags.includes('mature') || tags.includes('deshi') || tags.includes('hentai') || tags.includes('nsfw') ||
    domain.includes('ullu') || domain.includes('altt') || domain.includes('hentai') || domain.includes('hanime');

  const isHentai = rawBadgeUpper === 'HENTAI' || tags.includes('hentai') || tags.includes('anime 18+') ||
    domain.includes('hentai') || domain.includes('hanime') || domain.includes('nhentai') || title.includes('hentai');

  if (is18Plus || isHentai) {
    if (!result.includes('18+')) result.push('18+');
    if (isHentai && !result.some((b) => b.toUpperCase() === 'HENTAI')) {
      result.push('Hentai');
    }
  }

  // 4. Manga & Comics identification
  const isManga = category === 'books' || category === 'manga' || category === 'comics' ||
    tags.includes('manga') || tags.includes('manhwa') || tags.includes('manhua') || tags.includes('comic') || tags.includes('comics') ||
    domain.includes('manga') || domain.includes('manhwa') || rawBadgeUpper === 'MANGA' || title.includes('manga');
  if (isManga && !result.some((b) => b.toUpperCase() === 'MANGA')) {
    result.push('Manga');
  }

  // 5. Anime platforms & material
  const isAnime = category === 'anime' || tags.includes('anime') || tags.includes('otaku') ||
    tags.includes('anime 18+') || domain.includes('anime') || rawBadgeUpper === 'ANIME' || isHentai;
  if (isAnime && !result.some((b) => b.toUpperCase() === 'ANIME')) {
    result.push('Anime');
  }

  // 6. Movie & Cinema platforms
  const isMovie = category === 'movies' || category === 'cinema' || tags.includes('movies') ||
    tags.includes('movie') || tags.includes('cinema') || tags.includes('bollywood') || tags.includes('hollywood') ||
    domain.includes('movie') || domain.includes('flix') || domain.includes('cinema') || rawBadgeUpper === 'MOVIE' ||
    title.includes('movies') || title.includes('cinema') || (isOfficial && !category.includes('music') && !category.includes('tech'));
  if (isMovie && !result.some((b) => b.toUpperCase() === 'MOVIE')) {
    result.push('Movie');
  }

  // 7. Dedicated Apps (Android/iOS/APK)
  const isApp = category === 'apps' || tags.includes('app') || tags.includes('apk') || tags.includes('android') ||
    tags.includes('ios') || domain.includes('apk') || rawBadgeUpper === 'APP' || rawBadgeUpper === 'APK' ||
    title.includes(' apk') || title.includes(' app') || domain.includes('app') ||
    (isOfficial && (domain.includes('netflix') || domain.includes('jiocinema') || domain.includes('hotstar') || domain.includes('spotify')));
  if (isApp && !result.some((b) => b.toUpperCase() === 'APP')) {
    result.push('App');
  }

  // 8. Live Sports & Live TV
  const isLiveSports = category === 'sports' || category === 'livetv' || tags.includes('sports') ||
    tags.includes('live sports') || tags.includes('live tv') || tags.includes('cricket') || tags.includes('football') ||
    rawBadgeUpper === 'LIVE SPORTS' || rawBadgeUpper === 'SPORTS' || rawBadgeUpper === 'LIVE';
  if (isLiveSports && !result.some((b) => b.toUpperCase() === 'LIVE SPORTS' || b.toUpperCase() === 'LIVE')) {
    result.push('Live Sports');
  }

  // 9. Telegram groups / channels
  const isTelegram = link.telegramGroup || category === 'telegram' || domain.includes('t.me') ||
    rawBadgeUpper === 'TELEGRAM' || tags.includes('telegram');
  if (isTelegram && !result.some((b) => b.toUpperCase() === 'TELEGRAM')) {
    result.push('Telegram');
  }

  // 10. AI Tech & Tools
  const isAITech = category === 'tech' || tags.includes('ai') || tags.includes('tech') ||
    rawBadgeUpper === 'AI' || rawBadgeUpper === 'AI TECH' || domain.includes('openai') || domain.includes('anthropic') || domain.includes('gemini');
  if (isAITech && !result.some((b) => b.toUpperCase() === 'AI TECH' || b.toUpperCase() === 'AI')) {
    result.push('AI Tech');
  }

  // 11. 4K Ultra High Definition
  const is4K = rawBadgeUpper === '4K' || rawBadgeUpper === '4K UHD' || rawBadgeUpper === '4K HDR' ||
    tags.includes('4k') || tags.includes('4k uhd') || tags.includes('uhd') || title.includes('4k') || desc.includes('4k') ||
    domain.includes('vegamovies') || domain.includes('bollyflix');
  if (is4K && !result.some((b) => b.toUpperCase() === '4K')) {
    result.push('4K');
  }

  // 12. HD (High Definition / 1080p)
  const isHD = is4K || rawBadgeUpper === 'HD' || rawBadgeUpper === '1080P' || tags.includes('hd') || tags.includes('1080p') ||
    tags.includes('fhd') || title.includes('hd') || title.includes('1080p') || desc.includes('1080p') ||
    category === 'movies' || category === 'anime' || isPaid;
  if (isHD && !result.some((b) => b.toUpperCase() === 'HD')) {
    result.push('HD');
  }

  // 13. Dubbed / Subbed / Deshi
  if ((tags.includes('dubbed') || rawBadgeUpper === 'DUBBED') && !result.some((b) => b.toUpperCase() === 'DUBBED')) {
    result.push('Dubbed');
  }
  if ((tags.includes('subbed') || rawBadgeUpper === 'SUBBED') && !result.some((b) => b.toUpperCase() === 'SUBBED')) {
    result.push('Subbed');
  }
  if ((tags.includes('deshi') || tags.includes('desi') || domain.includes('ullu') || domain.includes('altt') || rawBadgeUpper === 'DESHI') && !result.some((b) => b.toUpperCase() === 'DESHI')) {
    result.push('Deshi');
  }

  // Filter out unwanted legacy badges & tags requested to be removed (fast, trusted, new, hot, 1080hd, etc.)
  const unwantedUpper = [
    'FAST', 'TRUSTED', 'NEW', 'HOT', '1080HD', 'DOLBY', 'DEBRID', 'BETA',
    'COMMUNITY', 'DIRECT', 'EXCLUSIVE', 'SAFE', 'PRIVATE', 'ULTRA', 'SCANS', 'VERIFIED'
  ];
  const cleaned = result.filter((b) => !unwantedUpper.includes(b.toUpperCase()));

  // Order badges consistently according to CLEAN_BADGES_LIST hierarchy
  const ordered = Array.from(new Set(cleaned)).sort((a, b) => {
    const idxA = CLEAN_BADGES_LIST.findIndex((item) => item.toUpperCase() === a.toUpperCase());
    const idxB = CLEAN_BADGES_LIST.findIndex((item) => item.toUpperCase() === b.toUpperCase());
    const rankA = idxA >= 0 ? idxA : 999;
    const rankB = idxB >= 0 ? idxB : 999;
    return rankA - rankB;
  });

  return ordered.length > 0 ? ordered : ['Free', 'HD'];
}

export function enrichLinkWithBadge(link: LinkItem): LinkItem {
  const dynamicBadge = determineDynamicBadge(link);
  const multiBadges = getLinkBadges({ ...link, badge: dynamicBadge });
  return {
    ...link,
    badge: dynamicBadge,
    badges: multiBadges,
  };
}

/**
 * Returns Tailwind classes for rendering badges with high contrast & visual hierarchy.
 */
export function getBadgeClasses(badge?: string): string {
  const config = getBadgeColorConfig(badge);
  // Return standard base classes; custom CSS properties handle background, text, border, glow
  return 'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wider border transition-all duration-150 shadow-xs';
}

/**
 * Returns CSS Style properties for custom color coding of any badge.
 */
export function getBadgeCustomStyle(badge?: string): React.CSSProperties {
  const config = getBadgeColorConfig(badge);
  return {
    backgroundColor: config.bg,
    color: config.text,
    borderColor: config.border,
    boxShadow: config.glow ? `0 0 8px ${config.glow}` : undefined,
  };
}
