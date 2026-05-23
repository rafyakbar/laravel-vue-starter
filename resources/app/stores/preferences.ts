import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark' | 'system'
export type Locale = 'en' | 'id'

/**
 * Module-level listener reference so it can be removed when theme changes.
 */
let mediaQueryListener: ((e: MediaQueryListEvent) => void) | null = null
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

/**
 * Apply the given theme to the document.
 * Manages the system media query listener to avoid memory leaks.
 */
export function applyTheme(theme: Theme): void {
  // Remove any existing system listener before applying new theme
  if (mediaQueryListener) {
    mediaQuery.removeEventListener('change', mediaQueryListener)
    mediaQueryListener = null
  }

  if (theme === 'system') {
    const apply = (matches: boolean) => {
      document.documentElement.classList.toggle('dark', matches)
    }
    apply(mediaQuery.matches)
    mediaQueryListener = (e) => apply(e.matches)
    mediaQuery.addEventListener('change', mediaQueryListener)
  } else {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }
}

export const usePreferencesStore = defineStore('preferences', () => {
  const theme = ref<Theme>(
    (localStorage.getItem('theme') as Theme | null) ?? 'system',
  )

  const locale = ref<Locale>(
    (localStorage.getItem('locale') as Locale | null) ?? 'en',
  )

  watch(theme, (val) => {
    localStorage.setItem('theme', val)
    applyTheme(val)
  })

  watch(locale, (val) => {
    localStorage.setItem('locale', val)
  })

  return { theme, locale }
})
