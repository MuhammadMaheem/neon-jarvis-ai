"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useJarvisStore } from "@/store/useJarvisStore";

export const SoundwaveHalo: React.FC = () => {
  const { aiState, micAudioLevel } = useJarvisStore();

  const isSpeaking = aiState === "speaking";
  const isListening = aiState === "listening";
  const isThinking = aiState === "thinking";

  // Dynamic particle count and wave expansion
  const rings = useMemo(() => [1, 2, 3, 4], []);

  const haloColor = useMemo(() => {
    if (isSpeaking) return "border-emerald-400 shadow-emerald-400/50";
    if (isListening) return "border-cyan-400 shadow-cyan-400/50";
    if (isThinking) return "border-amber-400 shadow-amber-400/50";
    return "border-blue-500/30 shadow-blue-500/20";
  }, [isSpeaking, isListening, isThinking]);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
      {/* Expanding Ripple Rings */}
      {(isSpeaking || isListening) &&
        rings.map((ring) => (
          <motion.div
            key={ring}
            initial={{ scale: 0.85, opacity: 0.8 }}
            animate={{
              scale: isSpeaking ? [0.9, 1.35, 1.7] : [0.9, 1.25, 1.5],
              opacity: [0.7, 0.3, 0],
            }}
            transition={{
              duration: isSpeaking ? 1.6 : 2.2,
              repeat: Infinity,
              delay: ring * 0.45,
              ease: "easeOut",
            }}
            className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border ${haloColor} shadow-lg`}
          />
        ))}

      {/* Cybernetic Frequency Ring Arcs */}
      <motion.svg
        animate={{ rotate: isThinking ? 360 : 180 }}
        transition={{
          duration: isThinking ? 8 : 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-[340px] h-[340px] sm:w-[420px] sm:h-[420px]"
        viewBox="0 0 400 400"
      >
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="rgba(0, 240, 255, 0.15)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
        />
        <circle
          cx="200"
          cy="200"
          r="165"
          fill="none"
          stroke={isThinking ? "#ffb800" : isSpeaking ? "#00ff88" : "#00f0ff"}
          strokeWidth="2"
          strokeDasharray="30 180"
          strokeLinecap="round"
          className="transition-colors duration-500"
        />
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="rgba(0, 240, 255, 0.2)"
          strokeWidth="1"
          strokeDasharray="10 30"
        />
      </motion.svg>
    </div>
  );
};
