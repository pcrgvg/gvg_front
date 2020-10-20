import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { RediveService } from '@core';

@Component({
  selector: 'app-pcr-icon',
  template: ` <img style="height: 42px; width: 42px;" defaultImage="/assets/images/000001.webp" [lazyLoad]="src" /> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PcrIconComponent implements OnInit, OnChanges {
  private _src = '';
  constructor(private redive: RediveService) {}

  @Input()
  set prefabId(prefabId: number) {
    if (prefabId) {
      this._src = this.redive.addIconUrl(prefabId);
    }
  }

  @Input() rarity = 3;

  get src() {
    return this._src;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes.prefabId.previousValue !== changes.prefabId.currentValue || !changes.prefabId.firstChange) &&
      (changes.rarity?.previousValue !== changes.rarity?.currentValue || !changes.rarity?.firstChange)
    ) {
      this._src = this.redive.addIconUrl(changes.prefabId.currentValue, changes.rarity?.currentValue ?? 3);
    }
  }
}
