import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RediveDataService, RediveService, StorageService, unHaveCharas } from '@app/core';
import { Chara, ServerType } from '@src/app/models';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CN, I18nService, LanguagePack } from '@app/core/services/I18n';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CharaTalent } from '@src/app/constants';

@Component({
  selector: 'pcr-add-un-have',
  templateUrl: './add-un-have.component.html',
  styleUrls: ['./add-un-have.component.scss'],
})
export class AddUnHaveComponent implements OnInit, OnDestroy {
  constructor(
    public rediveDataSrv: RediveDataService,
    private storageSrv: StorageService,
    private modalSrc: NzModalService,
    private i18nService: I18nService,
    public redive: RediveService
  ) {}

  unHaveCharas: Chara[] = [];
  @Input()
  server: ServerType;
  gvgPage: LanguagePack['gvgPage'] = CN.gvgPage;
  destroySub$ = new Subject();
  talentOption = CharaTalent;
  /** 当前属性 默认所有 */
  talentId = 0
  ngOnInit(): void {
    this.unHaveCharas = this.rediveDataSrv.unHaveCharas[this.server] ?? [];
    this.i18nService
      .getLanguagePackObs()
      .pipe(takeUntil(this.destroySub$))
      .subscribe((r) => {
        this.gvgPage = r.gvgPage;
      });
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
      [this.server]: this.unHaveCharas,
    });

    this.modalSrc.closeAll();
  }

  get front() {
    if (this.talentId) {
      return this.rediveDataSrv.front.filter(r => r.talentId == this.talentId)
    }
    return this.rediveDataSrv.front
  }
  get middle() {
    if (this.talentId) {
      return this.rediveDataSrv.middle.filter(r => r.talentId == this.talentId)
    }
    return this.rediveDataSrv.middle
  }
  get back() {
    if (this.talentId) {
      return this.rediveDataSrv.back.filter(r => r.talentId == this.talentId)
    }
    return this.rediveDataSrv.back
  }


  ngOnDestroy(): void {
    this.destroySub$.next();
    this.destroySub$.complete();
  }
}
