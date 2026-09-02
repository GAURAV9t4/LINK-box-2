import { LinkItem, CategoryGroup, ReactionType } from '../types';

/**
 * Helper to escape CSV cell value according to RFC 4180
 */
function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  // If contains commas, double quotes, or newlines, quote and escape double quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Triggers browser download of a CSV string with UTF-8 BOM for Excel/Sheets support
 */
export function downloadCSV(filename: string, csvContent: string): void {
  // UTF-8 BOM (\uFEFF) ensures Excel and Google Sheets render emojis, Hindi text, and accents properly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface LinkEngagementMetrics {
  id: string;
  title: string;
  url: string;
  domain: string;
  category: string;
  categoryName: string;
  regions: string;
  badge: string;
  allBadges: string;
  clicks: number;
  isFavorite: boolean;
  isCustom: boolean;
  userReaction: string;
  status: string;
  tags: string;
  addedAt: string;
  engagementScore: number;
}

export interface CategoryEngagementMetrics {
  categoryId: string;
  categoryName: string;
  totalLinks: number;
  curatedLinks: number;
  totalClicks: number;
  totalFavorites: number;
  averageClicksPerLink: number;
  trafficSharePercent: number;
  topPerformingLink: string;
  topLinkClicks: number;
}

/**
 * Computes detailed interaction metrics for each link
 */
export function computeLinkEngagement(
  links: LinkItem[],
  categories: CategoryGroup[],
  favorites: string[],
  userReactions: Record<string, ReactionType | null>
): LinkEngagementMetrics[] {
  const categoryMap = new Map<string, string>(categories.map((c) => [c.id.toLowerCase(), c.name]));
  const favSet = new Set(favorites);

  return links.map((link) => {
    const catName = categoryMap.get((link.category || '').toLowerCase()) || link.category || 'General';
    const isFav = favSet.has(link.id) || !!link.isFavorite;
    const clicks = Number(link.clicks || 0);
    const isCustom = !!(
      link.isCustom ||
      (link.id && (link.id.startsWith('custom-') || link.id.startsWith('user-') || link.id.startsWith('vault-'))) ||
      link.category === 'custom'
    );
    const reaction = userReactions[link.id] || '';
    
    // Engagement Score: clicks (weight 1) + favorites (weight 50) + reactions (weight 25) + curated priority (weight 10)
    let score = clicks + (isFav ? 50 : 0) + (reaction ? 25 : 0) + (isCustom ? 10 : 0);

    return {
      id: link.id,
      title: link.title,
      url: link.url,
      domain: link.domain || (link.url ? new URL(link.url).hostname : ''),
      category: link.category,
      categoryName: catName,
      regions: (link.regions && link.regions.length > 0) ? link.regions.join('; ') : 'Global',
      badge: link.badge || 'Free',
      allBadges: (link.badges && link.badges.length > 0) ? link.badges.join('; ') : (link.badge || 'Free'),
      clicks,
      isFavorite: isFav,
      isCustom,
      userReaction: reaction,
      status: link.status || 'active',
      tags: (link.tags && link.tags.length > 0) ? link.tags.join('; ') : '',
      addedAt: link.addedAt || '',
      engagementScore: score,
    };
  });
}

/**
 * Computes aggregated category engagement metrics
 */
export function computeCategoryEngagement(
  links: LinkItem[],
  categories: CategoryGroup[],
  favorites: string[]
): CategoryEngagementMetrics[] {
  const favSet = new Set(favorites);
  const totalCatalogClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0) || 1;

  // Group by category
  const groups: Record<string, LinkItem[]> = {};
  for (const link of links) {
    const cat = (link.category || 'other').toLowerCase();
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(link);
  }

  // Map each category
  return categories.map((cat) => {
    const catLinks = groups[cat.id.toLowerCase()] || [];
    const totalClicks = catLinks.reduce((sum, l) => sum + (l.clicks || 0), 0);
    const totalFavs = catLinks.filter((l) => favSet.has(l.id) || l.isFavorite).length;
    const curatedCount = catLinks.filter(
      (l) => l.isCustom || (l.id && (l.id.startsWith('custom-') || l.id.startsWith('user-') || l.id.startsWith('vault-')))
    ).length;

    // Top link
    let topLink = 'None';
    let topClicks = 0;
    if (catLinks.length > 0) {
      const sorted = [...catLinks].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      topLink = sorted[0].title;
      topClicks = sorted[0].clicks || 0;
    }

    const avgClicks = catLinks.length > 0 ? Math.round(totalClicks / catLinks.length) : 0;
    const share = Number(((totalClicks / totalCatalogClicks) * 100).toFixed(2));

    return {
      categoryId: cat.id,
      categoryName: cat.name,
      totalLinks: catLinks.length,
      curatedLinks: curatedCount,
      totalClicks,
      totalFavorites: totalFavs,
      averageClicksPerLink: avgClicks,
      trafficSharePercent: share,
      topPerformingLink: topLink,
      topLinkClicks: topClicks,
    };
  }).sort((a, b) => b.totalClicks - a.totalClicks);
}

