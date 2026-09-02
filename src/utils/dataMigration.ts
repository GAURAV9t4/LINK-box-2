import { BadgeType, LinkItem } from '../types';
import { determineDynamicBadge, getLinkBadges } from './badgeManager';
import { REGIONS_MASTER } from './regions';

/**
 * Standard country/region normalization map.
 * Maps variations, ISO codes, and native names to canonical region keys.
 */
export const STANDARDIZED_REGION_MAP: Record<string, string> = {
  // Global
  global: 'Global',
  all: 'Global',
  worldwide: 'Global',
  international: 'Global',

  // India & Deshi
  india: 'India',
  in: 'India',
  ind: 'India',
  bharat: 'India',
  deshi: 'India',
  desi: 'India',

  // America / USA & Western
  america: 'USA',
  usa: 'USA',
  'united states': 'USA',
  'united states of america': 'USA',
  us: 'USA',
  western: 'USA',
  west: 'USA',

  // Brazil
  brazil: 'Brazil',
  brasil: 'Brazil',
  br: 'Brazil',
  bra: 'Brazil',

  // Finland
  finland: 'Finland',
  suomi: 'Finland',
  fi: 'Finland',
  fin: 'Finland',

  // Germany
  germany: 'Germany',
  deutschland: 'Germany',
  de: 'Germany',
  ger: 'Germany',
  deu: 'Germany',

  // Italy
  italy: 'Italy',
  italia: 'Italy',
  it: 'Italy',
  ita: 'Italy',

  // Japan
  japan: 'Japan',
  nippon: 'Japan',
  nihon: 'Japan',
  jp: 'Japan',
  jpn: 'Japan',

  // Netherlands
  netherlands: 'Netherlands',
  nederland: 'Netherlands',
  holland: 'Netherlands',
  nl: 'Netherlands',
  nld: 'Netherlands',

  // Poland
  poland: 'Poland',
  polska: 'Poland',
  pl: 'Poland',
  pol: 'Poland',

  // Portugal
  portugal: 'Portugal',
  pt: 'Portugal',
  prt: 'Portugal',

  // Russia
  russia: 'Russia',
  россия: 'Russia',
  ru: 'Russia',
  rus: 'Russia',

  // South Korea
  'south korea': 'Korea',
  korea: 'Korea',
  'republic of korea': 'Korea',
  kr: 'Korea',
  kor: 'Korea',

  // Spain
  spain: 'Spain',
  españa: 'Spain',
  es: 'Spain',
  esp: 'Spain',

  // France
  france: 'France',
  fr: 'France',
  fra: 'France',

  // United Kingdom
  uk: 'UK',
  'united kingdom': 'UK',
  britain: 'UK',
  gb: 'UK',
  gbr: 'UK',
};

/**
 * Standardize any region name or country alias to canonical directory names.
 */
export function standardizeRegion(rawRegion: string): string {
  if (!rawRegion) return 'Global';
  const clean = rawRegion.trim().toLowerCase();
  if (STANDARDIZED_REGION_MAP[clean]) {
    return STANDARDIZED_REGION_MAP[clean];
  }
  // Check against REGIONS_MASTER
  const matched = REGIONS_MASTER.find(
    (r) => r.name.toLowerCase() === clean || r.code.toLowerCase() === clean || r.shortName.toLowerCase() === clean
  );
  if (matched) return matched.code === 'all' ? 'Global' : matched.code;
  return rawRegion.charAt(0).toUpperCase() + rawRegion.slice(1);
}

/**
 * High-resolution official brand logo mappings & CDN generators.
 */
