import { describe, it, expect, vi } from "vitest";
import { getRandomPinEmoji, detectEmojiInText, extractFirstEmoji } from "../emojiDetector.js";

describe("emojiDetector - getRandomPinEmoji", () => {
  it("Retorna un string", () => {
    const result = getRandomPinEmoji();
    expect(typeof result).toBe("string");
  });

  it("Retorna un emoji de la lista PIN_EMOJIS", () => {
    const PIN_EMOJIS = ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "🟤", "⚫", "⚪", "📌", "📍", "🔒", "🌟", "💫", "📎", "🏷️", "🔖", "📑", "📋", "✨", "💼", "🎯", "✅"];
    const result = getRandomPinEmoji();
    expect(PIN_EMOJIS).toContain(result);
  });

  it("Retorna diferentes valores en múltiples llamadas (probabilístico)", () => {
    const results = new Set();
    for (let i = 0; i < 50; i++) {
      results.add(getRandomPinEmoji());
    }
    expect(results.size).toBeGreaterThan(1);
  });
});

describe("emojiDetector - detectEmojiInText", () => {
  it("Detecta emoji al inicio del texto", () => {
    expect(detectEmojiInText("📝 Mi nota")).toBe("📝");
  });

  it("Detecta emoji al final del texto", () => {
    expect(detectEmojiInText("Mi nota 📝")).toBe("📝");
  });

  it("Detecta emoji en medio del texto", () => {
    expect(detectEmojiInText("Hola 🌍 mundo")).toBe("🌍");
  });

  it("Retorna null para texto sin emoji", () => {
    expect(detectEmojiInText("Solo texto normal")).toBeNull();
  });

  it("Retorna null para string vacío", () => {
    expect(detectEmojiInText("")).toBeNull();
  });

  it("Retorna null para null", () => {
    expect(detectEmojiInText(null)).toBeNull();
  });

  it("Retorna null para undefined", () => {
    expect(detectEmojiInText(undefined)).toBeNull();
  });

  it("Retorna null para número", () => {
    expect(detectEmojiInText(123)).toBeNull();
  });

  it("Retorna el primer emoji si hay múltiples", () => {
    expect(detectEmojiInText("🔴🟠🟡")).toBe("🔴");
  });

  it("Detecta emojis de banderas", () => {
    const result = detectEmojiInText("País 🇪🇸");
    expect(result).not.toBeNull();
    expect(typeof result).toBe("string");
  });

  it("Detecta emojis de símbolos", () => {
    expect(detectEmojiInText("Hecho ✅")).toBe("✅");
  });

  it("Detecta emojis de objetos", () => {
    expect(detectEmojiInText("📌 Fijo")).toBe("📌");
  });
});

describe("emojiDetector - extractFirstEmoji", () => {
  it("Produce el mismo resultado que detectEmojiInText", () => {
    expect(extractFirstEmoji("📝 Test")).toBe(detectEmojiInText("📝 Test"));
    expect(extractFirstEmoji("Sin emoji")).toBe(detectEmojiInText("Sin emoji"));
  });

  it("Detecta emoji igual que detectEmojiInText", () => {
    expect(extractFirstEmoji("📝 Test")).toBe("📝");
  });

  it("Retorna null para texto sin emoji", () => {
    expect(extractFirstEmoji("Sin emoji")).toBeNull();
  });
});
