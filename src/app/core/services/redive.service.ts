import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class RediveService {
  baseUrlSub: BehaviorSubject<string> = new BehaviorSubject('https://redive.estertion.win/');
  winSource = 'https://redive.estertion.win/';
  ossSource = 'https://pcr-icon.oss-cn-beijing.aliyuncs.com/';
  iconBase = 'icon/unit/{0}.webp';
  constructor(private storageSrc: StorageService) {
    this.baseUrlSub.next(this.storageSrc.localGet('imageBase', 'https://redive.estertion.win/'));
  }

  addIconUrl(prefabId: number, rarity: number = 3): string {
    if (prefabId >= 100000 && prefabId < 199999) {
      prefabId += rarity < 6 ? 30 : 60;
    }
    return this.baseUrlSub.getValue() + this.iconBase.replace('{0}', prefabId.toString());
  }

  changeImgSource(url: string) {
    if (this.baseUrlSub.getValue() !== url) {
      this.baseUrlSub.next(url);
      this.storageSrc.localSet('imageBase', url);
    }
  }

  baseUrlOb() {
    return this.baseUrlSub.asObservable();
  }
}
