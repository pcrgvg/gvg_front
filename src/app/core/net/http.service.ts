import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

type Body =
  | string
  | {
      [param: string]: string | ReadonlyArray<string>;
    };

@Injectable({
  providedIn: 'root',
})
export class HttpService extends HttpClient {
  constructor(handler: HttpHandler) {
    super(handler);
  }

  Get<T>(
    url: string,
    body?: any,
    option: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    } = {},
  ): Observable<T> {
    let params = new HttpParams();
    if (typeof body === 'string') {
      params = new HttpParams({
        fromString: body,
      });
    }
    if (body instanceof Object) {
      params = new HttpParams({
        fromObject: body,
      });
    }
    return this.get<T>(url, {
      ...option,
      params,
    });
  }
}
