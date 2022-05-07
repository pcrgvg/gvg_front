import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterContentInit,
  AfterViewInit,
  ElementRef,
  Renderer2,
  ContentChild,
} from '@angular/core';
import { NzTooltipTrigger } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'pcr-ellipsis-text',
  templateUrl: './ellipsis-text.component.html',
  styleUrls: ['./ellipsis-text.component.scss'],
})
export class EllipsisTextComponent implements AfterViewInit {
  @ViewChild('textTempl') textTempl: ElementRef;
  @Input() text = '';

  showTip = false;
  nzTrigger: NzTooltipTrigger = null;

  constructor(private render: Renderer2) {}

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

  getTextWidth(value: string, font: string, fontSize: string) {
    const canvas = this.render.createElement('canvas');
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    // sans-serif
    ctx.font = font ? font : `${fontSize}  Arial`;
    const textMetrics = ctx.measureText(value);
    return textMetrics.width;
  }

  ngAfterViewInit() {
    const { width, font, fontSize } = window.getComputedStyle(this.textTempl.nativeElement);

    const textWidth = this.getTextWidth(this.text, font, fontSize);
    ///  https://angular.cn/guide/lifecycle-hooks#wait-a-tick
    setTimeout(() => {
      if (textWidth > parseFloat(width)) {
        this.showTip = true;
      } else {
        this.showTip = false;
      }
    }, 0);
  }
}
