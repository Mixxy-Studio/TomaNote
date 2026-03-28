import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FloatingMenu } from "../floatingMenu.js";
import { getRandomPinEmoji, detectEmojiInText } from "../../utils/emojiDetector.js";

vi.mock("../../utils/emojiDetector.js", () => ({
  getRandomPinEmoji: vi.fn(),
  detectEmojiInText: vi.fn(),
}));

describe("FloatingMenu", () => {
  let floatingMenu;
  let mockFloatingMenu;
  let mockTabList;
  let mockToolsButton;

  beforeEach(() => {
    mockToolsButton = {
      classList: { add: vi.fn(), remove: vi.fn() },
      style: {},
    };

    mockFloatingMenu = {
      addEventListener: vi.fn(),
      querySelectorAll: vi.fn().mockReturnValue([]),
    };

    mockTabList = {
      addEventListener: vi.fn(),
      querySelector: vi.fn(),
    };

    global.document = {
      querySelector: vi.fn().mockImplementation((selector) => {
        if (selector === ".tn-navbar") return mockFloatingMenu;
        if (selector === ".tab-list") return mockTabList;
        return null;
      }),
      getElementById: vi.fn().mockReturnValue(mockToolsButton),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      createElement: vi.fn((tag) => ({
        tagName: tag.toUpperCase(),
        dataset: {},
        style: {},
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
          contains: vi.fn(),
        },
        appendChild: vi.fn(),
        remove: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        querySelector: vi.fn(),
        querySelectorAll: vi.fn().mockReturnValue([]),
        closest: vi.fn(),
        focus: vi.fn(),
        scrollIntoView: vi.fn(),
        getBoundingClientRect: vi.fn().mockReturnValue({ width: 100, height: 50, left: 0, top: 0 }),
        setAttribute: vi.fn(),
        getAttribute: vi.fn(),
        removeAttribute: vi.fn(),
        className: "",
      })),
    };

    global.CustomEvent = class CustomEvent {
      constructor(type, options) {
        this.type = type;
        this.detail = options?.detail;
      }
    };

    floatingMenu = new FloatingMenu({ debug: false });
    floatingMenu.floatingMenu = mockFloatingMenu;
    floatingMenu.tabList = mockTabList;
    floatingMenu.toolsButton = mockToolsButton;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("updateButtonStates", () => {
    it("The toolsButton should be displayed when a tab is active.", () => {
      mockTabList.querySelector = vi.fn().mockReturnValue({
        closest: vi.fn().mockReturnValue({}),
      });

      floatingMenu.updateButtonStates();

      expect(mockToolsButton.classList.remove).toHaveBeenCalledWith("tn-tools-hidden");
      expect(mockToolsButton.style.display).toBe("");
    });

    it("You should hide the toolsButton when there is no active tab.", () => {
      mockTabList.querySelector = vi.fn().mockReturnValue(null);

      floatingMenu.updateButtonStates();

      expect(mockToolsButton.classList.add).toHaveBeenCalledWith("tn-tools-hidden");
      expect(mockToolsButton.style.display).toBe("none");
    });

    it("should disable tab action buttons when there is no active tab", () => {
      const mockBtn = {
        classList: { add: vi.fn(), remove: vi.fn() },
        setAttribute: vi.fn(),
        removeAttribute: vi.fn(),
      };

      mockFloatingMenu.querySelectorAll = vi.fn().mockReturnValue([mockBtn]);
      mockTabList.querySelector = vi.fn().mockReturnValue(null);

      floatingMenu.updateButtonStates();

      expect(mockBtn.classList.add).toHaveBeenCalledWith("disabled");
      expect(mockBtn.setAttribute).toHaveBeenCalledWith("disabled", "true");
    });

    it("must be enable tab action buttons when a tab is active", () => {
      const mockBtn = {
        classList: { add: vi.fn(), remove: vi.fn() },
        setAttribute: vi.fn(),
        removeAttribute: vi.fn(),
      };

      mockFloatingMenu.querySelectorAll = vi.fn().mockReturnValue([mockBtn]);
      mockTabList.querySelector = vi.fn().mockReturnValue({
        closest: vi.fn().mockReturnValue({}),
      });

      floatingMenu.updateButtonStates();

      expect(mockBtn.classList.remove).toHaveBeenCalledWith("disabled");
      expect(mockBtn.removeAttribute).toHaveBeenCalledWith("disabled");
    });
  });

  describe("getActiveTab", () => {
    it("must return null if there is no tabList", () => {
      floatingMenu.tabList = null;
      expect(floatingMenu.getActiveTab()).toBeNull();
    });

    it("should return null if no radio is selected", () => {
      mockTabList.querySelector = vi.fn().mockReturnValue(null);
      expect(floatingMenu.getActiveTab()).toBeNull();
    });
  });

  describe("setupTabChangeListener", () => {
    it("You need to add a listener for tab switching.", () => {
      floatingMenu.setupTabChangeListener();

      expect(mockTabList.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
    });

    it("Need to add a listener for the tabsChanged event", () => {
      floatingMenu.setupTabChangeListener();

      expect(global.document.addEventListener).toHaveBeenCalledWith("tabsChanged", expect.any(Function));
    });
  });

  describe("handleDeleteTab", () => {
    it("You must call deleteTabElement from tabManager", () => {
      const mockTabElement = {};

      global.window = {
        tabManager: {
          deleteTabElement: vi.fn(),
        },
      };

      floatingMenu.handleDeleteTab(mockTabElement);

      expect(global.window.tabManager.deleteTabElement).toHaveBeenCalledWith(mockTabElement);
    });

    it("should not be call deleteTabElement if tabManager is unavailable", () => {
      const mockTabElement = {};

      global.window = {};

      floatingMenu.handleDeleteTab(mockTabElement);
    });
  });

  describe("handlePinTab", () => {
    it("debe agregar clase pinned a la pestaña", () => {
      const mockLabel = { setAttribute: vi.fn() };
      const mockLabelSpan = { dataset: {}, textContent: "Test", setAttribute: vi.fn() };
      const mockTabElement = {
        classList: { contains: vi.fn().mockReturnValue(false), add: vi.fn() },
        querySelector: vi.fn().mockImplementation((selector) => {
          if (selector === "label") return mockLabel;
          if (selector === "label span") return mockLabelSpan;
          return null;
        }),
      };

      global.window = {
        tabManager: {
          reorderTabs: vi.fn(),
          saveTabs: vi.fn(),
        },
      };

      floatingMenu.handlePinTab(mockTabElement);

      expect(mockTabElement.classList.add).toHaveBeenCalledWith("pinned");
    });

    it("Must be remove the pinned class from the tab if it is already pinned.", () => {
      const mockLabel = { removeAttribute: vi.fn() };
      const mockLabelSpan = { dataset: { emoji: "📝" }, removeAttribute: vi.fn() };
      const mockTabElement = {
        classList: { contains: vi.fn().mockReturnValue(true), remove: vi.fn() },
        querySelector: vi.fn().mockImplementation((selector) => {
          if (selector === "label") return mockLabel;
          if (selector === "label span") return mockLabelSpan;
          return null;
        }),
      };

      global.window = {
        tabManager: {
          reorderTabs: vi.fn(),
          saveTabs: vi.fn(),
        },
      };

      floatingMenu.handlePinTab(mockTabElement);

      expect(mockTabElement.classList.remove).toHaveBeenCalledWith("pinned");
    });

    it("Must be use a custom emoji if one exists in the tab name", () => {
      const mockLabel = { setAttribute: vi.fn() };
      const mockLabelSpan = { dataset: {}, textContent: "⭐ Mi nota", setAttribute: vi.fn() };
      const mockTabElement = {
        classList: { contains: vi.fn().mockReturnValue(false), add: vi.fn() },
        querySelector: vi.fn().mockImplementation((selector) => {
          if (selector === "label") return mockLabel;
          if (selector === "label span") return mockLabelSpan;
          return null;
        }),
      };

      global.window = {
        tabManager: {
          reorderTabs: vi.fn(),
          saveTabs: vi.fn(),
        },
      };

      detectEmojiInText.mockReturnValue("⭐");

      floatingMenu.handlePinTab(mockTabElement);

      expect(detectEmojiInText).toHaveBeenCalledWith("⭐ Mi nota");
      expect(mockLabel.setAttribute).toHaveBeenCalledWith("data-emoji", "⭐");
      expect(mockLabelSpan.setAttribute).toHaveBeenCalledWith("data-emoji", "⭐");
    });

    it("Should use random emoji if there is no emoji in the tab name", () => {
      const mockLabel = { setAttribute: vi.fn() };
      const mockLabelSpan = { dataset: {}, textContent: "Mi nota", setAttribute: vi.fn() };
      const mockTabElement = {
        classList: { contains: vi.fn().mockReturnValue(false), add: vi.fn() },
        querySelector: vi.fn().mockImplementation((selector) => {
          if (selector === "label") return mockLabel;
          if (selector === "label span") return mockLabelSpan;
          return null;
        }),
      };

      global.window = {
        tabManager: {
          reorderTabs: vi.fn(),
          saveTabs: vi.fn(),
        },
      };

      detectEmojiInText.mockReturnValue(null);
      getRandomPinEmoji.mockReturnValue("🔴");

      floatingMenu.handlePinTab(mockTabElement);

      expect(detectEmojiInText).toHaveBeenCalledWith("Mi nota");
      expect(getRandomPinEmoji).toHaveBeenCalled();
      expect(mockLabel.setAttribute).toHaveBeenCalledWith("data-emoji", "🔴");
      expect(mockLabelSpan.setAttribute).toHaveBeenCalledWith("data-emoji", "🔴");
    });
  });

  describe("setupButtonHandlers", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("Need to add a click listener to the floatingMenu", () => {
      floatingMenu.setupButtonHandlers();

      expect(mockFloatingMenu.addEventListener).toHaveBeenCalledWith("click", expect.any(Function));
    });

    it("Need to add a mousedown listener to the floatingMenu", () => {
      floatingMenu.setupButtonHandlers();

      expect(mockFloatingMenu.addEventListener).toHaveBeenCalledWith("mousedown", expect.any(Function));
    });
  });

  describe("handleEditNameTab", () => {
    it("Must be call startEditingTabName from the tabManager", () => {
      const mockEditButton = {};
      const mockTabElement = {
        querySelector: vi.fn().mockReturnValue(mockEditButton),
      };

      global.window = {
        tabManager: {
          startEditingTabName: vi.fn(),
        },
      };

      floatingMenu.handleEditNameTab(mockTabElement);

      expect(global.window.tabManager.startEditingTabName).toHaveBeenCalledWith(mockEditButton);
    });

    it("Should not call startEditingTabName if tabManager is unavailable", () => {
      const mockTabElement = {
        querySelector: vi.fn().mockReturnValue({}),
      };

      global.window = {};

      floatingMenu.handleEditNameTab(mockTabElement);
    });

    it("Should not call startEditingTabName if the edit button does not exist.", () => {
      const mockTabElement = {
        querySelector: vi.fn().mockReturnValue(null),
      };

      global.window = {
        tabManager: {
          startEditingTabName: vi.fn(),
        },
      };

      floatingMenu.handleEditNameTab(mockTabElement);

      expect(global.window.tabManager.startEditingTabName).not.toHaveBeenCalled();
    });
  });
});
