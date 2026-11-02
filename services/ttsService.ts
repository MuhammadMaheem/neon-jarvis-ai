import { cleanSpeechText } from "@/utils/cleanSpeechText";

class TextToSpeechService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  /**
   * Speak text via ElevenLabs API (streamed) or Web Speech API fallback.
   * Strips all markdown and raw URLs beforehand.
   */
  async speak(
    text: string,
    options: {
      voiceId?: string;
      apiKey?: string;
      speed?: number;
      language?: string;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): Promise<void> {
    this.stop(); // Stop previous voice immediately

    const cleaned = cleanSpeechText(text);
    if (!cleaned) {
      options.onEnd?.();
      return;
    }

    try {
      options.onStart?.();

      // 1. Try ElevenLabs API endpoint
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleaned,
          voiceId: options.voiceId,
          customApiKey: options.apiKey,
        }),
      });

      const contentType = response.headers.get("content-type");

      // If ElevenLabs returned binary audio (audio/mpeg)
      if (response.ok && contentType && contentType.includes("audio")) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;

        if (options.speed) {
          audio.playbackRate = options.speed;
        }

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          options.onEnd?.();
        };

        audio.onerror = (e) => {
          console.warn("Audio playback error, falling back to Web Speech:", e);
          URL.revokeObjectURL(audioUrl);
          this.currentAudio = null;
          this.speakWithWebSpeech(cleaned, options);
        };

        await audio.play();
        return;
      }

      // 2. Fallback to Web Speech API
      this.speakWithWebSpeech(cleaned, options);
    } catch (err) {
      console.warn("TTS failed, using Web Speech API fallback:", err);
      this.speakWithWebSpeech(cleaned, options);
    }
  }

  private speakWithWebSpeech(
    cleanedText: string,
    options: {
      speed?: number;
      language?: string;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      options.onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    this.currentUtterance = utterance;

    utterance.rate = options.speed || 1.0;
    utterance.pitch = 1.0;

    // Smart voice selection based on language
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (options.language === "ur") {
        const urVoice = voices.find(
          (v) => v.lang.includes("ur") || v.lang.includes("hi") || v.name.includes("Urdu")
        );
        if (urVoice) utterance.voice = urVoice;
      } else {
        // Crisp British / English voice for Jarvis feel
        const jarvisVoice =
          voices.find((v) => v.name.includes("Daniel") || v.name.includes("Oliver") || v.name.includes("George")) ||
          voices.find((v) => v.lang === "en-GB") ||
          voices.find((v) => v.lang.startsWith("en"));
        if (jarvisVoice) utterance.voice = jarvisVoice;
      }
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      options.onEnd?.();
      options.onError?.(e);
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Immediately stops any speech output
   */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }
}

export const ttsService = new TextToSpeechService();
