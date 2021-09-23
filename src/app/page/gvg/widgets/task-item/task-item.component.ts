import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PcrApiService } from '@src/app/apis';
import { storageNames } from '@src/app/constants';
import { StorageService } from '@src/app/core';
import { CanAutoType, Chara, GvgTask, ServerType, Task } from '@src/app/models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'pcr-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent  {


  constructor(
    private storageSrv: StorageService,
    private pcrApi: PcrApiService,
  ) {
  }

  @Input() task: Task;

  @Input()  usedList: number[] = []; // 已使用的作业
  @Input()  removedList: number[] = []; // 去除
  @Input() operate = false; //
  @Input() serverType = ServerType.jp; //

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onAddTask = new EventEmitter<Task>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onDelete = new EventEmitter<Task>();
  loading = false;
  canAutoType = CanAutoType;




  trackByCharaFn(_: number, chara: Chara): number {
    return chara.prefabId;
  }

  clickStop() { }

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


    toggleUsed(event, task: Task) {
      const index = this.usedList.findIndex((r) => r === task.id);
      if (index > -1) {
        this.usedList.splice(index, 1);
      } else {
        this.usedList.push(task.id);
      }
      this.storageSrv.localSet(storageNames.usedList, this.usedList);
    }
    toggleRemoved(event, task: Task) {
      const index = this.removedList.findIndex((r) => r === task.id);
      if (index > -1) {
        this.removedList.splice(index, 1);
      } else {
        this.removedList.push(task.id);
      }
      this.storageSrv.localSet(storageNames.removedList, this.removedList);
    }


    addTask() {
      this.onAddTask.emit(this.task);
    }

    deleteConfirm() {
      this.loading = true;
      this.pcrApi
        .deleteTask(this.task.id, this.serverType)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe((res) => {
          this.onDelete.emit(this.task);
        });
    }


    fixedBorrowChara(chara: Chara) {
      if (chara.prefabId == this.task.fixedBorrowChara?.prefabId) {
        this.task.fixedBorrowChara = null;
      } else {
        this.task.fixedBorrowChara = chara;
      }

    }
}
