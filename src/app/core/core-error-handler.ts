import { Injectable, ErrorHandler } from '@angular/core';

export class CoreErrorHandler implements ErrorHandler {
  constructor() {}
  /// 若已经在订阅的err中处理了,这里就不会再处理
  handleError(error: any): void {
    console.error(error, 'deal error by errorhandler');
  }
}
