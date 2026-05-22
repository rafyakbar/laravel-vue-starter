import type { InjectionKey, Ref } from 'vue'

export const FORM_ITEM_INJECTION_KEY = Symbol('form-item') as InjectionKey<Ref<string>>
