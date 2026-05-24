import { watch } from 'vue'
import { useRoute } from 'vue-router'

export interface SeoMetaOptions {
  title: string
  description: string
  canonical?: string
  image?: string
  noIndex?: boolean
}

const SITE_NAME = import.meta.env.VITE_APP_NAME || 'Laravel Vue Starter'
const DEFAULT_IMAGE = '/social-share.png'
const SITE_URL = import.meta.env.VITE_APP_URL || 'http://localhost:8000'

function setMetaTag(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setPropertyTag(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function removeMetaTag(name: string) {
  const el = document.querySelector(`meta[name="${name}"]`)
  if (el) el.remove()
}

function removePropertyTag(property: string) {
  const el = document.querySelector(`meta[property="${property}"]`)
  if (el) el.remove()
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function removeCanonical() {
  const el = document.querySelector('link[rel="canonical"]')
  if (el) el.remove()
}

export function useSeoMeta(options: SeoMetaOptions) {
  const route = useRoute()

  function applyMeta() {
    const fullTitle = `${options.title} | ${SITE_NAME}`
    const url = options.canonical || `${SITE_URL}${route.path}`
    const image = options.image || DEFAULT_IMAGE

    document.title = fullTitle

    setMetaTag('description', options.description)

    if (options.noIndex) {
      setMetaTag('robots', 'noindex, nofollow')
    } else {
      removeMetaTag('robots')
    }

    setCanonical(url)

    setPropertyTag('og:title', options.title)
    setPropertyTag('og:description', options.description)
    setPropertyTag('og:type', 'website')
    setPropertyTag('og:url', url)
    setPropertyTag('og:image', image)
    setPropertyTag('og:site_name', SITE_NAME)

    setMetaTag('twitter:card', 'summary_large_image')
    setMetaTag('twitter:title', options.title)
    setMetaTag('twitter:description', options.description)
    setMetaTag('twitter:image', image)
  }

  watch(() => route.path, applyMeta, { immediate: true })
}
