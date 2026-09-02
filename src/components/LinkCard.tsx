import React, { useState } from 'react';
import { LinkItem, ReactionType } from '../types';
import { LinkLogo } from './LinkLogo';
import { getPrimaryLinkRegion } from '../utils/regions';
import { getBadgeClasses, getBadgeCustomStyle, BadgeSvgIcon, getLinkBadges } from '../utils/badgeManager';
import { ExternalLink, Star, Copy, Check, Info, ShieldCheck, Zap, Sparkles, Edit3, Trash2, Share2, QrCode } from 'lucide-react';

interface LinkCardProps {
  link: LinkItem;
  onVisit: (link: LinkItem) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite?: boolean;
  onEdit?: (link: LinkItem) => void;
  onDelete?: (id: string) => void;
  onShowQr?: (link: LinkItem) => void;
  onReact?: (linkId: string, type: ReactionType) => void;
  userReaction?: ReactionType | null;
  reactionCounts?: { heart: number; zap: number; like: number };
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  onVisit,
  onToggleFavorite,
  isFavorite = false,
  onEdit,
  onDelete,
  onShowQr,
  onReact,
  userReaction,
  reactionCounts,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const regionInfo = getPrimaryLinkRegion(link.regions);

  // Compute baseline reaction counts deterministically if not provided
  const counts = reactionCounts || link.reactions || {
    heart: Math.floor(((link.clicks || 1200) % 70) + 12),
    zap: Math.floor(((link.clicks || 900) % 50) + 8),
    like: Math.floor(((link.clicks || 1500) % 90) + 15),
  };

  const handleReactionClick = (e: React.MouseEvent, type: ReactionType) => {
    e.stopPropagation();
    e.preventDefault();
    if (onReact) {
      onReact(link.id, type);
    }
  };

