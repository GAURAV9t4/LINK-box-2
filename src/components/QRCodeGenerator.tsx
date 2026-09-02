import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
  renderAs?: 'canvas' | 'svg';
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  url,
  size = 200,
  className = '',
  darkColor = '#0f1123',
  lightColor = '#ffffff',
  renderAs = 'canvas',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!url) return;

    if (renderAs === 'canvas' && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor,
        },
        errorCorrectionLevel: 'H',
      }).catch((err) => {
        console.error('QRCodeGenerator canvas render error:', err);
      });
    } else if (renderAs === 'svg' && containerRef.current) {
      QRCode.toString(url, {
        type: 'svg',
        width: size,
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor,
        },
        errorCorrectionLevel: 'H',
      })
        .then((svgString) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svgString;
          }
        })
        .catch((err) => {
          console.error('QRCodeGenerator svg render error:', err);
        });
    }
  }, [url, size, darkColor, lightColor, renderAs]);

  if (renderAs === 'svg') {
    return <div ref={containerRef} className={`flex items-center justify-center ${className}`} />;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`rounded-lg max-w-full h-auto ${className}`}
      width={size}
      height={size}
    />
  );
};
