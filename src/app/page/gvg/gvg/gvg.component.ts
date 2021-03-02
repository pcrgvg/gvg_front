import { Component, OnInit, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PcrApiService, ChangelogServiceApi, NoticeApiService } from '@app/apis';
import { storageNames } from '@app/constants';
import { RediveDataService, RediveService, StorageService } from '@app/core';
import { CanAutoName, CanAutoType, Chara, GvgTask, ServerName, ServerType, Task } from '@app/models';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AddUnHaveComponent } from '../widgets/add-un-have/add-un-have.component';
import { AddTaskComponent } from '../widgets/add-task/add-task.component';


@Component({
  selector: 'pcr-gvg',
  templateUrl: './gvg.component.html',
  styleUrls: ['./gvg.component.scss'],
})
export class GvgComponent implements OnInit {
  constructor(
    private router: Router,
    private pcrApi: PcrApiService,
    private rediveDataSrv: RediveDataService,
    private rediveSrv: RediveService,
    private storageSrv: StorageService,
    private route: ActivatedRoute,
    private changelogApi: ChangelogServiceApi,
    private noticeApiSrv: NoticeApiService,
    private modalSrc: NzModalService,
  ) {}
  charaList: Chara[] = []; // 角色列表
  stage = null; // 阶段
  stageOption = [1,2,3,4,5]; // 阶段option
  gvgTaskList: GvgTask[] = []; // 初始作业列表
  filterGvgTaskList: GvgTask[] = []; // 根据筛选条件显示的列表
  unHaveChara: Chara[] = []; // 未拥有角色
  OnDestroySub = new Subject();
  autoSetting: CanAutoType[] = [CanAutoType.auto, CanAutoType.harfAuto, CanAutoType.unAuto];
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
  loading = false; // 删除loading
  filterLoading = false; // 筛选loading
  searchLoading = false; // 搜索loading
  clanBattleList = []; // 会战期次
  clanBattleId = null; // 当前会战期次
  serverType= ServerType.jp;
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
  usedList: number[] = []; // 已使用的作业
  removedList: number[] = []; // 去除
  imgSource: string = ''; // 图片源
  imgSourceOption = [];
  bossIdSet = new Set<number>(); // 选中的boss


  ngOnInit(): void {
    this.dealServerType();
    this.initImamgeSouce();
    this.usedList = this.storageSrv.localGet(storageNames.usedList) ?? [];
    this.removedList = this.storageSrv.localGet(storageNames.removedList) ?? [];
    this.rediveDataSrv
    .getUnHaveCharaOb()
    .pipe(takeUntil(this.OnDestroySub))
    .subscribe((res) => {
      this.unHaveChara = res;
    });

    this.toggleServer();
  }

 

  dealServerType() {
    const serverType = this.route.snapshot.paramMap.get('serverType');
    switch (serverType) {
      case ServerType.cn: {
        this.serverType = ServerType.cn
      } break;
      case ServerType.jp:
      default: {
        this.serverType = ServerType.jp
      }
    }
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

  // 切换服务器触发
  toggleServer() {
    this.getClanBattleList();
    this.getCharaList();
    this.getRank();
  }


    /**
   * 获取会战期次
   */
  getClanBattleList() {
   
    this.pcrApi.getClanBattleList(this.serverType).subscribe((res) => {
      this.clanBattleList = res;
      this.clanBattleId = this.clanBattleList[0].clanBattleId;
    });
  }

 
  getCharaList() {
    this.pcrApi.charaList(this.serverType).subscribe((res) => {
      this.rediveDataSrv.setCharaList(res);
    });
  }

  getRank() {
    this.pcrApi.getRank(this.serverType).subscribe((res) => {
      this.rediveDataSrv.setRankList(res);
    });
  }

  getGvgTaskList() {
    this.searchLoading= true;
    this.pcrApi.gvgTaskList(this.stage, this.serverType, this.clanBattleId).pipe(
      finalize(() =>this.searchLoading = false)
    ).subscribe((res) => {
      res.forEach(r => {
        r.tasks.forEach(t => {
          t.charas.sort((a, b) => b.searchAreaWidth - a.searchAreaWidth)
        })
      })
      this.gvgTaskList = res;
      this.toggleAuto();
    });
  }

  toggleAuto() {
    const bossList = cloneDeep(this.gvgTaskList);
    bossList.forEach((gvgtask) => {
      const tasks = cloneDeep(gvgtask.tasks);
      gvgtask.tasks = tasks.filter((task) => this.autoSetting.includes(task.canAuto));
    });
    this.filterGvgTaskList = bossList;
  }

  isSelected(id: number): boolean{
    return this.bossIdSet.has(id);
  }

  selectedBossChange(check:boolean, id: number) {
    if (check) {
      this.bossIdSet.add(id)
    } else {
      this.bossIdSet.delete(id);
    }
  }

  toggleUsed(event, task:Task) {
    const index = this.usedList.findIndex((r) => r === task.id);
    if (index > -1) {
      this.usedList.splice(index, 1);
    } else {
      this.usedList.push(task.id);
    }
    this.storageSrv.localSet(storageNames.usedList, this.usedList);
  }
  toggleRemoved(event, task:Task) {
    const index = this.removedList.findIndex((r) => r === task.id);
    if (index > -1) {
      this.removedList.splice(index, 1);
    } else {
      this.removedList.push(task.id);
    }
    this.storageSrv.localSet(storageNames.removedList, this.removedList);
  }

  autoColor(task:Task) {
    // CanAutoType.auto, CanAutoType.harfAuto, CanAutoType.unAuto
    switch (task.canAuto) {
      case CanAutoType.auto: return '#68B9FF'; break;
      case CanAutoType.harfAuto: return '#F55291'; break;
      case CanAutoType.unAuto:
      default: return '#FF2277'
    }
  }

  trackByBossFn(_: number, boss: GvgTask): number {
    return boss.id;
  }

  trackByTaskFn(_: number, task: Task): number {
    return task.id;
  }

  trackByCharaFn(_: number, chara: Chara): number {
    return chara.prefabId;
  }

  clickStop() { }

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

  addUnHave(){
    this.modalSrc.create({
      nzContent: AddUnHaveComponent,
      nzFooter: null,
      nzWidth: '80%',
      nzMaskClosable:false
    })
  }

  addTask(task?:Task, bossId?: number) {
    const bossList = this.gvgTaskList.map(r => ({
      id: r.id,
      prefabId: r.prefabId,
      unitName: r.unitName
    }));
    this.modalSrc.create({
      nzContent:AddTaskComponent,
      nzComponentParams: {
        bossId,
        task,
        bossList
      },
      nzFooter: null,
      nzWidth: '80%',
      nzMaskClosable:false
    })
  }
}
