// src/lib/scripts/entry.js
// Punto de entrada modular seguro para Notepad
export async function initNotepad() {
  // Verificación de seguridad: solo ejecutar en navegador
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.warn("⚠️  Entorno no compatible (SSR o Node.js), omitiendo...");
    return;
  }

  try {
    // 1. Cargar funciones CRÍTICAS primero (las que necesitan estar inmediatamente)
    await loadCriticalFunctions();

    // 2. Inicializar componentes básicos
    await initializeBasicComponents();

    // 3. Cargar módulos adicionales (menos críticos)
    await loadOptionalModules();

    // 4. Verificar que todo funcione
    await verifyFunctionality();
  } catch (error) {
    // Intentar funcionalidad mínima
    try {
      await emergencyFallback();
    } catch (fallbackError) {
      showErrorMessage();
    }
  }
}

// ===== FUNCIONES CRÍTICAS (deben cargarse primero) =====
async function loadCriticalFunctions() {
  // 1. Inicializar sistema de internacionalización
  const { i18n } = await import("../../i18n/core.js");
  i18n.init();

  // 2. Compartir idioma del cliente con SSR (para que los componentes .astro lo usen)
  window.__I18N_CONFIG = { lang: i18n.getLang() };

  // 3. Cargar fuente personalizada (parte más crítica)
  const { FontManager } = await import("./core/fontManager.js");
  window.fontManager = new FontManager();
  window.fontManager.loadCustomFont();
  window.fontManager.loadFontSize();
  window.fontManager.initFontSettingsUI();

  // 3. Configurar sistema de temas (dark/light mode)
  await setupThemeSystem();

  // 4. Configurar Service Worker si está disponible
  setupServiceWorker();
}

async function setupThemeSystem() {
  try {
    // Cargar ThemeManager
    const { ThemeManager } = await import("./core/themeManager.js");
    window.themeManager = new ThemeManager();
    await window.themeManager.init();

    // Para retrocompatibilidad, mantener el toggle antiguo si existe
    const oldDarkModeToggle = document.getElementById("dark-mode-toggle");
    if (oldDarkModeToggle) {
      // Sincronizar estado inicial
      const isLightMode = window.themeManager.getCurrentTheme() === "light";
      oldDarkModeToggle.checked = isLightMode;

      // Manejar cambios desde el toggle antiguo
      oldDarkModeToggle.addEventListener("change", (e) => {
        window.themeManager.toggleLightMode(e.target.checked);
      });

      // Escuchar cambios de tema para actualizar el toggle
      window.addEventListener("themeChanged", (e) => {
        const isLight = e.detail.theme === "light";
        oldDarkModeToggle.checked = isLight;
      });
    }
  } catch (error) {
    // Fallback al sistema antiguo
    setupDarkModeFallback();
  }
}

function setupDarkModeFallback() {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  if (!darkModeToggle) return;

  const savedMode = localStorage.getItem("darkMode");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  if (savedMode !== null) {
    document.documentElement.classList.toggle(
      "light-mode",
      savedMode === "false",
    );
    darkModeToggle.checked = savedMode === "false";
  } else if (!systemPrefersDark) {
    document.documentElement.classList.add("light-mode");
    darkModeToggle.checked = true;
  }

  darkModeToggle.addEventListener("change", (e) => {
    const isLightMode = e.target.checked;
    document.documentElement.classList.toggle("light-mode", isLightMode);
    localStorage.setItem("darkMode", !isLightMode);
  });
}

function setupServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => {})
        .catch((err) => {});
    });
  }
}

// ===== COMPONENTES BÁSICOS =====
async function initializeBasicComponents() {
  // Por ahora, las ponemos aquí como funciones internas
  await initializeTabsSystem();
  await initializeContextMenu();
  await initializeFloatingMenu();
  await initializeKeyboardShortcuts();
  await initializeTabDragDrop();
  await initializeSettingsModal();
  await initializeCloseTabConfirmation();
}

async function initializeTabsSystem() {
  try {
    // Importar dinámicamente para mejor performance
    const { TabManager } = await import("./core/tabs.js");

    // Crear instancia con feature flags
    window.tabManager = new TabManager({
      enablePersistence: true,
      enableCreation: true,
      enableEditing: true,
      enableDeletion: true,
      enablePinning: true,
      enableContentEditing: true,
      enableAutoSave: true,
      anchorSelector: "#tab-list-anchor",
      debug: true,
    });

    // Inicializar
    await window.tabManager.init();

    // Reemplazar el evento click básico con el real
    const createTabBtn = document.getElementById("create-tab");
    if (createTabBtn) {
      createTabBtn.onclick = null; // Remover el listener anterior
    }
  } catch (error) {
    // Fallback al método básico
    const createTabBtn = document.getElementById("create-tab");
    if (createTabBtn) {
      createTabBtn.addEventListener("click", () => {});
    }

    throw error;
  }
}

