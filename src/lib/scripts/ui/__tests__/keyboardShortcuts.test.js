import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { KeyboardShortcuts } from "../keyboardShortcuts.js";

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

    global.window = {
      tabManager: {
        saveTabs: vi.fn(),
      },
    };

    keyboardShortcuts = new KeyboardShortcuts({ debug: false });
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
  });

  describe("setupEscapeKeyHandler", () => {
    it("Need to add a keydown listener", async () => {
      await keyboardShortcuts.init();

      expect(addEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    });

    it("Should ignore ESC if the settings modal is open", async () => {
      await keyboardShortcuts.init();

      const call = addEventListenerSpy.mock.calls.find((call) => call[0] === "keydown");
      const keydownHandler = call[1];

      const mockModal = {
        hasAttribute: vi.fn().mockReturnValue(true),
      };
      const mockRadio = {
        checked: true,
      };

      getElementByIdSpy.mockReturnValue(mockModal);
      querySelectorSpy.mockReturnValue(mockRadio);

      keydownHandler({ key: "Escape" });

      expect(mockRadio.checked).toBe(true);
      expect(dispatchEventSpy).not.toHaveBeenCalled();
    });
  });
});
