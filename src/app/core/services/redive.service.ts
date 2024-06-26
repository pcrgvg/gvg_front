import { Injectable, OnInit } from '@angular/core';
import { ServerType } from '@src/app/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { CharaTalent } from '@src/app/constants';

@Injectable({
  providedIn: 'root',
})
export class RediveService {
  baseUrlSub: BehaviorSubject<string> = new BehaviorSubject('https://wthee.xyz/redive/jp/resource/');
  ossSource = 'https://pcr-icon.oss-cn-beijing.aliyuncs.com/';
  winSource = 'https://wthee.xyz/redive/jp/resource/';
  iconBase = 'icon/unit/{0}.webp';
  constructor(private storageSrc: StorageService) {
    this.baseUrlSub.next(this.storageSrc.localGet('imageBase', 'https://wthee.xyz/redive/jp/resource/'));
  }

  addIconUrl(prefabId: number, rarity: number = 3, host?: string): string {
    if (prefabId >= 100000 && prefabId < 199999) {
      prefabId += rarity < 6 ? 30 : 60;
    }
    return (host ?? this.baseUrlSub.getValue()) + this.iconBase.replace('{0}', prefabId.toString());
  }

  addTalentUrl(talentId: number) {
    // https://pcr-icon.oss-cn-beijing.aliyuncs.com/common/fire.png
    if (talentId) {
      const tablent = CharaTalent.filter((r) => r.code == talentId)[0];
      return this.ossSource + `common/${tablent?.name}.png`;
    }
    return '';
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
  // 日服1038期后 4 5合并 value为6
  initStateOption(clanBattleId: number, server: ServerType) {
    if (server === ServerType.jp) {
      // 2021/8
      if (clanBattleId > 1041) {
        return [
          { label: '1+2', value: 1 },
          { label: '3', value: 3 },
          { label: '4+5', value: 6 },
        ];
      }
      // 2021/4
      if (clanBattleId > 1037) {
        return [
          { label: '1', value: 1 },
          { label: '2', value: 2 },
          { label: '3', value: 3 },
          { label: '4+5', value: 6 },
        ];
      }
    }
    if (server === ServerType.tw) {
      return [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4+5', value: 6 },
      ];
    }

    return [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5', value: 5 },
    ];
  }
}
