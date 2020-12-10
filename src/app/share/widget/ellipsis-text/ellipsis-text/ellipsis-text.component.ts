import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewChecked,
  AfterViewInit,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { NzTooltipTrigger } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-ellipsis-text',
  templateUrl: './ellipsis-text.component.html',
  styleUrls: ['./ellipsis-text.component.scss'],
})
export class EllipsisTextComponent implements OnInit, AfterViewInit {
  @ViewChild('textTempl') textTempl: ElementRef;
  @Input() text = '';

  showTip = false;
  nzTrigger: NzTooltipTrigger = null;

  constructor(private render: Renderer2) {}

  ngOnInit(): void {}

  byteLength(value: string): number {
    let length = 0;
    for (const char of value) {
      if (char.charCodeAt(0) > 255) {
        length += 2;
      } else {
        length++;
      }
    }
    return length;
  }

  getTextWidth(value: string, font: string) {
    const canvas = this.render.createElement('canvas');
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.font = font;
    const textMetrics = ctx.measureText(value);
    console.log(textMetrics.width, 'getTextWidth');
    return textMetrics.width;
  }

  ngAfterViewInit() {
    const { width, font } = window.getComputedStyle(this.textTempl.nativeElement);
    const textWidth = this.getTextWidth(this.text, font);
    ///  https://angular.cn/guide/lifecycle-hooks#wait-a-tick
    setTimeout(() => {
      if (textWidth > parseFloat(width)) {
        this.showTip = true;
      } else {
        this.showTip = false;
      }
      console.log(this.showTip, 'showTip');
    }, 0);
  }
}
