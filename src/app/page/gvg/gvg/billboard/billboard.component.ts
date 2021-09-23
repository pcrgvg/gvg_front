import { Component, Input, OnInit } from '@angular/core';
import { ServerType } from '@src/app/models';

@Component({
  selector: 'pcr-billboard',
  templateUrl: './billboard.component.html',
  styleUrls: ['./billboard.component.scss']
})
export class BillboardComponent  {

  constructor() { }
  @Input() serverType = ServerType.jp;
  @Input() content = '';
  @Input() showLink = false;



}
