import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangelogServiceApi } from '@app/apis';
import { ServerType } from '@src/app/models';
import { environment } from '@src/environments/environment';
import { CN, I18nService, LanguagePack } from '@app/core/services/I18n';

@Component({
  selector: 'pcr-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  changelog = 0;
  serverType = '';
  btnList = [];
  showLink = environment.showLink;

  constructor(
    private changelogApi: ChangelogServiceApi,
    private route: ActivatedRoute,
    private router: Router,
    private i18nService: I18nService
  ) {}

  homePage: LanguagePack['homePage'] = CN.homePage;
  commonPage = CN.common
  ngOnInit(): void {
    console.log('honme ngOnInit');
   
    // this.changelogApi.getChangeLog().subscribe((r) => {
    //   this.changelog = r.content ?? '暂无';
    // });
    this.i18nService.getLanguagePackObs().subscribe((r) => {
      this.homePage = r.homePage;
      this.commonPage = CN.common
      this.dealServerType();
    });
  }

  dealServerType() {
    const serverType = this.route.snapshot.queryParams.serverType;
    switch (serverType) {
      case '114':
        {
          this.btnList = [{ value: 'cn', label: this.homePage.cn }];
          this.serverType = ServerType.cn;
        }
        break;
      case '142':
        {
          this.btnList = [{ value: 'jp', label: this.homePage.jp }];
          this.serverType = ServerType.jp;
        }
        break;
      default: {
        this.btnList = [
          { value: 'cn', label: this.homePage.cn },
          { value: 'jp', label: this.homePage.jp },
          { value: 'tw', label: this.homePage.tw },
        ];
        this.serverType = '';
      }
    }
  }

  jumpTo(serverType: keyof typeof ServerType) {
    const serve = this.route.snapshot.queryParams.serverType;
    this.router.navigate(['gvg', { serverType }], {
      queryParams: {
        serverType: serve,
      },
    });
  }
}
