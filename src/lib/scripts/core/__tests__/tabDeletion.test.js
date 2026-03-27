import { describe, it, expect, beforeEach, vi } from "vitest";
import { TabDeletionHandler } from "../tabDeletion.js";

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

const i18nMock = {
  t: vi.fn((key) => {
    const translations = {
      "tab.delete-confirm": "Delete this tab?",
    };
    return translations[key] ?? key;
  }),
  getLang: vi.fn(() => "en"),
  has: vi.fn((key) => key === "tab.delete-confirm"),
  initialized: true,
};
global.window = { i18n: i18nMock };

describe("TabDeletionHandler", () => {
  let handler;
  let mockTabManager;
  let mockTabElement;

  beforeEach(() => {
    vi.clearAllMocks();

    mockTabManager = {
      tabsData: [
        { id: "body-tab-1", name: "Tab 1", content: "", isPinned: false, emoji: null },
        { id: "body-tab-2", name: "Tab 2", content: "", isPinned: false, emoji: null },
      ],
      updateTabIds: vi.fn(),
      saveTabs: vi.fn(),
    };

    handler = new TabDeletionHandler(mockTabManager);

    mockTabElement = {
      querySelector: vi.fn((selector) => {
        if (selector === "input") return { id: "body-tab-1" };
        return null;
      }),
      remove: vi.fn(),
    };

    document.dispatchEvent = vi.fn();
  });

  describe("deleteTabElement", () => {
    it("debe retornar temprano si tabElement es null", async () => {
      await handler.deleteTabElement(null);
      expect(mockTabElement.remove).not.toHaveBeenCalled();
    });

    it("debe usar el modal de confirmación cuando está disponible", async () => {
      const mockModal = {
        open: vi.fn().mockResolvedValue({ confirmed: true, tabElement: mockTabElement }),
      };
      window.closeTabConfirmationModal = mockModal;

      await handler.deleteTabElement(mockTabElement);

      expect(mockModal.open).toHaveBeenCalledWith(mockTabElement);
      expect(mockTabElement.remove).toHaveBeenCalled();
      expect(mockTabManager.tabsData).toHaveLength(1);
      expect(mockTabManager.tabsData.find(t => t.id === "body-tab-1")).toBeUndefined();
    });

    it("no debe eliminar si el usuario cancela en el modal", async () => {
      const mockModal = {
        open: vi.fn().mockResolvedValue({ confirmed: false, tabElement: null }),
      };
      window.closeTabConfirmationModal = mockModal;

      await handler.deleteTabElement(mockTabElement);

      expect(mockModal.open).toHaveBeenCalledWith(mockTabElement);
      expect(mockTabElement.remove).not.toHaveBeenCalled();
      expect(mockTabManager.tabsData).toHaveLength(2);
    });

    it("debe usar fallback a confirm() si el modal no está disponible", async () => {
      window.closeTabConfirmationModal = null;
      global.confirm = vi.fn().mockReturnValue(true);

      await handler.deleteTabElement(mockTabElement);

      expect(confirm).toHaveBeenCalledWith("Delete this tab?");
      expect(mockTabElement.remove).toHaveBeenCalled();
    });

    it("no debe eliminar si el fallback confirm() retorna false", async () => {
      window.closeTabConfirmationModal = null;
      global.confirm = vi.fn().mockReturnValue(false);

      await handler.deleteTabElement(mockTabElement);

      expect(confirm).toHaveBeenCalledWith("Delete this tab?");
      expect(mockTabElement.remove).not.toHaveBeenCalled();
    });
  });

  describe("executeDeletion", () => {
    it("debe remover el elemento del DOM y actualizar datos", () => {
      handler.executeDeletion(mockTabElement);

      expect(mockTabElement.remove).toHaveBeenCalled();
      expect(mockTabManager.tabsData).toHaveLength(1);
      expect(mockTabManager.tabsData.find(t => t.id === "body-tab-1")).toBeUndefined();
    });

    it("debe llamar a updateTabIds y saveTabs", () => {
      handler.executeDeletion(mockTabElement);

      expect(mockTabManager.updateTabIds).toHaveBeenCalled();
      expect(mockTabManager.saveTabs).toHaveBeenCalled();
    });

    it("debe dispatchear evento tabsChanged", () => {
      handler.executeDeletion(mockTabElement);

      expect(document.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({ type: "tabsChanged" })
      );
    });
  });
});