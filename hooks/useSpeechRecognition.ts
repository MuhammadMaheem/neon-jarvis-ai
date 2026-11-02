"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useJarvisStore } from "@/store/useJarvisStore";
import { hasWakeWord } from "@/utils/intentParser";
import { jarvisService } from "@/services/jarvisService";
import { soundEffects } from "@/utils/audioSynth";

interface UseSpeechRecognitionOptions {
  onResult?: (text: string) => void;
  onError?: (err: any) => void;
}

export function useSpeechRecognition({ onResult, onError }: UseSpeechRecognitionOptions = {}) {
  const {
    activeLanguage,
    settings,
    setAiState,
    aiState,
    setMicAudioLevel,
  } = useJarvisStore();

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // Set speech language based on active language setting
    if (activeLanguage === "ur") {
      recognition.lang = "ur-PK";
    } else if (activeLanguage === "pa") {
      recognition.lang = "pa-PK";
    } else {
      recognition.lang = "en-US";
    }

    recognition.onstart = () => {
      setIsListening(true);
      if (aiState !== "speaking" && aiState !== "thinking") {
        setAiState("listening");
      }
    };

    recognition.onresult = (event: any) => {
      let currentInterim = "";
      let finalSpeech = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalSpeech += event.results[i][0].transcript;
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }

      const activeText = (finalSpeech || currentInterim).trim();
      setTranscript(activeText);

      // Check Wake Word or direct command execution
      if (finalSpeech.trim()) {
        const textToProcess = finalSpeech.trim();
        setTranscript("");

        if (settings.wakeWordEnabled) {
          const { triggered, stripped } = hasWakeWord(textToProcess);
          if (triggered) {
            if (settings.soundEffects) soundEffects.playWakeSound();
            jarvisService.processInput(stripped || "Yes Sir?");
          } else {
            // Direct processing if already in active listening mode
            jarvisService.processInput(textToProcess);
          }
        } else {
          jarvisService.processInput(textToProcess);
        }

        onResult?.(textToProcess);
      }
    };

    recognition.onerror = (e: any) => {
      // Ignore routine aborts
      if (e.error !== "no-speech" && e.error !== "aborted") {
        console.warn("Speech Recognition notice:", e.error);
        onError?.(e);
      }
    };

    recognition.onend = () => {
      // If continuous listening is desired and state is still listening, restart
      setIsListening(false);
      if (useJarvisStore.getState().aiState === "listening") {
        try {
          recognition.start();
        } catch {}
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
    };
  }, [activeLanguage, settings.wakeWordEnabled, settings.soundEffects, onResult, onError]);

  // Audio Analyser for Microphone Sensitivity Waveform
  const startAudioMeter = async () => {
    try {
      if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkMeter = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setMicAudioLevel(normalized);

        animFrameRef.current = requestAnimationFrame(checkMeter);
      };

      checkMeter();
    } catch (e) {
      console.warn("Microphone analyser could not start:", e);
    }
  };

  const stopAudioMeter = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    micStreamRef.current?.getTracks().forEach((track) => track.stop());
    audioContextRef.current?.close().catch(() => {});
    setMicAudioLevel(0);
  };

  // Toggle Voice
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      stopAudioMeter();
      setIsListening(false);
      setAiState("idle");
      if (settings.soundEffects) soundEffects.playStopSound();
    } else {
      try {
        recognitionRef.current.start();
        startAudioMeter();
        setIsListening(true);
        setAiState("listening");
        if (settings.soundEffects) soundEffects.playWakeSound();
      } catch (err) {
        console.warn("Recognition start failed:", err);
      }
    }
  }, [isListening, settings.soundEffects, setAiState]);

  return {
    isListening,
    transcript,
    isSupported,
    toggleListening,
  };
}
