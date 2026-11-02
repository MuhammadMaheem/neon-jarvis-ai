"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  Cpu,
  Database,
  Radio,
  Wifi,
  Terminal,
  Zap,
  Volume2,
} from "lucide-react";
import { useJarvisStore } from "@/store/useJarvisStore";

export const TelemetryPanel: React.FC = () => {
  const { telemetry, micAudioLevel, aiState, settings } = useJarvisStore();
  const [dynCpu, setDynCpu] = useState(16);
  const [dynMem, setDynMem] = useState(42);

  // Subtle natural CPU/memory fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      const baseCpu =
        aiState === "thinking"
          ? 72
          : aiState === "speaking"
          ? 48
          : aiState === "listening"
          ? 34
          : 18;
      setDynCpu(Math.min(99, Math.max(10, baseCpu + Math.floor((Math.random() - 0.5) * 8))));
      setDynMem(Math.min(90, Math.max(30, 42 + Math.floor((Math.random() - 0.5) * 4))));
    }, 2000);
    return () => clearInterval(interval);
  }, [aiState]);

  return (
    <aside className="hidden lg:flex flex-col gap-3 w-72 p-3.5 rounded-2xl border border-cyan-500/20 bg-black/50 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] text-cyan-300 font-mono select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-cyan-300">
            SYSTEM TELEMETRY
          </span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
          RT-24
        </span>
      </div>

      {/* CPU & Neural Core Load Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-cyan-400/80">
            <Cpu className="w-3.5 h-3.5" /> NEURAL LOAD
          </span>
          <span className="font-bold text-cyan-300">{dynCpu}%</span>
        </div>
        <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-cyan-500/30">
          <div
            className={`h-full transition-all duration-500 ${
              dynCpu > 65
                ? "bg-gradient-to-r from-amber-400 to-red-500 shadow-[0_0_8px_#ff1744]"
                : "bg-gradient-to-r from-cyan-500 to-blue-400 shadow-[0_0_8px_#00f0ff]"
            }`}
            style={{ width: `${dynCpu}%` }}
          />
        </div>
      </div>

      {/* Memory Allocation */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-cyan-400/80">
            <Database className="w-3.5 h-3.5" /> HOLOGRAM MEMORY
          </span>
          <span className="font-bold text-cyan-300">{dynMem}%</span>
        </div>
        <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-cyan-500/30">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_8px_#0070f3] transition-all duration-500"
            style={{ width: `${dynMem}%` }}
          />
        </div>
      </div>

      {/* Microphone Input Audio Reactivity */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px]">
          <span className="flex items-center gap-1.5 text-cyan-400/80">
            <Volume2 className="w-3.5 h-3.5" /> MIC SENSITIVITY
          </span>
          <span className="text-[10px] text-cyan-400">
            {aiState === "listening" ? "RECEIVING" : "STANDBY"}
          </span>
        </div>
        <div className="flex gap-0.5 h-3 items-end bg-black/40 p-0.5 rounded border border-cyan-500/20">
          {Array.from({ length: 18 }).map((_, i) => {
            const active =
              aiState === "listening"
                ? i < (micAudioLevel / 100) * 18 + 2
                : aiState === "speaking"
                ? i < Math.random() * 12 + 3
                : i < 2;
            return (
              <div
                key={i}
                className={`flex-1 rounded-sm transition-all duration-75 ${
                  active
                    ? i > 14
                      ? "bg-red-400 shadow-[0_0_6px_#ff1744]"
                      : i > 10
                      ? "bg-amber-400 shadow-[0_0_6px_#ffb800]"
                      : "bg-cyan-400 shadow-[0_0_6px_#00f0ff]"
                    : "bg-cyan-950/40"
                }`}
                style={{
                  height: active ? `${Math.min(100, (i + 2) * 6)}%` : "15%",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Subsystem Pipeline Status */}
      <div className="pt-2 border-t border-cyan-500/20 space-y-1.5 text-[10px]">
        <div className="flex justify-between items-center">
          <span className="text-cyan-400/70">LLM CORE:</span>
          <span className="text-cyan-300 font-bold">
            {settings.grokApiKey ? "GROK-2 (xAI)" : "JARVIS HYBRID"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-cyan-400/70">VOICE SYNTH:</span>
          <span className="text-cyan-300 font-bold">
            {settings.elevenLabsApiKey ? "ELEVENLABS" : "WEB SPEECH"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-cyan-400/70">SEARCH ENGINE:</span>
          <span className="text-cyan-300 font-bold">REAL-TIME WEB</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-cyan-400/70">MEDIA ENGINE:</span>
          <span className="text-cyan-300 font-bold">YOUTUBE STREAM</span>
        </div>
      </div>

      {/* Voice Commands Cheat Sheet */}
      <div className="pt-2 border-t border-cyan-500/20">
        <span className="text-[10px] text-cyan-400/60 uppercase tracking-wider block mb-1">
          Voice Directives
        </span>
        <div className="flex flex-col gap-1 text-[10px] text-cyan-300/90">
          <div className="flex justify-between">
            <span className="text-cyan-400">Play Song / Naat</span>
            <span className="text-cyan-500/70">"Play Atif Aslam"</span>
          </div>
          <div className="flex justify-between">
            <span className="text-red-400">Instant Stop</span>
            <span className="text-red-400/80">"Stop" / "Ruk jao"</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyan-400">Live Weather</span>
            <span className="text-cyan-500/70">"Mausam kaisa hai"</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyan-400">Punjabi Mode</span>
            <span className="text-cyan-500/70">"Punjabi vich bolo"</span>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="pt-2 border-t border-cyan-500/20 text-[9px] text-cyan-400/50 flex justify-between">
        <span>[SPACE] Mic Toggle</span>
        <span>[ESC] Stop</span>
      </div>

    </aside>
  );
};
