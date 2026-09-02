import React, { useState, useMemo } from 'react';
import { CategoryGroup, LinkItem, ReactionType, BadgeColorConfig } from '../types';
import { LinkCard } from './LinkCard';
import { getCategoryIcon } from '../utils/icons';
import { 
  enrichLinkWithBadge, 
  getBadgeColorConfig, 
  saveCustomBadgeColor, 
  resetBadgeColors,
  BADGE_THEME_PRESETS,
  BadgeSvgIcon
} from '../utils/badgeManager';
import { Palette, Sparkles, Filter, RotateCcw, Check, Sliders, X, ChevronDown } from 'lucide-react';

interface CategorySectionProps {
  category: CategoryGroup;
  links: LinkItem[];
  onVisit: (link: LinkItem) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  onEditLink?: (link: LinkItem) => void;
  onDeleteLink?: (id: string) => void;
  onShowQr?: (link: LinkItem) => void;
  onReact?: (linkId: string, type: ReactionType) => void;
  userReactions?: Record<string, ReactionType | null>;
  reactionCounts?: Record<string, { heart: number; zap: number; like: number }>;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  links,
  onVisit,
  onToggleFavorite,
  favorites,
  onEditLink,
  onDeleteLink,
  onShowQr,
  onReact,
  userReactions = {},
  reactionCounts = {},
}) => {
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<string | null>(null);
  const [isColorManagerOpen, setIsColorManagerOpen] = useState(false);
  const [activeEditingBadge, setActiveEditingBadge] = useState<string>('HD');
  const [colorRevision, setColorRevision] = useState(0); // Trigger re-render on color update

  // Custom colors state for the editor
  const [customBg, setCustomBg] = useState('#18181b');
  const [customText, setCustomText] = useState('#38bdf8');
  const [customBorder, setCustomBorder] = useState('#0284c7');

  // 1. Badge Manager Logic: Automatically evaluate and assign dynamic badges based on link metadata,
  // replacing any 'none' or missing badge states to ensure maximum UI information density.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const processedLinks = useMemo(() => {
    return links.map((link) => enrichLinkWithBadge(link));
  }, [links, colorRevision]);

  // Extract distinct badges and their counts within this category
  const badgeCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of processedLinks) {
      if (l.badge) {
        map.set(l.badge, (map.get(l.badge) || 0) + 1);
      }
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [processedLinks]);

  // Filter links if a specific badge filter is active
  const displayedLinks = useMemo(() => {
    if (!selectedBadgeFilter) return processedLinks;
    return processedLinks.filter((l) => l.badge?.toUpperCase() === selectedBadgeFilter.toUpperCase());
  }, [processedLinks, selectedBadgeFilter]);

  if (links.length === 0) return null;

  const handleOpenColorManager = (badgeName: string) => {
    setActiveEditingBadge(badgeName);
    const current = getBadgeColorConfig(badgeName);
    setCustomBg(current.bg);
    setCustomText(current.text);
    setCustomBorder(current.border);
    setIsColorManagerOpen(true);
  };

  const handleApplyPreset = (preset: typeof BADGE_THEME_PRESETS[0]) => {
    setCustomBg(preset.bg);
    setCustomText(preset.text);
    setCustomBorder(preset.border);
    saveCustomBadgeColor(activeEditingBadge, {
      bg: preset.bg,
      text: preset.text,
      border: preset.border,
      glow: preset.glow,
      iconColor: preset.text,
    });
    setColorRevision((prev) => prev + 1);
  };

  const handleSaveCustomColor = () => {
    saveCustomBadgeColor(activeEditingBadge, {
      bg: customBg,
      text: customText,
      border: customBorder,
      iconColor: customText,
      glow: `${customBorder}66`,
    });
    setColorRevision((prev) => prev + 1);
  };

  const handleResetColors = () => {
    resetBadgeColors();
    setColorRevision((prev) => prev + 1);
    const resetCfg = getBadgeColorConfig(activeEditingBadge);
    setCustomBg(resetCfg.bg);
    setCustomText(resetCfg.text);
    setCustomBorder(resetCfg.border);
  };

  return (
    <section 
      id={`cat-section-${category.id}`} 
      className="mb-10 max-w-5xl mx-auto scroll-mt-24"
    >
      {/* Category Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-3 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="text-purple-400">
            {getCategoryIcon(category.icon, 'w-5 h-5')}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {category.name}
          </h2>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-[#1e2244] text-purple-300 rounded-md border border-[#333b70]">
            {displayedLinks.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs text-zinc-400 font-normal sm:text-right">
            {category.description}
          </p>
        </div>
      </div>

      {/* Badge Manager Strip: Interactive Badge Indicators & Custom Color-Coding Manager */}
      {badgeCounts.length > 0 && (
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4 px-2.5 py-1.5 bg-[#0f1226]/80 border border-white/[0.04] rounded-xl text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-zinc-400 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Badges:</span>
            </span>

            {/* "All" Badge Filter */}
            <button
              type="button"
              onClick={() => setSelectedBadgeFilter(null)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all cursor-pointer ${
                selectedBadgeFilter === null
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-[#181b36] text-zinc-400 hover:text-zinc-200 border border-white/[0.05]'
              }`}
            >
              All ({processedLinks.length})
            </button>

            {/* Dynamic Badge Chips with SVG Icons */}
            {badgeCounts.map(([badgeName, count]) => {
              const cfg = getBadgeColorConfig(badgeName);
              const isSelected = selectedBadgeFilter?.toUpperCase() === badgeName.toUpperCase();
              return (
                <div key={badgeName} className="inline-flex items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedBadgeFilter(isSelected ? null : badgeName)}
                    style={{
                      backgroundColor: cfg.bg,
                      color: cfg.text,
                      borderColor: cfg.border,
                      boxShadow: isSelected ? `0 0 10px ${cfg.border}` : undefined,
                    }}
                    title={`Filter by ${badgeName} (${count} links) - Click to toggle`}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-extrabold uppercase tracking-wider border transition-all cursor-pointer ${
                      isSelected ? 'ring-2 ring-white/50 scale-105' : 'hover:opacity-90'
                    }`}
                  >
                    <BadgeSvgIcon name={badgeName} className="w-2.5 h-2.5 shrink-0" color={cfg.iconColor || cfg.text} />
                    <span>{badgeName}</span>
                    <span className="opacity-70 font-mono text-[8.5px]">({count})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenColorManager(badgeName)}
                    title={`Customize color coding for '${badgeName}' badge`}
                    className="p-1 text-zinc-500 hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    <Palette className="w-2.5 h-2.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Manager Button */}
          <button
            type="button"
            onClick={() => handleOpenColorManager(badgeCounts[0]?.[0] || 'HD')}
            className="flex items-center gap-1 px-2 py-1 bg-[#181c3b] hover:bg-[#20254e] text-purple-300 hover:text-purple-200 border border-purple-500/30 rounded-lg text-[10px] font-bold transition-all cursor-pointer shrink-0"
          >
            <Palette className="w-3 h-3 text-purple-400" />
            <span>Badge Colors</span>
          </button>
        </div>
      )}

      {/* Grid of Link Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {displayedLinks.map((link) => (
          <LinkCard
            key={link.id}
            link={link}
            onVisit={onVisit}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favorites.includes(link.id)}
            onEdit={onEditLink}
            onDelete={onDeleteLink}
            onShowQr={onShowQr}
            onReact={onReact}
            userReaction={userReactions[link.id]}
            reactionCounts={reactionCounts[link.id]}
          />
        ))}
      </div>

      {/* Custom Badge Color Coding Modal / Drawer */}
      {isColorManagerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#101328] border border-[#2b315c] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-zinc-200">
            {/* Header */}
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#151936]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Badge Color Coding Studio (बैज रंग व्यवस्थापक)
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Customize SVG icons and visual color schemes for directory badges.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsColorManagerOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Badge Selector Tabs */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  Select Badge Type to Customize:
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    'HD', '4K', '4K UHD', 'Global', 'Beta', 'Trending', 'HOT', 
                    'Verified', 'Official', 'Premium', 'VIP', 'PRO', 'AI', 'LIVE', 
                    'FAST', 'AD-FREE', 'NEW', 'APP', 'SAFE', 'EXCLUSIVE', 'COMMUNITY', 'DUBBED', 'SUBBED', 'MANGA'
                  ].map((b) => {
                    const cfg = getBadgeColorConfig(b);
                    const isCurrent = activeEditingBadge === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          setActiveEditingBadge(b);
                          const c = getBadgeColorConfig(b);
                          setCustomBg(c.bg);
                          setCustomText(c.text);
                          setCustomBorder(c.border);
                        }}
                        style={{
                          backgroundColor: cfg.bg,
                          color: cfg.text,
                          borderColor: cfg.border,
                        }}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-extrabold uppercase border transition-all cursor-pointer ${
                          isCurrent ? 'ring-2 ring-purple-400 scale-105 shadow-md' : 'opacity-80 hover:opacity-100'
                        }`}
                      >
                        <BadgeSvgIcon name={b} className="w-2.5 h-2.5" color={cfg.iconColor || cfg.text} />
                        <span>{b}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-3.5 bg-[#0a0d1d] border border-white/[0.08] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 block mb-1">Live Badge Preview:</span>
                  <div
                    style={{
                      backgroundColor: customBg,
                      color: customText,
                      borderColor: customBorder,
                      boxShadow: `0 0 12px ${customBorder}88`,
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-black uppercase tracking-wider"
                  >
                    <BadgeSvgIcon name={activeEditingBadge} className="w-3.5 h-3.5" color={customText} />
                    <span>{activeEditingBadge}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetColors}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-rose-400 px-2 py-1 rounded bg-white/[0.04] hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              </div>

              {/* Theme Presets */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-2">
                  One-Click Theme Presets:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BADGE_THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      style={{
                        backgroundColor: preset.bg,
                        color: preset.text,
                        borderColor: preset.border,
                      }}
                      className="p-2 rounded-xl border text-[11px] font-bold text-left hover:scale-[1.02] transition-transform cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span>{preset.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Background:</label>
                  <div className="flex items-center gap-2 bg-[#0b0e1e] p-1.5 rounded-lg border border-white/[0.06]">
                    <input
                      type="color"
                      value={customBg}
                      onChange={(e) => {
                        setCustomBg(e.target.value);
                      }}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={customBg}
                      onChange={(e) => setCustomBg(e.target.value)}
                      className="w-full text-[10px] font-mono bg-transparent text-zinc-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Text & Icon:</label>
                  <div className="flex items-center gap-2 bg-[#0b0e1e] p-1.5 rounded-lg border border-white/[0.06]">
                    <input
                      type="color"
                      value={customText}
                      onChange={(e) => {
                        setCustomText(e.target.value);
                      }}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-full text-[10px] font-mono bg-transparent text-zinc-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1">Border & Glow:</label>
                  <div className="flex items-center gap-2 bg-[#0b0e1e] p-1.5 rounded-lg border border-white/[0.06]">
                    <input
                      type="color"
                      value={customBorder}
                      onChange={(e) => {
                        setCustomBorder(e.target.value);
                      }}
                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={customBorder}
                      onChange={(e) => setCustomBorder(e.target.value)}
                      className="w-full text-[10px] font-mono bg-transparent text-zinc-200 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/[0.08] bg-[#151936] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  handleSaveCustomColor();
                  setIsColorManagerOpen(false);
                }}
                className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-purple-900/30"
              >
                Apply & Save Color Code
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
