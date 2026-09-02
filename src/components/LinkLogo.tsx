import React from 'react';
import { LinkItem } from '../types';
import { 
  Film, Play, Tv, Sparkles, Send, Smartphone, BookOpen, Globe, 
  Flame, Shield, Zap, Lock, Star, Bot, Gamepad2, Radio, Music, 
  Cloud, Terminal, HardDrive, Bookmark, CheckCircle2, Download,
  Crown, Award, Gem, Rocket, Cpu, Layers, Compass, Eye, Video,
  Clapperboard, Monitor, Wifi, Feather, Heart, Boxes, Database,
  Code, Share2, Folder, Headphones, Disc, Volume2, Key,
  FileCode, Network, Server, Activity, Radar, ShieldAlert,
  ShieldCheck, Wrench, Sparkle, Glasses, Cast, Hash, Workflow,
  Laptop, RadioTower, Infinity as InfinityIcon, Swords, Ghost,
  Joystick, Target, Crosshair, Tag, Sun, Moon, BadgeCheck, FlameKindling
} from 'lucide-react';

interface LinkLogoProps {
  link: LinkItem;
  className?: string;
}

export const ICON_MAP: Record<string, React.ElementType> = {
  Film,
  Play,
  Tv,
  Sparkles,
  Send,
  Smartphone,
  BookOpen,
  Globe,
  Flame,
  Shield,
  Zap,
  Lock,
  Star,
  Bot,
  Gamepad: Gamepad2,
  Gamepad2,
  Radio,
  Music,
  Cloud,
  Terminal,
  HardDrive,
  Bookmark,
  CheckCircle2,
  Download,
  Crown,
  Award,
  Gem,
  Rocket,
  Cpu,
  Layers,
  Compass,
  Eye,
  Video,
  Clapperboard,
  Monitor,
  Wifi,
  Feather,
  Heart,
  Boxes,
  Database,
  Code,
  Share2,
  Folder,
  Headphones,
  Disc,
  Volume2,
  Key,
  FileCode,
  Network,
  Server,
  Activity,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  Sparkle,
  Glasses,
  Cast,
  Hash,
  Workflow,
  Laptop,
  RadioTower,
  Infinity: InfinityIcon,
  Swords,
  Ghost,
  Joystick,
  Target,
  Crosshair,
  Tag,
  Sun,
  Moon,
  BadgeCheck,
  FlameKindling,
};

