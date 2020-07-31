import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponseBase,
  HttpResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { environment } from '@src/environments/environment';
import { CommonResult, ResultStatus } from '@pcrgvg/models';


@Injectable()
export class CoreInterceptor implements HttpInterceptor {

  constructor() { }

  handleData(ev: HttpResponseBase): Observable<any> {
    if (ev.ok) {
      if (ev instanceof HttpResponse) {
        const body: CommonResult<any> = ev.body;
        if (body.code === ResultStatus.success) {
          return of(new HttpResponse(Object.assign(ev, { body: body.data })));
        }
      }
    }
    return throwError('statuscode not in range 200');


  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const req = request.clone({
      headers: request.headers.set('token', 'token11111111'),
      url: environment.baseUrl + request.url
    });
    return next.handle(req).pipe(
      mergeMap(ev => {
        if (ev instanceof HttpResponseBase) {
          return this.handleData(ev);
        }
        return of(ev);
      }),
      catchError(err => {
        throw new Error(err);

      })
    );
  }
}
