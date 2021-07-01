import { Component, OnInit } from '@angular/core';
import { environment } from '@src/environments/environment'

@Component({
  selector: 'pcr-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  shwoLink = environment.showLink;

  constructor() { }

  ngOnInit(): void {
  }

}
