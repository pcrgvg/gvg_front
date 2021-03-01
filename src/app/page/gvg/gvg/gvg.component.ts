import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PcrApiService, ChangelogServiceApi, NoticeApiService } from '@app/apis';
import { storageNames } from '@app/constants';
import { RediveDataService, RediveService, StorageService } from '@app/core';
import { CanAutoName, CanAutoType, Chara, GvgTask, ServerName, ServerType } from '@app/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    console.log('getClanBattleList')
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
}
