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

  constructor(
    private changelogApi: ChangelogServiceApi,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.dealServerType();
    this.changelogApi.getChangeLog().subscribe((r) => {
      this.changelog = r.content ?? '';
    });
  }

  dealServerType() {
    const serverType = this.route.snapshot.queryParams.serverType;
    switch (serverType) {
      case '114':
        this.serverType = ServerType.cn;
        break;
      case '142':
        this.serverType = ServerType.jp;
        break;
      default:
        this.serverType = '';
    }
  }

  jumpTo(serverType: keyof typeof ServerType) {
    this.router.navigate(['gvg', {serverType}], {
      queryParams: {
        serverType: this.serverType,
      },
    });
  }
}
