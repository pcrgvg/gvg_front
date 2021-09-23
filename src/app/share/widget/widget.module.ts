import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PcrIconModule } from './pcr-icon/pcr-icon.module';
import { EllipsisTextModule } from './ellipsis-text/ellipsis-text.module';
import {RaritySelectModule } from './rarity-select/rarity-select.module';


@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [PcrIconModule, RaritySelectModule,  EllipsisTextModule],
})
export class WidgetModule {}