export const OFFICIAL_BRAND_LOGOS: Record<string, string> = {
  // Paid / Official Global
  'netflix.com': 'https://assets.nflxext.com/ffe/siteui/common/icons/nficon2016.ico',
  'disneyplus.com': 'https://static-assets.bamgrid.com/product/disneyplus/favicons/favicon-32x32.png',
  'primevideo.com': 'https://m.media-amazon.com/images/G/01/digital/video/web/logo-min.png',
  'amazon.com': 'https://www.amazon.com/favicon.ico',
  'hulu.com': 'https://assetshuluimcom-a.akamaihd.net/h3o/icons/favicon.ico',
  'max.com': 'https://www.max.com/favicon.ico',
  'hbomax.com': 'https://www.hbomax.com/favicon.ico',
  'apple.com': 'https://www.apple.com/favicon.ico',
  'paramountplus.com': 'https://www.paramountplus.com/favicon.ico',
  'peacocktv.com': 'https://www.peacocktv.com/favicon.ico',
  'crunchyroll.com': 'https://www.crunchyroll.com/build/assets/img/favicons/favicon-32x32.png',
  'sonyliv.com': 'https://www.sonyliv.com/favicon.ico',
  'hotstar.com': 'https://www.hotstar.com/favicon.ico',
  'aha.video': 'https://www.aha.video/favicon.ico',
  'zee5.com': 'https://www.zee5.com/favicon.ico',
  'jiocinema.com': 'https://www.jiocinema.com/favicon.ico',
  'viki.com': 'https://www.viki.com/favicon.ico',

  // Broadcasters
  'arte.tv': 'https://www.arte.tv/favicon.ico',
  'tf1.fr': 'https://www.tf1.fr/favicon.ico',
  'tv5mondeplus.com': 'https://www.tv5mondeplus.com/favicon.ico',
  'sportschau.de': 'https://www.sportschau.de/favicon.ico',
  '3sat.de': 'https://www.3sat.de/favicon.ico',
  'zdf.de': 'https://www.zdf.de/favicon.ico',
  'viaplay.com': 'https://viaplay.com/favicon.ico',
  'u-next.jp': 'https://video.unext.jp/favicon.ico',

  // Tech, Books & Apps
  'github.com': 'https://github.githubassets.com/favicons/favicon.png',
  'gitlab.com': 'https://gitlab.com/favicon.ico',
  'wikipedia.org': 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
  'archive.org': 'https://archive.org/images/glogo.jpg',
  'reddit.com': 'https://www.redditstatic.com/shreddit/assets/favicon/192x192.png',
  'telegram.org': 'https://telegram.org/img/favicon.ico',
  't.me': 'https://telegram.org/img/favicon.ico',
  'libgen.is': 'https://libgen.is/favicon.ico',
  'openlibrary.org': 'https://openlibrary.org/static/images/openlibrary-192x192.png',
  'gutenberg.org': 'https://www.gutenberg.org/favicon.ico',
};

/**
 * Generates reliable CDN logo URL for any domain.
 * Uses high-res Google Favicon CDN (sz=128) as primary reliable provider,
 * which supports all web domains without rate limits or CORS issues.
 */
export function generateCdnLogoUrl(domain: string, title?: string): string {
  if (!domain) return '';
  const cleanDomain = domain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .trim();

  // Check hardcoded official list
  if (OFFICIAL_BRAND_LOGOS[cleanDomain]) {
    return OFFICIAL_BRAND_LOGOS[cleanDomain];
  }

  // Reliable Google High-Resolution Favicon CDN
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(cleanDomain)}&sz=128`;
}

/**
 * Standard uniform category tags generator
 */
export function getUniformCategoryTags(category: string, title: string, domain: string, existingTags: string[] = []): string[] {
  const c = (category || '').toLowerCase();
  const t = title.trim();
  const d = domain.toLowerCase();

  const tagSet = new Set<string>();

  // Add brand title tag
  if (t) tagSet.add(t);

  // Add standardized category tags
  switch (c) {
    case 'movies':
      tagSet.add('Movies');
      tagSet.add('Streaming');
      tagSet.add('Cinema');
      if (d.includes('vega') || d.includes('bolly') || d.includes('4k')) tagSet.add('4K UHD');
      else tagSet.add('HD 1080p');
      break;
    case 'anime':
      tagSet.add('Anime');
      tagSet.add('Streaming');
      tagSet.add('Subbed');
      tagSet.add('Dubbed');
      break;
    case 'manga':
      tagSet.add('Manga');
      tagSet.add('Scans');
      tagSet.add('Comics');
      tagSet.add('Reader');
      break;
    case 'livetv':
      tagSet.add('Live TV');
      tagSet.add('Broadcast');
      tagSet.add('IPTV');
      tagSet.add('Sports');
      break;
    case 'paid':
      tagSet.add('Official');
      tagSet.add('Premium');
      tagSet.add('VOD');
      tagSet.add('Subscription');
      break;
    case 'apps':
      tagSet.add('App');
      tagSet.add('Android');
      tagSet.add('APK');
      tagSet.add('Media Player');
      break;
    case 'tech':
      tagSet.add('Tech');
      tagSet.add('Developer');
      tagSet.add('Open Source');
      tagSet.add('Tools');
      break;
    case 'books':
      tagSet.add('Books');
      tagSet.add('Library');
      tagSet.add('E-Books');
      tagSet.add('PDF');
      break;
    case 'telegram':
      tagSet.add('Telegram');
      tagSet.add('Channel');
      tagSet.add('Community');
      tagSet.add('Updates');
      break;
    case '18+':
    case 'adult':
    case '18plus':
      tagSet.add('18+');
      tagSet.add('Mature');
      if (d.includes('desi') || d.includes('ullu') || d.includes('altt') || d.includes('kooku') || d.includes('prime') || t.toLowerCase().includes('desi') || t.toLowerCase().includes('deshi')) {
        tagSet.add('Deshi');
        tagSet.add('India');
      } else if (d.includes('hentai') || d.includes('hanime') || d.includes('nhentai') || t.toLowerCase().includes('hentai')) {
        tagSet.add('Hentai');
        tagSet.add('Anime 18+');
        tagSet.add('Japan');
      } else {
        tagSet.add('Western');
        tagSet.add('Global');
      }
      tagSet.add('Streaming');
      break;
    default:
      tagSet.add('Directory');
      tagSet.add('Weblink');
      break;
  }

  // Preserve existing meaningful custom tags
  for (const et of existingTags) {
    if (et && et.length > 1 && et.length < 30) {
      tagSet.add(et);
    }
  }

  return Array.from(tagSet).slice(0, 6);
}

/**
 * Normalizes URL structure (ensuring protocol, trimming whitespace, fixing telegram links)
 */
export function normalizeUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  if (url.startsWith('t.me/')) {
    url = `https://${url}`;
  } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
}

