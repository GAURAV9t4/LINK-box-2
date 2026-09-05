import React, { useState } from 'react';
import { 
  Home, Info, Send, ShieldAlert, Search, Globe, Palette, 
  Layers, ChevronUp, Sparkles, Plus, Moon, Sun, Monitor, Download, Settings, Heart, FileSpreadsheet
} from 'lucide-react';
import { ThemeMode } from '../types';
import { LinkBoxBrandLogo } from './LinkBoxBrandLogo';
import { REGIONS_MASTER, getRegionInfo } from '../utils/regions';

interface BottomFloatingBarProps {
  onOpenJumpModal: () => void;
  onOpenAboutModal: () => void;
  onOpenRequestModal: () => void;
  onOpenDmcaModal: () => void;
  onOpenSupportModal?: () => void;
  onFocusSearch: () => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onScrollToTop: () => void;
  onOpenAddModal: () => void;
  onOpenAutoSyncModal?: () => void;
  onExportData?: () => void;
  onExportCSV?: () => void;
  onOpenPrivacySettings?: () => void;
}

export const BottomFloatingBar: React.FC<BottomFloatingBarProps> = ({
  onOpenJumpModal,
  onOpenAboutModal,
  onOpenRequestModal,
  onOpenDmcaModal,
  onOpenSupportModal,
  onFocusSearch,
  selectedRegion,
  onSelectRegion,
  theme,
  onToggleTheme,
  onScrollToTop,
  onOpenAddModal,
  onOpenAutoSyncModal,
  onExportData,
  onExportCSV,
  onOpenPrivacySettings,
}) => {
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const currentRegion = getRegionInfo(selectedRegion);

  return (
    <>
      {/* Floating "Jump" Button on bottom right (as seen in PDF Page 1) */}
      <div className="fixed bottom-20 sm:bottom-20 right-4 sm:right-8 z-[99999] isolate transform-gpu">
        <button
          type="button"
          onClick={onOpenJumpModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-full shadow-2xl shadow-purple-950/80 border border-purple-400/30 hover:scale-105 transition-all cursor-pointer group"
        >
          <span className="text-base">🗂️</span>
          <span>Jump</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      </div>

      {/* Floating Bottom Control Bar (as seen in PDF Page 2) */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[99999] max-w-[96vw] sm:max-w-2xl w-[95%] sm:w-auto isolate transform-gpu pointer-events-auto">
        <div className="bg-[#121528] sm:bg-[#121528]/95 sm:backdrop-blur-md border border-[#2b315c] rounded-2xl px-2.5 sm:px-3 py-2 shadow-2xl flex items-center justify-between sm:justify-center gap-1.5 sm:gap-3 text-xs text-zinc-300 overflow-x-auto no-scrollbar">
          {/* Logo / Home with 3D Brand Logo */}
          <button
            type="button"
            onClick={onScrollToTop}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer shrink-0"
          >
            <LinkBoxBrandLogo size="sm" showSubtitle={false} />
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block shrink-0" />

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={onScrollToTop}
              className="px-2 py-1 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              Home
            </button>

            <button
              type="button"
              onClick={onOpenAboutModal}
              className="px-2 py-1 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              About
            </button>

            <button
              type="button"
              onClick={onOpenRequestModal}
              className="px-2 py-1 rounded-lg hover:bg-white/5 hover:text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              Request
            </button>

            <button
              type="button"
              onClick={onOpenDmcaModal}
              className="px-2 py-1 rounded-lg hover:bg-white/5 hover:text-white transition-colors hidden sm:inline cursor-pointer shrink-0 whitespace-nowrap"
            >
              DMCA
            </button>

            {/* Auto-Discovery Quick Trigger */}
            <button
              id="bottom-bar-auto-sync-btn"
              type="button"
              onClick={onOpenAutoSyncModal}
              title="Auto Link Discovery & Updates"
              className="px-2 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 hover:text-white border border-emerald-500/30 transition-colors flex items-center gap-1 font-semibold cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden sm:inline">Auto-Sync</span>
              <span className="sm:hidden">Auto</span>
            </button>

            {/* Dedicated Export Backup Button */}
            {onExportData && (
              <button
                id="bottom-bar-export-btn"
                type="button"
                onClick={onExportData}
                title="Export & Download JSON Data Backup"
                className="px-2 py-1 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/80 text-indigo-300 hover:text-white border border-indigo-500/40 transition-colors flex items-center gap-1 font-semibold cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Download className="w-3 h-3 text-indigo-400" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}

            {/* Dedicated Export CSV Analytics Button */}
            {onExportCSV && (
              <button
                id="bottom-bar-export-csv-btn"
                type="button"
                onClick={onExportCSV}
                title="Export Link Interaction & Category Engagement CSV"
                className="px-2 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 hover:text-white border border-emerald-500/40 transition-colors flex items-center gap-1 font-semibold cursor-pointer shrink-0 whitespace-nowrap"
              >
                <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">CSV</span>
              </button>
            )}

            {/* Custom Studio shortcut button */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('cat-section-custom-vault');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="px-2 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-900/70 text-purple-300 hover:text-white border border-purple-500/40 transition-colors flex items-center gap-1 font-semibold cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Studio</span>
            </button>

            {/* Dedicated Support Ad-Free button */}
            {onOpenSupportModal && (
              <button
                type="button"
                onClick={onOpenSupportModal}
                title="Support LinkBox (100% Ad-Free UPI & QR Scanner)"
                className="px-2 py-1 rounded-lg bg-pink-950/60 hover:bg-pink-900/80 text-pink-300 hover:text-white border border-pink-500/40 transition-colors flex items-center gap-1 font-semibold cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
              >
                <Heart className="w-3 h-3 fill-pink-400 text-pink-400" />
                <span className="hidden sm:inline">Ad-Free</span>
              </button>
            )}
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block shrink-0" />

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Search shortcut */}
            <button
              type="button"
              onClick={onFocusSearch}
              title="Search Directory"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Region toggle button with flag */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRegionMenu(!showRegionMenu)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-200 transition-colors text-[11px] cursor-pointer"
              >
                <span className="text-sm leading-none">{currentRegion.flag}</span>
                <span className="hidden sm:inline font-semibold">{currentRegion.shortName}</span>
                <span className="text-[9px] opacity-70">▾</span>
              </button>

              {showRegionMenu && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 max-h-64 overflow-y-auto bg-[#161a35] border border-[#2e3666] rounded-xl shadow-2xl p-1 z-50 text-left custom-scrollbar">
                  {REGIONS_MASTER.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        onSelectRegion(item.code);
                        setShowRegionMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        selectedRegion === item.code ? 'bg-purple-600/30 text-purple-300 font-bold' : 'hover:bg-white/10 text-zinc-200'
                      }`}
                    >
                      <span className="text-sm">{item.flag}</span>
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              title="Toggle Visual Theme"
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline text-[11px]">Theme</span>
            </button>

            {/* Privacy & Stealth Settings */}
            {onOpenPrivacySettings && (
              <button
                type="button"
                onClick={onOpenPrivacySettings}
                title="Privacy & Stealth Settings"
                className="p-1.5 rounded-lg hover:bg-white/5 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
