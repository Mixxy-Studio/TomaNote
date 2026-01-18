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
    console.error("❌ Error crítico en sistema modular:", error);
    console.log("🔄 Intentando recuperación...");

    // Intentar funcionalidad mínima
    try {
      await emergencyFallback();
    } catch (fallbackError) {
      console.error("❌ Fallback también falló:", fallbackError);
      showErrorMessage();
    }
  }
}

// ===== FUNCIONES CRÍTICAS (deben cargarse primero) =====
async function loadCriticalFunctions() {
  // 1. Cargar fuente personalizada (parte más crítica)
  const { FontManager } = await import("./core/fontManager.js");
  window.fontManager = new FontManager();
  window.fontManager.loadCustomFont();

  // 2. Configurar sistema de temas (dark/light mode)
  await setupThemeSystem();

  // 3. Configurar Service Worker si está disponible
  setupServiceWorker();
}

// En tu entry.js, reemplaza setupDarkMode() con:
async function setupThemeSystem() {
  try {
    // Cargar ThemeManager
    const { ThemeManager } = await import("./core/themeManager.js");
    window.themeManager = new ThemeManager();
    await window.themeManager.init();

    // Para retrocompatibilidad, mantener el toggle antiguo si existe
    const oldDarkModeToggle = document.getElementById("dark-mode-toggle");
    if (oldDarkModeToggle) {
      console.log("🔗 Manteniendo compatibilidad con toggle antiguo...");

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
    console.error("❌ Error configurando temas:", error);

    // Fallback al sistema antiguo
    console.log("🔄 Usando fallback de dark mode simple...");
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
        .then((reg) => {
          console.log("✅ Service Worker registrado", reg);
        })
        .catch((err) => {
          console.warn("⚠️  SW no disponible:", err);
        });
    });
  }
}

// ===== COMPONENTES BÁSICOS =====
async function initializeBasicComponents() {
  // Por ahora, las ponemos aquí como funciones internas
  await initializeTabsSystem();
  await initializeContextMenu();
}

async function initializeTabsSystem() {
  try {
    // Importar dinámicamente para mejor performance
    const { TabManager } = await import("./core/tabs.js");

    // Crear instancia con feature flags
    // En entry.js, cambia estos flags:
    window.tabManager = new TabManager({
      enablePersistence: true,
      enableCreation: true,
      enableEditing: true,
      enableDeletion: true,
      enablePinning: true,
      enableContentEditing: true,
      enableAutoSave: true,
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
      createTabBtn.addEventListener("click", () => {
        console.log("➕ [FALLBACK] Botón crear pestaña clickeado");
        alert("Funcionalidad de pestañas en modo fallback");
      });
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

    // ===== FIX CRÍTICO: Registrar event listener GLOBAL =====
    // Esto asegura que el menú del navegador se bloquee INMEDIATAMENTE
    document.addEventListener(
      "contextmenu",
      (e) => {
        console.log(
          "🖱️  [GLOBAL] Clic derecho detectado en:",
          e.target.tagName,
          e.target.className,
        );

        // IMPORTANTE: Solo prevenir si es en nuestras áreas
        const isContentEditable = e.target.closest(".tab-list__item--content");
        const isTabLabel = e.target.closest(".tab-list__item label");

        if (isContentEditable || isTabLabel) {
          e.preventDefault();
          console.log("🖱️  [GLOBAL] Menú del navegador bloqueado");
        }
      },
      true,
    ); // Usar capture: true para capturar el evento temprano

    return window.contextMenu;
  } catch (error) {
    console.error("❌ Error inicializando ContextMenu:", error);

    // Fallback mínimo
    document.addEventListener("contextmenu", (e) => {
      const isContentEditable = e.target.closest(".tab-list__item--content");
      const isTabLabel = e.target.closest(".tab-list__item label");

      if (isContentEditable || isTabLabel) {
        e.preventDefault();
        console.log("🖱️  [FALLBACK] Menú contextual bloqueado");
      }
    });

    throw error;
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
    console.warn("⚠️  Algunos módulos no pudieron cargarse:", error.message);
    console.log("ℹ️  Continuando sin módulos opcionales...");
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
    throw new Error(
      `Elementos críticos no encontrados: ${missingElements.join(", ")}`,
    );
  }

  // Verificar localStorage
  if (typeof localStorage === "undefined") {
    throw new Error("localStorage no disponible");
  }
}

async function emergencyFallback() {
  console.log("🚨 Ejecutando modo de emergencia...");

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
    console.log("🔧 Debug: Sistema modular está funcionando");
    return "OK";
  },
  checkElements: () => {
    const elements = {
      tabList: document.querySelector(".tab-list"),
      createTab: document.getElementById("create-tab"),
      darkModeToggle: document.getElementById("dark-mode-toggle"),
      contextMenu: document.getElementById("context-menu"),
    };
    console.log("🔍 Elementos encontrados:", elements);
    return elements;
  },
};
