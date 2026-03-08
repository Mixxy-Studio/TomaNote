// src/lib/scripts/core/tabs.js
// Sistema completo de gestión de pestañas con feature flags
import { FormattingUtils } from "../utils/formatting.js";

export class TabManager {
  constructor(options = {}) {
    // Configuración con valores por defecto
    this.options = {
      enablePersistence: true, // Restaurar desde localStorage
      enableCreation: true, // Crear nuevas pestañas
      enableEditing: true, // Editar nombres
      enableDeletion: true, // Eliminar pestañas
      enablePinning: false, // Fijar/desfijar (desactivado por ahora)
      enableContentEditing: true, // Editar contenido
      enableAutoSave: true, // Guardar automáticamente
      anchorSelector: "#tab-list-anchor", // Selector ancla para insertar pestañas
      debug: true, // Modo debug
      ...options,
    };

    this.tabIdCounter = 1;
    this.tabList = null;
    this.createTabButton = null;
    this.tabAnchor = null;
    this.tabsData = [];

    this.setupContextMenuIntegration();
  }

  // ===== MÉTODOS PÚBLICOS =====
  async init() {
    try {
      // 1. Encontrar elementos DOM
      await this.findDOMElements();

      // 2. Inicializar funcionalidades según flags
      if (this.options.enablePersistence) {
        await this.restoreTabs();
      }

      if (this.options.enableCreation) {
        this.setupTabCreation();
      }

      if (this.options.enableContentEditing) {
        this.setupContentEditing();
      }

      if (this.options.enableEditing) {
        this.setupTabEditing();
      }

      if (this.options.enableDeletion) {
        this.setupTabDeletion();
      }

      if (this.options.enableAutoSave) {
        this.setupAutoSave();
      }

      // 3. Configurar evento para guardar antes de cerrar
      window.addEventListener("beforeunload", () => this.saveTabs());
      return this;
    } catch (error) {
      throw error;
    }
  }

  getTabs() {
    return this.tabsData;
  }

  getActiveTab() {
    const activeInput = this.tabList.querySelector('input[type="radio"]:checked');
    return activeInput ? this.findTabById(activeInput.id) : null;
  }

  createTab(name = "New", content = "", isPinned = false, emoji = null) {
    if (!this.options.enableCreation) {
      this.log("⚠️  Creación de pestañas deshabilitada");
      return null;
    }

    const id = `body-tab-${this.tabIdCounter++}`;
    const tabData = { id, name, content, isPinned, emoji };

    // Crear elemento DOM
    const tabElement = this.createTabElement(tabData);

    // Agregar a datos
    this.tabsData.push(tabData);

    // Seleccionar y enfocar
    tabElement.querySelector("input").checked = true;
    setTimeout(() => {
      const contentDiv = tabElement.querySelector(".tab-list__item--content");
      if (contentDiv) contentDiv.focus();
    }, 50);

    this.log("➕ Pestaña creada:", { id, name });
    this.saveTabs();

    // Notificar cambio de pestañas
    document.dispatchEvent(new CustomEvent("tabsChanged"));

    return tabData;
  }

  // ===== MÉTODOS INTERNOS =====

  setupContextMenuIntegration() {
    // Escuchar evento de cambios en pestañas
    document.addEventListener("tabsChanged", () => {
      this.saveTabs();
    });
  }

  pinTab(tabElement, emoji = "📄") {
    if (!this.options.enablePinning) return;

    tabElement.classList.add("pinned");
    const label = tabElement.querySelector("label");
    const labelSpan = tabElement.querySelector("label span");

    label.setAttribute("data-emoji", emoji);
    labelSpan.setAttribute("data-emoji", emoji);

    this.reorderTabs();
    this.saveTabs();
  }

