/**
 * 实现当路由被缓存之后,再次进入/离开路由的时候执行的方法
 */

export interface OnActived {
   // 被缓存后进入路由触发
   ngOnActived(): void;
}

export interface OnDeActived {
   // 被缓存后离开路由触发
  ngOnDeActived(): void;
}
/**
 * true 缓存路由
 */
export interface RouteKeep {
  NG_ROUTE_KEEP: boolean;
}
