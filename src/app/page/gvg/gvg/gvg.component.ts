import { Component, OnInit } from '@angular/core';
import { ChangelogServiceApi } from '@app/apis';

@Component({
  selector: 'pcr-gvg',
  templateUrl: './gvg.component.html',
  styleUrls: ['./gvg.component.scss']
})
export class GvgComponent implements OnInit {

  constructor(
    private ChangelogServiceApi: ChangelogServiceApi
  ) { }

  ngOnInit(): void {
    this.ChangelogServiceApi.getChangeLog().subscribe(r => {
      console.log(r)
    })
  }

}
