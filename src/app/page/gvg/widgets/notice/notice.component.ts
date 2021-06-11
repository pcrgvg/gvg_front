import { Component, OnInit, Input } from '@angular/core';
import { NoticeApiService } from '@src/app/apis';
import { Notice, ServerType } from '@src/app/models';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'pcr-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {
  @Input() operate = false;
  @Input() notice: Notice;
  @Input() server: ServerType;
  @Input() clanBattleId: number;

  loading = false;


  constructor(
    private noticeApiSrv: NoticeApiService,
    private nzModalSrc: NzModalService
  ) { }

  ngOnInit(): void {
  }


  confirm() {
    if (this.operate) {
      this.loading = true;
      this.noticeApiSrv
        .updateNotice({
          ...this.notice,
          server: this.server,
          clanBattleId: this.clanBattleId
        })
        .pipe(
          finalize(() => this.loading = true)
        )
        .subscribe((r) => {
          this.nzModalSrc.closeAll();
        });
    } else {
      this.nzModalSrc.closeAll();
    }

  }
}
