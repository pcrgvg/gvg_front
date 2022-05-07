function cloneDeep(params) {
  return JSON.parse(JSON.stringify(params));
}

function flatTask(bossList, removedList) {
  const list = cloneDeep(bossList);
  const tasks = [];
  list.forEach((boss) => {
    boss.tasks.forEach((task) => {
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

function haveRemoved(task, removedList) {
  if (removedList.includes(task.id)) {
    return true;
  }
  return false;
}

function combine(bossTask, k) {
  const result = [];
  const subResult = [];

  const combineSub = (start, subResult) => {
    if (subResult.length === k) {
      result.push(subResult.slice(0));
      return;
    }
    const len = subResult.length;
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

function repeatCondition(repeateCharas, unHaveCharas, bossTasks) {
  const map = new Map();
  for (const prefabId of [...repeateCharas, ...unHaveCharas]) {
    const charaCount = map.get(prefabId) ?? 0;
    map.set(prefabId, charaCount + 1);
  }
  const bossTasksTemp = cloneDeep(bossTasks);

  for (const bossTask of bossTasksTemp) {
    let unHaveChara = null;
    for (const k of unHaveCharas) {
      unHaveChara = bossTask.charas.find((chara) => chara.prefabId === k);
      if (unHaveChara) {
        break;
      }
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
    let repeatChara = null;
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

const filterUnHaveCharas = (charas, unHaveCharas) => {
  const unHaveCharaPrefabIds = [];
  for (const chara of unHaveCharas) {
    if (charas.findIndex((c) => c.prefabId === chara.prefabId) > -1) {
      unHaveCharaPrefabIds.push(chara.prefabId);
    }
  }

  return unHaveCharaPrefabIds;
};

const countUsed = (t, usedList) => {
  return t.reduce((prev, current) => {
    if (usedList.includes(current.id)) {
      return prev + 1;
    }
    return prev;
  }, 0);
};

function fliterResult(bossTasks, unHaveCharas, usedList, server) {
  const tempArr = [[], [], [], []];

  for (const bossTask of bossTasks) {
    const set = new Set();
    const repeateChara = [];
    const charas = [];
    for (const task of bossTask) {
      for (const chara of task.charas) {
        const size = set.size;
        charas.push(chara);
        set.add(chara.prefabId);
        if (size === set.size) {
          repeateChara.push(chara.prefabId);
        }
      }
    }
    const unHaves = filterUnHaveCharas(charas, unHaveCharas);
    const [b, t] = repeatCondition(repeateChara, unHaves, bossTask);
    if (b) {
      const usedCount = countUsed(t, usedList);
      tempArr[usedCount].push(t);
    }
  }
  const r = tempArr.map((r) => sortByScore(r, server));
  r.reverse();
  const res = r.reduce((arr, val) => arr.concat(val), []);
  return res;
}

function sortByScore(arr, server) {
  const tempArr = cloneDeep(arr);

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

const filterTask = ({ bossList, usedList, removedList, unHaveCharas, server }) => {
  if (!bossList.length) {
    return [];
  }

  const bossTask = flatTask(bossList, removedList);
  let bossTasks = combine(bossTask, 3);

  let result = fliterResult(bossTasks, unHaveCharas, usedList, server);

  if (!result.length) {
    bossTasks = combine(bossTask, 2);
    result = fliterResult(bossTasks, unHaveCharas, usedList, server);
  }

  if (!result.length) {
    bossTasks = combine(bossTask, 1);
    result = fliterResult(bossTasks, unHaveCharas, usedList, server);
  }

  return result;
};

export const workerString = `
function cloneDeep(params) {
    return JSON.parse(JSON.stringify(params))
}
function flatTask(bossList, removedList) {
  const list = cloneDeep(bossList);
  const tasks = [];
  list.forEach((boss) => {
    boss.tasks.forEach((task) => {
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

function haveRemoved(task, removedList) {
  if (removedList.includes(task.id)) {
    return true;
  }
  return false;
}


function combine(bossTask, k){
  const result= [];
  const subResult = [];

  const combineSub = (start, subResult) => {
    if (subResult.length === k) {
      result.push(subResult.slice(0));
      return;
    }
    const len = subResult.length;
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


function repeatCondition(
  repeateCharas,
  unHaveCharas,
  bossTasks
) {
  const map = new Map();
  for (const prefabId of [...repeateCharas, ...unHaveCharas]) {
    const charaCount = map.get(prefabId) ?? 0;
    map.set(prefabId, charaCount + 1);
  }
  const bossTasksTemp = cloneDeep(bossTasks);

  for (const bossTask of bossTasksTemp) {
    let unHaveChara = null;
    for (const k of unHaveCharas) {
      unHaveChara = bossTask.charas.find((chara) => chara.prefabId === k);
      if (unHaveChara) {
        break;
      }
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
    let repeatChara = null;
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


const filterUnHaveCharas = (
  charas,
  unHaveCharas
) => {
  const unHaveCharaPrefabIds = [];
  for (const chara of unHaveCharas) {
    if (charas.findIndex((c) => c.prefabId === chara.prefabId) > -1) {
      unHaveCharaPrefabIds.push(chara.prefabId);
    }
  }

  return unHaveCharaPrefabIds;
};


const countUsed = (t, usedList) => {
  return t.reduce((prev, current) => {
    if (usedList.includes(current.id)) {
      return prev + 1;
    }
    return prev;
  }, 0);
};


function fliterResult(
  bossTasks,
  unHaveCharas,
  usedList,
  server
) {
  const tempArr = [[], [], [], []]; 

  for (const bossTask of bossTasks) {
    const set = new Set(); 
    const repeateChara = [];
    const charas = []; 
    for (const task of bossTask) {
      for (const chara of task.charas) {
        const size = set.size;
        charas.push(chara);
        set.add(chara.prefabId);
        if (size === set.size) {
          repeateChara.push(chara.prefabId);
        }
      }
    }
    const unHaves = filterUnHaveCharas(charas, unHaveCharas);
    const [b, t] = repeatCondition(repeateChara, unHaves, bossTask);
    if (b) {
      const usedCount = countUsed(t, usedList);
      tempArr[usedCount].push(t);
    }
  }
  const r = tempArr.map((r) => sortByScore(r, server));
  r.reverse();
  const res = r.reduce((arr, val) => arr.concat(val), []);
  return res;
}


function sortByScore(arr, server) {
  const tempArr = cloneDeep(arr);

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

 const filterTask = ({
  bossList,
  usedList,
  removedList,
  unHaveCharas,
  server,
}) => {
  if (!bossList.length) {
    return [];
  }

  const bossTask= flatTask(bossList, removedList);
  let bossTasks = combine(bossTask, 3);

  let result = fliterResult(
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

  return result;
};
`;
