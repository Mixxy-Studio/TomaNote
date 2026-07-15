import { describe, it, expect, beforeEach, vi } from "vitest";
import { FloatingNavPosition } from "../floatingNavPosition.js";

const originalGetById = document.getElementById.bind(document);

describe("FloatingNavPosition", () => {
  let positionHandler;
  let mockNavElement;
  let mockDocumentElement;

  beforeEach(() => {
    vi.clearAllMocks();

    mockNavElement = {
      style: {
        setProperty: vi.fn(),
      },
    };

    mockDocumentElement = {
      style: {
        setProperty: vi.fn(),
      },
    };

    Object.defineProperty(document, "documentElement", {
      value: mockDocumentElement,
      writable: true,
    });

    document.getElementById = vi.fn().mockReturnValue(mockNavElement);
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });

    localStorage.clear();
  });

  describe("init", () => {
    it("must initialize correctly and return this", () => {
      window.visualViewport = undefined;

      positionHandler = new FloatingNavPosition();
      const result = positionHandler.init();

      expect(result).toBe(positionHandler);
      expect(document.getElementById).toHaveBeenCalledWith("floating-nav");
    });

    it("must return this if the nav does not exist", () => {
      document.getElementById = vi.fn().mockReturnValue(null);

      positionHandler = new FloatingNavPosition();
      const result = positionHandler.init();

      expect(result).toBe(positionHandler);
    });
  });

  describe("updatePosition - Keyboard detection", () => {
    it("should ignore sudden viewport changes (>100px)", () => {
      window.visualViewport = {
        height: 400,
        offsetTop: 0,
      };
      window.innerHeight = 800;

      positionHandler = new FloatingNavPosition();
      positionHandler.navElement = mockNavElement;
      positionHandler.previousViewportHeight = 600;

      positionHandler.updatePosition();

      expect(mockDocumentElement.style.setProperty).not.toHaveBeenCalled();
    });

    it("It must process normal viewport changes (<100px)", () => {
      window.visualViewport = {
        height: 700,
        offsetTop: 0,
      };
      window.innerHeight = 800;

      positionHandler = new FloatingNavPosition();
      positionHandler.navElement = mockNavElement;
      positionHandler.previousViewportHeight = 650;

      positionHandler.updatePosition();

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalled();
    });
  });

  describe("updatePosition - PWA detection", () => {
    it("Must be use safe-area in standalone mode", () => {
      window.visualViewport = {
        height: 600,
        offsetTop: 0,
        addEventListener: vi.fn(),
      };
      window.matchMedia = vi.fn().mockReturnValue({ matches: true });

      positionHandler = new FloatingNavPosition();
      positionHandler.navElement = mockNavElement;
      positionHandler.init();

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith("--nav-bottom", "max(20px, env(safe-area-inset-bottom, 20px))");
    });
  });

  describe("setupEventListeners", () => {
    it("Need to add event listeners correctly.", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");
      window.visualViewport = undefined;

      positionHandler = new FloatingNavPosition();
      positionHandler.navElement = mockNavElement;
      positionHandler.setupEventListeners();

      expect(addEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith("orientationchange", expect.any(Function));
    });

    it("You should add the visualViewport listener if it's available.", () => {
      const mockVisualViewport = {
        addEventListener: vi.fn(),
      };
      window.visualViewport = mockVisualViewport;

      positionHandler = new FloatingNavPosition();
      positionHandler.setupEventListeners();

      expect(mockVisualViewport.addEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
    });
  });

  describe("getContentHeight", () => {
    const mockBottomBar = { offsetHeight: 66 };
    const mockTabLabel = { offsetHeight: 44 };

    beforeEach(() => {
      window.visualViewport = { height: 844 };
      window.matchMedia = vi.fn().mockReturnValue({ matches: false });
      localStorage.clear();
    });

    it("should set --content-height on mobile", () => {
      window.matchMedia = vi.fn((q) => ({ matches: q === "(max-width: 767px)" }));

      document.getElementById = originalGetById;
      vi.spyOn(document, "getElementById").mockImplementation((id) => {
        if (id === "bottom-bar") return mockBottomBar;
        if (id === "floating-nav") return mockNavElement;
        return originalGetById(id);
      });
      vi.spyOn(document, "querySelector").mockImplementation((sel) => {
        if (sel === ".tab-list__item label") return mockTabLabel;
        return null;
      });

      positionHandler = new FloatingNavPosition();
      positionHandler.getContentHeight();

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith("--content-height", "724px");
    });

    it("should NOT set --content-height on desktop", () => {
      window.matchMedia = vi.fn().mockReturnValue({ matches: false });

      positionHandler = new FloatingNavPosition();
      positionHandler.getContentHeight();

      expect(mockDocumentElement.style.setProperty).not.toHaveBeenCalledWith("--content-height", expect.anything());
    });

    it("should use cached value when viewport matches", () => {
      localStorage.setItem("contentHeightCache", JSON.stringify({ height: 500, viewportHeight: 844 }));

      window.matchMedia = vi.fn((q) => ({ matches: q === "(max-width: 767px)" }));
      window.visualViewport = { height: 844 };

      positionHandler = new FloatingNavPosition();
      positionHandler.getContentHeight();

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith("--content-height", "500px");
    });

    it("should recalculate when viewport changes", () => {
      localStorage.setItem("contentHeightCache", JSON.stringify({ height: 500, viewportHeight: 844 }));

      window.matchMedia = vi.fn((q) => ({ matches: q === "(max-width: 767px)" }));
      window.visualViewport = { height: 600 };

      document.getElementById = originalGetById;
      vi.spyOn(document, "getElementById").mockImplementation((id) => {
        if (id === "bottom-bar") return mockBottomBar;
        if (id === "floating-nav") return mockNavElement;
        return originalGetById(id);
      });
      vi.spyOn(document, "querySelector").mockImplementation((sel) => {
        if (sel === ".tab-list__item label") return mockTabLabel;
        return null;
      });

      positionHandler = new FloatingNavPosition();
      positionHandler.getContentHeight();

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith("--content-height", "480px");
    });

    it("should fallback to 44px when no tab labels exist", () => {
      window.matchMedia = vi.fn((q) => ({ matches: q === "(max-width: 767px)" }));

      document.getElementById = originalGetById;
      vi.spyOn(document, "getElementById").mockImplementation((id) => {
        if (id === "bottom-bar") return mockBottomBar;
        if (id === "floating-nav") return mockNavElement;
        return originalGetById(id);
      });
      vi.spyOn(document, "querySelector").mockReturnValue(null);

      positionHandler = new FloatingNavPosition();
      positionHandler.getContentHeight();

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith("--content-height", "724px");
    });
  });
});
