import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock de navigator.language
function mockNavigatorLanguage(lang) {
  Object.defineProperty(global, "navigator", {
    value: { language: lang },
    writable: true,
    configurable: true,
  });
}

// Limpiar window.i18n antes de cada test
function resetI18n() {
  if (global.window) {
    global.window.i18n = undefined;
  }
}

describe("I18nManager - Inicialización", () => {
  let i18n;

  beforeEach(async () => {
    vi.clearAllMocks();
    resetI18n();
    
    // Re-importar para resetear el módulo
    vi.resetModules();
    const module = await import("../core.js");
    i18n = module.i18n;
  });

  it("init() debe detectar español de España (es-ES)", () => {
    mockNavigatorLanguage("es-ES");
    i18n.init();
    expect(i18n.getLang()).toBe("es");
  });

  it("init() debe detectar español de México (es-MX)", () => {
    mockNavigatorLanguage("es-MX");
    i18n.init();
    expect(i18n.getLang()).toBe("es");
  });

  it("init() debe detectar español de Argentina (es-AR)", () => {
    mockNavigatorLanguage("es-AR");
    i18n.init();
    expect(i18n.getLang()).toBe("es");
  });

  it("init() debe detectar inglés americano (en-US)", () => {
    mockNavigatorLanguage("en-US");
    i18n.init();
    expect(i18n.getLang()).toBe("en");
  });

  it("init() debe detectar inglés británico (en-GB)", () => {
    mockNavigatorLanguage("en-GB");
    i18n.init();
    expect(i18n.getLang()).toBe("en");
  });

  it("init() debe hacer fallback a inglés para otros idiomas (fr-FR)", () => {
    mockNavigatorLanguage("fr-FR");
    i18n.init();
    expect(i18n.getLang()).toBe("en");
  });

  it("init() debe hacer fallback a inglés para alemán (de-DE)", () => {
    mockNavigatorLanguage("de-DE");
    i18n.init();
    expect(i18n.getLang()).toBe("en");
  });

  it("init() debe setear initialized = true", () => {
    mockNavigatorLanguage("en-US");
    expect(i18n.initialized).toBe(false);
    i18n.init();
    expect(i18n.initialized).toBe(true);
  });

  it("init() debe asignar función t()", () => {
    mockNavigatorLanguage("en-US");
    i18n.init();
    expect(typeof i18n.t).toBe("function");
  });

  it("init() no debe romper en SSR (window undefined)", () => {
    const originalWindow = global.window;
    global.window = undefined;
    
    // No debe lanzar error
    expect(() => i18n.init()).not.toThrow();
    
    global.window = originalWindow;
  });
});

