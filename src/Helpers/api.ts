// Generic API request helper
const APIURL = import.meta.env.VITE_BACKEND_URL;

/**
 * Performs a fetch to the given endpoint and parses JSON.
 * @param path - API path relative to base URL.
 * @param options - Fetch options.
 * @throws {Error} if response is not ok.
 */
export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${APIURL}${path}`, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error [${res.status}]: ${text}`);
  }
  return res.json() as Promise<T>;
}
