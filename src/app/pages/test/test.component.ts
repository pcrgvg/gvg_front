import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, state, animate } from '@angular/animations';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          height: '200px',
          opacity: 1,
          backgroundColor: 'yellow',
        }),
      ),
      state(
        'close',
        style({
          height: '100px',
          opacity: 0.5,
          backgroundColor: 'green',
        }),
      ),
      transition('open => close', [animate('1s')]),
      transition('close => open', [animate('0.5s')]),
    ]),
  ],
})
export class TestComponent implements OnInit {
  constructor() {}
  isOpen = false;
  ngOnInit(): void {}
}
