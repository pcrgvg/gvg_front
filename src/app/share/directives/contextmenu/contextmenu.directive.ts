import { Directive, Output, EventEmitter, HostListener } from '@angular/core';
/**
 * 鼠标右键
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[rightClick]',
})
export class ContextmenuDirective {
  @Output() rightClick = new EventEmitter();
  constructor() {}

  @HostListener('contextmenu', ['$event'])
  clickEvent(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.rightClick.emit(event);
  }
}
