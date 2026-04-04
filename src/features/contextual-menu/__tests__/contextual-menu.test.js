import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ContextMenu } from "../contextual-menu.js";

// Mockear dependencias
vi.mock("../../../lib/scripts/utils/emojiDetector.js", () => ({
  detectEmojiInText: vi.fn().mockReturnValue(false),
}));

describe("ContextMenu", () => {
  let contextMenu;
  let mockElement;
  let mockEvent;

  beforeEach(() => {
    // Mock DOM elements
    mockElement = {
      style: { display: "none" },
      classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn() },
      getBoundingClientRect: vi.fn().mockReturnValue({ top: 100, left: 100 }),
      querySelectorAll: vi.fn().mockReturnValue([]),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      focus: vi.fn(),
    };

    mockEvent = {
      preventDefault: vi.fn(),
      target: { tagName: "DIV", textContent: "test text" },
      clientX: 150,
      clientY: 150,
      button: 0,
    };

    // Mock document
    global.document = {
      querySelector: vi.fn().mockReturnValue(mockElement),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      getElementById: vi.fn().mockReturnValue(mockElement),
      execCommand: vi.fn(),
      createElement: vi.fn().mockReturnValue(mockElement),
      createTextNode: vi.fn().mockReturnValue({ nodeType: 3 }),
      body: { appendChild: vi.fn() },
      elementFromPoint: vi.fn().mockReturnValue(mockElement),
    };

    // Mock window
    global.window = {
      getComputedStyle: vi.fn().mockReturnValue({ position: "static" }),
      getSelection: vi.fn().mockReturnValue({
        toString: vi.fn().mockReturnValue("selected text"),
        isCollapsed: false,
        rangeCount: 1,
        getRangeAt: vi.fn().mockReturnValue({
          getBoundingClientRect: vi.fn().mockReturnValue({ top: 100, left: 100 }),
          cloneRange: vi.fn().mockReturnValue({}),
          deleteContents: vi.fn(),
          insertNode: vi.fn(),
          collapse: vi.fn(),
        }),
        removeAllRanges: vi.fn(),
        addRange: vi.fn(),
      }),
      innerWidth: 1920,
      innerHeight: 1080,
    };

    contextMenu = new ContextMenu({ debug: false });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with default options", () => {
      const menu = new ContextMenu();
      expect(menu.options.enableTextContext).toBe(true);
      expect(menu.options.enableTabContext).toBe(true);
    });

    it("should merge custom options", () => {
      const menu = new ContextMenu({ enableTextContext: false });
      expect(menu.options.enableTextContext).toBe(false);
      expect(menu.options.enableTabContext).toBe(true);
    });
  });

  describe("init", () => {
    it("should initialize correctly when element is found", async () => {
      await contextMenu.init();
      expect(contextMenu.contextMenu).toBe(mockElement);
    });

    it("should initialize immediately when element exists", async () => {
      await contextMenu.init();
      expect(contextMenu.contextMenu).toBe(mockElement);
    });
  });

  describe("showTextContextMenu", () => {
    beforeEach(async () => {
      await contextMenu.init();
    });

    it("should show menu for editable text", () => {
      const mockEditable = { focus: vi.fn() };
      contextMenu.showTextContextMenu(mockEvent, mockEditable);

      expect(contextMenu.activeEditableElement).toBe(mockEditable);
      expect(mockElement.style.display).toBe("block");
    });
  });

  describe("hideContextMenu", () => {
    beforeEach(async () => {
      await contextMenu.init();
    });

    it("should hide the menu", () => {
      contextMenu.hideContextMenu();

      expect(mockElement.style.display).toBe("none");
    });
  });

  describe("handleTextAction", () => {
    beforeEach(async () => {
      await contextMenu.init();
      contextMenu.activeEditableElement = { focus: vi.fn() };
    });

    it("should execute copy command", () => {
      contextMenu.handleTextAction("copy");

      expect(global.document.execCommand).toHaveBeenCalledWith("copy", false, null);
    });

    it("should execute paste command using clipboard and Selection API", async () => {
      global.navigator = {
        clipboard: { readText: vi.fn().mockResolvedValue("pasted text") },
      };
      contextMenu.activeEditableElement = { focus: vi.fn() };

      await contextMenu.handleTextAction("paste");

      expect(global.navigator.clipboard.readText).toHaveBeenCalled();

      const mockSelection = global.window.getSelection();
      expect(mockSelection.getRangeAt).toHaveBeenCalled();
      expect(mockSelection.getRangeAt(0).deleteContents).toHaveBeenCalled();
      expect(mockSelection.getRangeAt(0).insertNode).toHaveBeenCalled();
      expect(mockSelection.getRangeAt(0).collapse).toHaveBeenCalledWith(false);
      expect(mockSelection.removeAllRanges).toHaveBeenCalled();
      expect(mockSelection.addRange).toHaveBeenCalled();
    });
  });

  describe("setupContextMenu", () => {
    it("should add event listeners", async () => {
      await contextMenu.init();

      expect(global.document.addEventListener).toHaveBeenCalledWith("contextmenu", expect.any(Function));
      expect(global.document.addEventListener).toHaveBeenCalledWith("click", expect.any(Function));
    });
  });
});
