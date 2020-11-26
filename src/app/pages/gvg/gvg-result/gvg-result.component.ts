import { Component, OnInit } from '@angular/core';
import { BossTask } from '@src/app/models';
import { StorageService } from '@core';

import { Constants } from '../constant/constant';

@Component({
  selector: 'app-gvg-result',
  templateUrl: './gvg-result.component.html',
  styleUrls: ['./gvg-result.component.scss'],
})
export class GvgResultComponent implements OnInit {
  constructor(private storageSrv: StorageService) {}
  filterResult: BossTask[][] = [];

  ngOnInit(): void {
    this.filterResult = this.storageSrv.sessionGet(Constants.filterResult);
  }
}
