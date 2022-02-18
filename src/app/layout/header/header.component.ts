import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as localforage from 'localforage';
import { StorageService, unHaveCharas } from '@app/core/services';
import { I18nService } from '@app/core/services/I18n/i18n.service';

interface DropMenu {
  value: string;
  label: string;
}

@Component({
  selector: 'pcr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('clearTpl') clearTpl: TemplateRef<any>;
  constructor(
    private router: Router,
    private nzModalSrc: NzModalService,
    private storageSrv: StorageService,
    private i18nSrv: I18nService
  ) {}
  language = '中文';
  dropMenu: DropMenu[] = [
    {
      label: '中文',
      value: 'cn',
    },
    {
      label: 'English',
      value: 'en',
    },
    {
      label: '日本語',
      value: 'jp',
    },
  ];
  header = this.i18nSrv.getLanguagePackValue().header;
  ngOnInit(): void {
    this.i18nSrv.getLanguagePackObs().subscribe((r) => {
      this.header = r.header;
    });
  }

  toHome() {
    this.router.navigate(['/']);
  }

  toAbout() {
    this.router.navigate(['/about']);
  }

  clearStorage() {
    this.nzModalSrc.create({
      nzContent: this.clearTpl,
      nzFooter: null,
      nzWidth: 300,
    });
  }

  /**
   *
   * @param type 1所有 2 不包含未拥有
   */
  storageClear(type: number) {
    if (type === 1) {
      this.storageSrv.clearAll();
      localforage.clear();
    } else {
      const unCharas = this.storageSrv.localGet(unHaveCharas);
      this.storageSrv.clearAll();
      localforage.clear();
      this.storageSrv.localSet(unHaveCharas, unCharas);
    }
    location.reload();
  }

  changeLanguage(item: DropMenu) {
    this.language = item.label;
    this.i18nSrv.setLanguage(item.value);
  }
}
