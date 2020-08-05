import { Directive, Output, EventEmitter, HostListener, HostBinding } from '@angular/core';

@Directive({
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