  unpinTab(tabElement) {
    if (!this.options.enablePinning) return;

    tabElement.classList.remove("pinned");
    const label = tabElement.querySelector("label");
    const labelSpan = tabElement.querySelector("label span");

    label.removeAttribute("data-emoji");
    labelSpan.removeAttribute("data-emoji");

    this.reorderTabs();
    this.saveTabs();
  }

  reorderTabs() {
    const createTabButton = this.createTabButton;
    const allTabs = Array.from(this.tabList.querySelectorAll(".tab-list__item"));

    // Separar pestañas fijadas y normales
    const pinnedTabs = allTabs.filter((tab) => tab.classList.contains("pinned"));
    const normalTabs = allTabs.filter((tab) => !tab.classList.contains("pinned"));

    // Remover todas las pestañas del DOM
    allTabs.forEach((tab) => tab.remove());

    // Obtener el elemento de referencia para insertBefore
    const referenceElement = this.tabAnchor || createTabButton;

    // Reinsertar en orden: primero las fijadas, luego las normales
    if (referenceElement && this.tabList.contains(referenceElement)) {
      pinnedTabs.forEach((tab) => {
        this.tabList.insertBefore(tab, referenceElement);
      });

      normalTabs.forEach((tab) => {
        this.tabList.insertBefore(tab, referenceElement);
      });
    } else {
      // Si no hay referencia válida, usar appendChild
      pinnedTabs.forEach((tab) => {
        this.tabList.appendChild(tab);
      });

      normalTabs.forEach((tab) => {
        this.tabList.appendChild(tab);
      });
    }
  }

  async findDOMElements() {
    this.tabList = await this.waitForElement(".tab-list");
    this.createTabButton = await this.waitForElement("#create-tab");
    if (this.options.anchorSelector) {
      this.tabAnchor = await this.waitForElement(this.options.anchorSelector);
    }
  }

