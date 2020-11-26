import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  isObject(value: any) {
    return value !== null && typeof value === 'object';
  }

  parse(value: string) {
    let [data, err] = [value, null];
    try {
      data = JSON.parse(value);
    } catch (error) {
      err = error;
    }

    return [data, err];
  }

  stringify(value: any): [string, null | Error] {
    let [data, err] = [value, null];
    try {
      data = JSON.stringify(value);
    } catch (error) {
      err = error;
    }

    return [data, err];
  }

  /**
   *
   * @param key
   * @param value
   */
  sessionSet(key: string, value: any) {
    let data = value;
    if (Array.isArray(value) || this.isObject(value)) {
      [data] = this.stringify(value);
    }
    sessionStorage.setItem(key, data);
  }
  /**
   *  return null or value
   * @param key
   */
  sessionGet(key: string) {
    const value = sessionStorage.getItem(key);
    let [data, err] = this.parse(value);
    return data;
  }

  sessionRemove(key: string) {
    sessionStorage.removeItem(key);
  }

  sessionClear() {
    sessionStorage.clear();
  }

  /// local

  localSet(key: string, value: any) {
    let data = value;
    if (Array.isArray(value) || this.isObject(value)) {
      [data] = this.stringify(value);
    }
    localStorage.setItem(key, data);
  }

  /**
   *  return null or value
   * @param key
   */
  localGet(key: string) {
    const value = localStorage.getItem(key);
    let [data] = this.parse(value);
    return data;
  }

  localRemove(key: string) {
    localStorage.removeItem(key);
  }

  localClear() {
    localStorage.clear();
  }

  /**
   * clear sessionStorage, localStorage
   */
  clearAll() {
    this.sessionClear();
    this.localClear();
  }
}
