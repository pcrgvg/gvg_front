import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangelogServiceApi } from '@app/apis';
import { ServerType } from '@src/app/models';

@Component({
  selector: 'pcr-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  changelog: string = '';
  serverType = '';
  btnList = [];

  constructor(
    private changelogApi: ChangelogServiceApi,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.dealServerType();
    this.changelogApi.getChangeLog().subscribe((r) => {
      this.changelog = r.content ?? '暂无';
    });
  }

  dealServerType() {
    const serverType = this.route.snapshot.queryParams.serverType;
    switch (serverType) {
      case '114': {
        this.btnList = [{value: 'cn', label: '国服'}]
        this.serverType = ServerType.cn;
      }
        break;
      case '142': {
        this.btnList = [{value: 'jp', label: '日服'}]
        this.serverType = ServerType.jp;
      }
        break;
      default: {
        this.btnList = [
          {value: 'cn', label: '国服'},
          {value: 'jp', label: '日服'}
        ]
        this.serverType = '';
      }
    }
   
  }

  jumpTo(serverType: keyof typeof ServerType) {
    const serve = this.route.snapshot.queryParams.serverType;
    this.router.navigate(['gvg', {serverType}], {
      queryParams: {
        serverType: serve,
      },
    });
  }
}