  async waitForElement(selector, timeout = 3000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Elemento ${selector} no encontrado en ${timeout}ms`));
      }, timeout);
    });
  }

  async restoreTabs() {
    try {
      const savedData = localStorage.getItem("tabsData");
      this.tabsData = savedData ? JSON.parse(savedData) : [];

      // Limpiar tabs existentes (excepto el botón crear)
      this.tabList.querySelectorAll(".tab-list__item").forEach((item) => item.remove());

      // Crear elementos para cada tab
      this.tabsData.forEach((tabData) => {
        this.createTabElement(tabData);
      });

      // Actualizar contador de IDs
      this.updateTabIdCounter();
    } catch (error) {
      this.tabsData = [];
    }
  }

  createTabElement(tabData) {
    const { id, name, content, isPinned, emoji } = tabData;

    const tabElement = document.createElement("div");
    tabElement.className = "tab-list__item flex justify-start items-center flex-wrap h-auto ml-[5px]! first:ml-0! [&:not(.pinned)_label]:relative! border border-(--tn-theme-secondary) rounded";
    if (isPinned) tabElement.classList.add("pinned");

    // Usar template literal para el HTML (igual al original)
    const labelDataEmoji = emoji ? `data-emoji="${emoji}"` : "";
    const spanDataEmoji = emoji ? `data-emoji="${emoji}"` : "";

    tabElement.innerHTML = `
      <input type="radio" name="body-tab" id="${id}">
      <label class="bg-(--tn-default-tertiary-color) w-[250px] flex justify-between items-center py-[7px]! pr-[5px]! pl-[10px]! rounded cursor-pointer" for="${id}" ${labelDataEmoji}>
        <span class="text-ellipsis whitespace-nowrap w-[80%] overflow-hidden z-10 text-[14px]! font-bold" ${spanDataEmoji}>${name || "New"}</span>
        <button class="edit-name-tab border-0 outline-0 w-[20px] h-[20px] justify-center items-center hidden rounded-full" aria-label="Editar nombre">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-1 w-1/2 h-1/2">
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
          </svg>
        </button>
        <button class="delete-tab border-0 outline-0 w-[20px] h-[20px] justify-center items-center hidden rounded-full" aria-label="Eliminar pestaña">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-1 w-1/2 h-1/2">
            <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
          </svg>
        </button>
      </label>
      <div class="tab-list__item--content overflow-x-hidden overflow-y-scroll font-thin hidden bg-(--tn-theme-secondary) min-h-[92dvh] p-(--tn-padding-base)! border-0 outline-0 absolute top-[50px] left-[10px] h-[calc(100%-60px)] w-[calc(100%-(var(--tn-padding-base)*2))] first:mr-[10px] border-r border-(--tn-theme-secondary)! rounded-md" contenteditable="true">${content || ""}</div>
    `;

    // Insertar usando el ancla o el botón como referencia
    if (this.tabAnchor) {
      this.tabList.insertBefore(tabElement, this.tabAnchor);
    } else if (this.createTabButton && this.tabList.contains(this.createTabButton)) {
      this.tabList.insertBefore(tabElement, this.createTabButton);
    } else {
      this.tabList.appendChild(tabElement);
    }

    return tabElement;
  }

  setupTabCreation() {
    if (!this.createTabButton) return;

    this.createTabButton.addEventListener("click", () => {
      this.createTab();
    });
  }

  setupContentEditing() {
    // Configurar manejo de tabulador en editores de contenido
    this.tabList.addEventListener("keydown", (event) => {
      if (event.key === "Tab" && event.target.classList.contains("tab-list__item--content")) {
        event.preventDefault();
        document.execCommand("insertText", false, "    ");
      }

      // Atajo para negrita: CTRL + B
      if (event.ctrlKey && event.key === "b" && event.target.classList.contains("tab-list__item--content")) {
        event.preventDefault();
        FormattingUtils.cycleBold();
      }
    });
  }

  setupTabEditing() {
    // Delegar eventos para manejar edición de nombres
    this.tabList.addEventListener("click", (e) => {
      const editButton = e.target.closest(".edit-name-tab");
      if (editButton) {
        e.stopPropagation();
        this.startEditingTabName(editButton);
      }
    });
  }

  startEditingTabName(editButton, skipClickOutside = false) {
    const tabItem = editButton.closest(".tab-list__item");
    const label = tabItem.querySelector("label");
    const span = label.querySelector("span");

    // Hacer editable
    label.setAttribute("contenteditable", "true");
    span.focus();

    // Seleccionar todo el texto
    const range = document.createRange();
    range.selectNodeContents(span);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Finalizar edición al hacer clic fuera o presionar Enter
    const finishEditing = () => {
      label.removeAttribute("contenteditable");
      this.saveTabs();
      this.updateTabIds();
    };

    // Handler para clic fuera (solo si no se omite)
    if (!skipClickOutside) {
      const clickOutsideHandler = (e) => {
        const floatingMenu = document.querySelector(".tn-navbar");
        const clickFromFloatingMenu = floatingMenu?.contains(e.target);

        if (!label.contains(e.target) && !clickFromFloatingMenu && label.isContentEditable) {
          finishEditing();
          document.removeEventListener("click", clickOutsideHandler);
        }
      };

      // Delay para evitar que el click que abre la edición se cierre inmediatamente
      setTimeout(() => {
        document.addEventListener("click", clickOutsideHandler);
      }, 100);
    }

    // Handler para Enter
    const keydownHandler = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        finishEditing();
        label.removeEventListener("keydown", keydownHandler);
      }
    };

    label.addEventListener("keydown", keydownHandler);

    // Auto-remover handlers después de 30 segundos (safety)
    setTimeout(() => {
      if (!skipClickOutside) {
        document.removeEventListener("click", clickOutsideHandler);
      }
      label.removeEventListener("keydown", keydownHandler);
    }, 30000);
  }

  setupTabDeletion() {
    // Delegar eventos para eliminar pestañas
    this.tabList.addEventListener("click", (e) => {
      const deleteButton = e.target.closest(".delete-tab");
      if (deleteButton) {
        e.stopPropagation();
        this.deleteTab(deleteButton);
      }
    });

    // También manejar clic medio del mouse
    document.addEventListener("auxclick", (e) => {
      if (e.button === 1) {
        // Botón medio
        const isTabLabel = e.target.closest(".tab-list__item label");
        if (isTabLabel) {
          e.preventDefault();
          const tabElement = e.target.closest(".tab-list__item");
          this.deleteTabElement(tabElement);
        }
      }
    });
  }

  deleteTab(deleteButton) {
    const tabElement = deleteButton.closest(".tab-list__item");
    this.deleteTabElement(tabElement);
  }

  deleteTabElement(tabElement) {
    if (!tabElement || !confirm("¿Eliminar esta pestaña?")) {
      return;
    }

    const tabId = tabElement.querySelector("input").id;

    // Eliminar del DOM
    tabElement.remove();

    // Eliminar de los datos
    this.tabsData = this.tabsData.filter((tab) => tab.id !== tabId);

    // Actualizar IDs
    this.updateTabIds();

    // Guardar cambios
    this.saveTabs();

    // Notificar cambio de pestañas
    document.dispatchEvent(new CustomEvent("tabsChanged"));
  }

  setupAutoSave() {
    // Guardar automáticamente al cambiar contenido
    this.tabList.addEventListener("input", (e) => {
      if (e.target.classList.contains("tab-list__item--content")) {
        setTimeout(() => this.saveTabs(), 500); // Debounce
      }
    });
  }

  saveTabs() {
    if (!this.options.enableAutoSave && !this.options.enablePersistence) {
      return;
    }

    try {
      const tabsData = [];
      const tabElements = this.tabList.querySelectorAll(".tab-list__item");

      tabElements.forEach((item) => {
        const contentEl = item.querySelector(".tab-list__item--content");
        const inputEl = item.querySelector("input");
        const spanEl = item.querySelector("label span");

        if (contentEl && inputEl && spanEl) {
          const content = contentEl.innerHTML;
          const id = inputEl.id;
          const name = spanEl.textContent;
          const isPinned = item.classList.contains("pinned");
          const emoji = spanEl.dataset.emoji || null;

          tabsData.push({ id, content, name, isPinned, emoji });
        }
      });

      this.tabsData = tabsData;
      localStorage.setItem("tabsData", JSON.stringify(tabsData));
    } catch (error) {}
  }

  updateTabIds() {
    const tabElements = this.tabList.querySelectorAll(".tab-list__item");

    tabElements.forEach((item, index) => {
      const input = item.querySelector("input");
      const label = item.querySelector("label");
      const newId = `body-tab-${index + 1}`;

      // Solo actualizar si cambió
      if (input && input.id !== newId) {
        input.id = newId;
        if (label) label.setAttribute("for", newId);
      }
    });

    // Actualizar contador
    this.tabIdCounter = tabElements.length + 1;
  }

  updateTabIdCounter() {
    const tabs = this.tabList.querySelectorAll(".tab-list__item");
    if (tabs.length > 0) {
      tabs.forEach((tab) => {
        const input = tab.querySelector("input");
        if (input) {
          const id = input.id;
          const number = parseInt(id.split("-").pop());
          if (number >= this.tabIdCounter) {
            this.tabIdCounter = number + 1;
          }
        }
      });
    }
  }

  findTabById(id) {
    return this.tabsData.find((tab) => tab.id === id);
  }

  log(...args) {
    if (this.options.debug) {
    }
  }

  // Métodos para debugging
  debug() {
    return {
      tabsCount: this.tabsData.length,
      tabIdCounter: this.tabIdCounter,
      options: this.options,
      elements: {
        tabList: !!this.tabList,
        createTabButton: !!this.createTabButton,
      },
    };
  }
}
