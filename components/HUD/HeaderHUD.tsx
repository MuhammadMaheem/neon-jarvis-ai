"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Volume2,
  VolumeX,
  Radio,
  Settings,
  Maximize2,
  Minimize2,
  Globe,
  Youtube,
  Cpu,
} from "lucide-react";
import { useJarvisStore } from "@/store/useJarvisStore";
import { soundEffects } from "@/utils/audioSynth";
import { SupportedLanguage } from "@/types";

export const HeaderHUD: React.FC = () => {
  const {
    settings,
    updateSettings,
    activeLanguage,
    setLanguage,
    toggleSettings,
    currentVideo,
    isPlayerOpen,
    isPlayingVideo,
    aiState,
  } = useJarvisStore();

  const [timeStr, setTimeStr] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).toUpperCase()
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const toggleAmbientSound = () => {
    const nextState = !settings.ambientSound;
    updateSettings({ ambientSound: nextState });
    soundEffects.toggleAmbient(nextState);
  };

  const handleLangChange = (lang: SupportedLanguage) => {
    if (settings.soundEffects) soundEffects.playConfirmSound();
    setLanguage(lang);
  };

  return (
    <header className="relative z-30 w-full px-4 py-3 border-b border-cyan-500/20 bg-black/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
      {/* Left: Branding & Core Version */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-cyan-400/40 bg-cyan-950/30 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
          <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#00ff88]" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-cyan-200 uppercase font-mono">
              NEON JARVIS
            </h1>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono tracking-widest rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              MK-VII
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-300/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>NEURAL CORE // ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Center: Sci-Fi Real-Time Clock & Telemetry */}
      <div className="hidden md:flex flex-col items-center justify-center px-4 py-1 rounded-xl border border-cyan-500/20 bg-cyan-950/20 backdrop-blur-md">
        <div className="text-base font-bold font-mono tracking-widest text-cyan-300 text-shadow-[0_0_10px_#00f0ff]">
          {timeStr || "00:00:00"}
        </div>
        <div className="text-[10px] font-mono tracking-wider text-cyan-400/60">
          {dateStr || "INITIALIZING..."}
        </div>
      </div>

      {/* Right: Controls, Multilingual Selector, Audio & Settings */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Multilingual Selector [Auto, Urdu, English, Punjabi] */}
        <div className="flex items-center rounded-lg border border-cyan-500/30 bg-black/40 p-0.5 text-[11px] font-mono">
          <button
            onClick={() => handleLangChange("auto")}
            className={`px-2 py-1 rounded transition-all ${
              activeLanguage === "auto"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_8px_#00f0ff]"
                : "text-cyan-300 hover:text-white"
            }`}
            title="Auto detect language"
          >
            AUTO
          </button>
          <button
            onClick={() => handleLangChange("ur")}
            className={`px-2 py-1 rounded transition-all ${
              activeLanguage === "ur"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_8px_#00f0ff]"
                : "text-cyan-300 hover:text-white"
            }`}
            title="Urdu (اردو)"
          >
            اردو
          </button>
          <button
            onClick={() => handleLangChange("pa")}
            className={`px-2 py-1 rounded transition-all ${
              activeLanguage === "pa"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_8px_#00f0ff]"
                : "text-cyan-300 hover:text-white"
            }`}
            title="Pakistani Punjabi (پنجابی)"
          >
            ਪੰਜਾਬੀ
          </button>
          <button
            onClick={() => handleLangChange("en")}
            className={`px-2 py-1 rounded transition-all ${
              activeLanguage === "en"
                ? "bg-cyan-500 text-black font-bold shadow-[0_0_8px_#00f0ff]"
                : "text-cyan-300 hover:text-white"
            }`}
            title="English"
          >
            EN
          </button>
        </div>

        {/* Ambient Sci-Fi Hum Switch */}
        <button
          onClick={toggleAmbientSound}
          className={`p-2 rounded-lg border transition-all ${
            settings.ambientSound
              ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_#00f0ff]"
              : "border-cyan-500/20 bg-black/40 text-cyan-500/50 hover:text-cyan-300"
          }`}
          title={settings.ambientSound ? "Mute Ambient Reactor Hum" : "Enable Ambient Reactor Hum"}
        >
          <Radio className="w-4 h-4" />
        </button>

        {/* Sound Effects Switch */}
        <button
          onClick={() => {
            const next = !settings.soundEffects;
            updateSettings({ soundEffects: next });
            if (next) soundEffects.playConfirmSound();
          }}
          className={`p-2 rounded-lg border transition-all ${
            settings.soundEffects
              ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_#00f0ff]"
              : "border-cyan-500/20 bg-black/40 text-cyan-500/50 hover:text-cyan-300"
          }`}
          title={settings.soundEffects ? "Mute Sound Effects" : "Enable Sound Effects"}
        >
          {settings.soundEffects ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg border border-cyan-500/20 bg-black/40 text-cyan-400 hover:text-white hover:border-cyan-400/50 transition-all"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Settings Modal Button */}
        <button
          onClick={() => {
            if (settings.soundEffects) soundEffects.playConfirmSound();
            toggleSettings();
          }}
          className="p-2 rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_12px_#00f0ff] transition-all"
          title="Jarvis Settings & API Keys"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
