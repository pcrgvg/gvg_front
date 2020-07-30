import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpParams, HttpHeaders } from '@angular/common/http';

type Body = string | {
  [param: string]: string | ReadonlyArray<string>;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService extends HttpClient {
  constructor(handler: HttpHandler) {
    super(handler)
  }

  Get(url: string, body?: any, option: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  } = {}) {
    let params = new HttpParams();
    if ( typeof body === 'string') {
      params = new HttpParams({
        fromString: body
      })
    }
    if ( body instanceof Object) {
      params = new HttpParams({
        fromObject: body
      })
    }
    console.log(params.keys())
   return this.get(url, {
      ...option,
      params,
    })
  }

}
