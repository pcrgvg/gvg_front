import { Component, Input, OnInit } from '@angular/core';
import { Link } from '@src/app/models';
import { TopLinkService } from '@app/core';
import { LanguagePack, CN } from '@src/app/core/services/I18n';

@Component({
  selector: 'pcr-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
})
export class LinkComponent {
  @Input()
  links: Link[];

  gvgPage: LanguagePack['gvgPage'] = CN.gvgPage;
  commonPage = CN.common;
  constructor(private topLinkService: TopLinkService) {}

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
