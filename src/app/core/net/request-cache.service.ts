import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { pcrApis, ChangelogApis, DbApis } from '@src/app/constants/apiUrls';
import { localforageName } from '@src/app/constants';

@Injectable({
  providedIn: 'root',
})
export class RequestCacheService {
  urlList = [pcrApis.charaList, pcrApis.getRank, pcrApis.stageScore, pcrApis.getClanBattleList];
  // urlList = [pcrApis.getRank];
  private cache: { [key: string]: HttpResponse<any> } = {};

  constructor() {}

  init() {
    return new Promise((resolve, reject) => {
      localforage.getItem<string>(localforageName.cacheHttp).then((r) => {
        this.cache = r ? JSON.parse(r) : {};
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    });

    // console.log('cache init');
  }

  clear() {
    this.cache = {};
    localforage.removeItem(localforageName.cacheHttp);
  }

  isCacheable(req: HttpRequest<any>): boolean {
    return this.urlList.includes(req.url);
  }

  put(req: HttpRequest<any>, res: HttpResponse<any>) {
    this.cache[req.urlWithParams] = res;
    localforage.setItem(localforageName.cacheHttp, JSON.stringify(this.cache));
  }

  get(req: HttpRequest<any>) {
    return this.cache[req.urlWithParams] ?? null;
  }
}
