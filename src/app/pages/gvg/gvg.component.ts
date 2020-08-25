import { Component, OnInit, ViewChild } from '@angular/core';
import { PcrApiService } from '@apis';
import { Chara, Task, GvgTask } from '@pcrgvg/models';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from './widgets/add-task/add-task.component';
import { FilterTaskService, RediveService } from '@core';
import { cloneDeep } from 'lodash';
import { CanAutoType } from '@src/app/models';

type BossTask = Task & { bossId: number };

@Component({
  selector: 'app-gvg',
  templateUrl: './gvg.component.html',
  styleUrls: ['./gvg.component.scss'],
})
export class GvgComponent implements OnInit {
  readonly a = 8;
  constructor(
    private pcrApi: PcrApiService,
    private matDialog: MatDialog,
    private ftSrc: FilterTaskService,
    private redive: RediveService,
  ) {}

  charaList: Chara[] = [];

  bossList: GvgTask[] = [];
  filterBossList: GvgTask[] = [];

  filterResult: BossTask[][] = [];

  onlyAuto: boolean = false;

  ngOnInit(): void {
    this.getGvgTaskList();
    // this.getCharaList();
  }

  getGvgTaskList() {
    this.pcrApi.gvgTaskList().subscribe((res) => {
      this.bossList = res;
      this.filterBossList = res;
    });
  }

  getCharaList() {
    this.pcrApi.charaList().subscribe((res) => {
      this.charaList = res;
    });
  }

  filter() {
    this.filterResult = this.ftSrc.filterTask(this.filterBossList);
  }

  toggleModal(task?: Task, bossId?: number) {
    const dialogRef = this.matDialog.open(AddTaskComponent, {
      data: {
        charaList: this.charaList,
        task: task
          ? cloneDeep(task)
          : {
              charas: [],
            },
        bossList: this.bossList,
        bossId,
      },
      closeOnNavigation: true,
    });
    dialogRef.afterClosed().subscribe((res: { bossId: number; gvgTask: GvgTask }) => {
      if (res) {
        const { bossId, gvgTask } = res;
        const boss = this.bossList.find((boss) => boss.id === bossId);
        boss.tasks.push(gvgTask.tasks[0]);
      }
    });
  }

  toggleAuto() {
    this.onlyAuto = !this.onlyAuto;
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
}
