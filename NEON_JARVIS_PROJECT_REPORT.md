# 🌟 NEON JARVIS AI — Technical Project Report
**Course:** Generative Artificial Intelligence (BSAI 5th Semester)  
**Institution:** Superior University, Lahore — Faculty of Computer Science & Information Technology  
**Student Name:** Muhammad Maheem  
**Roll Number:** `SU92-BSAIM-F24-054`  
**Section:** BSAI-5A  
**Submission Date:** November 2026  
**GitHub Repository:** [https://github.com/MuhammadMaheem/neon-jarvis-ai](https://github.com/MuhammadMaheem/neon-jarvis-ai)  

---

## 1. Executive Summary & Project Abstract

**NEON JARVIS AI** is an autonomous, futuristic web-based personal AI assistant and personal operating system inspired by Iron Man's J.A.R.V.I.S. companion. Engineered on **Next.js 15 App Router**, **TypeScript**, **TailwindCSS**, **Framer Motion**, and **Zustand**, the platform synthesizes neural voice computing, multilingual intelligence across English, Urdu (اردو), and Pakistani Punjabi (پنجابی), real-time web querying, and YouTube media automation within a cinematic sci-fi holographic interface.

Unlike passive chatbots that only generate plain text responses, NEON JARVIS functions as an active desktop companion. It continuously listens for wake words (*"Jarvis"*, *"Assistant"*), reacts visually via an animated neon robotic face across four states (`Idle`, `Listening`, `Thinking`, `Speaking`), and executes voice directives in real time.

---

## 2. Problem Statement & Motivation

Traditional conversational AI web interfaces present three major shortcomings:
1. **Linguistic Limitation:** Most agents strictly favor standard English, failing to parse code-switching, Roman Urdu, and colloquial Pakistani Punjabi.
2. **Static Visual Presentation:** Flat, boring chatbot interfaces fail to communicate system state transitions (listening, processing, speaking) intuitively.
3. **Lack of Actuator Integration:** Conventional models provide conversational answers but cannot directly interact with media players, live weather sensors, or search subsystems on user command.

NEON JARVIS bridges this gap by combining an expressive sci-fi visual face, an intent parsing engine, and direct client-side media and telemetry actuators.

---

## 3. System Architecture & Technical Specifications

| Subsystem | Technology | Purpose & Implementation |
|---|---|---|
| **Framework** | Next.js 15 App Router | Modular server/client hybrid rendering with high-speed edge routes |
| **Language** | TypeScript 5.7 | Strict contracts for telemetry, intents, chat messages, and video data |
| **Styling** | TailwindCSS | Custom sci-fi color tokens, glassmorphic panels, and neon glow |
| **Animation** | Framer Motion | Audio-reactive mouth soundwaves, rotating gyros, expanding halos |
| **State** | Zustand | Centralized reactive state store with `localStorage` persistence |
| **Primary LLM** | Grok-2 API (xAI) | Multilingual conversational intelligence with autonomous core fallback |
| **Voice Engine** | ElevenLabs + Web Speech | Neural multilingual voice output (`eleven_multilingual_v2`) with browser TTS fallback |
| **Media Player** | YouTube Subsystem | HUD embedded player with video scraping resolver and voice control |
| **Audio Synthesis** | Web Audio API | Procedural sound generation (Jarvis wake chime, action beeps, reactor core hum) |

---

## 4. Multilingual Speech Pipeline & Speech Purity

NEON JARVIS parses and speaks three languages naturally:
- **Pakistani Punjabi (پنجابی / Shahmukhi & Roman):** Detects markers like *“vich”*, *“kivein”*, *“ki haal”*, *“tussi”*, *“gal karo”*, *“changa”*, responding in witty, authentic Punjabi (*“Bilkul Janab, tussi hukum karo te main na manna?”*).
- **Urdu (اردو & Roman Urdu):** Detects markers like *“kaise ho”*, *“kya chal raha hai”*, *“mausam”*, *“batao”*, responding with polite Pakistani phrasing (*“Jee Janab, aapka hukum sar ankhon par”*).
- **English:** Classic British/posh Jarvis persona (*“Right away, Sir. All systems operational”*).

### Speech Purity Standard
To avoid "AI slop" where voice synthesizers pronounce asterisks, hashtags, or URLs, the system applies strict sanitization:
- Strips markdown formatting (`*`, `**`, `#`, `` ` ``).
- Removes raw HTTP/HTTPS links from speech output.
- Replaces complex lists with natural conversational transitions (*“First”*, *“Additionally”*).

---

## 5. Voice Directives & Instant Stop Controls

| Directive Category | Voice Command Examples | Action Executed |
|---|---|---|
| **YouTube Playback** | *"Play Coke Studio Pasoori"*, *"Atif Aslam ke gane sunao"*, *"Mera dil badal de naat lagao"* | Searches YouTube, autoplays video in HUD player. |
| **Instant Stop Directives** | **"Stop"**, **"Ruk jao"**, **"Bus karo"**, **"Band karo"**, **"Roko"** | Immediately halts YouTube video, stops voice synthesis, plays stop sound. |
| **Live Weather** | *"Jarvis kal ka weather batao"*, *"Lahore weather report"* | Queries Open-Meteo API, displays weather card, speaks temperature in °C. |
| **Real-Time Search** | *"Search latest AI news"*, *"Dhoondo SpaceX launch"* | Queries live search engine, displays source cards, speaks synopsis. |
| **Temporal Telemetry** | *"Kya waqt hua hai"*, *"Current time and date"* | Announces local time and date in the matching language. |

---

## 6. Robotic AI Face & Holographic Interface

The central deck features an animated robotic AI face:
- **Audio-Reactive Glowing Optics:** Cyan eyes that dilate and glow according to microphone volume and speech synthesis amplitude.
- **Dynamic Mouth Soundwave:** 9 frequency-equalizer bars that oscillate in real time as Jarvis speaks or listens.
- **Bi-Directional Gyroscopes:** Concentric counter-rotating reticle rings with HUD degree markings.
- **Holographic Particle Canvas:** Dynamic nodes that drift and link via laser filaments in response to cursor and state.
- **HUD Telemetry Panels:** Simulated CPU neural load (14%–72%), holographic memory allocation, network ping, and active module status.

---

## 7. Build Verification & Deliverables

The application compiles cleanly with zero TypeScript or linting errors:
- Total Route Bundles: 9/9 pages and API routes verified.
- Production Server: Tested on port 3000 (`200 OK`).
- GitHub Repository: [https://github.com/MuhammadMaheem/neon-jarvis-ai](https://github.com/MuhammadMaheem/neon-jarvis-ai)
- Local Documentation: `~/Documents/NEON_JARVIS_PROJECT_REPORT.pdf`
- Submission Archive: `~/Documents/NEON_JARVIS_AI_SUBMISSION.zip`

---

## 8. Academic Manifest
- **Candidate:** Muhammad Maheem
- **ID / Roll No:** `SU92-BSAIM-F24-054`
- **Class / Section:** BSAI-5A (5th Semester)
- **Course:** Generative Artificial Intelligence
- **Faculty:** Faculty of Computer Science & Information Technology, Superior University, Lahore
