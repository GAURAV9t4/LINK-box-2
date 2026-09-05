import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import ogQrScannerImg from '../assets/images/og_qr_scanner.png';
import { 
  X, Heart, Send, ShieldAlert, Check, Sparkles, ExternalLink, Info, Copy, 
  Layers, Shield, Zap, Globe, Star, Palette, Bookmark, Smartphone, 
  BookOpen, Film, Tv, Radio, Terminal, Cloud, HelpCircle, QrCode, Download, Share2,
  IndianRupee, Gift, CheckCircle2, Settings, Trash2, EyeOff, Lock, RefreshCw, ZoomIn,
  AlertCircle
} from 'lucide-react';

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'features' | 'custom' | 'privacy'>('about');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101328] border border-[#2b315c] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 pb-4 border-b border-white/[0.08] flex items-center justify-between bg-[#151936]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-md">
              <span className="text-xl">📦</span>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>About LINK BOX</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  v2.5
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Universal Streaming Hub & Telegram Link Directory (वेबसाइट की पूरी जानकारी)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/[0.08] bg-[#0c0e1e] px-4 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`px-3.5 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'about'
                ? 'text-purple-400 border-purple-500 bg-purple-500/5'
                : 'text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            📋 Site Overview (परिचय)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('features')}
            className={`px-3.5 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'features'
                ? 'text-purple-400 border-purple-500 bg-purple-500/5'
                : 'text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            ⚡ Key Features (खासियत)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-3.5 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'custom'
                ? 'text-purple-400 border-purple-500 bg-purple-500/5'
                : 'text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            🎨 Custom Link & Logo Studio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`px-3.5 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'privacy'
                ? 'text-purple-400 border-purple-500 bg-purple-500/5'
                : 'text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            🛡️ Privacy & Safety Tips
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed max-h-[60vh]">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'about' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 bg-gradient-to-r from-purple-950/40 via-[#161a3d] to-purple-950/40 border border-purple-500/30 rounded-xl space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>LINK BOX क्या है? (What is LINK BOX?)</span>
                </h4>
                <p className="text-xs text-zinc-300">
                  <strong className="text-purple-300">LINK BOX</strong> इंटरनेट की सबसे बेहतरीन और चुनिंदा (curated) फ्री स्ट्रीमिंग साइट्स, एनीमे, मंगा, लाइव टीवी, स्पोर्ट्स, पेड ओटीटी अल्टरनेटिव्स, प्रीमियम टूल्स, बुक्स और टेलीग्राम ग्रुप्स का एक ऑल-इन-वन सेंट्रलाइज्ड डायरेक्टरी पोर्टल है।
                </p>
                <p className="text-xs text-zinc-300">
                  इसका मुख्य उद्देश्य आपको बिना किसी भटकाव या फर्जी लिंक्स के सीधे काम करने वाली ओरिजिनल वेबसाइट्स और मीडिया सोर्सेज तक तुरंत 1-क्लिक में पहुंचाना है।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-[#141838] border border-white/[0.06] rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                    <Film className="w-4 h-4 text-indigo-400" />
                    <span>Entertainment & Media</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    4K Movies, Web Series, AnimeWorld, Manga, Live TV channels, Cricket & Football live streams.
                  </p>
                </div>

                <div className="p-3.5 bg-[#141838] border border-white/[0.06] rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-sky-300 font-bold text-xs">
                    <Send className="w-4 h-4 text-sky-400" />
                    <span>Telegram Channels Hub</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Direct join verified movie groups, auto-download bots, subtitle channels & discussions.
                  </p>
                </div>

                <div className="p-3.5 bg-[#141838] border border-white/[0.06] rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>Apps, AI & Tech Tools</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Free AI assistants, APK repos, developer utilities, PDF & research book repositories.
                  </p>
                </div>

                <div className="p-3.5 bg-[#141838] border border-white/[0.06] rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>Personalized Experience</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Star favorites, track recently visited links, custom logo creation & region filtering.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FEATURES */}
          {activeTab === 'features' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-3 bg-[#131736] border border-white/[0.06] rounded-xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  ⚡
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Direct 1-Click Browser Launch</h5>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    किसी भी कार्ड पर क्लिक करते ही वेबसाइट बिना किसी रुकावट के नए ब्राउज़र टैब में डायरेक्ट ओपन हो जाती है।
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#131736] border border-white/[0.06] rounded-xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  💬
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Telegram Feed Mode Switcher</h5>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    आप <strong>Grid Card View</strong> और <strong>Telegram Channel Feed View</strong> के बीच एक क्लिक में स्विच कर सकते हैं, जिसमें असली टेलीग्राम पोस्ट्स, लाइव रिएक्शन और डिस्कशन टैग्स मिलते हैं।
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#131736] border border-white/[0.06] rounded-xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  🔍
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Instant Fuzzy Search & Hotkeys</h5>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    कीबोर्ड पर <code className="text-purple-300 font-mono px-1 py-0.5 bg-purple-900/40 rounded">/</code> बटन दबाते ही सर्च बार एक्टिव हो जाता है। आप नाम, डोमेन, टैग या डिस्क्रिप्शन से तुरंत रिजल्ट्स ढूंढ सकते हैं।
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#131736] border border-white/[0.06] rounded-xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  ⭐
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Favorites Bookmarking & Recently Visited</h5>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    अपने पसंदीदा लिंक्स को स्टार (★) करके अलग से देख सकते हैं और हाल ही में विजिट की गई साइट्स तक ऊपर की रो से तुरंत पहुंच सकते हैं।
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#131736] border border-white/[0.06] rounded-xl flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  🌍
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Multi-Region Filtering</h5>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Global, India (Hindi/South/Dubbed), USA, UK, Japan (Anime/Raw) जैसे रीजंस के अनुसार लिंक्स को फिल्टर करने की पूरी सुविधा।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM LINKS & LOGO STUDIO */}
          {activeTab === 'custom' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="p-3.5 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/40 rounded-xl space-y-2">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-purple-400" />
                  <span>खुद की कस्टम लिंक और लोगो कैसे जोड़ें?</span>
                </h4>
                <p className="text-xs text-zinc-300">
                  LINK BOX में आप अपनी पर्सनल वेबसाइट्स, प्राइवेट गूगल ड्राइव लिंक्स, प्लेक्स/स्ट्रीमियो सर्वर, या टेलीग्राम बॉट्स को अपने खुद के कस्टमाइज्ड लोगो के साथ जोड़ सकते हैं।
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5 p-2.5 bg-[#141838] rounded-xl border border-white/[0.04]">
                  <span className="w-5 h-5 rounded-full bg-purple-600/40 text-purple-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-white">Stylized Text Logo:</strong> अपना कस्टम टेक्स्ट लिखें, कलर पैलेट से रंग चुनें और ग्लोइंग बैकग्राउंड स्टाइल दें।
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-[#141838] rounded-xl border border-white/[0.04]">
                  <span className="w-5 h-5 rounded-full bg-purple-600/40 text-purple-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-white">Vector Icon Badges:</strong> Movie, Play, Telegram, Cloud, Star, Bot, Gamepad, Lock जैसे 18+ वेक्टर्स में से चुनें।
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-[#141838] rounded-xl border border-white/[0.04]">
                  <span className="w-5 h-5 rounded-full bg-purple-600/40 text-purple-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-white">Auto-Favicon / Local Upload:</strong> यूआरएल डालने पर &apos;Auto Grab&apos; दबाकर असली लोगो फेच करें या डिवाइस से इमेज अपलोड करें।
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-[#141838] rounded-xl border border-white/[0.04]">
                  <span className="w-5 h-5 rounded-full bg-purple-600/40 text-purple-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    <strong className="text-white">Backup Export & Import:</strong> अपने जोड़े गए सभी कस्टम लिंक्स को JSON फाइल में एक्सपोर्ट करके कभी भी रिस्टोर कर सकते हैं।
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY & SAFETY */}
          {activeTab === 'privacy' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>100% Client-Side Privacy (ज़ीरो ट्रैकिंग)</span>
                </h4>
                <p className="text-xs text-zinc-300">
                  LINK BOX किसी भी यूजर का पर्सनल डेटा या ब्राउज़िंग हिस्ट्री स्टोर नहीं करता। आपके बुकमार्क और कस्टम लिंक्स सिर्फ और सिर्फ आपके अपने ब्राउज़र के LocalStorage में सुरक्षित रहते हैं।
                </p>
              </div>

              <div className="p-3.5 bg-[#141838] border border-white/[0.06] rounded-xl space-y-2">
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>सुरक्षित स्ट्रीमिंग के लिए टिप्स (Safety Recommendations):</span>
                </h5>
                <ul className="list-disc list-inside space-y-1 text-xs text-zinc-300 pl-1">
                  <li>
                    <strong>Ad-Blocker Use Karein:</strong> पॉप-अप और अनचाहे ऐड्स से बचने के लिए <span className="text-purple-300">uBlock Origin</span> या <span className="text-purple-300">Brave Browser</span> का इस्तेमाल करें।
                  </li>
                  <li>
                    <strong>DNS / VPN:</strong> अगर आपके ISP द्वारा कोई डोमेन ब्लॉक है, तो Cloudflare DNS (1.1.1.1) या भरोसेमंद VPN का उपयोग कर सकते हैं।
                  </li>
                  <li>
                    <strong>No Downloads of Executables:</strong> किसी भी थर्ड-पार्टी स्ट्रीमिंग साइट पर .exe या संदिग्ध फाइलें डाउनलोड न करें।
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] flex items-center justify-between bg-[#121630]">
          <div className="text-[11px] text-zinc-400 hidden sm:flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-purple-400 fill-purple-400 inline" />
            <span>for streaming lovers worldwide</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-purple-950/50 cursor-pointer w-full sm:w-auto"
          >
            Got it, Close
          </button>
        </div>

      </div>
    </div>
  );
};

export const RequestModal: React.FC<ModalBaseProps & { onRequestSubmitted?: (data: any) => void }> = ({
  isOpen,
  onClose,
  onRequestSubmitted,
}) => {
  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [category, setCategory] = useState('Movies & Shows');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName || !siteUrl) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setSiteName('');
      setSiteUrl('');
      setNotes('');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121528] border border-[#2b315c] rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Request a Link or Group</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Request Received!</h4>
            <p className="text-xs text-zinc-400">Our automated bot will verify the link shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Site / Channel Name</label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="e.g. FreeHDHub, Desi Anime TG"
                className="w-full px-3 py-2 bg-[#171b36] border border-[#2c3463] rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">URL / Link</label>
              <input
                type="text"
                required
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-[#171b36] border border-[#2c3463] rounded-lg text-white text-xs focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#171b36] border border-[#2c3463] rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
              >
                <option>Movies & Shows</option>
                <option>Anime</option>
                <option>Manga</option>
                <option>Live TV & Sports</option>
                <option>Telegram Groups</option>
                <option>Apps & APKs</option>
                <option>Tech & AI</option>
                <option>Books & Study</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Additional Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Why should this link be added?"
                className="w-full px-3 py-2 bg-[#171b36] border border-[#2c3463] rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Submit Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export const DmcaModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121528] border border-[#2b315c] rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">DMCA & Disclaimer</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <p>
            LINK BOX does not host, stream, or upload any media, files, or copyright materials on its servers.
          </p>
          <p>
            This website functions purely as an informational index and directory of publicly available hyperlinks and search pointers already published across the World Wide Web.
          </p>
          <p>
            If you are a copyright owner and wish to request the removal of an indexed link from this directory, please send a notice to our team or use the Request removal form.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

export const SupportModal: React.FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  const UPI_ID = '81gauravbob@axl';

  const [scannerMode, setScannerMode] = useState<'og_qr' | 'dynamic_qr'>('og_qr');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [sharedUpi, setSharedUpi] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [sharedQr, setSharedQr] = useState(false);
  const [hasContributed, setHasContributed] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const [appNotice, setAppNotice] = useState<string | null>(null);
  const [launchingApp, setLaunchingApp] = useState<string | null>(null);

  // Compute standard NPCI-compliant UPI URI
  const getUpiUri = (appScheme: 'any' | 'phonepe' | 'gpay' | 'paytm' = 'any') => {
    // Standard NPCI Intent Parameters:
    // pa: Payee VPA address (literal '@' character, not %40, for wide UPI app compatibility)
    // pn: Clean alphanumeric payee name ('LinkBox')
    // cu: Currency ('INR')
    // mode: 02 (Mandatory NPCI parameter for browser-initiated intent transactions)
    // tn: Neutral clean note ('Support') avoiding risk keywords like 'AdFree' that trigger bank fraud filters
    let params = `pa=${UPI_ID}&pn=LinkBox&cu=INR&mode=02&tn=Support`;
    if (selectedAmount && selectedAmount > 0) {
      // NPCI strictly enforces 2 decimal places e.g. 50.00
      params += `&am=${selectedAmount.toFixed(2)}`;
    }

    switch (appScheme) {
      case 'phonepe':
        return `phonepe://pay?${params}`;
      case 'gpay':
        return `tez://upi/pay?${params}`;
      case 'paytm':
        return `paytmmp://pay?${params}`;
      case 'any':
      default:
        return `upi://pay?${params}`;
    }
  };

  const currentUpiUri = getUpiUri('any');

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(currentUpiUri, {
        width: 380,
        margin: 2,
        color: {
          dark: '#0a0d20',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate UPI QR:', err));
    }
  }, [isOpen, currentUpiUri]);

  if (!isOpen) return null;

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Safe and robust handler for Pay in App
  const handlePayInApp = (appType: 'any' | 'phonepe' | 'gpay' | 'paytm' = 'any') => {
    // 1. Immediately copy UPI ID as guaranteed backup
    try {
      navigator.clipboard.writeText(UPI_ID);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch {
      // ignore clipboard error
    }

    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) {
      setAppNotice(`Desktop Browser: UPI Apps (PhonePe/GPay/Paytm) work on mobile phones. UPI ID (${UPI_ID}) is copied! Please scan the QR Code on your mobile.`);
      setScannerMode('og_qr');
      setTimeout(() => setAppNotice(null), 8000);
      return;
    }

    const intentUri = getUpiUri(appType);
    setLaunchingApp(appType);
    setAppNotice(`Opening UPI App... (UPI ID: ${UPI_ID} is copied to your clipboard as backup)`);
    setTimeout(() => {
      setLaunchingApp(null);
      setTimeout(() => setAppNotice(null), 5000);
    }, 2500);

    // Try navigating via anchor with target="_top" to escape iframe sandboxes
    try {
      const a = document.createElement('a');
      a.href = intentUri;
      a.target = '_top';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.location.href = intentUri;
    }
  };

  const handleShareUpi = async () => {
    const shareText = `Support LinkBox to keep it 100% Ad-Free!\nUPI ID: ${UPI_ID}\nPayment Link: ${currentUpiUri}\nThank you for keeping our platform free for everyone!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Support LinkBox (100% Ad-Free)',
          text: shareText,
          url: window.location.href,
        });
        setSharedUpi(true);
        setTimeout(() => setSharedUpi(false), 2000);
      } catch {
        handleCopyUpi();
      }
    } else {
      handleCopyUpi();
    }
  };

  const handleShareQr = async () => {
    const shareText = `Pay via UPI to ${UPI_ID} to keep LinkBox 100% Ad-Free!\nWebsite: ${window.location.href}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'LinkBox UPI Scanner',
          text: shareText,
          url: window.location.href,
        });
        setSharedQr(true);
        setTimeout(() => setSharedQr(false), 2000);
      } catch {
        handleCopyUpi();
      }
    } else {
      handleCopyUpi();
    }
  };

  const handleDownloadQr = () => {
    const targetUrl = scannerMode === 'og_qr' ? ogQrScannerImg : qrDataUrl;
    if (!targetUrl) return;
    const a = document.createElement('a');
    a.href = targetUrl;
    a.download = scannerMode === 'og_qr' 
      ? `original-upi-qr-${UPI_ID}.png`
      : `linkbox-adfree-upi-qr-${UPI_ID}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleContributedClick = () => {
    setHasContributed(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0f1226] border border-[#2b315c] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] my-auto">
        
        {/* Header with gradient bar and badge */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#151936]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-600/30 border border-pink-500/40 flex items-center justify-center text-pink-400 shadow-md">
              <Heart className="w-5 h-5 fill-pink-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>SUPPORT LINKBOX</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% AD-FREE
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                बिना किसी विज्ञापन (Ad-Free) के चलाने के लिए हमें सपोर्ट करें
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          
          {/* Main Heartfelt Ad-Free Message Box */}
          <div className="p-4 bg-gradient-to-br from-purple-950/50 via-[#181c3e] to-pink-950/40 border border-purple-500/40 rounded-2xl text-center space-y-2 relative overflow-hidden shadow-md">
            <div className="flex items-center justify-center gap-1.5 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Ad-Free Community Initiative</span>
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            
            <p className="text-xs sm:text-[13px] text-zinc-100 font-medium leading-relaxed">
              <strong className="text-purple-300">LinkBox</strong> को बिना किसी intrusive ad, popups या paid subscription के हमेशा <strong>100% Free, Safe & Fast</strong> रखने के लिए आपके छोटे से सहयोग की ज़रूरत है!
            </p>
            
            <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed">
              सर्वर मेंटेनेंस और रोज़ाना नई वर्किंग लिंक्स ऐड करने के लिए आप अपनी इच्छानुसार कोई भी छोटी या बड़ी राशि UPI या QR Code से कंट्रीब्यूट कर सकते हैं।
            </p>

            {/* Trust Pill Highlights */}
            <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] text-zinc-300 font-medium">
              <div className="p-1.5 rounded-lg bg-black/30 border border-white/10 flex flex-col items-center">
                <span className="text-emerald-400 font-bold">✓ Zero Ads</span>
                <span className="text-[9px] text-zinc-400">No popups ever</span>
              </div>
              <div className="p-1.5 rounded-lg bg-black/30 border border-white/10 flex flex-col items-center">
                <span className="text-sky-400 font-bold">⚡ Fast Mirror</span>
                <span className="text-[9px] text-zinc-400">High speed links</span>
              </div>
              <div className="p-1.5 rounded-lg bg-black/30 border border-white/10 flex flex-col items-center">
                <span className="text-purple-400 font-bold">🛡️ 100% Secure</span>
                <span className="text-[9px] text-zinc-400">Direct UPI</span>
              </div>
            </div>
          </div>

          {/* Active Notice / Feedback Toast */}
          {appNotice && (
            <div className="p-3 bg-purple-950/80 border border-purple-500/50 rounded-xl text-xs text-purple-200 flex items-center justify-between gap-2 shadow-lg animate-in fade-in">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
                <span className="leading-tight">{appNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setAppNotice(null)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Preset Amount Selector Pills */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300">
              <span className="flex items-center gap-1 text-purple-300">
                <IndianRupee className="w-3 h-3 text-emerald-400" />
                <span>Select Amount (इच्छानुसार राशि चुनें)</span>
              </span>
              <span className="text-[10px] text-zinc-400">
                {selectedAmount ? `₹${selectedAmount} Selected` : 'Any Amount'}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {[
                { label: 'Any', val: null },
                { label: '₹20', val: 20 },
                { label: '₹50', val: 50 },
                { label: '₹100', val: 100 },
                { label: '₹200', val: 200 },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAmount(item.val)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                    selectedAmount === item.val
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-pink-400 text-white shadow-md scale-105'
                      : 'bg-[#141834] hover:bg-[#1a2044] border-[#293264] text-zinc-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN UPI ID CARD */}
          <div className="p-3.5 sm:p-4 bg-[#141733] border border-[#2b3363] rounded-xl space-y-2.5 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
              <span className="flex items-center gap-1.5 text-purple-300">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                <span>DIRECT UPI ID</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Verified UPI
              </span>
            </div>

            {/* UPI ID Box + Copy, Pay & Share Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#0d0f22] border border-[#232850] rounded-xl p-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm sm:text-base font-mono font-black text-amber-300 tracking-wider truncate selection:bg-purple-600">
                  {UPI_ID}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                {/* 1-Tap Pay In App Button */}
                <button
                  type="button"
                  onClick={() => handlePayInApp('any')}
                  title="Open in UPI App to pay"
                  className="px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm active:scale-95"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{launchingApp === 'any' ? 'Opening...' : 'Pay in App'}</span>
                </button>

                {/* Copy UPI Button */}
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  title="Copy UPI ID"
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
                    copiedUpi
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-sm'
                      : 'bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border-purple-500/40'
                  }`}
                >
                  {copiedUpi ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy UPI</span>
                    </>
                  )}
                </button>

                {/* Share UPI Button */}
                <button
                  type="button"
                  onClick={handleShareUpi}
                  title="Share UPI ID"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-sky-600/30 text-zinc-300 hover:text-sky-300 border border-white/10 hover:border-sky-500/40 transition-colors cursor-pointer"
                >
                  {sharedUpi ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* SCANNER MODE TABS */}
          <div className="flex items-center justify-center p-1 bg-[#0d1025] rounded-xl border border-white/[0.08] gap-1">
            <button
              type="button"
              onClick={() => setScannerMode('og_qr')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                scannerMode === 'og_qr'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-pink-300" />
              <span>Original QR Scanner</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-purple-900/60 rounded text-purple-200 border border-purple-400/40">
                OG
              </span>
            </button>

            <button
              type="button"
              onClick={() => setScannerMode('dynamic_qr')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                scannerMode === 'dynamic_qr'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
              <span>Dynamic Amount QR</span>
            </button>
          </div>

          {/* MODE 1: ORIGINAL (OG) SCANNER CARD - ONLY QR CODE */}
          {scannerMode === 'og_qr' ? (
            <div className="p-4 bg-gradient-to-b from-[#181233] to-[#0f1228] border border-purple-500/30 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-xl relative overflow-hidden">
              
              <div className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-purple-400" />
                <span>ORIGINAL UPI QR SCANNER</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-950/80 rounded text-emerald-300 border border-emerald-500/40">
                  Verified
                </span>
              </div>

              {/* Clean OG QR Code Image Card - ONLY QR CODE */}
              <div 
                className="relative group cursor-pointer bg-white p-3 rounded-2xl border-4 border-purple-500/30 shadow-2xl hover:border-purple-400 transition-all flex items-center justify-center"
                onClick={() => setIsZoomed(true)}
                title="Click to zoom scanner"
              >
                <img
                  src={ogQrScannerImg}
                  alt={`UPI Scanner (${UPI_ID})`}
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5 bg-black/80 px-3 py-1.5 rounded-xl border border-white/20 shadow-lg">
                    <ZoomIn className="w-4 h-4 text-purple-300" />
                    <span>Click to Zoom</span>
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-zinc-300 font-mono">
                Scan with <strong className="text-purple-300">PhonePe</strong>, <strong className="text-emerald-300">Google Pay</strong>, <strong className="text-sky-300">Paytm</strong>, or any UPI App
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full pt-1">
                <button
                  type="button"
                  onClick={handleShareQr}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-[#1a1f40] hover:bg-[#232955] border border-[#313a70] hover:border-purple-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {sharedQr ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Shared!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-sky-400" />
                      <span>Share</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-[#1a1f40] hover:bg-[#232955] border border-[#313a70] hover:border-purple-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Save QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePayInApp('any')}
                  className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 py-2 px-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
                  title="Open in your default UPI payment app"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{launchingApp === 'any' ? 'Opening...' : 'Pay in App'}</span>
                </button>
              </div>

              {/* 1-Tap Direct UPI App Launcher (PhonePe, Google Pay, Paytm) */}
              <div className="w-full pt-2 border-t border-white/[0.08] space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 px-0.5">
                  <span className="text-zinc-300 font-bold uppercase tracking-wider">Fast 1-Tap UPI Launch:</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>NPCI Verified</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 w-full">
                  <button
                    type="button"
                    onClick={() => handlePayInApp('phonepe')}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-[#5f259f]/30 hover:bg-[#5f259f]/60 border border-[#5f259f]/60 text-purple-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Open directly in PhonePe"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>{launchingApp === 'phonepe' ? 'Opening...' : 'PhonePe'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePayInApp('gpay')}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-blue-950/50 hover:bg-blue-900/70 border border-blue-500/50 text-sky-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Open directly in Google Pay"
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span>{launchingApp === 'gpay' ? 'Opening...' : 'Google Pay'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePayInApp('paytm')}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-500/50 text-cyan-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Open directly in Paytm"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>{launchingApp === 'paytm' ? 'Opening...' : 'Paytm'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* MODE 2: DYNAMIC AMOUNT QR SCANNER */
            <div className="p-4 bg-[#141733] border border-[#2b3363] rounded-xl flex flex-col items-center text-center space-y-3 shadow-md">
              <div className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-purple-400" />
                <span>DYNAMIC UPI QR (Scan to Pay {selectedAmount ? `₹${selectedAmount}` : 'Any Amount'})</span>
              </div>

              {/* QR Code Card with Border */}
              <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-purple-500/30 flex items-center justify-center relative group">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`UPI Scanner QR for ${UPI_ID}`}
                    className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-zinc-500 text-xs">
                    Generating Scanner QR...
                  </div>
                )}
              </div>

              <p className="text-[11px] text-zinc-400 font-mono">
                Google Pay • PhonePe • Paytm • BHIM • Cred • Amazon Pay • Any UPI App
              </p>

              {/* QR Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full pt-1">
                <button
                  type="button"
                  onClick={handleShareQr}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-[#1a1f40] hover:bg-[#232955] border border-[#313a70] hover:border-purple-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {sharedQr ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Shared!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-sky-400" />
                      <span>Share QR</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQr}
                  disabled={!qrDataUrl}
                  className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-[#1a1f40] hover:bg-[#232955] border border-[#313a70] hover:border-purple-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Save QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePayInApp('any')}
                  className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 py-2 px-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                  title="Open in your default UPI payment app"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{launchingApp === 'any' ? 'Opening...' : 'Pay in App'}</span>
                </button>
              </div>

              {/* 1-Tap Direct UPI App Launcher (PhonePe, Google Pay, Paytm) */}
              <div className="w-full pt-2 border-t border-white/[0.08] space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 px-0.5">
                  <span className="text-zinc-300 font-bold uppercase tracking-wider">Fast 1-Tap UPI Launch:</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>NPCI Verified</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 w-full">
                  <button
                    type="button"
                    onClick={() => handlePayInApp('phonepe')}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-[#5f259f]/30 hover:bg-[#5f259f]/60 border border-[#5f259f]/60 text-purple-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Open directly in PhonePe"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>{launchingApp === 'phonepe' ? 'Opening...' : 'PhonePe'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePayInApp('gpay')}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-blue-950/50 hover:bg-blue-900/70 border border-blue-500/50 text-sky-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Open directly in Google Pay"
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span>{launchingApp === 'gpay' ? 'Opening...' : 'Google Pay'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePayInApp('paytm')}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-500/50 text-cyan-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Open directly in Paytm"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>{launchingApp === 'paytm' ? 'Opening...' : 'Paytm'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other ways to support */}
          <div className="p-3 bg-[#13162b] border border-white/[0.06] rounded-xl text-left space-y-1.5">
            <div className="text-[11px] font-bold text-purple-300 uppercase font-mono flex items-center gap-1">
              <Gift className="w-3 h-3 text-pink-400" />
              <span>Other Ways to Support (मुफ़्त में सहायता करें):</span>
            </div>
            <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
              <li>LinkBox को अपने दोस्तों और Telegram ग्रुप्स में शेयर करें</li>
              <li>नई काम करने वाली साइट्स और टूल्स Request Form से सजेस्ट करें</li>
              <li>अपने पसंदीदा लिंक्स को Star ⭐ करके बुकमार्क में रखें</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer with Actions */}
        <div className="p-3.5 sm:p-4 border-t border-white/[0.08] bg-[#151936] flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handleContributedClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              hasContributed
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : 'bg-emerald-950/60 hover:bg-emerald-900 border-emerald-600/50 text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{hasContributed ? 'Thank You So Much! ❤️' : "I've Contributed ❤️"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl text-xs transition-all shadow-md hover:scale-105 cursor-pointer"
            >
              Continue to LinkBox ➜
            </button>
          </div>
        </div>

      </div>

      {/* Lightbox Zoom for Original QR Scanner */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-lg animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-sm sm:max-w-md w-full bg-[#11142e] border border-purple-500/40 rounded-2xl p-4 shadow-2xl space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Original UPI Scanner (Scan & Pay)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <img
                src={scannerMode === 'og_qr' ? ogQrScannerImg : (qrDataUrl || ogQrScannerImg)}
                alt="UPI Scanner Fullscreen"
                className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handleDownloadQr}
                className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR Image</span>
              </button>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="py-2 px-4 bg-white/10 hover:bg-white/20 text-zinc-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface PrivacySettingsModalProps extends ModalBaseProps {
  isVaultPrivacyAutoCleanEnabled: boolean;
  onToggleVaultPrivacyAutoClean: () => void;
  onClearRecentHistory: () => void;
  onClearSearchHistory?: () => void;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  isOpen,
  onClose,
  isVaultPrivacyAutoCleanEnabled,
  onToggleVaultPrivacyAutoClean,
  onClearRecentHistory,
  onClearSearchHistory,
}) => {
  const [copiedTip, setCopiedTip] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101328] border border-[#2b315c] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 pb-4 border-b border-white/[0.08] flex items-center justify-between bg-[#151936]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-md">
              <Settings className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>Privacy & Stealth Settings</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SECURE
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Manage Vault privacy, auto-clean history, and incognito preferences
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-300">
          
          {/* Main Setting 1: 18+ & Vault Auto-Clean */}
          <div className="p-4 bg-[#141838] border border-purple-500/30 rounded-xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    18+ & Private Vault Auto-Clean
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Automatically blocks visited links tagged with <span className="text-rose-300 font-semibold">18+</span>, <span className="text-purple-300 font-semibold">Hentai</span>, or <span className="text-amber-300 font-semibold">Vault</span> from appearing in your public &quot;Recently Visited&quot; history bar.
                </p>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={onToggleVaultPrivacyAutoClean}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isVaultPrivacyAutoCleanEnabled ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isVaultPrivacyAutoCleanEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-400">Current Status:</span>
              <span className={`font-bold px-2 py-0.5 rounded ${
                isVaultPrivacyAutoCleanEnabled 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}>
                {isVaultPrivacyAutoCleanEnabled ? 'ACTIVE (PROTECTED)' : 'DISABLED'}
              </span>
            </div>
          </div>

          {/* Setting 2: Quick History Cleansers */}
          <div className="p-4 bg-[#141838] border border-white/[0.08] rounded-xl space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>History & Search Cleanup</span>
            </h4>
            <p className="text-[11px] text-zinc-400">
              Instantly purge your recently visited links or clear any active search filters to protect your browsing activity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClearRecentHistory();
                }}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Recent History</span>
              </button>

              {onClearSearchHistory && (
                <button
                  type="button"
                  onClick={onClearSearchHistory}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Search Filter</span>
                </button>
              )}
            </div>
          </div>

          {/* Privacy Tip Info Box */}
          <div className="p-3.5 bg-[#0d1024] border border-purple-500/20 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
              <EyeOff className="w-3.5 h-3.5 text-purple-400" />
              <span>Incognito & Private Tab Recommendation</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              All custom links added in your Custom Vault are stored only in your local browser cache (localStorage) and are never uploaded to any external server.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#151936] flex items-center justify-between">
          <span className="text-[11px] text-zinc-400 font-mono">
            Client-Side Privacy v2.5
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
          >
            Save & Close
          </button>
        </div>

      </div>
    </div>
  );
};

