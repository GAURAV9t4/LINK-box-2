import { LinkItem } from '../types';

/**
 * Deduplicates link items so that no two links have the exact same
 * domain within the same category and region, while preserving custom user links.
 */
export function deduplicateLinks(links: LinkItem[]): LinkItem[] {
  const seenIds = new Set<string>();
  const seenKeys = new Set<string>();
  const result: LinkItem[] = [];

  for (const link of links) {
    if (!link || !link.id) continue;
    if (seenIds.has(link.id)) continue;
    seenIds.add(link.id);

    // Always preserve custom user links
    if (link.isCustom || (link.id && (link.id.startsWith('custom-') || link.id.startsWith('user-') || link.id.startsWith('vault-'))) || link.category === 'custom') {
      result.push(link);
      continue;
    }

    const normDomain = (link.domain || link.url || '')
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .trim();

    const regions = (link.regions && link.regions.length > 0) ? link.regions : ['Global'];
    let isDuplicate = false;

    for (const r of regions) {
      const key = `${r.toLowerCase()}::${link.category}::${normDomain}`;
      if (seenKeys.has(key)) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      for (const r of regions) {
        const key = `${r.toLowerCase()}::${link.category}::${normDomain}`;
        seenKeys.add(key);
      }
      result.push(link);
    }
  }

  return result;
}
