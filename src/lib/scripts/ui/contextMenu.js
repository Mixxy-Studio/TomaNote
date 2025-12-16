// src/lib/scripts/ui/contextMenu.js
// Sistema de menú contextual para texto y pestañas

import { detectEmojiInText } from '../utils/emojiDetector.js';

export class ContextMenu {
  constructor(options = {}) {
    this.options = {
      enableTextContext: true,
      enableTabContext: true,
      enableMiddleClickClose: true,
      debug: true,
      ...options
    };
    
    this.contextMenu = null;
    this.activeEditableElement = null;
    this.activeSelection = null;
    this.activeTabElement = null;
    
    this.log('🖱️  ContextMenu creado');
  }
  
  async init() {
    try {
      this.log('🚀 Inicializando menú contextual...');
      
      // 1. Encontrar el elemento del menú
      this.contextMenu = await this.waitForElement('#context-menu');
      
      // 2. Configurar según flags
      if (this.options.enableTextContext || this.options.enableTabContext) {
        this.setupContextMenu();
      }
      
      if (this.options.enableMiddleClickClose) {
        this.setupMiddleClick();
      }
      
      this.log('✅ ContextMenu inicializado correctamente');
      return this;
      
    } catch (error) {
      this.log('❌ Error inicializando ContextMenu:', error);
      throw error;
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
        subtree: true
      });
      
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Elemento ${selector} no encontrado`));
      }, timeout);
    });
  }
  
  setupContextMenu() {
    // Mostrar menú contextual al hacer clic derecho
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.handleContextMenu(e);
    });
    
    // Ocultar menú al hacer clic
    document.addEventListener('click', () => {
      this.hideContextMenu();
    });
    
    // Manejar acciones del menú
    this.contextMenu.addEventListener('click', (e) => {
      this.handleMenuAction(e);
    });
    
    this.log('✅ Eventos de menú contextual configurados');
  }
  
  handleContextMenu(e) {
    const target = e.target;
    
    // Verificar si es contenido editable
    const isContentEditable = target.closest('.tab-list__item--content');
    
    // Verificar si es etiqueta de pestaña
    const isTabLabel = target.closest('.tab-list__item label');
    
    if (isContentEditable && this.options.enableTextContext) {
      this.showTextContextMenu(e, isContentEditable);
    } else if (isTabLabel && this.options.enableTabContext) {
      this.showTabContextMenu(e, isTabLabel);
    }
  }
  
  showTextContextMenu(e, editableElement) {
    // Guardar el elemento editable activo
    this.activeEditableElement = editableElement;
    
    // Verificar si hay selección de texto
    const selection = window.getSelection();
    const hasSelection = selection.toString().length > 0;
    
    if (hasSelection) {
      this.activeSelection = selection.getRangeAt(0).cloneRange();
    }
    
    // Mostrar/ocultar opciones según el contexto
    this.contextMenu.querySelectorAll('.context-menu__item').forEach(item => {
      if (item.dataset.requiresSelection === 'true') {
        item.classList.toggle('disabled', !hasSelection);
      }
      
      if (item.dataset.context === 'tab') {
        item.style.display = 'none';
      } else {
        item.style.display = 'block';
      }
    });
    
    // Mostrar separadores
    this.contextMenu.querySelectorAll('.context-menu__separator').forEach(separator => {
      separator.style.display = 'block';
    });
    
    // Mostrar menú en posición del mouse
    this.showMenuAt(e.pageX, e.pageY);
    
    this.log('📝 Menú contextual de texto mostrado');
  }
  
  showTabContextMenu(e, tabLabel) {
    // Guardar el elemento de pestaña activo
    this.activeTabElement = tabLabel.closest('.tab-list__item');
    this.activeEditableElement = null;
    this.activeSelection = null;
    
    // Verificar si la pestaña está fijada
    const isPinned = this.activeTabElement.classList.contains('pinned');
    const pinTabText = this.contextMenu.querySelector('#pin-tab-text');
    
    if (pinTabText) {
      pinTabText.textContent = isPinned ? 'Desfijar' : 'Fijar';
    }
    
    // Mostrar solo opciones de pestaña
    this.contextMenu.querySelectorAll('.context-menu__item').forEach(item => {
      if (item.dataset.context === 'tab') {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
    
    // Ocultar separadores
    this.contextMenu.querySelectorAll('.context-menu__separator').forEach(separator => {
      separator.style.display = 'none';
    });
    
    // Mostrar menú en posición del mouse
    this.showMenuAt(e.pageX, e.pageY);
    
    this.log('📑 Menú contextual de pestaña mostrado');
  }
  
  showMenuAt(x, y) {
    this.contextMenu.style.display = 'block';
    
    // Ajustar posición para que no se salga de la pantalla
    const menuWidth = this.contextMenu.offsetWidth;
    const menuHeight = this.contextMenu.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let finalX = x;
    let finalY = y;
    
    if (x + menuWidth > windowWidth) {
      finalX = windowWidth - menuWidth - 10;
    }
    
    if (y + menuHeight > windowHeight) {
      finalY = windowHeight - menuHeight - 10;
    }
    
    this.contextMenu.style.left = `${finalX}px`;
    this.contextMenu.style.top = `${finalY}px`;
  }
  
  hideContextMenu() {
    this.contextMenu.style.display = 'none';
    this.activeEditableElement = null;
    this.activeSelection = null;
    this.activeTabElement = null;
  }
  
  handleMenuAction(e) {
    const menuItem = e.target.closest('.context-menu__item');
    if (!menuItem || menuItem.classList.contains('disabled')) {
      return;
    }
    
    const action = menuItem.dataset.action;
    
    if (action === 'pin-tab' && this.activeTabElement) {
      this.handlePinTab(this.activeTabElement);
    } else if (this.activeEditableElement) {
      this.handleTextAction(action);
    }
    
    this.hideContextMenu();
  }
  
  handleTextAction(action) {
    // Asegurar que el elemento tenga el foco
    this.activeEditableElement.focus();
    
    // Restaurar la selección si existe
    if (this.activeSelection) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(this.activeSelection);
    }
    
    // Ejecutar comando correspondiente
    switch (action) {
      case 'copy':
      case 'cut':
        document.execCommand(action, false, null);
        break;
        
      case 'paste':
        navigator.clipboard.readText().then(text => {
          document.execCommand('insertText', false, text);
        });
        break;
        
      case 'undo':
      case 'redo':
        document.execCommand(action, false, null);
        break;
        
      default:
        // Bold, italic, underline, etc.
        document.execCommand(action, false, null);
    }
    
    this.log(`📝 Acción de texto ejecutada: ${action}`);
  }
  
  handlePinTab(tabElement) {
    const isPinned = tabElement.classList.contains('pinned');
    
    if (isPinned) {
      this.unpinTab(tabElement);
    } else {
      this.pinTab(tabElement);
    }
  }
  
  pinTab(tabElement) {
    // Verificar si hay emoticono en el texto del nombre
    const labelSpan = tabElement.querySelector('label span');
    const tabName = labelSpan.textContent.trim();
    const emojiInText = detectEmojiInText(tabName);
    
    // Usar emoji detectado o uno por defecto
    const emoji = emojiInText || '📝';
    
    // Marcar como fijada
    tabElement.classList.add('pinned');
    const label = tabElement.querySelector('label');
    label.setAttribute('data-emoji', emoji);
    labelSpan.dataset.emoji = emoji;
    
    // Reorganizar pestañas
    this.reorderTabs();
    
    // Guardar cambios (necesitarás acceder al TabManager)
    this.saveTabChanges();
    
    this.log('📍 Pestaña fijada:', tabName);
  }
  
  unpinTab(tabElement) {
    // Quitar marca de fijada
    tabElement.classList.remove('pinned');
    const label = tabElement.querySelector('label');
    const labelSpan = tabElement.querySelector('label span');
    
    label.removeAttribute('data-emoji');
    delete labelSpan.dataset.emoji;
    
    // Reorganizar pestañas
    this.reorderTabs();
    
    // Guardar cambios
    this.saveTabChanges();
    
    this.log('📍 Pestaña desfijada');
  }
  
  reorderTabs() {
    const tabList = document.querySelector('.tab-list');
    const createTabButton = document.getElementById('create-tab');
    
    if (!tabList || !createTabButton) return;
    
    const allTabs = Array.from(tabList.querySelectorAll('.tab-list__item'));
    
    // Separar pestañas fijadas y normales
    const pinnedTabs = allTabs.filter(tab => tab.classList.contains('pinned'));
    const normalTabs = allTabs.filter(tab => !tab.classList.contains('pinned'));
    
    // Remover todas las pestañas del DOM
    allTabs.forEach(tab => tab.remove());
    
    // Reinsertar en orden: primero las fijadas, luego las normales
    pinnedTabs.forEach(tab => {
      tabList.insertBefore(tab, createTabButton);
    });
    
    normalTabs.forEach(tab => {
      tabList.insertBefore(tab, createTabButton);
    });
    
    this.log('🔄 Pestañas reordenadas');
  }
  
  saveTabChanges() {
    // Esta función necesita acceder al TabManager para guardar
    // Por ahora, dispara un evento global que el TabManager puede escuchar
    const event = new CustomEvent('tabsChanged');
    document.dispatchEvent(event);
  }
  
  setupMiddleClick() {
    // Cerrar pestañas con clic medio
    document.addEventListener('auxclick', (e) => {
      if (e.button === 1) { // Botón medio del ratón
        const isTabLabel = e.target.closest('.tab-list__item label');
        if (isTabLabel) {
          e.preventDefault();
          const tabElement = e.target.closest('.tab-list__item');
          
          // Disparar evento para que TabManager maneje la eliminación
          const event = new CustomEvent('middleClickTab', {
            detail: { tabElement }
          });
          document.dispatchEvent(event);
          
          this.log('🖱️  Clic medio detectado en pestaña');
        }
      }
    });
    
    this.log('✅ Clic medio configurado');
  }
  
  log(...args) {
    if (this.options.debug) {
      console.log('[ContextMenu]', ...args);
    }
  }
  
  debug() {
    return {
      options: this.options,
      elements: {
        contextMenu: !!this.contextMenu,
        activeEditable: !!this.activeEditableElement,
        activeTab: !!this.activeTabElement
      }
    };
  }
}