export class FloatingNavPosition {
  constructor() {
    this.navElement = null;
    this.previousViewportHeight = null;
    this.timeoutId = null;
  }

  init() {
    this.navElement = document.getElementById("floating-nav");
    if (!this.navElement) return this;

    this.updatePosition();
    this.setupEventListeners();

    console.log("[FloatingNavPosition] Initialized");
    return this;
  }

  setupEventListeners() {
    window.addEventListener("resize", () => {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => this.updatePosition(), 100);
    });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", () => {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => this.updatePosition(), 100);
      });
    }

    window.addEventListener("scroll", () => {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => this.updatePosition(), 100);
    });

    window.addEventListener("orientationchange", () => {
      setTimeout(() => this.updatePosition(), 100);
    });
  }

  updatePosition() {
    if (!this.navElement) return;

    if (window.visualViewport) {
      const currentHeight = window.visualViewport.height;

      if (this.previousViewportHeight !== null) {
        const diff = Math.abs(this.previousViewportHeight - currentHeight);

        if (diff > 100) {
          this.previousViewportHeight = currentHeight;
          return;
        }
      }

      this.previousViewportHeight = currentHeight;
    }

    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches || window.navigator.standalone === true;

    if (isStandalone) {
      document.documentElement.style.setProperty("--nav-bottom", "max(20px, env(safe-area-inset-bottom, 20px))");
      document.documentElement.style.setProperty("--nav-pb", "0rem");
      return;
    }

    if (window.visualViewport) {
      const viewport = window.visualViewport;
      const windowHeight = window.innerHeight;
      const viewportBottom = viewport.offsetTop + viewport.height;
      const bottomSpace = windowHeight - viewportBottom;

      if (bottomSpace > 0) {
        const offset = bottomSpace + 12;
        document.documentElement.style.setProperty("--nav-bottom", `${offset}px`);
        document.documentElement.style.setProperty("--nav-pb", `${bottomSpace}px`);
      } else {
        document.documentElement.style.setProperty("--nav-bottom", "1.5rem");
        document.documentElement.style.setProperty("--nav-pb", "0rem");
      }
    } else {
      document.documentElement.style.setProperty("--nav-bottom", "1.5rem");
      document.documentElement.style.setProperty("--nav-pb", "0rem");
    }
  }
}
