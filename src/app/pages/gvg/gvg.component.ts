import { Component, OnInit } from '@angular/core';
import { PcrApiService } from '@api';
import { Chara, Task, Boss } from '@pcrgvg/models';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from './widgets/add-task/add-task.component';
import { FilterTaskService } from '@core';

type BossTask = Task & { bossId: number };

@Component({
  selector: 'app-gvg',
  templateUrl: './gvg.component.html',
  styleUrls: ['./gvg.component.scss'],
})
export class GvgComponent implements OnInit {
  constructor(private pcrApi: PcrApiService, private matDialog: MatDialog, private ftSrc: FilterTaskService) {}

  charaList: Chara[] = [];

  bossList: Boss[] = [];

  filterResult: BossTask[][] = [];

  ngOnInit(): void {
    this.getJson();
    // this.getCharaList();
  }

  getJson() {
    import('@src/assets/task.json').then((res: any) => {
      console.log(res.default, 'rrrrr');
      this.bossList = res.default;
    });
  }

  getCharaList() {
    this.pcrApi.charaList().subscribe((res) => {
      this.charaList = res;
    });
  }

  filter() {
    const a = new Date();
    this.filterResult = this.ftSrc.filterTask(this.bossList);
    const b = new Date();
    console.log(b.getTime() - a.getTime());
  }

  toggleModal() {
    const dialogRef = this.matDialog.open(AddTaskComponent, {
      data: {
        charaList: this.charaList,
        selectChara: [],
        bossList: this.bossList,
      },
      closeOnNavigation: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const { bossId, selectChara } = res;
        const boss = this.bossList.find((boss) => boss.id === bossId);
        boss.tasks.push({
          id: null,
          charas: selectChara,
        });
      }
    });
  }

  createJson() {
    this.pcrApi.updateTask(this.bossList).subscribe((res) => {});
  }

  trackByBossFn(_: number, boss: Boss): number {
    return boss.id;
  }
}
