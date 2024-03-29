import { ServerType } from '@src/app/models';
import { LanguagePack } from './model';

export const JP: LanguagePack = {
  common: {
    auto: 'フルオート',
    semiAutomatic: 'セミオート',
    manual: '手動',
    easyManual: '簡易手動',
    loading: '加载中',
    server: 'サーバー',
    remark: '備考',
    damageUnit: '万',
    collection: 'collection',
  },
  homePage: {
    jp: '日本語版',
    tw: '繁体字版',
    cn: '簡体字版',
  },
  gvgPage: {
    unHave: '未解放/未育成',
    add: '追加',
    search: '検索',
    stage: '段階目',
    period: '期間',
    used: '凸完了',
    removed: '削除',
    category: '種類',
    readNotice: 'お知らせ',
    openAll: 'すべて展開',
    openBoss: 'BOSS展開',
    closeAll: 'すべて折りたたみ',
    combine: '凸ルート',
    confirm: '確認',
    front: '前衛',
    middle: '中衛',
    back: '後衛',
    title: 'クランバトル編成検索',
    serverOption: [
      {
        label: '日本語版',
        value: ServerType.jp,
      },
      {
        label: '簡体字版',
        value: ServerType.cn,
      },
      {
        label: '繁体字版',
        value: ServerType.tw,
      },
    ],
    tail: '持越編成',
    all: '全部',
    videoLink: 'リンク',
  },
  header: {
    cache: 'キャッシュクリア',
    help: 'ヘルプ',
  },
  gvgResultPage: {
    damage: 'ダメージ',
    link: 'リンク',

    filter: 'フィルタ',
  },
};
