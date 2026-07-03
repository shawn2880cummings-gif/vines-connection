"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Maximize, Minimize, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlideGalleryProps {
  slideCount: number;
  slidePrefix: string;
  title: string;
  downloadUrl?: string;
  className?: string;
}

export function SlideGallery({
  slideCount,
  slidePrefix,
  title,
  downloadUrl,
  className,
}: SlideGalleryProps) {
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
      className={`flex flex-col overflow-hidden border transition-all duration-300 bg-black ${
        isFullscreen 
          ? "fixed inset-0 z-[9999] h-screen w-screen rounded-none border-0" 
          : `rounded-xl border-border/60 shadow-xl ${className}`
      }`}
    >
      <div className={`flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/90 ${isFullscreen ? "sticky top-0 z-10" : ""}`}>
        <span className="text-xs text-white/50 uppercase tracking-wider font-medium">
          {title} — {slideCount} Slides
        </span>
        <div className="flex items-center gap-4">
          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              className="text-xs text-paan-gold hover:underline underline-offset-4 flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
              Download PDF
            </a>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-paan-gold hover:text-paan-gold-light hover:bg-paan-gold/10 h-8 px-2 flex items-center gap-1.5"
          >
            {isFullscreen ? (
              <>
                <Minimize className="h-4 w-4" />
                <span>Exit</span>
              </>
            ) : (
              <>
                <Maximize className="h-4 w-4" />
                <span>Full Screen</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className={`overflow-y-auto ${isFullscreen ? "flex-1" : "max-h-[80vh]"}`}>
        {Array.from({ length: slideCount }, (_, i) => (
          <div key={i} className="relative">
            <Image
              src={`${slidePrefix}${i}.png`}
              alt={`Slide ${i + 1}`}
              width={1920}
              height={1080}
              className="w-full h-auto block"
              quality={isFullscreen ? 100 : 90}
              priority={i < 2}
            />
            {i < slideCount - 1 && <div className="h-px bg-white/10" />}
          </div>
        ))}
      </div>
    </div>
  );
}
