import React, { useState } from 'react';
import { CategoryGroup, LinkItem, BadgeType, IconShapeType, BadgeVariantType } from '../types';
import { LinkLogo, ICON_MAP } from './LinkLogo';
import { 
  X, Plus, Sparkles, Send, Globe, Tag, Check, Palette, 
  Eye, ExternalLink, Share2, Type, Image, MessageSquareQuote,
  Film, Tv, Video, Clapperboard, Monitor, Headphones, Disc,
  Volume2, Crown, Award, Gem, Star, Flame, FlameKindling, Zap,
  BadgeCheck, Bot, Cpu, Terminal, Code, FileCode, Database,
  Server, Network, Boxes, Workflow, Laptop, Radar, Activity,
  Gamepad2, Swords, Ghost, Rocket, Joystick, Target, Crosshair,
  HardDrive, Folder, Download, Upload, Bookmark, Compass, Layers,
  RadioTower, Shield, ShieldCheck, ShieldAlert, Lock, Key
} from 'lucide-react';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryGroup[];
  onAddLink: (newLink: LinkItem) => void;
  onAddCategory: (newCategory: CategoryGroup) => void;
}

const ICON_CATEGORIES = [
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
    ],
  },
  {
    id: 'gaming',
    name: '🎮 Gaming & Anime',
    icons: [
      { name: 'Gamepad2', label: 'Gaming' },
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
    ],
  },
];

const PRESET_COLORS = [
  '#a855f7', '#3b82f6', '#06b6d4', '#10b981', '#eab308', 
  '#f97316', '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6', '#84cc16'
];

const ICON_SHAPES: { id: IconShapeType; label: string; icon: string }[] = [
  { id: 'rounded', label: 'Rounded', icon: '▢' },
  { id: 'pill', label: 'Pill', icon: '⬭' },
  { id: 'circle', label: 'Circle', icon: '◯' },
  { id: 'squircle', label: 'Squircle', icon: '⬟' },
  { id: 'hexagon', label: 'Hex Shield', icon: '⬡' },
  { id: 'cyber', label: 'Cyber', icon: '⧩' },
];

const BADGE_VARIANTS: { id: BadgeVariantType; label: string }[] = [
  { id: 'glow', label: 'Neon Glow' },
  { id: 'glass', label: 'Frosted Glass' },
  { id: 'solid', label: 'Solid Impact' },
  { id: 'dualtone', label: 'Dual-Tone' },
  { id: 'gradient', label: 'Gloss Gradient' },
  { id: 'outline', label: 'Ring Outline' },
  { id: 'metallic', label: '24K Metallic' },
  { id: 'neon', label: 'Matrix Neon' },
];

const BADGE_OPTIONS: string[] = [
  'Custom', 'Official', 'App', 'Movie', 'Anime', '18+', 'Hentai', 'Manga',
  'Free', 'Paid', 'HD', '4K', 'Live Sports', 'Telegram', 'AI Tech', 'Deshi', 'Dubbed', 'Subbed'
];

