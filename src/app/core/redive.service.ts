import { Injectable } from '@angular/core';
import {} from '@pcrgvg/models';

@Injectable({
  providedIn: 'root',
})
export class RediveService {
  baseUrl = 'https://redive.estertion.win/';
  iconBase = 'icon/unit/';
  constructor() {}

  addIconUrl(prefabId: number, rarity: number): string {
    return this.baseUrl + this.iconBase + `${prefabId + (rarity < 6 ? 30 : 60)}.webp`;
  }
}
