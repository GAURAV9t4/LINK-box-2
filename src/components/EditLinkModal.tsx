import React, { useState, useEffect, useRef } from 'react';
import { LinkItem, CategoryGroup, BadgeType, IconShapeType, BadgeVariantType } from '../types';
import { LinkLogo, ICON_MAP } from './LinkLogo';
import { 
  X, Check, Trash2, Edit3, Sparkles, Image, Type, 
  Upload, Eye, ExternalLink, Globe, Palette, AlertTriangle, 
  Film, Tv, Radio, Music, Cloud, Terminal, Lock, Star, Bot, Gamepad2, Zap, Send, FileText, Tag, Share2,
  Crown, Award, Gem, Rocket, Cpu, Layers, Compass, Video,
  Clapperboard, Monitor, Wifi, Feather, Heart, Boxes, Database,
  Code, Folder, Headphones, Disc, Volume2, Key,
  FileCode, Network, Server, Activity, Radar, ShieldAlert,
  ShieldCheck, Wrench, Sparkle, Glasses, Cast, Hash, Workflow,
  Laptop, RadioTower, Swords, Ghost,
  Joystick, Target, Crosshair, Sun, Moon, BadgeCheck, FlameKindling, Shield
} from 'lucide-react';

interface EditLinkModalProps {
  isOpen: boolean;
  link: LinkItem | null;
  onClose: () => void;
  onUpdateLink: (updatedLink: LinkItem) => void;
  onDeleteLink: (id: string) => void;
  categories: CategoryGroup[];
}

interface IconCategory {
  id: string;
  name: string;
  icons: { name: string; label: string }[];
}

const ICON_CATEGORIES: IconCategory[] = [
  {
    id: 'cinema',
    name: '🎬 Cinema & Media',
    icons: [
      { name: 'Film', label: 'Film' },
      { name: 'Play', label: 'Play' },
      { name: 'Tv', label: 'TV' },
      { name: 'Video', label: 'Video' },
      { name: 'Clapperboard', label: 'Cinema' },
      { name: 'Monitor', label: 'Screen' },
      { name: 'Radio', label: 'Radio' },
      { name: 'Music', label: 'Music' },
      { name: 'Headphones', label: 'Audio' },
      { name: 'Disc', label: 'Disc' },
      { name: 'Volume2', label: 'Sound' },
      { name: 'Cast', label: 'Cast' },
    ],
  },
  {
    id: 'vip',
    name: '✨ VIP & Badges',
    icons: [
      { name: 'Sparkles', label: 'Magic' },
      { name: 'Sparkle', label: 'Sparkle' },
      { name: 'Crown', label: 'Crown' },
      { name: 'Award', label: 'Award' },
      { name: 'Gem', label: 'Gem' },
      { name: 'Star', label: 'Star' },
      { name: 'Flame', label: 'Hot' },
      { name: 'FlameKindling', label: 'Fire' },
      { name: 'Zap', label: 'Lightning' },
      { name: 'BadgeCheck', label: 'Verified' },
    ],
  },
  {
    id: 'tech',
    name: '🤖 AI & Tech',
    icons: [
      { name: 'Bot', label: 'AI Bot' },
      { name: 'Cpu', label: 'Processor' },
      { name: 'Terminal', label: 'CLI' },
      { name: 'Code', label: 'Code' },
      { name: 'FileCode', label: 'Dev' },
      { name: 'Database', label: 'DB' },
      { name: 'Server', label: 'Server' },
      { name: 'Network', label: 'Network' },
      { name: 'Boxes', label: 'Nodes' },
      { name: 'Workflow', label: 'Workflow' },
      { name: 'Laptop', label: 'Laptop' },
      { name: 'Radar', label: 'Radar' },
      { name: 'Activity', label: 'Pulse' },
    ],
  },
  {
    id: 'gaming',
    name: '🎮 Gaming & Anime',
    icons: [
      { name: 'Gamepad2', label: 'Gaming' },
      { name: 'Gamepad', label: 'Controller' },
      { name: 'Swords', label: 'Battle' },
      { name: 'Ghost', label: 'Ghost' },
      { name: 'Rocket', label: 'Rocket' },
      { name: 'Joystick', label: 'Arcade' },
      { name: 'Target', label: 'Target' },
      { name: 'Crosshair', label: 'Crosshair' },
    ],
  },
  {
    id: 'cloud',
    name: '🌐 Cloud & Tools',
    icons: [
      { name: 'Globe', label: 'Global' },
      { name: 'Cloud', label: 'Cloud' },
      { name: 'HardDrive', label: 'Storage' },
      { name: 'Folder', label: 'Folder' },
      { name: 'Download', label: 'Download' },
      { name: 'Upload', label: 'Upload' },
      { name: 'Bookmark', label: 'Bookmark' },
      { name: 'Compass', label: 'Explore' },
      { name: 'Layers', label: 'Layers' },
      { name: 'Send', label: 'Telegram' },
      { name: 'RadioTower', label: 'Signal' },
      { name: 'Infinity', label: 'Unlimited' },
      { name: 'Wifi', label: 'Wireless' },
    ],
  },
  {
    id: 'security',
    name: '🔒 Security & Shield',
    icons: [
      { name: 'Shield', label: 'Shield' },
      { name: 'ShieldCheck', label: 'Safe' },
      { name: 'ShieldAlert', label: 'Guard' },
      { name: 'Lock', label: 'Locked' },
      { name: 'Key', label: 'Key' },
      { name: 'Eye', label: 'Vision' },
      { name: 'Glasses', label: 'Stealth' },
      { name: 'CheckCircle2', label: 'Passed' },
    ],
  },
  {
    id: 'lifestyle',
    name: '🎨 Lifestyle & Tags',
    icons: [
      { name: 'Heart', label: 'Love' },
      { name: 'Feather', label: 'Light' },
      { name: 'Tag', label: 'Tag' },
      { name: 'Hash', label: 'Hash' },
      { name: 'Flag', label: 'Flag' },
      { name: 'Sun', label: 'Day' },
      { name: 'Moon', label: 'Dark' },
      { name: 'Wrench', label: 'Tool' },
      { name: 'Share2', label: 'Share' },
    ],
  },
];

