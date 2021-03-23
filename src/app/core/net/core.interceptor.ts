import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponseBase,
  HttpResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { environment } from '@src/environments/environment';
import { CommonResult, ResultStatus } from '@src/app/models';
import { RequestCacheService } from './request-cache.service';
import { StorageService } from '../services/storage.service';
import { storageNames } from '@src/app/constants';
import { NzNotificationService } from 'ng-zorro-antd/notification';


interface Token {
  d: string; // 日期 ms
  l: number; // 取时间的长度
  t: string; // 生成的token
}

@Injectable()
export class CoreInterceptor implements HttpInterceptor {
  constructor(private requestCacheSrv: RequestCacheService, private notificationSrc: NzNotificationService, private storageSrv: StorageService) {}

  handleData(req: HttpRequest<any>, ev: HttpResponseBase, isCache: boolean): Observable<any> {
    if (ev.ok) {
      if (ev instanceof HttpResponse) {
        const body: CommonResult<any> = ev.body;
        if (body.code === ResultStatus.success) {
          if (isCache) {
            this.requestCacheSrv.put(req, new HttpResponse(Object.assign(ev, { body: body.data })));
          }

          return of(new HttpResponse(Object.assign(ev, { body: body.data })));
        } else {
          return throwError(new Error(body.msg));
        }
      }
    } else {
      return throwError(new Error('statuscode not in range 200'));
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.storageSrv.sessionGet<Token>(storageNames.token);
    const req = request.clone({
      setHeaders: {
        d: token?.d ?? '',
        l: `${token?.l}`,
        t: token?.t ?? '',
      },
      url: environment.baseUrl + request.url,
    });
    const isCache = this.requestCacheSrv.isCacheable(request);
    const cachedResponse: HttpResponse<any> = this.requestCacheSrv.get(req);
    if (cachedResponse) {
      return of(new HttpResponse({
        body: cachedResponse.body,
        headers: cachedResponse.headers,
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        url: cachedResponse.url
      }));
    } else {
      return next.handle(req).pipe(
        mergeMap((ev) => {
          if (ev instanceof HttpResponseBase) {
            return this.handleData(req, ev, isCache);
          }
          return of(ev);
        }),
        catchError((err) => {
          this.notificationSrc.error('', err.message);
          throw err;
        }),
      );
    }
  }
}
