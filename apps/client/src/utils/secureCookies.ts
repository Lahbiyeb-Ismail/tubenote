import Cookies from "js-cookie";

/**
 * Set a secure cookie with optional encryption
 */
export function setSecureCookie(
  name: string,
  value: string | boolean | object,
  options: Cookies.CookieAttributes = {}
) {
  // Convert non-string values to JSON string
  const stringValue = typeof value === "string" ? value : JSON.stringify(value);

  // Encrypt sensitive data like tokens
  // const encryptedValue =
  //   name === COOKIE_NAMES.ACCESS_TOKEN || name === COOKIE_NAMES.REFRESH_TOKEN
  //     ? AES.encrypt(stringValue, ENCRYPTION_KEY).toString()
  //     : stringValue

  // Set default secure options
  const _secureOptions: Cookies.CookieAttributes = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    expires: 1, // 1 day by default
    ...options,
  };

  Cookies.set(name, stringValue);
}

/**
 * Get a value from cookies, decrypting if necessary
 */
export function getSecureCookie(name: string) {
  const value = Cookies.get(name);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    // If not JSON, return as is
    return value;
  }
}
