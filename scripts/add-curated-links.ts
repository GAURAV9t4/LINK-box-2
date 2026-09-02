import fs from 'fs';
import path from 'path';
import { BASE_GLOBAL_LINKS, INITIAL_CATEGORIES, ALL_PDF_REGIONS } from '../src/data/initialData';
import { ALL_REGIONAL_LINKS } from '../src/data/regionalData';
import { LinkItem } from '../src/types';
import { migrateLink } from '../src/utils/dataMigration';
import { deduplicateLinks } from '../src/utils/dedup';

// Highly requested, verified, and community-trusted web services across categories and regions
const NEW_EXTRA_CURATED_LINKS: LinkItem[] = [
  // ================= 1. MOVIES & SHOWS (FREE & STREAMING) =================
  {
    id: 'extra-mov-braflix',
    title: 'Braflix',
    url: 'https://braflix.video',
    domain: 'braflix.video',
    category: 'movies',
    badge: 'AD-FREE',
    logoText: 'Braflix',
    logoColor: '#6366f1',
    logoBg: '#1e1b4b',
    description: 'Ad-free, lightning-fast streaming for movies and series with multiple high-speed servers.',
    tags: ['Movies', 'Streaming', 'Ad-Free', 'HD 1080p'],
    regions: ['Global', 'USA'],
    clicks: 6540,
    reactions: { heart: 180, zap: 110, like: 260 },
    status: 'active'
  },
  {
    id: 'extra-mov-cineby',
    title: 'Cineby',
    url: 'https://cineby.app',
    domain: 'cineby.app',
    category: 'movies',
    badge: '4K UHD',
    logoText: 'Cineby',
    logoColor: '#e11d48',
    logoBg: '#4c0519',
    description: 'Sleek UI cinema player featuring multi-source 4K and 1080p streaming with subtitle support.',
    tags: ['Cinema', '4K UHD', 'Movies', 'Trending'],
    regions: ['Global', 'USA'],
    clicks: 5890,
    reactions: { heart: 145, zap: 92, like: 210 },
    status: 'active'
  },
  {
    id: 'extra-mov-lookmovie',
    title: 'LookMovie',
    url: 'https://www.lookmovie2.to',
    domain: 'lookmovie2.to',
    category: 'movies',
    badge: 'HD',
    logoText: 'LookMovie',
    logoColor: '#f59e0b',
    logoBg: '#451a03',
    description: 'Extensive library of classic and latest cinematic releases with high-speed playback.',
    tags: ['LookMovie', 'Movies', 'Shows', 'HD 1080p'],
    regions: ['Global', 'USA'],
    clicks: 7200,
    reactions: { heart: 195, zap: 120, like: 310 },
    status: 'active'
  },
  {
    id: 'extra-mov-tubi',
    title: 'Tubi TV',
    url: 'https://tubitv.com',
    domain: 'tubitv.com',
    category: 'movies',
    badge: 'Official',
    logoText: 'Tubi',
    logoColor: '#f97316',
    logoBg: '#431407',
    description: '100% legal and free streaming platform by FOX with over 50,000+ movies and television shows.',
    tags: ['Tubi', 'Official', 'Legal Free', 'Hollywood'],
    regions: ['USA', 'Global'],
    clicks: 8400,
    reactions: { heart: 240, zap: 150, like: 390 },
    status: 'active'
  },
  {
    id: 'extra-mov-pluto',
    title: 'Pluto TV',
    url: 'https://pluto.tv',
    domain: 'pluto.tv',
    category: 'livetv',
    badge: 'Official',
    logoText: 'Pluto TV',
    logoColor: '#eab308',
    logoBg: '#422006',
    description: 'Free live stream television and on-demand movies with 250+ curated live virtual channels.',
    tags: ['Pluto TV', 'Official', 'Live TV', 'Paramount'],
    regions: ['USA', 'Global', 'Brazil', 'Germany', 'Spain'],
    clicks: 9100,
    reactions: { heart: 280, zap: 175, like: 430 },
    status: 'active'
  },
  {
    id: 'extra-mov-kanopy',
    title: 'Kanopy Cinema',
    url: 'https://www.kanopy.com',
    domain: 'kanopy.com',
    category: 'paid',
    badge: 'Official',
    logoText: 'Kanopy',
    logoColor: '#ec4899',
    logoBg: '#500724',
    description: 'Ad-free cinema streaming service partnering with public libraries and universities worldwide.',
    tags: ['Kanopy', 'Criterion', 'Indie Cinema', 'Documentaries', 'Official'],
    regions: ['USA', 'Global'],
    clicks: 4300,
    reactions: { heart: 110, zap: 65, like: 170 },
    status: 'active'
  },

  // ================= 2. ANIME & MANGA =================
  {
    id: 'extra-ani-hianime',
    title: 'HiAnime',
    url: 'https://hianime.to',
    domain: 'hianime.to',
    category: 'anime',
    badge: 'HOT',
    logoText: 'HiAnime',
    logoColor: '#f43f5e',
    logoBg: '#4c0519',
    description: 'Top anime streaming platform with auto-track sync, English sub/dub and ultra-fast 1080p.',
    tags: ['Anime', 'HiAnime', 'Subbed', 'Dubbed', '1080p'],
    regions: ['Global', 'Japan', 'USA'],
    clicks: 9800,
    reactions: { heart: 320, zap: 210, like: 510 },
    status: 'active'
  },
  {
    id: 'extra-ani-animepahe',
    title: 'AnimePahe',
    url: 'https://animepahe.ru',
    domain: 'animepahe.ru',
    category: 'anime',
    badge: 'FAST',
    logoText: 'AnimePahe',
    logoColor: '#0ea5e9',
    logoBg: '#082f49',
    description: 'Lightweight, minimal bandwidth anime site offering compressed HD streams with low latency.',
    tags: ['AnimePahe', 'Fast', 'Low Data', 'Anime', 'Subbed'],
    regions: ['Global', 'Japan'],
    clicks: 7400,
    reactions: { heart: 210, zap: 130, like: 340 },
    status: 'active'
  },
  {
    id: 'extra-manga-mangadex',
    title: 'MangaDex',
    url: 'https://mangadex.org',
    domain: 'mangadex.org',
    category: 'manga',
    badge: 'AD-FREE',
    logoText: 'MangaDex',
    logoColor: '#ff6740',
    logoBg: '#431407',
    description: 'Open-source, completely ad-free manga reader supporting scanlation groups in 50+ languages.',
    tags: ['MangaDex', 'Ad-Free', 'Manga', 'Scans', 'Open Source'],
    regions: ['Global', 'Japan'],
    clicks: 11200,
    reactions: { heart: 410, zap: 280, like: 620 },
    status: 'active'
  },
  {
    id: 'extra-manga-asurascans',
    title: 'Asura Scans',
    url: 'https://asuracomic.net',
    domain: 'asuracomic.net',
    category: 'manga',
    badge: 'HOT',
    logoText: 'Asura Scans',
    logoColor: '#a855f7',
    logoBg: '#3b0764',
    description: 'Leading translation team for action Manhwa, cultivation Webtoons, and fantasy Korean comics.',
    tags: ['Manhwa', 'Webtoons', 'Asura', 'Manga', 'Korean Comics'],
    regions: ['Global', 'Korea'],
    clicks: 8900,
    reactions: { heart: 275, zap: 180, like: 440 },
    status: 'active'
  },
  {
    id: 'extra-manga-webtoon',
    title: 'WEBTOON Official',
    url: 'https://www.webtoons.com',
    domain: 'webtoons.com',
    category: 'manga',
    badge: 'Official',
    logoText: 'WEBTOON',
    logoColor: '#00dc64',
    logoBg: '#052e16',
    description: 'Official global webcomic publishing portal with thousands of daily creator episodes.',
    tags: ['WEBTOON', 'Official', 'Naver', 'Comics', 'Manga'],
    regions: ['Global', 'Korea', 'USA'],
    clicks: 7900,
    reactions: { heart: 240, zap: 155, like: 380 },
    status: 'active'
  },

  // ================= 3. LIVE TV & SPORTS =================
  {
    id: 'extra-live-streameast',
    title: 'StreamEast',
    url: 'https://thestreameast.to',
    domain: 'thestreameast.to',
    category: 'livetv',
    badge: 'LIVE',
    logoText: 'StreamEast',
    logoColor: '#10b981',
    logoBg: '#064e3b',
    description: 'Premier HD sports streaming hub for NBA, NFL, UFC, Premier League, Formula 1, and MLB.',
    tags: ['StreamEast', 'Sports', 'NBA', 'NFL', 'Football', 'Live TV'],
    regions: ['Global', 'USA'],
    clicks: 12500,
    reactions: { heart: 460, zap: 320, like: 710 },
    status: 'active'
  },
  {
    id: 'extra-live-viprow',
    title: 'VIPRow Sports',
    url: 'https://www.viprow.nu',
    domain: 'viprow.nu',
    category: 'livetv',
    badge: 'FAST',
    logoText: 'VIPRow',
    logoColor: '#3b82f6',
    logoBg: '#1e3a8a',
    description: 'Comprehensive multi-sport match feeds covering tennis, motorsport, rugby, and cricket.',
    tags: ['VIPRow', 'Live Sports', 'Tennis', 'Cricket', 'Motorsport'],
    regions: ['Global', 'UK', 'USA'],
    clicks: 6700,
    reactions: { heart: 180, zap: 115, like: 270 },
    status: 'active'
  },
  {
    id: 'extra-live-crichd',
    title: 'CricHD Live',
    url: 'https://crichd.com',
    domain: 'crichd.com',
    category: 'livetv',
    badge: 'HOT',
    logoText: 'CricHD',
    logoColor: '#ef4444',
    logoBg: '#450a0a',
    description: 'Dedicated 24/7 sports broadcast network for IPL, World Cup cricket, and international leagues.',
    tags: ['Cricket', 'IPL', 'Live Sports', 'India', 'CricHD'],
    regions: ['India', 'Global', 'UK'],
    clicks: 8100,
    reactions: { heart: 260, zap: 170, like: 390 },
    status: 'active'
  },
  {
    id: 'extra-live-daddylive',
    title: 'DaddyLive HD',
    url: 'https://daddylive.sx',
    domain: 'daddylive.sx',
    category: 'livetv',
    badge: 'LIVE',
    logoText: 'DaddyLive',
    logoColor: '#e11d48',
    logoBg: '#4c0519',
    description: 'Over 400+ worldwide 24/7 TV channels including sports networks, news, and entertainment.',
    tags: ['DaddyLive', 'Live Channels', 'IPTV', '24/7 TV'],
    regions: ['Global', 'USA', 'UK'],
    clicks: 9400,
    reactions: { heart: 310, zap: 205, like: 480 },
    status: 'active'
  },

  // ================= 4. BOOKS & RESEARCH =================
  {
    id: 'extra-book-annasarchive',
    title: "Anna's Archive",
    url: 'https://annas-archive.org',
    domain: 'annas-archive.org',
    category: 'books',
    badge: 'Verified',
    logoText: "Anna's Archive",
    logoColor: '#8b5cf6',
    logoBg: '#2e1065',
    description: 'The largest open search engine for books, academic papers, comics, and journals in human history.',
    tags: ['Books', 'Research', 'Open Access', 'Shadow Library', 'PDF'],
    regions: ['Global'],
    clicks: 10400,
    reactions: { heart: 380, zap: 250, like: 590 },
    status: 'active'
  },
  {
    id: 'extra-book-scihub',
    title: 'Sci-Hub',
    url: 'https://sci-hub.se',
    domain: 'sci-hub.se',
    category: 'books',
    badge: 'Verified',
    logoText: 'Sci-Hub',
    logoColor: '#b91c1c',
    logoBg: '#450a0a',
    description: 'Pioneering scientific repository providing free academic access to millions of research papers.',
    tags: ['Sci-Hub', 'Science', 'Academic Research', 'Journals', 'Open Science'],
    regions: ['Global'],
    clicks: 8600,
    reactions: { heart: 290, zap: 195, like: 430 },
    status: 'active'
  },
  {
    id: 'extra-book-standardebooks',
    title: 'Standard Ebooks',
    url: 'https://standardebooks.org',
    domain: 'standardebooks.org',
    category: 'books',
    badge: 'Official',
    logoText: 'Standard Ebooks',
    logoColor: '#059669',
    logoBg: '#064e3b',
    description: 'Free, beautifully typeset public domain ebooks formatted to modern typographic standards.',
    tags: ['Standard Ebooks', 'Ebooks', 'Typography', 'Classics', 'EPUB'],
    regions: ['Global', 'USA'],
    clicks: 4200,
    reactions: { heart: 120, zap: 70, like: 180 },
    status: 'active'
  },
  {
    id: 'extra-book-librivox',
    title: 'LibriVox Audiobooks',
    url: 'https://librivox.org',
    domain: 'librivox.org',
    category: 'books',
    badge: 'Official',
    logoText: 'LibriVox',
    logoColor: '#d97706',
    logoBg: '#451a03',
    description: 'Free public domain audiobooks recorded by volunteers from around the world.',
    tags: ['LibriVox', 'Audiobooks', 'Podcasts', 'Public Domain'],
    regions: ['Global', 'USA'],
    clicks: 3900,
    reactions: { heart: 95, zap: 54, like: 150 },
    status: 'active'
  },

  // ================= 5. TECH & AI TOOLS =================
  {
    id: 'extra-tech-huggingface',
    title: 'Hugging Face',
    url: 'https://huggingface.co',
    domain: 'huggingface.co',
    category: 'tech',
    badge: 'Official',
    logoText: 'Hugging Face',
    logoColor: '#f59e0b',
    logoBg: '#451a03',
    description: 'The premier open-source AI platform for discovering models, datasets, and ML demos.',
    tags: ['AI', 'Hugging Face', 'Machine Learning', 'Open Source', 'LLMs'],
    regions: ['Global', 'USA'],
    clicks: 9900,
    reactions: { heart: 360, zap: 240, like: 540 },
    status: 'active'
  },
  {
    id: 'extra-tech-photopea',
    title: 'Photopea Online Editor',
    url: 'https://www.photopea.com',
    domain: 'photopea.com',
    category: 'tech',
    badge: 'HOT',
    logoText: 'Photopea',
    logoColor: '#0ea5e9',
    logoBg: '#082f49',
    description: 'Full-featured advanced browser-based graphic and photo editor supporting PSD, XCF, and Sketch.',
    tags: ['Photopea', 'Photoshop Alternative', 'Design Tools', 'Free'],
    regions: ['Global'],
    clicks: 11800,
    reactions: { heart: 430, zap: 290, like: 660 },
    status: 'active'
  },
  {
    id: 'extra-tech-tinywow',
    title: 'TinyWow Tools',
    url: 'https://tinywow.com',
    domain: 'tinywow.com',
    category: 'tech',
    badge: 'AD-FREE',
    logoText: 'TinyWow',
    logoColor: '#10b981',
    logoBg: '#064e3b',
    description: 'Over 200+ free utilities to convert PDFs, remove image backgrounds, edit video, and generate text.',
    tags: ['TinyWow', 'PDF Tools', 'Converter', 'AI Tools', 'Utilities'],
    regions: ['Global'],
    clicks: 7200,
    reactions: { heart: 220, zap: 145, like: 350 },
    status: 'active'
  },
  {
    id: 'extra-tech-cyberchef',
    title: 'CyberChef',
    url: 'https://gchq.github.io/CyberChef',
    domain: 'gchq.github.io',
    category: 'tech',
    badge: 'Official',
    logoText: 'CyberChef',
    logoColor: '#ec4899',
    logoBg: '#500724',
    description: 'The Cyber Swiss Army Knife for encryption, encoding, compression, and data analysis.',
    tags: ['CyberChef', 'Developer', 'Security', 'Encoding', 'GCHQ'],
    regions: ['Global'],
    clicks: 5300,
    reactions: { heart: 160, zap: 105, like: 240 },
    status: 'active'
  },
  {
    id: 'extra-tech-alternativeto',
    title: 'AlternativeTo',
    url: 'https://alternativeto.net',
    domain: 'alternativeto.net',
    category: 'tech',
    badge: 'Verified',
    logoText: 'AlternativeTo',
    logoColor: '#3b82f6',
    logoBg: '#1e3a8a',
    description: 'Crowdsourced recommendations and alternatives for proprietary and open-source software.',
    tags: ['AlternativeTo', 'Software', 'Open Source', 'FOSS', 'Tools'],
    regions: ['Global'],
    clicks: 6800,
    reactions: { heart: 205, zap: 135, like: 320 },
    status: 'active'
  },

  // ================= 6. APPS & MEDIA PLAYERS =================
  {
    id: 'extra-app-fdroid',
    title: 'F-Droid Repository',
    url: 'https://f-droid.org',
    domain: 'f-droid.org',
    category: 'apps',
    badge: 'Official',
    logoText: 'F-Droid',
    logoColor: '#0284c7',
    logoBg: '#082f49',
    description: 'An installable catalogue of FOSS (Free and Open Source Software) applications for Android.',
    tags: ['F-Droid', 'FOSS', 'Open Source', 'Android APK', 'Official'],
    regions: ['Global'],
    clicks: 8700,
    reactions: { heart: 290, zap: 190, like: 440 },
    status: 'active'
  },
  {
    id: 'extra-app-stremio',
    title: 'Stremio',
    url: 'https://www.stremio.com',
    domain: 'stremio.com',
    category: 'apps',
    badge: 'HOT',
    logoText: 'Stremio',
    logoColor: '#8b5cf6',
    logoBg: '#2e1065',
    description: 'Freedom to organize and watch video content across devices with community addon plugins.',
    tags: ['Stremio', 'Media Player', 'Addons', 'Torrentio', '4K UHD'],
    regions: ['Global', 'USA', 'Brazil', 'Germany', 'Spain'],
    clicks: 12100,
    reactions: { heart: 470, zap: 330, like: 730 },
    status: 'active'
  },
  {
    id: 'extra-app-smarttube',
    title: 'SmartTube TV',
    url: 'https://smarttubeapp.github.io',
    domain: 'smarttubeapp.github.io',
    category: 'apps',
    badge: 'AD-FREE',
    logoText: 'SmartTube',
    logoColor: '#ef4444',
    logoBg: '#450a0a',
    description: 'Advanced, ad-free YouTube player for Android TV boxes and Fire TV with SponsorBlock.',
    tags: ['SmartTube', 'Android TV', 'Ad-Free', 'SponsorBlock', 'APK'],
    regions: ['Global'],
    clicks: 9600,
    reactions: { heart: 340, zap: 230, like: 520 },
    status: 'active'
  },
  {
    id: 'extra-app-apkmirror',
    title: 'APKMirror',
    url: 'https://www.apkmirror.com',
    domain: 'apkmirror.com',
    category: 'apps',
    badge: 'Verified',
    logoText: 'APKMirror',
    logoColor: '#f97316',
    logoBg: '#431407',
    description: 'Secure, cryptographic signature-verified Android APK and bundle download portal.',
    tags: ['APKMirror', 'Android', 'APK Download', 'Safe', 'Apps'],
    regions: ['Global', 'USA'],
    clicks: 8200,
    reactions: { heart: 250, zap: 160, like: 390 },
    status: 'active'
  },

  // ================= 7. REGIONAL BROADCASTERS & EXPANSIONS =================
  // India OTT & Music
  {
    id: 'extra-in-sunnxt',
    title: 'Sun NXT',
    url: 'https://www.sunnxt.com',
    domain: 'sunnxt.com',
    category: 'paid',
    badge: 'Premium',
    logoText: 'Sun NXT',
    logoColor: '#f59e0b',
    logoBg: '#451a03',
    description: 'South Indian movies, TV shows, and live TV channels in Tamil, Telugu, Malayalam, and Kannada.',
    tags: ['India', 'Sun NXT', 'South Indian', 'Tamil', 'Telugu', 'Premium'],
    regions: ['India', 'Global'],
    clicks: 4900,
    reactions: { heart: 120, zap: 75, like: 185 },
    status: 'active'
  },
  {
    id: 'extra-in-jiosaavn',
    title: 'JioSaavn',
    url: 'https://www.jiosaavn.com',
    domain: 'jiosaavn.com',
    category: 'paid',
    badge: 'Official',
    logoText: 'JioSaavn',
    logoColor: '#10b981',
    logoBg: '#064e3b',
    description: 'Unlimited Bollywood, regional Indian, and international music streaming with podcasts.',
    tags: ['India', 'JioSaavn', 'Music', 'Bollywood', 'Official'],
    regions: ['India', 'Global'],
    clicks: 5800,
    reactions: { heart: 160, zap: 98, like: 240 },
    status: 'active'
  },

  // UK
  {
    id: 'extra-uk-bbciplayer',
    title: 'BBC iPlayer',
    url: 'https://www.bbc.co.uk/iplayer',
    domain: 'bbc.co.uk',
    category: 'livetv',
    badge: 'Official',
    logoText: 'BBC iPlayer',
    logoColor: '#f43f5e',
    logoBg: '#4c0519',
    description: 'Official British live broadcast network, documentaries, dramas, and entertainment.',
    tags: ['UK', 'BBC', 'Official', 'Live TV', 'British'],
    regions: ['UK', 'Global'],
    clicks: 6200,
    reactions: { heart: 175, zap: 105, like: 260 },
    status: 'active'
  },

  // Germany
  {
    id: 'extra-de-joyn',
    title: 'Joyn Germany',
    url: 'https://www.joyn.de',
    domain: 'joyn.de',
    category: 'livetv',
    badge: 'Official',
    logoText: 'Joyn',
    logoColor: '#38bdf8',
    logoBg: '#082f49',
    description: 'Free live streaming of ProSieben, SAT.1, Kabel Eins, and on-demand German series.',
    tags: ['Germany', 'Joyn', 'ProSieben', 'Live TV', 'Official'],
    regions: ['Germany', 'Global'],
    clicks: 4100,
    reactions: { heart: 98, zap: 56, like: 145 },
    status: 'active'
  },

  // Spain
  {
    id: 'extra-es-atresplayer',
    title: 'Atresplayer',
    url: 'https://www.atresplayer.com',
    domain: 'atresplayer.com',
    category: 'livetv',
    badge: 'Official',
    logoText: 'Atresplayer',
    logoColor: '#f97316',
    logoBg: '#431407',
    description: 'Directo y contenido a la carta de Antena 3, laSexta, Neox, Nova y producciones Atresmedia.',
    tags: ['Spain', 'Atresplayer', 'Antena 3', 'Series Españolas', 'Official'],
    regions: ['Spain', 'Global'],
    clicks: 3900,
    reactions: { heart: 88, zap: 52, like: 135 },
    status: 'active'
  },

  // Japan
  {
    id: 'extra-jp-abema',
    title: 'Abema TV',
    url: 'https://abema.tv',
    domain: 'abema.tv',
    category: 'livetv',
    badge: 'Official',
    logoText: 'ABEMA',
    logoColor: '#22c55e',
    logoBg: '#052e16',
    description: 'Japanese live Internet TV station with 24/7 anime, news, drama, and sports channels.',
    tags: ['Japan', 'ABEMA', 'Anime Live', 'Japanese TV', 'Official'],
    regions: ['Japan', 'Global'],
    clicks: 6700,
    reactions: { heart: 190, zap: 120, like: 290 },
    status: 'active'
  },

  // South Korea
  {
    id: 'extra-kr-kakaopage',
    title: 'KakaoPage',
    url: 'https://page.kakao.com',
    domain: 'page.kakao.com',
    category: 'manga',
    badge: 'Official',
    logoText: 'KakaoPage',
    logoColor: '#facc15',
    logoBg: '#422006',
    description: 'Leading Korean story platform for webtoons, web novels, and digital serials.',
    tags: ['Korea', 'KakaoPage', 'Webtoons', 'Manhwa', 'Official'],
    regions: ['Korea', 'Global'],
    clicks: 5300,
    reactions: { heart: 140, zap: 85, like: 210 },
    status: 'active'
  }
];

