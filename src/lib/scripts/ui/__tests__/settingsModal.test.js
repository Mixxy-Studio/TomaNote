import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { SettingsModal } from "../settingsModal.js";

describe("SettingsModal", () => {
  let settingsModal;
  let mockModal;
  let mockNavItems;
  let mockTabs;
  let mockLangSelect;
  let mockForm;
  let mockWindowI18n;

  beforeEach(() => {
    vi.clearAllMocks();

    mockWindowI18n = {
      getLang: vi.fn().mockReturnValue("en"),
      setLang: vi.fn(),
    };

    global.window = {
      i18n: mockWindowI18n,
    };

    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    mockLangSelect = document.createElement("select");
    mockLangSelect.id = "lang-select";
    mockLangSelect.addEventListener = vi.fn();

    mockForm = document.createElement("form");
    mockForm.addEventListener = vi.fn();
    mockForm.close = vi.fn();

    mockNavItems = [
      {
        dataset: { tab: "about" },
        classList: { remove: vi.fn(), add: vi.fn() },
        addEventListener: vi.fn(),
      },
      {
        dataset: { tab: "appearance" },
        classList: { remove: vi.fn(), add: vi.fn() },
        addEventListener: vi.fn(),
      },
    ];

    mockTabs = [
      {
        id: "about-tab",
        classList: { remove: vi.fn(), add: vi.fn() },
      },
      {
        id: "appearance-tab",
        classList: { remove: vi.fn(), add: vi.fn() },
      },
    ];

    mockModal = {
      querySelectorAll: vi.fn((selector) => {
        if (selector === ".nav-item") return mockNavItems;
        if (selector === ".settings-tab") return mockTabs;
        return [];
      }),
      querySelector: vi.fn((selector) => {
        if (selector === "#about-tab") return mockTabs[0];
        if (selector === '[data-tab="about"]') return mockNavItems[0];
        if (selector === "form") return mockForm;
        return null;
      }),
      close: vi.fn(),
    };

    document.getElementById = vi.fn((id) => {
      if (id === "info-notepad") return mockModal;
      if (id === "lang-select") return mockLangSelect;
      return null;
    });
  });

  afterEach(() => {
    delete global.window;
  });

  describe("constructor", () => {
    it("should create an instance", () => {
      settingsModal = new SettingsModal();
      expect(settingsModal).toBeDefined();
    });

    it("should have default options with debug true", () => {
      settingsModal = new SettingsModal();
      expect(settingsModal.options.debug).toBe(true);
    });

    it("should merge custom options", () => {
      settingsModal = new SettingsModal({ debug: false });
      expect(settingsModal.options.debug).toBe(false);
    });

    it("should initialize properties to null", () => {
      settingsModal = new SettingsModal();
      expect(settingsModal.modal).toBeNull();
      expect(settingsModal.langSelect).toBeNull();
      expect(settingsModal.langForm).toBeNull();
    });
  });

  describe("init", () => {
    it("should initialize without errors when modal exists", async () => {
      settingsModal = new SettingsModal({ debug: false });
      const result = await settingsModal.init();
      expect(result).toBe(settingsModal);
      expect(settingsModal.modal).toBeDefined();
    });

    it("should setup tabs event listeners on init", async () => {
      settingsModal = new SettingsModal({ debug: false });
      await settingsModal.init();

      mockNavItems.forEach((item) => {
        expect(item.addEventListener).toHaveBeenCalledWith(
          "click",
          expect.any(Function),
        );
      });
    });

    it("should setup language selector when i18n is available", async () => {
      settingsModal = new SettingsModal({ debug: false });
      await settingsModal.init();

      expect(settingsModal.langSelect).toBeDefined();
      expect(mockWindowI18n.getLang).toHaveBeenCalled();
    });

    it("should setup form submit listener", async () => {
      settingsModal = new SettingsModal({ debug: false });
      await settingsModal.init();

      expect(mockForm.addEventListener).toHaveBeenCalledWith(
        "submit",
        expect.any(Function),
      );
    });
  });

  describe("setupTabs", () => {
    it("should add click listeners to nav items", async () => {
      settingsModal = new SettingsModal({ debug: false });
      await settingsModal.init();

      const clickHandler = mockNavItems[0].addEventListener.mock.calls[0][1];
      expect(typeof clickHandler).toBe("function");
    });
  });

  describe("switchTab", () => {
    it("should remove active class from all nav items", () => {
      settingsModal = new SettingsModal({ debug: false });
      settingsModal.modal = mockModal;
      settingsModal.switchTab("about", mockNavItems, mockTabs);

      expect(mockNavItems[0].classList.remove).toHaveBeenCalledWith("active");
      expect(mockNavItems[1].classList.remove).toHaveBeenCalledWith("active");
    });

    it("should remove active class from all tabs", () => {
      settingsModal = new SettingsModal({ debug: false });
      settingsModal.modal = mockModal;
      settingsModal.switchTab("about", mockNavItems, mockTabs);

      expect(mockTabs[0].classList.remove).toHaveBeenCalledWith("active");
      expect(mockTabs[1].classList.remove).toHaveBeenCalledWith("active");
    });

    it("should add active class to selected tab", () => {
      settingsModal = new SettingsModal({ debug: false });
      settingsModal.modal = mockModal;
      settingsModal.switchTab("about", mockNavItems, mockTabs);

      expect(mockTabs[0].classList.add).toHaveBeenCalledWith("active");
    });

    it("should add active class to selected nav item", () => {
      settingsModal = new SettingsModal({ debug: false });
      settingsModal.modal = mockModal;
      settingsModal.switchTab("about", mockNavItems, mockTabs);

      expect(mockNavItems[0].classList.add).toHaveBeenCalledWith("active");
    });
  });

  describe("setupLanguageSelector", () => {
    it("should call i18n.getLang on init", async () => {
      settingsModal = new SettingsModal({ debug: false });
      await settingsModal.init();

      expect(mockWindowI18n.getLang).toHaveBeenCalled();
    });

    it("should add change event listener to langSelect", async () => {
      settingsModal = new SettingsModal({ debug: false });
      await settingsModal.init();

      expect(mockLangSelect.addEventListener).toHaveBeenCalledWith(
        "change",
        expect.any(Function),
      );
    });

    it("should call i18n.setLang on change event", async () => {
      settingsModal = new SettingsModal({ debug: false });
      await settingsModal.init();

      const changeHandler = mockLangSelect.addEventListener.mock.calls.find(
        (call) => call[0] === "change",
      )[1];

      changeHandler({ target: { value: "es" } });

      expect(mockWindowI18n.setLang).toHaveBeenCalledWith("es");
    });
  });

  describe("form submit handler", () => {
    it("should prevent default form submission", async () => {
      settingsModal = new SettingsModal({ debug: false });
      await settingsModal.init();

      const submitHandler = mockForm.addEventListener.mock.calls.find(
        (call) => call[0] === "submit",
      )[1];

      const mockEvent = { preventDefault: vi.fn() };
      submitHandler(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it("should close modal on submit", async () => {
      settingsModal = new SettingsModal({ debug: false });
      await settingsModal.init();

      const submitHandler = mockForm.addEventListener.mock.calls.find(
        (call) => call[0] === "submit",
      )[1];

      const mockEvent = { preventDefault: vi.fn() };
      submitHandler(mockEvent);

      expect(mockModal.close).toHaveBeenCalled();
    });

    it("should call i18n.setLang on submit", async () => {
      settingsModal = new SettingsModal({ debug: false });
      await settingsModal.init();

      const submitHandler = mockForm.addEventListener.mock.calls.find(
        (call) => call[0] === "submit",
      )[1];

      const mockEvent = { preventDefault: vi.fn() };
      submitHandler(mockEvent);

      expect(mockWindowI18n.setLang).toHaveBeenCalled();
    });

    it("should save language to localStorage on submit", async () => {
      settingsModal = new SettingsModal({ debug: false });
      await settingsModal.init();

      const submitHandler = mockForm.addEventListener.mock.calls.find(
        (call) => call[0] === "submit",
      )[1];

      const mockEvent = { preventDefault: vi.fn() };
      submitHandler(mockEvent);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        "appLang",
        expect.any(String),
      );
    });
  });

  describe("window.i18n not available", () => {
    it("should handle missing i18n gracefully", async () => {
      delete global.window.i18n;

      settingsModal = new SettingsModal({ debug: false });
      await settingsModal.init();

      expect(settingsModal.langSelect).toBeDefined();
    });
  });
});
