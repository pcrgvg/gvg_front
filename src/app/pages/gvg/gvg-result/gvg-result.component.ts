import { Component, OnInit } from '@angular/core';
import { BossTask } from '@src/app/models';

@Component({
  selector: 'app-gvg-result',
  templateUrl: './gvg-result.component.html',
  styleUrls: ['./gvg-result.component.scss'],
})
export class GvgResultComponent implements OnInit {
  constructor() {}
  filterResult: BossTask[][] = [];

  ngOnInit(): void {
    console.log('res init');
    this.filterResult = JSON.parse(sessionStorage.getItem('filterResult'));
  }
}
