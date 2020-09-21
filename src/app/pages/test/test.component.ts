import { Component, OnInit, HostBinding } from '@angular/core';
import { trigger, style, transition, state, animate, query, stagger, keyframes } from '@angular/animations';
import { TFn } from 'cyutil';

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
      // 转场会按照其定义的顺序进行匹配 transition
      // transition('open => close', [animate('1s')]),
      // transition('close => open', [animate('0.5s')]),
      // 通配符状态 * 会匹配任何状态 —— 包括 void， void配置进入或离开页面的元素
      transition('* <=> *', [animate('1s')]),
      // keyframes 需要罗列所有需要变化的属性
      // transition('* <=> *', [
      //   animate('1s', keyframes ( [
      //     style({ opacity: 0.1, offset: 0.1 }),
      //     style({ opacity: 0.6, offset: 0.2 }),
      //     style({ opacity: 1,   offset: 0.5 }),
      //     style({ opacity: 0.2, offset: 0.7 })
      //   ]))
      // ])
    ]),
    /// dom离开或者进入 :enter 和 :leave 分别是 void => * 和 * => void 的别名
    trigger('inOut', [
      transition(':enter', [
        style({ opacity: 0 }), // 此处设置的为初始状态
        animate('0.5s', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [
        animate('0.5s', style({ opacity: 0, height: '0' })), // 此处是要动画过程 的状态
      ]),
    ]),
    /// 数字
    trigger('filterAnimation', [
      transition(':enter, * => 0, * => -1', []),
      transition(':increment', [
        query(
          ':enter',
          [style({ opacity: 0, width: '0px' }), stagger(50, [animate('300ms ease-out', style({ opacity: 1, width: '*' }))])],
          { optional: true },
        ),
      ]),
      transition(':decrement', [
        query(':leave', [stagger(50, [animate('300ms ease-out', style({ opacity: 0, width: '0px', height: '*' }))])]),
      ]),
    ]),
    /**query() 用于查找一个或多个内部 HTML 元素。
     * stagger() 用于为多元素动画应用级联延迟。
     * group() 用于并行执行多个动画步骤。
     * sequence() 用于逐个顺序执行多个动画步骤。
     * 行的动画。比如，你可能希望为同一个元素的两个CSS 属性设置动画，
     * 但要为每个属性使用不同的 easing 函数。这时，你可以使用动画函数 group()。
     */
    trigger('pageAnimations', [
      transition(':enter', [
        query(' form, .hero', [
          style({ opacity: 0, transform: 'translateY(-100px)' }),
          //使用 stagger() 来在每个(查找出的元素)动画之间延迟 30 毫秒 正负号是有用的
          stagger(-50, [animate('1s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))]),
        ]),
      ]),
    ]),
  ],
})
export class TestComponent implements OnInit {
  constructor() {}
  @HostBinding('@pageAnimations')
  public animatePage = true;

  isOpen = false;
  arr = [0, 1, 2, 3, 5, 6, 7, 8];
  ngOnInit(): void {}

  addArr() {
    this.arr.push(this.arr.length + 1);
  }

  deleteArr(index) {
    this.arr.splice(index, 1);
  }
}
