import { describe, it, expect, beforeEach, vi } from "vitest";
import { ThemeManager } from "../themeManager.js";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe("ThemeManager - Lógica Básica", () => {
  let themeManager;

  beforeEach(() => {
    vi.clearAllMocks();
    themeManager = new ThemeManager();
    // Reset document attributes
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.classList.remove("light-mode");
  });

  it("Load theme saved in localStorage", () => {
    localStorageMock.getItem.mockReturnValue("dark");
    themeManager.loadSavedTheme();
    expect(themeManager.currentTheme).toBe("dark");
  });

  it("Use default theme if no save file is available", () => {
    localStorageMock.getItem.mockReturnValue(null);
    // Mock matchMedia for system preference
    global.matchMedia = vi.fn().mockReturnValue({ matches: false });
    themeManager.loadSavedTheme();
    expect(themeManager.currentTheme).toBe("light");
  });

  it("Change theme correctly", () => {
    themeManager.switchTheme("cozy-rose");
    expect(themeManager.currentTheme).toBe("cozy-rose");
    expect(document.documentElement.getAttribute("data-theme")).toBe("cozy-rose");
    expect(localStorageMock.setItem).toHaveBeenCalledWith("notepadTheme", "cozy-rose");
  });

  it("Returns a list of available themes", () => {
    const themes = themeManager.getThemes();
    expect(themes).toHaveLength(6);
    expect(themes[0]).toHaveProperty("id", "dark");
  });

  it("Returns current topic", () => {
    themeManager.currentTheme = "neon-orbit";
    expect(themeManager.getCurrentTheme()).toBe("neon-orbit");
  });
});
