import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class RediveService {
  // baseUrl = 'https://redive.estertion.win/';
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

  changeImgSource() {
    if (this.baseUrlSub.getValue() === this.winSource) {
      this.baseUrlSub.next(this.ossSource);
      this.storageSrc.localSet('imageBase', this.ossSource);
    } else {
      this.baseUrlSub.next(this.winSource);
      this.storageSrc.localSet('imageBase', this.winSource);
    }
  }

  baseUrlOb() {
    return this.baseUrlSub.asObservable();
  }
}
