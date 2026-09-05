export interface RegionInfo {
  code: string;
  name: string;
  shortName: string;
  flag: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const REGIONS_MASTER: RegionInfo[] = [
  {
    code: 'all',
    name: 'Global (All Regions)',
    shortName: 'Global',
    flag: '🌐',
    badgeBg: 'bg-purple-950/70',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-600/40',
  },
  {
    code: 'India',
    name: 'India / Deshi',
    shortName: 'Ind',
    flag: '🇮🇳',
    badgeBg: 'bg-emerald-950/70',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-600/40',
  },
  {
    code: 'USA',
    name: 'United States (Western)',
    shortName: 'USA',
    flag: '🇺🇸',
    badgeBg: 'bg-sky-950/70',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-600/40',
  },
  {
    code: 'Japan',
    name: 'Japan (Anime & Asian)',
    shortName: 'JPN',
    flag: '🇯🇵',
    badgeBg: 'bg-rose-950/70',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-600/40',
  },
  {
    code: 'Korea',
    name: 'South Korea',
    shortName: 'KOR',
    flag: '🇰🇷',
    badgeBg: 'bg-blue-950/70',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-600/40',
  },
  {
    code: 'France',
    name: 'France',
    shortName: 'FRA',
    flag: '🇫🇷',
    badgeBg: 'bg-cyan-950/70',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-600/40',
  },
  {
    code: 'Germany',
    name: 'Germany',
    shortName: 'GER',
    flag: '🇩🇪',
    badgeBg: 'bg-amber-950/70',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-600/40',
  },
  {
    code: 'Spain',
    name: 'Spain',
    shortName: 'ESP',
    flag: '🇪🇸',
    badgeBg: 'bg-yellow-950/70',
    badgeText: 'text-yellow-300',
    badgeBorder: 'border-yellow-600/40',
  },
  {
    code: 'Italy',
    name: 'Italy',
    shortName: 'ITA',
    flag: '🇮🇹',
    badgeBg: 'bg-emerald-950/70',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-600/40',
  },
  {
    code: 'Brazil',
    name: 'Brazil',
    shortName: 'BRA',
    flag: '🇧🇷',
    badgeBg: 'bg-green-950/70',
    badgeText: 'text-green-300',
    badgeBorder: 'border-green-600/40',
  },
  {
    code: 'Russia',
    name: 'Russia',
    shortName: 'RUS',
    flag: '🇷🇺',
    badgeBg: 'bg-blue-950/70',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-600/40',
  },
  {
    code: 'Poland',
    name: 'Poland',
    shortName: 'POL',
    flag: '🇵🇱',
    badgeBg: 'bg-rose-950/70',
    badgeText: 'text-rose-300',
    badgeBorder: 'border-rose-600/40',
  },
  {
    code: 'Netherlands',
    name: 'Netherlands',
    shortName: 'NLD',
    flag: '🇳🇱',
    badgeBg: 'bg-orange-950/70',
    badgeText: 'text-orange-300',
    badgeBorder: 'border-orange-600/40',
  },
  {
    code: 'Portugal',
    name: 'Portugal',
    shortName: 'PRT',
    flag: '🇵🇹',
    badgeBg: 'bg-red-950/70',
    badgeText: 'text-red-300',
    badgeBorder: 'border-red-600/40',
  },
  {
    code: 'Finland',
    name: 'Finland',
    shortName: 'FIN',
    flag: '🇫🇮',
    badgeBg: 'bg-blue-950/70',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-600/40',
  },
];

/**
 * Returns region info by code or name (with alias support for Deshi, Western, etc.)
 */
export function getRegionInfo(regionName?: string): RegionInfo {
  if (!regionName || regionName === 'all' || regionName === 'Global') {
    return REGIONS_MASTER[0]; // Global
  }

  const clean = regionName.trim().toLowerCase();

  // Handle aliases
  if (clean === 'deshi' || clean === 'desi' || clean === 'bharat') {
    return {
      code: 'India',
      name: 'India / Deshi',
      shortName: 'Deshi',
      flag: '🇮🇳',
      badgeBg: 'bg-emerald-950/70',
      badgeText: 'text-emerald-300',
      badgeBorder: 'border-emerald-600/40',
    };
  }

  if (clean === 'western' || clean === 'west') {
    return {
      code: 'USA',
      name: 'Western / USA',
      shortName: 'Western',
      flag: '🇺🇸',
      badgeBg: 'bg-sky-950/70',
      badgeText: 'text-sky-300',
      badgeBorder: 'border-sky-600/40',
    };
  }

  const found = REGIONS_MASTER.find(
    (r) =>
      r.code.toLowerCase() === clean ||
      r.name.toLowerCase() === clean ||
      r.name.toLowerCase().includes(clean) ||
      r.shortName.toLowerCase() === clean
  );

  if (found) return found;

  // Fallback for custom or other country names
  return {
    code: regionName,
    name: regionName,
    shortName: regionName.slice(0, 3).toUpperCase(),
    flag: '📍',
    badgeBg: 'bg-zinc-800/80',
    badgeText: 'text-zinc-300',
    badgeBorder: 'border-zinc-700/60',
  };
}

/**
 * Returns the primary region badge for a link item
 */
export function getPrimaryLinkRegion(regions?: string[]): RegionInfo {
  if (!regions || regions.length === 0) {
    return REGIONS_MASTER[0]; // Global
  }

  // Prioritize specific countries (e.g. Deshi/India/Japan/USA) over "Global"
  const specific = regions.find((r) => r.toLowerCase() !== 'global');
  if (specific) {
    return getRegionInfo(specific);
  }

  return getRegionInfo('Global');
}

/**
 * Determines whether a link's regions match the selected region code.
 *
 * Rules:
 * - 'all': shows all regional links together (Global / All Regions).
 * - 'India': shows strictly India / Deshi / Bharat links.
 * - Any other specific country (USA, Japan, Korea, France, Germany, Spain, etc.):
 *   shows strictly links matching that specific country or its recognized aliases.
 * - A link must explicitly belong to the target country; having 'Global' does not include it in a specific country.
 */
export function isLinkMatchingRegion(linkRegions: string[] | undefined, selectedRegionCode: string): boolean {
  if (!selectedRegionCode || selectedRegionCode === 'all' || selectedRegionCode.toLowerCase() === 'all') {
    return true;
  }

  if (!linkRegions || linkRegions.length === 0) {
    return false;
  }

  const target = selectedRegionCode.trim().toLowerCase();

  // If explicitly selected 'Global'
  if (target === 'global') {
    return linkRegions.some((r) => r.trim().toLowerCase() === 'global');
  }

  return linkRegions.some((r) => {
    const rc = r.trim().toLowerCase();
    if (rc === target) return true;

    // Region aliases
    if (target === 'india') {
      return rc === 'deshi' || rc === 'desi' || rc === 'bharat' || rc === 'ind';
    }
    if (target === 'usa') {
      return rc === 'united states' || rc === 'america' || rc === 'us' || rc === 'western' || rc === 'west';
    }
    if (target === 'korea' || target === 'south korea') {
      return rc === 'korea' || rc === 'south korea' || rc === 'kor' || rc === 'kr';
    }
    if (target === 'japan') {
      return rc === 'jpn' || rc === 'jp';
    }
    if (target === 'uk') {
      return rc === 'united kingdom' || rc === 'britain' || rc === 'gb';
    }
    if (target === 'france') {
      return rc === 'fra' || rc === 'fr';
    }
    if (target === 'germany') {
      return rc === 'ger' || rc === 'de' || rc === 'deutschland';
    }
    if (target === 'spain') {
      return rc === 'esp' || rc === 'es' || rc === 'espana';
    }
    if (target === 'italy') {
      return rc === 'ita' || rc === 'it' || rc === 'italia';
    }
    if (target === 'brazil') {
      return rc === 'brasil' || rc === 'bra' || rc === 'br';
    }
    if (target === 'russia') {
      return rc === 'rus' || rc === 'ru';
    }
    if (target === 'poland') {
      return rc === 'pol' || rc === 'pl' || rc === 'polska';
    }
    if (target === 'netherlands') {
      return rc === 'nld' || rc === 'nl' || rc === 'holland';
    }
    if (target === 'portugal') {
      return rc === 'prt' || rc === 'pt';
    }
    if (target === 'finland') {
      return rc === 'fin' || rc === 'fi' || rc === 'suomi';
    }

    return false;
  });
}

