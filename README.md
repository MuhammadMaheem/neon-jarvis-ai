# 🌟 NEON JARVIS AI // Futuristic Personal AI Assistant

An ultra-modern, cinematic, sci-fi personal AI operating system inspired by Iron Man's Jarvis, powered by **Next.js 15 App Router**, **TypeScript**, **TailwindCSS**, **Framer Motion**, and **Zustand**.

---

## ⚡ Core Capabilities

- 🤖 **Animated Neon Holographic AI Face**:
  - Fully reactive cybernetic robotic face with glowing eyes, cranial neuro-nodes, and dynamic audio-reactive mouth soundwaves.
  - 4 distinct state expressions: `Idle`, `Listening`, `Thinking`, and `Speaking`.
  - Expanding circular soundwave halo visualizer.
- 🗣️ **Multilingual Intelligence**:
  - Understands and speaks **English**, **Urdu** (اردو & Roman Urdu), and **Pakistani Punjabi** (پنجابی / Shahmukhi & Roman Punjabi) naturally.
  - Auto-language detection and seamless mixed-language conversation (e.g. *"Jarvis kal ka weather batao"*, *"Mujhe Atif Aslam ke songs sunao"*, *"Punjabi vich gal karo"*).
- 🎙️ **Continuous Voice & Wake Word System**:
  - Hands-free voice recognition with wake words: `"Jarvis"`, `"Hey Jarvis"`, `"Assistant"`, `"Suno Jarvis"`.
  - Real-time microphone sensitivity visualizer using Web Audio API.
  - Clean spoken voice delivery: Markdown symbols (`*`, `#`, `` ` ``), bullet points, and raw URLs are stripped so speech is 100% natural and human-like.
- 🛑 **Instant Stop Directives**:
  - Say `"Stop"`, `"Ruk jao"`, `"Bus karo"`, or `"Band karo"` to immediately stop YouTube playback and mute speech synthesis.
- 📺 **Built-in YouTube Subsystem**:
  - Embedded holographic YouTube player with autoplay, voice controls, and dockable Miniplayer mode.
- 🌐 **Real-Time Web Intelligence**:
  - Dual-tier search architecture: Google Custom Search API with automatic DuckDuckGo live search fallback (works even with zero API keys).
- 🌤️ **Live Weather & Telemetry**:
  - Real-time weather for any city worldwide (Lahore, Karachi, Islamabad, etc.) via Open-Meteo.
  - Simulated real-time neural CPU load, holographic memory, network ping, and telemetry monitor.
- 🔊 **Zero-Dependency Web Audio Synthesizer**:
  - Procedural sound effects: Jarvis boot chime, action confirmations, stop alerts, and an ambient sci-fi reactor core drone.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom neon palettes, glassmorphism, and scanline shaders
- **Animation**: Framer Motion
- **State Management**: Zustand (with localStorage persistence)
- **Audio & Voice**:
  - ElevenLabs API (`eleven_multilingual_v2`)
  - Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)
  - Web Audio API (Oscillators, BiquadFilters, AnalyserNodes)
- **LLM Engine**: Grok API (xAI `grok-2-latest`) with smart autonomous fallback
- **Real-Time Search**: Google Custom Search API & DuckDuckGo Live Engine
- **Icons**: Lucide React

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the keys as desired:
```env
# Grok (xAI) API Key (https://console.x.ai/)
GROK_API_KEY=your_grok_api_key_here

# ElevenLabs API Key (https://elevenlabs.io/)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Real-Time Search API Key (Google Custom Search or Serper)
SEARCH_API_KEY=your_search_api_key_here
GOOGLE_SEARCH_CX=your_google_custom_search_engine_id_here

# Optional YouTube Data API v3 Key
YOUTUBE_API_KEY=your_youtube_api_key_here
```
> **Note**: Even if you leave all API keys empty, **NEON JARVIS runs fully interactively** with its autonomous multilingual fallback engine, browser speech synthesis, real-time live search fallback, and YouTube scraper!

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in Chrome or Edge (recommended for Web Speech API).

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `[Space]` | Toggle Voice Listening Mode |
| `[Esc]` | Instant Stop (Halts YouTube & Speech) |
| `[C]` | Toggle Chat Logs Terminal |
| `[S]` | Open Configuration & API Keys Modal |

---

## 📂 Project Architecture

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts       # Grok-2 LLM endpoint & autonomous fallback
│   │   ├── search/route.ts     # Real-time search (Google / DuckDuckGo)
│   │   ├── tts/route.ts        # ElevenLabs TTS & Web Speech fallback
│   │   ├── weather/route.ts    # Live global weather (Open-Meteo)
│   │   └── youtube/route.ts    # YouTube search & video resolver
│   ├── globals.css             # Cyberpunk styling, scrollbar, neon glow
│   ├── layout.tsx              # Root layout & Google fonts (Orbitron, Rajdhani)
│   └── page.tsx                # Master Jarvis HUD Operating System Deck
├── components/
│   ├── AIFace/
│   │   ├── JarvisCoreFace.tsx  # Animated robotic AI face & gyro rings
│   │   └── SoundwaveHalo.tsx   # Circular expanding soundwave visualizer
│   ├── Chat/
│   │   └── FuturisticChat.tsx  # Sci-fi terminal, streaming text & media cards
│   ├── HUD/
│   │   ├── HeaderHUD.tsx       # Live clock, language toggle, audio switches
│   │   ├── HolographicBackground.tsx # Canvas particles & cyber grid
│   │   ├── QuickCommandsBar.tsx# Instant directive chips
│   │   └── TelemetryPanel.tsx  # Diagnostic CPU/Memory/Mic meters
│   ├── Modals/
│   │   └── SettingsModal.tsx   # API keys & theme configuration
│   ├── Voice/
│   │   └── VoiceController.tsx # Voice pill & interim transcript
│   └── YouTube/
│       └── JarvisYouTubePlayer.tsx # HUD embedded video player & miniplayer
├── hooks/
│   └── useSpeechRecognition.ts # Continuous listening, wake words & analyser
├── services/
│   ├── jarvisService.ts        # Core intent orchestrator & state manager
│   └── ttsService.ts           # Speech synthesis router & audio player
├── store/
│   └── useJarvisStore.ts       # Zustand store with persistence
├── utils/
│   ├── audioSynth.ts           # Web Audio API sound effects & core drone
│   ├── cleanSpeechText.ts      # Markdown & URL stripping for natural voice
│   └── intentParser.ts         # Multilingual intent parser (EN/UR/PA)
├── .env.example
├── next.config.ts
└── tailwind.config.ts
```
