export interface Chara {
  prefabId: number;
  unitName: string;
  rarity: number;
  currentRarity?: number;
  rank: number;
  searchAreaWidth: number;
  iconUrl?: string;
  [prop: string]: any
}

export type Link = {
  name: string;
  link: string;
  remarks: string;
  index?: number;
  damage?: number;
  type?: number;
};

export interface Task {
  id: number;
  canAuto: number[];
  stage: number;
  damage: number;
  charas: Chara[];
  remarks: string;
  exRemarks: string;
  isUsed?: boolean;
  disabeld?: boolean;
  server?: string;
  links: Link[];
  type: number; // 1尾刀,2正常
  autoDamage: number;
  halfAutoDamage: number;
  easyManualDamage: number;
  images: string[];
  fixedBorrowChara?: Chara;
  /** 控制视频连接显示 */
  linkShowType?: number;
}

export enum ServerType {
  jp = 'jp',
  cn = 'cn',
  tw = 'tw',
}

export interface GvgTask {
  id: number;
  prefabId: number;
  unitName: string;
  server: string;
  index: number;
  checked: boolean;
  tasks: Task[];
  count: number;
}

export type BossTask = Task & { bossId: number; prefabId: number; disabeld?: boolean };

export interface Notice {
  id: number;
  content: string;
  clanBattleId: number;
  server: string;
  createTime: number;
  updateTime: number;
}
