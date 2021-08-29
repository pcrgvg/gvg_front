import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pcr-link-button',
  templateUrl: './link-button.component.html',
  styleUrls: ['./link-button.component.scss']
})
export class LinkButtonComponent implements OnInit {

  constructor() { }

  @Input() linkObj: {link: string, name: string, remarks: string}

  ngOnInit(): void {
  }

}
