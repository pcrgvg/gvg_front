export interface LanguagePack {
  common: {
    auto: string,
    semiAutomatic: string,
    manual: string,
    loading: string,
    server: string,
    remark: string,
  },
  homePage: {
    jp: string,
    tw: string,
    cn: string,
  },
  gvgPage: {
    unHave: string,
    add: string,
    search: string,
    stage: string,
    period: string,
    used: string,
    removed: string,
    category: string,
    readNotice: string,
    openAll: string,
    closeAll: string,
    combine: string,
    confirm: string,
    front: string,
    middle: string,
    back: string,
    title: string,
    serverOption: {label: string, value: string}[],
    tail: string,
    all: string,
    videoLink: string
  },
  header: {
    cache: string,
    help: string,
  },
  gvgResultPage: {
    damage: string,
    link: string,
    
    filter: string
  },
};