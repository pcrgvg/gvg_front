import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NoticeApiService } from '@apis';
import { Notice, ServerType } from '@src/app/models';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss'],
})
export class NoticeComponent implements OnInit {
  notice: Notice;
  content = '';
  operate = false;
  constructor(
    private noticeApiSrv: NoticeApiService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      server: ServerType;
      clanBattleId: number;
    },
    private matDialog: MatDialog,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const serverType = this.route.snapshot.queryParams.serverType;
    this.operate = serverType === '114' || serverType === '142';
    this.noticeApiSrv.getNotice(this.data).subscribe((r) => {
      this.notice = r;
      this.content = r.content;
    });
    console.log(this);
  }

  confirm() {
    this.noticeApiSrv
      .updateNotice({
        ...this.notice,
        content: this.content,
        ...this.data,
      })
      .subscribe((r) => {
        this.matDialog.closeAll();
      });
  }
}
