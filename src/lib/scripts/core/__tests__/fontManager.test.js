import { describe, it, expect, beforeEach, vi } from "vitest";
import { FontManager } from "../fontManager.js";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock elements with classList
const mockElement = () => ({
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
  },
  style: {
    fontFamily: "",
  },
});

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

Object.defineProperty(document, "head", {
  writable: true,
  value: {
    appendChild: vi.fn(),
  },
});

Object.defineProperty(document, "documentElement", {
  writable: true,
  value: {
    style: {
      setProperty: vi.fn(),
    },
  },
});

// Mock querySelectorAll to return mock elements
const mockElements = [mockElement(), mockElement()];
document.querySelectorAll = vi.fn().mockReturnValue(mockElements);

describe("FontManager - Lógica Básica", () => {
  let fontManager;

  beforeEach(() => {
    vi.clearAllMocks();
    document.querySelectorAll.mockReturnValue([mockElement(), mockElement()]);
    fontManager = new FontManager();
  });

  it("Aplicar fuente por defecto si no hay URL guardada", () => {
    localStorageMock.getItem.mockReturnValue(null);
    fontManager.loadCustomFont();
    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
      "--font-family-notes",
      `'Inter', sans-serif, serif`,
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
      `'Inter', sans-serif, serif`,
    );
  });
});

describe("FontManager - Tamaño de Fuente", () => {
  let fontManager;

  beforeEach(() => {
    vi.clearAllMocks();
    // Create fresh mock elements for each test
    const createMockElements = () => {
      const elements = [];
      for (let i = 0; i < 2; i++) {
        elements.push({
          classList: {
            add: vi.fn(),
            remove: vi.fn(),
          },
          style: {
            fontFamily: "",
          },
        });
      }
      return elements;
    };
    const freshMockElements = createMockElements();
    document.querySelectorAll = vi.fn().mockReturnValue(freshMockElements);
    fontManager = new FontManager();
  });

  it("changeFontSize - guarda en localStorage y aplica clase", () => {
    const result = fontManager.changeFontSize("medium");
    expect(result).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("fontSize", "medium");
  });

  it("changeFontSize - rechaza tamaño inválido", () => {
    const result = fontManager.changeFontSize("invalid");
    expect(result).toBe(false);
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it("changeFontSize - aplica clase base-text para tamaño base", () => {
    const elements = document.querySelectorAll(".tab-list__item--content");
    fontManager.changeFontSize("base");
    expect(elements[0].classList.add).toHaveBeenCalledWith("base-text");
    expect(elements[0].classList.remove).toHaveBeenCalledWith("medium-text");
    expect(elements[0].classList.remove).toHaveBeenCalledWith("large-text");
  });

  it("changeFontSize - aplica clase medium-text para tamaño medium", () => {
    const elements = document.querySelectorAll(".tab-list__item--content");
    fontManager.changeFontSize("medium");
    expect(elements[0].classList.add).toHaveBeenCalledWith("medium-text");
    expect(elements[0].classList.remove).toHaveBeenCalledWith("base-text");
    expect(elements[0].classList.remove).toHaveBeenCalledWith("large-text");
  });

  it("changeFontSize - aplica clase large-text para tamaño large", () => {
    const elements = document.querySelectorAll(".tab-list__item--content");
    fontManager.changeFontSize("large");
    expect(elements[0].classList.add).toHaveBeenCalledWith("large-text");
    expect(elements[0].classList.remove).toHaveBeenCalledWith("base-text");
    expect(elements[0].classList.remove).toHaveBeenCalledWith("medium-text");
  });

  it("loadFontSize - usa tamaño guardado en localStorage", () => {
    localStorageMock.getItem.mockReturnValue("large");
    const elements = document.querySelectorAll(".tab-list__item--content");
    fontManager.loadFontSize();
    expect(localStorageMock.getItem).toHaveBeenCalledWith("fontSize");
    expect(elements[0].classList.add).toHaveBeenCalledWith("large-text");
  });

  it("loadFontSize - usa tamaño por defecto si no hay guardado", () => {
    localStorageMock.getItem.mockReturnValue(null);
    const elements = document.querySelectorAll(".tab-list__item--content");
    fontManager.loadFontSize();
    expect(localStorageMock.getItem).toHaveBeenCalledWith("fontSize");
    expect(elements[0].classList.add).toHaveBeenCalledWith("base-text");
  });

  it("applyFontSizeToEditor - remueve todas las clases de tamaño antes de agregar", () => {
    const elements = document.querySelectorAll(".tab-list__item--content");
    fontManager.applyFontSizeToEditor("medium");
    const removeCalls = elements[0].classList.remove.mock.calls;
    expect(removeCalls).toContainEqual(["base-text"]);
    expect(removeCalls).toContainEqual(["medium-text"]);
    expect(removeCalls).toContainEqual(["large-text"]);
  });

  it("resetFontSize - remueve fontSize de localStorage y aplica base", () => {
    const elements = document.querySelectorAll(".tab-list__item--content");
    fontManager.resetFontSize();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("fontSize");
    expect(elements[0].classList.add).toHaveBeenCalledWith("base-text");
  });
});
