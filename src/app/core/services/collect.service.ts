import { Injectable } from '@angular/core';
import { localforageName } from '@src/app/constants';
import { BossTask } from '@src/app/models';
import * as localforage from 'localforage';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root',
})
export class CollectService {
  constructor(private nzNotificationService: NzNotificationService) {
    this.init();
  }

  taskList: BossTask[][] = [];

  private init() {
    localforage.getItem<any[]>(localforageName.collect).then((r) => {
      const list = r ?? [];
      this.taskList = list;
    });
  }

  collect(bosstask) {
    const index = this.indexOfBossTask(bosstask);
    if (index > -1) {
      this.taskList.splice(index, 1);
      this.nzNotificationService.success('', '取消收藏成功');
    } else {
      this.taskList.push(bosstask);
      this.nzNotificationService.success('', '收藏成功');
    }
    this.setStorage();
  }

  setStorage() {
    localforage.setItem(localforageName.collect, this.taskList);
  }

  isCollected(bosstask: BossTask[]) {
    return this.indexOfBossTask(bosstask) > -1;
  }

  indexOfBossTask(bosstask: BossTask[]) {
    const ids = bosstask
      .map((r) => r.id)
      .sort()
      .toString();

    for (let index = 0; index < this.taskList.length; index++) {
      const item = this.taskList[index];
      const ids1 = item
        .map((r) => r.id)
        .sort()
        .toString();
      if (ids === ids1) {
        return index;
      }
    }
    return -1;
  }

  clear() {
    this.taskList = [];
    this.setStorage();
  }
}