/**
 * Normalizes domain extraction from URL or raw domain
 */
export function extractCleanDomain(url: string, rawDomain?: string): string {
  if (rawDomain && rawDomain.includes('.')) {
    return rawDomain
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .trim();
  }
  try {
    const parsed = new URL(normalizeUrl(url));
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return (rawDomain || url || '')
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .trim();
  }
}

export interface MigrationStats {
  totalProcessed: number;
  logosEnriched: number;
  badgesAssigned: number;
  regionsStandardized: number;
  tagsStandardized: number;
  urlsNormalized: number;
}

/**
 * Fully migrates a single LinkItem into modern standardized schema.
 */
export function migrateLink(link: LinkItem): LinkItem {
  const normUrl = normalizeUrl(link.url);
  const cleanDomain = extractCleanDomain(normUrl, link.domain);

  // Standardize regions
  const rawRegions = Array.isArray(link.regions) && link.regions.length > 0 ? link.regions : ['Global'];
  const standardizedRegions = Array.from(
    new Set(rawRegions.map((r) => standardizeRegion(r)))
  );

  // Calculate dynamic badge
  const dynamicBadge = determineDynamicBadge({
    ...link,
    url: normUrl,
    domain: cleanDomain,
    regions: standardizedRegions,
  });

  // Calculate reliable CDN logo URL
  const cdnLogoUrl = link.logoUrl || link.imageUrl || generateCdnLogoUrl(cleanDomain, link.title);

  // Standardize tags
  const standardizedTags = getUniformCategoryTags(link.category, link.title, cleanDomain, link.tags);

  const multiBadges = getLinkBadges({
    ...link,
    url: normUrl,
    domain: cleanDomain,
    regions: standardizedRegions,
    badge: dynamicBadge as BadgeType,
    tags: standardizedTags,
  });

  return {
    ...link,
    url: normUrl,
    domain: cleanDomain,
    regions: standardizedRegions,
    badge: dynamicBadge as BadgeType,
    badges: multiBadges,
    logoUrl: cdnLogoUrl,
    tags: standardizedTags,
    status: link.status || 'active',
  };
}

/**
 * Bulk updates all existing links with official high-resolution CDN logos,
 * uniform category tags, standardized regional mapping, and dynamic badges.
 */
export function migrateAllLinks(links: LinkItem[]): {
  migratedLinks: LinkItem[];
  stats: MigrationStats;
} {
  const stats: MigrationStats = {
    totalProcessed: 0,
    logosEnriched: 0,
    badgesAssigned: 0,
    regionsStandardized: 0,
    tagsStandardized: 0,
    urlsNormalized: 0,
  };

  const migratedLinks = links.map((link) => {
    stats.totalProcessed++;
    const migrated = migrateLink(link);

    if (migrated.logoUrl && migrated.logoUrl !== link.logoUrl) {
      stats.logosEnriched++;
    }
    if (migrated.badge !== link.badge) {
      stats.badgesAssigned++;
    }
    if (JSON.stringify(migrated.regions) !== JSON.stringify(link.regions)) {
      stats.regionsStandardized++;
    }
    if (JSON.stringify(migrated.tags) !== JSON.stringify(link.tags)) {
      stats.tagsStandardized++;
    }
    if (migrated.url !== link.url) {
      stats.urlsNormalized++;
    }

    return migrated;
  });

  return { migratedLinks, stats };
}
