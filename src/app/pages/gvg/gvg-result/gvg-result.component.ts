import { Component, OnDestroy, OnInit } from '@angular/core';
import { BossTask } from '@src/app/models';
import { StorageService } from '@core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Constants } from '../constant/constant';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { storageNames } from '@app/constants';

@Component({
  selector: 'app-gvg-result',
  templateUrl: './gvg-result.component.html',
  styleUrls: ['./gvg-result.component.scss'],
})
export class GvgResultComponent implements OnInit, OnDestroy {
  itemSize = 190;
  onDestroySub = new Subject();
  usedList = [];
  // itemSize = 190 * 3
  constructor(private storageSrv: StorageService, breakpointObserver: BreakpointObserver) {
    breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Handset])
      .pipe(takeUntil(this.onDestroySub))
      .subscribe((res) => {
        console.log(res);
        if (res.matches) {
          console.log('matchs');
          this.itemSize = 190 * 3;
        } else {
          this.itemSize = 190;
        }
      });
  }
  filterResult: BossTask[][] = [];

  ngOnInit(): void {
    this.usedList = this.storageSrv.localGet(storageNames.usedList) ?? [];

    this.filterResult = this.storageSrv.sessionGet(Constants.filterResult);
  }

  ngOnDestroy(): void {
    this.onDestroySub.next();
    this.onDestroySub.complete();
  }
}
