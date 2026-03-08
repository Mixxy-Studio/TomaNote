// src/lib/scripts/ui/keyboardShortcuts.js
// Sistema de atajos de teclado para desktop

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

    this.log("✅ KeyboardShortcuts inicializado");
    return this;
  }

  setupEscapeKeyHandler() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;

      this.log("⌨️ Tecla ESC detectada");

      // 1. Verificar si hay modal de settings abierto
      const settingsModal = document.getElementById("info-notepad");
      if (settingsModal?.hasAttribute("open")) {
        this.log("⚠️ Modal de settings abierto - ignorando ESC");
        return;
      }

      // 2. Verificar si se está editando el nombre de una pestaña
      const editingLabel = document.querySelector('label[contenteditable="true"]');
      if (editingLabel) {
        this.log("✏️ Modo de edición activo - saliendo del modo edición");
        editingLabel.removeAttribute("contenteditable");
        if (window.tabManager?.saveTabs) {
          window.tabManager.saveTabs();
        }
        return;
      }

      // 3. Cerrar la pestaña activa (desmarcar radio)
      const activeTab = document.querySelector('.tab-list input[type="radio"]:checked');
      if (activeTab) {
        this.log("🔒 Cerrando pestaña activa");
        activeTab.checked = false;
        
        // Notificar a otros módulos (como FloatingMenu)
        document.dispatchEvent(new CustomEvent('tabsChanged'));
      }
    });
  }

  log(...args) {
    if (this.options.debug) {
      console.log("[KeyboardShortcuts]", ...args);
    }
  }
}
