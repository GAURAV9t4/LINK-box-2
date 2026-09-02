import React, { useRef, useEffect, useMemo, useState } from 'react';
import { CategoryGroup, FilterState, LinkItem, ViewMode } from '../types';
import { 
  Search, X, Star, LayoutGrid, Send, ListFilter, Plus, 
  Sparkles, ShieldCheck, Zap, SlidersHorizontal, Hash, Check,
  MapPin, ExternalLink, Globe, Mic, MicOff, AlertCircle, Radio,
  Volume2
} from 'lucide-react';
import { getCategoryIcon } from '../utils/icons';
import { extractPopularTags, matchLinkWithQuery, locateLinkOnPage } from '../utils/search';

interface SearchAndFiltersProps {
  categories: CategoryGroup[];
  links?: LinkItem[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  favoritesCount: number;
  totalFilteredCount: number;
  onOpenAddModal: () => void;
  onOpenAutoSyncModal?: () => void;
  onLocateLink?: (link: LinkItem) => void;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  categories,
  links = [],
  filters,
  onFilterChange,
  favoritesCount,
  totalFilteredCount,
  onOpenAddModal,
  onOpenAutoSyncModal,
  onLocateLink,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Web Speech API Voice Search States
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  // Detect Web Speech API support on mount
  useEffect(() => {
    const SpeechRecognition = 
      typeof window !== 'undefined' && 
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    setIsSpeechSupported(Boolean(SpeechRecognition));

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Start Voice Search Recognition via Web Speech API
  const startVoiceSearch = () => {
    setSpeechError(null);
    setInterimTranscript('');

    const SpeechRecognition = 
      typeof window !== 'undefined' && 
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    if (!SpeechRecognition) {
      setSpeechError('Voice search is not supported in this browser. Please try Google Chrome, Microsoft Edge, or Safari.');
      setIsSpeechSupported(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (finalTranscript) {
          const cleanText = finalTranscript.trim();
          onFilterChange({ searchQuery: cleanText });
          setInterimTranscript('');
          setIsListening(false);

          // Focus the input to allow immediate continuation
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow microphone access in your browser to use Voice Search.');
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech detected. Please speak clearly into your microphone.');
        } else if (event.error === 'network') {
          setSpeechError('Network error occurred during voice recognition.');
        } else if (event.error !== 'aborted') {
          setSpeechError(`Voice search error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to initialize speech recognition:', err);
      setSpeechError('Unable to start speech recognition. Please check microphone settings.');
      setIsListening(false);
    }
  };

  // Stop / Cancel Voice Search
  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  // Toggle Voice Search
  const handleVoiceButtonClick = () => {
    if (isListening) {
      stopVoiceSearch();
    } else {
      startVoiceSearch();
    }
  };

  // Compute matched links in real-time
  const matchedLinks = useMemo(() => {
    if (!filters.searchQuery.trim()) return [];
    return links.filter((l) => matchLinkWithQuery(l, filters.searchQuery, categories));
  }, [links, filters.searchQuery, categories]);

  // Popular hashtag pills extracted from active links dataset
  const popularTags = useMemo(() => {
    return extractPopularTags(links);
  }, [links]);

  // Handle Enter key on search input -> automatically locates first matching link
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (matchedLinks.length > 0) {
        if (onLocateLink) {
          onLocateLink(matchedLinks[0]);
        } else {
          locateLinkOnPage(matchedLinks[0].id);
        }
      }
    }
  };

  // Handle clicking a #tag pill
  const handleTagClick = (tag: string) => {
    const currentQuery = filters.searchQuery.trim();
    const tagClean = tag.toLowerCase();

    // Check if tag is already in query
    if (currentQuery.toLowerCase().includes(tagClean)) {
      // Remove it
      const updated = currentQuery
        .replace(new RegExp(tagClean, 'gi'), '')
        .replace(/\s+/g, ' ')
        .trim();
      onFilterChange({ searchQuery: updated });
    } else {
      // Append tag to query
      const updated = currentQuery ? `${currentQuery} ${tag}` : tag;
      onFilterChange({ searchQuery: updated });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-8 space-y-3.5">
      {/* Top Main Search Bar Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input Box with Integrated Voice Search and Clear Controls */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            onKeyDown={handleSearchKeyDown}
            placeholder={isListening ? "Listening... Speak now..." : "Paste URL, type title, custom link, domain or #tag (Press Enter to locate)..."}
            className={`w-full pl-10 ${filters.searchQuery ? 'pr-20' : 'pr-12'} py-3 bg-[#13162b] border ${
              isListening 
                ? 'border-purple-400 ring-2 ring-purple-500/30 bg-[#171a38]' 
                : 'border-[#262c54] focus:border-purple-500 focus:bg-[#161a33]'
            } rounded-xl text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner`}
          />

          {/* Right Action Icons inside Input (Clear + Voice Search) */}
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
            {/* Clear Button */}
            {filters.searchQuery && (
              <button
                id="search-clear-btn"
                type="button"
                onClick={() => onFilterChange({ searchQuery: '' })}
                title="Clear search"
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Voice Search Button */}
            <button
              id="voice-search-btn"
              type="button"
              onClick={handleVoiceButtonClick}
              title={
                !isSpeechSupported
                  ? 'Voice Search not supported in this browser'
                  : isListening
                  ? 'Listening... Click to stop voice search'
                  : 'Voice Search: Find links hands-free (Web Speech API)'
              }
              className={`relative p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center ${
                isListening
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/40 animate-pulse'
                  : 'bg-purple-950/60 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 hover:border-purple-400'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 animate-bounce" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping"></span>
                </>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* View Mode & Add Link CTA buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Favorite Toggle */}
          <button
            id="search-favorites-toggle-btn"
            type="button"
            onClick={() => onFilterChange({ onlyFavorites: !filters.onlyFavorites })}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              filters.onlyFavorites
                ? 'bg-amber-950/80 border-amber-500/80 text-amber-300 shadow-md'
                : 'bg-[#141730] border-[#262c54] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <Star className={`w-4 h-4 ${filters.onlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="ml-0.5 text-[10px] px-1.5 py-0.2 bg-amber-500/20 rounded-full font-mono">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* View Mode Toggle: Grid vs Telegram View */}
          <div className="flex items-center bg-[#13162b] border border-[#262c54] rounded-xl p-1">
            <button
              id="view-mode-grid-btn"
              type="button"
              onClick={() => onFilterChange({ viewMode: 'grid' })}
              title="Grid Card View (PDF Style)"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                filters.viewMode === 'grid'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="view-mode-telegram-btn"
              type="button"
              onClick={() => onFilterChange({ viewMode: 'telegram' })}
              title="Telegram Group & Channel Feed View"
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filters.viewMode === 'telegram'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">TG Group View</span>
            </button>
          </div>

          {/* Add Link Button */}
          <button
            id="search-add-link-btn"
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-purple-500/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Link</span>
          </button>
        </div>
      </div>

      {/* Live Voice Search Status & Audio Wave Feedback Banner */}
      {isListening && (
        <div 
          id="voice-search-listening-panel"
          className="bg-gradient-to-r from-purple-950/80 via-[#181a3d] to-indigo-950/80 border border-purple-500/50 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-purple-950/40 animate-fadeIn"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 shrink-0">
              <Mic className="w-4 h-4 animate-pulse" />
              <span className="absolute inset-0 rounded-lg bg-red-500/20 animate-ping"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Listening for speech...</span>
                  {/* Dynamic sound equalizer simulation bars */}
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.8 bg-purple-400 rounded-full animate-[bounce_0.6s_infinite_100ms] h-2"></span>
                    <span className="w-0.8 bg-purple-300 rounded-full animate-[bounce_0.6s_infinite_200ms] h-3"></span>
                    <span className="w-0.8 bg-indigo-400 rounded-full animate-[bounce_0.6s_infinite_300ms] h-2.5"></span>
                    <span className="w-0.8 bg-purple-200 rounded-full animate-[bounce_0.6s_infinite_150ms] h-1.5"></span>
                  </span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 bg-purple-900/60 text-purple-200 rounded font-mono border border-purple-700/50">
                  Hands-Free Voice Search
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 mt-0.5">
                {interimTranscript ? (
                  <span className="text-amber-300 font-semibold italic">"{interimTranscript}..."</span>
                ) : (
                  <span>Say anything, e.g. <strong className="text-purple-300 font-normal">"YouTube"</strong>, <strong className="text-purple-300 font-normal">"AI Tools"</strong>, <strong className="text-purple-300 font-normal">"GitHub"</strong>, or <strong className="text-purple-300 font-normal">"Design"</strong></span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              id="voice-search-stop-btn"
              type="button"
              onClick={stopVoiceSearch}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1"
            >
              <MicOff className="w-3.5 h-3.5" />
              <span>Stop Listening</span>
            </button>
          </div>
        </div>
      )}

      {/* Speech Error Banner (if permissions blocked or unsupported) */}
      {speechError && (
        <div 
          id="voice-search-error-panel"
          className="bg-red-950/50 border border-red-500/40 rounded-xl p-2.5 px-3 flex items-center justify-between gap-3 text-xs text-red-200 shadow-md animate-fadeIn"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{speechError}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isSpeechSupported && (
              <button
                type="button"
                onClick={startVoiceSearch}
                className="text-[11px] font-semibold text-red-300 hover:text-white underline cursor-pointer"
              >
                Try Again
              </button>
            )}
            <button
              type="button"
              onClick={() => setSpeechError(null)}
              className="text-zinc-400 hover:text-white cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Hashtag & Search Suggestions Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-[11px] font-bold text-purple-400/90 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <Hash className="w-3 h-3 text-purple-400" />
          <span>Quick Tags:</span>
        </span>
        {popularTags.map((tag) => {
          const isActive = filters.searchQuery.toLowerCase().includes(tag.toLowerCase());
          return (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all shrink-0 flex items-center gap-1 cursor-pointer border ${
                isActive
                  ? 'bg-purple-600 text-white border-purple-400 shadow-sm shadow-purple-900/40'
                  : 'bg-[#14172f] hover:bg-[#1e2348] text-zinc-300 hover:text-purple-300 border-[#262c54] hover:border-purple-500/50'
              }`}
            >
              <span>{tag}</span>
              {isActive && <Check className="w-3 h-3 text-purple-200" />}
            </button>
          );
        })}
      </div>

      {/* Active Search Results & Quick Link Locator Panel */}
      {filters.searchQuery.trim() && (
        <div className="bg-[#13162b] border border-purple-500/40 rounded-xl p-3.5 text-xs text-zinc-300 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="truncate">
                Found <strong className="text-white font-bold">{matchedLinks.length}</strong> matching links for <span className="text-amber-300 font-mono font-semibold">"{filters.searchQuery}"</span>
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                (Scroll down to view all {matchedLinks.length} results)
              </span>
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="text-[11px] font-semibold text-purple-300 hover:text-white underline cursor-pointer shrink-0 ml-1"
              >
                Clear Search
              </button>
            </div>
          </div>

          {/* Full Scrollable Search Results List */}
          {matchedLinks.length > 0 ? (
            <div className="max-h-72 sm:max-h-96 overflow-y-auto pr-1 custom-scrollbar pt-1.5 border-t border-white/[0.06] flex flex-wrap gap-2">
              {matchedLinks.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between gap-2 bg-[#1b1f3b] hover:bg-[#232850] border border-[#2b3366] hover:border-purple-400/60 rounded-lg px-2.5 py-1.5 transition-all text-xs w-full sm:w-[calc(50%-4px)] lg:w-[calc(33.333%-6px)]"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <div className="truncate">
                      <span className="font-bold text-white truncate block text-[11px] sm:text-xs" title={l.title}>
                        {l.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono truncate block">
                        {l.domain || l.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {l.badge && (
                      <span className="text-[9px] px-1 py-0.2 bg-purple-950 text-purple-300 rounded font-mono border border-purple-800/40">
                        {l.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (onLocateLink) {
                          onLocateLink(l);
                        } else {
                          locateLinkOnPage(l.id);
                        }
                      }}
                      title="Scroll directly to this link card on page"
                      className="px-2 py-1 bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-purple-500/40"
                    >
                      <MapPin className="w-3 h-3 text-amber-300" />
                      <span>Locate</span>
                    </button>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open link in new tab"
                      className="p-1 bg-white/5 hover:bg-emerald-600/30 text-zinc-300 hover:text-emerald-300 rounded transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-zinc-400 text-[11px] pt-1">
              No matching link located. Try searching with a different keyword, domain, or #tag.
            </div>
          )}
        </div>
      )}

      {/* Category Pills Slider / Filter Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
        <button
          type="button"
          onClick={() => onFilterChange({ selectedCategory: 'all' })}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
            filters.selectedCategory === 'all'
              ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30'
              : 'bg-[#13162b] text-zinc-400 border-[#262c54] hover:text-white hover:border-zinc-700'
          }`}
        >
          <span>All Groups</span>
          <span className="text-[10px] opacity-75 font-mono">({totalFilteredCount})</span>
        </button>

        {/* Dedicated Custom Vault filter pill */}
        <button
          type="button"
          onClick={() => {
            const next = filters.selectedCategory === 'custom' ? 'all' : 'custom';
            onFilterChange({ selectedCategory: next });
            if (next === 'custom') {
              const el = document.getElementById('cat-section-custom-vault');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          }}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
            filters.selectedCategory === 'custom'
              ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-900/40'
              : 'bg-purple-950/60 text-purple-300 border-purple-500/50 hover:bg-purple-900/80 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Custom Vault</span>
        </button>

        {categories.map((cat) => {
          const isSelected = filters.selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onFilterChange({ selectedCategory: isSelected ? 'all' : cat.id })}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-900/40'
                  : 'bg-[#13162b] text-zinc-400 border-[#262c54] hover:text-white hover:border-zinc-700'
              }`}
            >
              {getCategoryIcon(cat.icon, 'w-3.5 h-3.5')}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Quick Badge Filters & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-purple-400/90 uppercase tracking-wider font-mono mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-purple-400" />
            <span>Badge:</span>
          </span>
          {[
            'all', 'Official', 'Movie', 'Anime', 'App', 'Free', '18+',
            'Hentai', 'Manga', 'HD', '4K', 'Live Sports', 'Telegram', 'AI Tech', 'Custom', 'Paid'
          ].map((badge) => {
            const isBadgeSelected = filters.selectedBadge.toLowerCase() === badge.toLowerCase();
            return (
              <button
                key={badge}
                type="button"
                onClick={() => onFilterChange({ selectedBadge: isBadgeSelected && badge !== 'all' ? 'all' : badge })}
                className={`px-2 py-0.8 rounded-md text-[11px] font-mono transition-all cursor-pointer border ${
                  isBadgeSelected
                    ? 'bg-purple-600 text-white border-purple-400 shadow-sm shadow-purple-900/50 font-bold'
                    : 'bg-[#13162b] hover:bg-[#1f244a] text-zinc-300 hover:text-white border-[#262c54] hover:border-purple-500/40'
                }`}
              >
                {badge === 'all' ? 'All Badges' : badge}
              </button>
            );
          })}

          {onOpenAutoSyncModal && (
            <button
              type="button"
              onClick={onOpenAutoSyncModal}
              title="Auto-Discover & Add New World Links"
              className="px-2 py-0.8 rounded-md text-[11px] font-mono bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 transition-all cursor-pointer shadow-xs ml-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>⚡ Auto-Add Links</span>
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-zinc-400 font-mono">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="bg-[#141730] border border-[#282e56] rounded-md px-2 py-0.5 text-zinc-300 text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="default">Default Order</option>
            <option value="popular">Most Visited / Popular</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};


