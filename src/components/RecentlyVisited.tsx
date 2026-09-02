import React from 'react';
import { LinkItem } from '../types';
import { History, X, ExternalLink } from 'lucide-react';
import { LinkLogo } from './LinkLogo';

interface RecentlyVisitedProps {
  recentLinks: LinkItem[];
  onVisit: (link: LinkItem) => void;
  onClear: () => void;
}

export const RecentlyVisited: React.FC<RecentlyVisitedProps> = ({
  recentLinks,
  onVisit,
  onClear,
}) => {
  if (!recentLinks || recentLinks.length === 0) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mb-8 bg-[#0f1122]/60 border border-[#202544] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-wider font-bold text-zinc-400">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-purple-400" />
          <span className="text-zinc-300 font-mono">RECENTLY VISITED</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-[11px] font-mono lowercase transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {recentLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onVisit(link)}
            className="flex items-center gap-2 bg-[#171a33] hover:bg-[#202446] border border-[#2c325c] hover:border-purple-500/60 rounded-xl px-3 py-1.5 text-xs text-zinc-200 transition-all shadow-xs group"
          >
            <div className="scale-75 origin-left">
              <LinkLogo link={link} />
            </div>
            <span className="font-semibold text-xs text-zinc-100 group-hover:text-purple-300">
              {link.title}
            </span>
            <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-purple-400 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
};