export async function addExtraCuratedLinks() {
  console.log(`🚀 Adding ${NEW_EXTRA_CURATED_LINKS.length} high-tier curated links...`);

  // Migrate newly added links
  const migratedNew = NEW_EXTRA_CURATED_LINKS.map((l) => migrateLink(l));

  // Partition into regional or global
  const newRegional: LinkItem[] = [];
  const newGlobal: LinkItem[] = [];

  for (const item of migratedNew) {
    const isOnlyGlobal = (item.regions.length === 1 && item.regions[0] === 'Global');
    if (!isOnlyGlobal) {
      newRegional.push(item);
    } else {
      newGlobal.push(item);
    }
  }

  const mergedGlobal = deduplicateLinks([...BASE_GLOBAL_LINKS, ...newGlobal]);
  const mergedRegional = deduplicateLinks([...ALL_REGIONAL_LINKS, ...newRegional]);

  // Update regionalData.ts
  const regionalContent = `import { LinkItem } from '../types';

// ==========================================================
// REGIONAL WEBLINKS CURATED ACCORDING TO USER'S 14 REGIONAL PDFS
// ENRICHED WITH OFFICIAL CDN LOGOS AND DYNAMIC METADATA BADGES
// ==========================================================

export const ALL_REGIONAL_LINKS: LinkItem[] = ${JSON.stringify(mergedRegional, null, 2)};
`;

  fs.writeFileSync(path.join(process.cwd(), 'src/data/regionalData.ts'), regionalContent, 'utf-8');

  // Update initialData.ts
  const initialContent = `import { CategoryGroup, LinkItem } from '../types';
import { ALL_REGIONAL_LINKS } from './regionalData';

export const ALL_PDF_REGIONS = ${JSON.stringify(ALL_PDF_REGIONS, null, 2)};

export const INITIAL_CATEGORIES: CategoryGroup[] = ${JSON.stringify(INITIAL_CATEGORIES, null, 2)};

export const BASE_GLOBAL_LINKS: LinkItem[] = ${JSON.stringify(mergedGlobal, null, 2)};

export const INITIAL_LINKS: LinkItem[] = [
  ...BASE_GLOBAL_LINKS,
  ...ALL_REGIONAL_LINKS,
];
`;

  fs.writeFileSync(path.join(process.cwd(), 'src/data/initialData.ts'), initialContent, 'utf-8');
  console.log(`✅ Successfully added extra verified links! Total directory count is now expanded.`);
}

addExtraCuratedLinks().catch(console.error);
