"use client";

import React from "react";
import {
  Play,
  Square,
  CloudSun,
  Search,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useJarvisStore } from "@/store/useJarvisStore";
import { jarvisService } from "@/services/jarvisService";
import { soundEffects } from "@/utils/audioSynth";

export const QuickCommandsBar: React.FC = () => {
  const { settings, stopPlayback, isPlayingVideo } = useJarvisStore();

  const handleCommand = (cmd: string) => {
    if (settings.soundEffects) soundEffects.playConfirmSound();
    jarvisService.processInput(cmd);
  };

  const handleStop = () => {
    if (settings.soundEffects) soundEffects.playStopSound();
    jarvisService.processInput("Stop");
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 select-none z-20">
      {/* Quick Play */}
      <button
        onClick={() => handleCommand("Play Coke Studio")}
        className="px-3 py-1.5 rounded-full border border-cyan-500/30 bg-black/60 backdrop-blur-md text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 text-xs font-mono flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]"
      >
        <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
        <span>Play Music</span>
      </button>

      {/* Instant Stop (Urdu/English/Punjabi) */}
      <button
        onClick={handleStop}
        className="px-3 py-1.5 rounded-full border border-red-500/40 bg-red-950/30 backdrop-blur-md text-red-300 hover:bg-red-500/30 hover:border-red-400 text-xs font-mono flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(255,23,68,0.25)]"
      >
        <Square className="w-3 h-3 text-red-400 fill-red-400" />
        <span>Stop / Ruk Jao</span>
      </button>

      {/* Live Weather */}
      <button
        onClick={() => handleCommand("kal ka weather batao")}
        className="px-3 py-1.5 rounded-full border border-cyan-500/30 bg-black/60 backdrop-blur-md text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 text-xs font-mono flex items-center gap-1.5 transition-all"
      >
        <CloudSun className="w-3.5 h-3.5 text-amber-400" />
        <span>Weather Info</span>
      </button>

      {/* Real-time search */}
      <button
        onClick={() => handleCommand("Search latest tech news")}
        className="px-3 py-1.5 rounded-full border border-cyan-500/30 bg-black/60 backdrop-blur-md text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 text-xs font-mono flex items-center gap-1.5 transition-all"
      >
        <Search className="w-3.5 h-3.5 text-cyan-400" />
        <span>Live Web Intel</span>
      </button>

      {/* Punjabi Dialogue */}
      <button
        onClick={() => handleCommand("Punjabi vich gal karo")}
        className="px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-md text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400 text-xs font-mono flex items-center gap-1.5 transition-all"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>ਪੰਜਾਬੀ موڈ</span>
      </button>
    </div>
  );
};
