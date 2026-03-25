import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { initNotepad, debug } from "../../entry.js";

// Mockear módulos importados
vi.mock("../fontManager.js", () => ({
  FontManager: vi.fn().mockImplementation(() => ({
    loadCustomFont: vi.fn(),
  })),
}));

vi.mock("../themeManager.js", () => ({
  ThemeManager: vi.fn().mockImplementation(() => ({
    init: vi.fn().mockResolvedValue(),
  })),
}));

vi.mock("../tabs.js", () => ({
  TabManager: vi.fn().mockImplementation(() => ({
    init: vi.fn().mockResolvedValue(),
  })),
}));

vi.mock("../../ui/contextMenu.js", () => ({
  ContextMenu: vi.fn().mockImplementation(() => ({
    init: vi.fn().mockResolvedValue(),
  })),
}));

vi.mock("../../ui/settingsModal.js", () => ({
  SettingsModal: vi.fn().mockImplementation(() => ({
    init: vi.fn().mockResolvedValue(),
  })),
}));

vi.mock("../../utils/domHelpers.js", () => ({
  default: {},
}));

vi.mock("../../utils/emojiDetector.js", () => ({
  default: {},
}));

describe("entry.js", () => {
  let originalWindow;
  let originalDocument;
  let originalConsole;

  beforeEach(() => {
    // Guardar originales
    originalWindow = global.window;
    originalDocument = global.document;
    originalConsole = global.console;

    // Mock básico de window y document
    global.window = {
      fontManager: null,
      themeManager: null,
      tabManager: null,
      contextMenu: null,
      settingsModal: null,
      addEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matchMedia: vi.fn().mockReturnValue({ matches: false }),
    };
    global.document = {
      querySelector: vi.fn(),
      getElementById: vi.fn(),
      addEventListener: vi.fn(),
      documentElement: {
        classList: { toggle: vi.fn() },
        setAttribute: vi.fn(),
        getAttribute: vi.fn(),
      },
      body: {
        appendChild: vi.fn(),
      },
      createElement: vi.fn().mockReturnValue({
        style: {},
        appendChild: vi.fn(),
      }),
    };
    global.console = {
      warn: vi.fn(),
      log: vi.fn(),
      error: vi.fn(),
    };
  });

  afterEach(() => {
    // Restaurar
    global.window = originalWindow;
    global.document = originalDocument;
    global.console = originalConsole;
    vi.clearAllMocks();
  });

  describe("initNotepad", () => {
    it("no debe hacer nada en entorno no navegador", async () => {
      delete global.window;
      delete global.document;

      await initNotepad();

      expect(console.warn).toHaveBeenCalledWith(
        "⚠️  Entorno no compatible (SSR o Node.js), omitiendo...",
      );
    });

    it("debe inicializar correctamente en navegador", async () => {
      // Mock elementos DOM necesarios
      global.document.querySelector.mockReturnValue({});
      global.document.getElementById.mockReturnValue({});

      await initNotepad();

      expect(global.window.fontManager).toBeDefined();
      expect(global.window.themeManager).toBeDefined();
    });

    it("debe activar modo emergencia si falla inicialización", async () => {
      // Forzar error en loadCriticalFunctions
      vi.doMock("./core/fontManager.js", () => {
        throw new Error("Test error");
      });

      await initNotepad();

      expect(console.log).toHaveBeenCalledWith("🆘 Modo emergencia activado");
    });
  });

  describe("debug", () => {
    it('debe retornar "OK" en test', () => {
      expect(debug.test()).toBe("OK");
    });

    it("debe verificar elementos DOM", () => {
      const elements = debug.checkElements();
      expect(elements).toHaveProperty("tabList");
      expect(elements).toHaveProperty("createTab");
    });
  });
});
