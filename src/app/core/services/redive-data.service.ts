import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chara } from '@models';
import { StorageService } from './storage.service';

export const unHaveCharas = 'unHaveCharas';

@Injectable({
  providedIn: 'root',
})
export class RediveDataService {
  private unHaveCharaSub = new BehaviorSubject<Chara[]>([]);
  private charaListSub = new BehaviorSubject<Chara[]>([]);
  private rankListSub = new BehaviorSubject<number[]>([]);
  constructor(private storageSrv: StorageService) {
    this._init();
  }

  _init() {
    const data = this.storageSrv.localGet(unHaveCharas);
    this.setUnHaveChara(data ?? []);
  }

  setUnHaveChara(charas: Chara[]) {
    this.unHaveCharaSub.next(charas);
  }

  getUnHaveCharaOb(): Observable<Chara[]> {
    return this.unHaveCharaSub.asObservable();
  }

  get unHaveCharas(): Chara[] {
    return this.unHaveCharaSub.getValue();
  }

  setCharaList(charas: Chara[]) {
    this.charaListSub.next(charas);
  }

  getCharaListOb(): Observable<Chara[]> {
    return this.charaListSub.asObservable();
  }

  get charaList() {
    return this.charaListSub.getValue();
  }

  setRankList(rankList: number[]) {
    this.rankListSub.next(rankList);
  }

  getRankListOb(): Observable<number[]> {
    return this.rankListSub.asObservable();
  }

  get rankList() {
    return this.rankListSub.getValue();
  }

  get front(): Chara[] {
    return this.charaList?.filter((chara) => {
      return chara.searchAreaWidth < 300;
    });
  }

  get middle(): Chara[] {
    return this.charaList?.filter((chara) => {
      return chara.searchAreaWidth > 300 && chara.searchAreaWidth < 600;
    });
  }

  get back(): Chara[] {
    return this.charaList?.filter((chara) => {
      return chara.searchAreaWidth > 600;
    });
  }
}