const PRESET_COLORS = [
  '#a855f7', // Purple
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#eab308', // Gold
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
  '#84cc16', // Lime
  '#d946ef', // Magenta
  '#f43f5e', // Rose
  '#94a3b8', // Silver Slate
];

const ICON_SHAPES: { id: IconShapeType; label: string; icon: string }[] = [
  { id: 'rounded', label: 'Rounded', icon: '▢' },
  { id: 'pill', label: 'Capsule Pill', icon: '⬭' },
  { id: 'circle', label: 'Circle', icon: '◯' },
  { id: 'squircle', label: 'Squircle', icon: '⬟' },
  { id: 'hexagon', label: 'Hex Shield', icon: '⬡' },
  { id: 'cyber', label: 'Cyber Cut', icon: '⧩' },
];

const BADGE_VARIANTS: { id: BadgeVariantType; label: string; desc: string }[] = [
  { id: 'glow', label: 'Neon Glow', desc: 'Luminous aura' },
  { id: 'glass', label: 'Frosted Glass', desc: 'Translucent blur' },
  { id: 'solid', label: 'Solid Impact', desc: 'Vibrant punch' },
  { id: 'dualtone', label: 'Dual-Tone', desc: 'Icon box + tag' },
  { id: 'gradient', label: 'Gloss Gradient', desc: 'Deep color sheen' },
  { id: 'outline', label: 'Ring Outline', desc: 'Minimal border' },
  { id: 'metallic', label: '24K Metallic', desc: 'Gold polished' },
  { id: 'neon', label: 'Matrix Neon', desc: 'Electric stroke' },
];

const BADGE_OPTIONS: string[] = [
  'Custom', 'Official', 'App', 'Movie', 'Anime', '18+', 'Hentai', 'Manga',
  'Free', 'Paid', 'HD', '4K', 'Live Sports', 'Telegram', 'AI Tech', 'Deshi', 'Dubbed', 'Subbed'
];

