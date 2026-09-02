import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { LinkItem } from '../types';
import { 
  X, QrCode, Download, Share2, Copy, Check, ExternalLink, 
  Smartphone, Sparkles, Globe 
} from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: LinkItem | null;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, link }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen && link?.url) {
      setIsGenerating(true);
      QRCode.toDataURL(link.url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#0f1123',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      })
        .then((url) => {
          setQrDataUrl(url);
          setIsGenerating(false);
        })
        .catch((err) => {
          console.error('Error generating QR code:', err);
          setIsGenerating(false);
        });
    } else {
      setQrDataUrl('');
    }
  }, [isOpen, link?.url]);

  if (!isOpen || !link) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${link.title} - LINK BOX`,
      text: `Check out ${link.title} on LINK BOX (${link.domain || link.url}):\n`,
      url: link.url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        handleCopyUrl();
      }
    } else {
      handleCopyUrl();
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const safeTitle = link.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `linkbox-${safeTitle}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#101328] border border-[#2b315c] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#151936]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-md">
              <QrCode className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>QR Code</span>
                {link.badge && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {link.badge}
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-400">
                Scan with phone camera or share
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

        {/* Modal Content */}
        <div className="p-5 sm:p-6 flex flex-col items-center text-center space-y-4">
          
          {/* Link Title & Domain Pill */}
          <div className="space-y-1 w-full">
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight truncate px-2" title={link.title}>
              {link.title}
            </h4>
            <div className="flex items-center justify-center gap-1.5 text-xs text-purple-400 font-mono">
              <Globe className="w-3.5 h-3.5" />
              <span className="truncate max-w-[260px]">{link.domain || link.url.replace(/^https?:\/\//, '')}</span>
            </div>
          </div>

          {/* QR Code Canvas Box */}
          <div className="relative p-3.5 bg-white rounded-2xl shadow-xl shadow-purple-950/40 border-4 border-purple-500/30 flex items-center justify-center min-w-[200px] min-h-[200px]">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center gap-2 p-8 text-zinc-600">
                <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs font-semibold">Generating QR...</span>
              </div>
            ) : qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for ${link.title}`}
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded-lg"
              />
            ) : (
              <div className="text-xs text-zinc-500 p-8">Unable to generate QR code</div>
            )}
          </div>

          {/* Scan tip badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs">
            <Smartphone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Mobile camera se scan karke direct site open karein</span>
          </div>

          {/* URL Box with 1-click copy */}
          <div className="w-full flex items-center justify-between bg-[#141733] border border-[#272e5c] rounded-xl px-3 py-2 text-xs">
            <span className="text-zinc-300 font-mono truncate max-w-[250px] text-left">
              {link.url}
            </span>
            <button
              type="button"
              onClick={handleCopyUrl}
              title="Copy URL"
              className="ml-2 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/30 text-zinc-300 hover:text-purple-200 border border-white/10 hover:border-purple-500/50 flex items-center gap-1 text-[11px] font-semibold transition-all cursor-pointer shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons: Share, Download, and Open */}
          <div className="grid grid-cols-3 gap-2 w-full pt-1">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#191d3d] hover:bg-[#222855] border border-[#30386b] hover:border-purple-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              {shared ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Shared!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-sky-400" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadQr}
              disabled={!qrDataUrl}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#191d3d] hover:bg-[#222855] border border-[#30386b] hover:border-purple-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download</span>
            </button>

            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Site</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
