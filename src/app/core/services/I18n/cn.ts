import { ServerType } from '@src/app/models';
import { LanguagePack } from './model';

export const CN: LanguagePack = {
  common: {
    auto: '自动',
    semiAutomatic: '半自动',
    manual: '手动',
    loading: '正在加载数据',
    server: '服务器',
    remark: '备注',
    damageUnit: 'W'
  },
  homePage: {
    jp: '日服',
    tw: '台服',
    cn: '国服',
  },
  gvgPage: {
    unHave: '未拥有/未练角色',
    add: '添加',
    search: '搜索',
    stage: '阶段',
    period: '期次',
    used: '使用',
    removed: '去除',
    category: '类别',
    readNotice: '查看公告',
    openAll: '展开所有',
    closeAll: '关闭所有',
    combine: '分刀',
    confirm: '确定',
    front: '前卫',
    middle: '中卫',
    back: '后卫',
    title: '公会战作业查询',
    serverOption: [
      {
        label: '日服',
        value: ServerType.jp,
      },
      {
        label: '国服',
        value: ServerType.cn,
      },
      {
        label: '台服',
        value: ServerType.tw,
      },
    ],
    tail: '尾刀',
    all: '全部',
    videoLink: '视频链接',
  },
  header: {
    cache: '清除缓存',
    help: '帮助',
  },
  gvgResultPage: {
    damage: '伤害',
    link: '链接',

    filter: '筛选',
  },
};
