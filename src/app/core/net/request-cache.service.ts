import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { pcrApis, ChangelogApis } from '@src/app/constants/apiUrls';


@Injectable({
  providedIn: 'root'
})
export class RequestCacheService {

  urlList = [
    pcrApis.charaList,
    pcrApis.getRank,
    pcrApis.stageScore,
    pcrApis.getClanBattleList,
    ChangelogApis.getChangeLog,
  ]
  private cache: Map<string, HttpResponse<any>> = new Map();

  constructor() { }



  isCacheable(req: HttpRequest<any>): boolean {
    return this.urlList.includes(req.url) 
  }

  put(req: HttpRequest<any>, res: HttpResponse<any>) {
 
    this.cache.set(req.url, res);
  }

  get(req: HttpRequest<any>) {
    return this.cache.get(req.url)
  }
}
