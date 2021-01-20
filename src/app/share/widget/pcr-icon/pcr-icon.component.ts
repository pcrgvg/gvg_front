import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { RediveService } from '@core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Unit {
  prefabId: number;
  currentRarity?: number;
  rarity: number;
  [propName: string]: any;
}

@Component({
  selector: 'app-pcr-icon',
  template: `
    <img style="height: 42px; width: 42px;" loading="lazy" (error)="onError()" [src]="src" />
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PcrIconComponent implements OnInit, OnDestroy {
  _unit: Unit;
  _src: string;
  onDestory$ = new Subject();
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

  @Input() rarity: number;

  get src() {
    return this._src ?? '/assets/images/000001.webp';
  }

  setIconUrl() {
    this._src = this.redive.addIconUrl(
      this._unit.prefabId,
      this._unit.currentRarity ?? this._unit.rarity,
    );
    this.cdr.markForCheck();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.onDestory$.next();
    this.onDestory$.complete();
  }

  onError() {
    this._src = '/assets/images/000001.webp';
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (
  //     (changes.prefabId?.previousValue !== changes.prefabId?.currentValue || !changes.prefabId?.firstChange) &&
  //     (changes.rarity?.previousValue !== changes.rarity?.currentValue || !changes.rarity?.firstChange)
  //   ) {
  //     this._src = this.redive.addIconUrl(this._prefabId, this.rarity);
  //   }
  // }
}
