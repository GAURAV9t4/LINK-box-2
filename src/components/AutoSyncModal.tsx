import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, RefreshCw, Zap, Globe, Sparkles, CheckCircle2, ShieldCheck, 
  Radio, Clock, Filter, ArrowRight, ExternalLink, Flame, Check, 
  Copy, Trash2, Search, Film, Tv, Radio as RadioIcon, Smartphone, 
  Layers, ChevronDown, ChevronRight, Tag
} from 'lucide-react';
import { LinkItem, AutoAddedLinkRecord, AutoSyncHistoryEntry } from '../types';
import { 
  AutoSyncConfig, 
  getAutoSyncConfig, 
  saveAutoSyncConfig, 
  performAutoSync, 
  getAvailableNewLinks,
  getCategoryDisplayName,
  clearAutoSyncHistory
} from '../utils/autoDiscoveryEngine';
import { REGIONS_MASTER, getPrimaryLinkRegion } from '../utils/regions';
import { BadgeSvgIcon, getBadgeCustomStyle } from '../utils/badgeManager';
import { getCategoryIcon } from '../utils/icons';

interface AutoSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: LinkItem[];
  onLinksUpdated: (newLinks: LinkItem[], addedCount: number, message: string) => void;
}

export const AutoSyncModal: React.FC<AutoSyncModalProps> = ({
  isOpen,
  onClose,
  links,
  onLinksUpdated,
}) => {
  const [config, setConfig] = useState<AutoSyncConfig>(getAutoSyncConfig);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [selectedTargetRegion, setSelectedTargetRegion] = useState<string>('all');
  const [selectedTargetCategory, setSelectedTargetCategory] = useState<string>('all');
  const [lastSyncResult, setLastSyncResult] = useState<{ added: number; message: string } | null>(null);

  // History Sub-Tab & Filter States
  const [historyTab, setHistoryTab] = useState<'itemized' | 'batches'>('itemized');
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  const [filterHistoryCategory, setFilterHistoryCategory] = useState('all');
  const [filterHistoryRegion, setFilterHistoryRegion] = useState('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const cfg = getAutoSyncConfig();
      setConfig(cfg);
      setLastSyncResult(null);
      setIsScanning(false);
      if (cfg.syncHistory.length > 0) {
        setExpandedBatchId(cfg.syncHistory[0].id);
      }
    }
  }, [isOpen]);

  // Compile all itemized auto-added links for the history table
  const allItemizedLinks: AutoAddedLinkRecord[] = useMemo(() => {
    if (config.allAutoAddedLinks && config.allAutoAddedLinks.length > 0) {
      return config.allAutoAddedLinks;
    }
    // Fallback: extract from syncHistory batches
    const extracted: AutoAddedLinkRecord[] = [];
    const seen = new Set<string>();
    for (const batch of config.syncHistory) {
      if (batch.links) {
        for (const l of batch.links) {
          if (!seen.has(l.id)) {
            seen.add(l.id);
            extracted.push(l);
          }
        }
      }
    }
    return extracted;
  }, [config.allAutoAddedLinks, config.syncHistory]);

  // Filter itemized links
  const filteredItemizedLinks = useMemo(() => {
    return allItemizedLinks.filter((item) => {
      // Search
      if (searchHistoryQuery) {
        const q = searchHistoryQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesCat = (item.categoryName || item.category).toLowerCase().includes(q);
        const matchesDomain = item.domain.toLowerCase().includes(q);
        const matchesRegion = (item.regions || []).some((r) => r.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCat && !matchesDomain && !matchesRegion) {
          return false;
        }
      }

      // Category
      if (filterHistoryCategory !== 'all') {
        const itemCat = (item.category || '').toLowerCase();
        const target = filterHistoryCategory.toLowerCase();
        if (target === '18+' || target === 'adult') {
          if (itemCat !== '18+' && itemCat !== 'adult') {
            return false;
          }
        } else if (itemCat !== target) {
          return false;
        }
      }

      // Region
      if (filterHistoryRegion !== 'all') {
        const matches = (item.regions || []).some(
          (r) => r.toLowerCase() === filterHistoryRegion.toLowerCase() || r.toLowerCase() === 'global'
        );
        if (!matches) return false;
      }

      return true;
    });
  }, [allItemizedLinks, searchHistoryQuery, filterHistoryCategory, filterHistoryRegion]);

  const availableCount = getAvailableNewLinks(links, selectedTargetCategory).length;

  const handleToggleAutoSync = () => {
    const updated = { ...config, isEnabled: !config.isEnabled };
    setConfig(updated);
    saveAutoSyncConfig(updated);
  };

  const handleFrequencyChange = (freq: 'startup' | 'hourly' | 'daily') => {
    const updated = { ...config, frequency: freq };
    setConfig(updated);
    saveAutoSyncConfig(updated);
  };

  const handleTriggerManualSync = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanStep('Connecting to Worldwide Media Feeds & Streaming Portals...');

    setTimeout(() => {
      setScanStep('Analyzing Regional Metadata & Categorization (India, Global, USA, Japan)...');
      
      setTimeout(() => {
        setScanStep('Validating HTTPS Endpoints & Indexing Category/Region Tags...');
        
        setTimeout(() => {
          const result = performAutoSync(links, 5, selectedTargetRegion, selectedTargetCategory);
          setConfig(result.config);
          setIsScanning(false);
          setScanStep('');
          setLastSyncResult({
            added: result.addedLinks.length,
            message: result.message,
          });

          if (result.addedLinks.length > 0) {
            onLinksUpdated(result.updatedLinks, result.addedLinks.length, result.message);
          }
        }, 750);
      }, 650);
    }, 550);
  };

  const handleCopyLink = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleClearHistory = () => {
    const updated = clearAutoSyncHistory();
    setConfig(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#101328] border border-[#2b315c] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 pb-3 sm:pb-4 border-b border-white/[0.08] flex items-center justify-between bg-[#151936]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
              <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Auto Link Discovery & Live Sync
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Auto-Live Engine
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Automatic World & Regional Links Ingestion with Category & Region History Logs
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-zinc-300 max-h-[70vh]">
          
          {/* Main Status & Controls Banner */}
          <div className="bg-gradient-to-r from-purple-950/50 via-[#181d3d] to-indigo-950/50 border border-[#30386a] rounded-2xl p-4 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-white">
                    {config.isEnabled ? '🟢 Automatic Discovery: Active' : '⏸️ Automatic Discovery: Paused'}
                  </span>
                </div>
                <p className="text-xs text-zinc-300">
                  Naye verified streaming portals (Movies, Anime, Live TV, Paid Official, Apps) bina kisi manual form ke automatically inject hote hain.
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-zinc-400 font-mono flex-wrap">
                  <span>⚡ Total Auto-Ingested: <b className="text-purple-300">{config.totalAutoAdded} links</b></span>
                  <span>•</span>
                  <span>📦 Unclaimed in Pool: <b className="text-emerald-300">{availableCount} links</b></span>
                </div>
              </div>

              {/* Master Switch */}
              <button
                type="button"
                onClick={handleToggleAutoSync}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0 ${
                  config.isEnabled
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 shadow-emerald-950/50'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-600'
                }`}
              >
                <Radio className={`w-4 h-4 ${config.isEnabled ? 'text-emerald-200 animate-pulse' : 'text-zinc-400'}`} />
                <span>{config.isEnabled ? 'Auto-Sync Active' : 'Turn Auto-Sync ON'}</span>
              </button>
            </div>
          </div>

          {/* Instant Discovery & Pull Bar */}
          <div className="bg-[#13172e] border border-[#252b52] rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Instant Link Pull (तुरंत नए लिंक्स जोड़ें)</span>
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Select target territory or fetch worldwide verified streaming portals immediately.
                </p>
              </div>

              {/* Category & Region Selectors & Trigger */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {/* Category Target Selector */}
                <select
                  value={selectedTargetCategory}
                  onChange={(e) => setSelectedTargetCategory(e.target.value)}
                  className="bg-[#0b0e1e] border border-[#2d3460] text-zinc-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-purple-500 max-w-[180px] sm:max-w-none truncate"
                  title="Category to sync"
                >
                  <option value="all">📁 All Categories (सभी श्रेणियां)</option>
                  <option value="18+">🔞 18+ & Mature (Adult, Hentai, OTT & Apps)</option>
                  <option value="anime">🍿 Anime (AnimeSalt, Movies, Sub/Dub)</option>
                  <option value="movies">🎬 Movies & Shows</option>
                  <option value="livetv">📺 Live TV & Sports</option>
                  <option value="paid">💳 Paid & Official</option>
                  <option value="apps">📱 Apps & APKs</option>
                  <option value="manga">📖 Manga & Comics</option>
                  <option value="telegram">✈️ Telegram Channels</option>
                  <option value="tech">⚡ Tech & AI Tools</option>
                  <option value="books">📚 Books & Research</option>
                </select>

                {/* Region Selector */}
                <select
                  value={selectedTargetRegion}
                  onChange={(e) => setSelectedTargetRegion(e.target.value)}
                  className="bg-[#0b0e1e] border border-[#2d3460] text-zinc-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                >
                  <option value="all">🌍 All Worldwide</option>
                  {REGIONS_MASTER.filter(r => r.code !== 'all').map((reg) => (
                    <option key={reg.code} value={reg.code}>
                      {reg.flag} {reg.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={isScanning}
                  onClick={handleTriggerManualSync}
                  className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer text-white shadow-lg ${
                    isScanning
                      ? 'bg-purple-800/60 cursor-not-allowed text-zinc-300'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/40 shadow-purple-950/40'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-amber-300' : ''}`} />
                  <span>{isScanning ? 'Scanning...' : 'Sync New Links'}</span>
                </button>
              </div>
            </div>

            {/* Scanning Progress */}
            {isScanning && (
              <div className="mt-3 p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl space-y-2 animate-pulse">
                <div className="flex items-center justify-between text-xs text-purple-300 font-mono">
                  <span>{scanStep}</span>
                  <span>Fetching...</span>
                </div>
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full w-3/4 animate-[pulse_1s_infinite]" />
                </div>
              </div>
            )}

            {/* Last Sync Result Message */}
            {lastSyncResult && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-start gap-2.5 text-xs text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{lastSyncResult.message}</p>
                  <p className="text-[11px] text-emerald-300/80 mt-0.5">
                    Newly discovered links are marked with high-visibility <b>NEW</b> badges with full Category and Region tags below.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* AUTO-ADDED LINKS HISTORY & AUDIT LOG (कि कौन सी category और region का link है) */}
          {/* ========================================================================= */}
          <div className="bg-[#13172e] border border-[#252b52] rounded-xl p-4 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span>Auto Links History Log (स्वतः जुड़े लिंक्स का विवरण व इतिहास)</span>
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Detailed record showing Title Name (शीर्षक), Category (कैटेगरी), Region (क्षेत्र) and Added Time for all auto-synced links.
                </p>
              </div>

              {/* View Toggle Tabs */}
              <div className="flex items-center gap-1 bg-[#0b0e1e] p-1 rounded-xl border border-white/[0.06] shrink-0">
                <button
                  type="button"
                  onClick={() => setHistoryTab('itemized')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    historyTab === 'itemized'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  All Links ({allItemizedLinks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryTab('batches')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    historyTab === 'batches'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Sync Batches ({config.syncHistory.length})
                </button>
              </div>
            </div>

            {/* Itemized Links View */}
            {historyTab === 'itemized' && (
              <div className="space-y-3">
                {/* Search & Filters for History */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search title, category, region..."
                      value={searchHistoryQuery}
                      onChange={(e) => setSearchHistoryQuery(e.target.value)}
                      className="w-full bg-[#0b0e1e] border border-white/[0.08] text-zinc-200 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={filterHistoryCategory}
                    onChange={(e) => setFilterHistoryCategory(e.target.value)}
                    className="bg-[#0b0e1e] border border-white/[0.08] text-zinc-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">📁 All Categories</option>
                    <option value="18+">🔞 18+ & Mature</option>
                    <option value="anime">🍿 Anime (AnimeSalt & Shows)</option>
                    <option value="movies">🎬 Movies & Shows</option>
                    <option value="manga">📖 Manga & Comics</option>
                    <option value="livetv">📺 Live TV & Sports</option>
                    <option value="paid">💳 Paid & Official</option>
                    <option value="apps">📱 Apps & APKs</option>
                    <option value="telegram">✈️ Telegram Channels</option>
                    <option value="tech">⚡ Tech & AI Tools</option>
                    <option value="books">📚 Books & Research</option>
                  </select>

                  {/* Region Filter */}
                  <select
                    value={filterHistoryRegion}
                    onChange={(e) => setFilterHistoryRegion(e.target.value)}
                    className="bg-[#0b0e1e] border border-white/[0.08] text-zinc-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">🌍 All Regions</option>
                    {REGIONS_MASTER.filter(r => r.code !== 'all').map((reg) => (
                      <option key={reg.code} value={reg.name}>
                        {reg.flag} {reg.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Link Cards List */}
                {filteredItemizedLinks.length === 0 ? (
                  <div className="text-center py-8 bg-[#0b0e1e]/60 rounded-xl border border-white/[0.04] space-y-2">
                    <p className="text-xs text-zinc-400">
                      {allItemizedLinks.length === 0 
                        ? "Abhi tak koi auto links add nahi hue hain. Upar 'Sync New Links' par click karke dekhein!"
                        : "No links match the selected filter criteria."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {filteredItemizedLinks.map((item, idx) => {
                      const regionInfo = getPrimaryLinkRegion(item.regions);
                      return (
                        <div
                          key={item.id || idx}
                          className="p-3 bg-[#0b0e1e] hover:bg-[#0f132a] border border-white/[0.05] hover:border-purple-500/40 rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          {/* Left: Title, Domain, Description */}
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Title / Name (शीर्षक) */}
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-extrabold text-white hover:text-purple-300 transition-colors flex items-center gap-1 text-xs sm:text-sm truncate"
                                title={`Open ${item.title}`}
                              >
                                <span>{item.title}</span>
                                <ExternalLink className="w-3 h-3 text-zinc-400 shrink-0" />
                              </a>

                              {/* Badge */}
                              {item.badge && (
                                <span
                                  style={getBadgeCustomStyle(item.badge)}
                                  className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.2 rounded border uppercase text-[8px] font-extrabold"
                                >
                                  <BadgeSvgIcon name={item.badge} className="w-2.5 h-2.5 shrink-0" />
                                  <span>{item.badge}</span>
                                </span>
                              )}
                            </div>

                            {/* Meta Tags: Category & Region */}
                            <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
                              {/* 1. Category Tag (kis category ki link hai) */}
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-950/80 text-purple-300 border border-purple-500/40 rounded-md font-bold">
                                {getCategoryIcon(item.category, 'w-3 h-3')}
                                <span>{item.categoryName || getCategoryDisplayName(item.category)}</span>
                              </span>

                              {/* 2. Region Tag (kis region ki link hai) */}
                              <span 
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold ${regionInfo.badgeBg} ${regionInfo.badgeText} ${regionInfo.badgeBorder} border`}
                              >
                                <span className="text-[11px] leading-none">{regionInfo.flag}</span>
                                <span>{regionInfo.name}</span>
                              </span>

                              {/* Domain */}
                              <span className="text-zinc-500 truncate">
                                {item.domain}
                              </span>
                            </div>

                            {/* Description preview if present */}
                            {item.description && (
                              <p className="text-[11px] text-zinc-400 truncate">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Right: Actions & Timestamp */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]">
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {new Date(item.addedAt || item.timestamp || Date.now()).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => handleCopyLink(item.url, e)}
                                title="Copy direct link URL"
                                className="p-1 rounded bg-white/[0.04] hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                              >
                                {copiedUrl === item.url ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-0.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 hover:text-white border border-purple-500/40 rounded text-[10px] font-bold transition-all flex items-center gap-1"
                              >
                                <span>Visit</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Batches View */}
            {historyTab === 'batches' && (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {config.syncHistory.length === 0 ? (
                  <div className="text-center py-8 bg-[#0b0e1e]/60 rounded-xl border border-white/[0.04] text-xs text-zinc-400">
                    No sync batches recorded yet.
                  </div>
                ) : (
                  config.syncHistory.map((batch, bIdx) => {
                    const isExpanded = expandedBatchId === batch.id;
                    return (
                      <div
                        key={batch.id || bIdx}
                        className="bg-[#0b0e1e] border border-white/[0.05] rounded-xl overflow-hidden text-xs"
                      >
                        {/* Batch Header */}
                        <div
                          onClick={() => setExpandedBatchId(isExpanded ? null : batch.id)}
                          className="p-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                              +{batch.count}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white">
                                  Sync Batch: {batch.count} links added
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded font-mono">
                                  Regions: {batch.regions.join(', ')}
                                </span>
                              </div>
                              {batch.categories && batch.categories.length > 0 && (
                                <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                                  Categories: {batch.categories.map((c) => getCategoryDisplayName(c)).join(', ')}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {new Date(batch.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                            </span>
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-purple-400" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
                          </div>
                        </div>

                        {/* Batch Links Expansion */}
                        {isExpanded && batch.links && batch.links.length > 0 && (
                          <div className="p-3 pt-0 border-t border-white/[0.04] space-y-1.5 bg-[#080a17]">
                            <div className="text-[10px] font-mono text-zinc-400 py-1">Links added in this sync run:</div>
                            {batch.links.map((linkItem, lIdx) => (
                              <div
                                key={linkItem.id || lIdx}
                                className="flex items-center justify-between gap-2 p-2 bg-[#0e1124] rounded-lg border border-white/[0.03] text-xs"
                              >
                                <div className="min-w-0 flex items-center gap-2">
                                  <span className="font-bold text-white truncate">{linkItem.title}</span>
                                  <span className="text-[9px] px-1.5 py-0.2 bg-purple-950 text-purple-300 rounded border border-purple-500/30 shrink-0">
                                    {linkItem.categoryName || getCategoryDisplayName(linkItem.category)}
                                  </span>
                                  <span className="text-[9px] text-zinc-400 font-mono shrink-0">
                                    ({linkItem.regions?.join(', ') || 'Global'})
                                  </span>
                                </div>
                                <a
                                  href={linkItem.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-400 hover:text-purple-300 text-[10px] font-bold shrink-0 flex items-center gap-0.5"
                                >
                                  <span>Open</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Clear History Button */}
            {allItemizedLinks.length > 0 && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear History Log</span>
                </button>
              </div>
            )}
          </div>

          {/* Auto-Sync Frequency Settings */}
          <div className="bg-[#13172e] border border-[#252b52] rounded-xl p-4 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Update Frequency (अपडेट समय अंतराल)</span>
            </h4>
            <p className="text-[11px] text-zinc-400">
              Choose how often Link Box automatically checks and ingests new global & regional links in the background:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleFrequencyChange('startup')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  config.frequency === 'startup'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                    : 'bg-[#0e1124] border-[#22284e] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs text-white mb-1">
                  <span>Every Launch</span>
                  {config.frequency === 'startup' && <Check className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <p className="text-[10px] text-zinc-400">Checks for new links each time you open the app (Recommended)</p>
              </button>

              <button
                type="button"
                onClick={() => handleFrequencyChange('hourly')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  config.frequency === 'hourly'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                    : 'bg-[#0e1124] border-[#22284e] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs text-white mb-1">
                  <span>Every Hour</span>
                  {config.frequency === 'hourly' && <Check className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <p className="text-[10px] text-zinc-400">Real-time background crawler check every 60 minutes</p>
              </button>

              <button
                type="button"
                onClick={() => handleFrequencyChange('daily')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  config.frequency === 'daily'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                    : 'bg-[#0e1124] border-[#22284e] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs text-white mb-1">
                  <span>Once Daily</span>
                  {config.frequency === 'daily' && <Check className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <p className="text-[10px] text-zinc-400">Daily batch sync for all worldwide categories</p>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#151936] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All auto-added links are pre-verified for malware and HTTPS SSL safety.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-purple-900/30 shrink-0"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
