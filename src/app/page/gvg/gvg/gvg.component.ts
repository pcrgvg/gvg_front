import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PcrApiService,
  ChangelogServiceApi,
  NoticeApiService,
} from '@app/apis';
import { storageNames } from '@app/constants';
import {
  RediveDataService,
  RediveService,
  ServerUnChara,
  StorageService,
} from '@app/core';
import {
  CanAutoName,
  CanAutoType,
  Chara,
  GvgTask,
  Notice,
  ServerName,
  ServerType,
  Task,
} from '@app/models';
import { Subject } from 'rxjs';
import { catchError, finalize, takeUntil, timeout } from 'rxjs/operators';
import { cloneDeep, reject } from 'lodash';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AddUnHaveComponent } from '../widgets/add-un-have/add-un-have.component';
import { AddTaskComponent } from '../widgets/add-task/add-task.component';
import { filterTask } from '../services/filterTask';
import { FilterResultService } from '../services/filter-result.service';
import { NoticeComponent } from '../widgets/notice/notice.component';
import { NzCollapsePanelComponent } from 'ng-zorro-antd/collapse';
import { environment } from '@src/environments/environment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {createWorker} from '@src/app/uitl/createWorker'

@Component({
  selector: 'pcr-gvg',
  templateUrl: './gvg.component.html',
  styleUrls: ['./gvg.component.scss'],
})
export class GvgComponent implements OnInit {
  @ViewChildren(NzCollapsePanelComponent)
  nzCollapsePanels: NzCollapsePanelComponent[];
  constructor(
    private router: Router,
    private pcrApi: PcrApiService,
    private rediveDataSrv: RediveDataService,
    private rediveSrv: RediveService,
    private storageSrv: StorageService,
    private route: ActivatedRoute,
    private noticeApiSrv: NoticeApiService,
    private modalSrc: NzModalService,
    private filterResultSrv: FilterResultService,
    private nzNotificationSrv: NzNotificationService
  ) {}

