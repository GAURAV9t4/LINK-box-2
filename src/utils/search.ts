import { LinkItem, CategoryGroup } from '../types';
import { getLinkBadges } from './badgeManager';

/**
 * Normalizes text for case-insensitive, symbol-tolerant searching.
 */
export const normalizeSearchText = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

/**
 * Extracts the core root name from a domain or URL.
 * e.g., "https://www.bollyflix.re/movies" -> "bollyflix"
 * e.g., "t.me/mychannel" -> "mychannel"
 */
export const extractCoreDomainOrName = (urlOrDomain: string): string => {
  if (!urlOrDomain) return '';
  let clean = urlOrDomain.toLowerCase().trim();
  clean = clean.replace(/^(https?:\/\/)?(www\.)?/, '');
  // If Telegram URL
  if (clean.startsWith('t.me/')) {
    return clean.replace('t.me/', '').split(/[/?#]/)[0];
  }
  const host = clean.split(/[/?#]/)[0];
  // extract first part before TLD (e.g. bollyflix from bollyflix.re or vegamovies from vegamovies.ngo)
  const parts = host.split('.');
  if (parts.length >= 2) {
    return parts[0];
  }
  return host;
};

/**
 * Checks if a specific link matches a search query.
 * Handles:
 * 1. Exact or partial Title Name (standard & custom links)
 * 2. Full URL, domain, path, query params, subdomains (pasted URLs with or without http/https/www)
 * 3. Core domain name extraction (pasting any mirror e.g. vegamovies.com matches vegamovies.ngo)
 * 4. Hashtags & Tags (e.g. #4k, #movies, #anime, #telegram, #hindi, #vip)
 * 5. Badges (e.g. 4K, HD, TRUSTED, VIP, HOT, FAST, CUSTOM)
 * 6. Telegram groups / channel links or handles (t.me/...)
 * 7. Category name & id matching
 * 8. Multi-word phrases or compound search queries
 */
export const matchLinkWithQuery = (
  link: LinkItem,
  rawQuery: string,
  categories: CategoryGroup[] = []
): boolean => {
  const query = rawQuery.trim();
  if (!query) return true;

  // Clean raw query of surrounding quotes, brackets, or markdown brackets
  const sanitizedQuery = query
    .replace(/^["'\[\(<]+|["'\]\)>]+$/g, '')
    .trim();

  if (!sanitizedQuery) return true;

  const queryLower = normalizeSearchText(sanitizedQuery);
  const titleLower = normalizeSearchText(link.title);
  const urlLower = normalizeSearchText(link.url);
  const domainLower = normalizeSearchText(link.domain || '');
  const descLower = normalizeSearchText(link.description || '');
  const badgeLower = normalizeSearchText(link.badge || '');
  const logoTextLower = normalizeSearchText(link.logoText || '');
  const categoryIdLower = normalizeSearchText(link.category);

  // Clean URL without protocol (http://, https://, www.) and trailing slashes
  const cleanLinkUrl = urlLower
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '');

  const cleanQueryUrl = queryLower
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '');

  // 1. Direct Full Query Substring Matches (Instant Priority)
  // Check if entire query matches title, URL, domain, or telegram
  if (
    titleLower.includes(queryLower) ||
    queryLower.includes(titleLower) ||
    urlLower.includes(queryLower) ||
    queryLower.includes(cleanLinkUrl) ||
    cleanLinkUrl.includes(cleanQueryUrl) ||
    (domainLower && (domainLower.includes(cleanQueryUrl) || cleanQueryUrl.includes(domainLower)))
  ) {
    return true;
  }

  // 2. Core Domain / Host Match (e.g. pasted https://bollyflix.re/xyz matches BollyFlix domain bollyflix.re)
  const queryCore = extractCoreDomainOrName(sanitizedQuery);
  const linkCore = extractCoreDomainOrName(link.domain || link.url);
  if (queryCore && linkCore && (queryCore === linkCore || queryCore.includes(linkCore) || linkCore.includes(queryCore))) {
    return true;
  }

  // Also check if queryCore matches title without special characters (e.g. "vegamovies" matches "Vega Movies")
  const alphanumericTitle = titleLower.replace(/[^a-z0-9]/g, '');
  const alphanumericQuery = queryLower.replace(/[^a-z0-9]/g, '');
  if (
    alphanumericTitle &&
    alphanumericQuery &&
    (alphanumericTitle.includes(alphanumericQuery) || alphanumericQuery.includes(alphanumericTitle))
  ) {
    return true;
  }

  // 3. Category match
  const catObj = categories.find((c) => c.id === link.category);
  const catNameLower = catObj ? normalizeSearchText(catObj.name) : '';
  if (catNameLower && (catNameLower.includes(queryLower) || queryLower.includes(catNameLower))) {
    return true;
  }
  if (categoryIdLower && categoryIdLower.includes(queryLower)) {
    return true;
  }

  // 4. Tags and Badges match
  const rawTags = link.tags || [];
  const normalizedTags = rawTags.map((t) => normalizeSearchText(t.replace(/^#/, '')));
  const linkBadges = (link.badges && link.badges.length > 0 ? link.badges : getLinkBadges(link)).map((b) =>
    normalizeSearchText(b)
  );

  // If query starts with '#' (e.g. #4k, #anime, #movie, #official, #free)
  if (queryLower.startsWith('#')) {
    const pureTag = queryLower.slice(1).trim();
    if (pureTag) {
      if (normalizedTags.some((t) => t.includes(pureTag) || pureTag.includes(t))) return true;
      if (linkBadges.some((b) => b === pureTag || b.includes(pureTag) || pureTag.includes(b))) return true;
      if (badgeLower && (badgeLower.includes(pureTag) || pureTag.includes(badgeLower))) return true;
      if (link.isCustom && pureTag === 'custom') return true;
    }
  }

  // Check direct tag match
  if (normalizedTags.some((t) => t === queryLower || queryLower.includes(t))) {
    return true;
  }

  // Check badges match
  if (linkBadges.some((b) => b === queryLower || queryLower.includes(b) || b.includes(queryLower))) {
    return true;
  }

  // 5. Custom link identifier
  if (link.isCustom && (queryLower === 'custom' || queryLower === 'vault' || queryLower === 'private')) {
    return true;
  }

  // 6. Multi-token Compound Search
  // If user entered multiple words (e.g. "VegaMovies 4K Download" or "Anime #HD")
  const tokens = sanitizedQuery.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    // If at least half the tokens match or all non-trivial tokens match
    const matchingTokens = tokens.filter((token) => {
      const rawToken = token.toLowerCase();
      const cleanToken = rawToken.replace(/^#/, '');
      if (!cleanToken) return false;

      return (
        titleLower.includes(cleanToken) ||
        urlLower.includes(cleanToken) ||
        cleanLinkUrl.includes(cleanToken) ||
        domainLower.includes(cleanToken) ||
        badgeLower.includes(cleanToken) ||
        linkBadges.some((b) => b.includes(cleanToken)) ||
        normalizedTags.some((t) => t.includes(cleanToken)) ||
        descLower.includes(cleanToken) ||
        logoTextLower.includes(cleanToken) ||
        categoryIdLower.includes(cleanToken) ||
        (catNameLower && catNameLower.includes(cleanToken)) ||
        (link.regions && link.regions.some((r) => r.toLowerCase().includes(cleanToken)))
      );
    });

    // If primary brand/title token matches or 70%+ tokens match
    if (matchingTokens.length >= Math.ceil(tokens.length * 0.6) || matchingTokens.length >= 2) {
      return true;
    }
  }

  return false;
};

/**
 * Locates and scrolls smoothly to a link card on the page, with a visual highlight effect.
 */
export const locateLinkOnPage = (linkId: string): boolean => {
  const cardId = `link-card-${linkId}`;
  const tgCardId = `tg-card-${linkId}`;
  const el = document.getElementById(cardId) || document.getElementById(tgCardId);
  if (!el) return false;

  el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Add highlight pulse animation
  el.classList.add('ring-4', 'ring-purple-400', 'shadow-2xl', 'shadow-purple-500/50', 'scale-[1.03]');
  setTimeout(() => {
    el.classList.remove('ring-4', 'ring-purple-400', 'shadow-2xl', 'shadow-purple-500/50', 'scale-[1.03]');
  }, 2500);

  return true;
};

/**
 * Extracts popular hashtags/tags across all links for quick 1-click filter badges.
 * Excludes unwanted tags (fast, trusted, new, hot, 1080hd, etc.) per user request.
 */
export const extractPopularTags = (links: LinkItem[]): string[] => {
  const tagCountMap: { [tag: string]: number } = {};

  const priorityTags = [
    '#Movies', '#Anime', '#Free', '#Official', '#Apps', '#HD',
    '#4K', '#Manga', '#LiveSports', '#Telegram', '#AITech', '#Custom'
  ];

  priorityTags.forEach((pt) => {
    tagCountMap[pt] = 10;
  });

  const bannedTagsUpper = [
    'FAST', 'TRUSTED', 'NEW', 'HOT', '1080HD', 'DOLBY', 'DEBRID', 'BETA',
    'COMMUNITY', 'DIRECT', 'EXCLUSIVE', 'SAFE', 'PRIVATE', 'ULTRA', 'SCANS', 'VERIFIED',
    '18+', 'HENTAI', 'ADULT', 'NSFW', 'ECCHI'
  ];

  links.forEach((link) => {
    if (link.tags && Array.isArray(link.tags)) {
      link.tags.forEach((t) => {
        const clean = t.trim().replace(/^#/, '');
        const norm = clean.toUpperCase();
        if (bannedTagsUpper.includes(norm)) {
          return;
        }
        if (clean && clean.length <= 15) {
          const formatted = `#${clean.charAt(0).toUpperCase() + clean.slice(1)}`;
          tagCountMap[formatted] = (tagCountMap[formatted] || 0) + 1;
        }
      });
    }

    const badges = link.badges && link.badges.length > 0 ? link.badges : getLinkBadges(link);
    badges.forEach((b) => {
      const bUpper = b.toUpperCase();
      if (!bannedTagsUpper.includes(bUpper)) {
        const formattedBadge = `#${b.replace(/\s+/g, '')}`;
        tagCountMap[formattedBadge] = (tagCountMap[formattedBadge] || 0) + 2;
      }
    });

    if (link.isCustom) {
      tagCountMap['#Custom'] = (tagCountMap['#Custom'] || 0) + 3;
    }
  });

  return Object.entries(tagCountMap)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
    .slice(0, 12);
};
