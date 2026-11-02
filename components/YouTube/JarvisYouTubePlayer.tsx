"use client";

import React, { useRef } from "react";
import {
  X,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ExternalLink,
  Film,
} from "lucide-react";
import { useJarvisStore } from "@/store/useJarvisStore";
import { motion, AnimatePresence } from "framer-motion";

export const JarvisYouTubePlayer: React.FC = () => {
  const {
    currentVideo,
    isPlayingVideo,
    isPlayerOpen,
    isMiniPlayer,
    stopPlayback,
    togglePlayPause,
    toggleMiniPlayer,
    closePlayer,
    videoVolume,
    setVideoVolume,
  } = useJarvisStore();

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  if (!isPlayerOpen || !currentVideo) {
    return null;
  }

  // YouTube embed URL with autoplay, controls and JS API support
  const embedUrl = `https://www.youtube.com/embed/${currentVideo.id}?autoplay=${
    isPlayingVideo ? 1 : 0
  }&enablejsapi=1&origin=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.origin : ""
  )}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 40 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed z-40 transition-all duration-300 ${
          isMiniPlayer
            ? "bottom-6 right-6 w-80 sm:w-96 rounded-xl border border-cyan-400/60 bg-black/90 shadow-[0_0_25px_rgba(0,240,255,0.4)]"
            : "bottom-6 left-1/2 -translate-x-1/2 w-[92vw] max-w-2xl rounded-2xl border-2 border-cyan-400/70 bg-black/95 shadow-[0_0_40px_rgba(0,240,255,0.5)]"
        } backdrop-blur-2xl overflow-hidden`}
      >
        {/* Top Player HUD Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-500/30 bg-cyan-950/40">
          <div className="flex items-center gap-2 overflow-hidden mr-2">
            <Film className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wide text-cyan-200 truncate">
              {currentVideo.title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-cyan-400">
            {/* Play/Pause state toggle */}
            <button
              onClick={isPlayingVideo ? stopPlayback : togglePlayPause}
              className="p-1 rounded hover:bg-cyan-500/20 hover:text-white transition-colors"
              title={isPlayingVideo ? "Stop Playback ('Stop' / 'Ruk Jao')" : "Resume"}
            >
              {isPlayingVideo ? <Pause className="w-4 h-4 text-red-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Miniplayer Toggle */}
            <button
              onClick={toggleMiniPlayer}
              className="p-1 rounded hover:bg-cyan-500/20 hover:text-white transition-colors"
              title={isMiniPlayer ? "Expand Player" : "Miniplayer Mode"}
            >
              {isMiniPlayer ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>

            {/* Open on YouTube */}
            <a
              href={`https://www.youtube.com/watch?v=${currentVideo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-cyan-500/20 hover:text-white transition-colors"
              title="Open directly in YouTube"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Close Button */}
            <button
              onClick={closePlayer}
              className="p-1 rounded text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
              title="Close Stream"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Screen Frame */}
        <div className="relative aspect-video w-full bg-black">
          {isPlayingVideo ? (
            <iframe
              ref={iframeRef}
              src={embedUrl}
              title={currentVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-cyan-950/30 text-cyan-400 gap-2">
              <div className="w-12 h-12 rounded-full border border-cyan-400/50 flex items-center justify-center bg-black/60 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                <Pause className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-xs font-mono text-cyan-300/80">
                PLAYBACK HALTED • Say "Play" or click resume
              </p>
            </div>
          )}

          {/* Holographic Scanline bar */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.03)_50%,transparent_50%)] bg-[length:100%_4px]" />
        </div>

        {/* Bottom Subtitle / Voice Control Indicator */}
        <div className="px-3 py-1.5 flex items-center justify-between text-[10px] font-mono text-cyan-400/80 bg-black/70 border-t border-cyan-500/20">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">{currentVideo.channelTitle || "Official Channel"}</span>
          </div>

          <div className="flex items-center gap-2 text-cyan-300/60 shrink-0">
            <span>VOICE: "RUK JAO" / "STOP"</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
