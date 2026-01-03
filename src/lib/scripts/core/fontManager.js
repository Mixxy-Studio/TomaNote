// src/lib/scripts/core/fontManager.js
export class FontManager {
  constructor() {
    this.defaultFont = 'Raleway';
    this.fontFallback = 'sans-serif, serif';
  }

  loadCustomFont() {
    const fontUrl = localStorage.getItem('customFontUrl');
    
    if (!fontUrl) {
      this.applyFontToNotes(this.defaultFont);
      return;
    }
    
    try {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontUrl;
      document.head.appendChild(link);
      
      const match = fontUrl.match(/[?&]family=([^:&]*)/);
      if (match && match[1]) {
        const family = decodeURIComponent(match[1].split(':')[0].replace(/\+/g, ' '));
        this.applyFontToNotes(family);
        localStorage.setItem('customFontName', family);
      }
      
    } catch (error) {
      this.applyFontToNotes(this.defaultFont);
    }
  }

  applyFontToNotes(fontFamily) {
    
    // Actualizar variable CSS
    document.documentElement.style.setProperty(
      '--font-family-notes', 
      `'${fontFamily}', ${this.fontFallback}`
    );
    
    // Aplicar a elementos existentes
    const noteElements = document.querySelectorAll(
      '.tab-list__item--content, .tab-list__item label span'
    );
    
    noteElements.forEach(element => {
      element.style.fontFamily = `'${fontFamily}', ${this.fontFallback}`;
    });
  }

  changeNoteFont(fontUrl, fontName) {
    try {
      localStorage.setItem('customFontUrl', fontUrl);
      localStorage.setItem('customFontName', fontName);
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontUrl;
      document.head.appendChild(link);
      
      this.applyFontToNotes(fontName);
      return true;
      
    } catch (error) {
      return false;
    }
  }

  resetNoteFont() {
    localStorage.removeItem('customFontUrl');
    localStorage.removeItem('customFontName');
    this.applyFontToNotes(this.defaultFont);
  }
}