import { Component, OnInit } from '@angular/core';
import { PcrApiService } from '@api';
import { Chara } from '@pcrgvg/models';



@Component({
  selector: 'app-gvg',
  templateUrl: './gvg.component.html',
  styleUrls: ['./gvg.component.scss']
})
export class GvgComponent implements OnInit {
  constructor(
    private pcrApi: PcrApiService
  ) { }
  charaList: Chara[] = []

  ngOnInit(): void {
    this.pcrApi.charaList().subscribe(res => {
      this.charaList = res;
    })
  }

  trackByFn(_: number, chara: Chara): number{
    return chara.prefabId
  }

}
