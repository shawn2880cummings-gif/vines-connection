"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundMusic from "@/components/BackgroundMusic";
import SplashScreen from "@/components/SplashScreen";
import BackgroundParticles from "@/components/BackgroundParticles";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleEnter = () => {
    // Dispatch a custom event to trigger the background music
    const event = new CustomEvent("vines-play-music");
    window.dispatchEvent(event);
  };

  return (
    <>
      <BackgroundParticles />
      <SplashScreen onEnter={handleEnter} />
      <Navbar />
      <main className="pt-[72px]">{children}</main>
      <Footer />
      <BackgroundMusic />
    </>
  );
}
