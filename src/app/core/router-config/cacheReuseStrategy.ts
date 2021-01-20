import {
  RouteReuseStrategy,
  DefaultUrlSerializer,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  ActivatedRoute,
  Params,
} from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { CacheRoutersService, cacheRoutersService } from './cache-routers.service';

/**
 * @description 要服用的路由的组件只会执行一次OnInit, 不会执行destroy,
 * 所以需要在监听路由事件中去手动调用初始化方法，
 * 统一使用initData方法名
 * 如果要destory,同init, 目前统一在layout-default的路由监听事件中统一处理
 */
export class CacheReuseStrategy implements RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // 默认所有路由不复用 可通过给路由配置项增加data: { keep: true }来进行选择性使用
    // {path: 'search', component: SearchComponent, data: {keep: true}},
    if (route.data.keep) {
      return true;
    } else {
      return false;
    }
  }

  // 要被缓存的路由离开时, 再次进入缓存的路由时触发, 再次进入时，handle为null
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    // 按path作为key存储路由快照&组件当前实例对象
    const key = this.getCurrentUrl(route);
    if (handle) {
      cacheRoutersService.update(key, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // 在缓存中有的都认为允许还原路由.
    const key = this.getCurrentUrl(route);
    return !!route.routeConfig && !!cacheRoutersService.cacheRouters[key];
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    // 从缓存中获取快照，若无则返回null
    const key = this.getCurrentUrl(route);
    if (
      !route.routeConfig ||
      route.routeConfig.loadChildren ||
      !cacheRoutersService.cacheRouters[key]
    ) {
      return null;
    }
    return cacheRoutersService.cacheRouters[key];
  }

  // 进入路由触发
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // 同一路由时复用路由
    return future.routeConfig === curr.routeConfig;
  }

  // 获取当前路由,从父级开始,
  private getCurrentUrl(route: ActivatedRouteSnapshot): string {
    if (route.pathFromRoot.length) {
      return route.pathFromRoot
        .filter((r) => !!r.routeConfig)
        .map((r) => r.routeConfig.path)
        .join('/');
    }
  }
}
