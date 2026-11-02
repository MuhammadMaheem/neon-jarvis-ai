"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Key,
  Volume2,
  Palette,
  Save,
  CheckCircle,
  HelpCircle,
  Sliders,
  Sparkles,
} from "lucide-react";
import { useJarvisStore } from "@/store/useJarvisStore";
import { soundEffects } from "@/utils/audioSynth";
import { ThemePreset } from "@/types";

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, toggleSettings, settings, updateSettings, setTheme } =
    useJarvisStore();

  const [form, setForm] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Load from localStorage if present
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("jarvis_settings");
        if (stored) {
          const parsed = JSON.parse(stored);
          setForm(parsed);
          updateSettings(parsed);
        }
      } catch {}
    }
  }, [updateSettings]);

  if (!isSettingsOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    if (settings.soundEffects) soundEffects.playConfirmSound();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      toggleSettings();
    }, 900);
  };

  const themes: { id: ThemePreset; name: string; color: string }[] = [
    { id: "cyan", name: "Jarvis Classic", color: "#00f0ff" },
    { id: "blue", name: "Deep Arc", color: "#0070f3" },
    { id: "amber", name: "Cyber Gold", color: "#ffb800" },
    { id: "crimson", name: "Combat Alert", color: "#ff1744" },
    { id: "emerald", name: "Matrix Core", color: "#00ff88" },
    { id: "purple", name: "Quantum Void", color: "#9d4edd" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in font-mono">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-cyan-400/60 bg-black/95 p-6 shadow-[0_0_50px_rgba(0,240,255,0.4)] text-cyan-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/30">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold tracking-widest text-cyan-300">
              JARVIS CONFIGURATION
            </h2>
          </div>
          <button
            onClick={toggleSettings}
            className="p-1 rounded-lg hover:bg-cyan-500/20 text-cyan-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="mt-5 space-y-5 text-xs">
          
          {/* Section: Primary Neural Keys */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-cyan-500/20 pb-1">
              <span className="flex items-center gap-1.5">
                <Key className="w-4 h-4 text-cyan-400" /> API CREDENTIALS
              </span>
              <span className="text-[10px] text-cyan-400/60">
                Optional: Fallback engines active
              </span>
            </div>

            {/* Grok API Key */}
            <div>
              <label className="block mb-1 text-cyan-300/80 font-medium">
                GROK API KEY (xAI)
              </label>
              <input
                type="password"
                value={form.grokApiKey}
                onChange={(e) => setForm({ ...form, grokApiKey: e.target.value })}
                placeholder="xai-..."
                className="w-full bg-cyan-950/20 border border-cyan-500/40 rounded-xl px-3 py-2 text-cyan-100 placeholder-cyan-600 focus:outline-none focus:border-cyan-300"
              />
              <p className="text-[10px] text-cyan-400/60 mt-0.5">
                Powers Grok-2 neural intelligence. Uses autonomous fallback if empty.
              </p>
            </div>

            {/* ElevenLabs API Key */}
            <div>
              <label className="block mb-1 text-cyan-300/80 font-medium">
                ELEVENLABS API KEY
              </label>
              <input
                type="password"
                value={form.elevenLabsApiKey}
                onChange={(e) =>
                  setForm({ ...form, elevenLabsApiKey: e.target.value })
                }
                placeholder="xi-api-key..."
                className="w-full bg-cyan-950/20 border border-cyan-500/40 rounded-xl px-3 py-2 text-cyan-100 placeholder-cyan-600 focus:outline-none focus:border-cyan-300"
              />
              <p className="text-[10px] text-cyan-400/60 mt-0.5">
                High-fidelity voice synthesis. Uses browser Web Speech API if empty.
              </p>
            </div>

            {/* ElevenLabs Voice ID */}
            <div>
              <label className="block mb-1 text-cyan-300/80 font-medium">
                ELEVENLABS VOICE ID
              </label>
              <input
                type="text"
                value={form.elevenLabsVoiceId}
                onChange={(e) =>
                  setForm({ ...form, elevenLabsVoiceId: e.target.value })
                }
                placeholder="21m00Tcm4TlvDq8ikWAM"
                className="w-full bg-cyan-950/20 border border-cyan-500/40 rounded-xl px-3 py-2 text-cyan-100 placeholder-cyan-600 focus:outline-none focus:border-cyan-300"
              />
            </div>

            {/* Real-time Search API Key & CX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 text-cyan-300/80 font-medium">
                  SEARCH API KEY (Google / Serper)
                </label>
                <input
                  type="password"
                  value={form.searchApiKey}
                  onChange={(e) =>
                    setForm({ ...form, searchApiKey: e.target.value })
                  }
                  placeholder="AIzaSy..."
                  className="w-full bg-cyan-950/20 border border-cyan-500/40 rounded-xl px-3 py-2 text-cyan-100 placeholder-cyan-600 focus:outline-none focus:border-cyan-300"
                />
              </div>
              <div>
                <label className="block mb-1 text-cyan-300/80 font-medium">
                  GOOGLE SEARCH CX (Engine ID)
                </label>
                <input
                  type="text"
                  value={form.googleSearchCx}
                  onChange={(e) =>
                    setForm({ ...form, googleSearchCx: e.target.value })
                  }
                  placeholder="0123456789..."
                  className="w-full bg-cyan-950/20 border border-cyan-500/40 rounded-xl px-3 py-2 text-cyan-100 placeholder-cyan-600 focus:outline-none focus:border-cyan-300"
                />
              </div>
            </div>
          </div>

          {/* Section: Themes */}
          <div className="space-y-2 pt-2 border-t border-cyan-500/20">
            <label className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Palette className="w-4 h-4 text-cyan-400" /> HOLOGRAPHIC THEME
            </label>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => {
                    setForm({ ...form, theme: t.id });
                    setTheme(t.id);
                  }}
                  className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                    form.theme === t.id
                      ? "border-white bg-cyan-500/20 text-white shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                      : "border-cyan-500/30 bg-black/40 text-cyan-400/80 hover:border-cyan-400"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="truncate text-[11px]">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Voice & Speech Options */}
          <div className="space-y-3 pt-2 border-t border-cyan-500/20">
            <label className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Volume2 className="w-4 h-4 text-cyan-400" /> VOICE DYNAMICS
            </label>

            <div>
              <div className="flex justify-between text-cyan-300/80 mb-1">
                <span>SPEECH SPEED: {form.voiceSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.3"
                step="0.05"
                value={form.voiceSpeed}
                onChange={(e) =>
                  setForm({ ...form, voiceSpeed: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-400 bg-cyan-950 rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.wakeWordEnabled}
                  onChange={(e) =>
                    setForm({ ...form, wakeWordEnabled: e.target.checked })
                  }
                  className="rounded border-cyan-500/40 bg-black accent-cyan-400"
                />
                <span>Wake Word ("Jarvis", "Assistant")</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.soundEffects}
                  onChange={(e) =>
                    setForm({ ...form, soundEffects: e.target.checked })
                  }
                  className="rounded border-cyan-500/40 bg-black accent-cyan-400"
                />
                <span>Sci-Fi Sound FX & Chimes</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-cyan-500/30 flex justify-end gap-3">
            <button
              type="button"
              onClick={toggleSettings}
              className="px-4 py-2 rounded-xl border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 flex items-center gap-2 shadow-[0_0_15px_#00f0ff] transition-all"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-black" />
                  <span>INITIALIZED</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-black" />
                  <span>SAVE SETTINGS</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
