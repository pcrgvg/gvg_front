export interface Chara {
  prefabId: number;
  unitName: string;
  rarity: number;
  searchAreaWidth: number;
  iconUrl?: string;
}

export interface Task {
  id: number;
  canAuto: number;
  stage: number;
  damage: number;
  charas: Chara[];
  isUsed?: boolean;
  disabeld?: boolean;
}

export enum ServerType {
  jp = 'jp',
  cn = 'cn',
  tw = 'tw',
}

export enum ServerName {
  jp = '日服',
  cn = '国服',
  tw = '台服',
}

export interface GvgTask {
  id: number;
  prefabId: number;
  unitName: string;
  server: string;
  tasks: Task[];
}

export type BossTask = Task & { bossId: number; prefabId: number; disabeld?: boolean };
