import { Injectable } from '@angular/core';
import { clone, cloneDeep } from 'lodash';
import { Task, GvgTask, Chara } from '../../models';
import { RediveDataService } from './redive-data.service';

type BossTask = Task & { bossId: number; prefabId: number; disabeld?: boolean; borrowChara?: Chara; index: number };

@Injectable({
  providedIn: 'root',
})
export class FilterTaskService {
  constructor(private rediveDataSrv: RediveDataService) {}

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
          index: boss.index,
          ...task,
        });
      });
    });
    return tasks;
  }
  /**
   * 处理未拥有角色
   */
  filterUnHaveCharas(charas: Chara[]): number[] {
    const unHaveCharaPrefabIds: number[] = [];
    for (const chara of this.rediveDataSrv.unHaveCharas) {
      if (charas.findIndex((c) => c.prefabId === chara.prefabId) > -1) {
        unHaveCharaPrefabIds.push(chara.prefabId);
      }
    }

    return unHaveCharaPrefabIds;
  }

  /**
   *
   * @param charas
   * 重复几次代表要借几次, 借完符合
   */
  repeatCondition(prefabIds: number[], bossTasks: BossTask[]): [boolean, BossTask[]] {
    const map = new Map<number, number>();
    for (const prefabId of prefabIds) {
      const charaCount = map.get(prefabId) ?? 0;
      map.set(prefabId, charaCount + 1);
    }
    /// 解决 bossTask.borrowChara引用问题
    const bossTasksTemp = cloneDeep(bossTasks);
    for (const bossTask of bossTasksTemp) {
      const keys = [...map.keys()];
      // if (keys.length > 2) {
      //   return [false, []];
      // }
      let boolCondition = false;
      let repeatChara: Chara = null;
      for (const k of keys) {
        repeatChara = bossTask.charas.find((chara) => chara.prefabId === k);
        if (repeatChara) {
          const charaCount = map.get(k);
          if (charaCount > 0 && !bossTask.borrowChara) {
            bossTask.borrowChara = repeatChara;
            map.set(k, charaCount - 1);
            boolCondition = true;
          }
        }
      }
    }

    const values = [...map.values()];
    return [values.every((v) => v === 0), bossTasksTemp];
  }

  /**
   * 筛选结果按照分数从高到低排序，已使用的在前
   */
  fliterResult(bossTasks: BossTask[][]): BossTask[][] {
    const result: BossTask[][] = [];
    let usedArr: BossTask[][] = [];
    let unUsedArr: BossTask[][] = [];
    for (const bossTask of bossTasks) {
      const set = new Set();
      const arr: number[] = [];
      const charas = [];
      for (const task of bossTask) {
        for (const chara of task.charas) {
          const size = set.size;
          charas.push(chara);
          set.add(chara.prefabId);
          /// 如果长度不变，说明是重复的
          if (size === set.size) {
            arr.push(chara.prefabId);
          }
        }
      }
      const unHaves = this.filterUnHaveCharas(charas);
      const [b, t] = this.repeatCondition([...arr, ...unHaves], bossTask);
      if (b) {
        if (t.findIndex((item) => item.isUsed) > -1) {
          usedArr.push(t);
        } else {
          unUsedArr.push(t);
        }
      }
    }

    usedArr = this.sortByScore(usedArr);
    unUsedArr = this.sortByScore(unUsedArr);

    return [...usedArr, ...unUsedArr];
  }
  /**
   *
   * @param arr 按照分数排序，暂时分数系数为4阶段
   */
  sortByScore(arr: BossTask[][]) {
    const tempArr = cloneDeep(arr);
    // TODO 修改 1,2,3,4阶段的系数
    const scoreFactor = {
      1: {
        1: 1.2,
        2: 1.2,
        3: 1.3,
        4: 1.4,
        5: 1.5,
      },
      2: {
        1: 1.6,
        2: 1.6,
        3: 1.8,
        4: 1.9,
        5: 2,
      },
      3: {
        1: 2,
        2: 2,
        3: 2.4,
        4: 2.4,
        5: 2.6,
      },
      4: {
        1: 3.5,
        2: 3.5,
        3: 3.7,
        4: 3.8,
        5: 4.0,
      },
    };
    tempArr.sort((a, b) => {
      let [aScore, bScore] = [0, 0];
      a.forEach((task) => {
        aScore += task.damage * scoreFactor[task.stage][task.index];
      });
      b.forEach((task) => {
        bScore += task.damage * scoreFactor[task.stage][task.index];
      });
      return bScore - aScore;
    });
    return tempArr;
  }

  // 开始筛刀
  filterTask(bossList: GvgTask[]): BossTask[][] {
    if (!bossList.length) {
      return [];
    }
    const bossTask: BossTask[] = this.flatTask(bossList);
    let bossTasks: BossTask[][] = this.combine(bossTask, 3);
    let result: BossTask[][] = this.fliterResult(bossTasks);
    /// 一般来说肯定会有3刀的情况
    if (!result.length) {
      bossTasks = this.combine(bossTask, 2);
      result = this.fliterResult(bossTasks);
    }

    // if (!result.length) {
    //   bossTasks = this.combine(bossTask, 1);
    //   result = this.fliterResult(bossTasks);
    // }
    // console.log(result);

    return result;
  }
}