/**
 * Generates CSV string for link interactions
 */
export function generateLinkInteractionsCSV(
  links: LinkItem[],
  categories: CategoryGroup[],
  favorites: string[],
  userReactions: Record<string, ReactionType | null>,
  onlyCurated: boolean = false
): string {
  let metrics = computeLinkEngagement(links, categories, favorites, userReactions);
  if (onlyCurated) {
    metrics = metrics.filter((m) => m.isCustom);
  }

  // Sort by engagement score descending (most successful first)
  metrics.sort((a, b) => b.engagementScore - a.engagementScore);

  const headers = [
    'Link ID',
    'Title',
    'URL',
    'Domain',
    'Category',
    'Category Name',
    'Regions',
    'Primary Badge',
    'All Badges',
    'Clicks / Visits',
    'Is Favorited (Starred)',
    'Is Curated / Custom',
    'User Reaction',
    'Health Status',
    'Tags',
    'Engagement Score',
    'Date Added',
  ];

  const rows = metrics.map((m) => [
    escapeCSV(m.id),
    escapeCSV(m.title),
    escapeCSV(m.url),
    escapeCSV(m.domain),
    escapeCSV(m.category),
    escapeCSV(m.categoryName),
    escapeCSV(m.regions),
    escapeCSV(m.badge),
    escapeCSV(m.allBadges),
    escapeCSV(m.clicks),
    escapeCSV(m.isFavorite ? 'Yes' : 'No'),
    escapeCSV(m.isCustom ? 'Yes (Curated)' : 'No (Default)'),
    escapeCSV(m.userReaction || 'None'),
    escapeCSV(m.status),
    escapeCSV(m.tags),
    escapeCSV(m.engagementScore),
    escapeCSV(m.addedAt || 'N/A'),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Generates CSV string for category engagement
 */
export function generateCategoryEngagementCSV(
  links: LinkItem[],
  categories: CategoryGroup[],
  favorites: string[]
): string {
  const catMetrics = computeCategoryEngagement(links, categories, favorites);

  const headers = [
    'Category ID',
    'Category Name',
    'Total Links Count',
    'Curated User Links',
    'Total Clicks / Visits',
    'Total Favorites',
    'Average Clicks Per Link',
    'Traffic Share (%)',
    'Top Performing Link Title',
    'Top Link Clicks',
  ];

  const rows = catMetrics.map((c) => [
    escapeCSV(c.categoryId),
    escapeCSV(c.categoryName),
    escapeCSV(c.totalLinks),
    escapeCSV(c.curatedLinks),
    escapeCSV(c.totalClicks),
    escapeCSV(c.totalFavorites),
    escapeCSV(c.averageClicksPerLink),
    escapeCSV(`${c.trafficSharePercent}%`),
    escapeCSV(c.topPerformingLink),
    escapeCSV(c.topLinkClicks),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Generates comprehensive full analytics CSV with both Category Matrix & Link Interactions
 */
export function generateFullAnalyticsCSV(
  links: LinkItem[],
  categories: CategoryGroup[],
  favorites: string[],
  userReactions: Record<string, ReactionType | null>
): string {
  const dateStr = new Date().toISOString();
  const summaryHeader = [
    '# LINKBOX ENGAGEMENT & INTERACTION ANALYTICS REPORT',
    `# Export Date: ${dateStr}`,
    `# Total Links: ${links.length}`,
    `# Total Categories: ${categories.length}`,
    `# Total Favorites: ${favorites.length}`,
    '',
    '=== CATEGORY ENGAGEMENT OVERVIEW ===',
  ].join('\r\n');

  const categoryCSV = generateCategoryEngagementCSV(links, categories, favorites);

  const linkHeader = [
    '',
    '=== ALL LINKS INTERACTION & SUCCESS METRICS (SORTED BY SUCCESS SCORE) ===',
  ].join('\r\n');

  const linkCSV = generateLinkInteractionsCSV(links, categories, favorites, userReactions, false);

  return [summaryHeader, categoryCSV, linkHeader, linkCSV].join('\r\n');
}
