import { describe, it, expect, beforeEach, vi } from "vitest";
import { CloseTabConfirmation } from "../closeTabConfirmation.js";

describe("CloseTabConfirmation", () => {
  let modal;
  let mockModal;
  let mockDeleteBtn;
  let mockCancelBtn;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDeleteBtn = {
      addEventListener: vi.fn(),
    };
    mockCancelBtn = {
      addEventListener: vi.fn(),
    };

    mockModal = {
      querySelector: vi.fn((selector) => {
        if (selector === '[data-action="delete"]') return mockDeleteBtn;
        if (selector === '[data-action="cancel"]') return mockCancelBtn;
        return null;
      }),
      addEventListener: vi.fn(),
      showModal: vi.fn(),
      close: vi.fn(),
    };

    modal = new CloseTabConfirmation();
    modal.modal = mockModal;
  });

  describe("init", () => {
    it("should return `this` if the modal does not exist", async () => {
      modal.modal = null;
      const result = await modal.init();
      expect(result).toBe(modal);
    });
  });

  describe("open", () => {
    it("You must save pendingTabElement and call showModal", () => {
      const mockTabElement = { id: "tab-1" };
      const promise = modal.open(mockTabElement);

      expect(modal.pendingTabElement).toBe(mockTabElement);
      expect(mockModal.showModal).toHaveBeenCalled();
      expect(promise).toBeInstanceOf(Promise);
    });
  });

  describe("handleConfirm", () => {
    it("You must close the modal, clear pendingTabElement, and resolve true", async () => {
      const mockTabElement = { id: "tab-1" };
      modal.pendingTabElement = mockTabElement;

      const promise = modal.open(mockTabElement);
      modal.handleConfirm();

      expect(mockModal.close).toHaveBeenCalled();
      expect(modal.pendingTabElement).toBeNull();

      const result = await promise;
      expect(result).toEqual({ confirmed: true, tabElement: mockTabElement });
    });
  });

  describe("handleCancel", () => {
    it("You must close the modal, clear pendingTabElement, and resolve false", async () => {
      const mockTabElement = { id: "tab-1" };
      modal.pendingTabElement = mockTabElement;

      const promise = modal.open(mockTabElement);
      modal.handleCancel();

      expect(mockModal.close).toHaveBeenCalled();
      expect(modal.pendingTabElement).toBeNull();

      const result = await promise;
      expect(result).toEqual({ confirmed: false, tabElement: null });
    });
  });
});
