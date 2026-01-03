import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ThemeManager } from './themeManager.js'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

describe('ThemeManager - Lógica Básica', () => {
  let themeManager

  beforeEach(() => {
    vi.clearAllMocks()
    themeManager = new ThemeManager()
    // Reset document attributes
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.classList.remove('light-mode')
  })

  it('Carga tema guardado en localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark')
    themeManager.loadSavedTheme()
    expect(themeManager.currentTheme).toBe('dark')
  })

  it('Usa tema por defecto si no hay guardado', () => {
    localStorageMock.getItem.mockReturnValue(null)
    // Mock matchMedia for system preference
    global.matchMedia = vi.fn().mockReturnValue({ matches: false })
    themeManager.loadSavedTheme()
    expect(themeManager.currentTheme).toBe('light')
  })

  it('Cambia tema correctamente', () => {
    themeManager.switchTheme('cozy-rose')
    expect(themeManager.currentTheme).toBe('cozy-rose')
    expect(document.documentElement.getAttribute('data-theme')).toBe('cozy-rose')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('notepadTheme', 'cozy-rose')
  })

  it('Devuelve lista de temas disponibles', () => {
    const themes = themeManager.getThemes()
    expect(themes).toHaveLength(6)
    expect(themes[0]).toHaveProperty('id', 'dark')
  })

  it('Devuelve tema actual', () => {
    themeManager.currentTheme = 'neon-orbit'
    expect(themeManager.getCurrentTheme()).toBe('neon-orbit')
  })
})