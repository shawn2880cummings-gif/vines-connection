"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const AUDIO_URL = "https://cdn.pixabay.com/audio/2023/11/10/audio_738c053fc9.mp3";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const savedMute = localStorage.getItem("background-music-muted-vines");
    if (savedMute === "true") {
      setIsMuted(true);
    }
  }, []);

  const startPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || hasStarted) return;

    audio.volume = 1;
    audio.muted = false;
    audio.currentTime = 0;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setHasStarted(true);
        })
        .catch((err) => {
          console.warn("Audio play blocked:", err);
        });
    }
  }, [hasStarted]);

  useEffect(() => {
    const handleVinesPlay = () => {
      startPlayback();
    };

    const handleInteraction = () => {
      if (!hasStarted) {
        startPlayback();
      }
    };

    window.addEventListener("vines-play-music", handleVinesPlay);
    document.addEventListener("click", handleInteraction, true);
    document.addEventListener("touchstart", handleInteraction, true);

    return () => {
      window.removeEventListener("vines-play-music", handleVinesPlay);
      document.removeEventListener("click", handleInteraction, true);
      document.removeEventListener("touchstart", handleInteraction, true);
    };
  }, [startPlayback, hasStarted]);

  useEffect(() => {
    if (audioRef.current && hasStarted) {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = 1;
    }
    localStorage.setItem("background-music-muted-vines", String(isMuted));
  }, [isMuted, hasStarted]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) {
      if (!hasStarted) {
        startPlayback();
      }
      audioRef.current.muted = newMuted;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2">
      <audio ref={audioRef} src={AUDIO_URL} loop preload="auto" />
      <button
        onClick={toggleMute}
        title={isMuted ? "Unmute Background Music" : "Mute Background Music"}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-black/80 hover:bg-black text-white shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 border border-white/20"
        aria-label={isMuted ? "Unmute background music" : "Mute background music"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
        ) : (
          <svg className="animate-pulse" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        )}
      </button>
    </div>
  );
};

export default BackgroundMusic;
