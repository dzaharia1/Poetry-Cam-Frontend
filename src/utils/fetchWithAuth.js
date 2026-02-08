import { auth } from '../firebase';

/**
 * Fetch wrapper that automatically includes Firebase ID token in Authorization header
 * @param {string} url - The URL to fetch
 * @param {RequestInit} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Response>} - The fetch response
 */
export async function fetchWithAuth(url, options = {}) {
  try {
    // Get current user
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No authenticated user');
    }

    // Get ID token
    const idToken = await user.getIdToken();

    // Merge headers with authorization
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${idToken}`,
    };

    // Make the fetch request with the token
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Check if token expired and retry once
    if (response.status === 401) {
      const errorData = await response.json();
      
      if (errorData.code === 'TOKEN_EXPIRED') {
        console.log('Token expired, refreshing...');
        
        // Force token refresh
        const newToken = await user.getIdToken(true);
        
        // Retry the request with new token
        const retryHeaders = {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        };
        
        return fetch(url, {
          ...options,
          headers: retryHeaders,
        });
      }
    }

    return response;
  } catch (error) {
    console.error('fetchWithAuth error:', error);
    throw error;
  }
}
