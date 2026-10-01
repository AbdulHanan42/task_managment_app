import { API_URL } from '../utils/constants'
import { clearToken, getToken } from '../utils/storage'

let unauthorizedHandler = null

export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = {}, detail = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
    this.detail = detail
  }
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

function validationErrors(detail) {
  if (!Array.isArray(detail)) return {}
  return Object.fromEntries(
    detail
      .filter((item) => Array.isArray(item.loc) && item.loc.length)
      .map((item) => [item.loc[item.loc.length - 1], item.msg]),
  )
}

function messageFor(status, detail) {
  if (typeof detail === 'string') return detail
  if (status === 401) return 'Your session has expired. Please sign in again.'
  if (status === 403) return 'You do not have permission to do that.'
  if (status === 404) return 'The requested item could not be found.'
  if (status === 422) return 'Check the highlighted fields and try again.'
  if (status >= 500) return 'The server could not complete your request.'
  return 'The request could not be completed.'
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  if (!API_URL) throw new ApiError('VITE_API_URL is not configured.')

  const requestHeaders = new Headers(headers)
  const token = getToken()
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`)
  if (body !== undefined) requestHeaders.set('Content-Type', 'application/json')

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection and API URL.')
  }

  if (response.status === 204) return null

  let payload
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      payload = await response.json()
    } catch {
      payload = null
    }
  } else {
    payload = await response.text()
  }

  if (!response.ok) {
    const detail = payload?.detail ?? payload
    const error = new ApiError(messageFor(response.status, detail), {
      status: response.status,
      detail,
      fieldErrors: validationErrors(detail),
    })
    if (response.status === 401 && token) {
      clearToken()
      unauthorizedHandler?.()
    }
    throw error
  }

  return payload
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
