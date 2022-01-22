import { Component, ContentChild, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BossTask, CanAutoType, GvgTask, Task } from '@src/app/models';
import { StorageService } from '@app/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { storageNames } from '@app/constants';
import { FilterResultService } from '../services/filter-result.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { environment } from '@src/environments/environment';
import { NzImageService } from 'ng-zorro-antd/image';
import { Router } from '@angular/router';

@Component({
  selector: 'pcr-gvg-result',
  templateUrl: './gvg-result.component.html',
  styleUrls: ['./gvg-result.component.scss']
})
export class GvgResultComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private storageSrv: StorageService,
    private filterResultSrv: FilterResultService,
    private nzImgSrv: NzImageService,
    private router: Router
  ) {

  }



  bossList: GvgTask[];
  countList = [1, 2, 3];

  itemSize = 300;
  onDestroySub = new Subject();
  usedList = [];

  ds = new TaskDataSource(this.filterResultSrv);

  showLink = environment.showLink;
  canAutoType = CanAutoType;

  ngOnInit(): void {
    this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Handset])
    .pipe(takeUntil(this.onDestroySub))
    .subscribe((res) => {
      if (res.matches) {
        this.itemSize = 300 * 3;
      } else {
        this.itemSize = 300;
      }
    });
    this.usedList = this.storageSrv.localGet(storageNames.usedList) ?? [];


    this.bossList = this.filterResultSrv.bosslist;
  }
  ngOnDestroy(): void {
    this.onDestroySub.next();
    this.onDestroySub.complete();
  }



  search() {
    this.virtualScroll.scrollTo({
      top: 0
    });
    this.ds.onSearch( this.bossList);

  }


  trackByTaskFn(_: number, task: Task): number {
    return task.id;
  }

  autoColor(canAuto: number) {
    switch (canAuto) {
      case CanAutoType.auto:
        return '#68B9FF';
      case CanAutoType.harfAuto:
        return '#1cbbb4';
      case CanAutoType.manual:
      default:
        return '#FF2277';
    }
  }

  previewImg(url: string) {
    this.nzImgSrv.preview([{src: url}]);
  }

  home() {
    this.router.navigate(['/'])
  }
}

export class TaskDataSource extends DataSource<BossTask[]> {
  private disconnect$ = new Subject<void>(); // 销毁的时候
  private cachedData: BossTask[][] = []; // 加载数据缓存
  private dataStream = new BehaviorSubject<BossTask[][]>(this.cachedData);
  private fetchedPagesSet = new Set<number>(); // 缓存已经获取过数据的start，防止重复获取
  private pageSize = 10;
  private taskList: BossTask[][] = []; // 筛选数据的缓存

  constructor(private filterResultSrv: FilterResultService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<BossTask[][]> {
    this.setTaskList();
    this.setup(collectionViewer);
    return this.dataStream;
  }

  private setup(collectionViewer: CollectionViewer): void {
    // 初始化
    this.fetchData(0);


    collectionViewer.viewChange.pipe(
      takeUntil(this.disconnect$)
    ).subscribe(range => {
      if (this.cachedData.length >= this.filterResultSrv.filterResult.length) {
        // this.complete$.next();
        // this.complete$.complete();
      } else {
        const endPage = this.getPageForIndex(range.end);
        this.fetchData(endPage + 1);
      }
    });
  }

  setTaskList( bossList?: GvgTask[]) {
    if (bossList) {
      const arr = bossList.filter(r => r.checked === true);
      if (arr.length) {
        const total = arr.reduce((count, boss) => {
          return count + boss.count;
        }, 0);
        if (total > 3) {
          throw new Error('选中boss的总数大于3');
        }
        const res = [];
        this.filterResultSrv.filterResult.forEach(r => {
          const bossMap = new Map<number, number>();
          arr.forEach(boss => {
            bossMap.set(boss.prefabId, boss.count);
          });
          r.forEach(task => {
            const prefabId = task.prefabId;
            if (bossMap.has(prefabId)) {
              bossMap.set(prefabId, bossMap.get(prefabId) - 1);
            }
          });
          if ([...bossMap.values()].every(r => r  === 0)){
            res.push(r);
          }
        });

        this.taskList = res;
      } else {
        this.taskList = this.filterResultSrv.filterResult;
      }
    } else {
      this.taskList = this.filterResultSrv.filterResult;
    }
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  onSearch( bossList: GvgTask[]) {
    this.fetchedPagesSet.clear();
    this.cachedData = [];
    this.setTaskList(bossList);
    this.fetchData(0);
  }


  fetchData(start: number) {
    if (this.fetchedPagesSet.has(start)) {
      return;
    }
    this.fetchedPagesSet.add(start);
    const  arr = this.taskList.slice(start * this.pageSize, (start + 1) * this.pageSize);
    this.cachedData.splice(start * this.pageSize, this.pageSize, ...arr);
    this.dataStream.next(this.cachedData);
  }

  disconnect() {
    this.disconnect$.next();
    this.disconnect$.complete();
  }


}

