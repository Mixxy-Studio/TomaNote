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

// Mock DOM elements
const mockTabList = {
  insertBefore: vi.fn(),
  querySelectorAll: vi.fn(() => []),
};
const mockCreateTabButton = {};

describe("TabManager - Lógica Básica", () => {
  let tabManager;

  beforeEach(() => {
    vi.clearAllMocks();
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
    expect(tab.name).toBe("Nuevo");
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
