import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { StorageService } from './storage.service';
import { SHA1 } from 'crypto-js';
import { localforageName, storageNames } from '@src/app/constants';
import { RequestCacheService } from '../net/request-cache.service';
import { DbApiService } from '@app/apis';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  s =
    '+((+!![]+[])+(!+[]+!![]+[])+(!+[]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+!![]+!![]+[]))';
  constructor(
    private storageSrv: StorageService,
    private dbApiSrv: DbApiService,
    private requestCacheSrv: RequestCacheService,
  ) {}

  async init() {
    this.configLocalforage();
    this.configToken();
    const versions = (await localforage.getItem(localforageName.dbVersion)) ?? {};
    const res = await this.dbApiSrv.getVersion().toPromise();
    localforage.setItem(localforageName.dbVersion, res)
    for (const server in res) {
      if (res[server] !== versions[server]) {
        this.requestCacheSrv.clear();
      }
    }
    console.log('config init');
  }

  configLocalforage() {
    localforage.config({
      driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
      name: 'NgPcr',
    });
  }

  configToken() {
    const nowDate = new Date().getTime().toFixed();
    const l = Math.random() * nowDate.length;
    const t = SHA1(nowDate.substr(l) + eval(this.s)).toString();
    const token = {
      d: nowDate,
      l,
      t,
    };
    this.storageSrv.sessionSet(storageNames.token, token);
  }
}
