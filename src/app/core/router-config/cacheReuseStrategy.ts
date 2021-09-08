import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { Injectable } from '@angular/core';
import { RouterCacheService } from './router-cache.service';

/**
 * @description 
 * 
 */
@Injectable({
  providedIn: 'root',
})
export class CacheReuseStrategy implements RouteReuseStrategy {
  constructor(private routerCacheSrv: RouterCacheService) { }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // 默认所有路由不复用 可通过继承 Routekeep类则缓存,在构造函数中执行某些函数可能会报错,列如引入的observe
    const componentClass: any = route?.component?.valueOf();
    if (componentClass) {
      const component = new componentClass();
      if (component.NG_ROUTE_KEEP) {
        return true;
      }
    }
    return false;
  }

  // 被缓存的路由离开时, 再次进入缓存的路由时触发, 再次进入时，handle为null,离开handle不为null
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    // 按path作为key存储路由快照&组件当前实例对象

    const key = this.getCurrentUrl(route);
    if (handle) {
      // 离开路由handle不为null
      (handle as any)?.componentRef?.instance?.ngOnDeActived?.();
      this.routerCacheSrv.update(key, handle);
    } else {
      const component = this.routerCacheSrv.cacheRouters[key];
      component?.componentRef?.instance?.ngOnActived?.();
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // 在缓存中有的都认为允许还原路由.
    // console.log('shouldAttach')
    const key = this.getCurrentUrl(route);
    return !!route.routeConfig && !!this.routerCacheSrv.cacheRouters[key];
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    // 从缓存中获取快照，若无则返回null
    const key = this.getCurrentUrl(route);
    if (
      !route.routeConfig ||
      route.routeConfig.loadChildren ||
      !this.routerCacheSrv.cacheRouters[key]
    ) {
      return null;
    }
    return this.routerCacheSrv.cacheRouters[key];
  }

  // 进入路由触发
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // 同一路由时复用路由,会执行多次
    return future.routeConfig === curr.routeConfig;
  }

  // 获取当前路由,从父级开始,不带路由参数
  private getCurrentUrl(route: ActivatedRouteSnapshot): string {
    if (route.pathFromRoot.length) {
      return route.pathFromRoot
        .filter((r) => !!r.routeConfig)
        .map((r) => r.routeConfig.path)
        .join('/');
    }
  }
}
