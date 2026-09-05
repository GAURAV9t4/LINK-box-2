import React, { useState } from 'react';
import { 
  Sparkles, Globe, Shield, Activity, Users, Zap, ExternalLink, Heart, ChevronDown, Check
} from 'lucide-react';
import { LinkBoxBrandLogo } from './LinkBoxBrandLogo';
import { REGIONS_MASTER, getRegionInfo } from '../utils/regions';
import linkboxLogo3d from '../assets/images/linkbox_3d_cube_logo_1788081383272.jpg';

interface HeroSectionProps {
  totalLinks: number;
  totalCategories: number;
  totalRegions?: number;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  onOpenSupportModal: () => void;
  onOpenAutoSyncModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalLinks,
  totalCategories,
  totalRegions = 16,
  selectedRegion,
  onSelectRegion,
  onOpenSupportModal,
  onOpenAutoSyncModal,
}) => {
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [liveUsers] = useState(14820 + Math.floor(Math.random() * 450));

  const currentRegionInfo = getRegionInfo(selectedRegion);

  return (
    <div className="w-full mb-8">
      {/* Top Support & Announcement Banner for Ad-Free Experience */}
      <div className="w-full bg-gradient-to-r from-[#1a1334] via-[#241648] to-[#1a1334] border-b border-purple-900/60 px-4 py-2 text-center text-xs sm:text-sm text-purple-200 flex flex-wrap items-center justify-center gap-2 sm:gap-3 relative shadow-sm">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>LinkBox को 100% Ad-Free रखने के लिए सपोर्ट करें ❤️ (UPI: <strong className="text-amber-300 font-mono">81gauravbob@axl</strong>)</span>
        </span>
        <button
          type="button"
          onClick={onOpenSupportModal}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold px-3 py-1 rounded-full text-xs transition-all shadow-md hover:scale-105 cursor-pointer"
        >
          <span>Support & QR</span>
          <Heart className="w-3.5 h-3.5 fill-pink-200 text-pink-200" />
        </button>
      </div>

      {/* Main Hero Container with deep indigo / glowing backdrop */}
      <div className="mt-4 sm:mt-6 bg-[#0f1124] border border-[#232746] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center max-w-5xl mx-auto">
        {/* Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-r from-purple-600/15 via-indigo-600/15 to-sky-600/15 blur-3xl pointer-events-none rounded-full" />

        {/* Brand Logo & Title with 3D Isometric Logo (Requested by User) */}
        <div className="flex flex-col items-center justify-center mb-3">
          {/* New 3D Isometric Metallic Cube Logo in Medium Size above site title */}
          <div className="relative mb-3.5 group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-purple-400/40 bg-[#090b17] shadow-[0_0_30px_rgba(168,85,247,0.45)] flex items-center justify-center">
              <img
                src={linkboxLogo3d}
                alt="LINK BOX 3D Cube Logo"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <LinkBoxBrandLogo size="hero" showSubtitle={true} showIcon={false} />
        </div>

        {/* Sub-heading */}
        <p className="text-base sm:text-lg font-bold text-zinc-200 max-w-2xl mx-auto mb-1 mt-1">
          Your streaming <span className="text-purple-400">everything</span> & Telegram groups
        </p>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto mb-4">
          Curated streaming sites, instant search, multi-region country support & custom link studio.
        </p>

        {/* Region Selector with Flags (Point 1) */}
        <div className="relative inline-block mb-8">
          <button
            type="button"
            onClick={() => setShowRegionDropdown(!showRegionDropdown)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-200 bg-[#161a33] hover:bg-[#1e2345] px-4 py-1.5 rounded-full border border-purple-500/30 hover:border-purple-500/60 transition-all shadow-md cursor-pointer"
          >
            <span className="text-zinc-400">Region:</span>
            <span className="text-base leading-none">{currentRegionInfo.flag}</span>
            <span className="font-bold text-white">{currentRegionInfo.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
          </button>

          {/* Region Dropdown with Flags for all countries */}
          {showRegionDropdown && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 max-h-72 overflow-y-auto bg-[#151833] border border-[#2b315c] rounded-2xl shadow-2xl p-1.5 z-40 text-left custom-scrollbar">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-zinc-400 border-b border-white/[0.06]">
                Select Region / Country
              </div>
              {REGIONS_MASTER.map((r) => (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => {
                    onSelectRegion(r.code);
                    setShowRegionDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer my-0.5 ${
                    selectedRegion === r.code
                      ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40'
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{r.flag}</span>
                    <span className="truncate">{r.name}</span>
                  </span>
                  {selectedRegion === r.code && <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3 Large Dynamic Stat Metrics (Point 3 - Exact counts by selected region & global) */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto mb-6">
          <div className="bg-[#141733]/90 border border-[#252a55] hover:border-purple-500/40 rounded-2xl p-3.5 sm:p-4 text-center shadow-md transition-all">
            <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {totalLinks}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-zinc-400 tracking-wider uppercase mt-0.5 font-mono flex items-center justify-center gap-1">
              <span>SITES</span>
              {selectedRegion !== 'all' && (
                <span className="text-[9px] text-purple-300">({currentRegionInfo.shortName})</span>
              )}
            </div>
          </div>

          <div className="bg-[#141733]/90 border border-[#252a55] hover:border-purple-500/40 rounded-2xl p-3.5 sm:p-4 text-center shadow-md transition-all">
            <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {totalCategories}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-zinc-400 tracking-wider uppercase mt-0.5 font-mono">
              CATEGORIES
            </div>
          </div>

          <div className="bg-[#141733]/90 border border-[#252a55] hover:border-purple-500/40 rounded-2xl p-3.5 sm:p-4 text-center shadow-md transition-all">
            <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5">
              <span>{totalRegions}</span>
              {selectedRegion !== 'all' && <span className="text-lg">{currentRegionInfo.flag}</span>}
            </div>
            <div className="text-[10px] sm:text-xs font-bold text-zinc-400 tracking-wider uppercase mt-0.5 font-mono">
              {selectedRegion === 'all' ? 'REGIONS' : 'ACTIVE REGION'}
            </div>
          </div>
        </div>

        {/* Bot Auto-update & Realtime Users Bar (as in PDF) with Auto-Sync Discovery Trigger */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-zinc-400 font-mono pt-2 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onOpenAutoSyncModal}
            className="flex items-center gap-2 hover:text-white px-2 py-1 rounded-lg bg-purple-950/30 hover:bg-purple-900/50 border border-purple-500/20 transition-all cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-purple-300 font-semibold group-hover:text-purple-200">Auto-Link Engine:</span>
            <span className="text-emerald-300 font-bold">Active</span>
            <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200 font-sans">⚡ Auto-Add New World Links →</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-300 font-semibold">{liveUsers.toLocaleString()}</span>
            <span>online now</span>
          </div>
        </div>
      </div>
    </div>
  );
};
