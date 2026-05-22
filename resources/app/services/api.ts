export class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, data: unknown) {
    super(`API Error: ${status}`)
    this.status = status
    this.data = data
  }
}

const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
}

/**
 * Read the XSRF-TOKEN cookie value set by Sanctum.
 * Laravel sets this as a non-httponly cookie so JS can read it.
 */
function getXsrfToken(): string | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))

  if (!match) {
    return null
  }

  return decodeURIComponent(match.split('=')[1])
}

/**
 * Fetch the CSRF cookie from Sanctum before making auth mutations.
 */
export async function getCsrfCookie(): Promise<void> {
  await fetch('/sanctum/csrf-cookie', {
    credentials: 'include',
  })
}

/**
 * Core API wrapper with Sanctum cookie-based auth support.
 */
export async function api<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    ...defaultHeaders,
    ...(options.headers as Record<string, string>),
  }

  // Attach XSRF token header for state-changing requests.
  const xsrfToken = getXsrfToken()
  if (xsrfToken) {
    headers['X-XSRF-TOKEN'] = xsrfToken
  }

  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  })

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, data)
  }

  return data as T
}

/**
 * Shorthand for GET requests.
 */
export function apiGet<T = unknown>(url: string): Promise<T> {
  return api<T>(url, { method: 'GET' })
}

/**
 * Shorthand for POST requests.
 */
export function apiPost<T = unknown>(url: string, body?: unknown): Promise<T> {
  return api<T>(url, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * Shorthand for PUT requests.
 */
export function apiPut<T = unknown>(url: string, body?: unknown): Promise<T> {
  return api<T>(url, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * Shorthand for DELETE requests.
 */
export function apiDelete<T = unknown>(url: string): Promise<T> {
  return api<T>(url, { method: 'DELETE' })
}
