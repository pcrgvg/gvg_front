import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NzModalService} from 'ng-zorro-antd/modal'
import { StorageService } from '@app/core/services/storage.service'

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {
  constructor(
    private nzModalSrv: NzModalService,
    private storageSrv: StorageService
  ) { }
  @ViewChildren('adWrapper') ads: QueryList<any>

  ngOnInit(): void {
    const showTip = this.storageSrv.localGet('showTip', true);
    if (showTip) {
      this.nzModalSrv.info({
        nzMask: true,
        nzContent: '作业列表点击角色的头像，可设置该角色为强制借用(可能有BUG)，同时摸了一个APP出来，详情首页',
        nzOnOk: (r) => {
          this.storageSrv.localSet('showTip', false);
        },
        nzOnCancel: () => {
          this.storageSrv.localSet('showTip', false);
        }
      })
    }
  }

  ngAfterViewInit() {
    for (let index = 0; index < this.ads.length + 1; index++) {
      ((window as any).adsbygoogle || [])?.push({});
    }
   
  }

}
