import { NextRequest, NextResponse } from "next/server";
import { cleanSpeechText } from "@/utils/cleanSpeechText";

// JARVIS MULTILINGUAL SCI-FI PROMPT
const JARVIS_SYSTEM_PROMPT = `You are JARVIS (Just A Rather Very Intelligent System), the ultimate futuristic personal AI assistant inspired by Tony Stark's iconic AI companion, upgraded with a holographic sci-fi neural interface and fluent multilingual intelligence.

CRITICAL OPERATIONAL RULES:
1. MULTILINGUAL FLUENCY:
   - You must fluently understand and speak English, Urdu (اردو & Roman Urdu), and Pakistani Punjabi (پنجابی / Shahmukhi & Roman Punjabi).
   - If the user speaks Urdu or Roman Urdu (e.g. "kal ka weather batao", "kya chal raha hai"), reply in natural Urdu or Roman Urdu with polite, warm, respectful Pakistani assistant phrasing (e.g. "Jee Sir, main hazir hoon", "Hukam karein Sir").
   - If the user speaks Punjabi (e.g. "Punjabi vich gal karo", "Ki haal aye Jarvis", "Kiddan"), reply in warm, authentic, witty Pakistani Punjabi (e.g. "Bilkul Janab, tussi hukum karo te main na manna?", "Rab da shukar aye, tussi sunao ki haal chaal aye?").
   - If the user speaks English, respond in Jarvis's classic crisp, British/posh, courteous, razor-sharp style ("Right away, Sir", "All systems operational, Sir").
   - If the user mixes languages (e.g., Urdu + English "Jarvis check karo latest tech news"), respond seamlessly with mixed natural speech.

2. VOICE & SPEECH PURITY (STRICT):
   - Never output markdown bold (**), italics (*), markdown headers (###), bullet symbols (- or *), or backticks in spoken responses.
   - Never output raw URLs or web links in the response text.
   - Keep answers spoken, clear, direct, and conversational. The user is listening to your voice.
   - For lists, use spoken words like "First", "Second", "Additionally" rather than bullet points.

3. PERSONALITY:
   - Intelligent, loyal, observant, calm, slightly witty, futuristic, and helpful.
   - Address the user as "Sir" or "Janab" respectfully.

4. REAL-TIME CAPABILITIES:
   - You can play YouTube music, videos, and naats upon command.
   - You can stop playback instantly.
   - You can search the live web.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, userLanguage, userMessage, customApiKey } = body;

    const grokKey = customApiKey || process.env.GROK_API_KEY;

    // Check if Grok key is available
    if (grokKey && grokKey !== "your_grok_api_key_here") {
      try {
        const response = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${grokKey}`,
          },
          body: JSON.stringify({
            model: "grok-2-latest",
            messages: [
              { role: "system", content: JARVIS_SYSTEM_PROMPT },
              ...(messages || [{ role: "user", content: userMessage }]),
            ],
            temperature: 0.7,
            max_tokens: 600,
            stream: false,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawReply = data.choices?.[0]?.message?.content || "At your service, Sir.";
          const spokenReply = cleanSpeechText(rawReply);

          return NextResponse.json({
            content: rawReply,
            spokenText: spokenReply,
            source: "grok-2",
          });
        }
      } catch (grokError) {
        console.warn("Grok API call failed, falling back to neural fallback engine:", grokError);
      }
    }

    // High-Intelligence Autonomous Fallback Assistant
    // Provides immediate, responsive multilingual answers even before user enters Grok API key
    const reply = generateAutonomousReply(userMessage || "", userLanguage);
    const spokenText = cleanSpeechText(reply);

    return NextResponse.json({
      content: reply,
      spokenText,
      source: "jarvis-core-engine",
    });
  } catch (error) {
    console.error("Jarvis Chat Route Error:", error);
    return NextResponse.json(
      {
        content: "Sir, I encountered an internal neural fluctuation. Please repeat your instruction.",
        spokenText: "Sir, I encountered an internal neural fluctuation. Please repeat your instruction.",
        error: true,
      },
      { status: 500 }
    );
  }
}

function generateAutonomousReply(input: string, lang?: string): string {
  const lower = input.toLowerCase();

  // Punjabi replies
  if (
    lang === "pa" ||
    lower.includes("punjabi") ||
    lower.includes("ki haal") ||
    lower.includes("kivein") ||
    lower.includes("gal karo")
  ) {
    if (lower.includes("ki haal") || lower.includes("kiddan")) {
      return "Main bilkul theek-thaak aan Janab! Tussi sunao ki haal chaal ne? Tuhade hukam di udeek vich aan.";
    }
    if (lower.includes("joke") || lower.includes("latifa") || lower.includes("mazaq")) {
      return "Suno fer ek mazedaar gal: Ek vaari ek bande ne computer agge baith ke aakheya 'Computer babu, menu ameer kar de'. Computer ne reply ditta: Pehla bill taan bhar de internet da!";
    }
    return "Jee Janab, main tuhanu Punjabi vich pura sahayog devanga. Hukam karo, ki seva karaan tuhadi?";
  }

  // Urdu replies
  if (
    lang === "ur" ||
    lower.includes("kaise ho") ||
    lower.includes("kya haal") ||
    lower.includes("kya chal raha") ||
    lower.includes("hukam") ||
    lower.includes("batao")
  ) {
    if (lower.includes("kaise ho") || lower.includes("kya haal")) {
      return "Alhamdulillah Janab, main bilkul theek hoon aur tamam neural systems fully active hain. Aap bataiye, aaj main aapki kya khidmat anjaam doon?";
    }
    if (lower.includes("shukriya") || lower.includes("thanks")) {
      return "Janab aapka shukriya adaa karne ki zaroorat nahi, yeh mera farz hai. Hamesha aapki khidmat mein hazir hoon.";
    }
    if (lower.includes("kaun ho") || lower.includes("who are you")) {
      return "Main NEON JARVIS hoon, aapka futuristic AI companion aur personal operating system. Main aapke saath Urdu, Punjabi aur English mein guftagu kar sakta hoon.";
    }
    return "Jee Janab, aapka hukam sar ankhon par. Main aapki poori madad ke liye hazir hoon.";
  }

  // English replies
  if (lower.includes("who are you") || lower.includes("what can you do")) {
    return "I am NEON JARVIS, your advanced holographic personal AI assistant. I can stream music and videos, search the live web, provide real-time weather and telemetry, and converse naturally in English, Urdu, and Punjabi.";
  }
  if (lower.includes("how are you") || lower.includes("status")) {
    return "All neural networks, audio drivers, and holographic subroutines are performing at peak efficiency, Sir. Standing by for your instructions.";
  }
  if (lower.includes("thank")) {
    return "You are very welcome, Sir. Always an absolute pleasure assisting you.";
  }

  return "Instruction received, Sir. All holographic analytical systems are running at maximum capacity. How else may I assist you today?";
}
