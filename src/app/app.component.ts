import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pcr-root',
  template: `
    <app-default></app-default>
    <!-- <router-outlet></router-outlet> -->
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  title = 'pcrGvg';

  ngOnInit() {
    console.log('app init');
  }
}
