export interface IStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string, expire?: number): void;
  removeItem(key: string): void;
}