  const handleShowQr = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onShowQr) {
      onShowQr(link);
    }
  };

  const handleOpenLink = (e: React.MouseEvent) => {
    // Open directly in a new browser tab
    window.open(link.url, '_blank', 'noopener,noreferrer');
    onVisit(link);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (navigator.share) {
      try {
        await navigator.share({
          title: link.title,
          text: `Check out ${link.title}: ${link.url}`,
          url: link.url,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return;
      } catch (err) {
        // Share cancelled or dismissed
      }
    }
    // Fallback: Copy URL to clipboard
    try {
      await navigator.clipboard.writeText(link.url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // Fallback copy failed
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleFavorite(link.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onEdit) {
      onEdit(link);
    }
  };

  // Direct safe delete without window.confirm (which is blocked by sandboxed iframe)
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) {
      onDelete(link.id);
    }
  };

  // Badge stylings matching directory badges
  const getBadgeStyle = (badge?: string) => {
    return getBadgeClasses(badge);
  };

  // Compute multi-badges for this link
  const cardBadges = link.badges && link.badges.length > 0 ? link.badges : getLinkBadges(link);

  return (
    <div
      id={`link-card-${link.id}`}
      onClick={handleOpenLink}
      className="linkbox-card group relative flex flex-col justify-between min-h-[162px] bg-[#121424] hover:bg-[#161a32] border border-[#232742] hover:border-purple-500/70 rounded-xl p-3 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] shadow-sm hover:shadow-2xl hover:shadow-purple-600/25 active:scale-[0.99] select-none overflow-hidden will-change-transform"
    >
      {/* Top Header of the Link: Multi Badges & Region Flag on top left, QR, Copy & Star on top right */}
      <div className="flex items-center justify-between gap-1.5 w-full border-b border-white/[0.05] pb-1.5">
        <div className="flex items-center gap-1 min-w-0 flex-1 overflow-x-auto no-scrollbar">
          {/* Multi Badges with SVG Icons & Custom Color Coding */}
          {cardBadges.slice(0, 3).map((b, idx) => (
            <span
              key={idx}
              style={getBadgeCustomStyle(b)}
              className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border uppercase text-[8px] font-extrabold tracking-wider shadow-xs whitespace-nowrap"
            >
              <BadgeSvgIcon name={b} className="w-2.5 h-2.5 shrink-0" />
              <span>{b}</span>
            </span>
          ))}
          {cardBadges.length > 3 && (
            <span 
              className="shrink-0 text-[7.5px] font-mono px-1 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800/40"
              title={cardBadges.slice(3).join(', ')}
            >
              +{cardBadges.length - 3}
            </span>
          )}

          {/* Region Badge with Flag & Code */}
          <span
            className={`shrink-0 inline-flex items-center gap-1 px-1.5 py-0.2 rounded border text-[9px] font-bold font-mono ${regionInfo.badgeBg} ${regionInfo.badgeText} ${regionInfo.badgeBorder}`}
            title={`Region: ${regionInfo.name}`}
          >
            <span className="text-[11px] leading-none">{regionInfo.flag}</span>
            <span>{regionInfo.shortName}</span>
          </span>
        </div>

        {/* Action icons: QR, Copy & Favorite */}
        <div className="flex items-center gap-0.5 shrink-0">
          {onShowQr && (
            <button
              type="button"
              onClick={handleShowQr}
              title="Show QR Code"
              className="opacity-75 sm:opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-purple-300 hover:bg-white/10 rounded cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy direct URL"}
            className="opacity-75 sm:opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-zinc-100 hover:bg-white/10 rounded cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleFavorite}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            className={`p-1 rounded transition-colors cursor-pointer ${
              isFavorite
                ? 'text-amber-400 hover:text-amber-300'
                : 'text-zinc-500 hover:text-amber-400'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                isFavorite ? 'fill-amber-400 text-amber-400' : 'stroke-[1.75]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Center Area: Link Logo with Link Title placed right by its side */}
      <div className="my-auto flex items-center gap-2.5 py-2 min-w-0">
        <div className="shrink-0 flex items-center justify-center">
          <LinkLogo link={link} />
        </div>
        <div className="flex flex-col min-w-0 flex-1 justify-center">
          <span 
            className="font-bold text-[13px] text-zinc-100 group-hover:text-purple-300 transition-colors truncate tracking-tight"
            title={link.title}
          >
            {link.title}
          </span>
          {link.description ? (
            <span className="text-[10.5px] text-zinc-400 truncate leading-tight mt-0.5" title={link.description}>
              {link.description}
            </span>
          ) : (
            <span className="text-[10px] text-zinc-500 font-mono truncate leading-tight mt-0.5">
              {link.domain || link.url.replace(/^https?:\/\//, '')}
            </span>
          )}
        </div>
      </div>

      {/* Reaction Rate Strip: ♥️ ⚡ 👍 (1 vote per person, non-editable, anti-spam) */}
      <div 
        className="flex items-center justify-between gap-1 py-1 px-1.5 bg-[#0a0d1c]/90 border border-white/[0.05] rounded-lg my-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => handleReactionClick(e, 'heart')}
          title={userReaction === 'heart' ? "You reacted ♥️ (Click to remove)" : "React ♥️ Love"}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer select-none ${
            userReaction === 'heart'
              ? 'bg-rose-950/90 text-rose-300 font-bold border border-rose-500/60 shadow-xs'
              : 'text-zinc-400 hover:text-rose-300 hover:bg-rose-950/30 border border-transparent'
          }`}
        >
          <span className="text-[11px] leading-none">♥️</span>
          <span>{counts.heart}</span>
        </button>

        <button
          type="button"
          onClick={(e) => handleReactionClick(e, 'zap')}
          title={userReaction === 'zap' ? "You reacted ⚡ (Click to remove)" : "React ⚡ Superfast"}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer select-none ${
            userReaction === 'zap'
              ? 'bg-amber-950/90 text-amber-300 font-bold border border-amber-500/60 shadow-xs'
              : 'text-zinc-400 hover:text-amber-300 hover:bg-amber-950/30 border border-transparent'
          }`}
        >
          <span className="text-[11px] leading-none">⚡</span>
          <span>{counts.zap}</span>
        </button>

        <button
          type="button"
          onClick={(e) => handleReactionClick(e, 'like')}
          title={userReaction === 'like' ? "You reacted 👍 (Click to remove)" : "React 👍 Verified"}
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer select-none ${
            userReaction === 'like'
              ? 'bg-emerald-950/90 text-emerald-300 font-bold border border-emerald-500/60 shadow-xs'
              : 'text-zinc-400 hover:text-emerald-300 hover:bg-emerald-950/30 border border-transparent'
          }`}
        >
          <span className="text-[11px] leading-none">👍</span>
          <span>{counts.like}</span>
        </button>
      </div>

      {/* Bottom Domain, TG badge, Custom Edit/Delete, and Share button */}
      <div className="flex items-center justify-between text-[11px] text-zinc-400 group-hover:text-zinc-200 border-t border-white/[0.04] pt-1.5 mt-auto">
        <div className="flex items-center gap-1 truncate max-w-[120px] text-zinc-400 font-mono text-[11px]">
          <ExternalLink className="w-3 h-3 text-purple-400 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          <span className="truncate">{link.domain || link.url.replace(/^https?:\/\//, '')}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {link.telegramGroup && (
            <span className="text-[9px] bg-sky-950 text-sky-400 px-1 rounded border border-sky-800/40 font-mono">
              TG
            </span>
          )}

          {/* Edit option at bottom for custom links */}
          {link.isCustom && onEdit && (
            <button
              type="button"
              onClick={handleEdit}
              title={`Edit custom link "${link.title}"`}
              className="p-1 rounded text-zinc-400 hover:text-amber-300 hover:bg-amber-500/15 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete option at bottom for custom links */}
          {link.isCustom && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              title={`Delete custom link "${link.title}"`}
              className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-rose-950/60 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            </button>
          )}

          {/* QR button in bottom row */}
          {onShowQr && (
            <button
              type="button"
              onClick={handleShowQr}
              title="Show QR Code"
              className="p-1 rounded text-zinc-400 hover:text-purple-300 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Share button in the bottom right corner */}
          <button
            type="button"
            onClick={handleShare}
            title={shared ? "Link shared / copied to clipboard!" : "Share this link"}
            className={`p-1 rounded transition-all cursor-pointer flex items-center gap-0.5 ${
              shared
                ? 'text-emerald-300 bg-emerald-950/60 ring-1 ring-emerald-500/50'
                : 'text-zinc-400 hover:text-cyan-300 hover:bg-white/10'
            }`}
          >
            {shared ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Hover Tooltip / Detail overlay on long hover */}
      {(link.description || (link.tags && link.tags.length > 0)) && (
        <div 
          className="absolute inset-0 bg-[#0f1122]/95 backdrop-blur-xs p-2.5 text-xs text-zinc-300 flex flex-col justify-between opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-10"
          style={{ transitionDelay: '700ms' }}
        >
          <div>
            <p className="font-bold text-white text-xs mb-1 flex items-center justify-between">
              <span className="truncate">{link.title}</span>
              <span className="text-[10px] text-purple-400 font-mono shrink-0 ml-1">{link.domain}</span>
            </p>
            {link.description && (
              <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed mb-1">
                {link.description}
              </p>
            )}
            {link.tags && link.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {link.tags.slice(0, 3).map((t, idx) => (
                  <span key={idx} className="text-[9px] font-mono px-1.5 py-0.2 bg-purple-950/80 text-purple-300 rounded border border-purple-800/40">
                    #{t.replace(/^#/, '')}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-800">
            <span className="flex items-center gap-1">
              <span>{regionInfo.flag}</span>
              <span>{regionInfo.name}</span>
            </span>
            {link.clicks && <span>{link.clicks} clicks</span>}
          </div>
        </div>
      )}
    </div>
  );
};

