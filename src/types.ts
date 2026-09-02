export type BadgeType = 
  | 'TRUSTED' 
  | 'Verified'
  | 'Premium'
  | 'Official'
  | 'OFFICIAL'
  | 'HD' 
  | '4K' 
  | '4K UHD' 
  | '4K HDR'
  | 'DOLBY'
  | 'Global'
  | 'Beta'
  | 'BETA'
  | 'Trending'
  | 'HOT' 
  | 'FAST' 
  | 'AD-FREE' 
  | 'DUBBED' 
  | 'SUBBED' 
  | 'MANGA' 
  | 'SCANS' 
  | 'LIVE' 
  | 'APP' 
  | 'FREE' 
  | 'MOD' 
  | 'VIP' 
  | 'PRO' 
  | 'ULTRA'
  | 'AI'
  | 'DEBRID'
  | 'SAFE'
  | 'EXCLUSIVE'
  | 'COMMUNITY'
  | 'DIRECT'
  | 'CUSTOM' 
  | 'PRIVATE'
  | 'NEW'
  | (string & {});

export interface BadgeColorConfig {
  badge: string;
  bg: string;
  text: string;
  border: string;
  iconColor?: string;
  glow?: string;
}

export interface AutoAddedLinkRecord {
  id: string;
  title: string;
  url: string;
  domain: string;
  category: string;
  categoryName?: string;
  regions: string[];
  badge?: string;
  description?: string;
  addedAt: string;
  timestamp: number;
}

export interface AutoSyncHistoryEntry {
  id: string;
  timestamp: number;
  count: number;
  regions: string[];
  categories: string[];
  links: AutoAddedLinkRecord[];
}

export type ReactionType = 'heart' | 'zap' | 'like';

export type IconShapeType = 'rounded' | 'circle' | 'squircle' | 'hexagon' | 'pill' | 'cyber';
export type BadgeVariantType = 'solid' | 'glow' | 'glass' | 'outline' | 'gradient' | 'dualtone' | 'metallic' | 'neon';
export type FontVariantType = 'sans' | 'mono' | 'serif' | 'cyber' | 'display';

export interface LinkReactions {
  heart: number;
  zap: number;
  like: number;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  domain: string;
  category: string;
  description?: string;
  badge?: BadgeType;
  badges?: string[];
  logoType?: 'icon' | 'text' | 'image' | 'styled' | 'custom' | 'badge';
  logoText?: string;
  logoColor?: string;
  logoBg?: string;
  iconName?: string;
  iconShape?: IconShapeType;
  badgeVariant?: BadgeVariantType;
  fontVariant?: FontVariantType;
  gradientStyle?: string;
  imageUrl?: string;
  logoUrl?: string;
  regions?: string[];
  isFavorite?: boolean;
  clicks?: number;
  lastVisited?: number;
  isCustom?: boolean;
  telegramGroup?: boolean;
  tags?: string[];
  addedAt?: string;
  status?: 'active' | 'checking' | 'slow';
  reactions?: LinkReactions;
}

export interface CategoryGroup {
  id: string;
  name: string;
  description: string;
  icon: string;
  color?: string;
  badge?: string;
  isCustom?: boolean;
}

export type ViewMode = 'grid' | 'compact' | 'telegram';

export type ThemeMode = 'dark' | 'midnight' | 'cyberpunk' | 'light';

export interface FilterState {
  searchQuery: string;
  selectedCategory: string; // 'all' or category id
  selectedRegion: string; // 'all', 'India', 'Global', etc.
  selectedBadge: string; // 'all', 'TRUSTED', 'NEW', etc.
  sortBy: 'default' | 'name-asc' | 'name-desc' | 'popular' | 'recent' | 'favorites';
  onlyFavorites: boolean;
  viewMode: ViewMode;
}
