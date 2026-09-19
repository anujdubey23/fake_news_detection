// API client for NewsLens AI
const PRIMARY_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const FALLBACK_LOCAL_URL = 'http://localhost:5002';

let activeApiUrl = PRIMARY_API_URL;

async function requestWithFallback(endpoint, options = {}) {
  const url = `${activeApiUrl}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // If using default port 5000 and it failed due to connection refused / network error,
    // automatically try port 5002 (macOS AirPlay fallback)
    if (activeApiUrl === 'http://localhost:5000' && error.name === 'TypeError') {
      console.warn(`[NewsLens API] Connection to ${activeApiUrl} failed. Trying local fallback ${FALLBACK_LOCAL_URL}...`);
      try {
        const fallbackRes = await fetch(`${FALLBACK_LOCAL_URL}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
          },
        });
        if (fallbackRes.ok) {
          activeApiUrl = FALLBACK_LOCAL_URL;
          console.info(`[NewsLens API] Switched active backend URL to ${FALLBACK_LOCAL_URL}`);
          return await fallbackRes.json();
        }
      } catch (fallbackError) {
        // Fall back to original error below
      }
    }
    throw error;
  }
}

export async function checkHealth() {
  return await requestWithFallback('/health', { method: 'GET' });
}

export async function getModelMetrics() {
  return await requestWithFallback('/metrics', { method: 'GET' });
}

export async function analyzeNews(text) {
  return await requestWithFallback('/analyze', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function predictNews(text) {
  return await requestWithFallback('/predict', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function explainNews(text, prediction, confidence, top_keywords = []) {
  return await requestWithFallback('/explain', {
    method: 'POST',
    body: JSON.stringify({ text, prediction, confidence, top_keywords }),
  });
}

export function getActiveApiUrl() {
  return activeApiUrl;
}
