import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CacheRoutersService {
  cacheRouters: { [key: string]: any } = {};
  constructor() {}

  clear() {
    this.cacheRouters = {};
  }

  update(key: string, handle: DetachedRouteHandle) {
    this.cacheRouters[key] = handle;
  }

  delete(key: string) {
    delete this.cacheRouters[key];
  }
}

export const cacheRoutersService = new CacheRoutersService();
