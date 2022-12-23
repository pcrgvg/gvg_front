import { Component, OnInit } from '@angular/core';
import { localforageName } from '@src/app/constants';
import * as localforage from 'localforage';

@Component({
  selector: 'pcr-collectpage',
  templateUrl: './collectpage.component.html',
  styleUrls: ['./collectpage.component.scss'],
})
export class CollectpageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('TODO收藏');
    localforage.getItem<any[]>(localforageName.collect).then((r) => {
      const list = r ?? [];
    });
  }
}
