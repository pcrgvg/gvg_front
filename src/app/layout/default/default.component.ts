import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {
  constructor() { }
  @ViewChildren('adWrapper') ads: QueryList<any>

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    for (let index = 0; index < this.ads.length + 1; index++) {
      ((window as any).adsbygoogle || [])?.push({});
    }
   
  }

}
