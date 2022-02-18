import { Component, Input, OnInit } from '@angular/core';
import { RediveDataService, StorageService, unHaveCharas } from '@app/core';
import { Chara, ServerType } from '@src/app/models';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { I18nService } from '@app/core/services/I18n/i18n.service'
import { CN } from '@app/core/services/I18n/cn'


@Component({
  selector: 'pcr-add-un-have',
  templateUrl: './add-un-have.component.html',
  styleUrls: ['./add-un-have.component.scss']
})
export class AddUnHaveComponent implements OnInit {

  constructor(
    public rediveDataSrv: RediveDataService,
    private storageSrv: StorageService,
    private modalSrc: NzModalService,
    private i18nService: I18nService
  ) { }

  unHaveCharas: Chara[] = [];
  @Input()
  server: ServerType;
  gvgPage = CN.gvgPage;
  ngOnInit(): void {
    this.unHaveCharas = this.rediveDataSrv.unHaveCharas[this.server] ?? [];
    this.i18nService.getLanguagePackObs().subscribe(r => {
      this.gvgPage = r.gvgPage
    })
  }

  trackByCharaFn(_: number, chara: Chara): number {
    return chara.prefabId;
  }

  toggleSelect(chara: Chara) {
    let charas = [...this.unHaveCharas];
    if (charas?.findIndex((r) => r.prefabId === chara.prefabId) === -1) {
      charas.push(chara);
    } else {
      charas = charas?.filter((r) => r.prefabId !== chara.prefabId);
    }
    charas = charas.sort((a, b) => a.searchAreaWidth - b.searchAreaWidth);
    this.unHaveCharas = charas;
  }

  isSelected(chara: Chara) {
    return this.unHaveCharas.findIndex((r) => r.prefabId === chara.prefabId) > -1;
  }

  confirm() {
    this.rediveDataSrv.setUnHaveChara({
      ...this.rediveDataSrv.unHaveCharas,
      [this.server]: this.unHaveCharas
    });

    this.modalSrc.closeAll();
  }

}
