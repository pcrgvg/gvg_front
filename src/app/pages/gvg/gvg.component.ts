import { Component, OnInit, OnDestroy } from '@angular/core';
import { PcrApiService } from '@apis';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from './widgets/add-task/add-task.component';
import { FilterTaskService, RediveDataService } from '@core';
import { cloneDeep } from 'lodash';
import { BossTask, CanAutoType, Chara, GvgTask, ServerName, ServerType, Task } from '@src/app/models';
import { finalize, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { AddUnHaveComponent } from './widgets/add-un-have/add-un-have.component';
import { InstructionsComponent } from './widgets/instructions/instructions.component';

@Component({
  selector: 'app-gvg',
  templateUrl: './gvg.component.html',
  styleUrls: ['./gvg.component.scss'],
})
export class GvgComponent implements OnInit, OnDestroy {
  constructor(
    private pcrApi: PcrApiService,
    private matDialog: MatDialog,
    private ftSrv: FilterTaskService,
    private rediveDataSrv: RediveDataService,
  ) {}

  charaList: Chara[] = [];
  stage = 4;
  stageOption = [];
  bossList: GvgTask[] = [];
  filterBossList: GvgTask[] = [];
  filterResult: BossTask[][] = [];
  unHaveChara: Chara[] = [];
  OnDestroySub = new Subject();
  onlyAuto = false;
  loading = false;
  serverType = ServerType.jp;
  serverOption = [
    {
      label: ServerName.jp,
      value: ServerType.jp,
    },
    {
      label: ServerName.tw,
      value: ServerType.tw,
    },
  ];

  ngOnInit(): void {
    this.stageOption = new Array(4).fill(1).map((r, i) => {
      return {
        value: i + 1,
      };
    });
    this.getGvgTaskList();
    this.getCharaList();
    this.rediveDataSrv
      .getUnHaveCharaOb()
      .pipe(takeUntil(this.OnDestroySub))
      .subscribe((res) => {
        this.unHaveChara = res;
      });
  }

  ngOnDestroy(): void {
    this.OnDestroySub.next();
    this.OnDestroySub.complete();
  }

  getGvgTaskList() {
    this.pcrApi.gvgTaskList(this.stage, this.serverType).subscribe((res) => {
      this.bossList = res;
      this.filterBossList = res;
    });
  }

  getCharaList() {
    this.pcrApi.charaList().subscribe((res) => {
      this.rediveDataSrv.setCharaList(res);
    });
  }

  filter() {
    this.filterResult = this.ftSrv.filterTask(this.filterBossList);
    // this.location.go()
    sessionStorage.setItem('filterResult', JSON.stringify(this.filterResult));
    window.open('/gvgresult', '');
  }

  toggleModal(task?: Task, bossId?: number) {
    const dialogRef = this.matDialog.open(AddTaskComponent, {
      data: {
        task: task
          ? cloneDeep(task)
          : {
              charas: [],
            },
        bossList: this.bossList,
        bossId,
        serverType: this.serverType,
      },
      closeOnNavigation: true,
    });
    dialogRef.afterClosed().subscribe((res: { bossId: number; gvgTask: GvgTask }) => {
      if (res) {
        // this.getGvgTaskList();
        const { bossId, gvgTask } = res;
        const task = gvgTask.tasks[0];
        if (task.stage !== this.stage || task.server !== this.serverType) {
          return;
        }
        const boss = this.bossList.find((boss) => boss.id === bossId);
        const index = boss.tasks.findIndex((r) => r.id === task.id);

        if (index > -1) {
          boss.tasks[index] = task;
        } else {
          boss.tasks.push(task);
        }
      }
    });
  }

  openUnHaveModal() {
    this.matDialog.open(AddUnHaveComponent, {
      closeOnNavigation: true,
    });
  }

  openInstructions() {
    this.matDialog.open(InstructionsComponent);
  }

  toggleAuto() {
    const bossList = cloneDeep(this.bossList);
    if (this.onlyAuto) {
      bossList.forEach((gvgtask) => {
        const tasks = cloneDeep(gvgtask.tasks);
        gvgtask.tasks = tasks.filter((task) => task.canAuto !== CanAutoType.unAuto);
      });
    }
    this.filterBossList = bossList;
  }

  trackByBossFn(_: number, boss: GvgTask): number {
    return boss.id;
  }

  trackByCharaFn(_: number, chara: Chara): number {
    return chara.prefabId;
  }

  delelteTask(boss: GvgTask, task: Task) {
    this.loading = true;
    this.pcrApi
      .deleteTask(task.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((res) => {
        const index = boss.tasks.findIndex((r) => r.id === task.id);
        boss.tasks.splice(index, 1);
      });
  }
}
