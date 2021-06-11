import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PcrIconModule } from './pcr-icon/pcr-icon.module';
import { StateViewModule } from './state-view/state-view.module';
import { LoadingButtonModule } from './loading-button/loading-button.module';
import { EllipsisTextModule } from './ellipsis-text/ellipsis-text.module';
import {RaritySelectModule } from './rarity-select/rarity-select.module';


@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [PcrIconModule, RaritySelectModule, StateViewModule, LoadingButtonModule, EllipsisTextModule],
})
export class WidgetModule {}
