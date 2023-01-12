import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as localforage from 'localforage';
import { StorageService, CollectService, RediveDataService } from '@app/core/services';
import { I18nService } from '@app/core/services/I18n/i18n.service';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { localforageName, storageNames } from '@src/app/constants';

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
    private i18nSrv: I18nService,
    private analytics: AngularFireAnalytics,
    private rediveDataService: RediveDataService,
    private collectService: CollectService,
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
  allChecked = false;
  indeterminate = false;
  checkOptions = [
    { label: '未拥有角色', value: '1', checked: false },
    { label: '已使用作业', value: '2', checked: false },
    { label: '已去除作业', value: '3', checked: false },
    { label: '已使用轴', value: '4', checked: false },
    { label: '收藏夹', value: '5', checked: false },
    { label: '搜索条件', value: '6', checked: false },
    { label: '会战信息', value: '7', checked: false },
  ];

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

  toCollection() {
    this.router.navigate(['/collect']);
  }

  clearStorage() {
    this.nzModalSrc.create({
      nzContent: this.clearTpl,
      nzFooter: null,
      nzWidth: 500,
    });
  }

  /**
   *
   * @param type 1所有 2 不包含未拥有
   */
  storageClear() {
    if (this.allChecked) {
      this.storageSrv.clearAll();
      localforage.clear();
    } else {
      const checkedList = this.checkOptions.filter((r) => r.checked).map((r) => r.value);
      if (!checkedList.length) {
        return;
      }

      for (const value of checkedList) {
        switch (value) {
          case '1':
            this.rediveDataService.clearUnHaveChara();
            break;
          case '2':
            this.storageSrv.localSet(storageNames.usedList, []);
            break;
          case '3':
            this.storageSrv.localSet(storageNames.removedList, []);
            break;
          case '4':
            // TODO
            break;
          case '5':
            this.collectService.clear();
            break;
          case '6':
            localforage.setItem(localforageName.filter, {});
            break;
          case '7':
            localforage.setItem(localforageName.dbVersion, {});
            break;
          default:
            break;
        }
      }
    }
    location.reload();
  }

  changeLanguage(item: DropMenu) {
    this.language = item.label;
    this.i18nSrv.setLanguage(item.value);
    this.analytics.logEvent('change_lang', { lang: item.label });
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptions = this.checkOptions.map((item) => ({
        ...item,
        checked: true,
      }));
    } else {
      this.checkOptions = this.checkOptions.map((item) => ({
        ...item,
        checked: false,
      }));
    }
  }

  updateSingleChecked(): void {
    if (this.checkOptions.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptions.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
}
