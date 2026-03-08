const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const API_BASE_URL = configuredApiBaseUrl && configuredApiBaseUrl.length > 0 ? configuredApiBaseUrl : '/api'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  token?: string
  body?: unknown
}

export class ApiRequestError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', token, body } = options

  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error(
      'Unable to reach the API. Check that the backend is running and VITE_API_BASE_URL is configured correctly.'
    )
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`

    const rawBody = await response.text()

    try {
      const errorBody = JSON.parse(rawBody) as { message?: string; error?: string }
      message = errorBody.message ?? message
    } catch {
      if (rawBody) {
        message = rawBody.slice(0, 200)
      } else {
        message = response.statusText || message
      }
    }

    throw new ApiRequestError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
