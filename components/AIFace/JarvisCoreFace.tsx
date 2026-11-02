"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJarvisStore } from "@/store/useJarvisStore";
import { soundEffects } from "@/utils/audioSynth";

interface Props {
  onCoreClick?: () => void;
  isListening?: boolean;
}

export const JarvisCoreFace: React.FC<Props> = ({ onCoreClick, isListening }) => {
  const { aiState, micAudioLevel, settings } = useJarvisStore();
  const [mouthWaves, setMouthWaves] = useState<number[]>([15, 25, 45, 60, 35, 20, 10]);

  // Audio reactivity for mouth and eye glow during speech or listening
  useEffect(() => {
    let animId: number;

    const updateWave = () => {
      if (aiState === "speaking") {
        setMouthWaves(
          Array.from({ length: 9 }, () => Math.floor(Math.random() * 55) + 15)
        );
      } else if (aiState === "listening") {
        const boost = Math.min(60, micAudioLevel * 0.8 + 10);
        setMouthWaves(
          Array.from({ length: 9 }, (_, i) => {
            const centerDist = Math.abs(i - 4);
            return Math.max(8, boost - centerDist * 8 + Math.random() * 10);
          })
        );
      } else if (aiState === "thinking") {
        setMouthWaves([12, 18, 28, 40, 50, 40, 28, 18, 12]);
      } else {
        // Idle breathing wave
        setMouthWaves([6, 10, 16, 20, 24, 20, 16, 10, 6]);
      }
      animId = requestAnimationFrame(updateWave);
    };

    const interval = setInterval(updateWave, 90);
    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animId);
    };
  }, [aiState, micAudioLevel]);

  // State-dependent color palette
  const stateColor = useMemo(() => {
    switch (aiState) {
      case "listening":
        return {
          glow: "rgba(0, 240, 255, 0.9)",
          border: "#00f0ff",
          text: "LISTENING ACTIVE",
          accent: "text-cyan-400",
          bgGlow: "from-cyan-500/20 via-blue-500/10 to-transparent",
        };
      case "thinking":
        return {
          glow: "rgba(255, 184, 0, 0.9)",
          border: "#ffb800",
          text: "NEURAL PROCESSING",
          accent: "text-amber-400",
          bgGlow: "from-amber-500/20 via-orange-500/10 to-transparent",
        };
      case "speaking":
        return {
          glow: "rgba(0, 255, 136, 0.95)",
          border: "#00ff88",
          text: "VOCAL SYNTHESIS",
          accent: "text-emerald-400",
          bgGlow: "from-emerald-500/25 via-teal-500/10 to-transparent",
        };
      default: // idle
        return {
          glow: "rgba(0, 112, 243, 0.6)",
          border: "#0070f3",
          text: "STANDBY // READY",
          accent: "text-cyan-500",
          bgGlow: "from-cyan-900/15 via-blue-900/5 to-transparent",
        };
    }
  }, [aiState]);

  const handleFaceClick = () => {
    if (settings.soundEffects) {
      soundEffects.playWakeSound();
    }
    onCoreClick?.();
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4 select-none">
      {/* Background Volumetric Aura */}
      <div
        className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr ${stateColor.bgGlow} blur-3xl pointer-events-none transition-all duration-700`}
      />

      {/* Main Core Ring Container */}
      <motion.div
        onClick={handleFaceClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="relative w-64 h-64 sm:w-80 sm:h-80 cursor-pointer flex items-center justify-center"
      >
        {/* Outermost Orbiting Gyroscope 1 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30"
          style={{
            borderColor: stateColor.border,
            boxShadow: `0 0 15px ${stateColor.glow}`,
          }}
        />

        {/* Counter-Rotating Gyroscope 2 with HUD Ticks */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute inset-3 sm:inset-4 rounded-full border border-cyan-400/20 border-t-cyan-400/80 border-b-cyan-400/80"
        >
          {/* HUD Tech marks on ring */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff]" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff]" />
        </motion.div>

        {/* Inner Reactor Ring 3 */}
        <motion.div
          animate={{
            scale: aiState === "speaking" ? [1, 1.06, 1] : aiState === "listening" ? [1, 1.04, 1] : 1,
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-8 sm:inset-10 rounded-full border border-cyan-300/40 backdrop-blur-md bg-black/40 shadow-inner flex items-center justify-center"
        >
          {/* Animated Neon Robotic Face SVG Canvas */}
          <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex flex-col items-center justify-center">
            
            {/* Top Cranial Neuro-Nodes */}
            <div className="flex gap-2 mb-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: aiState === "thinking" ? [0.2, 1, 0.2] : 0.6,
                    scale: aiState === "thinking" ? [0.8, 1.2, 0.8] : 1,
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="w-1.5 h-3 rounded-sm bg-cyan-400/80 shadow-[0_0_6px_#00f0ff]"
                  style={{
                    backgroundColor: stateColor.border,
                    boxShadow: `0 0 8px ${stateColor.glow}`,
                  }}
                />
              ))}
            </div>

            {/* Angular Cybernetic Visor Faceplate */}
            <div className="relative w-36 sm:w-44 h-24 sm:h-28 rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/40 via-black/80 to-blue-950/60 shadow-[inset_0_0_20px_rgba(0,240,255,0.2)] flex flex-col items-center justify-between p-3 overflow-hidden">
              
              {/* Holographic Scanner line across eyes */}
              <motion.div
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-4 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent pointer-events-none"
              />

              {/* Glowing Reactive Eyes */}
              <div className="flex justify-between items-center w-full px-4 pt-1 z-10">
                {/* Left Eye */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale:
                        aiState === "speaking"
                          ? [1, 1.25, 0.9, 1.15, 1]
                          : aiState === "listening"
                          ? [1, 1.3, 1]
                          : aiState === "thinking"
                          ? [0.9, 1.1, 0.9]
                          : 1,
                      boxShadow: `0 0 20px ${stateColor.glow}`,
                    }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="w-8 h-4 sm:w-10 sm:h-5 rounded-full border-2 border-cyan-300 bg-cyan-400/80 flex items-center justify-center"
                    style={{
                      borderColor: stateColor.border,
                      backgroundColor: stateColor.border,
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
                  </motion.div>
                  {/* Eye Tech Eyelash HUD */}
                  <div className="absolute -top-1 w-10 h-0.5 bg-cyan-300/60" />
                </div>

                {/* Center Core HUD Node */}
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-mono tracking-widest text-cyan-400/80">AI-OS</span>
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"
                    style={{ backgroundColor: stateColor.border }}
                  />
                </div>

                {/* Right Eye */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale:
                        aiState === "speaking"
                          ? [1, 1.25, 0.9, 1.15, 1]
                          : aiState === "listening"
                          ? [1, 1.3, 1]
                          : aiState === "thinking"
                          ? [0.9, 1.1, 0.9]
                          : 1,
                      boxShadow: `0 0 20px ${stateColor.glow}`,
                    }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="w-8 h-4 sm:w-10 sm:h-5 rounded-full border-2 border-cyan-300 bg-cyan-400/80 flex items-center justify-center"
                    style={{
                      borderColor: stateColor.border,
                      backgroundColor: stateColor.border,
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
                  </motion.div>
                  {/* Eye Tech Eyelash HUD */}
                  <div className="absolute -top-1 w-10 h-0.5 bg-cyan-300/60" />
                </div>
              </div>

              {/* Dynamic Cyber Mouth / Audio-Reactive Soundwave Bars */}
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full pb-1 z-10">
                {mouthWaves.map((height, idx) => (
                  <motion.div
                    key={idx}
                    animate={{ height: `${height}px` }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    className="w-1 sm:w-1.5 rounded-full bg-gradient-to-t from-cyan-400 to-white shadow-[0_0_8px_#00f0ff]"
                    style={{
                      background: `linear-gradient(to top, ${stateColor.border}, #ffffff)`,
                      boxShadow: `0 0 8px ${stateColor.glow}`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Chin / Jaw Sensor Bracket */}
            <div className="w-20 sm:w-24 h-2 border-b-2 border-x-2 border-cyan-400/50 rounded-b-md mt-1 flex justify-center items-center">
              <div className="w-6 h-0.5 bg-cyan-300/80 shadow-[0_0_5px_#00f0ff]" />
            </div>

          </div>
        </motion.div>
      </motion.div>

      {/* Floating State Badge & Instruction */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mt-4 flex flex-col items-center gap-1.5"
      >
        <div
          className="px-3.5 py-1 rounded-full border border-cyan-400/40 bg-black/70 backdrop-blur-md text-[11px] font-mono tracking-widest font-semibold flex items-center gap-2 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
          style={{
            borderColor: stateColor.border,
            boxShadow: `0 0 15px ${stateColor.glow}`,
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: stateColor.border }}
          />
          <span className={stateColor.accent}>{stateColor.text}</span>
        </div>

        <p className="text-[10px] text-cyan-300/60 font-mono tracking-wider">
          {aiState === "listening"
            ? "Speak now • Say 'Jarvis' • 'Stop' • 'Play music'"
            : "Click Core or press Spacebar to activate voice"}
        </p>
      </motion.div>
    </div>
  );
};
