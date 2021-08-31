/// <reference lib="webworker" />

import { Task, GvgTask, Chara, ServerType } from '../../../models';

type BossTask = Task & {
  bossId: number;
  prefabId: number;
  borrowChara?: Chara;
  index: number;
};
interface FilterTaskParams {
  bossList: GvgTask[];
  usedList: number[];
  removedList: number[];
  unHaveCharas: Chara[];
  server: ServerType;
}
/**
 * 太慢了。。极其费时间
 */
export function cloneDeep(params: any) {
  return JSON.parse(JSON.stringify(params));
}

export function flatTask(
  bossList: GvgTask[],
  removedList: number[]
): BossTask[] {
  // const list = cloneDeep(bossList);
  const tasks: BossTask[] = [];
  // flat task
  bossList.forEach((boss) => {
    boss.tasks.forEach((task) => {
      // 1为尾刀不计入
      if (!haveRemoved(task, removedList) && task.type != 1) {
        tasks.push({
          bossId: boss.id,
          prefabId: boss.prefabId,
          index: boss.index,
          ...task,
        });
      }
    });
  });
  return tasks;
}

export function haveRemoved(task: Task, removedList: number[]): boolean {
  if (removedList.includes(task.id)) {
    return true;
  }
  return false;
}

/**
 *
 * @param bossList
 * 返回所有长度为k的组合 BossTask[]
 * Array<Array<BossTask>>
 */
export function combine(bossTask: BossTask[], k: number): BossTask[][] {
  const result: BossTask[][] = [];
  const subResult: BossTask[] = [];

  const combineSub = (start: number, subResult: BossTask[]) => {
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
  };
  combineSub(0, subResult);
  console.log(result.length, 'combine length');
  return result;
}

/**
 *
 * @param prefabIds  重复的角色
 * @param bossTasks
 * 重复几次代表要借几次, 借完符合
 */
export function repeatCondition(
  repeateCharas: number[],
  unHaveCharas: number[],
  bossTasks: BossTask[]
): [boolean, BossTask[]] {
  const map = new Map<number, number>();
  for (const prefabId of [...repeateCharas, ...unHaveCharas]) {
    const charaCount = map.get(prefabId) ?? 0;
    map.set(prefabId, charaCount + 1);
  }

  /// 解决 bossTask.borrowChara引用问题
  // const bossTasksTemp: BossTask[] = cloneDeep(bossTasks);
  const bossTasksTemp: BossTask[] = bossTasks.map(r => Object.assign({}, r));
  // return [false, []]
  /// 先处理fixed和unhave
  for (const bossTask of bossTasksTemp) {
    // 若包含未拥有角色，该作业必定要借该角色
    let unHaveChara: Chara = null;
    for (const k of unHaveCharas) {
      unHaveChara = bossTask.charas.find((chara) => chara.prefabId === k);
      if (unHaveChara) {
        break;
      }
    }

    const fixedBorrowChara = bossTask.fixedBorrowChara;
    // 两者冲突
    if (
      fixedBorrowChara &&
      unHaveChara &&
      unHaveChara.prefabId != fixedBorrowChara.prefabId
    ) {
      return [false, []];
    }

    if (unHaveChara) {
      const charaCount = map.get(unHaveChara.prefabId);
      if (charaCount > 0 && !bossTask.borrowChara) {
        bossTask.borrowChara = unHaveChara;
        map.set(unHaveChara.prefabId, charaCount - 1);
        continue;
      }
    }
    // UNHAVE END
    // TODO(KURUMI) 依然有BUG
    // 强制借人处理
    if (fixedBorrowChara) {
      bossTask.borrowChara = fixedBorrowChara;
      const charaCount = map.get(fixedBorrowChara.prefabId);
      if (charaCount > 0) {
        for (const chara of bossTask.charas) {
          // 如果强制借用角色包含在重复角色中且在该使用角色合集里,重复-1;
          if (
            repeateCharas.includes(chara.prefabId) &&
            chara.prefabId == fixedBorrowChara.prefabId
          ) {
            map.set(fixedBorrowChara.prefabId, charaCount - 1);
            break;
          }
        }
        continue;
      }
    }
  }
  // 处理虽然有2个重复，但是另一个重复被fixed占用
  for (const bossTask of bossTasksTemp) {
    if (bossTask.borrowChara) {
      continue;
    }
    let repeateChara = null;
    let count = 0;
    for (const chara of bossTask.charas) {
      if (repeateCharas.includes(chara.prefabId)) {
        const charaCount = map.get(chara.prefabId);
        if (charaCount > 0) {
          repeateChara = chara;
          count++;
        }
      }
    }
    if (count == 1) {
      bossTask.borrowChara = repeateChara;
      const charaCount = map.get(repeateChara.prefabId);
      map.set(repeateChara.prefabId, charaCount - 1);
    }
  }

  for (const bossTask of bossTasksTemp) {
    let repeatChara: Chara = null;
    //
    for (const k of repeateCharas) {
      repeatChara = bossTask.charas.find((chara) => chara.prefabId === k);
      if (repeatChara) {
        const charaCount = map.get(k);
        if (charaCount > 0 && !bossTask.borrowChara) {
          bossTask.borrowChara = repeatChara;
          map.set(k, charaCount - 1);
          break;
        }
      }
    }
  }

  const values = [...map.values()];
  return [values.every((v) => v === 0), bossTasksTemp];
}

