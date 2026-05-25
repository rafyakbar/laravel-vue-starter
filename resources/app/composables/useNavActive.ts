import { useRoute } from 'vue-router'

export function useNavActive() {
  const route = useRoute()

  function isActive(routeName: string): boolean {
    return route.name === routeName
  }

  return { isActive }
}
