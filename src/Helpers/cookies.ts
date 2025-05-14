
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
