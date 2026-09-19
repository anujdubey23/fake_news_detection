// API client for NewsLens AI
// In production on Vercel, fallback directly to the live Render backend:
const PRODUCTION_BACKEND_URL = 'https://newslens-ai-backend.onrender.com';
const PRIMARY_API_URL = import.meta.env.VITE_API_URL || PRODUCTION_BACKEND_URL;
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
    // If local fetch failed, try the production Render backend automatically
    if (activeApiUrl !== PRODUCTION_BACKEND_URL) {
      console.warn(`[NewsLens API] Connection to ${activeApiUrl} failed. Trying production backend ${PRODUCTION_BACKEND_URL}...`);
      try {
        const fallbackRes = await fetch(`${PRODUCTION_BACKEND_URL}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
          },
        });
        if (fallbackRes.ok) {
          activeApiUrl = PRODUCTION_BACKEND_URL;
          console.info(`[NewsLens API] Connected to live backend at ${PRODUCTION_BACKEND_URL}`);
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