export const EditLinkModal: React.FC<EditLinkModalProps> = ({
  isOpen,
  link,
  onClose,
  onUpdateLink,
  onDeleteLink,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'movies');
  const [description, setDescription] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['Custom']);
  const [customBadgeInput, setCustomBadgeInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Logo mode
  const [logoMode, setLogoMode] = useState<'styled' | 'image' | 'icon'>('styled');
  const [logoText, setLogoText] = useState('');
  const [logoColor, setLogoColor] = useState('#a855f7');
  const [logoBg, setLogoBg] = useState('rgba(168, 85, 247, 0.15)');
  const [imageUrl, setImageUrl] = useState('');
  const [iconName, setIconName] = useState('Sparkles');
  const [iconShape, setIconShape] = useState<IconShapeType>('rounded');
  const [badgeVariant, setBadgeVariant] = useState<BadgeVariantType>('glow');
  const [activeIconTab, setActiveIconTab] = useState('cinema');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with incoming link
  useEffect(() => {
    if (link) {
      setTitle(link.title || '');
      setUrl(link.url || '');
      setCategory(link.category || categories[0]?.id || 'movies');
      setDescription(link.description || '');
      
      const existingBadges = link.badges && link.badges.length > 0
        ? link.badges
        : link.badge
        ? [link.badge]
        : ['Custom'];
      
      const mergedBadges = Array.from(new Set(['Custom', ...existingBadges]));
      setSelectedBadges(mergedBadges);
      
      setTagsInput((link.tags || []).join(', '));
      setIconShape(link.iconShape || 'rounded');
      setBadgeVariant(link.badgeVariant || 'glow');

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
        setLogoText(link.logoText || link.title || '');
        setLogoColor(link.logoColor || '#a855f7');
        setLogoBg(link.logoBg || 'rgba(168, 85, 247, 0.15)');
      }
      setShowDeleteConfirm(false);
    }
  }, [link, categories]);

  if (!isOpen || !link) return null;

  // Toggle a badge
  const handleToggleBadge = (b: string) => {
    if (b === 'Custom') return; // Custom is always kept
    if (selectedBadges.includes(b)) {
      setSelectedBadges(selectedBadges.filter((item) => item !== b));
    } else {
      setSelectedBadges([...selectedBadges, b]);
    }
  };

  // Add custom badge text
  const handleAddCustomBadge = () => {
    const trimmed = customBadgeInput.trim();
    if (trimmed && !selectedBadges.includes(trimmed)) {
      setSelectedBadges([...selectedBadges, trimmed]);
      setCustomBadgeInput('');
    }
  };

  // Extract domain
  const getCleanDomain = (linkUrl: string) => {
    try {
      if (!linkUrl) return link?.domain || 'custom.link';
      let formatted = linkUrl.trim();
      if (!/^https?:\/\//i.test(formatted)) formatted = 'https://' + formatted;
      const parsed = new URL(formatted);
      return parsed.hostname.replace(/^www\./, '');
    } catch {
      return linkUrl.replace(/^https?:\/\//, '').split('/')[0] || 'custom.link';
    }
  };

  // Live preview link object
  const previewLink: LinkItem = {
    id: link.id,
    title: title.trim() || link.title || 'Untitled Site',
    url: url.trim() || link.url,
    domain: getCleanDomain(url),
    category: category,
    description: description.trim() || link.description || '',
    badge: (selectedBadges[0] as BadgeType) || 'Custom',
    badges: selectedBadges.length > 0 ? selectedBadges : ['Custom'],
    logoType: logoMode,
    logoText: logoText.trim() || (title.trim() || link.title),
    logoColor: logoColor,
    logoBg: logoBg,
    iconShape: iconShape,
    badgeVariant: badgeVariant,
    imageUrl: logoMode === 'image' ? imageUrl : undefined,
    iconName: logoMode === 'icon' ? iconName : undefined,
    telegramGroup: url.includes('t.me') || category === 'telegram',
    isCustom: true,
    clicks: link.clicks || 0,
  };

  // Auto fetch favicon from domain
  const handleAutoFetchFavicon = () => {
    if (!url.trim()) return;
    const domain = getCleanDomain(url);
    if (domain && domain !== 'custom.link') {
      const highResFavicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      setImageUrl(highResFavicon);
      setLogoMode('image');
    }
  };

  // Local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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

  const handleSave = (e: React.FormEvent) => {
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

    const finalBadges = Array.from(new Set(['Custom', ...selectedBadges]));

    const updated: LinkItem = {
      ...link,
      title: title.trim(),
      url: formattedUrl,
      domain: domain,
      category: category,
      description: description.trim() || `Custom link for ${title.trim()}`,
      badge: (finalBadges[0] as BadgeType) || 'Custom',
      badges: finalBadges,
      logoType: logoMode,
      logoText: logoText.trim() || title.trim(),
      logoColor: logoColor,
      logoBg: logoBg,
      iconShape: iconShape,
      badgeVariant: badgeVariant,
      imageUrl: logoMode === 'image' && imageUrl.trim() ? imageUrl.trim() : undefined,
      iconName: logoMode === 'icon' ? iconName : undefined,
      telegramGroup: formattedUrl.includes('t.me') || category === 'telegram',
      tags: tags.length > 0 ? tags : (link.tags || ['Custom']),
      regions: (link.regions && link.regions.length > 0) ? link.regions : ['Global', 'India', 'USA', 'UK', 'Japan', 'Korea'],
      isCustom: true,
    };

    onUpdateLink(updated);
    onClose();
  };

  const handleDelete = () => {
    onDeleteLink(link.id);
    onClose();
  };

  const currentCategoryIcons = ICON_CATEGORIES.find((c) => c.id === activeIconTab)?.icons || ICON_CATEGORIES[0].icons;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#101328] border border-[#2b315c] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#151936]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Custom Logo & Badge Studio</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  {previewLink.badge || 'CUSTOM'}
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Design custom vector icon badges, shapes, glossy glows, colors, and direct link settings.
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
        <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Inputs (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Title & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
                    Site / Channel Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. My Cinema Hub"
                    className="w-full bg-[#171b38] border border-[#2b3360] focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
                    Website URL / TG Link *
                  </label>
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#171b38] border border-[#2b3360] focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
                    Category Section
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#171b38] border border-[#2b3360] focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#101328]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider font-mono">
                      Badges (Select 1 or More)
                    </label>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                      ★ Custom Badge Auto-Added
                    </span>
                  </div>
                  
                  {/* Multi-badge selectable chips */}
                  <div className="flex flex-wrap gap-1.5 p-2 bg-[#141838] border border-[#2b3360] rounded-xl max-h-32 overflow-y-auto custom-scrollbar">
                    {BADGE_OPTIONS.map((b) => {
                      const isSelected = selectedBadges.includes(b);
                      const isCustomAuto = b === 'Custom';
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => handleToggleBadge(b)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-400 shadow-xs'
                              : 'bg-[#1b1f3e] text-zinc-400 hover:text-white border-white/[0.06] hover:border-purple-500/40'
                          } ${isCustomAuto ? 'ring-1 ring-emerald-500/50' : ''}`}
                        >
                          <span>{b}</span>
                          {isSelected && <Check className="w-3 h-3 text-emerald-300" />}
                          {isCustomAuto && <span className="text-[8px] text-emerald-300 font-sans">(Auto)</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Badge input */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <input
                      type="text"
                      value={customBadgeInput}
                      onChange={(e) => setCustomBadgeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomBadge();
                        }
                      }}
                      placeholder="Type custom badge & press Add..."
                      className="flex-1 px-2.5 py-1.5 bg-[#171b38] border border-[#2b3360] focus:border-purple-500 rounded-lg text-xs text-white placeholder-zinc-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomBadge}
                      disabled={!customBadgeInput.trim()}
                      className="px-2.5 py-1.5 bg-purple-600/60 hover:bg-purple-600 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Logo Designer Modes */}
              <div className="pt-2 border-t border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-purple-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    <span>Logo Design Mode</span>
                  </label>
                  <div className="flex rounded-lg bg-[#141838] p-0.5 border border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => setLogoMode('icon')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        logoMode === 'icon'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Icon Badge Studio</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoMode('styled')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        logoMode === 'styled'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Type className="w-3 h-3" />
                      <span>Styled Text</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoMode('image')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        logoMode === 'image'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Image className="w-3 h-3" />
                      <span>Favicon / Image</span>
                    </button>
                  </div>
                </div>

                {/* Color Palette (Shared across modes) */}
                <div className="bg-[#141838] p-3 rounded-xl border border-white/[0.06] space-y-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Accent Color Theme
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {PRESET_COLORS.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => {
                          setLogoColor(col);
                          setLogoBg(`${col}25`);
                        }}
                        className={`w-6 h-6 rounded-full transition-transform hover:scale-110 cursor-pointer border relative flex items-center justify-center ${
                          logoColor === col ? 'border-white ring-2 ring-purple-500 scale-110' : 'border-white/20'
                        }`}
                        style={{ backgroundColor: col }}
                      >
                        {logoColor === col && <Check className="w-3 h-3 text-white drop-shadow" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode: Icon Badge Studio */}
                {logoMode === 'icon' && (
                  <div className="space-y-3 bg-[#141838] p-3 rounded-xl border border-white/[0.06]">
                    
                    {/* Badge Shape Selector */}
                    <div>
                      <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1.5">
                        1. Icon Badge Shape Variant
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                        {ICON_SHAPES.map((shape) => (
                          <button
                            key={shape.id}
                            type="button"
                            onClick={() => setIconShape(shape.id)}
                            className={`p-1.5 rounded-lg flex flex-col items-center justify-center gap-0.5 border text-[10px] font-bold transition-all cursor-pointer ${
                              iconShape === shape.id
                                ? 'bg-purple-600/30 border-purple-500 text-white shadow-xs'
                                : 'bg-[#101328] border-white/[0.06] text-zinc-400 hover:text-white'
                            }`}
                          >
                            <span className="text-xs">{shape.icon}</span>
                            <span className="truncate">{shape.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Badge Style / Effect Variant */}
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                        2. Badge Visual Effect & Aura
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {BADGE_VARIANTS.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setBadgeVariant(v.id)}
                            className={`p-1.5 rounded-lg text-left border transition-all cursor-pointer ${
                              badgeVariant === v.id
                                ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 shadow-xs'
                                : 'bg-[#101328] border-white/[0.06] text-zinc-400 hover:text-white'
                            }`}
                          >
                            <div className="text-[11px] font-bold truncate flex items-center justify-between">
                              <span>{v.label}</span>
                              {badgeVariant === v.id && <span className="text-emerald-400 text-[10px]">✓</span>}
                            </div>
                            <div className="text-[9px] text-zinc-500 truncate">{v.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Icon Selection with Category Tabs */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">
                          3. Choose Vector Icon ({ICON_CATEGORIES.reduce((acc, c) => acc + c.icons.length, 0)}+ available)
                        </label>
                        <span className="text-[10px] text-purple-400 font-mono font-bold">Selected: {iconName}</span>
                      </div>

                      {/* Icon Category Pill Tabs */}
                      <div className="flex gap-1 overflow-x-auto pb-1 mb-2 scrollbar-none">
                        {ICON_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setActiveIconTab(cat.id)}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                              activeIconTab === cat.id
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-[#101328] text-zinc-400 hover:text-white border border-white/[0.06]'
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>

                      {/* Icon Grid */}
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-36 overflow-y-auto p-1 bg-[#101328] rounded-lg border border-white/[0.06]">
                        {currentCategoryIcons.map((ico) => {
                          const IconComponent = ICON_MAP[ico.name] || Sparkles;
                          return (
                            <button
                              key={ico.name}
                              type="button"
                              onClick={() => setIconName(ico.name)}
                              className={`p-1.5 rounded-lg flex flex-col items-center justify-center gap-1 border text-[10px] transition-all cursor-pointer ${
                                iconName === ico.name
                                  ? 'bg-purple-600/40 border-purple-500 text-white shadow-xs'
                                  : 'bg-[#151936]/40 border-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                              }`}
                            >
                              <IconComponent className="w-4 h-4 text-purple-300 shrink-0" />
                              <span className="truncate max-w-[45px] text-[9px]">{ico.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Logo Text field in Icon Mode */}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                        Badge Label Text
                      </label>
                      <input
                        type="text"
                        value={logoText}
                        onChange={(e) => setLogoText(e.target.value)}
                        placeholder={title || 'BADGE TEXT'}
                        className="w-full bg-[#181d42] border border-[#2d3666] focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs text-white font-bold outline-none"
                      />
                    </div>

                  </div>
                )}

                {/* Mode: Styled Text */}
                {logoMode === 'styled' && (
                  <div className="space-y-2.5 bg-[#141838] p-3 rounded-xl border border-white/[0.06]">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                        Logo Display Text (e.g. CINEMA 4K, TORRENT PRO)
                      </label>
                      <input
                        type="text"
                        value={logoText}
                        onChange={(e) => setLogoText(e.target.value)}
                        placeholder={title || 'LOGO TEXT'}
                        className="w-full bg-[#181d42] border border-[#2d3666] focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs text-white font-black tracking-wider outline-none uppercase"
                      />
                    </div>
                  </div>
                )}

                {/* Mode: Image / Favicon */}
                {logoMode === 'image' && (
                  <div className="space-y-2.5 bg-[#141838] p-3 rounded-xl border border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Image URL or grab favicon..."
                        className="flex-1 bg-[#181d42] border border-[#2d3666] focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs text-white font-mono outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAutoFetchFavicon}
                        className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg shrink-0 cursor-pointer shadow-xs"
                      >
                        Auto Grab
                      </button>
                    </div>

                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-1.5 border border-dashed border-purple-500/40 bg-purple-950/20 hover:bg-purple-950/40 text-purple-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Image File from Device</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-purple-400" />
                    <span>Search Tags (comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="4K, Stream, Debrid, Hindi, Fast"
                    className="w-full bg-[#171b38] border border-[#2b3360] focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none font-mono"
                  />
                </div>
              </div>

            </div>

            {/* Right Column: Live Card Preview & Danger Zone */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#12162f] border border-[#28305c] rounded-xl p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Dynamic Preview</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">{previewLink.domain}</span>
                </div>

                {/* Render the actual LinkCard preview */}
                <div className="max-w-[280px] mx-auto my-2 pointer-events-none">
                  <div className="min-h-[140px] bg-[#121424] border border-purple-500/60 rounded-xl p-3 flex flex-col justify-between shadow-lg">
                    {/* Header with Title and Badge */}
                    <div className="flex items-center justify-between gap-1.5 border-b border-white/[0.05] pb-1.5">
                      <span className="font-bold text-[12px] text-zinc-100 truncate">
                        {previewLink.title || 'Link Title'}
                      </span>
                      {previewLink.badge && (
                        <span className="shrink-0 text-[8px] font-bold px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-600/40 uppercase">
                          {previewLink.badge}
                        </span>
                      )}
                    </div>
                    <div className="my-auto flex items-center justify-center py-2.5">
                      <LinkLogo link={previewLink} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 border-t border-white/[0.04] pt-2">
                      <div className="flex items-center gap-1 text-zinc-400 font-mono text-[11px] truncate">
                        <ExternalLink className="w-3 h-3 text-purple-400 shrink-0" />
                        <span className="truncate">{previewLink.domain}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {previewLink.telegramGroup && (
                          <span className="text-[9px] bg-sky-950 text-sky-400 px-1 rounded border border-sky-800/40 font-mono">
                            TG
                          </span>
                        )}
                        <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Info */}
                <div className="p-2.5 bg-[#090b17] rounded-lg border border-white/[0.04] text-[11px] text-zinc-400 space-y-1 mt-3 font-mono">
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span className="text-purple-300 font-bold uppercase">{logoMode}</span>
                  </div>
                  {logoMode === 'icon' && (
                    <>
                      <div className="flex justify-between">
                        <span>Shape:</span>
                        <span className="text-emerald-300 capitalize">{iconShape}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Effect:</span>
                        <span className="text-amber-300 capitalize">{badgeVariant}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Icon:</span>
                        <span className="text-white">{iconName}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="text-purple-300">{category}</span>
                  </div>
                </div>
              </div>

              {/* Delete Danger Zone */}
              <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-2">
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete This Custom Link</span>
                  </button>
                ) : (
                  <div className="space-y-2 animate-in fade-in duration-150">
                    <p className="text-[11px] text-rose-300 font-semibold text-center flex items-center justify-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Are you sure you want to delete this link?</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        Yes, Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/40 flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save & Apply Design</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
