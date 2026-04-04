"use client";

import React, { useEffect, useRef, useState } from "react";

const AUDIO_URL = "https://cdn.pixabay.com/audio/2023/11/10/audio_738c053fc9.mp3";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // We only load the saved preference if it's "true" (muted).
    // Otherwise, we default to "false" (unmuted) as requested.
    const savedMute = localStorage.getItem("background-music-muted-vines");
    if (savedMute === "true") {
      setIsMuted(true);
    }
  }, []);

  useEffect(() => {
    const handleInteraction = () => {
      if (audioRef.current && !isMuted) {
        audioRef.current.muted = false;
        audioRef.current.play().catch(console.error);
        removeListeners();
      }
    };

    const removeListeners = () => {
      document.removeEventListener("click", handleInteraction, true);
      document.removeEventListener("touchstart", handleInteraction, true);
      document.removeEventListener("scroll", handleInteraction, true);
    };

    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted) {
        // Try playing with sound. 
        // If it fails, we don't show the 'X' in UI, we just wait for interaction.
        audioRef.current.play().catch(() => {
          // Add listeners to play on first interaction if blocked.
          document.addEventListener("click", handleInteraction, true);
          document.addEventListener("touchstart", handleInteraction, true);
          document.addEventListener("scroll", handleInteraction, true);
        });
      }
    }

    localStorage.setItem("background-music-muted-vines", String(isMuted));
    return () => removeListeners();
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <audio ref={audioRef} src={AUDIO_URL} loop autoPlay />
  );
};

export default BackgroundMusic;
