import { Injectable } from '@angular/core';
import {} from '@pcrgvg/models';

@Injectable({
  providedIn: 'root',
})
export class RediveService {
  baseUrl = 'https://redive.estertion.win/';
  iconBase = 'icon/unit/{0}.webp';
  constructor() {}

  addIconUrl(prefabId: number, rarity?: number): string {
    if (prefabId >= 100000 && prefabId < 199999) {
      // prefabId += (rarity < 6 ? 30 : 60);
      prefabId += 30;
    }
    return this.baseUrl + this.iconBase.replace('{0}', prefabId.toString());
  }
}
