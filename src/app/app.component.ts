import { Component, OnInit } from '@angular/core';
import { HttpService } from '@/app/core/net/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pcr';
  gvgList = [];
  constructor(
    private http: HttpService
  ){}

  ngOnInit() {
    this.http.Get('/pcr/charaList').subscribe(res => {
      console.log(res);
      console.log(res);
      // this.gvgList = res.data;
    }, err => {
      console.log('ersubssaaa')
    })
  }
}