export const LinkLogo: React.FC<LinkLogoProps> = ({ link }) => {
  const [imgError, setImgError] = React.useState(false);
  const activeLogoUrl = link.logoUrl || link.imageUrl;

  // 1. If CDN/custom image is provided and hasn't failed to load
  if (activeLogoUrl && !imgError) {
    return (
      <div className="flex items-center justify-center max-h-8 max-w-[130px] overflow-hidden">
        <img 
          src={activeLogoUrl} 
          alt={link.title} 
          className="max-h-7 max-w-[120px] object-contain rounded drop-shadow"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => {
            setImgError(true);
          }}
        />
      </div>
    );
  }

  // 2. If an icon logo / badge variant is chosen
  if (link.iconName && ICON_MAP[link.iconName]) {
    const IconComp = ICON_MAP[link.iconName];
    const color = link.logoColor || '#c084fc';
    const bg = link.logoBg || `${color}20`;
    const shape = link.iconShape || 'rounded';
    const variant = link.badgeVariant || 'glow';
    const text = link.logoText || link.title;

    // Shape classes
    let shapeClass = 'rounded-lg px-2.5 py-1';
    if (shape === 'circle') shapeClass = 'rounded-full px-2.5 py-1';
    else if (shape === 'squircle') shapeClass = 'rounded-2xl px-3 py-1';
    else if (shape === 'pill') shapeClass = 'rounded-full px-3 py-1';
    else if (shape === 'hexagon') shapeClass = 'rounded-sm px-2.5 py-1 border-x-2';
    else if (shape === 'cyber') shapeClass = 'rounded-none px-2.5 py-1 border-b-2 border-r-2';

    // Variant classes & styles
    let variantStyle: React.CSSProperties = {
      backgroundColor: bg,
      borderColor: `${color}40`,
      color: color,
    };

    if (variant === 'glow') {
      variantStyle = {
        ...variantStyle,
        boxShadow: `0 0 16px ${color}35`,
        borderColor: `${color}70`,
      };
    } else if (variant === 'glass') {
      variantStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(8px)',
        borderColor: 'rgba(255, 255, 255, 0.18)',
        color: color,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      };
    } else if (variant === 'solid') {
      variantStyle = {
        backgroundColor: color,
        color: '#000000',
        borderColor: color,
        fontWeight: 900,
      };
    } else if (variant === 'outline') {
      variantStyle = {
        backgroundColor: 'transparent',
        borderColor: color,
        color: color,
      };
    } else if (variant === 'gradient') {
      variantStyle = {
        background: `linear-gradient(135deg, ${color}40 0%, ${color}10 100%)`,
        borderColor: `${color}60`,
        color: color,
        boxShadow: `0 0 12px ${color}25`,
      };
    } else if (variant === 'dualtone') {
      return (
        <div 
          className={`flex items-center gap-1.5 p-0.5 pr-2.5 rounded-lg border font-bold text-xs max-w-full`}
          style={{
            backgroundColor: `${color}15`,
            borderColor: `${color}35`,
          }}
        >
          <div 
            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 shadow-xs"
            style={{ backgroundColor: color, color: '#000' }}
          >
            <IconComp className="w-3.5 h-3.5" />
          </div>
          <span className="truncate max-w-[90px] font-black tracking-wide" style={{ color: color }}>
            {text}
          </span>
        </div>
      );
    } else if (variant === 'metallic') {
      variantStyle = {
        background: 'linear-gradient(135deg, #ffd700 0%, #b8860b 50%, #fff8dc 100%)',
        color: '#1a1000',
        borderColor: '#ffd700',
        fontWeight: 900,
        boxShadow: '0 0 14px rgba(255, 215, 0, 0.4)',
      };
    } else if (variant === 'neon') {
      variantStyle = {
        backgroundColor: '#05060d',
        borderColor: color,
        color: color,
        boxShadow: `0 0 18px ${color}60, inset 0 0 8px ${color}25`,
        textShadow: `0 0 8px ${color}`,
      };
    }

    return (
      <div 
        className={`flex items-center gap-1.5 border font-bold text-xs max-w-full transition-all ${shapeClass}`}
        style={variantStyle}
      >
        <IconComp className="w-3.5 h-3.5 shrink-0" style={{ color: variant === 'solid' || variant === 'metallic' ? 'currentColor' : color }} />
        <span className="truncate max-w-[90px]">{text}</span>
      </div>
    );
  }

  const titleLower = link.title.toLowerCase();
  const domainLower = (link.domain || '').toLowerCase();
  const idLower = link.id.toLowerCase();

  // =========================================================================
  // AUTHENTIC OG BRAND LOGOS MATCHING PDF SITES
  // =========================================================================

  // 1. PRMovies
  if (titleLower.includes('prmovies') || domainLower.includes('prmovies')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs tracking-wider">
        <span className="text-white px-1.5 py-0.5 bg-zinc-800 rounded font-mono border border-zinc-700">PRM</span>
        <span className="flex items-center text-emerald-400 bg-emerald-950/90 px-1.5 py-0.5 rounded border border-emerald-700/60 shadow-xs">
          <Play className="w-2.5 h-2.5 fill-emerald-400 mr-0.5" /> VIES
        </span>
      </div>
    );
  }

  // 2. Desicinemas
  if (titleLower.includes('desicinema') || domainLower.includes('desicinema')) {
    return (
      <div className="flex items-center gap-1 px-2 py-0.5 bg-red-950/80 border border-red-800/60 rounded">
        <span className="font-black text-red-500 text-xs tracking-wider font-sans">DESI</span>
        <span className="font-black text-white text-xs tracking-widest font-sans">CINEMAS</span>
      </div>
    );
  }

  // 3. Movies Bazar
  if (titleLower.includes('bazar') || domainLower.includes('moviesbazar')) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-950/80 border border-amber-600/50 rounded">
        <span className="font-extrabold text-amber-400 text-xs tracking-wider">MOVIES</span>
        <span className="bg-amber-600 text-black text-[9px] font-black px-1 rounded uppercase">BAZAR</span>
      </div>
    );
  }

  // 4. BollyFlix
  if (titleLower.includes('bollyflix') || domainLower.includes('bollyflix')) {
    return (
      <div className="flex items-center gap-1 bg-red-950/90 border border-red-800/60 px-2 py-0.5 rounded">
        <span className="font-black text-white text-xs tracking-widest">BOLLY</span>
        <span className="bg-red-600 text-white text-[9px] font-black px-1 rounded uppercase tracking-normal">FLIX</span>
      </div>
    );
  }

  // 5. Netnaija
  if (titleLower.includes('netnaija') || domainLower.includes('netnaija')) {
    return (
      <div className="flex items-center gap-1 px-2 py-0.5 bg-sky-950/90 border border-sky-600/60 rounded">
        <span className="font-black text-white text-xs">NET</span>
        <span className="font-black text-sky-400 text-xs tracking-wider">NAIJA</span>
      </div>
    );
  }

  // 6. Movie Rulz / 5movierulz
  if (titleLower.includes('movie rulz') || domainLower.includes('movierulz')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs tracking-wider">
        <span className="bg-sky-500 text-black px-1.5 py-0.5 rounded text-[10px] font-extrabold">5</span>
        <span className="text-sky-300 font-mono tracking-widest">MOVIERULZ</span>
      </div>
    );
  }

  // 7. VegaMovies
  if (titleLower.includes('vegamovies') || titleLower.includes('vega movies') || domainLower.includes('vegamovies')) {
    return (
      <div className="flex items-center gap-1 font-extrabold text-xs tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
        <span>VEGA</span>
        <span className="text-amber-500 animate-pulse">⚡</span>
        <span className="text-amber-200">MOVIES</span>
      </div>
    );
  }

  // 8. HindiLinks4U
  if (titleLower.includes('hindilinks4u') || domainLower.includes('hindilinks4u')) {
    return (
      <div className="flex items-center gap-1 px-2 py-0.5 bg-rose-950/80 border border-rose-700/50 rounded font-bold text-xs">
        <span className="text-white">HindiLinks</span>
        <span className="bg-rose-600 text-white text-[9px] font-black px-1 rounded">4U</span>
      </div>
    );
  }

  // 9. Multi Movies
  if (titleLower.includes('multi movies') || domainLower.includes('multimovies')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs tracking-wider text-pink-400 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-600/40">
        <span className="text-purple-300">MULTI</span>
        <span className="text-pink-400">MOVIES</span>
      </div>
    );
  }

  // 10. KMMovies
  if (titleLower.includes('kmmovies') || domainLower.includes('kmmovies')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs">
        <span className="bg-emerald-600 text-black px-1.5 py-0.5 rounded text-[10px] font-black">KM</span>
        <span className="text-emerald-300 font-mono tracking-widest">MOVIES</span>
      </div>
    );
  }

  // 11. HDHub4u
  if (titleLower.includes('hdhub4u') || domainLower.includes('hdhub4u')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs bg-orange-950/80 px-2 py-0.5 rounded border border-orange-600/50">
        <span className="font-black text-white">HDHUB</span>
        <span className="bg-orange-600 text-white text-[9px] font-black px-1 rounded">4U</span>
      </div>
    );
  }

  // 12. Movies4u
  if (titleLower.includes('movies4u') || domainLower.includes('movies4u')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs bg-sky-950/80 px-2 py-0.5 rounded border border-sky-600/50">
        <span className="font-extrabold text-white">MOVIES</span>
        <span className="bg-sky-500 text-black text-[9px] font-black px-1 rounded">4U</span>
      </div>
    );
  }

  // 13. MoviesMod
  if (titleLower.includes('moviesmod') || domainLower.includes('moviesmod')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs bg-purple-950/80 px-2 py-0.5 rounded border border-purple-600/50">
        <span className="font-extrabold text-white">MOVIES</span>
        <span className="bg-purple-600 text-white text-[9px] font-black px-1 rounded">MOD</span>
      </div>
    );
  }

  // 14. World4ufree
  if (titleLower.includes('world4ufree') || domainLower.includes('world4ufree')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/40 font-mono tracking-wider">
        <span>WORLD</span>
        <span className="text-amber-500 font-sans">4U</span>
        <span>FREE</span>
      </div>
    );
  }

  // 15. Net77
  if (titleLower.includes('net77') || domainLower.includes('net77')) {
    return (
      <div className="flex items-center gap-1.5 font-bold text-xs">
        <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-black text-[10px]">N</span>
        <span className="font-extrabold text-rose-300 tracking-wider">Net77</span>
      </div>
    );
  }

  // 16. AlooyTV
  if (titleLower.includes('alooy') || domainLower.includes('alooy')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs bg-slate-800 px-2 py-0.5 rounded border border-slate-600">
        <span className="text-white font-extrabold">Alooy</span>
        <span className="text-cyan-400 font-mono text-[10px]">TV</span>
      </div>
    );
  }

  // 17. TheNextPlanet
  if (titleLower.includes('thenextplanet') || titleLower.includes('next planet')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-600/40">
        <span className="text-[10px] text-emerald-400">🪐</span>
        <span className="tracking-wide">NEXT PLANET</span>
      </div>
    );
  }

  // 18. YupFlix
  if (titleLower.includes('yupflix') || domainLower.includes('yupflix')) {
    return (
      <div className="flex items-center gap-1 font-extrabold text-xs text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-600/50">
        <span className="text-white">YUP</span>
        <span className="text-sky-400">FLIX</span>
      </div>
    );
  }

  // 19. TamilBlasters
  if (titleLower.includes('tamilblaster') || domainLower.includes('tamilblaster')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/50 tracking-wider">
        <span className="text-white">TAMIL</span>
        <span className="text-emerald-400">BLASTERS</span>
      </div>
    );
  }

  // 20. Cinephile
  if (titleLower.includes('cinephile') || domainLower.includes('cinephile')) {
    return (
      <div className="font-extrabold text-xs text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded border border-purple-700/50 tracking-widest font-mono uppercase">
        CINEPHILE
      </div>
    );
  }

  // 21. AG48 Anime
  if (titleLower.includes('ag48') || domainLower.includes('ag48')) {
    return (
      <div className="flex items-center gap-1 font-extrabold text-xs">
        <span className="bg-sky-600 text-white px-1.5 py-0.5 rounded text-[10px]">AG48</span>
        <span className="text-sky-300 tracking-wider font-sans">ANIME</span>
      </div>
    );
  }

  // 22. AnimeWorld India
  if (titleLower.includes('animeworld') || domainLower.includes('animeworld')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs bg-rose-950/80 px-2 py-0.5 rounded border border-rose-600/50">
        <span className="text-white font-black">AnimeWorld</span>
        <span className="text-xs">🇮🇳</span>
      </div>
    );
  }

  // 23. Anime Joker
  if (titleLower.includes('joker') || domainLower.includes('animejoker')) {
    return (
      <div className="flex items-center gap-1 font-extrabold text-xs text-pink-400 bg-pink-950/80 px-2 py-0.5 rounded border border-pink-600/50">
        <span className="text-xs">🃏</span>
        <span>Anime Joker</span>
      </div>
    );
  }

  // 24. Blakite Anime
  if (titleLower.includes('blakite') || domainLower.includes('subdubanime')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-600/50">
        <span className="text-purple-400">✦</span>
        <span className="tracking-wider">BLAKITE</span>
      </div>
    );
  }

  // 25. Anime4u
  if (titleLower.includes('anime4u') || domainLower.includes('anime4u')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs bg-red-950/80 px-2 py-0.5 rounded border border-red-600/50">
        <span className="font-extrabold text-white">ANIME</span>
        <span className="bg-red-600 text-white text-[9px] font-black px-1 rounded">4U</span>
      </div>
    );
  }

  // 26. AnimeDrive
  if (titleLower.includes('animedrive') || domainLower.includes('animedrive')) {
    return (
      <div className="flex items-center gap-1 font-extrabold text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/50">
        <span className="text-white">Anime</span>
        <span className="text-emerald-400 font-mono">DRIVE</span>
      </div>
    );
  }

  // 27. Desi Dub Anime
  if (titleLower.includes('desi dub') || domainLower.includes('desidubanime')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/50">
        <span className="text-amber-400 font-black">DESI DUB</span>
        <span className="text-zinc-300 text-[10px]">ANIME</span>
      </div>
    );
  }

  // 28. AnimeDekho
  if (titleLower.includes('animedekho') || domainLower.includes('animedekho')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs bg-sky-950/80 px-2 py-0.5 rounded border border-sky-600/50">
        <span className="text-white font-black">Anime</span>
        <span className="text-sky-400 font-black">Dekho</span>
      </div>
    );
  }

  // 29. AnimeLok
  if (titleLower.includes('animelok') || domainLower.includes('animelok')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs bg-purple-950/80 px-2 py-0.5 rounded border border-purple-600/50">
        <span className="text-purple-300 font-black">ANIME</span>
        <span className="text-purple-400">LOK</span>
      </div>
    );
  }

  // 30. AnimeSalt
  if (titleLower.includes('animesalt') || domainLower.includes('animesalt')) {
    return (
      <div className="font-extrabold text-xs text-cyan-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-600 tracking-wider">
        AnimeSalt
      </div>
    );
  }

  // 31. AnimePahe
  if (titleLower.includes('animepahe') || domainLower.includes('animepahe')) {
    return (
      <div className="font-bold text-xs text-red-500 bg-red-950/70 px-2 py-0.5 rounded border border-red-700/50 font-sans tracking-wide">
        animepahe
      </div>
    );
  }

  // 32. Rare Animes India
  if (titleLower.includes('rare anime') || domainLower.includes('rareanimes')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/50">
        <span className="text-xs">⭐</span>
        <span className="tracking-wider">RARE ANIMES</span>
      </div>
    );
  }

  // 33. AnimeSogo
  if (titleLower.includes('animesogo') || domainLower.includes('animesogo')) {
    return (
      <div className="font-extrabold text-xs text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-600/50 tracking-wider">
        AnimeSogo
      </div>
    );
  }

  // 34. Natomanga
  if (titleLower.includes('natomanga') || domainLower.includes('natomanga')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs bg-orange-950/80 px-2 py-0.5 rounded border border-orange-600/50">
        <span className="bg-orange-600 text-black px-1 rounded text-[10px] font-black">NT</span>
        <span className="text-orange-300 font-extrabold">Natomanga</span>
      </div>
    );
  }

  // 35. Tarang+
  if (titleLower.includes('tarang') || domainLower.includes('tarangplus')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/50 tracking-wider">
        <span>TARANG</span>
        <span className="text-amber-400 text-sm leading-none">+</span>
      </div>
    );
  }

  // 36. Disney+ Hotstar
  if (titleLower.includes('hotstar') || titleLower.includes('disney+')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs text-sky-300">
        <span className="text-xs font-serif text-white">Disney+</span>
        <span className="text-white font-sans text-[11px] bg-sky-950 px-1 py-0.2 rounded border border-sky-800/60">hotstar</span>
      </div>
    );
  }

  // 37. YuppTV
  if (titleLower.includes('yupptv') || domainLower.includes('yupptv')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/50">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
        <span>YuppTV</span>
      </div>
    );
  }

  // 38. Shudder
  if (titleLower.includes('shudder') || domainLower.includes('shudder')) {
    return (
      <div className="font-black text-xs text-red-500 bg-red-950/90 px-2.5 py-0.5 rounded border border-red-800/80 tracking-widest font-mono uppercase">
        SHUDDER
      </div>
    );
  }

  // 39. Hulu
  if (titleLower.includes('hulu') || domainLower.includes('hulu')) {
    return (
      <div className="font-black text-sm text-emerald-400 font-sans tracking-tight">
        hulu
      </div>
    );
  }

  // 40. Netflix
  if (titleLower.includes('netflix') || domainLower.includes('netflix')) {
    return (
      <div className="font-black text-sm tracking-widest text-red-600 font-sans">
        NETFLIX
      </div>
    );
  }

  // 41. Rakuten Viki
  if (titleLower.includes('viki') || domainLower.includes('viki')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs">
        <span className="text-zinc-300 text-[10px]">Rakuten</span>
        <span className="text-cyan-400 font-black text-xs">Viki</span>
      </div>
    );
  }

  // 42. HBO Max
  if (titleLower.includes('hbo') || titleLower.includes('hbomax')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs text-purple-300 tracking-wider">
        <span className="bg-purple-950 border border-purple-800 px-1 rounded text-white font-mono">HBO</span>
        <span className="text-purple-400 font-sans">max</span>
      </div>
    );
  }

  // 43. Apple TV+
  if (titleLower.includes('apple tv') || domainLower.includes('apple.com')) {
    return (
      <div className="flex items-center gap-1 font-medium text-xs text-white">
        <span className="text-sm"></span>
        <span className="font-semibold text-zinc-200">tv+</span>
      </div>
    );
  }

  // 44. Prime Video
  if (titleLower.includes('prime video') || domainLower.includes('primevideo')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs text-sky-400 font-sans">
        <span className="text-white">prime</span>
        <span className="text-sky-400">video</span>
      </div>
    );
  }

  // 45. Paramount+
  if (titleLower.includes('paramount') || domainLower.includes('paramount')) {
    return (
      <div className="flex items-center gap-0.5 font-extrabold text-xs text-sky-300 font-serif">
        <span>Paramount</span>
        <span className="text-sky-400 text-sm leading-none">+</span>
      </div>
    );
  }

  // 46. Crunchyroll
  if (titleLower.includes('crunchyroll') || domainLower.includes('crunchyroll')) {
    return (
      <div className="flex items-center gap-1.5 font-bold text-xs text-orange-500">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-orange-500 inline-block bg-orange-500/20"></span>
        <span className="font-sans">crunchyroll</span>
      </div>
    );
  }

  // 47. MGM+
  if (titleLower.includes('mgm') || domainLower.includes('mgmplus')) {
    return (
      <div className="flex items-center gap-0.5 font-black text-xs text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/50 font-serif">
        <span>MGM</span>
        <span className="text-amber-400">+</span>
      </div>
    );
  }

  // 48. Peacock
  if (titleLower.includes('peacock') || domainLower.includes('peacock')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs text-slate-200">
        <span className="text-sm">🦚</span>
        <span className="font-extrabold tracking-wide">Peacock</span>
      </div>
    );
  }

  // 49. AMC+
  if (titleLower.includes('amc') || domainLower.includes('amcplus')) {
    return (
      <div className="flex items-center gap-0.5 font-black text-xs text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-600/50 font-mono">
        <span>aMC</span>
        <span className="text-teal-400">+</span>
      </div>
    );
  }

  // 50. SonyLIV
  if (titleLower.includes('sonyliv') || domainLower.includes('sonyliv') || titleLower.includes('sony liv')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs bg-slate-900 px-2 py-0.5 rounded border border-sky-500/50">
        <span className="text-white">SONY</span>
        <span className="text-sky-400 bg-sky-950 px-1 rounded text-[10px]">LIV</span>
      </div>
    );
  }

  // 51. Aha Video
  if (titleLower.includes('aha') || domainLower.includes('aha.video')) {
    return (
      <div className="font-black text-xs text-orange-500 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-600/50 uppercase tracking-widest font-sans">
        aha!
      </div>
    );
  }

  // 50. JioHotstar
  if (titleLower.includes('jiohotstar') || (titleLower.includes('jio') && titleLower.includes('hotstar'))) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs">
        <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">Jio</span>
        <span className="text-sky-300 font-sans">Hotstar</span>
      </div>
    );
  }

  // 51. Aha
  if (titleLower === 'aha' || titleLower.includes('aha video') || domainLower.includes('aha.video')) {
    return (
      <div className="font-black text-sm text-orange-500 bg-orange-950/80 px-2.5 py-0.5 rounded border border-orange-600/50 font-sans lowercase tracking-tighter">
        aha
      </div>
    );
  }

  // 52. PlayTorrio
  if (titleLower.includes('playtorrio') || domainLower.includes('playtorrio')) {
    return (
      <div className="flex items-center gap-1 font-extrabold text-xs text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-600/50">
        <span className="text-purple-400">▶</span>
        <span>PlayTorrio</span>
      </div>
    );
  }

  // 53. UVO tv
  if (titleLower.includes('uvo') || domainLower.includes('uvotv')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs bg-sky-950/80 px-2 py-0.5 rounded border border-sky-600/50">
        <span className="font-black text-white">UVO</span>
        <span className="text-sky-400 font-mono text-[10px]">tv</span>
      </div>
    );
  }

  // 54. HDO Box
  if (titleLower.includes('hdo') || domainLower.includes('hdobox')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs">
        <span className="bg-orange-600 text-white px-1.5 py-0.5 rounded text-[10px] font-black">H</span>
        <span className="text-orange-300 font-mono tracking-wider">HDO BOX</span>
      </div>
    );
  }

  // 55. BeeTV
  if (titleLower.includes('beetv') || titleLower.includes('bee tv') || domainLower.includes('beetv')) {
    return (
      <div className="flex items-center gap-1 font-extrabold text-xs text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/50">
        <span className="text-xs">🐝</span>
        <span>BeeTV</span>
      </div>
    );
  }

  // 56. MovieBox
  if (titleLower.includes('moviebox') || domainLower.includes('moviebox') || domainLower.includes('moviesbox')) {
    return (
      <div className="flex items-center gap-1 font-extrabold text-xs text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-600/50">
        <Film className="w-3 h-3 text-sky-400" />
        <span>MovieBox</span>
      </div>
    );
  }

  // 57. NetMirror
  if (titleLower.includes('netmirror') || domainLower.includes('netmirror')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/50">
        <span className="text-emerald-400">🪞</span>
        <span>NetMirror</span>
      </div>
    );
  }

  // 58. PikaShow
  if (titleLower.includes('pikashow') || domainLower.includes('pikashow')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-500/60">
        <span className="text-amber-400 text-xs">⚡</span>
        <span className="tracking-wider">PikaShow TV</span>
      </div>
    );
  }

  // 59. YouCine
  if (titleLower.includes('youcine') || domainLower.includes('youcine')) {
    return (
      <div className="font-extrabold text-xs text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-600/50 tracking-wider">
        YouCine
      </div>
    );
  }

  // 60. Playfy
  if (titleLower.includes('playfy') || domainLower.includes('playfy')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-600">
        <span className="text-xs">📺</span>
        <span>Playfy TV</span>
      </div>
    );
  }

  // 61. German & International Portals (Kinox, S.TO, Bs.to, etc.)
  if (titleLower.includes('kinox') || domainLower.includes('kinox')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs text-amber-400 bg-zinc-900 px-2 py-0.5 rounded border border-amber-600/50">
        <span className="text-white">KINOX</span>
        <span className="text-amber-400 font-mono">.to</span>
      </div>
    );
  }

  if (titleLower.includes('serienstream') || titleLower.includes('s.to') || domainLower.includes('serienstream')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs bg-red-950/80 px-2 py-0.5 rounded border border-red-700/50">
        <span className="bg-red-600 text-white px-1 rounded text-[10px]">S.TO</span>
        <span className="text-red-300 font-sans">Serien</span>
      </div>
    );
  }

  if (titleLower.includes('bs.to') || titleLower.includes('burning series')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50">
        <span className="bg-amber-600 text-black px-1 rounded text-[10px]">BS</span>
        <span className="text-amber-300 font-sans">Series</span>
      </div>
    );
  }

  if (titleLower.includes('aniworld') || domainLower.includes('aniworld')) {
    return (
      <div className="flex items-center gap-1 font-extrabold text-xs text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-600/50">
        <span className="text-sky-400">✦</span>
        <span>AniWorld</span>
      </div>
    );
  }

  if (titleLower.includes('megakino') || domainLower.includes('megakino')) {
    return (
      <div className="font-black text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/50 tracking-wider">
        MEGAKINO
      </div>
    );
  }

  // French specific branding logos
  if (titleLower.includes('tv5monde') || domainLower.includes('tv5monde')) {
    return (
      <div className="flex items-center gap-1 bg-red-950/90 border border-red-700/60 px-2 py-0.5 rounded font-black text-xs">
        <span className="text-white">TV5</span>
        <span className="bg-red-600 text-white text-[9px] px-1 rounded">MONDE+</span>
      </div>
    );
  }

  if (titleLower.includes('yablom') || domainLower.includes('yablom')) {
    return (
      <div className="font-extrabold text-xs text-sky-400 bg-sky-950/80 px-2.5 py-0.5 rounded border border-sky-600/50 tracking-wider font-mono uppercase">
        YABLOM
      </div>
    );
  }

  if (titleLower.includes('movix') || domainLower.includes('movix')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/50">
        <span className="text-white">MOVIX</span>
        <span className="text-emerald-400 font-mono text-[10px]">HD</span>
      </div>
    );
  }

  if (titleLower.includes('purstream') || domainLower.includes('purstream')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs bg-orange-950/80 px-2 py-0.5 rounded border border-orange-600/50">
        <span className="text-orange-400 font-black">PUR</span>
        <span className="text-white font-extrabold">STREAM</span>
      </div>
    );
  }

  if (titleLower === 'tf1+' || titleLower.includes('tf1') || domainLower.includes('tf1.fr')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs bg-blue-950/90 border border-blue-600/60 px-2 py-0.5 rounded">
        <span className="text-white">TF1</span>
        <span className="bg-blue-600 text-white text-[9px] px-1 rounded font-sans">+</span>
      </div>
    );
  }

  if (titleLower.includes('flixium') || domainLower.includes('flixium')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-600/50 tracking-wider">
        <span className="text-purple-400">⚡</span>
        <span>FLIXIUM</span>
      </div>
    );
  }

  if (titleLower.includes('fawesome') || domainLower.includes('fawesome')) {
    return (
      <div className="flex items-center gap-1 font-extrabold text-xs text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/50">
        <span className="text-amber-400 font-black">FAWESOME</span>
        <span className="text-zinc-300 text-[10px]">TV</span>
      </div>
    );
  }

  if (titleLower.includes('voiranime') || titleLower.includes('voir anime') || domainLower.includes('voir-anime')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs bg-red-950/90 border border-red-700/60 px-2 py-0.5 rounded">
        <span className="text-white">VOIR</span>
        <span className="bg-red-600 text-white text-[9px] px-1 rounded">ANIME</span>
      </div>
    );
  }

  if (titleLower.includes('animes ultra') || domainLower.includes('animesultra')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-600/50">
        <span className="text-white font-extrabold">ANIMES</span>
        <span className="text-purple-400 font-mono">ULTRA</span>
      </div>
    );
  }

  if (titleLower.includes('vostfree') || domainLower.includes('vostfree')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-600/50 tracking-wider">
        <span className="text-white">VOST</span>
        <span className="text-sky-400">FREE</span>
      </div>
    );
  }

  if (titleLower.includes('sekai') || domainLower.includes('sekai.one')) {
    return (
      <div className="font-extrabold text-xs text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-600/50 tracking-wider">
        SEKAI.one
      </div>
    );
  }

  if (titleLower.includes('anime-sama') || titleLower.includes('anime sama')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs bg-red-950/90 border border-red-700/60 px-2 py-0.5 rounded">
        <span className="text-white">ANIME</span>
        <span className="bg-red-600 text-white text-[9px] px-1 rounded font-mono">SAMA</span>
      </div>
    );
  }

  if (titleLower.includes('sushiscan') || titleLower.includes('sushi scan')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-600/50">
        <span>🍣 SushiScan</span>
      </div>
    );
  }

  if (titleLower.includes('scantrad') || domainLower.includes('manga-scantrad')) {
    return (
      <div className="flex items-center gap-1 font-extrabold text-xs text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-600/50">
        <span className="text-white">SCAN</span>
        <span className="text-sky-400">TRAD</span>
      </div>
    );
  }

  if (titleLower.includes('mangas origines') || domainLower.includes('mangas-origines')) {
    return (
      <div className="font-extrabold text-xs text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded border border-purple-600/50">
        Mangas Origines
      </div>
    );
  }

  if (titleLower.includes('phenix') || domainLower.includes('phenix-scans')) {
    return (
      <div className="flex items-center gap-1 font-bold text-xs bg-red-950/80 px-2 py-0.5 rounded border border-red-700/50">
        <span className="text-xs">🔥</span>
        <span className="text-red-300 font-extrabold">Phenix Scans</span>
      </div>
    );
  }

  if (titleLower.includes('lelmanga') || domainLower.includes('lelmanga')) {
    return (
      <div className="font-black text-xs text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-600/50 tracking-wider">
        LELMANGA
      </div>
    );
  }

  if (titleLower.includes('arte') || domainLower.includes('arte.tv')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs bg-orange-950/90 border border-orange-600/60 px-2.5 py-0.5 rounded">
        <span className="text-orange-400 font-mono tracking-widest">ARTE</span>
        <span className="bg-orange-600 text-black text-[9px] px-1 rounded font-sans">HD</span>
      </div>
    );
  }

  if (titleLower.includes('wareztuga') || domainLower.includes('wareztuga')) {
    return (
      <div className="font-black text-xs text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded border border-red-700/50 tracking-wider">
        WAREZTUGA
      </div>
    );
  }

  if (titleLower.includes('viaplay') || domainLower.includes('viaplay')) {
    return (
      <div className="flex items-center gap-1 font-black text-xs bg-orange-950/90 border border-orange-600/60 px-2 py-0.5 rounded">
        <span className="text-white">via</span>
        <span className="text-orange-400 font-sans">play</span>
      </div>
    );
  }

  if (link.telegramGroup || link.category === 'telegram') {
    return (
      <div className="flex items-center gap-1.5 font-bold text-xs text-sky-400">
        <Send className="w-3.5 h-3.5 fill-sky-400" />
        <span className="text-sky-200 truncate max-w-[110px]">{link.logoText || link.title}</span>
      </div>
    );
  }

  // General formatted brand logo with color badge
  const text = link.logoText || link.title;
  const color = link.logoColor || '#ffffff';

  return (
    <div 
      className="font-extrabold text-xs sm:text-sm tracking-wide px-2.5 py-1 rounded max-w-full truncate text-center"
      style={{
        color: color,
        backgroundColor: link.logoBg || undefined,
        textShadow: `0 0 12px ${color}33`,
      }}
    >
      {text}
    </div>
  );
};

