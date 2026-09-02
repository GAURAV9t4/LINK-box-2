import React, { useState, useRef } from 'react';
import { LinkItem, CategoryGroup, BadgeType, ReactionType } from '../types';
import { LinkCard } from './LinkCard';
import { LinkLogo } from './LinkLogo';
import { 
  Sparkles, Plus, Palette, Image, Type, Upload, 
  Trash2, Edit3, Copy, Check, ExternalLink, Globe, 
  RefreshCw, Shield, Zap, Flame, Lock, Star, Bot, 
  Gamepad2, Film, Tv, Radio, Music, Cloud, Terminal, 
  Eye, HelpCircle, Layers, ArrowUpRight, CheckCircle2,
  FileText, Info, Share2, Tag, Settings, FileSpreadsheet
} from 'lucide-react';

interface CustomVaultSectionProps {
  customLinks: LinkItem[];
  categories: CategoryGroup[];
  onAddLink: (link: LinkItem) => void;
  onUpdateLink: (link: LinkItem) => void;
  onDeleteLink: (id: string) => void;
  onVisit: (link: LinkItem) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  onAddCategory: (cat: CategoryGroup) => void;
  onShowQr?: (link: LinkItem) => void;
  onReact?: (linkId: string, type: ReactionType) => void;
  userReactions?: Record<string, ReactionType | null>;
  reactionCounts?: Record<string, { heart: number; zap: number; like: number }>;
  isVaultPrivacyAutoCleanEnabled?: boolean;
  onToggleVaultPrivacyAutoClean?: () => void;
  onOpenPrivacySettings?: () => void;
  onOpenExportCSV?: () => void;
}

const PRESET_ICONS = [
  { name: 'Film', label: 'Movie / Film' },
  { name: 'Tv', label: 'TV Series' },
  { name: 'Play', label: 'Player' },
  { name: 'Sparkles', label: 'VIP / Magic' },
  { name: 'Send', label: 'Telegram' },
  { name: 'Globe', label: 'Web / Portal' },
  { name: 'Cloud', label: 'Drive / Cloud' },
  { name: 'Flame', label: 'Hot / Trending' },
  { name: 'Shield', label: 'Secure / VPN' },
  { name: 'Zap', label: 'Fast / Speed' },
  { name: 'Lock', label: 'Private' },
  { name: 'Bot', label: 'AI / Bot' },
  { name: 'Gamepad', label: 'Gaming' },
  { name: 'Radio', label: 'Live Stream' },
  { name: 'Music', label: 'Audio / Music' },
  { name: 'Terminal', label: 'Dev / Tech' },
  { name: 'BookOpen', label: 'Books / Docs' },
  { name: 'Download', label: 'Direct Download' },
];

const PRESET_COLORS = [
  '#a855f7', // Purple
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#eab308', // Amber / Gold
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
];

const BADGE_OPTIONS: (BadgeType | '')[] = [
  'CUSTOM',
  'TRUSTED',
  '18+',
  'HENTAI',
  'NEW',
  'HOT',
  '4K',
  'FAST',
  'OFFICIAL',
  'MOD',
  'HD',
  'FREE',
  'VIP',
  'PRO',
  'PRIVATE',
  '',
];

const QUICK_PRESETS = [
  {
    title: 'Google Drive Vault',
    url: 'https://drive.google.com',
    category: 'apps',
    badge: 'PRIVATE' as BadgeType,
    logoType: 'icon' as const,
    iconName: 'Cloud',
    logoColor: '#3b82f6',
    logoBg: 'rgba(59, 130, 246, 0.15)',
    description: 'Personal cloud drive for movies, APKs, and backup collections.',
  },
  {
    title: 'Plex / Jellyfin Server',
    url: 'http://localhost:8096',
    category: 'movies',
    badge: '4K' as BadgeType,
    logoType: 'styled' as const,
    logoText: 'PLEX MEDIA',
    logoColor: '#eab308',
    logoBg: 'rgba(234, 179, 8, 0.15)',
    description: 'Direct local media server portal with 4K HDR transcoding.',
  },
  {
    title: 'Telegram Private Bot',
    url: 'https://t.me/BotFather',
    category: 'telegram',
    badge: 'VIP' as BadgeType,
    logoType: 'icon' as const,
    iconName: 'Send',
    logoColor: '#0ea5e9',
    logoBg: 'rgba(14, 165, 233, 0.15)',
    description: 'Personal media search bot & auto-downloader.',
  },
  {
    title: 'Stremio Web Player',
    url: 'https://web.stremio.com',
    category: 'movies',
    badge: 'FAST' as BadgeType,
    logoType: 'styled' as const,
    logoText: 'STREMIO',
    logoColor: '#a855f7',
    logoBg: 'rgba(168, 85, 247, 0.15)',
    description: 'Direct browser streaming client with custom torrentio addons.',
  },
];

