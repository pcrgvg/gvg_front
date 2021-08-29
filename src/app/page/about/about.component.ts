import { Component, OnInit } from '@angular/core';
import { Routekeep } from '@src/app/core/router-config/route-keep';
import { environment } from '@src/environments/environment'

@Component({
  selector: 'pcr-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  shwoLink = environment.showLink;

  constructor() { 
 
  }


}
