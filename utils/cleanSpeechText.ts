/**
 * Clean text for Text-to-Speech synthesis and natural spoken delivery.
 * Strips all markdown, raw URLs, code blocks, asterisks, hashes, and formatting
 * so that ElevenLabs or Web Speech API speaks natural, human-like voice responses.
 */
export function cleanSpeechText(text: string): string {
  if (!text) return "";

  let cleaned = text;

  // 1. Remove code blocks
  cleaned = cleaned.replace(/```[\s\S]*?```/g, "Code block omitted.");

  // 2. Remove inline code `code`
  cleaned = cleaned.replace(/`([^`]+)`/g, "$1");

  // 3. Remove markdown links [Label](url) -> keep only Label
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 4. Remove raw URLs
  cleaned = cleaned.replace(/https?:\/\/\S+/gi, "");

  // 5. Remove markdown headers (#, ##, ###, etc.)
  cleaned = cleaned.replace(/^#+\s+/gm, "");

  // 6. Remove bold/italics markers (*, **, _, __, ~~)
  cleaned = cleaned.replace(/[*_~]{1,3}/g, "");

  // 7. Remove blockquotes and list markers (> , - , * , 1. )
  cleaned = cleaned.replace(/^[\s>*-]+(\d+\.)?\s+/gm, "");

  // 8. Remove HTML tags if any
  cleaned = cleaned.replace(/<[^>]*>/g, "");

  // 9. Remove brackets and curly braces
  cleaned = cleaned.replace(/[\[\]{}()]/g, "");

  // 10. Replace multiple newlines or spaces with single space/period
  cleaned = cleaned.replace(/\n+/g, ". ");
  cleaned = cleaned.replace(/\s{2,}/g, " ");

  // 11. Remove special ASCII / symbols that mess with TTS
  cleaned = cleaned.replace(/[|\\^~]/g, "");

  return cleaned.trim();
}

/**
 * Strips raw URLs from display text to adhere to user requirement:
 * "DO NOT: Show raw URLs in assistant replies"
 */
export function sanitizeDisplayText(text: string): string {
  if (!text) return "";
  // Turn raw URLs into clean domain references or remove them
  return text.replace(/(https?:\/\/[^\s]+)/g, (url) => {
    try {
      const parsed = new URL(url);
      return `[${parsed.hostname}]`;
    } catch {
      return "[source]";
    }
  });
}
