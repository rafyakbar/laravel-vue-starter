const SITE_NAME = import.meta.env.VITE_APP_NAME || 'Laravel Vue Starter'
const SITE_URL = import.meta.env.VITE_APP_URL || 'http://localhost:8000'
const REPO_URL = 'https://github.com/rafyakbar/laravel-vue-starter'

export function useJsonLd() {
  function injectSoftwareSchema() {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'ld-software'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: SITE_NAME,
      description:
        'A production-ready SPA admin dashboard starter built with Laravel 13 and Vue 3. Provides authentication, role-based access control, media management, and a modern component system.',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Cross-platform',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      author: {
        '@type': 'Organization',
        name: 'Laravel Vue Starter',
      },
      codeRepository: REPO_URL,
      license: 'https://opensource.org/licenses/MIT',
    })
    document.head.appendChild(script)
  }

  function injectBreadcrumbSchema(items: { name: string; url: string }[]) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'ld-breadcrumb'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    })
    document.head.appendChild(script)
  }

  return { injectSoftwareSchema, injectBreadcrumbSchema }
}
