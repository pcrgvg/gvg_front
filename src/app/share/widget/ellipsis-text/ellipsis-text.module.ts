import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EllipsisTextComponent } from './ellipsis-text/ellipsis-text.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [EllipsisTextComponent],
  imports: [CommonModule, NzToolTipModule],
  exports: [EllipsisTextComponent],
})
export class EllipsisTextModule {}
