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
    // Delete Button
    const deleteBtn = this.modal.querySelector("[data-action='delete']");
    deleteBtn?.addEventListener("click", () => this.handleConfirm());
    // Cancel or close button
    const cancelBtn = this.modal.querySelector("[data-action='cancel']");
    cancelBtn?.addEventListener("click", () => this.handleCancel());
    // Close or ESC
    this.modal.addEventListener("cancel", (e) => {
      e.preventDefault();
      this.handleCancel();
    });
  }
  // Public method for open modal and return promise
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