export const CustomVaultSection: React.FC<CustomVaultSectionProps> = ({
  customLinks,
  categories,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onVisit,
  onToggleFavorite,
  favorites,
  onAddCategory,
  onShowQr,
  onReact,
  userReactions = {},
  reactionCounts = {},
  isVaultPrivacyAutoCleanEnabled = true,
  onToggleVaultPrivacyAutoClean,
  onOpenPrivacySettings,
  onOpenExportCSV,
}) => {
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);

  // Customizer Form State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'movies');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState<BadgeType | ''>('CUSTOM');
  const [tagsInput, setTagsInput] = useState('');
  
  // Logo customization modes: 'styled' | 'image' | 'icon'
  const [logoMode, setLogoMode] = useState<'styled' | 'image' | 'icon'>('styled');
  
  // Mode: Styled Text
  const [logoText, setLogoText] = useState('');
  const [logoColor, setLogoColor] = useState('#a855f7');
  const [logoBg, setLogoBg] = useState('rgba(168, 85, 247, 0.12)');
  
  // Mode: Image / Upload / Favicon
  const [imageUrl, setImageUrl] = useState('');
  
  // Mode: Icon
  const [iconName, setIconName] = useState('Sparkles');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract domain dynamically
  const getCleanDomain = (linkUrl: string) => {
    try {
      if (!linkUrl) return 'direct.link';
      let formatted = linkUrl.trim();
      if (!/^https?:\/\//i.test(formatted)) formatted = 'https://' + formatted;
      const parsed = new URL(formatted);
      return parsed.hostname.replace(/^www\./, '');
    } catch {
      return linkUrl.replace(/^https?:\/\//, '').split('/')[0] || 'custom.link';
    }
  };

  // Live preview link item
  const previewLink: LinkItem = {
    id: editingLinkId || 'preview-custom-link',
    title: title.trim() || 'My Custom Site',
    url: url.trim() || 'https://example.com',
    domain: getCleanDomain(url),
    category: category,
    description: description.trim() || 'Custom added streaming link with personalized logo.',
    badge: badge ? (badge as BadgeType) : undefined,
    logoType: logoMode,
    logoText: logoText.trim() || (title.trim() || 'CUSTOM LOGO'),
    logoColor: logoColor,
    logoBg: logoBg,
    imageUrl: logoMode === 'image' ? imageUrl : undefined,
    iconName: logoMode === 'icon' ? iconName : undefined,
    telegramGroup: url.includes('t.me') || category === 'telegram',
    isCustom: true,
    clicks: 12,
  };

  // Reset form
  const resetForm = () => {
    setTitle('');
    setUrl('');
    setDescription('');
    setBadge('CUSTOM');
    setTagsInput('');
    setLogoMode('styled');
    setLogoText('');
    setLogoColor('#a855f7');
    setLogoBg('rgba(168, 85, 247, 0.12)');
    setImageUrl('');
    setIconName('Sparkles');
    setEditingLinkId(null);
  };

  // Auto fetch favicon from domain
  const handleAutoFetchFavicon = () => {
    if (!url.trim()) return;
    const domain = getCleanDomain(url);
    if (domain && domain !== 'direct.link') {
      const highResFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      setImageUrl(highResFavicon);
      setLogoMode('image');
    }
  };

  // Handle local image file upload (converts to base64 Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (1.5MB for local storage)
    if (file.size > 1.5 * 1024 * 1024) {
      alert('Please upload an image smaller than 1.5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setImageUrl(evt.target.result as string);
        setLogoMode('image');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Populate form for editing
  const handleStartEdit = (link: LinkItem) => {
    setEditingLinkId(link.id);
    setTitle(link.title);
    setUrl(link.url);
    setCategory(link.category);
    setDescription(link.description || '');
    setBadge(link.badge || '');
    setTagsInput((link.tags || []).join(', '));
    
    if (link.imageUrl) {
      setLogoMode('image');
      setImageUrl(link.imageUrl);
    } else if (link.iconName) {
      setLogoMode('icon');
      setIconName(link.iconName);
      setLogoColor(link.logoColor || '#a855f7');
      setLogoBg(link.logoBg || 'rgba(168, 85, 247, 0.15)');
    } else {
      setLogoMode('styled');
      setLogoText(link.logoText || link.title);
      setLogoColor(link.logoColor || '#a855f7');
      setLogoBg(link.logoBg || 'rgba(168, 85, 247, 0.12)');
    }

    setIsStudioOpen(true);
    // Scroll studio into view smoothly
    document.getElementById('custom-studio-card')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  // Apply a preset template
  const handleApplyPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setTitle(preset.title);
    setUrl(preset.url);
    setCategory(preset.category);
    setDescription(preset.description);
    setBadge(preset.badge);
    setLogoMode(preset.logoType);
    if (preset.logoType === 'icon' && preset.iconName) {
      setIconName(preset.iconName);
    }
    if (preset.logoText) {
      setLogoText(preset.logoText);
    }
    setLogoColor(preset.logoColor);
    setLogoBg(preset.logoBg);
    setIsStudioOpen(true);
  };

  // Submit Handler (Create or Update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const domain = getCleanDomain(formattedUrl);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const linkPayload: LinkItem = {
      id: editingLinkId || `custom-${Date.now()}`,
      title: title.trim(),
      url: formattedUrl,
      domain: domain,
      category: category,
      description: description.trim() || `Direct custom link for ${title.trim()}`,
      badge: badge ? (badge as BadgeType) : undefined,
      logoType: logoMode,
      logoText: logoText.trim() || title.trim(),
      logoColor: logoColor,
      logoBg: logoBg,
      imageUrl: logoMode === 'image' && imageUrl.trim() ? imageUrl.trim() : undefined,
      iconName: logoMode === 'icon' ? iconName : undefined,
      telegramGroup: formattedUrl.includes('t.me') || category === 'telegram',
      tags: tags.length > 0 ? tags : ['Custom', 'Direct'],
      regions: ['Global', 'India', 'USA', 'UK', 'Japan', 'Korea'],
      isCustom: true,
      addedAt: new Date().toISOString(),
      status: 'active',
    };

    if (editingLinkId) {
      onUpdateLink(linkPayload);
    } else {
      onAddLink(linkPayload);
    }

    resetForm();
    setIsStudioOpen(false);
  };

  return (
    <section 
      id="cat-section-custom-vault" 
      className="mb-10 max-w-5xl mx-auto scroll-mt-24"
    >
      {/* Section Header matching Movie & Show Vault style */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-4 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Custom Vault
          </h2>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-[#1e2244] text-purple-300 rounded-md border border-[#333b70]">
            {customLinks.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Export Curated Links CSV */}
          {onOpenExportCSV && (
            <button
              type="button"
              onClick={onOpenExportCSV}
              title="Export curated link interaction and engagement data as CSV"
              className="px-2.5 py-1.5 bg-[#171b38] hover:bg-[#20264d] border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
          )}

          {/* Privacy & Incognito Settings Button (Replaces bulky card as requested) */}
          {onOpenPrivacySettings && (
            <button
              type="button"
              onClick={onOpenPrivacySettings}
              title="Vault Privacy & Stealth Settings"
              className="px-2.5 py-1.5 bg-[#171b38] hover:bg-[#20264d] border border-purple-500/30 hover:border-purple-400 text-purple-200 hover:text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy</span>
              {isVaultPrivacyAutoCleanEnabled && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (isStudioOpen && editingLinkId) {
                resetForm();
              } else {
                setIsStudioOpen(!isStudioOpen);
              }
            }}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md shadow-purple-900/30 transition-all cursor-pointer shrink-0"
          >
            <Plus className={`w-3.5 h-3.5 transition-transform duration-200 ${isStudioOpen && !editingLinkId ? 'rotate-45' : ''}`} />
            <span>{isStudioOpen ? 'Close Studio' : '+ Add Custom Link'}</span>
          </button>
        </div>
      </div>

      {/* Quick 1-Click Starter Presets Bar (when studio is open or customizer active) */}
      {isStudioOpen && (
        <div className="pt-1 pb-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Quick Presets:</span>
          </span>
          {QUICK_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-2.5 py-1 bg-white/[0.04] hover:bg-purple-600/20 border border-white/[0.08] hover:border-purple-500/40 rounded-lg text-xs text-zinc-300 hover:text-white transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="text-[10px] font-bold text-purple-400 uppercase">{preset.badge}</span>
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Live Customizer Studio Panel */}
      {isStudioOpen && (
        <div 
          id="custom-studio-card"
          className="bg-[#0b0d1e] border border-purple-500/40 rounded-xl p-4 sm:p-6 mb-6 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Edit3 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {editingLinkId ? `Edit Custom Link: ${title || 'Untitled'}` : 'Design New Custom Link & Logo'}
              </h3>
            </div>
            {editingLinkId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Essential Link Information */}
            <div className="lg:col-span-7 space-y-4">
              {/* Title & URL Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
                    Site / Channel Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!logoText || logoText === title) {
                        setLogoText(e.target.value);
                      }
                    }}
                    placeholder="e.g. My Cinema HD / Private TG"
                    className="w-full bg-[#151933] border border-[#2b315c] focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
                    Direct URL / Domain *
                  </label>
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://mysite.com or t.me/mygroup"
                    className="w-full bg-[#151933] border border-[#2b315c] focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Category & Badge Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
                    Category Destination
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#151933] border border-[#2b315c] focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
                    Card Badge Tag
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value as BadgeType)}
                    className="w-full bg-[#151933] border border-[#2b315c] focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  >
                    {BADGE_OPTIONS.map((b, idx) => (
                      <option key={idx} value={b}>
                        {b ? `${b}` : 'None'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Logo Designer Switcher */}
              <div className="bg-[#12162f] border border-[#262c54] rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-purple-400" />
                    <span>Logo Design Mode:</span>
                  </label>
                  <div className="flex items-center bg-[#090b17] p-0.5 rounded-lg border border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => setLogoMode('styled')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        logoMode === 'styled' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Stylized Text
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoMode('icon')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        logoMode === 'icon' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Icon Badge
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoMode('image')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        logoMode === 'image' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Upload / Image
                    </button>
                  </div>
                </div>

                {/* Submode 1: Stylized Text Logo */}
                {logoMode === 'styled' && (
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                          Display Text
                        </label>
                        <input
                          type="text"
                          value={logoText}
                          onChange={(e) => setLogoText(e.target.value)}
                          placeholder={title || 'LOGO TEXT'}
                          className="w-full bg-[#181d3d] border border-[#2b315c] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                          Logo Color
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={logoColor}
                            onChange={(e) => {
                              setLogoColor(e.target.value);
                              setLogoBg(`${e.target.value}1f`);
                            }}
                            className="w-8 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                          />
                          <div className="flex items-center gap-1 overflow-x-auto py-1">
                            {PRESET_COLORS.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => {
                                  setLogoColor(c);
                                  setLogoBg(`${c}1f`);
                                }}
                                style={{ backgroundColor: c }}
                                className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform shrink-0"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submode 2: Icon Badge Logo */}
                {logoMode === 'icon' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">
                        Select Vector Icon
                      </label>
                      <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 max-h-28 overflow-y-auto p-1 bg-[#090b17] rounded-lg border border-white/[0.06]">
                        {PRESET_ICONS.map((ic) => (
                          <button
                            key={ic.name}
                            type="button"
                            onClick={() => setIconName(ic.name)}
                            title={ic.label}
                            className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                              iconName === ic.name
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'text-zinc-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <span className="text-xs font-mono font-bold">{ic.name.slice(0, 3)}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-zinc-400">Accent Color:</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={logoColor}
                          onChange={(e) => {
                            setLogoColor(e.target.value);
                            setLogoBg(`${e.target.value}25`);
                          }}
                          className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
                        />
                        <div className="flex items-center gap-1">
                          {PRESET_COLORS.slice(0, 6).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setLogoColor(c);
                                setLogoBg(`${c}25`);
                              }}
                              style={{ backgroundColor: c }}
                              className="w-4 h-4 rounded-full border border-white/20 hover:scale-110 transition-transform"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submode 3: Image / Favicon / Upload */}
                {logoMode === 'image' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">
                          Image URL or Auto-Grab Favicon
                        </label>
                        {url && (
                          <button
                            type="button"
                            onClick={handleAutoFetchFavicon}
                            className="text-[10px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Globe className="w-3 h-3" />
                            <span>Auto Grab from Domain</span>
                          </button>
                        )}
                      </div>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="w-full bg-[#181d3d] border border-[#2b315c] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 rounded-lg flex items-center gap-1.5 border border-white/[0.08] cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Local Logo File</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {imageUrl && (
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="text-xs text-rose-400 hover:underline cursor-pointer"
                        >
                          Clear Image
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Search Tags */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-purple-400" />
                    <span>Search Tags (Comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Movies, HD, Drive, Private, Streaming"
                    className="w-full bg-[#151933] border border-[#2b315c] focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Card Preview */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#12162f] border border-[#28305c] rounded-xl p-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Card Real-Time Preview</span>
                  </span>
                  <span className="text-[10px] text-zinc-400">Exact appearance in Link Box</span>
                </div>

                {/* Render the preview card exactly as in the grid */}
                <div className="max-w-[280px] mx-auto my-3 pointer-events-none">
                  <LinkCard
                    link={previewLink}
                    onVisit={() => {}}
                    onToggleFavorite={() => {}}
                    isFavorite={false}
                  />
                </div>

                <div className="mt-3 p-2.5 bg-[#090b17] rounded-lg border border-white/[0.04] text-[11px] text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="text-purple-300 font-semibold">{category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Direct Domain:</span>
                    <span className="text-white font-mono">{previewLink.domain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage:</span>
                    <span className="text-emerald-400">Persists locally in your browser</span>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/[0.08] mt-4">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingLinkId ? 'Save Changes' : 'Save to Custom Links Box'}</span>
                </button>

                {editingLinkId && (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteLink(editingLinkId);
                      resetForm();
                      setIsStudioOpen(false);
                    }}
                    className="px-4 py-2.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    <span>Delete Link</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsStudioOpen(false);
                  }}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Custom Links Grid Display */}
      {customLinks.length === 0 ? (
        <div className="text-center py-10 px-4 bg-[#0a0c1b]/80 border border-dashed border-[#2f3560] rounded-xl my-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto mb-3">
            <Palette className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Your Custom Vault is currently empty</h4>
          <p className="text-xs text-zinc-400 max-w-md mx-auto mb-4">
            Click &quot;+ Add & Customize Link&quot; above or pick any Quick Preset to add your favorite websites, private stream players, or Telegram channels with bespoke custom logos!
          </p>
          <button
            type="button"
            onClick={() => setIsStudioOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-lg shadow-purple-900/40 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Custom Link</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {customLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onVisit={onVisit}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.includes(link.id)}
              onEdit={(l) => handleStartEdit(l)}
              onDelete={(id) => onDeleteLink(id)}
              onShowQr={onShowQr}
              onReact={onReact}
              userReaction={userReactions[link.id]}
              reactionCounts={reactionCounts[link.id]}
            />
          ))}

          {/* Quick "Add Custom Link" Card in Grid */}
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsStudioOpen(true);
            }}
            className="flex flex-col items-center justify-center min-h-[136px] bg-[#121424]/60 hover:bg-purple-950/30 border-2 border-dashed border-[#232742] hover:border-purple-500/60 rounded-xl p-3 text-zinc-400 hover:text-purple-300 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-white/[0.05] group-hover:bg-purple-600/30 flex items-center justify-center mb-1.5 transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">+ Add Custom Link</span>
            <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400">Custom Title & Logo</span>
          </button>
        </div>
      )}
    </section>
  );
};
