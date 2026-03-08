import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TabDragDrop } from "../tabDragDrop.js";

vi.mock("sortablejs", () => ({
  default: vi.fn().mockImplementation(() => ({
    option: vi.fn(),
    destroy: vi.fn(),
  })),
}));

describe("TabDragDrop", () => {
  let tabDragDrop;
  let mockTabList;
  let dispatchEventSpy;
  let addEventListenerSpy;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, "addEventListener");
    dispatchEventSpy = vi.fn();
    
    global.CustomEvent = class CustomEvent {
      constructor(type, options) {
        this.type = type;
        this.detail = options?.detail;
      }
    };

    global.window = {
      tabManager: {
        saveTabs: vi.fn(),
      },
    };

    mockTabList = {
      style: {},
      querySelectorAll: vi.fn().mockReturnValue([]),
      querySelector: vi.fn().mockReturnValue(null),
      insertBefore: vi.fn(),
      appendChild: vi.fn(),
    };

    global.document = {
      querySelector: vi.fn().mockReturnValue(mockTabList),
      getElementById: vi.fn(),
      addEventListener: addEventListenerSpy,
      dispatchEvent: dispatchEventSpy,
    };

    tabDragDrop = new TabDragDrop({ debug: false });
    tabDragDrop.tabList = mockTabList;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("debe inicializar con opciones por defecto", () => {
      const tdd = new TabDragDrop();
      expect(tdd.options.debug).toBe(true);
    });

    it("debe fusionar opciones personalizadas", () => {
      const tdd = new TabDragDrop({ debug: false });
      expect(tdd.options.debug).toBe(false);
    });
  });

  describe("getSortableOptions", () => {
    it("debe retornar opciones de Sortable con callbacks", () => {
      const options = tabDragDrop.getSortableOptions();

      expect(options).toHaveProperty("animation");
      expect(options).toHaveProperty("ghostClass");
      expect(options).toHaveProperty("dragClass");
      expect(options).toHaveProperty("onStart");
      expect(options).toHaveProperty("onEnd");
    });
  });

  describe("handleDragStart", () => {
    it("debe agregar clase dragging al item", () => {
      const mockItem = {
        classList: { add: vi.fn() },
        querySelector: vi.fn().mockReturnValue(null),
      };

      tabDragDrop.handleDragStart({ item: mockItem });

      expect(mockItem.classList.add).toHaveBeenCalledWith("dragging");
    });

    it("debe agregar clase dragging-content al contenido", () => {
      const mockContent = { classList: { add: vi.fn() } };
      const mockItem = {
        classList: { add: vi.fn() },
        querySelector: vi.fn().mockReturnValue(mockContent),
      };

      tabDragDrop.handleDragStart({ item: mockItem });

      expect(mockContent.classList.add).toHaveBeenCalledWith("dragging-content");
    });
  });

  describe("handleDragEnd", () => {
    it("debe remover clase dragging del item", () => {
      const mockItem = {
        classList: { remove: vi.fn() },
        querySelector: vi.fn().mockReturnValue(null),
      };

      tabDragDrop.handleDragEnd({ item: mockItem });

      expect(mockItem.classList.remove).toHaveBeenCalledWith("dragging");
    });

    it("debe remover clase dragging-content del contenido", () => {
      const mockContent = { classList: { remove: vi.fn() } };
      const mockItem = {
        classList: { remove: vi.fn() },
        querySelector: vi.fn().mockReturnValue(mockContent),
      };

      tabDragDrop.handleDragEnd({ item: mockItem });

      expect(mockContent.classList.remove).toHaveBeenCalledWith("dragging-content");
    });

    it("debe llamar a saveTabs de tabManager", () => {
      const mockItem = {
        classList: { remove: vi.fn() },
        querySelector: vi.fn().mockReturnValue(null),
      };

      tabDragDrop.handleDragEnd({ item: mockItem });

      expect(global.window.tabManager.saveTabs).toHaveBeenCalled();
    });

    it("debe dispatchear evento tabsChanged al finalizar drag", () => {
      const mockItem = {
        classList: { remove: vi.fn() },
        querySelector: vi.fn().mockReturnValue(null),
      };

      tabDragDrop.handleDragEnd({ item: mockItem });

      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "tabsChanged",
        }),
      );
    });
  });

  describe("canPull", () => {
    it("debe permitir mover pestañas no fijadas", () => {
      const mockItem = { classList: { contains: vi.fn().mockReturnValue(false) } };
      const mockTo = { el: mockTabList };

      const result = tabDragDrop.canPull(mockTo, {}, mockItem);

      expect(result).toBe(true);
    });

    it("debe permitir mover pestañas no fijadas a pinned-tabs", () => {
      const mockItem = { classList: { contains: vi.fn().mockReturnValue(false) } };
      const mockTo = { el: { classList: { contains: vi.fn().mockReturnValue(true) } } };

      const result = tabDragDrop.canPull(mockTo, {}, mockItem);

      expect(result).toBe(false);
    });
  });
});
