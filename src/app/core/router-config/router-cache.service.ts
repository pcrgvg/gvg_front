import { Injectable } from '@angular/core';
import { DetachedRouteHandle } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterCacheService {
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
