import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PcrApiService,
  NoticeApiService,
} from '@app/apis';
import { storageNames } from '@app/constants';
import {
  RediveDataService,
  RediveService,
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
import { finalize, } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AddTaskComponent } from '../widgets/add-task/add-task.component';
import { filterTask } from '../services/filterTask';

import { FilterResultService } from '../services/filter-result.service';
import { NoticeComponent } from '../widgets/notice/notice.component';
import { NzCollapsePanelComponent } from 'ng-zorro-antd/collapse';
import { environment } from '@src/environments/environment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { getLocalWorkerUrl } from '@app/util/createWorker';
import { NzImageService } from 'ng-zorro-antd/image';
import { TempService } from '../services/temp.service';
import { RouteKeep, OnActived } from '@src/app/core/router-config/route-keep';


enum TaskType  {
 all = 'all',
 used = 'used',
 removed = 'removed',
 tail = 'tail',
}

const WokrerUrl = 'https://cdn.jsdelivr.net/gh/pcrgvg/gvg_front@v1.0.2/statics/worker/232.eb723d20787b89f4f37a.js';

@Component({
  selector: 'pcr-gvg',
  templateUrl: './gvg.component.html',
  styleUrls: ['./gvg.component.scss'],
})
export class GvgComponent   implements OnInit, RouteKeep {
  @ViewChildren(NzCollapsePanelComponent)
  nzCollapsePanels: NzCollapsePanelComponent[];
  // @ViewChildren('collapse')
  // nzCollapsePanels: NzCollapsePanelComponent[];
  NG_ROUTE_KEEP = true;
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
    private nzNotificationSrv: NzNotificationService,
    private nzImgSrv: NzImageService,
    private tempSrv: TempService,
  ) { }

  // 角色列表
  charaList: Chara[] = [];
  // 阶段
  stage = 1;
  // 阶段option
  stageOption = [];
  // 初始作业列表,缓存所有结果
  gvgTaskList: GvgTask[] = [];
  // 根据筛选条件显示的列表
  filterGvgTaskList: GvgTask[] = [];
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
  // 筛选loading
  filterLoading = false;
  // 搜索loading
  searchLoading = false;
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
    {
      label: ServerName.tw,
      value: ServerType.tw,
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
  taskType = [TaskType.all, TaskType.used, TaskType.removed, TaskType.tail];
  blobUrl = '';

  ngOnInit(): void {
    this.dealServerType();
    this.initImamgeSouce();
    this.dealServerOperate();
    this.usedList = this.storageSrv.localGet(storageNames.usedList) ?? [];
    this.removedList = this.storageSrv.localGet(storageNames.removedList) ?? [];
    this.toggleServer();
    getLocalWorkerUrl(WokrerUrl).then(url => {
      this.blobUrl = url;
    });

  }

  // ngOnActived(): void {
  //   const serverType = this.route.snapshot.paramMap.get('serverType');
  //   this.usedList = this.storageSrv.localGet(storageNames.usedList) ?? [];
  //   this.removedList = this.storageSrv.localGet(storageNames.removedList) ?? [];
  //   if (serverType != this.serverType) {
  //     this.dealServerType();
  //     this.dealServerOperate();
  //     this.toggleServer();
  //   }
  // }


  dealServerOperate() {
    const serverType = this.route.snapshot.queryParams.serverType;
    switch (serverType) {
      case '114': {
        this.operate = this.serverType === ServerType.cn;
      }           break;
      case '142':
        this.operate = this.serverType === ServerType.jp;
        break;
      case '143':
        this.operate = this.serverType === ServerType.tw;
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
      case ServerType.tw: this.serverType = ServerType.tw; break;
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
  // 排序
  dealGvgTaskList(arr: GvgTask[]) {
    arr.forEach((r) => {
      r.tasks.sort((a, b) => this.typeDamage(b) - this.typeDamage(a));
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


  trackByBossFn(_: number, boss: GvgTask): number {
    return boss.id;
  }

  trackByTaskFn(_: number, task: Task): number {
    return task.id;
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
  async filter() {
    const filterGvgTaskList = cloneDeep(this.filterGvgTaskList);
    const [bossList, taskList] = [[], []];
    filterGvgTaskList.forEach((r) => {
      r.tasks.forEach(t => {
        t.damage = this.typeDamage(t);
      });
      taskList.push(r);
      bossList.push({
        prefabId: r.prefabId,
        id: r.id,
        count: 1,
      });
    });
    if (!taskList.length) {
      this.nzNotificationSrv.error('', '选择至少一个boss');
      return;
    }
    this.filterLoading = true;
    const unHaveCharas = this.rediveDataSrv.unHaveCharas[this.serverType];


    /**
    * 由于同源策略,无法加载cdn中的worker, 并且火狐不支持importScripts
    * 法1：全部使用blob字符串，但是极其难以维护
    * 法2：先打包生成worker文件，再修改路径进行打包,稍微好维护一点
    */
    try {
      // 方法1
      // const blob = new Blob([workerString, `onmessage = function({data}) {
      //   const res = filterTask(data);
      //   postMessage(res);
      // }`], {type: 'text/javascript'});
      // const worker = new Worker(URL.createObjectURL(blob))

      // 方法2
      // const worker = new Worker(new URL('../work/filter.worker' , import.meta.url));
      const worker = new Worker(this.blobUrl);
      worker.onmessage = ({ data }) => {
        console.log(`worker message: ${data.length}`);
        this.filterLoading = false;
        this.filterResultSrv.setFilterResult(data);
        this.filterResultSrv.setBosslist(bossList);
        this.router.navigate(['/gvg/result']);
        worker.terminate();
      };

      worker.postMessage({
        bossList: taskList,
        removedList: this.storageSrv.localGet(storageNames.removedList) ?? [],
        usedList: this.storageSrv.localGet(storageNames.usedList) ?? [],
        unHaveCharas,
        server: this.serverType,
      });
      worker.onerror = (err) => {
        console.log(err);
        this.filterLoading = false;
      };

      // getLocalWorkerUrl('https://cdn.jsdelivr.net/gh/pcrgvg/statics@1626531153/0.2606a39a918b8678c74d.worker.js').then(url => {
      //   let worker: Worker = new Worker(url);

      // })
      // worker = new Worker('https://cdn.jsdelivr.net/gh/pcrgvg/statics@1626531153/0.2606a39a918b8678c74d.worker.js');

    } catch (error) {
      console.log(error);
      setTimeout(() => {
        const filterResult = filterTask({
          bossList: taskList,
          removedList: this.storageSrv.localGet(storageNames.removedList) ?? [],
          usedList: this.storageSrv.localGet(storageNames.usedList) ?? [],
          unHaveCharas,
          server: this.serverType,
        });

        this.filterLoading = false;
        this.filterResultSrv.setFilterResult(filterResult);
        this.filterResultSrv.setBosslist(bossList);
        this.router.navigate(['/gvg/result']);
      }, 500);
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
    this.stageOption = this.rediveSrv.initStateOption(id, this.serverType);
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
        let tasks = cloneDeep(gvgtask.tasks);
        tasks = this.filterTaskType(tasks);
        tasks = tasks.filter((task) => {
          for (const canAuto of task.canAuto) {
            const isHaved = this.autoSetting.includes(canAuto);
            if (isHaved) {
              return true;
            }
          }
          return false;
        });
        gvgtask.tasks = tasks;
        tempList.push(gvgtask);
      }
    }
    this.filterGvgTaskList = tempList;
  }

  filterTaskType(taskList: Task[]) {
      let result = [...taskList];
      if (!this.taskType.includes(TaskType.tail)) {
        result =  result.filter(r => r.type !== 1)
      }
      if (!this.taskType.includes(TaskType.removed)) {
        result = result.filter(r => !this.removedList.includes(r.id))
      }
      if (!this.taskType.includes(TaskType.used)) {
        result = result.filter(r => !this.usedList.includes(r.id))
      }
      if (!this.taskType.includes(TaskType.all)) {
        result = result.filter(r => r.type == 1 || this.removedList.includes(r.id) || this.usedList.includes(r.id))
      }
      return result;
  }
  // 如果包含手动，则使用damage， 如果不包含且有自动刀的伤害显示自动刀的伤害, 兼容以往数据
  typeDamage(task: Task) {
    if (this.autoSetting.includes(CanAutoType.manual)) {
      return task.damage;
    }
    if (this.autoSetting.includes(CanAutoType.harfAuto)) {
      return task.halfAutoDamage ?? task.damage;
    }
    return task.autoDamage ?? task.halfAutoDamage ?? task.damage;
  }

  // 删除作业
  onTaskDelete(task: Task, boss: GvgTask) {
    const index = boss.tasks.findIndex((r) => r.id === task.id);
    boss.tasks.splice(index, 1);
  }

  // 添加作业
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
        serverType: this.serverType
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

  previewImg(url: string) {
    this.nzImgSrv.preview([{ src: url }]);
  }

  toDetail(task: Task) {
    this.tempSrv.setTask(task);
    this.router.navigate(['/gvg/task-detail']);
  }
}
