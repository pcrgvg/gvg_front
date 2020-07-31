import { Component, OnInit } from '@angular/core';
import { HttpService} from '@core';

@Component({
  selector: 'app-gvg',
  templateUrl: './gvg.component.html',
  styleUrls: ['./gvg.component.scss']
})
export class GvgComponent implements OnInit {

  constructor(
    private http: HttpService
  ) { }

  ngOnInit(): void {
  }

  test() {
    console.log('tes');
  }

}
