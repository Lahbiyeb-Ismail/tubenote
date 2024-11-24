/**
 * Retrieves a value from localStorage and parses it as JSON.
 *
 * @template T - The expected type of the stored value.
 * @param {string} key - The key of the item to retrieve from localStorage.
 * @returns {T | null} - The parsed value from localStorage, or null if the key does not exist or an error occurs.
 *
 */
export function getStorageValue<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

/**
 * Sets a value in the local storage.
 *
 * @template T - The type of the value to be stored.
 * @param {string} key - The key under which the value will be stored.
 * @param {T} value - The value to be stored.
 * @returns {void}
 *
 */
export function setStorageValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
}

/**
 * Clears the value associated with the specified key from localStorage.
 *
 * @param {string} key - The key of the item to remove from localStorage.
 * @returns {void}
 *
 */
export function removeStorageValue(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