  charaList: Chara[] = []; // 角色列表
  stage = 1; // 阶段
  stageOption = []; // 阶段option
  gvgTaskList: GvgTask[] = []; // 初始作业列表
  filterGvgTaskList: GvgTask[] = []; // 根据筛选条件显示的列表
  OnDestroySub = new Subject();
  autoSetting: CanAutoType[] = [
    CanAutoType.auto,
    CanAutoType.harfAuto,
    CanAutoType.manual,
  ];
  autoOption = [
    {
      label: CanAutoName.manual,
      value: CanAutoType.manual,
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
  imgSource = ''; // 图片源
  imgSourceOption = [];
  deleteRef: NzModalRef;
  operate = false;
  notice: Notice;
  isSpinning = true;
  showLink = environment.showLink;
  updateCnTaskLoading = false;
  bossNumberList = [1, 2, 3, 4, 5];
  serverUnCharas: ServerUnChara;
  usedOrRemoved = 'all';

  ngOnInit(): void {
    this.dealServerType();
    this.initImamgeSouce();
    this.dealServerOperate();
    this.usedList = this.storageSrv.localGet(storageNames.usedList) ?? [];
    this.removedList = this.storageSrv.localGet(storageNames.removedList) ?? [];
    this.rediveDataSrv
      .getUnHaveCharaOb()
      .pipe(takeUntil(this.OnDestroySub))
      .subscribe((res) => {
        this.serverUnCharas = res;
      });

    this.toggleServer();
  }

  // 未拥有角色
  get unHaveCharaList(): Chara[] {
    return this.serverUnCharas?.[this.serverType] ?? [];
  }

  dealServerOperate() {
    const serverType = this.route.snapshot.queryParams.serverType;
    switch (serverType) {
      case '114':
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
      case ServerType.cn:
        {
          this.serverType = ServerType.cn;
        }
        break;
      case ServerType.jp:
      default: {
        this.serverType = ServerType.jp;
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
      // {
      //   label: '小水管',
      //   value: '/',
      // },
    ];
    this.imgSource = this.storageSrv.localGet(
      'imageBase',
      this.rediveSrv.winSource
    );
  }

  // 切换服务器触发
  toggleServer() {
    this.isSpinning = true;
    this.filterGvgTaskList = [];
    this.gvgTaskList = [];
    this.getClanBattleList();
    this.getCharaList();
    this.getRank();
  }

  /**
   * 获取会战期次
   */
  getClanBattleList() {
    this.pcrApi
      .getClanBattleList(this.serverType)
      .pipe(finalize(() => (this.isSpinning = false)))
      .subscribe((res) => {
        this.clanBattleList = res;
        this.clanBattleId = this.clanBattleList[0].clanBattleId;
        this.battleIdChange(this.clanBattleId);
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
    this.pcrApi
      .gvgTaskList(this.stage, this.serverType, this.clanBattleId)
      .pipe(finalize(() => (this.searchLoading = false)))
      .subscribe((res) => {
        this.dealGvgTaskList(res);
      });
  }

  dealGvgTaskList(arr: GvgTask[]) {
    arr.forEach((r) => {
      r.tasks.sort((a, b) => b.damage - a.damage);
      r.tasks.forEach((t) => {
        t.charas.sort((a, b) => b.searchAreaWidth - a.searchAreaWidth);
      });
    });
    this.gvgTaskList = arr;
    this.toggleAutoBoss();
  }

  toggleImgSource(url: string) {
    this.rediveSrv.changeImgSource(url);
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
      case CanAutoType.auto:
        return '#68B9FF';
      case CanAutoType.harfAuto:
        return '#1cbbb4';
      case CanAutoType.manual:
      default:
        return '#FF2277';
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

  clickStop() {}

  delteConfirm(boss: GvgTask, task: Task) {
    // this.deleteRef.triggerOk()
    this.loading = true;
    this.pcrApi
      .deleteTask(task.id, this.serverType)
      .pipe(finalize(() => (this.loading = false)))
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
      nzComponentParams: {
        server: this.serverType,
      },
      nzFooter: null,
      nzWidth: '80%',
      nzMaskClosable: false,
    });
  }

  addTask(task?: Task, bossId?: number) {
    const bossList = this.gvgTaskList.map((r) => ({
      id: r.id,
      prefabId: r.prefabId,
      unitName: r.unitName,
    }));
    const modalRef = this.modalSrc.create({
      nzContent: AddTaskComponent,
      nzComponentParams: {
        bossId,
        task,
        bossList,
        stageOption: this.stageOption,
      },
      nzFooter: null,
      nzWidth: '80%',
      nzMaskClosable: false,
    });
    modalRef.afterClose.subscribe((r) => {
      const contentRef = modalRef.getContentComponent();
      if (contentRef.gvgTaskList.length) {
        this.dealGvgTaskList(contentRef.gvgTaskList);
        this.stage = contentRef.validateForm.getRawValue().stage;
      }
    });
  }

  openNotice() {
    this.modalSrc.create({
      nzContent: NoticeComponent,
      nzComponentParams: {
        operate: this.operate,
        notice: this.notice,
        server: this.serverType,
        clanBattleId: this.clanBattleId,
      },
      nzFooter: null,
      nzWidth: '80%',
      nzMaskClosable: false,
    });
  }
  /**
   * 筛刀
   */
  filter() {
    const [bossList, taskList] = [[], []];
    this.filterGvgTaskList.forEach((r) => {
      taskList.push(r);
      bossList.push({
        prefabId: r.prefabId,
        id: r.id,
        count: 1,
      });
    });
    if (!taskList.length) {
      throw new Error('选择至少一个boss');
    }
    this.filterLoading = true;
    if (typeof Worker !== 'undefined') {
      let worker: Worker;
      // 由于同源策略,无法加载加载cdn中的worker,如果worker类方法有改变需要修改版本
      if( environment.production) {
        worker =  createWorker('https://cdn.jsdelivr.net/gh/pcrgvg/statics@1626531153/0.2606a39a918b8678c74d.worker.js');
      } else {
        worker = new Worker('../work/filter.worker', { type: 'module' });
      }
      // const 
      // const worker =  createWorker('work/filter.worker');
      // const blob = new Blob([`onmessage = function({data}) { console.log(data); const res = filterTask(data); postMessage('msg from worker'); }`]);
      // const worker = new Worker(window.URL.createObjectURL(blob));
      worker.onmessage = ({ data }) => {
        console.log(`worker message: ${data.length}`);
        this.filterLoading = false;
        // this.storageSrv.sessionSet(Constants.filterResult, data.slice(0, 200));
        // window.open('/gvgresult', '');
        this.filterResultSrv.setFilterResult(data);
        this.filterResultSrv.setBosslist(bossList);
        this.router.navigate(['/gvg/result']);
        worker.terminate();
      };

      worker.postMessage({
        bossList: taskList,
        removedList: this.storageSrv.localGet(storageNames.removedList) ?? [],
        usedList: this.storageSrv.localGet(storageNames.usedList) ?? [],
        unHaveCharas: this.unHaveCharaList,
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
        unHaveCharas: this.unHaveCharaList,
        server: this.serverType,
      });

      this.filterLoading = false;
      this.filterResultSrv.setFilterResult(filterResult);
      this.filterResultSrv.setBosslist(bossList);
      this.router.navigate(['/gvg/result']);
    }
  }

  openAll() {
    this.nzCollapsePanels.forEach((r) => {
      r.nzActive = true;
      r.markForCheck();
    });
  }

  closeAll() {
    this.nzCollapsePanels.forEach((r) => {
      r.nzActive = false;
      r.markForCheck();
    });
  }

  battleIdChange(id: number) {
    this.stageOption = this.rediveSrv.initStateOption(id);
    this.getNotice();
    this.stage = 1;
  }
  // 主动爬取doc
  updateCnTask() {
    this.updateCnTaskLoading = true;
    this.pcrApi
      .updateCnTask()
      .pipe(finalize(() => (this.updateCnTaskLoading = false)))
      .subscribe((res) => {
        this.nzNotificationSrv.success('', '更新成功');
      });
  }

  toggleAutoBoss() {
    const bossList = cloneDeep(this.gvgTaskList);
    const tempList = [];
    for (let index = 0; index < bossList.length; index++) {
      if (this.bossNumberList.includes(index + 1)) {
        const gvgtask = bossList[index];
        const tasks = cloneDeep(gvgtask.tasks);
        gvgtask.tasks = tasks.filter((task) => {
          let b = false;
          switch (this.usedOrRemoved) {
            case 'used':
              {
                b = this.usedList.includes(task.id);
              }
              break;
            case 'removed':
              {
                b = this.removedList.includes(task.id);
              }
              break;
            case 'all':
            default:
              b = true;
          }
          if (b) {
            for (const canAuto of task.canAuto) {
              const isHaved = this.autoSetting.includes(canAuto);
              if (isHaved) {
                return true;
              }
            }
          }
          return false;
        });
        tempList.push(gvgtask);
      }
    }
    this.filterGvgTaskList = tempList;
  }
}
