import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  CategoryGroup, LinkItem, FilterState, ThemeMode, ReactionType 
} from './types';
import { INITIAL_CATEGORIES, INITIAL_LINKS } from './data/initialData';
import { HeroSection } from './components/HeroSection';
import { RecentlyVisited } from './components/RecentlyVisited';
import { SearchAndFilters } from './components/SearchAndFilters';
import { PopularTrendsWidget } from './components/PopularTrendsWidget';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { CategorySection } from './components/CategorySection';
import { TelegramGroupView } from './components/TelegramGroupView';
import { CustomVaultSection } from './components/CustomVaultSection';
import { BottomFloatingBar } from './components/BottomFloatingBar';
import { AddLinkModal } from './components/AddLinkModal';
import { EditLinkModal } from './components/EditLinkModal';
import { QrCodeModal } from './components/QrCodeModal';
import { JumpModal } from './components/JumpModal';
import { AboutModal, RequestModal, DmcaModal, SupportModal, PrivacySettingsModal } from './components/Modals';
import { AutoSyncModal } from './components/AutoSyncModal';
import { ExportAnalyticsModal } from './components/ExportAnalyticsModal';
import { Footer } from './components/Footer';
import { Check, Star, AlertCircle, Plus, Sparkles } from 'lucide-react';
import { matchLinkWithQuery, locateLinkOnPage } from './utils/search';
import { deduplicateLinks } from './utils/dedup';
import { migrateAllLinks } from './utils/dataMigration';
import { REGIONS_MASTER, isLinkMatchingRegion } from './utils/regions';
import { getLinkBadges } from './utils/badgeManager';
import { checkAndRunStartupAutoSync, getAutoSyncConfig } from './utils/autoDiscoveryEngine';

const STORAGE_KEYS = {
  LINKS: 'linkbox_links_v2',
  CUSTOM_LINKS: 'linkbox_custom_vault_permanent_v2',
  CATEGORIES: 'linkbox_categories_v2',
  FAVORITES: 'linkbox_favorites_v2',
  RECENT: 'linkbox_recent_v2',
  THEME: 'linkbox_theme_v2',
  REGION: 'linkbox_region_v2',
  USER_REACTIONS: 'linkbox_user_reactions_v2',
  REACTION_COUNTS: 'linkbox_reaction_counts_v2',
  VAULT_PRIVACY: 'linkbox_vault_privacy_autoclean_v2',
};

