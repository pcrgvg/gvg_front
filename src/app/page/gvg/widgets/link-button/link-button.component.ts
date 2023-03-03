import { Component, Input, OnInit } from '@angular/core';
import { CanAutoType } from '@src/app/models';

@Component({
  selector: 'pcr-link-button',
  templateUrl: './link-button.component.html',
  styleUrls: ['./link-button.component.scss'],
})
export class LinkButtonComponent {
  constructor() {}

  @Input() linkObj: { link: string; name: string; remarks: string };
}
