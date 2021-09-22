import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { StorageService } from './storage.service';
import CryptoES from 'crypto-es';
import { localforageName, storageNames } from '@src/app/constants';
import { RequestCacheService } from '../net/request-cache.service';
import { DbApiService } from '@app/apis';
import { timeout } from 'rxjs/operators';
import { unHaveCharas } from './redive-data.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  s =
    '+((+!![]+[])+(!+[]+!![]+[])+(!+[]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+!![]+!![]+[]))';
  constructor(
    private storageSrv: StorageService,
    private dbApiSrv: DbApiService,
    private requestCacheSrv: RequestCacheService
  ) {}

   init() {
    this.configLocalforage();
    this.configToken();
    this.checkVersion();
    console.log('config init');
  }

  async checkVersion() {
    const dbVersion =
      (await localforage.getItem(localforageName.dbVersion)) ?? {};
    const res = await this.dbApiSrv
      .getVersion()
      .pipe(timeout(10000))
      .toPromise();
    localforage.setItem(localforageName.dbVersion, res);
    for (const server in res) {
      if (res[server]?.version !== dbVersion[server]?.version) {
        this.requestCacheSrv.clear();
      }
      if (res[server]?.clanBattleId !== dbVersion[server]?.clanBattleId) {
        const unCharas = this.storageSrv.localGet(unHaveCharas);
        this.storageSrv.localClear();
        localforage.clear();
        this.storageSrv.localSet(unHaveCharas, unCharas);
      }
    }
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
    const t = CryptoES.SHA1((nowDate.substr(l) + eval(this.s))).toString();
    // const t = SHA1.update(nowDate.substr(l) + eval(this.s)).digest('hex');
    const token = {
      d: nowDate,
      l,
      t,
    };
    this.storageSrv.sessionSet(storageNames.token, token);
  }
}
