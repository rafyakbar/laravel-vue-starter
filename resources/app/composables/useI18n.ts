import { usePreferencesStore } from '@/stores/preferences'
import en from '@/locales/en'
import id from '@/locales/id'

const messages = { en, id } as const

/**
 * Recursive type that produces dot-notation keys for a nested object.
 * e.g. { nav: { site: string } } → 'nav' | 'nav.site'
 */
type Path<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object ? K | `${K}.${Path<T[K]>}` : K
    }[keyof T & string]
  : never

export type LocaleKey = Path<typeof en>

/**
 * Resolve a dot-notation key against a locale object.
 */
function resolve(obj: unknown, key: string): string {
  return key.split('.').reduce<unknown>((current, part) => {
    if (current && typeof current === 'object') {
      return (current as Record<string, unknown>)[part]
    }
    return undefined
  }, obj) as string ?? key
}

/**
 * Replace {placeholder} tokens in a string with values from params.
 */
function interpolate(template: string, params: Record<string, string | number>): string {
  let result = template
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value))
  }
  return result
}

/**
 * Lightweight i18n composable.
 * Returns a t() function that resolves locale keys reactively.
 * Supports {placeholder} interpolation via the optional params argument.
 *
 * Reactivity: t() reads prefs.locale on each call, so Vue's
 * template reactivity re-renders components when locale changes.
 */
export function useI18n() {
  const prefs = usePreferencesStore()

  function t(key: LocaleKey, params?: Record<string, string | number>): string {
    const resolved = resolve(messages[prefs.locale], key)
    return params ? interpolate(resolved, params) : resolved
  }

  return { t }
}
