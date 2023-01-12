import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pcr-result-detail',
  templateUrl: './result-detail.component.html',
  styleUrls: ['./result-detail.component.scss'],
})
export class ResultDetailComponent implements OnInit {
  constructor() {}
  @Input()
  bossTask: any[];
  ngOnInit(): void {
    console.log(2);
  }
}
