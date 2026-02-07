export const getBackendUrl = (endpoint, params = {}) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  // Create a URLSearchParams object
  const searchParams = new URLSearchParams();

  // Append params to searchParams
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}${endpoint}?${queryString}` : `${baseUrl}${endpoint}`;
};
