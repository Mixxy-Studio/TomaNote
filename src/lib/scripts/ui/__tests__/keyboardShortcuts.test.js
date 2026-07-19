import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { KeyboardShortcuts } from "../keyboardShortcuts.js";

function makeKeyboardShortcuts() {
  const ks = new KeyboardShortcuts({ debug: false });
  global.window = {
    tabManager: { saveTabs: vi.fn() },
    commandPalette: { toggle: vi.fn() },
  };
  return ks;
}

describe("KeyboardShortcuts", () => {
  let keyboardShortcuts;
  let addEventListenerSpy;
  let dispatchEventSpy;
  let getElementByIdSpy;
  let querySelectorSpy;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, "addEventListener");
    dispatchEventSpy = vi.spyOn(document, "dispatchEvent");
    getElementByIdSpy = vi.spyOn(document, "getElementById");
    querySelectorSpy = vi.spyOn(document, "querySelector");

    global.CustomEvent = class CustomEvent {
      constructor(type, options) {
        this.type = type;
        this.detail = options?.detail;
      }
    };

    keyboardShortcuts = makeKeyboardShortcuts();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("It must initialize with default options", () => {
      const ks = new KeyboardShortcuts();
      expect(ks.options.debug).toBe(true);
    });

    it("You must merge custom options", () => {
      const ks = new KeyboardShortcuts({ debug: false });
      expect(ks.options.debug).toBe(false);
    });
  });

  describe("init", () => {
    it("It must initialize correctly on the desktop", async () => {
      await keyboardShortcuts.init();

      expect(keyboardShortcuts.isDesktop).toBe(true);
      expect(addEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    });

    it("Should not add a listener to touch devices.", async () => {
      const originalOtouchstart = window.ontouchstart;
      window.ontouchstart = true;

      const touchKs = new KeyboardShortcuts({ debug: false });
      await touchKs.init();

      expect(addEventListenerSpy).not.toHaveBeenCalled();

      window.ontouchstart = originalOtouchstart;
    });

    it("Retorna this para chaining", async () => {
      const result = await keyboardShortcuts.init();
      expect(result).toBe(keyboardShortcuts);
    });

    it("Registra listener para setupCommandPaletteShortcut", async () => {
      await keyboardShortcuts.init();

      const keydownCalls = addEventListenerSpy.mock.calls.filter((c) => c[0] === "keydown");
      expect(keydownCalls.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("setupEscapeKeyHandler - Command Palette abierto", () => {
    it("Ignora ESC si command palette está abierto", async () => {
      await keyboardShortcuts.init();

      const call = addEventListenerSpy.mock.calls.find((c) => c[0] === "keydown");
      const keydownHandler = call[1];

      const mockPalette = {
        hasAttribute: vi.fn().mockReturnValue(true),
      };
      getElementByIdSpy.mockImplementation((id) => {
        if (id === "commandPalette") return mockPalette;
        return null;
      });
      querySelectorSpy.mockReturnValue(null);

      keydownHandler({ key: "Escape" });

      expect(mockPalette.hasAttribute).toHaveBeenCalledWith("open");
      expect(dispatchEventSpy).not.toHaveBeenCalled();
    });
  });

  describe("setupEscapeKeyHandler - Modal de settings abierto", () => {
    it("Ignora ESC si el modal de settings está abierto", async () => {
      await keyboardShortcuts.init();

      const call = addEventListenerSpy.mock.calls.find((c) => c[0] === "keydown");
      const keydownHandler = call[1];

      const mockPalette = { hasAttribute: vi.fn().mockReturnValue(false) };
      const mockModal = { hasAttribute: vi.fn().mockReturnValue(true) };

      getElementByIdSpy.mockImplementation((id) => {
        if (id === "commandPalette") return mockPalette;
        if (id === "info-notepad") return mockModal;
        return null;
      });
      querySelectorSpy.mockReturnValue(null);

      keydownHandler({ key: "Escape" });

      expect(mockModal.hasAttribute).toHaveBeenCalledWith("open");
      expect(dispatchEventSpy).not.toHaveBeenCalled();
    });
  });

  describe("setupEscapeKeyHandler - Edición de nombre activa", () => {
    it("Sale del modo edición y guarda pestañas", async () => {
      await keyboardShortcuts.init();

      const call = addEventListenerSpy.mock.calls.find((c) => c[0] === "keydown");
      const keydownHandler = call[1];

      const mockPalette = { hasAttribute: vi.fn().mockReturnValue(false) };
      const mockModal = { hasAttribute: vi.fn().mockReturnValue(false) };
      const mockLabel = {
        removeAttribute: vi.fn(),
        isContentEditable: true,
        contains: vi.fn(),
      };

      getElementByIdSpy.mockImplementation((id) => {
        if (id === "commandPalette") return mockPalette;
        if (id === "info-notepad") return mockModal;
        return null;
      });
      querySelectorSpy.mockImplementation((sel) => {
        if (sel === 'label[contenteditable="true"]') return mockLabel;
        return null;
      });

      keydownHandler({ key: "Escape" });

      expect(mockLabel.removeAttribute).toHaveBeenCalledWith("contenteditable");
      expect(global.window.tabManager.saveTabs).toHaveBeenCalled();
    });
  });

  describe("setupEscapeKeyHandler - Pestaña activa abierta", () => {
    it("Desmarca el radio y dispatch tabsChanged", async () => {
      const dispatchCalls = [];
      document.dispatchEvent = vi.fn((event) => dispatchCalls.push(event));
      await keyboardShortcuts.init();

      const call = addEventListenerSpy.mock.calls.find((c) => c[0] === "keydown");
      const keydownHandler = call[1];

      const mockPalette = { hasAttribute: vi.fn().mockReturnValue(false) };
      const mockModal = { hasAttribute: vi.fn().mockReturnValue(false) };
      const mockRadio = { checked: true };

      getElementByIdSpy.mockImplementation((id) => {
        if (id === "commandPalette") return mockPalette;
        if (id === "info-notepad") return mockModal;
        return null;
      });
      querySelectorSpy.mockImplementation((sel) => {
        if (sel === 'label[contenteditable="true"]') return null;
        if (sel === '.tab-list input[type="radio"]:checked') return mockRadio;
        return null;
      });

      keydownHandler({ key: "Escape" });

      expect(mockRadio.checked).toBe(false);
      const tabsChangedEvent = dispatchCalls.find((e) => e.type === "tabsChanged");
      expect(tabsChangedEvent).toBeTruthy();
    });
  });

  describe("setupEscapeKeyHandler - Nada abierto", () => {
    it("No hace nada si no hay nada abierto", async () => {
      await keyboardShortcuts.init();

      const call = addEventListenerSpy.mock.calls.find((c) => c[0] === "keydown");
      const keydownHandler = call[1];

      getElementByIdSpy.mockReturnValue(null);
      querySelectorSpy.mockReturnValue(null);

      keydownHandler({ key: "Escape" });

      expect(dispatchEventSpy).not.toHaveBeenCalled();
    });

    it("Ignora teclas que no son Escape", async () => {
      await keyboardShortcuts.init();

      const call = addEventListenerSpy.mock.calls.find((c) => c[0] === "keydown");
      const keydownHandler = call[1];

      keydownHandler({ key: "Enter" });

      expect(dispatchEventSpy).not.toHaveBeenCalled();
    });
  });

  describe("setupCommandPaletteShortcut", () => {
    function getCtrlKHandler(addEventListenerSpy) {
      const keydownCalls = addEventListenerSpy.mock.calls.filter((c) => c[0] === "keydown");
      return keydownCalls[1]?.[1];
    }

    it("Ctrl+K abre el command palette", async () => {
      await keyboardShortcuts.init();
      const ctrlKHandler = getCtrlKHandler(addEventListenerSpy);

      ctrlKHandler({ key: "k", ctrlKey: true, preventDefault: vi.fn() });

      expect(global.window.commandPalette.toggle).toHaveBeenCalled();
    });

    it("Ctrl+K llama preventDefault", async () => {
      await keyboardShortcuts.init();
      const ctrlKHandler = getCtrlKHandler(addEventListenerSpy);

      const mockEvent = { key: "k", ctrlKey: true, preventDefault: vi.fn() };
      ctrlKHandler(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it("Ctrl+K sin commandPalette no lanza error", async () => {
      global.window.commandPalette = undefined;
      await keyboardShortcuts.init();
      const ctrlKHandler = getCtrlKHandler(addEventListenerSpy);

      expect(() => {
        ctrlKHandler({ key: "k", ctrlKey: true, preventDefault: vi.fn() });
      }).not.toThrow();
    });

    it("No activa con Ctrl+K si ctrlKey es false", async () => {
      await keyboardShortcuts.init();
      const ctrlKHandler = getCtrlKHandler(addEventListenerSpy);

      ctrlKHandler({ key: "k", ctrlKey: false, preventDefault: vi.fn() });

      expect(global.window.commandPalette.toggle).not.toHaveBeenCalled();
    });
  });
});
