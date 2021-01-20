import { Component, OnInit, OnDestroy, ViewChild, ViewChildren, TemplateRef } from '@angular/core';
import { PcrApiService, ChangelogServiceApi, NoticeApiService } from '@apis';
import { MatDialog } from '@angular/material/dialog';
import {
  RediveService,
  RediveDataService,
  StorageService,
  unHaveCharas,
  SnackbarService,
} from '@core';
import { cloneDeep } from 'lodash';
import {
  CanAutoName,
  CanAutoType,
  Chara,
  GvgTask,
  Notice,
  ServerName,
  ServerType,
  Task,
} from '@src/app/models';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AddUnHaveComponent } from './widgets/add-un-have/add-un-have.component';
import { InstructionsComponent } from './widgets/instructions/instructions.component';
import { AddTaskComponent } from './widgets/add-task/add-task.component';
import { Constants } from './constant/constant';
import { MatAccordion } from '@angular/material/expansion';
import { storageNames } from '@app/constants';
import { ActivatedRoute } from '@angular/router';
import { filterTask } from './util/filterTask';
import { NoticeComponent } from './widgets/notice/notice.component';

@Component({
  selector: 'app-gvg',
  templateUrl: './gvg.component.html',
  styleUrls: ['./gvg.component.scss'],
})
export class GvgComponent implements OnInit, OnDestroy {
  @ViewChildren(MatAccordion) matAccordions: MatAccordion[];
  @ViewChild('cacheRef') cacheRef: TemplateRef<any>;
  constructor(
    private pcrApi: PcrApiService,
    private matDialog: MatDialog,
    private rediveDataSrv: RediveDataService,
    private rediveSrv: RediveService,
    private storageSrv: StorageService,
    private route: ActivatedRoute,
    private changelogApi: ChangelogServiceApi,
    private snackbarSrc: SnackbarService,
    private noticeApiSrv: NoticeApiService,
  ) {}

  charaList: Chara[] = [];
  stage = null;
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
      label: ServerName.cn,
      value: ServerType.cn,
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
  operate = false;

  usedList: number[] = [];
  removedList: number[] = [];

  changelog: string = '';

  imgSource: string = '';
  imgSourceOption = [];

  notice: Notice;

  ngOnInit(): void {
    this.dealServerType();
    this.stageOption = new Array(5).fill(1).map((r, i) => {
      return {
        value: i + 1,
      };
    });
    this.usedList = this.storageSrv.localGet(storageNames.usedList) ?? [];
    this.removedList = this.storageSrv.localGet(storageNames.removedList) ?? [];
    this.toggleServer();
    this.rediveDataSrv
      .getUnHaveCharaOb()
      .pipe(takeUntil(this.OnDestroySub))
      .subscribe((res) => {
        this.unHaveChara = res;
      });
    this.changelogApi.getChangeLog().subscribe((r) => {
      this.changelog = r.content ?? '';
    });

    this.initImamgeSouce();
  }

  ngOnDestroy(): void {
    this.OnDestroySub.next();
    this.OnDestroySub.complete();
  }

  getNotice() {
    this.noticeApiSrv
      .getNotice({
        server: this.serverType,
        clanBattleId: this.clanBattleId,
      })
      .subscribe((r) => {
        this.notice = r;
      });
  }

  initImamgeSouce() {
    this.imgSourceOption = [
      {
        label: '干炸里脊',
        value: this.rediveSrv.winSource,
      },
      {
        label: 'oss',
        value: this.rediveSrv.ossSource,
      },
      {
        label: '小水管',
        value: '/',
      },
    ];
    this.imgSource = this.storageSrv.localGet('imageBase', this.rediveSrv.winSource);
  }

  dealServerType() {
    const serverType = this.route.snapshot.queryParams.serverType;
    switch (serverType) {
      case '114':
        {
          this.operate = true;
          this.serverType = ServerType.cn;
          this.serverOption = [
            {
              label: ServerName.cn,
              value: ServerType.cn,
            },
          ];
        }
        break;
      case '142':
        {
          this.operate = true;
          this.serverType = ServerType.jp;
          this.serverOption = [
            {
              label: ServerName.jp,
              value: ServerType.jp,
            },
          ];
        }
        break;

      default: {
        this.operate = false;
        this.serverType = ServerType.jp;
        this.serverOption = [
          {
            label: ServerName.jp,
            value: ServerType.jp,
          },
          {
            label: ServerName.cn,
            value: ServerType.cn,
          },
        ];
      }
    }
  }

  toggleServer() {
    this.getClanBattleList();
    this.getCharaList();
    this.getRank();
  }

  getRank() {
    this.pcrApi.getRank(this.serverType).subscribe((res) => {
      this.rediveDataSrv.setRankList(res);
    });
  }

  /**
   * 获取会战期次
   */
  getClanBattleList() {
    this.pcrApi.getClanBattleList(this.serverType).subscribe((res) => {
      this.clanBattleList = res;
      this.clanBattleId = this.clanBattleList[0].clanBattleId;
      if (this.stage) {
        this.getGvgTaskList();
      }
      this.getNotice();
      // this.getGvgTaskList();
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
    this.pcrApi.charaList(this.serverType).subscribe((res) => {
      this.rediveDataSrv.setCharaList(res);
    });
  }
  /**
   * 筛刀
   */
  filter() {
    if (this.filterLoading) {
      return;
    }
    this.filterLoading = true;
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('./work/filter.worker', { type: 'module' });
      worker.onmessage = ({ data }) => {
        console.log(`worker message: ${data.length}`);
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
      worker.onerror = (err) => {
        this.filterLoading = false;
        this.snackbarSrc.openSnackBar(err.message);
      };
    } else {
      const filterResult = filterTask({
        bossList: this.filterBossList.filter((boss) => boss.checked),
        removedList: this.storageSrv.localGet(storageNames.removedList) ?? [],
        usedList: this.storageSrv.localGet(storageNames.usedList) ?? [],
        unHaveCharas: this.rediveDataSrv.unHaveCharas,
      });

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

  openClear() {
    this.matDialog.open(this.cacheRef);
  }
  /**
   *
   * @param type 1所有 2 不包含未拥有
   */
  storageClear(type: number) {
    if (type === 1) {
      this.storageSrv.clearAll();
    } else {
      const unCharas = this.storageSrv.localGet(unHaveCharas);
      this.storageSrv.clearAll();
      this.storageSrv.localSet(unHaveCharas, unCharas);
    }
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

  openAll() {
    this.matAccordions.forEach((accordion) => accordion.openAll());
  }
  closeAll() {
    this.matAccordions.forEach((accordion) => accordion.closeAll());
  }

  toggleImgSource(url: string) {
    this.rediveSrv.changeImgSource(url);
  }

  toggleNotice() {
    this.matDialog.open(NoticeComponent, {
      data: {
        server: this.serverType,
        clanBattleId: this.clanBattleId,
      },
      width: '600px',
    });
  }
}
