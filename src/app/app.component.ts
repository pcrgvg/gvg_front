import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pcr-root',
  template: `
    <pcr-default></pcr-default>
    <!-- <router-outlet></router-outlet> -->
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  title = 'pcrGvg';
  constructor(

  ){}
  ngOnInit() {
    console.log('app init');
  }
}
