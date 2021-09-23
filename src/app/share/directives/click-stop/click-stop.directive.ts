import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[clickStop]',
})
export class ClickStopDirective {
  @Output() clickStop = new EventEmitter();
  @HostListener('click', ['$event'])
  clickEvent(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.clickStop.emit(event);
  }

  constructor() {}
}
