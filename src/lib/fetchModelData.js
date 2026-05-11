/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the request.
 * @param {object} options  Optional: { method, body, headers }
 *
 */
async function fetchModel(url, options = {}) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL || "";
  const fullUrl = baseUrl + url;
  
  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export default fetchModel;
