export interface ParsedIntent {
  type: "youtube_play" | "youtube_stop" | "weather" | "time" | "search" | "chat";
  query?: string;
  originalText: string;
  detectedLanguage: "en" | "ur" | "pa";
}

/**
 * Checks if the spoken text contains wake words
 */
export function hasWakeWord(text: string): { triggered: boolean; stripped: string } {
  const wakeWords = [
    /^(hey\s+)?jarvis\b/i,
    /^(hey\s+)?assistant\b/i,
    /^(suno\s+)?jarvis\b/i,
    /^(oye\s+)?jarvis\b/i,
    /^(sun\s+)?jarvis\b/i,
  ];

  for (const regex of wakeWords) {
    if (regex.test(text.trim())) {
      const stripped = text.trim().replace(regex, "").trim();
      return { triggered: true, stripped };
    }
  }

  // Also check if "jarvis" is anywhere in the utterance
  if (/\bjarvis\b/i.test(text)) {
    return { triggered: true, stripped: text.replace(/\bjarvis\b/gi, "").trim() };
  }

  return { triggered: false, stripped: text.trim() };
}

/**
 * Detect language: English, Urdu, or Pakistani Punjabi
 */
export function detectLanguage(text: string): "en" | "ur" | "pa" {
  const lower = text.toLowerCase();

  // Punjabi markers (Shahmukhi or Roman Punjabi)
  const punjabiMarkers = [
    "vich", "ch", "kivein", "ki haal", "tussi", "aaho", "nahi", "gal karo", 
    "changa", "sohna", "kithay", "kiddan", "punjabi", "haanji", "sunao", 
    "kar reha", "kar rahi", "chhad", "dass", "dasso", "پنجابی", "کیویں", "تسی"
  ];
  for (const marker of punjabiMarkers) {
    if (lower.includes(marker)) return "pa";
  }

  // Urdu markers (Script or Roman Urdu)
  const urduMarkers = [
    "kya", "kaise", "hai", "hain", "karo", "batao", "mujhe", "sunao", "chalao", 
    "ruk jao", "bus karo", "band karo", "mausam", "waqt", "kal", "aaj", 
    "shukriya", "janab", "theek", "hoon", "hota", "gaya", "اردو", "کیسے", "کیا", "روکو"
  ];
  for (const marker of urduMarkers) {
    if (lower.includes(marker)) return "ur";
  }

  // Arabic/Persian/Urdu Unicode range
  if (/[\u0600-\u06FF]/.test(text)) {
    return "ur";
  }

  return "en";
}

/**
 * Parses natural voice and text command intents across English, Urdu, and Punjabi
 */
export function parseUserIntent(rawText: string): ParsedIntent {
  const text = rawText.trim();
  const lower = text.toLowerCase();
  const lang = detectLanguage(text);

  // 1. STOP COMMANDS (Urdu, English, Punjabi)
  // Stop / Ruk jao / Bus karo / Band karo / Roko / Thamm jao
  const stopKeywords = [
    "stop",
    "ruk jao",
    "ruko",
    "bus karo",
    "bas karo",
    "band karo",
    "chup karo",
    "pause",
    "pause video",
    "stop playing",
    "stop music",
    "stop video",
    "khatam karo",
    "tham jao",
    "روک جاؤ",
    "بس کرو",
    "بند کرو",
    "روکو"
  ];

  for (const kw of stopKeywords) {
    if (lower === kw || lower.startsWith(kw + " ") || lower.endsWith(" " + kw) || lower.includes(" " + kw + " ")) {
      return {
        type: "youtube_stop",
        originalText: text,
        detectedLanguage: lang,
      };
    }
  }

  // 2. PLAY COMMANDS (YouTube / Songs / Videos / Naats / Qawwali / Recitations)
  // "play [song/video/naat]", "chalao [x]", "sunao [x]", "lagao [x]"
  const playPatterns = [
    /^play\s+(.+)/i,
    /^open\s+youtube\s+(?:and\s+play\s+)?(.+)/i,
    /(?:mujhe\s+)?(.+?)\s+(?:chalao|lagao|sunao|play karo)$/i,
    /^(?:chalao|lagao|sunao)\s+(.+)/i,
    /(?:youtube\s+te|youtube\s+pe)\s+(.+)\s+(?:chalao|play karo)/i,
    /^search\s+youtube\s+for\s+(.+)/i,
  ];

  for (const pattern of playPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const query = match[1]
        .replace(/^(song|video|naat|qawwali|track)\s+/i, "")
        .replace(/\s+(chalao|sunao|lagao|de do)$/i, "")
        .trim();
      return {
        type: "youtube_play",
        query: query.length > 0 ? query : match[1].trim(),
        originalText: text,
        detectedLanguage: lang,
      };
    }
  }

  // Direct song/naat mention like "play Atif Aslam" or "Atif Aslam ke songs sunao"
  if (lower.includes("song") || lower.includes("naat") || lower.includes("qawwali") || lower.includes("music")) {
    if (lower.includes("chalao") || lower.includes("sunao") || lower.includes("play") || lower.includes("lagao")) {
      const cleaned = text
        .replace(/\b(jarvis|please|mujhe|koi|acha|sa|chalao|sunao|lagao|play)\b/gi, "")
        .trim();
      if (cleaned.length > 2) {
        return {
          type: "youtube_play",
          query: cleaned,
          originalText: text,
          detectedLanguage: lang,
        };
      }
    }
  }

  // 3. WEATHER COMMANDS
  const weatherKeywords = ["weather", "mausam", "barish", "rain", "temperature", "forecast", "موسم"];
  for (const kw of weatherKeywords) {
    if (lower.includes(kw)) {
      // Extract city if present
      let city = "Lahore";
      const cityMatches = text.match(/(?:in|of|ka|ki)\s+([a-zA-Z\u0600-\u06FF]+)/i);
      if (cityMatches && cityMatches[1] && !weatherKeywords.includes(cityMatches[1].toLowerCase())) {
        city = cityMatches[1];
      }
      return {
        type: "weather",
        query: city,
        originalText: text,
        detectedLanguage: lang,
      };
    }
  }

  // 4. TIME / DATE COMMANDS
  const timeKeywords = ["what time", "current time", "kya waqt", "waqt kya", "kitne baje", "aaj ki tarikh", "today's date", "what is the date", "وقت"];
  for (const kw of timeKeywords) {
    if (lower.includes(kw)) {
      return {
        type: "time",
        originalText: text,
        detectedLanguage: lang,
      };
    }
  }

  // 5. EXPLICIT SEARCH COMMANDS
  const searchPatterns = [
    /^search\s+(?:for\s+)?(?:the\s+)?(.+)/i,
    /^google\s+(.+)/i,
    /^(?:dhoondo|talash karo|search karo)\s+(.+)/i,
    /(.+)\s+(?:search karo|google karo)$/i,
  ];

  for (const pattern of searchPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return {
        type: "search",
        query: match[1].trim(),
        originalText: text,
        detectedLanguage: lang,
      };
    }
  }

  // Default to standard chat / conversational intelligence
  return {
    type: "chat",
    originalText: text,
    detectedLanguage: lang,
  };
}
