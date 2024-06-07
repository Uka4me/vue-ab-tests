import { IStorage } from "../types/IStorage";
import { CookieStorage } from "./cookie";
import { LocalStorage } from "./localstorage";

export enum StorageType {
  LocalStorage = 'localstorage',
  Cookie = 'cookie',
}

export class StorageFabric {
  /**
   * Returns an instance of IStorage based on the specified type.
   *
   * @param {StorageType} type - The type of storage to retrieve. Valid values are 'localstorage' and 'cookie'.
   * @return {IStorage} An instance of IStorage based on the specified type.
   */
  static getStorage(type: StorageType): IStorage {
    switch (type) {
      case StorageType.LocalStorage:
        return new LocalStorage();
      case StorageType.Cookie:
        return new CookieStorage();
      default:
        return new LocalStorage();
    }
  }
}