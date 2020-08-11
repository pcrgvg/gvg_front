import { Injectable } from '@angular/core';
import { Chara, Task, Boss } from '@pcrgvg/models';
import { cloneDeep } from 'lodash';

/**
 *  bossId: number
 * bossName?: string;
 *  task: Task
 */
interface FilterResult {
  bossId: number;
  bossName?: string;
  task: Task;
}

type BossTask = Task & { bossId: number };

@Injectable({
  providedIn: 'root',
})
export class FilterTaskService {
  constructor() {}

  /**
   *
   * @param bossList
   * 返回所有长度为k的组合 BossTask[]
   * Array<Array<BossTask>>
   */
  combine(bossTask: BossTask[], k: number): BossTask[][] {
    const result: BossTask[][] = [];
    const subResult: BossTask[] = [];

    function combineSub(start: number, subResult: BossTask[]) {
      /// subResult长度符合k，放入result
      if (subResult.length === k) {
        result.push(subResult.slice(0));
        return;
      }
      const len = subResult.length;
      /// 还需要多少个元素才能符合条件，若bossTask剩余的长度不够，则不符合继续循环
      const conditionLen = bossTask.length - (k - len) + 1;
      for (let i = start; i < conditionLen; i++) {
        subResult.push(bossTask[i]);
        combineSub(i + 1, subResult);
        subResult.pop();
      }
    }
    combineSub(0, subResult);
    return result;
  }
  /**
   *
   * @param bossList
   * flat task
   */
  flatTask(bossList: Boss[]): BossTask[] {
    const list = cloneDeep(bossList);
    const tasks: BossTask[] = [];
    // flat task
    list.forEach((boss) => {
      boss.tasks.forEach((task) => {
        tasks.push({
          bossId: boss.id,
          ...task,
        });
      });
    });
    return tasks;
  }
  /**
   * 最多只能有2个角色重复，并且只能重复一次
   */
  findRepeatChara(bossTasks: BossTask[][]): BossTask[][] {
    const result: BossTask[][] = [];
    for (let i = 0; i < bossTasks.length; i++) {
      const bossTask = bossTasks[i];
      const set = new Set();
      const arr = [];
      for (let bossTask_i = 0; bossTask_i < bossTask.length; bossTask_i++) {
        const task = bossTask[bossTask_i];
        if (arr.length >= 3 || (arr.length > 0 && arr[0] === arr[1])) {
          break;
        }
        for (let chara_i = 0; chara_i < task.charas.length; chara_i++) {
          const chara = task.charas[chara_i];
          const size = set.size;
          set.add(chara.prefabId);
          /// 如果长度不变，说明是重复的
          if (size === set.size) {
            arr.push(chara.prefabId);
            if (arr.length >= 3 || (arr.length > 0 && arr[0] === arr[1])) {
              break;
            }
          }
        }
      }
      if (!(arr.length >= 3 || (arr.length > 0 && arr[0] === arr[1]))) {
        result.push(bossTask);
      }
    }

    return result;
  }

  // 开始筛刀 15/10个角色
  filterTask(bossList: Boss[]): BossTask[][] {
    const bossTask: BossTask[] = this.flatTask(bossList);
    let bossTasks: BossTask[][] = this.combine(bossTask, 3);
    let result: BossTask[][] = this.findRepeatChara(bossTasks);
    /// 一般来说肯定会有3刀的情况
    if (!result.length) {
      bossTasks = this.combine(bossTask, 2);
      result = this.findRepeatChara(bossTasks);
    }
    return result;
  }
}
