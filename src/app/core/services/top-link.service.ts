import { Injectable } from '@angular/core';
import { localforageName } from '@src/app/constants';
import { Link } from '@src/app/models';
import * as localforage from 'localforage';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root',
})
export class TopLinkService {
  topLinkNameList: string[] = [];
  constructor(private nzNotificationService: NzNotificationService) {
    this.init();
  }

  private init() {
    localforage.getItem<any[]>(localforageName.topLink).then((r) => {
      const list = r ?? [];
      this.topLinkNameList = list;
    });
  }

  setTop(link: Link) {
    const index = this.indexOfLink(link);
    if (index > -1) {
      this.topLinkNameList.splice(index, 1);
      this.nzNotificationService.success('', '取消置顶');
    } else {
      this.topLinkNameList.push(link.name);
      this.nzNotificationService.success('', '置顶成功');
    }
    this.setStorage();
  }

  isSetTop(link: Link) {
    return this.indexOfLink(link) > -1;
  }

  indexOfLink(link: Link) {
    return this.topLinkNameList.indexOf(link.name);
  }

  clear() {
    this.topLinkNameList = [];
    this.setStorage();
  }

  setStorage() {
    localforage.setItem(localforageName.topLink, this.topLinkNameList);
  }
}
