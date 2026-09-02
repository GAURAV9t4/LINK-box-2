import React from 'react';
import { 
  Film, Tv, BookOpen, Radio, Sparkles, Smartphone, Send, Cpu, 
  Bookmark, Globe, Star, Heart, ExternalLink, HelpCircle, ShieldAlert,
  Search, Plus, Layers, Zap, Flame, Lock
} from 'lucide-react';

export const getCategoryIcon = (iconName: string, className = "w-5 h-5") => {
  switch (iconName?.toLowerCase()) {
    case 'film':
    case 'movies':
      return <Film className={className} />;
    case 'tv':
    case 'anime':
      return <Tv className={className} />;
    case 'bookopen':
    case 'manga':
      return <BookOpen className={className} />;
    case 'radio':
    case 'livetv':
    case 'sports':
      return <Radio className={className} />;
    case 'sparkles':
    case 'paid':
      return <Sparkles className={className} />;
    case 'smartphone':
    case 'apps':
      return <Smartphone className={className} />;
    case 'send':
    case 'telegram':
      return <Send className={className} />;
    case 'cpu':
    case 'tech':
      return <Cpu className={className} />;
    case 'bookmark':
    case 'books':
      return <Bookmark className={className} />;
    case '18+':
    case '18plus':
    case 'adult':
    case 'shieldalert':
    case 'flame':
      return <ShieldAlert className={className} />;
    case 'lock':
      return <Lock className={className} />;
    default:
      return <Globe className={className} />;
  }
};

