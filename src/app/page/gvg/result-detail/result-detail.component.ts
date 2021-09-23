import { Component, OnInit } from '@angular/core';
import { TempService } from '../services/temp.service';


@Component({
  selector: 'pcr-result-detail',
  templateUrl: './result-detail.component.html',
  styleUrls: ['./result-detail.component.scss']
})
export class ResultDetailComponent  {

  constructor(
    private tempSrv: TempService
  ) { }

  task: Task;


}
