"use client";

import React, { useEffect, useState } from "react";
import { HolographicBackground } from "@/components/HUD/HolographicBackground";
import { HeaderHUD } from "@/components/HUD/HeaderHUD";
import { TelemetryPanel } from "@/components/HUD/TelemetryPanel";
import { JarvisCoreFace } from "@/components/AIFace/JarvisCoreFace";
import { SoundwaveHalo } from "@/components/AIFace/SoundwaveHalo";
import { VoiceController } from "@/components/Voice/VoiceController";
import { QuickCommandsBar } from "@/components/HUD/QuickCommandsBar";
import { FuturisticChat } from "@/components/Chat/FuturisticChat";
import { JarvisYouTubePlayer } from "@/components/YouTube/JarvisYouTubePlayer";
import { SettingsModal } from "@/components/Modals/SettingsModal";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useJarvisStore } from "@/store/useJarvisStore";
import { MessageSquare, Radio, Shield, Activity } from "lucide-react";

export default function JarvisApp() {
  const {
    isListening,
    transcript,
    isSupported,
    toggleListening,
  } = useSpeechRecognition();

  const {
    stopPlayback,
    toggleChat,
    isChatOpen,
    toggleSettings,
    settings,
  } = useJarvisStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is currently typing in an input or textarea, ignore hotkeys
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        toggleListening();
      } else if (e.code === "Escape") {
        e.preventDefault();
        stopPlayback();
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        toggleChat();
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        toggleSettings();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleListening, stopPlayback, toggleChat, toggleSettings]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center font-mono text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-xs tracking-widest animate-pulse">
            INITIALIZING JARVIS NEURAL OS...
          </span>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#030712]">
      {/* 1. Holographic Interactive Background */}
      <HolographicBackground />

      {/* 2. Top Sci-Fi Header Status Bar */}
      <HeaderHUD />

      {/* 3. Main Central Command Deck */}
      <div className="relative flex-1 w-full max-w-[1700px] mx-auto p-3 sm:p-6 flex items-stretch justify-between gap-4 overflow-hidden">
        
        {/* Left Telemetry Panel */}
        <TelemetryPanel />

        {/* Center: AI Robotic Core, Voice Controller & Quick Directives */}
        <section className="relative flex-1 flex flex-col items-center justify-center py-4 px-2 min-h-[500px]">
          
          {/* Soundwave Ripple Halo (Expanding arcs behind face) */}
          <SoundwaveHalo />

          {/* Glowing Animated Robotic AI Face */}
          <div className="z-10 mb-2">
            <JarvisCoreFace
              onCoreClick={toggleListening}
              isListening={isListening}
            />
          </div>

          {/* Voice Microphone Controller & Live Spoken Transcript */}
          <div className="mt-4 z-20">
            <VoiceController
              isListening={isListening}
              transcript={transcript}
              onToggle={toggleListening}
              isSupported={isSupported}
            />
          </div>

          {/* Quick Action Commands */}
          <div className="mt-6 z-20">
            <QuickCommandsBar />
          </div>

          {/* Mobile Bottom Chat Toggle Button */}
          <div className="lg:hidden fixed bottom-4 right-4 z-30">
            <button
              onClick={toggleChat}
              className="p-3.5 rounded-full bg-cyan-500 text-black shadow-[0_0_20px_#00f0ff] font-bold flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5 fill-black" />
            </button>
          </div>
        </section>

        {/* Right HUD: Futuristic Chat Terminal & Search/Weather/YouTube Cards */}
        <FuturisticChat
          isListening={isListening}
          onToggleVoice={toggleListening}
        />
      </div>

      {/* 4. Embedded YouTube Player Subsystem */}
      <JarvisYouTubePlayer />

      {/* 5. Configuration & API Keys Modal */}
      <SettingsModal />

      {/* Bottom Status Footer Line */}
      <footer className="relative z-20 px-4 py-2 border-t border-cyan-500/20 bg-black/70 backdrop-blur-md flex flex-wrap items-center justify-between text-[10px] font-mono text-cyan-400/60 select-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#00ff88]" />
          <span>NEURAL STREAM: ONLINE</span>
          <span className="hidden sm:inline">• LATENCY: 22ms</span>
          <span className="hidden sm:inline">• FRAME: 60 FPS</span>
        </div>
        <div>
          <span>NEON JARVIS AI // MULTILINGUAL PERSONAL OS</span>
        </div>
      </footer>
    </main>
  );
}
