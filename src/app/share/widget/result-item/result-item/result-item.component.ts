import { Component, Input, OnInit } from '@angular/core';
import { CN } from '@src/app/core/services/I18n';
import { BossTask, CanAutoType, GvgTask, Task } from '@src/app/models';

@Component({
  selector: 'pcr-result-item',
  templateUrl: './result-item.component.html',
  styleUrls: ['./result-item.component.scss'],
})
export class ResultItemComponent {
  constructor() {}

  canAutoType = CanAutoType;
  commonPage = CN.common;

  @Input()
  task: any;

  @Input()
  usedList: any;

  autoColor(canAuto: number) {
    switch (canAuto) {
      case CanAutoType.auto:
        return '#68B9FF';
      case CanAutoType.harfAuto:
        return '#1cbbb4';
      case CanAutoType.manual:
      default:
        return '#FF2277';
    }
  }
}
