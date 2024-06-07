import { IStorage } from "../types/IStorage";

export class LocalStorage implements IStorage {
  /**
   * Retrieves the value of an item from the local storage by its key.
   *
   * @param {string} key - The key of the item to retrieve.
   * @return {string | null} The value of the item, or null if the item does not exist or has expired.
   */
  getItem(key: string): string | null {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }

    const { value, date } = JSON.parse(item);

    if (new Date(date) < new Date()) {
      this.removeItem(key);
      return null;
    }
    
    return value;
  }

  /**
   * Sets an item in the local storage with the specified key and value.
   * If an expiration time is provided, the item will be automatically removed after the specified number of days.
   *
   * @param {string} key - The key of the item to set.
   * @param {string} value - The value of the item to set.
   * @param {number} [expire] - The number of days until the item expires. If not provided, the item will not expire.
   * @return {void} This function does not return a value.
   */
  setItem(key: string, value: string, expire?: number): void {
    const date = new Date();
    if (expire) {     
      date.setTime(date.getTime() + expire * 24 * 60 * 60 * 1000);
    }
    localStorage.setItem(key, JSON.stringify({ value, date: date.toUTCString() }));
  }

  /**
   * Removes an item from the local storage by its key.
   *
   * @param {string} key - The key of the item to be removed.
   * @return {void} This function does not return a value.
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}