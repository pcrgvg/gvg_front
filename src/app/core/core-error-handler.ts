import { Injectable, ErrorHandler } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root',
})
export class CoreErrorHandler implements ErrorHandler {
  constructor(
    private nzNotificationService: NzNotificationService
  ) {}
  /// 若已经在订阅的err中处理了,这里就不会再处理
  handleError(error): void {
    console.log(error, 'deal error by errorhandler');
    if (error.name != 'TagError') {
      this.nzNotificationService.error('', error?.message ?? error);
    }
  }
}
