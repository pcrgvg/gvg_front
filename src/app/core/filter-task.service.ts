import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { Task, GvgTask } from '../models';

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

type BossTask = Task & { bossId: number; prefabId: number; disabeld?: boolean };

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
        // if (subResult.findIndex((r) => r.isUsed) > -1) {
        //   result.unshift(subResult.slice(0));
        // } else {
        //   result.push(subResult.slice(0));
        // }
        if (subResult.findIndex((r) => r.disabeld) > -1) {
          return;
        }
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
  flatTask(bossList: GvgTask[]): BossTask[] {
    const list = cloneDeep(bossList);
    const tasks: BossTask[] = [];
    // flat task
    list.forEach((boss) => {
      boss.tasks.forEach((task) => {
        tasks.push({
          bossId: boss.id,
          prefabId: boss.prefabId,
          ...task,
        });
      });
    });
    return tasks;
  }

  /**
   *
   * @param charas 最多只能有2个角色重复，并且只能有其中一个角色最多重复2次
   * true表示符合规则
   */
  repeatCondition(charas: number[]): boolean {
    const map = new Map<number, number>();
    for (const chara of charas) {
      const charaCount = map.get(chara) ?? 0;
      map.set(chara, charaCount + 1);
    }
    const keys = Array.from(map.keys());
    if (keys.length > 2) {
      return false;
    }
    const values = Array.from(map.values());
    if (values[0] === 2 && values[1] === 2) {
      return false;
    }
    return true;
  }
  /**
   *
   */
  findRepeatChara(bossTasks: BossTask[][]): BossTask[][] {
    const result: BossTask[][] = [];
    for (let i = 0; i < bossTasks.length; i++) {
      const bossTask = bossTasks[i];
      const set = new Set();
      const arr: number[] = [];
      for (let bossTask_i = 0; bossTask_i < bossTask.length; bossTask_i++) {
        const task = bossTask[bossTask_i];
        // if (this.repeatCondition(arr)) {
        //   break;
        // }
        for (let chara_i = 0; chara_i < task.charas.length; chara_i++) {
          const chara = task.charas[chara_i];
          const size = set.size;
          set.add(chara.prefabId);
          /// 如果长度不变，说明是重复的
          if (size === set.size) {
            arr.push(chara.prefabId);
            // if (this.repeatCondition(arr)) {
            //   break;
            // }
          }
        }
      }
      if (this.repeatCondition(arr)) {
        result.push(bossTask);
      }
    }

    return result;
  }

  // 开始筛刀 15/10个角色
  filterTask(bossList: GvgTask[]): BossTask[][] {
    const bossTask: BossTask[] = this.flatTask(bossList);
    let bossTasks: BossTask[][] = this.combine(bossTask, 3);
    let result: BossTask[][] = this.findRepeatChara(bossTasks);
    /// 一般来说肯定会有3刀的情况
    if (!result.length) {
      bossTasks = this.combine(bossTask, 2);
      result = this.findRepeatChara(bossTasks);
    }
    // console.log(result);
    result.sort((a, b) => {
      let [aScore, bScore] = [0, 0];
      a.forEach((task) => {
        aScore += task.damage * xishu[task.bossId];
      });
      b.forEach((task) => {
        bScore += task.damage * xishu[task.bossId];
      });
      return bScore - aScore;
    });
    return result;
  }
}

const xishu = {
  1: 3.5,
  2: 3.5,
  3: 3.7,
  4: 3.8,
  5: 4.0,
};
