import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PcrApiService } from '@apis';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from './widgets/add-task/add-task.component';
import { FilterTaskService, RediveService } from '@core';
import { cloneDeep } from 'lodash';
import { BossTask, CanAutoType, Chara, GvgTask, Task } from '@src/app/models';
import html2canvas from 'html2canvas';
import { Location } from '@angular/common';

@Component({
  selector: 'app-gvg',
  templateUrl: './gvg.component.html',
  styleUrls: ['./gvg.component.scss'],
})
export class GvgComponent implements OnInit {
  constructor(
    private pcrApi: PcrApiService,
    private matDialog: MatDialog,
    private ftSrc: FilterTaskService,
    private redive: RediveService,
    private location: Location,
  ) {}

  charaList: Chara[] = [];
  url = '';
  stage = 3;
  stageOption = [];
  bossList: GvgTask[] = [];
  filterBossList: GvgTask[] = [];

  filterResult: BossTask[][] = [];

  onlyAuto = false;

  ngOnInit(): void {
    this.stageOption = new Array(4).fill(1).map((r, i) => {
      return {
        value: i + 1,
      };
    });
    this.getGvgTaskList();
    this.getCharaList();
  }

  getGvgTaskList() {
    this.pcrApi.gvgTaskList(this.stage).subscribe((res) => {
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
        const task = gvgTask.tasks[0];
        const index = boss.tasks.findIndex((r) => r.id === task.id);

        if (index > -1) {
          boss.tasks[index] = task;
        } else {
          boss.tasks.push(task);
        }
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

  toImage() {
    html2canvas(document.getElementById('result'), {
      backgroundColor: '#fff',
      useCORS: false,
      allowTaint: false,
    }).then((canvas) => {
      this.url = canvas.toDataURL('image/png');
    });
  }

  trackByBossFn(_: number, boss: GvgTask): number {
    return boss.id;
  }

  trackByCharaFn(_: number, chara: Chara): number {
    return chara.prefabId;
  }

  delelteTask(boss: GvgTask, task: Task) {
    this.pcrApi.deleteTask(task.id).subscribe((res) => {
      const index = boss.tasks.findIndex((r) => r.id === task.id);
      boss.tasks.splice(index, 1);
    });
  }
}
