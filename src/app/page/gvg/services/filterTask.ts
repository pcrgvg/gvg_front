import { cloneDeep } from 'lodash';
import { Task, GvgTask, Chara, ServerType } from '../../../models';

type BossTask = Task & { bossId: number; prefabId: number; borrowChara?: Chara; index: number };
interface FilterTaskParams {
  bossList: GvgTask[];
  usedList: number[];
  removedList: number[];
  unHaveCharas: Chara[];
  server: ServerType;
}

function flatTask(bossList: GvgTask[], removedList: number[]): BossTask[] {
  const list = cloneDeep(bossList);
  const tasks: BossTask[] = [];
  // flat task
  list.forEach((boss) => {
    boss.tasks.forEach((task) => {
      if (!haveRemoved(task, removedList)) {
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

function haveRemoved(task: Task, removedList: number[]): boolean {
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
function combine(bossTask: BossTask[], k: number): BossTask[][] {
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
  return result;
}

/**
 *
 * @param prefabIds  重复的角色
 * @param bossTasks
 * 重复几次代表要借几次, 借完符合
 */
function repeatCondition(prefabIds: number[], bossTasks: BossTask[]): [boolean, BossTask[]] {
  const map = new Map<number, number>();
  for (const prefabId of prefabIds) {
    const charaCount = map.get(prefabId) ?? 0;
    map.set(prefabId, charaCount + 1);
  }
  /// 解决 bossTask.borrowChara引用问题
  const bossTasksTemp = cloneDeep(bossTasks);
  for (const bossTask of bossTasksTemp) {
    const keys = [...map.keys()];

    let repeatChara: Chara = null;
    for (const k of keys) {
      repeatChara = bossTask.charas.find((chara) => chara.prefabId === k);
      if (repeatChara) {
        const charaCount = map.get(k);
        if (charaCount > 0 && !bossTask.borrowChara) {
          bossTask.borrowChara = repeatChara;
          map.set(k, charaCount - 1);
        }
      }
    }
  }

  const values = [...map.values()];
  return [values.every((v) => v === 0), bossTasksTemp];
}

/**
 * 处理未拥有角色
 */
const filterUnHaveCharas = (charas: Chara[], unHaveCharas: Chara[]): number[] => {
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
const countUsed = (t: BossTask[], usedList: number[]): number => {
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
function fliterResult(
  bossTasks: BossTask[][],
  unHaveCharas: Chara[],
  usedList: number[],
  server: ServerType,
): BossTask[][] {
  const tempArr: BossTask[][][] = [[], [], [], []]; /// 依次为包含0/1/2/3个已使用作业组

  for (const bossTask of bossTasks) {
    const set = new Set();
    const arr: number[] = []; // 重复的角色
    const charas = [];
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
          arr.push(chara.prefabId);
        }
      }
    }
    /// 未拥有的算作重复
    const unHaves = filterUnHaveCharas(charas, unHaveCharas);
    const [b, t] = repeatCondition([...arr, ...unHaves], bossTask);
    if (b) {
      const usedCount = countUsed(t, usedList);
      tempArr[usedCount].push(t);
    }

  }
  const r = tempArr.map((r) => sortByScore(r, server));
  r.reverse();
  const res = r.flat();
  return res;
}

/**
 *
 * @param arr 按照分数排序，暂时分数系数为4阶段
 */
function sortByScore(arr: BossTask[][], server: ServerType) {
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
    5: {
      1: 3.5,
      2: 3.5,
      3: 3.7,
      4: 3.8,
      5: 4.0,
    },
  };

  const cnscoreFactor = {
    1: {
      1: 1,
      2: 1,
      3: 1.3,
      4: 1.3,
      5: 1.5,
    },
    2: {
      1: 1.4,
      2: 1.4,
      3: 1.8,
      4: 1.8,
      5: 2,
    },
    3: {
      1: 2,
      2: 2,
      3: 2.5,
      4: 2.5,
      5: 3,
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
  };
  const scoreF = server === ServerType.jp ? scoreFactor : cnscoreFactor;
  tempArr.sort((a, b) => {
    let [aScore, bScore] = [0, 0];
    a.forEach((task) => {
      aScore += task.damage * scoreF[task.stage][task.index];
    });
    b.forEach((task) => {
      bScore += task.damage * scoreF[task.stage][task.index];
    });
    return bScore - aScore;
  });
  return tempArr;
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

  const bossTask: BossTask[] = flatTask(bossList, removedList);
  let bossTasks: BossTask[][] = combine(bossTask, 3);

  let result: BossTask[][] = fliterResult(bossTasks, unHaveCharas, usedList, server);
  /// 一般来说肯定会有3刀的情况
  if (!result.length) {
    bossTasks = combine(bossTask, 2);
    result = fliterResult(bossTasks, unHaveCharas, usedList, server);
  }

  if (!result.length) {
    bossTasks = combine(bossTask, 1);
    result = fliterResult(bossTasks, unHaveCharas, usedList, server);
  }
  console.log(result.length);

  return result;
};
