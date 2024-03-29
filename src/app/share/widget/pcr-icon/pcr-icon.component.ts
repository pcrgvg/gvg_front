import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { RediveService } from '@app/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Unit {
  prefabId: number;
  currentRarity?: number;
  rarity?: number;
  [propName: string]: any;
}

@Component({
  selector: 'pcr-icon',
  template: `
    <div class="flash" [class.flash-active]="borrowChara?.prefabId === _unit.prefabId">
      <img style="height: 100%; width:100%" loading="lazy" (error)="onError()" [src]="src" />
      <img  class="talent"  loading="lazy" (error)="onTalentError()" [src]="talentUrl" />
    </div>
  `,
  styleUrls: ['./pcr-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PcrIconComponent implements OnDestroy {
  _unit: Unit;
  _src: string;
  onDestory$ = new Subject();
  errorCount = 0;
  _talentUrl = ''

  constructor(public redive: RediveService, private cdr: ChangeDetectorRef) {
    this.redive
      .baseUrlOb()
      .pipe(takeUntil(this.onDestory$))
      .subscribe((_) => {
        if (this._unit) {
          this.setIconUrl();
        }
      });
  }

  @Input()
  set unit(val: Unit) {
    this._unit = val;
    this.setIconUrl();
  }

  @Input()
  borrowChara: Unit;

  get src() {
    return this._src ?? '/assets/images/000001.webp';
  }

  get talentUrl() {
    return this._talentUrl
  }

  setIconUrl() {
    this._src = this.redive.addIconUrl(this._unit.prefabId, this._unit.currentRarity ?? this._unit.rarity);  
    this._talentUrl = this.redive.addTalentUrl(this._unit.talentId)
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.onDestory$.next();
    this.onDestory$.complete();
  }
  // 图片加载失败尝试使用oss资源
  onError() {
    this.errorCount += 1;
    if (this.errorCount <= 1) {
      this._src = this.redive.addIconUrl(
        this._unit.prefabId,
        this._unit.currentRarity ?? this._unit.rarity,
        this.redive.ossSource,
      );
    } else {
      this._src = '/assets/images/000001.webp';
    }
    this.cdr.markForCheck();
  }
  // 图片加载失败尝试使用oss资源
  onTalentError() {
    this._talentUrl = '';
    this.cdr.markForCheck();
  }
}
