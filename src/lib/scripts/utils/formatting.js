// src/lib/scripts/utils/formatting.js
// Utilidades para formateo de texto en contentEditable

export class FormattingUtils {
  /**
   * Aplica negrita cíclica: normal → semibold → extrabold → normal
   */
  static cycleBold() {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);

    // Buscar si ya hay un wrapper de negrita
    let wrapper = this.findBoldWrapper(range);

    if (wrapper) {
      // Ciclar el existente
      this.cycleExistingBold(wrapper);
    } else {
      // Crear nuevo wrapper
      this.applyNewBold(range);
    }
  }

  /**
   * Encuentra el wrapper de negrita más cercano en la selección
   */
  static findBoldWrapper(range) {
    let element = range.commonAncestorContainer;
    if (element.nodeType === Node.TEXT_NODE) element = element.parentElement;

    console.log('findBoldWrapper: starting from element:', element, 'tag:', element?.tagName, 'class:', element?.className);

    // Buscar hacia arriba hasta encontrar un wrapper o el contentEditable
    while (element && !element.hasAttribute("contenteditable")) {
      console.log('Checking element:', element, 'tag:', element.tagName, 'class:', element.className);
      if (
        element.classList.contains("bold-semibold") ||
        element.classList.contains("bold-extrabold")
      ) {
        console.log('Found wrapper:', element);
        return element;
      }
      element = element.parentElement;
    }
    console.log('No wrapper found');
    return null;
  }

  /**
   * Cicla un wrapper existente
   */
  static cycleExistingBold(wrapper) {
    console.log("cycleExistingBold called, wrapper class:", wrapper.className);
    if (wrapper.classList.contains("bold-semibold")) {
      console.log("Cycling semibold to extrabold");
      wrapper.classList.remove("bold-semibold");
      wrapper.classList.add("bold-extrabold");
    } else if (wrapper.classList.contains("bold-extrabold")) {
      console.log("Cycling extrabold to normal, unwrapping");
      wrapper.classList.remove("bold-extrabold");
      // Vuelve a normal removiendo el wrapper
      this.unwrapBold(wrapper);
    }
  }

  /**
   * Aplica negrita a una selección nueva
   */
  static applyNewBold(range) {
    const span = document.createElement("span");
    span.className = "bold-semibold";

    try {
      range.surroundContents(span);
    } catch (e) {
      // Si surroundContents falla (selección compleja), usar insertNode
      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
    }
  }

  /**
   * Remueve el wrapper de negrita, moviendo el contenido arriba
   */
  static unwrapBold(wrapper) {
    console.log(
      "unwrapBold called, wrapper:",
      wrapper,
      "firstChild:",
      wrapper.firstChild,
    );
    const parent = wrapper.parentNode;
    while (wrapper.firstChild) {
      parent.insertBefore(wrapper.firstChild, wrapper);
    }
    parent.removeChild(wrapper);
    console.log("unwrapBold completed");
  }
}
