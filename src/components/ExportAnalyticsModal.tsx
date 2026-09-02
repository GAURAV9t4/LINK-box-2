import React, { useState, useMemo } from 'react';
import { 
  X, Download, FileSpreadsheet, BarChart3, TrendingUp, 
  Sparkles, Check, Flame, Star, ShieldCheck, Layers, Filter, Eye
} from 'lucide-react';
import { LinkItem, CategoryGroup, ReactionType } from '../types';
import { 
  computeLinkEngagement, 
  computeCategoryEngagement, 
  generateLinkInteractionsCSV, 
  generateCategoryEngagementCSV, 
  generateFullAnalyticsCSV, 
  downloadCSV 
} from '../utils/csvExport';

interface ExportAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: LinkItem[];
  categories: CategoryGroup[];
  favorites: string[];
  userReactions?: Record<string, ReactionType | null>;
}

export const ExportAnalyticsModal: React.FC<ExportAnalyticsModalProps> = ({
  isOpen,
  onClose,
  links,
  categories,
  favorites,
  userReactions = {},
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [onlyCuratedFilter, setOnlyCuratedFilter] = useState<boolean>(false);

  const linkMetrics = useMemo(() => {
    return computeLinkEngagement(links, categories, favorites, userReactions);
  }, [links, categories, favorites, userReactions]);

  const categoryMetrics = useMemo(() => {
    return computeCategoryEngagement(links, categories, favorites);
  }, [links, categories, favorites]);

  // Overall Statistics
  const totalClicks = useMemo(() => {
    return linkMetrics.reduce((sum, m) => sum + m.clicks, 0);
  }, [linkMetrics]);

  const curatedLinks = useMemo(() => {
    return linkMetrics.filter((m) => m.isCustom);
  }, [linkMetrics]);

  const curatedClicks = useMemo(() => {
    return curatedLinks.reduce((sum, m) => sum + m.clicks, 0);
  }, [curatedLinks]);

  const topPerformingLink = useMemo(() => {
    if (linkMetrics.length === 0) return null;
    return [...linkMetrics].sort((a, b) => b.engagementScore - a.engagementScore)[0];
  }, [linkMetrics]);

  const topCuratedLink = useMemo(() => {
    if (curatedLinks.length === 0) return null;
    return [...curatedLinks].sort((a, b) => b.engagementScore - a.engagementScore)[0];
  }, [curatedLinks]);

  // Filtered preview list
  const previewLinks = useMemo(() => {
    let list = [...linkMetrics];
    if (onlyCuratedFilter) {
      list = list.filter((m) => m.isCustom);
    }
    if (filterCategory !== 'all') {
      list = list.filter((m) => m.category.toLowerCase() === filterCategory.toLowerCase());
    }
    return list.sort((a, b) => b.engagementScore - a.engagementScore).slice(0, 8);
  }, [linkMetrics, onlyCuratedFilter, filterCategory]);

  if (!isOpen) return null;

  const triggerDownload = (type: 'full' | 'curated' | 'categories' | 'links') => {
    const timestamp = new Date().toISOString().slice(0, 10);
    let csv = '';
    let filename = '';

    if (type === 'full') {
      csv = generateFullAnalyticsCSV(links, categories, favorites, userReactions);
      filename = `linkbox-full-engagement-report-${timestamp}.csv`;
    } else if (type === 'curated') {
      csv = generateLinkInteractionsCSV(links, categories, favorites, userReactions, true);
      filename = `linkbox-curated-links-performance-${timestamp}.csv`;
    } else if (type === 'categories') {
      csv = generateCategoryEngagementCSV(links, categories, favorites);
      filename = `linkbox-category-engagement-matrix-${timestamp}.csv`;
    } else {
      csv = generateLinkInteractionsCSV(links, categories, favorites, userReactions, false);
      filename = `linkbox-all-links-interactions-${timestamp}.csv`;
    }

    downloadCSV(filename, csv);
    setDownloadSuccess(type);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0e122b] border border-[#262e5e] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] my-auto">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#14193b]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>LINK & CATEGORY ENGAGEMENT CSV EXPORT</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  EXCEL & SHEETS READY
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Analyze traffic, curation success, visits, and category metrics in spreadsheet format
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          
          {/* Key Metrics Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-[#131738] border border-[#273069] rounded-xl">
              <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                <span>Total Catalog Links</span>
              </div>
              <div className="text-lg sm:text-xl font-mono font-black text-white mt-1">
                {linkMetrics.length.toLocaleString()}
              </div>
              <div className="text-[10px] text-purple-300 mt-0.5">Across {categories.length} categories</div>
            </div>

            <div className="p-3 bg-[#131738] border border-[#273069] rounded-xl">
              <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Total Visits/Clicks</span>
              </div>
              <div className="text-lg sm:text-xl font-mono font-black text-amber-300 mt-1">
                {totalClicks.toLocaleString()}
              </div>
              <div className="text-[10px] text-amber-400/80 mt-0.5">Community engagement</div>
            </div>

            <div className="p-3 bg-[#131738] border border-[#273069] rounded-xl">
              <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>My Curated Links</span>
              </div>
              <div className="text-lg sm:text-xl font-mono font-black text-pink-300 mt-1">
                {curatedLinks.length.toLocaleString()}
              </div>
              <div className="text-[10px] text-pink-400/80 mt-0.5">
                {curatedClicks.toLocaleString()} total curated visits
              </div>
            </div>

            <div className="p-3 bg-[#131738] border border-[#273069] rounded-xl">
              <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-400" />
                <span>Total Starred</span>
              </div>
              <div className="text-lg sm:text-xl font-mono font-black text-yellow-300 mt-1">
                {favorites.length}
              </div>
              <div className="text-[10px] text-yellow-400/80 mt-0.5">User favorites saved</div>
            </div>
          </div>

          {/* Top Success Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topPerformingLink && (
              <div className="p-3 bg-[#121633] border border-[#252c61] rounded-xl flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                    🏆 Most Successful Overall Link
                  </span>
                  <div className="text-sm font-bold text-white truncate mt-0.5">{topPerformingLink.title}</div>
                  <div className="text-[11px] text-zinc-400 truncate mt-0.5 font-mono">
                    {topPerformingLink.categoryName} • {topPerformingLink.clicks.toLocaleString()} clicks • Score: {topPerformingLink.engagementScore}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="px-2 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-mono font-bold">
                    #{1} Top
                  </span>
                </div>
              </div>
            )}

            {topCuratedLink ? (
              <div className="p-3 bg-[#161233] border border-[#3e2561] rounded-xl flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider block">
                    💎 Most Successful Curated Link
                  </span>
                  <div className="text-sm font-bold text-white truncate mt-0.5">{topCuratedLink.title}</div>
                  <div className="text-[11px] text-zinc-400 truncate mt-0.5 font-mono">
                    {topCuratedLink.categoryName} • {topCuratedLink.clicks.toLocaleString()} clicks • Score: {topCuratedLink.engagementScore}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="px-2 py-1 bg-pink-950 text-pink-300 border border-pink-800 rounded-lg text-xs font-mono font-bold">
                    Curated ⭐
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#13162e] border border-white/[0.06] rounded-xl flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-zinc-500" />
                <div className="text-xs text-zinc-400">
                  Add curated links in Custom Vault to track their individual engagement and success metrics!
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Buttons: 4 Dedicated CSV Exports */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 uppercase font-mono tracking-wider">
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Select CSV Export Format (1-Click Instant Download)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              {/* Option 1: Full Report */}
              <button
                type="button"
                onClick={() => triggerDownload('full')}
                className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 hover:from-emerald-900 hover:to-teal-900 border border-emerald-500/50 hover:border-emerald-400 text-left transition-all cursor-pointer shadow-md group relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white group-hover:text-emerald-200">
                      Full Engagement Report (.CSV)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 mt-1.5 leading-normal">
                  Dual-section export: Complete Category Engagement Matrix + All {links.length} Links sorted by success score.
                </p>
                {downloadSuccess === 'full' && (
                  <div className="mt-2 text-xs font-bold text-emerald-300 flex items-center gap-1 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>Downloaded Successfully!</span>
                  </div>
                )}
              </button>

              {/* Option 2: Curated Only */}
              <button
                type="button"
                onClick={() => triggerDownload('curated')}
                className="p-3.5 rounded-xl bg-gradient-to-r from-pink-950/80 to-purple-950/80 hover:from-pink-900 hover:to-purple-900 border border-pink-500/50 hover:border-pink-400 text-left transition-all cursor-pointer shadow-md group relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-bold text-white group-hover:text-pink-200">
                      Curated Links Performance (.CSV)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    {curatedLinks.length} Links
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 mt-1.5 leading-normal">
                  Specifically filtered to your custom curated links with click volumes, favorites, status, and tags.
                </p>
                {downloadSuccess === 'curated' && (
                  <div className="mt-2 text-xs font-bold text-pink-300 flex items-center gap-1 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>Curated CSV Downloaded!</span>
                  </div>
                )}
              </button>

              {/* Option 3: Category Engagement Matrix */}
              <button
                type="button"
                onClick={() => triggerDownload('categories')}
                className="p-3.5 rounded-xl bg-[#141838] hover:bg-[#1a204a] border border-[#2b356e] hover:border-indigo-400 text-left transition-all cursor-pointer shadow-md group relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white group-hover:text-indigo-200">
                      Category Engagement Matrix (.CSV)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {categoryMetrics.length} Categories
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1.5 leading-normal">
                  Category-level totals: clicks, traffic share %, average clicks per link, and top winning title per genre.
                </p>
                {downloadSuccess === 'categories' && (
                  <div className="mt-2 text-xs font-bold text-indigo-300 flex items-center gap-1 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>Category Matrix Downloaded!</span>
                  </div>
                )}
              </button>

              {/* Option 4: All Raw Itemized Links */}
              <button
                type="button"
                onClick={() => triggerDownload('links')}
                className="p-3.5 rounded-xl bg-[#141838] hover:bg-[#1a204a] border border-[#2b356e] hover:border-cyan-400 text-left transition-all cursor-pointer shadow-md group relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white group-hover:text-cyan-200">
                      All Itemized Links Activity (.CSV)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Raw Table
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1.5 leading-normal">
                  Full list with URL, domain, regions, reactions, badges, clicks, and engagement ranking.
                </p>
                {downloadSuccess === 'links' && (
                  <div className="mt-2 text-xs font-bold text-cyan-300 flex items-center gap-1 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>Links CSV Downloaded!</span>
                  </div>
                )}
              </button>

            </div>
          </div>

          {/* Live Data Preview Table */}
          <div className="space-y-2 pt-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 font-mono">
                <Eye className="w-3.5 h-3.5 text-purple-400" />
                <span>Live Data Preview (Top Ranked Links)</span>
              </div>

              {/* Filter Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOnlyCuratedFilter(!onlyCuratedFilter)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                    onlyCuratedFilter
                      ? 'bg-pink-950 border-pink-500 text-pink-300'
                      : 'bg-[#121633] border-[#293264] text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Curated Only</span>
                </button>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-[#121633] border border-[#293264] text-zinc-300 text-xs rounded-lg px-2 py-1 cursor-pointer focus:outline-hidden focus:border-purple-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preview Table */}
            <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-[#0a0d20]">
              <div className="overflow-x-auto max-h-56">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#131738] text-zinc-400 border-b border-white/[0.08] sticky top-0 font-mono">
                    <tr>
                      <th className="p-2.5">Rank & Title</th>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5 text-right">Clicks</th>
                      <th className="p-2.5 text-right">Success Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {previewLinks.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-2.5 max-w-[200px] truncate font-medium text-zinc-200">
                          <span className="text-zinc-500 font-mono mr-1.5">#{idx + 1}</span>
                          {item.title}
                        </td>
                        <td className="p-2.5 text-zinc-400">{item.categoryName}</td>
                        <td className="p-2.5">
                          {item.isCustom ? (
                            <span className="px-1.5 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800 text-[10px] font-mono">
                              Curated
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono">
                              Verified
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-right font-mono text-amber-300">
                          {item.clicks.toLocaleString()}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-400">
                          {item.engagementScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-white/[0.08] bg-[#14193b] flex items-center justify-between">
          <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
            Compatible with Microsoft Excel, Google Sheets, LibreOffice & Tableau
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => triggerDownload('full')}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Full CSV</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
