const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.details?.join(', ') || data.error || 'Something went wrong')
  }

  return data
}

export function predictRent(payload) {
  return request('/predict', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getModels() {
  return request('/models')
}
