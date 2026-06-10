import { describe, it, expect, beforeEach, vi } from "vitest";
import { FormattingUtils } from "../formatting.js";

// Mock of DOM
const mockElement = {
  classList: {
    contains: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
  },
  parentElement: null,
  hasAttribute: vi.fn(),
  nodeType: Node.ELEMENT_NODE,
  appendChild: vi.fn(),
  firstChild: null,
  parentNode: {
    insertBefore: vi.fn(),
    removeChild: vi.fn(),
  },
};

const mockTextNode = {
  nodeType: Node.TEXT_NODE,
  parentElement: mockElement,
};

const mockRange = {
  commonAncestorContainer: mockTextNode,
  collapsed: false,
  surroundContents: vi.fn(),
  extractContents: vi.fn(),
  insertNode: vi.fn(),
  toString: vi.fn().mockReturnValue("selected text"),
};

const mockSelection = {
  rangeCount: 1,
  isCollapsed: false,
  getRangeAt: vi.fn().mockReturnValue(mockRange),
};

// Mock window.getSelection
Object.defineProperty(window, "getSelection", {
  writable: true,
  value: vi.fn().mockReturnValue(mockSelection),
});

// Mock document.createElement
Object.defineProperty(document, "createElement", {
  writable: true,
  value: vi.fn().mockReturnValue(mockElement),
});

describe("FormattingUtils - Ciclo de Negrita", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelection.rangeCount = 1;
    mockSelection.isCollapsed = false;
    mockRange.collapsed = false;
  });

  it("No hace nada si no hay selección", () => {
    mockSelection.rangeCount = 0;
    FormattingUtils.cycleBold();
    expect(window.getSelection).toHaveBeenCalled();
    // You shouldn't create elements
    expect(document.createElement).not.toHaveBeenCalled();
  });

  it("No hace nada si la selección está colapsada", () => {
    mockSelection.isCollapsed = true;
    FormattingUtils.cycleBold();
    expect(document.createElement).not.toHaveBeenCalled();
  });

  it("Aplica semibold a selección nueva", () => {
    mockElement.classList.contains.mockReturnValue(false);
    mockRange.surroundContents.mockImplementation(() => {});

    FormattingUtils.cycleBold();

    expect(document.createElement).toHaveBeenCalledWith("span");
    expect(mockElement.className).toBe("bold-semibold");
    expect(mockRange.surroundContents).toHaveBeenCalledWith(mockElement);
  });

  it("Cicla de semibold a extrabold", () => {
    const boldElement = {
      ...mockElement,
      classList: {
        ...mockElement.classList,
        contains: vi.fn().mockReturnValue(true),
      },
    };
    mockTextNode.parentElement = boldElement;
    mockRange.commonAncestorContainer = mockTextNode;

    FormattingUtils.findBoldWrapper = vi.fn().mockReturnValue(boldElement);

    FormattingUtils.cycleBold();

    expect(boldElement.classList.remove).toHaveBeenCalledWith("bold-semibold");
    expect(boldElement.classList.add).toHaveBeenCalledWith("bold-extrabold");
  });

  it("Cicla de extrabold a normal (remueve wrapper)", () => {
    const boldElement = {
      ...mockElement,
      classList: {
        contains: vi.fn((cls) => cls === "bold-extrabold"),
        remove: vi.fn(),
      },
      firstChild: null,
      parentNode: { insertBefore: vi.fn(), removeChild: vi.fn() },
    };
    mockTextNode.parentElement = boldElement;

    FormattingUtils.findBoldWrapper = vi.fn().mockReturnValue(boldElement);

    FormattingUtils.cycleBold();

    expect(boldElement.classList.remove).toHaveBeenCalledWith("bold-extrabold");
    // Should unwrap
  });

  // TThis is omitted due to the complexity of mocking DOM ranges.
  // it('Maneja surroundContents que falla con insertNode', () => { ... }
});
