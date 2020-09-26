import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { RediveService } from '@core';

@Component({
  selector: 'app-pcr-icon',
  template: ` <img style="height: 42px; width: 42px;" defaultImage="/assets/images/000001.webp" [lazyLoad]="src" /> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PcrIconComponent implements OnInit {
  private _src = '';
  constructor(private redive: RediveService) {}

  @Input()
  set prefabId(prefabId: number) {
    // todo 解决星问题
    if (prefabId) {
      this._src = this.redive.addIconUrl(prefabId);
    }
  }

  get src() {
    return this._src;
  }

  ngOnInit(): void {}
}
