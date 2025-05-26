
/**
 * Get the value of a cookie by name.
 * @param name - Cookie name
 * @returns Cookie value or undefined
 */
export function getCookie(name: string): string | undefined {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? match.split('=')[1] : undefined;
}

/**
 * Delete a cookie by name.
 * @param name - Cookie name
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

/**
 * Retrieve the anonymous id stored in the "anonID" cookie or
 * create one if it doesn't exist.
 *
 * @returns The anonymous id value
 */
export function getOrCreateAnonId(): string {
  const existing = getCookie("anonID");
  if (existing) {
    return existing;
  }

  const id = typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 10);
  document.cookie = `anonID=${id}; path=/; expires=${expires.toUTCString()};`;

  return id;
}