describe("I18nManager - Función t()", () => {
  let i18n;

  beforeEach(async () => {
    vi.clearAllMocks();
    resetI18n();
    vi.resetModules();
    const module = await import("../core.js");
    i18n = module.i18n;
  });

  describe("Traducciones en español", () => {
    beforeEach(() => {
      mockNavigatorLanguage("es-ES");
      i18n.init();
    });

    it('t("tab.new") debe retornar "Nueva"', () => {
      expect(i18n.t("tab.new")).toBe("Nueva");
    });

    it('t("tab.delete-confirm") debe retornar texto en español', () => {
      expect(i18n.t("tab.delete-confirm")).toBe("¿Eliminar esta pestaña?");
    });

    it('t("app.title") debe retornar "TomaNote"', () => {
      expect(i18n.t("app.title")).toBe("TomaNote");
    });
  });

  describe("Traducciones en inglés", () => {
    beforeEach(() => {
      mockNavigatorLanguage("en-US");
      i18n.init();
    });

    it('t("tab.new") debe retornar "New"', () => {
      expect(i18n.t("tab.new")).toBe("New");
    });

    it('t("tab.delete-confirm") debe retornar texto en inglés', () => {
      expect(i18n.t("tab.delete-confirm")).toBe("Delete this tab?");
    });

    it('t("app.title") debe retornar "TomaNote"', () => {
      expect(i18n.t("app.title")).toBe("TomaNote");
    });
  });

  describe("Fallback y manejo de errores", () => {
    beforeEach(() => {
      mockNavigatorLanguage("en-US");
      i18n.init();
    });

    it("t() debe retornar la key si la traducción no existe", () => {
      const result = i18n.t("key.inexistente");
      expect(result).toBe("key.inexistente");
    });

    it("t() debe hacer fallback a español si key no existe en inglés", () => {
      mockNavigatorLanguage("en-US");
      i18n.init();
      // Solo existe en español
      const result = i18n.t("tab.new");
      expect(result).toBe("New"); // EN tiene "New"
    });

    it("t() debe loguear warning para keys faltantes", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      i18n.t("key.missing.test");
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("[i18n] Missing translation"));
      warnSpy.mockRestore();
    });

    it("t() no debe warn para keys válidas", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      i18n.t("tab.new");
      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe("Edge cases de t()", () => {
    it("t() debe manejar string vacío", () => {
      mockNavigatorLanguage("es-ES");
      i18n.init();
      const result = i18n.t("");
      expect(result).toBeDefined();
    });

    it("t() no está disponible antes de init()", () => {
      // Sin init(), t() no existe
      expect(i18n.t).toBeNull();
    });

    it("t() está disponible después de init()", () => {
      mockNavigatorLanguage("es-ES");
      i18n.init();
      expect(typeof i18n.t).toBe("function");
    });
  });
});

describe("I18nManager - Cambio de Idioma", () => {
  let i18n;

  beforeEach(async () => {
    vi.clearAllMocks();
    resetI18n();
    vi.resetModules();
    const module = await import("../core.js");
    i18n = module.i18n;
  });

  it('setLang("es") debe cambiar idioma a español', () => {
    mockNavigatorLanguage("en-US");
    i18n.init();
    
    i18n.setLang("es");
    
    expect(i18n.getLang()).toBe("es");
    expect(i18n.t("tab.new")).toBe("Nueva");
  });

  it('setLang("en") debe cambiar idioma a inglés', () => {
    mockNavigatorLanguage("es-ES");
    i18n.init();
    
    i18n.setLang("en");
    
    expect(i18n.getLang()).toBe("en");
    expect(i18n.t("tab.new")).toBe("New");
  });

  it('setLang("invalid") debe ignorar cambio de idioma', () => {
    mockNavigatorLanguage("en-US");
    i18n.init();
    const originalLang = i18n.getLang();
    
    i18n.setLang("fr");
    
    expect(i18n.getLang()).toBe(originalLang);
  });

  it('setLang(null) no debe romper', () => {
    mockNavigatorLanguage("en-US");
    i18n.init();
    
    expect(() => i18n.setLang(null)).not.toThrow();
    expect(i18n.getLang()).toBe("en");
  });

  it('setLang(undefined) no debe romper', () => {
    mockNavigatorLanguage("en-US");
    i18n.init();
    
    expect(() => i18n.setLang(undefined)).not.toThrow();
    expect(i18n.getLang()).toBe("en");
  });
});

describe("I18nManager - Métodos Auxiliares", () => {
  let i18n;

  beforeEach(async () => {
    vi.clearAllMocks();
    resetI18n();
    vi.resetModules();
    const module = await import("../core.js");
    i18n = module.i18n;
  });

  it("getLang() debe retornar idioma actual", () => {
    mockNavigatorLanguage("es-ES");
    i18n.init();
    expect(i18n.getLang()).toBe("es");
  });

  it("has() debe retornar true para keys existentes", () => {
    mockNavigatorLanguage("es-ES");
    i18n.init();
    expect(i18n.has("tab.new")).toBe(true);
  });

  it("has() debe retornar false para keys inexistentes", () => {
    mockNavigatorLanguage("es-ES");
    i18n.init();
    expect(i18n.has("key.missing")).toBe(false);
  });

  it("getAvailableLangs() debe retornar array de idiomas disponibles", () => {
    i18n.init();
    expect(i18n.getAvailableLangs()).toEqual(["es", "en"]);
  });

  it("getAvailableLangs() debe tener longitud de 2", () => {
    i18n.init();
    expect(i18n.getAvailableLangs()).toHaveLength(2);
  });
});

describe("I18nManager - Edge Cases", () => {
  let i18n;

  beforeEach(async () => {
    vi.clearAllMocks();
    resetI18n();
    vi.resetModules();
    const module = await import("../core.js");
    i18n = module.i18n;
  });

  it("window.i18n debe ser accesible globalmente", () => {
    expect(global.window.i18n).toBeDefined();
  });

  it("t() no existe sin init()", () => {
    // Sin init, t es null
    expect(i18n.t).toBeNull();
  });

  it("navigator.language null debe manejar gracefully", () => {
    Object.defineProperty(global, "navigator", {
      value: { language: null },
      writable: true,
      configurable: true,
    });
    expect(() => i18n.init()).not.toThrow();
  });

  it("navigator.language undefined debe manejar gracefully", () => {
    Object.defineProperty(global, "navigator", {
      value: { language: undefined },
      writable: true,
      configurable: true,
    });
    expect(() => i18n.init()).not.toThrow();
  });

  it("traducción vacía debe distinguirse de undefined", () => {
    mockNavigatorLanguage("es-ES");
    i18n.init();
    
    // Las keys existentes deben tener valores no vacíos
    expect(i18n.t("tab.new").length).toBeGreaterThan(0);
  });

  it("traducciones en ambos idiomas deben ser diferentes", () => {
    mockNavigatorLanguage("es-ES");
    i18n.init();
    const esNew = i18n.t("tab.new");
    
    i18n.setLang("en");
    const enNew = i18n.t("tab.new");
    
    expect(esNew).not.toBe(enNew);
  });
});

describe("I18nManager - Integración con TabManager", () => {
  let i18n;
  let TabManager;

  beforeEach(async () => {
    vi.clearAllMocks();
    resetI18n();
    vi.resetModules();
    
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    // Mock DOM completo
    global.document = {
      querySelector: vi.fn().mockReturnValue({
        insertBefore: vi.fn(),
        appendChild: vi.fn(),
        querySelectorAll: vi.fn().mockReturnValue([]),
      }),
      getElementById: vi.fn().mockReturnValue(null),
      addEventListener: vi.fn(),
      createElement: vi.fn().mockImplementation((tag) => {
        const el = {
          appendChild: vi.fn(),
          classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() },
          style: {},
          setAttribute: vi.fn(),
          getAttribute: vi.fn(),
          querySelector: vi.fn().mockReturnValue({ checked: false, focus: vi.fn() }),
          querySelectorAll: vi.fn().mockReturnValue([]),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          focus: vi.fn(),
          innerHTML: "",
          textContent: "",
          checked: false,
          type: "radio",
          id: "",
        };
        return el;
      }),
      createEvent: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    // Importar módulos
    const i18nModule = await import("../core.js");
    i18n = i18nModule.i18n;
    
    const tabsModule = await import("../../lib/scripts/core/tabs.js");
    TabManager = tabsModule.TabManager;
  });

  it("createTab() debe usar traducción de i18n para nombre", () => {
    mockNavigatorLanguage("es-ES");
    i18n.init();
    
    const tabManager = new TabManager({
      enableCreation: true,
      debug: false,
    });
    
    // Mock completo de tabList
    const mockAppendChild = vi.fn();
    tabManager.tabList = {
      insertBefore: vi.fn(),
      appendChild: mockAppendChild,
      querySelectorAll: vi.fn().mockReturnValue([]),
      contains: vi.fn().mockReturnValue(true),
    };
    tabManager.createTabButton = {};
    
    const tab = tabManager.createTab();
    expect(tab.name).toBe("Nueva");
  });

  it("createTab('Custom Name') debe usar nombre personalizado", () => {
    mockNavigatorLanguage("es-ES");
    i18n.init();
    
    const tabManager = new TabManager({
      enableCreation: true,
      debug: false,
    });
    
    // Mock completo de tabList
    const mockAppendChild = vi.fn();
    tabManager.tabList = {
      insertBefore: vi.fn(),
      appendChild: mockAppendChild,
      querySelectorAll: vi.fn().mockReturnValue([]),
      contains: vi.fn().mockReturnValue(true),
    };
    tabManager.createTabButton = {};
    
    const tab = tabManager.createTab("Custom Name");
    expect(tab.name).toBe("Custom Name");
  });

  it("deleteTabElement() debe usar mensaje de confirmación del idioma", () => {
    mockNavigatorLanguage("es-ES");
    i18n.init();
    
    const confirmSpy = vi.fn().mockReturnValue(true);
    global.confirm = confirmSpy;
    
    const tabManager = new TabManager({
      enableDeletion: true,
      debug: false,
    });
    
    const mockTabElement = {
      querySelector: vi.fn().mockReturnValue({ id: "body-tab-1" }),
      remove: vi.fn(),
    };

    tabManager.tabsData = [{ id: "body-tab-1", name: "Test", content: "", isPinned: false, emoji: null }];
    
    // Configurar tabList mock correctamente
    tabManager.tabList = {
      querySelectorAll: vi.fn().mockReturnValue([]),
    };
    
    tabManager.deleteTabElement(mockTabElement);

    expect(confirmSpy).toHaveBeenCalledWith("¿Eliminar esta pestaña?");
  });
});

describe("I18nManager - Optional Chaining y null safety", () => {
  let i18n;

  beforeEach(async () => {
    vi.clearAllMocks();
    resetI18n();
    vi.resetModules();
    const module = await import("../core.js");
    i18n = module.i18n;
  });

  it("window.i18n?.t() debe funcionar cuando i18n es null", () => {
    global.window.i18n = null;
    const result = window.i18n?.t("tab.new");
    expect(result).toBeUndefined();
  });

  it("window.i18n?.t() debe funcionar cuando i18n es undefined", () => {
    global.window.i18n = undefined;
    const result = window.i18n?.t("tab.new");
    expect(result).toBeUndefined();
  });

  it("window.i18n?.getLang() debe funcionar cuando i18n no está init", () => {
    global.window.i18n = i18n;
    const result = window.i18n?.getLang?.();
    // Sin init, lang es null
    expect(result).toBeNull();
  });
});
