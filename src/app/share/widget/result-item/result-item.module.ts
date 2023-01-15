import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultItemComponent } from './result-item/result-item.component';
import { PcrIconModule } from '../pcr-icon/pcr-icon.module';
import { EllipsisTextModule } from '../ellipsis-text/ellipsis-text.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { PipesModule } from '../../pipes/pipes.module';
import { ResultDetailComponent } from './result-detail/result-detail.component';
import { TaskResultComponent } from './task-result/task-result.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [ResultItemComponent, ResultDetailComponent, TaskResultComponent],
  imports: [
    CommonModule,
    PcrIconModule,
    EllipsisTextModule,
    NzToolTipModule,
    PipesModule,
    NzTabsModule,
    NzButtonModule,
  ],
  exports: [TaskResultComponent],
})
export class ResultItemModule {}
