// src/lib/scripts/ui/keyboardShortcuts.js
// Desktop keyboard shortcut system

export class KeyboardShortcuts {
  constructor(options = {}) {
    this.options = {
      debug: true,
      ...options,
    };

    this.isDesktop = !("ontouchstart" in window);
  }

  async init() {
    if (!this.isDesktop) {
      this.log("ℹ️ KeyboardShortcuts solo está activo en desktop");
      return this;
    }

    this.setupEscapeKeyHandler();
    this.setupCommandPaletteShortcut();

    this.log("✅ KeyboardShortcuts inicializado");
    return this;
  }

  setupEscapeKeyHandler() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;

      this.log("⌨️ Tecla ESC detectada");

      // 0. Check if command palette is open
      const commandPalette = document.getElementById("commandPalette");
      if (commandPalette?.hasAttribute("open")) {
        this.log("⚠️ Command Palette abierto - ignorando ESC");
        return;
      }

      // 1. Check if there is an open settings modal
      const settingsModal = document.getElementById("info-notepad");
      if (settingsModal?.hasAttribute("open")) {
        this.log("⚠️ Modal de settings abierto - ignorando ESC");
        return;
      }

      // 2. Check if a tab name is being edited
      const editingLabel = document.querySelector('label[contenteditable="true"]');
      if (editingLabel) {
        this.log("✏️ Modo de edición activo - saliendo del modo edición");
        editingLabel.removeAttribute("contenteditable");
        if (window.tabManager?.saveTabs) {
          window.tabManager.saveTabs();
        }
        return;
      }

      // 3. Close the active tab (uncheck the radio button)
      const activeTab = document.querySelector('.tab-list input[type="radio"]:checked');
      if (activeTab) {
        this.log("🔒 Cerrando pestaña activa");
        activeTab.checked = false;

        // Notify other modules (such as FloatingMenu)
        document.dispatchEvent(new CustomEvent("tabsChanged"));
      }
    });
  }

  setupCommandPaletteShortcut() {
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        this.log("⌨️ Ctrl+K detectado - abriendo Command Palette");
        window.commandPalette?.toggle();
      }
    });
  }

  log(...args) {
    if (this.options.debug) {
      console.log("[KeyboardShortcuts]", ...args);
    }
  }
}
