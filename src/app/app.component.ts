import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pcr';
  constructor(
    private router: Router,
  ){}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(ev => ev instanceof NavigationEnd)
    ).subscribe(res => {

    });
  }

}
