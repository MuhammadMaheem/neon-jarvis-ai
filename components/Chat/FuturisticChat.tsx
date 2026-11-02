"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Trash2,
  Search,
  ExternalLink,
  CloudSun,
  Play,
  Sparkles,
  Bot,
  User,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useJarvisStore } from "@/store/useJarvisStore";
import { jarvisService } from "@/services/jarvisService";
import { ttsService } from "@/services/ttsService";
import { soundEffects } from "@/utils/audioSynth";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isListening: boolean;
  onToggleVoice: () => void;
}

export const FuturisticChat: React.FC<Props> = ({ isListening, onToggleVoice }) => {
  const {
    messages,
    aiState,
    clearMessages,
    playVideo,
    settings,
    isChatOpen,
    toggleChat,
  } = useJarvisStore();

  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSubmitting) return;

    const query = inputText.trim();
    setInputText("");
    setIsSubmitting(true);

    if (settings.soundEffects) {
      soundEffects.playConfirmSound();
    }

    try {
      await jarvisService.processInput(query);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    if (settings.soundEffects) soundEffects.playConfirmSound();
    jarvisService.processInput(prompt);
  };

  const handleReplayVoice = (spokenText?: string) => {
    if (!spokenText) return;
    if (settings.soundEffects) soundEffects.playConfirmSound();
    ttsService.speak(spokenText, {
      voiceId: settings.elevenLabsVoiceId,
      apiKey: settings.elevenLabsApiKey,
      speed: settings.voiceSpeed,
    });
  };

  const suggestions = [
    "Jarvis kal ka weather batao",
    "Play Coke Studio Pasoori",
    "Search latest AI news",
    "Punjabi vich gal karo",
    "Mera Dil Badal De naat sunao",
    "Who is Tony Stark?",
  ];

  return (
    <aside
      className={`fixed lg:relative z-30 bottom-0 right-0 h-[65vh] lg:h-full w-full lg:w-96 flex flex-col rounded-t-3xl lg:rounded-2xl border-t lg:border border-cyan-500/30 bg-black/80 backdrop-blur-2xl shadow-[0_0_35px_rgba(0,0,0,0.85)] transition-all duration-300 ${
        isChatOpen ? "translate-y-0 opacity-100" : "translate-y-full lg:translate-y-0 pointer-events-none lg:pointer-events-auto"
      }`}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-cyan-950/30">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-300">
            JARVIS TERMINAL // LOGS
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-cyan-400">
          <button
            onClick={() => {
              if (settings.soundEffects) soundEffects.playStopSound();
              clearMessages();
            }}
            className="p-1.5 rounded hover:bg-cyan-500/20 hover:text-white transition-colors"
            title="Clear Chat Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleChat}
            className="p-1.5 lg:hidden rounded hover:bg-cyan-500/20 hover:text-white"
            title="Minimize Chat"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-mono text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            {/* Sender Meta */}
            <div className="flex items-center gap-1.5 mb-1 text-[10px] text-cyan-400/60 uppercase">
              {msg.role === "user" ? (
                <>
                  <span>YOU</span>
                  <User className="w-3 h-3 text-cyan-400" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-cyan-400" />
                  <span>JARVIS AI</span>
                  {msg.spokenText && (
                    <button
                      onClick={() => handleReplayVoice(msg.spokenText)}
                      className="ml-1 text-cyan-400 hover:text-white"
                      title="Speak response"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[88%] p-3 rounded-2xl border transition-all ${
                msg.role === "user"
                  ? "bg-cyan-950/50 border-cyan-400/50 text-cyan-100 rounded-tr-none shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                  : "bg-black/70 border-cyan-500/30 text-cyan-200 rounded-tl-none shadow-[0_0_20px_rgba(0,112,243,0.15)]"
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

              {/* Weather Card Embedded */}
              {msg.weatherData && (
                <div className="mt-2.5 p-2.5 rounded-xl border border-cyan-400/40 bg-cyan-950/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CloudSun className="w-7 h-7 text-amber-400" />
                    <div>
                      <div className="font-bold text-white text-sm">
                        {msg.weatherData.city}
                      </div>
                      <div className="text-[10px] text-cyan-300/80">
                        {msg.weatherData.condition}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-cyan-300">
                      {msg.weatherData.temperature}°C
                    </div>
                    <div className="text-[9px] text-cyan-400/70">
                      Humidity: {msg.weatherData.humidity}%
                    </div>
                  </div>
                </div>
              )}

              {/* YouTube Video Card Embedded */}
              {msg.youtubeVideo && (
                <div
                  onClick={() => playVideo(msg.youtubeVideo!)}
                  className="mt-2.5 group cursor-pointer rounded-xl border border-cyan-400/40 bg-black/60 overflow-hidden hover:border-cyan-300 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                  <div className="relative aspect-video w-full bg-cyan-950/50">
                    {msg.youtubeVideo.thumbnail ? (
                      <img
                        src={msg.youtubeVideo.thumbnail}
                        alt={msg.youtubeVideo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-cyan-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold shadow-[0_0_15px_#00f0ff]">
                        <Play className="w-5 h-5 ml-0.5 fill-black" />
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="font-bold text-cyan-200 line-clamp-1 group-hover:text-cyan-100">
                      {msg.youtubeVideo.title}
                    </div>
                    <div className="text-[10px] text-cyan-400/70 flex justify-between mt-0.5">
                      <span>{msg.youtubeVideo.channelTitle || "YouTube"}</span>
                      <span className="text-emerald-400 font-bold">CLICK TO STREAM</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Results Cards */}
              {msg.searchResults && msg.searchResults.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="text-[10px] text-cyan-400/80 uppercase font-semibold flex items-center gap-1">
                    <Search className="w-3 h-3 text-cyan-400" />
                    <span>Real-Time Intelligence Hits:</span>
                  </div>
                  {msg.searchResults.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded-lg border border-cyan-500/20 bg-cyan-950/20 hover:bg-cyan-900/30 hover:border-cyan-400/50 transition-all"
                    >
                      <div className="font-bold text-cyan-300 flex items-center justify-between text-[11px]">
                        <span className="line-clamp-1">{item.title}</span>
                        <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0 ml-1" />
                      </div>
                      <p className="text-[10px] text-cyan-200/80 line-clamp-2 mt-0.5">
                        {item.snippet}
                      </p>
                      <span className="text-[9px] text-cyan-400/60 mt-1 block">
                        Source: {item.source || "Web"}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* AI Thinking Animation in Chat */}
        {aiState === "thinking" && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-300">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span className="text-[11px] animate-pulse">
              Jarvis is analyzing neural networks...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Smart Suggestions Chips */}
      <div className="px-3 py-1.5 border-t border-cyan-500/20 bg-black/40 overflow-x-auto scrollbar-none flex gap-1.5">
        {suggestions.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSuggestionClick(sug)}
            className="px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap font-mono border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-cyan-500/20 bg-cyan-950/40 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={onToggleVoice}
          className={`p-2.5 rounded-xl border transition-all ${
            isListening
              ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_12px_#ff1744] animate-pulse"
              : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400"
          }`}
          title={isListening ? "Listening... Click to mute" : "Activate Microphone"}
        >
          {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Speak or type command (e.g. 'Play Pasoori', 'Stop')..."
          className="flex-1 bg-black/70 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs font-mono text-cyan-100 placeholder-cyan-500/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isSubmitting}
          className="p-2.5 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_12px_#00f0ff]"
          title="Send Directive"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
};