export default function App() {
  // Categories State
  const [categories, setCategories] = useState<CategoryGroup[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (!saved) return INITIAL_CATEGORIES;
      const parsed: CategoryGroup[] = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_CATEGORIES;
      // Auto-merge any newly added system categories (such as 18+)
      const existingIds = new Set(parsed.map((c) => c.id.toLowerCase()));
      const missing = INITIAL_CATEGORIES.filter((c) => !existingIds.has(c.id.toLowerCase()));
      return [...parsed, ...missing];
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // Links State with bulletproof custom link preservation and smart merge
  const [links, setLinks] = useState<LinkItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LINKS);
      const savedCustom = localStorage.getItem(STORAGE_KEYS.CUSTOM_LINKS);
      
      let customVaultLinks: LinkItem[] = [];
      if (savedCustom) {
        try {
          const parsedCustom = JSON.parse(savedCustom);
          if (Array.isArray(parsedCustom)) {
            customVaultLinks = parsedCustom.map((l) => ({
              ...l,
              isCustom: true,
              status: 'active',
              regions: (l.regions && l.regions.length > 0) ? l.regions : ['Global', 'India', 'USA', 'UK', 'Japan', 'Korea'],
            }));
          }
        } catch {
          // ignore
        }
      }

      if (!saved) {
        const { migratedLinks } = migrateAllLinks(deduplicateLinks([...customVaultLinks, ...INITIAL_LINKS]));
        return migratedLinks;
      }

      const parsed: LinkItem[] = JSON.parse(saved);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        const { migratedLinks } = migrateAllLinks(deduplicateLinks([...customVaultLinks, ...INITIAL_LINKS]));
        return migratedLinks;
      }

      // Collect all custom links from both sources
      const customLinksMap = new Map<string, LinkItem>();
      customVaultLinks.forEach((l) => customLinksMap.set(l.id, l));

      parsed.forEach((l) => {
        if (l.isCustom || (l.id && (l.id.startsWith('custom-') || l.id.startsWith('user-') || l.id.startsWith('vault-'))) || l.category === 'custom') {
          customLinksMap.set(l.id, {
            ...l,
            isCustom: true,
            status: 'active',
            regions: (l.regions && l.regions.length > 0) ? l.regions : ['Global', 'India', 'USA', 'UK', 'Japan', 'Korea'],
          });
        }
      });

      // Preserve all user-saved links (including user edits and auto-synced links)
      const parsedMap = new Map(parsed.map((l) => [l.id, l]));

      // Check if any INITIAL_LINKS are new and missing from parsed
      const missingInitial = INITIAL_LINKS.filter((initLink) => !parsedMap.has(initLink.id));

      // Combine existing parsed links + new INITIAL_LINKS + all custom links
      const allSavedLinks = parsed.map((l) => {
        if (customLinksMap.has(l.id)) {
          return customLinksMap.get(l.id)!;
        }
        return l;
      });

      const finalCustoms = Array.from(customLinksMap.values()).filter(
        (c) => !allSavedLinks.some((l) => l.id === c.id)
      );

      const combined = [...finalCustoms, ...allSavedLinks, ...missingInitial];
      const { migratedLinks } = migrateAllLinks(deduplicateLinks(combined));
      return migratedLinks;
    } catch {
      const { migratedLinks } = migrateAllLinks(deduplicateLinks(INITIAL_LINKS));
      return migratedLinks;
    }
  });

  // Reactions state: Single vote tracking per user (Point 2: strictly 1 person 1 reaction, non-editable)
  const [userReactions, setUserReactions] = useState<Record<string, ReactionType | null>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_REACTIONS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Reaction counts: { [linkId]: { heart: number, zap: number, like: number } }
  const [reactionCounts, setReactionCounts] = useState<Record<string, { heart: number; zap: number; like: number }>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REACTION_COUNTS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Favorites (Array of link IDs)
  // Starred Favorites ID List (starts clean, only user-chosen links are starred)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Recently Visited (Array of LinkItems, starts clean)
  const [recentLinks, setRecentLinks] = useState<LinkItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENT);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Vault Privacy & Incognito Auto-Clean State (Auto-purges 18+ and Vault links from Recently Visited)
  const [isVaultPrivacyAutoCleanEnabled, setIsVaultPrivacyAutoCleanEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VAULT_PRIVACY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode) || 'dark';
    } catch {
      return 'dark';
    }
  });

  // Selected Region
  const [selectedRegion, setSelectedRegion] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.REGION) || 'India';
    } catch {
      return 'India';
    }
  });

  // Global Filters
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCategory: 'all',
    selectedRegion: 'all',
    selectedBadge: 'all',
    sortBy: 'default',
    onlyFavorites: false,
    viewMode: 'grid',
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAutoSyncOpen, setIsAutoSyncOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [qrModalLink, setQrModalLink] = useState<LinkItem | null>(null);
  const [isJumpModalOpen, setIsJumpModalOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isDmcaOpen, setIsDmcaOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(true);
  const [isPrivacySettingsOpen, setIsPrivacySettingsOpen] = useState(false);
  const [isExportAnalyticsOpen, setIsExportAnalyticsOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto Web Launch: Display Support Option Pop-up in front of the user immediately on launch
  useEffect(() => {
    const launchTimer = setTimeout(() => {
      setIsSupportOpen(true);
    }, 300);
    return () => clearTimeout(launchTimer);
  }, []);

  // Auto Link Discovery & Ingestion Engine: Checks on launch and pulls fresh global/regional links
  useEffect(() => {
    try {
      const result = checkAndRunStartupAutoSync(links);
      if (result && result.addedLinks.length > 0) {
        setLinks(result.updatedLinks);
        setTimeout(() => {
          showToast(
            result.message || `✨ Auto-Sync: ${result.addedLinks.length} new worldwide links added!`,
            'success'
          );
        }, 1200);
      }
    } catch (err) {
      console.error('Startup auto-sync check error:', err);
    }
  }, []);

  // Periodic interval check (every 5 minutes in background) to auto-fetch new links seamlessly
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        const config = getAutoSyncConfig();
        if (!config.isEnabled) return;
        const result = checkAndRunStartupAutoSync(links);
        if (result && result.addedLinks.length > 0) {
          setLinks(result.updatedLinks);
          showToast(
            result.message || `✨ Auto-Sync: ${result.addedLinks.length} new regional links added!`,
            'success'
          );
        }
      } catch (err) {
        console.error('Periodic auto-sync check error:', err);
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(timer);
  }, [links]);

  // Save changes to localStorage (both main link storage & permanent custom vault)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
    const customs = links.filter((l) => l.isCustom || (l.id && (l.id.startsWith('custom-') || l.id.startsWith('user-') || l.id.startsWith('vault-'))) || l.category === 'custom');
    localStorage.setItem(STORAGE_KEYS.CUSTOM_LINKS, JSON.stringify(customs));
  }, [links]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recentLinks));
  }, [recentLinks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REGION, selectedRegion);
  }, [selectedRegion]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_REACTIONS, JSON.stringify(userReactions));
  }, [userReactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REACTION_COUNTS, JSON.stringify(reactionCounts));
  }, [reactionCounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VAULT_PRIVACY, JSON.stringify(isVaultPrivacyAutoCleanEnabled));
  }, [isVaultPrivacyAutoCleanEnabled]);

  const showToast = (message: string, type: 'info' | 'success' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 1-person 1-reaction system (Point 2: Single vote per person, non-editable count, anti-spam toggle)
  const handleReact = (linkId: string, type: ReactionType) => {
    const currentVote = userReactions[linkId] || null;
    const link = links.find((l) => l.id === linkId);

    const baseCounts = link?.reactions || {
      heart: Math.floor(((link?.clicks || 1200) % 70) + 12),
      zap: Math.floor(((link?.clicks || 900) % 50) + 8),
      like: Math.floor(((link?.clicks || 1500) % 90) + 15),
    };

    const currentCountObj = reactionCounts[linkId] || { ...baseCounts };
    const updatedCountObj = { ...currentCountObj };
    let nextVote: ReactionType | null = type;

    if (currentVote === type) {
      // Tapped active reaction again -> remove vote / unreact (strict 1-vote limit, no infinite increase)
      nextVote = null;
      updatedCountObj[type] = Math.max(0, (updatedCountObj[type] || 1) - 1);
      showToast(`Removed your ${type === 'heart' ? '♥️' : type === 'zap' ? '⚡' : '👍'} reaction`, 'info');
    } else if (currentVote) {
      // Switched reaction from another type -> transfer 1 vote
      updatedCountObj[currentVote] = Math.max(0, (updatedCountObj[currentVote] || 1) - 1);
      updatedCountObj[type] = (updatedCountObj[type] || 0) + 1;
      showToast(`Changed reaction to ${type === 'heart' ? '♥️' : type === 'zap' ? '⚡' : '👍'} (1 vote recorded)`, 'success');
    } else {
      // First reaction by user on this link
      updatedCountObj[type] = (updatedCountObj[type] || 0) + 1;
      showToast(`Added reaction ${type === 'heart' ? '♥️' : type === 'zap' ? '⚡' : '👍'} (1 vote recorded)`, 'success');
    }

    setUserReactions((prev) => ({
      ...prev,
      [linkId]: nextVote,
    }));

    setReactionCounts((prev) => ({
      ...prev,
      [linkId]: updatedCountObj,
    }));
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? 'Removed from favorites' : '★ Added to favorites!');
      return updated;
    });
  };

  // Helper to detect age-restricted or private vault links
  const isAgeRestrictedOrVaultLink = (link: LinkItem) => {
    const cat = (link.category || '').toLowerCase().trim();
    const badge = (link.badge || '').toUpperCase().trim();
    const tags = (link.tags || []).map((t) => t.toLowerCase());

    if (cat === '18+' || cat.includes('hentai') || cat.includes('adult') || cat.includes('nsfw') || cat === 'custom-vault') {
      return true;
    }
    if (badge === '18+' || badge === 'HENTAI' || badge === 'PRIVATE' || badge === 'ADULT') {
      return true;
    }
    if (tags.some((t) => t === '18+' || t === 'hentai' || t === 'adult' || t === 'nsfw' || t === 'private')) {
      return true;
    }
    return false;
  };

  // Log link visit
  const handleVisitLink = (visitedLink: LinkItem) => {
    // Increment link clicks
    setLinks((prev) =>
      prev.map((l) =>
        l.id === visitedLink.id ? { ...l, clicks: (l.clicks || 0) + 1, lastVisited: Date.now() } : l
      )
    );

    // If Vault Privacy Auto-Clean is active and the visited link is 18+ or private vault,
    // do not add it to recentLinks, and purge any existing instances from recentLinks
    if (isVaultPrivacyAutoCleanEnabled && isAgeRestrictedOrVaultLink(visitedLink)) {
      setRecentLinks((prev) => prev.filter((l) => !isAgeRestrictedOrVaultLink(l)));
      return;
    }

    // Update recently visited list (up to 8 items)
    setRecentLinks((prev) => {
      const filtered = prev.filter((l) => l.id !== visitedLink.id);
      if (isVaultPrivacyAutoCleanEnabled) {
        return [visitedLink, ...filtered.filter((l) => !isAgeRestrictedOrVaultLink(l))].slice(0, 8);
      }
      return [visitedLink, ...filtered].slice(0, 8);
    });
  };

  const handleToggleVaultPrivacyAutoClean = () => {
    setIsVaultPrivacyAutoCleanEnabled((prev) => {
      const next = !prev;
      if (next) {
        // Auto-purge any 18+ or vault links currently in recentLinks
        setRecentLinks((rPrev) => rPrev.filter((l) => !isAgeRestrictedOrVaultLink(l)));
        showToast('🛡️ Vault Privacy Enabled: 18+ & Private items auto-purged from Recent History');
      } else {
        showToast('Vault Privacy Disabled');
      }
      return next;
    });
  };

  const handleClearRecent = () => {
    setRecentLinks([]);
    showToast('Recently visited links cleared.');
  };

  // Add Custom Link
  const handleAddLink = (newLink: LinkItem) => {
    setLinks((prev) => [newLink, ...prev]);
    showToast(`Added "${newLink.title}" to LINK BOX!`);
  };

  // Update Custom Link
  const handleUpdateLink = (updatedLink: LinkItem) => {
    setLinks((prev) => prev.map((l) => (l.id === updatedLink.id ? updatedLink : l)));
    showToast(`Updated "${updatedLink.title}" successfully!`);
  };

  // Delete Custom Link
  const handleDeleteLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setFavorites((prev) => prev.filter((favId) => favId !== id));
    setRecentLinks((prev) => prev.filter((l) => l.id !== id));
    showToast('Deleted link successfully.');
  };

  // Add Custom Category
  const handleAddCategory = (newCategory: CategoryGroup) => {
    setCategories((prev) => [...prev, newCategory]);
    showToast(`Created category "${newCategory.name}"`);
  };

  // Toggle Themes
  const handleToggleTheme = () => {
    const themeCycle: ThemeMode[] = ['dark', 'midnight', 'cyberpunk', 'light'];
    const nextIndex = (themeCycle.indexOf(theme) + 1) % themeCycle.length;
    setTheme(themeCycle[nextIndex]);
    showToast(`Theme: ${themeCycle[nextIndex].toUpperCase()}`);
  };

  // Active regional stats (Dynamic Sites count, Category count, and Region count)
  const regionalScopeLinks = useMemo(() => {
    if (selectedRegion === 'all') return links;
    return links.filter((l) => {
      const isCustomUserLink = l.isCustom || (l.id && (l.id.startsWith('custom-') || l.id.startsWith('user-') || l.id.startsWith('vault-'))) || l.category === 'custom';
      if (isCustomUserLink && (!l.regions || l.regions.length === 0)) return true;
      return isLinkMatchingRegion(l.regions, selectedRegion);
    });
  }, [links, selectedRegion]);

  const activeCategoriesCount = useMemo(() => {
    if (selectedRegion === 'all') return categories.length;
    const activeCats = new Set(regionalScopeLinks.map((l) => l.category));
    return activeCats.size || 0;
  }, [regionalScopeLinks, categories, selectedRegion]);

  const activeRegionsCount = useMemo(() => {
    if (selectedRegion === 'all') return REGIONS_MASTER.length - 1;
    return 1;
  }, [selectedRegion]);

  // Filter and Sort Links
  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      // 1. Enhanced Search Query (Title, URL, Custom URL/Title, Tags, Badges, Category)
      if (filters.searchQuery.trim()) {
        if (!matchLinkWithQuery(link, filters.searchQuery, categories)) {
          return false;
        }
      }

      // 2. Selected Category Filter (only active when not actively searching)
      if (filters.selectedCategory !== 'all' && !filters.searchQuery.trim()) {
        if (filters.selectedCategory === 'custom') {
          if (!link.isCustom && link.category !== 'custom' && !link.id?.startsWith('custom-')) return false;
        } else if (link.category !== filters.selectedCategory) {
          return false;
        }
      }

      // 3. Region Filter:
      // When a specific country is selected (e.g. India, USA, Japan, Korea, France, etc.):
      // ONLY links that explicitly belong to that region are displayed.
      // All regional links are shown together ONLY when 'all' (Global) is selected.
      if (selectedRegion !== 'all') {
        const isCustomUserLink = link.isCustom || link.category === 'custom' || (link.id && (link.id.startsWith('custom-') || link.id.startsWith('user-') || link.id.startsWith('vault-')));
        if (isCustomUserLink && (!link.regions || link.regions.length === 0)) {
          // Custom user links without specific regional tags stay accessible
        } else {
          if (!isLinkMatchingRegion(link.regions, selectedRegion)) {
            return false;
          }
        }
      }

      // 4. Badge Filter (only active when not actively searching)
      if (filters.selectedBadge !== 'all' && !filters.searchQuery.trim()) {
        const linkBadges = link.badges && link.badges.length > 0 ? link.badges : getLinkBadges(link);
        const selBadgeClean = filters.selectedBadge.toLowerCase().replace(/^#/, '');
        const hasBadge = linkBadges.some((b) => {
          const bLower = b.toLowerCase().replace(/^#/, '');
          return bLower === selBadgeClean || bLower.includes(selBadgeClean) || selBadgeClean.includes(bLower);
        });
        if (!hasBadge) return false;
      }

      // 5. Favorites Only Filter
      if (filters.onlyFavorites) {
        if (!favorites.includes(link.id)) return false;
      }

      return true;
    });
  }, [links, filters, selectedRegion, favorites, categories]);

  // Sort Filtered Links
  const sortedLinks = useMemo(() => {
    const list = [...filteredLinks];
    switch (filters.sortBy) {
      case 'popular':
        return list.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      case 'name-asc':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-desc':
        return list.sort((a, b) => b.title.localeCompare(a.title));
      case 'recent':
        return list.sort((a, b) => (b.lastVisited || 0) - (a.lastVisited || 0));
      default:
        return list;
    }
  }, [filteredLinks, filters.sortBy]);

  // Category counts map
  const categoryCounts = useMemo(() => {
    const counts: { [catId: string]: number } = {};
    categories.forEach((cat) => {
      counts[cat.id] = sortedLinks.filter((l) => l.category === cat.id).length;
    });
    return counts;
  }, [categories, sortedLinks]);

  // Custom links list
  const userCustomLinks = useMemo(() => {
    return links.filter((l) => l.isCustom);
  }, [links]);

  const filteredCustomLinks = useMemo(() => {
    if (!filters.searchQuery.trim()) return userCustomLinks;
    return userCustomLinks.filter((l) => matchLinkWithQuery(l, filters.searchQuery, categories));
  }, [userCustomLinks, filters.searchQuery, categories]);

  // Smooth scroll to category
  const handleJumpToCategory = (categoryId: string) => {
    if (categoryId === 'custom-vault') {
      const el = document.getElementById('cat-section-custom-vault');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    if (filters.selectedCategory !== 'all' && filters.selectedCategory !== categoryId) {
      setFilters((prev) => ({ ...prev, selectedCategory: 'all' }));
    }
    setTimeout(() => {
      const el = document.getElementById(`cat-section-${categoryId}`) || document.getElementById(`tg-group-${categoryId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Export JSON Backup
  const handleExportData = () => {
    const data = {
      app: 'LINK_BOX',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      links,
      categories,
      favorites,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkbox-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported backup successfully!');
  };

  // Cross-region & cross-filter intelligent locate handler
  const handleLocateLink = (link: LinkItem) => {
    // 1. Check if the link matches the currently active region
    const matchesRegion = isLinkMatchingRegion(link.regions, selectedRegion);

    // Automatically switch region if link belongs to a different country
    if (!matchesRegion) {
      const targetRegion = (link.regions || []).find((r) => r.toLowerCase() !== 'global');
      if (targetRegion) {
        setSelectedRegion(targetRegion);
        showToast(`Switched region to ${targetRegion} to locate "${link.title}"`, 'info');
      } else {
        setSelectedRegion('all');
        showToast(`Switched to Global region to locate "${link.title}"`, 'info');
      }
    }

    // Reset restricting filters to ensure the card is rendered in the DOM
    setFilters((prev) => ({
      ...prev,
      selectedCategory: 'all',
      onlyFavorites: false,
      selectedBadge: 'all',
    }));

    // Smoothly scroll and highlight the target element
    setTimeout(() => {
      const success = locateLinkOnPage(link.id);
      if (!success) {
        const catEl = document.getElementById(`cat-section-${link.category}`) || document.getElementById(`tg-group-${link.category}`);
        if (catEl) {
          catEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 120);
  };

  // Import JSON Backup
  const handleImportData = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.links && Array.isArray(parsed.links)) {
          setLinks(parsed.links);
          if (parsed.categories) setCategories(parsed.categories);
          if (parsed.favorites) setFavorites(parsed.favorites);
          showToast('Imported links successfully!');
        } else {
          showToast('Invalid backup file format.', 'info');
        }
      } catch (err) {
        showToast('Failed to parse JSON file.', 'info');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Background style based on theme
  const getThemeContainerClass = () => {
    switch (theme) {
      case 'midnight':
        return 'bg-[#05060b] text-[#f1f5f9]';
      case 'cyberpunk':
        return 'bg-[#080816] text-[#e0e7ff]';
      case 'light':
        return 'bg-[#f8fafc] text-[#0f172a]';
      case 'dark':
      default:
        return 'bg-[#0b0c16] text-[#e2e8f0]';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeContainerClass()} font-sans selection:bg-purple-600 selection:text-white transition-colors duration-300 pb-16 relative`}>
      {/* Visual Reading Progress Indicator at top of viewport */}
      <ScrollProgressBar />

      {/* Hidden File Input for JSON Backup Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Main Container */}
      <main className="w-full px-3 sm:px-6 py-2">
        {/* Top Hero Section with Stats Bar & Announcements (Point 1 & Point 3) */}
        <HeroSection
          totalLinks={regionalScopeLinks.length}
          totalCategories={activeCategoriesCount}
          totalRegions={activeRegionsCount}
          selectedRegion={selectedRegion}
          onSelectRegion={(reg) => {
            setSelectedRegion(reg);
            showToast(`Region set to: ${reg === 'all' ? 'Global (All)' : reg}`);
          }}
          onOpenSupportModal={() => setIsSupportOpen(true)}
          onOpenAutoSyncModal={() => setIsAutoSyncOpen(true)}
        />

        {/* Recently Visited Links Row (as in PDF) */}
        <RecentlyVisited
          recentLinks={recentLinks}
          onVisit={handleVisitLink}
          onClear={handleClearRecent}
        />

        {/* Popular Trends Widget using Recharts (Top 5 most clicked categories past 30 days) */}
        <PopularTrendsWidget
          categories={categories}
          links={regionalScopeLinks}
          selectedCategory={filters.selectedCategory}
          onSelectCategory={(catId) => setFilters((prev) => ({ ...prev, selectedCategory: catId }))}
          onOpenExportCSV={() => setIsExportAnalyticsOpen(true)}
        />

        {/* Search, Filter Tabs & View Mode Switcher */}
        <SearchAndFilters
          categories={categories}
          links={regionalScopeLinks}
          filters={filters}
          onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
          favoritesCount={favorites.length}
          totalFilteredCount={sortedLinks.length}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenAutoSyncModal={() => setIsAutoSyncOpen(true)}
          onLocateLink={handleLocateLink}
        />

        {/* Active Favorites Mode Banner */}
        {filters.onlyFavorites && (
          <div className="max-w-5xl mx-auto mb-6 bg-gradient-to-r from-amber-950/60 via-purple-950/40 to-amber-950/60 border border-amber-500/40 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>Starred Websites View</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                    {sortedLinks.length} Starred
                  </span>
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Showing only the websites you have personally starred. Click the star icon on any card to add or remove it.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, onlyFavorites: false }))}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 transition-colors cursor-pointer"
              >
                Show All Sites
              </button>
              {favorites.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFavorites([]);
                    showToast('Cleared all starred favorites.');
                  }}
                  className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Clear All Stars
                </button>
              )}
            </div>
          </div>
        )}

        {/* Empty Search / Empty Favorites State */}
        {sortedLinks.length === 0 && (
          <div className="max-w-md mx-auto text-center py-16 px-4 bg-[#121528] border border-[#2b315c] rounded-2xl my-8">
            <div className="w-12 h-12 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto mb-3">
              {filters.onlyFavorites ? (
                <Star className="w-6 h-6 text-amber-400 fill-amber-400/30" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {filters.onlyFavorites ? 'No Starred Websites Yet' : 'No links matched your search'}
            </h3>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              {filters.onlyFavorites
                ? 'You currently have no websites in your Star list. Click the ★ Star icon on the top-right corner of any link card to bookmark your favorite sites.'
                : 'Try searching with another keyword, clearing filters, or adding a new custom link.'}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    searchQuery: '',
                    selectedCategory: 'all',
                    selectedRegion: 'all',
                    selectedBadge: 'all',
                    sortBy: 'default',
                    onlyFavorites: false,
                    viewMode: 'grid',
                  })
                }
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-xs font-semibold rounded-lg text-white cursor-pointer"
              >
                {filters.onlyFavorites ? 'Explore All Sites' : 'Reset All Filters'}
              </button>
              {!filters.onlyFavorites && (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded-lg text-white flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add This Link</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Dedicated Custom Links & Logo Studio Section (खुलका कस्टमाइज लिंक और लोगो सेक्शन) */}
        {filters.selectedCategory === 'all' && !filters.onlyFavorites && (
          <CustomVaultSection
            customLinks={filteredCustomLinks}
            categories={categories}
            onAddLink={handleAddLink}
            onUpdateLink={handleUpdateLink}
            onDeleteLink={handleDeleteLink}
            onVisit={handleVisitLink}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            onAddCategory={handleAddCategory}
            onShowQr={(link) => setQrModalLink(link)}
            onReact={handleReact}
            userReactions={userReactions}
            reactionCounts={reactionCounts}
            isVaultPrivacyAutoCleanEnabled={isVaultPrivacyAutoCleanEnabled}
            onToggleVaultPrivacyAutoClean={handleToggleVaultPrivacyAutoClean}
            onOpenPrivacySettings={() => setIsPrivacySettingsOpen(true)}
            onOpenExportCSV={() => setIsExportAnalyticsOpen(true)}
          />
        )}

        {/* Content View: Grid (PDF Style) vs Telegram Channels Feed View */}
        {filters.viewMode === 'telegram' ? (
          <TelegramGroupView
            categories={categories}
            links={sortedLinks}
            onVisit={handleVisitLink}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            onEditLink={(link) => setEditingLink(link)}
            onDeleteLink={handleDeleteLink}
            onShowQr={(link) => setQrModalLink(link)}
          />
        ) : (
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryLinks = sortedLinks.filter((l) => l.category === category.id);
              return (
                <CategorySection
                  key={category.id}
                  category={category}
                  links={categoryLinks}
                  onVisit={handleVisitLink}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                  onEditLink={(link) => setEditingLink(link)}
                  onDeleteLink={handleDeleteLink}
                  onShowQr={(link) => setQrModalLink(link)}
                  onReact={handleReact}
                  userReactions={userReactions}
                  reactionCounts={reactionCounts}
                />
              );
            })}
          </div>
        )}

        {/* Footer (Matching PDF Page 4) */}
        <Footer
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenRequest={() => setIsRequestOpen(true)}
          onOpenDmca={() => setIsDmcaOpen(true)}
          onExportData={handleExportData}
          onExportCSV={() => setIsExportAnalyticsOpen(true)}
          onImportData={handleImportData}
        />
      </main>

      {/* Bottom Floating Bar & Jump Action (Matching PDF Page 2 & Page 1) */}
      <BottomFloatingBar
        onOpenJumpModal={() => setIsJumpModalOpen(true)}
        onOpenAboutModal={() => setIsAboutOpen(true)}
        onOpenRequestModal={() => setIsRequestOpen(true)}
        onOpenDmcaModal={() => setIsDmcaOpen(true)}
        onOpenSupportModal={() => setIsSupportOpen(true)}
        onFocusSearch={() => {
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        selectedRegion={selectedRegion}
        onSelectRegion={(reg) => {
          setSelectedRegion(reg);
          showToast(`Region set to: ${reg === 'all' ? 'Global' : reg}`);
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onScrollToTop={handleScrollToTop}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenAutoSyncModal={() => setIsAutoSyncOpen(true)}
        onExportData={handleExportData}
        onExportCSV={() => setIsExportAnalyticsOpen(true)}
        onOpenPrivacySettings={() => setIsPrivacySettingsOpen(true)}
      />

      {/* Modals */}
      <PrivacySettingsModal
        isOpen={isPrivacySettingsOpen}
        onClose={() => setIsPrivacySettingsOpen(false)}
        isVaultPrivacyAutoCleanEnabled={isVaultPrivacyAutoCleanEnabled}
        onToggleVaultPrivacyAutoClean={handleToggleVaultPrivacyAutoClean}
        onClearRecentHistory={() => {
          setRecentLinks([]);
          showToast('Recently visited history cleared', 'info');
        }}
        onClearSearchHistory={() => {
          setFilters((prev) => ({
            ...prev,
            searchQuery: '',
            selectedBadge: 'all',
            selectedCategory: 'all',
          }));
          showToast('Search filters reset', 'info');
        }}
      />
      <AutoSyncModal
        isOpen={isAutoSyncOpen}
        onClose={() => setIsAutoSyncOpen(false)}
        links={links}
        onLinksUpdated={(updated, count, msg) => {
          setLinks(updated);
          showToast(msg, 'success');
        }}
      />

      <AddLinkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        onAddLink={handleAddLink}
        onAddCategory={handleAddCategory}
      />

      <EditLinkModal
        isOpen={!!editingLink}
        link={editingLink}
        onClose={() => setEditingLink(null)}
        onUpdateLink={handleUpdateLink}
        onDeleteLink={handleDeleteLink}
        categories={categories}
      />

      <QrCodeModal
        isOpen={!!qrModalLink}
        link={qrModalLink}
        onClose={() => setQrModalLink(null)}
      />

      <JumpModal
        isOpen={isJumpModalOpen}
        onClose={() => setIsJumpModalOpen(false)}
        categories={categories}
        counts={categoryCounts}
        onJumpToCategory={handleJumpToCategory}
      />

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <RequestModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />
      <DmcaModal isOpen={isDmcaOpen} onClose={() => setIsDmcaOpen(false)} />
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
      <ExportAnalyticsModal
        isOpen={isExportAnalyticsOpen}
        onClose={() => setIsExportAnalyticsOpen(false)}
        links={links}
        categories={categories}
        favorites={favorites}
        userReactions={userReactions}
      />

      {/* Toast popup */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#161a35] border border-purple-500/60 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
