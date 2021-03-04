import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService} from 'ng-zorro-antd/modal';
import * as localforage from 'localforage';
import { StorageService, unHaveCharas } from '@app/core/services'


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('clearTpl') clearTpl:TemplateRef<any>
  constructor(
    private router: Router,
    private nzModalSrc: NzModalService,
    private storageSrv: StorageService
  ) {}

  ngOnInit(): void {}

  toHome() {
    this.router.navigate(['/'])
  }

  toAbout() {
    this.router.navigate(['/about'])
  }

  clearStorage() {
    this.nzModalSrc.create({
      nzContent: this.clearTpl,
      nzFooter: null,
      nzWidth: 300,
      
    })
  }

   /**
   *
   * @param type 1所有 2 不包含未拥有
   */
  storageClear(type: number) {
    if (type === 1) {
      this.storageSrv.clearAll();
      localforage.clear()
    } else {
      const unCharas = this.storageSrv.localGet(unHaveCharas);
      this.storageSrv.clearAll();
      localforage.clear()
      this.storageSrv.localSet(unHaveCharas, unCharas);
    }
    location.reload();
  }
}
