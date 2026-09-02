import React from 'react';
import { CategoryGroup } from '../types';
import { X, ArrowRight, Zap, Layers } from 'lucide-react';
import { getCategoryIcon } from '../utils/icons';

interface JumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryGroup[];
  counts: { [categoryId: string]: number };
  onJumpToCategory: (categoryId: string) => void;
}

export const JumpModal: React.FC<JumpModalProps> = ({
  isOpen,
  onClose,
  categories,
  counts,
  onJumpToCategory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121528] border border-[#2b315c] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600/30 flex items-center justify-center text-purple-300">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Jump to Category</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories List */}
        <div className="p-3 max-h-[70vh] overflow-y-auto space-y-1.5">
          {/* Direct jump to Custom Links & Logo Studio */}
          <button
            type="button"
            onClick={() => {
              onJumpToCategory('custom-vault');
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 hover:from-purple-900/60 hover:to-indigo-900/60 border border-purple-500/50 transition-all text-left group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold bg-purple-600">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-purple-200 group-hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Custom Links & Logo Studio</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-purple-500/30 text-purple-300 rounded">NEW</span>
                </h4>
                <p className="text-[11px] text-zinc-300 truncate max-w-[220px]">
                  Personal links, customizable logos & private vault
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          {categories.map((cat) => {
            const count = counts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onJumpToCategory(cat.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#171a33] hover:bg-[#20254c] border border-[#282f56] hover:border-purple-500/50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: cat.color || '#6366f1' }}
                  >
                    {getCategoryIcon(cat.icon, 'w-4 h-4')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {cat.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 truncate max-w-[220px]">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                    {count}
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
