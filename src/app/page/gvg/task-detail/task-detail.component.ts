import { Component, OnInit } from '@angular/core';
import { Task } from '@app/models'
import { storageNames } from '@src/app/constants';
import { StorageService } from '@src/app/core';
import { TempService } from '../services/temp.service';

@Component({
  selector: 'pcr-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {

  constructor(
    private tempSrv: TempService,
    private storageSrv: StorageService,
  ) { }

  task:Task;
  usedList: number[]  = [];
  removedList: number[]  = [];
  ngOnInit(): void {
    this.task = this.tempSrv.task;
    this.usedList = this.storageSrv.localGet(storageNames.usedList) ?? [];
    this.removedList = this.storageSrv.localGet(storageNames.removedList) ?? [];
  }

  trackBy(index: number) {
    return index;
  }
}
