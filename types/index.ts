export type JarvisState = "idle" | "listening" | "thinking" | "speaking";

export type SupportedLanguage = "en" | "ur" | "pa" | "auto";

export type ThemePreset = "cyan" | "blue" | "amber" | "crimson" | "emerald" | "purple";

export interface SearchResult {
  title: string;
  snippet: string;
  link: string;
  source?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle?: string;
  thumbnail?: string;
  url?: string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  isDay: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  spokenText?: string;
  timestamp: number;
  language?: SupportedLanguage;
  intent?: "chat" | "youtube_play" | "youtube_stop" | "search" | "weather" | "time" | "error";
  searchResults?: SearchResult[];
  youtubeVideo?: YouTubeVideo;
  weatherData?: WeatherData;
  isStreaming?: boolean;
}

export interface UserSettings {
  grokApiKey: string;
  elevenLabsApiKey: string;
  elevenLabsVoiceId: string;
  searchApiKey: string;
  googleSearchCx: string;
  theme: ThemePreset;
  soundEffects: boolean;
  ambientSound: boolean;
  wakeWordEnabled: boolean;
  continuousListening: boolean;
  voiceSpeed: number;
  useBrowserSpeechFallback: boolean;
  selectedVoiceName?: string;
}

export interface SystemTelemetry {
  cpuUsage: number;
  memoryUsage: number;
  audioInputLevel: number;
  fps: number;
  ping: number;
  activeModel: string;
  speechEngine: string;
}
