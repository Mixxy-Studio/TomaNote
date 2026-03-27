export class CloseTabConfirmation {
  constructor() {
    this.modal = null;
    this.pendingTabElement = null;
    this.resolvePromise = null;
  }
  async init() {
    this.modal = document.getElementById("closeTabConfirmation");
    if (!this.modal) return this;

    this.setupEventListeners();
    return this;
  }
  setupEventListeners() {
    // Botón Delete
    const deleteBtn = this.modal.querySelector("[data-action='delete']");
    deleteBtn?.addEventListener("click", () => this.handleConfirm());
    // Botón Cancel o cerrar
    const cancelBtn = this.modal.querySelector("[data-action='cancel']");
    cancelBtn?.addEventListener("click", () => this.handleCancel());
    // Cerrar con ESC
    this.modal.addEventListener("cancel", (e) => {
      e.preventDefault();
      this.handleCancel();
    });
  }
  // Método público para abrir el modal y retornar una promesa
  open(tabElement) {
    this.pendingTabElement = tabElement;
    this.modal.showModal();

    return new Promise((resolve) => {
      this.resolvePromise = resolve;
    });
  }
  handleConfirm() {
    this.modal.close();
    const tabElement = this.pendingTabElement;
    this.pendingTabElement = null;

    if (this.resolvePromise) {
      this.resolvePromise({ confirmed: true, tabElement });
      this.resolvePromise = null;
    }
  }
  handleCancel() {
    this.modal.close();
    this.pendingTabElement = null;

    if (this.resolvePromise) {
      this.resolvePromise({ confirmed: false, tabElement: null });
      this.resolvePromise = null;
    }
  }
}
