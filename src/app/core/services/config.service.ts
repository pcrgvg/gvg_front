import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { StorageService } from './storage.service';
import { SHA1 } from 'crypto-js';
import { storageNames } from '@src/app/constants';


interface Token {
  d: string, // 日期 ms
  l: number, // 取时间的长度
  t: string // 生成的token
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  s = '+((+!![]+[])+(!+[]+!![]+[])+(!+[]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+!![]+[])+(!+[]+!![]+!![]+!![]+!![]+!![]+[]))';
  token: Token = null;
  constructor(private storageSrv: StorageService) {
  
   }

  init() {
    this.configLocalforage();
    this.configToken();
    console.log('config')
    // return new Promise((resolve, reject) => {

    // })
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
    this.token = {
      d: nowDate,
      l,
      t
    };
    this.storageSrv.sessionSet(storageNames.token, this.token)
  }
  
}
