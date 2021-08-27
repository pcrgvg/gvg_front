import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TempService {

  constructor() { }

  private taskSub = new BehaviorSubject<Task>(null);
  private taskGroupSub = new BehaviorSubject<Task[]>([]);

  setTask(task: Task) {
    this.taskSub.next(task);
  }

  get task(): Task {
    return  this.taskSub.getValue();
  }

  setTaskGroup(taskList: Task[]) {
    this.taskGroupSub.next(taskList);
  }

  get taskGroup(): Task[] {
    return  this.taskGroupSub.getValue();
  }


}
