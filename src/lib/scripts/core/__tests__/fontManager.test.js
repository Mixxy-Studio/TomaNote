import { describe, it, expect, beforeEach, vi } from "vitest";
import { FontManager } from "../fontManager.js";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock document methods
Object.defineProperty(document, "createElement", {
  writable: true,
  value: vi.fn().mockReturnValue({
    rel: "",
    href: "",
    style: {},
    className: "",
    appendChild: vi.fn(),
  }),
});
document.head.appendChild = vi.fn();
document.documentElement.style.setProperty = vi.fn();
document.querySelectorAll = vi.fn().mockReturnValue([]);

describe("FontManager - Lógica Básica", () => {
  let fontManager;

  beforeEach(() => {
    vi.clearAllMocks();
    fontManager = new FontManager();
  });

  it("Aplicar fuente por defecto si no hay URL guardada", () => {
    localStorageMock.getItem.mockReturnValue(null);
    fontManager.loadCustomFont();
    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
      "--font-family-notes",
      `'Raleway', sans-serif, serif`,
    );
  });

  it("Cargar fuente personalizada correctamente", () => {
    localStorageMock.getItem.mockReturnValue(
      "https://fonts.googleapis.com/css2?family=Roboto",
    );
    fontManager.loadCustomFont();
    expect(document.head.appendChild).toHaveBeenCalled();
    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
      "--font-family-notes",
      `'Roboto', sans-serif, serif`,
    );
  });

  it("Cambia fuente de notas", () => {
    const result = fontManager.changeNoteFont(
      "https://fonts.googleapis.com/css2?family=Inter",
      "Inter",
    );
    expect(result).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "customFontUrl",
      "https://fonts.googleapis.com/css2?family=Inter",
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "customFontName",
      "Inter",
    );
  });

  it("Restablecer fuente a por defecto", () => {
    fontManager.resetNoteFont();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("customFontUrl");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("customFontName");
    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
      "--font-family-notes",
      `'Raleway', sans-serif, serif`,
    );
  });
});
