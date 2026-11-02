"use client";

import React from "react";
import { Mic, MicOff, Radio, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useJarvisStore } from "@/store/useJarvisStore";

interface Props {
  isListening: boolean;
  transcript: string;
  onToggle: () => void;
  isSupported: boolean;
}

export const VoiceController: React.FC<Props> = ({
  isListening,
  transcript,
  onToggle,
  isSupported,
}) => {
  const { micAudioLevel, aiState, settings } = useJarvisStore();

  return (
    <div className="flex flex-col items-center gap-2 select-none z-20">
      
      {/* Live Interim Transcript Bubble */}
      <AnimatePresence>
        {isListening && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="px-4 py-2 rounded-2xl border border-cyan-400/50 bg-black/80 backdrop-blur-xl text-cyan-200 text-xs font-mono shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-2 max-w-md text-center"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
            <span className="italic">"{transcript}"</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Voice Mic Trigger */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative px-5 py-2.5 rounded-full border-2 flex items-center gap-3 font-mono text-xs font-bold tracking-wider transition-all backdrop-blur-md ${
            isListening
              ? "border-red-500 bg-red-950/40 text-red-200 shadow-[0_0_25px_rgba(255,23,68,0.5)]"
              : "border-cyan-400 bg-cyan-950/40 text-cyan-200 hover:bg-cyan-500/20 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          }`}
        >
          {isListening ? (
            <>
              <div className="relative flex items-center justify-center">
                <Mic className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="absolute -inset-1 rounded-full border border-red-400 animate-ping" />
              </div>
              <span>LISTENING... (TAP TO MUTE)</span>
            </>
          ) : (
            <>
              <MicOff className="w-4 h-4 text-cyan-400" />
              <span>ACTIVATE VOICE [SPACE]</span>
            </>
          )}

          {/* Micro Audio Level Indicator */}
          {isListening && (
            <div className="flex items-center gap-0.5 h-3.5 ml-1">
              {[1, 2, 3, 4, 5].map((bar) => (
                <div
                  key={bar}
                  className="w-1 bg-red-400 rounded-full transition-all duration-75"
                  style={{
                    height: `${Math.min(100, Math.max(20, (micAudioLevel / 100) * 100 * (bar / 3)))}%`,
                  }}
                />
              ))}
            </div>
          )}
        </motion.button>
      </div>

      {!isSupported && (
        <span className="text-[10px] text-amber-400 font-mono">
          Web Speech recognition is not supported in this browser. Please use Chrome/Edge or text input.
        </span>
      )}
    </div>
  );
};
