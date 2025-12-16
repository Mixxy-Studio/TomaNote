// src/lib/scripts/utils/emojiDetector.js
export function detectEmojiInText(text) {
  if (!text || typeof text !== 'string') return null;
  
  const emojiRegex = /[\p{Emoji_Presentation}\p{Emoji}\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const matches = text.match(emojiRegex);
  return matches ? matches[0] : null;
}

export function extractFirstEmoji(text) {
  return detectEmojiInText(text);
}