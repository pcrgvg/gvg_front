import { Component, Input, OnInit } from '@angular/core';
import { CN, LanguagePack } from '@src/app/core/services/I18n';
import { TopLinkService } from '@src/app/core/services';
import { CanAutoType, Link } from '@src/app/models';

@Component({
  selector: 'pcr-result-detail',
  templateUrl: './result-detail.component.html',
  styleUrls: ['./result-detail.component.scss'],
})
export class ResultDetailComponent {
  constructor(private topLinkService: TopLinkService) {}
  @Input()
  bossTask: any[];

  canAutoType = CanAutoType;
  commonPage = CN.common;
  selectedIndex = 0;

  gvgPage: LanguagePack['gvgPage'] = CN.gvgPage;

  autoColor(canAuto: number) {
    switch (canAuto) {
      case CanAutoType.auto:
        return '#68B9FF';
      case CanAutoType.harfAuto:
        return '#1cbbb4';
      case CanAutoType.manual:
      default:
        return '#FF2277';
    }
  }

  sortLink(links: Link[]) {
    const topLink = [];
    const other = [];
    for (const link of links) {
      if (this.topLinkService.isSetTop(link)) {
        topLink.push(link);
      } else {
        other.push(link);
      }
    }
    return [...topLink, ...other];
  }

  isSetTop(link) {
    return this.topLinkService.isSetTop(link);
  }

  setTop(link) {
    this.topLinkService.setTop(link);
  }
}
