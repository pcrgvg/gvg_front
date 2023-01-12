import { ServerType } from '@src/app/models';
import { LanguagePack } from './model';
export const EN: LanguagePack = {
  common: {
    auto: 'auto',
    semiAutomatic: 'semi automatic',
    manual: 'manual',
    loading: 'loading',
    server: 'server',
    remark: 'remark',
    damageUnit: 'w',
    collection: 'collection',
  },
  homePage: {
    jp: 'JA',
    tw: 'ZH-TW',
    cn: 'ZH-CN',
  },
  gvgPage: {
    unHave: 'not owned or practiced',
    add: 'add',
    search: 'search',
    stage: 'stage',
    period: 'period',
    used: 'used',
    removed: 'removed',
    category: 'category',
    readNotice: 'notice',
    openAll: 'open all',
    openBoss: 'open boss',
    closeAll: 'close all',
    combine: 'combine',
    confirm: 'confirm',
    front: 'front',
    middle: 'middle',
    back: 'back',
    title: 'Clan battle formation search',
    serverOption: [
      {
        label: 'JA',
        value: ServerType.jp,
      },
      {
        label: 'ZH-CN',
        value: ServerType.cn,
      },
      {
        label: 'ZH-TW',
        value: ServerType.tw,
      },
    ],
    tail: 'remaining',
    all: 'all',
    videoLink: 'video link',
  },
  header: {
    cache: 'clear cache',
    help: 'help',
  },
  gvgResultPage: {
    damage: 'damage',
    link: 'link',

    filter: 'filter',
  },
};
