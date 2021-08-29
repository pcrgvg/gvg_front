/**
 * 实现当路由被缓存之后,再次进入/离开路由的时候执行的方法
 */
export interface RoutekeepMixin {
    // 被缓存后进入路由触发
    ngOnActived(): void;
  // 被缓存后离开路由触发
    ngOnDeActived(): void;
}

/**
 * 继承此类则自动缓存路由
 */
export abstract class Routekeep  {
     ROUTE_KEEP = true;

}