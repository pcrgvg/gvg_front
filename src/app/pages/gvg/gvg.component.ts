import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PcrApiService } from '@apis';
import { MatDialog } from '@angular/material/dialog';
import { FilterTaskService, RediveDataService, StorageService } from '@core';
import { cloneDeep } from 'lodash';
import {
  BossTask,
  CanAutoName,
  CanAutoType,
  Chara,
  GvgTask,
  ServerName,
  ServerType,
  Task,
} from '@src/app/models';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '@src/environments/environment';

import { AddUnHaveComponent } from './widgets/add-un-have/add-un-have.component';
import { InstructionsComponent } from './widgets/instructions/instructions.component';
import { AddTaskComponent } from './widgets/add-task/add-task.component';
import { Constants } from './constant/constant';
import { MatAccordion } from '@angular/material/expansion';
import { storageNames } from '@app/constants';

@Component({
  selector: 'app-gvg',
  templateUrl: './gvg.component.html',
  styleUrls: ['./gvg.component.scss'],
})
export class GvgComponent implements OnInit, OnDestroy {
  @ViewChild(MatAccordion) matAccordion: MatAccordion;
  constructor(
    private pcrApi: PcrApiService,
    private matDialog: MatDialog,
    private ftSrv: FilterTaskService,
    private rediveDataSrv: RediveDataService,
    private storageSrv: StorageService,
  ) {}

  charaList: Chara[] = [];
  stage = 4;
  stageOption = [];
  bossList: GvgTask[] = [];
  filterBossList: GvgTask[] = [];
  unHaveChara: Chara[] = [];
  OnDestroySub = new Subject();
  autoSetting: CanAutoType[] = [CanAutoType.auto, CanAutoType.harfAuto, CanAutoType.unAuto];
  loading = false; // 删除loading
  filterLoading = false; // 筛选loading
  clanBattleList = [];
  clanBattleId = null;
  serverType = ServerType.jp;
  serverOption = [
    {
      label: ServerName.jp,
      value: ServerType.jp,
    },
    {
      label: ServerName.tw,
      value: ServerType.tw,
    },
  ];
  autoOption = [
    {
      label: CanAutoName.unAuto,
      value: CanAutoType.unAuto,
    },
    {
      label: CanAutoName.harfAuto,
      value: CanAutoType.harfAuto,
    },
    {
      label: CanAutoName.auto,
      value: CanAutoType.auto,
    },
  ];
  /**
   * TODO 账号模式
   * 是否可修改/删除/添加作业
   */
  operate: boolean = environment.operate;

  usedList: number[] = [];
  removedList: number[] = [];

  ngOnInit(): void {
    this.stageOption = new Array(4).fill(1).map((r, i) => {
      return {
        value: i + 1,
      };
    });
    this.usedList = this.storageSrv.localGet(storageNames.usedList) ?? [];
    this.removedList = this.storageSrv.localGet(storageNames.removedList) ?? [];
    this.getClanBattleList();

    this.getCharaList();
    this.getRank();
    this.rediveDataSrv
      .getUnHaveCharaOb()
      .pipe(takeUntil(this.OnDestroySub))
      .subscribe((res) => {
        this.unHaveChara = res;
      });
  }

  ngOnDestroy(): void {
    this.OnDestroySub.next();
    this.OnDestroySub.complete();
  }

  getRank() {
    this.pcrApi.getRank().subscribe((res) => {
      this.rediveDataSrv.setRankList(res);
    });
  }

  getClanBattleList() {
    this.pcrApi.getClanBattleList().subscribe((res) => {
      this.clanBattleList = res;
      this.clanBattleId = this.clanBattleList[0].clanBattleId;
      this.getGvgTaskList();
    });
  }

  getGvgTaskList() {
    this.pcrApi.gvgTaskList(this.stage, this.serverType, this.clanBattleId).subscribe((res) => {
      this.bossList = res.map((r) => {
        return {
          ...r,
          checked: true,
        };
      });
      this.toggleAuto();
    });
  }

  getCharaList() {
    this.pcrApi.charaList().subscribe((res) => {
      this.rediveDataSrv.setCharaList(res);
    });
  }

  filter() {
    if (this.filterLoading) {
      return;
    }
    this.filterLoading = true;
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./work/filter.worker', { type: 'module' });
      worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data.length}`);
        this.filterLoading = false;
        this.storageSrv.sessionSet(Constants.filterResult, data.slice(0, 200));
        window.open('/gvgresult', '');
        worker.terminate();
      };
      worker.postMessage({
        bossList: this.filterBossList.filter((boss) => boss.checked),
        removedList: this.storageSrv.localGet(storageNames.removedList) ?? [],
        usedList: this.storageSrv.localGet(storageNames.usedList) ?? [],
        unHaveCharas: this.rediveDataSrv.unHaveCharas,
      });
    } else {
      const filterResult = this.ftSrv.filterTask(
        this.filterBossList.filter((boss) => boss.checked),
      );
      /// 结果可能很多比如超过1500条,没必要都展示,还可能超出storage的大小限制
      console.log(filterResult.length);
      this.filterLoading = false;
      this.storageSrv.sessionSet(Constants.filterResult, filterResult.slice(0, 200));
      window.open('/gvgresult', '');
    }
  }

  toggleModal(task?: Task, bossId?: number) {
    const dialogRef = this.matDialog.open(AddTaskComponent, {
      data: {
        task: task
          ? cloneDeep(task)
          : {
              charas: [],
            },
        bossList: this.bossList,
        bossId,
        serverType: this.serverType,
        stage: this.stage,
      },
      closeOnNavigation: true,
    });
    dialogRef.afterClosed().subscribe((res: { bossId: number; gvgTask: GvgTask }) => {
      if (res) {
        this.getGvgTaskList();
      }
    });
  }

  openUnHaveModal() {
    this.matDialog.open(AddUnHaveComponent, {
      closeOnNavigation: true,
    });
  }

  openInstructions() {
    this.matDialog.open(InstructionsComponent);
  }

  toggleAuto() {
    const bossList = cloneDeep(this.bossList);
    bossList.forEach((gvgtask) => {
      const tasks = cloneDeep(gvgtask.tasks);
      gvgtask.tasks = tasks.filter((task) => this.autoSetting.includes(task.canAuto));
    });
    this.filterBossList = bossList;
  }

  trackByBossFn(_: number, boss: GvgTask): number {
    return boss.id;
  }

  trackByCharaFn(_: number, chara: Chara): number {
    return chara.prefabId;
  }

  delelteTask(boss: GvgTask, task: Task) {
    this.loading = true;
    this.pcrApi
      .deleteTask(task.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        const index = boss.tasks.findIndex((r) => r.id === task.id);
        boss.tasks.splice(index, 1);
      });
  }
  /**
   * 清除缓存
   */
  storageClear() {
    this.storageSrv.clearAll();
    location.reload();
  }

  /**
   * 切换是否已使用,并保存到localstorage
   */
  toggleUsed(task: Task) {
    const index = this.usedList.findIndex((r) => r === task.id);
    if (index > -1) {
      this.usedList.splice(index, 1);
    } else {
      this.usedList.push(task.id);
    }
    this.storageSrv.localSet(storageNames.usedList, this.usedList);
  }
  /**
   * 切换是否加入筛选,并保存到localstorage
   */
  toggleRemoved(task: Task) {
    const index = this.removedList.findIndex((r) => r === task.id);
    if (index > -1) {
      this.removedList.splice(index, 1);
    } else {
      this.removedList.push(task.id);
    }
    this.storageSrv.localSet(storageNames.removedList, this.removedList);
  }
}