async function initializeContextMenu() {
  try {
    const { ContextMenu } = await import("./ui/contextMenu.js");

    // Crear instancia
    window.contextMenu = new ContextMenu({
      enableTextContext: true,
      enableTabContext: true,
      enableMiddleClickClose: true,
      debug: true,
    });

    // Inicializar
    await window.contextMenu.init();

    document.addEventListener(
      "contextmenu",
      (e) => {
        // IMPORTANTE: Solo prevenir si es en nuestras áreas
        const isContentEditable = e.target.closest(".tab-list__item--content");
        const isTabLabel = e.target.closest(".tab-list__item label");

        if (isContentEditable || isTabLabel) {
          e.preventDefault();
        }
      },
      true,
    ); // Usar capture: true para capturar el evento temprano

    return window.contextMenu;
  } catch (error) {
    // Fallback mínimo
    document.addEventListener("contextmenu", (e) => {
      const isContentEditable = e.target.closest(".tab-list__item--content");
      const isTabLabel = e.target.closest(".tab-list__item label");

      if (isContentEditable || isTabLabel) {
        e.preventDefault();
      }
    });

    throw error;
  }
}

async function initializeFloatingMenu() {
  try {
    const { FloatingMenu } = await import("./ui/floatingMenu.js");

    window.floatingMenu = new FloatingMenu({
      debug: true,
    });

    await window.floatingMenu.init();

    return window.floatingMenu;
  } catch (error) {
    console.error("❌ Error inicializando FloatingMenu:", error);
  }
}

async function initializeKeyboardShortcuts() {
  try {
    const { KeyboardShortcuts } = await import("./ui/keyboardShortcuts.js");

    window.keyboardShortcuts = new KeyboardShortcuts({
      debug: true,
    });

    await window.keyboardShortcuts.init();

    return window.keyboardShortcuts;
  } catch (error) {
    console.error("❌ Error inicializando KeyboardShortcuts:", error);
  }
}

async function initializeTabDragDrop() {
  try {
    const { TabDragDrop } = await import("./ui/tabDragDrop.js");

    window.tabDragDrop = new TabDragDrop({
      debug: true,
    });

    await window.tabDragDrop.init();

    return window.tabDragDrop;
  } catch (error) {
    console.error("❌ Error inicializando TabDragDrop:", error);
  }
}

async function initializeSettingsModal() {
  try {
    const { SettingsModal } = await import("./ui/settingsModal.js");

    window.settingsModal = new SettingsModal({
      debug: true,
    });

    await window.settingsModal.init();

    return window.settingsModal;
  } catch (error) {
    console.error("❌ Error inicializando SettingsModal:", error);
  }
}

async function initializeCloseTabConfirmation() {
  try {
    const { CloseTabConfirmation } = await import("./ui/closeTabConfirmation.js");

    window.closeTabConfirmationModal = new CloseTabConfirmation();
    await window.closeTabConfirmationModal.init();

    console.log("[CloseTabConfirmation] Initialized");
  } catch (error) {
    console.error("❌ Error inicializando CloseTabConfirmation:", error);
  }
}

// ===== MÓDULOS OPCIONALES =====
async function loadOptionalModules() {
  try {
    // Intentar cargar módulos de utilidad
    const utilsModule = await import("./utils/domHelpers.js");

    const emojiModule = await import("./utils/emojiDetector.js");

    // Aquí puedes agregar más imports dinámicos
    import("./core/fontManager.js");
    import("./core/tabs.js");
    import("./core/themeManager.js");
    import("./ui/contextMenu.js");
    import("./utils/domHelpers.js");
    import("./utils/emojiDetector.js");
  } catch (error) {
    // return false
  }
}

// ===== VERIFICACIÓN Y FALLBACK =====
async function verifyFunctionality() {
  // Verificar elementos críticos
  const criticalElements = [".tab-list", "#create-tab", "#context-menu"];

  const missingElements = [];

  criticalElements.forEach((selector) => {
    if (!document.querySelector(selector)) {
      missingElements.push(selector);
    }
  });

  if (missingElements.length > 0) {
    // throw new Error(`Elementos críticos no encontrados: ${missingElements.join(', ')}`);
  }

  // Verificar localStorage
  if (typeof localStorage === "undefined") {
    throw new Error("localStorage no disponible");
  }
}

async function emergencyFallback() {
  // Funcionalidad MÍNIMA para que la app no se rompa completamente

  // 1. Permitir crear pestañas básicas
  const createTabBtn = document.getElementById("create-tab");
  if (createTabBtn) {
    createTabBtn.onclick = () => {
      alert(
        "Modo emergencia: Funcionalidad limitada. Por favor recarga la página.",
      );
    };
  }

  // 2. Dark mode básico
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  if (darkModeToggle) {
    darkModeToggle.onchange = (e) => {
      document.documentElement.classList.toggle("light-mode", e.target.checked);
    };
  }

  console.log("🆘 Modo emergencia activado");
}

function showErrorMessage() {
  // Crear un mensaje de error visible pero no intrusivo
  const errorDiv = document.createElement("div");
  errorDiv.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #f44336;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    z-index: 9999;
    font-family: sans-serif;
    font-size: 14px;
    max-width: 300px;
  `;
  errorDiv.innerHTML = `
    <strong>⚠️ Error técnico</strong><br>
    Algunas funciones pueden no estar disponibles.<br>
    <small>Intenta recargar la página.</small>
  `;

  document.body.appendChild(errorDiv);

  // Auto-eliminar después de 10 segundos
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.parentNode.removeChild(errorDiv);
    }
  }, 10000);
}

// Exportar funciones para debugging
export const debug = {
  test: () => {
    return "OK";
  },
  checkElements: () => {
    const elements = {
      tabList: document.querySelector(".tab-list"),
      createTab: document.getElementById("create-tab"),
      darkModeToggle: document.getElementById("dark-mode-toggle"),
      contextMenu: document.getElementById("context-menu"),
    };
    return elements;
  },
};
