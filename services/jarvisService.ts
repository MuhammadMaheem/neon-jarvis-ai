import { parseUserIntent } from "@/utils/intentParser";
import { useJarvisStore } from "@/store/useJarvisStore";
import { ttsService } from "@/services/ttsService";
import { soundEffects } from "@/utils/audioSynth";
import { cleanSpeechText } from "@/utils/cleanSpeechText";

class JarvisOrchestrator {
  /**
   * Main entry point for user prompts (from voice speech recognition or text chat input)
   */
  async processInput(rawInput: string): Promise<void> {
    const store = useJarvisStore.getState();
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    // 1. Add User Message to Chat
    store.addMessage({
      role: "user",
      content: trimmed,
      language: store.activeLanguage,
    });

    // 2. Parse Intent
    const intent = parseUserIntent(trimmed);
    store.setDetectedLanguage(intent.detectedLanguage);

    // 3. HANDLE STOP COMMAND IMMEDIATELY
    // ("Stop", "Ruk jao", "Bus karo", "Band karo")
    if (intent.type === "youtube_stop") {
      store.stopPlayback();
      ttsService.stop();

      let stopReply = "Playback terminated, Sir.";
      if (intent.detectedLanguage === "ur") {
        stopReply = "Jee Janab, video aur audio band kar di gayi hai.";
      } else if (intent.detectedLanguage === "pa") {
        stopReply = "Bilkul Janab, playback rok ditti aye.";
      }

      store.addMessage({
        role: "assistant",
        content: stopReply,
        spokenText: stopReply,
        intent: "youtube_stop",
      });

      this.speakAssistantResponse(stopReply, intent.detectedLanguage);
      return;
    }

    // Set AI state to thinking
    store.setAiState("thinking");

    // 4. HANDLE YOUTUBE PLAY COMMAND
    // ("Play [song/video/naat]", "Mujhe Atif Aslam songs chalao", etc.)
    if (intent.type === "youtube_play") {
      const query = intent.query || "Coke Studio";
      try {
        const res = await fetch("/api/youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            language: intent.detectedLanguage,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.video) {
            store.playVideo(data.video);
            const confirmation = data.spokenText || `Playing ${data.video.title}, Sir.`;

            store.addMessage({
              role: "assistant",
              content: confirmation,
              spokenText: confirmation,
              intent: "youtube_play",
              youtubeVideo: data.video,
            });

            this.speakAssistantResponse(confirmation, intent.detectedLanguage);
            return;
          }
        }
      } catch (err) {
        console.error("YouTube command error:", err);
      }
    }

    // 5. HANDLE WEATHER COMMAND
    // ("kal ka weather batao", "weather in Lahore", etc.)
    if (intent.type === "weather") {
      const city = intent.query || "Lahore";
      try {
        const res = await fetch("/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city,
            language: intent.detectedLanguage,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          store.addMessage({
            role: "assistant",
            content: data.spokenText,
            spokenText: data.spokenText,
            intent: "weather",
            weatherData: data.weather,
          });

          this.speakAssistantResponse(data.spokenText, intent.detectedLanguage);
          return;
        }
      } catch (err) {
        console.error("Weather error:", err);
      }
    }

    // 6. HANDLE TIME / DATE COMMAND
    if (intent.type === "time") {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const dateStr = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

      let timeReply = `Sir, the current time is ${timeStr} on ${dateStr}.`;
      if (intent.detectedLanguage === "ur") {
        timeReply = `Janab, is waqt ${timeStr} hue hain aur aaj ${dateStr} hai.`;
      } else if (intent.detectedLanguage === "pa") {
        timeReply = `Janab, ghadi te is wele ${timeStr} wajay ne te din ${dateStr} aye.`;
      }

      store.addMessage({
        role: "assistant",
        content: timeReply,
        spokenText: timeReply,
        intent: "time",
      });

      this.speakAssistantResponse(timeReply, intent.detectedLanguage);
      return;
    }

    // 7. HANDLE EXPLICIT SEARCH COMMAND
    if (intent.type === "search") {
      const searchQuery = intent.query || trimmed;
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchQuery,
            customApiKey: store.settings.searchApiKey,
            customCx: store.settings.googleSearchCx,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const spoken = data.spokenSummary || `Sir, I found ${data.results?.length || 0} intelligence items for ${searchQuery}.`;

          store.addMessage({
            role: "assistant",
            content: spoken,
            spokenText: spoken,
            intent: "search",
            searchResults: data.results,
          });

          this.speakAssistantResponse(spoken, intent.detectedLanguage);
          return;
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    }

    // 8. GENERAL CONVERSATION (Grok API with Multilingual Support)
    try {
      const conversationHistory = store.messages.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationHistory,
          userMessage: trimmed,
          userLanguage: intent.detectedLanguage,
          customApiKey: store.settings.grokApiKey,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.content || "All systems operational, Sir.";
        const spokenText = data.spokenText || cleanSpeechText(content);

        store.addMessage({
          role: "assistant",
          content,
          spokenText,
          intent: "chat",
        });

        this.speakAssistantResponse(spokenText, intent.detectedLanguage);
      } else {
        throw new Error("Chat request failed");
      }
    } catch (chatErr) {
      console.error("Chat orchestrator error:", chatErr);
      const fallbackReply = "Sir, telemetry connection experienced a micro-interruption. I remain operational.";
      store.addMessage({
        role: "assistant",
        content: fallbackReply,
        spokenText: fallbackReply,
        intent: "error",
      });
      this.speakAssistantResponse(fallbackReply, "en");
    }
  }

  /**
   * Triggers spoken output using TTS and manages AI Face states
   */
  private speakAssistantResponse(spokenText: string, language?: string) {
    const store = useJarvisStore.getState();
    const clean = cleanSpeechText(spokenText);

    if (!clean) {
      store.setAiState("idle");
      return;
    }

    store.setCurrentlySpeakingText(clean);
    store.setAiState("speaking");

    ttsService.speak(clean, {
      voiceId: store.settings.elevenLabsVoiceId,
      apiKey: store.settings.elevenLabsApiKey,
      speed: store.settings.voiceSpeed,
      language: language || store.detectedLanguage,
      onStart: () => {
        store.setAiState("speaking");
      },
      onEnd: () => {
        store.setAiState("idle");
        store.setCurrentlySpeakingText(null);
      },
      onError: () => {
        store.setAiState("idle");
        store.setCurrentlySpeakingText(null);
      },
    });
  }
}

export const jarvisService = new JarvisOrchestrator();
