import { Component, Input, OnInit } from '@angular/core';
import { CollectService } from '@app/core/services/collect.service';
import { ResultDetailComponent } from '../result-detail/result-detail.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'pcr-task-result',
  templateUrl: './task-result.component.html',
  styleUrls: ['./task-result.component.scss'],
})
export class TaskResultComponent {
  constructor(private collectService: CollectService, private nzModalService: NzModalService) {}

  @Input()
  bossTask: any[];
  @Input()
  usedList: any[];

  collect(bosstask) {
    this.collectService.collect(bosstask);
  }

  isCollected(bosstask) {
    return this.collectService.isCollected(bosstask);
  }

  viewDetail() {
    this.nzModalService.create({
      nzTitle: '作业详情',
      nzContent: ResultDetailComponent,
      nzComponentParams: {
        bossTask: this.bossTask,
      },
    });
  }
}
