import { auth } from '../firebase';

/**
 * Fetch wrapper that automatically includes Firebase ID token in Authorization header
 * @param {string} url - The URL to fetch
 * @param {RequestInit} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Response>} - The fetch response
 */
export async function fetchWithAuth(url, options = {}) {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No authenticated user');
    }

    const idToken = await user.getIdToken();

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${idToken}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Clone before reading body so the original response body isn't consumed
      const cloned = response.clone();
      const errorData = await cloned.json().catch(() => ({}));

      if (errorData.code === 'TOKEN_EXPIRED') {
        console.log('Token expired, refreshing...');
        const newToken = await user.getIdToken(true);
        return fetch(url, {
          ...options,
          headers: { ...options.headers, 'Authorization': `Bearer ${newToken}` },
        });
      }
    }

    return response;
  } catch (error) {
    console.error('fetchWithAuth error:', error);
    throw error;
  }
}
