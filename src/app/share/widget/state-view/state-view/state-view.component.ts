import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

type ViewState = 'first' | 'pending' | 'loadingMore' | 'noMore' | 'blank' | 'content' | 'error';

@Component({
  selector: 'app-state-view',
  templateUrl: './state-view.component.html',
  styles: [],
})
export class StateViewComponent implements OnInit {
  constructor() {}
  /**
   * type ViewState = 'first' | 'pending' | 'loadingMore' | 'noMore'
 | 'blank' | 'content' | 'error';
   */
  @Input() viewState: ViewState = 'first';
  @Output() onRetry = new EventEmitter<void>();
  ngOnInit(): void {}

  retry(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    this.onRetry.emit();
  }

  get first(): boolean {
    return this.viewState === 'first';
  }
  get pending() {
    return this.viewState === 'pending';
  }
  get loadingMore() {
    return this.viewState === 'loadingMore';
  }
  get blank() {
    return this.viewState === 'blank';
  }
  get content() {
    return this.viewState === 'content';
  }
  get error() {
    return this.viewState === 'error';
  }
}
