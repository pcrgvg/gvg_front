import { Component, OnDestroy, OnInit } from '@angular/core';
import { BossTask, GvgTask, Task } from '@src/app/models';
import { StorageService } from '@app/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { storageNames } from '@app/constants';
import { FilterResultService } from '../services/filter-result.service';

@Component({
  selector: 'pcr-gvg-result',
  templateUrl: './gvg-result.component.html',
  styleUrls: ['./gvg-result.component.scss']
})
export class GvgResultComponent implements OnInit, OnDestroy {
  
  constructor(
    private breakpointObserver: BreakpointObserver,
    private storageSrv: StorageService,
    private filterResultSrv: FilterResultService
  ) { 
    breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Handset])
    .pipe(takeUntil(this.onDestroySub))
    .subscribe((res) => {
      console.log(res);
      if (res.matches) {
        // this.itemSize = 190 * 3;
      } else {
        this.itemSize = 190;
      }
    });
  }

  filterResult: BossTask[][] = [];
  taskList: BossTask[][] = [];
  bossList: GvgTask[];
  countList = [1,2,3];
  bossIdset = new Set<number>()

  itemSize = 190;
  onDestroySub = new Subject();
  usedList = [];

  loading = false;

  ngOnInit(): void {
    this.usedList = this.storageSrv.localGet(storageNames.usedList) ?? [];
    this.taskList = this.filterResultSrv.filterResult;
    this.filterResult = this.filterResultSrv.filterResult;
    this.bossList = this.filterResultSrv.bosslist;
  }
  ngOnDestroy(): void {
    this.onDestroySub.next();
    this.onDestroySub.complete();
  }



  search() {
    const arr = this.bossList.filter(r =>r.checked === true);
    if (arr.length) {
      const total = arr.reduce((count, boss) => {
        return count +boss.count
      }, 0)

      if(total >3) {
        throw new Error("选中boss的总数不能大于3");
      }
      this.loading = true;
      const res = [];
      this.taskList.forEach(r => {
        let count = 0;
        arr.forEach(boss => {
          if (r.findIndex(b => b.prefabId === boss.prefabId) > -1) {
            count +=1;
          }
        });
        if (count >= total){
          res.push(r);
        }
      })

      this.filterResult = res;
      this.loading = false
    } else {
      return this.filterResult;
    }
  }


  trackByTaskFn(_: number, task: Task): number {
    return task.id;
  }
}
