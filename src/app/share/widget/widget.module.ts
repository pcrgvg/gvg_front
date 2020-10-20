import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PcrIconModule } from './pcr-icon/pcr-icon.module';
import { StateViewModule } from './state-view/state-view.module';
import { LoadingButtonModule } from './loading-button/loading-button.module';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [PcrIconModule, StateViewModule, LoadingButtonModule],
})
export class WidgetModule {}
