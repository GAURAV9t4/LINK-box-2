import fs from 'fs';
import path from 'path';
import { ALL_REGIONAL_LINKS } from '../src/data/regionalData';
import { BASE_GLOBAL_LINKS, INITIAL_CATEGORIES, ALL_PDF_REGIONS } from '../src/data/initialData';
import { migrateLink, normalizeUrl, extractCleanDomain, generateCdnLogoUrl } from '../src/utils/dataMigration';
import { LinkItem } from '../src/types';

/**
 * Script to validate all link URLs, detect broken links, and populate logoUrl CDN properties.
 */
async function validateAndEnrichAllLinks() {
  console.log('🚀 Starting Link Validation & CDN Logo Enrichment...');

  const allLinks: LinkItem[] = [
    ...BASE_GLOBAL_LINKS,
    ...ALL_REGIONAL_LINKS,
  ];

  console.log(`📊 Total Links to Validate & Enrich: ${allLinks.length}`);

  let brokenCount = 0;
  let fixedUrlCount = 0;
  let logosPopulatedCount = 0;

  const enrichedBaseGlobal: LinkItem[] = [];
  const enrichedRegional: LinkItem[] = [];

  // Set of regional link IDs for routing
  const regionalIdSet = new Set(ALL_REGIONAL_LINKS.map((l) => l.id));

  for (const rawLink of allLinks) {
    const origUrl = rawLink.url;
    const normalizedUrl = normalizeUrl(origUrl);

    if (normalizedUrl !== origUrl) {
      fixedUrlCount++;
    }

    // Basic URL validity check
    let isValid = false;
    try {
      const parsed = new URL(normalizedUrl);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        isValid = true;
      }
    } catch {
      isValid = false;
    }

    if (!isValid) {
      console.warn(`⚠️ Broken / Invalid URL detected: [${rawLink.id}] ${rawLink.title} -> "${origUrl}"`);
      brokenCount++;
    }

    // Fully migrate and enrich with dynamic badge, standardized regions, and CDN logoUrl
    const migrated = migrateLink(rawLink);

    // Ensure logoUrl is guaranteed
    if (!migrated.logoUrl) {
      migrated.logoUrl = generateCdnLogoUrl(migrated.domain, migrated.title);
      logosPopulatedCount++;
    } else {
      logosPopulatedCount++;
    }

    if (regionalIdSet.has(migrated.id)) {
      enrichedRegional.push(migrated);
    } else {
      enrichedBaseGlobal.push(migrated);
    }
  }

  console.log(`\n📋 Validation & Enrichment Summary:`);
  console.log(`- Total Processed: ${allLinks.length}`);
  console.log(`- Broken URLs Identified & Flagged: ${brokenCount}`);
  console.log(`- URLs Normalized/Repaired: ${fixedUrlCount}`);
  console.log(`- Logos Populated via Reliable CDN: ${logosPopulatedCount}`);

  // Write updated regionalData.ts
  const regionalContent = `import { LinkItem } from '../types';

// ==========================================================
// REGIONAL WEBLINKS CURATED ACCORDING TO USER'S REGIONAL PDFS
// ENRICHED WITH CDN LOGOS AND DYNAMIC METADATA BADGES
// ==========================================================

export const ALL_REGIONAL_LINKS: LinkItem[] = ${JSON.stringify(enrichedRegional, null, 2)};
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'src/data/regionalData.ts'),
    regionalContent,
    'utf-8'
  );
  console.log('✅ Updated src/data/regionalData.ts with enriched CDN logos & badges');

  // Write updated initialData.ts
  const initialContent = `import { CategoryGroup, LinkItem } from '../types';
import { ALL_REGIONAL_LINKS } from './regionalData';

export const ALL_PDF_REGIONS = ${JSON.stringify(ALL_PDF_REGIONS, null, 2)};

export const INITIAL_CATEGORIES: CategoryGroup[] = ${JSON.stringify(INITIAL_CATEGORIES, null, 2)};

export const BASE_GLOBAL_LINKS: LinkItem[] = ${JSON.stringify(enrichedBaseGlobal, null, 2)};

export const INITIAL_LINKS: LinkItem[] = [
  ...BASE_GLOBAL_LINKS,
  ...ALL_REGIONAL_LINKS,
];
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'src/data/initialData.ts'),
    initialContent,
    'utf-8'
  );
  console.log('✅ Updated src/data/initialData.ts with unified CDN logos & badges');
  console.log('🎉 Enrichment complete!');
}

validateAndEnrichAllLinks().catch((err) => {
  console.error('Error running validation and enrichment:', err);
  process.exit(1);
});
