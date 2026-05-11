/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
async function fetchModel(url) {
  const baseUrl = process.env.REACT_APP_API_BASE_URL || '';
  const fullUrl = baseUrl + url;
  const response = await fetch(fullUrl, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export default fetchModel;
