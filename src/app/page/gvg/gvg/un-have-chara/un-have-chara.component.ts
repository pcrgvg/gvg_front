import { Component, Input, OnInit } from '@angular/core';
import { RediveDataService, RediveService, ServerUnChara } from '@src/app/core';
import { Chara, ServerType } from '@src/app/models';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddUnHaveComponent } from '../../widgets/add-un-have/add-un-have.component';
import { I18nService } from '@app/core/services/I18n/i18n.service'
import { CN } from '@app/core/services/I18n/cn'

@Component({
  selector: 'pcr-un-have-chara',
  templateUrl: './un-have-chara.component.html',
  styleUrls: ['./un-have-chara.component.scss'],
})
export class UnHaveCharaComponent implements OnInit {
  constructor(
    private modalSrc: NzModalService,
    private rediveDataSrv: RediveDataService,
    private i18nService: I18nService,
  ) {}

  @Input() serverType = ServerType.jp;

  serverUnCharas: ServerUnChara;
  gvgPage = CN.gvgPage

  ngOnInit(): void {
    this.rediveDataSrv
    .getUnHaveCharaOb()
    .subscribe((res) => {
      this.serverUnCharas = res;
    });
    this.i18nService.getLanguagePackObs().subscribe(r => {
      this.gvgPage = r.gvgPage
    })
  }

  // 未拥有角色
  get unHaveCharaList(): Chara[] {
    return this.serverUnCharas?.[this.serverType] ?? [];
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

  trackByCharaFn(_: number, chara: Chara): number {
    return chara.prefabId;
  }
}
