"use client";

import { useRef, useState, useEffect } from "react";
import { Maximize, Minimize, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PresentationViewerProps {
  src: string;
  title: string;
  className?: string;
  icon?: React.ReactNode;
  externalUrl: string;
  allowSpeech?: boolean;
  aspectRatio?: string;
  overlay?: React.ReactNode;
}

export function PresentationViewer({
  src,
  title,
  className,
  icon,
  externalUrl,
  allowSpeech = false,
  aspectRatio = "aspect-video",
  overlay,
}: PresentationViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col overflow-hidden border transition-all duration-300 ${
        isFullscreen 
          ? "fixed inset-0 z-[9999] h-screen w-screen rounded-none border-0 bg-black" 
          : `rounded-xl border-paan-gold/50 bg-black shadow-[0_0_30px_rgba(212,175,55,0.15)] group hover:border-paan-gold ${className}`
      }`}
    >
      <div className={`flex items-center justify-between px-5 py-4 border-b border-paan-gold/20 bg-black/90 ${isFullscreen ? "sticky top-0 z-10" : ""}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-paan-gold/20 text-paan-gold">
            {icon}
          </div>
          <span className="text-sm text-paan-cream font-bold uppercase tracking-[0.2em]">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-paan-gold hover:text-paan-gold-light hover:bg-paan-gold/10 h-8 px-2 flex items-center gap-1.5"
          >
            {isFullscreen ? (
              <>
                <Minimize className="h-4 w-4" />
                <span className="hidden sm:inline">Exit</span>
              </>
            ) : (
              <>
                <Maximize className="h-4 w-4" />
                <span className="hidden sm:inline">Full Screen</span>
              </>
            )}
          </Button>
          {!isFullscreen && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-paan-gold hover:text-paan-gold-light transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
            >
              Open Full <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
      <div className={`relative w-full bg-black/50 ${isFullscreen ? "flex-1" : "h-[700px] sm:h-[800px] lg:h-[900px]"}`}>
        {overlay}
        <iframe
          src={src}
          className="absolute inset-0 w-full h-full border-0"
          allow={`autoplay; fullscreen; encrypted-media${allowSpeech ? "; speech" : ""}`}
          allowFullScreen
          title={title}
          loading="lazy"
        />
      </div>
    </div>
  );
}