export const AddLinkModal: React.FC<AddLinkModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddLink,
  onAddCategory,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'movies');
  const [description, setDescription] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['Custom', 'Free']);
  const [customBadgeInput, setCustomBadgeInput] = useState('');
  const [isTelegram, setIsTelegram] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  // Logo Designer
  const [logoMode, setLogoMode] = useState<'icon' | 'styled' | 'image'>('icon');
  const [logoText, setLogoText] = useState('');
  const [logoColor, setLogoColor] = useState('#a855f7');
  const [iconName, setIconName] = useState('Sparkles');
  const [iconShape, setIconShape] = useState<IconShapeType>('rounded');
  const [badgeVariant, setBadgeVariant] = useState<BadgeVariantType>('glow');
  const [activeIconTab, setActiveIconTab] = useState('cinema');

  // Creating new category on the fly
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('#3b82f6');

  if (!isOpen) return null;

  // Toggle a badge in selectedBadges
  const handleToggleBadge = (b: string) => {
    if (b === 'Custom') return; // Custom is always kept for custom links
    if (selectedBadges.includes(b)) {
      setSelectedBadges(selectedBadges.filter((item) => item !== b));
    } else {
      setSelectedBadges([...selectedBadges, b]);
    }
  };

  // Add custom typed badge
  const handleAddCustomBadge = () => {
    const trimmed = customBadgeInput.trim();
    if (trimmed && !selectedBadges.includes(trimmed)) {
      setSelectedBadges([...selectedBadges, trimmed]);
      setCustomBadgeInput('');
    }
  };

  // Derive domain
  let domain = '';
  try {
    const formattedUrl = !/^https?:\/\//i.test(url.trim()) ? 'https://' + url.trim() : url.trim();
    const parsed = new URL(formattedUrl);
    domain = parsed.hostname.replace(/^www\./, '');
  } catch {
    domain = url.replace(/^https?:\/\//, '').split('/')[0] || 'custom.link';
  }

  // Preview link object
  const previewLink: LinkItem = {
    id: 'preview-link',
    title: title.trim() || 'Custom Link Title',
    url: url.trim() || 'https://example.com',
    domain: domain || 'example.com',
    category: category,
    description: description.trim() || 'Link description',
    badge: (selectedBadges[0] as BadgeType) || 'Custom',
    badges: selectedBadges.length > 0 ? selectedBadges : ['Custom'],
    logoType: logoMode,
    logoText: logoText.trim() || title.trim() || 'CUSTOM LINK',
    logoColor: logoColor,
    logoBg: `${logoColor}20`,
    iconShape: iconShape,
    badgeVariant: badgeVariant,
    iconName: logoMode === 'icon' ? iconName : undefined,
    telegramGroup: isTelegram || url.includes('t.me'),
    isCustom: true,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let finalCategory = category;

    // Handle custom category creation
    if (isCreatingCategory && newCatName.trim()) {
      const newCatId = newCatName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newCat: CategoryGroup = {
        id: newCatId,
        name: newCatName.trim(),
        description: newCatDesc.trim() || 'Custom curated category collection',
        icon: isTelegram ? 'Send' : 'Globe',
        color: newCatColor,
        isCustom: true,
      };
      onAddCategory(newCat);
      finalCategory = newCatId;
    }

    // Format URL with https if missing
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const finalBadges = Array.from(new Set(['Custom', ...selectedBadges]));

    const newLink: LinkItem = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      url: formattedUrl,
      domain: domain,
      category: finalCategory,
      description: description.trim() || `Direct link for ${title.trim()}`,
      badge: (finalBadges[0] as BadgeType) || 'Custom',
      badges: finalBadges,
      logoType: logoMode,
      logoText: logoText.trim() || title.trim(),
      logoColor: logoColor,
      logoBg: `${logoColor}20`,
      iconShape: iconShape,
      badgeVariant: badgeVariant,
      iconName: logoMode === 'icon' ? iconName : undefined,
      telegramGroup: isTelegram || formattedUrl.includes('t.me'),
      tags: tags.length > 0 ? tags : ['Curated', 'Direct', 'Custom'],
      regions: ['Global', 'India', 'USA', 'UK', 'Japan', 'Korea'],
      isCustom: true,
      addedAt: new Date().toISOString(),
      clicks: 1,
      status: 'active',
    };

    onAddLink(newLink);
    onClose();

    // Reset fields
    setTitle('');
    setUrl('');
    setDescription('');
    setTagsInput('');
    setSelectedBadges(['Custom', 'Free']);
  };

  const currentCategoryIcons = ICON_CATEGORIES.find((c) => c.id === activeIconTab)?.icons || ICON_CATEGORIES[0].icons;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#101328] border border-[#2b315c] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#151936]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Add Custom Link with Logo Studio</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  NEW
                </span>
              </h3>
              <p className="text-xs text-zinc-400">Add any website or Telegram group with custom vector icon badges and visual variants.</p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Column Form (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Site / Group Title & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
                    Title / Channel Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 4K Cinema Vault"
                    className="w-full px-3 py-2 bg-[#171b38] border border-[#2b3360] focus:border-purple-500 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-300 uppercase tracking-wider mb-1 font-mono">
                    Target URL / TG Link *
                  </label>
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://... or t.me/..."
                    className="w-full px-3 py-2 bg-[#171b38] border border-[#2b3360] focus:border-purple-500 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Category Selector or Create New Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider font-mono">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                      className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                    >
                      {isCreatingCategory ? '← Existing' : '+ New Category'}
                    </button>
                  </div>

                  {!isCreatingCategory ? (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-[#171b38] border border-[#2b3360] focus:border-purple-500 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-[#101328]">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-1.5 p-2 bg-[#171a33] border border-purple-500/40 rounded-xl">
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="Category Name"
                        className="w-full px-2.5 py-1.5 bg-[#121528] border border-zinc-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  )}
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
                        logoMode === 'icon' ? 'bg-purple-600 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Icon Badge</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoMode('styled')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                        logoMode === 'styled' ? 'bg-purple-600 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Type className="w-3 h-3" />
                      <span>Styled Text</span>
                    </button>
                  </div>
                </div>

                {/* Color Palette */}
                <div className="bg-[#141838] p-2.5 rounded-xl border border-white/[0.06] space-y-1.5">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Color Accent
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {PRESET_COLORS.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setLogoColor(col)}
                        className={`w-5 h-5 rounded-full transition-transform hover:scale-110 cursor-pointer border ${
                          logoColor === col ? 'border-white ring-2 ring-purple-500 scale-110' : 'border-white/20'
                        }`}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                </div>

                {/* Mode: Icon Badge */}
                {logoMode === 'icon' && (
                  <div className="space-y-3 bg-[#141838] p-3 rounded-xl border border-white/[0.06]">
                    {/* Shapes */}
                    <div>
                      <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1">
                        1. Shape Variant
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                        {ICON_SHAPES.map((shape) => (
                          <button
                            key={shape.id}
                            type="button"
                            onClick={() => setIconShape(shape.id)}
                            className={`p-1 rounded-lg flex flex-col items-center justify-center gap-0.5 border text-[10px] font-bold transition-all cursor-pointer ${
                              iconShape === shape.id
                                ? 'bg-purple-600/40 border-purple-500 text-white'
                                : 'bg-[#101328] border-white/[0.06] text-zinc-400'
                            }`}
                          >
                            <span className="text-xs">{shape.icon}</span>
                            <span className="truncate">{shape.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Effect Variants */}
                    <div>
                      <label className="block text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                        2. Visual Effect & Aura
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {BADGE_VARIANTS.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setBadgeVariant(v.id)}
                            className={`p-1.5 rounded-lg text-left border text-[10px] font-bold transition-all cursor-pointer ${
                              badgeVariant === v.id
                                ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200'
                                : 'bg-[#101328] border-white/[0.06] text-zinc-400'
                            }`}
                          >
                            <span className="truncate">{v.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Icon Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">
                          3. Choose Icon
                        </label>
                        <span className="text-[10px] text-purple-400 font-mono">Selected: {iconName}</span>
                      </div>
                      <div className="flex gap-1 overflow-x-auto pb-1 mb-1.5 scrollbar-none">
                        {ICON_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setActiveIconTab(cat.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap cursor-pointer ${
                              activeIconTab === cat.id ? 'bg-purple-600 text-white' : 'bg-[#101328] text-zinc-400'
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-5 gap-1 max-h-28 overflow-y-auto p-1 bg-[#101328] rounded-lg">
                        {currentCategoryIcons.map((ico) => {
                          const IconComp = ICON_MAP[ico.name] || Sparkles;
                          return (
                            <button
                              key={ico.name}
                              type="button"
                              onClick={() => setIconName(ico.name)}
                              className={`p-1.5 rounded-lg flex flex-col items-center justify-center gap-0.5 border text-[9px] cursor-pointer ${
                                iconName === ico.name ? 'bg-purple-600/40 border-purple-500 text-white' : 'border-white/[0.04] text-zinc-400'
                              }`}
                            >
                              <IconComp className="w-3.5 h-3.5 text-purple-300" />
                              <span className="truncate max-w-[40px]">{ico.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mode: Styled Text */}
                {logoMode === 'styled' && (
                  <div className="space-y-2 bg-[#141838] p-3 rounded-xl border border-white/[0.06]">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">
                      Logo Display Text
                    </label>
                    <input
                      type="text"
                      value={logoText}
                      onChange={(e) => setLogoText(e.target.value)}
                      placeholder={title || 'LOGO TEXT'}
                      className="w-full bg-[#181d42] border border-[#2d3666] focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs text-white font-black tracking-wider outline-none uppercase"
                    />
                  </div>
                )}
              </div>

              {/* Telegram checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is-telegram-toggle"
                  checked={isTelegram}
                  onChange={(e) => setIsTelegram(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-zinc-800 border-zinc-700 cursor-pointer"
                />
                <label htmlFor="is-telegram-toggle" className="text-xs text-zinc-300 cursor-pointer flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-sky-400" />
                  <span>This is a Telegram Channel / Discussion Group</span>
                </label>
              </div>

              {/* Remark */}
              <div>
                <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1 font-mono flex items-center gap-1">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-amber-400" />
                  <span>Remark / विचार (About this link)</span>
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Apna remark likhein (e.g. 'Daily 4K movies updates', 'Direct fast link')..."
                  className="w-full px-3 py-1.5 bg-[#171b38] border border-[#2b3360] focus:border-amber-500 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none resize-none"
                />
              </div>

            </div>

            {/* Right Column: Live Card Preview (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#12162f] border border-[#28305c] rounded-xl p-4 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Real-Time Preview</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">{previewLink.domain}</span>
                </div>

                {/* Card Preview */}
                <div className="max-w-[280px] mx-auto my-2 pointer-events-none">
                  <div className="min-h-[140px] bg-[#121424] border border-purple-500/60 rounded-xl p-3 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between gap-1.5 border-b border-white/[0.05] pb-1.5">
                      <span className="font-bold text-[12px] text-zinc-100 truncate">
                        {previewLink.title}
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
                    </>
                  )}
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="text-purple-300">{category}</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/40 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Link to Vault</span>
                </button>
              </div>

            </div>

          </div>
        </form>
      </div>
    </div>
  );
};
