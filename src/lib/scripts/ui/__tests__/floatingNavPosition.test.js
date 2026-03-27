import { describe, it, expect, beforeEach, vi } from "vitest";
import { FloatingNavPosition } from "../floatingNavPosition.js";

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
  });

  describe("init", () => {
    it("debe inicializar correctamente y retornar this", () => {
      window.visualViewport = undefined;

      positionHandler = new FloatingNavPosition();
      const result = positionHandler.init();

      expect(result).toBe(positionHandler);
      expect(document.getElementById).toHaveBeenCalledWith("floating-nav");
    });

    it("debe retornar this si el nav no existe", () => {
      document.getElementById = vi.fn().mockReturnValue(null);

      positionHandler = new FloatingNavPosition();
      const result = positionHandler.init();

      expect(result).toBe(positionHandler);
    });
  });

  describe("updatePosition - Detección de teclado", () => {
    it("debe ignorar cambio brusco de viewport (>100px)", () => {
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

    it("debe procesar cambio normal de viewport (<100px)", () => {
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
    it("debe usar safe-area en modo standalone", () => {
      window.visualViewport = {
        height: 600,
        offsetTop: 0,
        addEventListener: vi.fn(),
      };
      window.matchMedia = vi.fn().mockReturnValue({ matches: true });

      positionHandler = new FloatingNavPosition();
      positionHandler.navElement = mockNavElement;
      positionHandler.init();

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        "--nav-bottom",
        "max(20px, env(safe-area-inset-bottom, 20px))"
      );
    });
  });

  describe("setupEventListeners", () => {
    it("debe agregar event listeners correctamente", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");
      window.visualViewport = undefined;

      positionHandler = new FloatingNavPosition();
      positionHandler.navElement = mockNavElement;
      positionHandler.setupEventListeners();

      expect(addEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith("orientationchange", expect.any(Function));
    });

    it("debe agregar visualViewport listener si está disponible", () => {
      const mockVisualViewport = {
        addEventListener: vi.fn(),
      };
      window.visualViewport = mockVisualViewport;

      positionHandler = new FloatingNavPosition();
      positionHandler.setupEventListeners();

      expect(mockVisualViewport.addEventListener).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });
  });
});