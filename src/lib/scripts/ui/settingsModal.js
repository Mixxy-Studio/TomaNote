// src/lib/scripts/ui/settingsModal.js
export class SettingsModal {
  constructor(options = {}) {
    this.options = {
      debug: true,
      ...options,
    };
    this.modal = null;
    this.langSelect = null;
    this.langForm = null;
  }

  async init() {
    this.modal = document.getElementById("info-notepad");
    if (!this.modal) {
      if (this.options.debug) {
        console.error("[SettingsModal] Modal not found");
      }
      return this;
    }

    this.setupTabs();
    this.setupLanguageSelector();

    if (this.options.debug) {
      console.log("[SettingsModal] Initialized successfully");
    }

    return this;
  }

  setupTabs() {
    const navItems = this.modal.querySelectorAll(".nav-item");
    const tabs = this.modal.querySelectorAll(".settings-tab");

    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        const tabId = item.dataset.tab;
        if (tabId) {
          this.switchTab(tabId, navItems, tabs);
        }
      });
    });
  }

  switchTab(tabId, navItems, tabs) {
    navItems.forEach((item) => item.classList.remove("active"));
    tabs.forEach((tab) => tab.classList.remove("active"));

    const selectedTab = this.modal.querySelector(`#${tabId}-tab`);
    const selectedNav = this.modal.querySelector(`[data-tab="${tabId}"]`);

    if (selectedTab) {
      selectedTab.classList.add("active");
    }
    if (selectedNav) {
      selectedNav.classList.add("active");
    }
  }

  setupLanguageSelector() {
    this.langSelect = document.getElementById("lang-select");
    this.langForm = this.modal.querySelector("form");

    if (this.langSelect && window.i18n) {
      this.langSelect.value = window.i18n.getLang() || "en";

      this.langSelect.addEventListener("change", (e) => {
        const newLang = e.target.value;
        window.i18n.setLang(newLang);
      });
    }

    if (this.langForm) {
      this.langForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (this.langSelect && window.i18n) {
          const selectedLang = this.langSelect.value;
          localStorage.setItem("appLang", selectedLang);
          window.i18n.setLang(selectedLang);
        }
        this.modal.close();
      });
    }
  }
}
