import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateViewComponent } from './state-view/state-view.component';

@NgModule({
  declarations: [StateViewComponent],
  imports: [CommonModule],
  exports: [StateViewComponent],
})
export class StateViewModule {}
