import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BossTask, Chara, GvgTask } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class FilterResultService {
  private filterResultSub = new BehaviorSubject<BossTask[][]>([]);
  private bosslistSub = new BehaviorSubject<GvgTask[]>([]);

  constructor() { }

  setFilterResult( task: BossTask[][]) {
    this.filterResultSub.next(task);
  }

  get filterResult(): BossTask[][] {
    return this.filterResultSub.getValue();
  }

  setBosslist( task: GvgTask[]) {
    this.bosslistSub.next(task);
  }

  get bosslist(): GvgTask[] {
    return this.bosslistSub.getValue();
  }
  
}
