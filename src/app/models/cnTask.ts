export interface CnTask {
  id: string;
  name: string;
  icon: string;
  stage: number;
  info: string;
  part: any[];
  homework: Homework[];
  prefabId: number;
}

export interface Homework {
  id: number;
  sn: string;
  unit: Unit[];
  damage: number;
  auto: number;
  remain: number;
  info: string;
  video: Video[];
}

export interface Unit {
  id: number;
  name: string;
  icon: string;
}

export interface Video {
  text: string;
  url: string;
}
