import React from 'react';
import { Heart, Download, Upload, Github, Send, Sparkles, FileSpreadsheet } from 'lucide-react';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenRequest: () => void;
  onOpenDmca: () => void;
  onOpenSupport?: () => void;
  onExportData: () => void;
  onExportCSV?: () => void;
  onImportData: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAbout,
  onOpenRequest,
  onOpenDmca,
  onOpenSupport,
  onExportData,
  onExportCSV,
  onImportData,
}) => {
  return (
    <footer className="w-full border-t border-white/[0.08] mt-20 pt-10 pb-28 text-xs text-zinc-400 max-w-5xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Navigation Links (Matching PDF Page 4) */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
          <button
            type="button"
            onClick={onOpenAbout}
            className="hover:text-white transition-colors"
          >
            About
          </button>
          <button
            type="button"
            onClick={onOpenRequest}
            className="hover:text-white transition-colors"
          >
            Request
          </button>
          <button
            type="button"
            onClick={onOpenDmca}
            className="hover:text-white transition-colors"
          >
            DMCA
          </button>
          {onOpenSupport && (
            <button
              type="button"
              onClick={onOpenSupport}
              className="text-pink-400 hover:text-pink-300 font-semibold transition-colors flex items-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 fill-pink-400" />
              <span>Support UPI</span>
            </button>
          )}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 font-semibold"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram Channel</span>
          </a>
        </div>

        {/* Data Backup / Export / Import */}
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono flex-wrap">
          {onExportCSV && (
            <button
              type="button"
              onClick={onExportCSV}
              title="Export link interaction and category engagement data as CSV"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
              <span>Export CSV</span>
            </button>
          )}
          <button
            type="button"
            onClick={onExportData}
            title="Download JSON backup of all links and custom additions"
            className="flex items-center gap-1 text-zinc-400 hover:text-purple-300 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>Export JSON</span>
          </button>
          <button
            type="button"
            onClick={onImportData}
            title="Import custom links JSON"
            className="flex items-center gap-1 text-zinc-400 hover:text-purple-300 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <Upload className="w-3 h-3" />
            <span>Import</span>
          </button>
        </div>
      </div>

      {/* Right / Bottom Copyright Line (Matching PDF Page 4) */}
      <div className="mt-8 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-2 text-zinc-500 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span>Curated with</span>
          <Heart className="w-3.5 h-3.5 text-purple-400 fill-purple-400 inline" />
          <span>by the LINK BOX Team</span>
        </div>
        <div>
          <span>© 2026 LINK BOX. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
