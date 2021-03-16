import { Component, OnInit, ViewChild, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PcrApiService, ChangelogServiceApi, NoticeApiService } from '@app/apis';
import { storageNames } from '@app/constants';
import { RediveDataService, RediveService, StorageService } from '@app/core';
import { CanAutoName, CanAutoType, Chara, GvgTask, Notice, ServerName, ServerType, Task } from '@app/models';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { cloneDeep, reject } from 'lodash';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AddUnHaveComponent } from '../widgets/add-un-have/add-un-have.component';
import { AddTaskComponent } from '../widgets/add-task/add-task.component';
import { filterTask } from '../services/filterTask';
import { FilterResultService } from '../services/filter-result.service';
import { NoticeComponent } from '../widgets/notice/notice.component';


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
    private noticeApiSrv: NoticeApiService,
    private modalSrc: NzModalService,
    private filterResultSrv: FilterResultService
  ) { }


  charaList: Chara[] = []; // 角色列表
  stage = 1; // 阶段
  stageOption = [1, 2, 3, 4, 5]; // 阶段option
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
  usedList: number[] = []; // 已使用的作业
  removedList: number[] = []; // 去除
  imgSource: string = ''; // 图片源
  imgSourceOption = [];
  bossIdSet = new Set<number>(); // 选中的boss
  deleteRef: NzModalRef;
  operate = false;
  notice: Notice;


  ngOnInit(): void {
    this.dealServerType();
    this.initImamgeSouce();
    this.dealServerOperate()
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

  dealServerOperate() {
    const serverType = this.route.snapshot.queryParams.serverType;
    switch (serverType) {
      case '114':
        this.operate = true;
        break;
      case '142':
        this.operate = true;
        break;
      default:
        this.operate = false;
    }
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
    this.filterGvgTaskList = [];
    this.gvgTaskList = [];
    this.bossIdSet.clear();
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
      this.getNotice();
    });
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
    this.searchLoading = true;
    this.pcrApi.gvgTaskList(this.stage, this.serverType, this.clanBattleId).pipe(
      finalize(() => this.searchLoading = false)
    ).subscribe((res) => {
      this.bossIdSet.clear();
      res.forEach(r => {

        this.bossIdSet.add(r.id);
        r.tasks.forEach(t => {
          t.charas.sort((a, b) => b.searchAreaWidth - a.searchAreaWidth)
        })
      });
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

  toggleImgSource(url: string) {
    this.rediveSrv.changeImgSource(url);
  }

  isSelected(id: number): boolean {
    return this.bossIdSet.has(id);
  }

  selectedBossChange(check: boolean, id: number) {
    if (check) {
      this.bossIdSet.add(id)
    } else {
      this.bossIdSet.delete(id);
    }
  }

  toggleUsed(event, task: Task) {
    const index = this.usedList.findIndex((r) => r === task.id);
    if (index > -1) {
      this.usedList.splice(index, 1);
    } else {
      this.usedList.push(task.id);
    }
    this.storageSrv.localSet(storageNames.usedList, this.usedList);
  }
  toggleRemoved(event, task: Task) {
    const index = this.removedList.findIndex((r) => r === task.id);
    if (index > -1) {
      this.removedList.splice(index, 1);
    } else {
      this.removedList.push(task.id);
    }
    this.storageSrv.localSet(storageNames.removedList, this.removedList);
  }

  autoColor(canAuto: number) {
    switch (canAuto) {
      case CanAutoType.auto: return '#68B9FF';
      case CanAutoType.harfAuto: return '#1cbbb4';
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


  delteConfirm(boss: GvgTask, task: Task) {
    // this.deleteRef.triggerOk()
    this.loading = true;
    this.pcrApi
      .deleteTask(task.id)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe((res) => {
        const index = boss.tasks.findIndex((r) => r.id === task.id);
        boss.tasks.splice(index, 1);
      });
  }

  delteCancel() {
    this.deleteRef.destroy();
  }

  addUnHave() {
    this.modalSrc.create({
      nzContent: AddUnHaveComponent,
      nzFooter: null,
      nzWidth: '80%',
      nzMaskClosable: false
    })
  }

  addTask(task?: Task, bossId?: number) {
    const bossList = this.gvgTaskList.map(r => ({
      id: r.id,
      prefabId: r.prefabId,
      unitName: r.unitName
    }));
    this.modalSrc.create({
      nzContent: AddTaskComponent,
      nzComponentParams: {
        bossId,
        task,
        bossList
      },
      nzFooter: null,
      nzWidth: '80%',
      nzMaskClosable: false
    })
  }

  openNotice() {
    this.modalSrc.create({
      nzContent: NoticeComponent,
      nzComponentParams: {
        operate: this.operate,
        notice:this.notice,
        server: this.serverType,
        clanBattleId: this.clanBattleId
      },
      nzFooter: null,
      nzWidth: '80%',
      nzMaskClosable: false
    })
  }
  /**
 * 筛刀
 */
  filter() {

    const [bossList, taskList] = [[], []];
    this.filterGvgTaskList.forEach(r => {
      if (this.bossIdSet.has(r.id)) {
        taskList.push(r);
        bossList.push({
          prefabId: r.prefabId,
          id: r.id,
          count: 1
        })
      }
    });
    if (!taskList.length) {
      throw new Error("选择至少一个boss");
    }
    this.filterLoading = true;
    if (typeof Worker !== 'undefined') {
      const worker = new Worker('../work/filter.worker', { type: 'module' });
      worker.onmessage = ({ data }) => {
        console.log(`worker message: ${data.length}`);
        this.filterLoading = false;
        // this.storageSrv.sessionSet(Constants.filterResult, data.slice(0, 200));
        // window.open('/gvgresult', '');
        this.filterResultSrv.setFilterResult(data);
        this.filterResultSrv.setBosslist(bossList);
        this.router.navigate(['/gvg/result'])
        worker.terminate();
      };

      worker.postMessage({
        bossList: taskList,
        removedList: this.storageSrv.localGet(storageNames.removedList) ?? [],
        usedList: this.storageSrv.localGet(storageNames.usedList) ?? [],
        unHaveCharas: this.rediveDataSrv.unHaveCharas,
        server: this.serverType,
      });
      worker.onerror = (err) => {
        this.filterLoading = false;
      };
    } else {
      const filterResult = filterTask({
        bossList: taskList,
        removedList: this.storageSrv.localGet(storageNames.removedList) ?? [],
        usedList: this.storageSrv.localGet(storageNames.usedList) ?? [],
        unHaveCharas: this.rediveDataSrv.unHaveCharas,
        server: this.serverType,
      });

      /// 结果可能很多比如超过1500条,没必要都展示,还可能超出storage的大小限制
      this.filterLoading = false;
      this.filterResultSrv.setFilterResult(filterResult);
      this.filterResultSrv.setBosslist(bossList);
      this.router.navigate(['/gvg/result'])
      // this.storageSrv.sessionSet(Constants.filterResult, filterResult.slice(0, 200));
      // window.open('/gvgresult', '');
    }
  }


}
