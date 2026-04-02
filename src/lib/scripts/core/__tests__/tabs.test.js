import { describe, it, expect, beforeEach, vi } from "vitest";
import { TabManager } from "../tabs.js";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock window.i18n for deterministic tests
const i18nMock = {
  t: vi.fn((key) => {
    const translations = {
      "tab.new": "New",
      "tab.delete-confirm": "Delete this tab?",
    };
    return translations[key] ?? key;
  }),
  getLang: vi.fn(() => "en"),
  has: vi.fn((key) => ["tab.new", "tab.delete-confirm"].includes(key)),
  initialized: true,
};
global.window = { i18n: i18nMock };

// Mock DOM elements
const mockTabList = {
  insertBefore: vi.fn(),
  querySelectorAll: vi.fn(() => []),
};
const mockCreateTabButton = {};

describe("TabManager - Lógica Básica", () => {
  let tabManager;
  let dispatchEventSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    dispatchEventSpy = vi.spyOn(document, "dispatchEvent");

    // Reset i18n mock
    i18nMock.t.mockClear();
    i18nMock.t.mockImplementation((key) => {
      const translations = {
        "tab.new": "New",
        "tab.delete-confirm": "Delete this tab?",
      };
      return translations[key] ?? key;
    });

    tabManager = new TabManager({
      enablePersistence: true,
      enableCreation: true,
      enableAutoSave: true,
      debug: false,
    });
    // Mock DOM elements and methods to avoid DOM manipulation
    tabManager.tabList = mockTabList;
    tabManager.createTabButton = mockCreateTabButton;
    tabManager.createTabElement = vi.fn(() => {
      const div = document.createElement("div");
      const input = document.createElement("input");
      input.type = "radio";
      div.appendChild(input);
      const contentDiv = document.createElement("div");
      contentDiv.className = "tab-list__item--content";
      div.appendChild(contentDiv);
      return div;
    });
  });

  it("Crear una pestaña con datos por defecto", () => {
    const tab = tabManager.createTab();
    expect(tab.name).toBe("New");
    expect(tab.content).toBe("");
    expect(tab.id).toMatch(/^body-tab-\d+$/);
  });

  it("Agregar pestañas al array interno", () => {
    tabManager.tabsData.push({
      id: "1",
      name: "Nota 1",
      content: "",
      isPinned: false,
      emoji: null,
    });
    tabManager.tabsData.push({
      id: "2",
      name: "Nota 2",
      content: "",
      isPinned: false,
      emoji: null,
    });
    expect(tabManager.getTabs()).toHaveLength(2);
  });

  it("Encontrar pestaña por ID", () => {
    const tab = {
      id: "test",
      name: "Test",
      content: "",
      isPinned: false,
      emoji: null,
    };
    tabManager.tabsData.push(tab);
    expect(tabManager.findTabById("test")).toEqual(tab);
  });
});

describe("TabManager - Eventos tabsChanged", () => {
  let tabManager;

  beforeEach(() => {
    vi.clearAllMocks();

    tabManager = new TabManager({
      enablePersistence: false,
      enableCreation: true,
      enableAutoSave: false,
      debug: false,
    });

    tabManager.tabList = mockTabList;
    tabManager.createTabButton = mockCreateTabButton;
    tabManager.createTabElement = vi.fn(() => {
      const div = document.createElement("div");
      const input = document.createElement("input");
      input.type = "radio";
      input.id = "body-tab-test";
      div.appendChild(input);
      const contentDiv = document.createElement("div");
      contentDiv.className = "tab-list__item--content";
      div.appendChild(contentDiv);
      return div;
    });
  });

  it("createTab should dispatch tabsChanged event", () => {
    const dispatchSpy = vi.spyOn(document, "dispatchEvent");

    tabManager.createTab("Test Tab");

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "tabsChanged",
      })
    );
  });

  it("deleteTabElement should delegate to deletionHandler", async () => {
    const deleteTabElementSpy = vi.spyOn(tabManager.deletionHandler, "deleteTabElement");

    const mockTabElement = { foo: "bar" };

    await tabManager.deleteTabElement(mockTabElement);

    expect(deleteTabElementSpy).toHaveBeenCalledWith(mockTabElement);
  });
});
