import { NextRequest, NextResponse } from "next/server";
import { cleanSpeechText } from "@/utils/cleanSpeechText";

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId, customApiKey } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const cleanedText = cleanSpeechText(text);
    if (!cleanedText) {
      return NextResponse.json({ useWebSpeech: true, cleanText: "" });
    }

    const apiKey = customApiKey || process.env.ELEVENLABS_API_KEY;
    const selectedVoice = voiceId || process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";

    // If key is configured and not default placeholder, try ElevenLabs
    if (apiKey && apiKey !== "your_elevenlabs_api_key_here") {
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": apiKey,
              Accept: "audio/mpeg",
            },
            body: JSON.stringify({
              text: cleanedText,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.55,
                similarity_boost: 0.8,
                style: 0.35,
                use_speaker_boost: true,
              },
            }),
            signal: AbortSignal.timeout(8000),
          }
        );

        if (response.ok) {
          const audioBuffer = await response.arrayBuffer();
          return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Length": audioBuffer.byteLength.toString(),
            },
          });
        } else {
          console.warn("ElevenLabs returned error status:", response.status);
        }
      } catch (elevenErr) {
        console.warn("ElevenLabs API fetch failed:", elevenErr);
      }
    }

    // Fallback: Inform client to speak via Web Speech API
    return NextResponse.json({
      useWebSpeech: true,
      cleanText: cleanedText,
      engine: "WebSpeechAPI",
    });
  } catch (error) {
    console.error("TTS Route Error:", error);
    return NextResponse.json({ useWebSpeech: true, cleanText: "" });
  }
}
