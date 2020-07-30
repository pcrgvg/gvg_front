import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponseBase
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '@/environments/environment';


@Injectable()
export class CoreInterceptor implements HttpInterceptor {

  constructor( ) {}

  handleData(ev: HttpResponseBase): Observable<any>  {
    return of(ev)
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const req =  request.clone({
      headers: request.headers.set('token', 'token11111111'),
      url: environment.baseUrl +  request.url
    })
    return next.handle(req).pipe(
      map(ev => {
        if(ev instanceof HttpResponseBase) {
          return this.handleData(ev);
        } 
        return ev;
      }),
      catchError((err: HttpErrorResponse) => {
        return this.handleData(err)
      })
    );
  }
}
