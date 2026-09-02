import React, { useState } from 'react';
import { LinkItem, CategoryGroup } from '../types';
import { 
  Send, ExternalLink, Copy, Check, Star, ThumbsUp, Heart, Flame, 
  Share2, ShieldCheck, Tag, Globe, Sparkles, Edit3, Trash2, QrCode
} from 'lucide-react';
import { getCategoryIcon } from '../utils/icons';
import { getPrimaryLinkRegion } from '../utils/regions';
import { getBadgeCustomStyle, BadgeSvgIcon, getLinkBadges } from '../utils/badgeManager';

interface TelegramGroupViewProps {
  categories: CategoryGroup[];
  links: LinkItem[];
  onVisit: (link: LinkItem) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  onEditLink?: (link: LinkItem) => void;
  onDeleteLink?: (id: string) => void;
  onShowQr?: (link: LinkItem) => void;
}

export const TelegramGroupView: React.FC<TelegramGroupViewProps> = ({
  categories,
  links,
  onVisit,
  onToggleFavorite,
  favorites,
  onEditLink,
  onDeleteLink,
  onShowQr,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Track each user's chosen reaction per link: { [linkId]: 'thumbs' | 'heart' | 'fire' | null }
  const [userReactions, setUserReactions] = useState<{ [id: string]: 'thumbs' | 'heart' | 'fire' | null }>(() => {
    try {
      const saved = localStorage.getItem('linkbox_user_reactions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persisted reaction counts: { [linkId]: { thumbs: number, heart: number, fire: number } }
  const [reactions, setReactions] = useState<{ [id: string]: { thumbs: number; heart: number; fire: number } }>(() => {
    try {
      const saved = localStorage.getItem('linkbox_reaction_counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleShare = async (link: LinkItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: link.title,
          text: `Check out ${link.title}: ${link.url}`,
          url: link.url,
        });
        return;
      } catch (err) {
        // Share cancelled
      }
    }
    // Fallback: Copy
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopy = (id: string, url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 1-person 1-reaction logic (Point 2: single vote limit, no infinite inflation, toggle on/off)
  const handleReact = (
    id: string,
    type: 'thumbs' | 'heart' | 'fire',
    e: React.MouseEvent,
    baseCounts: { thumbs: number; heart: number; fire: number }
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const previousReaction = userReactions[id];
    let nextReaction: 'thumbs' | 'heart' | 'fire' | null = type;

    // Get current counts or fallback to baseline
    const currentCounts = reactions[id] || { ...baseCounts };
    const updatedCounts = { ...currentCounts };

    if (previousReaction === type) {
      // User tapped the active reaction again -> remove / toggle off
      nextReaction = null;
      updatedCounts[type] = Math.max(0, (updatedCounts[type] || 1) - 1);
    } else if (previousReaction) {
      // User switched their reaction to another type
      updatedCounts[previousReaction] = Math.max(0, (updatedCounts[previousReaction] || 1) - 1);
      updatedCounts[type] = (updatedCounts[type] || 0) + 1;
    } else {
      // User giving reaction for first time
      updatedCounts[type] = (updatedCounts[type] || 0) + 1;
    }

    const updatedUserVotes = {
      ...userReactions,
      [id]: nextReaction,
    };

    const updatedAllCounts = {
      ...reactions,
      [id]: updatedCounts,
    };

    setUserReactions(updatedUserVotes);
    setReactions(updatedAllCounts);

    try {
      localStorage.setItem('linkbox_user_reactions', JSON.stringify(updatedUserVotes));
      localStorage.setItem('linkbox_reaction_counts', JSON.stringify(updatedAllCounts));
    } catch {
      // Ignore quota errors
    }
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {categories.map((cat) => {
        const catLinks = links.filter((l) => l.category === cat.id);
        if (catLinks.length === 0) return null;

        return (
          <div
            key={cat.id}
            id={`tg-group-${cat.id}`}
            className="bg-[#0f1224] border border-[#252a4a] rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden"
          >
            {/* Telegram Channel Header Banner */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
                  style={{ backgroundColor: cat.color || '#3b82f6' }}
                >
                  {getCategoryIcon(cat.icon, 'w-6 h-6')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      {cat.name}
                      <span className="text-sky-400 text-xs px-2 py-0.5 bg-sky-950/80 border border-sky-800/60 rounded-full font-mono font-normal">
                        Channel Group
                      </span>
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{cat.description}</p>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                  {catLinks.length} Links in Cluster
                </span>
              </div>
            </div>

            {/* Telegram Message Feed Items */}
            <div className="space-y-4">
              {catLinks.map((link, idx) => {
                const isFav = favorites.includes(link.id);
                const regionInfo = getPrimaryLinkRegion(link.regions);
                const itemReactions = reactions[link.id] || {
                  thumbs: 12 + (idx * 3) % 20,
                  heart: 18 + (idx * 7) % 35,
                  fire: 30 + (idx * 11) % 50,
                };

                return (
                  <div
                    id={`tg-card-${link.id}`}
                    key={link.id}
                    className="bg-[#141830] hover:bg-[#181d3a] border border-[#282f56] hover:border-sky-500/60 rounded-xl p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.015] shadow-md hover:shadow-2xl hover:shadow-sky-950/50 group will-change-transform"
                  >
                    {/* Post Author / Header */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-sky-900/60 border border-sky-700/40 flex items-center justify-center text-sky-300 font-bold text-xs shrink-0">
                          {link.title.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1.5 truncate">
                            {link.title}
                          </h4>

                          {/* Region Badge with Flag (Point 2) */}
                          <span 
                            className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded border text-[9px] font-bold font-mono ${regionInfo.badgeBg} ${regionInfo.badgeText} ${regionInfo.badgeBorder}`}
                            title={`Region: ${regionInfo.name}`}
                          >
                            <span>{regionInfo.flag}</span>
                            <span>{regionInfo.shortName}</span>
                          </span>

                          {/* Multi Badges with SVG Icons & Custom Colors */}
                          {(link.badges && link.badges.length > 0 ? link.badges : getLinkBadges(link)).map((b, idx) => (
                            <span
                              key={idx}
                              style={getBadgeCustomStyle(b)}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded border text-[9px] uppercase font-bold tracking-wider shadow-xs"
                            >
                              <BadgeSvgIcon name={b} className="w-2.5 h-2.5 shrink-0" />
                              <span>{b}</span>
                            </span>
                          ))}

                          <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                            <Globe className="w-3 h-3 text-zinc-500" />
                            {link.domain}
                          </span>
                        </div>
                      </div>

                      {/* Top Action Icons */}
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {link.isCustom && onEditLink && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              onEditLink(link);
                            }}
                            title={`Edit custom link "${link.title}"`}
                            className="p-1.5 text-zinc-400 hover:text-amber-300 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}

                        {link.isCustom && onDeleteLink && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              onDeleteLink(link.id);
                            }}
                            title={`Delete custom link "${link.title}"`}
                            className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-rose-400" />
                          </button>
                        )}

                        {onShowQr && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              onShowQr(link);
                            }}
                            title="Show QR Code"
                            className="p-1.5 text-zinc-400 hover:text-purple-300 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleCopy(link.id, link.url, e)}
                          title="Copy Link URL"
                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                        >
                          {copiedId === link.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onToggleFavorite(link.id);
                          }}
                          title="Bookmark"
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isFav
                              ? 'text-amber-400 bg-amber-950/40'
                              : 'text-zinc-400 hover:text-amber-400 hover:bg-white/10'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleShare(link, e)}
                          title="Share Link"
                          className="p-1.5 text-zinc-400 hover:text-cyan-300 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Post Description / Content */}
                    <p className="text-xs text-zinc-300 leading-relaxed mb-3 pl-9">
                      {link.description || `Direct curated link for ${link.title} accessible immediately with fast mirror servers.`}
                    </p>

                    {/* Tags */}
                    {link.tags && link.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3 pl-9">
                        {link.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-sky-300 bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded-md flex items-center gap-0.5"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Row: Reaction Pills & Direct Browser Launch Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] pl-9">
                      <div className="flex items-center gap-1.5">
                        {/* Thumbs Reaction (1 user 1 vote max) */}
                        <button
                          type="button"
                          onClick={(e) => handleReact(link.id, 'thumbs', e, { thumbs: 12 + (idx * 3) % 20, heart: 18 + (idx * 7) % 35, fire: 30 + (idx * 11) % 50 })}
                          title={userReactions[link.id] === 'thumbs' ? 'Your reaction (click to remove)' : 'React with 👍'}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono transition-all cursor-pointer border select-none ${
                            userReactions[link.id] === 'thumbs'
                              ? 'bg-sky-500/25 text-sky-200 border-sky-400 font-bold ring-1 ring-sky-400/40 shadow-xs'
                              : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/5'
                          }`}
                        >
                          <ThumbsUp className={`w-3 h-3 ${userReactions[link.id] === 'thumbs' ? 'text-sky-300 fill-sky-400/30' : 'text-sky-400'}`} />
                          <span>{itemReactions.thumbs}</span>
                          {userReactions[link.id] === 'thumbs' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0"></span>
                          )}
                        </button>

                        {/* Heart Reaction (1 user 1 vote max) */}
                        <button
                          type="button"
                          onClick={(e) => handleReact(link.id, 'heart', e, { thumbs: 12 + (idx * 3) % 20, heart: 18 + (idx * 7) % 35, fire: 30 + (idx * 11) % 50 })}
                          title={userReactions[link.id] === 'heart' ? 'Your reaction (click to remove)' : 'React with ❤️'}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono transition-all cursor-pointer border select-none ${
                            userReactions[link.id] === 'heart'
                              ? 'bg-rose-500/25 text-rose-200 border-rose-400 font-bold ring-1 ring-rose-400/40 shadow-xs'
                              : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/5'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${userReactions[link.id] === 'heart' ? 'text-rose-300 fill-rose-400' : 'text-rose-400'}`} />
                          <span>{itemReactions.heart}</span>
                          {userReactions[link.id] === 'heart' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                          )}
                        </button>

                        {/* Fire Reaction (1 user 1 vote max) */}
                        <button
                          type="button"
                          onClick={(e) => handleReact(link.id, 'fire', e, { thumbs: 12 + (idx * 3) % 20, heart: 18 + (idx * 7) % 35, fire: 30 + (idx * 11) % 50 })}
                          title={userReactions[link.id] === 'fire' ? 'Your reaction (click to remove)' : 'React with 🔥'}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono transition-all cursor-pointer border select-none ${
                            userReactions[link.id] === 'fire'
                              ? 'bg-amber-500/25 text-amber-200 border-amber-400 font-bold ring-1 ring-amber-400/40 shadow-xs'
                              : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/5'
                          }`}
                        >
                          <Flame className={`w-3 h-3 ${userReactions[link.id] === 'fire' ? 'text-amber-300 fill-amber-400' : 'text-amber-400'}`} />
                          <span>{itemReactions.fire}</span>
                          {userReactions[link.id] === 'fire' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          window.open(link.url, '_blank', 'noopener,noreferrer');
                          onVisit(link);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs group-hover:border-sky-400"
                      >
                        <span>Open Channel / Link</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
