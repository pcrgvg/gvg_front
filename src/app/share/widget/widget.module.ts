import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PcrIconModule } from './pcr-icon/pcr-icon.module';
import { StateViewModule } from './state-view/state-view.module';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [PcrIconModule, StateViewModule],
})
export class WidgetModule {}