/**
 * 处理未拥有角色, 当前组合所使用的角色是否包含未拥有角色
 */
export const filterUnHaveCharas = (
  charas: Chara[],
  unHaveCharas: Chara[]
): number[] => {
  const unHaveCharaPrefabIds: number[] = [];
  for (const chara of unHaveCharas) {
    if (charas.findIndex((c) => c.prefabId === chara.prefabId) > -1) {
      unHaveCharaPrefabIds.push(chara.prefabId);
    }
  }

  return unHaveCharaPrefabIds;
};

/**
 * 处理一组作业中已使用的作业数，无返回0
 */
export const countUsed = (t: BossTask[], usedList: number[]): number => {
  return t.reduce((prev, current) => {
    if (usedList.includes(current.id)) {
      return prev + 1;
    }
    return prev;
  }, 0);
};

/**
 *  处理已使用最多的排在前面
 * 筛选结果按照分数从高到低排序，已使用的在前
 */
export function fliterResult(
  bossTasks: BossTask[][],
  unHaveCharas: Chara[],
  usedList: number[],
  server: ServerType
): BossTask[][] {
  const tempArr: BossTask[][][] = [[], [], [], []]; /// 依次为包含0/1/2/3个已使用作业组
  for (const bossTask of bossTasks) {
    const set = new Set(); // 查重
    const repeateChara: number[] = []; // 重复的角色
    const charas = []; // 当前组合使用的角色
    /// 查重
    // let total = 0;
    // const startTime = new Date().getTime();
    for (const task of bossTask) {
      for (const chara of task.charas) {
        const size = set.size;
        charas.push(chara);
        set.add(chara.prefabId);
        /// 如果长度不变，说明是重复的
        if (size === set.size) {
          repeateChara.push(chara.prefabId);
        }
      }
    }
    /// 未拥有
    const unHaves = filterUnHaveCharas(charas, unHaveCharas);
    const [b, t] = repeatCondition(repeateChara, unHaves, bossTask);
    if (b) {
      const usedCount = countUsed(t, usedList);
      tempArr[usedCount].push(t);
    }
  }
  const r = tempArr.map((r) => sortByScore(r, server));
  r.reverse();
  // const res = r.flat();
  const res = r.reduce((arr, val) => arr.concat(val), []);
  return res;
}

/**
 *
 * @param arr 按照分数排序，暂时分数系数为4阶段
 */
export function sortByScore(arr: BossTask[][], server: ServerType) {
  // const tempArr: BossTask[][] = cloneDeep(arr);

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
    5: {
      1: 3.5,
      2: 3.5,
      3: 3.7,
      4: 3.8,
      5: 4.0,
    },
    6: {
      1: 3.5,
      2: 3.5,
      3: 3.7,
      4: 3.8,
      5: 4.0,
    },
  };

  arr.sort((a, b) => {
    let [aScore, bScore] = [0, 0];
    a.forEach((task) => {
      aScore += task.damage * scoreFactor[task.stage][task.index];
    });
    b.forEach((task) => {
      bScore += task.damage * scoreFactor[task.stage][task.index];
    });
    return bScore - aScore;
  });
  return arr;
}

export const filterTask = ({
  bossList,
  usedList,
  removedList,
  unHaveCharas,
  server,
}: FilterTaskParams): BossTask[][] => {
  if (!bossList.length) {
    return [];
  }
  const statTime = new Date().getTime();
  const bossTask: BossTask[] = flatTask(bossList, removedList);
  let bossTasks: BossTask[][] = combine(bossTask, 3);

  let result: BossTask[][] = fliterResult(
    bossTasks,
    unHaveCharas,
    usedList,
    server
  );

  if (!result.length) {
    bossTasks = combine(bossTask, 2);
    result = fliterResult(bossTasks, unHaveCharas, usedList, server);
  }

  if (!result.length) {
    bossTasks = combine(bossTask, 1);
    result = fliterResult(bossTasks, unHaveCharas, usedList, server);
  }
  const endTime = new Date().getTime();
  console.log((endTime - statTime) / 1000);
  return result;
};

addEventListener('message', ({ data }) => {
  console.log('start');
  const res = filterTask(data);
  postMessage(res);
});
