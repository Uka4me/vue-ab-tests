import { IStorage } from "../types/IStorage";

export class CookieStorage implements IStorage {
  /**
   * Retrieves the value of a cookie with the specified key.
   *
   * @param {string} key - The key of the cookie to retrieve.
   * @return {string | null} The value of the cookie, or null if the cookie does not exist.
   */
  getItem(key: string): string | null {
    const cookie = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${key}=`));
    if (!cookie) {
      return null;
    }
    return cookie.split('=')[1];
  }

  /**
   * Sets a cookie with the specified key and value, and an optional expiration time.
   *
   * @param {string} key - The key of the cookie to set.
   * @param {string} value - The value of the cookie to set.
   * @param {number} [expire] - The number of days until the cookie expires. If not provided, the cookie will not expire.
   * @return {void} This function does not return a value.
   */
  setItem(key: string, value: string, expire?: number): void {
    const date = new Date();
    if (expire) {     
      date.setTime(date.getTime() + expire * 24 * 60 * 60 * 1000);
    }
    document.cookie = `${key}=${value};expires=${date.toUTCString()}`;
  }

  /**
   * Removes a cookie with the specified key by setting its expiration date to a past date.
   *
   * @param {string} key - The key of the cookie to remove.
   * @return {void} This function does not return a value.
   */
  removeItem(key: string): void {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  }
}