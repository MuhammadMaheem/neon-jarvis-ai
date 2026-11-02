import { create } from "zustand";
import {
  JarvisState,
  ChatMessage,
  YouTubeVideo,
  WeatherData,
  SearchResult,
  SupportedLanguage,
  UserSettings,
  SystemTelemetry,
  ThemePreset,
} from "@/types";
import { soundEffects } from "@/utils/audioSynth";

interface JarvisStoreState {
  // AI Core State
  aiState: JarvisState;
  setAiState: (state: JarvisState) => void;

  // Spoken Status
  currentlySpeakingText: string | null;
  setCurrentlySpeakingText: (text: string | null) => void;

  // Multilingual Configuration
  activeLanguage: SupportedLanguage;
  detectedLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  setDetectedLanguage: (lang: SupportedLanguage) => void;

  // Conversations
  messages: ChatMessage[];
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => string;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;

  // YouTube Subsystem
  currentVideo: YouTubeVideo | null;
  isPlayingVideo: boolean;
  isPlayerOpen: boolean;
  isMiniPlayer: boolean;
  videoVolume: number;
  playVideo: (video: YouTubeVideo) => void;
  stopPlayback: () => void;
  togglePlayPause: () => void;
  toggleMiniPlayer: () => void;
  closePlayer: () => void;
  setVideoVolume: (vol: number) => void;

  // Real-Time Telemetry & Audio Visualizer
  telemetry: SystemTelemetry;
  micAudioLevel: number;
  setMicAudioLevel: (level: number) => void;
  updateTelemetry: (updates: Partial<SystemTelemetry>) => void;

  // UI Panels
  isChatOpen: boolean;
  isSettingsOpen: boolean;
  toggleChat: () => void;
  toggleSettings: () => void;

  // User Settings & Persistence
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  setTheme: (theme: ThemePreset) => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  grokApiKey: "",
  elevenLabsApiKey: "",
  elevenLabsVoiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel / Clear British/American or custom
  searchApiKey: "",
  googleSearchCx: "",
  theme: "cyan",
  soundEffects: true,
  ambientSound: false,
  wakeWordEnabled: true,
  continuousListening: false,
  voiceSpeed: 1.0,
  useBrowserSpeechFallback: true,
  selectedVoiceName: "",
};

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome-init",
  role: "assistant",
  content:
    "Greetings, Sir. Jarvis neural systems are fully operational. I am ready to assist you in English, Urdu (اردو), or Punjabi (پنجابی). Say 'Jarvis' or click the central core to begin.",
  spokenText:
    "Greetings Sir. Jarvis neural systems are fully operational. I am ready to assist you in English, Urdu, or Punjabi.",
  timestamp: Date.now(),
  language: "en",
  intent: "chat",
};

export const useJarvisStore = create<JarvisStoreState>((set, get) => ({
  aiState: "idle",
  setAiState: (aiState) => set({ aiState }),

  currentlySpeakingText: null,
  setCurrentlySpeakingText: (currentlySpeakingText) =>
    set({ currentlySpeakingText }),

  activeLanguage: "auto",
  detectedLanguage: "en",
  setLanguage: (activeLanguage) => set({ activeLanguage }),
  setDetectedLanguage: (detectedLanguage) => set({ detectedLanguage }),

  messages: [INITIAL_MESSAGE],
  addMessage: (msg) => {
    const id = "msg_" + Math.random().toString(36).substring(2, 9);
    const newMsg: ChatMessage = {
      ...msg,
      id,
      timestamp: Date.now(),
    };
    set((state) => ({ messages: [...state.messages, newMsg] }));
    return id;
  },
  updateMessage: (id, updates) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    }));
  },
  clearMessages: () => set({ messages: [INITIAL_MESSAGE] }),

  // YouTube Playback
  currentVideo: null,
  isPlayingVideo: false,
  isPlayerOpen: false,
  isMiniPlayer: false,
  videoVolume: 80,

  playVideo: (video) => {
    const { settings } = get();
    if (settings.soundEffects) {
      soundEffects.playConfirmSound();
    }
    set({
      currentVideo: video,
      isPlayingVideo: true,
      isPlayerOpen: true,
      aiState: "idle",
    });
  },

  // STOP command triggered by voice ("Stop", "Ruk jao", "Bus karo", "Band karo") or UI
  stopPlayback: () => {
    const { settings, isPlayingVideo } = get();
    if (settings.soundEffects) {
      soundEffects.playStopSound();
    }
    // Stop any in-progress speech synthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    set({
      isPlayingVideo: false,
      currentlySpeakingText: null,
      aiState: "idle",
    });
  },

  togglePlayPause: () => {
    set((state) => ({ isPlayingVideo: !state.isPlayingVideo }));
  },

  toggleMiniPlayer: () => {
    set((state) => ({ isMiniPlayer: !state.isMiniPlayer }));
  },

  closePlayer: () => {
    set({ isPlayerOpen: false, isPlayingVideo: false, currentVideo: null });
  },

  setVideoVolume: (vol) => set({ videoVolume: vol }),

  // Telemetry
  telemetry: {
    cpuUsage: 14,
    memoryUsage: 38,
    audioInputLevel: 0,
    fps: 60,
    ping: 28,
    activeModel: "Grok-2 AI (xAI)",
    speechEngine: "ElevenLabs / WebSpeech",
  },
  micAudioLevel: 0,
  setMicAudioLevel: (micAudioLevel) => set({ micAudioLevel }),
  updateTelemetry: (updates) =>
    set((state) => ({ telemetry: { ...state.telemetry, ...updates } })),

  // UI Panels
  isChatOpen: true,
  isSettingsOpen: false,
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  toggleSettings: () =>
    set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),

  // Settings
  settings: DEFAULT_SETTINGS,
  updateSettings: (newSettings) => {
    set((state) => {
      const merged = { ...state.settings, ...newSettings };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("jarvis_settings", JSON.stringify(merged));
        } catch {}
      }
      return { settings: merged };
    });
  },
  setTheme: (theme) => {
    get().updateSettings({ theme });
  },
}));
