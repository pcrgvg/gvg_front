import { Component, Input, OnInit } from '@angular/core';
import { ServerType } from '@src/app/models';

@Component({
  selector: 'pcr-billboard',
  templateUrl: './billboard.component.html',
  styleUrls: ['./billboard.component.scss']
})
export class BillboardComponent implements OnInit {

  constructor() { }
  @Input() serverType = ServerType.jp;
  @Input() content: string = '';
  @Input() showLink: boolean = false;

  ngOnInit(): void {
  }

}