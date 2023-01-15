import { Component, OnInit } from '@angular/core';
import { localforageName, storageNames } from '@src/app/constants';
import { StorageService } from '@src/app/core';
import { BossTask } from '@src/app/models';
import * as localforage from 'localforage';

@Component({
  selector: 'pcr-collectpage',
  templateUrl: './collectpage.component.html',
  styleUrls: ['./collectpage.component.scss'],
})
export class CollectpageComponent implements OnInit {
  constructor(private storageSrv: StorageService) {}

  taskList: BossTask[][] = [];
  usedList: number[] = [];

  ngOnInit(): void {
    localforage.getItem<any[]>(localforageName.collect).then((r) => {
      const list = r ?? [];
      this.taskList = list;
    });

    this.usedList = this.storageSrv.localGet(storageNames.usedList) ?? [];
  }
}
