import { onMounted, onUnmounted, ref } from 'vue'

export function useScrollAnimation() {
  const observer = ref<IntersectionObserver | null>(null)

  function observe(el: Element) {
    if (observer.value) {
      observer.value.observe(el)
    }
  }

  function unobserve(el: Element) {
    if (observer.value) {
      observer.value.unobserve(el)
    }
  }

  onMounted(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      document.querySelectorAll('[data-animate]').forEach((el) => {
        el.classList.add('animate-visible')
      })
      return
    }

    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible')
            observer.value?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.value?.observe(el)
    })
  })

  onUnmounted(() => {
    observer.value?.disconnect()
  })

  return { observe, unobserve }
}
