export enum ResultStatus {
  success = 200,
  unAuth = 401,
  error = 600,
  fail = 800,
}
export interface CommonResult<T> {
  code: ResultStatus;
  data: T;
  msg: string;
}
