import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { StorageService } from './storage.service';
import { SHA1 } from 'crypto-js';
import { storageNames } from '@src/app/constants';




@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  s = '+((+!![]+[])+(!+[]+!![]+[])+(!+[]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+!![]+!![]+[]))';
  constructor(private storageSrv: StorageService,) {}

  init() {
    this.configLocalforage();
    this.configToken();
  }

  configLocalforage() {
    localforage.config({
      driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
      name: 'NgPcr',
    });
  }

  configToken() {
    const nowDate = new Date().getTime().toFixed();
    const l = Math.random() * 10 * nowDate.length;
    const t = SHA1(nowDate.substr(l) + eval(this.s)).toString();
    const token = {
      d: nowDate,
      l,
      t
    };
    this.storageSrv.sessionSet(storageNames.token, token)
  }
  
}
