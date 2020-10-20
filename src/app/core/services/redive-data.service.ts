import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chara } from '@models';

@Injectable({
  providedIn: 'root',
})
export class RediveDataService {
  private unHaveCharaSub = new BehaviorSubject<Chara[]>([]);
  private charaListSub = new BehaviorSubject<Chara[]>([]);
  constructor() {
    // this.unHaveCharaSub.subscribe(charas => {
    //   this._unHaveChara = charas;
    // })
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
}
